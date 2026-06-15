import React, { useEffect, useState } from "react";
import { Link ,useHistory} from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/RecommendedProperties.css";
import { FaRupeeSign } from "react-icons/fa"; // Icon for price
import { GoLocation } from "react-icons/go"; // Icon for address
import { BsHouseDoorFill } from "react-icons/bs"; // Icon for property type

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const SavedSearch = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const storedUserId = sessionStorage.getItem("AccessToken");
  const history=useHistory();
  useEffect(() => {


    const fetchFavoriteProperties = async () => {
      try {
        if (!storedUserId) {
          setError("User ID not found.");
          setLoading(false);
          history.push('/login')
          return;
        }

        const response = await axios.post(
          `${REACT_APP_API_URL}/cust_api/get_favorite_properties`,
          {
            user_id: storedUserId,
          }
        );

        console.log("Favorite Properties Response:", response.data);

        if (response.data.status === 1 && Array.isArray(response.data.data)) {
          setProperties(response.data.data);
        } else {
          setProperties([]);
          setError("No favorite properties available.");
        }
      } catch (error) {
        console.error("Error fetching favorite properties:", error);
        setError("Failed to fetch favorite properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProperties();
  }, [storedUserId]); // Include storedUserId in dependency array

  const handleRemove = async (userId, propertyId, favoriteId) => {
    if (!favoriteId) {
      console.error(
        "favoriteId is required to remove property from favorites."
      );
      return; // Exit if favoriteId is not provided
    }

    const url = `${REACT_APP_API_URL}/cust_api/remove_from_favorite`;

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("property_id", propertyId);
      formData.append("favorite_id", favoriteId);

      console.log("Sending DELETE request to:", url);
      console.log("With parameters:", {
        user_id: userId,
        property_id: propertyId,
        favorite_id: favoriteId,
      });

      const response = await axios.delete(url, {
        data: formData, // Send form data as the request body
        headers: {
          "Content-Type": "multipart/form-data", // Set content type
        },
      });

      if (response.data.status === 1) {
        console.log("Removed from favorites successfully:", favoriteId);
        setProperties((prevProperties) => {
          return prevProperties.filter(
            (property) => property.favorite_id !== favoriteId
          );
        });
      } else {
        console.error(
          "Failed to remove from favorites. Server response:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error removing favorite property:", error);
    }
  };

  return (
    <div className="p-5 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold text-black">Saved Properties</h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading properties...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {properties.map((property) => {
              console.log("Property Data:", property);

              const propertyId = property._id;
              const favoriteId = property.favorite_id || null; // Set to null if not available

              console.log("Using IDs:", { propertyId, favoriteId });

              return (
                <div
                  key={propertyId}
                  className="relative overflow-hidden transition-transform duration-300 transform bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl"
                >
                  {/* Featured Badge */}
                  {property.featured && (
                    <span className="absolute px-2 py-1 text-xs font-semibold text-white bg-gray-600 rounded-full top-2 left-2">
                      Featured
                    </span>
                  )}

                  {/* Property Image */}
                  <img
                    src={property.cover_image || "/default-property.jpg"}
                    alt={property.property_name}
                    className="object-cover object-center w-full h-44"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() =>
                      handleRemove(
                        storedUserId,
                        property._id,
                        property.favorite_id
                      )
                    }
                    className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-600 focus:outline-none"
                  >
                    <FaTimes />
                  </button>

                  {/* Property Details */}
                  <Link
                    to={`/propertydetails/${propertyId}`}
                    className="no-underline hover:no-underline"
                  >
                    <div className="p-4 text-left bg-white">
                      <h3 className="mb-2 text-xl font-semibold text-gray-800 truncate">
                        {property.property_name}
                      </h3>

                      {/* Address with Icon */}
                      <div className="flex items-center mb-2 text-sm text-gray-600">
                        <span className="mr-2">
                          <GoLocation
                            className="text-gray-600"
                            style={{ fontSize: "16px" }}
                          />
                        </span>
                        <span className="truncate">{property.address}</span>
                      </div>

                      {/* BHK Type with Icon */}
                      <div className="flex items-center mb-2 text-sm text-gray-600">
                        <span className="mr-2">
                          <BsHouseDoorFill
                            className="text-gray-600"
                            style={{ fontSize: "16px" }}
                          />
                        </span>
                        <span>{property.bhk_type}</span>
                      </div>

                      {/* Price with Icon */}
                      <div className="flex items-center text-lg font-bold text-gray-600">
                        <span className="mr-2">
                          <FaRupeeSign
                            className="text-gray-600"
                            style={{ fontSize: "16px" }}
                          />
                        </span>
                        <span>{property.property_price}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSearch;
