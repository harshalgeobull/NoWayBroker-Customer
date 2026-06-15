import { useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useHistory } from "react-router-dom"; // Use useHistory for React Router v5
import React from "react";

const ChangePassword = () => {
  const [oldPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState(sessionStorage.getItem("AccessToken")); // Fetch user ID from session storage
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // Track success state
  const history = useHistory(); // Initialize useHistory

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message before submitting
    setIsSuccess(false); // Reset success state before submitting

    // Client-side validation for password match
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    const requestData = {
      user_id: userId,
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    console.log("Request data:", requestData); // Check the data

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/change_password`,
        requestData,
      );
      console.log("Response data:", res.data); // Log response data

      if (res.data && res.data.status === 1) {
        setMessage("Password changed successfully.");
        setIsSuccess(true); // Set success state
        // Optional: Redirect to login or another page after successful password change
        // history.push("/login");
      } else {
        setMessage(res.data.message || "Failed to change password.");
        setIsSuccess(false); // Set success state to false
      }
    } catch (error) {
      console.log("Full Error response:", error); // Log the full error

      if (error.response) {
        console.log("Error status:", error.response.status); // Log HTTP status code
        console.log("Error data:", error.response.data); // Log error data from the API

        if (error.response.data.message === "Old password is incorrect.") {
          setMessage("The old password is incorrect. Please try again.");
        } else {
          setMessage(
            error.response.data.message || "Failed to change password.",
          );
        }
        setIsSuccess(false); // Set success state to false
      } else if (error.request) {
        console.log("Error request:", error.request); // If there's no response but a request was made
        setMessage("No response from server. Please try again later.");
        setIsSuccess(false); // Set success state to false
      } else {
        console.log("Error:", error.message); // Any other error
        setMessage("An error occurred. Please try again.");
        setIsSuccess(false); // Set success state to false
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Change Password</title>
        <meta name="description" content="Change your password" />
      </Helmet>
      <div className="min-h-screen py-10 bg-gray-100">
        <div className="max-w-md mx-auto px-6 py-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Change Password
          </h1>
          {message && (
            <div
              className={`mb-4 text-center ${isSuccess ? "text-green-600" : "text-red-600"}`}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="old-password"
                className="block text-lg font-medium text-gray-600 mb-2"
              >
                Current Password
              </label>
              <input
                type="password"
                id="old-password"
                value={oldPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="new-password"
                className="block text-lg font-medium text-gray-600 mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block text-lg font-medium text-gray-600 mb-2"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-rose-400 text-white font-semibold rounded-lg shadow-md hover:from-rose-500 hover:to-rose-300 transition-colors duration-200"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
