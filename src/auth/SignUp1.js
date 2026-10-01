import React, { useState, useEffect } from "react";
import {
  IoCloseCircleOutline,
  IoArrowBackCircleOutline,
} from "react-icons/io5";
import OtpVerification from "./OtpVerification";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import Login1 from "../auth/Login1";
import { IoAlertCircleOutline } from "react-icons/io5";
import {
  NAME_MIN,
  NAME_MAX,
  CITY_MIN,
  CITY_MAX,
  COMPANY_MAX,
  sanitizeCompanyInput,
  validateCompanyName,
  EMAIL_MAX,
  cleanSpaces,
  sanitizeNameInput,
  sanitizeCityInput,
  LETTERS_ONLY_REGEX,
  isValidEmail,
  getMobileRule,
  validateMobile,
  EMAIL_EXISTS_MSG,
  friendlyServerMessage,
} from "../utils/Signupvalidation";

const SignUp1 = ({ onClose, isOpen, defaultMobile }) => {
  const [userType, setUserType] = useState("Owner");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState(defaultMobile || "");
  const [countryCode, setCountryCode] = useState("+91");
  const [agreed, setAgreed] = useState(false);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState(sessionStorage.getItem("cityName") || "");
  const [companyName, setCompanyName] = useState("");

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const history = useHistory();
  // Inside your component
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    companyName: "",
  });

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showOtpModal || showLoginModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showOtpModal, showLoginModal]);

  if (!isOpen) return null;

  // Shows duplicate email / mobile messages under the right field,
  // anything else as a toast. Returns nothing.
  const showServerError = (rawMessage, baseErrors) => {
    const message = friendlyServerMessage(rawMessage);
    if (message === EMAIL_EXISTS_MSG) {
      setErrors({ ...baseErrors, email: EMAIL_EXISTS_MSG });
    } else if (/mobile number already registered/i.test(rawMessage || "")) {
      setErrors({ ...baseErrors, mobile: "Mobile number already registered." });
    } else {
      toast.error(message || "Something went wrong.");
    }
  };

  const handleSignUp = async () => {
    let hasError = false;
    const newErrors = {
      name: "",
      mobile: "",
      email: "",
      city: "",
      companyName: "",
    };

    // Trim leading/trailing spaces and collapse repeated spaces BEFORE validating / sending
    const cleanName = cleanSpaces(name);
    const cleanCity = cleanSpaces(city);
    const cleanEmail = email.trim();
    const cleanCompany = cleanSpaces(companyName);
    const cleanMobile = mobile.trim();

    // FULL NAME
    if (!cleanName) {
      newErrors.name = "Name is required";
      hasError = true;
    } else if (!LETTERS_ONLY_REGEX.test(cleanName)) {
      newErrors.name = "Name can contain letters only";
      hasError = true;
    } else if (cleanName.length < NAME_MIN) {
      newErrors.name = `Name must be at least ${NAME_MIN} characters`;
      hasError = true;
    } else if (cleanName.length > NAME_MAX) {
      newErrors.name = `Name cannot exceed ${NAME_MAX} characters`;
      hasError = true;
    }

    // MOBILE (rules depend on the selected country)
    if (!cleanMobile) {
      newErrors.mobile = "Mobile number is required";
      hasError = true;
    } else {
      const mobileError = validateMobile(countryCode, cleanMobile);
      if (mobileError) {
        newErrors.mobile = mobileError;
        hasError = true;
      }
    }

    // EMAIL VALIDATION
    if (!cleanEmail) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!isValidEmail(cleanEmail)) {
      newErrors.email = "Enter a valid email address (e.g. name@example.com)";
      hasError = true;
    }

    // CITY VALIDATION
    if (!cleanCity) {
      newErrors.city = "City is required";
      hasError = true;
    } else if (!LETTERS_ONLY_REGEX.test(cleanCity)) {
      newErrors.city = "City can contain letters only";
      hasError = true;
    } else if (cleanCity.length < CITY_MIN || cleanCity.length > CITY_MAX) {
      newErrors.city = `City must be ${CITY_MIN} to ${CITY_MAX} characters`;
      hasError = true;
    }

    if (userType === "Builder/Developer") {
      const companyError = validateCompanyName(cleanCompany);
      if (companyError) {
        newErrors.companyName = companyError;
        hasError = true;
      }
    }

    if (!agreed) {
      toast.error("You must agree to terms & conditions");
      return;
    }

    setErrors(newErrors);

    if (hasError) return;

    // show the cleaned values in the form and pass them on to the OTP step
    setName(cleanName);
    setCity(cleanCity);
    setEmail(cleanEmail);
    setCompanyName(cleanCompany);

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/generate-otp`,
        {
          mobile_number: cleanMobile,
          country_code: countryCode,
          email: cleanEmail,
          city: cleanCity,
        },
      );

      const data = response.data;

      if (data.status === 1) {
        toast.success("OTP sent successfully!");
        setShowOtpModal(true);
      } else {
        showServerError(data.message, newErrors);
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        showServerError(serverMessage, newErrors);
      } else {
        toast.error("Error generating OTP. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPrivacyPolicy = () => {
    history.push("/privacy-policy");
    onClose();
  };

  const goToTermsAndConditions = () => {
    history.push("/terms-conditions");
    onClose();
  };

  return (
    <>
      {showOtpModal ? (
        <OtpVerification
          mobileNumber={mobile}
          countryCode={countryCode}
          fullName={name}
          companyName={companyName}
          userType={userType}
          email={email}
          city={city}
          onClose={onClose}
          onSwitchToSignUp={() => setShowOtpModal(false)}
        />
      ) : showLoginModal ? (
        <Login1 onClose={onClose} isOpen={true} defaultMobile={mobile} />
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-4 bg-white shadow-lg rounded-2xl md:p-8">
            <div className="flex items-center justify-between">
              {/* Back Arrow */}
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-black hover:text-black"
              >
                <IoArrowBackCircleOutline size={20} />
              </button>

              {/* Close Icon */}
              <button onClick={onClose} className="text-black hover:text-black">
                <IoCloseCircleOutline size={20} />
              </button>
            </div>

            <h2 className="mb-4 text-2xl font-semibold text-center text-gray-900">
              Sign Up
            </h2>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Your Account Type <span className="text-xl font-bold text-red-500">*</span>
            </label>
            <div className="flex mb-4 space-x-4">
              {["Buyer/Tenant/Owner", "Builder/Developer"].map((type, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="userType"
                    value={type === "Buyer/Tenant/Owner" ? "Owner" : type}
                    checked={
                      userType === (type === "Buyer/Tenant/Owner" ? "Owner" : type)
                    }
                    onChange={() => {
                      const newType = type === "Buyer/Tenant/Owner" ? "Owner" : type;
                      if (newType !== userType) {
                        // NWB-BUG-023: start the other account form fresh
                        setUserType(newType);
                        setName("");
                        setCompanyName("");
                        setErrors({
                          name: "",
                          mobile: "",
                          email: "",
                          city: "",
                          companyName: "",
                        });
                      }
                    }}
                    className="accent-rose-600"
                  />
                  <span className="text-gray-700">{type}</span>
                </label>
              ))}
            </div>

            {/* Name */}
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Full Name <span className="text-xl font-bold text-red-500">*</span>
            </label>
            <div className="mb-1">
              <input
                type="text"
                placeholder="Name"
                value={name}
                maxLength={NAME_MAX}
                onChange={(e) => {
                  // letters + single spaces only, no leading space
                  setName(sanitizeNameInput(e.target.value));
                  setErrors({ ...errors, name: "" });
                }}
                className={`w-full p-3 border rounded-lg text-gray-700 bg-white focus:outline-none ${errors.name ? "border-red-500" : "border-gray-300"
                  }`}
              />
            </div>
            {errors.name && (
              <p className="flex items-center gap-1 mb-3 text-sm text-red-500">
                <IoAlertCircleOutline size={16} className="text-red-500" />
                {errors.name}
              </p>
            )}
            {userType === "Builder/Developer" && (
              <>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Company Name{" "}
                  <span className="text-xl font-bold text-red-500">*</span>
                </label>

                <div className="mb-1">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    maxLength={COMPANY_MAX}
                    onChange={(e) => {
                      // no leading spaces, no unsupported symbols, max length
                      setCompanyName(sanitizeCompanyInput(e.target.value));
                      setErrors({
                        ...errors,
                        companyName: "",
                      });
                    }}
                    className={`w-full p-3 border rounded-lg text-gray-700 bg-white focus:outline-none ${errors.companyName ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                </div>

                {errors.companyName && (
                  <p className="flex items-center gap-1 mb-3 text-sm text-red-500">
                    <IoAlertCircleOutline size={16} />
                    {errors.companyName}
                  </p>
                )}
              </>
            )}

            {/* Email & City Row */}
            <div className="grid grid-cols-1 gap-3 mb-3 md:grid-cols-2">
              {/* Email */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email Address{" "}
                  <span className="text-xl font-bold text-red-500">*</span>
                </label>

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  maxLength={EMAIL_MAX}
                  onChange={(e) => {
                    // emails never contain spaces
                    setEmail(e.target.value.replace(/\s/g, ""));
                    setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full p-3 border rounded-lg text-gray-700 bg-white focus:outline-none ${errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                />

                {errors.email && (
                  <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                    <IoAlertCircleOutline size={16} className="text-red-500" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  City <span className="text-xl font-bold text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  maxLength={CITY_MAX}
                  onChange={(e) => {
                    // letters + single spaces only (no numbers / special characters)
                    setCity(sanitizeCityInput(e.target.value));
                    setErrors({ ...errors, city: "" });
                  }}
                  className={`w-full p-3 border rounded-lg text-gray-700 bg-white focus:outline-none ${errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  // readOnly={!!sessionStorage.getItem("cityName")}
                />

                {errors.city && (
                  <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                    <IoAlertCircleOutline size={16} className="text-red-500" />
                    {errors.city}
                  </p>
                )}
              </div>
            </div>
            {/* Mobile Number */}
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Mobile Number{" "}
              <span className="text-xl font-bold text-red-500">*</span>
            </label>
            <>
              <div className="flex gap-2">
                <select
                  className="w-1/3 p-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none"
                  value={countryCode}
                  onChange={(e) => {
                    const newCode = e.target.value;
                    setCountryCode(newCode);
                    // keep only as many digits as the new country allows and clear the old error
                    setMobile((prev) => prev.slice(0, getMobileRule(newCode).maxLength));
                    setErrors({ ...errors, mobile: "" });
                  }}
                >
                  <option value="+91">IN +91</option>
                  <option value="+1">US +1</option>
                  <option value="+44">UK +44</option>
                  <option value="+61">AU +61</option>
                  <option value="+81">JP +81</option>
                  <option value="+49">DE +49</option>
                  <option value="+971">AE +971</option>
                  <option value="+7">RU +7</option>
                  <option value="+27">ZA +27</option>
                </select>

                <div className="w-2/3">
                  <input
                    type="text"
                    placeholder={
                      getMobileRule(countryCode).example
                        ? `e.g. ${getMobileRule(countryCode).example}`
                        : "Mobile Number"
                    }
                    value={mobile}
                    maxLength={getMobileRule(countryCode).maxLength}
                    onChange={(e) => {
                      const value = e.target.value;
                      // digits only, max length depends on the selected country
                      const { maxLength } = getMobileRule(countryCode);
                      if (/^\d*$/.test(value) && value.length <= maxLength) {
                        setMobile(value);
                        setErrors({ ...errors, mobile: "" });
                      }
                    }}
                    className={`w-full p-3 border rounded-lg text-gray-700 bg-white focus:outline-none ${errors.mobile ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                </div>
              </div>
              {errors.mobile && (
                <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                  <IoAlertCircleOutline size={16} className="text-red-500" />
                  {errors.mobile}
                </p>
              )}
            </>

            <label className="flex items-center mb-4 space-x-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="accent-rose-600"
              />
              <span>
                <span className="mr-1 text-xl font-bold text-red-500">*</span>I
                agree to NowayBroker{" "}
                <span
                  onClick={goToTermsAndConditions}
                  className="mr-2 font-medium my-text cursor-pointer hover:underline"
                >
                  T&C
                </span>
                <span className="mr-2 font-medium text-gray-600 cursor-pointer ">
                  and
                </span>
                <span
                  onClick={goToPrivacyPolicy}
                  className="font-medium my-text cursor-pointer hover:underline"
                >
                  Privacy Policy
                </span>
              </span>
            </label>

            <button
              onClick={handleSignUp}
              className={`w-full py-3 rounded-lg text-lg font-medium transition ${!agreed
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "my-bg text-white hover:my-bg"
                }`}
              disabled={!agreed}
            >
              {isSubmitting ? "Sending OTP..." : "Sign Up"}
            </button>

            <p className="mt-4 text-sm text-center text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => setShowLoginModal(true)}
                className="font-semibold my-text hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp1;