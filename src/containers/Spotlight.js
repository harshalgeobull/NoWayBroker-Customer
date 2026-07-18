import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-toastify";
import {
  FaRupeeSign,
  FaMapMarkerAlt,
  FaDownload,
  FaStore,
  FaWarehouse,
  FaVideo,
  FaBed,
  FaHeart,
  FaHardHat,
  FaHotel,
  FaArrowRight,
  FaChevronLeft,   // 👈 new
  FaChevronRight,  // 👈 new
} from "react-icons/fa";
import { BsBuildings } from "react-icons/bs";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { MdOutlineStoreMallDirectory, MdFiberNew } from "react-icons/md";
import Login1 from "../auth/Login1";
import SignUp1 from "../auth/SignUp1";

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

/* ====================================================================
   ConfigCarousel — dynamically renders one card per available residential
   configuration (BHK for residential, unit type for commercial) — never
   hardcoded, always driven by the `units` array's actual length. Built on
   react-slick so users can swipe/drag horizontally to reveal further
   configs beyond what's visible (e.g. swiping from 1/2/3 BHK to 2/3/4 BHK).
   No visible arrows, no dots — pure swipe. Visible count is responsive:
   3 on desktop, 2 on tablet, 1-2 on mobile depending on available width.
    ==================================================================== */
/* ====================================================================
ONLY CHANGE: inside ConfigCarousel in Spotlights.js
Replace the existing `showNavButtons` line + both <button> blocks with
the code below. Nothing else in the file (slider settings, card UI,
swipe behavior, spacing, styling) changes.
==================================================================== */

const ConfigCarousel = ({
  units,
  isCommercial,
  formatAverageProjectPrice,
  getCommercialIcon,
}) => {
  const innerSliderRef = useRef(null);

  if (!units || units.length === 0) return null;

  const desktopVisible = Math.min(3, units.length);
  const tabletVisible = Math.min(2, units.length);
  const mobileVisible = Math.min(2, units.length);
  const smallMobileVisible = Math.min(1, units.length);

  const showNavButtons = units.length > 1;

  /* Nav buttons should only ever be visible at a given screen width when
     scrolling is actually required there — i.e. when units.length exceeds
     the number of slides visible at that breakpoint (desktop cap 3,
     tablet/mobile cap 2, small mobile ≤380px cap 1). Since
     desktopVisible/tabletVisible/mobileVisible/smallMobileVisible above
     are all Math.min(N, units.length), scrolling is needed at a given
     breakpoint exactly when units.length still exceeds that cap:
       - units.length >= 4  -> overflows everywhere -> always show
       - units.length === 3 -> fits at desktop (cap 3), overflows at
         tablet/mobile/small-mobile (cap 2/2/1) -> show only <=1024px
       - units.length === 2 -> fits at desktop/tablet/mobile (cap 3/2/2),
         overflows only at small mobile (cap 1) -> show only <=380px
       - units.length <= 1  -> never overflows -> showNavButtons is false,
         so this class never even gets applied
     Using "hidden" as the base class plus a max-width variant means the
     buttons are removed from layout/tab order until that width is
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
      {/* ==================== LEFT NAV BUTTON (outer left edge) ==================== */}
      {showNavButtons && (
        <button
          type="button"
          aria-label="Previous configuration"
          onClick={(e) => {
            e.stopPropagation();
            innerSliderRef.current?.slickPrev();
          }}
          className={navButtonClass}
        >
          <FaChevronLeft className="text-[#A70D2A] text-[10px] sm:text-xs" />
        </button>
      )}

      {/* Slider track sits between the two buttons via flex — cards can
          never be covered by the buttons since they're separate flex items,
          not absolutely positioned on top of the track. */}
      <div className="flex-1 min-w-0 h-full flex items-center [&_.slick-list]:overflow-hidden [&_.slick-track]:flex [&_.slick-track]:items-stretch [&_.slick-slide]:h-auto [&_.slick-slide>div]:h-full">
        <Slider ref={innerSliderRef} {...sliderSettings} className="w-full">
          {units.map((unit, i) => {
            const Icon = isCommercial ? getCommercialIcon(unit.type) : FaBed;
            return (
              <div key={i} className="h-full px-1">
                <div className="h-full flex flex-col items-center justify-center border border-gray-200 rounded-lg px-2 py-2.5 text-center bg-white">
                  <Icon className="text-sm mb-1 text-gray-700" />
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
            );
          })}
        </Slider>
      </div>

      {/* ==================== RIGHT NAV BUTTON (outer right edge) ==================== */}
      {showNavButtons && (
        <button
          type="button"
          aria-label="Next configuration"
          onClick={(e) => {
            e.stopPropagation();
            innerSliderRef.current?.slickNext();
          }}
          className={navButtonClass}
        >
          <FaChevronRight className="text-[#A70D2A] text-[10px] sm:text-xs" />
        </button>
      )}
    </div>
  );
};
const Spotlights = ({
  data,
  openSpotlightShareModal,
  closeShareModal,
  copyLink,
  currentShareUrl,
  fetchHomeData,
}) => {
  const sliderRef = useRef(null);
  const history = useHistory();
  const [projectList, setProjectList] = useState([]);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  let userLocation = null;
  try {
    userLocation = JSON.parse(sessionStorage.getItem("userLocation"));
  } catch (e) {
    userLocation = null;
  }

  useEffect(() => {
    if (data && data.status === 1 && Array.isArray(data.data)) {
      setProjectList(data.data);
      const prime = data.data.find(p => p.project_name === "Prime Office Centre");
      console.log("SPOTLIGHTS ACTUAL DATA for Prime Office Centre:", prime);
    } else {
      setProjectList([]);
      console.log("No projects found");
    }
  }, [data]);

  const handleClick = () => {
    history.push("/ProjectList");
  };

  const handleProjectClick = (projectId) => {
    history.push(`/projectdetail/${encodeURIComponent(projectId)}`);
  };

  // Outer project carousel — 4 cards on desktop/laptop, 2 on tablet, 1 on mobile.
  // Cards fill the slide width (no fixed max-width on the card itself), which is
  // what keeps the gap between cards tight and consistent, matching the
  // Featured Properties section.
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    dots: false,
    adaptiveHeight: false,

    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const formatPrice = (price) => {
    if (!price) return "";

    price = Number(price);

    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(2).replace(/\.?0+$/, "")} Cr`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(2).replace(/\.?0+$/, "")} L`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(2).replace(/\.?0+$/, "")} K`;
    } else {
      return price.toString();
    }
  };

  const getProjectDistance = (project) => {
    const projLat =
      project.latitude ??
      project.lat ??
      project.Latitude ??
      project.project_latitude ??
      project.location?.latitude ??
      project.location?.lat;

    const projLng =
      project.longitude ??
      project.lng ??
      project.Longitude ??
      project.project_longitude ??
      project.location?.longitude ??
      project.location?.lng;

    if (
      userLocation &&
      userLocation.latitude &&
      userLocation.longitude &&
      projLat &&
      projLng &&
      !isNaN(Number(projLat)) &&
      !isNaN(Number(projLng)) &&
      Number(projLat) !== 0 &&
      Number(projLng) !== 0
    ) {
      const dist = calculateDistance(
        Number(userLocation.latitude),
        Number(userLocation.longitude),
        Number(projLat),
        Number(projLng),
      );
      return dist.toFixed(1);
    }
    return null;
  };

  const formatAverageProjectPrice = (price) => {
    if (!price) return "";

    // Price Range
    if (typeof price === "string" && price.includes("-")) {
      const parts = price.split("-").map((p) => p.trim());
      return (
        <>
          {parts.map((p, idx) => (
            <span key={idx} className="inline-flex items-center">
              <FaRupeeSign className="inline-block mr-1" />
              {formatPrice(p)}
              {idx === 0 && " - "}
            </span>
          ))}
        </>
      );
    }

    return (
      <span className="inline-flex items-center">
        <FaRupeeSign className="inline-block mr-1" />
        {formatPrice(Number(price))}
      </span>
    );
  };

  const addToFavoritesRecommendedProperty = async (projectId) => {
    if (!sessionStorage.getItem("accessToken")) {
      toast.error("Please login to add to favorites");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user_id", sessionStorage.getItem("accessToken"));
      formData.append("project_id", projectId);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_favorite_project`,
        formData,
      );

      const favId = res.data?.favorite_id || projectId;
      setProjectList((prev) =>
        prev.map((proj) =>
          proj._id === projectId
            ? { ...proj, is_favorite: true, favorite_id: favId }
            : proj,
        ),
      );
      fetchHomeData();
    } catch (error) {
      toast.error("Failed to save the Project. Please try again.");
    }
  };

  const removeFromFavoritesRecommendedProperty = async (
    favoriteId,
    projectId,
  ) => {
    try {
      const formData = new FormData();
      formData.append("favorite_id", favoriteId);

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cust_api/remove_favorite_project`,
        {
          data: formData,
        },
      );

      setProjectList((prev) =>
        prev.map((proj) =>
          proj._id === projectId
            ? { ...proj, is_favorite: false, favorite_id: null }
            : proj,
        ),
      );
      fetchHomeData();
    } catch (error) {
      toast.error("Failed to remove the Project. Please try again.");
    }
  };

  // Maps a commercial unit "type" string to its React Icon, per spec
  const getCommercialIcon = (type = "") => {
    if (/office|co-?working/i.test(type)) return HiOutlineOfficeBuilding;
    if (/retail/i.test(type)) return MdOutlineStoreMallDirectory;
    if (/hotel/i.test(type)) return FaHotel;
    if (/shop/i.test(type)) return FaStore;
    if (/warehouse/i.test(type)) return FaWarehouse;
    return BsBuildings;
  };

  return (
    <div className="px-3 py-4 bg-white sm:px-4 md:px-6 lg:px-10">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl">
            Builders Projects
          </h2>
          <p className="text-gray-500">
            Your dream property is just a few clicks away
          </p>
        </div>

        <div className="flex items-center justify-between w-full gap-2 md:w-auto">
          <button
            className="px-4 py-2 text-xs bg-white border border-[#A70D2A]/30 text-[#A70D2A] rounded-full sm:text-sm md:text-base whitespace-nowrap font-semibold hover:bg-[#A70D2A]/5 transition-colors duration-200"
            onClick={handleClick}
          >
            View All Projects
          </button>
          <button
            className="p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md sm:text-2xl hover:shadow-lg transition-shadow duration-200"
            onClick={() => sliderRef.current.slickPrev()}
          >
            <GoArrowLeft className="text-xl text-black md:text-2xl" />
          </button>
          <button
            className="p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md sm:text-2xl hover:shadow-lg transition-shadow duration-200"
            onClick={() => sliderRef.current.slickNext()}
          >
            <GoArrowRight className="text-3xl text-black" />
          </button>
        </div>
      </div>

      {/* slick-track uses flexbox here so every slide (and therefore every
          card wrapper) stretches to the row's tallest item automatically.
          -mx-2 / px-2 on the slide gives a tight, consistent 16px gap between
          cards (8px on each side) instead of the old, uneven wide gap. */}
      <Slider
        ref={sliderRef}
        {...settings}
        className="mx-auto -mx-2 [&_.slick-track]:flex [&_.slick-track]:items-stretch [&_.slick-slide]:h-auto [&_.slick-slide>div]:h-full"
      >
        {projectList.map((project, index) => {
          const isCommercial =
            project.property_category === "Commercial" ||
            (project.commercial_units && project.commercial_units.length > 0);

          const commercialUnits =
            project.commercial_units && project.commercial_units.length > 0
              ? project.commercial_units
              : [];

          // Each card shows its own price exactly as provided by the API:
          // when `residential_units` includes a per-BHK price, that price is
          // used as-is (no two cards share a value unless the data does).
          // Only when the API sends just a comma list of BHK types with no
          // per-unit pricing do all cards fall back to the project's average
          // price — this is a data-availability fallback, not fabricated UI.
          // Resolves the project's overall/starting price from whichever
          // field name the backend actually sends — some responses use
          // average_project_price, others use starting_price / min_price /
          // avg_price. Tries each in order and returns the first real value.


          // Fallback: jar top-level price fields nastil, tar ProjectDetail.js sarkha
          // project_properties chya price madhun min–max range calculate kar
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

          const residentialUnits =
            project.project_properties && project.project_properties.length > 0
              ? project.project_properties.map((u) => ({
                ...u,
                type: u.bhk_type || u.project_type,
                price:
                  Number(
                    u.price ||
                    u.property_price ||
                    u.unit_price ||
                    u.configuration_price ||
                    u.amount ||
                    resolvedProjectPrice
                  ),
              }))
              : project.congfigurations
                ? project.congfigurations.split(",").map((c) => ({
                  type: c.trim().includes("BHK")
                    ? c.trim()
                    : `${c.trim()} BHK`,
                  price: resolvedProjectPrice,
                }))
                : [];
          // Location, used both to compose the subtitle and to compute distance.
          // De-duplicated so the city name is never repeated twice (e.g. when
          // address_area already reads "Bavdhan, Pune" and city_name is "Pune").
          const addressArea = project.address_area?.trim();
          const cityName = project.city_name?.trim();
          let locationText = "";
          if (addressArea && cityName) {
            locationText = addressArea
              .toLowerCase()
              .includes(cityName.toLowerCase())
              ? addressArea
              : `${addressArea}, ${cityName}`;
          } else {
            locationText = addressArea || cityName || "";
          }

          const distanceKm = getProjectDistance(project);

          // Subtitle now carries the location inline, e.g.
          // "1,2,3,4 BHK Apartments in Baner, Pune"
          const subtitle = isCommercial
            ? (() => {
              const unitSummary =
                [
                  ...new Set(
                    commercialUnits.map((u) => u.type).filter(Boolean),
                  ),
                ].join(", ") ||
                project.project_type ||
                "Commercial Space";
              return locationText
                ? `${unitSummary} in ${locationText}`
                : unitSummary;
            })()
            : project.congfigurations
              ? (() => {
                const bhkSummary = project.congfigurations
                  .split(",")
                  .map((c) => c.trim().replace(/\s*BHK/i, ""))
                  .join(",");
                return locationText
                  ? `${bhkSummary} BHK Apartments in ${locationText}`
                  : `${bhkSummary} BHK Apartments`;
              })()
              : locationText
                ? `Apartments in ${locationText}`
                : "Apartments";

          return (
            <div key={index} className="h-full px-2">
              {/* ==================== CARD — equal height across the row, flex column ====================
                  No fixed pixel width / max-width / mx-auto on the card: it simply fills
                  the slide's width (driven by slidesToShow), which is what removes the
                  extra whitespace between cards. min-h keeps every card tall enough that
                  the builder row and both buttons are never clipped; slick's flex-stretch
                  (added on the Slider above) then equalizes every card in the row to the
                  tallest one. */}
              <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_6px_24px_rgba(17,24,39,0.08)] hover:shadow-[0_18px_48px_rgba(17,24,39,0.16)] transition-all duration-300 flex flex-col h-full min-h-[440px] sm:min-h-[460px] lg:min-h-[480px] w-full">
                {/* ==================== IMAGE SECTION (fixed height) ==================== */}
                <div className="relative overflow-hidden flex-shrink-0 h-[150px] sm:h-[165px] lg:h-[180px]">
                  <img
                    src={project.cover_image}
                    alt={project.project_name || ""}
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500 ease-out"
                    onClick={() => handleProjectClick(project._id)}
                  />

                  {/* Top Left badge — always "New Booking", premium green-gradient pill */}
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white pl-2 pr-2.5 py-1 rounded-full flex items-center gap-1 text-[9px] font-semibold shadow-[0_2px_10px_rgba(22,163,74,0.4)]">
                      <MdFiberNew size={11} />
                      <span>New Booking</span>
                    </div>
                  </div>

                  {/* Wishlist Heart - Top Right */}
                  <button
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!sessionStorage.getItem("accessToken")) {
                        setIsLoginModalOpen(true);
                        return;
                      }
                      if (project.is_favorite) {
                        removeFromFavoritesRecommendedProperty(
                          project.favorite_id,
                          project._id,
                        );
                      } else {
                        addToFavoritesRecommendedProperty(project._id);
                      }
                    }}
                  >
                    <FaHeart
                      size={11}
                      className={
                        project.is_favorite ? "text-red-500" : "text-white"
                      }
                    />
                  </button>

                  {/* Virtual Tour - Black Glassmorphism, right of heart */}
                  {project.virtual_tour && (
                    <a
                      href={
                        typeof project.virtual_tour === "string"
                          ? project.virtual_tour
                          : undefined
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 right-10 bg-black/40 backdrop-blur-md border border-white/20 text-white px-1.5 py-1 rounded-lg flex items-center gap-1 text-[9px] font-medium"
                    >
                      <FaVideo size={10} />
                      <span className="hidden sm:inline">Virtual Tour</span>
                    </a>
                  )}

                  {/* Property Type Ribbon - Bottom Left */}
                  {project.property_for && (
                    <div className="absolute bottom-0 left-0 bg-blue-700 text-white px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide">
                      {project.property_for}
                    </div>
                  )}
                </div>

                {/* ==================== CARD BODY (fills remaining height) ==================== */}
                <div
                  className="cursor-pointer flex flex-col flex-1 min-h-0"
                  onClick={() => handleProjectClick(project._id)}
                >
                  {/* Project Name + Subtitle (BHK + location combined) */}
                  <div className="px-3.5 pt-3 flex-shrink-0">
                    <h2 className="text-xl sm:text-[22px] lg:text-2xl leading-tight font-bold text-[#111827] line-clamp-2">
                      {project.project_name || "No Project Name Available"}
                    </h2>
                    <p className="mt-1 text-gray-500 text-[11px] sm:text-xs lg:text-sm line-clamp-2">
                      {subtitle}
                    </p>
                  </div>

                  {/* Commercial Property label — only for commercial cards, sits
                      right above the configuration section */}
                  {isCommercial && (
                    <div className="px-3.5 mt-2 flex-shrink-0 flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-700">
                      <HiOutlineOfficeBuilding className="text-[#A70D2A]" size={13} />
                      <span>Commercial Property</span>
                    </div>
                  )}

                  {/* ==================== CONFIGURATION SECTION (fixed height, identical for both types) ====================
                      Three config cards visible at a time (BHK for residential, unit
                      type for commercial). No visible arrows/dots — swipe to reveal more. */}
                  <div
                    className={`px-3.5 flex-shrink-0 h-[74px] flex items-center ${isCommercial ? "mt-2" : "mt-2.5"
                      }`}
                  >
                    <ConfigCarousel
                      units={residentialUnits}
                      isCommercial={isCommercial}
                      formatAverageProjectPrice={formatAverageProjectPrice}
                      getCommercialIcon={getCommercialIcon}
                    />
                  </div>

                  {/* Spacer pushes builder + buttons to the bottom of the card (margin-top:auto) */}
                  <div className="mt-auto flex-shrink-0">
                    {/* ==================== BUILDER SECTION (fixed height) ====================
                        Builder name stays on the left; distance-from-you now replaces
                        the plain location line and sits on the right, vertically
                        centered with the builder block. flex-nowrap + truncation keeps
                        both sides from wrapping or clipping each other. */}
                    {/* ==================== BUILDER SECTION ====================
                        Icon + "Builder" label sit on their own line; the
                        Builder Name and the distance-from-you sit together on
                        the next line, aligned on the same baseline, with a
                        clean 8px gap beneath the label and generous top/bottom
                        padding so the row no longer crowds the divider above it. */}
                    <div className="mx-3.5 pt-3.5 sm:pt-4 pb-3.5 sm:pb-4 border-t border-gray-100 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 overflow-hidden self-center">
                        {project.property_owner_image &&
                          !project.property_owner_image.includes(
                            "default_profile",
                          ) ? (
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

                        {distanceKm && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <FaMapMarkerAlt
                              className="text-red-600 flex-shrink-0"
                              size={12}
                            />
                            <span className="text-gray-500 text-sm whitespace-nowrap">
                              {distanceKm} km from you
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* ==================== BOTTOM BUTTONS (fixed height, always pinned to bottom) ====================
                        grid-cols-2 keeps Brochure and View Details the same width and height
                        so they never overlap or get hidden. */}
                    <div className="grid grid-cols-2 gap-2 px-3.5 py-3">
                      <button
                        className="border-2 border-[#A70D2A] text-[#A70D2A] rounded-lg h-9 text-[11px] sm:text-xs font-semibold flex justify-center items-center gap-1.5 hover:bg-[#A70D2A]/5 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (project.brochure) {
                            window.open(
                              project.brochure,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }
                        }}
                      >
                        <FaDownload size={11} />
                        Brochure
                      </button>

                      <button
                        className="bg-[#A70D2A] rounded-lg text-white text-[11px] sm:text-xs font-semibold flex justify-center items-center gap-1.5 h-9 hover:bg-[#8a0a22] hover:shadow-lg transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectClick(project._id);
                        }}
                      >
                        View Details
                        <FaArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>

      <div
        id="shareModal"
        className="fixed bottom-0 right-0 items-center justify-center bg-black bg-opacity-50 z-50 hidden"
      >
        <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-lg font-bold">Share this link</h5>
            <button onClick={closeShareModal}>&times;</button>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="text"
              className="form-control border p-2 rounded flex-grow"
              value={currentShareUrl}
              readOnly
            />
            <button
              className="ml-2 p-2 bg-gray-200 rounded"
              onClick={(e) => copyLink(e)}
            >
              Copy Link
            </button>
          </div>
          <div className="flex justify-around flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(currentShareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success"
            >
              WhatsApp
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Facebook
            </a>

            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-danger"
            >
              Instagram
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentShareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-info"
            >
              Twitter
            </a>

            <a
              href={`mailto:?subject=Check out this page&body=${encodeURIComponent(currentShareUrl)}`}
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
  );
};

export default Spotlights;