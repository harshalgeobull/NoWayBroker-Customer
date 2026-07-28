import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AiFillHome } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
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
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { BsBuildings } from "react-icons/bs";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { MdOutlineStoreMallDirectory, MdFiberNew } from "react-icons/md";
import ContactDetails from "../containers/ContactDetails";
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
   ONLY CHANGE: inside ConfigCarousel in ProjectBuilder.js
   Replace the existing `showNavButtons` line + both <button> blocks with
   the code below. Nothing else in the file (slider settings, price logic,
   card UI, swipe behavior, spacing, styling, pagination) changes.
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

const ProjectBuilder = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("accessToken");
  const [projects, setProjects] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState();
  const [nextPage, setNextPages] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);
  const propertiesPerPage = 6;

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [openContactModalAfterLogin, setOpenContactModalAfterLogin] =
    useState(false);

  let userLocation = null;
  try {
    userLocation = JSON.parse(sessionStorage.getItem("userLocation"));
  } catch (e) {
    userLocation = null;
  }

  useEffect(() => {
    if (id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, id, userId]);

  useEffect(() => {
    if (sessionStorage.getItem("accessToken") && openContactModalAfterLogin) {
      setIsContactModalOpen(true);
      setOpenContactModalAfterLogin(false);
    }
  }, [openContactModalAfterLogin]);

  const fetchProjects = async () => {
    try {
      const formData = new FormData();
      formData.append("user_id", id);
      formData.append("customer_id", userId);
      formData.append("page", currentPage);
      formData.append("page_size", propertiesPerPage);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/agent_project_list`,
        formData,
      );

      if (response.data && response.data.data) {
        setProjects(response.data.data);
        setUserDetails(response.data.user_details);
        setTotalCount(response.data.total_count || 0);
        setTotalPages(response.data.total_pages || 0);
        setCurrentPage(response.data.current_page || 0);
        setNextPages(response.data.next_page || 0);
        setPreviousPage(response.data.previous_page || 0);

        // 👇 DEBUG: same as ProjectList.js — verify project_properties/price
        // fields coming from this endpoint. Remove once confirmed working.
        if (response.data.data.length > 0) {
          console.log(
            "PROJECTBUILDER — first project raw object:",
            response.data.data[0],
          );
          console.log(
            "PROJECTBUILDER — first project's project_properties:",
            response.data.data[0].project_properties,
          );
        }
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error fetching agent projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentPage]);

  // Pagination Handlers
  const handlePrev = () => {
    previousPage && setCurrentPage(currentPage + 1);
  };

  const handleNext = () => {
    nextPage && setCurrentPage(currentPage - 1);
  };

  const handleProjectClick = (projectId) => {
    window.location.href = `/projectdetail/${encodeURIComponent(projectId)}`;
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

  const addToFavoritesProperty = async (projectId) => {
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

  const removeFromFavoritesProperty = async (favoriteId, projectId) => {
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

  const getCommercialIcon = (type = "") => {
    if (/office|co-?working/i.test(type)) return HiOutlineOfficeBuilding;
    if (/retail/i.test(type)) return MdOutlineStoreMallDirectory;
    if (/hotel/i.test(type)) return FaHotel;
    if (/shop/i.test(type)) return FaStore;
    if (/warehouse/i.test(type)) return FaWarehouse;
    return BsBuildings;
  };

  if (loading) return <p>Loading projects...</p>;

  return (
    <>
      <div className="min-h-screen ">
        <div className="bg-white shadow-lg rounded-2xl ">
          <div className="relative w-full h-auto p-2 mb-4 rounded-lg shadow-sm bg-rose-50">
            {userDetails &&
              Array.isArray(userDetails) &&
              userDetails.length > 0 && (
                <>
                  {(() => {
                    const builder = userDetails[0];
                    return (
                      <>
                        {/* Agent Info */}
                        <div className="flex items-center gap-4 pb-6 ml-4">
                          <img
                            src={builder.profile_image || "/default-avatar.jpg"}
                            alt="Agent"
                            className="object-cover w-12 h-12 rounded-full"
                          />
                          <div>
                            <h1 className="text-2xl font-semibold">
                              {builder.full_name}
                            </h1>
                            <p className="text-gray-600">{builder.user_type}</p>
                          </div>
                          <button
                            className="px-4 py-2 ml-auto text-white my-bg rounded-lg"
                            onClick={() => {
                              const token =
                                sessionStorage.getItem("accessToken");
                              if (token) {
                                setIsContactModalOpen(true);
                              } else {
                                setOpenContactModalAfterLogin(true);
                                setIsLoginModalOpen(true);
                              }
                            }}
                          >
                            Contact Builder
                          </button>
                        </div>

                        {isContactModalOpen && (
                          <ContactDetails
                            onClose={() => setIsContactModalOpen(false)}
                            fullName={builder.full_name}
                            mobile={builder.mobile_number}
                          />
                        )}

                        {/* Agent Stats */}
                        <div className="flex items-center ml-8 space-x-8">
                          <div className="flex flex-col items-center pr-4 border-r-2 border-rose-100">
                            <p className="flex items-center">
                              <AiFillHome className="text-xl text-rose-700" />
                              <span className="ml-1">
                                {builder.experience}
                              </span>{" "}
                              years
                            </p>
                            <span className="text-sm leading-none text-gray-600">
                              Experience
                            </span>
                          </div>

                          <div className="flex flex-col items-center px-4 border-r-2 border-rose-100">
                            <p className="flex items-center">
                              <AiFillHome className="text-xl text-rose-700" />
                              <span className="ml-1">{totalCount}</span>
                            </p>
                            <span className="text-sm leading-none text-gray-600">
                              Properties
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
          </div>
          <div className="ml-4 ">
            <p className="text-2xl font-medium text-black">Projects</p>
          </div>

          {/* ==================== PROJECT CARDS GRID (Spotlights card design) ==================== */}
          <div className="py-4 px-6 sm:px-10 bg-white rounded-2xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => {
                const isCommercial =
                  project.property_category === "Commercial" ||
                  (project.commercial_units &&
                    project.commercial_units.length > 0);

                const commercialUnits =
                  project.commercial_units &&
                    project.commercial_units.length > 0
                    ? project.commercial_units
                    : [];

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
                  project.project_properties &&
                    project.project_properties.length > 0
                    ? project.project_properties.map((u) => ({
                      ...u,
                      type: u.bhk_type || u.project_type,
                      price: Number(
                        u.price ||
                        u.property_price ||
                        u.unit_price ||
                        u.configuration_price ||
                        u.amount ||
                        resolvedProjectPrice,
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
                  <div key={index} className="h-full">
                    {/* ==================== CARD ==================== */}
                    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_6px_24px_rgba(17,24,39,0.08)] hover:shadow-[0_18px_48px_rgba(17,24,39,0.16)] transition-all duration-300 flex flex-col h-full min-h-[440px] sm:min-h-[460px] lg:min-h-[480px] w-full">
                      {/* IMAGE SECTION */}
                      <div className="relative overflow-hidden flex-shrink-0 h-[150px] sm:h-[165px] lg:h-[180px]">
                        <img
                          src={project.cover_image}
                          alt={project.project_name || ""}
                          className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500 ease-out"
                          onClick={() => handleProjectClick(project._id)}
                        />

                        {/* Top Left badge */}
                        <div className="absolute top-2 left-2 z-10">
                          <div className="bg-gradient-to-r from-[#8B1E3F] to-[#6D1732] text-white pl-2 pr-2.5 py-1 rounded-full flex items-center gap-1 text-[9px] font-semibold shadow-[0_2px_10px_rgba(139,30,63,0.4)]">
                            <MdFiberNew size={11} />
                            <span>New Booking</span>
                          </div>
                        </div>
                        {/* Wishlist Heart */}
                        <button
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!sessionStorage.getItem("accessToken")) {
                              setIsLoginModalOpen(true);
                              return;
                            }
                            if (project.is_favorite) {
                              removeFromFavoritesProperty(
                                project.favorite_id,
                                project._id,
                              );
                            } else {
                              addToFavoritesProperty(project._id);
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

                        {/* Virtual Tour */}
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
                            <span className="hidden sm:inline">
                              Virtual Tour
                            </span>
                          </a>
                        )}

                        {/* Property Type Ribbon */}
                        {project.property_for && (
                          <div className="absolute bottom-0 left-0 bg-blue-700 text-white px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide">
                            {project.property_for}
                          </div>
                        )}
                      </div>

                      {/* CARD BODY */}
                      <div
                        className="cursor-pointer flex flex-col flex-1 min-h-0"
                        onClick={() => handleProjectClick(project._id)}
                      >
                        <div className="px-3.5 pt-3 flex-shrink-0">
                          <h2 className="text-xl sm:text-[22px] lg:text-2xl leading-tight font-bold text-[#111827] line-clamp-2">
                            {project.project_name ||
                              "No Project Name Available"}
                          </h2>
                          <p className="mt-1 text-gray-500 text-[11px] sm:text-xs lg:text-sm line-clamp-2">
                            {subtitle}
                          </p>
                        </div>

                        {isCommercial && (
                          <div className="px-3.5 mt-2 flex-shrink-0 flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-700">
                            <HiOutlineOfficeBuilding
                              className="text-[#A70D2A]"
                              size={13}
                            />
                            <span>Commercial Property</span>
                          </div>
                        )}

                        {/* CONFIGURATION SECTION */}
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

                        <div className="mt-auto flex-shrink-0">
                          {/* BUILDER SECTION */}
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

                          {/* BOTTOM BUTTONS */}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 pb-6">
              <button
                onClick={handlePrev}
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
                    ${currentPage === i + 1
                      ? "my-border text-black font-normal"
                      : "text-gray-700"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNext}
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
    </>
  );
};

export default ProjectBuilder;