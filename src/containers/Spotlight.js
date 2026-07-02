import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FaRupeeSign, FaMapMarkerAlt, FaBath } from "react-icons/fa";
import { Building2, Ruler } from "lucide-react";
import { RiRuler2Line } from "react-icons/ri";
import { AiOutlineClockCircle } from "react-icons/ai";
import Login1 from "../auth/Login1";
import SignUp1 from "../auth/SignUp1";
import { MdApartment } from "react-icons/md";

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

  useEffect(() => {
    if (data && data.status === 1 && Array.isArray(data.data)) {
      setProjectList(data.data);
    } else {
      setProjectList([]);
      console.log("No projects found");
    }
  }, [data]);

  const handleClick = () => {
    history.push("/ProjectList");
  };
  useEffect(() => {
    console.log("Spotlight API Response:", data);
  }, [data]);
  useEffect(() => {
    console.log("Project List:", projectList);
  }, [projectList]);

  const handleProjectClick = (projectId) => {
    history.push(`/projectdetail/${encodeURIComponent(projectId)}`);
  };
  // const settings = {
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 4,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   autoplaySpeed: 3000,
  //   arrows: false,
  //   dots: false,
  //   adaptiveHeight: false,

  //   responsive: [
  //     {
  //       breakpoint: 1536,
  //       settings: {
  //         slidesToShow: 4,
  //       },
  //     },
  //     {
  //       breakpoint: 1280,
  //       settings: {
  //         slidesToShow: 3,
  //       },
  //     },
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 2,
  //       },
  //     },
  //     {
  //       breakpoint: 768,
  //       settings: {
  //         slidesToShow: 2,
  //       },
  //     },
  //     {
  //       breakpoint: 640,
  //       settings: {
  //         slidesToShow: 1,
  //       },
  //     },
  //   ],
  // };


  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: false,
    adaptiveHeight: false,

    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 4 } },
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };
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

      const favId = res.data?.favorite_id || projectId; // fallback to projectId
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

  return (
    <div className="px-3 py-4 bg-white rounded-2xl sm:px-4 md:px-6 lg:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl">
            Builders Projects
          </h2>
          <p className="text-gray-500">Go from browsing to buying</p>
        </div>

        <div className="flex items-center justify-between w-full gap-2 md:w-auto">
          <button
            className="px-4 py-2 text-xs bg-white rounded-lg sm:text-sm md:text-base my-border my-text whitespace-nowrap"
            onClick={handleClick}
          >
            View All Projects
          </button>
          {/* <button
            className="hidden px-4 py-2 text-sm my-text bg-white my-border rounded-lg sm:px-6 sm:block"
            onClick={handleClick}
          >
            View All Projects
          </button> */}
          <button
            className="p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md sm:text-2xl hover:shadow-lg"
            onClick={() => sliderRef.current.slickPrev()}
          >
            <GoArrowLeft className="text-xl text-black md:text-2xl" />
          </button>
          <button
            className="p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md sm:text-2xl hover:shadow-lg"
            onClick={() => sliderRef.current.slickNext()}
          >
            <GoArrowRight className="text-3xl text-black" />
          </button>
        </div>
      </div>

      <Slider ref={sliderRef} {...settings} className="mx-auto">
        {projectList.map((project, index) => (
          <div key={index} className="px-2 md:px-3">
            <div className="w-full overflow-hidden bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img
                  src={project.cover_image}
                  alt={project.project_name}
                  className="w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[320px] object-cover rounded-t-2xl cursor-pointer"
                  onClick={() => handleProjectClick(project._id)}
                />

                {/* Heart + Share */}
                <div className="absolute top-2 right-2 flex items-center space-x-2">
                  <button
                    className="bg-gray-800/60 backdrop-blur-sm p-2 rounded-full shadow"
                    onClick={() => {
                      if (!sessionStorage.getItem("accessToken")) {
                        setIsLoginModalOpen(true);
                        return;
                      }
                      if (project.is_favorite) {
                        removeFromFavoritesRecommendedProperty(project.favorite_id, project._id);
                      } else {
                        addToFavoritesRecommendedProperty(project._id);
                      }
                    }}
                  >
                    <Heart
                      size={20}
                      stroke={project.is_favorite ? "none" : "white"}
                      color={project.is_favorite ? "red" : "rgba(75, 85, 99, 0.4)"}
                      fill={project.is_favorite ? "red" : "rgba(75, 85, 99, 0.4)"}
                      strokeWidth={2}
                    />
                  </button>
                  <FontAwesomeIcon
                    icon={faShareNodes}
                    className="text-gray-500 bg-white p-2 rounded shadow cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openSpotlightShareModal(project._id);
                    }}
                  />
                </div>


                {/* Logo + Project Name overlay */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[90%] sm:w-[85%] md:w-[80%] h-[110px] md:h-[120px] bg-gray-800/60 backdrop-blur-md flex flex-col justify-end p-4 rounded-t-3xl">
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 w-[70px] h-[70px] md:w-[80px] md:h-[80px] rounded-full flex justify-center items-center shadow-lg overflow-hidden">
                    <img src={project.logo} alt="Project Logo" className="object-cover w-full h-full" />
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
                      : project.congfigurations.split(",").map((c) => `${c.trim()} BHK`).join(", ")
                    : ""}{" "}
                  {project.project_type} for Sale in {project.address_area || ""}
                  {project.city_name ? `, ${project.city_name}` : ""}
                </p>

                {/* Row 3: Price + Status */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-bold">
                    {formatAverageProjectPrice(project.average_project_price)}
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
                    <Building2 size={20} className="text-gray-700 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 leading-tight">
                      <p className="m-0 text-sm font-semibold leading-4 truncate">
                        {project.congfigurations
                          ? project.congfigurations.includes("BHK")
                            ? project.congfigurations.split(",")[0].trim()
                            : `${project.congfigurations.split(",")[0].trim()} BHK`
                          : ""}
                      </p>
                      <p className="m-0 text-xs leading-4 text-gray-500">{project.project_type || "Apartment"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-1 border-l border-gray-200 min-w-0">
                    <FaBath size={18} className="text-gray-700 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 leading-tight">
                      <p className="m-0 text-sm font-semibold text-gray-900 truncate">
                        {project.bathroom || 0} Baths
                      </p>
                      <p className="m-0 text-xs text-gray-500 truncate">Bathrooms</p>
                    </div>
                  </div>

                  {/* Built Up Area */}
                  <div className="flex items-center gap-2 px-1 border-l border-gray-200 min-w-0">
                    <RiRuler2Line className="text-[22px] text-gray-700 flex-shrink-0" />
                    <div className="flex flex-col min-w-0 leading-tight">
                      <p className="m-0 text-sm font-semibold leading-4 truncate">
                        {project.area ? `${project.area} Sq.ft` : "N/A"}
                      </p>
                      <p className="m-0 text-xs leading-4 text-gray-500">Built Up Area</p>
                    </div>
                  </div>
                </div>




                <hr className="my-1 border-gray-100" />

                {/* Row 5 : Posted By | Days | Distance | Share */}
                {/* <div className="flex items-center justify-between pt-1 pb-2 text-[13px] text-gray-600"> */}
                {/* Left */}
                {/* <div className="flex items-center flex-wrap min-w-0"> */}
                {/* Posted By */}
                {/* <div className="flex items-center">
                                             <AiOutlineClockCircle className="mr-1 text-[15px] text-gray-700" />
                                             <span className="truncate">
                                               Posted by {project.user_type || "Owner"}
                                             </span>
                                           </div> */}

                {/* Dot */}
                {/* <span className="mx-2 text-gray-400">•</span>
                */}
                {/* Days */}
                {/* <span className="whitespace-nowrap">
                                             {project.days_since_created
                                               ? `${project.days_since_created} days ago`
                                               : "Recently"}
                                           </span> */}

                {/* Distance */}
                {/* {project.distance && (
                                             <>
                                               <span className="mx-2 text-gray-400">•</span>
               
                                               <div className="flex items-center whitespace-nowrap">
                                                 <FaMapMarkerAlt className="mr-1 text-red-500" />
                                                 {project.distance} km from you
                                               </div>
                                             </>
                                           )}
                                         </div> */}

                {/* Share */}
                {/* <FontAwesomeIcon
                                           icon={faShareNodes}
                                           className="ml-2 text-[17px] text-gray-500 transition-colors cursor-pointer hover:text-blue-500"
                                           onClick={(e) => {
                                             e.preventDefault();
                                             e.stopPropagation();
                                             openSpotlightShareModal(project._id);
                                           }}
                                         />
                                       </div> */}
                {/* {console.log(
                                         project.connect_to_name,
                                         project.property_owner_image,
                                       )} */}

                {/* Row 6: Owner Details */}
                {/* <div className="flex items-center pt-2">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 overflow-hidden rounded-full bg-blue-100">
                    {project.property_owner_image &&
                      !project.property_owner_image.includes("default_profile") ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/media/${project.property_owner_image}`}
                        alt={project.connect_to_name || "Owner"}
                        className="object-cover w-full h-full rounded-full"
                      />
                    ) : (
                      <span className="text-base text-blue-600 font-bold">
                        {(project.connect_to_name || "B")[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center ml-3">
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {project.connect_to_name || "Builder"}
                    </span>
                    <div className="w-px h-4 mx-3 bg-gray-300"></div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {project.user_type || "Builder"}
                    </span>
                  </div>
                </div> */}
                {/* new ROw */}
                <div className="flex items-center justify-between pt-2">
                  {/* Left */}
                  <div className="flex items-center">
                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 overflow-hidden rounded-full bg-blue-100">
                      {project.property_owner_image &&
                        !project.property_owner_image.includes("default_profile") ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}/media/${project.property_owner_image}`}
                          alt={project.connect_to_name || "Builder"}
                          className="object-cover w-full h-full rounded-full"
                        />
                      ) : (
                        <span className="text-base font-bold text-blue-600">
                          {(project.connect_to_name || "B")[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    <span className="ml-3 text-sm font-semibold text-gray-900">
                      {project.connect_to_name || "Builder"}
                    </span>

                    <div className="w-px h-4 mx-3 bg-gray-300"></div>

                    <span className="text-sm text-gray-500">
                      Posted by {project.user_type || "Builder"}
                    </span>
                  </div>

                  {/* Share */}
                  <FontAwesomeIcon
                    icon={faShareNodes}
                    className="text-[17px] text-gray-500 cursor-pointer hover:text-blue-500"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openSpotlightShareModal(project._id);
                    }}
                  />
                </div>
                {/* end */}
              </div>
            </div>
          </div >

        ))}
      </Slider >
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
    </div >
  );
};

export default Spotlights;