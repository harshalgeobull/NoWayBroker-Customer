import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BiRupee } from "react-icons/bi";
import { AiOutlineInfo } from "react-icons/ai";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { RiArrowDropDownLine, RiRuler2Line } from "react-icons/ri";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext, MdApartment } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineUser, AiOutlineClockCircle } from "react-icons/ai";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BiArea } from "react-icons/bi";
import { FaRupeeSign, FaBath, FaUser, FaWhatsapp, FaPhone } from "react-icons/fa";
import { faChair } from "@fortawesome/free-solid-svg-icons";
import { PiShareNetworkLight } from "react-icons/pi";
import { ShareNetwork } from "@phosphor-icons/react";
import { PiCubeFocus } from "react-icons/pi";
import ShareModal from "../containers/ShareModal";
import Slider from "react-slick";
import { Heart, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import { useCity } from "./SearchContext";
import Login1 from "../auth/Login1";
import SignUp1 from "../auth/SignUp1";
import ContactDetails from "../containers/ContactDetails";
const userLocation = JSON.parse(sessionStorage.getItem("userLocation"));

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
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


const AdvisorDashboard = () => {
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
  const [squareFtDropdownOpen, setSquareFtDropdownOpen] = useState(false);
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const label = queryParams.get("label");
  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bhkType, setBhkType] = useState("");
  const [furnishedStatus, setFurnishedStatus] = useState("");
  const [minSquareFt, setMinSquareFt] = useState("");
  const [maxSquareFt, setMaxSquareFt] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [activePropertyId, setActivePropertyId] = useState(null);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareId, setActiveShareId] = useState(null);
  const accessToken = sessionStorage.getItem("accessToken");
  const [activeIndexes, setActiveIndexes] = useState({});
  const { searchCity, setSearchCity } = useCity();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [propertyImages, setPropertyImages] = useState([]);
  // Modal open states
  const [postedBy, setPostedBy] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const toggleSquareFtDropdown = () => {
    setSquareFtDropdownOpen((prev) => !prev);
  };

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
  const [mode, setMode] = useState("search");
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const propertyTypeButtonRef = useRef(null);
  //Property Portal
  const [propertyTypeDropdownPos, setPropertyTypeDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 260,
  });
  // Budget Portal
  const budgetButtonRef = useRef(null);

  const [budgetDropdownPos, setBudgetDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 260,
  });
  //Construction Portal
  const constructionButtonRef = useRef(null);

  const [constructionDropdownPos, setConstructionDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 260,
  });
  //Amenities Portal
  const amenitiesButtonRef = useRef(null);
  const [amenitiesDropdownPos, setAmenitiesDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 260,
  });
  //Area Portal
  const areaButtonRef = useRef(null);
  const [areaDropdownPos, setAreaDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 260,
  });
  //Sharing Type Portal
  const sharingTypeButtonRef = useRef(null);
  const [sharingTypeDropdownPos, setSharingTypeDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 260,
  });
  //Available Portal
  const availableFromButtonRef = useRef(null);
  const [availableFromDropdownPos, setAvailableFromDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 260,
  });
  //Available for Portal
  const availableForButtonRef = useRef(null);
  const [availableForDropdownPos, setAvailableForDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 260,
  });
  //Capacity Portal
  const capacityButtonRef = useRef(null);
  const [capacityDropdownPos, setCapacityDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 260,
  });
  //Invesment Portal
  const investmentButtonRef = useRef(null);
  const [investmentDropdownPos, setInvestmentDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 260,
  });
  //Plot Land Type
  const plotLandButtonRef = useRef(null);
  const [plotLandDropdownPos, setPlotLandDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  //Office Type
  const officeTypeButtonRef = useRef(null);
  const [officeTypeDropdownPos, setOfficeTypeDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  //Retail Type
  const retailTypeButtonRef = useRef(null);
  const [retailTypeDropdownPos, setRetailTypeDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  //Other Commercial Type
  const otherCommercialButtonRef = useRef(null);
  const [otherCommercialDropdownPos, setOtherCommercialDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

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
    "Corner Shop",
    "Main Road Shop"
  ];

  const purchaseTypeOptions = ["Resale", "New bookings"];

  const priceOptions = [
    500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000,
    4500000, 5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000,
    8500000, 9000000, 9500000,

    10000000, 12500000, 15000000, 17500000, 20000000, 25000000, 30000000,
    40000000, 50000000, 75000000,

    100000000, 150000000, 200000000, 250000000, 300000000, 400000000,
    500000000, 600000000, 700000000, 750000000, 900000000,

    1000000000, 1500000000, 2000000000, 2500000000, 3000000000, 4000000000,
    5000000000, 6000000000, 7000000000, 7500000000, 9000000000,

    10000000000,
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

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const created = new Date(dateString);

    const diffMs = now - created;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    if (hours < 24) {
      return `${hours} hr${hours > 1 ? "s" : ""} ago`;
    }

    if (days < 30) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    }

    const years = Math.floor(months / 12);

    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  const DEFAULT_CENTER = [18.5204, 73.8567];
  // const getMapCenter = () => {
  //   if (
  //     properties.length > 0 &&
  //     properties[0].latitude &&
  //     properties[0].longitude
  //   ) {
  //     return [properties[0].latitude, properties[0].longitude];
  //   }
  //   return DEFAULT_CENTER;
  // };
  const getMapCenter = () => {
    const firstValid = properties.find((property) => {
      const lat = Number(property.latitude);
      const lng = Number(property.longitude);

      return Number.isFinite(lat) && Number.isFinite(lng);
    });

    if (firstValid) {
      return [Number(firstValid.latitude), Number(firstValid.longitude)];
    }

    return DEFAULT_CENTER;
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
      loadProperties();
    } catch (error) {
      loadProperties();
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
        loadProperties();
      } else {
        loadProperties();
        console.error("Failed to remove:", response.data.message);
      }
    } catch (error) {
      console.error("Error unfavoriting:", error);
    }
  };

  const togglePriceDropdown = () => {
    setPriceDropdownOpen((prev) => !prev);
  };

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
      setPropertyType2([type]);
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
    if (label) {
      setPostedBy(label);
    }
  }, [label]);

  useEffect(() => {
    fetchAmenities();
  }, []);

  useEffect(() => {
    setError(null);
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
        right: 10px;
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
      
      .marker-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .price-tooltip {
  background: white;
  color: black;
  padding: 8px 12px;
  border-radius: 18px;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  position: relative;
  text-align: center;
  white-space: nowrap;
  z-index: 10;
}


      .price-tooltip:hover {
        background-color: gray;
        color: white;
      }

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
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("page", currentPage);
      formData.append("page_size", itemsPerPage);


      const categoryValues = ["Buy", "Rent", "Commercial Buy", "Commercial Lease", "PG/Co-living"];

      if (categoryValues.includes(label)) {
        formData.append("property_category_type", label);
      } else if (postedBy || label) {
        formData.append("user_type", postedBy || label);
      }

      const cityFromSession = sessionStorage.getItem("cityName");

      const cityToUse =
        searchCity && searchCity.trim() !== ""
          ? searchCity.trim()
          : cityFromSession || "";

      if (cityToUse) {
        formData.append("city_name", cityToUse);
      }

      if (filtersApplied) {
        if (search) {
          formData.append("search_keyword", search);
        }

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
        }
        else if (propertyType === "Commercial Buy") {
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
        }
        else {
          if (propertyType2.length > 0) {
            formData.append("property_type", propertyType2.join(","));
          }
        }

        if (bhkType) {
          formData.append("bhk_type", bhkType);
        }

        if (furnishedStatus) {
          formData.append("furnished_type", furnishedStatus);
        }

        if (minPrice) {
          formData.append("min_price", minPrice);
        }

        if (maxPrice) {
          formData.append("max_price", maxPrice);
        }

        if (minSquareFt) {
          formData.append("min_area", minSquareFt);
        }

        if (maxSquareFt) {
          formData.append("max_area", maxSquareFt);
        }

        if ((minSquareFt || maxSquareFt) && areaIn) {
          formData.append("area_in", areaIn);
        }

        if (constructionStatus.length > 0) {
          formData.append("construction_status", constructionStatus.join(","));
        }

        if (selectedAmenities.length > 0) {
          formData.append("amenities", selectedAmenities.join(","));
        }

        if (bathrooms) {
          formData.append("number_of_minimum_bathrooms", bathrooms);
        }

        if (facing) {
          formData.append("facing", facing);
        }

        if (withPhoto) {
          formData.append("with_photo", withPhoto);
        }

        if (withVideos) {
          formData.append("with_videos", withVideos);
        }

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
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/filter_property`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200 && response.data.status === 1) {
        setProperties(response.data.data || []);
        setTotalPages(response.data.total_pages || 1);
        setError(null);
      }
      else {
        setProperties([]);
        setTotalPages(1);
        setError("No properties available");
      }
    } catch (error) {
      console.error("Load Properties Error:", error);

      setProperties([]);
      setTotalPages(1);
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [label, currentPage, searchCity, filtersApplied]);

  const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") return "";

  price = Number(price);

  const formatNumber = (num) => {
    return num % 1 === 0
      ? num.toFixed(0)
      : num.toFixed(2).replace(/\.?0+$/, "");
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

  const createCustomIcon = (property, isActive = false) => {
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

  const handleButtonClick = async () => {
    if (filtersApplied) {
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

      setPriceDropdownOpen(false);
      setSquareFtDropdownOpen(false);
      setAmenitiesOpen(false);

      setFiltersApplied(false);
      setMode("search");
      setCurrentPage(1);

      loadProperties();
    } else {
      setFiltersApplied(true);
      setMode("filter");
      setCurrentPage(1);

      loadProperties();
      setAreaIn("sq.ft");
    }
  };

  const toggleFavorite = async (propertyId) => {
    const userId = sessionStorage.getItem("accessToken");
    if (!userId) {
      alert("Please log in to save properties to your favorites.");
      return;
    }

    const data = { user_id: userId, property_id: propertyId };

    try {
      if (!isFavorited) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/add_to_favorite`,
          data,
        );
        setIsFavorited(true);
        alert("Property has been saved to your favorites!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/remove_from_favorite`,
          data,
        );
        setIsFavorited(false);
        alert("Property has been removed from your favorites!");
      }
    } catch (error) {
      alert("Failed to update the property. Please try again.");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const openShareModal1 = (url, propertyId) => {
    setCurrentShareUrl(url);
    setActiveShareId(propertyId);
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setActiveShareId(null);
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

      formData.append("user_id", accessToken);
      formData.append("property_id", propertyIds.join("|"));
      formData.append("property_name", propertyNames.join("|"));
      formData.append("property_category_type", propertyCategories.join("|"));
      formData.append("building_type", buildingTypes.join("|"));

      const cityFromSession = sessionStorage.getItem("cityName");

      formData.append("city_name", searchCity || cityFromSession || "");
      formData.append("search_keyword", search || "");

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

      if (bhkType) formData.append("bhk_type", bhkType);
      if (furnishedStatus) formData.append("furnished_type", furnishedStatus);
      if (minPrice) formData.append("min_price", minPrice);
      if (maxPrice) formData.append("max_price", maxPrice);
      if (minSquareFt) formData.append("min_area", minSquareFt);
      if (maxSquareFt) formData.append("max_area", maxSquareFt);
      if (areaIn) formData.append("area_in", areaIn);
      if (postedBy) formData.append("user_type", postedBy);

      if (constructionStatus.length > 0) {
        formData.append("construction_status", constructionStatus.join(","));
      }

      if (selectedAmenities.length > 0) {
        formData.append("amenities", selectedAmenities.join(","));
      }

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
      if (type === "Office Space") {
        property_type.push("Office");
        office_type.push(...officeType);
      }
      else if (type === "Retail Shops/Showrooms") {
        property_type.push("Retail");
        sub_sub_property_type.push(...retailType);
      }
      else if (type === "Other Commercial spaces") {
        otherCommercialType.forEach((item) => {
          if (item === "Others") {
            sub_sub_property_type.push("Others");
          } else {
            office_type.push(item);
          }
        });
      }
      else if (type === "Plot/Land") {
        property_type.push("Plot/Land");

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

  const getPaginationRange = () => {
    const range = [];
    const groupSize = 3;

    const groupStart =
      Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
    const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);

    for (let i = groupStart; i <= groupEnd; i++) {
      range.push(i);
    }

    if (groupEnd < totalPages) {
      range.push("...");
      range.push(totalPages);
    }

    return range;
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

    if (freeViewCount > 0) {
      await handleAddCount(freeViewCount);

      setShowUpgradePrompt(false);
      setIsContactModalOpen(true);
      return;
    }

    if (paidViewCount > 0) {
      await handleAddCount(paidViewCount);

      setShowUpgradePrompt(false);
      setIsContactModalOpen(true);
      return;
    }

    setShowUpgradePrompt(true);
    setIsContactModalOpen(true);
  };

  const closeAllDropdowns = () => {
    setPropertyTypeOpen(false);
    setAmenitiesOpen(false);
    setConstructionOpen(false);
    setAvailableForOpen(false);
    setAvailableFromOpen(false);
    setCapacityOpen(false);
    setInvestmentOpen(false);
    setSharingTypeOpen(false);
    setPriceDropdownOpen(false);
    setSquareFtDropdownOpen(false);
    setPlotLandOpen(false);
    setOfficeTypeOpen(false);
    setRetailTypeOpen(false);
    setOtherCommercialOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      closeAllDropdowns();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const FILTER_WIDTH = "w-[220px]";
  const DROPDOWN_WIDTH = 320;

  return (
    <>
      <div className="flex flex-col p-1 space-y-4 sm:p-6 bg-rose-50 rounded-xl">
        <div className="relative">
          <div
            className="flex gap-2 overflow-x-auto pb-2 whitespace-nowrap"
            onScroll={closeAllDropdowns}
          >
            {/* Property Category Dropdown */}
            <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
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

                  if (val === "Commercial Buy" || val === "Commercial Lease") {
                    setBuildingType("Commercial");
                  } else {
                    setBuildingType("");
                  }
                }}
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md appearance-none"
              >
                <option value="">Property Category</option>
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
                <option value="Commercial Buy">Commercial Buy</option>
                <option value="Commercial Lease">Commercial Lease</option>
                <option value="PG/Co-living">PG/Co-living</option>
              </select>
              <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>

            {/* Building Type Dropdown */}
            <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                disabled={
                  propertyType === "Commercial Buy" ||
                  propertyType === "Commercial Lease"
                }
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300 appearance-none"
              >
                <option value="">Building Type</option>
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
              </select>
              <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>

            {/*Property Type*/}
            <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
              <button
                ref={propertyTypeButtonRef}
                type="button"
                onClick={() => {
                  const rect =
                    propertyTypeButtonRef.current.getBoundingClientRect();

                  setPropertyTypeDropdownPos({
                    top: rect.bottom + 4,
                    left: rect.left,
                    width: rect.width,
                  });
                  const wasOpen = propertyTypeOpen;
                  closeAllDropdowns();
                  setTimeout(() => {
                    setPropertyTypeOpen(!wasOpen);
                  }, 0);
                }}
                className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
              >
                <span className="block pr-8 truncate text-left">
                  {propertyType2.length > 0
                    ? propertyType2.join(", ")
                    : "Property Type"}
                </span>

                <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
              </button>

              {propertyTypeOpen &&
                createPortal(
                  <div
                    className="fixed z-[99999] bg-white border rounded-md shadow-lg max-h-72 overflow-y-auto"
                    style={{
                      top: propertyTypeDropdownPos.top,
                      left: propertyTypeDropdownPos.left,
                      width: DROPDOWN_WIDTH,
                    }}
                  >
                    <div className="sticky top-0 flex justify-end p-2 bg-white border-b">
                      <button
                        onClick={() => setPropertyTypeOpen(false)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
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
                  </div>,
                  document.body,
                )}
            </div>

            {/* Budget Dropdown */}
            <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
              <button
                ref={budgetButtonRef}
                onClick={() => {
                  const rect = budgetButtonRef.current.getBoundingClientRect();
                  setBudgetDropdownPos({
                    top: rect.bottom + 4,
                    left: rect.left,
                    width: rect.width,
                  });
                  const wasOpen = priceDropdownOpen;
                  closeAllDropdowns();
                  setTimeout(() => {
                    setPriceDropdownOpen(!wasOpen);
                  }, 0);
                }}
                className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
              >
                <span className="block pr-8 truncate">
                  {minPrice && maxPrice
                    ? `${formatPriceMinMax(minPrice)} - ${formatPriceMinMax(maxPrice)}`
                    : minPrice
                      ? `Above ${formatPriceMinMax(minPrice)}`
                      : maxPrice
                        ? `Below ${formatPriceMinMax(maxPrice)}`
                        : "Budget"}
                </span>

                <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
              </button>

              {priceDropdownOpen &&
                createPortal(
                  <div
                    className="fixed p-4 bg-white border-2 border-gray-300 rounded-md shadow-lg z-[99999]"
                    style={{
                      top: budgetDropdownPos.top,
                      left: budgetDropdownPos.left,
                      width: DROPDOWN_WIDTH,
                    }}
                  >
                    <div className="flex justify-end mb-2">
                      <button
                        onClick={() => setPriceDropdownOpen(false)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-gray-600">Min Price</label>
                      <select
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="p-2 border-2 border-gray-300 rounded-md focus:outline-none"
                      >
                        <option value="">Min</option>
                        {priceOptions
                          .filter((price) => !maxPrice || price < maxPrice)
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
                          .filter((price) => !minPrice || price > minPrice)
                          .map((price) => (
                            <option key={price} value={price}>
                              {formatPriceMinMax(price)}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>,
                  document.body,
                )}
            </div>

            {/* Furnished Status Dropdown */}
            <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
              <select
                value={furnishedStatus}
                onChange={(e) => setFurnishedStatus(e.target.value)}
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300 appearance-none"
              >
                <option value="">Select Furnished</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
              <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>

            {/* BHK Type Dropdown */}
            <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
              <select
                value={bhkType}
                onChange={(e) => setBhkType(e.target.value)}
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300 appearance-none"
              >
                <option value="">Select BHK</option>
                <option value="Studio">Studio/Single Room</option>
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
              <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>

            {/* Posted By Dropdown */}
            <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
              <select
                value={postedBy}
                onChange={(e) => setPostedBy(e.target.value)}
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300 appearance-none"
              >
                <option value="">Posted By</option>
                <option value="Owner">Owner</option>
                <option value="Builder">Builder</option>
              </select>
              <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>

            {/* Construction Status */}
            <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
              <button
                ref={constructionButtonRef}
                type="button"
                onClick={() => {
                  const rect =
                    constructionButtonRef.current.getBoundingClientRect();
                  setConstructionDropdownPos({
                    top: rect.bottom + 4,
                    left: rect.left,
                    width: rect.width,
                  });
                  const wasOpen = constructionOpen;
                  closeAllDropdowns();
                  setTimeout(() => {
                    setConstructionOpen(!wasOpen);
                  }, 0);
                }}
                className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
              >
                <span className="block pr-8 truncate text-left">
                  {constructionStatus.length > 0
                    ? constructionStatus.join(", ")
                    : "Construction Status"}
                </span>

                <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
              </button>

              {constructionOpen &&
                createPortal(
                  <div
                    className="fixed z-[99999] bg-white border rounded-md shadow-lg"
                    style={{
                      top: constructionDropdownPos.top,
                      left: constructionDropdownPos.left,
                      width: DROPDOWN_WIDTH,
                    }}
                  >
                    <div className="sticky top-0 flex justify-end p-2 bg-white border-b">
                      <button
                        onClick={() => setConstructionOpen(false)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
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
                  </div>,
                  document.body,
                )}
            </div>

            {/*Amenities */}
            <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
              <button
                ref={amenitiesButtonRef}
                type="button"
                onClick={() => {
                  const rect =
                    amenitiesButtonRef.current.getBoundingClientRect();

                  setAmenitiesDropdownPos({
                    top: rect.bottom + 4,
                    left: rect.left,
                    width: rect.width,
                  });
                  const wasOpen = amenitiesOpen;
                  closeAllDropdowns();
                  setTimeout(() => {
                    setAmenitiesOpen(!wasOpen);
                  }, 0);
                }}
                className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
              >
                <span className="block pr-8 truncate text-left">
                  {selectedAmenities.length > 0
                    ? amenitiesList
                      .filter((item) =>
                        selectedAmenities.includes(String(item._id)),
                      )
                      .map((item) => item.amenity_name)
                      .join(", ")
                    : "Amenities"}
                </span>

                <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
              </button>

              {amenitiesOpen &&
                createPortal(
                  <div
                    className="fixed z-[99999] bg-white border rounded-md shadow-lg max-h-72 overflow-y-auto"
                    style={{
                      top: amenitiesDropdownPos.top,
                      left: amenitiesDropdownPos.left,
                      width: DROPDOWN_WIDTH,
                    }}
                  >
                    <div className="sticky top-0 flex justify-end p-2 bg-white border-b">
                      <button
                        onClick={() => setAmenitiesOpen(false)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
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
                  </div>,
                  document.body,
                )}
            </div>

            {/*Bathroom*/}
            <div className={`${FILTER_WIDTH} flex-shrink-0`}>
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

            {/* Facing */}
            {shouldShowFacingFilter() && (
              <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
                <select
                  value={facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300 appearance-none"
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

                <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
              </div>
            )}

            {/*Set Photos*/}
            <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
              <select
                value={withPhoto}
                onChange={(e) => setWithPhoto(e.target.value)}
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300 appearance-none"
              >
                <option value="">With Photo</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>

            {/*Set Video*/}
            <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
              <select
                value={withVideos}
                onChange={(e) => setWithVideos(e.target.value)}
                className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300 appearance-none"
              >
                <option value="">With Video</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>

            {/* Sq. Ft Range Dropdown */}
            <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
              <button
                ref={areaButtonRef}
                onClick={() => {
                  const rect = areaButtonRef.current.getBoundingClientRect();
                  let left = rect.left;
                  const overflow =
                    rect.left + DROPDOWN_WIDTH - window.innerWidth;
                  if (overflow > 0) {
                    left = rect.left - overflow - 10;
                  }
                  setAreaDropdownPos({
                    top: rect.bottom + 4,
                    left,
                    width: rect.width,
                  });

                  const wasOpen = squareFtDropdownOpen;
                  closeAllDropdowns();
                  setTimeout(() => {
                    setSquareFtDropdownOpen(!wasOpen);
                  }, 0);
                }}
                className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
              >
                <span className="block pr-8 truncate text-left">
                  {minSquareFt || maxSquareFt
                    ? `${minSquareFt || 0} - ${maxSquareFt || "Any"} ${areaIn}`
                    : "Area"}
                </span>

                <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
              </button>

              {squareFtDropdownOpen &&
                createPortal(
                  <div
                    className="fixed p-4 bg-white border-2 border-gray-300 rounded-md shadow-lg z-[99999]"
                    style={{
                      top: areaDropdownPos.top,
                      left: areaDropdownPos.left,
                      width: DROPDOWN_WIDTH,
                    }}
                  >
                    <div className="flex justify-end mb-2">
                      <button
                        onClick={() => setSquareFtDropdownOpen(false)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
                    <label className="text-sm text-gray-600">Area Unit</label>
                    <select
                      value={areaIn}
                      onChange={(e) => setAreaIn(e.target.value)}
                      className="w-full p-2 mb-3 border-2 border-gray-300 rounded-md focus:outline-none"
                    >
                      {areaUnits.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>

                    <label className="text-sm text-gray-600">Min Area</label>
                    <input
                      type="number"
                      value={minSquareFt}
                      onChange={(e) => setMinSquareFt(e.target.value)}
                      className="w-full p-2 mb-3 border-2 border-gray-300 rounded-md focus:outline-none"
                      placeholder="Min"
                    />

                    <label className="text-sm text-gray-600">Max Area</label>
                    <input
                      type="number"
                      value={maxSquareFt}
                      onChange={(e) => setMaxSquareFt(e.target.value)}
                      className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none"
                      placeholder="Max"
                    />
                  </div>,
                  document.body,
                )}
            </div>

            {/*Sharing Type */}
            {propertyType === "PG/Co-living" && (
              <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
                <button
                  ref={sharingTypeButtonRef}
                  type="button"
                  onClick={() => {
                    const rect =
                      sharingTypeButtonRef.current.getBoundingClientRect();
                    let left = rect.left;
                    const overflow =
                      rect.left + DROPDOWN_WIDTH - window.innerWidth;

                    if (overflow > 0) {
                      left = rect.left - overflow - 10;
                    }
                    setSharingTypeDropdownPos({
                      top: rect.bottom + 4,
                      left,
                      width: rect.width,
                    });
                    const wasOpen = sharingTypeOpen;
                    closeAllDropdowns();
                    setTimeout(() => {
                      setSharingTypeOpen(!wasOpen);
                    }, 0);
                  }}
                  className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
                >
                  <span className="block pr-8 truncate text-left">
                    {sharingType.length > 0
                      ? sharingType.join(", ")
                      : "Sharing Type"}
                  </span>

                  <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </button>

                {sharingTypeOpen &&
                  createPortal(
                    <div
                      className="fixed z-[99999] bg-white border rounded-md shadow-lg"
                      style={{
                        top: sharingTypeDropdownPos.top,
                        left: sharingTypeDropdownPos.left,
                        width: DROPDOWN_WIDTH,
                      }}
                    >
                      <div className="sticky top-0 flex justify-end p-2 bg-white border-b">
                        <button
                          onClick={() => setSharingTypeOpen(false)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <IoClose size={20} />
                        </button>
                      </div>
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
                    </div>,
                    document.body,
                  )}
              </div>
            )}

            {/*Available Form*/}
            {propertyType === "Rent" && (
              <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
                <button
                  ref={availableFromButtonRef}
                  type="button"
                  onClick={() => {
                    const rect =
                      availableFromButtonRef.current.getBoundingClientRect();
                    let left = rect.left;
                    const overflow =
                      rect.left + DROPDOWN_WIDTH - window.innerWidth;
                    if (overflow > 0) {
                      left = rect.left - overflow - 10;
                    }
                    setAvailableFromDropdownPos({
                      top: rect.bottom + 4,
                      left,
                      width: rect.width,
                    });
                    const wasOpen = availableFromOpen;
                    closeAllDropdowns();
                    setTimeout(() => {
                      setAvailableFromOpen(!wasOpen);
                    }, 0);
                  }}
                  className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
                >
                  <span className="block pr-8 truncate text-left">
                    {availableFrom.length > 0
                      ? availableFrom.join(", ")
                      : "Available From"}
                  </span>

                  <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </button>

                {availableFromOpen &&
                  createPortal(
                    <div
                      className="fixed z-[99999] bg-white border rounded-md shadow-lg"
                      style={{
                        top: availableFromDropdownPos.top,
                        left: availableFromDropdownPos.left,
                        width: DROPDOWN_WIDTH,
                      }}
                    >
                      <div className="sticky top-0 flex justify-end p-2 bg-white border-b">
                        <button
                          onClick={() => setAvailableFromOpen(false)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <IoClose size={20} />
                        </button>
                      </div>
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
                    </div>,
                    document.body,
                  )}
              </div>
            )}

            {/*Available For*/}
            {(propertyType === "Rent" || propertyType === "PG/Co-living") && (
              <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
                <button
                  ref={availableForButtonRef}
                  type="button"
                  onClick={() => {
                    const rect =
                      availableForButtonRef.current.getBoundingClientRect();

                    let left = rect.left;
                    const overflow =
                      rect.left + DROPDOWN_WIDTH - window.innerWidth;
                    if (overflow > 0) {
                      left = rect.left - overflow - 10;
                    }
                    setAvailableForDropdownPos({
                      top: rect.bottom + 4,
                      left,
                      width: rect.width,
                    });

                    const wasOpen = availableForOpen;
                    closeAllDropdowns();
                    setTimeout(() => {
                      setAvailableForOpen(!wasOpen);
                    }, 0);
                  }}
                  className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
                >
                  <span className="block pr-8 truncate text-left">
                    {availableFor.length > 0
                      ? availableFor.join(", ")
                      : "Available For"}
                  </span>

                  <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </button>

                {availableForOpen &&
                  createPortal(
                    <div
                      className="fixed z-[99999] bg-white border rounded-md shadow-lg max-h-72 overflow-y-auto"
                      style={{
                        top: availableForDropdownPos.top,
                        left: availableForDropdownPos.left,
                        width: DROPDOWN_WIDTH,
                      }}
                    >
                      <div className="sticky top-0 flex justify-end p-2 bg-white border-b">
                        <button
                          onClick={() => setAvailableForOpen(false)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <IoClose size={20} />
                        </button>
                      </div>
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
                    </div>,
                    document.body,
                  )}
              </div>
            )}

            {/*Set Capacity */}
            {propertyType === "PG/Co-living" && (
              <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
                <button
                  ref={capacityButtonRef}
                  type="button"
                  onClick={() => {
                    const rect =
                      capacityButtonRef.current.getBoundingClientRect();

                    let left = rect.left;
                    const overflow =
                      rect.left + DROPDOWN_WIDTH - window.innerWidth;
                    if (overflow > 0) {
                      left = rect.left - overflow - 10;
                    }
                    setCapacityDropdownPos({
                      top: rect.bottom + 4,
                      left,
                      width: DROPDOWN_WIDTH,
                    });
                    const wasOpen = capacityOpen;
                    closeAllDropdowns();

                    setTimeout(() => {
                      setCapacityOpen(!wasOpen);
                    }, 0);
                  }}
                  className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
                >
                  <span className="block pr-8 truncate text-left">
                    {capacity.length > 0
                      ? capacity.join(", ")
                      : "Total Capacity"}
                  </span>

                  <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </button>

                {capacityOpen &&
                  createPortal(
                    <div
                      className="fixed z-[99999] bg-white border rounded-md shadow-lg"
                      style={{
                        top: capacityDropdownPos.top,
                        left: capacityDropdownPos.left,
                        width: capacityDropdownPos.width,
                      }}
                    >
                      <div className="sticky top-0 flex justify-end p-2 bg-white border-b">
                        <button
                          onClick={() => setCapacityOpen(false)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <IoClose size={20} />
                        </button>
                      </div>

                      {[
                        "1-2 guest",
                        "2-4 guest",
                        "4-10 guest",
                        "10+ guest",
                      ].map((option) => (
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
                      ))}

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
                    </div>,
                    document.body,
                  )}
              </div>
            )}

            {/*Investment Option */}
            {propertyType === "Commercial Buy" && (
              <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
                <button
                  ref={investmentButtonRef}
                  type="button"
                  onClick={() => {
                    const rect =
                      investmentButtonRef.current.getBoundingClientRect();

                    let left = rect.left;
                    const overflow =
                      rect.left + DROPDOWN_WIDTH - window.innerWidth;
                    if (overflow > 0) {
                      left = rect.left - overflow - 10;
                    }
                    setInvestmentDropdownPos({
                      top: rect.bottom + 4,
                      left,
                      width: rect.width,
                    });
                    const wasOpen = investmentOpen;
                    closeAllDropdowns();
                    setTimeout(() => {
                      setInvestmentOpen(!wasOpen);
                    }, 0);
                  }}
                  className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
                >
                  <span className="block pr-8 truncate text-left">
                    {investmentOptions.length > 0
                      ? investmentOptions.join(", ")
                      : "Investment Options"}
                  </span>
                  <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </button>

                {investmentOpen &&
                  createPortal(
                    <div
                      className="fixed z-[99999] bg-white border rounded-md shadow-lg"
                      style={{
                        top: investmentDropdownPos.top,
                        left: investmentDropdownPos.left,
                        width: DROPDOWN_WIDTH,
                      }}
                    >
                      <div className="sticky top-0 flex justify-end p-2 bg-white border-b">
                        <button
                          onClick={() => setInvestmentOpen(false)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <IoClose size={20} />
                        </button>
                      </div>
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
                    </div>,
                    document.body,
                  )}
              </div>
            )}

            {/*Resale*/}
            {propertyType === "Commercial Buy" && (
              <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
                <select
                  value={purchaseType}
                  onChange={(e) => setPurchaseType(e.target.value)}
                  className="w-full h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300 appearance-none"
                >
                  <option value="">Purchase Type</option>
                  {purchaseTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
              </div>
            )}

            {/* Plot/Land */}
            {(propertyType === "Commercial Buy" ||
              propertyType === "Commercial Lease") &&
              buildingType === "Commercial" &&
              propertyType2.includes("Plot/Land") && (
                <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
                  <button
                    ref={plotLandButtonRef}
                    type="button"
                    onClick={() => {
                      const rect =
                        plotLandButtonRef.current.getBoundingClientRect();

                      let left = rect.left;
                      const overflow =
                        rect.left + DROPDOWN_WIDTH - window.innerWidth;

                      if (overflow > 0) {
                        left = rect.left - overflow - 10;
                      }

                      setPlotLandDropdownPos({
                        top: rect.bottom + 4,
                        left,
                        width: DROPDOWN_WIDTH,
                      });

                      const wasOpen = plotLandOpen;
                      closeAllDropdowns();

                      setTimeout(() => {
                        setPlotLandOpen(!wasOpen);
                      }, 0);
                    }}
                    className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
                  >
                    <span className="block pr-8 truncate text-left">
                      {plotLandTypes.length > 0
                        ? plotLandTypes.join(", ")
                        : "Plot/Land Type"}
                    </span>

                    <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                  </button>

                  {plotLandOpen &&
                    createPortal(
                      <div
                        className="fixed z-[99999] bg-white border rounded-md shadow-lg"
                        style={{
                          top: plotLandDropdownPos.top,
                          left: plotLandDropdownPos.left,
                          width: plotLandDropdownPos.width,
                        }}
                      >
                        <div className="sticky top-0 flex justify-end p-2 bg-white border-b">
                          <button
                            onClick={() => setPlotLandOpen(false)}
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <IoClose size={20} />
                          </button>
                        </div>

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
                      </div>,
                      document.body,
                    )}
                </div>
              )}

            {/* Office Type */}
            {propertyType === "Commercial Lease" &&
              buildingType === "Commercial" &&
              propertyType2.includes("Office Space") && (
                <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
                  <button
                    ref={officeTypeButtonRef}
                    type="button"
                    onClick={() => {
                      const rect =
                        officeTypeButtonRef.current.getBoundingClientRect();

                      let left = rect.left;
                      const overflow =
                        rect.left + DROPDOWN_WIDTH - window.innerWidth;

                      if (overflow > 0) {
                        left = rect.left - overflow - 10;
                      }

                      setOfficeTypeDropdownPos({
                        top: rect.bottom + 4,
                        left,
                        width: DROPDOWN_WIDTH,
                      });

                      const wasOpen = officeTypeOpen;
                      closeAllDropdowns();

                      setTimeout(() => {
                        setOfficeTypeOpen(!wasOpen);
                      }, 0);
                    }}
                    className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
                  >
                    <span className="block pr-8 truncate text-left">
                      {officeType.length > 0
                        ? officeType.join(", ")
                        : "Office Type"}
                    </span>

                    <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                  </button>

                  {officeTypeOpen &&
                    createPortal(
                      <div
                        className="fixed z-[99999] bg-white border rounded-md shadow-lg"
                        style={{
                          top: officeTypeDropdownPos.top,
                          left: officeTypeDropdownPos.left,
                          width: officeTypeDropdownPos.width,
                        }}
                      >
                        <div className="sticky top-0 flex justify-end p-2 bg-white border-b">
                          <button
                            onClick={() => setOfficeTypeOpen(false)}
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <IoClose size={20} />
                          </button>
                        </div>

                        {officeTypeOptions.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
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

                        <div className="sticky bottom-0 flex gap-2 p-2 bg-white border-t">
                          <button
                            onClick={() => setOfficeType([])}
                            className="w-1/2 py-2 border rounded-md"
                          >
                            Clear
                          </button>

                          <button
                            onClick={() => setOfficeTypeOpen(false)}
                            className="w-1/2 py-2 text-white bg-rose-500 rounded-md"
                          >
                            Done
                          </button>
                        </div>
                      </div>,
                      document.body,
                    )}
                </div>
              )}

            {/* Retail Type */}
            {propertyType === "Commercial Lease" &&
              buildingType === "Commercial" &&
              propertyType2.includes("Retail Shops/Showrooms") && (
                <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
                  <button
                    ref={retailTypeButtonRef}
                    type="button"
                    onClick={() => {
                      const rect =
                        retailTypeButtonRef.current.getBoundingClientRect();

                      let left = rect.left;
                      const overflow =
                        rect.left + DROPDOWN_WIDTH - window.innerWidth;

                      if (overflow > 0) {
                        left = rect.left - overflow - 10;
                      }

                      setRetailTypeDropdownPos({
                        top: rect.bottom + 4,
                        left,
                        width: DROPDOWN_WIDTH,
                      });

                      const wasOpen = retailTypeOpen;
                      closeAllDropdowns();

                      setTimeout(() => {
                        setRetailTypeOpen(!wasOpen);
                      }, 0);
                    }}
                    className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
                  >
                    <span className="block pr-8 truncate text-left">
                      {retailType.length > 0
                        ? retailType.join(", ")
                        : "Retail Type"}
                    </span>

                    <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                  </button>

                  {retailTypeOpen &&
                    createPortal(
                      <div
                        className="fixed z-[99999] bg-white border rounded-md shadow-lg"
                        style={{
                          top: retailTypeDropdownPos.top,
                          left: retailTypeDropdownPos.left,
                          width: retailTypeDropdownPos.width,
                        }}
                      >
                        <div className="sticky top-0 flex justify-end p-2 bg-white border-b">
                          <button
                            onClick={() => setRetailTypeOpen(false)}
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <IoClose size={20} />
                          </button>
                        </div>

                        {retailTypeOptions.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
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

                        <div className="sticky bottom-0 flex gap-2 p-2 bg-white border-t">
                          <button
                            onClick={() => setRetailType([])}
                            className="w-1/2 py-2 border rounded-md"
                          >
                            Clear
                          </button>

                          <button
                            onClick={() => setRetailTypeOpen(false)}
                            className="w-1/2 py-2 text-white bg-rose-500 rounded-md"
                          >
                            Done
                          </button>
                        </div>
                      </div>,
                      document.body,
                    )}
                </div>
              )}

            {/* Other Commercial Type */}
            {propertyType === "Commercial Lease" &&
              buildingType === "Commercial" &&
              propertyType2.includes("Other Commercial spaces") && (
                <div className={`relative ${FILTER_WIDTH} flex-shrink-0`}>
                  <button
                    ref={otherCommercialButtonRef}
                    type="button"
                    onClick={() => {
                      const rect =
                        otherCommercialButtonRef.current.getBoundingClientRect();

                      let left = rect.left;
                      const overflow =
                        rect.left + DROPDOWN_WIDTH - window.innerWidth;

                      if (overflow > 0) {
                        left = rect.left - overflow - 10;
                      }

                      setOtherCommercialDropdownPos({
                        top: rect.bottom + 4,
                        left,
                        width: DROPDOWN_WIDTH,
                      });

                      const wasOpen = otherCommercialOpen;
                      closeAllDropdowns();

                      setTimeout(() => {
                        setOtherCommercialOpen(!wasOpen);
                      }, 0);
                    }}
                    className="relative flex items-center w-full h-16 p-2 bg-white border-2 border-gray-300 rounded-md text-left"
                  >
                    <span className="block pr-8 truncate text-left">
                      {otherCommercialType.length > 0
                        ? otherCommercialType.join(", ")
                        : "Other Commercial Type"}
                    </span>

                    <RiArrowDropDownLine className="absolute text-2xl -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                  </button>

                  {otherCommercialOpen &&
                    createPortal(
                      <div
                        className="fixed z-[99999] bg-white border rounded-md shadow-lg"
                        style={{
                          top: otherCommercialDropdownPos.top,
                          left: otherCommercialDropdownPos.left,
                          width: otherCommercialDropdownPos.width,
                        }}
                      >
                        <div className="sticky top-0 flex justify-end p-2 bg-white border-b">
                          <button
                            onClick={() => setOtherCommercialOpen(false)}
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <IoClose size={20} />
                          </button>
                        </div>

                        {otherCommercialOptions.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
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

                        <div className="sticky bottom-0 flex gap-2 p-2 bg-white border-t">
                          <button
                            onClick={() => setOtherCommercialType([])}
                            className="w-1/2 py-2 border rounded-md"
                          >
                            Clear
                          </button>

                          <button
                            onClick={() => setOtherCommercialOpen(false)}
                            className="w-1/2 py-2 text-white bg-rose-500 rounded-md"
                          >
                            Done
                          </button>
                        </div>
                      </div>,
                      document.body,
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
                  properties.map((property) => {
                    let distance = null;
                    if (userLocation && property.latitude && property.longitude) {
                      distance = calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        parseFloat(property.latitude),
                        parseFloat(property.longitude),
                      ).toFixed(1);
                    }

                    const subtitle = (() => {
                      const area = property.address_area || "";
                      const city = property.city_name || "";

                      const location =
                        area.toLowerCase().includes(city.toLowerCase())
                          ? area
                          : `${area}, ${city}`;

                      const type =
                        property.property_type === "Office"
                          ? "Office Space"
                          : property.property_type === "Retail"
                            ? "Retail Space"
                            : property.property_type || "";

                      const category = property.property_category_type || "";

                      if (
                        category === "Commercial Buy" ||
                        category === "Commercial Lease"
                      ) {
                        return `${type} for ${category === "Commercial Buy" ? "Sale" : "Lease"
                          } in ${location}`;
                      }

                      if (
                        category.includes("PG") ||
                        category.includes("Co-Living") ||
                        category.includes("Coliving")
                      ) {
                        return `${type} for Rent in ${location}`;
                      }

                      const action = category === "Buy" ? "Sale" : category;

                      return `${property.bhk_type} ${type} for ${action} in ${location}`;
                    })();

                    return (
                      <div
                        key={property._id}
                        className={`shadow-md rounded-2xl overflow-hidden block no-underline hover:no-underline ${hoveredPropertyId === property._id ? "bg-green-200" : ""
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

                          {/* Virtual Tour & Favorite Button */}
                          <div className="absolute flex items-center space-x-2 top-2 right-2">
                            {property.virtual_tour_availability === "Yes" && (
                              <span className="flex items-center gap-1 px-2 py-1 text-xs font-normal text-white rounded-full bg-gray-800/60 backdrop-blur-sm">
                                <PiCubeFocus className="text-sm text-white" />
                                Virtual Tour
                              </span>
                            )}
                            <button
                              className="bg-gray-800/60 backdrop-blur-sm p-1.5 rounded-full shadow"
                              onClick={(e) => {
                                if (!accessToken) {
                                  setIsLoginModalOpen(true);
                                  return;
                                }
                                e.preventDefault();
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

                        {/* Property Details — BuyProperty.js card design */}
                        <div className="flex flex-col flex-1 p-3 text-black bg-white">
                          <div className="flex items-start justify-between gap-3 mb-0">
                            <h3
                              className="flex-1 m-0 text-lg font-semibold leading-6 text-gray-900 truncate"
                              title={property.property_name}
                            >
                              {property.property_name || "N/A"}
                            </h3>
                            <span
                              className="flex-shrink-0 m-0 text-sm font-medium leading-6 text-black sm:text-base whitespace-nowrap"
                              title={property.furnished_type}
                            >
                              {property.furnished_type || "Un-Furnished"}
                            </span>
                          </div>

                          <p className="mt-0 mb-1 text-sm leading-5 text-gray-600 truncate" title={subtitle}>
                            {subtitle}
                          </p>

                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              <span className="text-2xl font-bold">
                                ₹{" "}
                                {property.property_category_type === "Rent" ||
                                property.property_category_type === "PG/Co-living"
                                  ? formatPrice(property.rent).replace("₹ ", "")
                                  : formatPrice(property.property_price).replace("₹ ", "")}
                              </span>
                              {(property.property_category_type === "Rent" || property.property_category_type === "PG/Co-living") && (
                                <span className="ml-1 text-sm text-gray-500">/ {property.rent_duration || "Per Month"}</span>
                              )}
                              {property.property_category_type?.includes("Buy") &&
                                property.possession_status === "Ready To Move" && (
                                  <div className="flex items-center gap-2 px-3 py-1 ml-6 bg-green-100 border border-green-200 rounded-full">
                                    <MdApartment className="text-base text-green-700" />
                                    <span className="text-xs font-semibold text-green-700 whitespace-nowrap">Ready to Move</span>
                                  </div>
                                )}
                            </div>
                            <div className="text-sm font-medium whitespace-nowrap">
  {(property.property_category_type === "Rent" ||
    property.property_category_type === "PG/Co-living") && (
    <>
      <span className="text-gray-500">Deposit:</span>
      <span className="ml-1 font-semibold">
        ₹{" "}
        {property.custom_deposit_amount
          ? property.custom_deposit_amount.toLocaleString("en-IN")
          : "0"}
      </span>
    </>
  )}

  {property.property_category_type?.includes("Buy") &&
    property.possession_status !== "Ready To Move" &&
    property.possession_date && (
      <>
        <span className="text-gray-500">Possession:</span>
        <span className="ml-1 font-semibold">
          {new Date(property.possession_date).toLocaleDateString("en-IN")}
        </span>
      </>
    )}
</div>
                          </div>

                          <div className="grid grid-cols-3 py-3 border-t border-b border-gray-100">
                            <div className="flex items-center gap-2 px-3 min-w-0">
                              <MdApartment className="text-[22px] text-gray-700 flex-shrink-0" />
                              <div className="flex flex-col justify-center min-w-0">
                                <p className="m-0 text-sm font-semibold leading-4 truncate">
                                  {property.building_type === "Commercial"
                                    ? property.property_type === "Office"
                                      ? "Office Space"
                                      : property.property_type === "Retail"
                                        ? "Retail Space"
                                        : property.property_type
                                    : property.property_category_type?.includes("PG")
                                      ? `${property.bathroom || 0} Bathrooms`
                                      : property.bhk_type}
                                </p>
                                <p className="m-0 text-xs leading-4 text-gray-500 truncate">
                                  {property.building_type === "Commercial"
                                    ? "Property Type"
                                    : property.property_category_type?.includes("PG")
                                      ? "Bathrooms"
                                      : property.property_type}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 px-3 border-l border-gray-200 min-w-0">
                              {property.property_category_type?.includes("PG") ? (
                                <FaUser className="text-[20px] text-gray-700 flex-shrink-0" />
                              ) : (
                                <FaBath className="text-[20px] text-gray-700 flex-shrink-0" />
                              )}
                              <div className="flex flex-col justify-center min-w-0">
                                <p className="m-0 text-sm font-semibold leading-4 truncate">
                                  {property.property_category_type?.includes("PG")
                                    ? property.available_for
                                    : `${property.bathroom || 0} Baths`}
                                </p>
                                <p className="m-0 text-xs leading-4 text-gray-500 truncate">
                                  {property.property_category_type?.includes("PG") ? "Available For" : "Bathrooms"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 px-3 border-l border-gray-200 min-w-0">
                              <RiRuler2Line className="text-[22px] text-gray-700 flex-shrink-0" />
                              <div className="flex flex-col justify-center min-w-0">
                                <p className="m-0 text-sm font-semibold leading-4 truncate">
                                  {property.area} {property.area_in}
                                </p>
                                <p className="m-0 text-xs leading-4 text-gray-500 truncate">Built Up Area</p>
                              </div>
                            </div>
                          </div>

                          <hr className="my-1 border-gray-100" />

                          <div className="flex items-center justify-between pt-1 pb-2 text-[13px] text-gray-600">
                            <div className="flex items-center flex-wrap min-w-0">
                              <div className="flex items-center">
                                <AiOutlineClockCircle className="mr-1 text-[15px] text-gray-700" />
                                <span className="truncate">Posted by {property.user_type || "Owner"}</span>
                              </div>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="whitespace-nowrap">
                                {property.days_since_created ? `${property.days_since_created} days ago` : "Recently"}
                              </span>
                              {distance && (
                                <>
                                  <span className="mx-2 text-gray-400">•</span>
                                  <div className="flex items-center whitespace-nowrap">
                                    <FaMapMarkerAlt className="mr-1 text-red-500" />
                                    {distance} km from you
                                  </div>
                                </>
                              )}
                            </div>
                            <PiShareNetworkLight
                              className="ml-2 text-[20px] text-gray-500 cursor-pointer hover:text-blue-500"
                              onClick={() =>
                                openShareModal1(`${window.location.origin}/propertydetails/${property._id}`, property._id)
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between pt-3 gap-2">
                            <div className="flex items-center min-w-0">
                              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 overflow-hidden rounded-full bg-blue-100">
                                {property.property_owner_image ? (
                                  <img
                                    src={`${process.env.REACT_APP_API_URL}/media/${property.property_owner_image}`}
                                    alt="Owner"
                                    className="object-cover w-full h-full rounded-full"
                                  />
                                ) : (
                                  <AiOutlineUser className="text-blue-600" size={24} />
                                )}
                              </div>
                              <div className="flex flex-col ml-3 min-w-0">
                                <span className="text-sm font-semibold text-gray-900 truncate" title={property.connect_to_name}>
                                  {property.connect_to_name || "Owner"}
                                </span>
                                <span className="text-xs text-gray-500 truncate">{property.user_type || "Owner"}</span>
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
                    );
                  })
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

                  {getPaginationRange().map((page, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof page === "number" && setCurrentPage(page)
                      }
                      className={`px-3 py-1 text-sm transition-colors ${currentPage === page
                        ? "rounded-full my-border w-8 h-8 flex items-center justify-center font-normal"
                        : "text-gray-700"
                        }`}
                    >
                      {page}
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
            <div className="flex flex-shrink-0 sticky top-0 w-full sm:w-1/2 h-screen overflow-hidden bg-white rounded-lg">
              {loading ? (
                <p>Loading properties...</p>
              ) : (
                <MapContainer
                  center={getMapCenter()}
                  zoom={12}
                  scrollWheelZoom={false}
                  style={{ width: "100%", height: "100%" }}
                >
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" />
                  {properties
  .filter((property) => {
                        const lat = Number(property.latitude);
                        const lng = Number(property.longitude);
  
                        return Number.isFinite(lat) && Number.isFinite(lng);
                      })
                      .map((property) => (
                        <Marker
                          key={property._id}
                          position={[
                            Number(property.latitude),
                            Number(property.longitude),
                          ]}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(property._id);
                            }}
                          >
                            {isFavorited ? (
                              <FaHeart className="text-red-500" />
                            ) : (
                              <FaRegHeart />
                            )}
                          </button>

                          {/* Slider Implementation */}
                          <div className="relative">
                            <img
                              src={
                                propertyImages[currentIndex]?.image
                                  ? `${process.env.REACT_APP_API_URL}${propertyImages[currentIndex]?.image}`
                                  : `${property.cover_image}`
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
                                <span>
                                  {property.property_category_type === "Rent"
                                    ? formatPrice(property.rent)
                                    : formatPrice(property.property_price)}
                                </span>
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
                                {property.city_name} | {property.area_sq} sq ft
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
          </div>
        </div>
      </div>

      {isShareModalOpen && (
        <div className="absolute right-0 z-50">
          <ShareModal
            currentShareUrl={currentShareUrl}
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
    </>
  );
};

export default AdvisorDashboard;