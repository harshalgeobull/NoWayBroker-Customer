import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/RecommendedProperties.css";
import axios from "axios";
import { FaRupeeSign } from "react-icons/fa"; // Icon for price
import { GoLocation } from "react-icons/go"; // Icon for address
import { BsHouseDoorFill } from "react-icons/bs"; // Icon for property type

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const NearByProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]); // Store saved properties
  const [properties, setProperties] = useState([]); // Store recommended properties
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // Check if user is logged in and fetch saved properties
  useEffect(() => {
    const userId = sessionStorage.getItem("AccessToken");
    if (userId) {
      setIsLoggedIn(true);
      fetchSavedProperties(userId); // Fetch saved properties after login
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch saved properties for logged-in user

  const fetchSavedProperties = async () => {
    const userId = sessionStorage.getItem("AccessToken"); // Get the user_id for fetching saved properties
    try {
      const response = await axios.post(
        `${REACT_APP_API_URL}/cust_api/get_favorite_properties`,
        {
          user_id: userId,
        }
      );

      if (response.data.status === 1 && Array.isArray(response.data.data)) {
        const savedIds = response.data.data.map((prop) => prop._id); // Assuming _id is the property identifier
        setSavedProperties(savedIds);
      } else {
        setSavedProperties([]);
        console.error("No saved properties found.");
      }
    } catch (error) {
      console.error("Error fetching saved properties:", error);
    }
  };

  // Fetch recommended properties
  useEffect(() => {
    const fetchRecommendedProperties = async () => {
      try {
        const response = await axios.post(
          `${REACT_APP_API_URL}/cust_api/get_featured_property`,
          {}
        );
        if (response.data.status === 1 && Array.isArray(response.data.data)) {
          setProperties(response.data.data); // Set recommended properties
        } else {
          setProperties([]); // Clear properties if none found
        }
      } catch (error) {
        console.error("Error fetching recommended properties:", error);
      }
    };

    fetchRecommendedProperties();
  }, []);

  // Toggle save/unsave property
  const toggleSaveProperty = async (propertyId) => {
    if (savedProperties.includes(propertyId)) {
      await removeFromFavorites(propertyId); // Remove from saved
      setSavedProperties(savedProperties.filter((id) => id !== propertyId)); // Update state
    } else {
      await addToFavorites(propertyId); // Add to saved
      setSavedProperties([...savedProperties, propertyId]); // Update state
    }
  };

  // Add property to favorites
  const addToFavorites = async (propertyId) => {
    const userId = sessionStorage.getItem("AccessToken");
    if (!userId) {
      alert("Please log in to save properties to your favorites.");
      return;
    }

    const data = { user_id: userId, property_id: propertyId };

    try {
      await axios.post(`${REACT_APP_API_URL}/cust_api/add_to_favorite`, data);
      alert("Property has been saved to your favorites!"); // Alert after successful addition
    } catch (error) {
      console.error("Error adding property to favorites:", error);
      alert("Failed to save the property. Please try again.");
    }
  };

  // Remove property from favorites
  const removeFromFavorites = async (propertyId) => {
    const userId = sessionStorage.getItem("AccessToken");
    if (!userId) {
      alert("Please log in to remove properties from your favorites.");
      return;
    }

    const data = { user_id: userId, property_id: propertyId };

    try {
      await axios.post(
        `${REACT_APP_API_URL}/cust_api/remove_from_favorite`,
        data
      );
      alert("Property has been removed from your favorites."); // Alert after successful removal
    } catch (error) {
      console.error("Error removing property from favorites:", error);
      alert("Failed to remove the property. Please try again.");
    }
  };

  // Handle bookmark click
  const handleBookmarkClick = (propertyId) => {
    if (isLoggedIn) {
      toggleSaveProperty(propertyId);
    } else {
      alert("Please log in to save properties to your favorites.");
    }
  };

  // Slider settings
  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  return (
    <div className="pt-5 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl tracking-wide text-gray-700">
          Recommended Properties
        </h2>
        <Link
          to="/allproperties"
          className="px-4 py-2 text-black no-underline transition duration-300 bg-gray-300 rounded-full hover:bg-gray-500"
        >
          See All
        </Link>
      </div>
      <div className="p-5 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {properties.length > 0 ? (
          <Slider {...settings} className="slider-container">
            {properties.map((property) => (
              <div
                key={property._id}
                className="relative p-2 mx-2 transition-shadow duration-300 bg-white rounded-lg hover:shadow-lg"
              >
                <Link
                  to={`/propertydetails/${property._id}`}
                  className="block no-underline hover:no-underline"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >

                  <div className="relative overflow-hidden rounded-lg">
                    {/* Image with fixed height */}
                    <div className="relative w-full h-56">
                      {/* Cover Image */}
                      <img
                        src={property.cover_image}
                        alt={property.property_name}
                        className="object-cover w-full h-full rounded-t-lg"
                      />

                      {/* Category Price Type Badge */}
                      <span
                        className="absolute px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full top-2 left-2"
                      >
                        For {property.category_price_type}
                      </span>

                      {/* Featured Badge */}
                      {property.mark_as_featured === "Yes" && (
                        <span
                          className="absolute px-3 py-1 text-xs font-bold text-white rounded-lg shadow-md bottom-2 right-2 bg-gradient-to-r from-yellow-500 to-yellow-300"
                        >
                          FEATURED
                        </span>
                      )}
                    </div>
                    {/* Text container */}
                    <div
                      className="bottom-0 left-0 right-0 px-2 text-black bg-gray-100"
                      style={{ height: "120px" }}
                    >
                      <h3 className="text-lg font-semibold truncate">
                        {property.property_name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <p className="flex items-center truncate">
                          <FaRupeeSign className="mr-2 text-gray-600" />
                          {property.property_price}
                        </p>
                        <p className="flex items-center truncate">|</p>
                        <p className="flex items-center truncate">
                          <BsHouseDoorFill className="mr-2 text-gray-600" />
                          {property.bhk_type}
                        </p>
                        <p className="flex items-center truncate">|</p>
                        <p className="flex items-center truncate">Area</p>
                      </div>
                      <p className="flex items-center text-sm truncate">
                        <GoLocation className="mr-2 text-gray-600" />
                        {property.address}
                      </p>
                    </div>
                  </div>
                </Link>
                {/* Bookmark button */}
                < button
                  className="absolute px-2 py-2 font-bold text-gray-600 bg-gray-300 rounded-full shadow-md top-4 right-4 hover:bg-gray-200"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigating when clicking the bookmark
                    handleBookmarkClick(property._id); // Call function to handle click
                  }}
                >
                  <FontAwesomeIcon
                    icon={
                      savedProperties.includes(property._id)
                        ? solidBookmark
                        : regularBookmark
                    }
                    className="text-xl text-gray-500 cursor-pointer hover:text-gray-600"
                  />
                </button>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="text-center text-gray-500">
            No properties available at the moment.
          </div>
        )
        }
      </div >
    </div >
  );
};

export default NearByProperties;
