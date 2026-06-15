import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import qs from "qs"; // For handling form data encoding
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const REACT_APP_API_URL = process.env.REACT_APP_API_BASE_URL2;

export default function BhkProperties() {
  const [bhkProperties, setBhkProperties] = useState([]); // Ensure default state is an array
  const history = useHistory();
  const [savedProperties, setSavedProperties] = useState([]); // stored property
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // Extract query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bhk_type = queryParams.get("bhk_type");

  useEffect(() => {
    const fetchBhkProperties = async () => {
      const token = sessionStorage.getItem("AccessToken");
      const user_id = token;

      try {
        const response = await axios({
          method: "POST",
          url: `${REACT_APP_API_URL}/cust_api/search_location?bhk_type=${bhk_type}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: qs.stringify({
            user_id: user_id, // Assuming user_id is stored in sessionStorage
            bhk_type: bhk_type,
          }),
        });

        setBhkProperties(response.data.data || []); // Ensure to extract the data properly
      } catch (err) {
        console.error("Error fetching BHK properties:", err);
      }
    };

    if (bhk_type) {
      fetchBhkProperties();
    }
  }, [bhk_type, history]);

  const handleCardClick = (_id) => {
    // Navigate to property details page
    history.push(`/propertydetails/${_id}`);
  };

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

  const fetchSavedProperties = async () => {
    const userId = sessionStorage.getItem("AccessToken"); // Get the user_id for fetching saved properties
    try {
      const response = await axios.post(
        `${REACT_APP_API_URL}/cust_api/get_favorite_properties`,
        {
          user_id: userId,
        },
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
        data,
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

  return (
    <div className="p-4">
      {/* Centered Heading */}
      <h2 className="text-center text-2xl font-bold mb-4">
        {bhk_type} Properties
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {bhkProperties.length > 0 ? (
          bhkProperties.map((property) => (
            <div
              key={property._id}
              className="relative border rounded-lg shadow-lg"
            >
              {/* Cover Image */}
              <img
                src={property.cover_image}
                alt={property.property_name}
                className="w-full h-48 object-cover rounded-t-lg"
              />

              <div className="p-4">
                <h3 className="text-lg font-bold truncate">
                  {property.property_name.toUpperCase()}
                </h3>
                <p className="text-sm text-gray-700 mt-2 truncate">
                  {property.property_description}
                </p>

                {/* Property Price with Font Awesome Rupee Icon */}
                <div className="flex items-center mt-2">
                  <p className="text-lg font-semibold my-text">
                    &#x20B9; {property.property_price}
                  </p>
                </div>

                {/* BHK Type */}
                <p className="text-sm text-gray-600 mt-1">
                  BHK Type: {property.bhk_type}
                </p>
              </div>

              {/* Bookmark button */}
              <button
                className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-full"
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
                  } // Check if property is in savedProperties
                  className="text-black hover:text-black cursor-pointer text-xl"
                />
              </button>

              {/* Move the "Details" button to the bottom-right corner */}
              <button
                onClick={() => handleCardClick(property._id)}
                className="absolute bottom-4 right-4 my-bg text-white py-2 px-4 rounded-lg hover:my-bg transition duration-200"
              >
                Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700 mt-4">No properties found</p> // Handle case when no properties are available
        )}
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useLocation, useHistory } from 'react-router-dom';
// import qs from 'qs'; // For handling form data encoding

// export default function BhkProperties() {
//   const [bhkProperties, setBhkProperties] = useState([]); // Ensure default state is an array
//   const history = useHistory();

//   // Extract query parameters
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const bhk_type = queryParams.get('bhk_type');

//   useEffect(() => {
//     const fetchBhkProperties = async () => {
//       const token = sessionStorage.getItem('AccessToken');
//       const user_id = token;

//       // if (!token) {
//       //   // Redirect to login page if the token is missing
//       //   history.push('/login');
//       //   return;
//       // }

//       try {
//         const response = await axios({
//           method: 'POST',
//           url: `${process.env.REACT_APP_API_URL}/cust_api/search_location?bhk_type=${bhk_type}`,
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//           data: qs.stringify({
//             user_id: user_id, // Assuming user_id is stored in sessionStorage
//             bhk_type: bhk_type,
//           }),
//         });

//         setBhkProperties(response.data.data || []); // Ensure to extract the data properly
//       } catch (err) {
//         console.error("Error fetching BHK properties:", err);
//       }
//     };

//     if (bhk_type) {
//       fetchBhkProperties();
//     }
//   }, [bhk_type, history]);

//   const handleCardClick = (_id) => {
//     // Navigate to property details page
//     history.push(`/propertydetails/${_id}`);
//   };

//   return (
//     <div className="p-4">
//       {/* Centered Heading */}
//       <h2 className="text-center text-2xl font-bold mb-4">{bhk_type}  Properties</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//         {bhkProperties.length > 0 ? (
//           bhkProperties.map((property) => (
//             <div
//               key={property._id}
//               className="relative border rounded-lg shadow-lg"
//             >
//               {/* Cover Image */}
//               <img
//                 src={property.cover_image}
//                 alt={property.property_name}
//                 className="w-full h-48 object-cover rounded-t-lg"
//               />

//               <div className="p-4">
//                 <h3 className="text-lg font-bold truncate">{property.property_name.toUpperCase()}</h3>
//                 <p className="text-sm text-gray-700 mt-2 truncate">{property.property_description}</p>

//                 {/* Property Price with Font Awesome Rupee Icon */}
//                 <div className="flex items-center mt-2">
//                   <p className="text-lg font-semibold my-text">

//                      &#x20B9; {property.property_price}
//                   </p>
//                 </div>

//                 {/* BHK Type */}
//                 <p className="text-sm text-gray-600 mt-1">BHK Type: {property.bhk_type}</p>
//               </div>

//               {/* Move the "Details" button to the bottom-right corner */}
//               <button
//                 onClick={() => handleCardClick(property._id)}
//                 className="absolute bottom-4 right-4 my-bg text-white py-2 px-4 rounded-lg hover:my-bg transition duration-200"
//               >
//                 Details
//               </button>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-700 mt-4">No properties found</p> // Handle case when no properties are available
//         )}
//       </div>
//     </div>
//   );
// }
