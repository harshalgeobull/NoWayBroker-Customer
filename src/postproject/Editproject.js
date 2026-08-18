import React, { useState, useEffect, useRef } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { ToWords } from "to-words";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { Plus } from "lucide-react"; // ADDED — used by the "Add Property" button copied from AddNewProject.js
import axios from "axios";
import { Trash } from "@phosphor-icons/react";
import { FaFilePdf } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { MdErrorOutline } from "react-icons/md";
import { Country, State } from "country-state-city";
import { FaRupeeSign } from "react-icons/fa";
import { useParams } from "react-router-dom";

const Editproject = () => {
  // Define state for the form fields
  const [projectName, setProjectName] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const userId = sessionStorage.getItem("accessToken");
  const user_type = sessionStorage.getItem("user_type");
  const user_name = sessionStorage.getItem("user_name");
  const Mobile_Number = sessionStorage.getItem("Mobile_Number");
  const user_email = sessionStorage.getItem("user_email");
  const [buildingType, setBuildingType] = useState("Residential");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [allCountries, setAllCountries] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [address, setAddress] = useState("");
  const [addressArea, setAddressArea] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [subLocality, setSubLocality] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const autoCompleteRef = useRef(null);
  const GOOGLE_MAPS_API_KEY = "AIzaSyAt8bj4UACvakZfiSy-0c1o_ivfplm7jEU";
  // const GOOGLE_MAPS_API_KEY = "AIzaSyCY4i1-nQFNVTSYetMw7aofzBRwGvCH_Ms";
  const [totalProjectSize, setTotalProjectSize] = useState("");
  const [averagePrice, setAveragePrice] = useState("");
  const [configurations, setConfigurations] = useState([]);
  const [launchDate, setLaunchDate] = useState("");
  const [possessionStart, setPossessionStart] = useState("");
  const [constructionStatus, setConstructionStatus] = useState("");
  const [reraId, setReraId] = useState("");
  const [floorLivingDining, setFloorLivingDining] = useState("");
  const [floorKitchenToilet, setFloorKitchenToilet] = useState("");
  const [floorBedroom, setFloorBedroom] = useState("");
  const [floorBalcony, setFloorBalcony] = useState("");
  const [wallsLivingDining, setWallsLivingDining] = useState("");
  const [wallServantRoom, setWallCeilingsServantRoom] = useState("");
  const [wallsKitchenToilet, setWallsKitchenToilet] = useState("");
  const [wallsServantRoom, setWallsServantRoom] = useState("");
  const [ceiling, setCeiling] = useState("");
  const [ceilingsServantRoom, setCeilingsServantRoom] = useState("");
  const [countersKitchenToilet, setCountersKitchenToilet] = useState("");
  const [fittingsKitchenToilet, setFittingsKitchenToilet] = useState("");
  const [fittingsServantRoomToilet, setFittingsServantRoomToilet] =
    useState("");
  const [internalDoor, setInternalDoor] = useState("");
  const [externalGlazing, setExternalGlazing] = useState("");
  const [electrical, setElectrical] = useState("");
  const [backup, setBackup] = useState("");
  const [securitySystem, setSecuritySystem] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [video, setVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const videoInputRef = useRef(null);
  const [videoSource, setVideoSource] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [virtualTourLink, setVirtualTourLink] = useState("");
  const history = useHistory();
  const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 });
  const [amenitiesList, setAmenitiesList] = useState([]);
  const calendarRef = useRef(null);
  const possessionStartRef = useRef(null);
  const [showUpcomingProjectCount, setShowUpcomingProjectCount] =
    useState(false);
  const [showFeaturePopup, setShowFeaturePopup] = useState(false);
  const [isCountLoaded, setIsCountLoaded] = useState(false);
  const [upcomingProjectCount, setUpcomingProjectCount] = useState(0);
  const [featureCount, setFeatureCount] = useState(0);
  const [brochureDoc, setBrochureDoc] = useState(null);
  const brochureInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  const [companyLogo, setCompanyLogo] = useState(null);
  const companyLogoInputRef = useRef(null);
  const [officeSubType, setOfficeSubType] = useState("");
  const [landType, setLandType] = useState("");
  const [retailType, setRetailType] = useState("");
  const [storageType, setStorageType] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [hospitalityType, setHospitalityType] = useState("");
  const [RetailSubType, setRetailSubType] = useState("");
  const [retailLocation, setRetailLocation] = useState("");
  const [retailWashroom, setRetailWashroom] = useState("");
  const [totalNumberParking, setTotalNumberParking] = useState("");
  const [parkingTypes, setParkingTypes] = useState("");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const { _id } = useParams();
  const [isModified, setIsModified] = useState(false);

  // ADDED FROM AddNewProject.js — required for multi-property support
  const emptyProjectProperty = {
    project_type: "",
    sub_project_type: "",
    retail_location: "",
    sub_sub_project_type: "",
    price: "",
    bhk_type: "",
    carpet_area: "",
    carpet_area_in: "",
    area: "",
    area_in: "",
    bathroom: "",
    commercial_washroom: "",
    total_floor: "",
    project_floor: "",
    purchase_type: "",
    no_of_open_sides: "",
    parking_types: "",
    number_of_seats_available: "",
    no_of_cabines: "",
    no_of_meeting_Rooms: "",
    no_of_conference_room: "",
    total_number_of_rooms: "",
    facing: "",
    property_dimensions_length: "",
    property_dimensions_breadth: "",
    age_of_property: "",
    furnished_type: "",
    balcony: "",
    pantry_option: "",
    central_AC: "",
    reception_area: "",
    personal_washroom: "",
  };

  const [projectProperties, setProjectProperties] = useState([
    { ...emptyProjectProperty },
  ]);
  const handleProjectPropertyChange = (index, key, value) => {
    setProjectProperties((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [key]: value,
      };
      return updated;
    });
  };
  const handleDeleteProjectProperty = (index) => {
    if (projectProperties.length === 1) {
      toast.error("At least one project property is required.");
      return;
    }

    setProjectProperties((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const options = [
    { value: "Pooja Room", label: "Pooja Room" },
    { value: "Study Room", label: "Study Room" },
    { value: "Servant Room", label: "Servant Room" },
    { value: "Store Room", label: "Store Room" },
  ];
  const builderFloorOptions = ["Single Floor", "Duplex", "Triplex"];
  const constructionOptions = ["Shed", "Rooms", "Washroom", "Others"];
  const CustomMultiValue = (props) => {
    return (
      <div className="flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded">
        {props.children}
      </div>
    );
  };

  const buildPrompt = () => {
    return `
Write a professional real estate project description.

STRICT INSTRUCTIONS:
- The description MUST be between 600 and 700 characters ONLY
- Do NOT exceed 700 characters
- Do NOT go below 600 characters
- Write everything in ONE paragraph
- Do NOT use bullet points or line breaks

Project Details:
- Project Name: ${projectName?.trim() || ""}
- Type: ${propertyType || ""}
- Building Type: ${buildingType || ""}
- City: ${city?.trim() || ""}
- Area: ${addressArea || ""}
- Average Price: ₹${formData?.average_project_price || ""}
- Configurations: ${configurations || ""}
- Construction Status: ${constructionStatus || ""}
- Total Project Size: ${totalProjectSize || ""}
- Launch Date: ${launchDate || ""}
- Possession Start: ${possessionStart || ""}

Make it engaging, attractive, and human-like.
`;
  };

  const generateDescription = async () => {
    try {
      setIsGeneratingDescription(true);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: buildPrompt(),
            },
          ],
          temperature: 0.7,
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      const generatedDescription =
        response?.data?.choices?.[0]?.message?.content || "";

      setDescription(generatedDescription);

      setFormData((prev) => ({
        ...prev,
        project_description: generatedDescription,
      }));

      toast.success("Description generated successfully");
    } catch (error) {
      console.log("Generate Description Error:", error);

      toast.error("Failed to generate description");
    } finally {
      setIsGeneratingDescription(false);
    }
  };
  const officeOptions = [
    "Ready to move office space",
    "Bare shell office space",
    "Co-working office space",
  ];

  const landOptions = [
    "Commercial Land/Inst. Land",
    "Industrial Lands/Plots",
    "Agricultural/Farm Land",
  ];

  const retailOptions = ["Commercial Shops", "Commercial Showrooms"];

  const storageOptions = ["Ware House", "Cold Storage"];

  const industryOptions = ["Factory", "Manufacturing"];

  const hospitalityOptions = ["Hotel/Resorts", "Guest-House/Banquet-Halls"];
  const retailLocationOptions = [
    "Mall",
    "Commercial Project",
    "Residential Project",
    "Retail Complex/Building",
    "Market/High Street",
    "Others",
  ];
  const handleInputChange = (keyOrEvent, value) => {
    if (typeof keyOrEvent === "string") {
      setFormData((prev) => ({
        ...prev,
        [keyOrEvent]: value,
      }));
    } else {
      const { name, value } = keyOrEvent.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  useEffect(() => {
    const countries = Country.getAllCountries();
    setAllCountries(countries);
  }, []);

  useEffect(() => {
    if (country) {
      const states = State.getStatesOfCountry(country);
      setAllStates(states);
    } else {
      setAllStates([]);
    }
  }, [country]);

  // ADDED FROM AddNewProject.js — keeps "Price Range" in sync with all properties
  useEffect(() => {
    const prices = projectProperties
      .map((property) => Number(property.price))
      .filter((price) => !isNaN(price) && price > 0);

    if (prices.length === 0) {
      setAveragePrice("");
      return;
    }

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    setAveragePrice(
      minPrice === maxPrice
        ? `${minPrice}`
        : `${minPrice}-${maxPrice}`
    );
  }, [projectProperties]);

  // ADDED FROM AddNewProject.js — keeps "Configurations" in sync with all properties
  useEffect(() => {
    const bhkOrder = [
      "Studio/Single Room",
      "1 BHK",
      "1.5 BHK",
      "2 BHK",
      "2.5 BHK",
      "3 BHK",
      "3.5 BHK",
      "4 BHK",
      "5 BHK",
      "6 BHK",
      "6+ BHK",
    ];

    const selected = [
      ...new Set(
        projectProperties
          .map((property) => property.bhk_type)
          .filter(Boolean)
      ),
    ];

    const sorted = bhkOrder.filter((bhk) => selected.includes(bhk));

    const formatted = sorted.map((bhk) => {
      if (bhk === "Studio/Single Room") return bhk;
      return bhk.replace(" BHK", "");
    });

    if (formatted.length === 0) {
      setConfigurations("");
      return;
    }

    const hasStudio = formatted.includes("Studio/Single Room");
    const onlyNumbers = formatted.filter((item) => item !== "Studio/Single Room");

    let result = "";

    if (hasStudio) {
      result += "Studio/Single Room";
      if (onlyNumbers.length) {
        result += ", ";
      }
    }

    if (onlyNumbers.length) {
      result += `${onlyNumbers.join(", ")} BHK`;
    }

    setConfigurations(result);
  }, [projectProperties]);

  const formatAverageProjectPrice = (price) => {
    if (!price) return "";

    if (typeof price === "string" && price.includes("-")) {
      const parts = price.split("-").map((p) => p.trim());
      return (
        <>
          {parts.map((p, idx) => {
            const num = parseInt(p);
            if (isNaN(num)) return null;

            return (
              <span key={idx} className="inline-flex items-center">
                <FaRupeeSign className="inline-block mr-1" />
                {num}
                {idx === 0 && " - "}
              </span>
            );
          })}
        </>
      );
    }

    const num = parseInt(price);
    if (isNaN(num)) return "";

    return (
      <span className="inline-flex items-center">
        <FaRupeeSign className="inline-block mr-1" />
        {num}
      </span>
    );
  };

  const handleBrochureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 50) {
      alert("File size exceeds 50MB limit");
      return;
    }

    setBrochureDoc(file);
  };

  const handleBrochureDelete = () => {
    setBrochureDoc(null);
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
      console.log(countData);

      if (countData) {
        const upcomingCount = countData.upcoming_project_count || 0;
        const featureCount = countData.mark_as_developer_count || 0;

        setUpcomingProjectCount(upcomingCount);
        setFeatureCount(featureCount);

        // Check conditions *after* setting count
        if (upcomingCount <= 0) {
          setShowUpcomingProjectCount(true);
        } else {
          setShowUpcomingProjectCount(false);
        }
      }

      setIsCountLoaded(true);
    } catch (error) {
      console.error("Error checking post limits:", error);
      setIsCountLoaded(true); // prevent infinite loading state
    }
  };

  useEffect(() => {
    if (userId) {
      checkPostLimits();
    }
  }, [userId]);

  const handlePossessionStartChange = (e) => {
    setPossessionStart(e.target.value);
  };

  const openPossessionStartCalendar = () => {
    if (possessionStartRef.current) {
      possessionStartRef.current.showPicker();
    }
  };

  const handleDateChange = (e) => {
    setLaunchDate(e.target.value);
  };

  const openCalendar = () => {
    if (calendarRef.current) {
      calendarRef.current.showPicker();
    }
  };

  const steps = [
    "Basic Info",
    "Address",
    "Project Details",
    "Amenities",
    "Photos / Videos",
  ];
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () =>
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const buildingTypes = ["Residential", "Commercial"];
  const residentialTypes = [
    "Apartment",
    // "Plot",
    "Independent House/Villa",
    "Independent/Builder Floor",
    "1RK/Studio Apartment",
    "Service Apartment",
    "Farmhouse",
    "Other",
  ];

  const commercialTypes = [
    "Office",
    "Retail",
    "Plot/Land",
    // "Office Space in IT/SEZ",
    "Storage",
    // "Warehouse",
    "Industry",
    "Hospitality",
    "Other",
  ];

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const toggleAmenity = (amenity) => {
    console.log("Clicked Amenity:", amenity);
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity],
    );
  };

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get_amenities`,
        );
        if (response.data.status === 1) {
          setAmenitiesList(response.data.data);
        } else {
          console.error("Failed to fetch amenities");
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
      }
    };

    fetchAmenities();
  }, []);

  const [formData, setFormData] = useState({
    project_name: "",
    average_project_price: "",

    bhk_type: "",

    area: "",
    area_in: "",

    carpet_area: "",
    carpet_area_unit: "",

    project_image: null,

    possession_status: "",

    possession_date: "",

    all_inclusive_price: "",
    price_negotiable: "",
    tax_and_goverment_charges: "",
    electricity_and_water_charges: "",

    furnished_type: "",
    parking_availability: "",

    covered_parking: "",
    uncovered_parking: "",

    pantry_option: "",

    bathroom: "",

    office_type: "",

    project_description: "",

    builder_floor_type: "",

    total_floor: "",
    project_floor: "",

    central_AC: "",

    no_of_cabines: "",
    no_of_meeting_Rooms: "",
    no_of_conference_room: "",

    number_of_seats_available: "",

    facing: "",

    age_of_property: "",

    lift_availability: "",

    balcony: "",

    reception_area: "",

    total_beds: "",

    parking_types: "",

    room_type: "",

    no_of_peoples: "",

    available_beds: "",

    attached_bathroom: "",
    attached_balcony: "",

    available_for: "",

    personal_washroom: "",

    property_dimensions_breadth: "",
    property_dimensions_length: "",

    type_of_construction: "",

    possession_by: "",

    no_of_open_sides: "",

    land_type: "",

    openSidesOfLand: "",

    length_of_land: "",
    breadthOfLand: "",

    address: "",
    city_name: "",
    state: "",
    country: "",
    zip_code: "",

    launch_date: "",
    possession_start: "",
    construction_status: "",

    rera_id: "",
  });

  const handleNext = () => {
    const updatedData = { ...formData };
    updatedData[`step${activeStep + 1}`] = currentStepData;
    setFormData(updatedData);

    // Add current step to completedSteps
    setCompletedSteps((prev) => [...new Set([...prev, activeStep])]);

    nextStep();
  };

  const [currentStepData, setCurrentStepData] = useState({});

  const [fileData, setFileData] = useState([]);

  const handleDelete = async (index, imageItem) => {
    try {
      // OLD IMAGE FROM API
      if (imageItem?._id) {
        const formData = new FormData();

        formData.append("project_image_id", imageItem._id);

        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/cust_api/remove_project_image`,
          {
            data: formData,
          },
        );

        if (response?.data?.status === 1) {
          toast.success("Image deleted successfully");

          setImages((prev) => prev.filter((_, i) => i !== index));
        } else {
          toast.error(response?.data?.error || "Failed to delete image");
        }
      }

      // NEWLY ADDED IMAGE
      else {
        setImages((prev) => prev.filter((_, i) => i !== index));

        setFileData((prev) => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.log("DELETE IMAGE ERROR:", error);

      toast.error("Failed to delete image");
    }
  };

  const imageInputRef = useRef(null);

  const [images, setImages] = useState([]);

  const imageInputRef2 = useRef(null);

  const handleImageUpload2 = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxImages = 5;

    let oversizeFound = false;
    let oversizedFiles = [];
    let newImages = [];
    let newFiles = []; // <-- for original file objects

    for (let file of files) {
      if (file.size > maxSize) {
        oversizeFound = true;
        oversizedFiles.push(file.name);
      } else {
        newImages.push(URL.createObjectURL(file)); // for preview
        newFiles.push(file); // for backend upload
      }
    }

    if (oversizeFound) {
      toast.error(
        `The following images are larger than 10MB: ${oversizedFiles.join(", ")}`,
      );
    }

    if (images.length + newImages.length > maxImages) {
      toast.error("You can only upload a maximum of 5 images.");
      return;
    }

    setImages((prev) => [...prev, ...newImages]);
    setFileData((prev) => [...prev, ...newFiles]);

    e.target.value = "";
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (file.size > maxSize) {
      toast.error(
        "Video file is larger than 50MB. Please upload a smaller file.",
      );
      return;
    }

    if (video) {
      toast.error("You can only upload one video.");
      return;
    }

    setVideo(file);
    setVideoFile(file);
  };

  const handleVideoDelete = () => {
    setVideo(null);
    setVideoFile(null);

    setFormData((prev) => ({
      ...prev,
      remove_video: "Yes",
    }));
  };

  const handelCoverImageDelete = () => {
    setCoverImage(null);

    setFormData((prev) => ({
      ...prev,
      remove_cover_image: "Yes",
    }));
  };

  // Inside your component
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("You must be logged in to submit a project.");
      return;
    }

    const isValid = validateStepFields();

    if (!isValid) {
      toast.error("Please fill all required fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    const apiFormData = new FormData();

    try {
      const projectData = {
        // MAIN
        project_id: _id,

        user_id: userId,

        user_type: user_type,

        connect_to_name: user_name,

        connect_to_no: Mobile_Number,

        connect_to_email: user_email,

        // BASIC
        project_name: formData.project_name || "",

        mark_as_featured:
          formData.mark_as_featured === true ||
            formData.mark_as_featured === "Yes"
            ? "Yes"
            : "No",

        building_type: buildingType || "",

        project_type: propertyType || "",

        // PRICE
        // NOTE — was pulling from stale formData; now falls back to the
        // live computed price range / primary property so it's never empty
        // when properties have been added or edited.
        average_project_price:
          formData.average_project_price ||
          averagePrice ||
          projectProperties?.[0]?.price ||
          "",

        all_inclusive_price: formData.all_inclusive_price || "",

        price_negotiable: formData.price_negotiable || "",

        tax_and_goverment_charges: formData.tax_and_goverment_charges || "",

        electricity_and_water_charges:
          formData.electricity_and_water_charges || "",

        custom_deposit_amount: formData.custom_deposit_amount || "",

        // ADDRESS
        address: formData.address || address || "",

        city_name: formData.city_name || city || "",

        state: formData.state || state || "",

        country: formData.country || country || "",

        zip_code: formData.zip_code || zipCode || "",

        latitude: latitude || "",

        longitude: longitude || "",

        // AREA
        // *** FIX ***
        // projectProperties[0] now takes priority over formData. formData's
        // area / area_in / carpet_area / carpet_area_unit are populated once
        // from the API on load (fetchProjectDetails) and NEVER updated again
        // — only projectProperties gets updated when the user edits the
        // dropdowns in "Project Details". So on submit the OLD/stale value
        // from formData (e.g. "Sq Ft") was winning over the correct, current
        // value (e.g. "sq.ft") picked in the UI, causing the backend's
        // `{"area_in":["\"Sq Ft\" is not a valid choice."]}` 400 error.
        area: projectProperties?.[0]?.area || formData.area || "",

        area_in: projectProperties?.[0]?.area_in || formData.area_in || "",

        carpet_area:
          projectProperties?.[0]?.carpet_area || "",

        carpet_area_in:
          projectProperties?.[0]?.carpet_area_in || "",

        total_project_size: totalProjectSize || "",

        // PROPERTY DETAILS
        // *** FIX *** same stale-formData issue as area/area_in above.
        bhk_type: projectProperties?.[0]?.bhk_type || formData.bhk_type || "",

        furnished_type: formData.furnished_type || "",

        facing: formData.facing || "",

        bathroom: formData.bathroom || "",

        balcony: formData.balcony || "",

        washroom: formData.washroom || "",

        age_of_property: formData.age_of_property || "",

        possession_status: formData.possession_status || "",

        possession_date: formData.possession_date || "",

        possession_by: formData.possession_by || "",

        available_from: formData.available_from || "",

        available_on: formData.available_on || "",

        // FLOOR
        total_floor: formData.total_floor || "",

        project_floor: formData.project_floor || "",

        builder_floor_type: formData.builder_floor_type || "",

        // PARKING
        parking_availability: formData.parking_availability || "",

        covered_parking:
          formData.parking_availability === "No"
            ? "NA"
            : formData.covered_parking || "NA",

        uncovered_parking:
          formData.parking_availability === "No"
            ? "NA"
            : formData.uncovered_parking || "NA",

        parking_types: formData.parking_types || "",

        // OFFICE
        office_type: formData.office_type || "",

        central_AC: formData.central_AC || "",

        reception_area: formData.reception_area || "",

        pantry_option: formData.pantry_option || "",

        personal_washroom: formData.personal_washroom || "",

        no_of_cabines: formData.no_of_cabines || "",

        no_of_meeting_Rooms: formData.no_of_meeting_Rooms || "",

        no_of_conference_room: formData.no_of_conference_room || "",

        number_of_seats_available: formData.number_of_seats_available || "",

        investment_options: formData.investment_options || "",

        purchase_type: formData.purchase_type || "",

        // LAND
        land_type: formData.land_type || "",

        selectedConstructionOnLand: formData.selectedConstructionOnLand || "",

        openSidesOfLand: formData.openSidesOfLand || "",

        no_of_open_sides: formData.no_of_open_sides || "",

        type_of_construction: formData.type_of_construction || "",

        length_of_land: formData.length_of_land || "",

        breadthOfLand: formData.breadthOfLand || "",

        property_dimensions_length: formData.property_dimensions_length || "",

        property_dimensions_breadth: formData.property_dimensions_breadth || "",

        // HOSPITALITY
        total_number_of_rooms: formData.total_number_of_rooms || "",

        quality_rating: formData.quality_rating || "",

        // PG
        available_for: formData.available_for || "",

        room_type: formData.room_type || "",

        no_of_peoples: formData.no_of_peoples || "",

        total_beds: formData.total_beds || "",

        available_beds: formData.available_beds || "",

        attached_balcony: formData.attached_balcony || "",

        attached_bathroom: formData.attached_bathroom || "",

        // RETAIL
        sub_sub_project_type: formData.sub_sub_project_type || "",

        // PROJECT INFO
        project_description: description || "",

        additional_rooms: formData.additional_rooms?.join(",") || "",

        // PROJECT EXTRA
        configurations: configurations || "",

        launch_date: launchDate || "",

        possession_start: possessionStart || "",

        construction_status: constructionStatus || "",

        rera_id: reraId || "",

        // SPECIFICATIONS
        floor_living_dining: floorLivingDining || "",

        floor_kitchen_toilet: floorKitchenToilet || "",

        floor_bedroom: floorBedroom || "",

        floor_balcony: floorBalcony || "",

        walls_living_dining: wallsLivingDining || "",

        walls_kitchen_toilet: wallsKitchenToilet || "",

        walls_servant_room: wallsServantRoom || "",

        ceiling: ceiling || "",

        ceilings_servant_room: ceilingsServantRoom || "",

        counters_kitchen_toilet: countersKitchenToilet || "",

        fittings_fixtures_kitchen_toilet: fittingsKitchenToilet || "",

        fittings_fixtures_servant_room_toilet: fittingsServantRoomToilet || "",

        door_window_internal_door: internalDoor || "",

        door_window_external_glazing: externalGlazing || "",

        electrical: electrical || "",

        backup: backup || "",

        security_system: securitySystem || "",

        // AMENITIES
        amenities: selectedAmenities.join(","),

        // VIDEO
        video_url: videoURL || "",

        video_url_type: videoSource || "",

        virtual_tour_availability: virtualTourLink || "No",
      };

      // APPEND ALL DATA
      Object.entries(projectData).forEach(([key, value]) => {
        apiFormData.append(key, value ?? "");
      });

      // FILES
      if (coverImage instanceof File) {
        apiFormData.append("cover_image", coverImage);
      }

      if (videoFile instanceof File) {
        apiFormData.append("property_video", videoFile);
      }

      if (brochureDoc instanceof File) {
        apiFormData.append("brochure_doc", brochureDoc);
      }

      if (companyLogo instanceof File) {
        apiFormData.append("logo", companyLogo);
      }

      // EXTRA
      if (addressArea) {
        apiFormData.append("address_area", addressArea);
      }
      console.log(
        "Project Properties:",
        JSON.stringify(projectProperties, null, 2)
      );
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/edit_project`,
        {
          method: "POST",
          body: apiFormData,
        },
      );

      const result = await response.json();

      console.log("EDIT PROJECT RESPONSE:", result);

      if (result.status === 1) {
        // UPDATE PROJECT PROPERTIES
        try {
          for (const property of projectProperties) {
            const propertyFormData = new FormData();

            Object.entries(property).forEach(([key, value]) => {
              if (value !== null && value !== undefined) {
                propertyFormData.append(key, value);
              }
            });

            await axios.post(
              `${process.env.REACT_APP_API_URL}/cust_api/edit_project_property`,
              propertyFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          }
        } catch (propertyError) {
          console.log("PROJECT PROPERTY UPDATE ERROR:", propertyError);
        }
        // UPLOAD PROJECT GALLERY IMAGES
        if (fileData?.length > 0) {
          const imageFormData = new FormData();

          imageFormData.append("project_id", _id);

          fileData.forEach((file) => {
            imageFormData.append("project_image", file);
          });

          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/cust_api/add_project_images`,
              imageFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              },
            );
          } catch (imageError) {
            console.log("PROJECT IMAGE ERROR:", imageError);
          }
        }

        toast.success("Project Updated Successfully.");

        history.push({
          pathname: "/dashboard",
          state: { page: "myProjects" },
        });
      } else {
        toast.error(result.message || "Failed to update project.");
      }
    } catch (error) {
      console.log("EDIT PROJECT ERROR:", error);

      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchProjectDetails = async () => {
    try {
      const formDataObj = new FormData();

      formDataObj.append("project_id", _id);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_project_details`,
        formDataObj,
      );

      const responseData = response?.data?.data || {};

      const data = responseData?.project_details || {};

      // IMPORTANT
      // UPDATE ALL MAIN FORM DATA HERE
      setFormData((prev) => ({
        ...prev,

        lift_availability: data.lift_availability || "",

        covered_parking:
          data.covered_parking === "0" ? "" : data.covered_parking || "",

        uncovered_parking:
          data.uncovered_parking === "0" ? "" : data.uncovered_parking || "",
        facing: data.facing || "",

        property_dimensions_breadth: data.property_dimensions_breadth || "",
        property_dimensions_length: data.property_dimensions_length || "",

        parking_availability: data.parking_availability || "",

        no_of_cabines: data.no_of_cabines || "",
        no_of_meeting_Rooms: data.no_of_meeting_Rooms || "",
        no_of_conference_room: data.no_of_conference_room || "",
        central_AC: data.central_AC || "",
        number_of_seats_available: data.number_of_seats_available || "",
        age_of_property: data.age_of_property || "",

        project_floor: data.project_floor || "",

        total_floor: data.total_floor || "",

        all_inclusive_price: data.all_inclusive_price || "",

        price_onwards: data.price_onwards || "",

        price_negotiable: data.price_negotiable || "",

        tax_and_goverment_charges: data.tax_and_goverment_charges || "",

        electricity_and_water_charges: data.electricity_and_water_charges || "",
        project_name: data.project_name || "",
        possession_date: data.possession_date || "",
        type_of_construction: data.type_of_construction || "",
        possession_by: data.possession_by || "",
        no_of_open_sides: data.no_of_open_sides || "",
        building_type: data.building_type || "Residential",

        project_type: data.project_type || "",

        address: data.address || "",

        city_name: data.city_name || "",

        state: data.state || "",

        country: data.country || "",

        zip_code: data.zip_code || "",

        latitude: data.latitude || "",

        longitude: data.longitude || "",

        office_type: data.office_type || "",

        land_type: data.land_type || "",

        furnished_type: data.furnished_type || "",

        bathroom: data.bathroom || "",

        washroom: data.washroom || "",

        sub_sub_project_type: data.sub_sub_project_type || "",

        construction_status: data.construction_status || "",

        launch_date: data.launch_date || "",

        possession_start: data.possession_start || "",

        rera_id: data.rera_id || "",
        mark_as_featured: data.mark_as_featured || "",

        project_description: data.project_description || "",

        average_project_price: data.average_project_price || "",

        bhk_type: data.bhk_type || "",

        area: data.area || "",

        area_in: data.area_in || "",

        carpet_area: data.carpet_area || "",

        carpet_area_unit: data.carpet_area_unit || "",

        total_project_size: data.total_project_size || "",

        total_beds: data.total_beds || "",

        parking_types: data.parking_types || "",

        available_from: data.available_from || "",

        available_on: data.available_on || "",

        builder_floor_type: data.builder_floor_type || "",

        pantry_option: data.pantry_option || "",

        possession_status: data.possession_status || "",

        reception_area: data.reception_area || "",

        balcony: data.balcony || "",

        additional_rooms: data.additional_rooms
          ? data.additional_rooms.split(",")
          : [],
      }));

      // UI STATES
      setProjectName(data.project_name || "");

      setBuildingType(data.building_type || "Residential");

      setPropertyType(data.project_type || "");

      setAddress(data.address || "");

      setCity(data.city_name || "");

      setState(data.state || "");

      setCountry(data.country || "");

      setZipCode(data.zip_code || "");

      // setLocality(data.locality || "");

      // setSubLocality(data.sub_locality || "");

      setOfficeSubType(data.office_type || "");

      setLandType(data.land_type || "");

      setRetailSubType(data.office_type || "");

      setStorageType(data.office_type || "");

      setIndustryType(data.office_type || "");

      setHospitalityType(data.office_type || "");

      setRetailLocation(data.sub_sub_project_type || "");

      setRetailWashroom(data.washroom || "");

      // OTHER STATES
      setConstructionStatus(data.construction_status || "");

      setLaunchDate(data.launch_date || "");

      setPossessionStart(data.possession_start || "");

      setReraId(data.rera_id || "");

      setDescription(data.project_description || "");

      setAveragePrice(data.average_project_price || "");

      setConfigurations(data.configurations || "");
      setTotalProjectSize(data.total_project_size || "");

      // AMENITIES
      setSelectedAmenities(data.amenities ? data.amenities.split(",") : []);

      // MEDIA
      setCoverImage(data.cover_image || null);

      setCompanyLogo(data.logo || null);

      setVideo(data.property_video || null);

      setImages(responseData?.project_images || []);

      // ADDED — populate multi-property array (mirrors AddNewProject.js)
      const rawProperties =
        responseData?.project_properties ||
        responseData?.properties ||
        data?.project_properties ||
        data?.properties ||
        null;

      if (Array.isArray(rawProperties) && rawProperties.length > 0) {
        setProjectProperties(
          rawProperties.map((p) => ({
            ...emptyProjectProperty,
            ...p,
          }))
        );
      } else {
        // FALLBACK: no separate properties array found in the API response.
        // Build a single property entry from the flat project_details fields
        // so existing single-property data still loads correctly.
        setProjectProperties([
          {
            ...emptyProjectProperty,
            project_type: data.project_type || "",
            sub_project_type: data.sub_project_type || "",
            retail_location: data.sub_sub_project_type || "",
            sub_sub_project_type: data.sub_sub_project_type || "",
            price: data.average_project_price || "",
            bhk_type: data.bhk_type || "",
            carpet_area: data.carpet_area || "",
            carpet_area_in: data.carpet_area_in || "",
            area: data.area || "",
            area_in: data.area_in || "",
            bathroom: data.bathroom || "",
            commercial_washroom: data.washroom || "",
            total_floor: data.total_floor || "",
            project_floor: data.project_floor || "",
            no_of_cabines: data.no_of_cabines || "",
            no_of_meeting_Rooms: data.no_of_meeting_Rooms || "",
            no_of_conference_room: data.no_of_conference_room || "",
            total_number_of_rooms: data.total_beds || "",
            facing: data.facing || "",
            property_dimensions_length: data.property_dimensions_length || "",
            property_dimensions_breadth: data.property_dimensions_breadth || "",
            age_of_property: data.age_of_property || "",
            furnished_type: data.furnished_type || "",
            balcony: data.balcony || "",
            pantry_option: data.pantry_option || "",
            central_AC: data.central_AC || "",
            reception_area: data.reception_area || "",
            personal_washroom: "",
          },
        ]);
        console.log(
          "PROJECT PROPERTIES: no properties array key found — using flat project_details as single property. Raw response for reference:",
          responseData
        );
      }

      console.log("PROJECT DETAILS:", data);
    } catch (error) {
      console.log("FETCH PROJECT ERROR:", error);
    }
  };
  useEffect(() => {
    fetchProjectDetails();
  }, []);
  const handlePlaceChanged = () => {
    const place = autoCompleteRef.current.getPlace();
    if (!place.geometry || !place.address_components) return;

    const location = place.geometry.location;
    setMapCenter({
      lat: location.lat(),
      lng: location.lng(),
    });

    setLatitude(location.lat().toString()); // Set latitude
    setLongitude(location.lng().toString());

    setAddress(place.formatted_address || "");

    let extractedCountry = "";
    let extractedState = "";
    let extractedCity = "";
    let extractedZip = "";
    let extractedArea = "";

    place.address_components.forEach((component) => {
      const types = component.types;

      if (types.includes("country")) {
        extractedCountry = component.short_name; // Use "IN", "US", etc.
      }

      if (types.includes("administrative_area_level_1")) {
        extractedState = component.long_name; // Like "Maharashtra"
      }

      if (types.includes("locality")) {
        extractedCity = component.long_name;
      }

      if (types.includes("postal_code")) {
        extractedZip = component.long_name;
      }

      if (
        types.includes("sublocality") ||
        types.includes("sublocality_level_1") ||
        types.includes("neighborhood")
      ) {
        extractedArea = component.long_name; // Extract area (e.g., neighborhood or sublocality)
      }
    });

    // Set address fields
    setCity(extractedCity);
    setZipCode(extractedZip);

    setFormData((prev) => ({
      ...prev,
      address: place.formatted_address || "",
      city_name: extractedCity,
      zip_code: extractedZip,
    }));

    const addressArea =
      extractedArea && extractedCity
        ? `${extractedArea}, ${extractedCity}`
        : extractedCity || extractedArea || "";
    setAddressArea(addressArea);

    // Match the country from allCountries by ISO code
    const matchedCountry = allCountries.find(
      (c) => c.isoCode === extractedCountry,
    );
    if (matchedCountry) {
      setCountry(matchedCountry.isoCode);

      const states = State.getStatesOfCountry(matchedCountry.isoCode);

      setAllStates(states);

      const matchedState = states.find(
        (s) => s.name.toLowerCase() === extractedState.toLowerCase(),
      );

      if (matchedState) {
        setState(matchedState.name);

        setFormData((prev) => ({
          ...prev,
          country: matchedCountry.isoCode,
          state: matchedState.name,
        }));
      } else {
        setState("");
      }
    } else {
      setCountry("");
      setState("");
    }
  };

  useEffect(() => {
    if (showUpcomingProjectCount) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showUpcomingProjectCount]);

  const validateStepFields = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (!formData.project_name?.trim()) {
        newErrors.projectName = "Project name is required.";
      }
    }

    if (activeStep === 1) {
      if (!address?.trim()) {
        newErrors.address = "Address is required";
      }
      if (!city?.trim()) {
        newErrors.city = "City is required";
      }
      if (!country?.trim()) {
        newErrors.country = "Country is required";
      }
      if (!state?.trim()) {
        newErrors.state = "State is required";
      }
      if (!zipCode?.trim()) {
        newErrors.zipCode = "Zip code is required";
      }
    }

    if (activeStep === 2) {
      // UPDATED — validate each entry in projectProperties instead of the
      // old single formData fields, since Project Details is now a list.
      if (
        projectProperties.some(
          (property) => !String(property.price || "").trim(),
        )
      ) {
        newErrors.price = "Price is required.";
      }

      if (
        buildingType !== "Commercial" &&
        propertyType !== "Plot/Land" &&
        projectProperties.some((property) => !property.bhk_type)
      ) {
        newErrors.bhk_type = "BHK is required.";
      }

      if (
        projectProperties.some(
          (property) => !String(property.area || "").trim(),
        )
      ) {
        newErrors.area = "Built-up area is required.";
      }

      if (
        projectProperties.some(
          (property) => !String(property.area_in || "").trim(),
        )
      ) {
        newErrors.area_in = "Built-up area unit is required.";
      }

      if (
        projectProperties.some(
          (property) => !String(property.carpet_area || "").trim(),
        )
      ) {
        newErrors.carpet_area = "Carpet area is required.";
      }

      if (
        projectProperties.some(
          (property) => !String(property.carpet_area_in || "").trim(),
        )
      ) {
        newErrors.carpet_area_unit = "Carpet area unit is required.";
      }
    }

    if (activeStep === 3) {
      if (selectedAmenities.length === 0) {
        newErrors.amenities = "At least one amenity must be selected.";
      } else {
        delete newErrors.amenities;
      }
    }

    if (activeStep === 4) {
      if (!coverImage) {
        newErrors.coverImage = "Please upload a cover image";
      } else {
        delete newErrors.coverImage;
      }

      if (!companyLogo) {
        newErrors.companyLogo = "Please upload a company logo";
      } else {
        delete newErrors.companyLogo;
      }
    }

    setErrors(newErrors);

    const isProjectValid =
      !newErrors.projects ||
      newErrors.projects.every((err) => Object.keys(err).length === 0);

    return (
      Object.keys(newErrors).filter((key) => key !== "projects").length === 0 &&
      isProjectValid
    );
  };
  const toWords = new ToWords({
    localeCode: "en-IN",
  });

  return (
    <>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
        <div className="flex flex-col items-center min-h-screen bg-white">
          {/* Navbar */}
          <nav className="items-center justify-center hidden w-full p-4 text-black bg-gray-200 md:flex">
            <h1 className="text-xl">Edit your Project</h1>
          </nav>

          {/* Stepper Navigation */}
          <div className="flex flex-wrap justify-center w-full gap-2 p-3 bg-white">
            {steps.map((step, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeStep === index
                  ? "bg-gray-200 my-text"
                  : completedSteps.includes(index)
                    ? "text-green-600"
                    : "text-gray-600"
                  }`}
                onClick={() => {
                  // Only allow clicking back to completed steps or current
                  if (completedSteps.includes(index) || index === activeStep) {
                    setActiveStep(index);
                  }
                }}
              >
                {index + 1}. {step}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <div className="w-full p-6 bg-white max-w-7xl">
            {/* Render Step Content */}
            {activeStep === 0 && (
              <>
                <div className="max-w-3xl p-3 mx-auto mb-20 border border-gray-300 rounded-xl">
                  <h2 className="mb-4 text-xl font-semibold text-gray-800">
                    Basic Details
                  </h2>

                  {/* Property Name */}
                  <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700">
                      Project Name{" "}
                      <span className="text-xl font-bold text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Project Name"
                      value={formData.project_name || ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        const alphaNumericOnly = value.replace(
                          /[^a-zA-Z0-9 ]/g,
                          "",
                        );

                        setProjectName(alphaNumericOnly);

                        setFormData((prev) => ({
                          ...prev,
                          project_name: alphaNumericOnly,
                        }));
                      }}
                      className={`w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-rose-500 ${errors.projectName
                        ? "border border-red-600"
                        : "border border-gray-300"
                        }`}
                    />
                    {errors.projectName && (
                      <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                        <MdErrorOutline className="text-lg" />
                        {errors.projectName}
                      </p>
                    )}
                  </div>

                  {/* Featured Checkbox */}
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="featured"
                      className="mr-2 mb-2"
                      checked={formData.mark_as_featured || false}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          mark_as_featured: e.target.checked,
                        });
                        setIsModified(true);
                      }}
                    />
                    <label
                      htmlFor="featured"
                      className="text-gray-700 flex items-center"
                    >
                      Showcase Your Project in the Top Projects
                      <IoIosInformationCircle className="text-yellow-500 ml-1 cursor-pointer text-lg" />
                    </label>
                  </div>

                  {/* Building Type */}
                  <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700">
                      Building Type
                    </label>

                    <div className="flex gap-3">
                      {["Residential", "Commercial"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setBuildingType(type); // change type
                            setPropertyType(""); // reset property type

                            //  IMPORTANT: reset only extra fields (not all)
                            setFormData((prev) => ({
                              ...prev,

                              bhk_type: "",
                              office_type: "",
                              land_type: "",

                              sub_sub_project_type: "",
                              washroom: "",
                              parking_types: "",

                              total_number_of_rooms: "",
                              quality_rating: "",

                              no_of_cabines: "",
                              no_of_meeting_Rooms: "",
                              no_of_conference_room: "",

                              central_AC: "",
                              reception_area: "",

                              available_for: "",
                              room_type: "",
                              no_of_peoples: "",
                              total_beds: "",
                              available_beds: "",

                              attached_balcony: "",
                              attached_bathroom: "",
                            }));
                          }}
                          className={`px-4 py-2 rounded-full border ${buildingType === type
                            ? "bg-rose-100 text-rose-700 border-rose-500"
                            : "border-gray-300 text-gray-600"
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {propertyType === "Hospitality" && (
                    <div className="mt-4">
                      <label className="block mb-1 font-medium text-gray-700">
                        What kind of hospitality?
                      </label>

                      <div className="flex flex-wrap gap-2">
                        {hospitalityOptions.map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`px-4 py-2 rounded-full border transition ${hospitalityType === type
                              ? "bg-rose-100 text-rose-700 border-rose-500"
                              : "border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                            onClick={() => {
                              setHospitalityType(type);

                              setFormData((prev) => ({
                                ...prev,
                                office_type: type,
                              }));
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {propertyType === "Plot/Land" && (
                    <div className="mt-4">
                      <label className="block mb-1 font-medium text-gray-700">
                        What kind of land?
                      </label>

                      <div className="flex flex-wrap gap-2">
                        {landOptions.map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`px-4 py-2 rounded-full border transition ${landType === type
                              ? "bg-rose-100 text-rose-700 border-rose-500"
                              : "border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                            onClick={() => {
                              setLandType(type);

                              setFormData((prev) => ({
                                ...prev,
                                land_type: type,
                              }));
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {propertyType === "Industry" && (
                    <div className="mt-4">
                      <label className="block mb-1 font-medium text-gray-700">
                        What kind of industry?
                      </label>

                      <div className="flex flex-wrap gap-2">
                        {industryOptions.map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`px-4 py-2 rounded-full border transition ${industryType === type
                              ? "bg-rose-100 text-rose-700 border-rose-500"
                              : "border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                            onClick={() => {
                              setIndustryType(type);

                              setFormData((prev) => ({
                                ...prev,
                                office_type: type,
                              }));
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {propertyType === "Storage" && (
                    <div className="mt-4">
                      <label className="block mb-1 font-medium text-gray-700">
                        What kind of storage?
                      </label>

                      <div className="flex flex-wrap gap-2">
                        {storageOptions.map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`px-4 py-2 rounded-full border transition ${storageType === type
                              ? "bg-rose-100 text-rose-700 border-rose-500"
                              : "border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                            onClick={() => {
                              setStorageType(type);

                              setFormData((prev) => ({
                                ...prev,
                                office_type: type,
                              }));
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {propertyType === "Office" && (
                    <div className="mt-4">
                      <label className="block mb-1 font-medium text-gray-700">
                        What kind of office?
                      </label>

                      <div className="flex flex-wrap gap-2">
                        {officeOptions.map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`px-4 py-2 rounded-full border transition ${officeSubType === type
                              ? "bg-rose-100 text-rose-700 border-rose-500"
                              : "border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                            onClick={() => {
                              setOfficeSubType(type);

                              setFormData((prev) => ({
                                ...prev,
                                office_type: type,
                              }));
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {propertyType === "Retail" && (
                    <div className="mt-4">
                      <label className="block mb-1 font-medium text-gray-700">
                        What kind of retail?
                      </label>

                      <div className="flex flex-wrap gap-2">
                        {retailOptions.map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`px-4 py-2 rounded-full border transition ${RetailSubType === type
                              ? "bg-rose-100 text-rose-700 border-rose-500"
                              : "border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                            onClick={() => {
                              setRetailSubType(type);
                              setFormData((prev) => ({
                                ...prev,
                                office_type: type,
                              }));
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {propertyType === "Retail" && RetailSubType && (
                    <div className="mt-4">
                      <label className="block mb-1 font-medium text-gray-700">
                        Your Retail located inside?
                      </label>

                      <div className="flex flex-wrap gap-2">
                        {retailLocationOptions.map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`px-4 py-2 rounded-full border transition ${retailLocation === type
                              ? "bg-rose-100 text-rose-700 border-rose-500"
                              : "border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                            onClick={() => {
                              setRetailLocation(type);
                              setFormData((prev) => ({
                                ...prev,
                                sub_sub_project_type: type,
                              }));
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeStep === 1 && (
              <>
                <div className="max-w-5xl mx-auto mb-32 bg-white rounded-xl">
                  <h2 className="text-2xl text-gray-900">Project Address</h2>
                  <p className="mt-1 text-gray-500">
                    Place the listing pin on the map
                  </p>
                  <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="font-medium text-gray-700">
                          Address{" "}
                          <span className="text-xl font-bold text-red-500">
                            *
                          </span>
                        </label>
                        <Autocomplete
                          onLoad={(ac) => (autoCompleteRef.current = ac)}
                          onPlaceChanged={handlePlaceChanged}
                        >
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => {
                              setAddress(e.target.value);

                              setFormData((prev) => ({
                                ...prev,
                                address: e.target.value,
                              }));
                            }}
                            className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${errors.address
                              ? "border-red-600"
                              : "border-gray-300"
                              }`}
                          />
                        </Autocomplete>

                        {errors.address && (
                          <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                            <MdErrorOutline className="text-lg" />
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {/* Country Dropdown */}
                      <div>
                        <label className="font-medium text-gray-700">
                          Country{" "}
                          <span className="text-xl font-bold text-red-500">
                            *
                          </span>
                        </label>
                        <select
                          value={country}
                          onChange={(e) => {
                            setCountry(e.target.value);
                            setState("");

                            setFormData((prev) => ({
                              ...prev,
                              country: e.target.value,
                              state: "",
                            }));
                          }}
                          className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${errors.country
                            ? "border-red-600"
                            : "border-gray-300"
                            }`}
                        >
                          <option value="">Select Country</option>
                          {allCountries.map((c) => (
                            <option key={c.isoCode} value={c.isoCode}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        {errors.country && (
                          <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                            <MdErrorOutline className="text-lg" />
                            {errors.country}
                          </p>
                        )}
                      </div>

                      {/* State Dropdown */}
                      <div>
                        <label className="font-medium text-gray-700">
                          State{" "}
                          <span className="text-xl font-bold text-red-500">
                            *
                          </span>
                        </label>
                        <select
                          value={state}
                          onChange={(e) => {
                            setState(e.target.value);

                            setFormData((prev) => ({
                              ...prev,
                              state: e.target.value,
                            }));
                          }}
                          className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${errors.state ? "border-red-600" : "border-gray-300"
                            }`}
                        >
                          <option value="">Select State</option>
                          {allStates.map((s) => (
                            <option key={s.isoCode} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        {errors.state && (
                          <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                            <MdErrorOutline className="text-lg" />
                            {errors.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="font-medium text-gray-700">
                          City{" "}
                          <span className="text-xl font-bold text-red-500">
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);

                            setFormData((prev) => ({
                              ...prev,
                              city_name: e.target.value,
                            }));
                          }}
                          placeholder="Enter City"
                          className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${errors.city ? "border-red-600" : "border-gray-300"
                            }`}
                        />
                        {errors.city && (
                          <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                            <MdErrorOutline className="text-lg" />
                            {errors.city}
                          </p>
                        )}
                      </div>
                      {/* Zip Code */}
                      <div>
                        <label className="font-medium text-gray-700">
                          Zip <span className="text-xl text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Zip Code"
                          value={zipCode}
                          onChange={(e) => {
                            const value = e.target.value;

                            if (/^\d{0,10}$/.test(value)) {
                              setZipCode(value);

                              setFormData((prev) => ({
                                ...prev,
                                zip_code: value,
                              }));
                            }
                          }}
                          className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${errors.zipCode
                            ? "border-red-600"
                            : "border-gray-300"
                            }`}
                        />
                        {errors.zipCode && (
                          <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                            <MdErrorOutline className="text-lg" />
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {activeStep === 2 && (
              <>
                <div className="p-3 mx-auto mb-3 bg-white border max-w-7xl rounded-xl">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Project Details
                    </h2>
                    <p className="text-gray-500">
                      Enter and manage essential information related to your
                      project Properties.
                    </p>
                  </div>
                  {projectProperties.map((projectProperty, index) => (
                    <div
                      key={index}
                      className="mb-6 border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          Property {index + 1}
                        </h3>

                        {projectProperties.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteProjectProperty(index)}
                            className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      {/* <div className="grid items-start grid-cols-6 gap-4 p-4 mt-4 rounded-lg"> */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 items-start gap-3 sm:gap-4 p-2 sm:p-3 md:p-4 mt-4 rounded-lg">
                        {/* <div className="col-span-6"> */}
                        <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6">
                          <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">
                              Project Type{" "}
                              <span className="text-xl font-bold text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-1">
                              <div className="flex flex-wrap gap-1">
                                {(buildingType === "Residential"
                                  ? residentialTypes
                                  : commercialTypes
                                ).map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() =>
                                      handleProjectPropertyChange(index, "project_type", type)
                                    }
                                    className={`px-3 py-2 sm:px-4 rounded-full border ${projectProperty.project_type === type
                                      ? "bg-rose-100 text-rose-700 border-rose-500"
                                      : "border-gray-300 text-gray-600"
                                      }`}
                                  >
                                    {type === "Plot/Land" ? "Land" : type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          {projectProperty.project_type === "Hospitality" && (
                            <div className="mt-4">
                              <label className="block mb-1 font-medium text-gray-700">
                                What kind of hospitality?
                              </label>

                              <div className="flex flex-wrap gap-2">
                                {hospitalityOptions.map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    className={`px-3 py-2 sm:px-4 rounded-full border transition ${projectProperty.sub_project_type === type
                                      ? "bg-rose-100 text-rose-700 border-rose-500"
                                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                                      }`}
                                    onClick={() => {
                                      handleProjectPropertyChange(index, "sub_project_type", type);
                                    }}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {projectProperty.project_type === "Plot/Land" && (
                            <div className="mt-4">
                              <label className="block mb-1 font-medium text-gray-700">
                                What kind of land?
                              </label>

                              <div className="flex flex-wrap gap-2">
                                {landOptions.map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    className={`px-3 py-2 sm:px-4 rounded-full border transition ${projectProperty.sub_project_type === type
                                      ? "bg-rose-100 text-rose-700 border-rose-500"
                                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                                      }`}
                                    onClick={() => {
                                      handleProjectPropertyChange(index, "sub_project_type", type);
                                    }}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {projectProperty.project_type === "Industry" && (
                            <div className="mt-4">
                              <label className="block mb-1 font-medium text-gray-700">
                                What kind of industry?
                              </label>

                              <div className="flex flex-wrap gap-2">
                                {industryOptions.map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    className={`px-3 py-2 sm:px-4 rounded-full border transition ${projectProperty.sub_project_type === type
                                      ? "bg-rose-100 text-rose-700 border-rose-500"
                                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                                      }`}
                                    onClick={() => {
                                      handleProjectPropertyChange(index, "sub_project_type", type);
                                    }}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {projectProperty.project_type === "Storage" && (
                            <div className="mt-4">
                              <label className="block mb-1 font-medium text-gray-700">
                                What kind of storage?
                              </label>

                              <div className="flex flex-wrap gap-2">
                                {storageOptions.map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    className={`px-3 py-2 sm:px-4 rounded-full border transition ${projectProperty.sub_project_type === type
                                      ? "bg-rose-100 text-rose-700 border-rose-500"
                                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                                      }`}
                                    onClick={() => {
                                      handleProjectPropertyChange(index, "sub_project_type", type);
                                    }}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {projectProperty.project_type === "Office" && (
                            <div className="mt-4">
                              <label className="block mb-1 font-medium text-gray-700">
                                What kind of office?
                              </label>

                              <div className="flex flex-wrap gap-2">
                                {officeOptions.map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    className={`px-3 py-2 sm:px-4 rounded-full border transition ${projectProperty.sub_project_type === type
                                      ? "bg-rose-100 text-rose-700 border-rose-500"
                                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                                      }`}
                                    onClick={() => {
                                      handleProjectPropertyChange(index, "sub_project_type", type);
                                    }}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {projectProperty.project_type === "Retail" && (
                            <div className="mt-4">
                              <label className="block mb-1 font-medium text-gray-700">
                                What kind of retail?
                              </label>

                              <div className="flex flex-wrap gap-2">
                                {retailOptions.map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    className={`px-3 py-2 sm:px-4 rounded-full border transition ${projectProperty.sub_project_type === type
                                      ? "bg-rose-100 text-rose-700 border-rose-500"
                                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                                      }`}
                                    onClick={() => {
                                      handleProjectPropertyChange(index, "sub_project_type", type);
                                    }}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {projectProperty.project_type === "Retail" &&
                            projectProperty.sub_project_type && (
                              <div className="mt-4">
                                <label className="block mb-1 font-medium text-gray-700">
                                  Your Retail located inside?
                                </label>

                                <div className="flex flex-wrap gap-2">
                                  {retailLocationOptions.map((type) => (
                                    <button
                                      key={type}
                                      type="button"
                                      className={`px-3 py-2 sm:px-4 rounded-full border transition ${projectProperty.retail_location === type
                                        ? "bg-rose-100 text-rose-700 border-rose-500"
                                        : "border-gray-300 text-gray-600 hover:bg-gray-100"
                                        }`}
                                      onClick={() => {
                                        handleProjectPropertyChange(index, "retail_location", type);
                                      }}
                                    >
                                      {type}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                        {/* Property Price */}
                        <div className="w-full">
                          <label className="block mb-0 text-sm font-medium text-gray-700">
                            Price{" "}
                            <span className="text-xl font-bold text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={
                              projectProperty.price
                                ? Number(projectProperty.price).toLocaleString("en-IN")
                                : ""
                            }
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/,/g, "");

                              if (/^\d{0,20}$/.test(rawValue)) {
                                handleProjectPropertyChange(index, "price", rawValue);
                              }
                            }}
                            placeholder="₹"
                            className="w-full mt-1 p-3 border rounded-lg text-gray-700 outline-none focus:ring-2 focus:ring-rose-500"
                          />
                          {projectProperty.price && (
                            <p className="mt-2 text-sm font-medium text-gray-600">
                              {toWords.convert(Number(projectProperty.price))}
                            </p>
                          )}
                          {errors[`price_${index}`] && (
                            <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                              <MdErrorOutline className="text-lg" />
                              {errors[`price_${index}`]}
                            </p>
                          )}
                        </div>

                        {/* BHK */}
                        {!(
                          buildingType === "Commercial" ||
                          propertyType.project_type === "Plot/Land"
                        ) && (
                            <div className="w-full">
                              <label className="block mb-1 text-sm font-medium text-gray-700">
                                BHK{" "}
                                <span className="text-xl font-bold text-red-500">
                                  *
                                </span>
                              </label>

                              <select
                                value={projectProperty.bhk_type || ""}
                                onChange={(e) => {
                                  handleProjectPropertyChange(index, "bhk_type", e.target.value);
                                  setConfigurations(e.target.value);
                                }}
                                className="w-full mt-1 p-3 border rounded-lg text-gray-700 outline-none focus:ring-2 focus:ring-rose-500"
                              >
                                <option value="">Select BHK Type</option>

                                {(propertyType.project_type === "1RK/Studio Apartment"
                                  ? ["1 BHK"]
                                  : [
                                    "Studio/Single Room",
                                    "1 BHK",
                                    "1.5 BHK",
                                    "2 BHK",
                                    "2.5 BHK",
                                    "3 BHK",
                                    "3.5 BHK",
                                    "4 BHK",
                                    "5 BHK",
                                    "6 BHK",
                                    "6+ BHK",
                                  ]
                                ).map((bhk) => (
                                  <option key={bhk} value={bhk}>
                                    {bhk}
                                  </option>
                                ))}
                              </select>

                              {errors.bhk_type && (
                                <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                                  <MdErrorOutline className="text-lg" />
                                  {errors.bhk_type}
                                </p>
                              )}
                            </div>
                          )}

                        {/* Carpet Area */}
                        <div>
                          <label className="font-medium text-gray-700">
                            Carpet Area <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={projectProperty.carpet_area || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,10}$/.test(value)) {
                                handleProjectPropertyChange(index, "carpet_area", value);
                              }
                            }}
                            className="w-full mt-1 p-3 border rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="font-medium text-gray-700">Unit</label>
                          <select
                            value={projectProperty.carpet_area_in || ""}
                            onChange={(e) =>
                              handleProjectPropertyChange(index, "carpet_area_in", e.target.value)
                            }
                            className="w-full mt-1 p-3 border rounded-lg"
                          >
                            <option value="">Select</option>
                            <option value="sq.ft">sq.ft</option>
                            <option value="sq.yards">sq.yards</option>
                            <option value="sq.m">sq.m</option>
                            <option value="acre">acre</option>
                            <option value="marla">marla</option>
                            <option value="cents">cents</option>
                            <option value="bigha">bigha</option>
                            <option value="kottah">kottah</option>
                            <option value="kanal">kanal</option>
                            <option value="grounds">grounds</option>
                            <option value="ares">ares</option>
                            <option value="biswa">biswa</option>
                            <option value="guntha">guntha</option>
                            <option value="aankadam">aankadam</option>
                            <option value="hectares">hectares</option>
                            <option value="rood">rood</option>
                            <option value="chataks">chataks</option>
                            <option value="perch">perch</option>
                          </select>
                        </div>

                        {/* Built-up Area */}
                        <div>
                          <label className="font-medium text-gray-700">
                            Built-up Area <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={projectProperty.area || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,10}$/.test(value)) {
                                handleProjectPropertyChange(index, "area", value);
                              }
                            }}
                            className="w-full mt-1 p-3 border rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="font-medium text-gray-700">Unit</label>
                          <select
                            value={projectProperty.area_in || ""}
                            onChange={(e) =>
                              handleProjectPropertyChange(index, "area_in", e.target.value)
                            }
                            className="w-full mt-1 p-3 border rounded-lg"
                          >
                            <option value="">Select</option>
                            <option value="sq.ft">sq.ft</option>
                            <option value="sq.yards">sq.yards</option>
                            <option value="sq.m">sq.m</option>
                            <option value="acre">acre</option>
                            <option value="marla">marla</option>
                            <option value="cents">cents</option>
                            <option value="bigha">bigha</option>
                            <option value="kottah">kottah</option>
                            <option value="kanal">kanal</option>
                            <option value="grounds">grounds</option>
                            <option value="ares">ares</option>
                            <option value="biswa">biswa</option>
                            <option value="guntha">guntha</option>
                            <option value="aankadam">aankadam</option>
                            <option value="hectares">hectares</option>
                            <option value="rood">rood</option>
                            <option value="chataks">chataks</option>
                            <option value="perch">perch</option>
                          </select>
                        </div>

                        {!(
                          (buildingType === "Residential" &&
                            projectProperty.project_type === "Plot/Land") ||
                          (buildingType === "Commercial" &&
                            [
                              "Land",
                              "Storage",
                              "Hospitality",
                              "Industry",
                              "Retail",
                              "Warehouse",
                              "Plot/Land",
                            ].includes(projectProperty.project_type))
                        ) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Bathroom
                              </label>

                              <select
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                                value={projectProperty.bathroom || ""}
                                onChange={(e) =>
                                  handleProjectPropertyChange(index, "bathroom", Number(e.target.value))
                                }
                              >
                                <option value="">Select Bathrooms</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="4">+4</option>
                              </select>
                            </div>
                          )}
                        {buildingType === "Commercial" &&
                          projectProperty.project_type === "Retail" && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Washroom
                              </label>

                              <select
                                value={projectProperty.commercial_washroom || ""}
                                onChange={(e) =>
                                  handleProjectPropertyChange(
                                    index,
                                    "commercial_washroom",
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                              >
                                <option value="">Select Washroom</option>
                                <option value="Private Washrooms">
                                  Private Washrooms
                                </option>
                                <option value="Public Washrooms">
                                  Public Washrooms
                                </option>
                                <option value="Not Available">Not Available</option>
                              </select>
                            </div>
                          )}
                        {buildingType === "Commercial" &&
                          ["Storage", "Industry", "Hospitality"].includes(
                            projectProperty.project_type
                          ) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Washroom
                              </label>

                              <select
                                value={projectProperty.commercial_washroom || ""}
                                onChange={(e) =>
                                  handleProjectPropertyChange(
                                    index,
                                    "commercial_washroom",
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                              >
                                <option value="">Select Washrooms</option>
                                <option value="None">None</option>
                                <option value="Shared">Shared</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="4+">4+</option>
                              </select>
                            </div>
                          )}
                        {!(
                          (buildingType === "Residential" && projectProperty.project_type === "Plot/Land") ||
                          (buildingType === "Commercial" &&
                            [
                              "Land",
                              "Plot/Land",
                              "Warehouse",
                              "Storage",
                              "Industry",
                              "Hospitality",
                            ].includes(projectProperty.project_type))
                        ) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Total Floor
                              </label>

                              <input
                                type="text"
                                name="total_floor"
                                value={projectProperty.total_floor || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                                    handleProjectPropertyChange(index, "total_floor", value);
                                  }
                                }}
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                              />
                            </div>
                          )}
                        {!(
                          (buildingType === "Residential" && projectProperty.project_type === "Plot/Land") ||
                          (buildingType === "Commercial" &&
                            [
                              "Land",
                              "Plot/Land",
                              "Warehouse",
                              "Industry",
                              "Storage",
                              "Hospitality",
                            ].includes(projectProperty.project_type))
                        ) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Flat on the floor
                              </label>

                              <select
                                name="project_floor"
                                value={projectProperty.project_floor || ""}
                                onChange={(e) => handleProjectPropertyChange(index, "project_floor", e.target.value)}
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                              >
                                <option value="">Select Floor</option>

                                <option value="Lower Basement">Lower Basement</option>

                                <option value="Basement">Basement</option>

                                <option value="Lower Ground">Lower Ground</option>

                                <option value="Ground">Ground</option>

                                <option value="Rooftop/Terrace">Rooftop/Terrace</option>

                                {[...Array(Number(projectProperty.total_floor) || 0)].map(
                                  (_, floorIndex) => (
                                    <option key={floorIndex + 1} value={`${floorIndex + 1}`}>
                                      {floorIndex + 1}
                                    </option>
                                  ),
                                )}
                              </select>
                            </div>
                          )}
                        {buildingType === "Commercial" &&
                          projectProperty.project_type === "Office" && (
                            <div>
                              <label className="font-medium text-gray-700">
                                No. of Cabines
                              </label>

                              <select
                                value={projectProperty.no_of_cabines || ""}
                                onChange={(e) =>
                                  handleProjectPropertyChange(
                                    index,
                                    "no_of_cabines",
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                              >
                                <option value="">Select Cabines</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="10+">10+</option>
                              </select>
                            </div>
                          )}
                        {buildingType === "Commercial" && projectProperty.project_type === "Office" && (
                          <div>
                            <label className="font-medium text-gray-700">
                              No. of Meeting Rooms
                            </label>

                            <select
                              value={projectProperty.no_of_meeting_Rooms || ""}
                              onChange={(e) =>
                                handleProjectPropertyChange(
                                  index,
                                  "no_of_meeting_Rooms",
                                  e.target.value
                                )
                              }
                              className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            >
                              <option value="">Select Meeting Rooms</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5+">5+</option>
                            </select>
                          </div>
                        )}
                        {buildingType === "Commercial" &&
                          projectProperty.project_type === "Office" && (
                            <div>
                              <label className="font-medium text-gray-700">
                                No. of Conference Room
                              </label>

                              <select
                                value={projectProperty.no_of_conference_room || ""}
                                onChange={(e) =>
                                  handleProjectPropertyChange(
                                    index,
                                    "no_of_conference_room",
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                              >
                                <option value="">Select Conference Room</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3+">3+</option>
                              </select>
                            </div>
                          )}

                        {buildingType === "Commercial" &&
                          projectProperty.project_type === "Hospitality" && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Total Number of Rooms
                              </label>

                              <input
                                type="text"
                                value={projectProperty.total_number_of_rooms || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    handleProjectPropertyChange(
                                      index,
                                      "total_number_of_rooms",
                                      value
                                    );
                                  }
                                }}
                                placeholder="Enter Total Rooms"
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                              />
                            </div>
                          )}
                        {((buildingType === "Residential" && projectProperty.project_type === "Plot/Land") ||
                          (buildingType === "Commercial" &&
                            ["Land", "Plot/Land"].includes(projectProperty.project_type))) && (
                            <div>
                              <label className="font-medium text-gray-700">Facing</label>

                              <select

                                value={projectProperty.facing || ""}
                                onChange={(e) =>
                                  handleProjectPropertyChange(index, "facing", e.target.value)
                                }
                                className="w-full p-3 mt-1 border rounded-lg"
                              >
                                <option value="">Select Facing</option>

                                <option value="East">East</option>
                                <option value="West">West</option>
                                <option value="North">North</option>
                                <option value="South">South</option>
                                <option value="North East">North East</option>
                                <option value="North West">North West</option>
                                <option value="South East">South East</option>
                                <option value="South West">South West</option>
                              </select>
                            </div>
                          )}
                        {((buildingType === "Residential" && projectProperty.project_type === "Plot/Land") ||
                          (buildingType === "Commercial" &&
                            projectProperty.project_type === "Plot/Land")) && (
                            <>
                              {/* Length */}
                              <div>
                                <label className="font-medium text-gray-700">
                                  Length of Plot (ft){" "}
                                  <span className="text-red-500">*</span>
                                </label>

                                <input
                                  type="text"
                                  value={projectProperty.property_dimensions_length || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                      handleProjectPropertyChange(
                                        index,
                                        "property_dimensions_length",
                                        value
                                      );
                                    }
                                  }}
                                  placeholder="Enter Length"
                                  className={`w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${errors?.property_dimensions_length
                                    ? "border-red-600"
                                    : "border-gray-300"
                                    }`}
                                />

                                {errors?.property_dimensions_length && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {errors.property_dimensions_length}
                                  </p>
                                )}
                              </div>

                              {/* Breadth */}
                              <div>
                                <label className="font-medium text-gray-700">
                                  Breadth of Plot (ft){" "}
                                  <span className="text-red-500">*</span>
                                </label>

                                <input
                                  type="text"
                                  value={projectProperty.property_dimensions_breadth || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                      handleProjectPropertyChange(
                                        index,
                                        "property_dimensions_breadth",
                                        value
                                      );
                                    }
                                  }}
                                  placeholder="Enter Breadth"
                                  className={`w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${errors?.property_dimensions_breadth
                                    ? "border-red-600"
                                    : "border-gray-300"
                                    }`}
                                />

                                {errors?.property_dimensions_breadth && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {errors.property_dimensions_breadth}
                                  </p>
                                )}
                              </div>
                            </>
                          )}
                        {!(
                          (buildingType === "Residential" && projectProperty.project_type === "Plot/Land") ||
                          (buildingType === "Commercial" &&
                            [
                              //"Land",
                              "Plot/Land",
                              "Industry",
                              "Storage",
                              "Hospitality",
                            ].includes(projectProperty.project_type)) ||
                          formData.possession_status === "Under Construction"
                        ) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Age of Property
                              </label>

                              <select
                                value={projectProperty.age_of_property || ""}
                                onChange={(e) =>
                                  handleProjectPropertyChange(
                                    index,
                                    "age_of_property",
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                              >
                                <option value="">Select Age of Property</option>
                                <option value="0-1">0-1</option>
                                <option value="2-4">2-4</option>
                                <option value="5-7">5-7</option>
                                <option value="8-10">8-10</option>
                                <option value="10+">10+</option>
                              </select>
                            </div>
                          )}
                        {projectProperty.project_type !== "Plot/Land" && (
                          <div>
                            <label className="font-medium text-gray-700">
                              Furnishing Type{" "}
                              <span className="text-xl font-bold text-red-500">*</span>
                            </label>

                            <select
                              value={projectProperty.furnished_type || ""}
                              onChange={(e) =>
                                handleProjectPropertyChange(
                                  index,
                                  "furnished_type",
                                  e.target.value
                                )
                              }
                              className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            >
                              <option value="">Select Furnishing Type</option>
                              <option value="Furnished">Furnished</option>
                              <option value="Semi-Furnished">Semi-Furnished</option>
                              <option value="Unfurnished">Unfurnished</option>
                            </select>

                            {errors?.furnished_type && (
                              <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                                <MdErrorOutline className="text-lg" />
                                {errors.furnished_type}
                              </p>
                            )}
                          </div>
                        )}
                        {buildingType === "Residential" && projectProperty.project_type !== "Plot" && (
                          <div>
                            <label className="font-medium text-gray-700">Balcony</label>

                            <select

                              value={projectProperty.balcony || ""}
                              onChange={(e) =>
                                handleProjectPropertyChange(
                                  index,
                                  "balcony",
                                  e.target.value
                                )
                              }
                              className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            >
                              <option value="">Select No. of Balconies</option>
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="more than 3">More than 3</option>
                            </select>
                          </div>
                        )}
                        {buildingType === "Commercial" &&
                          projectProperty.project_type === "Office" &&
                          [
                            "Bare shell office space",
                            "Ready to move office space",
                          ].includes(projectProperty.sub_project_type) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Pantry
                              </label>

                              <select
                                value={projectProperty.pantry_option || ""}
                                onChange={(e) =>
                                  handleProjectPropertyChange(
                                    index,
                                    "pantry_option",
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                              >
                                <option value="">Select Pantry</option>
                                <option value="Wet">Wet</option>
                                <option value="Dry">Dry</option>
                                <option value="None">None</option>
                              </select>
                            </div>
                          )}

                        {buildingType === "Commercial" &&
                          projectProperty.project_type === "Office" && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Central AC
                              </label>

                              <select
                                value={projectProperty.central_AC || ""}
                                onChange={(e) =>
                                  handleProjectPropertyChange(
                                    index,
                                    "central_AC",
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                              >
                                <option value="">Select Option</option>

                                {projectProperty.sub_project_type === "Ready to move office space" ? (
                                  <>
                                    <option value="Available">Available</option>

                                    <option value="Not Available">Not Available</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="Duct Only">Duct Only</option>

                                    <option value="Available">Available</option>

                                    <option value="Not Available">Not Available</option>
                                  </>
                                )}
                              </select>
                            </div>
                          )}
                        {buildingType === "Commercial" && projectProperty.project_type === "Office" && (
                          <div>
                            <label className="font-medium text-gray-700">
                              Reception Area
                            </label>

                            <select
                              value={projectProperty.reception_area || ""}
                              onChange={(e) =>
                                handleProjectPropertyChange(
                                  index,
                                  "reception_area",
                                  e.target.value
                                )
                              }
                              className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            >
                              <option value="">Select Option</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                        )}
                        {buildingType === "Commercial" &&
                          projectProperty.project_type === "Office" && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Personal Washroom
                              </label>

                              <select

                                value={projectProperty.personal_washroom || ""}
                                onChange={(e) =>
                                  handleProjectPropertyChange(
                                    index,
                                    "personal_washroom",
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                              >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </div>
                          )}
                        {buildingType === "Commercial" &&
                          projectProperty.project_type === "Retail" && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Parking Type
                              </label>

                              <Select
                                isMulti
                                name="parking_types"
                                options={[
                                  { value: "Private Parking", label: "Private Parking" },
                                  { value: "Public Parking", label: "Public Parking" },
                                  { value: "Multilevel Parking", label: "Multilevel Parking" },
                                  { value: "Not Available", label: "Not Available" },
                                ]}
                                value={[
                                  { value: "Private Parking", label: "Private Parking" },
                                  { value: "Public Parking", label: "Public Parking" },
                                  { value: "Multilevel Parking", label: "Multilevel Parking" },
                                  { value: "Not Available", label: "Not Available" },
                                ].filter((opt) =>
                                  (projectProperty.parking_types || "")
                                    .split(",")
                                    .includes(opt.value)
                                )}
                                onChange={(selectedOptions) => {
                                  const values = selectedOptions
                                    ? selectedOptions.map((opt) => opt.value)
                                    : [];

                                  let finalValues = values;

                                  if (values.includes("Not Available")) {
                                    finalValues = ["Not Available"];
                                  }

                                  handleProjectPropertyChange(
                                    index,
                                    "parking_types",
                                    finalValues.join(",")
                                  );
                                }}
                                components={{ MultiValue: CustomMultiValue }}
                                placeholder="Select Parking Type"
                                classNamePrefix="react-select"
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    minHeight: "60px",
                                    padding: "6px",
                                    borderColor: state.isFocused ? "#a855f7" : "#d1d5db",
                                    boxShadow: state.isFocused
                                      ? "0 0 0 2px #a855f7"
                                      : "none",
                                    borderRadius: "0.5rem",
                                    fontSize: "16px",
                                    display: "flex",
                                    flexWrap: "nowrap",
                                    overflowX: "auto",
                                  }),
                                  valueContainer: (base) => ({
                                    ...base,
                                    padding: "0 6px",
                                    display: "flex",
                                    flexWrap: "nowrap",
                                    gap: "6px",
                                    overflowX: "auto",
                                    scrollbarWidth: "thin",
                                    alignItems: "center",
                                  }),
                                  placeholder: (base) => ({
                                    ...base,
                                    color: "#1f2937",
                                    fontSize: "16px",
                                  }),
                                  multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: "#ede9fe",
                                    borderRadius: "0.375rem",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "2px 6px",
                                    whiteSpace: "nowrap",
                                  }),
                                  multiValueLabel: (base) => ({
                                    ...base,
                                    color: "#6b21a8",
                                    fontWeight: "500",
                                  }),
                                  multiValueRemove: (base) => ({
                                    ...base,
                                    color: "#6b21a8",
                                    ":hover": {
                                      backgroundColor: "#ddd6fe",
                                      color: "#4c1d95",
                                    },
                                  }),
                                }}
                              />
                            </div>
                          )}
                        {((buildingType === "Residential" && projectProperty.project_type === "Plot/Land") ||
                          (buildingType === "Commercial" &&
                            projectProperty.project_type === "Plot/Land")) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                No. of Open Sides
                              </label>

                              <select
                                value={projectProperty.no_of_open_sides || ""}
                                onChange={(e) =>
                                  handleProjectPropertyChange(
                                    index,
                                    "no_of_open_sides",
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                              >
                                <option value="">Select Open Sides</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                              </select>
                            </div>
                          )}
                        {(buildingType === "Commercial" ||
                          (buildingType === "Residential" &&
                            projectProperty.project_type === "Other")) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Purchase Type
                              </label>

                              <select
                                value={projectProperty.purchase_type || ""}
                                onChange={(e) =>
                                  handleProjectPropertyChange(
                                    index,
                                    "purchase_type",
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                              >
                                <option value="">Select Purchase Type</option>
                                <option value="Resale">Resale</option>
                                <option value="New bookings">New Bookings</option>
                              </select>
                            </div>
                          )}
                        {buildingType === "Commercial" && projectProperty.project_type === "Office" && (
                          <div>
                            <label className="font-medium text-gray-700">
                              Number of Seats Available
                            </label>

                            <input
                              type="text"
                              value={projectProperty.number_of_seats_available || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  handleProjectPropertyChange(
                                    index,
                                    "number_of_seats_available",
                                    value
                                  );
                                }
                              }}
                              placeholder="Enter number of seats"
                              className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          type="button"
                          onClick={() =>
                            setProjectProperties([
                              ...projectProperties,
                              { ...emptyProjectProperty },
                            ])
                          }
                          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-white rounded-lg bg-rose-600 hover:bg-rose-700"
                        >
                          <Plus size={18} />
                          Add Property
                        </button>
                      </div>
                    </div>

                  ))}

                  <div className="p-3 mx-auto mb-3 bg-white border max-w-7xl rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/*  Header full width */}
                    <div className="mb-6 col-span-1 md:col-span-2 lg:col-span-4">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        More Details
                      </h2>
                      <p className="text-gray-500">
                        Comprehensive overview covering scale, financials, features,
                        timeline, and compliance of the project
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-700">
                        Price Range
                      </label>

                      <input
                        type="text"
                        value={averagePrice}
                        readOnly
                        className="w-full p-3 mt-1 border rounded-lg bg-gray-100"
                      />
                    </div>
                    {buildingType === "Residential" ? (
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">
                          Configurations
                        </label>

                        <input
                          type="text"
                          value={configurations}
                          readOnly
                          className="w-full p-3 text-gray-700 bg-gray-100 border rounded-md outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">
                          Available Property Types
                        </label>

                        <input
                          type="text"
                          value={[
                            ...new Set(
                              projectProperties
                                .map((p) => p.project_type)
                                .filter(Boolean)
                            ),
                          ].join(", ")}
                          readOnly
                          className="w-full p-3 text-gray-700 bg-gray-100 border rounded-md outline-none"
                        />
                      </div>
                    )}
                    <div>
                      <label className="font-medium text-gray-700">
                        Possession Status
                      </label>

                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.possession_status || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            possession_status: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Status</option>

                        <option value="Ready To Move">Ready To Move</option>

                        <option value="Under Construction">
                          Under Construction
                        </option>
                      </select>

                      {errors?.possession_status && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <MdErrorOutline className="text-lg" />
                          {errors.possession_status}
                        </p>
                      )}
                    </div>
                    {formData.possession_status === "Under Construction" && (
                      <div>
                        <label className="font-medium text-gray-700">
                          Possession Date{" "}
                        </label>

                        <input
                          type="date"
                          value={formData.possession_date || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              possession_date: e.target.value,
                            })
                          }
                          className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        />

                        {errors?.possession_date && (
                          <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                            <MdErrorOutline className="text-lg" />
                            {errors.possession_date}
                          </p>
                        )}
                      </div>
                    )}
                    <div>
                      <label className="font-medium text-gray-700">
                        RERA ID
                      </label>

                      <input
                        type="text"
                        value={reraId}
                        onChange={(e) => setReraId(e.target.value)}
                        placeholder="Enter RERA Registration Number"
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    {buildingType === "Commercial" && propertyType === "Retail" && (
                      <div>
                        <label className="font-medium text-gray-700">
                          Parking Type
                        </label>

                        <Select
                          isMulti
                          name="parking_types"
                          options={[
                            {
                              value: "Private Parking",
                              label: "Private Parking",
                            },
                            {
                              value: "Public Parking",
                              label: "Public Parking",
                            },
                            {
                              value: "Multilevel Parking",
                              label: "Multilevel Parking",
                            },
                            {
                              value: "Not Available",
                              label: "Not Available",
                            },
                          ]}
                          value={[
                            {
                              value: "Private Parking",
                              label: "Private Parking",
                            },
                            {
                              value: "Public Parking",
                              label: "Public Parking",
                            },
                            {
                              value: "Multilevel Parking",
                              label: "Multilevel Parking",
                            },
                          ].filter((opt) =>
                            (formData.parking_types || "")
                              .split(",")
                              .includes(opt.value),
                          )}
                          onChange={(selectedOptions) => {
                            const values = selectedOptions.map((opt) => opt.value);

                            let finalValues = values;

                            if (values.includes("Not Available")) {
                              finalValues = ["Not Available"];
                            }

                            handleInputChange({
                              target: {
                                name: "parking_types",
                                value: finalValues.join(","),
                              },
                            });
                          }}
                          components={{ MultiValue: CustomMultiValue }}
                          placeholder="Select Parking Type"
                          classNamePrefix="react-select"
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              minHeight: "60px",
                              padding: "6px",
                              borderColor: state.isFocused ? "#a855f7" : "#d1d5db",
                              boxShadow: state.isFocused
                                ? "0 0 0 2px #a855f7"
                                : "none",
                              borderRadius: "0.5rem",
                              fontSize: "16px",
                              display: "flex",
                              flexWrap: "nowrap",
                              overflowX: "auto",
                            }),

                            valueContainer: (base) => ({
                              ...base,
                              padding: "0 6px",
                              display: "flex",
                              flexWrap: "nowrap",
                              gap: "6px",
                              overflowX: "auto",
                              scrollbarWidth: "thin",
                              alignItems: "center",
                            }),

                            placeholder: (base) => ({
                              ...base,
                              color: "#1f2937",
                              fontSize: "16px",
                            }),

                            multiValue: (base) => ({
                              ...base,
                              backgroundColor: "#ede9fe",
                              borderRadius: "0.375rem",
                              display: "flex",
                              alignItems: "center",
                              padding: "2px 6px",
                              whiteSpace: "nowrap",
                            }),

                            multiValueLabel: (base) => ({
                              ...base,
                              color: "#6b21a8",
                              fontWeight: "500",
                            }),

                            multiValueRemove: (base) => ({
                              ...base,
                              color: "#6b21a8",
                              ":hover": {
                                backgroundColor: "#ddd6fe",
                                color: "#4c1d95",
                              },
                            }),
                          }}
                        />
                      </div>
                    )}
                    {buildingType === "Commercial" &&
                      propertyType === "Hospitality" && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Quality Rating
                          </label>

                          <select
                            value={formData.quality_rating || ""}
                            onChange={(e) =>
                              handleInputChange("quality_rating", e.target.value)
                            }
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Rating</option>
                            <option value="No Rating">No Rating</option>
                            <option value="1 Star">1 Star</option>
                            <option value="2 Star">2 Star</option>
                            <option value="3 Star">3 Star</option>
                            <option value="4 Star">4 Star</option>
                            <option value="5 Star">5 Star</option>
                            <option value="6 Star">6 Star</option>
                            <option value="7 Star">7 Star</option>
                          </select>
                        </div>
                      )}
                    {buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor" && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Builder Floor Type{" "}
                            <span className="text-red-500">*</span>
                          </label>

                          <select
                            value={formData.builder_floor_type || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "builder_floor_type",
                                e.target.value,
                              )
                            }
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Floor Type</option>
                            {builderFloorOptions.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    {((buildingType === "Residential" && propertyType === "Plot/Land") ||
                      (buildingType === "Commercial" &&
                        propertyType === "Plot/Land")) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            No. of Open Sides
                          </label>

                          <select
                            name="no_of_open_sides"
                            value={formData.no_of_open_sides || ""}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Open Sides</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                          </select>
                        </div>
                      )}
                    {((buildingType === "Residential" && propertyType === "Plot/Land") ||
                      (buildingType === "Commercial" &&
                        propertyType === "Plot/Land")) && (
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">
                            Any Construction on Property
                          </label>

                          <select
                            name="type_of_construction"
                            value={formData.type_of_construction || ""}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Construction Type</option>
                            {constructionOptions.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    {!(
                      (buildingType === "Residential" && propertyType === "Plot/Land") ||
                      (buildingType === "Commercial" &&
                        [
                          "Land",
                          "Plot/Land",
                          "Warehouse",
                          "Storage",
                          "Industry",
                          "Hospitality",
                        ].includes(propertyType))
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Lift Availability
                          </label>

                          <select
                            value={formData.lift_availability || ""}
                            onChange={(e) =>
                              handleInputChange("lift_availability", e.target.value)
                            }
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Lift Availability</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      )}
                    {buildingType === "Commercial" && propertyType === "Office" && (
                      <div>
                        <label className="font-medium text-gray-700">
                          Number of Seats Available
                        </label>

                        <input
                          type="text"
                          value={formData.number_of_seats_available || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setFormData((prev) => ({
                                ...prev,
                                number_of_seats_available: value,
                              }));
                            }
                          }}
                          placeholder="Enter number of seats"
                          className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    )}
                    {buildingType === "Residential" && propertyType === "PG" && (
                      <div>
                        <label className="font-medium text-gray-700">
                          Available For{" "}
                          <span className="text-xl font-bold text-red-500">*</span>
                        </label>

                        <select
                          value={formData.available_for || ""}
                          onChange={(e) =>
                            handleInputChange("available_for", e.target.value)
                          }
                          className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          <option value="">Select Availability</option>
                          <option value="Girls">Girls</option>
                          <option value="Boys">Boys</option>
                          <option value="Family">Family</option>
                          <option value="Single women">Single women</option>
                          <option value="Single Men">Single Men</option>
                        </select>

                        {errors?.available_for && (
                          <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                            <MdErrorOutline className="text-lg" />
                            {errors.available_for}
                          </p>
                        )}
                      </div>
                    )}
                    {buildingType === "Residential" && propertyType === "PG" && (
                      <div>
                        <label className="font-medium text-gray-700">
                          Room Type <span className="text-red-500">*</span>
                        </label>

                        <select
                          value={formData.room_type || ""}
                          onChange={(e) =>
                            handleInputChange("room_type", e.target.value)
                          }
                          className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          <option value="">Select Room Type</option>
                          <option value="Private">Private</option>
                          <option value="Sharing">Sharing</option>
                        </select>

                        {errors?.room_type && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.room_type}
                          </p>
                        )}
                      </div>
                    )}
                    {buildingType === "Residential" &&
                      propertyType === "PG" &&
                      formData.room_type === "Sharing" && (
                        <div>
                          <label className="block mb-1 font-medium text-gray-700">
                            How many people can share this room?
                          </label>

                          <select
                            value={formData.no_of_peoples || ""}
                            onChange={(e) =>
                              handleInputChange("no_of_peoples", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="4">4+</option>
                          </select>
                        </div>
                      )}
                    {buildingType === "Residential" && propertyType === "PG" && (
                      <div>
                        <label className="font-medium text-gray-700">
                          Total Beds
                        </label>

                        <input
                          type="text"
                          value={formData.total_beds || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              handleInputChange("total_beds", value);
                            }
                          }}
                          className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    )}
                    {buildingType === "Residential" && propertyType === "PG" && (
                      <div>
                        <label className="block mb-1 font-medium text-gray-700">
                          Available Beds
                        </label>

                        <input
                          type="text"
                          value={formData.available_beds || ""}
                          placeholder="Enter Available Beds"
                          onChange={(e) => {
                            const value = e.target.value;

                            if (/^\d*$/.test(value)) {
                              handleInputChange("available_beds", value);
                            }
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    )}
                    {buildingType === "Residential" && propertyType === "PG" && (
                      <div className="md:col-span-3 mt-4">
                        <div className="flex flex-wrap gap-4">
                          {/* Attached Balcony */}
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formData.attached_balcony === "Yes"}
                              onChange={(e) =>
                                handleInputChange(
                                  "attached_balcony",
                                  e.target.checked ? "Yes" : "No",
                                )
                              }
                            />
                            Attached Balcony
                          </label>

                          {/* Attached Bathroom */}
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formData.attached_bathroom === "Yes"}
                              onChange={(e) =>
                                handleInputChange(
                                  "attached_bathroom",
                                  e.target.checked ? "Yes" : "No",
                                )
                              }
                            />
                            Attached Bathroom
                          </label>
                        </div>
                      </div>
                    )}
                    {!(
                      (buildingType === "Residential" && propertyType === "Plot/Land") ||
                      (buildingType === "Commercial" &&
                        [
                          "Land",
                          "Plot/Land",
                          "Industry",
                          "Storage",
                          "Hospitality",
                          "Retail",
                        ].includes(propertyType))
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Parking Availability
                          </label>

                          <select
                            value={formData.parking_availability || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "parking_availability",
                                e.target.value,
                              )
                            }
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      )}
                    {!(
                      (buildingType === "Residential" && propertyType === "Plot/Land") ||
                      (buildingType === "Commercial" &&
                        [
                          "Land",
                          "Plot/Land",
                          "Industry",
                          "Storage",
                          "Hospitality",
                        ].includes(propertyType))
                    ) &&
                      formData.parking_availability === "Yes" && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Covered Car Parking
                          </label>

                          <select
                            value={formData.covered_parking || ""}
                            onChange={(e) =>
                              handleInputChange("covered_parking", e.target.value)
                            }
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Covered Car Parking</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="6+">6+</option>
                            <option value="NA">NA</option>
                          </select>
                        </div>
                      )}
                    {!(
                      (buildingType === "Residential" && propertyType === "Plot/Land") ||
                      (buildingType === "Commercial" &&
                        [
                          "Land",
                          "Plot/Land",
                          "Industry",
                          "Storage",
                          "Hospitality",
                        ].includes(propertyType))
                    ) &&
                      formData.parking_availability === "Yes" && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Open Car Parking
                          </label>

                          <select
                            value={formData.uncovered_parking || ""}
                            onChange={(e) =>
                              handleInputChange("uncovered_parking", e.target.value)
                            }
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Open Car Parking</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="6+">6+</option>
                            <option value="NA">NA</option>
                          </select>
                        </div>
                      )}
                    <div className="md:col-span-3 mt-2">
                      <div className="flex flex-wrap gap-4 mt-2">
                        {/* All Inclusive Price */}
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.all_inclusive_price === "Yes"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                all_inclusive_price: e.target.checked
                                  ? "Yes"
                                  : "No",
                              })
                            }
                          />
                          All Inclusive Price
                        </label>
                        {/* Price Onwards */}
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.price_onwards === "Yes"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price_onwards: e.target.checked ? "Yes" : "No",
                              })
                            }
                          />
                          Price Onwards
                        </label>
                        {/* Price Negotiable */}
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.price_negotiable === "Yes"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price_negotiable: e.target.checked ? "Yes" : "No",
                              })
                            }
                          />
                          Price Negotiable
                        </label>

                        {/* Tax & Govt Charges */}
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.tax_and_goverment_charges === "Yes"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                tax_and_goverment_charges: e.target.checked
                                  ? "Yes"
                                  : "No",
                              })
                            }
                          />
                          Tax & Government Charges Excluded
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 mx-auto mb-16 bg-white border max-w-7xl rounded-xl">
                    {/* Header Section */}
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Generate Project Information with AI
                      </h2>
                      <p className="text-gray-500">
                        Details about the project, including an overview and
                        description that provides insight into the project's
                        purpose, goals, and unique aspects.
                      </p>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-[2.9fr_1fr]">
                      {/* About Project */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-medium text-gray-700">
                            About Project
                          </label>
                          <button
                            type="button"
                            onClick={generateDescription}
                            disabled={isGeneratingDescription}
                            className="px-4 py-2 text-sm text-white transition rounded-lg bg-rose-500 hover:bg-rose-600 disabled:opacity-50"
                          >
                            {isGeneratingDescription
                              ? "Generating..."
                              : "Generate Description"}
                          </button>
                        </div>

                        <div className="relative w-full mt-1">
                          <textarea
                            value={description}
                            maxLength={800}
                            onChange={(e) => {
                              const value = e.target.value;
                              setDescription(value);
                            }}
                            placeholder="Enter Project Description"
                            className="w-full h-40 p-3 pb-7 pr-16 text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500 resize-none block"
                          />
                          <span className="absolute bottom-2 right-3 text-xs text-gray-400 pointer-events-none select-none z-10">
                            {(description || "").length}/800
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}


            {activeStep === 3 && (
              <>
                <div className="max-w-4xl p-6 mx-auto mb-24 bg-white border border-gray-300 shadow-sm rounded-xl">
                  {/* Title & Subtitle */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Amenities
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Select the amenities available in your project. The
                      checkboxes below are dynamically generated from your
                      settings.
                    </p>
                  </div>

                  {/* Error Message for Amenities */}
                  {errors.amenities && (
                    <p className="flex items-center gap-1 mb-4 text-sm text-red-500">
                      <MdErrorOutline className="text-lg" />
                      {errors.amenities}
                    </p>
                  )}

                  {/* Amenities List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                    {amenitiesList.map((amenity, index) => (
                      <label
                        key={index}
                        className="flex items-center p-2 space-x-3 transition rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity._id)}
                          onChange={() => toggleAmenity(amenity._id)}
                          className="w-5 h-5 my-text border-gray-300 form-checkbox focus:ring-rose-500"
                        />
                        <span
                          className={`text-gray-700 ${selectedAmenities.includes(amenity._id) ? "my-text font-semibold" : ""}`}
                        >
                          {amenity.amenity_name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeStep === 4 && (
              <div className="max-w-5xl p-6 pt-0 mx-auto">
                {/* Company Logo Upload */}
                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                  <h2 className="text-xl text-gray-900">Upload Company Logo</h2>
                  <p className="mt-1 text-gray-500">
                    Upload your project's or company's logo here.
                  </p>
                  <div
                    className="relative flex flex-col items-center p-6 mt-4 border-2 border-gray-300 border-dashed rounded-lg"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file && file.type.startsWith("image/"))
                        setCompanyLogo(file);
                    }}
                  >
                    {companyLogo ? (
                      <div className="relative w-32 h-32">
                        <img
                          src={
                            companyLogo instanceof File
                              ? URL.createObjectURL(companyLogo)
                              : companyLogo
                          }
                          alt="Company Logo"
                          className="object-contain w-full h-full border rounded"
                        />
                        <button
                          onClick={() => {
                            setCompanyLogo(null);

                            setFormData((prev) => ({
                              ...prev,
                              remove_logo: "Yes",
                            }));
                          }}
                          className="absolute flex items-center justify-center w-6 h-6 text-white bg-black bg-opacity-50 rounded-full top-1 right-1"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <MdOutlineDriveFolderUpload className="text-6xl text-gray-400" />
                        <p className="mt-2 text-gray-700">
                          Drag & Drop or Click to Upload Logo
                        </p>
                        <button
                          onClick={() => companyLogoInputRef.current.click()}
                          className="px-4 py-2 mt-3 text-white my-bg rounded-md hover:my-bg"
                        >
                          + Upload Logo
                        </button>
                        <p className="mt-2 text-xs text-center text-gray-400">
                          Accepted formats: .jpg, .png, .jpeg | Max size: 5MB
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={companyLogoInputRef}
                      onChange={(e) =>
                        e.target.files[0] && setCompanyLogo(e.target.files[0])
                      }
                      className="hidden"
                    />
                  </div>
                  {errors.companyLogo && (
                    <p className="flex items-center gap-1 mt-2 text-sm text-red-500">
                      <MdErrorOutline className="text-lg" />
                      {errors.companyLogo}
                    </p>
                  )}
                </div>

                {/* Cover Photo and Video */}
                <div className="grid grid-cols-1 gap-6 my-6 md:grid-cols-2">
                  {/* Cover Image Upload */}
                  <div
                    className="p-6 bg-white border border-gray-200 rounded-xl"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file && file.type.startsWith("image/"))
                        setCoverImage(file);
                    }}
                  >
                    <h2 className="text-xl text-gray-900">
                      Upload Project Cover Photo
                    </h2>
                    <p className="mt-1 text-gray-500">
                      This step allows users to upload cover photo.
                    </p>
                    <div className="relative flex flex-col items-center p-6 mt-4 border-2 border-gray-300 border-dashed rounded-lg">
                      {coverImage ? (
                        <div className="relative w-full">
                          <img
                            src={
                              coverImage instanceof File
                                ? URL.createObjectURL(coverImage)
                                : coverImage
                            }
                            alt="Cover"
                            className="object-cover w-full h-64 rounded-md"
                          />
                          <button
                            onClick={handelCoverImageDelete}
                            className="absolute p-1 bg-black bg-opacity-50 rounded-full top-2 right-2"
                          >
                            <Trash className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <MdOutlineDriveFolderUpload className="text-gray-400 text-8xl" />
                          <p className="mt-2 text-gray-500">
                            Drag and Drop Image or Upload
                          </p>
                          <button
                            onClick={() => imageInputRef.current.click()}
                            className="px-4 py-2 mt-2 text-white my-bg rounded-md hover:my-bg"
                          >
                            + Add Photo
                          </button>
                          <p className="mt-2 text-xs text-center text-gray-400">
                            Accepted formats: .jpg, .gif, .bmp, .png | Max size:
                            50MB
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={(e) => setCoverImage(e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                    {errors.coverImage && (
                      <p className="flex items-center gap-1 mt-2 text-sm text-red-500">
                        <MdErrorOutline className="text-lg" />
                        {errors.coverImage}
                      </p>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div className="flex flex-col gap-6">
                    <div
                      className="p-6 bg-white border border-gray-200 rounded-xl"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file && file.type.startsWith("video/"))
                          handleVideoUpload({ target: { files: [file] } });
                      }}
                    >
                      <h2 className="text-xl text-gray-900">
                        Upload Project Video
                      </h2>
                      <p className="mt-1 text-gray-500">
                        Upload a video showcasing the project.
                      </p>
                      {video ? (
                        <div className="relative">
                          <video
                            controls
                            src={
                              video instanceof File
                                ? URL.createObjectURL(video)
                                : video
                            }
                            className="object-cover w-full rounded-lg h-72"
                          />
                          <button
                            onClick={handleVideoDelete}
                            className="px-4 py-2 mt-4 text-white my-bg rounded-md hover:my-bg"
                          >
                            <Trash className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => videoInputRef.current.click()}
                          className="px-4 py-2 mt-4 text-white my-bg rounded-md hover:my-bg"
                        >
                          Upload Video
                        </button>
                      )}
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Video URL Option */}
                    <div className="p-6 bg-white border border-gray-200 rounded-xl">
                      <h2 className="text-xl text-gray-900">Video Option</h2>
                      <div className="flex gap-4 mt-4">
                        <div className="w-1/2">
                          <label className="block mb-2 text-gray-700">
                            Select Video Source
                          </label>
                          <select
                            value={videoSource}
                            onChange={(e) => setVideoSource(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="">Select</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Vimeo">Vimeo</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="w-1/2">
                          <label className="block mb-2 text-gray-700">
                            Enter Video URL
                          </label>
                          <input
                            type="text"
                            value={videoURL}
                            onChange={(e) => setVideoURL(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images and Virtual Tour */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Property Images */}
                  <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <h2 className="text-xl text-gray-900">
                      Upload Project Images
                    </h2>
                    <p className="mt-1 text-gray-500">
                      Add multiple images to showcase the Project.
                    </p>
                    <div
                      className="flex flex-col items-center p-8 mt-4 border-2 border-gray-300 border-dashed rounded-lg"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const dropped = Array.from(e.dataTransfer.files).filter(
                          (file) => file.type.startsWith("image/"),
                        );
                        if (dropped.length > 0)
                          handleImageUpload2({ target: { files: dropped } });
                      }}
                    >
                      <MdOutlineDriveFolderUpload className="text-gray-400 text-8xl" />
                      <p className="mt-2 text-gray-700">
                        Drag and Drop or Upload
                      </p>
                      <button
                        onClick={() => imageInputRef2.current.click()}
                        className="px-4 py-2 mt-3 text-white my-bg rounded-md hover:my-bg"
                      >
                        + Add Photos
                      </button>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={imageInputRef2}
                        onChange={handleImageUpload2}
                        className="hidden"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-3 mt-6">
                      {images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img?.image || img}
                            alt={`img-${index}`}
                            className="object-cover w-full h-24 rounded-lg"
                          />

                          <button
                            type="button"
                            onClick={() => handleDelete(index, img)}
                            className="absolute p-1 bg-black bg-opacity-50 rounded-md top-1 right-1"
                          >
                            <Trash className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Virtual Tour + Brochure */}
                  <div className="flex flex-col gap-6">
                    <div className="p-6 bg-white border border-gray-200 rounded-xl">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Virtual Tour
                      </h2>
                      <p className="mt-1 text-gray-500">
                        Is a virtual tour available?
                      </p>
                      <select
                        value={virtualTourLink}
                        onChange={(e) => setVirtualTourLink(e.target.value)}
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>

                    {/* Brochure Upload */}
                    <div
                      className="flex flex-col items-center p-8 border-2 border-gray-300 border-dashed rounded-lg"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (
                          file &&
                          (file.type === "application/pdf" ||
                            file.type.startsWith("image/"))
                        ) {
                          handleBrochureUpload({ target: { files: [file] } });
                        }
                      }}
                    >
                      <MdOutlineDriveFolderUpload className="text-gray-400 text-8xl" />
                      <p className="mt-2 text-gray-700">
                        Upload Brochure (PDF/Image)
                      </p>
                      {brochureDoc && (
                        <div className="relative flex flex-col items-center w-full mt-4">
                          <button
                            onClick={handleBrochureDelete}
                            className="absolute top-0 right-0 z-10 flex items-center justify-center w-6 h-6 text-white bg-black bg-opacity-50 rounded-full"
                            title="Delete Brochure"
                          >
                            <Trash className="w-4 h-4 text-white" />
                          </button>
                          {brochureDoc.type === "application/pdf" ? (
                            <div className="flex items-center gap-2">
                              <FaFilePdf className="text-lg text-red-600" />
                              <span className="text-sm text-gray-600">
                                {brochureDoc.name}
                              </span>
                            </div>
                          ) : (
                            <img
                              src={URL.createObjectURL(brochureDoc)}
                              alt="Brochure Preview"
                              className="w-48 h-auto rounded shadow"
                            />
                          )}
                        </div>
                      )}
                      {!brochureDoc && (
                        <button
                          onClick={() => brochureInputRef.current.click()}
                          className="px-4 py-2 mt-3 text-white my-bg rounded-md hover:my-bg"
                        >
                          + Upload Brochure
                        </button>
                      )}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        ref={brochureInputRef}
                        onChange={handleBrochureUpload}
                        className="hidden"
                      />
                      <p className="mt-2 text-xs text-center text-gray-400">
                        Accepted formats: .jpg, .png, .jpeg, .pdf | Max size:
                        50MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Fixed at Bottom
            <div
              className={`fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md flex mx-32 ${activeStep === 0 ? "justify-end" : "justify-between"
                }`}
            >
              {" "}
              {activeStep > 0 && (
                <button
                  onClick={prevStep}
                  className="px-5 py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Back
                </button>
              )}
              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    const isValid = validateStepFields();
                    if (isValid) {
                      handleNext();
                    }
                  }}
                  className="px-5 py-2 text-white my-bg rounded-lg hover:my-bg"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`mt-4 px-4 py-2 rounded ${isSubmitting ? "bg-gray-400" : "bg-green-600 hover:my-bg"} text-white`}
                >
                  {isSubmitting ? "Updating..." : "Update Project"}
                </button>
              )}
            </div> */}

            {/* Navigation Buttons - Fixed at Bottom */}
              <div
                className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md px-3 py-3 sm:px-6 sm:py-4 md:px-10 lg:px-16 xl:px-32 flex items-center gap-3 ${
                  activeStep === 0 ? "justify-end" : "justify-between"
                }`}
              >
                {activeStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="w-full sm:w-auto min-w-[120px] px-5 py-2.5 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Back
                  </button>
                )}

                {activeStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const isValid = validateStepFields();

                      if (isValid) {
                        handleNext();
                      }
                    }}
                    className="w-full sm:w-auto min-w-[120px] px-5 py-2.5 text-white my-bg rounded-lg hover:my-bg"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto min-w-[120px] px-5 py-2.5 rounded ${
                      isSubmitting
                        ? "bg-gray-400"
                        : "bg-green-600 hover:my-bg"
                    } text-white`}
                  >
                    {isSubmitting ? "Updating..." : "Update Project"}
                  </button>
                )}
             </div>
          </div>
        </div>
      </LoadScript>
      {showUpcomingProjectCount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl">
            <h2 className="mb-4 text-xl font-semibold text-red-600">
              Project Posting Limit Reached
            </h2>
            <p className="mb-6 text-gray-700">
              You have reached your maximum limit for posting projects. Please
              purchase a plan to continue creating new projects.
            </p>
            {/* Align buttons at opposite ends with padding */}
            <div className="flex items-center justify-between px-1">
              <button
                className="px-4 py-2 text-white my-bg rounded hover:bg-green-700"
                onClick={() => {
                  setShowUpcomingProjectCount(false);
                  history.push({
                    pathname: "/dashboard",
                    state: { page: "mySubscriptions" },
                  });
                }}
              >
                Purchase Plan
              </button>
              <button
                className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowUpcomingProjectCount(false);
                  history.push("/");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeaturePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl">
            <h2 className="mb-4 text-xl font-semibold text-red-600">
              Purchase feature Subscription Plan
            </h2>
            <p className="mb-6 text-gray-700">
              Please purchase a plan to feature more properties and showcase
              your project in the top projects.
            </p>
            <div className="flex items-center justify-between px-1">
              <button
                className="px-4 py-2 text-white my-bg rounded hover:bg-green-700"
                onClick={() => {
                  setShowFeaturePopup(false);
                  history.push({
                    pathname: "/dashboard",
                    state: { page: "mySubscriptions" },
                  });
                }}
              >
                Purchase Plan
              </button>
              <button
                className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowFeaturePopup(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Editproject;