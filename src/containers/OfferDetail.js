import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { Heart } from "lucide-react";
import {
  FaBath,
  FaWhatsapp,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { RiRuler2Line } from "react-icons/ri";
import { MdApartment } from "react-icons/md";
import { AiOutlineUser, AiOutlineClockCircle } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import { PiShareNetworkLight, PiCubeFocus } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ShareModal from "./ShareModal";

// Same distance helper used in AdvisorDashboard
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
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

const userLocation = JSON.parse(sessionStorage.getItem("userLocation"));

const OfferDetail = () => {
  const location = useLocation();
  const offer =
    location.state?.offer ||
    JSON.parse(localStorage.getItem("lastOffer") || "{}");

  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const OfferPropertyCard = () => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [currentShareUrl, setCurrentShareUrl] = useState("");

    const propertyData = offer.property_data || offer || {};

    // local favorite state
    const [isFavorite, setIsFavorite] = useState(
      propertyData.is_favorite || false,
    );

    const BASE_URL = process.env.REACT_APP_API_URL;

    const getValidImageUrl = (img) => {
      if (typeof img !== "string" || !img.trim()) return null;
      return img.startsWith("http") ? img : BASE_URL + img;
    };

    const coverImage =
      getValidImageUrl(propertyData.cover_image) || "/image/property-search.jpg";

    const phoneNumber =
      propertyData.connect_to_no ||
      propertyData.owner_mobile ||
      propertyData.contact_number ||
      propertyData.mobile_number ||
      propertyData.property_owner_mobile;

    // --- Add to favorites ---
    const addToFavorites = async () => {
      if (!accessToken) {
        toast.error("Please login first");
        return;
      }
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/add_to_favorite`,
          { user_id: accessToken, property_id: propertyData._id },
        );
        setIsFavorite(true);
      } catch (error) {
        console.error("Error adding property to favorites:", error);
      }
    };

    // --- Remove from favorites ---
    const removeFromFavorites = async () => {
      const formData = new FormData();
      formData.append("favorite_id", propertyData.favorite_id);

      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/cust_api/remove_from_favorite`,
          { data: formData },
        );

        if (response.data.status === 1) {
          setIsFavorite(false);
        } else {
          console.error("Failed to remove:", response.data.message);
        }
      } catch (error) {
        console.error("Error unfavoriting:", error);
      }
    };

    const handleFavoriteClick = (e) => {
      e.preventDefault();
      if (!accessToken) {
        toast.error("Please login first");
        return;
      }
      if (isFavorite) {
        removeFromFavorites();
      } else {
        addToFavorites();
      }
    };

    // --- Share ---
    const openShareModal = () => {
      setCurrentShareUrl(
        `${window.location.origin}/propertydetails/${propertyData._id}`,
      );
      setShowShareModal(true);
    };
    const closeShareModal = () => setShowShareModal(false);
    const copyLink = () => {
      navigator.clipboard.writeText(currentShareUrl);
    };

    const formatPrice = (price) => {
      if (!price) return "";
      price = parseInt(price);

      const formatNumber = (num) =>
        num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);

      if (price >= 10000000) return `₹ ${formatNumber(price / 10000000)} Cr`;
      if (price >= 100000) return `₹ ${formatNumber(price / 100000)} L`;
      if (price >= 1000) return `₹ ${formatNumber(price / 1000)} K`;
      return `₹ ${price}`;
    };

    const handleCall = (e) => {
      if (!phoneNumber) {
        e.preventDefault();
        toast.error("Contact number not available");
      }
    };

    const handleWhatsApp = (e) => {
      if (!phoneNumber) {
        e.preventDefault();
        toast.error("Contact number not available");
      }
    };

    // Distance from user (same logic as AdvisorDashboard)
    let distance = null;
    if (
      userLocation &&
      propertyData.latitude &&
      propertyData.longitude
    ) {
      distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(propertyData.latitude),
        parseFloat(propertyData.longitude),
      ).toFixed(1);
    }

    // Subtitle line (same logic as AdvisorDashboard)
    const subtitle = (() => {
      const area = propertyData.address_area || "";
      const city = propertyData.city_name || "";

      const loc = area.toLowerCase().includes(city.toLowerCase())
        ? area
        : `${area}${area && city ? ", " : ""}${city}`;

      const type =
        propertyData.property_type === "Office"
          ? "Office Space"
          : propertyData.property_type === "Retail"
            ? "Retail Space"
            : propertyData.property_type || "";

      const category = propertyData.property_category_type || "";

      if (category === "Commercial Buy" || category === "Commercial Lease") {
        return `${type} for ${category === "Commercial Buy" ? "Sale" : "Lease"
          } in ${loc}`;
      }

      if (
        category.includes("PG") ||
        category.includes("Co-Living") ||
        category.includes("Coliving")
      ) {
        return `${type} for Rent in ${loc}`;
      }

      const action = category === "Buy" ? "Sale" : category;

      return `${propertyData.bhk_type || ""} ${type} for ${action} in ${loc}`;
    })();

    // Bottom-left category badge (same logic as AdvisorDashboard)
    const renderCategoryBadge = () => {
      const rawCategory = propertyData.property_category_type || "";

      const normalizedCategory = rawCategory
        .replace(/\s+/g, " ")
        .replace(/-/g, " ")
        .replace(/\//g, " ")
        .trim()
        .toLowerCase();

      let badgeText = "UNKNOWN";
      let badgeColor = "bg-gray-500";

      if (normalizedCategory === "buy") {
        badgeText = "FOR BUY";
        badgeColor = "bg-green-500";
      } else if (normalizedCategory === "rent") {
        badgeText = "FOR RENT";
        badgeColor = "bg-blue-500";
      } else if (normalizedCategory.includes("commercial buy")) {
        badgeText = "COMMERCIAL BUY";
        badgeColor = "bg-purple-500";
      } else if (normalizedCategory.includes("commercial lease")) {
        badgeText = "COMMERCIAL LEASE";
        badgeColor = "bg-indigo-500";
      } else if (
        normalizedCategory.includes("pg") ||
        normalizedCategory.includes("co living") ||
        normalizedCategory.includes("coliving")
      ) {
        badgeText = "PG / CO-LIVING";
        badgeColor = "bg-yellow-500";
      } else if (normalizedCategory.includes("residential")) {
        badgeText = "RESIDENTIAL";
        badgeColor = "bg-pink-500";
      }

      return (
        <span
          className={`text-white text-xs px-3 py-1 rounded-se-lg ${badgeColor}`}
        >
          {badgeText}
        </span>
      );
    };

    return (
      <div className="bg-white py-4 ml-10 mr-10 rounded-2xl">
        <div className="flex items-center justify-between px-2 mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Offer Property Details
          </h2>
        </div>

        {/* Offer Details Banner - unchanged */}
        {offer && (
          <div className="mx-2 mb-6 overflow-hidden bg-white shadow-lg rounded-2xl">
            <img
              src={
                offer.property_data?.cover_image
                  ? `${process.env.REACT_APP_API_URL}${offer.property_data.cover_image}`
                  : "/image/property-search.jpg"
              }
              alt="Offer Property Cover"
              className="object-cover w-full h-72"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {offer.property_data?.property_name || "Property Name"}
              </h3>
              <p className="text-sm text-gray-600">
                {offer.property_data?.property_description ||
                  "Property Description"}
              </p>
            </div>
          </div>
        )}

        <div className="px-2">
          <div
            className={`w-full sm:w-[420px] shadow-md rounded-2xl overflow-hidden block no-underline hover:no-underline`}
          >
            {/* Image + overlays */}
            <div className="relative">
              <Link
                to={`/propertydetails/${propertyData._id}`}
                className="block overflow-hidden no-underline bg-white border-2 rounded-lg hover:no-underline"
              >
                <img
                  src={coverImage}
                  alt="Property"
                  className="object-cover w-full h-48 rounded-t-2xl"
                />
              </Link>

              {/* Virtual Tour & Favorite Button */}
              <div className="absolute flex items-center space-x-2 top-2 right-2">
                {propertyData.virtual_tour_availability === "Yes" && (
                  <span className="flex items-center gap-1 px-2 py-1 text-xs font-normal text-white rounded-full bg-gray-800/60 backdrop-blur-sm">
                    <PiCubeFocus className="text-sm text-white" />
                    Virtual Tour
                  </span>
                )}
                <button
                  className="bg-gray-800/60 backdrop-blur-sm p-1.5 rounded-full shadow"
                  onClick={handleFavoriteClick}
                >
                  <Heart
                    size={20}
                    stroke={isFavorite ? "none" : "white"}
                    color={isFavorite ? "red" : "rgba(75, 85, 99, 0.4)"}
                    fill={isFavorite ? "red" : "rgba(75, 85, 99, 0.4)"}
                    strokeWidth={2}
                  />
                </button>
              </div>

              {/* Category Tag (Bottom Left) */}
              <div className="absolute bottom-0 left-0">
                {renderCategoryBadge()}
              </div>

              {/* FEATURED Tag (Bottom Right) */}
              {propertyData.mark_as_featured === "Yes" && (
                <div className="absolute bottom-0 right-0">
                  <span className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-ss-lg">
                    FEATURED
                  </span>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="flex flex-col flex-1 p-3 text-black bg-white">
              <div className="flex items-start justify-between gap-3 mb-0">
                <h3
                  className="flex-1 m-0 text-lg font-semibold leading-6 text-gray-900 truncate"
                  title={propertyData.property_name}
                >
                  {propertyData.property_name || "N/A"}
                </h3>
                <span
                  className="flex-shrink-0 m-0 text-sm font-medium leading-6 text-black sm:text-base whitespace-nowrap"
                  title={propertyData.furnished_type}
                >
                  {propertyData.furnished_type || "Un-Furnished"}
                </span>
              </div>

              <p
                className="mt-0 mb-1 text-sm leading-5 text-gray-600 truncate"
                title={subtitle}
              >
                {subtitle}
              </p>

              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <span className="text-2xl font-bold">
                    {propertyData.property_category_type === "Rent"
                      ? formatPrice(propertyData.rent).replace("₹ ", "₹ ")
                      : formatPrice(propertyData.property_price)}
                  </span>
                  {propertyData.property_category_type === "Rent" && (
                    <span className="ml-1 text-sm text-gray-500">
                      / {propertyData.rent_duration}
                    </span>
                  )}
                  {propertyData.property_category_type?.includes("Buy") &&
                    propertyData.possession_status === "Ready To Move" && (
                      <div className="flex items-center gap-2 px-3 py-1 ml-6 bg-green-100 border border-green-200 rounded-full">
                        <MdApartment className="text-base text-green-700" />
                        <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
                          Ready to Move
                        </span>
                      </div>
                    )}
                </div>
                <div className="text-sm font-medium whitespace-nowrap">
                  {propertyData.property_category_type?.includes("Buy") &&
                    propertyData.possession_status !== "Ready To Move" &&
                    propertyData.possession_date && (
                      <>
                        <span className="text-gray-500">Possession:</span>
                        <span className="ml-1 font-semibold">
                          {new Date(
                            propertyData.possession_date,
                          ).toLocaleDateString("en-IN")}
                        </span>
                      </>
                    )}
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-3 py-3 border-t border-b border-gray-100">
                <div className="flex items-center gap-2 px-3 min-w-0">
                  <MdApartment className="text-[22px] text-gray-700 flex-shrink-0" />
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="m-0 text-sm font-semibold leading-4 truncate">
                      {propertyData.building_type === "Commercial"
                        ? propertyData.property_type === "Office"
                          ? "Office Space"
                          : propertyData.property_type === "Retail"
                            ? "Retail Space"
                            : propertyData.property_type
                        : propertyData.property_category_type?.includes("PG")
                          ? `${propertyData.bathroom || 0} Bathrooms`
                          : propertyData.bhk_type}
                    </p>
                    <p className="m-0 text-xs leading-4 text-gray-500 truncate">
                      {propertyData.building_type === "Commercial"
                        ? "Property Type"
                        : propertyData.property_category_type?.includes("PG")
                          ? "Bathrooms"
                          : propertyData.property_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 border-l border-gray-200 min-w-0">
                  {propertyData.property_category_type?.includes("PG") ? (
                    <FaUser className="text-[20px] text-gray-700 flex-shrink-0" />
                  ) : (
                    <FaBath className="text-[20px] text-gray-700 flex-shrink-0" />
                  )}
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="m-0 text-sm font-semibold leading-4 truncate">
                      {propertyData.property_category_type?.includes("PG")
                        ? propertyData.available_for
                        : `${propertyData.bathroom || 0} Baths`}
                    </p>
                    <p className="m-0 text-xs leading-4 text-gray-500 truncate">
                      {propertyData.property_category_type?.includes("PG")
                        ? "Available For"
                        : "Bathrooms"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 border-l border-gray-200 min-w-0">
                  <RiRuler2Line className="text-[22px] text-gray-700 flex-shrink-0" />
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="m-0 text-sm font-semibold leading-4 truncate">
                      {propertyData.area
                        ? `${propertyData.area} ${propertyData.area_in || ""}`
                        : "N/A"}
                    </p>
                    <p className="m-0 text-xs leading-4 text-gray-500 truncate">
                      Built Up Area
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-1 border-gray-100" />

              {/* Posted By + Distance + Share (single line, no wrap) */}
              <div className="flex items-center justify-between gap-2 pt-1 pb-2 text-[13px] text-gray-600">
                <div className="flex items-center flex-1 min-w-0 gap-1 overflow-hidden flex-nowrap">
                  <AiOutlineClockCircle className="text-[15px] text-gray-700 flex-shrink-0" />
                  <span className="truncate">
                    {`Posted by ${propertyData.user_type ||
                      propertyData.property_owner_type ||
                      "Owner"
                      }`}
                  </span>
                  {propertyData.days_since_created && (
                    <span className="flex-shrink-0 whitespace-nowrap">
                      &nbsp;• {propertyData.days_since_created} days ago
                    </span>
                  )}
                  {distance && (
                    <span className="flex items-center flex-shrink-0 whitespace-nowrap">
                      &nbsp;•&nbsp;
                      <FaMapMarkerAlt className="mr-1 text-red-500" />
                      {distance} km from you
                    </span>
                  )}
                </div>
                <PiShareNetworkLight
                  className="flex-shrink-0 ml-2 text-[20px] text-gray-500 cursor-pointer hover:text-blue-500"
                  onClick={openShareModal}
                />
              </div>

              {/* Owner + Contact Buttons */}
              <div className="flex items-center justify-between pt-3 gap-2">
                <div className="flex items-center min-w-0">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 overflow-hidden rounded-full bg-blue-100">
                    {propertyData.property_owner_image ? (
                      <img
                        src={`${BASE_URL}/media/${propertyData.property_owner_image}`}
                        alt="Owner"
                        className="object-cover w-full h-full rounded-full"
                      />
                    ) : (
                      <AiOutlineUser className="text-blue-600" size={24} />
                    )}
                  </div>
                  <div className="flex flex-col ml-3 min-w-0">
                    <span
                      className="text-sm font-semibold text-gray-900 truncate"
                      title={propertyData.connect_to_name}
                    >
                      {propertyData.connect_to_name || "Owner"}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {propertyData.user_type ||
                        propertyData.property_owner_type ||
                        "Owner"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={phoneNumber ? `tel:${phoneNumber}` : "#"}
                    onClick={handleCall}
                    className="flex items-center justify-center px-4 h-9 text-sm font-semibold text-white bg-red-800 rounded-md hover:bg-red-900 whitespace-nowrap"
                  >
                    Contact
                  </a>
                  <a
                    href={
                      phoneNumber
                        ? `https://wa.me/91${phoneNumber}?text=Hello, I am interested in your property`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center w-9 h-9 text-white bg-green-500 rounded-md hover:bg-green-600"
                  >
                    <FaWhatsapp />
                  </a>
                  <a
                    href={phoneNumber ? `tel:${phoneNumber}` : "#"}
                    onClick={handleCall}
                    className="flex items-center justify-center w-9 h-9 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    <FaPhone />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <ShareModal
            currentShareUrl={currentShareUrl}
            closeShareModal={closeShareModal}
            copyLink={copyLink}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <OfferPropertyCard />
    </div>
  );
};

export default OfferDetail;