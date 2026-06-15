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
import { FaRupeeSign } from "react-icons/fa";
import Login1 from "../auth/Login1";
import SignUp1 from "../auth/SignUp1";

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

  const handleProjectClick = (projectId) => {
    history.push(`/projectdetail/${encodeURIComponent(projectId)}`);
  };

  const settings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    cssEase: "linear",
    centerMode: false,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
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
    <div className="py-4 ml-10 mr-10 bg-white rounded-2xl">
      <div className="flex flex-col items-center justify-between px-2 sm:flex-row">
        <div className="flex flex-col text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Builders Projects
          </h2>
          <p className="text-gray-500">Go from browsing to buying</p>
        </div>

        <div className="flex items-center w-full mt-4 mb-3 space-x-3 sm:mt-0 sm:w-auto">
          <button
            className="w-full px-4 py-2 text-sm text-rose-700 bg-white my-border rounded-lg sm:px-6 sm:hidden"
            onClick={handleClick}
          >
            View All Projects
          </button>
          <button
            className="hidden px-4 py-2 text-sm my-text bg-white my-border rounded-lg sm:px-6 sm:block"
            onClick={handleClick}
          >
            View All Projects
          </button>
          <button
            className="p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md sm:text-2xl hover:shadow-lg"
            onClick={() => sliderRef.current.slickPrev()}
          >
            <GoArrowLeft className="text-3xl text-black" />
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
          <div key={index} className="px-4">
            <div className="max-w-[500px] w-full bg-white rounded-3xl">
              <div className="relative">
                <img
                  src={project.cover_image}
                  alt={project.name}
                  className="w-full h-[320px] object-cover rounded-t-3xl cursor-pointer"
                  onClick={() => handleProjectClick(project._id)}
                />
                <div className="absolute top-2 right-2 flex items-center space-x-2">
                  <button
                    className="bg-gray-800/60 backdrop-blur-sm p-2 rounded-full shadow"
                    onClick={() => {
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
                    <Heart
                      size={22}
                      stroke={project.is_favorite ? "none" : "white"}
                      color={
                        project.is_favorite ? "red" : "rgba(75, 85, 99, 0.4) "
                      }
                      fill={
                        project.is_favorite ? "red" : "rgba(75, 85, 99, 0.4) "
                      }
                      strokeWidth={2}
                    />
                  </button>

                  <FontAwesomeIcon
                    icon={faShareNodes}
                    className="text-gray-500 bg-white p-2 rounded shadow cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      openSpotlightShareModal(project._id);
                    }}
                  />
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[80%] sm:w-80 h-[100px] bg-gray-800/60 backdrop-blur-md flex flex-col justify-end p-4 rounded-t-3xl">
                  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 w-[55px] h-[55px] rounded-full flex justify-center items-center shadow-lg overflow-hidden">
                    <img
                      src={project.logo}
                      alt="Project Logo"
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <h3 className="text-center text-white text-lg font-semibold min-h-[24px]">
                    {project.project_name || "No Project Name Available"}
                  </h3>
                </div>
              </div>

              <div className="px-0">
                <div className="p-3 bg-white shadow-sm rounded-b-3xl">
                  <p className="text-lg font-semibold text-gray-800 p-0 m-1 truncate whitespace-nowrap overflow-hidden">
                    {project.congfigurations
                      ? project.congfigurations.includes("BHK")
                        ? project.congfigurations
                        : project.congfigurations
                            .split(",")
                            .map((c) => `${c.trim()} BHK`)
                            .join(", ")
                      : "No Configurations"}
                  </p>

                  <p className="text-xs uppercase tracking-wider text-gray-400 p-0 m-1">
                    {project.project_type}
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-2 flex items-center gap-2 truncate">
                    {/* <img
                      src="/image/address_icon.png"
                      alt="Location Icon"
                      className="w-5 h-5 object-contain"
                    /> */}
                    {project.address_area || "No Address Provided"}
                  </p>

                  {/* <div className="flex-1">
                    {project.project_properties &&
                      project.project_properties.length > 0 &&
                      (() => {
                        const prices = project.project_properties.map((p) =>
                          Number(p.price),
                        );
                        const minPrice = Math.min(...prices);
                        const maxPrice = Math.max(...prices);

                        return (
                          <h4 className="flex items-center text-xl font-bold my-text mb-0 sm:text-2xl">
                            {minPrice === maxPrice ? (
                              formatAverageProjectPrice(minPrice)
                            ) : (
                              <>
                                {formatAverageProjectPrice(minPrice)}
                                <span className="mx-1">-</span>
                                {formatAverageProjectPrice(maxPrice)}
                              </>
                            )}
                          </h4>
                        );
                      })()}
                  </div> */}
                  <div className="flex-1 mt-3">
                    {project.average_project_price && (
                      <h4 className="text-lg font-bold text-slate-800 mt-2">
                        {" "}
                        {formatAverageProjectPrice(
                          Number(project.average_project_price),
                        )}
                      </h4>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
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
    </div>
  );
};

export default Spotlights;
