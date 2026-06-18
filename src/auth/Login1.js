import React, { useState, useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom";
import OtpVerification_Login from "./OtpVerification_Login";
import SignUp1 from "../auth/SignUp1";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoAlertCircleOutline } from "react-icons/io5";

const Login1 = ({ onClose, isOpen, defaultMobile }) => {
  const [mobile, setMobile] = useState(defaultMobile || "");
  const [countryCode, setCountryCode] = useState("+91");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const history = useHistory();
  // Inside your component
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    mobile: "",
  });

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showOtpModal || showSignUpModal || isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showOtpModal, showSignUpModal, isOpen]);

  const resetForm = () => {
    setMobile(defaultMobile || "");
    setCountryCode("+91");
    setShowOtpModal(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async () => {
    let hasError = false;
    const newErrors = { mobile: "" };

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      hasError = true;
    } else if (mobile.trim().length < 10) {
      newErrors.mobile = "Mobile number must be at least 10 digits";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/generate-login-otp`,
        {
          mobile_number: mobile,
          country_code: countryCode,
        },
      );

      const data = response.data;

      if (data.status === 1) {
        toast.success("OTP sent successfully!");
        setShowOtpModal(true);
      } else {
        toast.error("User not found. Please Sign Up First");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.error("Login OTP Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // how SignUp modal
  if (showSignUpModal) {
    return (
      <SignUp1
        isOpen={true}
        onClose={() => {
          setShowSignUpModal(false);
          onClose();
        }}
        onSwitchToLogin={() => setShowSignUpModal(false)}
        defaultMobile={mobile}
      />
    );
  }

  return (
    <>
      {showOtpModal ? (
        <OtpVerification_Login
          mobileNumber={mobile}
          countryCode={countryCode}
          fullName={""}
          userType={"customer"}
          onClose={() => {
            setShowOtpModal(false);
            onClose();
          }}
          onSwitchToLogIn={() => setShowOtpModal(false)}
        />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 w-full max-w-sm">
            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="text-black hover:text-black"
              >
                <IoCloseCircleOutline size={20} />
              </button>
            </div>

            {/* Login Title */}
            <h2 className="text-center text-2xl font-semibold text-gray-900 mb-4">
              Login
            </h2>

            {/* Mobile Input with Country Code */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number{" "}
              <span className="text-red-500 text-xl font-bold">*</span>
            </label>
            <>
              <div className="flex gap-2 mb-1">
                <div className="w-1/3">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none"
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
                </div>
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
                  className={`w-full p-3 pr-10 border rounded-lg text-gray-700 bg-white focus:outline-none ${errors.mobile ? "border-red-500" : "border-gray-300"
                    }`}
                />
              </div>
              {errors.mobile && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <IoAlertCircleOutline size={16} className="text-red-500" />
                  {errors.mobile}
                </p>
              )}
            </>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className={`w-full py-3 mt-3 rounded-lg text-lg font-medium transition ${isSubmitting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "my-bg text-white hover:my-bg"
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending OTP..." : "Login"}
            </button>

            {/* Signup Link */}
            <p className="text-center text-gray-500 text-sm mt-4">
              Don't have an account?{" "}
              <button
                onClick={() => setShowSignUpModal(true)}
                className="my-text font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login1;
