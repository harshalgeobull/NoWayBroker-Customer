import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import LogoutIcon from "@mui/icons-material/Logout";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    full_name: "",
    email: "",
    mobile_number: "",
    profile_image: "",
    property_owner_type: "",
    free_view_count: 0,
    free_post_count: 0,
    paid_view_count: 0,
    paid_post_count: 0,
    feature_count: 0,
    offer_count: 0,
    upcoming_project_count: 0,
  });

  const history = useHistory();

  const handleLogout = () => {
    sessionStorage.clear();
    history.push("/login");
  };

  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [isDynamicPricing, setIsDynamicPricing] = useState(false);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("AccessToken");
    if (!accessToken) {
      history.push("/login");
      return;
    }

    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const storedUserId = sessionStorage.getItem("AccessToken");
    if (!storedUserId) {
      console.log("Warning: No user_id found in sessionStorage.");
      return;
    }

    setUserId(storedUserId);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
        {
          user_id: storedUserId,
        },
      );

      if (response.data && response.data.data) {
        const userData = response.data.data;

        if (userData.dynamic_pricing == "ON") {
          setIsDynamicPricing(true);
        }

        setUserInfo({
          full_name: userData.full_name || "",
          email: userData.email || "",
          mobile_number: userData.mobile_number || "",
          profile_image: userData.profile_image || "",
          property_owner_type: userData.property_owner_type || "",
          free_view_count: userData.free_view_count || 0,
          free_post_count: userData.free_post_count || 0,
          paid_view_count: userData.paid_view_count || 0,
          paid_post_count: userData.paid_post_count || 0,
          feature_count: userData.feature_count || 0,
          offer_count: userData.offer_count || 0,
          upcoming_project_count: userData.upcoming_project_count || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", userInfo.full_name);
    formData.append("email", userInfo.email);
    formData.append("mobile_number", userInfo.mobile_number);
    formData.append("property_owner_type", userInfo.property_owner_type);
    formData.append("user_id", userId);
    formData.append("username", userInfo.full_name.replace(/\s+/g, "")); // Add username based on full name
    formData.append("dynamic_pricing", userInfo.dynamic_pricing);

    // Adding dynamic pricing status
    formData.append("dynamic_pricing", isDynamicPricing ? "ON" : "OFF");

    if (selectedImage) {
      formData.append("profile_image", selectedImage);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/edit_profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setAlert({ msg: "Profile updated successfully!", type: "success" });
      setIsEditing(false);
      fetchUserData();
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.error
        : error.message;
      setAlert({
        msg: `Error updating profile: ${errorMessage}`,
        type: "danger",
      });
    }
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDynamicPricingToggle = async () => {
    const newStatus = !isDynamicPricing; // Toggle the current state (true to false or false to true)
    setIsDynamicPricing(newStatus);

    // Make API call to update the dynamic pricing status
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/edit_profile`,
        {
          dynamic_pricing: newStatus ? "ON" : "OFF", // Set "ON" or "OFF" based on the newStatus value
          user_id: userId,
          email: userInfo.email,
          full_name: userInfo.full_name,
          mobile_number: userInfo.mobile_number,
          username: userInfo.full_name.replace(/\s+/g, ""), // Add username to the API request
        },
      );

      if (response.data.status === 1) {
        fetchUserData();
        setAlert({
          msg: `Dynamic Pricing is now ${newStatus ? "ON" : "OFF"}`,
          type: "success",
        });
      } else {
        setAlert({
          msg: `Failed to update Dynamic Pricing status.`,
          type: "danger",
        });
      }
    } catch (error) {
      setAlert({
        msg: `Error updating dynamic pricing: ${error.message}`,
        type: "danger",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Real Estate - Profile</title>
        <meta name="description" content="Profile page" />
      </Helmet>

      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {alert && (
            <div
              className={`alert ${
                alert.type === "success" ? "text-green-500" : "text-red-500"
              } my-4`}
            >
              {alert.msg}
            </div>
          )}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
            <div className="flex justify-end m-2">
              <button
                onClick={handleLogout}
                className="flex items-center p-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 transition-colors duration-200"
              >
                <span className="me-2">Logout</span>
                <LogoutIcon style={{ color: "black" }} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row p-2">
              <div className="md:w-1/3 bg-gray-100 p-4 flex flex-col items-center">
                {isEditing ? (
                  <input
                    type="file"
                    name="profile_image"
                    onChange={handleImageChange}
                    className="border rounded p-2 mb-4 w-100 text-gray-700"
                  />
                ) : (
                  <img
                    src={userInfo.profile_image}
                    alt="Profile"
                    className="w-42 h-42 rounded-lg border-4 border-rose-500 mb-4 cursor-pointer" // Reduced size to 50%
                    onClick={handleImageClick} // Handle image click
                  />
                )}
                {isEditing ? (
                  <input
                    type="text"
                    name="full_name"
                    value={userInfo.full_name}
                    onChange={handleChange}
                    className="border rounded p-2 w-full text-center text-gray-800 font-semibold "
                    required
                  />
                ) : (
                  <h1 className="text-gray-800 text-2xl font-bold text-center ">
                    {userInfo.full_name}
                  </h1>
                )}
              </div>

              <div className="md:w-2/3 p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Profile Information
                </h2>

                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">Email:</span>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleChange}
                        className="border rounded p-2 w-2/3 text-sm md:text-base"
                        required
                      />
                    ) : (
                      <span className="text-gray-800">{userInfo.email}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">
                      Mobile Number:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="mobile_number"
                        value={userInfo.mobile_number}
                        onChange={handleChange}
                        className="border rounded p-2 w-2/3 text-sm md:text-base"
                        required
                      />
                    ) : (
                      <span className="text-gray-800">
                        {userInfo.mobile_number}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">
                      Property Owner Type:
                    </span>
                    <input
                      type="text"
                      name="property_owner_type"
                      value={userInfo.property_owner_type}
                      onChange={handleChange}
                      className="border rounded p-2 w-2/3 text-sm md:text-base"
                      readOnly
                    />
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    {isEditing && (
                      <button
                        type="submit"
                        className="py-1 px-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-md hover:from-blue-500 hover:to-blue-300 transition-colors duration-200"
                      >
                        Save Changes
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className="py-1 px-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 transition-colors duration-200"
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Dynamic Pricing Toggle */}
            <div className="p-6 border-t border-gray-200 bg-white rounded-lg shadow-md">
              {/* <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Dynamic Pricing
              </h2> */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">
                  Dynamic Pricing:
                </span>
                <button
                  type="button"
                  onClick={handleDynamicPricingToggle}
                  className={`py-1 px-3 rounded-md text-white font-semibold ${isDynamicPricing ? "bg-green-500" : "bg-red-500"}`}
                >
                  {isDynamicPricing ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Account Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { to: "/postedproperties", label: "Posted Properties" },
                  { to: "/amenity", label: "Your Amenities" },
                  { to: "/inquirieslist", label: "Inquiries" },
                  {
                    to: "/offerproperties",
                    label: "Add Offer On Properties",
                  },
                  { to: "/changepassword", label: "Change Password" },
                  {
                    to: "/updatedeveloper",
                    label: "Add Your Developer Profile",
                  },
                  {
                    to: "/upcomingproject",
                    label: "Add Your Upcoming Projects",
                  },
                  { to: "/plan-history", label: "Your Plan History" },
                  {
                    to: "/contactedproperties",
                    label: "Contacted Properties",
                  },
                  {
                    to: "/mytour",
                    label: "My Virtual Tours",
                  },
                  {
                    to: "/allschedules",
                    label: "Scheduled  with Me",
                  },
                ].map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    className="block p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white text-center hover:bg-gradient-to-l transition-all duration-200"
                    style={{ textDecoration: "none" }} // Remove underline
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Profile Image */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="relative bg-white p-4 rounded shadow-lg">
              <img
                src={userInfo.profile_image}
                alt="Profile"
                className="max-w-xl h-auto"
              />
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 "
                onClick={closeModal}
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faTimes} size="2xl" />{" "}
                {/* Font Awesome cross icon */}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
