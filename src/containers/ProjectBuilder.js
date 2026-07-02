import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import axios from "axios";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AiFillHome, AiOutlineUser } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { MdApartment } from "react-icons/md";
import { RiRuler2Line } from "react-icons/ri";
import { FaBath, FaRupeeSign } from "react-icons/fa";
import { Building2, Heart } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import ContactDetails from "../containers/ContactDetails";
import ShareModal from "../containers/ShareModal";

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
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [openContactModalAfterLogin, setOpenContactModalAfterLogin] =
    useState(false);

  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareId, setActiveShareId] = useState(null);

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
  }, [id, currentPage]);

  const openShareModal1 = (url, projectId) => {
    setCurrentShareUrl(url);
    setActiveShareId(projectId);
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setActiveShareId(null);
  };

  const formatPrice = (price) => {
    if (!price) return "";
    price = parseInt(price);

    const formatNumber = (num) => {
      return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
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

  if (loading) return <p>Loading projects...</p>;

  // Pagination Handlers
  const handlePrev = () => {
    previousPage && setCurrentPage(currentPage + 1);
  };

  const handleNext = () => {
    nextPage && setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className="min-h-screen ">
        <div className="bg-white shadow-lg rounded-2xl ">
          <div className="relative w-full h-auto p-2 mb-4 rounded-lg shadow-sm bg-rose-50">
            {userDetails &&
              Array.isArray(userDetails) &&
              userDetails.length > 0 && (
                <>
                  {/* Extract builder info */}
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

          {/* Project List - smaller / slim card design */}
          <div className="py-4 px-4 sm:px-6 lg:px-10 bg-white rounded-2xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="w-full overflow-hidden bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative">
                    <Link to={`/projectdetail/${project._id}`} className="block">
                      <img
                        src={project.cover_image}
                        alt={project.project_name}
                        className="w-full h-[140px] sm:h-[150px] object-cover rounded-t-xl cursor-pointer"
                      />
                    </Link>

                    {/* Heart + Share */}
                    <div className="absolute top-1.5 right-1.5 flex items-center space-x-1.5">
                      <button className="bg-gray-800/60 backdrop-blur-sm p-1.5 rounded-full shadow">
                        <Heart
                          size={14}
                          stroke={project.is_favorite ? "none" : "white"}
                          color={
                            project.is_favorite ? "red" : "rgba(75, 85, 99, 0.4)"
                          }
                          fill={
                            project.is_favorite ? "red" : "rgba(75, 85, 99, 0.4)"
                          }
                          strokeWidth={2}
                        />
                      </button>
                      <FontAwesomeIcon
                        icon={faShareNodes}
                        className="text-[10px] text-gray-500 bg-white p-1.5 rounded shadow cursor-pointer"
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

                    {/* Logo + Project Name overlay */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[85%] h-[60px] bg-gray-800/60 backdrop-blur-md flex flex-col justify-end p-2 rounded-t-2xl">
                      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 w-[38px] h-[38px] rounded-full flex justify-center items-center shadow-lg overflow-hidden">
                        <img
                          src={project.logo || project.cover_image}
                          alt="Project Logo"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <h3 className="text-center text-white text-xs font-bold line-clamp-1 mt-2">
                        {project.project_name || "No Project Name Available"}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <Link
                    to={`/projectdetail/${project._id}`}
                    className="block p-3 bg-white rounded-b-xl cursor-pointer no-underline hover:no-underline"
                  >
                    {/* Row 1: Project Name + Furnished Type */}
                    <div className="flex items-start justify-between gap-2 mb-0">
                      <h3 className="flex-1 m-0 text-sm font-bold leading-5 text-gray-900 truncate">
                        {project.project_name || ""}
                      </h3>
                      {project.furnished_type && (
                        <span className="flex-shrink-0 text-[11px] font-medium leading-5 text-black whitespace-nowrap">
                          {project.furnished_type}
                        </span>
                      )}
                    </div>

                    {/* Row 2: Subtitle */}
                    <p className="mt-0 mb-1.5 text-xs leading-4 text-gray-500 truncate">
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
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-base font-bold text-black">
                        {project.project_properties &&
                          project.project_properties.length > 0
                          ? (() => {
                            const prices = project.project_properties.map(
                              (p) => Number(p.price),
                            );
                            const minPrice = Math.min(...prices);
                            const maxPrice = Math.max(...prices);
                            return minPrice === maxPrice ? (
                              formatAverageProjectPrice(minPrice)
                            ) : (
                              <>
                                {formatAverageProjectPrice(minPrice)}
                                <span className="mx-1">-</span>
                                {formatAverageProjectPrice(maxPrice)}
                              </>
                            );
                          })()
                          : formatAverageProjectPrice(
                            project.average_project_price,
                          )}
                      </span>
                      {project.possession_status === "Ready To Move" && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 border border-green-200 rounded-full">
                          <MdApartment className="text-xs text-green-700" />
                          <span className="text-[10px] font-semibold text-green-700 whitespace-nowrap">
                            Ready to Move
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Row 4: Features Grid */}
                    <div className="grid grid-cols-3 py-2 border-t border-b border-gray-100">
                      <div className="flex items-center gap-1 px-1 min-w-0">
                        <Building2
                          size={14}
                          className="text-gray-700 flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0 leading-tight">
                          <p className="m-0 text-[11px] font-semibold leading-3.5 truncate text-black">
                            {project.congfigurations
                              ? project.congfigurations.includes("BHK")
                                ? project.congfigurations.split(",")[0].trim()
                                : `${project.congfigurations.split(",")[0].trim()} BHK`
                              : ""}
                          </p>
                          <p className="m-0 text-[10px] leading-3.5 text-gray-500 truncate">
                            {project.project_type || "Apartment"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 px-1 border-l border-gray-200 min-w-0">
                        <FaBath
                          size={12}
                          className="text-gray-700 flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0 leading-tight">
                          <p className="m-0 text-[11px] font-semibold text-black truncate">
                            {project.bathroom || 0} Baths
                          </p>
                          <p className="m-0 text-[10px] text-gray-500 truncate">
                            Bathrooms
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 px-1 border-l border-gray-200 min-w-0">
                        <RiRuler2Line className="text-[16px] text-gray-700 flex-shrink-0" />
                        <div className="flex flex-col min-w-0 leading-tight">
                          <p className="m-0 text-[11px] font-semibold leading-3.5 truncate text-black">
                            {project.area ? `${project.area} Sq.ft` : "N/A"}
                          </p>
                          <p className="m-0 text-[10px] leading-3.5 text-gray-500 truncate">
                            Built Up Area
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Row 5: Owner Details + Share */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center min-w-0">
                        <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 overflow-hidden rounded-full bg-blue-100">
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
                            <span className="text-[11px] font-bold text-blue-600">
                              {(project.connect_to_name || "B")[0].toUpperCase()}
                            </span>
                          )}
                        </div>

                        <span className="ml-2 text-xs font-semibold text-gray-900 truncate">
                          {project.connect_to_name || "Builder"}
                        </span>

                        <div className="w-px h-3 mx-2 bg-gray-300 flex-shrink-0"></div>

                        <span className="text-xs text-gray-500 truncate">
                          Posted by {project.user_type || "Builder"}
                        </span>
                      </div>

                      <FontAwesomeIcon
                        icon={faShareNodes}
                        className="text-[13px] text-gray-500 cursor-pointer hover:text-blue-500 flex-shrink-0 ml-2"
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
                  </Link>

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
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 pb-4">
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
    </>
  );
};

export default ProjectBuilder;