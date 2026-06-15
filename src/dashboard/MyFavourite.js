import React, { useState, useEffect } from "react";
import { Heart, Camera, Home, Ruler } from "lucide-react";
import { PiShareNetworkLight } from "react-icons/pi";
import axios from "axios";
import ShareModal from "../containers/ShareModal";
import { Link } from "react-router-dom";
import { User } from "@phosphor-icons/react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChair } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineUser } from "react-icons/ai";
import { FaRupeeSign } from "react-icons/fa";

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
  const [imageIndexes, setImageIndexes] = useState({});
  const [slideInterval, setSlideInterval] = useState(null);
  const [activeTab, setActiveTab] = useState("property");
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

          // Image index handling for properties
          const newIndexes = {};
          data.data.forEach((property) => {
            newIndexes[property._id] = 0;
          });
          setImageIndexes(newIndexes);

          // Set up auto-slide interval
          const interval = setInterval(() => {
            setImageIndexes((prevIndexes) => {
              const newIndexes = { ...prevIndexes };
              data.data.forEach((property) => {
                const currentIdx = prevIndexes[property._id] || 0;
                const totalImages = property.property_images.length;
                const nextIdx = (currentIdx + 1) % totalImages;
                newIndexes[property._id] = nextIdx;
              });
              return newIndexes;
            });
          }, 2000);
          setSlideInterval(interval);
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
  }, [currentPage, userId, activeTab]);

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

  const [activeIndexes, setActiveIndexes] = useState({});
  const BASE_URL = process.env.REACT_APP_API_URL;
  const imageSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, activeTab]);

  const convertToSqFt = (area, unit) => {
    if (!area || !unit) return null;

    switch (unit.toLowerCase()) {
      case "sq ft":
        return area; // already in sq ft
      case "sq yard":
        return area * 9; // 1 sq yard = 9 sq ft
      case "sq mt":
        return area * 10.7639; // 1 sq mt = 10.7639 sq ft
      case "acre":
        return area * 43560; // 1 acre = 43,560 sq ft
      default:
        return area; // fallback if unit is unknown
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

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <h2 className="mb-6 text-3xl font-bold">My Favourites</h2>
      {errorMsg && <p className="mb-4 text-red-500">{errorMsg}</p>}
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          className={`px-4 py-2 font-semibold border-b-2 ${
            activeTab === "property"
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
          className={`px-4 py-2 font-semibold border-b-2 ${
            activeTab === "project"
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {/* For Propertis */}
        {activeTab === "property" && (
          <>
            {prop.map((property) => {
              const propertyImages = property.property_images || [];
              const currentIndex = imageIndexes[property._id] || 0;
              const currentImage =
                propertyImages[currentIndex]?.image || property.cover_image;

              return (
                <div
                  key={property._id}
                  className="relative overflow-hidden bg-white border shadow-md rounded-2xl"
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
                          {/* First slide: cover image */}
                          <div key={`cover-${property._id}`}>
                            <img
                              src={property.cover_image}
                              alt="Cover"
                              className="object-cover w-full h-48 rounded-t-2xl"
                            />
                          </div>

                          {/* Other property images */}
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
                        // Just one image — no slider
                        <div>
                          <img
                            src={property.cover_image || "/image/app.png"}
                            alt="Cover"
                            className="object-cover w-full h-48 rounded-t-2xl"
                          />
                        </div>
                      )}
                    </Link>

                    <div className="absolute flex space-x-2 top-3 left-3">
                      <span className="px-2 py-1 text-xs text-white rounded-full bg-black/50">
                        {property?.days_since_created ?? 0} days on NoWayBroker
                      </span>
                    </div>

                    <div className="absolute flex space-x-2 top-2 right-2">
                      {property?.virtual_tour_availability === "Yes" && (
                        <span className="flex items-center px-2 py-1 text-xs text-white rounded-full bg-black/50">
                          <Camera size={14} className="mr-1" /> Virtual Tour
                        </span>
                      )}
                      <button
                        className="p-2 bg-white rounded-full shadow"
                        onClick={() => handleUnfavorite(property.favorite_id)}
                      >
                        <Heart
                          size={22}
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

                    <div className="absolute bottom-0 left-0 flex space-x-2">
                      <span
                        className={`text-white text-xs px-3 py-1 rounded-ss-lg ${
                          property.property_category_type === "Buy"
                            ? "bg-green-500"
                            : property.property_category_type === "Rent"
                              ? "bg-blue-500"
                              : "bg-gray-400"
                        }`}
                      >
                        {property.property_category_type === "Buy"
                          ? "For Buy"
                          : property.property_category_type === "Rent"
                            ? "For Rent"
                            : "UNKNOWN"}
                      </span>
                    </div>

                    <div className="absolute bottom-0 right-0">
                      {property.mark_as_featured === "Yes" && (
                        <span className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-ss-lg">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {property.property_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {property.building_type} : {property.property_type}
                        </p>
                      </div>
                      <PiShareNetworkLight
                        className="p-2 text-gray-600 bg-white rounded shadow cursor-pointer"
                        size={32}
                        onClick={() =>
                          openShareModal1(
                            `${window.location.origin}/propertydetails/${property._id}`,
                            property._id,
                          )
                        }
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

                    <div className="flex items-center mb-1 space-x-4 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <Home size={16} className="my-text" />
                        {property.property_category_type === "Rent" ? (
                          <>
                            ₹{" "}
                            {Number(property.rent) >= 10000000
                              ? (Number(property.rent) / 10000000)
                                  .toFixed(1)
                                  .replace(/\.0$/, "") + " Cr"
                              : Number(property.rent) >= 100000
                                ? (Number(property.rent) / 100000)
                                    .toFixed(1)
                                    .replace(/\.0$/, "") + " L"
                                : Number(property.rent) >= 1000
                                  ? (Number(property.rent) / 1000)
                                      .toFixed(1)
                                      .replace(/\.0$/, "") + " K"
                                  : property.rent}
                            {property.rent_duration &&
                            property.rent_duration !== "N/A"
                              ? ` / ${property.rent_duration}`
                              : ""}
                          </>
                        ) : (
                          property.property_price &&
                          property.property_price !== "N/A" && (
                            <>
                              ₹{" "}
                              {Number(property.property_price) >= 10000000
                                ? (Number(property.property_price) / 10000000)
                                    .toFixed(1)
                                    .replace(/\.0$/, "") + " Cr"
                                : Number(property.property_price) >= 100000
                                  ? (Number(property.property_price) / 100000)
                                      .toFixed(1)
                                      .replace(/\.0$/, "") + " L"
                                  : Number(property.property_price) >= 1000
                                    ? (Number(property.property_price) / 1000)
                                        .toFixed(1)
                                        .replace(/\.0$/, "") + " K"
                                    : property.property_price}
                            </>
                          )
                        )}
                      </div>

                      {property.bhk_type && (
                        <div className="flex items-center gap-1">
                          <Home size={16} className="my-text" />
                          {property.bhk_type}
                        </div>
                      )}

                      {property.area && property.area_in && (
                        <div className="flex items-center gap-1">
                          <Ruler size={16} className="my-text" />
                          {Math.round(
                            convertToSqFt(property.area, property.area_in),
                          )}{" "}
                          sq ft
                        </div>
                      )}
                    </div>

                    <div className="flex items-center w-full mt-2">
                      {property.furnished_type ? (
                        <p className="flex items-center text-base">
                          <FontAwesomeIcon
                            icon={faChair}
                            className="mr-1 my-text"
                          />
                          {property.furnished_type}
                        </p>
                      ) : (
                        <p className="flex items-center opacity-0">&nbsp;</p>
                      )}
                    </div>

                    <p className="text-sm text-gray-500">
                      {property.furnishing}
                    </p>
                    <p className="text-sm text-gray-500">
                      {property.address_area}
                    </p>

                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-10 h-10 p-2 rounded-full bg-slate-100 ">
                        {property.property_owner_image ? (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/media/${property.property_owner_image}`}
                            alt="Owner"
                            className="object-cover w-6 h-6 rounded-full"
                          />
                        ) : (
                          <AiOutlineUser
                            className="text-xl text-gray-600"
                            size={25}
                          />
                        )}
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-medium leading-tight">
                          {property.connect_to_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {property.user_type}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* For Propertis */}
        {activeTab === "project" && (
          <>
            {projects.map((project) => {
              return (
                <div
                  key={project._id}
                  className="max-w-[500px] w-full bg-transparent relative overflow-hidden"
                >
                  <div className="relative">
                    {/* Only Cover Image */}
                    <img
                      src={project.cover_image || "/image/app.png"}
                      alt="Cover"
                      className="w-full h-[400px] object-cover rounded-3xl"
                    />

                    {/* Overlay with Logo + Name */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] sm:w-80 h-[130px] bg-gray-800/60 backdrop-blur-md flex flex-col justify-end p-4 rounded-t-3xl">
                      {/* Project Logo */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 w-[100px] h-[100px] rounded-full flex justify-center items-center shadow-lg overflow-hidden">
                        <img
                          src={project.cover_image || "/image/app.png"}
                          alt="Project Logo"
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Project Name */}
                      <h3 className="text-center text-white text-lg font-semibold min-h-[14px]">
                        {project.project_name || "No Project Name Available"}
                      </h3>
                    </div>

                    {/* Favorite Button */}
                    <div className="absolute flex space-x-2 top-2 right-2">
                      <button
                        className="p-2 bg-white rounded-full shadow"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnfavoriteProject(project.favorite_id);
                        }}
                      >
                        <Heart
                          size={22}
                          stroke={project.is_favorite ? "none" : "white"}
                          color={
                            project.is_favorite
                              ? "red"
                              : "rgba(75, 85, 99, 0.4) "
                          }
                          fill={
                            project.is_favorite
                              ? "red"
                              : "rgba(75, 85, 99, 0.4) "
                          }
                          strokeWidth={2}
                        />
                      </button>
                    </div>

                    {/* Featured Badge */}
                    <div className="absolute bottom-0 right-0">
                      {project.mark_as_featured === "Yes" && (
                        <span className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-ss-lg">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Block */}
                  <div className="p-3 text-start shadow-sm rounded-b-3xl relative bg-white w-[90%] sm:w-80 m-auto border">
                    <p className="p-0 mt-1 text-lg text-gray-600">
                      {" "}
                      {project.congfigurations || "No Configurations"}{" "}
                    </p>

                    {/* Address */}
                    <p className="flex items-start justify-start gap-2 mt-1 text-sm font-bold text-gray-500 truncate">
                      <img
                        src="/image/address_icon.png" // replace with your actual icon path
                        alt="Location Icon"
                        className="object-contain w-4 h-4"
                      />
                      {project.address_area || "No Address Provided"}
                    </p>
                    {project.project_properties &&
                      project.project_properties.length > 0 &&
                      (() => {
                        const prices = project.project_properties.map((p) =>
                          Number(p.price),
                        );
                        const minPrice = Math.min(...prices);
                        const maxPrice = Math.max(...prices);

                        return (
                          <h4 className="flex items-center mb-0 text-xl font-bold my-text sm:text-2xl">
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
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 space-x-2">
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
              className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-200 ${
                currentPage === index + 1
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
  );
};

export default MyFavourite;
