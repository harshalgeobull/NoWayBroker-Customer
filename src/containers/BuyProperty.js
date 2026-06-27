import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
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
                    item.property_category_type.toLowerCase() === "buy"
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
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const formatPrice = (price) => {
        if (!price) return "";

        const formatNumber = (value, unit) => {
            return (value % 1 === 0 ? parseInt(value) : value.toFixed(1)) + unit;
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
        <div className="px-10 py-4 bg-white ">
            <div className="bg-slate-50 rounded-2xl">
                <div className="w-full sm:px-6 lg:px-4">
                    <div className="flex flex-col items-start justify-between px-4 pt-3 mb-3 sm:flex-row sm:items-center">
                        <div className="flex flex-col">
                            <h2 className="mb-2 text-2xl font-bold tracking-wide text-gray-800 sm:text-3xl">
                                Buy Properties
                            </h2>
                            <p className="text-lg text-gray-500">
                                Go from browsing to buying
                            </p>
                        </div>

                        <div className="flex items-center mt-4 space-x-3 sm:space-x-5 sm:mt-0">
                            <button
                                className="px-4 py-2 text-sm bg-white rounded-lg my-text my-border sm:px-6"
                                onClick={handleClick}
                            >
                                View All Properties
                            </button>

                            <button
                                className="p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md sm:text-2xl hover:shadow-lg"
                                onClick={() => sliderRef.current.slickPrev()}
                            >
                                <GoArrowLeft className="text-3xl text-black" />
                            </button>

                            <button
                                className="p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md sm:text-2xl hover:shadow-lg "
                                onClick={() => sliderRef.current.slickNext()}
                            >
                                <GoArrowRight className="text-3xl text-black" />
                            </button>
                        </div>
                    </div>

                    <Slider {...settings} className="slider-container" ref={sliderRef}>
                        {properties.map((property) => {
                            let distance = null;

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
                                <div key={property._id} className="h-full p-2">
                                    <div className="overflow-hidden shadow rounded-2xl bg-slate-100 h-[460px] flex flex-col">
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
                                                            className="h-48"
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
                                                            className="rounded-t-2xl"
                                                        >
                                                            {allImages.map((imgUrl, idx) => (
                                                                <div key={`${property._id}-${idx}`}
                                                                >
                                                                    <img
                                                                        src={imgUrl}
                                                                        alt="Property"
                                                                        className="object-cover w-full h-48 rounded-t-2xl"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </Slider>
                                                    ) : (
                                                        <img
                                                            src={allImages[0] || "/image/app.png"}
                                                            alt="Property"
                                                            className="object-cover w-full h-48 rounded-t-2xl"
                                                        />
                                                    )}
                                                </Link>

                                                {/* Days on nowaybroker */}
                                                <span className="absolute px-2 py-1 text-xs font-normal text-white rounded-full top-2 left-2 bg-gray-800/60 backdrop-blur-sm">
                                                    {property.days_since_created} days on NoWayBroker
                                                </span>

                                                {/* Virtual Tour & Favorite Button */}
                                                <div className="absolute flex items-center space-x-2 top-2 right-2">
                                                    {property.virtual_tour_availability === "Yes" && (
                                                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-normal text-white rounded-full bg-gray-800/60 backdrop-blur-sm">
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

                                                {/* FOR BUY / RENT & FEATURED tags */}
                                                <div className="absolute bottom-0 left-0">
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
                                                            matchedType = "PG / CO-LIVING";
                                                            badgeColor = "bg-yellow-500";
                                                        }

                                                        return (
                                                            <span
                                                                className={`text-white text-xs px-3 py-1 rounded-se-lg ${badgeColor}`}
                                                            >
                                                                {matchedType}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                                <div className="absolute bottom-0 right-0">
                                                    {property.mark_as_featured === "Yes" && (
                                                        <span className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-ss-lg">
                                                            FEATURED
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Property Details */}
                                            {/* Property Details - Refined 99acres Style */}
                                            <div className="flex flex-col flex-1 p-3 text-black bg-white">
                                                {/* Price Section */}
                                                <h4>{property.property_name}</h4>
                                                <div className="flex items-center h-10 mb-1">
                                                    <h3 className="flex items-center text-lg font-bold">
                                                        <FaRupeeSign className="mr-0.5 text-sm" />
                                                        {property.property_category_type === "Rent"
                                                            ? formatPrice(property.rent)
                                                            : formatPrice(property.property_price)}
                                                        {property.property_category_type === "Rent" &&
                                                            property.rent_duration && (
                                                                <span className="ml-1 text-xs font-normal text-gray-500">
                                                                    / {property.rent_duration}
                                                                </span>
                                                            )}
                                                    </h3>
                                                </div>

                                                {/* BHK and Property Type */}
                                                <div className="mb-1">
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {property.bhk_type} {property.property_type},{" "}
                                                        {property.bathrooms || "2"} Baths
                                                    </p>
                                                </div>

                                                {/* Address / Locality */}
                                                <div className="flex items-start mb-2">
                                                    <p className="text-xs text-gray-500 line-clamp-1">
                                                        In{" "}
                                                        <span className="font-medium text-gray-700">
                                                            {property.address_area || property.property_name}
                                                        </span>
                                                    </p>
                                                </div>

                                                {/* Divider */}
                                                <hr className="my-2 border-gray-100" />

                                                {/* Footer: Posted by & Share */}
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] text-gray-400 uppercase tracking-wide">
                                                            Posted by {property.user_type || "Owner"}
                                                        </span>
                                                        {/* Dynamic days or static time */}
                                                        <span className="text-[11px] text-gray-400">
                                                            {property.days_since_created
                                                                ? `${property.days_since_created} days ago`
                                                                : "Recently"}
                                                        </span>
                                                    </div>
                                                    {/* Share Icon */}
                                                    <div className="flex space-x-2">
                                                        <FontAwesomeIcon
                                                            icon={faShareNodes}
                                                            className="p-1 text-gray-400 transition-colors cursor-pointer hover:text-blue-500"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation(); // Link trigger na ho isliye
                                                                openRecommendedShareModal(property._id);
                                                            }}
                                                        />
                                                    </div>
                                                    .
                                                </div>
                                                {/* <h4>{property.property_name}</h4> */}
                                                {distance && (
                                                    <p className="flex items-center mt-auto text-sm text-gray-500">
                                                        <FaMapMarkerAlt className="mr-1 text-red-500" />
                                                        {distance} km from you
                                                    </p>
                                                )}
                                            </div>{" "}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                </div>
            </div>
            <div
                id="shareModal"
                className="fixed bottom-0 right-0 z-50 items-center justify-center hidden bg-black bg-opacity-50"
            >
                <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h5 className="text-lg font-bold">Share this link</h5>
                        <button onClick={closeShareModal}>&times;</button>
                    </div>
                    <div className="flex items-center mb-4">
                        <input
                            type="text"
                            className="flex-grow p-2 border rounded form-control"
                            value={currentShareUrl}
                            readOnly
                        />
                        <button
                            className="p-2 ml-2 bg-gray-200 rounded"
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

export default BuyProperty;