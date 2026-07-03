import { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext, MdApartment } from "react-icons/md";
import { Heart, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FaRupeeSign, FaBath, FaMapMarkerAlt } from "react-icons/fa";
import { RiRuler2Line } from "react-icons/ri";
import { AiOutlineClockCircle, AiOutlineUser } from "react-icons/ai";
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

      setProjects(Array.isArray(response.data.data) ? response.data.data : []);
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
    price = parseInt(price);

    if (price >= 10000000) {
      return parseFloat((price / 10000000).toFixed(1)) + " Cr";
    } else if (price >= 100000) {
      return parseFloat((price / 100000).toFixed(1)) + " L";
    } else if (price >= 1000) {
      return parseFloat((price / 1000).toFixed(1)) + " K";
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

    // Normal number formatting
    price = parseInt(price);
    if (isNaN(price)) return "";

    let formatted;
    if (price >= 10000000) {
      formatted = parseFloat((price / 10000000).toFixed(1)) + " Cr";
    } else if (price >= 100000) {
      formatted = parseFloat((price / 100000).toFixed(1)) + " L";
    } else if (price >= 1000) {
      formatted = parseFloat((price / 1000).toFixed(1)) + " K";
    } else {
      formatted = price.toString();
    }
    return (
      <span className="inline-flex items-center">
        <FaRupeeSign className="inline-block mr-1" />
        {formatted}
      </span>
    );
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

            {/* Spotlight-style card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 mt-4">
              {visibleProjects.map((project, index) => (
                <div key={project._id || index} className="px-2 md:px-0">
                  <div className="w-full overflow-hidden bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <img
                        src={project.cover_image}
                        alt={project.project_name}
                        className="w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[320px] object-cover rounded-t-2xl cursor-pointer"
                        onClick={() => handleProjectClick(project._id)}
                      />

                      {/* Heart */}
                      <div className="absolute top-2 right-2 flex items-center space-x-2">
                        <button
                          className="bg-gray-800/60 backdrop-blur-sm p-2 rounded-full shadow"
                          onClick={() => {
                            if (!sessionStorage.getItem("accessToken")) {
                              toast.error("Please login to add to favorites");
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
                          <Heart
                            size={20}
                            stroke={project.is_favorite ? "none" : "white"}
                            color={
                              project.is_favorite
                                ? "red"
                                : "rgba(75, 85, 99, 0.4)"
                            }
                            fill={
                              project.is_favorite
                                ? "red"
                                : "rgba(75, 85, 99, 0.4)"
                            }
                            strokeWidth={2}
                          />
                        </button>
                      </div>

                      {/* Logo + Project Name overlay */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[90%] sm:w-[85%] md:w-[80%] h-[110px] md:h-[120px] bg-gray-800/60 backdrop-blur-md flex flex-col justify-end p-4 rounded-t-3xl">
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 w-[70px] h-[70px] md:w-[80px] md:h-[80px] rounded-full flex justify-center items-center shadow-lg overflow-hidden">
                          <img
                            src={project.logo}
                            alt="Project Logo"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <h3 className="text-center text-white text-lg md:text-2xl font-bold line-clamp-2 min-h-[48px] mt-4">
                          {project.project_name || "No Project Name Available"}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div
                      className="p-4 bg-white rounded-b-2xl cursor-pointer"
                      onClick={() => handleProjectClick(project._id)}
                    >
                      {/* Row 1: Project Name + Furnished Type */}
                      <div className="flex items-start justify-between gap-3 mb-0">
                        <h3 className="flex-1 m-0 text-base font-bold leading-6 text-gray-900 truncate">
                          {project.project_name || ""}
                        </h3>
                        {project.furnished_type && (
                          <span className="flex-shrink-0 text-sm font-medium leading-6 text-black whitespace-nowrap">
                            {project.furnished_type}
                          </span>
                        )}
                      </div>

                      {/* Row 2: Subtitle */}
                      <p className="mt-0 mb-2 text-sm leading-5 text-gray-500 truncate">
                        {project.congfigurations
                          ? project.congfigurations.includes("BHK")
                            ? project.congfigurations
                            : project.congfigurations
                              .split(",")
                              .map((c) => `${c.trim()} BHK`)
                              .join(", ")
                          : ""}{" "}
                        {project.project_type} for Sale in{" "}
                        {project.address_area || ""}
                        {project.city_name ? `, ${project.city_name}` : ""}
                      </p>

                      {/* Row 3: Price + Status */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-bold">
                          {formatAverageProjectPrice(
                            project.average_project_price,
                          )}
                        </span>
                        {project.possession_status === "Ready To Move" && (
                          <div className="flex items-center gap-2 px-3 py-1 ml-6 bg-green-100 border border-green-200 rounded-full">
                            <MdApartment className="text-base text-green-700" />
                            <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
                              Ready to Move
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Row 4: Features Grid */}
                      <div className="grid grid-cols-3 py-3 border-t border-b border-gray-100">
                        {/* Configuration / Type */}
                        <div className="flex items-center gap-2 px-1 min-w-0">
                          <Building2
                            size={20}
                            className="text-gray-700 flex-shrink-0"
                          />
                          <div className="flex flex-col min-w-0 leading-tight">
                            <p className="m-0 text-sm font-semibold leading-4 truncate">
                              {project.congfigurations
                                ? project.congfigurations.includes("BHK")
                                  ? project.congfigurations
                                    .split(",")[0]
                                    .trim()
                                  : `${project.congfigurations
                                    .split(",")[0]
                                    .trim()} BHK`
                                : ""}
                            </p>
                            <p className="m-0 text-xs leading-4 text-gray-500">
                              {project.project_type || "Apartment"}
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
                              {project.bathroom || 0} Baths
                            </p>
                            <p className="m-0 text-xs text-gray-500 truncate">
                              Bathrooms
                            </p>
                          </div>
                        </div>

                        {/* Built Up Area */}
                        <div className="flex items-center gap-2 px-1 border-l border-gray-200 min-w-0">
                          <RiRuler2Line className="text-[22px] text-gray-700 flex-shrink-0" />
                          <div className="flex flex-col min-w-0 leading-tight">
                            <p className="m-0 text-sm font-semibold leading-4 truncate">
                              {project.area ? `${project.area} Sq.ft` : "N/A"}
                            </p>
                            <p className="m-0 text-xs leading-4 text-gray-500">
                              Built Up Area
                            </p>
                          </div>
                        </div>
                      </div>

                      <hr className="my-1 border-gray-100" />

                      {/* Row 5 : Posted By | Days | Distance | Share */}
                      <div className="flex items-center justify-between pt-1 pb-2 text-[13px] text-gray-600">
                        {/* Left */}
                        <div className="flex items-center flex-wrap min-w-0">
                          {/* Posted By */}
                          <div className="flex items-center">
                            <AiOutlineClockCircle className="mr-1 text-[15px] text-gray-700" />
                            <span className="truncate">
                              Posted by {project.user_type || "Builder"}
                            </span>
                          </div>

                          {/* Dot */}
                          <span className="mx-2 text-gray-400">•</span>

                          {/* Days */}
                          <span className="whitespace-nowrap">
                            {project.days_since_created !== undefined &&
                              project.days_since_created !== null
                              ? project.days_since_created === 0
                                ? "Today"
                                : `${project.days_since_created} days ago`
                              : project.created_at
                                ? `${Math.max(
                                  0,
                                  Math.floor(
                                    (Date.now() -
                                      new Date(project.created_at).getTime()) /
                                    (1000 * 60 * 60 * 24),
                                  ),
                                )} days ago`
                                : "Recently"}
                          </span>

                          {/* Distance */}
                          {getProjectDistance(project) && (
                            <>
                              <span className="mx-2 text-gray-400">•</span>
                              <div className="flex items-center whitespace-nowrap">
                                <FaMapMarkerAlt className="mr-1 text-red-500" />
                                {getProjectDistance(project)} km from you
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
                            openSpotlightShareModal(project._id);
                          }}
                        />
                      </div>

                      {/* Row 6: Owner Details */}
                      <div className="flex items-center pt-2">
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 overflow-hidden rounded-full bg-blue-100">
                          {project.property_owner_image &&
                            !project.property_owner_image.includes(
                              "default_profile",
                            ) ? (
                            <img
                              src={`${process.env.REACT_APP_API_URL}/media/${project.property_owner_image}`}
                              alt={project.connect_to_name || "Builder"}
                              className="object-cover w-full h-full rounded-full"
                            />
                          ) : (
                            <AiOutlineUser className="text-xl text-blue-600" />
                          )}
                        </div>

                        <div className="flex items-center ml-4">
                          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                            {project.connect_to_name || "Builder"}
                          </span>
                          <div className="w-px h-4 mx-4 bg-gray-300"></div>
                          <span className="text-sm text-gray-500 whitespace-nowrap">
                            {project.user_type || "Builder"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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