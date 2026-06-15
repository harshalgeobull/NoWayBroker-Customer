import React, { useState, useEffect, useRef } from "react";
import {
  IoCloseCircleOutline,
  IoArrowBackCircleOutline,
} from "react-icons/io5";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login1 from "./Login1";

const OtpVerification_Login = ({
  mobileNumber,
  countryCode,
  onClose,
  onSwitchToLogIn,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isError, setIsError] = useState(false);
  const inputRefs = useRef([]);
  const history = useHistory();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleResendOtp = async () => {
    setTimer(30);
    setOtp(["", "", "", ""]);
    setIsError(false);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/generate-login-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile_number: mobileNumber,
            country_code: countryCode,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.status === 1) {
        toast.success("New OTP sent successfully!");
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      toast.error("Something went wrong while resending OTP.");
    }
  };

  const handleVerify = async () => {
    setIsSubmitting(true);
    try {
      const enteredOtp = otp.join("");

      const loginResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/user_login`,
        {
          country_code: countryCode,
          mobile_number: mobileNumber,
          otp: enteredOtp,
        },
      );

      if (loginResponse.status === 200 && loginResponse.data.status === 1) {
        const user = loginResponse.data.user;

        sessionStorage.setItem("accessToken", user?._id || "N/A");
        sessionStorage.setItem("Country_code", user.country_code || "N/A");
        sessionStorage.setItem("Mobile_Number", user.mobile_number || "N/A");
        sessionStorage.setItem("user_type", user.user_type || "N/A");
        sessionStorage.setItem("user_name", user.full_name || "N/A");
        sessionStorage.setItem("user_email", user.email || "N/A");

        onClose();
        setShowOverlay(true);

        setTimeout(() => {
          window.location.reload();
        });

        toast.success("Login successful!");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message;

      if (
        errorMsg === "Mobile number is not verified. Please verify OTP first."
      ) {
        onClose();
        toast.error("You need to verify OTP first. Verify now...");
        history.push("/signup1");
      } else {
        toast.error(errorMsg || "Something went wrong during login.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow =
      showLoginModal || onSwitchToLogIn ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLoginModal, onSwitchToLogIn]);

  return (
    <>
      {showOverlay && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {showLoginModal && (
        <Login1
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 w-full max-w-md">
          <div className="flex justify-between items-center">
            {/* Back Arrow — Left */}
            <button
              onClick={onSwitchToLogIn}
              className="text-black hover:text-black"
            >
              <IoArrowBackCircleOutline size={20} />
            </button>
            {/* Close — Right */}
            <button onClick={onClose} className="text-black hover:text-black">
              <IoCloseCircleOutline size={20} />
            </button>
          </div>

          <h2 className="text-center text-2xl font-semibold text-gray-900 mb-2">
            Verify your mobile number
          </h2>

          <p className="text-center text-gray-700 mb-4 text-xs whitespace-nowrap">
            We have sent OTP to your mobile number{" "}
            <span className="font-semibold">{mobileNumber}</span>{" "}
            <span
              className="my-text font-normal cursor-pointer hover:underline"
              onClick={onSwitchToLogIn}
            >
              Edit Mobile No.
            </span>
          </p>

          <div className="flex justify-center space-x-3 mb-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(index, e.target.value)}
                className={`w-12 h-12 text-center text-lg font-semibold border ${
                  isError ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:border-rose-600`}
              />
            ))}
          </div>

          {isError && (
            <p className="text-center text-red-500 text-sm mb-4">
              Oops! Seems Like You've Entered a Wrong OTP.
            </p>
          )}

          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <button
              onClick={handleResendOtp}
              className={`${timer > 0 ? "text-gray-400 cursor-not-allowed" : "my-text hover:underline"}`}
              disabled={timer > 0}
            >
              Resend OTP
            </button>
            <span>{timer} Sec</span>
          </div>

          <button
            onClick={handleVerify}
            className={`w-full py-3 rounded-lg text-lg font-medium transition ${
              isSubmitting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "my-bg text-white hover:my-bg"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loggin..." : "Verify"}
          </button>
        </div>
      </div>
    </>
  );
};

export default OtpVerification_Login;
