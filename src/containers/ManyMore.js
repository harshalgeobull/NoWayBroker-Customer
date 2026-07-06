import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { MdApartment } from "react-icons/md";
import { FaBath, FaUser, FaWhatsapp, FaPhone } from "react-icons/fa";
import { RiRuler2Line } from "react-icons/ri";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "react-slick";
import { Ruler } from "lucide-react";

import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { CiHeart } from "react-icons/ci";
import { useHistory } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import "../styles/RecommendedProperties.css";
import { FaRupeeSign } from "react-icons/fa"; // Icon for price
import { BsHouseDoorFill, BsArrowsFullscreen } from "react-icons/bs"; // Icon for property type
import { faChair } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineUser } from "react-icons/ai";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { PiCubeFocus, PiShareNetworkLight } from "react-icons/pi";
import { BiShapeSquare } from "react-icons/bi";
import { Heart } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Login1 from "../auth/Login1";
import SignUp1 from "../auth/SignUp1";
import ContactDetails from "../containers/ContactDetails";

const sliderFixStyles = `
  .slider-container .slick-track {
    display: flex !important;
    align-items: stretch;
  }
  .slider-container .slick-slide {
    height: auto !important;
    display: flex !important;
  }
  .slider-container .slick-slide > div {
    width: 100%;
    display: flex;
  }
`;

const userLocation = JSON.parse(sessionStorage.getItem("userLocation"));

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const ManyMore = ({
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState([]);
  const history = useHistory();
  const defaultImage = "/image/appstore.png";
  const userId = sessionStorage.getItem("accessToken");
  const accessToken = sessionStorage.getItem("accessToken");

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  // Contact details / view-limit state
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [freeViewCount, setFreeViewCount] = useState(0);
  const [paidViewCount, setPaidViewCount] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const fetchRecommendedProperties = async () => {
    try {
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

  useEffect(() => {
    fetchRecommendedProperties();
  }, [data]);

  const handleClick = () => {
    history.push("/recommendedpropertiesDashboard");
  };

  // Add property to favorites
  const addToFavorites = async (propertyId) => {
    if (!userId) {
      toast.error("Please log in to save properties to your favorites.");
      return;
    }

    const data = { user_id: userId, property_id: propertyId };

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_to_favorite`,
        data,
      );

      fetchHomeData();
    } catch (error) {
      console.log("Failed to save the property. Please try again.");
      fetchHomeData();
    }
  };

  // Remove property from favorites
  const removeFromFavorites = async (FavoriteId) => {
    if (!userId) {
      toast.error("Please log in to remove properties from your favorites.");
      return;
    }

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cust_api/remove_from_favorite`,
        { data: { favorite_id: FavoriteId } },
      );

      fetchHomeData();
    } catch (error) {
      console.log("Failed to remove the property. Please try again.");
      fetchHomeData();
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

  // Slider settings
  const [activeIndexes, setActiveIndexes] = useState({});
  const BASE_URL = process.env.REACT_APP_API_URL;
  const settings = {
    dots: false,
    infinite: properties.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,

    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
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

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3000ms = 3 seconds for auto-slide

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [images.length]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ===== Contact view-limit logic (matches AdvisorDashboard / FeaturedDashboard) =====
  const checkPostLimits = async () => {
    try {
      const profileForm = new FormData();
      profileForm.append("user_id", accessToken);

      const profileResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
        profileForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const countData = profileResponse?.data?.count_data;

      if (countData) {
        setFreeViewCount(countData.free_view_count || 0);
        setPaidViewCount(countData.paid_view_count || 0);
      }
    } catch (error) {
      console.error("Error checking post limits:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      checkPostLimits();
    }
  }, [accessToken]);

  const handleAddCount = async () => {
    try {
      const addCountFormData = new FormData();

      if (freeViewCount > 0) {
        addCountFormData.append("free_view_count", -1);
      } else {
        addCountFormData.append("paid_view_count", -1);
      }

      addCountFormData.append("user_id", accessToken);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/add_count`,
        {
          method: "POST",
          body: addCountFormData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        checkPostLimits();
      } else {
        console.error("Failed to update count:", data.message);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleContactClick = async (property) => {
    if (!accessToken) {
      setIsLoginModalOpen(true);
      return;
    }

    setSelectedProperty(property);

    if (freeViewCount > 0) {
      await handleAddCount();

      setShowUpgradePrompt(false);
      setIsContactModalOpen(true);
      return;
    }

    if (paidViewCount > 0) {
      await handleAddCount();

      setShowUpgradePrompt(false);
      setIsContactModalOpen(true);
      return;
    }

    setShowUpgradePrompt(true);
    setIsContactModalOpen(true);
  };

  return (
    <>
      <style>{sliderFixStyles}</style>
      <div className="w-full px-0 py-4 bg-white">
        <div className="w-full bg-slate-50 rounded-2xl">
          <div className="w-full">
            <div className="flex flex-col gap-4 px-6 pt-6 mb-4 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col">
                <h2 className="mb-2 text-2xl font-bold tracking-wide text-gray-800 sm:text-3xl">
                  Exclusive Recommended Properties
                </h2>
                <p className="text-lg text-gray-500">
                  Go from browsing to buying
                </p>
              </div>

              <div className="flex items-center mt-4 space-x-3 sm:space-x-5 sm:mt-0">
                <button
                  className="px-4 py-2 text-sm bg-white rounded-lg my-text my-border sm:px-6"
                  onClick={handleClick}
                >
                  View All Properties
                </button>

                <button
                  className="p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md sm:text-2xl hover:shadow-lg"
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
              {properties.map((property) => {
                let distance = null;
                const subtitle = (() => {
                  const area = property.address_area || "";
                  const city = property.city_name || "";

                  const location = area.toLowerCase().includes(city.toLowerCase())
                    ? area
                    : `${area}, ${city}`;

                  const type =
                    property.property_type === "Office"
                      ? "Office Space"
                      : property.property_type === "Retail"
                        ? "Retail Space"
                        : property.property_type || "";

                  const category = property.property_category_type || "";

                  // Commercial Properties
                  if (
                    category === "Commercial Buy" ||
                    category === "Commercial Lease"
                  ) {
                    return `${type} for ${category === "Commercial Buy" ? "Sale" : "Lease"
                      } in ${location}`;
                  }

                  // PG / Co-Living
                  if (
                    category.includes("PG") ||
                    category.includes("Co-Living") ||
                    category.includes("Coliving")
                  ) {
                    return `${type} for Rent in ${location}`;
                  }

                  // Residential
                  const action = category === "Buy" ? "Sale" : category;

                  return `${property.bhk_type} ${type} for ${action} in ${location}`;
                })();
                if (userLocation && property.latitude && property.longitude) {
                  distance = calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    parseFloat(property.latitude),
                    parseFloat(property.longitude),
                  ).toFixed(1);
                }
                function getValidImageUrl(img) {
                  if (typeof img !== "string") return null;
                  if (img.trim() === "") return null;
                  return img.startsWith("http") ? img : BASE_URL + img;
                }

                const coverImage = getValidImageUrl(property.cover_image);
                const additionalImages = (property.property_images || [])
                  .map((imgObj) => getValidImageUrl(imgObj?.image))
                  .filter(Boolean);
                const allImages = [
                  ...(coverImage ? [coverImage] : []),
                  ...additionalImages,
                ];

                return (
                  <div key={property._id} className="box-border p-2 h-full">
                    <div className="flex flex-col h-full w-full shadow-md rounded-2xl overflow-hidden">
                      <div className="relative">
                        <Link
                          to={`/propertydetails/${property._id}`}
                          className="block"
                          onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }
                        >
                          {allImages.length > 1 ? (
                            <Slider
                              key={`${property._id}-${allImages.length}-${Date.now()}`}
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
                                    className="object-cover w-full h-48 rounded-t-2xl"
                                  />
                                </div>
                              ))}
                            </Slider>
                          ) : (
                            <img
                              src={allImages[0] || "/image/app.png"}
                              alt="Property"
                              className="object-cover w-full h-48 rounded-t-2xl"
                            />
                          )}
                        </Link>

                        {/* Virtual Tour & Favorite Button */}
                        <div className="absolute flex items-center space-x-2 top-2 right-2">
                          {property.virtual_tour_availability === "Yes" && (
                            <span className="flex items-center gap-1 px-2 py-1 text-xs font-normal text-white rounded-full bg-gray-800/60 backdrop-blur-sm">
                              <PiCubeFocus className="text-sm text-white" />
                              Virtual Tour
                            </span>
                          )}
                          <button
                            className="p-2 rounded-full shadow bg-gray-800/60 backdrop-blur-sm"
                            onClick={() => {
                              if (!userId) {
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
                                  : "rgba(75, 85, 99, 0.4)"
                              }
                              fill={
                                property.is_favorite
                                  ? "red"
                                  : "rgba(75, 85, 99, 0.4)"
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
                            } else if (normalizedCategory.includes("residential")) {
                              matchedType = "RESIDENTIAL";
                              badgeColor = "bg-pink-500";
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
                      {/* Property Details - Refined 99acres Style */}
                      <div className="flex flex-col justify-between flex-1 p-3 text-black bg-white">

                        {/* Title Row */}
                        <div className="flex items-start justify-between gap-3 mb-0">
                          {/* Property Name */}
                          <h3
                            className="flex-1 m-0 text-lg font-semibold leading-6 text-gray-900 truncate"
                            title={property.property_name}
                          >
                            {property.property_name || "N/A"}
                          </h3>

                          {/* Furnishing */}
                          <span
                            className="flex-shrink-0 m-0 text-sm font-medium leading-6 text-black sm:text-base whitespace-nowrap"
                            title={property.furnished_type}
                          >
                            {property.furnished_type || "Un-Furnished"}
                          </span>
                        </div>
                        <p
                          className="mt-0 mb-1 text-sm leading-5 text-gray-600 truncate"
                          title={subtitle}
                        >
                          {subtitle}
                        </p>
                        <div className="flex items-center justify-between mb-1">
                          {/* Left Side */}
                          <div className="flex items-center">
                            <span className="text-2xl font-bold">
                              ₹{" "}
                              {property.property_category_type === "Rent"
                                ? formatPrice(property.rent)
                                : formatPrice(property.property_price)}
                            </span>

                            {property.property_category_type === "Rent" && property.rent_duration && (
                              <span className="ml-1 text-sm text-gray-500">
                                / {property.rent_duration}
                              </span>
                            )}

                            {/* Ready to Move - Keep close to price */}
                            {property.property_category_type?.includes("Buy") &&
                              property.possession_status ===
                              "Ready To Move" && (
                                <div className="flex items-center gap-2 px-3 py-1 ml-6 bg-green-100 border border-green-200 rounded-full">
                                  <MdApartment className="text-base text-green-700" />
                                  <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
                                    Ready to Move
                                  </span>
                                </div>
                              )}
                          </div>

                          {/* Right Side */}
                          <div className="text-sm font-medium whitespace-nowrap">
                            {property.property_category_type === "Rent" && (
                              <>
                                <span className="text-gray-500">Deposit:</span>
                                <span className="ml-1 font-semibold">
                                  ₹{" "}
                                  {property.custom_deposit_amount?.toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              </>
                            )}

                            {property.property_category_type?.includes("Buy") &&
                              property.possession_status !== "Ready To Move" &&
                              property.possession_date && (
                                <>
                                  <span className="text-gray-500">
                                    Possession:
                                  </span>
                                  <span className="ml-1 font-semibold">
                                    {new Date(
                                      property.possession_date,
                                    ).toLocaleDateString("en-IN")}
                                  </span>
                                </>
                              )}
                          </div>
                        </div>
                        {/* Features Row */}
                        <div className="grid grid-cols-3 py-3 border-t border-b border-gray-100">
                          {/* First Column */}
                          <div className="flex items-center gap-2 px-3 min-w-0">
                            <MdApartment className="text-[22px] text-gray-700 flex-shrink-0" />

                            <div className="flex flex-col justify-center min-w-0">
                              <p className="m-0 text-sm font-semibold leading-4 truncate">
                                {property.building_type === "Commercial"
                                  ? property.property_type === "Office"
                                    ? "Office Space"
                                    : property.property_type === "Retail"
                                      ? "Retail Space"
                                      : property.property_type
                                  : property.property_category_type?.includes(
                                    "PG",
                                  )
                                    ? `${property.bathroom || 0} Bathrooms`
                                    : property.bhk_type}
                              </p>

                              <p className="m-0 text-xs leading-4 text-gray-500 truncate">
                                {property.building_type === "Commercial"
                                  ? "Property Type"
                                  : property.property_category_type?.includes(
                                    "PG",
                                  )
                                    ? "Bathrooms"
                                    : property.property_type}
                              </p>
                            </div>
                          </div>

                          {/* Second Column */}
                          <div className="flex items-center gap-2 px-3 border-l border-gray-200 min-w-0">
                            {property.property_category_type?.includes("PG") ? (
                              <FaUser className="text-[20px] text-gray-700 flex-shrink-0" />
                            ) : (
                              <FaBath className="text-[20px] text-gray-700 flex-shrink-0" />
                            )}

                            <div className="flex flex-col justify-center min-w-0">
                              <p className="m-0 text-sm font-semibold leading-4 truncate">
                                {property.property_category_type?.includes("PG")
                                  ? property.available_for
                                  : `${property.bathroom || 0} Baths`}
                              </p>

                              <p className="m-0 text-xs leading-4 text-gray-500 truncate">
                                {property.property_category_type?.includes("PG")
                                  ? "Available For"
                                  : "Bathrooms"}
                              </p>
                            </div>
                          </div>

                          {/* Third Column */}
                          <div className="flex items-center gap-2 px-3 border-l border-gray-200 min-w-0">
                            <RiRuler2Line className="text-[22px] text-gray-700 flex-shrink-0" />

                            <div className="flex flex-col justify-center min-w-0">
                              <p className="m-0 text-sm font-semibold leading-4 truncate">
                                {property.area} {property.area_in}
                              </p>

                              <p className="m-0 text-xs leading-4 text-gray-500 truncate">
                                Built Up Area
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Divider */}
                        <hr className="my-1 border-gray-100" />

                        {/* Row 5 : Posted By | Days | Distance | Share */}
                        <div className="flex items-center justify-between pt-1 pb-2 text-[13px] text-gray-600">
                          {/* Left */}
                          <div className="flex items-center flex-wrap min-w-0">
                            {/* Posted By */}
                            <div className="flex items-center">
                              <AiOutlineClockCircle className="mr-1 text-[15px] text-gray-700" />
                              <span className="truncate">
                                Posted by {property.user_type || "Owner"}
                              </span>
                            </div>

                            {/* Dot */}
                            <span className="mx-2 text-gray-400">•</span>

                            {/* Days */}

                            <span className="whitespace-nowrap">
                              {property.days_since_created
                                ? `${property.days_since_created} ${property.days_since_created == 1 ? "day" : "days"} ago`
                                : "Recently"}
                            </span>

                            {/* Distance */}
                            {distance && (
                              <>
                                <span className="mx-2 text-gray-400">•</span>

                                <div className="flex items-center whitespace-nowrap">
                                  <FaMapMarkerAlt className="mr-1 text-red-500" />
                                  {distance} km from you
                                </div>
                              </>
                            )}
                          </div>

                          {/* Share */}
                          <PiShareNetworkLight
                            className="ml-2 text-[20px] text-gray-500 cursor-pointer hover:text-blue-500"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openRecommendedShareModal(property._id);
                            }}
                          />
                        </div>

                        {/* Row 6 : Owner Details + Contact Buttons */}
                        <div className="flex items-center justify-between pt-3 gap-2">
                          <div className="flex items-center min-w-0">
                            {/* Avatar */}
                            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 overflow-hidden rounded-full bg-blue-100">
                              {property.property_owner_image &&
                                !property.property_owner_image.includes(
                                  "default_profile",
                                ) ? (
                                <>
                                  <img
                                    src={`${process.env.REACT_APP_API_URL}/media/${property.property_owner_image}`}
                                    alt={property.connect_to_name || "Owner"}
                                    className="object-cover w-full h-full rounded-full"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display = "flex";
                                    }}
                                  />

                                  {/* Fallback */}
                                  <div className="items-center justify-center hidden w-full h-full">
                                    <AiOutlineUser className="text-2xl text-blue-600" />
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center justify-center w-full h-full">
                                  <AiOutlineUser className="text-2xl text-blue-600" />
                                </div>
                              )}
                            </div>

                            {/* Name & User Type */}
                            <div className="flex flex-col ml-3 min-w-0">
                              <span
                                className="text-sm font-semibold text-gray-900 truncate"
                                title={property.connect_to_name}
                              >
                                {property.connect_to_name || "Owner"}
                              </span>
                              <span className="text-xs text-gray-500 truncate">
                                {property.user_type || "Owner"}
                              </span>
                            </div>
                          </div>

                          {/* RIGHT SIDE - Buttons */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Contact */}
                            <div
                              className="flex items-center justify-center px-4 h-9 text-sm font-semibold text-white bg-red-800 rounded-md cursor-pointer hover:bg-red-900 whitespace-nowrap"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleContactClick(property);
                              }}
                            >
                              Contact
                            </div>

                            {/* WhatsApp */}
                            <a
                              href={`https://wa.me/91${property.connect_to_no}?text=Hello, I am interested in your property`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-center w-9 h-9 text-white bg-green-500 rounded-md hover:bg-green-600"
                            >
                              <FaWhatsapp />
                            </a>
                            {/* Call */}
                            <a
                              href={`tel:${property.connect_to_no}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-center w-9 h-9 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            >
                              <FaPhone />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>

        {isContactModalOpen && selectedProperty && (
          <ContactDetails
            fullName={
              freeViewCount <= 0 && paidViewCount <= 0
                ? `****${selectedProperty.connect_to_name?.slice(-1) || "N/A"}`
                : selectedProperty.connect_to_name || "N/A"
            }
            mobile={
              freeViewCount <= 0 && paidViewCount <= 0
                ? `*******${selectedProperty.connect_to_no?.slice(-3) || "000"}`
                : selectedProperty.connect_to_no || "N/A"
            }
            showUpgradePrompt={showUpgradePrompt}
            onClose={() => setIsContactModalOpen(false)}
          />
        )}

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
          }}
        />
      </div>
    </>
  );
};

export default ManyMore;