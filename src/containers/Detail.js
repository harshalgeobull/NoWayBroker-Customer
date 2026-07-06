import { React, useState, useRef, useEffect } from "react";
import { FaBed, FaBath, FaRupeeSign } from "react-icons/fa";
import { ToWords } from "to-words";
import { MdLocationOn } from "react-icons/md";
import { FiShare2, FiHeart } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import { IoMdBed } from "react-icons/io";
import { BiArea } from "react-icons/bi";
import { MdOutlineLocationOn } from "react-icons/md";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { FaHeart } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaUser } from "react-icons/fa";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaRulerCombined } from "react-icons/fa";
import { faChair } from "@fortawesome/free-solid-svg-icons";
import { MdOutlineBedroomParent } from "react-icons/md";
import { AiOutlineUser, AiOutlineClockCircle } from "react-icons/ai";
import { BiShapeSquare } from "react-icons/bi";
import { PiShareNetworkLight } from "react-icons/pi";
import axios from "axios";
import {
  HiOutlineBadgeCheck,
  HiOutlineCalendar,
  HiOutlineHome,
  HiOutlineClock,
} from "react-icons/hi";
import { FaMoneyBillWave } from "react-icons/fa";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/RecommendedProperties.css";
import { BsHouseDoorFill, BsArrowsFullscreen } from "react-icons/bs";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom"; // import for routing
import { PiCubeFocus, PiCricketThin } from "react-icons/pi";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FiUser } from "react-icons/fi";
import Login1 from "../auth/Login1";
import SignUp1 from "../auth/SignUp1";
import GetScheduleVTourproperty from "../containers/GetScheduleVTourproperty";
import { HiOutlineArrowRight } from "react-icons/hi"; // thinner arrow
import ShareModal from "../containers/ShareModal";
import ContactDetails from "../containers/ContactDetails";
import { Heart, Building2 } from "lucide-react";
import { RiRuler2Line } from "react-icons/ri";
import { MdApartment } from "react-icons/md";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";

const defaultImage = "/image/appstore.png";

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

const Detail = ({ propertyData }) => {
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: false,
      ignoreDecimal: true,
      ignoreZeroCurrency: true,
    },
  });
  // const [showAllImages, setShowAllImages] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sliderRef = useRef(null);
  const overviewRef = useRef(null);
  const moreDetailsRef = useRef(null);
  const amenitiesRef = useRef(null);
  const aboutRef = useRef(null);
  const locationRef = useRef(null);
  const statusTimelineRef = useRef(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [currentShareUrl1, setcurrentShareUrl1] = useState("");
  const [propertyDetails, setPropertyDetails] = useState({});
  const userId = sessionStorage.getItem("accessToken");
  const history = useHistory();
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [activeShareId, setActiveShareId] = useState(null);
  const [tourSchedule, setTourSchedule] = useState([]);

  const [freeViewCount, setFreeViewCount] = useState(0);
  const [paidViewCount, setPaidViewCount] = useState(0);

  const formatArea = (area, unit) => {
    if (!area) return null;

    const formattedUnit = unit ? unit.trim().toLowerCase() : "";

    return `${area} ${formattedUnit}`;
  };
  const scrollToSection = (ref, key) => {
    setActiveSection(key);
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const checkPostLimits = async () => {
    try {
      const profileForm = new FormData();
      profileForm.append("user_id", userId);

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
    if (userId) {
      checkPostLimits();
    }
  }, [userId]);

  const handleAddCount = async (updatedCount) => {
    try {
      const addCountFormData = new FormData();
      if (freeViewCount > 0) {
        addCountFormData.append("free_view_count", updatedCount);
      } else {
        addCountFormData.append("paid_view_count", updatedCount);
      }
      addCountFormData.append("user_id", userId);

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

  useEffect(() => {
    // const userId = sessionStorage.getItem("AccessToken");
    if (userId) {
      setIsLoggedIn(true);
      fetchSavedProperties(userId);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchSavedProperties = async () => {
    // const userId = sessionStorage.getItem("AccessToken");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_favorite_properties`,
        { user_id: userId },
      );
      if (response.data.status === 1 && Array.isArray(response.data.data)) {
        const savedIds = response.data.data.map((prop) => prop._id);
        setSavedProperties(savedIds);
      } else {
        setSavedProperties([]);
        console.error("No saved properties found.");
      }
    } catch (error) {
      console.error("Error fetching saved properties:", error);
    }
  };

  const fetchRecommendedProperties = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_featured_property`,
        { user_id: userId },
      );
      if (response.data.status === 1 && Array.isArray(response.data.data)) {
        setProperties(response.data.data);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching recommended properties:", error);
    }
  };

  useEffect(() => {
    fetchRecommendedProperties();
  }, []);

  //add to favorite started
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null); // Store the favorite_id for removal

  // Check if the property is a favorite on page load or when propertyDetails changes
  const checkIfFavorite = async (propertyId) => {
    // const userId = sessionStorage.getItem("accessToken");
    if (!userId || !propertyId) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_favorite_properties`,
        { user_id: userId },
      );

      const favoriteList = response.data.data || [];
      const matchedFavorite = favoriteList.find(
        (fav) => String(fav._id) === String(propertyId),
      );

      if (matchedFavorite) {
        setIsFavorite(true);
        setFavoriteId(matchedFavorite.favorite_id); // Save favorite_id for removal
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  useEffect(() => {
    checkIfFavorite(propertyDetails?._id);
  }, [propertyDetails?._id]);

  //  Add to favorites
  const addToFavorites = async () => {
    if (!userId) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_to_favorite`,
        {
          user_id: userId,
          property_id: propertyDetails._id,
        },
      );
      setIsFavorite(true); // Immediately set isFavorite to true
      checkIfFavorite(_id); // Save the favorite_id from the response
      toast.success("Property has been saved to your favorites!");
      fetchPropertyDetails(_id);
      fetchRecommendedProperties();
    } catch (error) {
      console.error("Error adding property to favorites:", error);
      toast.error("Failed to save the property. Please try again.");
    }
  };

  // Remove from favorites
  const removeFromFavorites = async () => {
    if (!favoriteId) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cust_api/remove_from_favorite`,
        { data: { favorite_id: favoriteId } }, // DELETE request with body
      );

      toast.success("Property removed from your favorites.");
      checkIfFavorite(_id);
      fetchPropertyDetails(_id);
      fetchRecommendedProperties();
    } catch (error) {
      console.error("Error removing property from favorites:", error);
      toast.error("Failed to remove the property. Please try again.");
    }
  };

  //  Add to favorites
  const addToFavoritesRecommendedProperty = async (PropertyId) => {
    if (!userId) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_to_favorite`,
        {
          user_id: userId,
          property_id: PropertyId,
        },
      );
      checkIfFavorite(_id);
      fetchPropertyDetails(_id);
      fetchRecommendedProperties();
    } catch (error) {
      console.log("Failed to save the property. Please try again.");
    }
  };

  // Remove from favorites
  const removeFromFavoritesRecommendedProperty = async (FavoriteId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cust_api/remove_from_favorite`,
        { data: { favorite_id: FavoriteId } },
      );

      checkIfFavorite(_id);
      fetchPropertyDetails(_id);
      fetchRecommendedProperties();
    } catch (error) {
      console.log("Failed to remove the property. Please try again.");
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
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const openShareModal1 = (url) => {
    setcurrentShareUrl1(url);
    const modal = document.getElementById("shareModal1");
    if (modal) {
      modal.style.display = "block";
    }
  };

  const openShareModal = (url, propertyId) => {
    setCurrentShareUrl(url);
    setActiveShareId(propertyId);
    setIsShareModalOpen(true);
  };

  const formatPrice = (price) => {
    if (!price) return "";

    price = parseInt(price);

    const formatNumber = (num) => {
      return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
    };

    if (price >= 10000000) {
      return `${formatNumber(price / 10000000)} Cr`;
    } else if (price >= 100000) {
      return `${formatNumber(price / 100000)} L`;
    } else if (price >= 1000) {
      return `${formatNumber(price / 1000)} K`;
    } else {
      return `${price}`;
    }
  };

  // for the image section with 'get_property_detail' api

  const { _id } = useParams();
  const location = useLocation();
  const property_owner_id = location.state?.property_owner_id;
  const [aboutPropertyText, setAboutPropertyText] = useState("");

  const [showAll, setShowAll] = useState(false);
  const [allAmenities, setAllAmenities] = useState([]);
  const visibleAmenities = showAll ? allAmenities : allAmenities.slice(0, 8);

  const [propertyImages, setPropertyImages] = useState([]);
  const [showAllImages, setShowAllImages] = useState(false);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [userDetails, setuserDetails] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
  });

  const user_id = sessionStorage.getItem("accessToken");
  useEffect(() => {
    const customer_id = user_id;

    if (propertyDetails?._id && propertyDetails?.user_id && customer_id) {
      const formData = new FormData();
      formData.append("property_id", propertyDetails?._id);
      formData.append("user_id", propertyDetails?.user_id);
      formData.append("customer_id", customer_id);

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/cust_api/add_view_property`,
          formData,
        )
        .then((res) => {
          if (res.data?.status === 1) {
            console.log("View property recorded");
          }
        })
        .catch((err) => {
          console.error("Failed to record property view:", err);
        });
    }
  }, [propertyDetails?._id, user_id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchPropertyDetails = async (id) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_property_details`,
        { property_id: id, user_id: userId },
      );

      const data = res.data?.data;
      console.log("API Response:", data);
      console.log("Price Onwards:", data.price_onwards);

      if (data?.property_images?.length > 0) {
        setPropertyImages(data.property_images);
      } else {
        setPropertyImages([]);
      }

      if (data?.amenities?.length > 0) {
        setAllAmenities(data.amenities);
      } else {
        setAllAmenities([]);
      }

      if (
        data?.tour_schedule?.length > 0 &&
        data.tour_schedule[0].status !== "Rejected" &&
        data.tour_schedule[0].status !== "Expired"
      ) {
        setTourSchedule(data.tour_schedule);
        const dateParts = data.tour_schedule[0].schedule_date.split("-");
        const year = dateParts[0].slice(-2); // "25"
        const month = parseInt(dateParts[1], 10) - 1; // month index
        const day = parseInt(dateParts[2], 10); // 24

        const monthName = new Date(0, month).toLocaleString("default", {
          month: "short",
        });

        const scheduledLabel = `Scheduled ${day} ${monthName} ${year}`;
        setScheduledDateLabel(scheduledLabel);
      } else {
        setTourSchedule([]);
        setScheduledDateLabel("Virtual Tour");
      }

      if (data?.property_details?.property_description) {
        setAboutPropertyText(data.property_details.property_description);
      } else {
        setAboutPropertyText("");
      }

      if (data?.property_details) {
        setPropertyDetails(data.property_details);
      } else {
        setPropertyDetails({});
      }

      if (
        data?.user_details &&
        Array.isArray(data.user_details) &&
        data.user_details.length > 0
      ) {
        setuserDetails(data.user_details[0]);
      } else {
        setuserDetails({
          full_name: "N/A",
          mobile_number: "N/A",
          email: "N/A",
        });
        console.warn("user_details is empty or invalid:", data?.user_details);
      }

      const pd = data.property_details;
      setLatitude(pd.latitude);
      setLongitude(pd.longitude);
    } catch (err) {
      console.error("Error fetching property details", err);
      setPropertyImages([]);
      setAllAmenities([]);
      setTourSchedule([]);
    }
  };

  useEffect(() => {
    fetchPropertyDetails(_id);
  }, [_id]);

  // for send Enquiry 'add_property_enquiry' api

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState(null); // success or error

  // Existing useEffect (on mount)
  useEffect(() => {
    const mobileNumber = sessionStorage.getItem("Mobile_Number");
    if (mobileNumber) {
      setContactNumber(mobileNumber);
    }
  }, []);

  //  New useEffect to check sessionStorage and update contact number after login
  useEffect(() => {
    let interval;

    if (isLoginModalOpen === false && !contactNumber) {
      interval = setInterval(() => {
        const mobileNumber = sessionStorage.getItem("Mobile_Number");
        if (mobileNumber) {
          setContactNumber(mobileNumber);
          clearInterval(interval); // Stop checking once we have it
        }
      }, 500); // Check every 500ms
    }

    return () => clearInterval(interval); // Cleanup
  }, [isLoginModalOpen, contactNumber]);

  const userType = sessionStorage.getItem("user_type");
  // Handle Enquiry Form submission
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      setIsLoginModalOpen(true);
      return;
    }

    const enquiryData = {
      property_id: propertyDetails?._id,
      user_id: propertyDetails?.user_id,
      customer_id: accessToken,
      name,
      user_type: userType,
      contact_number: contactNumber,
      message,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_property_enquiry`,
        enquiryData,
      );

      if (response.data.status) {
        setEnquiryStatus({
          type: "success",
          message: "Enquiry sent successfully!",
        });
        setName("");
        setMessage("");
      } else {
        setEnquiryStatus({ type: "error", message: "Failed to send enquiry!" });
      }
    } catch (error) {
      setEnquiryStatus({ type: "error", message: "Something went wrong!" });
    }
  };

  // Trigger login modal on input if not logged in
  const handleFieldChange = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    const mobileNumber = sessionStorage.getItem("Mobile_Number");
    if (mobileNumber) {
      setIsLoggedIn(true);
      setContactNumber(mobileNumber);
      setIsLoginModalOpen(false);
    }
  };

  // for the schedule virtula tour
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduledDateLabel, setScheduledDateLabel] = useState("Virtual Tour");
  const [openVirtualTourAfterLogin, setOpenVirtualTourAfterLogin] =
    useState(false);
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token && openVirtualTourAfterLogin) {
      setIsModalOpen(true); // Open Virtual Tour
      setOpenVirtualTourAfterLogin(false); // Reset flag
    }
  }, [isLoggedIn]);

  // for share model
  const [openShareModalAfterLogin, setOpenShareModalAfterLogin] =
    useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token && openShareModalAfterLogin) {
      setIsShareModalOpen(true); // Open Share modal
      setOpenShareModalAfterLogin(false); // Reset flag
    }
  }, [isLoggedIn]);

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  //for the contact details
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [openContactModalAfterLogin, setOpenContactModalAfterLogin] =
    useState(false);

  const userName = sessionStorage.getItem("user_name");
  const userMobile = sessionStorage.getItem("Mobile_Number");

  useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("accessToken") && openContactModalAfterLogin) {
      setIsContactModalOpen(true);
      setOpenContactModalAfterLogin(false);
    }
  }, [openContactModalAfterLogin]);

  // Add this line below all useState declarations or just before return:
  const overviewFields = [
    //["Status", propertyDetails?.available_status || null],
    ["Property Added Date", propertyDetails?.property_added_date || null],
    ["Property Name", propertyDetails?.property_name || null],
    [
      "Address",
      propertyDetails?.address &&
        propertyDetails?.city_name &&
        propertyDetails?.state &&
        propertyDetails?.zip_code
        ? `${propertyDetails.address}, ${propertyDetails.city_name}, ${propertyDetails.state}, ${propertyDetails.zip_code}`
        : null,
    ],
    [
      "Area",
      propertyDetails?.area
        ? formatArea(propertyDetails.area, propertyDetails.area_in)
        : null,
    ],
    ["Area Type", propertyDetails?.area_type || null],
    [
      "Price",
      propertyDetails?.property_category_type === "Rent"
        ? propertyDetails?.rent
          ? `₹${formatPrice(propertyDetails.rent)}`
          : null
        : propertyDetails?.property_price
          ? `₹${formatPrice(propertyDetails.property_price)}`
          : null,
    ],
    [
      "Deposite",
      propertyDetails?.custom_deposit_amount
        ? `₹${formatPrice(propertyDetails.custom_deposit_amount)}`
        : null,
    ],
    ["Listing Type", propertyDetails?.property_category_type || null],
    // ["Developer", propertyDetails?.developer || null],
    ["Building Type", propertyDetails?.building_type || null],
    ["Property Type", propertyDetails?.property_type || null],
    [
      "Bhk Type",
      propertyDetails?.bhk_type === "Studio"
        ? "Studio/Single Room"
        : propertyDetails?.bhk_type || null,
    ],
    ["Furnishing", propertyDetails?.furnished_type || null],
    // ["Plot No.", propertyDetails?.plot_no || null],
    ["Operating Since", propertyDetails?.operating_since || null],
    [
      "Available for Company Lease",
      propertyDetails?.available_for_company_lease || null,
    ],
    ["Available For", propertyDetails?.available_for || null],
    ["Suited For", propertyDetails?.suited_for || null],
    ["Room Type", propertyDetails?.room_type || null],
    ["Food Charges Included", propertyDetails?.food_charges_included || null],
  ].filter(([_, value]) => value);

  //more details

  const moreDetailsFields = [
    ["Food Available", propertyDetails?.food_available || null],
    ["Notice Period", propertyDetails?.notice_period || null],
    [
      "Notice Period Other Days",
      propertyDetails?.notice_period_other_days || null,
    ],
    [
      "Electricity Charges Included",
      propertyDetails?.electricity_charges_included || null,
    ],
    ["Total Beds", propertyDetails?.total_beds || null],
    ["Additional Rooms", propertyDetails?.additional_rooms || null],
    ["PG Rules", propertyDetails?.pg_rules || null],
    ["Gate Closing Time", propertyDetails?.gate_closing_time || null],
    ["Gate Closing Hour", propertyDetails?.gate_closing_hour || null],
    ["PG Services", propertyDetails?.pg_services || null],
    ["Age of Property", propertyDetails?.age_of_property || null],
    ["Office Space Type", propertyDetails?.office_space_type || null],
    ["Pantry", propertyDetails?.pantry || null],
    ["Personal Washroom", propertyDetails?.personal_washroom || null],
    ["Bathroom", propertyDetails?.bathroom || null],
    ["Covered Parking", propertyDetails?.covered_parking || null],
    ["Uncovered Parking", propertyDetails?.uncovered_parking || null],
    ["Balcony", propertyDetails?.balcony || null],
    ["Power Backup", propertyDetails?.power_backup || null],
    ["Lift Availability", propertyDetails?.lift_availability || null],
    ["Water Source", propertyDetails?.water_source || null],
    ["View", propertyDetails?.view || null],
    ["Flooring", propertyDetails?.flooring || null],
    ["Total Floor", propertyDetails?.total_floor || null],
    ["Property Floor", propertyDetails?.property_floor || null],
    ["Facing", propertyDetails?.facing || null],
    ["Ceiling Height", propertyDetails?.ceiling_height || null],
    ["Parking Availability", propertyDetails?.parking_availability || null],
    ["Min Lockin Period", propertyDetails?.min_lockin_period || null],
    ["Seat Type", propertyDetails?.seat_type || null],
    [
      "Number of Seats Available",
      propertyDetails?.number_of_seats_available || null,
    ],
    ["Plot No.", propertyDetails?.plot_no || null],
    // ["Loan Availability", propertyDetails?.loan_availability || null],
    //some other fileds
    ["RERA ID", propertyDetails?.property_no || null],
    ["Landmarks", propertyDetails?.landmarks || null],
    ["Furnishing", propertyDetails?.furnished_type || null],
    ["Near Landmark", propertyDetails?.near_landmark || null],
    ["Flat Name", propertyDetails?.flat_name || null],
    ["Maintenance Frequency", propertyDetails?.maintenance_frequency || null],
    [
      "Maintenance Included",
      propertyDetails?.maintenance_included ? "Yes" : "No",
    ],
    ["Security Deposit Type", propertyDetails?.security_deposit_type || null],
    [
      "Available for Company Lease",
      propertyDetails?.available_for_company_lease || null,
    ],
    ["Available For", propertyDetails?.available_for || null],
    ["Suited For", propertyDetails?.suited_for || null],
    ["Room Type", propertyDetails?.room_type || null],
    ["Food Charges Included", propertyDetails?.food_charges_included || null],
    // [
    //   "Virtual Tour Availability",
    //   propertyDetails?.virtual_tour_availability || null,
    // ],
    ["Property Category Type", propertyDetails?.property_category_type || null],
    ["Rent", propertyDetails?.rent || null],
    ["Rent Duration", propertyDetails?.rent_duration || null],
    ["Property Added Date", propertyDetails?.property_added_date || null],
    ["Possession Status", propertyDetails?.possession_status || null],
    ["Possession Date", propertyDetails?.possession_date || null],

    ["Area Type", propertyDetails?.area_type || null],
    ["Built up Area", propertyDetails?.area || null],
    [
      "Built-up Area Unit",
      propertyDetails?.area_in ? propertyDetails.area_in.toLowerCase() : null,
    ],
    ["Carpet Area", propertyDetails?.carpet_area || null],
    [
      "Carpet Area Unit",
      propertyDetails?.carpet_area_unit
        ? propertyDetails.carpet_area_unit.toLowerCase()
        : null,
    ],
    ["Available Status", propertyDetails?.available_status || null],
    ["Investment Options", propertyDetails?.investment_options || null],
    ["All Inclusive Price", propertyDetails?.all_inclusive_price || null],
    ["Price Onwards", propertyDetails?.price_onwards || null],
    ["Price Negotiable", propertyDetails?.price_negotiable || null],
    [
      "Tax And Goverment Charges",
      propertyDetails?.tax_and_goverment_charges || null,
    ],
    [
      "Electricity And Water Charges",
      propertyDetails?.electricity_and_water_charges || null,
    ],
    ["No Of Open Sides", propertyDetails?.no_of_open_sides || null],
    ["No Of Peoples", propertyDetails?.no_of_peoples || null],
    ["Type Of Construction", propertyDetails?.type_of_construction || null],
    ["Quality Rating", propertyDetails?.quality_rating || null],
    ["Central AC", propertyDetails?.central_AC || null],
    ["Total Number Parking", propertyDetails?.total_number_parking || null],
    ["Block", propertyDetails?.block || null],
    ["Developer", propertyDetails?.developer || null],
    ["Project Type", propertyDetails?.project_type || null],
    ["Transaction Type", propertyDetails?.transaction_type || null],
    ["Builder Floor Type", propertyDetails?.builder_floor_type || null],
    // ["Attached Bathroom", propertyDetails?.attached_bathroom || null],
    // ["Attached Balcony", propertyDetails?.attached_balcony || null],
    // ["Pantry Option", propertyDetails?.pantry_option || null],
    // ["Parking Types", propertyDetails?.parking_types || null],
    ["Possession By", propertyDetails?.possession_by || null],
    [
      "Property Dimensions Length",
      propertyDetails?.property_dimensions_length || null,
    ],
    [
      "Property Dimensions Breadth",
      propertyDetails?.property_dimensions_breadth || null,
    ],
    ["Length Of Land", propertyDetails?.length_of_land || null],
    ["Breadth Of Land", propertyDetails?.breadthOfLand || null],
    ["Open Sides Of Land", propertyDetails?.openSidesOfLand || null],
    ["Construction On Land", propertyDetails?.constructionOnLand || null],
    [
      "Selected Construction On Land",
      propertyDetails?.selectedConstructionOnLand || null,
    ],
    ["Commercial Washroom", propertyDetails?.commercial_washroom || null],
    [
      "Number Of Minimum Bathrooms",
      propertyDetails?.number_of_minimum_bathrooms || null,
    ],
    ["Maintenance Cost", propertyDetails?.maintenance_cost || null],
    ["Available Beds", propertyDetails?.available_beds || null],
    ["Available From", propertyDetails?.available_from || null],
    ["Available On", propertyDetails?.available_on || null],

    ["No Of Cabines", propertyDetails?.no_of_cabines || null],
    ["No Of Meeting Rooms", propertyDetails?.no_of_meeting_Rooms || null],
    ["No Of Conference Room", propertyDetails?.no_of_conference_room || null],
    // ["Posted By Admin", propertyDetails?.posted_by_admin || null],
    // ["UPS", propertyDetails?.ups || null],
    // ["Oxygen Duct", propertyDetails?.oxygenDuct || null],
    // ["Central AC", propertyDetails?.central_AC || null],
    // ["Conference Room", propertyDetails?.conferenceRoom || null],
    // ["Washroom", propertyDetails?.washroom || null],
    // ["Washroom Check", propertyDetails?.washroom_Check || null],
    ["Reception Area", propertyDetails?.reception_area || null],
    // ["Created At",
    //   propertyDetails?.created_at
    //     ? new Date(propertyDetails.created_at).toLocaleDateString("en-GB")
    //     : null,
    // ],

    // ["Updated At",
    //   propertyDetails?.updated_at
    //     ? new Date(propertyDetails.updated_at).toLocaleDateString("en-GB")
    //     : null,
    // ],
  ].filter(([_, value]) => value);
  const statusTimelineItems = [];

  const addStatusItem = ({
    icon,
    title,
    value,
    bgColor,
    iconColor,
  }) => {
    if (
      !value ||
      value.toString().trim() === "" ||
      value.toString().toLowerCase() === "n/a" ||
      value.toString().toLowerCase() === "null"
    ) {
      return;
    }

    statusTimelineItems.push({
      icon,
      title,
      value,
      bgColor,
      iconColor,
    });
  };
  addStatusItem({
    icon: <HiOutlineBadgeCheck />,
    title: "Availability",
    value: propertyDetails?.available_status,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  });

  addStatusItem({
    icon: <HiOutlineCalendar />,
    title: "Available From",
    value: propertyDetails?.available_from,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  });

  addStatusItem({
    icon: <HiOutlineHome />,
    title: "Possession",
    value: propertyDetails?.possession_status,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  });

  addStatusItem({
    icon: <HiOutlineClock />,
    title: "Last Updated",
    value: propertyDetails?.updated_at
      ? new Date(propertyDetails.updated_at).toLocaleDateString("en-GB")
      : propertyDetails?.property_added_date,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  });

  addStatusItem({
    icon: <HiOutlineClock />,
    title: "Property Age",
    value: propertyDetails?.age_of_property,
    bgColor: "bg-amber-50",
    iconColor: "text-amber-700",
  });

  const handleClick = () => {
    history.push("/featuredDashboard");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (
      isShareModalOpen ||
      isContactModalOpen ||
      showAllImages ||
      isModalOpen
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isShareModalOpen, isContactModalOpen, showAllImages, isModalOpen]);

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

  return (
    <>
      <div className="max-w-full px-4 mx-auto sm:px-16">
        {/* Property Details Section */}
        <div className="relative w-full h-auto p-2 mb-4 rounded-lg shadow-sm bg-rose-50">
          {(propertyDetails?.property_price || propertyDetails?.rent) && (
            <div className="absolute top-4 right-4 flex flex-col items-end">
              <p className="flex items-center mt-5 text-3xl font-bold my-text">
                <FaRupeeSign className="mr-2" />
                {propertyDetails?.property_category_type === "Rent" ? (
                  <>
                    {formatPrice(propertyDetails?.rent)}{" "}
                    <span className="ml-1 text-xl gray-700 text-">
                      {propertyDetails?.rent_duration
                        ? ` / ${propertyDetails.rent_duration}`
                        : ""}
                    </span>
                  </>
                ) : (
                  formatPrice(propertyDetails?.property_price)
                )}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-500">
                {propertyDetails?.property_category_type === "Rent"
                  ? `${toWords.convert(Number(propertyDetails?.rent))} Only`
                  : `${toWords.convert(Number(propertyDetails?.property_price))} Only`}
              </p>
            </div>
          )}

          <h2 className="mt-2 ml-6 text-3xl font-normal">
            {propertyDetails?.property_name
              ? `${propertyDetails.property_name} `
              : ""}
          </h2>

          <p className="ml-6 text-xl font-bold text-gray-700 break-words whitespace-normal max-w-[80ch]">
            <img
              src="/image/address_icon.png"
              alt="Address Icon"
              className="inline-block w-5 h-5 mr-2"
            />
            {propertyDetails?.address || "Address N/A"}
          </p>
          <div className="flex items-center mt-6 ml-5 space-x-8">
            {propertyDetails?.bhk_type && (
              <div className="flex items-center space-x-2">
                <FaBed className="text-2xl my-text" />
                <span className="text-lg font-bold">
                  {propertyDetails.bhk_type}
                </span>
              </div>
            )}

            {propertyDetails?.area && (
              <div className="flex items-center space-x-2">
                <FaRulerCombined className="text-2xl my-text" />
                <span className="text-lg font-bold">
                  {formatArea(propertyDetails.area, propertyDetails.area_in)}
                </span>
              </div>
            )}

            {propertyDetails?.bathroom && (
              <div className="flex items-center space-x-2">
                <FaBath className="text-2xl my-text" />
                <span className="text-lg font-bold">
                  {propertyDetails.bathroom} Bathroom
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            {propertyDetails.virtual_tour_availability === "Yes" && (
              <button
                className={`px-6 py-2 text-lg flex items-center gap-2 w-full sm:w-auto justify-center 
      ${tourSchedule?.[0]?.status === "Accepted"
                    ? "bg-green-500 text-white rounded-full"
                    : scheduledDateLabel === "Virtual Tour"
                      ? "bg-white border my-text rounded-lg"
                      : "bg-[#FFD700] text-black rounded-full"
                  }`}
                onClick={() => {
                  const token = sessionStorage.getItem("accessToken");

                  if (scheduledDateLabel !== "Virtual Tour") {
                    history.push({
                      pathname: "/dashboard",
                      state: { page: "myVirtualtour" },
                    });
                  } else {
                    if (token) {
                      setIsModalOpen(true);
                    } else {
                      setOpenVirtualTourAfterLogin(true);
                      setIsLoginModalOpen(true);
                    }
                  }
                }}
              >
                <PiCubeFocus size={20} />
                {scheduledDateLabel}
                {scheduledDateLabel !== "Virtual Tour" && (
                  <HiOutlineArrowRight size={16} />
                )}
              </button>
            )}

            {isModalOpen && (
              <GetScheduleVTourproperty
                onClose={() => setIsModalOpen(false)}
                propertyDetails={propertyDetails}
                setScheduledDateLabel={setScheduledDateLabel}
                setIsModalOpen={setIsModalOpen}
              />
            )}
            <div
              className="w-full px-3 py-1 text-sm text-white my-bg rounded-lg cursor-pointer sm:px-4 sm:py-2 sm:text-lg sm:w-auto"
              onClick={() => {
                const token = sessionStorage.getItem("accessToken");
                if (token) {
                  if (!userDetails) {
                    // Avoid opening the modal if user data is missing
                    toast.error("User data not found");
                    return;
                  }

                  if (freeViewCount > 0) {
                    const updatedCount = -1;
                    setFreeViewCount(updatedCount);
                    handleAddCount(updatedCount);
                  } else if (paidViewCount > 0) {
                    const updatedCount = -1;
                    setPaidViewCount(updatedCount);
                    handleAddCount(updatedCount);
                  }

                  setIsContactModalOpen(true);
                } else {
                  setOpenContactModalAfterLogin(true);
                  setIsLoginModalOpen(true);
                }
              }}
            >
              Contact Details
            </div>
            {isContactModalOpen &&
              userDetails &&
              !Array.isArray(userDetails) &&
              userDetails.full_name && (
                <ContactDetails
                  onClose={() => setIsContactModalOpen(false)}
                  fullName={
                    freeViewCount <= 0 && paidViewCount <= 0
                      ? `****${userDetails.full_name.slice(-1) || "N/A"}`
                      : userDetails.full_name || "N/A"
                  }
                  mobile={
                    freeViewCount <= 0 && paidViewCount <= 0
                      ? `********${userDetails.mobile_number?.slice(-3) || "000"}`
                      : userDetails.mobile_number || "N/A"
                  }
                  userEmail={
                    freeViewCount <= 0 && paidViewCount <= 0
                      ? userDetails.email
                        ? `*******${userDetails.email.slice(-3)}`
                        : "N/A"
                      : userDetails.email || "N/A"
                  }
                  showUpgradePrompt={freeViewCount <= 0 && paidViewCount <= 0}
                />
              )}
            <div
              className="flex items-center justify-center w-10 h-10 bg-white rounded-md cursor-pointer"
              onClick={() => {
                if (propertyDetails.is_favorite) {
                  removeFromFavoritesRecommendedProperty(
                    propertyDetails.favorite_id,
                  );
                } else {
                  addToFavoritesRecommendedProperty(propertyDetails._id);
                }
              }}
            >
              <FiHeart
                className={`text-2xl ${propertyDetails.is_favorite
                  ? "text-red-600 fill-red-600"
                  : "text-gray-600"
                  }`}
              />
            </div>

            <div
              className="flex items-center justify-center w-8 h-8 bg-white rounded-md cursor-pointer sm:w-10 sm:h-10"
              onClick={() => {
                setIsShareModalOpen(true);
              }}
            >
              <FiShare2 className="text-xl text-gray-600 sm:text-2xl" />
            </div>
          </div>
        </div>

        {/* Image Section & Contact Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-auto md:h-[550px]">
          {/* Left Side Image Section */}
          <div className="grid grid-cols-1 col-span-2 gap-1 md:grid-cols-1">
            {/* Image Section */}
            <div className="flex flex-col gap-2 mt-6 md:flex-row">
              {propertyImages.length === 0 ? (
                <div className="w-full relative">
                  <img
                    src={propertyDetails?.cover_image}
                    alt="Main"
                    className="rounded-2xl w-full h-64 md:h-[400px] object-cover"
                  />
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-5xl md:text-4xl font-extrabold text-white rotate-[-30deg] opacity-40 select-none">
                      NoWayBroker
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Left Side - Main Image */}
                  <div className="md:basis-[60%]">
                    <div className="relative">
                      <img
                        src={propertyDetails.cover_image}
                        alt="Main"
                        className="rounded-2xl w-full h-64 md:h-[400px] object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold text-white rotate-[-30deg] opacity-60">
                          NoWayBroker
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Video on Top + One Image Below */}
                  <div className="md:basis-[40%] flex flex-col justify-start gap-2 px-2">
                    {/* Property Main Image Section */}
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setShowAllImages(true)}
                    >
                      {propertyImages.length > 0 && (
                        <div className="relative">
                          <img
                            src={propertyImages[0].image}
                            alt="Preview"
                            className="rounded-2xl w-full h-48 md:h-[195px] object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-white rotate-[-30deg] opacity-60">
                              NoWayBroker
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Property Additional Images Section */}
                    {propertyImages.length > 1 && (
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {(() => {
                          const filteredImages = propertyImages.filter(
                            (img) => img.image !== propertyDetails.cover_image,
                          );

                          // Case 1: No images after filtering → Don’t render
                          if (filteredImages.length === 0) {
                            return null;
                          }

                          // Case 2: Only one image → Don’t render second section
                          if (filteredImages.length === 1) {
                            return null;
                          }

                          // Case 3: More than one image → Render the 2nd preview + overlay
                          return (
                            <div
                              className="relative cursor-pointer"
                              onClick={() => setShowAllImages(true)}
                            >
                              <div className="relative">
                                <img
                                  src={filteredImages[1]?.image}
                                  alt="Preview"
                                  className="rounded-2xl w-full h-48 md:h-[190px] object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <span className="text-2xl font-bold text-white rotate-[-30deg] opacity-60">
                                    NoWayBroker
                                  </span>
                                </div>
                              </div>
                              {filteredImages.length > 1 && (
                                <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-white bg-black bg-opacity-50 rounded-2xl">
                                  {(() => {
                                    const count =
                                      filteredImages.length -
                                      1 +
                                      (propertyDetails?.property_video ? 1 : 0);

                                    return count > 0 ? (
                                      <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-white bg-black bg-opacity-50 rounded-2xl">
                                        +{count} View All
                                      </div>
                                    ) : null;
                                  })()}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            {/* Navigation Tabs */}
            <div className="sticky top-0 z-20 flex items-center gap-8 px-6 py-4 mb-4 bg-white rounded-lg shadow-sm">
              <button
                onClick={() => scrollToSection(overviewRef, "overview")}
                className={`relative font-medium pb-1 ${activeSection === "overview"
                  ? "text-red-600"
                  : "hover:text-[#8A2432]"
                  }`}
              >
                Overview
                {activeSection === "overview" && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-red-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() =>
                  scrollToSection(statusTimelineRef, "statusTimeline")
                }
                className={`relative font-medium pb-1 ${activeSection === "statusTimeline"
                  ? "text-red-600"
                  : "hover:text-[#8A2432]"
                  }`}
              >
                Status & Timeline
                {activeSection === "statusTimeline" && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-red-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => scrollToSection(moreDetailsRef, "moreDetails")}
                className={`relative font-medium pb-1 ${activeSection === "moreDetails"
                  ? "text-red-600"
                  : "hover:text-[#8A2432]"
                  }`}
              >
                More Details
                {activeSection === "moreDetails" && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-red-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => scrollToSection(amenitiesRef, "amenities")}
                className={`relative font-medium pb-1 ${activeSection === "amenities"
                  ? "text-red-600"
                  : "hover:text-[#8A2432]"
                  }`}
              >
                Amenities
                {activeSection === "amenities" && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-red-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => scrollToSection(aboutRef, "about")}
                className={`relative font-medium pb-1 ${activeSection === "about"
                  ? "text-red-600"
                  : "hover:text-[#8A2432]"
                  }`}
              >
                About Property
                {activeSection === "about" && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-red-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => scrollToSection(locationRef, "location")}
                className={`relative font-medium pb-1 ${activeSection === "location"
                  ? "text-red-600"
                  : "hover:text-[#8A2432]"
                  }`}
              >
                Location
                {activeSection === "location" && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>
            {/* Add the Overview Component Below */}
            {overviewFields.length > 0 && (
              <div
                ref={overviewRef}
                className="w-full p-4 bg-white rounded-lg shadow-sm scroll-mt-20"
              >
                <h3 className="mb-4 text-3xl font-semibold">Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-[18px]">
                  {overviewFields.map(([key, value], index) => (
                    <div
                      key={index}
                      className="flex justify-start p-2 border-gray-200"
                    >
                      <span className="w-1/2 text-gray-500">{key}</span>
                      <span className="text-black">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {statusTimelineItems.length > 0 && (
              <div
                ref={statusTimelineRef}
                className="w-full p-5 mt-4 bg-white rounded-lg shadow-sm scroll-mt-20"
              >
                <h3 className="mb-5 text-2xl font-semibold text-gray-800">
                  Status & Timeline
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {statusTimelineItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start p-4 rounded-xl border border-gray-200 ${item.bgColor}`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bgColor}`}
                      >
                        <span className={`text-xl ${item.iconColor}`}>
                          {item.icon}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="ml-4 flex-1">
                        <p className="text-sm text-gray-500">
                          {item.title}
                        </p>

                        <p className="mt-1 text-base font-semibold text-gray-800 break-words">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {moreDetailsFields.length > 0 && (
              <div
                ref={moreDetailsRef}
                className="w-full p-4 mt-4 bg-white rounded-lg shadow-sm scroll-mt-20"
              >
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  More Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                  {moreDetailsFields.map(([label, value], index) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {label}
                      </span>
                      <span className="text-sm font-semibold text-gray-800 mt-0.5">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities Section */}
            <div
              ref={amenitiesRef}
              className="w-full p-3 mt-4 bg-white rounded-lg shadow-sm scroll-mt-20"
            >
              <h3 className="ml-4 font-semibold text-lm">Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 mt-4 ml-4 text-[18px]">
                {visibleAmenities.map((amenity, index) => (
                  <p key={index} className="flex items-center text-lg">
                    {amenity.icon ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/media/${amenity.icon}`}
                        alt={amenity.name}
                        className="w-10 h-10 mr-2"
                      />
                    ) : (
                      <PiCricketThin className="mr-2 text-lg text-black" />
                    )}
                    {amenity.name}
                  </p>
                ))}
              </div>
              {!showAll && allAmenities.length > 8 && (
                <p
                  className="mt-2 ml-4 font-bold my-text cursor-pointer "
                  onClick={() => setShowAll(true)}
                >
                  +{allAmenities.length - 8} More
                </p>
              )}
            </div>

            {/* About Property Section */}
            <div
              ref={aboutRef}
              className="bg-white shadow-sm mt-4 rounded-2xl p-3 h-auto md:h-[250px] w-full scroll-mt-20"
            >
              <h2 className="justify-center ml-4 font-bold text-gray-700 text-ml">
                About property
              </h2>
              <p className="mt-3 text-gray-700 justify-center ml-4 text-[18px]">
                {aboutPropertyText}
              </p>
            </div>

            {/* Location Section with Map */}
            <div
              ref={locationRef}
              className="bg-white shadow-sm mt-4 rounded-2xl p-3 h-auto md:h-[600px] w-full scroll-mt-20"
            >
              <h2 className="ml-4 text-3xl font-bold text-gray-900">
                Location
              </h2>
              <div className="mt-4 overflow-hidden rounded-lg">
                <iframe
                  className="w-full h-48 md:h-[450px] rounded-2xl"
                  src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
          {/* Right Side Contact Form with Increased Height */}
          <div className="sticky top-0 flex flex-col max-h-screen pt-4 overflow-auto">
            <div className="bg-white shadow-lg rounded-2xl p-4 min-h-[650px] flex flex-col justify-between">
              <div>
                <h3 className="mb-5 text-xl font-semibold">Make an Enquiry</h3>
                <div className="flex items-center pb-3 mb-6 space-x-6 border-b-2 border-black">
                  <Link
                    to={`/agentdetail/${userDetails?._id}`}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="block overflow-hidden no-underline shadow-md rounded-2xl hover:no-underline"
                  >
                    <img
                      src={
                        userDetails?.profile_image
                          ? userDetails?.profile_image
                          : "/image/app.png"
                      }
                      alt="Agent"
                      className="object-contain w-16 h-16 rounded-full"
                    />
                  </Link>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold">
                      {userDetails.full_name || "N/A"}
                    </span>
                    <span className="text-sm font-semibold">
                      {userDetails.user_type || "N/A"}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleEnquirySubmit} className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      handleFieldChange();
                    }}
                    className="w-full p-3 mb-4 text-lg border rounded-md outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={contactNumber}
                    readOnly
                    className="w-full p-3 mb-4 text-lg border rounded-md outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <textarea
                    placeholder="Message"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      handleFieldChange();
                    }}
                    className="w-full p-4 mb-6 text-lg border rounded-md outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full py-4 text-lg text-white my-bg rounded-lg"
                  >
                    Send an Enquiry
                  </button>
                </form>
              </div>

              {enquiryStatus && (
                <div
                  className={`text-center mt-4 text-lg ${enquiryStatus.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                    }`}
                >
                  {enquiryStatus.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal for Viewing All Images */}
        {showAllImages && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-white p-6 rounded-lg w-[80%] h-[80%] overflow-auto">
              <button
                className="absolute text-3xl text-white top-4 right-4"
                onClick={() => setShowAllImages(false)}
              >
                ×
              </button>
              <h2 className="mb-4 text-2xl font-semibold">Gallery</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {propertyImages.map((img, index) => (
                  <div className="relative">
                    <img
                      key={index}
                      src={img.image}
                      alt={`Room ${index + 1}`}
                      className="object-cover w-full h-48 rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold text-white rotate-[-30deg] opacity-60">
                        NoWayBroker
                      </span>
                    </div>
                  </div>
                ))}

                {/* Property  Video at the end */}
                {propertyDetails?.property_video && (
                  <video
                    controls
                    className="rounded-2xl w-full h-48 md:h-[195px] object-cover"
                  >
                    <source
                      src={propertyDetails.property_video}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Exclusive Recommended Section */}
        <div className="w-full sm:px-6 lg:px-4">
          <div className="flex flex-col items-start justify-between px-4 pt-3 mb-3 sm:flex-row sm:items-center">
            <div className="flex flex-col">
              <h2 className="mb-2 text-2xl font-bold tracking-wide text-gray-800 sm:text-3xl">
                Exclusive Recommended
              </h2>
              <p className="text-gray-500"></p>
            </div>

            <div className="flex items-center mt-4 space-x-3 sm:space-x-5 sm:mt-0">
              <button
                className="px-4 py-2 text-sm text-rose-700 bg-white my-border rounded-lg sm:px-6"
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
                className="p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md sm:text-2xl hover:shadow-lg"
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
                <div key={property._id} className="box-border p-2">
                  <div className="overflow-hidden bg-white shadow-md rounded-2xl">
                    <div className="relative">
                      <Link
                        to={`/propertydetails/${property._id}?property_owner_id=${property.user_id}`}
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className="block overflow-hidden no-underline bg-white border-2 rounded-lg hover:no-underline"
                      >
                        {allImages.length > 1 ? (
                          <Slider
                            key={`${property._id}-${allImages.length}`}
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
                              <div key={`${property._id}-${idx}`}>
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
                            src={allImages[0] || defaultImage}
                            alt="Property"
                            className="object-cover w-full h-48 rounded-t-2xl"
                          />
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
                          onClick={() => {
                            if (property.is_favorite) {
                              removeFromFavoritesRecommendedProperty(
                                property.favorite_id,
                              );
                            } else {
                              addToFavoritesRecommendedProperty(property._id);
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
                          <span className="px-3 py-1 text-xs text-white bg-yellow-500 rounded-ss-lg">
                            FEATURED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Property Details — same design as AdvisorDashboard */}
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

                      <p
                        className="mt-0 mb-1 text-sm leading-5 text-gray-600 truncate"
                        title={subtitle}
                      >
                        {subtitle}
                      </p>

                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <span className="text-2xl font-bold">
                            ₹{" "}
                            {property.property_category_type === "Rent"
                              ? formatPrice(property.rent)
                              : formatPrice(property.property_price)}
                          </span>
                          {property.property_category_type === "Rent" && (
                            <span className="ml-1 text-sm text-gray-500">
                              / {property.rent_duration}
                            </span>
                          )}
                          {property.property_category_type?.includes("Buy") &&
                            property.possession_status === "Ready To Move" && (
                              <div className="flex items-center gap-2 px-3 py-1 ml-6 bg-green-100 border border-green-200 rounded-full">
                                <MdApartment className="text-base text-green-700" />
                                <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
                                  Ready to Move
                                </span>
                              </div>
                            )}
                        </div>
                        <div className="text-sm font-medium whitespace-nowrap">
                          {property.property_category_type?.includes("Buy") &&
                            property.possession_status !== "Ready To Move" &&
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
                                : property.property_category_type?.includes(
                                  "PG",
                                )
                                  ? `${property.bathroom || 0} Bathrooms`
                                  : property.bhk_type}
                            </p>
                            <p className="m-0 text-xs leading-4 text-gray-500 truncate">
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
                              {property.property_category_type?.includes("PG")
                                ? "Available For"
                                : "Bathrooms"}
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

                      <hr className="my-1 border-gray-100" />

                      <div className="flex items-center justify-between pt-1 pb-2 text-[13px] text-gray-600">
                        <div className="flex items-center flex-wrap min-w-0">
                          <div className="flex items-center">
                            <AiOutlineClockCircle className="mr-1 text-[15px] text-gray-700" />
                            <span className="truncate">
                              Posted by {property.user_type || "Owner"}
                            </span>
                          </div>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="whitespace-nowrap">
                            {property.days_since_created
                              ? `${property.days_since_created} days ago`
                              : "Recently"}
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
                            openShareModal(
                              `${window.location.origin}/propertydetails/${property._id}`,
                              property._id,
                            )

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
                            <span
                              className="text-sm font-semibold text-gray-900 truncate"
                              title={property.connect_to_name}
                            >
                              {property.connect_to_name || "Owner"}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {property.user_type || "Owner"}
                            </span>
                          </div>
                        </div>

                        {/* RIGHT SIDE - Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Contact */}
                          <div
                            className="flex items-center justify-center px-4 h-9 text-sm font-semibold text-white bg-red-800 rounded-md cursor-pointer hover:bg-red-900 whitespace-nowrap"
                            onClick={() => {
                              const token =
                                sessionStorage.getItem("accessToken");
                              if (token) {
                                if (freeViewCount > 0) {
                                  handleAddCount(-1);
                                } else if (paidViewCount > 0) {
                                  handleAddCount(-1);
                                }
                                setIsContactModalOpen(true);
                              } else {
                                setOpenContactModalAfterLogin(true);
                                setIsLoginModalOpen(true);
                              }
                            }}
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
                </div>
              );
            })}
          </Slider>
        </div>
        {isShareModalOpen && (
          <ShareModal
            currentShareUrl={window.location.href}
            closeShareModal={handleCloseShareModal}
            copyLink={() => {
              const url = window.location.href;

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
        )}

        {isShareModalOpen && (
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

        {/* Modals */}
        {isLoggedIn ? (
          <div>Welcome, {contactNumber}</div> // Display logged-in content
        ) : (
          <>
            <Login1
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              onSwitchToSignUp={() => {
                setIsLoginModalOpen(false);
                setIsSignUpModalOpen(true); // Open sign-up modal
              }}
              onLoginSuccess={handleLoginSuccess} // Pass the callback to Login1 component
            />
            <SignUp1
              isOpen={isSignUpModalOpen}
              onClose={() => setIsSignUpModalOpen(false)}
              onSwitchToLogin={() => {
                setIsSignUpModalOpen(false);
                setIsLoginModalOpen(true); // Open login modal
              }}
            />
          </>
        )}
        {/* Share Modal */}
        {isShareModalOpen && (
          <ShareModal
            currentShareUrl={window.location.href}
            closeShareModal={handleCloseShareModal}
            copyLink={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }}
          />
        )}
      </div>
    </>
  );
};

export default Detail;