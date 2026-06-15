import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AiFillHome, AiOutlineUser } from "react-icons/ai";
import { FaRupeeSign, FaCube } from "react-icons/fa";
import {
  MdOutlineBedroomParent,
  MdOutlineNavigateBefore,
  MdOutlineNavigateNext,
} from "react-icons/md";
import { Heart, Camera, Home, Ruler } from "lucide-react";
import { PiShareNetworkLight } from "react-icons/pi";
import { UserCheck2 } from "lucide-react";
import { BiArea } from "react-icons/bi";
import { faChair } from "@fortawesome/free-solid-svg-icons";
import { PiCubeFocus } from "react-icons/pi";
import axios from "axios";
import ContactDetails from "../containers/ContactDetails";
import { toast } from "react-toastify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ShareModal from "../containers/ShareModal";
import Login1 from "../auth/Login1";
import SignUp1 from "../auth/SignUp1";

const AgentDetail = () => {
  const [properties, setProperties] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPages] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState();
  const propertiesPerPage = 6;
  const [rentCount, setRentCount] = useState();
  const [buyCount, setBuyCount] = useState();
  const [commercialCount, setCommercialCount] = useState();

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [openContactModalAfterLogin, setOpenContactModalAfterLogin] =
    useState(false);

  const [activeTab, setActiveTab] = useState("Buy");

  const accessToken = sessionStorage.getItem("accessToken");
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareId, setActiveShareId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [imageIndexes, setImageIndexes] = useState({});
  const { id } = useParams();

  // Modal open states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAgentProperties();
    }
  }, [currentPage, activeTab, accessToken]);

  // Scroll to top on page load -
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const fetchAgentProperties = async () => {
    try {
      const formData = new FormData();
      formData.append("user_id", id);
      formData.append("customer_id", accessToken);
      formData.append("page", currentPage);
      formData.append("page_size", propertiesPerPage);

      // Conditional category handling
      if (activeTab === "Commercial") {
        formData.append("building_type", activeTab);
      } else {
        formData.append("property_category_type", activeTab);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/agent_property_list`,
        formData,
      );

      if (response.data.status === 1) {
        const data = response.data;
        setProperties(data?.data);
        setUserDetails(data?.user_details?.[0]);
        setImages(data?.property_images?.[0]);
        setBuyCount(data?.buy_count || 0);
        setRentCount(data?.rent_count || 0);
        setCommercialCount(data?.commercial_count || 0);
        setTotalCount(data?.total_count || 0);
        setTotalPages(data?.total_pages || 0);
        setCurrentPage(data?.current_page || 0);
        setNextPages(data?.next_page || 0);
        setPreviousPage(data?.previous_page || 0);
      } else {
        console.error("Failed to fetch properties:", response.data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  // useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("accessToken") && openContactModalAfterLogin) {
      setIsContactModalOpen(true);
      setOpenContactModalAfterLogin(false);
    }
  }, [openContactModalAfterLogin]);

  //  Add to favorites
  const addToFavorites = async (PropertyId) => {
    if (!accessToken) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_to_favorite`,
        {
          user_id: accessToken,
          property_id: PropertyId,
        },
      );
      fetchAgentProperties(PropertyId);
    } catch (error) {
      console.error("Error adding property to favorites:", error);
    }
  };

  //  Remove to favorites
  const removeFromFavorites = async (favoriteId) => {
    const formData = new FormData();
    formData.append("favorite_id", favoriteId);

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/cust_api/remove_from_favorite`,
        { data: formData },
      );

      if (response.data.status === 1) {
        fetchAgentProperties();
      } else {
        console.error("Failed to remove:", response.data.message);
      }
    } catch (error) {
      console.error("Error unfavoriting:", error);
    }
  };

  // Pagination Handlers
  const handlePrev = () => {
    previousPage && setCurrentPage(currentPage + 1);
  };

  const handleNext = () => {
    nextPage && setCurrentPage(currentPage - 1);
  };

  const handleTabClick = (category) => {
    setActiveTab(category);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const [activeIndexes, setActiveIndexes] = useState({});

  const openShareModal1 = (url, propertyId) => {
    setCurrentShareUrl(url);
    setActiveShareId(propertyId);
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setActiveShareId(null);
  };

  return (
    <>
      <div className="min-h-screen ">
        <div className="bg-white shadow-lg rounded-2xl ">
          <div className="relative w-full h-auto p-2 mb-4 rounded-lg shadow-sm bg-rose-50">
            {/* Agent Info */}
            <div className="flex items-center gap-4 pb-6 ml-4">
              <img
                src={userDetails?.profile_image || "/image/ap.jpg"}
                alt="Agent"
                className="object-cover w-12 h-12 rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/image/ap.jpg";
                }}
              />
              <div>
                <h1 className="text-2xl font-semibold">
                  {userDetails?.full_name}
                </h1>
                <p className="text-gray-600">{userDetails?.user_type}</p>
              </div>
              <button
                className="px-4 py-2 ml-auto text-white my-bg rounded-lg"
                onClick={() => {
                  const token = sessionStorage.getItem("accessToken");
                  if (token) {
                    setIsContactModalOpen(true);
                  } else {
                    setOpenContactModalAfterLogin(true);
                    setIsLoginModalOpen(true);
                  }
                }}
              >
                Contact Agent
              </button>
            </div>

            {isContactModalOpen && (
              <ContactDetails
                onClose={() => setIsContactModalOpen(false)}
                fullName={userDetails.full_name} // pass user's name
                mobile={userDetails.mobile_number} // pass user's mobile
              />
            )}

            {/* Agent Status */}
            <div className="flex items-center ml-8 space-x-8">
              {/* First Section */}
              <div className="flex flex-col items-center pr-4 border-r-2 border-rose-100">
                <p className="flex items-center">
                  <AiFillHome className="text-xl text-rose-700" />
                  <span className="ml-1">
                    {userDetails?.experience ?? "N/A"} years
                  </span>
                </p>
                <span className="text-sm leading-none text-gray-600">
                  Experience
                </span>
              </div>

              {/* Second Section */}
              <div className="flex flex-col items-center px-4 border-r-2 border-rose-100">
                <p className="flex items-center">
                  <AiFillHome className="text-xl text-rose-700" />
                  <span className="ml-1">{totalCount}</span>
                </p>
                <span className="text-sm leading-none text-gray-600">
                  Properties
                </span>
              </div>

              {/* Third Section */}
              <div className="flex flex-col items-center pl-3">
                <p className="flex items-center">
                  <UserCheck2 className="text-xl text-rose-700" />
                  <span className="ml-1">
                    {userDetails?.proprietorship || "N/A"}
                  </span>
                </p>
                <span className="text-sm leading-none text-gray-600">
                  Firm Ownership
                </span>
              </div>
            </div>
          </div>
          <div className="ml-4 ">
            <p className="text-2xl font-medium text-black">Properties</p>
          </div>

          {/* Property Categories */}
          <div className="flex ml-4 space-x-8 border-b">
            {["Buy", "Rent", "Commercial"].map((category, index) => (
              <button
                key={category}
                onClick={() => handleTabClick(category)}
                className={`pb-1 ${
                  activeTab === category
                    ? "my-text border-b-2 border-rose-600"
                    : "text-gray-600"
                }`}
              >
                {category}{" "}
                <span className="px-2 py-1 text-xs text-white bg-green-500 rounded-full">
                  <span className="px-2 py-1 text-xs text-white bg-green-500 rounded-full">
                    {index === 0
                      ? buyCount
                      : index === 1
                        ? rentCount
                        : commercialCount}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Property List */}
          <div className="flex-1 p-4 border-white shadow-2xl">
            {/* Property List: Adjust grid layout to show 3 items per row */}
            <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="block overflow-hidden no-underline shadow-md rounded-2xl hover:no-underline"
                >
                  {/* Property Slider */}
                  <div className="relative">
                    <Link
                      to={`/propertydetails/${property._id}`}
                      className="block"
                    >
                      {(property.property_images?.length || 0) > 0 ? (
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
                            const isActive = i === activeSlide % 3;
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
                          {/* Cover image */}
                          <div key={`cover-${property._id}`}>
                            <img
                              src={property.cover_image}
                              alt="Cover"
                              className="object-cover w-full h-48 rounded-t-2xl"
                            />
                          </div>

                          {/* Other property images */}
                          {(property.property_images || []).map((imgObj) => (
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
                        // Show only single image without slider
                        <img
                          src={property.cover_image}
                          alt="Cover"
                          className="object-cover w-full h-48 rounded-t-2xl"
                        />
                      )}
                    </Link>
                    {/* 10 Days NoWayBroker Tag (Top Left) */}
                    <span className="absolute px-2 py-1 text-xs font-normal text-white rounded-full top-2 left-2 bg-gray-800/60 backdrop-blur-sm">
                      {property.days_since_created} days on NoWayBroker
                    </span>

                    {/* Virtual Tour & Heart Icon (Top Right) */}
                    <div className="absolute flex items-center space-x-2 top-2 right-2">
                      {property.virtual_tour_availability === "Yes" && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-normal text-white rounded-full bg-gray-800/60 backdrop-blur-sm">
                          <PiCubeFocus className="text-sm text-white" />
                          Virtual Tour
                        </span>
                      )}
                      {/* <div className="absolute top-0 right-0 flex space-x-2"> */}
                      <button
                        className="p-2 rounded-full shadow bg-gray-800/60 backdrop-blur-sm"
                        onClick={() => {
                          if (!accessToken) {
                            setIsLoginModalOpen(true);
                            return;
                          }
                          if (property.is_favorite) {
                            removeFromFavorites(property.favorite_id);
                          } else {
                            addToFavorites(property._id);
                          }
                        }}
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
                      {/* </div> */}
                    </div>

                    {/* FOR BUY & FEATURED Tags (Bottom of the Image) */}
                    <div className="absolute bottom-0 left-0">
                      <span
                        className={`text-white text-xs px-3 py-1 rounded-se-lg ${
                          property.property_category_type === "Buy"
                            ? "bg-green-500"
                            : property.property_category_type === "Rent"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                        }`}
                      >
                        {property.property_category_type === "Buy"
                          ? "FOR BUY"
                          : property.property_category_type === "Rent"
                            ? "FOR RENT"
                            : "UNKNOWN"}
                      </span>
                    </div>
                    <div className="absolute bottom-0 right-0">
                      <span className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-ss-lg">
                        FEATURED
                      </span>
                    </div>
                  </div>

                  {/* Property Description */}
                  <div className="p-1">
                    {/* Property Name & Share Button */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-800 truncate">
                        {property.property_name}
                      </h3>
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
                            const url = currentShareUrl;

                            if (navigator.clipboard && window.isSecureContext) {
                              navigator.clipboard
                                .writeText(url)
                                .then(() => {
                                  alert("Link copied!");
                                })
                                .catch((err) => {
                                  console.error("Clipboard API failed:", err);
                                  fallbackCopyTextToClipboard(url);
                                });
                            } else {
                              fallbackCopyTextToClipboard(url);
                            }

                            function fallbackCopyTextToClipboard(text) {
                              const textArea =
                                document.createElement("textarea");
                              textArea.value = text;
                              textArea.style.position = "fixed"; // Avoid scrolling to bottom
                              textArea.style.left = "-9999px";
                              document.body.appendChild(textArea);
                              textArea.focus();
                              textArea.select();

                              try {
                                const successful = document.execCommand("copy");
                                alert(
                                  successful ? "Link copied!" : "Copy failed",
                                );
                              } catch (err) {
                                console.error("Fallback copy failed:", err);
                                alert("Copy failed");
                              }

                              document.body.removeChild(textArea);
                            }
                          }}
                        />
                      </div>
                    )}

                    {/* Property Details (Only 3 elements on top) */}
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-gray-700">
                      {/* Price */}
                      <div className="flex items-center gap-1 text-lg font-semibold">
                        <FaRupeeSign className="text-xl my-text" />
                        <span>
                          {property.property_category_type === "Rent"
                            ? `${property.rent} / ${property.rent_duration}`
                            : property.property_price}
                        </span>
                      </div>

                      {/* BHK Type */}
                      {property.bhk_type && (
                        <div className="flex items-center gap-1">
                          <MdOutlineBedroomParent className="text-xl my-text" />
                          <p className="m-0 font-semibold">
                            {property.bhk_type}
                          </p>
                        </div>
                      )}

                      {/* Area in Sq Ft */}
                      {property.area_sq && (
                        <div className="flex items-center gap-1">
                          <BiArea className="text-xl my-text" />
                          <p className="m-0 font-semibold">
                            {property.area_sq} sq ft
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Furnished/Semi-Furnished */}
                    {property.furnished_type && (
                      <div className="flex items-center mt-2">
                        <FontAwesomeIcon
                          icon={faChair}
                          className="mr-1 my-text"
                        />
                        <p className="m-0 font-semibold text-black">
                          {property.furnished_type}
                        </p>
                      </div>
                    )}

                    {/* Address */}
                    <p className="mt-2 text-sm text-gray-400 truncate">
                      <b>{property.address}</b>
                    </p>

                    {/* Owner Section */}
                    <div className="flex items-center text-gray-700">
                      {/* Owner Info */}
                      <div className="flex items-center mt-1 mb-0 text-sm truncate">
                        <div className="p-2 rounded-full bg-slate-100">
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
                        <div className="flex flex-col ml-2">
                          <span className="text-sm font-semibold">
                            {property.connect_to_name}
                          </span>
                          <span>{property.user_type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
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
            ${
              currentPage === i + 1
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
      </div>
    </>
  );
};

export default AgentDetail;
