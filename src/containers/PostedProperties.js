import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom"; // Import useHistory for navigation
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/RecommendedProperties.css";
import { FaRupeeSign } from "react-icons/fa"; // Icon for price
import { GoLocation } from "react-icons/go"; // Icon for address
import { BsHouseDoorFill } from "react-icons/bs"; // Icon for property type

const PostedProperties = () => {
  const [userId, setUserId] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const history = useHistory(); // Initialize the history hook

  // Retrieve user ID from sessionStorage on initial render
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("AccessToken");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Fetch properties based on the retrieved user ID
  useEffect(() => {
    const fetchProperties = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const data = { user_id: userId };
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get-listing-properties`,
          data
        );
        if (response.data.status === 1 && Array.isArray(response.data.data)) {
          setProperties(response.data.data);
        } else {
          setProperties([]);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch properties");
        setLoading(false);
      }
    };

    fetchProperties();
  }, [userId]);

  // Handle property deletion
  const handleDeleteProperty = async (_id) => {
    const userId = sessionStorage.getItem("AccessToken");

    if (!userId) {
      console.error("User ID not found in session storage.");
      return; // Exit if userId is not found
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/cust_api/delete_listing_property`;

      // Log the parameters being sent
      console.log("Deleting property with parameters:", {
        user_id: userId,
        property_id: _id,
      });

      // Send parameters in the body
      const response = await axios.delete(url, {
        data: { user_id: userId, property_id: _id },
      });

      if (response.data.status === 1) {
        setProperties((prevProperties) =>
          prevProperties.filter((property) => property._id !== _id)
        );
        console.log("Property deleted successfully.");
      } else {
        console.error("Failed to delete property:", response.data);
      }
    } catch (error) {
      console.error(
        "Error deleting property:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Handle navigation to the EditProperty page by passing property ID
  const handleEditProperty = (_id) => {
    // Navigate to the edit form page, passing the property ID in the URL
    history.push(`/editproperty/${_id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handledetail = (property_id) => {
    // Push to the new route with offer details
    history.push(`/propertydetails/${property_id}`);
  };

  return (
    <div className="bg-gray-200 p-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-black mb-6">
          Posted Properties
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div
                key={property.id}
                className="relative rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={property.cover_image}
                  alt={property.property_name}
                  className="w-full h-44 object-cover object-center"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 text-left">
                    {property.property_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 flex items-center text-left">
                    <GoLocation
                      className="text-gray-600 mr-2 shrink-0"
                      style={{ fontSize: "16px" }}
                    />
                    <span className="truncate">{property.address}</span>
                  </p>

                  <p className="text-sm text-gray-600 mb-2 flex items-center text-left">
                    <BsHouseDoorFill
                      className="text-gray-600 mr-2 shrink-0"
                      style={{ fontSize: "16px" }}
                    />
                    {property.bhk_type}
                  </p>

                  <p className="text-lg font-bold text-gray-600 flex items-center text-left">
                    <FaRupeeSign
                      className="text-gray-600 mr-2 shrink-0"
                      style={{ fontSize: "16px" }}
                    />
                    {property.property_price.toLocaleString("en-IN")}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <div className="text-left">
                      {/* Placeholder if additional details are added later */}
                    </div>
                    <button
                      className="bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-300"
                      onClick={() => handledetail(property._id)}
                    >
                      Details
                    </button>
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button onClick={() => handleDeleteProperty(property._id)}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-red-500 hover:text-red-700"
                    />
                  </button>
                  <button onClick={() => handleEditProperty(property._id)}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="text-blue-500 hover:text-blue-700"
                    />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No properties found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostedProperties;
