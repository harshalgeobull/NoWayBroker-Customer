import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  Wifi as WiFiIcon,
  Pool as PoolIcon,
  Elevator as ElevatorIcon,
  //Phone as PhoneIcon,
} from "@mui/icons-material";

const amenityIcons = {
  HOTEL: <WiFiIcon />,
  "YOGA classes": <PoolIcon />,
  Library: <ElevatorIcon />,
  // Add more mappings as needed
};

const Detail = () => {
  // Assuming currentUser is the user whose property details you are showing
  const currentUser = { user_id: "current_user_id" };
  let { _id } = useParams(); // Get property ID from URL
  const [propertyData, setPropertyData] = useState(null);
  const [amenitiesData, setAmenitiesData] = useState([]);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiryDateTime, setEnquiryDateTime] = useState("");
  const formRef = useRef();

  // Helper functions for masking phone number and email
  const maskPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    return "*****" + phoneNumber.slice(-2);
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    const maskedLocalPart =
      localPart.length > 3
        ? localPart.slice(0, 3) + "*****"
        : localPart + "*****";
    return `${maskedLocalPart}@${domain}`;
  };

  const openModal = () => {
    const accessToken = sessionStorage.getItem("AccessToken");
    if (!accessToken) {
      alert("Please log in to submit your enquiry.");
      return;
    }
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  // Get user_id from session storage
  const storedUserId = sessionStorage.getItem("user_id");

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!_id) {
        setError("Property ID not found");
        setLoading(false);
        return;
      }

      try {
        const requestUrl = `${process.env.REACT_APP_API_URL}/cust_api/get_property_details`;
        const payload = { property_id: _id };

        const response = await axios.post(requestUrl, payload);

        if (response.data.status === 1 && response.data.data) {
          setPropertyData(response.data.data.property_details);
          console.log(
            "Received property details:",
            response.data.data.property_details,
          );
          setAmenitiesData(
            Array.isArray(response.data.data.amenities)
              ? response.data.data.amenities
              : [],
          );
        } else {
          setError("Failed to fetch property details");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Error fetching property details");
        setLoading(false);
      }
    };

    const fetchPropertyImages = async () => {
      if (!_id) {
        return;
      }

      try {
        const imagesUrl = `${process.env.REACT_APP_API_URL}/cust_api/get_property_images`;
        const payload = { property_id: _id };

        const response = await axios.post(imagesUrl, payload);

        if (response.data.status === 1 && response.data.data) {
          setImages(response.data.data.map((img) => img.image));
        } else {
          console.error("Failed to fetch property images");
          setImages([]);
        }
      } catch (err) {
        console.error("Error fetching property images:", err);
        setImages([]);
      }
    };

    fetchPropertyDetails();
    fetchPropertyImages();

    setEnquiryDateTime(new Date().toISOString());
  }, [_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = sessionStorage.getItem("AccessToken");
    if (!accessToken) {
      alert("Please log in to submit your enquiry.");
      return;
    }

    // Manual JWT decoding to extract user_id
    const parseJwt = (token) => {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(""),
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Invalid access token:", error);
        return null;
      }
    };

    // const decodedToken = parseJwt(accessToken);
    const user_id = accessToken; // Get user_id from the decoded token

    if (!user_id) {
      alert("Invalid access token. User ID not found.");
      return;
    }

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
      user_id, // Use decoded user_id from token
      contact_number: e.target.contact_number.value, // Fix reference to form input
      time_date: enquiryDateTime,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_property_enquiry`,
        {
          property_id: _id,
          ...formData,
        },
      );

      // Check if the submission was successful
      if (response.data && response.data.status === 1) {
        alert("Enquiry successfully submitted!"); // Show success alert
      } else {
        alert("Failed to submit enquiry. Please try again.");
      }

      console.log("Enquiry Form Data:", response.data);
    } catch (error) {
      console.error("Failed to submit enquiry:", error);
      alert("Error occurred while submitting the enquiry. Please try again.");
    }

    formRef.current.reset();
    setEnquiryDateTime(new Date().toISOString());
    closeModal();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!propertyData) return <p>No property data found.</p>;

  return (
    <div className="w-full py-6 mx-auto bg-white">
      <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
        Explore Detail Of Property
      </h2>

      <div className="flex items-center justify-center">
        <div className="w-full p-4">
          <div className="overflow-hidden bg-white rounded-lg">
            {/* Cover Image */}
            {propertyData.cover_image && (
              <img
                src={propertyData.cover_image}
                alt="Cover"
                className="object-cover w-full h-80"
              />
            )}

            {/* Image Slider */}
            <div className="p-4 overflow-x-auto whitespace-nowrap">
              {images.length > 0 ? (
                images.map((image, index) => (
                  <img
                    key={index}
                    src={`${process.env.REACT_APP_API_URL}${image}`} // Ensure the URL is correct
                    alt={`property-${index}`}
                    className="inline-block object-cover w-auto mx-2 h-80" // Inline to support single row scrolling
                  />
                ))
              ) : (
                <p>No additional photos to show.</p>
              )}
            </div>

            {/* Property Details */}
            <div className="p-6">
              <p className="text-lg font-bold my-text">
                � {propertyData.property_price}
              </p>
              <h3 className="mb-2 text-3xl font-semibold text-gray-800">
                {propertyData.property_name}
              </h3>
              <p className="mb-4 text-lg text-gray-600">
                {propertyData.address}
              </p>

              {/* Property Description */}
              <h4 className="mt-4 text-xl font-semibold text-gray-800">
                About Property
              </h4>
              <p className="mt-4 text-sm text-gray-700">
                {propertyData.property_description}
              </p>

              {/* Additional Details in three columns */}
              <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
                <div>
                  <p>
                    <span className="font-semibold">Category: </span>
                    {propertyData.property_category_type}
                  </p>
                  <p>
                    <span className="font-semibold">Owner Type: </span>
                    {propertyData.property_owner_type}
                  </p>
                  <p>
                    <span className="font-semibold">Property Type: </span>
                    {propertyData.property_type}
                  </p>
                  <p>
                    <span className="font-semibold">Safety Deposit: </span>
                    {propertyData.safety_deposit}
                  </p>
                  <p>
                    <span className="font-semibold">BHK Type: </span>
                    {propertyData.bhk_type}
                  </p>
                  <p>
                    <span className="font-semibold">Area (sq ft): </span>
                    {propertyData.area_sq}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Furnished Type: </span>
                    {propertyData.furnished_type}
                  </p>
                  <p>
                    <span className="font-semibold">Bathroom Type: </span>
                    {propertyData.bathroom_type}
                  </p>
                  <p>
                    <span className="font-semibold">Total Floors: </span>
                    {propertyData.total_floor}
                  </p>
                  <p>
                    <span className="font-semibold">Security: </span>
                    {propertyData.security}
                  </p>
                  <p>
                    <span className="font-semibold">Available From: </span>
                    {new Date(
                      propertyData.available_on_date,
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Expiry Date: </span>
                    {new Date(propertyData.expiry_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Rating: </span>
                    {propertyData.rating}
                  </p>
                  <p>
                    <span className="font-semibold">Mark as Featured: </span>
                    {propertyData.mark_as_featured}
                  </p>
                  <p>
                    <span className="font-semibold">Added by: </span>
                    {propertyData.added_by_type}
                  </p>
                  <p>
                    <span className="font-semibold">category price type: </span>
                    {propertyData.category_price_type}
                  </p>
                </div>

                {/* Contact Details */}
                {/* Contact Details */}
                <h4 className="mt-4 text-xl font-semibold">Contact Details</h4>
                <div>
                  <p>
                    <span className="font-semibold">Name: </span>
                    {propertyData.connect_to_name}
                  </p>
                  <p>
                    <span className="font-semibold">Phone: </span>
                    {maskPhoneNumber(propertyData.connect_to_no)}
                  </p>
                  <p>
                    <span className="font-semibold">Email: </span>
                    {maskEmail(propertyData.connect_to_email)}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-6">
                <h4 className="mb-2 text-xl font-semibold text-gray-800">
                  Amenities
                </h4>
                {amenitiesData.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {amenitiesData.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <span className="mr-2">
                          {amenityIcons[amenity.name] || <span>No Icon</span>}
                        </span>
                        <span>{amenity.name}</span>{" "}
                        {/* Assuming amenities have a name */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No amenities available for this property.</p>
                )}
              </div>

              {/* Location */}
              <div className="mt-6">
                <h4 className="mb-2 text-xl font-semibold text-gray-800">
                  Location
                </h4>
                <iframe
                  title="Property Location"
                  className="w-full h-80"
                  src={`https://maps.google.com/maps?q=${propertyData.property_name}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Owner Details */}
              {/* <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center">
                                     <PersonIcon className="mr-2 text-gray-600" /> 
                                    <span className="text-lg text-gray-700">{propertyData.owner}</span>
                                    <button
                                        className="px-4 py-2 ml-4 text-white transition duration-300 my-bg rounded-full hover:my-bg"
                                        onClick={() => alert("Call Now")}
                                    >
                                        <PhoneIcon className="mr-2 text-white" />
                                        Call Now
                                    </button>
                                </div>
                            </div>
                             */}

              {/* Enquiry Button */}
              <div>
                {/* Other component code */}

                {/* Conditional button rendering */}
                {/* {storedUserId !== currentUser.user_id && (
                <div className="flex justify-center pt-5">
                    <button
                        className="px-4 py-2 font-bold text-white my-bg rounded hover:my-bg"
                        onClick={openModal}
                    >
                        Enquire Now
                    </button>
                </div>
            )} */}

                {/* Modal code */}
                {isModalOpen && (
                  <div className="modal">
                    {/* Modal content */}
                    <button onClick={closeModal}>Close</button>
                  </div>
                )}
              </div>

              {/* Modal for Enquiry Form */}
              {isModalOpen && (
                <div className="container fixed inset-0 flex items-center justify-center p-20 bg-black bg-opacity-50">
                  <div className="row">
                    <div className="p-6 bg-white rounded-lg w-100 col-md-8">
                      <h2 className="mb-4 text-xl font-bold">Enquiry Form</h2>
                      <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label className="block mb-2" htmlFor="name">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="w-full px-3 py-2 border rounded "
                          />
                        </div>

                        <div className="row">
                          <div className="mb-4 col-6">
                            <label className="block mb-2" htmlFor="email">
                              email
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              required
                              className="w-full px-3 py-2 border rounded"
                            />
                          </div>

                          <div className="mb-4 col-6">
                            <label
                              htmlFor="contact_number"
                              className="block text-gray-700"
                            >
                              Contact Number:
                            </label>
                            <input
                              type="text"
                              id="contact_number"
                              name="contact_number"
                              required
                              className="w-full p-2 border border-gray-300"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block mb-2" htmlFor="message">
                            Message
                          </label>
                          <textarea
                            name="message"
                            id="message"
                            required
                            className="w-full px-3 py-2 border rounded"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 text-white my-bg rounded-md hover:my-bg"
                        >
                          Submit Enquiry
                        </button>
                        <button
                          type="button"
                          className="ml-2 text-red-600"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
