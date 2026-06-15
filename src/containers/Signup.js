import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { signup } from "../store/actions/auth";
import setAlert from "../store/actions/alert";
import axios from "axios";
import { FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa";

let globalPassword = "";

const Signup = ({ setAlert, isAuthenticated, signup, location }) => {
  const history = useHistory();
  const randomNumber = Math.floor(Math.random() * 9999) + 1;
  const initialFormData = location.state || {
    full_name: "",
    email: "",
    mobile_number: "",
    password: "",
    confirm_password: "",
    profile_image: "",
    otp: "",
    property_owner_type: "",
    country_code: "IN-91",
    city: "",
    username: "",
    dynamic_pricing: "OFF",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  const {
    email,
    full_name,
    mobile_number,
    password,
    confirm_password,
    otp,
    country_code,
    profile_image,
    property_owner_type,
    city,
  } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      // Update the global password variable
      globalPassword = value;
    }

    if (name === "mobile_number") {
      // Allow only numbers
      if (!/^\d*$/.test(value)) {
        return;
      }

      if (value.length > 10) {
        showAlert("Mobile number cannot exceed 10 digits.", "danger");
        return;
      }
    }

    if (name === "full_name") {
      // Validate that full name does not contain numbers
      const nameRegex = /^[A-Za-z\s]+$/; // Allows only letters and spaces

      if (!nameRegex.test(value)) {
        return;
      }
    }

    if (name === "city") {
      // Validate that city does not contain numbers
      const cityRegex = /^[A-Za-z\s]+$/; // Allows only letters and spaces

      if (!cityRegex.test(value)) {
        return;
      }
    }


    setFormData({
      ...formData,
      [name]: name === "profile_image" ? e.target.files[0] : value,
    });
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);

    // setTimeout(() => {
    //   setAlertMessage(null); // Clear alert after 5 seconds
    // }, 3000);
  };

  const sendOTP = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/generate-otp`,
        {
          country_code,
          mobile_number,
          email,
        }
      );

      if (res.data.status === 1 && res.data.otp) {
        setOtpSent(true); // OTP was sent successfully
        showAlert("OTP sent successfully!", "success");
      } else {
        showAlert(
          res.data.message || "An error occurred during OTP generation.",
          "danger"
        );
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to send OTP. Please try again later.";
      showAlert(errorMessage, "danger");
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/verify-otp`,
        {
          country_code,
          mobile_number,
          otp,
        }
      );

      if (res.data.status === 1) {
        setIsVerified(true);
        showAlert("OTP verified successfully!", "success");

        // Proceed to register and login
        await registerAndLogin();
      } else {
        showAlert("Invalid OTP. Please try again.", "danger");
      }
    } catch (error) {
      showAlert("Failed to verify OTP. Please try again later.", "danger");
    }
  };

  const fetchSetting = async (userId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/cust_api/get_setting`
      );
      if (
        response.data &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        const settingsData = response.data.data[0];
        const freeViewCount = settingsData.free_view_count;
        const freePostCount = settingsData.free_post_count;

        await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/add_count`,
          {
            user_id: userId,
            free_view_count: Number(freeViewCount),
            free_post_count: Number(freePostCount),
          }
        );
        // console.log("Successfully updated free view and post counts.");
      } else {
        // console.log("No settings data found in response.");
      }
    } catch (err) {
      // console.error("Error fetching settings data:", err);
    }
  };

  const registerAndLogin = async () => {
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("full_name", full_name);
      formDataToSubmit.append("email", email);
      formDataToSubmit.append("mobile_number", `${mobile_number}`);
      formDataToSubmit.append("password", password);
      formDataToSubmit.append("confirm_password", confirm_password);
      formDataToSubmit.append("property_owner_type", property_owner_type);
      formDataToSubmit.append("profile_image", profile_image);
      formDataToSubmit.append("city", city);
      formDataToSubmit.append("username", full_name.toLowerCase().replace(/\s+/g, "") + randomNumber);
      formDataToSubmit.append("dynamic_pricing", "OFF");
      formDataToSubmit.append("token", otp);
      formDataToSubmit.append("status", "Active");

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/register_user`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status === 1) {
        const userId = res.data.data._id; // Extract user ID
        await fetchSetting(userId);
        showAlert("Signup successful! Logging you in...", "success");

        // Extract user details and login
        const loginRes = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/user_login`,
          { email: email, password: password }
        );

        if (loginRes.data && loginRes.data.user) {
          const {
            _id,
            token,
            full_name,
            mobile_number,
            email,
            property_owner_type,
          } = loginRes.data.user;

          // Save login data to session storage
          sessionStorage.setItem("AccessToken", _id);
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("connect_to_name", full_name);
          sessionStorage.setItem("connect_to_no", mobile_number);
          sessionStorage.setItem("connect_to_email", email);
          sessionStorage.setItem("property_owner_type", property_owner_type);

          // Fetch user profile after successful login
          await fetchUserProfile(_id);

          // Redirect after successful login
          setTimeout(() => {
            history.push("/");
          }, 1000);
        } else {
          showAlert(
            "Login failed after signup. Please log in manually.",
            "danger"
          );
        }
      } else {
        showAlert(res.data.message || "An error occurred during signup.", "danger");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Signup failed. Please try again later.";
      showAlert(errorMessage, "danger");
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const profileResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
        { user_id: userId }
      );

      const {
        free_view_count,
        free_post_count,
        paid_view_count,
        paid_post_count,
        feature_count,
        offer_count,
        upcoming_project_count,
      } = profileResponse.data.count_data;

      // Store counts in session storage
      sessionStorage.setItem("free_view_count", free_view_count);
      sessionStorage.setItem("free_post_count", free_post_count);
      sessionStorage.setItem("paid_view_count", paid_view_count);
      sessionStorage.setItem("paid_post_count", paid_post_count);
      sessionStorage.setItem("feature_count", feature_count);
      sessionStorage.setItem("offer_count", offer_count);
      sessionStorage.setItem("upcoming_project_count", upcoming_project_count);
    } catch (error) {
      showAlert("Failed to fetch user profile.", "danger");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const {
      full_name,
      email,
      mobile_number,
      city,
      password,
      confirm_password,
      property_owner_type,
    } = formData;

    // Validate inputs
    if (!full_name || full_name.trim() === "") {
      showAlert("Full Name is required.", "danger");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Please enter a valid email address.", "danger");
      return;
    }

    if (!/^\d{10}$/.test(mobile_number)) {
      showAlert("Mobile number must be 10 digits and numeric only.", "danger");
      return;
    }

    if (!city || city.trim() === "") {
      showAlert("City Name is required.", "danger");
      return;
    }

    if (password.length < 6) {
      showAlert("Password must be at least 6 characters long.", "danger");
      return;
    }

    if (password !== confirm_password) {
      showAlert("Passwords and confirm password are not same.", "danger");
      return;
    }

    if (!property_owner_type || property_owner_type === "") {
      showAlert("Please select a Property Owner Type.", "danger");
      return;
    }

    // Handle OTP verification and registration
    if (!otpSent) {
      sendOTP();
    } else {
      await verifyOTP();
    }
  };


  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-2">
      <Helmet>
        <title>Real Estate - Signup</title>
        <meta name="description" content="Sign up page" />
      </Helmet>
      <div className="max-w-xl w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Create Your Account
        </h1>

        {/* Alert Messages */}
        {alertMessage && (
          <div
            className={`max-w-lg fixed top-14 w-full p-2 text-white rounded flex justify-between items-center ${alertType === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            style={{ zIndex: 1000 }}
          >
            <strong className="text-center">{alertMessage}</strong>
            <button
              onClick={() => setAlertMessage(null)}
              className="text-white bg-transparent hover:bg-white hover:text-black rounded-full p-2 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {!otpSent && (
            <>
              <div className="md:flex md:space-x-4">
                <div className="md:w-1/2">
                  <label htmlFor="full_name" className="block font-bold">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="full_name"
                    id="full_name"
                    value={full_name}
                    onChange={onChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:w-1/2">
                  <label htmlFor="email" className="block font-bold">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    id="email"
                    value={email}
                    onChange={onChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="md:flex md:space-x-4">
                <div className="md:w-1/2">
                  <label htmlFor="mobile_number" className="block font-bold">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    name="mobile_number"
                    id="mobile_number"
                    value={mobile_number}
                    onChange={onChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:w-1/2">
                  <label htmlFor="city" className="block font-bold">
                    City Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="City Name"
                    name="city"
                    id="city"
                    value={city}
                    onChange={onChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="md:flex md:space-x-4">
                <div className="md:w-1/2">
                  <label htmlFor="password" className="block font-bold">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    id="password"
                    value={password}
                    minLength="6"
                    onChange={onChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:w-1/2">
                  <label htmlFor="confirm_password" className="block font-bold">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirm_password"
                    id="confirm_password"
                    value={confirm_password}
                    minLength="6"
                    onChange={onChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="md:flex md:space-x-4">

                <div>
                  <label
                    htmlFor="property_owner_type"
                    className="block font-bold"
                  >
                    Property Owner Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="property_owner_type"
                    id="property_owner_type"
                    value={property_owner_type}
                    onChange={onChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select Property Owner Type</option>
                    <option value="Owner">Owner</option>
                    <option value="Dealer">Dealer</option>
                    <option value="Developer">Developer</option>
                    <option value="Customer">Customer</option>
                    <option value="Cp">Cp</option>
                    <option value="Broker">Broker</option>
                  </select>
                </div>

                <div className="md:w-1/2">
                  <label htmlFor="profile_image" className="block font-bold">
                    Profile Image <span className="text-black">(optional)</span>
                  </label>
                  <input
                    type="file"
                    name="profile_image"
                    id="profile_image"
                    onChange={onChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </>
          )}
          {otpSent && !isVerified && (

            <div>
              <div>
                <label htmlFor="mobile_number" className="block font-bold">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  name="mobile_number"
                  id="mobile_number"
                  value={mobile_number}
                  onChange={onChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="otp" className="block font-bold">
                  Enter OTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  name="otp"
                  id="otp"
                  value={otp}
                  onChange={onChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="w-full text-center justify-center align-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg"
            >
              {!otpSent ? "Send OTP" : "Verify OTP"}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-600 font-bold"
          >
            Log In
          </Link>
        </div>
      </div>
    </div >
  );
};

Signup.propTypes = {
  setAlert: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { signup, setAlert })(Signup);
