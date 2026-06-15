import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Ruler, Heart } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { BsHouseDoorFill } from "react-icons/bs";
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
              {/* --- Single Card --- */}
              <div className="p-4 box-border">
                <div className="rounded-2xl bg-slate-100 overflow-hidden shadow h-full">
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

                    {/* Favorite + Virtual */}
                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                      {offer.property_data.virtual_tour_availability ===
                        "Yes" && (
                        <span className="bg-gray-800/60 text-white text-xs py-1 px-2 rounded-full flex items-center gap-1">
                          <PiCubeFocus className="text-white text-sm" />
                          Virtual Tour
                        </span>
                      )}
                      {/* Heart Icon */}
                      {/* <button
                        className="bg-gray-800/60 backdrop-blur-sm p-2 rounded-full shadow"
                        onClick={() => {
                          if (!user_id) {
                            toast.error("Please login first");
                            return;
                          }
                          if (isFavorite) {
                            removeFromFavorites(
                              offer.property_data.favorite_id
                            );
                          } else {
                            addToFavorites(offer.property_data._id);
                          }
                        }}
                      >
                        <Heart
                          size={18}
                          color={isFavorite ? "red" : "white"}
                          fill={isFavorite ? "red" : "white"}
                        />
                      </button> */}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 bg-white text-black">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold truncate">
                        {offer.property_data.property_name}
                      </h3>
                      <FontAwesomeIcon
                        icon={faShareNodes}
                        className="text-gray-500 bg-white p-2 rounded shadow cursor-pointer"
                        onClick={() => openShareModal(offer._id)}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      {offer.property_data.building_type} :{" "}
                      {offer.property_data.property_type}
                    </p>

                    <div className="flex flex-wrap items-center space-x-6 mt-2">
                      {offer.property_data.property_category_type === "Rent" ? (
                        offer.property_data.rent && (
                          <p className="flex items-center text-base">
                            <FaRupeeSign className="mr-1 text-blue-600 text-base" />
                            {formatPrice(offer.property_data.rent)}
                            {offer.property_data.rent_duration && (
                              <span className="ml-1 text-sm text-gray-500">
                                / {offer.property_data.rent_duration}
                              </span>
                            )}
                          </p>
                        )
                      ) : offer.property_data.property_price ? (
                        <p className="flex items-center text-base">
                          <FaRupeeSign className="mr-1 my-text text-base" />
                          {formatPrice(offer.property_data.property_price)}
                        </p>
                      ) : null}

                      {offer.property_data.bhk_type && (
                        <p className="flex items-center text-base">
                          <BsHouseDoorFill className="mr-1 my-text text-base" />
                          {offer.property_data.bhk_type}
                        </p>
                      )}

                      {offer.property_data.area && (
                        <p className="flex items-center text-base">
                          <Ruler size={16} className="my-text" />
                          {Math.round(
                            convertToSqFt(
                              offer.property_data.area,
                              offer.property_data.area_in,
                            ),
                          )}{" "}
                          sq ft
                        </p>
                      )}
                    </div>

                    <div className="flex items-center w-full mt-2">
                      {offer.property_data.furnished_type && (
                        <p className="flex items-center text-base">
                          <FontAwesomeIcon
                            icon={faChair}
                            className="mr-1 my-text"
                          />
                          {offer.property_data.furnished_type}
                        </p>
                      )}
                    </div>

                    <p className="text-sm font-bold text-gray-500 mt-1 flex items-center gap-2">
                      <img
                        src="/image/address_icon.png"
                        alt="Location Icon"
                        className="w-4 h-4 object-contain"
                      />
                      {offer.property_data.address_area ||
                        "No Address Provided"}
                    </p>

                    <div className="text-sm flex items-center truncate mt-1 mb-0">
                      <div className="bg-slate-100 rounded-full p-2">
                        {offer.property_data.property_owner_image ? (
                          <img
                            src={`${BASE_URL}/media/${offer.property_data.property_owner_image}`}
                            alt="Owner"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <AiOutlineUser
                            className="text-gray-600 text-xl"
                            size={25}
                          />
                        )}
                      </div>
                      <div className="flex flex-col ml-2">
                        <span className="text-sm font-semibold">
                          {offer.property_data.connect_to_name}
                        </span>
                        <span>{offer.property_data.property_owner_type}</span>
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
