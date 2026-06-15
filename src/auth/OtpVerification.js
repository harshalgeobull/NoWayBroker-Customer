import React, { useState, useEffect, useRef } from "react";
import {
  IoCloseCircleOutline,
  IoArrowBackCircleOutline,
} from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import SignUp1 from "../auth/SignUp1";

const OtpVerification = ({
  mobileNumber,
  countryCode,
  fullName,
  userType,
  email,
  city,
  onClose,
  onSwitchToSignUp,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isError, setIsError] = useState(false);
  const inputRefs = useRef([]);
  const history = useHistory();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  // Inside your component
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        `${process.env.REACT_APP_API_URL}/cust_api/generate-otp`,
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
      /* ---------- 1 Verify OTP ---------- */

      const enteredOtp = otp.join("").trim();
      if (!enteredOtp) {
        toast.error("Please enter the OTP.");
        return;
      }

      const { data: verifyData } = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/verify-otp`,
        {
          country_code: countryCode,
          mobile_number: mobileNumber,
          otp: enteredOtp,
        },
      );

      if (verifyData?.status !== 1) {
        toast.error(verifyData?.message || "OTP verification failed.");
        return;
      }

      /* ---------- 2 Register user ---------- */
      const { data: registerData } = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/register_user`,
        {
          full_name: fullName,
          country_code: countryCode,
          mobile_number: mobileNumber,
          user_type: userType,
          email: email,
          city: city,
        },
      );

      if (registerData?.status !== 1) {
        toast.error(registerData?.message || "Registration failed.");
        return;
      }

      const user = registerData.data;

      // Safely get userId depending on response shape
      const userId = user?._id || user?.user?._id;
      console.log("User ID: ", userId);

      // Store basic user info
      sessionStorage.setItem("accessToken", user?._id ?? "");
      sessionStorage.setItem("User_Type", user?.user_type ?? "");
      sessionStorage.setItem("Country_code", user?.country_code ?? "");
      sessionStorage.setItem("Mobile_Number", user?.mobile_number ?? "");
      sessionStorage.setItem("user_name", user?.full_name ?? "");
      sessionStorage.setItem("user_email", user?.email ?? email ?? "");
      sessionStorage.setItem("city", user?.city ?? city ?? "");

      /* ---------- 3 Fetch Global Settings ---------- */
      let freeViewCount = "0";
      let freePostCount = "0";

      try {
        const { data: settingsData } = await axios.get(
          `${process.env.REACT_APP_API_URL}/cust_api/get_setting`,
        );

        if (
          settingsData?.status === 1 &&
          Array.isArray(settingsData.data) &&
          settingsData.data.length
        ) {
          const setting = settingsData.data[0];
          freeViewCount = setting?.free_view_count ?? "0";
          freePostCount = setting?.free_post_count ?? "0";
        } else {
          toast.warning("Invalid settings received.");
        }
      } catch (settingsErr) {
        console.error("Failed to fetch settings:", settingsErr);
        toast.warning("Could not fetch free-view / free-post limits.");
      }

      /* ---------- 4 Add Count ---------- */

      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("free_view_count", freeViewCount);
      formData.append("free_post_count", freePostCount);

      const { data: addCountData } = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_count`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      /* ----------  Done ---------- */
      setTimeout(() => {
        window.location.reload();
      });

      toast.success("Registration successful!");

      // fetchHomeData();
    } catch (err) {
      console.error(err);
      onClose();
      toast.error(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showSignUpModal && (
        <SignUp1
          isOpen={showSignUpModal}
          onClose={() => setShowSignUpModal(false)}
        />
      )}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 w-full max-w-md">
          <div className="flex justify-between items-center">
            {/* Back Arrow — Left */}
            <button
              onClick={onSwitchToSignUp}
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
              onClick={onSwitchToSignUp}
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
              className={`${
                timer > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "my-text hover:underline"
              }`}
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
            {isSubmitting ? "SignUp..." : "Verify"}
          </button>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
