import { useState, useEffect, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  MdOutlineNavigateBefore,
  MdOutlineNavigateNext,
  MdOutlineStoreMallDirectory,
  MdFiberNew,
} from "react-icons/md";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import {
  FaRupeeSign,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaDownload,
  FaStore,
  FaWarehouse,
  FaVideo,
  FaBed,
  FaHeart,
  FaHardHat,
  FaHotel,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { BsBuildings } from "react-icons/bs";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import ShareModal from "./ShareModal";

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
   ConfigCarousel — same component used on the Builder Projects (Spotlights)
   cards. Dynamically renders one card per available residential
   configuration (BHK for residential, unit type for commercial) — never
   hardcoded, always driven by the `units` array's actual length. Built on
   react-slick so users can swipe/drag horizontally to reveal further
   configs beyond what's visible (e.g. swiping from 1/2/3 BHK to 2/3/4 BHK).
   No visible arrows, no dots — pure swipe. Visible count is responsive:
   3 on desktop, 2 on tablet, 1-2 on mobile depending on available width.
   ==================================================================== */
const ConfigCarousel = ({
  units,
  isCommercial,
  formatAverageProjectPrice,
  getCommercialIcon,
}) => {
  const innerSliderRef = useRef(null);

  // Tracks viewport width so we know exactly how many cards are visible
  // right now, at the current breakpoint — mirrors the breakpoints used
  // in `sliderSettings.responsive` below so the two stay in sync.
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!units || units.length === 0) return null;

  const desktopVisible = Math.min(3, units.length);
  const tabletVisible = Math.min(2, units.length);
  const mobileVisible = Math.min(2, units.length);
  const smallMobileVisible = Math.min(1, units.length);

  // Resolve how many cards are actually visible at the current window
  // width, using the same breakpoint thresholds (380 / 640 / 1024) as
  // `sliderSettings.responsive`. Slick applies the smallest matching
  // max-width breakpoint, so we check from narrowest to widest.
  let currentVisible = desktopVisible;
  if (windowWidth <= 380) {
    currentVisible = smallMobileVisible;
  } else if (windowWidth <= 640) {
    currentVisible = mobileVisible;
  } else if (windowWidth <= 1024) {
    currentVisible = tabletVisible;
  }

  // Only show nav buttons when there are actually more configs than can
  // fit on screen at once — i.e. scrolling is genuinely required.
  const showNavButtons = units.length > currentVisible;

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
          className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.18)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.28)] flex items-center justify-center transition-shadow duration-200"
        >
          <FaChevronLeft className="text-[#A70D2A] text-[10px] sm:text-xs" />
        </button>
      )}

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
                    <h2 className="text-[#8B1E3F] font-bold text-[15px] sm:text-base lg:text-[18px] mt-1.5 text-center truncate leading-tight">
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
          className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.18)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.28)] flex items-center justify-center transition-shadow duration-200"
        >
          <FaChevronRight className="text-[#A70D2A] text-[10px] sm:text-xs" />
        </button>
      )}
    </div>
  );
};
const ProjectList = () => {
  const history = useHistory();
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  let userLocation = null;
  try {
    userLocation = JSON.parse(sessionStorage.getItem("userLocation"));
  } catch (e) {
    userLocation = null;
  }

  const openSpotlightShareModal = useCallback((projectId) => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/projectdetail/${projectId}`;
    setCurrentShareUrl(fullUrl);
    setShowShareModal(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setShowShareModal(false);
  }, []);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(currentShareUrl);
    alert("Link copied: " + currentShareUrl);
  }, [currentShareUrl]);

  const handleProjectClick = (projectId) => {
    history.push(`/projectdetail/${encodeURIComponent(projectId)}`);
  };

  const fetchProjects = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const formData = new FormData();
      if (token) {
        formData.append("user_id", token);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/all_project_list`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const list = Array.isArray(response.data.data) ? response.data.data : [];
      setProjects(list);

      // 👇 DEBUG: keep this while you verify prices are coming through, then
      // remove it. It logs the raw project_properties array for the first
      // project so you can see exactly what field names your API sends
      // (bhk_type vs project_type, price vs property_price, etc).
      if (list.length > 0) {
        console.log("PROJECTLIST — first project raw object:", list[0]);
        console.log(
          "PROJECTLIST — first project's project_properties:",
          list[0].project_properties,
        );
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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

  const formatAverageProjectPrice = (price) => {
    if (!price) return "";

    // If it's a range (contains "-"), split and format both
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
        {formatPrice(price)}
      </span>
    );
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

  // Maps a commercial unit "type" string to its React Icon, per spec
  const getCommercialIcon = (type = "") => {
    if (/office|co-?working/i.test(type)) return HiOutlineOfficeBuilding;
    if (/retail/i.test(type)) return MdOutlineStoreMallDirectory;
    if (/hotel/i.test(type)) return FaHotel;
    if (/shop/i.test(type)) return FaStore;
    if (/warehouse/i.test(type)) return FaWarehouse;
    return BsBuildings;
  };

  // Add to favorites
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
      setProjects((prev) =>
        prev.map((proj) =>
          proj._id === projectId
            ? { ...proj, is_favorite: true, favorite_id: favId }
            : proj,
        ),
      );
      fetchProjects();
    } catch (error) {
      toast.error("Failed to save the Project. Please try again.");
    }
  };

  // Remove from favorites
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

      setProjects((prev) =>
        prev.map((proj) =>
          proj._id === projectId
            ? { ...proj, is_favorite: false, favorite_id: null }
            : proj,
        ),
      );
      fetchProjects();
    } catch (error) {
      toast.error("Failed to remove the Project. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="bg-transparent rounded-2xl">
          <div className="bg-transparent py-4 ml-10 mr-10 rounded-2xl">
            <div className="ml-4">
              <p className="text-2xl font-bold text-black">All Projects</p>
            </div>

            {/* Same compact 16px gap + equal-height card grid as Builder Projects.
                CSS Grid stretches every cell to the tallest row item by default,
                so h-full on the card is enough for equal heights here — no slick
                flex-stretch hack needed like the carousel version. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 mt-4">
              {visibleProjects.map((project, index) => {
                const isCommercial =
                  project.property_category === "Commercial" ||
                  (project.commercial_units &&
                    project.commercial_units.length > 0);

                const commercialUnits =
                  project.commercial_units &&
                    project.commercial_units.length > 0
                    ? project.commercial_units
                    : [];

                /* ====================================================================
                   FIX (was the bug): this used to read `project.residential_units`,
                   a field the API never sends. The Network tab confirms the real
                   per-unit data — including a real `price` field — lives in
                   `project.project_properties`, exactly like Spotlights.js already
                   uses. Also added the same computedRangePrice fallback Spotlights.js
                   has, so if a project has no top-level price field at all, we still
                   derive a min–max range straight from project_properties prices.
                   ==================================================================== */

                // Fallback: compute a min–max range from project_properties prices
                // if no top-level price field exists on the project.
                const propertyPrices = (project.project_properties || [])
                  .map((p) => Number(p.price))
                  .filter((p) => !isNaN(p) && p > 0);

                const computedRangePrice =
                  propertyPrices.length === 0
                    ? null
                    : propertyPrices.length === 1
                      ? propertyPrices[0]
                      : `${Math.min(...propertyPrices)} - ${Math.max(...propertyPrices)}`;

                // Resolves the project's overall/starting price from whichever
                // field name the backend actually sends — tries each in order
                // and returns the first real value.
                const resolvedProjectPrice =
                  project.average_project_price ||
                  project.starting_price ||
                  project.min_price ||
                  project.avg_price ||
                  project.price ||
                  computedRangePrice ||
                  null;

                // 👇 Now sourced from `project_properties` (matches Spotlights.js),
                // with the same fallback chain to `congfigurations` when a project
                // has no property-level breakdown at all.
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

                // Location, used both to compose the subtitle and to compute
                // distance. De-duplicated so the city name is never repeated
                // twice (e.g. when address_area already reads "Bavdhan, Pune"
                // and city_name is "Pune").
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

                // Subtitle carries the location inline, e.g.
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

                const isApproved =
                  project.admin_status === "Approved" ||
                  project.admin_status === true ||
                  project.admin_status === "approved";

                return (
                  <div key={project._id || index} className="h-full">
                    {/* ==================== CARD — same size/design as Builder Projects ==================== */}
                    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_6px_24px_rgba(17,24,39,0.08)] hover:shadow-[0_18px_48px_rgba(17,24,39,0.16)] transition-all duration-300 flex flex-col h-full min-h-[440px] sm:min-h-[460px] lg:min-h-[480px] w-full">
                      {/* ==================== IMAGE SECTION (fixed height) ==================== */}
                      <div className="relative overflow-hidden flex-shrink-0 h-[150px] sm:h-[165px] lg:h-[180px]">
                        <img
                          src={project.cover_image}
                          alt={project.project_name || ""}
                          className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500 ease-out"
                          onClick={() => handleProjectClick(project._id)}
                        />

                        {/* Top Left badges — "New Booking" always shows; "Admin
                            Approval" stacks directly beneath it when the
                            project has actually been approved. */}
                        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                          {/* New Booking */}
                          <div className="bg-gradient-to-r from-[#8B1E3F] to-[#6D1732] text-white pl-2 pr-2.5 py-1 rounded-full flex items-center gap-1 text-[9px] font-semibold shadow-[0_2px_10px_rgba(139,30,63,0.4)]">
                            <MdFiberNew size={11} />
                            <span>New Booking</span>
                          </div>

                          {/* RERA */}
                          <div className="bg-gradient-to-r from-[#8B1E3F] to-[#6D1732] text-white pl-2 pr-2.5 py-1 rounded-full flex items-center gap-1 text-[9px] font-semibold shadow-[0_2px_10px_rgba(139,30,63,0.4)]">
                            <span>RERA</span>
                          </div>

                          {/* Admin Approval */}
                          {isApproved && (
                            <div className="bg-blue-600 text-white pl-2 pr-2.5 py-1 rounded-full flex items-center gap-1 text-[9px] font-semibold shadow-[0_2px_10px_rgba(37,99,235,0.4)]">
                              <FaCheckCircle size={10} />
                              <span className="hidden sm:inline">Admin Approval</span>
                              <span className="sm:hidden">Approved</span>
                            </div>
                          )}
                        </div>

                        {/* Wishlist Heart + Share - Top Right */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                          <button
                            className="w-7 h-7 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!sessionStorage.getItem("accessToken")) {
                                toast.error(
                                  "Please login to add to favorites",
                                );
                                return;
                              }
                              if (project.is_favorite) {
                                removeFromFavoritesRecommendedProperty(
                                  project.favorite_id,
                                  project._id,
                                );
                              } else {
                                addToFavoritesRecommendedProperty(
                                  project._id,
                                );
                              }
                            }}
                          >
                            <FaHeart
                              size={11}
                              className={
                                project.is_favorite
                                  ? "text-red-500"
                                  : "text-white"
                              }
                            />
                          </button>

                          <button
                            className="w-7 h-7 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              openSpotlightShareModal(project._id);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faShareNodes}
                              className="text-white text-[11px]"
                            />
                          </button>
                        </div>

                        {/* Virtual Tour - Black Glassmorphism, below heart/share */}
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
                            className="absolute top-11 right-2 bg-black/40 backdrop-blur-md border border-white/20 text-white px-1.5 py-1 rounded-lg flex items-center gap-1 text-[9px] font-medium"
                          >
                            <FaVideo size={10} />
                            <span className="hidden sm:inline">
                              Virtual Tour
                            </span>
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
                            {project.project_name ||
                              "No Project Name Available"}
                          </h2>
                          <p className="mt-1 text-gray-500 text-[11px] sm:text-xs lg:text-sm line-clamp-2">
                            {subtitle}
                          </p>
                        </div>

                        {/* Commercial Property label — only for commercial cards,
                            sits right above the configuration section */}
                        {isCommercial && (
                          <div className="px-3.5 mt-2 flex-shrink-0 flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-700">
                            <HiOutlineOfficeBuilding
                              className="text-[#A70D2A]"
                              size={13}
                            />
                            <span>Commercial Property</span>
                          </div>
                        )}

                        {/* ==================== CONFIGURATION SECTION (fixed height, identical for both types) ====================
                            Three config cards visible at a time (BHK for residential,
                            unit type for commercial). No visible arrows/dots — swipe
                            to reveal more. */}
                        <div
                          className={`px-3.5 flex-shrink-0 h-[74px] flex items-center ${isCommercial ? "mt-2" : "mt-2.5"
                            }`}
                        >
                          <ConfigCarousel
                            units={
                              isCommercial ? commercialUnits : residentialUnits
                            }
                            isCommercial={isCommercial}
                            formatAverageProjectPrice={
                              formatAverageProjectPrice
                            }
                            getCommercialIcon={getCommercialIcon}
                          />
                        </div>

                        {/* Spacer pushes builder + buttons to the bottom of the card */}
                        <div className="mt-auto flex-shrink-0">
                          {/* ==================== BUILDER SECTION ====================
                              Icon + "Builder" label sit on their own line; the
                              Builder Name and the distance-from-you sit together
                              on the next line, aligned on the same baseline,
                              with a clean 8px gap beneath the label and generous
                              top/bottom padding. */}
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
                              grid-cols-2 keeps Brochure and View Details the same width
                              and height so they never overlap or get hidden. */}
                          <div className="grid grid-cols-2 gap-2 px-3.5 py-3">
                            <button
                              className="border-2 border-[#8B1E3F] text-[#8B1E3F] rounded-lg h-9 text-[11px] sm:text-xs font-semibold flex justify-center items-center gap-1.5 hover:bg-[#8B1E3F]/5 transition-colors duration-200"
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
                              className="bg-[#8B1E3F] rounded-lg text-white text-[11px] sm:text-xs font-semibold flex justify-center items-center gap-1.5 h-9 hover:bg-[#6D1732] hover:shadow-lg transition-all duration-200"
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
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 
                ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <MdOutlineNavigateBefore className="text-xl text-gray-700" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors 
                  ${currentPage === i + 1 ? "my-border text-black font-normal" : "text-gray-700"}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 
                ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <MdOutlineNavigateNext className="text-xl text-gray-700" />
              </button>
            </div>
          )}
        </div>
      </div>
      {showShareModal && (
        <ShareModal
          currentShareUrl={currentShareUrl}
          closeShareModal={closeShareModal}
          copyLink={copyLink}
        />
      )}
    </>
  );
};

export default ProjectList;