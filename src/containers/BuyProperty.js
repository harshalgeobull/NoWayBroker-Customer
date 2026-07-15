import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { MdApartment } from "react-icons/md";
import { FaBath, FaUser } from "react-icons/fa";
import { RiRuler2Line } from "react-icons/ri";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "react-slick";
import { Ruler } from "lucide-react";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { CiHeart } from "react-icons/ci";
import { useHistory } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/RecommendedProperties.css";
import { FaRupeeSign } from "react-icons/fa"; // Icon for price
import { BsHouseDoorFill, BsArrowsFullscreen } from "react-icons/bs"; // Icon for property type
import { faChair } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineUser } from "react-icons/ai";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { PiCubeFocus } from "react-icons/pi";
import { BiShapeSquare } from "react-icons/bi";
import { Heart } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Login1 from "../auth/Login1";
import SignUp1 from "../auth/SignUp1";

const userLocation = JSON.parse(sessionStorage.getItem("userLocation"));
console.log(userLocation);

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

const BuyProperty = ({
    openRecommendedShareModal,
    closeShareModal,
    copyLink,
    currentShareUrl,
    data,
    fetchHomeData,
}) => {
    const [savedProperties, setSavedProperties] = useState([]);
    const [properties, setProperties] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const sliderRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [images, setImages] = useState([]);
    const history = useHistory();
    const defaultImage = "/image/appstore.png";
    const userId = sessionStorage.getItem("accessToken");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    // Fetch Buy properties (data already filtered by parent with property_category_type: "Buy")
    const fetchBuyProperties = () => {
        console.log("Full Data :", data);
        if (data?.status === 1 && Array.isArray(data.data)) {
            console.log("API Data :", data.data);
            const buyProperties = data.data.filter(
                (item) =>
                    item.property_category_type &&
                    item.property_category_type.toLowerCase() === "buy",
            );
            console.log("Buy Properties :", buyProperties);
            setProperties(buyProperties);
        } else {
            console.log("No Buy Data");
            setProperties([]);
        }
    };

    useEffect(() => {
        fetchBuyProperties();
    }, [data]);

    const handleClick = () => {
        history.push("/advisordashboard?label=Buy");
    };

    // Add property to favorites
    const addToFavorites = async (propertyId) => {
        if (!userId) {
            toast.error("Please log in to save properties to your favorites.");
            return;
        }
        const data = { user_id: userId, property_id: propertyId };
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/cust_api/add_to_favorite`,
                data,
            );
            fetchHomeData();
        } catch (error) {
            console.log("Failed to save the property. Please try again.");
            fetchHomeData();
        }
    };

    // Remove property from favorites
    const removeFromFavorites = async (FavoriteId) => {
        if (!userId) {
            toast.error("Please log in to remove properties from your favorites.");
            return;
        }
        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/cust_api/remove_from_favorite`,
                { data: { favorite_id: FavoriteId } },
            );
            fetchHomeData();
        } catch (error) {
            console.log("Failed to remove the property. Please try again.");
            fetchHomeData();
        }
    };

    const convertToSqFt = (area, unit) => {
        if (!area || !unit) return null;
        const areaNum = parseFloat(area);
        if (isNaN(areaNum)) return null;

        switch (unit.toLowerCase()) {
            case "sq ft":
            case "sqft":
            case "square feet":
                return areaNum;
            case "sq yd":
            case "sqyd":
            case "square yards":
                return areaNum * 9;
            case "sq mt":
            case "sqmt":
            case "square meters":
                return areaNum * 10.7639;
            case "acre":
            case "acres":
                return areaNum * 43560;
            default:
                return areaNum; // Return as-is if unit is unknown
        }
    };

    // Slider settings
    const [activeIndexes, setActiveIndexes] = useState({});
    const BASE_URL = process.env.REACT_APP_API_URL;

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
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
        ],
    };

    const formatPrice = (price) => {
        if (price === null || price === undefined || price === "") return "";
        price = Number(price);
        const formatNumber = (value, unit) => {
            return `${value.toFixed(2).replace(/\.?0+$/, "")}${unit}`;
        };
        if (price >= 10000000) {
            return formatNumber(price / 10000000, " Cr");
        } else if (price >= 100000) {
            return formatNumber(price / 100000, " L");
        } else if (price >= 1000) {
            return formatNumber(price / 1000, " K");
        } else {
            return price.toString();
        }
    };

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // 3000ms = 3 seconds for auto-slide
        return () => clearInterval(interval); // Cleanup on component unmount
    }, [images.length]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="px-4 py-4 bg-white sm:px-6 md:px-8 lg:px-10">
            <div className="bg-slate-50 rounded-2xl">
                <div className="w-full sm:px-6 lg:px-4">
                    <div className="flex flex-col items-start justify-between px-4 pt-3 mb-3 sm:flex-row sm:items-center">
                        <div className="flex flex-col">
                            <h2 className="mb-2 text-xl font-bold tracking-wide text-gray-800 sm:text-2xl lg:text-3xl">
                                Buy Properties
                            </h2>
                            <p className="text-sm text-gray-500 sm:text-base lg:text-lg">
                                Your dream property is just a few clicks away
                            </p>
                        </div>

                        <div className="flex items-center w-full mt-4 space-x-3 sm:w-auto sm:space-x-5 sm:mt-0">
                            <button
                                className="w-full px-4 py-2 text-sm bg-white rounded-lg my-text my-border sm:w-auto sm:px-6"
                                onClick={handleClick}
                            >
                                View All Properties
                            </button>
                            <button
                                className="hidden p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md sm:block sm:text-2xl hover:shadow-lg"
                                onClick={() => sliderRef.current.slickPrev()}
                            >
                                <GoArrowLeft className="text-3xl text-black" />
                            </button>
                            <button
                                className="hidden p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md sm:block sm:text-2xl hover:shadow-lg"
                                onClick={() => sliderRef.current.slickNext()}
                            >
                                <GoArrowRight className="text-3xl text-black" />
                            </button>
                        </div>
                    </div>

                    <Slider {...settings} className="slider-container" ref={sliderRef}>
                        {properties
                            .filter((property) => property.available_status !== "Sold")
                            .map((property) => {
                                let distance = null;

                                const subtitle = (() => {
                                    const area = property.address_area || "";
                                    const city = property.city_name || "";
                                    const location = area.toLowerCase().includes(city.toLowerCase())
                                        ? area
                                        : `${area}, ${city}`;

                                    const type =
                                        property.property_type === "Office"
                                            ? "Office Space"
                                            : property.property_type === "Retail"
                                                ? "Retail Space"
                                                : property.property_type || "";

                                    const category = property.property_category_type || "";

                                    // Commercial Properties
                                    if (
                                        category === "Commercial Buy" ||
                                        category === "Commercial Lease"
                                    ) {
                                        return `${type} for ${category === "Commercial Buy" ? "Sale" : "Lease"
                                            } in ${location}`;
                                    }

                                    // PG / Co-Living
                                    if (
                                        category.includes("PG") ||
                                        category.includes("Co-Living") ||
                                        category.includes("Coliving")
                                    ) {
                                        return `${type} for Rent in ${location}`;
                                    }

                                    // Residential
                                    const action = category === "Buy" ? "Sale" : category;
                                    return `${property.bhk_type} ${type} for ${action} in ${location}`;
                                })();

                                if (userLocation && property.latitude && property.longitude) {
                                    distance = calculateDistance(
                                        userLocation.latitude,
                                        userLocation.longitude,
                                        parseFloat(property.latitude),
                                        parseFloat(property.longitude),
                                    ).toFixed(1);
                                }

                                function getValidImageUrl(img) {
                                    if (typeof img !== "string") return null;
                                    if (img.trim() === "") return null;
                                    return img.startsWith("http") ? img : BASE_URL + img;
                                }

                                const coverImage = getValidImageUrl(property.cover_image);
                                const additionalImages = (property.property_images || [])
                                    .map((imgObj) => getValidImageUrl(imgObj?.image))
                                    .filter(Boolean);

                                const allImages = [
                                    ...(coverImage ? [coverImage] : []),
                                    ...additionalImages,
                                ];

                                return (
                                    <div key={property._id} className="w-full h-full p-2">
                                        <div className="flex flex-col h-full overflow-hidden shadow rounded-2xl bg-slate-100 min-h-[440px] sm:min-h-[460px]">
                                            <div className="w-full overflow-hidden rounded-xl">
                                                <div className="relative">
                                                    <Link
                                                        to={`/propertydetails/${property._id}`}
                                                        className="block"
                                                        onClick={() =>
                                                            window.scrollTo({ top: 0, behavior: "smooth" })
                                                        }
                                                    >
                                                        {allImages.length > 1 ? (
                                                            <Slider
                                                                key={`${property._id}-${allImages.length}-${Date.now()}`}
                                                                className="h-40 sm:h-44 md:h-48"
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
                                                                    const isActive =
                                                                        i === activeSlide % allImages.length;
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
                                                                appendDots={(dots) => (
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
                                                                        {dots}
                                                                    </div>
                                                                )}
                                                            >
                                                                {allImages.map((imgUrl, idx) => (
                                                                    <div key={`${property._id}-${idx}`}>
                                                                        <img
                                                                            src={imgUrl}
                                                                            alt="Property"
                                                                            className="object-cover w-full h-40 rounded-t-2xl sm:h-44 md:h-48"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </Slider>
                                                        ) : (
                                                            <img
                                                                src={allImages[0] || "/image/app.png"}
                                                                alt="Property"
                                                                className="object-cover w-full h-40 rounded-t-2xl sm:h-44 md:h-48"
                                                            />
                                                        )}
                                                    </Link>

                                                    {/* Days on nowaybroker */}
                                                    {/* <span className="absolute px-2 py-1 text-xs font-normal text-white rounded-full top-2 left-2 bg-gray-800/60 backdrop-blur-sm">
                          {property.days_since_created} days on NoWayBroker
                        </span> */}

                                                    {/* Admin Approval Badge */}
                                                    {property.admin_approval === "Approved" && (
                                                        <div className="absolute top-2 left-2 z-20">
                                                            <div className="flex items-center bg-[#2DBE3F] text-white rounded-sm shadow-md px-2 py-1">

                                                                {/* Tick Icon */}
                                                                <span className="text-white text-xs font-bold mr-2">
                                                                    ✓
                                                                </span>

                                                                {/* Verified Text */}
                                                                <span className="text-[11px] font-semibold leading-none">
                                                                    Verified
                                                                </span>

                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Virtual Tour & Favorite Button */}
                                                    <div className="absolute flex items-center space-x-2 top-2 right-2">
                                                        {property.virtual_tour_availability === "Yes" && (
                                                            <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-normal text-white rounded-full bg-gray-800/60 backdrop-blur-sm sm:text-xs">
                                                                <PiCubeFocus className="text-sm text-white" />
                                                                Virtual Tour
                                                            </span>
                                                        )}

                                                        <button
                                                            className="p-2 rounded-full shadow bg-gray-800/60 backdrop-blur-sm"
                                                            onClick={() => {
                                                                if (!userId) {
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
                                                                        : "rgba(75, 85, 99, 0.4)"
                                                                }
                                                                fill={
                                                                    property.is_favorite
                                                                        ? "red"
                                                                        : "rgba(75, 85, 99, 0.4)"
                                                                }
                                                                strokeWidth={2}
                                                            />
                                                        </button>
                                                    </div>

                                                    {/* FOR BUY/RENT & FEATURED tags */}
                                                    <div className="absolute bottom-0 left-0 max-w-[70%]">
                                                        {(() => {
                                                            const rawCategory =
                                                                property.property_category_type || "";
                                                            const normalizedCategory = rawCategory
                                                                .replace(/\s+/g, " ")
                                                                .replace(/-/g, " ")
                                                                .replace(/\//g, " ")
                                                                .trim()
                                                                .toLowerCase();

                                                            let matchedType = "UNKNOWN";
                                                            let badgeColor = "bg-gray-500";

                                                            if (normalizedCategory === "buy") {
                                                                matchedType = "FOR BUY";
                                                                badgeColor = "bg-green-500";
                                                            } else if (normalizedCategory === "rent") {
                                                                matchedType = "FOR RENT";
                                                                badgeColor = "bg-blue-500";
                                                            } else if (
                                                                normalizedCategory.includes("commercial buy")
                                                            ) {
                                                                matchedType = "COMMERCIAL BUY";
                                                                badgeColor = "bg-purple-500";
                                                            } else if (
                                                                normalizedCategory.includes("commercial lease")
                                                            ) {
                                                                matchedType = "COMMERCIAL LEASE";
                                                                badgeColor = "bg-indigo-500";
                                                            } else if (
                                                                normalizedCategory.includes("pg") ||
                                                                normalizedCategory.includes("co living") ||
                                                                normalizedCategory.includes("coliving")
                                                            ) {
                                                                matchedType = "PG/CO-LIVING";
                                                                badgeColor = "bg-yellow-500";
                                                            }

                                                            return (
                                                                <span
                                                                    className={`text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-se-lg truncate block ${badgeColor}`}
                                                                >
                                                                    {matchedType}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>

                                                    <div className="absolute bottom-0 right-0">
                                                        {property.mark_as_featured === "Yes" && (
                                                            <span className="px-2 py-1 text-[10px] text-white bg-yellow-500 rounded-ss-lg sm:text-xs sm:px-3">
                                                                FEATURED
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Property Details */}
                                            <div className="flex flex-col flex-1 p-3 text-black bg-white">
                                                {/* Price Section */}
                                                <div className="flex items-start justify-between gap-2 mb-0 sm:gap-3">
                                                    {/* Property Name */}
                                                    <h3
                                                        className="flex-1 min-w-0 m-0 text-base font-semibold leading-6 text-gray-900 truncate sm:text-lg"
                                                        title={property.property_name}
                                                    >
                                                        {property.property_name || "N/A"}
                                                    </h3>

                                                    {/* Furnishing */}
                                                    <span
                                                        className="flex-shrink-0 m-0 text-xs font-medium leading-6 text-black sm:text-sm whitespace-nowrap"
                                                        title={property.furnished_type}
                                                    >
                                                        {property.furnished_type || "Un-Furnished"}
                                                    </span>
                                                </div>

                                                <p
                                                    className="mt-0 mb-1 text-sm leading-5 text-gray-600 line-clamp-2 sm:truncate"
                                                    title={subtitle}
                                                >
                                                    {subtitle}
                                                </p>

                                                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                                                    {/* Left Side */}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-xl font-bold sm:text-2xl">
                                                            ₹{" "}
                                                            {property.property_category_type === "Rent"
                                                                ? formatPrice(property.rent)
                                                                : formatPrice(property.property_price)}
                                                        </span>
                                                        {property.property_category_type === "Rent" && (
                                                            <span className="text-sm text-gray-500">
                                                                /{property.rent_duration}
                                                            </span>
                                                        )}

                                                        {/* Ready to Move - Keep close to price */}
                                                        {property.property_category_type?.includes("Buy") &&
                                                            property.possession_status ===
                                                            "Ready To Move" && (
                                                                <div className="flex items-center gap-2 px-2 py-1 bg-green-100 border border-green-200 rounded-full sm:px-3">
                                                                    <MdApartment className="text-base text-green-700" />
                                                                    <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
                                                                        Ready to Move
                                                                    </span>
                                                                </div>
                                                            )}
                                                    </div>

                                                    {/* Right Side */}
                                                    <div className="text-sm font-medium whitespace-nowrap">
                                                        {property.property_category_type === "Rent" && (
                                                            <>
                                                                <span className="text-gray-500">Deposit:</span>
                                                                <span className="ml-1 font-semibold">
                                                                    ₹{" "}
                                                                    {property.custom_deposit_amount?.toLocaleString(
                                                                        "en-IN",
                                                                    )}
                                                                </span>
                                                            </>
                                                        )}
                                                        {property.property_category_type?.includes("Buy") &&
                                                            property.possession_status !==
                                                            "Ready To Move" &&
                                                            property.possession_date && (
                                                                <>
                                                                    <span className="text-gray-500">
                                                                        Possession:
                                                                    </span>
                                                                    <span className="ml-1 font-semibold">
                                                                        {new Date(
                                                                            property.possession_date,
                                                                        ).toLocaleDateString("en-IN")}
                                                                    </span>
                                                                </>
                                                            )}
                                                    </div>
                                                </div>

                                                {/* Features Row */}
                                                <div className="grid grid-cols-3 py-3 border-t border-b border-gray-100">
                                                    {/* First Column */}
                                                    <div className="flex items-center gap-2 px-1 min-w-0 sm:px-3">
                                                        <MdApartment className="text-[18px] sm:text-[22px] text-gray-700 flex-shrink-0" />
                                                        <div className="flex flex-col justify-center min-w-0">
                                                            <p className="m-0 text-xs font-semibold leading-4 truncate sm:text-sm">
                                                                {property.building_type === "Commercial"
                                                                    ? property.property_type === "Office"
                                                                        ? "Office Space"
                                                                        : property.property_type === "Retail"
                                                                            ? "Retail Space"
                                                                            : property.property_type
                                                                    : property.property_category_type?.includes(
                                                                        "PG",
                                                                    )
                                                                        ? `${property.bathroom || 0} Bathrooms`
                                                                        : property.bhk_type}
                                                            </p>
                                                            <p className="m-0 text-[10px] sm:text-xs leading-4 text-gray-500 truncate">
                                                                {property.building_type === "Commercial"
                                                                    ? "Property Type"
                                                                    : property.property_category_type?.includes(
                                                                        "PG",
                                                                    )
                                                                        ? "Bathrooms"
                                                                        : property.property_type}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Second Column */}
                                                    <div className="flex items-center gap-2 px-1 border-l border-gray-200 min-w-0 sm:px-3">
                                                        {property.property_category_type?.includes("PG") ? (
                                                            <FaUser className="text-[16px] sm:text-[20px] text-gray-700 flex-shrink-0" />
                                                        ) : (
                                                            <FaBath className="text-[16px] sm:text-[20px] text-gray-700 flex-shrink-0" />
                                                        )}
                                                        <div className="flex flex-col justify-center min-w-0">
                                                            <p className="m-0 text-xs font-semibold leading-4 truncate sm:text-sm">
                                                                {property.property_category_type?.includes("PG")
                                                                    ? property.available_for
                                                                    : `${property.bathroom || 0} Baths`}
                                                            </p>
                                                            <p className="m-0 text-[10px] sm:text-xs leading-4 text-gray-500 truncate">
                                                                {property.property_category_type?.includes("PG")
                                                                    ? "Available For"
                                                                    : "Bathrooms"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Third Column */}
                                                    <div className="flex items-center gap-2 px-1 border-l border-gray-200 min-w-0 sm:px-3">
                                                        <RiRuler2Line className="text-[18px] sm:text-[22px] text-gray-700 flex-shrink-0" />
                                                        <div className="flex flex-col justify-center min-w-0">
                                                            <p className="m-0 text-xs font-semibold leading-4 truncate sm:text-sm">
                                                                {property.area} {property.area_in}
                                                            </p>
                                                            <p className="m-0 text-[10px] sm:text-xs leading-4 text-gray-500 truncate">
                                                                Built Up Area
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Divider */}
                                                <hr className="my-1 border-gray-100" />

                                                {/* Row 5: Posted By | Days | Distance | Share */}
                                                <div className="flex items-center justify-between gap-2 pt-1 pb-2 text-[12px] sm:text-[13px] text-gray-600">
                                                    {/* Left */}
                                                    <div className="flex items-center flex-wrap min-w-0 gap-x-1">
                                                        {/* Posted By */}
                                                        <div className="flex items-center min-w-0">
                                                            <AiOutlineClockCircle className="mr-1 text-[15px] text-gray-700 flex-shrink-0" />
                                                            <span className="truncate">
                                                                Posted by {property.user_type || "Owner"}
                                                            </span>
                                                        </div>
                                                        {/* Dot */}
                                                        <span className="mx-1 text-gray-400 sm:mx-2">•</span>
                                                        {/* Days */}
                                                        <span className="whitespace-nowrap">
                                                            {property.days_since_created
                                                                ? `${property.days_since_created} days ago`
                                                                : "Recently"}
                                                        </span>
                                                        {/* Distance */}
                                                        {distance && (
                                                            <>
                                                                <span className="mx-1 text-gray-400 sm:mx-2">
                                                                    •
                                                                </span>
                                                                <div className="flex items-center whitespace-nowrap">
                                                                    <FaMapMarkerAlt className="mr-1 text-red-500" />
                                                                    {distance} km from you
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    {/* Share */}
                                                    <FontAwesomeIcon
                                                        icon={faShareNodes}
                                                        className="ml-2 text-[17px] text-gray-500 transition-colors cursor-pointer hover:text-blue-500 flex-shrink-0"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            openRecommendedShareModal(property._id);
                                                        }}
                                                    />
                                                </div>

                                                {console.log(
                                                    property.connect_to_name,
                                                    property.property_owner_image,
                                                )}

                                                {/* Row 6: Owner Details */}
                                                <div className="flex items-center pt-3 mt-auto">
                                                    {/* Avatar */}
                                                    <div className="flex items-center justify-center flex-shrink-0 w-9 h-9 overflow-hidden rounded-full bg-blue-100 sm:w-10 sm:h-10">
                                                        {property.property_owner_image &&
                                                            !property.property_owner_image.includes(
                                                                "default_profile",
                                                            ) ? (
                                                            <>
                                                                <img
                                                                    src={`${process.env.REACT_APP_API_URL}/media/${property.property_owner_image}`}
                                                                    alt={property.connect_to_name || "Owner"}
                                                                    className="object-cover w-full h-full rounded-full"
                                                                    onError={(e) => {
                                                                        e.target.style.display = "none";
                                                                        e.target.nextSibling.style.display = "flex";
                                                                    }}
                                                                />
                                                                {/* Fallback */}
                                                                <div className="items-center justify-center hidden w-full h-full">
                                                                    <AiOutlineUser className="text-2xl text-blue-600" />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="flex items-center justify-center w-full h-full">
                                                                <AiOutlineUser className="text-2xl text-blue-600" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Name & User Type */}
                                                    <div className="flex items-center min-w-0 ml-3 sm:ml-4">
                                                        <span
                                                            className="text-sm font-semibold text-gray-900 truncate whitespace-nowrap"
                                                            title={property.connect_to_name}
                                                        >
                                                            {property.connect_to_name || "Owner"}
                                                        </span>
                                                        <div className="w-px h-4 mx-3 bg-gray-300 sm:mx-4"></div>
                                                        <span className="text-sm text-gray-500 whitespace-nowrap">
                                                            {property.user_type || "Owner"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </Slider>

                    {/* Mobile slider nav (arrows moved below the cards on small screens) */}
                    <div className="flex items-center justify-center gap-4 mt-3 sm:hidden">
                        <button
                            className="p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md hover:shadow-lg"
                            onClick={() => sliderRef.current.slickPrev()}
                        >
                            <GoArrowLeft className="text-2xl text-black" />
                        </button>
                        <button
                            className="p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md hover:shadow-lg"
                            onClick={() => sliderRef.current.slickNext()}
                        >
                            <GoArrowRight className="text-2xl text-black" />
                        </button>
                    </div>
                </div>
            </div>

            <div
                id="shareModal"
                className="fixed bottom-0 right-0 z-50 items-center justify-center hidden px-4 bg-black bg-opacity-50"
            >
                <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h5 className="text-lg font-bold">Share this link</h5>
                        <button onClick={closeShareModal}>&times;</button>
                    </div>
                    <div className="flex flex-col items-stretch mb-4 sm:flex-row sm:items-center">
                        <input
                            type="text"
                            className="flex-grow w-full p-2 border rounded form-control"
                            value={currentShareUrl}
                            readOnly
                        />
                        <button
                            className="p-2 mt-2 bg-gray-200 rounded sm:mt-0 sm:ml-2"
                            onClick={(e) => copyLink(e)}
                        >
                            Copy Link
                        </button>
                    </div>
                    <div className="flex flex-wrap justify-around gap-2">
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

export default BuyProperty;