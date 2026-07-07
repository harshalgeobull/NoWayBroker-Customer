import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AiFillHome, AiOutlineUser } from "react-icons/ai";
import { FaRupeeSign, FaCube, FaBath, FaWhatsapp, FaPhone } from "react-icons/fa";
import {
  MdOutlineBedroomParent,
  MdOutlineNavigateBefore,
  MdOutlineNavigateNext,
  MdApartment,
} from "react-icons/md";
import { Heart, Camera, Home, Ruler, Building2 } from "lucide-react";
import { PiShareNetworkLight } from "react-icons/pi";
import { UserCheck2 } from "lucide-react";
import { BiArea } from "react-icons/bi";
import { faChair } from "@fortawesome/free-solid-svg-icons";
import { PiCubeFocus } from "react-icons/pi";
import { RiRuler2Line } from "react-icons/ri";
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

  const formatPrice = (price) => {
    if (!price) return "";

    price = parseInt(price);

    const formatNumber = (num) => {
      return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2); // no decimals if whole number
    };

    if (price >= 10000000) {
      return `₹ ${formatNumber(price / 10000000)} Cr`; // Crores
    } else if (price >= 100000) {
      return `₹ ${formatNumber(price / 100000)} L`; // Lakhs
    } else if (price >= 1000) {
      return `₹ ${formatNumber(price / 1000)} K`; // Thousands
    } else {
      return `₹ ${price}`;
    }
  };

  const handleContactClick = (property) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      setIsContactModalOpen(true);
    } else {
      setOpenContactModalAfterLogin(true);
      setIsLoginModalOpen(true);
    }
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
                className={`pb-1 ${activeTab === category
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
                    {/* Days on NoWayBroker Tag (Top Left) */}
                    <span className="absolute px-2 py-1 text-xs font-normal text-white rounded-full top-2 left-2 bg-gray-800/60 backdrop-blur-sm">
                      {property.days_since_created} days ago
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
                        className="p-1.5 rounded-full shadow bg-gray-800/60 backdrop-blur-sm"
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
                          size={20}
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
                        className={`text-white text-xs px-3 py-1 rounded-se-lg ${property.property_category_type === "Buy"
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
                      {property.mark_as_featured === "Yes" && (
                        <span className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-ss-lg">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Property Description (Spotlight style) */}
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

                    {/* Row 2: Subtitle */}
                    <p className="mt-0 mb-2 text-sm leading-5 text-gray-500 truncate">
                      {property.bhk_type ? `${property.bhk_type} ` : ""}
                      {property.property_type ||
                        property.building_type ||
                        "Property"}{" "}
                      for Sale in{" "}
                      {property.address_area ||
                        property.address ||
                        "No Address Provided"}
                    </p>

                    {/* Row 3: Price + Status */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center text-xl font-bold">
                        <FaRupeeSign className="mr-1 text-base" />
                        {property.property_category_type === "Rent"
                          ? `${formatPrice(property.rent).replace("₹ ", "")}${property.rent_duration
                            ? ` / ${property.rent_duration}`
                            : ""
                          }`
                          : formatPrice(property.property_price).replace(
                            "₹ ",
                            "",
                          )}
                      </span>
                      {/* Ready to Move - Keep close to price */}
                      {property.property_category_type?.includes("Buy") &&
                        property.possession_status === "Ready To Move" && (
                          <div className="flex items-center gap-2 px-3 py-1 ml-6 bg-green-100 border border-green-200 rounded-full">
                            <MdApartment className="text-base text-green-700" />
                            <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
                              Ready to Move
                            </span>
                          </div>
                        )}

                      {property.construction_status === "Ready To Move" && (
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
                        <Building2
                          size={20}
                          className="text-gray-700 flex-shrink-0"
                        />
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
                        <FaBath
                          size={18}
                          className="text-gray-700 flex-shrink-0"
                        />
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
                            {property.area_sq || property.area}{" "}
                            {property.area_in || "sq.ft"}
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
                            <AiOutlineUser
                              className="text-gray-600"
                              size={20}
                            />
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

                      {/* RIGHT SIDE - Buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Contact */}
                        <div
                          className="flex items-center justify-center px-4 h-9 text-sm font-semibold text-white bg-red-800 rounded-md cursor-pointer hover:bg-red-900 whitespace-nowrap"
                          onClick={() => handleContactClick(property)}
                        >
                          Contact
                        </div>

                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/91${property.connect_to_no}?text=Hello, I am interested in your property`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center w-9 h-9 text-white bg-green-500 rounded-md hover:bg-green-600"
                        >
                          <FaWhatsapp />
                        </a>

                        {/* Call */}
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
      </div>
    </>
  );
};

export default AgentDetail;