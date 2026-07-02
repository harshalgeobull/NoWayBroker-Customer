import React, { useState, useEffect } from "react";
import { Heart, Building2 } from "lucide-react";
import { PiShareNetworkLight, PiCubeFocus } from "react-icons/pi";
import { MdApartment } from "react-icons/md";
import { RiRuler2Line } from "react-icons/ri";
import { FaBath, FaRupeeSign, FaWhatsapp, FaPhone } from "react-icons/fa";
import axios from "axios";
import ShareModal from "../containers/ShareModal";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { AiOutlineUser } from "react-icons/ai";

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
        {/* Property Cards */}
        {activeTab === "property" &&
          (prop.length > 0 ? (
            prop.map((property) => (
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
                          const activeSlide = activeIndexes[property._id] || 0;
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
                          property.is_favorite ? "red" : "rgba(75, 85, 99, 0.4) "
                        }
                        fill={
                          property.is_favorite ? "red" : "rgba(75, 85, 99, 0.4) "
                        }
                        strokeWidth={2}
                      />
                    </button>
                  </div>

                  {/* FOR BUY / FOR RENT tag */}
                  <div className="absolute bottom-0 left-0">
                    <span
                      className={`text-white text-xs px-3 py-1 rounded-se-lg ${property.property_category_type === "Buy"
                        ? "bg-green-500"
                        : property.property_category_type === "Rent"
                          ? "bg-blue-500"
                          : "bg-gray-400"
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
                      <span className="flex-shrink-0 text-sm font-medium leading-6 text-red-500 whitespace-nowrap">
                        {property.furnished_type}
                      </span>
                    )}
                  </div>

                  {/* Row 2: Subtitle */}
                  <p className="mt-0 mb-2 text-sm leading-5 text-gray-500 truncate">
                    {property.bhk_type ? `${property.bhk_type} ` : ""}
                    {property.property_type || property.building_type || "Property"}{" "}
                    for Sale in{" "}
                    {property.address_area || property.address || "No Address Provided"}
                  </p>

                  {/* Row 3: Price + Status */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center text-xl font-bold">
                      <FaRupeeSign className="mr-1 text-base" />
                      {property.property_category_type === "Rent"
                        ? `${formatPrice(property.rent).replace("₹ ", "")}${property.rent_duration && property.rent_duration !== "N/A"
                          ? ` / ${property.rent_duration}`
                          : ""
                        }`
                        : formatPrice(property.property_price).replace("₹ ", "")}
                    </span>

                    {(property.possession_status === "Ready To Move" ||
                      property.construction_status === "Ready To Move") && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-200 rounded-full">
                          <MdApartment className="text-base text-green-700" />
                          <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
                            Ready to Move
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Row 4: Features Grid */}
                  <div className="grid grid-cols-3 py-3 border-t border-b border-gray-100">
                    <div className="flex items-center gap-2 px-1 min-w-0">
                      <Building2 size={20} className="text-gray-700 flex-shrink-0" />
                      <div className="flex flex-col min-w-0 leading-tight">
                        <p className="m-0 text-sm font-semibold leading-4 truncate">
                          {property.bhk_type || "-"}
                        </p>
                        <p className="m-0 text-xs leading-4 text-gray-500">
                          {property.building_type || "Apartment"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-1 border-l border-gray-200 min-w-0">
                      <FaBath size={18} className="text-gray-700 flex-shrink-0" />
                      <div className="flex flex-col min-w-0 leading-tight">
                        <p className="m-0 text-sm font-semibold text-gray-900 truncate">
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
                        <p className="m-0 text-sm font-semibold leading-4 truncate">
                          {property.area} {property.area_in}
                        </p>
                        <p className="m-0 text-xs leading-4 text-gray-500 truncate">
                          Built Up Area
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Posted By + Share */}
                  <div className="flex items-center justify-between pt-1 pb-2 text-[13px] text-gray-600">
                    <div className="flex items-center flex-wrap min-w-0">
                      <span>Posted by {property.user_type || "Owner"}</span>
                      {property.days_since_created && (
                        <>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="whitespace-nowrap">
                            {property.days_since_created} days ago
                          </span>
                        </>
                      )}
                    </div>
                    <PiShareNetworkLight
                      className="ml-2 text-[20px] text-gray-500 cursor-pointer hover:text-blue-500"
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
                          <AiOutlineUser className="text-gray-600" size={20} />
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
            ))
          ) : (
            <div className="text-center text-black col-span-full">
              <p>No favorite properties available.</p>
            </div>
          ))}

        {/* Project Cards */}
        {activeTab === "project" &&
          projects.map((project) => (
            <div
              key={project._id}
              className="max-w-[500px] w-full bg-transparent relative overflow-hidden"
            >
              <div className="relative">
                <img
                  src={project.cover_image || "/image/app.png"}
                  alt="Cover"
                  className="w-full h-[400px] object-cover rounded-3xl"
                />

                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[90%] sm:w-80 h-[130px] bg-gray-800/60 backdrop-blur-md flex flex-col justify-end p-4 rounded-t-3xl">
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 w-[100px] h-[100px] rounded-full flex justify-center items-center shadow-lg overflow-hidden">
                    <img
                      src={project.cover_image || "/image/app.png"}
                      alt="Project Logo"
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <h3 className="text-center text-white text-lg font-semibold min-h-[14px]">
                    {project.project_name || "No Project Name Available"}
                  </h3>
                </div>

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
                      color={project.is_favorite ? "red" : "rgba(75, 85, 99, 0.4) "}
                      fill={project.is_favorite ? "red" : "rgba(75, 85, 99, 0.4) "}
                      strokeWidth={2}
                    />
                  </button>
                </div>

                <div className="absolute bottom-0 right-0">
                  {project.mark_as_featured === "Yes" && (
                    <span className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-ss-lg">
                      FEATURED
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 text-start shadow-sm rounded-b-3xl relative bg-white w-[90%] sm:w-80 m-auto border">
                <p className="p-0 mt-1 text-lg text-gray-600">
                  {project.congfigurations || "No Configurations"}
                </p>

                <p className="flex items-start justify-start gap-2 mt-1 text-sm font-bold text-gray-500 truncate">
                  <img
                    src="/image/address_icon.png"
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
          ))}
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
  );
};

export default MyFavourite;