import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useParams, useHistory } from "react-router-dom";
import { FaRupeeSign, FaBookmark, FaRegBookmark } from "react-icons/fa"; // Icon for price
import { GoLocation } from "react-icons/go"; // Icon for address
import { BsHouseDoorFill } from "react-icons/bs"; // Icon for property type

export default function SpotliteDetail() {
  const [developerDetails, setDeveloperDetails] = useState(null);
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [offerDetails, setOfferDetails] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [recommendedProperties, setRecommendedProperties] = useState([]);
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const { developerId, userId } = useParams();
  const history = useHistory();

  const storedUserId = sessionStorage.getItem("AccessToken");

  const settings = {
    infinite: offerDetails.length > 1, // Disable infinite loop if there's only one offer
    arrows: false,
    speed: 8000,
    cssEase: "linear",
    slidesToShow: Math.min(3, offerDetails.length), // Show only the number of available slides
    slidesToScroll: 1,
    autoplay: offerDetails.length > 1, // Enable autoplay only if there are multiple slides
    autoplaySpeed: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, offerDetails.length),
          slidesToScroll: 1,
          infinite: offerDetails.length > 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: offerDetails.length > 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchDeveloperDetails = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get_developer_details`,
          {
            developer_id: developerId,
            user_id: userId,
          }
        );
        if (response.data && response.data.status === 1) {
          const data = response.data;
          setDeveloperDetails(data.developer_details);
          setUpcomingProjects(data.upcoming_projects);
          setOfferDetails(data.offer_details);
          setFeaturedProperties(data.featured_properties);
          setRecommendedProperties(data.recommended_properties);
        } else {
          setDeveloperDetails(null);
        }
      } catch (error) {
        console.error("Error fetching developer details:", error);
        setDeveloperDetails(null);
      }
    };

    const fetchFavoriteProperties = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get_favorite_properties`,
          { user_id: storedUserId }
        );
        if (response.data && response.data.status === 1) {
          const favorites = response.data.data.reduce((acc, item) => {
            acc[item._id] = item.is_favorite; // Store the boolean value directly
            return acc;
          }, {});
          setFavoriteProperties(favorites); // Update state with boolean values
        }
      } catch (error) {
        console.error("Error fetching favorite properties:", error);
      }
    };

    fetchDeveloperDetails();
    fetchFavoriteProperties();
  }, [developerId, userId]);

  const handlePropertyDetail = (id) => {
    history.push(`/propertydetails/${id}`);
  };

  const handleOfferDetails = (offer) => {
    history.push(`/offer/${offer._id}`, {
      offer,
    });
  };

  const handleSaveProperty = async (propertyId) => {
    if (!favoriteProperties[propertyId]) {
      // Only add if it's not already a favorite
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/add_to_favorite`,
          {
            user_id: storedUserId,
            property_id: propertyId,
          }
        );
        if (response.data && response.data.status === 1) {
          setFavoriteProperties((prev) => ({
            ...prev,
            [propertyId]: true, // Mark the property as a favorite (true)
          }));
        }
      } catch (error) {
        console.error("Error saving property:", error);
      }
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Developer Details */}
      {developerDetails ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Banner Section */}
          <div className="relative">
            <img
              src={developerDetails.brand_img}
              alt="Developer Brand"
              className="w-full h-80 object-contain"
            />
            <div className="absolute bottom-4 left-4 bg-white p-2 rounded-full shadow-lg">
              <img
                src={developerDetails.brand_img}
                alt="Developer Logo"
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
            </div>
          </div>
          {/* Details Section */}
          <div className="p-3">
            <h2 className="text-2xl font-bold mb-1 text-gray-800">
              {developerDetails.developer_name}
            </h2>
            <p className="text-lg text-gray-600 mb-1">
              {developerDetails.designation}
            </p>
            <p className="text-gray-500 h6">{developerDetails.address}</p>
          </div>
        </div>

      ) : (
        <h3 className="text-center text-gray-500">
          No developer profile added
        </h3>
      )}

      {/* Upcoming Projects */}
      {upcomingProjects.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Upcoming Projects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {upcomingProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image Section */}
                <img
                  src={`${process.env.REACT_APP_API_URL}${project.project_image}`}
                  alt={project.project_name}
                  className="w-full h-64 object-cover"
                />
                {/* Details Section */}
                <div className="p-6">
                  <h4 className="font-bold text-xl text-gray-800 mb-2">
                    {project.project_name}
                  </h4>
                  <p className="text-gray-600 text-sm">{project.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Offer Details */}
      {offerDetails.length > 0 && (
        <Slider {...settings} className="slider-container">
          {offerDetails.map((offer) => (
            <div key={offer._id} className="p-2">
              <div
                onClick={() => handleOfferDetails(offer)}
                className="block cursor-pointer bg-white rounded-xl shadow-slate-400 shadow-md overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={`${process.env.REACT_APP_API_URL}${offer.offer_img}`}
                    alt={offer.offer_name}
                    className="w-full h-52 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2 bg-gray-300 text-black px-3 py-1 text-sm rounded-full">
                    {offer.offer_name.toUpperCase()}
                  </div>
                </div>
                <div className="p-2 bg-white px-3">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {offer.offer_name}
                  </h3>

                  <p className="text-gray-600 font-medium truncate">
                    {offer.offer_description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>

      )}

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Featured Properties</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <div
                key={property._id}
                className="bg-white shadow-md rounded-lg p-4 relative"
              >
                <div className="relative w-full h-56">
                  {/* Cover Image */}
                  <img
                    src={property.cover_image}
                    alt={property.property_name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />

                  {/* Category Price Type Badge */}
                  <span
                    className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-full"
                  >
                    For {property.category_price_type}
                  </span>

                  {/* Featured Badge */}
                  {property.mark_as_featured === "Yes" && (
                    <span
                      className="absolute bottom-2 right-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-white text-xs font-bold py-1 px-3 rounded-lg shadow-md"
                    >
                      FEATURED
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-lg">{property.property_name}</h4>
                <p className="flex items-center text-gray-600">
                  <FaRupeeSign className="mr-2 text-gray-600 text-base" />
                  <span className="truncate">{property.property_price}</span>
                </p>
                <p className="flex items-center text-gray-500">
                  <GoLocation className="mr-2 text-gray-600 text-base" />
                  <span className="truncate">{property.address}</span>
                </p>
                <p className="flex items-center text-gray-500">
                  <BsHouseDoorFill className="mr-2 text-gray-600 text-base" />
                  <span>{property.bhk_type}</span>
                </p>
                <button
                  onClick={() => handleSaveProperty(property._id)}
                  disabled={favoriteProperties[property._id]} // Disable if already a favorite
                  className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md ${favoriteProperties[property._id]
                    ? "cursor-not-allowed text-gray-600" // Marked as favorite
                    : "cursor-pointer"
                    }`}
                >
                  {favoriteProperties[property._id] ? (
                    <FaBookmark className="text-gray-600" />
                  ) : (
                    <FaRegBookmark className="text-gray-600" />
                  )}
                </button>
                <button
                  onClick={() => handlePropertyDetail(property._id)}
                  className="absolute bottom-4 right-4 bg-gray-600 text-white px-4 py-2 rounded"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Properties */}
      {recommendedProperties.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">
            Recommended Properties
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProperties.map((property) => (
              <div
                key={property._id}
                className="bg-white shadow-md rounded-lg p-4 relative"
              >
                <div className="relative w-full h-56">
                  {/* Cover Image */}
                  <img
                    src={property.cover_image}
                    alt={property.property_name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />

                  {/* Category Price Type Badge */}
                  <span
                    className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-full"
                  >
                    For {property.category_price_type}
                  </span>

                  {/* Featured Badge */}
                  {property.mark_as_featured === "Yes" && (
                    <span
                      className="absolute bottom-2 right-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-white text-xs font-bold py-1 px-3 rounded-lg shadow-md"
                    >
                      FEATURED
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-lg">{property.property_name}</h4>
                <p className="flex items-center text-gray-600">
                  <FaRupeeSign className="mr-2 text-gray-600 text-base" />
                  <span className="truncate">{property.property_price}</span>
                </p>
                <p className="flex items-center text-gray-500">
                  <GoLocation className="mr-2 text-gray-600 text-base" />
                  <span className="truncate">{property.address}</span>
                </p>
                <p className="flex items-center text-gray-500">
                  <BsHouseDoorFill className="mr-2 text-gray-600 text-base" />
                  <span>{property.bhk_type}</span>
                </p>

                <button
                  onClick={() => handleSaveProperty(property._id)}
                  disabled={favoriteProperties[property._id]} // Disable if already a favorite
                  className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md ${favoriteProperties[property._id]
                    ? "cursor-not-allowed text-gray-600" // Marked as favorite
                    : "cursor-pointer"
                    }`}
                >
                  {favoriteProperties[property._id] ? (
                    <FaBookmark className="text-gray-600" />
                  ) : (
                    <FaRegBookmark className="text-gray-600" />
                  )}
                </button>

                <button
                  onClick={() => handlePropertyDetail(property._id)}
                  className="absolute bottom-4 right-4 bg-gray-600 text-white px-4 py-2 rounded"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}