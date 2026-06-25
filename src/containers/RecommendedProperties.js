import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "react-slick";
import { Heart, Camera, Home, Ruler } from "lucide-react";
import { toast } from "react-toastify";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FaRupeeSign } from "react-icons/fa";
import { BsHouseDoorFill } from "react-icons/bs";
import { BiShapeSquare } from "react-icons/bi";
import { faChair } from "@fortawesome/free-solid-svg-icons";

import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineUser } from "react-icons/ai";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { PiCubeFocus } from "react-icons/pi";
import { useHistory } from "react-router-dom";
import Login1 from "../auth/Login1";
import SignUp1 from "../auth/SignUp1";

const RecommendedProperties = ({
  openRecommendedShareModal,
  closeShareModal,
  copyLink,
  currentShareUrl,
  data,
  fetchHomeData,
}) => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sliderRef = useRef(null);
  const history = useHistory();
  const [isContactModalOpen] = useState(false);
  const [openContactModalAfterLogin] = useState(false);
  const accessToken = sessionStorage.getItem("accessToken");

  // Modal open states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  useEffect(() => {
    const userId = sessionStorage.getItem("AccessToken");
    if (userId) {
      setIsLoggedIn(true);
      fetchSavedProperties(userId);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchSavedProperties = async () => {
    const userId = sessionStorage.getItem("AccessToken");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_favorite_properties`,
        {
          user_id: userId,
        },
      );

      if (response.data.status === 1 && Array.isArray(response.data.data)) {
        const savedIds = response.data.data.map((prop) => prop._id);
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
  const fetchRecommendedProperties = async () => {
    try {
      // {console.log(data)}
      if (data && data.status === 1 && Array.isArray(data.data)) {
        setProperties(data.data);
      } else {
        setProperties([]);
        console.log("No projects found");
      }
    } catch (error) {
      console.error("Error fetching recommended properties:", error);
    }
  };

  // {console.log(properties)}

  useEffect(() => {
    fetchRecommendedProperties();
  }, [data]);

  const handleClick = () => {
    history.push("/featuredDashboard");
  };

  // Toggle save/unsave property
  const toggleSaveProperty = async (propertyId) => {
    if (savedProperties.includes(propertyId)) {
      await removeFromFavorites(propertyId);
      setSavedProperties(savedProperties.filter((id) => id !== propertyId));
    } else {
      await addToFavorites(propertyId);
      setSavedProperties([...savedProperties, propertyId]);
    }
  };

  //  Add to favorites
  const addToFavorites = async (PropertyId) => {
    if (!accessToken) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_to_favorite`,
        {
          user_id: accessToken,
          property_id: PropertyId,
        },
      );
      fetchHomeData();
      // toast.success("Property added to favorites successfuly!");
    } catch (error) {
      console.error("Error adding property to favorites:", error);
    }
  };

  //  Remove to favorites
  const removeFromFavorites = async (favoriteId) => {
    const formData = new FormData();
    formData.append("favorite_id", favoriteId);

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/cust_api/remove_from_favorite`,
        { data: formData },
      );

      if (response.data.status === 1) {
        fetchHomeData();
        // toast.success("Property removed to favorites successfuly!");
      } else {
        fetchHomeData();
        console.error("Failed to remove:", response.data.message);
      }
    } catch (error) {
      console.error("Error unfavoriting:", error);
    }
  };

  // Slider settings
  const [activeIndexes, setActiveIndexes] = useState({});
  const BASE_URL = process.env.REACT_APP_API_URL;
  const settings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    cssEase: "linear",
    centerMode: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const formatPrice = (price) => {
    if (!price) return "";

    const formatNumber = (value, unit) => {
      return (value % 1 === 0 ? parseInt(value) : value.toFixed(1)) + unit;
    };

    if (price >= 10000000) {
      return formatNumber(price / 10000000, " Cr");
    } else if (price >= 100000) {
      return formatNumber(price / 100000, " L");
    } else if (price >= 1000) {
      return formatNumber(price / 1000, " K");
    } else {
      return price.toString();
    }
  };

  const convertToSqFt = (area, unit) => {
    if (!area || !unit) return null;
    const areaNum = parseFloat(area);
    if (isNaN(areaNum)) return null;

    switch (unit.toLowerCase()) {
      case "sq ft":
      case "sqft":
      case "square feet":
        return areaNum;
      case "sq yd":
      case "sqyd":
      case "square yards":
        return areaNum * 9;
      case "sq mt":
      case "sqmt":
      case "square meters":
        return areaNum * 10.7639;
      case "acre":
      case "acres":
        return areaNum * 43560;
      default:
        return areaNum; // Return as-is if unit is unknown
    }
  };

  useEffect(() => {
    if (isLoginModalOpen || isContactModalOpen || openContactModalAfterLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoginModalOpen, isContactModalOpen, openContactModalAfterLogin]);

  return (
    <div className="w-full px-3 py-8 bg-white sm:px-5 md:px-8 lg:px-10 xl:px-12">
      <div className="w-full bg-slate-50 rounded">
        <div className="w-full sm:px-6 lg:px-4">
          <div className="flex flex-col gap-4 px-5 pt-6 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col">
              <h2 className="mb-2 text-2xl font-bold tracking-wide text-gray-800 sm:text-3xl">
                Featured Properties
              </h2>
              <p className="text-gray-500">Go from browsing to buying</p>
            </div>

            <div className="flex items-center gap-3 mt-2 lg:mt-0">
              <button
                className="px-5 py-2.5 text-sm font-medium bg-white border rounded-lg transition hover:bg-gray-50"
                onClick={handleClick}
              >
                View All Properties
              </button>

              <button
                className="flex items-center justify-center w-11 h-11 bg-white rounded-full shadow-md transition hover:shadow-xl"
                onClick={() => sliderRef.current.slickPrev()}
              >
                <GoArrowLeft className="text-3xl text-black" />
              </button>

              <button
                className="p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md sm:text-2xl hover:shadow-lg "
                onClick={() => sliderRef.current.slickNext()}
              >
                <GoArrowRight className="text-3xl text-black" />
              </button>
            </div>
          </div>

          <Slider {...settings} className="slider-container" ref={sliderRef}>
            {properties?.map((property) => {
              const getValidImageUrl = (img) => {
                if (typeof img !== "string" || !img.trim()) return null;
                return img.startsWith("http") ? img : BASE_URL + img;
              };

              const coverImage = getValidImageUrl(property.cover_image);
              const additionalImages = (property.property_images || [])
                .map((imgObj) => getValidImageUrl(imgObj?.image))
                .filter(Boolean);
              const allImages = [
                ...(coverImage ? [coverImage] : []),
                ...additionalImages,
              ];

              return (
                <div
                  key={property._id}
                  className="px-2 py-4"
                >
                  <div className="property-card flex flex-col h-full min-h-[520px] bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex flex-col h-full w-full overflow-hidden rounded-xl">
                      <div className="relative">
                        <Link
                          to={`/propertydetails/${property._id}`}
                          className="block"
                        >
                          {allImages.length > 1 ? (
                            <Slider
                              key={`${property._id}-${activeIndexes[property._id] || 0}`}
                              dots
                              infinite
                              speed={500}
                              slidesToShow={1}
                              slidesToScroll={1}
                              arrows
                              autoplay
                              autoplaySpeed={2000}
                              beforeChange={(current, next) =>
                                setActiveIndexes((prev) => ({
                                  ...prev,
                                  [property._id]: next,
                                }))
                              }
                              initialSlide={activeIndexes[property._id] || 0}
                              customPaging={(i) => {
                                const activeSlide =
                                  activeIndexes[property._id] || 0;
                                const isActive =
                                  i === activeSlide % allImages.length;
                                return (
                                  <div
                                    style={{
                                      width: "10px",
                                      height: "10px",
                                      borderRadius: "50%",
                                      background: isActive ? "#fff" : "#888",
                                      margin: "0 5px",
                                      cursor: "pointer",
                                    }}
                                  />
                                );
                              }}
                              appendDots={(dots) => (
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: "10px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    display: "flex",
                                    justifyContent: "center",
                                    width: "100%",
                                  }}
                                >
                                  {dots}
                                </div>
                              )}
                              className="rounded-t-2xl"
                            >
                              {allImages.map((imgUrl, idx) => (
                                <div key={`${property._id}-${idx}`}>
                                  <img
                                    src={imgUrl}
                                    alt="Property"
                                    className="w-full h-[220px] object-cover rounded-t-2xl"
                                  />
                                </div>
                              ))}
                            </Slider>
                          ) : (
                            <img
                              src={allImages[0] || "/image/app.png"}
                              alt="Property"
                              className="w-full h-[220px] object-cover rounded-t-2xl"
                              loading="lazy"
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          )}
                        </Link>
                        {/* Days on Houzza */}
                        <span className="absolute px-2 py-1 text-xs font-normal text-white rounded-full top-2 left-2 bg-gray-800/60 backdrop-blur-sm">
                          {property.days_since_created} days on NoWayBroker
                        </span>

                        {/* Virtual Tour & Favorite Button */}
                        <div className="absolute flex items-center space-x-2 top-2 right-2">
                          {property.virtual_tour_availability === "Yes" && (
                            <span className="flex items-center gap-1 px-2 py-1 text-xs font-normal text-white rounded-full bg-gray-800/60 backdrop-blur-sm">
                              <PiCubeFocus className="text-sm text-white" />
                              Virtual Tour
                            </span>
                          )}
                          <button
                            className="flex items-center justify-center w-10 h-10 rounded-full shadow bg-gray-900/60 backdrop-blur-md"
                            onClick={() => {
                              if (!accessToken) {
                                setIsLoginModalOpen(true);
                                return;
                              }
                              if (property.is_favorite) {
                                removeFromFavorites(property.favorite_id);
                              } else {
                                addToFavorites(property._id);
                              }
                            }}
                          >
                            <Heart
                              size={22}
                              stroke={property.is_favorite ? "none" : "white"}
                              color={
                                property.is_favorite
                                  ? "red"
                                  : "rgba(75, 85, 99, 0.4) "
                              }
                              fill={
                                property.is_favorite
                                  ? "red"
                                  : "rgba(75, 85, 99, 0.4) "
                              }
                              strokeWidth={2}
                            />
                          </button>
                        </div>

                        {/* FOR BUY / RENT & FEATURED tags */}
                        <div className="absolute bottom-0 left-0">
                          {(() => {
                            const rawCategory =
                              property.property_category_type || "";

                            const normalizedCategory = rawCategory
                              .replace(/\s+/g, " ")
                              .replace(/-/g, " ")
                              .replace(/\//g, " ")
                              .trim()
                              .toLowerCase();

                            let matchedType = "UNKNOWN";
                            let badgeColor = "bg-gray-500";

                            if (normalizedCategory === "buy") {
                              matchedType = "FOR BUY";
                              badgeColor = "bg-green-500";
                            } else if (normalizedCategory === "rent") {
                              matchedType = "FOR RENT";
                              badgeColor = "bg-blue-500";
                            } else if (
                              normalizedCategory.includes("commercial buy")
                            ) {
                              matchedType = "COMMERCIAL BUY";
                              badgeColor = "bg-purple-500";
                            } else if (
                              normalizedCategory.includes("commercial lease")
                            ) {
                              matchedType = "COMMERCIAL LEASE";
                              badgeColor = "bg-indigo-500";
                            } else if (
                              normalizedCategory.includes("pg") ||
                              normalizedCategory.includes("co living") ||
                              normalizedCategory.includes("coliving")
                            ) {
                              matchedType = "PG / CO-LIVING";
                              badgeColor = "bg-yellow-500";
                            }

                            return (
                              <span
                                className={`text-white text-xs px-3 py-1 rounded-se-lg ${badgeColor}`}
                              >
                                {matchedType}
                              </span>
                            );
                          })()}
                        </div>
                        <div className="absolute bottom-0 right-0">
                          {property.mark_as_featured === "Yes" && (
                            <span className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-ss-lg">
                              FEATURED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Property Details */}
                      {/* Property Details Wrapper */}
                      <div className="flex flex-col flex-1 justify-between p-4 bg-white">
                        <h4 className="h-[56px] flex items-start text-lg font-semibold leading-7 text-gray-900 line-clamp-2">
                          {property.property_name}
                        </h4>

                        {/* Price - Isko aap Image wale div ke andar 'absolute' position pe bhi daal sakte hain */}
                        <div className="flex items-center h-10 mb-2">
                          <h3 className="flex items-center text-2xl font-bold text-gray-900">
                            <FaRupeeSign className="mr-0.5 text-sm" />
                            {property.property_category_type === "Rent"
                              ? formatPrice(property.rent)
                              : formatPrice(property.property_price)}
                            {property.property_category_type === "Rent" &&
                              property.rent_duration && (
                                <span className="ml-1 text-xs font-normal text-gray-500">
                                  / {property.rent_duration}
                                </span>
                              )}
                          </h3>
                        </div>

                        {/* BHK and Property Type */}
                        <div className="h-[32px] mb-2">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                            {property.bhk_type} {property.property_type},{" "}
                            {property.bathrooms || "2"} Baths
                          </p>
                        </div>

                        {/* Address / Locality */}
                        <div className="h-[46px] mb-3">
                          <p className="text-xs text-gray-500 truncate sm:text-sm">
                            In{" "}
                            <span className="font-medium text-gray-700">
                              {property.property_name || property.address_area}
                            </span>
                            , Pune
                          </p>
                        </div>

                        {/* Divider (Optional) */}
                        <hr className="my-4 border-gray-100" />

                        {/* Footer: Posted by & Time */}
                        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
                          <div className="flex flex-col">
                            <span className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wide">
                              Posted by {property.user_type || "Owner"}
                            </span>
                            {/* Time Ago - Static example like image */}
                            <span className="text-[11px] text-gray-400">
                              1 month ago
                            </span>
                          </div>

                          {/* Share or Heart Icon */}
                          <div className="flex space-x-2">
                            <FontAwesomeIcon
                              icon={faShareNodes}
                              className="text-xl text-gray-400 transition cursor-pointer hover:text-blue-600"
                              onClick={(e) => {
                                e.preventDefault();
                                openRecommendedShareModal(property._id);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div >
      <div
        id="shareModal"
        className="fixed bottom-0 right-0 z-50 items-center justify-center hidden bg-black bg-opacity-50"
      >
        <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-bold">Share this link</h5>
            <button onClick={closeShareModal}>&times;</button>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="text"
              className="flex-grow p-2 border rounded form-control"
              value={currentShareUrl}
              readOnly
            />
            <button
              className="p-2 ml-2 bg-gray-200 rounded"
              onClick={(e) => copyLink(e)}
            >
              Copy Link
            </button>
          </div>
          <div className="flex justify-around">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                currentShareUrl,
              )}`}
              className="btn btn-success"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                currentShareUrl,
              )}`}
              className="btn btn-primary"
            >
              Facebook
            </a>
            <a href="https://www.instagram.com" className="btn btn-danger">
              Instagram
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                currentShareUrl,
              )}`}
              className="btn btn-info"
            >
              Twitter
            </a>
            <a
              href={`mailto:?subject=Check out this page&body=${encodeURIComponent(
                currentShareUrl,
              )}`}
              className="btn btn-secondary"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      <Login1
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignUp={() => {
          setIsLoginModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
      />
      <SignUp1
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpModalOpen(false);
          setIsLoginModalOpen(true);
          fetchHomeData();
        }}
      />
    </div >
  );
};

export default RecommendedProperties;
