import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../store/actions/auth";
import axios from "axios";

const Login = ({ login, isAuthenticated }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState(null);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending request to API:", { email, password });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/user_login`,
        { email, password }
      );

      // console.log("Response:", res.data);

      if (res.data && res.data.user) {
        const {
          _id,
          token,
          full_name,
          mobile_number,
          email,
          property_owner_type,
        } = res.data.user;
        // Save login data to session storage
        sessionStorage.setItem("AccessToken", _id);
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("connect_to_name", full_name);
        sessionStorage.setItem("connect_to_no", mobile_number);
        sessionStorage.setItem("connect_to_email", email);
        sessionStorage.setItem("property_owner_type", property_owner_type);
        // Fetch user profile after successful login
        const profileResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
          {
            user_id: _id, // Add the correct user ID here
          }
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
        sessionStorage.setItem(
          "upcoming_project_count",
          upcoming_project_count
        );

        console.log(
          "Stored Free Post Count:",
          sessionStorage.getItem("free_post_count")
        );

        login(res.data);
        setAlert({ msg: "Login successful! Welcome back!", type: "success" });

        // Redirect after a short delay
        setTimeout(() => {
          history.push("/");
        }, 2000);
      } else {
        setAlert({
          msg: "Login failed: Invalid response from server",
          type: "danger",
        });
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Network error";
      setAlert({ msg: "Login failed: " + errorMessage, type: "danger" });
    }
  };

  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <>
      <Helmet>
        <title>Real Estate - Login</title>
        <meta name="description" content="login page" />
      </Helmet>
      <div
        className="flex items-center justify-center min-h-screen bg-gray-100"
        style={{ minHeight: "80vh" }}
      >
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Login Here
          </h1>

          {alert && (
            <div
              className={`max-w-lg fixed top-14 w-full p-2 text-white rounded flex justify-between items-center ${alert.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              style={{ zIndex: 1000 }}
            >
              <strong className="text-center">{alert.msg}</strong>
              <button
                onClick={() => setAlert(null)}
                className="text-white bg-transparent hover:bg-white hover:text-black rounded-full p-2 transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Password"
                name="password"
                value={password}
                minLength="6"
                onChange={onChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition duration-200"
            >
              SIGN IN
            </button>
          </form>
          <div className="text-center mt-4">
            <h5>
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:text-blue-700">
                Sign Up
              </Link>
            </h5>
          </div>
        </div>
      </div>
    </>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
