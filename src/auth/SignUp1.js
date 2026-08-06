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

  const handleSignUp = async () => {
    let hasError = false;
    const newErrors = {
      name: "",
      mobile: "",
      email: "",
      city: "",
      companyName: "",
    };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    }

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      hasError = true;
    } else if (mobile.trim().length < 10) {
      newErrors.mobile = "Mobile number must be at least 10 digits";
      hasError = true;
    }

    // EMAIL VALIDATION
    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter valid email";
      hasError = true;
    }

    // CITY VALIDATION
    if (!city.trim()) {
      newErrors.city = "City is required";
      hasError = true;
    }

    if (userType === "Builder/Developer" && !companyName.trim()) {
      newErrors.companyName = "Company Name is required";
      hasError = true;
    }

    if (!agreed) {
      toast.error("You must agree to terms & conditions");
      return;
    }

    setErrors(newErrors);

    if (hasError) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/generate-otp`,
        {
          mobile_number: mobile,
          country_code: countryCode,
          email: email,
          city: city,
        },
      );

      const data = response.data;

      if (data.status === 1) {
        toast.success("OTP sent successfully!");
        setShowOtpModal(true);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Mobile number already registered."
      ) {
        setErrors({
          ...newErrors,
          mobile: "Mobile number already registered.",
        });
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
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
              I am <span className="text-xl font-bold text-red-500">*</span>
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
                    onChange={() =>
                      setUserType(type === "Buyer/Tenant/Owner" ? "Owner" : type)
                    }
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
                onChange={(e) => {
                  const input = e.target.value;
                  const alphabetOnly = input.replace(/[^a-zA-Z\s]/g, "");
                  setName(alphabetOnly);
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
                    onChange={(e) => {
                      setCompanyName(e.target.value);
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
                  onChange={(e) => {
                    setEmail(e.target.value);
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
                  onChange={(e) => {
                    setCity(e.target.value);
                    setErrors({ ...errors, city: "" });
                  }}
                  className={`w-full p-3 border rounded-lg text-gray-700 bg-white focus:outline-none ${errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  readOnly={!!sessionStorage.getItem("cityName")}
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
                  onChange={(e) => setCountryCode(e.target.value)}
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
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,10}$/.test(value)) {
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
                agree to NoWayBroker{" "}
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

