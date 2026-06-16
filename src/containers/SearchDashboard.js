import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BiRupee } from "react-icons/bi";
import { AiOutlineInfo } from "react-icons/ai";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Link, useHistory } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BiArea } from "react-icons/bi";
import { FaRupeeSign } from "react-icons/fa";
import { faChair } from "@fortawesome/free-solid-svg-icons";
import { FaCube } from "react-icons/fa";
import { PiShareNetworkLight } from "react-icons/pi";
import { PiCubeFocus } from "react-icons/pi";
import ShareModal from "../containers/ShareModal";
import Slider from "react-slick";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import Login1 from "../auth/Login1";
import SignUp1 from "../auth/SignUp1";
import { useCity } from "./SearchContext";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import ContactDetails from "../containers/ContactDetails";

export default function SearchDashboard() {
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
  const [squareFtDropdownOpen, setSquareFtDropdownOpen] = useState(false);
  const location = useLocation();
  const propertytype = location.state?.propertyType;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const locationState = location.state || {};
  const isNearMe = locationState?.isNearMe || false;
  const userLat = locationState?.lat || null;
  const userLng = locationState?.lng || null;
  const [error, setError] = useState(null);
  const { searchQuery, type } = location.state || {};
  const [search, setSearch] = useState("");
  const { searchCity, setSearchCity } = useCity();
  const [propertyType, setPropertyType] = useState("");
  const [bhkType, setBhkType] = useState("");
  const [furnishedStatus, setFurnishedStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSquareFt, setMinSquareFt] = useState("");
  const [maxSquareFt, setMaxSquareFt] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [activePropertyId, setActivePropertyId] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareId, setActiveShareId] = useState(null);
  const propertyRefs = useRef({});
  const accessToken = sessionStorage.getItem("accessToken");
  const [activeApi, setActiveApi] = useState("search");
  // Modal open states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  // Paginatio -
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const itemsPerPage = 10;
  const [activeIndexes, setActiveIndexes] = useState({});
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [propertyImages, setPropertyImages] = useState([]);

  const [postedBy, setPostedBy] = useState("");
  const [constructionStatus, setConstructionStatus] = useState([]);
  const [constructionOpen, setConstructionOpen] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [bathrooms, setBathrooms] = useState("");
  const [facing, setFacing] = useState("");
  const [withPhoto, setWithPhoto] = useState("");
  const [withVideos, setWithVideos] = useState("");
  const [areaIn, setAreaIn] = useState("sq.ft");
  const [sharingType, setSharingType] = useState([]);
  const [availableFrom, setAvailableFrom] = useState([]);

  const [sharingTypeOpen, setSharingTypeOpen] = useState(false);
  const [availableFromOpen, setAvailableFromOpen] = useState(false);
  const [availableFor, setAvailableFor] = useState([]);
  const [availableForOpen, setAvailableForOpen] = useState(false);
  const [capacity, setCapacity] = useState([]);
  const [capacityOpen, setCapacityOpen] = useState(false);
  const [investmentOptions, setInvestmentOptions] = useState([]);
  const [purchaseType, setPurchaseType] = useState("");
  const [investmentOpen, setInvestmentOpen] = useState(false);

  const [plotLandTypes, setPlotLandTypes] = useState([]);
  const [plotLandOpen, setPlotLandOpen] = useState(false);

  const [officeType, setOfficeType] = useState([]);
  const [retailType, setRetailType] = useState([]);
  const [otherCommercialType, setOtherCommercialType] = useState([]);

  const [officeTypeOpen, setOfficeTypeOpen] = useState(false);
  const [retailTypeOpen, setRetailTypeOpen] = useState(false);
  const [otherCommercialOpen, setOtherCommercialOpen] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [buildingType, setBuildingType] = useState("");
  const [propertyType2, setPropertyType2] = useState([]);
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [freeViewCount, setFreeViewCount] = useState(0);
  const [paidViewCount, setPaidViewCount] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const officeTypeOptions = [
    "Ready to move office space",
    "Bare shell office space",
    "Co-working office space",
  ];

  const retailTypeOptions = [
    "Mall",
    "Commercial Project",
    "Residential Project",
    "Retail Complex/Building",
    "Market/High Street",
  ];

  const otherCommercialOptions = [
    "Factory",
    "Ware House",
    "Hotel Resorts",
    "Guest-House/Banquet-Halls",
    "Cold Storage",
    "Manufacturing",
    "Others",
  ];

  const commercialPropertyOptions = [
    "Ready to move office space",
    "Bare shell office space",
    "Ware House",
    "Factory",
    "Hotel/Resorts",
    "Others",
    "Plot/Land",
    "Cold Storage",
    "Manufacturing",
    "Guest-House/Banquet-Halls",
    "Retail", // important
  ];

  const plotLandOptions = [
    "Commercial Land/Inst. Land",
    "Industrial Lands/Plots",
    "Agricultural/Farm Land",
  ];

  const investmentOptionsList = [
    "Pre-leased Spaces",
    "Restaurants",
    "SCO Plots",
    "Business Center",
    "Food Court",
    "Multiplex",
    "Co-working",
  ];

  const purchaseTypeOptions = ["Resale", "New bookings"];

  const priceOptions = [
    500000, // 5 Lakh
    1000000, // 10 Lakh
    1500000, // 15 Lakh
    2000000, // 20 Lakh
    2500000, // 25 Lakh
    3000000, // 30 Lakh
    3500000, // 35 Lakh
    4000000, // 40 Lakh
    4500000, // 45 Lakh
    5000000, // 50 Lakh
    5500000, // 55 Lakh
    6000000, // 60 Lakh
    6500000, // 65 Lakh
    7000000, // 70 Lakh
    7500000, // 75 Lakh
    8000000, // 80 Lakh
    8500000, // 85 Lakh
    9000000, // 90 Lakh
    9500000, // 95 Lakh

    10000000, // 1 Crore
    12500000, // 1.25 Crore
    15000000, // 1.5 Crore
    17500000, // 1.75 Crore
    20000000, // 2 Crore
    25000000, // 2.5 Crore
    30000000, // 3 Crore
    40000000, // 4 Crore
    50000000, // 5 Crore
    75000000, // 7.5 Crore

    100000000, // 10 Crore
    150000000, // 15 Crore
    200000000, // 20 Crore
    250000000, // 25 Crore
    300000000, // 30 Crore
    400000000, // 40 Crore
    500000000, // 50 Crore
    600000000, // 60 Crore
    700000000, // 70 Crore
    750000000, // 75 Crore
    900000000, // 90 Crore

    1000000000, // 100 Crore
    1500000000, // 150 Crore
    2000000000, // 200 Crore
    2500000000, // 250 Crore
    3000000000, // 300 Crore
    4000000000, // 400 Crore
    5000000000, // 500 Crore
    6000000000, // 600 Crore
    7000000000, // 700 Crore
    7500000000, // 750 Crore
    9000000000, // 900 Crore

    10000000000, // 1000 Crore (10 Billion)
  ];

  const areaUnits = [
    "sq.ft",
    "sq.yards",
    "sq.m",
    "acre",
    "marla",
    "cents",
    "bigha",
    "kottah",
    "kanal",
    "grounds",
    "ares",
    "biswa",
    "guntha",
    "aankadam",
    "hectares",
    "rood",
    "chataks",
    "perch",
  ];

  const toggleSquareFtDropdown = () => {
    setSquareFtDropdownOpen((prev) => !prev);
  };
  const togglePriceDropdown = () => {
    setPriceDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    const typeValue = type.trim().toLowerCase();

    //Property Type matches
    const propertyTypes = ["commercial", "residential", "buy", "rent"];
    if (propertyTypes.includes(typeValue)) {
      setPropertyType(capitalize(typeValue));
    } else if (propertyTypes.includes(query)) {
      setPropertyType(capitalize(query));
    }

    // Furnished Status matches
    const furnishedOptions = ["furnished", "semi-furnished", "unfurnished"];
    if (furnishedOptions.includes(typeValue)) {
      setFurnishedStatus(capitalize(typeValue));
    } else if (furnishedOptions.includes(query)) {
      setFurnishedStatus(capitalize(query));
    }

    // BHK Type matches
    const bhkOptions = [
      "Studio",
      "1 RK",
      "1 BHK",
      "1.5 BHK",
      "2 BHK",
      "2.5 BHK",
      "3 BHK",
      "3.5 BHK",
      "4 BHK",
      "5 BHK",
      "6+ bhk",
    ];

    if (bhkOptions.includes(typeValue)) {
      setBhkType(matchBhk(typeValue));
    } else if (bhkOptions.includes(query)) {
      setBhkType(matchBhk(query));
    }
  }, [type, searchQuery]);

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function matchBhk(value) {
    if (value === "1 RK") return "1 RK";
    if (value === "Studio") return "Studio";
    return value.toUpperCase();
  }

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? propertyImages.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === propertyImages.length - 1 ? 0 : prev + 1,
    );
  };

  const fetchProperties = async (searchCity, type, searchQuery) => {
    try {
      const fetchPropertiesFormData = new FormData();
      fetchPropertiesFormData.append("user_id", accessToken);
      fetchPropertiesFormData.append("page", currentPage);
      fetchPropertiesFormData.append("page_size", itemsPerPage);
      
      // Agar Near Me true hai, toh lat, lng aur radius bhejein
      if (isNearMe && userLat && userLng) {
        fetchPropertiesFormData.append("is_near_me", "true");
        fetchPropertiesFormData.append("latitude", userLat);
        fetchPropertiesFormData.append("longitude", userLng);
        fetchPropertiesFormData.append("radius", 5); // 5 KM range
      } else {
        // Normal search (City ya Locality se)
        fetchPropertiesFormData.append("city_name", searchCity);
        fetchPropertiesFormData.append("search_query", searchQuery);
        fetchPropertiesFormData.append("building_type", type);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/search_properties`,
        fetchPropertiesFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200 && response.data.status === 1) {
        setProperties(response.data.data);
        setTotalPages(response.data.total_pages || 1);
      } else {
        setError("No properties available");
        setProperties([]);
        setTotalPages(0);
      }
    } catch (error) {
      setError("Failed to load properties.");
      setProperties([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredProperties = async (page) => {
    try {
      setError(null);
      const formData = new FormData();

      const cityToSend =
        searchCity && searchCity.trim() !== "" ? searchCity.trim() : "";

      formData.append("customer_id", accessToken);

      if (cityToSend) {
        formData.append("city_name", cityToSend);
      }

      formData.append("page", page);
      formData.append("page_size", itemsPerPage);
      formData.append("search_keyword", searchQuery);

      if (buildingType) {
        formData.append("building_type", buildingType);
      }

      if (propertyType) {
        const apiPropertyCategory =
          propertyType === "Commercial Buy"
            ? "Buy"
            : propertyType === "Commercial Lease"
              ? "Rent"
              : propertyType;

        formData.append("property_category_type", apiPropertyCategory);
      }

      // ============================
      //  COMMERCIAL MAPPING
      // ============================

      if (
        propertyType === "Commercial Lease" &&
        buildingType === "Commercial"
      ) {
        const mapped = mapCommercialLeaseTypes({
          propertyType2,
          officeType,
          retailType,
          otherCommercialType,
          plotLandTypes,
        });

        if (mapped.property_type.length > 0) {
          formData.append("property_type", mapped.property_type.join(","));
        }

        if (mapped.office_type.length > 0) {
          formData.append("office_type", mapped.office_type.join(","));
        }

        if (mapped.sub_sub_property_type.length > 0) {
          formData.append(
            "sub_sub_property_type",
            mapped.sub_sub_property_type.join(","),
          );
        }
      } else if (propertyType === "Commercial Buy") {
        const mapped = mapCommercialTypes(propertyType2);

        if (mapped.property_type.length > 0) {
          formData.append("property_type", mapped.property_type.join(","));
        }

        if (mapped.office_type.length > 0) {
          formData.append("office_type", mapped.office_type.join(","));
        }

        if (mapped.sub_sub_property_type.length > 0) {
          formData.append(
            "sub_sub_property_type",
            mapped.sub_sub_property_type.join(","),
          );
        }
      } else {
        if (propertyType2.length > 0) {
          formData.append("property_type", propertyType2.join(","));
        }
      }

      // ============================
      // OTHER FILTERS
      // ============================

      if (bhkType) formData.append("bhk_type", bhkType);
      if (furnishedStatus) formData.append("furnished_type", furnishedStatus);
      if (minPrice) formData.append("min_price", minPrice);
      if (maxPrice) formData.append("max_price", maxPrice);
      if (minSquareFt) formData.append("min_area", minSquareFt);
      if (maxSquareFt) formData.append("max_area", maxSquareFt);

      if ((minSquareFt || maxSquareFt) && areaIn) {
        formData.append("area_in", areaIn);
      }

      if (postedBy) formData.append("user_type", postedBy);

      if (constructionStatus.length > 0) {
        formData.append("construction_status", constructionStatus.join(","));
      }

      if (selectedAmenities.length > 0) {
        formData.append("amenities", selectedAmenities.join(","));
      }

      if (bathrooms) formData.append("number_of_minimum_bathrooms", bathrooms);
      if (facing) formData.append("facing", facing);
      if (withPhoto) formData.append("with_photo", withPhoto);
      if (withVideos) formData.append("with_videos", withVideos);

      if (availableFor.length > 0) {
        formData.append("available_for", availableFor.join(","));
      }

      if (sharingType.length > 0) {
        formData.append("sharing_type", sharingType.join(","));
      }

      if (availableFrom.length > 0) {
        formData.append("available_from", availableFrom.join(","));
      }

      if (capacity.length > 0) {
        formData.append("available_beds", mapCapacityToBeds(capacity));
      }

      if (investmentOptions.length > 0) {
        formData.append("investment_options", investmentOptions.join(","));
      }

      if (purchaseType) {
        formData.append("purchase_type", purchaseType);
      }

      // ============================
      // API CALL
      // ============================

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/filter_property`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.status === 200 && response.data.status === 1) {
        setProperties(response.data.data);
        setTotalPages(response.data.total_pages || 1);
      } else {
        setProperties([]);
        setTotalPages(0);
        setError("No properties available");
      }
    } catch (error) {
      setProperties([]);
      setTotalPages(0);
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
    setProperties([]);
    const style = document.createElement("style");
    style.innerHTML = `
      .leaflet-popup-content-wrapper {
        margin-bottom: 50px !important;
        padding: 0 !important;
      }
      
      .leaflet-popup-content {
        margin: 0 !important;
        padding: 0 !important;
      }

      .leaflet-container a.leaflet-popup-close-button {
        z-index: 1000;
        top: 5px !important;
        left: 10px;
        border: none;
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        cursor: pointer;
        border-radius: 50%;
      }

      .leaflet-container a.leaflet-popup-close-button:hover {
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
      }

      .leaflet-container .leaflet-popup-heart-button {
        z-index: 1000;
        position: absolute;
        top: 5px;
        right: 10px; /* Adjust the position from right */
        width: 26px;
        height: 24px;
        border: none;
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        cursor: pointer;
        border-radius: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1px;
      }

      .leaflet-container .leaflet-popup-heart-button:hover {
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
      }

      .custom-marker.active .marker-wrapper .price-tooltip{
         background-color: green;
      }
      
      /* Wrapper for marker */
      .marker-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      /* Tooltip-like price box */
.price-tooltip {
  background: white;
  color: black; /* Ensure the text color is black */
  padding: 8px 12px;
  border-radius: 18px;
  font-weight: bold; /* Make the text bold */
  font-size: 1.1rem; /* Increased font size */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  position: relative;
  text-align: center;
  white-space: nowrap;
  z-index: 10;
}


      .price-tooltip:hover {
        background-color: gray; /* Change to gray on hover */
        color: white; /* Optional: Change text color for better contrast */
      }

      /* Pointer (triangle below the box) */
      .price-tooltip .pointer {
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid white;
        background-color: lightgray;
      }
      

      /* Adjust the marker size */
      .custom-marker {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type="number"] {
        -moz-appearance: textfield;
      }

      .custom-button {
        font-family: "Arial", sans-serif;
        font-size: 1.5rem;
        background-color: #fff;
        padding: 0.5rem;
        text-align: center;
        cursor: pointer;
      }

      .custom-button:hover {
        background-color: #f0f0f0;
        color: #333;
      }
    `;
    document.head.appendChild(style);

    if (activeApi === "filter") {
      fetchFilteredProperties(currentPage);
    } else {
      fetchProperties(searchCity, type, searchQuery);
    }
  }, [searchCity, type, searchQuery, currentPage, accessToken]);

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

  const formatPriceMinMax = (value) => {
    const num = Number(value);
    if (num >= 10000000)
      return (num / 10000000).toFixed(1).replace(/\.0$/, "") + " Cr";
    if (num >= 100000)
      return (num / 100000).toFixed(1).replace(/\.0$/, "") + " L";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + " K";
    return num;
  };
  // 5L = 500000, goes up to 75Cr (750000000)

  const createCustomIcon = (property, isActive = false) => {
    // Decide what to display
    let displayValue = "";
    if (property.property_category_type === "Buy" && property.property_price) {
      displayValue = formatPrice(property.property_price);
    } else if (property.property_category_type === "Rent" && property.rent) {
      displayValue = formatPrice(property.rent);
    }

    return L.divIcon({
      className: `custom-marker ${isActive ? "active" : ""}`,
      html: `
      <div class="marker-wrapper">
        <div class="price-tooltip">
          ${displayValue}
          <div class="pointer"></div>
        </div>
      </div>
    `,
      iconSize: [50, 60],
      iconAnchor: [25, 60],
    });
  };

  // Handle button click
  const handleButtonClick = async () => {
    if (filtersApplied) {
      // Reset all filters
      setPropertyType("");
      setBuildingType("");
      setBhkType("");
      setFurnishedStatus("");
      setMinPrice("");
      setMaxPrice("");
      setMinSquareFt("");
      setMaxSquareFt("");
      setPostedBy("");
      setConstructionStatus([]);
      setSelectedAmenities([]);
      setBathrooms("");
      setFacing("");
      setWithPhoto("");
      setWithVideos("");
      setPropertyType2([]);
      setAvailableFor([]);
      setSharingType([]);
      setAvailableFrom([]);
      setCapacity([]);
      setInvestmentOptions([]);
      setPurchaseType("");

      setPlotLandTypes([]);

      // Close dropdowns
      setPriceDropdownOpen(false);
      setSquareFtDropdownOpen(false);
      setAmenitiesOpen(false);

      // Reset mode
      setFiltersApplied(false);
      setActiveApi("search");
      setCurrentPage(1);

      fetchProperties(searchCity, type, searchQuery);
    } else {
      setFiltersApplied(true);
      setActiveApi("filter");
      setCurrentPage(1);

      fetchFilteredProperties(1);
      setAreaIn("sq.ft");
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

  const [activeIndex, setActiveIndex] = useState(0);
  const images = [properties.cover_image, "image2_url", "image3_url"];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3000ms = 3 seconds for auto-slide

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [images.length]);

  //  Add to favorites
  const addToFavorites = async (PropertyId) => {
    if (!accessToken) {
      toast.error("You must be logged in to perform this action");
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

      // Update property in local state
      if (response.data.status === 1) {
        fetchProperties(searchCity, type, searchQuery);
      } else {
        console.error("Failed to remove:", response.data.message);
      }
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
        fetchProperties(searchCity, type, searchQuery);
      } else {
        console.error("Failed to remove:", response.data.message);
      }
    } catch (error) {
      console.error("Error unfavoriting:", error);
    }
  };

  const handleSaveSearch = async () => {
    if (!accessToken) {
      toast.error("Please login first to save search.");
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const propertyIds = [];
      const propertyNames = [];
      const propertyCategories = [];
      const buildingTypes = [];

      properties.forEach((prop) => {
        propertyIds.push(prop._id || "");
        propertyNames.push(prop.property_name || "");
        propertyCategories.push(prop.property_category_type || "");
        buildingTypes.push(prop.building_type || "");
      });

      const formData = new FormData();

      // =========================
      // USER + PROPERTY
      // =========================
      formData.append("user_id", accessToken);
      formData.append("property_id", propertyIds.join("|"));
      formData.append("property_name", propertyNames.join("|"));
      formData.append("property_category_type", propertyCategories.join("|"));
      formData.append("building_type", buildingTypes.join("|"));

      // =========================
      // SEARCH INFO
      // =========================
      formData.append("city_name", searchCity || "");
      formData.append("search_keyword", searchQuery || "");

      // =========================
      // COMMERCIAL MAPPING (CRITICAL)
      // =========================
      if (
        propertyType === "Commercial Lease" &&
        buildingType === "Commercial"
      ) {
        const mapped = mapCommercialLeaseTypes({
          propertyType2,
          officeType,
          retailType,
          otherCommercialType,
          plotLandTypes,
        });

        if (mapped.property_type.length)
          formData.append("property_type", mapped.property_type.join(","));

        if (mapped.office_type.length)
          formData.append("office_type", mapped.office_type.join(","));

        if (mapped.sub_sub_property_type.length)
          formData.append(
            "sub_sub_property_type",
            mapped.sub_sub_property_type.join(","),
          );
      } else if (propertyType === "Commercial Buy") {
        const mapped = mapCommercialTypes(propertyType2);

        if (mapped.property_type.length)
          formData.append("property_type", mapped.property_type.join(","));

        if (mapped.office_type.length)
          formData.append("office_type", mapped.office_type.join(","));

        if (mapped.sub_sub_property_type.length)
          formData.append(
            "sub_sub_property_type",
            mapped.sub_sub_property_type.join(","),
          );
      } else {
        if (propertyType2.length > 0) {
          formData.append("property_type", propertyType2.join(","));
        }
      }

      // =========================
      // BASIC FILTERS
      // =========================
      if (bhkType) formData.append("bhk_type", bhkType);
      if (furnishedStatus) formData.append("furnished_type", furnishedStatus);
      if (minPrice) formData.append("min_price", minPrice);
      if (maxPrice) formData.append("max_price", maxPrice);
      if (minSquareFt) formData.append("min_area", minSquareFt);
      if (maxSquareFt) formData.append("max_area", maxSquareFt);
      if (areaIn) formData.append("area_in", areaIn);
      if (postedBy) formData.append("user_type", postedBy);

      // =========================
      // MULTI SELECT
      // =========================
      if (constructionStatus.length > 0) {
        formData.append("construction_status", constructionStatus.join(","));
      }

      if (selectedAmenities.length > 0) {
        formData.append("amenities", selectedAmenities.join(","));
      }

      // =========================
      // EXTRA FILTERS
      // =========================
      if (bathrooms) formData.append("no_of_bathrooms", bathrooms);
      if (facing) formData.append("facing", facing);
      if (withPhoto) formData.append("with_photo", withPhoto);
      if (withVideos) formData.append("with_videos", withVideos);

      if (availableFor.length > 0) {
        formData.append("available_for", availableFor.join(","));
      }

      if (sharingType.length > 0) {
        formData.append("sharing_type", sharingType.join(","));
      }

      if (availableFrom.length > 0) {
        formData.append("available_from", availableFrom.join(","));
      }

      if (capacity.length > 0) {
        formData.append("available_beds", mapCapacityToBeds(capacity));
      }

      if (investmentOptions.length > 0) {
        formData.append("investment_options", investmentOptions.join(","));
      }

      if (purchaseType) {
        formData.append("purchase_type", purchaseType);
      }

      // =========================
      // API CALL
      // =========================
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/add_save_search_property`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (response.ok && result.status === 1) {
        toast.success("Search saved successfully!");
      } else {
        toast.error(result.message || "Failed to save search.");
      }
    } catch (error) {
      console.error("Save Search Error:", error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const fetchAmenities = async () => {
    try {
      const formData = new FormData();

      const response = await axios.post(
        "https://api.nowaybroker.com/cust_api/get_amenities",
        formData,
      );

      if (response.data.status === 1) {
        setAmenitiesList(response.data.data);
      }
    } catch (error) {
      console.log("Amenities fetch failed", error);
    }
  };

  const toggleAmenity = (id) => {
    const value = String(id);

    setSelectedAmenities((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const togglePropertyType = (type) => {
    if (propertyType === "Commercial Lease" && buildingType === "Commercial") {
      // Single select behavior
      setPropertyType2(propertyType2.includes(type) ? [] : [type]);
    } else {
      // Existing multi-select behavior
      setPropertyType2((prev) =>
        prev.includes(type)
          ? prev.filter((item) => item !== type)
          : [...prev, type],
      );
    }
  };

  const incrementBathrooms = () => {
    setBathrooms((prev) => {
      const current = parseInt(prev) || 0;
      return current < 20 ? String(current + 1) : prev;
    });
  };

  const decrementBathrooms = () => {
    setBathrooms((prev) => {
      const current = parseInt(prev) || 0;
      return current > 0 ? String(current - 1) : "";
    });
  };

  const handleBathroomInput = (e) => {
    const value = e.target.value;

    if (value === "") {
      setBathrooms("");
      return;
    }

    const numericValue = parseInt(value);

    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 20) {
      setBathrooms(String(numericValue));
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const shouldShowFacingFilter = () => {
    return propertyType2.includes("Plot/Land");
  };

  const getFilteredPropertyTypes = () => {
    if (propertyType === "Commercial Lease" && buildingType === "Commercial") {
      return [
        "Office Space",
        "Retail Shops/Showrooms",
        "Other Commercial spaces",
        "Plot/Land",
      ];
    }
    if (propertyType === "Commercial Buy" || buildingType === "Commercial") {
      return commercialPropertyOptions;
    }

    if (propertyType === "Buy") {
      return [
        "Flat/Apartment",
        "Home/Villa",
        "Service Apartment",
        "Farmhouse",
        "Plot/Land",
        "Builder Floor",
        "1RK/Studio Apartment",
      ];
    }

    if (propertyType === "Rent") {
      return [
        "Flat/Apartment",
        "Builder Floor",
        "1RK/Studio Apartment",
        "Independent House/Villa",
        "Service Apartment",
        "Farmhouse",
      ];
    }

    if (propertyType === "PG/Co-living") {
      return [
        "Flat/Apartment",
        "Builder Floor",
        "1RK/Studio Apartment",
        "Independent House/Villa",
        "Service Apartment",
      ];
    }

    // Default
    return [
      "Apartment",
      "Flat/Apartment",
      "Builder Floor",
      "Independent House/Villa",
      "Independent/Builder Floor",
      "1RK/Studio Apartment",
      "Service Apartment",
      "Farmhouse",
      "Office",
      "Retail",
      "Plot/Land",
      "Storage",
      "Industry",
      "Hospitality",
      "Other",
      "Home/Villa",
    ];
  };

  const toggleAvailableFor = (value) => {
    setAvailableFor((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const getAvailableForOptions = () => {
    if (propertyType === "Rent") {
      return ["Family", "Single Women", "Single Men", "Company Guest House"];
    }

    if (propertyType === "PG/Co-living") {
      return ["Boys", "Girls", "Working"];
    }

    return [];
  };

  const toggleSharingType = (value) => {
    setSharingType((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const toggleAvailableFrom = (value) => {
    setAvailableFrom((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const toggleCapacity = (value) => {
    setCapacity((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const mapCapacityToBeds = (capacityArr) => {
    const mapping = {
      "1-2 guest": "1-2",
      "2-4 guest": "2-4",
      "4-10 guest": "4-10",
      "10+ guest": "10+",
    };

    return capacityArr.map((item) => mapping[item]).join(",");
  };

  const toggleInvestmentOption = (value) => {
    setInvestmentOptions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const togglePlotLandType = (value) => {
    setPlotLandTypes((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const toggleConstructionStatus = (value) => {
    setConstructionStatus((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  useEffect(() => {
    if (!propertyType2.includes("Plot/Land")) {
      setPlotLandTypes([]);
    }
  }, [propertyType2]);

  useEffect(() => {
    if (!propertyType2.includes("Office Space")) {
      setOfficeType([]);
    }
  }, [propertyType2]);

  useEffect(() => {
    if (!propertyType2.includes("Retail Shops/Showrooms")) {
      setRetailType([]);
    }
  }, [propertyType2]);

  useEffect(() => {
    if (!propertyType2.includes("Other Commercial spaces")) {
      setOtherCommercialType([]);
    }
  }, [propertyType2]);

  const mapCommercialTypes = (selectedTypes) => {
    const property_type = [];
    const office_type = [];
    const sub_sub_property_type = [];

    selectedTypes.forEach((item) => {
      const val = item.trim();

      if (val === "Plot/Land") {
        property_type.push("Plot/Land");

        if (plotLandTypes.length > 0) {
          office_type.push(...plotLandTypes);
        }
      } else if (val === "Retail") {
        property_type.push("Retail");
      } else if (val === "Others") {
        sub_sub_property_type.push("Others");
      } else {
        office_type.push(val);
      }
    });

    return { property_type, office_type, sub_sub_property_type };
  };

  const mapCommercialLeaseTypes = ({
    propertyType2,
    officeType,
    retailType,
    otherCommercialType,
    plotLandTypes,
  }) => {
    let property_type = [];
    let office_type = [];
    let sub_sub_property_type = [];

    propertyType2.forEach((type) => {
      //  OFFICE SPACE
      if (type === "Office Space") {
        property_type.push("Office");
        office_type.push(...officeType);
      }

      //  RETAIL
      else if (type === "Retail Shops/Showrooms") {
        property_type.push("Retail");
        sub_sub_property_type.push(...retailType);
      }

      //  OTHER COMMERCIAL
      else if (type === "Other Commercial spaces") {
        otherCommercialType.forEach((item) => {
          if (item === "Others") {
            sub_sub_property_type.push("Others");
          } else {
            office_type.push(item);
          }
        });
      }

      //  PLOT/LAND (same as before)
      else if (type === "Plot/Land") {
        property_type.push("Plot/Land");

        // send plot sub-types in office_type (same as Buy logic)
        if (plotLandTypes.length > 0) {
          office_type.push(...plotLandTypes);
        }
      }
    });

    return {
      property_type,
      office_type,
      sub_sub_property_type,
      plotLandTypes,
    };
  };

  const checkPostLimits = async () => {
    try {
      const profileForm = new FormData();
      profileForm.append("user_id", accessToken);

      const profileResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
        profileForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const countData = profileResponse?.data?.count_data;

      if (countData) {
        setFreeViewCount(countData.free_view_count || 0);
        setPaidViewCount(countData.paid_view_count || 0);
      }
    } catch (error) {
      console.error("Error checking post limits:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      checkPostLimits();
    }
  }, [accessToken]);

  const handleAddCount = async (updatedCount) => {
    try {
      const addCountFormData = new FormData();

      if (freeViewCount > 0) {
        addCountFormData.append("free_view_count", -1);
      } else {
        addCountFormData.append("paid_view_count", -1);
      }

      addCountFormData.append("user_id", accessToken);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/add_count`,
        {
          method: "POST",
          body: addCountFormData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        checkPostLimits();
      } else {
        console.error("Failed to update count:", data.message);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleContactClick = async (property) => {
    if (!accessToken) {
      setIsLoginModalOpen(true);
      return;
    }

    setSelectedProperty(property);

    // CASE 1 -> FREE VIEWS AVAILABLE
    if (freeViewCount > 0) {
      await handleAddCount(freeViewCount);

      setShowUpgradePrompt(false);
      setIsContactModalOpen(true);
      return;
    }

    // CASE 2 -> PAID VIEWS AVAILABLE
    if (paidViewCount > 0) {
      await handleAddCount(paidViewCount);

      setShowUpgradePrompt(false);
      setIsContactModalOpen(true);
      return;
    }

    // CASE 3 -> NO COUNTS LEFT
    setShowUpgradePrompt(true);
    setIsContactModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col p-1 space-y-4 sm:p-6 bg-rose-50 rounded-xl">
        {/* Search and Filter Section */}
        {/* <div className="flex flex-col flex-wrap items-center justify-center gap-4 md:flex-row md:items-center">
          {/* Left Side - Search Input (Optional Placeholder) */}

          {/* Right Side Fields */}
          {/* <div className="flex flex-wrap w-full gap-2 mt-2 md:w-auto"> */} 
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-2 whitespace-nowrap">
            {/* Property Category Dropdown */}
            <div className="w-[200px] flex-shrink-0">
              <select
                value={propertyType}
                onChange={(e) => {
                  const val = e.target.value;

                  setPropertyType(val);

                  setPropertyType2([]);
                  setOfficeType([]);
                  setRetailType([]);
                  setOtherCommercialType([]);
                  setPlotLandTypes([]);
                  setAvailableFor([]);
                  setSharingType([]);
                  setAvailableFrom([]);
                  setCapacity([]);
                  setInvestmentOptions([]);
                  setPurchaseType("");

                  // Auto-set building type
                  if (val === "Commercial Buy" || val === "Commercial Lease") {
                    setBuildingType("Commercial");
                  } else {
                    setBuildingType("");
                  }
                }}
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md"
              >
                <option value="">Property Category</option>
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
                <option value="Commercial Buy">Commercial Buy</option>
                <option value="Commercial Lease">Commercial Lease</option>
                <option value="PG/Co-living">PG/Co-living</option>
              </select>
            </div>

            {/* Building Type Dropdown */}
            <div className="w-[200px] flex-shrink-0">
              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                disabled={
                  propertyType === "Commercial Buy" ||
                  propertyType === "Commercial Lease"
                }
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300"
              >
                <option value="">Building Type</option>
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
              </select>
            </div>

            <div className="relative w-[260px] flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                console.log("Property Type Clicked");
                setPropertyTypeOpen(!propertyTypeOpen)}}
                className="flex items-center justify-between w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-md"
              >
                <span className="truncate text-left">
                  {propertyType2.length > 0
                    ? propertyType2.join(", ")
                    : "Property Type"}
                </span>

                <RiArrowDropDownLine className="text-2xl" />
              </button>

              {propertyTypeOpen && (
                <div className="absolute left-0 z-[9999] w-full mt-2 bg-white border rounded-md shadow-lg max-h-72 overflow-y-auto">
                  {getFilteredPropertyTypes().map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type={
                          propertyType === "Commercial Lease" &&
                          buildingType === "Commercial"
                            ? "radio"
                            : "checkbox"
                        }
                        name="propertyType"
                        checked={propertyType2.includes(type)}
                        onChange={() => togglePropertyType(type)}
                      />

                      <span>{type}</span>
                    </label>
                  ))}

                  <div className="sticky bottom-0 flex gap-2 p-2 bg-white border-t">
                    <button
                      onClick={() => setPropertyType2([])}
                      className="w-1/2 py-2 border rounded-md"
                    >
                      Clear
                    </button>

                    <button
                      onClick={() => setPropertyTypeOpen(false)}
                      className="w-1/2 py-2 text-white bg-rose-500 rounded-md"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Budget Dropdown */}
            <div className="relative w-[260px] flex-shrink-0">
              <button
                onClick={togglePriceDropdown}
                className="flex items-center justify-between w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300"
              >
                <span>
                  {minPrice && maxPrice
                    ? `${formatPriceMinMax(minPrice)} - ${formatPriceMinMax(maxPrice)}`
                    : minPrice
                      ? `Above ${formatPriceMinMax(minPrice)}`
                      : maxPrice
                        ? `Below ${formatPriceMinMax(maxPrice)}`
                        : "Budget"}
                </span>

                <RiArrowDropDownLine className="text-2xl" />
              </button>

              {priceDropdownOpen && (
                <div className="absolute left-0 mt-2 w-full p-4 bg-white border-2 border-gray-300 rounded-md shadow-lg z-[20]">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600">Min Price</label>
                    <select
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="p-2 border-2 border-gray-300 rounded-md focus:outline-none"
                    >
                      <option value="">Min</option>
                      {priceOptions
                        .filter((price) => !maxPrice || price < maxPrice) // enforce < Max
                        .map((price) => (
                          <option key={price} value={price}>
                            {formatPriceMinMax(price)}
                          </option>
                        ))}
                    </select>

                    <label className="text-sm text-gray-600">Max Price</label>
                    <select
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="p-2 border-2 border-gray-300 rounded-md focus:outline-none"
                    >
                      <option value="">Max</option>
                      {priceOptions
                        .filter((price) => !minPrice || price > minPrice) // enforce > Min
                        .map((price) => (
                          <option key={price} value={price}>
                            {formatPriceMinMax(price)}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Furnished Status Dropdown */}
            <div className="w-[200px] flex-shrink-0">
              <select
                value={furnishedStatus}
                onChange={(e) => setFurnishedStatus(e.target.value)}
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300"
              >
                <option value="">Select Furnished</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            {/* BHK Type Dropdown */}
            <div className="w-[200px] flex-shrink-0">
              <select
                value={bhkType}
                onChange={(e) => setBhkType(e.target.value)}
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300"
              >
                <option value="">Select BHK</option>
                <option value="Studio">Studio</option>
                <option value="1 RK">1 RK</option>
                <option value="1 BHK">1 BHK</option>
                <option value="1.5 BHK">1.5 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="2.5 BHK">2.5 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="3.5 BHK">3.5 BHK</option>
                <option value="4 BHK">4 BHK</option>
                <option value="5 BHK">5 BHK</option>
                <option value="6+ BHK">6+ BHK</option>
              </select>
            </div>

            {/* Posted By Dropdown */}
            <div className="w-[200px] flex-shrink-0">
              <select
                value={postedBy}
                onChange={(e) => setPostedBy(e.target.value)}
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300"
              >
                <option value="">Posted By</option>
                <option value="Owner">Owner</option>
                <option value="Builder">Builder</option>
              </select>
            </div>

            {/* Construction Status */}
            <div className="relative w-[260px] flex-shrink-0">
              <button
                type="button"
                onClick={() => setConstructionOpen(!constructionOpen)}
                className="flex items-center justify-between w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-md"
              >
                <span className="truncate text-left">
                  {constructionStatus.length > 0
                    ? constructionStatus.join(", ")
                    : "Construction Status"}
                </span>

                <RiArrowDropDownLine className="text-2xl" />
              </button>

              {constructionOpen && (
                <div className="absolute left-0 z-50 w-full mt-2 bg-white border rounded-md shadow-lg">
                  {["Ready To Move", "New Launch", "Under Construction"].map(
                    (option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          checked={constructionStatus.includes(option)}
                          onChange={() => toggleConstructionStatus(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ),
                  )}

                  <div className="sticky bottom-0 flex gap-2 p-2 bg-white border-t">
                    <button
                      onClick={() => setConstructionStatus([])}
                      className="w-1/2 py-2 border rounded-md"
                    >
                      Clear
                    </button>

                    <button
                      onClick={() => setConstructionOpen(false)}
                      className="w-1/2 py-2 text-white bg-rose-500 rounded-md"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative w-[260px] flex-shrink-0">
              <button
                type="button"
                onClick={() => setAmenitiesOpen(!amenitiesOpen)}
                className="flex items-center justify-between w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-md"
              >
                <span className="truncate text-left">
                  {selectedAmenities.length > 0
                    ? amenitiesList
                        .filter((item) =>
                          selectedAmenities.includes(String(item._id)),
                        )
                        .map((item) => item.amenity_name)
                        .join(", ")
                    : "Amenities"}
                </span>

                <RiArrowDropDownLine className="text-2xl" />
              </button>

              {amenitiesOpen && (
                <div className="absolute left-0 z-50 w-full mt-2 bg-white border rounded-md shadow-lg max-h-72 overflow-y-auto">
                  {amenitiesList.map((item) => (
                    <label
                      key={item._id}
                      className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(String(item._id))}
                        onChange={() => toggleAmenity(item._id)}
                      />

                      <span>{item.amenity_name}</span>
                    </label>
                  ))}

                  <div className="sticky bottom-0 flex gap-2 p-2 bg-white border-t">
                    <button
                      onClick={() => setSelectedAmenities([])}
                      className="w-1/2 py-2 border rounded-md"
                    >
                      Clear
                    </button>

                    <button
                      onClick={() => setAmenitiesOpen(false)}
                      className="w-1/2 py-2 text-white bg-rose-500 rounded-md"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-[200px] flex-shrink-0">
              <div className="flex items-center h-16 overflow-hidden bg-white border-2 border-gray-300 rounded-md">
                <button
                  type="button"
                  onClick={decrementBathrooms}
                  className="flex items-center justify-center w-14 h-full text-2xl font-bold border-r hover:bg-gray-200"
                >
                  -
                </button>

                <input
                  type="number"
                  min="0"
                  max="20"
                  value={bathrooms}
                  onChange={handleBathroomInput}
                  placeholder="Bathrooms"
                  className="w-full h-full text-center focus:outline-none"
                />

                <button
                  type="button"
                  onClick={incrementBathrooms}
                  className="flex items-center justify-center w-14 h-full text-2xl font-bold border-l hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            {shouldShowFacingFilter() && (
              <div className="w-[200px] flex-shrink-0">
                <select
                  value={facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300"
                >
                  <option value="">Facing</option>
                  <option value="North">North</option>
                  <option value="East">East</option>
                  <option value="North-East">North-East</option>
                  <option value="South-East">South-East</option>
                  <option value="North-West">North-West</option>
                  <option value="West">West</option>
                  <option value="South">South</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>
            )}

            <div className="w-[200px] flex-shrink-0">
              <select
                value={withPhoto}
                onChange={(e) => setWithPhoto(e.target.value)}
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300"
              >
                <option value="">With Photo</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="w-[200px] flex-shrink-0">
              <select
                value={withVideos}
                onChange={(e) => setWithVideos(e.target.value)}
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300"
              >
                <option value="">With Video</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Sq. Ft Range Dropdown */}
            <div className="relative w-[260px] flex-shrink-0">
              <button
                onClick={toggleSquareFtDropdown}
                className="flex items-center justify-between w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300"
              >
                <span>
                  {minSquareFt || maxSquareFt
                    ? `${minSquareFt || 0} - ${maxSquareFt || "Any"} ${areaIn}`
                    : "Area"}
                </span>

                <RiArrowDropDownLine className="text-2xl" />
              </button>

              {squareFtDropdownOpen && (
                <div className="absolute left-0 mt-2 w-full p-4 bg-white border-2 border-gray-300 rounded-md shadow-lg z-[20]">
                  {/* Area Unit */}
                  <label className="text-sm text-gray-600">Area Unit</label>
                  <select
                    value={areaIn}
                    onChange={(e) => setAreaIn(e.target.value)}
                    className="w-full p-2 mb-3 border-2 border-gray-300 rounded-md focus:outline-none"
                  >
                    {areaUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit.charAt(0).toUpperCase() +
                          unit.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>

                  {/* Min Area */}
                  <label className="text-sm text-gray-600">Min Area</label>
                  <input
                    type="number"
                    value={minSquareFt}
                    onChange={(e) => setMinSquareFt(e.target.value)}
                    className="w-full p-2 mb-3 border-2 border-gray-300 rounded-md focus:outline-none"
                    placeholder="Min"
                  />

                  {/* Max Area */}
                  <label className="text-sm text-gray-600">Max Area</label>
                  <input
                    type="number"
                    value={maxSquareFt}
                    onChange={(e) => setMaxSquareFt(e.target.value)}
                    className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none"
                    placeholder="Max"
                  />
                </div>
              )}
            </div>

            {propertyType === "PG/Co-living" && (
              <div className="relative w-[260px] flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setSharingTypeOpen(!sharingTypeOpen)}
                  className="flex items-center justify-between w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-md"
                >
                  <span className="truncate text-left">
                    {sharingType.length > 0
                      ? sharingType.join(", ")
                      : "Sharing Type"}
                  </span>

                  <RiArrowDropDownLine className="text-2xl" />
                </button>

                {sharingTypeOpen && (
                  <div className="absolute left-0 z-50 w-full mt-2 bg-white border rounded-md shadow-lg">
                    {[
                      "Private Rooms",
                      "2 Per Room",
                      "More than 2 per room",
                    ].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          checked={sharingType.includes(option)}
                          onChange={() => toggleSharingType(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}

                    <div className="sticky bottom-0 flex gap-2 p-2 bg-white border-t">
                      <button
                        onClick={() => setSharingType([])}
                        className="w-1/2 py-2 border rounded-md"
                      >
                        Clear
                      </button>

                      <button
                        onClick={() => setSharingTypeOpen(false)}
                        className="w-1/2 py-2 text-white bg-rose-500 rounded-md"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {propertyType === "Rent" && (
              <div className="relative w-[260px] flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setAvailableFromOpen(!availableFromOpen)}
                  className="flex items-center justify-between w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-md"
                >
                  <span className="truncate text-left">
                    {availableFrom.length > 0
                      ? availableFrom.join(", ")
                      : "Available From"}
                  </span>

                  <RiArrowDropDownLine className="text-2xl" />
                </button>

                {availableFromOpen && (
                  <div className="absolute left-0 z-50 w-full mt-2 bg-white border rounded-md shadow-lg">
                    {[
                      "Immediately",
                      "Any Time",
                      "Within 1 Month",
                      "After 1 Month",
                      "Within 3 Month",
                      "After 3 Month",
                    ].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          checked={availableFrom.includes(option)}
                          onChange={() => toggleAvailableFrom(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}

                    <div className="sticky bottom-0 flex gap-2 p-2 bg-white border-t">
                      <button
                        onClick={() => setAvailableFrom([])}
                        className="w-1/2 py-2 border rounded-md"
                      >
                        Clear
                      </button>

                      <button
                        onClick={() => setAvailableFromOpen(false)}
                        className="w-1/2 py-2 text-white bg-rose-500 rounded-md"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(propertyType === "Rent" || propertyType === "PG/Co-living") && (
              <div className="relative w-[260px] flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setAvailableForOpen(!availableForOpen)}
                  className="flex items-center justify-between w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-md"
                >
                  <span className="truncate text-left">
                    {availableFor.length > 0
                      ? availableFor.join(", ")
                      : "Available For"}
                  </span>

                  <RiArrowDropDownLine className="text-2xl" />
                </button>

                {availableForOpen && (
                  <div className="absolute left-0 z-50 w-full mt-2 bg-white border rounded-md shadow-lg max-h-72 overflow-y-auto">
                    {getAvailableForOptions().map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          checked={availableFor.includes(option)}
                          onChange={() => toggleAvailableFor(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}

                    <div className="sticky bottom-0 flex gap-2 p-2 bg-white border-t">
                      <button
                        onClick={() => setAvailableFor([])}
                        className="w-1/2 py-2 border rounded-md"
                      >
                        Clear
                      </button>

                      <button
                        onClick={() => setAvailableForOpen(false)}
                        className="w-1/2 py-2 text-white bg-rose-500 rounded-md"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {propertyType === "PG/Co-living" && (
              <div className="relative w-[260px] flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setCapacityOpen(!capacityOpen)}
                  className="flex items-center justify-between w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-md"
                >
                  <span className="truncate text-left">
                    {capacity.length > 0
                      ? capacity.join(", ")
                      : "Total Capacity"}
                  </span>

                  <RiArrowDropDownLine className="text-2xl" />
                </button>

                {capacityOpen && (
                  <div className="absolute left-0 z-50 w-full mt-2 bg-white border rounded-md shadow-lg">
                    {["1-2 guest", "2-4 guest", "4-10 guest", "10+ guest"].map(
                      (option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={capacity.includes(option)}
                            onChange={() => toggleCapacity(option)}
                          />
                          <span>{option}</span>
                        </label>
                      ),
                    )}

                    <div className="sticky bottom-0 flex gap-2 p-2 bg-white border-t">
                      <button
                        onClick={() => setCapacity([])}
                        className="w-1/2 py-2 border rounded-md"
                      >
                        Clear
                      </button>

                      <button
                        onClick={() => setCapacityOpen(false)}
                        className="w-1/2 py-2 text-white bg-rose-500 rounded-md"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {propertyType === "Commercial Buy" && (
              <div className="relative w-[260px] flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setInvestmentOpen(!investmentOpen)}
                  className="flex items-center justify-between w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-md"
                >
                  <span className="truncate text-left">
                    {investmentOptions.length > 0
                      ? investmentOptions.join(", ")
                      : "Investment Options"}
                  </span>
                  <RiArrowDropDownLine className="text-2xl" />
                </button>

                {investmentOpen && (
                  <div className="absolute left-0 z-50 w-full mt-2 bg-white border rounded-md shadow-lg">
                    {investmentOptionsList.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          checked={investmentOptions.includes(option)}
                          onChange={() => toggleInvestmentOption(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}

                    <div className="sticky bottom-0 flex gap-2 p-2 bg-white border-t">
                      <button
                        onClick={() => setInvestmentOptions([])}
                        className="w-1/2 py-2 border rounded-md"
                      >
                        Clear
                      </button>

                      <button
                        onClick={() => setInvestmentOpen(false)}
                        className="w-1/2 py-2 text-white bg-rose-500 rounded-md"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {propertyType === "Commercial Buy" && (
              <div className="w-[200px] flex-shrink-0">
                <select
                  value={purchaseType}
                  onChange={(e) => setPurchaseType(e.target.value)}
                  className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300"
                >
                  <option value="">Purchase Type</option>
                  {purchaseTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(propertyType === "Commercial Buy" ||
              propertyType === "Commercial Lease") &&
              buildingType === "Commercial" &&
              propertyType2.includes("Plot/Land") && (
                <div className="relative w-[260px] flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setPlotLandOpen(!plotLandOpen)}
                    className="flex items-center justify-between w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-md"
                  >
                    <span className="truncate text-left">
                      {plotLandTypes.length > 0
                        ? plotLandTypes.join(", ")
                        : "Plot/Land Type"}
                    </span>
                    <RiArrowDropDownLine className="text-2xl" />
                  </button>

                  {plotLandOpen && (
                    <div className="absolute left-0 z-50 w-full mt-2 bg-white border rounded-md shadow-lg">
                      {plotLandOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={plotLandTypes.includes(option)}
                            onChange={() => togglePlotLandType(option)}
                          />
                          <span>{option}</span>
                        </label>
                      ))}

                      <div className="sticky bottom-0 flex gap-2 p-2 bg-white border-t">
                        <button
                          onClick={() => setPlotLandTypes([])}
                          className="w-1/2 py-2 border rounded-md"
                        >
                          Clear
                        </button>

                        <button
                          onClick={() => setPlotLandOpen(false)}
                          className="w-1/2 py-2 text-white bg-rose-500 rounded-md"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            {propertyType === "Commercial Lease" &&
              buildingType === "Commercial" &&
              propertyType2.includes("Office Space") && (
                <div className="relative w-[260px] flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setOfficeTypeOpen(!officeTypeOpen)}
                    className="flex items-center justify-between w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-md"
                  >
                    <span className="truncate text-left">
                      {officeType.length > 0
                        ? officeType.join(", ")
                        : "Office Type"}
                    </span>
                    <RiArrowDropDownLine className="text-2xl" />
                  </button>

                  {officeTypeOpen && (
                    <div className="absolute left-0 z-50 w-full mt-2 bg-white border rounded-md shadow-lg">
                      {officeTypeOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 px-3 py-2"
                        >
                          <input
                            type="checkbox"
                            checked={officeType.includes(option)}
                            onChange={() =>
                              setOfficeType((prev) =>
                                prev.includes(option)
                                  ? prev.filter((i) => i !== option)
                                  : [...prev, option],
                              )
                            }
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

            {propertyType === "Commercial Lease" &&
              buildingType === "Commercial" &&
              propertyType2.includes("Retail Shops/Showrooms") && (
                <div className="relative w-[260px] flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setRetailTypeOpen(!retailTypeOpen)}
                    className="flex items-center justify-between w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-md"
                  >
                    <span>
                      {retailType.length > 0
                        ? retailType.join(", ")
                        : "Retail Type"}
                    </span>
                    <RiArrowDropDownLine className="text-2xl" />
                  </button>

                  {retailTypeOpen && (
                    <div className="absolute left-0 z-50 w-full mt-2 bg-white border rounded-md shadow-lg">
                      {retailTypeOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 px-3 py-2"
                        >
                          <input
                            type="checkbox"
                            checked={retailType.includes(option)}
                            onChange={() =>
                              setRetailType((prev) =>
                                prev.includes(option)
                                  ? prev.filter((i) => i !== option)
                                  : [...prev, option],
                              )
                            }
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

            {propertyType === "Commercial Lease" &&
              buildingType === "Commercial" &&
              propertyType2.includes("Other Commercial spaces") && (
                <div className="relative w-[260px] flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setOtherCommercialOpen(!otherCommercialOpen)}
                    className="flex items-center justify-between w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-md"
                  >
                    <span>
                      {otherCommercialType.length > 0
                        ? otherCommercialType.join(", ")
                        : "Other Commercial Type"}
                    </span>
                    <RiArrowDropDownLine className="text-2xl" />
                  </button>

                  {otherCommercialOpen && (
                    <div className="absolute left-0 z-50 w-full mt-2 bg-white border rounded-md shadow-lg">
                      {otherCommercialOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 px-3 py-2"
                        >
                          <input
                            type="checkbox"
                            checked={otherCommercialType.includes(option)}
                            onChange={() =>
                              setOtherCommercialType((prev) =>
                                prev.includes(option)
                                  ? prev.filter((i) => i !== option)
                                  : [...prev, option],
                              )
                            }
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
              {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:justify-end ">
              <button
                onClick={handleButtonClick}
                className="w-40 p-3 text-rose-700 my-border rounded-md hover:bg-gray-300 focus:outline-none"
              >
                {filtersApplied ? "Reset Filters" : "Apply Filter"}
              </button>
              <button
                className="w-40 p-3 my-border rounded-md hover:bg-gray-300 focus:outline-none"
                onClick={handleSaveSearch}
              >
                Save Search
              </button>
            </div>
        </div>

      {/* Main Content */}
      <div className="flex flex-col p-1 space-y-4 sm:p-6 bg-rose-50 rounded-xl">
        <div className="flex-grow">
          <div className="flex flex-col bg-white border-white shadow-md sm:flex-row-reverse">
            <div
              className="z-10 flex-1 p-4 border-white no-scrollbar"
              style={{ scrollbarWidth: "none" }}
            >
              {/* Right: Properties */}
               <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {properties.length > 0 ? (
                  properties.map((property) => (
                    <div
                      key={property._id}
                      className={`shadow-md rounded-2xl overflow-hidden block no-underline hover:no-underline ${
                        hoveredPropertyId === property._id ? "bg-green-200" : ""
                      }`}
                      onMouseEnter={() => setHoveredPropertyId(property._id)}
                      onMouseLeave={() => setHoveredPropertyId(null)}
                    >
                      <div className="relative" key={property._id}>
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
                                const isActive =
                                  i === activeSlide % totalImages;
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
                              {(property?.property_images || []).map(
                                (imgObj) => (
                                  <div key={imgObj._id}>
                                    <img
                                      src={imgObj.image}
                                      alt="Property"
                                      className="object-cover w-full h-48 rounded-t-2xl"
                                    />
                                  </div>
                                ),
                              )}
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
                          <button
                            className="p-1.5 rounded-full shadow bg-gray-800/60 backdrop-blur-sm"
                            onClick={(e) => {
                              e.preventDefault();
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
                        </div>

                        {/* FOR BUY / RENT / UNKNOWN Tag (Bottom Left) */}
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

                            let badgeText = "UNKNOWN";
                            let badgeColor = "bg-gray-500";

                            if (normalizedCategory === "buy") {
                              badgeText = "FOR BUY";
                              badgeColor = "bg-green-500";
                            } else if (normalizedCategory === "rent") {
                              badgeText = "FOR RENT";
                              badgeColor = "bg-blue-500";
                            } else if (
                              normalizedCategory.includes("commercial buy")
                            ) {
                              badgeText = "COMMERCIAL BUY";
                              badgeColor = "bg-purple-500";
                            } else if (
                              normalizedCategory.includes("commercial lease")
                            ) {
                              badgeText = "COMMERCIAL LEASE";
                              badgeColor = "bg-indigo-500";
                            } else if (
                              normalizedCategory.includes("pg") ||
                              normalizedCategory.includes("co living") ||
                              normalizedCategory.includes("coliving")
                            ) {
                              badgeText = "PG / CO-LIVING";
                              badgeColor = "bg-yellow-500";
                            } else if (
                              normalizedCategory.includes("residential")
                            ) {
                              badgeText = "RESIDENTIAL";
                              badgeColor = "bg-pink-500";
                            }

                            return (
                              <span
                                className={`text-white text-xs px-3 py-1 rounded-se-lg ${badgeColor}`}
                              >
                                {badgeText}
                              </span>
                            );
                          })()}
                        </div>

                        {/* FEATURED Tag (Bottom Right) */}
                        <div className="absolute bottom-0 right-0">
                          {property.mark_as_featured === "Yes" && (
                            <div className="absolute bottom-0 right-0">
                              <span className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-ss-lg">
                                FEATURED
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Property Description */}
                      <div className="p-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-gray-800 truncate">
                            {property.property_name}
                          </h3>
                          <FontAwesomeIcon
                            icon={faShareNodes}
                            className="p-2 text-gray-500 bg-white rounded shadow cursor-pointer"
                            onClick={() =>
                              openShareModal1(
                                `${window.location.origin}/property/${property._id}`,
                                property._id,
                              )
                            }
                          />
                        </div>

                        {/* Property Details */}
                        <div className="flex flex-wrap items-center gap-4 mt-1 text-gray-700">
                          {/* Price */}
                          <div className="flex items-center gap-1 text-lg font-semibold">
                            <FaRupeeSign className="text-xl my-text" />
                            {property.property_category_type === "Rent" ? (
                              <span>
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
                                      : property.rent || "N/A"}
                                {property.rent_duration &&
                                property.rent_duration !== "N/A"
                                  ? ` / ${property.rent_duration}`
                                  : ""}
                              </span>
                            ) : (
                              <span>
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
                                      : property.property_price || "N/A"}
                              </span>
                            )}
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

                          {/* Area */}
                          {property.area_sq && (
                            <div className="flex items-center gap-1">
                              <BiArea className="text-xl my-text" />
                              <p className="m-0 font-semibold">
                                {property.area_sq} sq ft
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Furnished */}
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

                        {/* Owner Info */}
                        <div className="flex items-center justify-between mb-0 p-2">
                          {/* LEFT SIDE - Owner */}
                          <div className="flex flex-col items-center">
                            <div className="p-2 rounded-full bg-slate-100">
                              {property.property_owner_image ? (
                                <img
                                  src={`${process.env.REACT_APP_API_URL}/media/${property.property_owner_image}`}
                                  alt="Owner"
                                  className="object-cover w-10 h-10 rounded-full"
                                />
                              ) : (
                                <AiOutlineUser
                                  className="text-gray-600"
                                  size={30}
                                />
                              )}
                            </div>

                            <span className="text-sm font-semibold mt-1">
                              {property.connect_to_name}
                            </span>

                            <span className="text-xs text-gray-500">
                              {property.user_type}
                            </span>
                          </div>

                          {/* RIGHT SIDE - Buttons */}
                          <div className="flex items-center gap-2">
                            {/* Contact */}
                            <div
                              className="flex items-center justify-center w-24 h-9 text-sm text-white rounded-lg cursor-pointer my-bg"
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
                              className="flex items-center justify-center w-9 h-9 text-white bg-green-500 rounded-lg hover:bg-green-600"
                            >
                              <FaWhatsapp />
                            </a>

                            {/* Call */}
                            <a
                              href={`tel:${property.connect_to_no}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-center w-9 h-9 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                            >
                              <FaPhone />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-black">
                    <p>No properties available at the moment.</p>
                  </div>
                )}
              </div>
              {isContactModalOpen && selectedProperty && (
                <ContactDetails
                  fullName={
                    freeViewCount <= 0 && paidViewCount <= 0
                      ? `****${selectedProperty.connect_to_name?.slice(-1) || "N/A"}`
                      : selectedProperty.connect_to_name || "N/A"
                  }
                  mobile={
                    freeViewCount <= 0 && paidViewCount <= 0
                      ? `*******${selectedProperty.connect_to_no?.slice(-3) || "000"}`
                      : selectedProperty.connect_to_no || "N/A"
                  }
                  showUpgradePrompt={showUpgradePrompt}
                  onClose={() => setIsContactModalOpen(false)}
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                      className={`px-3 py-1 text-sm transition-colors 
                   ${currentPage === i + 1 ? "rounded-full my-border w-8 h-8 flex items-center justify-center font-normal" : "text-gray-700"}
                 `}
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

            {/* Left: Map */}
            <div className="flex sticky top-0 w-full sm:w-3/4 md:w-1/2 lg:w-[560px] h-screen overflow-hidden bg-white rounded-lg">
              {loading ? (
                <p>Loading properties...</p>
              ) : (
                <MapContainer
                  center={
                    properties.length > 0 &&
                    properties[0].latitude != null &&
                    properties[0].longitude != null &&
                    !isNaN(properties[0].latitude) &&
                    !isNaN(properties[0].longitude)
                      ? [properties[0].latitude, properties[0].longitude]
                      : [18.5204, 73.8567] // Fallback: Pune
                  }
                  zoom={12}
                  scrollWheelZoom={false}
                  style={{ width: "100%", height: "100%" }}
                >
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" />

                  {properties
                    .filter(
                      (property) =>
                        property.latitude != null &&
                        property.longitude != null &&
                        !isNaN(property.latitude) &&
                        !isNaN(property.longitude),
                    )
                    .map((property, index) => (
                      <Marker
                        key={property._id}
                        position={[property.latitude, property.longitude]}
                        icon={createCustomIcon(
                          property,
                          property._id === activePropertyId ||
                            property._id === hoveredPropertyId,
                        )}
                        eventHandlers={{
                          mouseover: () => setHoveredPropertyId(property._id),
                          mouseout: () => setHoveredPropertyId(null),
                        }}
                      >
                        <Popup>
                          <div className="w-full sm:w-[300px] relative">
                            {/* Heart Button */}
                            <button
                              className="absolute z-10 top-2 right-2"
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
                                size={18}
                                color={property.is_favorite ? "red" : "white"}
                                fill={property.is_favorite ? "red" : "white"}
                              />
                            </button>

                            {/* Image Slider */}
                            <div className="relative">
                              <img
                                src={
                                  propertyImages[currentIndex]?.image
                                    ? `${process.env.REACT_APP_API_URL}${propertyImages[currentIndex]?.image}`
                                    : property.cover_image
                                }
                                alt={`Property Image ${currentIndex + 1}`}
                                className="w-full h-[200px] object-cover"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePrev();
                                }}
                                className="absolute p-1 transform -translate-y-1/2 bg-white rounded top-1/2 left-1 pe-2"
                              >
                                <b>&#x3008;</b>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNext();
                                }}
                                className="absolute p-1 transform -translate-y-1/2 bg-white rounded top-1/2 right-1 ps-2"
                              >
                                <b>&#x232A;</b>
                              </button>
                            </div>

                            {/* Property Info */}
                            <div className="px-2">
                              <div className="flex items-center justify-between text-lg font-semibold text-black">
                                <div className="flex items-center">
                                  <BiRupee className="mr-1 text-black bg-white" />
                                  <span>{property.property_price}</span>
                                </div>
                                <Link
                                  key={property._id}
                                  to={`/propertydetails/${property._id}`}
                                  className="block no-underline bg-white border-2 rounded-lg hover:no-underline"
                                >
                                  <button className="flex items-center text-white rounded-full btn btn-secondary">
                                    <b>
                                      <AiOutlineInfo />
                                    </b>
                                  </button>
                                </Link>
                              </div>
                              <div className="text-sm text-gray-600">
                                <p className="m-0">
                                  <strong>{property.bhk_type}</strong> |{" "}
                                  {property.city_name} | {property.area_sq} sq
                                  ft
                                </p>
                                <p className="m-0">{property.address}</p>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                </MapContainer>
              )}
            </div>

            {/* Shear Modal */}
            {isShareModalOpen && (
              <div className="absolute right-0 z-50">
                <ShareModal
                  currentShareUrl={currentShareUrl}
                  closeShareModal={handleCloseShareModal}
                  copyLink={() => {
                    const url = currentShareUrl;

                    if (navigator.clipboard && window.isSecureContext) {
                      navigator.clipboard
                        .writeText(url)
                        .then(() => alert("Link copied!"))
                        .catch((err) => {
                          console.error(err);
                          fallbackCopyTextToClipboard(url);
                        });
                    } else {
                      fallbackCopyTextToClipboard(url);
                    }

                    function fallbackCopyTextToClipboard(text) {
                      const textArea = document.createElement("textarea");
                      textArea.value = text;
                      textArea.style.position = "fixed";
                      textArea.style.left = "-9999px";
                      document.body.appendChild(textArea);
                      textArea.focus();
                      textArea.select();

                      try {
                        const successful = document.execCommand("copy");
                        alert(successful ? "Link copied!" : "Copy failed");
                      } catch (err) {
                        console.error("Fallback: Could not copy text: ", err);
                        alert("Copy failed");
                      }

                      document.body.removeChild(textArea);
                    }
                  }}
                />
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
}
