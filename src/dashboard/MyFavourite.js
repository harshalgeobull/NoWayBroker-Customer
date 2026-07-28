import React, { useState, useEffect, useRef } from "react";
import { Heart, Building2 } from "lucide-react";
import { PiShareNetworkLight, PiCubeFocus } from "react-icons/pi";
import { MdApartment, MdFiberNew } from "react-icons/md";
import { RiRuler2Line } from "react-icons/ri";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaMapMarkerAlt, FaHardHat, FaDownload, FaArrowRight, FaBed } from "react-icons/fa";
import { FaBath, FaRupeeSign, FaWhatsapp, FaPhone } from "react-icons/fa";
import axios from "axios";
import ShareModal from "../containers/ShareModal";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { AiOutlineUser } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
const userLocation = JSON.parse(sessionStorage.getItem("userLocation"));

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

/* ====================================================================
   ConfigCarousel — ported as-is from Spotlights. Used ONLY on the
   Favorite Project cards below. Renders one card per available
   configuration (BHK/unit type + price), with small circular Prev/Next
   buttons on the outer edges that auto-hide when there's just one config.
   ==================================================================== */
const ConfigCarousel = ({ units, formatAverageProjectPrice }) => {
  const innerSliderRef = useRef(null);

  if (!units || units.length === 0) return null;

  const desktopVisible = Math.min(3, units.length);
  const tabletVisible = Math.min(2, units.length);
  const mobileVisible = Math.min(2, units.length);
  const smallMobileVisible = Math.min(1, units.length);

  const showNavButtons = units.length > 1;

  /* Nav buttons should only ever be visible at a given screen width when
     scrolling is actually required at that width — i.e. when units.length
     exceeds the number of slides visible there (desktop: 3, tablet/mobile:
     2, small mobile: 380px and below: 1). Since desktopVisible/tabletVisible/
     mobileVisible/smallMobileVisible above are all Math.min(N, units.length),
     scrolling is needed at a given breakpoint exactly when units.length is
     still larger than that breakpoint's cap:
       - units.length >= 4  -> more configs than fit anywhere -> always show
       - units.length === 3 -> fits at desktop (cap 3), overflows at
         tablet/mobile/small-mobile (cap 2/2/1) -> show only <=1024px
       - units.length === 2 -> fits at desktop/tablet/mobile (cap 3/2/2),
         overflows only at small mobile (cap 1) -> show only <=380px
       - units.length <= 1  -> never overflows -> showNavButtons is false,
         so this class is never applied
     "hidden" as the base class plus a max-width variant means the buttons
     stay out of the flow (and out of the tab order) until that width is
     actually reached — swipe still works regardless of button visibility. */
  const navVisibilityClass =
    units.length >= 4
      ? "flex"
      : units.length === 3
        ? "hidden max-[1024px]:flex"
        : "hidden max-[380px]:flex";

  const navButtonClass = `flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.18)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.28)] items-center justify-center transition-shadow duration-200 ${navVisibilityClass}`;

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: units.length > smallMobileVisible,
    speed: 400,
    slidesToShow: desktopVisible,
    slidesToScroll: 1,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 8,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: tabletVisible } },
      { breakpoint: 640, settings: { slidesToShow: mobileVisible } },
      { breakpoint: 380, settings: { slidesToShow: smallMobileVisible } },
    ],
  };

  return (
    <div className="w-full h-full flex items-center gap-1.5">
      {showNavButtons && (
        <button
          type="button"
          aria-label="Previous configuration"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            innerSliderRef.current?.slickPrev();
          }}
          className={navButtonClass}
        >
          <FaMapMarkerAlt className="hidden" />
          <svg width="8" height="8" viewBox="0 0 320 512" className="text-[#A70D2A]" fill="currentColor">
            <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
        </button>
      )}

      <div className="flex-1 min-w-0 h-full flex items-center [&_.slick-list]:overflow-hidden [&_.slick-track]:flex [&_.slick-track]:items-stretch [&_.slick-slide]:h-auto [&_.slick-slide>div]:h-full">
        <Slider ref={innerSliderRef} {...sliderSettings} className="w-full">
          {units.map((unit, i) => (
            <div key={i} className="h-full px-1">
              <div className="h-full flex flex-col items-center justify-center border border-gray-200 rounded-lg px-2 py-2.5 text-center bg-white">
                <FaBed className="text-sm mb-1 text-gray-700" />
                <h3 className="font-semibold text-[10.5px] sm:text-[11px] text-gray-900 truncate leading-tight">
                  {unit.type}
                </h3>
                {unit.price ? (
                  <h2 className="text-[#A70D2A] font-bold text-[15px] sm:text-base lg:text-[18px] mt-1.5 text-center truncate leading-tight">
                    {formatAverageProjectPrice(unit.price)}
                  </h2>
                ) : (
                  <h2 className="text-gray-300 font-bold text-[15px] sm:text-base lg:text-[18px] mt-1.5 text-center">
                    &nbsp;
                  </h2>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {showNavButtons && (
        <button
          type="button"
          aria-label="Next configuration"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            innerSliderRef.current?.slickNext();
          }}
          className={navButtonClass}
        >
          <svg width="8" height="8" viewBox="0 0 320 512" className="text-[#A70D2A]" fill="currentColor">
            <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.6 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
          </svg>
        </button>
      )}
    </div>
  );
};

const MyFavourite = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const propPerPage = 3;
  const [prop, setProp] = useState([]);
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareId, setActiveShareId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("property");
  const [activeIndexes, setActiveIndexes] = useState({});
  const userId = sessionStorage.getItem("accessToken");

  const fetchData = async () => {
    if (!userId) {
      setErrorMsg("User not logged in. Please login to view your favorites.");
      if (activeTab === "property") setProp([]);
      else setProjects([]);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("page", currentPage);
      formData.append("page_size", propPerPage);

      const endpoint =
        activeTab === "property"
          ? `${process.env.REACT_APP_API_URL}/cust_api/get_favorite_properties`
          : `${process.env.REACT_APP_API_URL}/cust_api/get_favorite_projects`;

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === 1 && Array.isArray(data.data)) {
        if (activeTab === "property") {
          setProp(data.data);
          const totalCount = data.total_count || 0;
          setTotalPages(Math.ceil(totalCount / propPerPage));
        } else {
          setProjects(data.data);
          const totalCount = data.total_count || 0;
          setTotalPages(Math.ceil(totalCount / propPerPage));
        }

        setErrorMsg("");
      } else {
        if (activeTab === "property") setProp([]);
        else setProjects([]);
        setTotalPages(1);
        setErrorMsg("No favorites found.");
      }
    } catch (error) {
      console.error(`Error fetching favorite ${activeTab}s:`, error);
      setErrorMsg("Something went wrong while fetching data.");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, userId, activeTab]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, activeTab]);

  const handleUnfavorite = async (favoriteId) => {
    const formData = new FormData();
    formData.append("favorite_id", favoriteId);

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/cust_api/remove_from_favorite`,
        { data: formData },
      );

      if (response.data.status === 1) {
        fetchData();
      } else {
        console.error("Failed to remove:", response.data.message);
      }
    } catch (error) {
      console.error("Error unfavoriting:", error);
    }
  };

  const handleUnfavoriteProject = async (favoriteId) => {
    const formData = new FormData();
    formData.append("favorite_id", favoriteId);

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/cust_api/remove_favorite_project`,
        { data: formData },
      );

      if (response.data.status === 1) {
        fetchData();
      } else {
        console.error("Failed to remove:", response.data.message);
      }
    } catch (error) {
      console.error("Error unfavoriting:", error);
    }
  };

  const openShareModal1 = (url, propertyId) => {
    setCurrentShareUrl(url);
    setActiveShareId(propertyId);
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setActiveShareId(null);
  };

  const formatPrice = (price) => {
    if (!price) return "";

    price = Number(price);

    const formatNumber = (num) => {
      return num.toFixed(2).replace(/\.?0+$/, "");
    };

    if (price >= 10000000) {
      return `₹ ${formatNumber(price / 10000000)} Cr`;
    } else if (price >= 100000) {
      return `₹ ${formatNumber(price / 100000)} L`;
    } else if (price >= 1000) {
      return `₹ ${formatNumber(price / 1000)} K`;
    } else {
      return `₹ ${price}`;
    }
  };

  const formatAverageProjectPrice = (price) => {
    if (!price) return "";
    if (typeof price === "string" && price.includes("-")) {
      const parts = price.split("-").map((p) => p.trim());
      return (
        <>
          {parts.map((p, idx) => (
            <span key={idx} className="inline-flex items-center">
              <FaRupeeSign className="inline-block mr-1" />
              {formatPrice(p).replace("₹ ", "")}
              {idx === 0 && " - "}
            </span>
          ))}
        </>
      );
    }

    return (
      <span className="inline-flex items-center">
        <FaRupeeSign className="inline-block mr-1" />
        {formatPrice(price).replace("₹ ", "")}
      </span>
    );
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <h2 className="mb-6 text-3xl font-bold">My Favourites</h2>
      {errorMsg && <p className="mb-4 text-red-500">{errorMsg}</p>}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          className={`px-4 py-2 font-semibold border-b-2 ${activeTab === "property"
            ? "border-rose-600 my-text"
            : "border-transparent text-gray-500"
            }`}
          onClick={() => {
            setActiveTab("property");
            setCurrentPage(1);
          }}
        >
          Favorite Property
        </button>
        <button
          className={`px-4 py-2 font-semibold border-b-2 ${activeTab === "project"
            ? "border-rose-600 my-text"
            : "border-transparent text-gray-500"
            }`}
          onClick={() => {
            setActiveTab("project");
            setCurrentPage(1);
          }}
        >
          Favorite Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ==================== Property Cards — ORIGINAL DESIGN, UNCHANGED ==================== */}
        {activeTab === "property" &&
          (prop.length > 0 ? (
            prop.map((property) => {
              let distance = null;

              if (userLocation && property.latitude && property.longitude) {
                distance = calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  parseFloat(property.latitude),
                  parseFloat(property.longitude),
                ).toFixed(1);
              }

              return (
                <div
                  key={property._id}
                  className="shadow-md rounded-2xl overflow-hidden block no-underline hover:no-underline"
                >
                  <div className="relative">
                    <Link
                      to={`/propertydetails/${property._id}`}
                      className="block overflow-hidden no-underline bg-white border-2 rounded-lg hover:no-underline"
                    >
                      {1 + (property?.property_images?.length || 0) > 1 ? (
                        <Slider
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
                            const totalImages =
                              1 + (property?.property_images?.length || 0);
                            const isActive = i === activeSlide % totalImages;
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
                          appendDots={(dots) => {
                            const totalImages =
                              1 + (property?.property_images?.length || 0);
                            const visibleDots = dots.slice(0, totalImages);
                            return (
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
                                {visibleDots}
                              </div>
                            );
                          }}
                          className="rounded-t-2xl"
                        >
                          <div key={`cover-${property._id}`}>
                            <img
                              src={property.cover_image}
                              alt="Cover"
                              className="object-cover w-full h-48 rounded-t-2xl"
                            />
                          </div>

                          {(property?.property_images || []).map((imgObj) => (
                            <div key={imgObj._id}>
                              <img
                                src={imgObj.image}
                                alt="Property"
                                className="object-cover w-full h-48 rounded-t-2xl"
                              />
                            </div>
                          ))}
                        </Slider>
                      ) : (
                        <div>
                          <img
                            src={property.cover_image}
                            alt="Cover"
                            className="object-cover w-full h-48 rounded-t-2xl"
                          />
                        </div>
                      )}
                    </Link>

                    {/* Days badge */}
                    <div className="absolute flex items-center space-x-2 top-2 left-2">
                      <span className="px-2 py-1 text-xs text-white rounded-full bg-black/50">
                        {property?.days_since_created ?? 0} days ago
                      </span>
                    </div>

                    {/* Admin Approval Badge */}
                    {property.admin_approval === "Approved" && (
                      <div className="absolute top-2 left-2 z-20">
                        <div className="flex items-center bg-[#8B1E3F] text-white rounded-sm shadow-md px-2 py-1">

                          {/* Tick Icon */}
                          <span className="text-white text-xs font-bold mr-2">
                            ✓
                          </span>

                          {/* Verified Text */}
                          <span className="text-[11px] font-semibold leading-none">
                            Verified
                          </span>

                        </div>
                      </div>
                    )}
                    {/* Virtual Tour + Heart */}
                    <div className="absolute flex items-center space-x-2 top-2 right-2">
                      {property.virtual_tour_availability === "Yes" && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-normal text-white rounded-full bg-gray-800/60 backdrop-blur-sm">
                          <PiCubeFocus className="text-sm text-white" />
                          Virtual Tour
                        </span>
                      )}
                      <button
                        className="p-1.5 text-xs font-normal text-white bg-opacity-50 rounded-full bg-gray-800/60 backdrop-blur-sm"
                        onClick={() => handleUnfavorite(property.favorite_id)}
                      >
                        <Heart
                          size={20}
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

                    {/* FOR BUY / FOR RENT tag */}
                    <div className="absolute bottom-0 left-0">
                      <span
                        className={`text-white text-xs px-3 py-1 rounded-se-lg ${property.property_category_type === "Buy"
                          ? "bg-[#8B1E3F]"
                          : property.property_category_type === "Rent"
                            ? "bg-[#8B1E3F]"
                            : "bg-[#8B1E3F]"
                          }`}
                      >
                        {property.property_category_type === "Buy"
                          ? "FOR BUY"
                          : property.property_category_type === "Rent"
                            ? "FOR RENT"
                            : "UNKNOWN"}
                      </span>
                    </div>

                    {/* FEATURED tag */}
                    {property.mark_as_featured === "Yes" && (
                      <div className="absolute bottom-0 right-0">
                        <span className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-ss-lg">
                          FEATURED
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Property Description */}
                  <div className="p-4 bg-white">
                    {/* Row 1: Name + Furnished Type */}
                    <div className="flex items-start justify-between gap-3 mb-0">
                      <h3 className="flex-1 m-0 text-base font-bold leading-6 truncate">
                        {property.property_name}
                      </h3>
                      {property.furnished_type && (
                        <span className="flex-shrink-0 m-0 text-xs font-medium leading-6 text-black sm:text-sm whitespace-nowrap">
                          {property.furnished_type}
                        </span>
                      )}
                    </div>

                    {/* Row 2: Subtitle */}
                    <p className="mt-0 mb-2 text-sm leading-5 text-gray-500 truncate">
                      {property.bhk_type ? `${property.bhk_type} ` : ""}
                      {property.property_type ||
                        property.building_type ||
                        "Property"}{" "}
                      for Sale in{" "}
                      {property.address_area ||
                        property.address ||
                        "No Address Provided"}
                    </p>

                    {/* Row 3: Price + Status */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center text-xl font-bold text-black">
                        <FaRupeeSign className="mr-1 text-base" />
                        {property.property_category_type === "Rent"
                          ? `${formatPrice(property.rent).replace("₹ ", "")}${property.rent_duration &&
                            property.rent_duration !== "N/A"
                            ? ` / ${property.rent_duration}`
                            : ""
                          }`
                          : formatPrice(property.property_price).replace(
                            "₹ ",
                            "",
                          )}
                      </span>

                      {(property.possession_status === "Ready To Move" ||
                        property.construction_status === "Ready To Move") && (
                          <div className="flex items-center gap-2 px-3 py-1 text-white border rounded-full bg-[#8B1E3F] border-[#8B1E3F]">
                            <MdApartment className="text-base text-white" />
                            <span className="text-xs font-semibold text-white whitespace-nowrap">
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
                          <p className="m-0 text-sm font-semibold leading-4 truncate text-black">
                            {property.bhk_type || "-"}
                          </p>
                          <p className="m-0 text-xs leading-4 text-gray-500">
                            {property.building_type || "Apartment"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-1 border-l border-gray-200 min-w-0">
                        <FaBath
                          size={18}
                          className="text-gray-700 flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0 leading-tight">
                          <p className="m-0 text-sm font-semibold text-black truncate">
                            {property.bathroom || 0} Baths
                          </p>
                          <p className="m-0 text-xs text-gray-500 truncate">
                            Bathrooms
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-3 border-l border-gray-200 min-w-0">
                        <RiRuler2Line className="text-[22px] text-gray-700 flex-shrink-0" />
                        <div className="flex flex-col justify-center min-w-0">
                          <p className="m-0 text-sm font-semibold leading-4 truncate text-black">
                            {property.area} {property.area_in}
                          </p>
                          <p className="m-0 text-xs leading-4 text-gray-500 truncate">
                            Built Up Area
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Row 5 : Posted By | Days | | Share */}
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
                            ? `${property.days_since_created} days ago`
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
                      <FontAwesomeIcon
                        icon={faShareNodes}
                        className="ml-2 text-[17px] text-gray-500 transition-colors cursor-pointer hover:text-blue-500"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openShareModal1(property._id);
                        }}
                      />
                    </div>

                    {isShareModalOpen && activeShareId === property._id && (
                      <div className="absolute right-0 z-50">
                        <ShareModal
                          currentShareUrl={currentShareUrl}
                          closeShareModal={handleCloseShareModal}
                          copyLink={() => {
                            navigator.clipboard.writeText(currentShareUrl);
                            alert("Link copied!");
                          }}
                        />
                      </div>
                    )}

                    {/* Row 6: Owner + Contact Buttons */}
                    <div className="flex items-center justify-between pt-2 gap-2">
                      <div className="flex items-center min-w-0">
                        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 overflow-hidden rounded-full bg-blue-100">
                          {property.property_owner_image ? (
                            <img
                              src={`${process.env.REACT_APP_API_URL}/media/${property.property_owner_image}`}
                              alt="Owner"
                              className="object-cover w-full h-full rounded-full"
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
                            {property.connect_to_name}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {property.user_type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center justify-center px-4 h-9 text-sm font-semibold text-white bg-red-800 rounded-md cursor-pointer hover:bg-red-900 whitespace-nowrap">
                          Contact
                        </div>

                        <a
                          href={`https://wa.me/91${property.connect_to_no}?text=Hello, I am interested in your property`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center w-9 h-9 text-white bg-green-500 rounded-md hover:bg-green-600"
                        >
                          <FaWhatsapp />
                        </a>

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
              );
            })
          ) : (
            <div className="text-center text-black col-span-full">
              <p>No favorite properties available.</p>
            </div>
          ))}

        {/* ==================== Project Cards — SPOTLIGHTS DESIGN APPLIED HERE ONLY ==================== */}
        {activeTab === "project" &&
          (projects.length > 0 ? (
            projects.map((project) => {
              let distance = null;

              if (userLocation && project.latitude && project.longitude) {
                distance = calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  parseFloat(project.latitude),
                  parseFloat(project.longitude),
                ).toFixed(1);
              }

              /* ----------------------------------------------------------------
                 PRICE FIX: previously this only checked
                 `project.average_project_price`, and passed it straight into
                 Number(...) with no fallback — so if the favorites API used a
                 different field name (starting_price / min_price / avg_price /
                 price) or sent nothing at all, Number(undefined) -> NaN, which
                 is falsy, so ConfigCarousel rendered the blank placeholder
                 instead of a price. This now mirrors the same resolution
                 chain used on Spotlights/ProjectBuilder, and only converts to
                 Number when that produces a real value — otherwise it keeps
                 the original (possibly string/range) value so
                 formatAverageProjectPrice can still render it.
                 ---------------------------------------------------------------- */
              const propertyPrices = (project.project_properties || [])
                .map((p) => Number(p.price))
                .filter((p) => !isNaN(p) && p > 0);

              const computedRangePrice =
                propertyPrices.length === 0
                  ? null
                  : propertyPrices.length === 1
                    ? propertyPrices[0]
                    : `${Math.min(...propertyPrices)} - ${Math.max(...propertyPrices)}`;

              const resolvedProjectPrice =
                project.average_project_price ||
                project.starting_price ||
                project.min_price ||
                project.avg_price ||
                project.price ||
                computedRangePrice ||
                null;

              // Built the same way Spotlights builds its `units` array: one
              // card per project_properties entry (falls back to a parsed
              // congfigurations string when no per-unit pricing exists).
              const units =
                project.project_properties && project.project_properties.length > 0
                  ? project.project_properties.map((u) => {
                    const rawPrice =
                      u.price ||
                      u.property_price ||
                      u.unit_price ||
                      u.configuration_price ||
                      u.amount ||
                      resolvedProjectPrice;
                    const numPrice = Number(rawPrice);
                    return {
                      type: u.bhk_type || u.project_type,
                      price:
                        !isNaN(numPrice) && numPrice > 0 ? numPrice : rawPrice,
                    };
                  })
                  : project.congfigurations
                    ? project.congfigurations.split(",").map((c) => ({
                      type: c.trim().includes("BHK") ? c.trim() : `${c.trim()} BHK`,
                      price: resolvedProjectPrice,
                    }))
                    : [];

              const addressArea = project.address_area?.trim();
              const cityName = project.city_name?.trim();
              let locationText = "";
              if (addressArea && cityName) {
                locationText = addressArea.toLowerCase().includes(cityName.toLowerCase())
                  ? addressArea
                  : `${addressArea}, ${cityName}`;
              } else {
                locationText = addressArea || cityName || "";
              }

              const unitSummary =
                [...new Set(units.map((u) => u.type).filter(Boolean))].join(", ") ||
                project.project_type ||
                "Apartments";

              const subtitle = locationText
                ? `${unitSummary} in ${locationText}`
                : unitSummary;

              return (
                <div key={project._id} className="h-full">
                  {/* ==================== CARD (Spotlights shell) ==================== */}
                  <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_6px_24px_rgba(17,24,39,0.08)] hover:shadow-[0_18px_48px_rgba(17,24,39,0.16)] transition-all duration-300 flex flex-col h-full min-h-[440px] sm:min-h-[460px] lg:min-h-[480px] w-full">
                    {/* ==================== IMAGE SECTION (fixed height) ==================== */}
                    <div className="relative overflow-hidden flex-shrink-0 h-[150px] sm:h-[165px] lg:h-[180px]">
                      <Link to={`/projectdetail/${project._id}`} className="block w-full h-full">
                        <img
                          src={project.cover_image}
                          alt={project.project_name || ""}
                          className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </Link>

                      {/* Top Left badge — always "New Booking", premium green-gradient pill */}
                      <div className="absolute top-2 left-2 z-10 flex flex-col items-start gap-1.5">
                        <div className="bg-gradient-to-r from-[#8B1E3F] to-[#6D1732] text-white pl-2 pr-2.5 py-1 rounded-full flex items-center gap-1 text-[9px] font-semibold shadow-[0_2px_10px_rgba(139,30,63,0.4)]">
                          <MdFiberNew size={11} />
                          <span>New Booking</span>
                        </div>
                      </div>

                      {/* Wishlist Heart - Top Right */}
                      <button
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform duration-200 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnfavoriteProject(project.favorite_id);
                        }}
                      >
                        <Heart
                          size={13}
                          stroke={project.is_favorite ? "none" : "white"}
                          color={project.is_favorite ? "red" : "white"}
                          fill={project.is_favorite ? "red" : "none"}
                          strokeWidth={2}
                        />
                      </button>

                    </div>

                    {/* ==================== CARD BODY ==================== */}
                    <div className="cursor-pointer flex flex-col flex-1 min-h-0">
                      {/* Title + Subtitle */}
                      <Link
                        to={`/projectdetail/${project._id}`}
                        className="px-3.5 pt-3 flex-shrink-0 no-underline hover:no-underline"
                      >
                        <h2 className="text-xl sm:text-[22px] lg:text-2xl leading-tight font-bold text-[#111827] line-clamp-2">
                          {project.project_name || "No Project Name Available"}
                        </h2>
                        <p className="mt-1 text-gray-500 text-[11px] sm:text-xs lg:text-sm line-clamp-2">
                          {subtitle}
                        </p>
                      </Link>

                      {/* ==================== CONFIGURATION SECTION (identical to Spotlights) ==================== */}
                      <div className="px-3.5 flex-shrink-0 h-[74px] flex items-center mt-2.5">
                        <ConfigCarousel
                          units={units}
                          formatAverageProjectPrice={formatAverageProjectPrice}
                        />
                      </div>

                      {/* Spacer pushes builder + buttons to the bottom of the card */}
                      <div className="mt-auto flex-shrink-0">
                        {/* ==================== BUILDER SECTION ==================== */}
                        <div className="mx-3.5 pt-3.5 sm:pt-4 pb-3.5 sm:pb-4 border-t border-gray-100 flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 overflow-hidden self-center">
                            {project.property_owner_image &&
                              !project.property_owner_image.includes("default_profile") ? (
                              <img
                                src={`${process.env.REACT_APP_API_URL}/media/${project.property_owner_image}`}
                                alt={project.connect_to_name || "Builder"}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <FaHardHat className="text-xs text-yellow-700" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                            <div className="min-w-0 flex flex-col justify-center">
                              <p className="text-xs text-gray-500 leading-none mb-0">
                                Builder
                              </p>
                              <h3 className="text-base font-semibold leading-tight text-[#111827] mt-0.5 truncate">
                                {project.connect_to_name || "Builder"}
                              </h3>
                            </div>

                            {distance && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <FaMapMarkerAlt className="text-red-600 flex-shrink-0" size={12} />
                                <span className="text-gray-500 text-sm whitespace-nowrap">
                                  {distance} km from you
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Posted / Share row */}
                        <div className="px-3.5 pb-2 flex items-center justify-between text-[11px] text-gray-500">
                          <div className="flex items-center flex-wrap min-w-0">
                            <AiOutlineClockCircle className="mr-1 text-[13px] text-gray-500" />
                            <span className="whitespace-nowrap">
                              {project.days_since_created
                                ? `${project.days_since_created} days ago`
                                : "Recently"}
                            </span>
                          </div>
                          <FontAwesomeIcon
                            icon={faShareNodes}
                            className="text-[15px] text-gray-500 transition-colors cursor-pointer hover:text-[#A70D2A]"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openShareModal1(
                                `${window.location.origin}/projectdetail/${project._id}`,
                                project._id,
                              );
                            }}
                          />
                        </div>

                        {isShareModalOpen && activeShareId === project._id && (
                          <div className="absolute right-0 z-50">
                            <ShareModal
                              currentShareUrl={currentShareUrl}
                              closeShareModal={handleCloseShareModal}
                              copyLink={() => {
                                navigator.clipboard.writeText(currentShareUrl);
                                alert("Link copied!");
                              }}
                            />
                          </div>
                        )}

                        {/* ==================== BOTTOM BUTTONS — Brochure / View Details (matches Spotlights) ==================== */}
                        <div className="grid grid-cols-2 gap-2 px-3.5 py-3">
                          {project.brochure ? (
                            <button
                              className="border-2 border-[#A70D2A] text-[#A70D2A] rounded-lg h-9 text-[11px] sm:text-xs font-semibold flex justify-center items-center gap-1.5 hover:bg-[#A70D2A]/5 transition-colors duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.brochure, "_blank", "noopener,noreferrer");
                              }}
                            >
                              <FaDownload size={11} />
                              Brochure
                            </button>
                          ) : (
                            <button
                              className="border-2 border-[#A70D2A] text-[#A70D2A] rounded-lg h-9 text-[11px] sm:text-xs font-semibold flex justify-center items-center gap-1.5 hover:bg-[#A70D2A]/5 transition-colors duration-200"
                              onClick={(e) => {
                                e.stopPropagation();

                                if (project.brochure) {
                                  window.open(project.brochure, "_blank", "noopener,noreferrer");
                                } else {
                                  alert("Brochure not available");
                                }
                              }}
                            >
                              <FaDownload size={11} />
                              Download Brochure
                            </button>
                          )}

                          <Link
                            to={`/projectdetail/${project._id}`}
                            className="bg-[#A70D2A] rounded-lg text-white text-[11px] sm:text-xs font-semibold flex justify-center items-center gap-1.5 h-9 hover:bg-[#8a0a22] hover:shadow-lg transition-all duration-200 no-underline hover:no-underline"
                          >
                            View Details
                            <FaArrowRight size={11} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-black col-span-full">
              <p>No favorite projects available.</p>
            </div>
          ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="xl:col-span-2 flex items-center justify-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-10 h-10 text-gray-600 border border-gray-400 rounded-full disabled:opacity-50"
            >
              {"<"}
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-200 ${currentPage === index + 1
                  ? "border-rose-600 my-text font-semibold"
                  : "border-gray-400 text-gray-600"
                  }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-10 h-10 text-gray-600 border border-gray-400 rounded-full disabled:opacity-50"
            >
              {">"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavourite;