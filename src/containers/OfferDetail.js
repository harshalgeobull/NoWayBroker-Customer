import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Ruler, Heart, Building2 } from "lucide-react";
import { FaRupeeSign, FaBath, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { RiRuler2Line } from "react-icons/ri";
import { BsHouseDoorFill } from "react-icons/bs";
import { MdApartment } from "react-icons/md";
import { faChair, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineUser } from "react-icons/ai";
import { PiCubeFocus } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ShareModal from "./ShareModal";

const OfferDetail = () => {
  const location = useLocation();
  const offer =
    location.state?.offer ||
    JSON.parse(localStorage.getItem("lastOffer") || "{}");

  const user_id = sessionStorage.getItem("accessToken");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const RecommendedProperties = ({ data }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [currentShareUrl, setCurrentShareUrl] = useState("");
    const [copied, setCopied] = useState(false);

    // local favorite state
    const [isFavorite, setIsFavorite] = useState(
      offer.property_data?.is_favorite || false,
    );

    // Toggle save/unsave property
    const toggleSaveProperty = async () => {
      if (!user_id) {
        toast.error("Please login first");
        return;
      }

      if (isFavorite) {
        await removeFromFavorites(offer.property_data.favorite_id);
        setIsFavorite(false); // update UI instantly
      } else {
        await addToFavorites(offer.property_data._id);
        setIsFavorite(true); // update UI instantly
      }
    };

    // --- Add to favorites ---
    const addToFavorites = async (PropertyId) => {
      if (!user_id) {
        toast.error("Please login first");
        return;
      }
      const data = { user_id: user_id, property_id: offer.property_id };
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/add_to_favorite`,
          data,
        );
        setIsFavorite(true); // update UI instantly
      } catch (error) {
        console.error("Error adding property to favorites:", error);
      }
    };

    // --- Remove from favorites ---
    const removeFromFavorites = async (favoriteId) => {
      const formData = new FormData();
      formData.append("favorite_id", favoriteId);

      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/cust_api/remove_from_favorite`,
          { data: formData },
        );

        if (response.data.status === 1) {
          setIsFavorite(false); // update UI instantly
        } else {
          console.error("Failed to remove:", response.data.message);
        }
      } catch (error) {
        console.error("Error unfavoriting:", error);
      }
    };

    // --- Share ---
    const openShareModal = (propertyId) => {
      setCurrentShareUrl(
        `${window.location.origin}/propertydetails/${propertyId}`,
      );
      setShowShareModal(true);
      setCopied(false);
    };
    const closeShareModal = () => setShowShareModal(false);
    const copyLink = () => {
      navigator.clipboard.writeText(currentShareUrl);
      setCopied(true);
    };

    const formatPrice = (price) => {
      if (!price) return "";
      if (price >= 10000000)
        return (price / 10000000).toFixed(1).replace(/\.0$/, "") + " Cr";
      if (price >= 100000)
        return (price / 100000).toFixed(1).replace(/\.0$/, "") + " L";
      if (price >= 1000)
        return (price / 1000).toFixed(1).replace(/\.0$/, "") + " K";
      return price.toString();
    };

    const convertToSqFt = (area, unit) => {
      if (!area || !unit) return null;
      switch (unit.toLowerCase()) {
        case "sq ft":
          return area;
        case "sq yard":
          return area * 9;
        case "sq mt":
          return area * 10.7639;
        case "acre":
          return area * 43560;
        default:
          return area;
      }
    };

    const BASE_URL = process.env.REACT_APP_API_URL;

    const getValidImageUrl = (img) => {
      if (typeof img !== "string" || !img.trim()) return null;
      return img.startsWith("http") ? img : BASE_URL + img;
    };
    const coverImage = getValidImageUrl(offer.property_data.cover_image);

    const propertyData = offer.property_data || {};
    const phoneNumber =
      propertyData.owner_mobile ||
      propertyData.contact_number ||
      propertyData.mobile_number ||
      propertyData.property_owner_mobile;

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

    return (
      <div className="bg-white py-4 ml-10 mr-10 rounded-2xl">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Offer Property Details
          </h2>
        </div>

        {/* Offer Details */}
        <div className="grid grid-cols-1 gap-6 pt-6 px-2">
          {offer && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={
                  offer.property_data?.cover_image
                    ? `${process.env.REACT_APP_API_URL}${offer.property_data.cover_image}`
                    : "/image/property-search.jpg"
                }
                alt="Offer Property Cover"
                className="w-full h-72 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {offer.property_data?.property_name || "Property Name"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {offer.property_data?.property_description ||
                    "Property Description"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="py-4 mt-2">
          <div className="rounded-2xl">
            <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
              {/* --- Single Card (Spotlight style) --- */}
              <div className="p-4 box-border">
                <div className="rounded-2xl bg-white overflow-hidden shadow h-full">
                  <div className="relative">
                    <Link
                      to={`/propertydetails/${offer.property_id}`}
                      className="block"
                    >
                      <img
                        src={coverImage || "/image/app.png"}
                        alt="Property"
                        className="w-full h-48 object-cover rounded-t-2xl"
                      />
                    </Link>

                    {/* Virtual Tour + Favorite */}
                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                      {propertyData.virtual_tour_availability === "Yes" && (
                        <span className="bg-gray-800/60 text-white text-xs py-1 px-2 rounded-full flex items-center gap-1">
                          <PiCubeFocus className="text-white text-sm" />
                          Virtual Tour
                        </span>
                      )}
                      <button
                        className="bg-gray-800/60 backdrop-blur-sm p-2 rounded-full shadow"
                        onClick={toggleSaveProperty}
                      >
                        <Heart
                          size={18}
                          stroke={isFavorite ? "none" : "white"}
                          color={isFavorite ? "red" : "rgba(75, 85, 99, 0.4)"}
                          fill={isFavorite ? "red" : "rgba(75, 85, 99, 0.4)"}
                          strokeWidth={2}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 bg-white text-black">
                    {/* Row 1: Name + Furnished Type */}
                    <div className="flex items-start justify-between gap-3 mb-0">
                      <h3 className="flex-1 m-0 text-base font-bold leading-6 truncate">
                        {propertyData.property_name}
                      </h3>
                      {propertyData.furnished_type && (
                        <span className="flex-shrink-0 text-sm font-medium leading-6 text-red-500 whitespace-nowrap">
                          {propertyData.furnished_type}
                        </span>
                      )}
                    </div>

                    {/* Row 2: Subtitle */}
                    <p className="mt-0 mb-2 text-sm leading-5 text-gray-500 truncate">
                      {propertyData.bhk_type ? `${propertyData.bhk_type} ` : ""}
                      {propertyData.property_type} for Sale in{" "}
                      {propertyData.address_area || ""}
                      {propertyData.city_name
                        ? `, ${propertyData.city_name}`
                        : ""}
                    </p>

                    {/* Row 3: Price + Status */}
                    <div className="flex items-center gap-3 mb-2">
                      {propertyData.property_category_type === "Rent" ? (
                        propertyData.rent && (
                          <span className="flex items-center text-xl font-bold">
                            <FaRupeeSign className="mr-1 text-base" />
                            {formatPrice(propertyData.rent)}
                            {propertyData.rent_duration && (
                              <span className="ml-1 text-sm font-medium text-gray-500">
                                / {propertyData.rent_duration}
                              </span>
                            )}
                          </span>
                        )
                      ) : propertyData.property_price ? (
                        <span className="flex items-center text-xl font-bold">
                          <FaRupeeSign className="mr-1 text-base" />
                          {formatPrice(propertyData.property_price)}
                        </span>
                      ) : null}

                      {propertyData.possession_status === "Ready To Move" && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-200 rounded-full">
                          <MdApartment className="text-base text-green-700" />
                          <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
                            Ready to Move
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Row 4: Features Grid */}
                    <div className="grid grid-cols-3 py-3 border-t border-b border-gray-100">
                      <div className="flex items-center gap-2 px-1 min-w-0">
                        <Building2
                          size={20}
                          className="text-gray-700 flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0 leading-tight">
                          <p className="m-0 text-sm font-semibold leading-4 truncate">
                            {propertyData.bhk_type || "-"}
                          </p>
                          <p className="m-0 text-xs leading-4 text-gray-500">
                            {propertyData.building_type || "Apartment"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-1 border-l border-gray-200 min-w-0">
                        <FaBath
                          size={18}
                          className="text-gray-700 flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0 leading-tight">
                          <p className="m-0 text-sm font-semibold text-gray-900 truncate">
                            {propertyData.bathroom || 0} Baths
                          </p>
                          <p className="m-0 text-xs text-gray-500 truncate">
                            Bathrooms
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-1 border-l border-gray-200 min-w-0">
                        <RiRuler2Line className="text-[22px] text-gray-700 flex-shrink-0" />
                        <div className="flex flex-col min-w-0 leading-tight">
                          <p className="m-0 text-sm font-semibold leading-4 truncate">
                            {propertyData.area
                              ? `${Math.round(
                                convertToSqFt(
                                  propertyData.area,
                                  propertyData.area_in,
                                ),
                              )} sq.ft`
                              : "N/A"}
                          </p>
                          <p className="m-0 text-xs leading-4 text-gray-500">
                            Built Up Area
                          </p>
                        </div>
                      </div>
                    </div>

                    <hr className="my-1 border-gray-100" />

                    {/* Row 5: Posted By + Share */}
                    <div className="flex items-center justify-between pt-1 pb-2 text-[13px] text-gray-600">
                      <div className="flex items-center flex-wrap min-w-0">
                        <span>
                          Posted by{" "}
                          {propertyData.property_owner_type || "Owner"}
                        </span>
                        {propertyData.days_since_created && (
                          <>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="whitespace-nowrap">
                              {propertyData.days_since_created} days ago
                            </span>
                          </>
                        )}
                      </div>
                      <FontAwesomeIcon
                        icon={faShareNodes}
                        className="ml-2 text-[17px] text-gray-500 cursor-pointer hover:text-blue-500"
                        onClick={() => openShareModal(offer._id)}
                      />
                    </div>

                    {/* Row 6: Owner + Contact Buttons */}
                    <div className="flex items-center justify-between pt-2 gap-2">
                      <div className="flex items-center min-w-0">
                        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 overflow-hidden rounded-full bg-blue-100">
                          {propertyData.property_owner_image ? (
                            <img
                              src={`${BASE_URL}/media/${propertyData.property_owner_image}`}
                              alt="Owner"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <AiOutlineUser
                              className="text-gray-600"
                              size={20}
                            />
                          )}
                        </div>
                        <div className="flex flex-col ml-2 min-w-0">
                          <span className="text-sm font-semibold truncate">
                            {propertyData.connect_to_name}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {propertyData.property_owner_type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a
                          href={phoneNumber ? `tel:${phoneNumber}` : "#"}
                          onClick={handleCall}
                          className="px-4 py-2 text-sm font-semibold text-white bg-red-800 rounded-md hover:bg-red-900 whitespace-nowrap"
                        >
                          Contact
                        </a>
                        <a
                          href={
                            phoneNumber
                              ? `https://wa.me/${phoneNumber}`
                              : "#"
                          }
                          target="_blank"
                          rel="noreferrer"
                          onClick={handleWhatsApp}
                          className="p-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                        >
                          <FaWhatsapp size={16} />
                        </a>
                        <a
                          href={phoneNumber ? `tel:${phoneNumber}` : "#"}
                          onClick={handleCall}
                          className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        >
                          <FaPhoneAlt size={14} />
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
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <RecommendedProperties
        data={{
          status: 1,
          data: [offer?.property_data ? offer.property_data : offer],
        }}
      />
    </div>
  );
};

export default OfferDetail;