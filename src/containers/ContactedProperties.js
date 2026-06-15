import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import qs from "qs"; // For handling form data encoding
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons"; // Import rupee icon

export default function ContactedProperties() {
  const [properties, setProperties] = useState([]); // Ensure default state is an array
  const history = useHistory();

  // Assuming you store your access token in sessionStorage
  const token = sessionStorage.getItem("AccessToken");
  const user_id = token;

  useEffect(() => {
    if (!token) {
      // Redirect to login page if the token is missing
      history.push("/login");
      return;
    }

    if (user_id) {
      // Fetch contacted properties using POST method
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/cust_api/get_contact`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({ user_id }), // Sending user_id as form data
      })
        .then((response) => {
          // Update the state with the data from response.data.data
          if (response.data && response.data.data) {
            setProperties(response.data.data);
          } else {
            console.error("Unexpected API response format");
          }
        })
        .catch((error) => {
          console.error("Error fetching contacted properties:", error);
        });
    }
  }, [token, user_id, history]);

  const handleCardClick = (_id) => {
    // Navigate to property details page
    history.push(`/propertydetails/${_id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {properties.length > 0 ? (
        properties.map((property) => (
          <div
            key={property._id}
            className="relative border rounded-lg shadow-lg"
          >
            <img
              src={property.cover_image}
              alt={property.property_name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">
                {property.property_name.toUpperCase()}
              </h3>
              <p className="text-sm text-gray-700 mt-2 truncate">
                {property.property_description}
              </p>

              {/* Property Price with Font Awesome Rupee Icon */}
              <div className="flex items-center mt-2">
                <p className="text-lg font-semibold my-text">
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="text-gray-700 mr-1 my-text"
                  />
                  {property.property_price}
                </p>
              </div>

              {/* BHK Type */}
              <p className="text-sm text-gray-600 mt-1">
                BHK Type: {property.bhk_type}
              </p>

              {/* Move the "Details" button to the bottom-right corner */}
              <button
                onClick={() => handleCardClick(property._id)}
                className="absolute bottom-4 right-4 my-bg text-white py-2 px-4 rounded-lg hover:my-bg transition duration-200"
              >
                Details
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No properties found</p> // Handle case when no properties are available
      )}
    </div>
  );
}
