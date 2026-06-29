import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaRupeeSign } from "react-icons/fa";
import { FiShare2, FiHeart } from "react-icons/fi";
import { AiOutlineGlobal, AiFillHome } from "react-icons/ai";
import { MdDateRange } from "react-icons/md";
import { BiShapeSquare } from "react-icons/bi";
import { PiCubeFocus, PiCricketThin } from "react-icons/pi";
import Slider from "react-slick";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Login1 from "../auth/Login1";
import SignUp1 from "../auth/SignUp1";
import { toast } from "react-toastify";
import GetScheduleModal from "../containers/GetScheduleModal";
import { HiOutlineArrowRight } from "react-icons/hi"; // thinner arrow
import ShareModal from "../containers/ShareModal";
import ContactDetails from "../containers/ContactDetails";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";

import { Building2, Ruler } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";

const ProjectDetail = () => {
  // const [showAllImages, setShowAllImages] = useState(false);
  const sliderRef = useRef(null);
  const history = useHistory();
  const projectLocationSectionRef = useRef(null);
  const overviewRef = useRef(null);
  const amenitiesRef = useRef(null);
  const aboutPropertyRef = useRef(null);
  const locationRef = useRef(null);


  // NEW
  const scrollToSection = (ref) => {
    if (!ref.current) return;
    const OFFSET = 60;
    const top = ref.current.getBoundingClientRect().top + window.pageYOffset - OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };
  const handleViewAll = () => {
    history.push("/projectlist");
  };
  const { projectId } = useParams();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [displayedAmenities, setDisplayedAmenities] = useState([]);

  const [selectedBHK, setSelectedBHK] = useState("2");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // For image popup (if needed)
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [projectDetails, setProjectDetails] = useState({});
  const [userDetails, setuserDetails] = useState([]);

  //for schedule virtula tour
  const [scheduledDateLabel, setScheduledDateLabel] = useState("Virtual Tour");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [images, setImages] = useState([]);
  const [showAllImages, setShowAllImages] = useState(false);
  const userId = sessionStorage.getItem("accessToken");

  const [freeViewCount, setFreeViewCount] = useState(0);
  const [paidViewCount, setPaidViewCount] = useState(0);

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
    window.scrollTo(0, 0);
  }, [projectId]);

  // Fetch Project Data
  const fetchProjectDetails = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_project_details`,
        { project_id: projectId, user_id: userId },
        { headers: { "Content-Type": "application/json" } },
      );

      const result = response.data;

      const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        });
      };

      if (result && result.data) {
        let minMaxPrice = "N/A";
        if (
          result.data.project_properties &&
          result.data.project_properties.length > 0
        ) {
          const prices = result.data.project_properties.map((p) =>
            parseFloat(p.price),
          );

          if (prices.length === 1) {
            //  Only one property → show single value
            minMaxPrice = prices[0];
          } else {
            //  Multiple properties → show min - max
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            minMaxPrice = `${minPrice} - ${maxPrice}`;
          }
        }
        const overviewData = {
          project_size:
            result.data?.project_details?.total_project_size || "N/A",
          launch_date: formatDate(result.data?.project_details?.launch_date),
          avg_price: minMaxPrice,
          possession_starts: formatDate(
            result.data?.project_details?.possession_start,
          ),
          construction_status:
            result.data?.project_details?.construction_status || "N/A",
          rera_id: result.data?.project_details?.rera_id || "N/A",
          project_added_data: result.data?.project_details?.created_at
            ? result.data.project_details.created_at.split("T")[0]
            : "N/A",
          project_name: result.data?.project_details?.project_name || "N/A",
          project_type: result.data?.project_details?.project_type || "N/A",
          project_configuration:
            result.data?.project_details?.congfigurations || "N/A",
        };

        if (result.data.project_details) {
          setProjectDetails(result.data.project_details);
        }

        if (result.data.project_images) {
          setImages(result.data.project_images);
        } else {
          setImages([]);
        }

        if (
          result.data.project_properties &&
          result.data.project_properties.length > 0
        ) {
          const firstProperty = result.data.project_properties[0];
          setSelectedBHK(firstProperty.bhk);
          setSelectedFloorPlan(firstProperty.area);
        }

        const pd = result.data.project_details;
        setLatitude(pd.latitude);
        setLongitude(pd.longitude);

        const finishingData = {
          Floors: [
            ["Living/Dining", pd.floor_living_dining],
            ["Kitchen and Toilets", pd.floor_kitchen_toilet],
            ["Bedroom", pd.floor_bedroom],
            ["Balcony", pd.floor_balcony],
          ],
          Walls: [
            ["Living/Dining", pd.walls_living_dining],
            ["Kitchen and Toilets", pd.walls_kitchen_toilet],
            ["Servant Room", pd.walls_servant_room],
          ],
          Ceilings: [
            ["General", pd.ceiling],
            ["Servant Room", pd.ceilings_servant_room],
          ],
          Counters: [["Kitchen and Toilets", pd.counters_kitchen_toilet]],
          "Fittings/Fixtures": [
            ["Kitchen and Toilets", pd.fittings_fixtures_kitchen_toilet],
            ["Servant Room Toilet", pd.fittings_fixtures_servant_room_toilet],
          ],
          "Door and Window": [
            ["Internal Door", pd.door_window_internal_door],
            ["External Glazing", pd.door_window_external_glazing],
          ],
          Electrical: [
            ["Main", pd.electrical],
            ["Backup", pd.backup],
          ],
          "Security System": [["Available", pd.security_system]],
        };

        const amenities = result.data.amenities;
        setAmenitiesList(amenities);
        setDisplayedAmenities(amenities.slice(0, 8));

        result.data.overview = overviewData;
        result.data.finishingData = finishingData;

        if (
          result.data?.tour_schedule?.length > 0 &&
          result.data.tour_schedule[0].status !== "Rejected" &&
          result.data.tour_schedule[0].status !== "Expired"
        ) {
          const dateParts =
            result.data.tour_schedule[0].schedule_date.split("-");
          const year = dateParts[0].slice(-2);
          const month = parseInt(dateParts[1], 10) - 1;
          const day = parseInt(dateParts[2], 10);

          const monthName = new Date(0, month).toLocaleString("default", {
            month: "short",
          });

          const scheduledLabel = `Scheduled ${day} ${monthName} ${year}`;
          setScheduledDateLabel(scheduledLabel);
        } else {
          setScheduledDateLabel("Virtual Tour");
        }

        // console.log("userOwner details",result.data.user_details)
        if (result.data.user_details) {
          setuserDetails(result.data.user_details[0]);
        }
        console.log("userdetails", userDetails);

        setProjects([result.data]);
      }
    } catch (error) {
      console.error("Failed to fetch project details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const user_id = sessionStorage.getItem("accessToken");
  useEffect(() => {
    const customer_id = user_id;

    if (projectDetails?._id && projectDetails?.user_id && customer_id) {
      const formData = new FormData();
      formData.append("project_id", projectDetails?._id);
      formData.append("user_id", projectDetails?.user_id);
      formData.append("customer_id", customer_id);

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/cust_api/add_view_project`,
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
  }, [projectDetails?._id, user_id]);

  // Update Filtered Properties when selectedBHK or selectedFloorPlan changes
  useEffect(() => {
    if (projects.length > 0) {
      const allProperties = projects[0].project_properties || [];
      const bhkFiltered = allProperties.filter(
        (item) => item.bhk === selectedBHK,
      );
      setFilteredProperties(bhkFiltered);
      setSelectedFloorPlan(bhkFiltered[0]?.area || null); // Default first plan
    }
  }, [projects, selectedBHK]);

  // Toggle Amenities Show/Hide
  const toggleAmenities = () => {
    setShowAllAmenities(!showAllAmenities);
    if (!showAllAmenities) {
      setDisplayedAmenities(amenitiesList);
    } else {
      setDisplayedAmenities(amenitiesList.slice(0, 8));
    }
  };

  // for the get_project_list api integration

  const [projectList, setProjectList] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_project_list`,
      );
      setProjectList(response.data.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [projectId]);
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };
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
      project_id: projectDetails?._id,
      user_id: projectDetails?.user_id,
      customer_id: accessToken,
      name,
      contact_number: contactNumber,
      message,
      user_type: userType,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_project_enquiry`,
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
      setEnquiryStatus({ type: "error", message: "Something went wrong!!" });
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

  // related GetScheduleModal to redirect virtual
  const [openVirtualTourAfterLogin, setOpenVirtualTourAfterLogin] =
    useState(false);
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token && openVirtualTourAfterLogin) {
      setIsModalOpen(true); // Open Virtual Tour
      setOpenVirtualTourAfterLogin(false); // Reset flag
    }
  }, [isLoggedIn]);

  //for sharemodel
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

    return <span className="inline-flex items-center">{formatted}</span>;
  };

  //  Add to favorites
  const addToFavoritesRecommendedProperty = async (PrjectId) => {
    if (!userId) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("project_id", PrjectId);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_favorite_project`,
        formData,
      );
      fetchProjectDetails();
    } catch (error) {
      toast.error("Failed to save the Project. Please try again.");
      fetchProjectDetails();
    }
  };

  // Remove from favorites
  const removeFromFavoritesRecommendedProperty = async (FavoriteId) => {
    try {
      const formData = new FormData();
      formData.append("favorite_id", FavoriteId);

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cust_api/remove_favorite_project`,
        {
          data: formData,
        },
      );
      fetchProjectDetails();
    } catch (error) {
      toast.error("Failed to remove the Project. Please try again.");
      fetchProjectDetails();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Tabs shown right below the image gallery (Overview / Amenities / About Property / Location)
  const detailTabs = [
    { key: "project_location", label: "Project Location", ref: projectLocationSectionRef },
    { key: "overview", label: "Overview", ref: overviewRef },
    { key: "amenities", label: "Amenities", ref: amenitiesRef },
    { key: "about", label: "About Property", ref: aboutPropertyRef },
    { key: "location", label: "Location", ref: locationRef },
  ];
  const [activeDetailTab, setActiveDetailTab] = useState("project_location");

  const handleDetailTabClick = (tab) => {
    setActiveDetailTab(tab.key);
    scrollToSection(tab.ref);
  };
  return (
    <div className="max-w-full px-4 mx-auto md:px-16">
      {/* Property Details Section */}
      <div className="relative p-4 mb-4 rounded-lg shadow-sm bg-rose-50">
        {/* Price Section - Moved to top on mobile */}
        <div className="flex flex-col items-start mb-4 space-y-1 sm:absolute sm:top-4 sm:right-4 sm:items-end sm:mb-0">
          {loading ? (
            <p className="text-xl font-bold my-text sm:text-2xl">Loading...</p>
          ) : (
            <>
              {projects[0]?.project_properties?.length > 0 &&
                (() => {
                  const prices = projects[0].project_properties.map((p) =>
                    Number(p.price),
                  );
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);

                  return (
                    <p className="flex items-center mb-0 text-xl font-bold my-text sm:text-2xl">
                      {minPrice === maxPrice ? (
                        <>
                          <FaRupeeSign className="mr-1" />
                          {formatPrice(minPrice)}
                        </>
                      ) : (
                        <>
                          <FaRupeeSign className="mr-1" />
                          {formatPrice(minPrice)}
                          {" - "}
                          <FaRupeeSign className="mx-1" />
                          {formatPrice(maxPrice)}
                        </>
                      )}
                    </p>
                  );
                })()}

              {projects[0]?.project_properties?.length > 0 &&
                (() => {
                  // Calculate price per sqft for each property
                  const pricePerSqftList = projects[0].project_properties
                    .map((p) => {
                      const price = Number(p.price);
                      const area = Number(p.area);
                      return area > 0 ? price / area : null;
                    })
                    .filter((v) => v !== null);

                  if (pricePerSqftList.length === 0) return null;

                  const minPrice = Math.min(...pricePerSqftList);
                  const maxPrice = Math.max(...pricePerSqftList);

                  return (
                    <p className="flex items-center text-base font-bold text-black sm:text-xs sm:-mt-2">
                      {minPrice === maxPrice ? (
                        <>
                          <FaRupeeSign className="mr-1" />
                          {formatPrice(Math.round(minPrice))} per sqft
                        </>
                      ) : (
                        <>
                          <FaRupeeSign className="mr-1" />
                          {formatPrice(Math.round(minPrice))}
                          {" - "}
                          <FaRupeeSign className="mx-1" />
                          {formatPrice(Math.round(maxPrice))} per sqft
                        </>
                      )}
                    </p>
                  );
                })()}
            </>
          )}
        </div>

        {/* Property Title and Info */}
        <div className="mt-0 ml-0 sm:ml-2 sm:mt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-normal sm:text-3xl">
              {projects[0]?.project_details?.project_name || "Project Name"}
            </h2>

            {/* RERA badge  */}
            {projects[0]?.project_details?.rera_id &&
              projects[0]?.project_details?.rera_id !== "" && (
                <div className="flex items-center gap-1 px-2 py-1 bg-white shadow-sm">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-400 rounded-full">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    RERA
                  </span>
                </div>
              )}
          </div>

          {(projects[0]?.project_details?.address ||
            projects[0]?.project_details?.city_name ||
            projects[0]?.project_details?.state) && (
              <>
                <p className="text-xl font-bold text-gray-700 sm:text-xl">
                  By{" "}
                  <span className="my-text">
                    {projects[0]?.project_details?.connect_to_name}
                  </span>
                </p>

                <p className="mt-1 text-base text-gray-600 sm:text-lg">
                  {projects[0]?.project_details?.address && (
                    <>
                      <img
                        src="/image/address_icon.png"
                        alt="Address Icon"
                        className="inline-block w-5 h-5 mr-2"
                      />
                      {projects[0].project_details.address}
                      <br className="hidden sm:block" />
                    </>
                  )}

                  {(projects[0]?.project_details?.city_name ||
                    projects[0]?.project_details?.state) && (
                      <>
                        {projects[0]?.project_details?.city_name || ""}
                        {projects[0]?.project_details?.city_name &&
                          projects[0]?.project_details?.state
                          ? ", "
                          : ""}
                        {projects[0]?.project_details?.state || ""}
                      </>
                    )}
                </p>
              </>
            )}
        </div>

        {/* Property Features */}
        <div className="flex flex-col items-start justify-between w-full mt-4 md:flex-row md:items-center">
          <div className="flex flex-wrap justify-between w-full gap-3 sm:gap-4 sm:w-auto sm:justify-start">
            {/* Price */}
            {projects[0]?.project_details?.average_project_price && (
              <div className="flex flex-col items-start pr-3 border-r-2 border-rose-100 sm:items-center">
                <p className="flex items-center text-base sm:text-lg">
                  <FaRupeeSign className="mr-1 text-lg text-rose-700 sm:text-xl" />

                  {formatAverageProjectPrice(
                    projects[0]?.project_details?.average_project_price,
                  )}
                </p>

                <span className="text-base leading-none text-gray-600 sm:text-lg">
                  Price
                </span>
              </div>
            )}

            {/* BHK */}
            {projects[0]?.project_details?.bhk_type && (
              <div className="flex flex-col items-start pr-3 border-r-2 border-rose-100 sm:items-center">
                <p className="flex items-center text-base sm:text-lg">
                  <AiFillHome className="mt-1 mr-1 text-lg text-rose-700 sm:text-xl" />

                  {projects[0]?.project_details?.bhk_type}
                </p>

                <span className="text-base leading-none text-gray-600 sm:text-lg">
                  BHK
                </span>
              </div>
            )}

            {/* Area */}
            {projects[0]?.project_details?.area && (
              <div className="flex flex-col items-start px-3 border-r-2 border-rose-100 sm:items-center">
                <p className="flex items-center text-base sm:text-lg">
                  <BiShapeSquare className="text-lg text-rose-700 sm:text-xl" />

                  <span className="ml-1">
                    {projects[0]?.project_details?.area}{" "}
                    {projects[0]?.project_details?.area_in
                      ? projects[0]?.project_details?.area_in
                        .charAt(0)
                        .toUpperCase() +
                      projects[0]?.project_details?.area_in
                        .slice(1)
                        .toLowerCase()
                      : ""}
                  </span>
                </p>

                <span className="text-base leading-none text-gray-600 sm:text-lg">
                  Area
                </span>
              </div>
            )}

            {/* Carpet Area */}
            {projects[0]?.project_details?.carpet_area && (
              <div className="flex flex-col items-start px-3 border-r-2 border-rose-100 sm:items-center">
                <p className="flex items-center text-base sm:text-lg">
                  <BiShapeSquare className="text-lg text-rose-700 sm:text-xl" />

                  <span className="ml-1">
                    {projects[0]?.project_details?.carpet_area}{" "}
                    {projects[0]?.project_details?.carpet_area_unit
                      ? projects[0]?.project_details?.carpet_area_unit
                        .charAt(0)
                        .toUpperCase() +
                      projects[0]?.project_details?.carpet_area_unit
                        .slice(1)
                        .toLowerCase()
                      : ""}
                  </span>
                </p>

                <span className="text-base leading-none text-gray-600 sm:text-lg">
                  Carpet Area
                </span>
              </div>
            )}

            {/* Possession */}
            {projects[0]?.project_details?.possession_date && (
              <div className="flex flex-col items-start pl-2 sm:pl-3 sm:items-center">
                <p className="flex items-center text-base sm:text-lg">
                  <MdDateRange className="text-lg text-rose-700 sm:text-xl" />

                  <span className="ml-1">
                    {new Date(
                      projects[0]?.project_details?.possession_date,
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </p>

                <span className="text-base leading-none text-gray-600 sm:text-lg">
                  Possession
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap w-full gap-2 mt-4 sm:gap-4 md:mt-0 sm:w-auto">
            {projects[0]?.project_details?.virtual_tour_availability ===
              "Yes" && (
                <button
                  className={`px-6 py-2 text-lg flex items-center gap-2 w-full sm:w-auto justify-center 
                ${scheduledDateLabel === "Virtual Tour"
                      ? "bg-white border my-text rounded-lg"
                      : projects[0]?.tour_schedule?.[0]?.status === "Accepted"
                        ? "bg-green-500 text-white rounded-full"
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
              <GetScheduleModal
                onClose={() => setIsModalOpen(false)}
                projectDetails={projectDetails}
                setScheduledDateLabel={setScheduledDateLabel}
                setIsModalOpen={setIsModalOpen}
              />
            )}

            {/* Login Modal */}
            <Login1
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              onSwitchToSignUp={() => {
                setIsLoginModalOpen(false);
                setIsSignUpModalOpen(true);
              }}
              onLoginSuccess={handleLoginSuccess}
            />

            {/* Signup Modal */}
            <SignUp1
              isOpen={isSignUpModalOpen}
              onClose={() => setIsSignUpModalOpen(false)}
              onSwitchToLogin={() => {
                setIsSignUpModalOpen(false);
                setIsLoginModalOpen(true);
              }}
            />

            {/* Download Brochure */}
            <button
              className="w-full px-3 py-1 text-sm text-black bg-white border rounded-lg sm:px-4 sm:py-2 sm:text-lg sm:w-auto"
              onClick={() => {
                if (!userId) {
                  setIsLoginModalOpen(true);
                  return;
                }

                const filePath = projects[0]?.project_details?.brochure_doc;

                if (filePath) {
                  const isFullUrl = filePath.startsWith("http");

                  const fileUrl = isFullUrl
                    ? filePath
                    : `${process.env.REACT_APP_API_URL}/media/${filePath}`;

                  const link = document.createElement("a");

                  link.href = fileUrl;
                  link.target = "_blank";
                  link.rel = "noopener noreferrer";
                  link.download = filePath.split("/").pop();

                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else {
                  alert("No brochure found.");
                }
              }}
            >
              Download Brochure
            </button>

            {/* Contact Details */}
            <div
              className="w-full px-3 py-1 text-sm text-white my-bg rounded-lg cursor-pointer sm:px-4 sm:py-2 sm:text-lg sm:w-auto"
              onClick={() => {
                const token = sessionStorage.getItem("accessToken");

                if (token) {
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

            {isContactModalOpen && (
              <ContactDetails
                onClose={() => setIsContactModalOpen(false)}
                fullName={
                  freeViewCount <= 0 && paidViewCount <= 0
                    ? `****${userDetails.full_name.slice(-1)}`
                    : userDetails.full_name
                }
                mobile={
                  freeViewCount <= 0 && paidViewCount <= 0
                    ? `********${userDetails.mobile_number.slice(-3)}`
                    : userDetails.mobile_number
                }
                showUpgradePrompt={freeViewCount <= 0 && paidViewCount <= 0}
              />
            )}

            {/* Favorite + Share */}
            <div className="flex justify-between w-full gap-2 sm:gap-4 sm:w-auto sm:justify-start">
              {/* Favorite */}
              <button
                type="button"
                className="p-2 text-xs font-normal text-white bg-white bg-opacity-50 backdrop-blur-sm"
                onClick={() => {
                  if (projects[0]?.project_details?.is_favorite) {
                    removeFromFavoritesRecommendedProperty(
                      projects[0]?.project_details?.favorite_id,
                    );
                  } else {
                    addToFavoritesRecommendedProperty(
                      projects[0]?.project_details?._id,
                    );
                  }
                }}
              >
                <Heart
                  size={22}
                  color={
                    projects[0]?.project_details?.is_favorite ? "red" : "gray"
                  }
                  fill={
                    projects[0]?.project_details?.is_favorite
                      ? "red"
                      : "transparent"
                  }
                  stroke={
                    projects[0]?.project_details?.is_favorite ? "red" : "gray"
                  }
                />
              </button>

              {/* Share */}
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 bg-white rounded-md cursor-pointer sm:w-10 sm:h-10"
                onClick={() => setIsShareModalOpen(true)}
              >
                <FiShare2 className="text-xl text-gray-600 sm:text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Section & Contact Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-auto md:h-[550px]">
        <div className="grid grid-cols-1 col-span-2 gap-1 md:grid-cols-1">
          <div className="flex flex-col gap-2 mt-6 md:flex-row">
            {images.length === 0 ? (
              // Case: No images → Cover takes full width
              <div className="w-full">
                <img
                  src={projects[0]?.project_details?.cover_image}
                  alt="Main"
                  className="rounded-2xl w-full h-64 md:h-[400px] object-cover"
                />
              </div>
            ) : (
              <>
                {/* Left Side - Main Image (Always shown) */}
                <div className="md:basis-[60%]">
                  <div className="relative">
                    <img
                      src={projects[0]?.project_details?.cover_image}
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

                {/* Right Side - Video and Other Images */}
                <div className="md:basis-[40%] flex flex-col justify-start gap-2 px-2">
                  {/* Property Video Section (if available) */}
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setShowAllImages(true)}
                  >
                    {images.length > 0 ? (
                      <div className="relative">
                        <img
                          src={images[0].image}
                          alt="Preview"
                          className="rounded-2xl w-full h-48 md:h-[195px] object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-2xl font-bold text-white rotate-[-30deg] opacity-60">
                            NoWayBroker
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-lg text-center text-gray-500">
                        No images available for this project.
                      </p>
                    )}
                  </div>

                  {/* Property Images Section */}
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {(() => {
                      const filteredImages = images.filter(
                        (img) =>
                          img.image !==
                          projects[0]?.project_details?.cover_image,
                      );

                      // Case 1: No images
                      if (filteredImages.length === 0) {
                        return (
                          <p className="mt-4 text-lg text-center text-gray-500">
                            No images available for this project.
                          </p>
                        );
                      }

                      //  Case 2: Only one image → Don't render anything
                      if (filteredImages.length === 1) {
                        return null;
                      }

                      // Case 3: More than one image → Render as usual
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
                                  (projects[0]?.project_details?.property_video
                                    ? 1
                                    : 0);

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
                </div>
              </>
            )}
          </div>
          {/* Sticky Tabs Section: Overview | Amenities | About Property | Location */}
          <div className="sticky top-0 z-30 mt-4 bg-white border rounded-lg shadow-sm">
            <div className="flex overflow-x-auto">
              {detailTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleDetailTabClick(tab)}
                  className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeDetailTab === tab.key
                    ? "border-rose-600 text-rose-600"
                    : "border-transparent text-gray-600 hover:text-rose-600"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {showAllImages && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <div className="relative w-11/12 p-6 overflow-auto bg-white rounded-lg h-5/6">
                <button
                  className="absolute text-3xl text-black top-4 right-4"
                  onClick={() => setShowAllImages(false)}
                >

                </button>

                <div className="sticky top-0 z-50 bg-white border rounded-lg shadow mt-4">
                  <div className="flex">
                    <button
                      onClick={() =>
                        document
                          .getElementById("project-location")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="px-5 py-3 text-sm font-medium hover:text-red-600"
                    >
                      Project Location
                    </button>

                    <button
                      onClick={() =>
                        document
                          .getElementById("overview")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="px-5 py-3 text-sm font-medium hover:text-red-600"
                    >
                      Overview
                    </button>

                    <button
                      onClick={() =>
                        document
                          .getElementById("amenities")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="px-5 py-3 text-sm font-medium hover:text-red-600"
                    >
                      Amenities
                    </button>

                    <button
                      onClick={() =>
                        document
                          .getElementById("location")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="px-5 py-3 text-sm font-medium hover:text-red-600"
                    >
                      Location
                    </button>
                  </div>
                </div>
                <h2 className="mb-4 text-2xl font-semibold">Gallery</h2>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  {/* All Images */}
                  {images.map((img, index) => (
                    <div className="relative">
                      <img
                        key={img._id || index}
                        src={img.image}
                        alt={`Gallery ${index}`}
                        className="object-cover w-full h-48 rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold text-white rotate-[-30deg] opacity-60">
                          NoWayBroker
                        </span>
                      </div>
                    </div>
                  ))}


                  {/* Video inside gallery if available */}
                  {projects[0]?.project_details?.property_video && (
                    <video
                      src={projects[0].project_details.property_video}
                      controls
                      className="object-cover w-full h-48 rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          )}


          {/* About Property Section */}
          {projects[0]?.project_details?.project_description && (
            <div
              ref={aboutPropertyRef}
              className="p-4 mt-4 bg-white shadow-md rounded-2xl"
            >
              <h3 className="text-xl font-bold text-gray-700">
                About{" "}
                {projects[0]?.project_details?.project_name || "the Property"}
              </h3>
              <p className="mt-2 text-lg text-gray-600">
                {projects[0]?.project_details?.project_description ||
                  "No description available."}
              </p>
            </div>
          )}

          {/* Property Location Section */}
          {projects[0]?.project_details?.address && (
            <div
              ref={projectLocationSectionRef}   // 👈 NEW (purvi projectLocationRef hota, to already top-level var sobat conflict karat hota)
              className="p-3 mt-6 bg-white rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-bold">Project Location</h3>
              <p className="mt-1 text-lg text-black">
                <img
                  src="/image/address_icon.png"
                  alt="Address Icon"
                  className="inline-block w-5 h-5 mr-2"
                />
                {projects[0].project_details.address}
              </p>
            </div>
          )}

          {/* Overview Section */}

          <div ref={overviewRef}>
            <h3 className="mb-4 text-2xl font-bold">Overview</h3>
            <div className="p-4 mt-4 bg-white rounded-lg shadow-sm">
              {(() => {
                const project = projects[0]?.project_details || {};

                // 🔥 Add / Remove anything from here manually
                // Whatever is here will show in UI
                const overviewFields = {
                  mark_as_featured: "Featured",
                  project_type: "Project Type",
                  furnished_type: "Furnishing",
                  total_floor: "Total Floors",
                  project_floor: "Project Floor",
                  bathroom: "Bathrooms",
                  balcony: "Balconies",
                  additional_rooms: "Additional Rooms",
                  number_of_minimum_bathrooms: "Minimum Bathrooms",
                  parking_availability: "Parking Availability",
                  total_number_parking: "Total Parking",
                  covered_parking: "Covered Parking",
                  uncovered_parking: "Open Parking",
                  pantry_option: "Pantry Option",
                  possession_status: "Possession Status",
                  possession_date: "Possession Date",
                  possession_start: "Possession Start",
                  age_of_property: "Property Age",
                  available_status: "Availability",
                  all_inclusive_price: "All Inclusive Price",
                  price_negotiable: "Price Negotiable",
                  tax_and_goverment_charges: "Tax & Government Charges",
                  maintenance_cost: "Maintenance Cost",
                  maintenance_frequency: "Maintenance Frequency",
                  maintenance_included: "Maintenance Included",
                  facing: "Facing",
                  view: "View",
                  flooring: "Flooring",
                  lift_availability: "Lift Availability",
                  water_source: "Water Source",
                  power_backup: "Power Backup",
                  security_system: "Security System",
                  construction_status: "Construction Status",
                  constructionOnLand: "Construction On Land",
                  launch_date: "Launch Date",
                  near_landmark: "Nearby Landmark",
                  property_no: "Property Number",
                  plot_no: "Plot Number",
                  block: "Block",
                  land_type: "Land Type",
                  breadthOfLand: "Land Breadth",
                  length_of_land: "Land Length",
                  area_type: "Area Type",
                  type_of_construction: "Construction ",
                  quality_rating: "Quality Rating",
                  central_AC: "Central AC",
                  office_type: "Office Type",
                  office_space_type: "Office Space ",
                  washroom_Check: "Washroom Available",
                  washroom: "Washroom",
                  commercial_washroom: "Commercial Washroom",
                  personal_washroom: "Personal Washroom",
                  selectedConstructionOnLand: "Construction On Land",
                  openSidesOfLand: "Open Sides Of Land",
                  no_of_open_sides: "Number Of Open Sides",
                  property_dimensions_breadth: "Property Breadth",
                  property_dimensions_length: "Property Length",
                  room_type: "Room Type",
                  attached_bathroom: "AttachedBathroom",
                  attached_balcony: "Attached Balcony",
                  transaction_type: "Transaction Type",
                  suited_for: "Suited For",
                  available_for: "Available For",
                  available_from: "Available From",
                  available_on: "Available On",
                  rent_duration: "Rent Duration",
                  available_for_company_lease: "Company Lease",
                  loan_availability: "Loan Availability",
                  virtual_tour_availability: "Virtual Tour",
                  video_url: "Video URL",
                  ups: "UPS",
                  oxygenDuct: "Oxygen Duct",
                  pantry: "Pantry",
                  conferenceRoom: "Conference Room",
                };

                //  THESE WILL NEVER SHOW
                const hiddenFields = [
                  "_id",
                  "favorite_id",
                  "is_favorite",
                  "user_id",
                  "cover_image",
                  "logo",
                  "brochure_doc",
                  "property_video",
                  "latitude",
                  "longitude",
                  "deleted_at",
                  "property_owner_image",
                ];

                return (
                  <div className="grid grid-cols-1 text-lg text-gray-700 md:grid-cols-2 gap-y-2 gap-x-4">
                    {Object.entries(overviewFields).map(([key, label], index) => {
                      // skip hidden fields
                      if (hiddenFields.includes(key)) return null;

                      const value = project[key];

                      // skip empty values
                      if (
                        value === null ||
                        value === undefined ||
                        value === "" ||
                        value === "NA" ||
                        value === "N/A" ||
                        value === false
                      ) {
                        return null;
                      }

                      // format date
                      let formattedValue = value;

                      if (
                        key.includes("date") ||
                        key.includes("_at") ||
                        key === "available_from" ||
                        key === "available_on"
                      ) {
                        try {
                          formattedValue = new Date(value).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          );
                        } catch (e) { }
                      }

                      // boolean handling
                      if (typeof value === "boolean") {
                        formattedValue = value ? "Yes" : "No";
                      }

                      return (
                        <div
                          key={index}
                          className="flex justify-between gap-4 p-3 border-b border-gray-100"
                        >
                          <span className="w-1/2 text-gray-500">{label}</span>

                          <span className="w-1/2 font-semibold text-black break-words text-right">
                            {formattedValue}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
          {/* Amenities Section */}
          {amenitiesList.length > 0 && (
            <div
              ref={amenitiesRef}
              className="p-4 mt-4 bg-white rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-bold">Amenities</h3>
              <div className="grid grid-cols-1 gap-4 mt-4 text-lg md:grid-cols-2 lg:grid-cols-4">
                {displayedAmenities.map((amenity, index) => (
                  // <p key={index} className="flex items-center text-lg">
                  //   <PiCricketThin className="mr-2 text-lg text-black" />{" "}
                  //   {amenity.name}
                  // </p>
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
              {amenitiesList.length > 8 && !showAllAmenities && (
                <p
                  className="mt-2 ml-4 text-lg font-bold my-text cursor-pointer"
                  onClick={toggleAmenities}
                >
                  +{amenitiesList.length - 8} More
                </p>
              )}
            </div>
          )}

          {/* Floors, Walls, Ceilings, Counters, Fittings/Fixtures, Door and Window, Electrical, Security System Sections */}
          {[
            "Floors",
            "Walls",
            "Ceilings",
            "Counters",
            "Fittings/Fixtures",
            "Door and Window",
            "Electrical",
            "Security System",
          ].map((section, index) => {
            const validItems = (
              projects[0]?.finishingData[section] || []
            ).filter(([_, value]) => value && value !== "N/A");

            // If no valid items, skip rendering the whole section
            if (validItems.length === 0) return null;

            return (
              <div
                key={index}
                className="p-4 mt-4 text-lg bg-white rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-bold">{section}</h3>
                <div className="grid grid-cols-1 mt-4 text-gray-700 md:grid-cols-2 gap-y-2">
                  {validItems.map(([key, value], i) => (
                    <div
                      key={i}
                      className="flex justify-start p-2 border-gray-200"
                    >
                      <span className="w-1/2 text-gray-500">{key}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Location Section with Map */}
          <div
            ref={locationRef}
            className="p-4 mt-4 bg-white shadow-sm rounded-2xl"
          >
            <h2 className="text-xl font-bold text-gray-900">Location</h2>
            <div className="mt-4 overflow-hidden rounded-lg">
              <iframe
                className="w-full h-96 rounded-2xl"
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
                  to={`/projectbuilder/${userDetails?._id}`}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="block overflow-hidden no-underline shadow-md rounded-2xl hover:no-underline"
                >
                  <img
                    src={
                      userDetails.profile_image
                        ? userDetails.profile_image
                        : "/image/app.png"
                    }
                    alt="Agent"
                    className="object-contain w-16 h-16 rounded-full"
                  />
                </Link>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold">
                    {userDetails.full_name}
                  </span>
                  <span className="text-sm font-semibold">
                    {userDetails.user_type}
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
        </div>
      </div>

      {/* Other Projects Section Start */}
      <div className="py-4 mt-8 bg-white rounded-2xl">
        <div className="flex flex-col items-center justify-between px-4 md:flex-row">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
              View other Projects
            </h2>
            <p className="text-base text-gray-500">
              Go from browsing to buying
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              className="px-4 py-2 text-sm text-rose-700 bg-white my-border rounded-lg sm:px-6"
              onClick={handleViewAll}
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
              className="p-2 text-lg font-semibold text-gray-700 bg-white rounded-full shadow-md sm:text-2xl hover:shadow-lg "
              onClick={() => sliderRef.current.slickNext()}
            >
              <GoArrowRight className="text-3xl text-black" />
            </button>
          </div>
        </div>

        {/* <Slider ref={sliderRef} {...settings} className="mx-auto mt-4">
          {projectList
            .filter(
              (project) =>
                project?.cover_image &&
                project?.project_name &&
                project?.average_project_price,
            )
            .map((project, index) => (
              <div
                key={index}
                className="px-4 cursor-pointer"
                onClick={() => history.push(`/projectdetail/${project._id}`)}
              >
                <div className="max-w-[500px] w-full bg-white rounded-3xl">
                  <div className="relative">
                    <img
                      src={project.cover_image}
                      alt={project.project_name}
                      className="object-cover w-full h-64 md:h-96 rounded-3xl"
                    />

                    <div className="absolute bottom-0 flex flex-col justify-end h-24 p-4 transform -translate-x-1/2 left-1/2 w-80 bg-gray-800/60 backdrop-blur-md rounded-t-3xl">
                      <div className="absolute flex items-center justify-center overflow-hidden transform -translate-x-1/2 bg-white border-2 border-gray-200 rounded-full shadow-lg -top-7 left-1/2 w-14 h-14">
                        <img
                          src={project.logo}
                          alt="Project Logo"
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <h3 className="text-xl font-semibold text-center text-white">
                        {project.project_name}
                      </h3>
                    </div>
                  </div>

                  <div className="px-4">
                    <div className="p-3 text-center bg-white shadow-sm rounded-b-3xl">
                      <p className="text-lg text-gray-500 sm:text-base truncate">
                        {project.project_description || "No description"}
                      </p>
                      <h4 className="mt-2 text-lg font-bold text-gray-800 sm:text-md">
                        {formatAverageProjectPrice(
                          project.average_project_price,
                        )}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </Slider> */}
        <Slider ref={sliderRef} {...settings} className="mx-auto mt-4">
          {projectList
            .filter(
              (project) =>
                project?.cover_image &&
                project?.project_name &&
                project?.average_project_price,
            )
            .map((project, index) => (
              <div key={index} className="px-2 md:px-3">
                <div className="w-full overflow-hidden bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <img
                      src={project.cover_image}
                      alt={project.project_name}
                      className="w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[320px] object-cover rounded-t-2xl cursor-pointer"
                      onClick={() => history.push(`/projectdetail/${project._id}`)}
                    />

                    {/* Heart + Share */}
                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                      <button
                        className="bg-gray-800/60 backdrop-blur-sm p-2 rounded-full shadow"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!userId) {
                            setIsLoginModalOpen(true);
                            return;
                          }
                          if (project.is_favorite) {
                            removeFromFavoritesRecommendedProperty(project.favorite_id);
                          } else {
                            addToFavoritesRecommendedProperty(project._id);
                          }
                        }}
                      >
                        <Heart
                          size={20}
                          stroke={project.is_favorite ? "none" : "white"}
                          color={project.is_favorite ? "red" : "rgba(75, 85, 99, 0.4)"}
                          fill={project.is_favorite ? "red" : "rgba(75, 85, 99, 0.4)"}
                          strokeWidth={2}
                        />
                      </button>
                      <FontAwesomeIcon
                        icon={faShareNodes}
                        className="text-gray-500 bg-white p-2 rounded shadow cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsShareModalOpen(true);
                        }}
                      />
                    </div>

                    {/* Logo + Project Name overlay */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[90%] sm:w-[85%] md:w-[80%] h-[110px] md:h-[120px] bg-gray-800/60 backdrop-blur-md flex flex-col justify-end p-4 rounded-t-3xl">
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 w-[70px] h-[70px] md:w-[80px] md:h-[80px] rounded-full flex justify-center items-center shadow-lg overflow-hidden">
                        <img src={project.logo} alt="Project Logo" className="object-cover w-full h-full" />
                      </div>
                      <h3 className="text-center text-white text-lg md:text-2xl font-bold line-clamp-2 min-h-[48px] mt-4">
                        {project.project_name || "No Project Name Available"}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div
                    className="p-4 bg-white rounded-b-2xl cursor-pointer"
                    onClick={() => history.push(`/projectdetail/${project._id}`)}
                  >
                    {/* Row 1: Project Name + Furnished Type */}
                    <div className="flex items-start justify-between gap-3 mb-0">
                      <h3 className="flex-1 m-0 text-lg font-semibold leading-6 text-gray-900 truncate">
                        {project.project_name || "N/A"}
                      </h3>
                      {project.furnished_type && (
                        <span className="flex-shrink-0 text-sm font-medium leading-6 text-[#E85B6B] whitespace-nowrap">
                          {project.furnished_type}
                        </span>
                      )}
                    </div>

                    {/* Row 2: Subtitle */}
                    <p className="mt-0 mb-1 text-sm leading-5 text-gray-600 truncate">
                      {project.congfigurations
                        ? project.congfigurations.includes("BHK")
                          ? project.congfigurations
                          : project.congfigurations.split(",").map((c) => `${c.trim()} BHK`).join(", ")
                        : ""}{" "}
                      {project.project_type} in {project.address_area || ""},{" "}
                      {project.city_name || ""}
                    </p>

                    {/* Row 3: Price */}
                    <div className="flex items-center mb-1">
                      <span className="text-2xl font-bold">
                        {formatAverageProjectPrice(project.average_project_price)}
                      </span>
                    </div>

                    {/* Row 4: Features Grid */}
                    <div className="grid grid-cols-3 py-3 border-t border-b border-gray-100">
                      <div className="flex items-center gap-2 px-1 min-w-0">
                        <Building2 size={20} className="text-gray-700 flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <p className="m-0 text-sm font-semibold leading-4 truncate">
                            {project.project_type || "N/A"}
                          </p>
                          <p className="m-0 text-xs leading-4 text-gray-500">Type</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-1 border-l border-gray-200 min-w-0">
                        <Ruler size={20} className="text-gray-700 flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <p className="m-0 text-sm font-semibold leading-4 truncate">
                            {project.congfigurations
                              ? project.congfigurations.includes("BHK")
                                ? project.congfigurations.split(",")[0].trim()
                                : `${project.congfigurations.split(",")[0].trim()} BHK`
                              : "N/A"}
                          </p>
                          <p className="m-0 text-xs leading-4 text-gray-500">Config</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-1 border-l border-gray-200 min-w-0">
                        <FaMapMarkerAlt size={16} className="text-gray-700 flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <p className="m-0 text-sm font-semibold leading-4 truncate">
                            {project.address_area || "N/A"}
                          </p>
                          <p className="m-0 text-xs leading-4 text-gray-500">Location</p>
                        </div>
                      </div>
                    </div>

                    <hr className="my-1 border-gray-100" />

                    {/* Row 5: Posted By + Share */}
                    <div className="flex items-center justify-between pt-1 pb-2 text-[13px] text-gray-600">
                      <div className="flex items-center flex-wrap min-w-0">
                        <span>Posted by {project.user_type || "Builder"}</span>
                        {project.days_since_created && (
                          <>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="whitespace-nowrap">
                              {project.days_since_created} days ago
                            </span>
                          </>
                        )}
                      </div>
                      <FontAwesomeIcon
                        icon={faShareNodes}
                        className="ml-2 text-[17px] text-gray-500 cursor-pointer hover:text-blue-500"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsShareModalOpen(true);
                        }}
                      />
                    </div>

                    {/* Row 6: Owner Details */}
                    <div className="flex items-center pt-2">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 overflow-hidden rounded-full bg-blue-100">
                        {project.property_owner_image &&
                          !project.property_owner_image.includes("default_profile") ? (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/media/${project.property_owner_image}`}
                            alt={project.connect_to_name || "Owner"}
                            className="object-cover w-full h-full rounded-full"
                          />
                        ) : (
                          <span className="text-2xl text-blue-600 font-bold">
                            {(project.connect_to_name || "B")[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center ml-3">
                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {project.connect_to_name || "Builder"}
                        </span>
                        <div className="w-px h-4 mx-3 bg-gray-300"></div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {project.user_type || "Builder"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </Slider>
      </div>
      {/* Other Projects Section End */}
    </div >
  );
};



export default ProjectDetail;