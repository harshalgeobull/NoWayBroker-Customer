import React, { useState, useEffect, useRef } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { Plus } from "lucide-react"; // Using Lucide Icons for delete button
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import axios from "axios";
import { Trash } from "@phosphor-icons/react";
import { FaFilePdf } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { MdErrorOutline } from "react-icons/md";
import { Country, State } from "country-state-city";
import { FaRupeeSign } from "react-icons/fa";

const AddNewProject = () => {
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
  const GOOGLE_MAPS_API_KEY = "AIzaSyAUCNwxnNo52kFWJNGhRVj-AnkoffmzYe0";
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

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
  const [formErrors, setFormErrors] = useState({});
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

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
- Average Price: ₹${averagePrice || ""}
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

      toast.success("Description generated successfully");
    } catch (error) {
      console.error("Generate Description Error:", error);
      toast.error("Failed to generate description");
    } finally {
      setIsGeneratingDescription(false);
    }
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

  const handleInputChange = (eOrKey, value) => {
    if (typeof eOrKey === "string") {
      setFormData((prev) => ({
        ...prev,
        [eOrKey]: value,
      }));
    } else {
      const { name, value } = eOrKey.target;

      setFormData((prev) => {
        const updatedData = {
          ...prev,
          [name]: value,
        };

        return updatedData;
      });
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
    step1: {},
    step2: {},
    step3: {},
    step4: {},

    average_project_price: "",
    bhk_type: "",
    area: "",
    area_in: "",
    carpet_area: "",
    carpet_area_unit: "",

    custom_deposit_amount: "",
    total_beds: "",
    all_inclusive_price: "No",
    price_negotiable: "No",
    tax_and_goverment_charges: "No",
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

  const handleDelete = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setFileData((prev) => prev.filter((_, i) => i !== index));
  };

  const imageInputRef = useRef(null);

  const [images, setImages] = useState([]);

  const imageInputRef2 = useRef(null);

  const handleImageUpload2 = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB

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

    setVideo(URL.createObjectURL(file));
    setVideoFile(file);
  };

  const handleVideoDelete = () => {
    setVideo(null);
  };

  const handelCoverImageDelete = () => {
    setCoverImage(null);
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
    console.log("Furnished:", formData.furnished_type);
    console.log("React State:", formData);
    console.log("Furnished Value:", formData.furnished_type);
    const projectData = {
      user_id: userId,
      user_type: user_type,
      custom_deposit_amount: formData.custom_deposit_amount,
      project_floor: formData.project_floor,
      total_floor: formData.total_floor,
      parking_availability: formData.parking_availability,
      sub_sub_project_type: formData.sub_sub_project_type,
      investment_options: formData.investment_options,
      quality_rating: formData.quality_rating,
      commercial_washroom: formData.commercial_washroom,
      connect_to_name: user_name,
      connect_to_no: Mobile_Number,
      connect_to_email: user_email,
      project_name: projectName,
      mark_as_featured: isFeatured ? "Yes" : "No",
      building_type: buildingType,
      project_type: propertyType,
      address: address,
      city_name: city,
      state: state,
      country: country,
      zip_code: zipCode,
      latitude: latitude,
      longitude: longitude,
      total_project_size: totalProjectSize,
      congfigurations: configurations,
      launch_date: launchDate,
      possession_start: possessionStart,
      construction_status: constructionStatus,
      rera_id: reraId,
      floor_living_dining: floorLivingDining,
      floor_kitchen_toilet: floorKitchenToilet,
      floor_bedroom: floorBedroom,
      floor_balcony: floorBalcony,
      walls_living_dining: wallsLivingDining,
      walls_kitchen_toilet: wallsKitchenToilet,
      walls_servant_room: wallsServantRoom,
      ceiling: ceiling,
      ceilings_servant_room: ceilingsServantRoom,
      counters_kitchen_toilet: countersKitchenToilet,
      fittings_fixtures_kitchen_toilet: fittingsKitchenToilet,
      fittings_fixtures_servant_room_toilet: fittingsServantRoomToilet,
      door_window_internal_door: internalDoor,
      door_window_external_glazing: externalGlazing,
      electrical: electrical,
      backup: backup,
      security_system: securitySystem,
      virtual_tour_availability: virtualTourLink ? "Yes" : "No",
      project_description: description,
      amenities: selectedAmenities,
      video_url: videoUrl,
      video_url_type: videoSource,
      land_type: formData.land_type,
      selectedConstructionOnLand: formData.selectedConstructionOnLand,
      openSidesOfLand: formData.openSidesOfLand,
      length_of_land: formData.length_of_land,
      breadthOfLand: formData.breadthOfLand,
      no_of_open_sides: formData.no_of_open_sides,
      type_of_construction: formData.type_of_construction,
      furnished_type: formData.furnished_type,
      total_beds: formData.total_beds,
      office_type: formData.office_type,
      parking_types: formData.parking_types,
      purchase_type: formData.purchase_type,
      average_project_price: formData.average_project_price,
      bhk_type: formData.bhk_type,
      area: formData.area,
      area_in: formData.area_in,
      carpet_area: formData.carpet_area,
      carpet_area_unit: formData.carpet_area_unit,
      bathroom: formData.bathroom,
      all_inclusive_price: formData.all_inclusive_price,
      price_negotiable: formData.price_negotiable,
      tax_and_goverment_charges: formData.tax_and_goverment_charges,
      number_of_seats_available: formData.number_of_seats_available,

      personal_washroom: formData.personal_washroom,
      lift_availability: formData.lift_availability,
      property_dimensions_breadth: formData.property_dimensions_breadth,
      property_dimensions_length: formData.property_dimensions_length,
      central_AC: formData.central_AC,
      total_number_parking: formData.total_number_parking,
      possession_date: formData.possession_date,
      age_of_property: formData.age_of_property,
      room_type: formData.room_type,
      no_of_peoples: formData.no_of_peoples,
      available_beds: formData.available_beds,
      covered_parking: formData.covered_parking,
      uncovered_parking: formData.uncovered_parking,
      attached_bathroom: formData.attached_bathroom,
      attached_balcony: formData.attached_balcony,
      available_for: formData.available_for,
      pantry_option: formData.pantry_option,
      no_of_cabines: formData.no_of_cabines,
      no_of_meeting_Rooms: formData.no_of_meeting_Rooms,
      no_of_conference_room: formData.no_of_conference_room,
      builder_floor_type: formData.builder_floor_type,
      possession_status: formData.possession_status,
      possession_by: formData.possession_by,
      total_number_of_rooms: formData.total_number_of_rooms,
      reception_area: formData.reception_area,
      balcony: formData.balcony,
    };

    Object.entries(projectData).forEach(([key, value]) => {
      apiFormData.append(key, value ?? "");
    });

    if (coverImage instanceof File) {
      apiFormData.append("cover_image", coverImage);
    }
    if (videoFile) {
      apiFormData.append("property_video", videoFile);
    }
    if (virtualTourLink) {
      apiFormData.append("virtual_tour_availability", virtualTourLink);
    }
    if (brochureDoc instanceof File) {
      apiFormData.append("brochure_doc", brochureDoc);
    }
    if (companyLogo instanceof File) {
      apiFormData.append("logo", companyLogo);
    }
    if (addressArea) {
      apiFormData.append("address_area", addressArea);
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/post_project`,
        {
          method: "POST",
          body: apiFormData,
        },
      );

      toast.success("Project Data Uploaded successfully.");
      history.push({
        pathname: "/dashboard",
        state: { page: "myProjects" },
      });
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      // Now set matching state
      const states = State.getStatesOfCountry(matchedCountry.isoCode);
      setAllStates(states);

      const matchedState = states.find(
        (s) => s.name.toLowerCase() === extractedState.toLowerCase(),
      );
      if (matchedState) {
        setState(matchedState.name);
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
      if (!projectName.trim()) {
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
      if (!formData.average_project_price) {
        newErrors.average_project_price = "Price is required";
      }

      if (buildingType !== "Commercial" && propertyType !== "Plot/Land") {
        if (!formData.bhk_type) {
          newErrors.bhk_type = "BHK is required";
        }
      }

      if (!formData.carpet_area) {
        newErrors.carpet_area = "Carpet area is required";
      }

      if (!formData.carpet_area_unit) {
        newErrors.carpet_area_unit = "Carpet area unit is required";
      }

      if (!formData.area) {
        newErrors.area = "Built-up area is required";
      }

      if (!formData.area_in) {
        newErrors.area_in = "Built-up area unit is required";
      }

      if (!formData.possession_status) {
        newErrors.possession_status = "Construction Status is required";
      }

      if (formData.possession_status === "Under Construction") {
        if (!formData.possession_date) {
          newErrors.possession_date = "Possession Date is required";
        }
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
    return Object.keys(newErrors).length === 0;
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading Maps...
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-white">
        {/* Navbar */}
        <nav className="items-center justify-center hidden w-full p-4 text-black bg-gray-200 md:flex">
          <h1 className="text-xl">Add New Project</h1>
        </nav>

        {/* Stepper Navigation */}
        <div className="flex flex-wrap justify-center w-full gap-2 p-3 bg-white">
          {steps.map((step, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeStep === index
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
                    value={projectName}
                    onChange={(e) => {
                      const value = e.target.value;
                      const alphaNumericOnly = value.replace(
                        /[^a-zA-Z0-9 ]/g,
                        "",
                      );
                      setProjectName(alphaNumericOnly);
                    }}
                    className={`w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-rose-500 ${
                      errors.projectName
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
                    className="mb-2 mr-2"
                    checked={isFeatured}
                    onChange={(e) => {
                      if (e.target.checked && featureCount === 0) {
                        setShowFeaturePopup(true);
                      } else {
                        setIsFeatured(e.target.checked);
                      }
                    }}
                  />
                  <label
                    htmlFor="featured"
                    className="flex items-center text-gray-700"
                  >
                    Showcase Your Project in the Top Projects{" "}
                    <IoIosInformationCircle className="ml-1 text-lg text-yellow-500 cursor-pointer" />
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
                          }));
                        }}
                        className={`px-4 py-2 rounded-full border ${
                          buildingType === type
                            ? "bg-rose-100 text-rose-700 border-rose-500"
                            : "border-gray-300 text-gray-600"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* {buildingType === "Commercial" && (
  <div className="col-span-2">
    <label className="block mb-1 font-medium text-gray-700">
      Office Type
    </label>

    <select
      value={formData?.office_type || ""}
      onChange={(e) =>
        handleInputChange("office_type", e.target.value)
      }
      className="w-full p-2 border rounded"
    >
      <option value="">Select Office Type</option>
      <option value="Ready">Ready</option>
      <option value="Bare Shell">Bare Shell</option>
    </select>
  </div>
)} */}

                {/* Property Type */}
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
                          onClick={() => setPropertyType(type)}
                          className={`px-4 py-2 rounded-full border ${
                            propertyType === type
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
                          className={`px-4 py-2 rounded-full border transition ${
                            hospitalityType === type
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
                          className={`px-4 py-2 rounded-full border transition ${
                            landType === type
                              ? "bg-rose-100 text-rose-700 border-rose-500"
                              : "border-gray-300 text-gray-600 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setLandType(type);

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
                          className={`px-4 py-2 rounded-full border transition ${
                            industryType === type
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
                          className={`px-4 py-2 rounded-full border transition ${
                            storageType === type
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
                          className={`px-4 py-2 rounded-full border transition ${
                            officeSubType === type
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
                          className={`px-4 py-2 rounded-full border transition ${
                            RetailSubType === type
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
                          className={`px-4 py-2 rounded-full border transition ${
                            retailLocation === type
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
                  {/* <div className="w-full overflow-hidden bg-gray-200 rounded-lg h-80">
                             <LoadScript
                               googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                               libraries={["places"]}
                             >
                               <GoogleMap
                                 mapContainerStyle={{ width: "100%", height: "100%" }}
                                 center={mapCenter}
                                 zoom={14}
                               >
                                 <Marker position={mapCenter} />
                               </GoogleMap>
                             </LoadScript>
                           </div> */}

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
                            const value = e.target.value;
                            const isValid = /^[a-zA-Z0-9\s]*$/.test(value);
                            if (isValid) {
                              setAddress(value);
                            }
                          }}
                          className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${
                            formErrors.address
                              ? "border-red-600"
                              : "border-gray-300"
                          }`}
                        />
                      </Autocomplete>

                      {formErrors.address && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <MdErrorOutline className="text-lg" />
                          {formErrors.address}
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
                        }}
                        className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${
                          formErrors.country
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
                      {formErrors.country && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <MdErrorOutline className="text-lg" />
                          {formErrors.country}
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
                        onChange={(e) => setState(e.target.value)}
                        className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${
                          formErrors.state
                            ? "border-red-600"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select State</option>
                        {allStates.map((s) => (
                          <option key={s.isoCode} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.state && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <MdErrorOutline className="text-lg" />
                          {formErrors.state}
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
                          const value = e.target.value;
                          const isValid = /^[a-zA-Z0-9\s]*$/.test(value);
                          if (isValid) {
                            setCity(value);
                          }
                        }}
                        placeholder="Enter City"
                        className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${
                          formErrors.city ? "border-red-600" : "border-gray-300"
                        }`}
                      />
                      {formErrors.city && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <MdErrorOutline className="text-lg" />
                          {formErrors.city}
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
                          }
                        }}
                        className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${
                          formErrors.zipCode
                            ? "border-red-600"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.zipCode && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <MdErrorOutline className="text-lg" />
                          {formErrors.zipCode}
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

                <div className="grid items-start grid-cols-6 gap-4 p-4 mt-4 rounded-lg">
                  {/* Property Price */}
                  <div className="w-full">
                    <label className="block mb-0 text-sm font-medium text-gray-700">
                      Price{" "}
                      <span className="text-xl font-bold text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.average_project_price || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,20}$/.test(value)) {
                          handleInputChange("average_project_price", value);
                        }
                      }}
                      placeholder="₹"
                      className="w-full mt-1 p-3 border rounded-lg text-gray-700 outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    {errors.average_project_price && (
                      <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                        <MdErrorOutline className="text-lg" />
                        {errors.average_project_price}
                      </p>
                    )}
                  </div>

                  {/* BHK */}
                  {!(
                    buildingType === "Commercial" ||
                    propertyType === "Plot/Land"
                  ) && (
                    <div className="w-full">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        BHK{" "}
                        <span className="text-xl font-bold text-red-500">
                          *
                        </span>
                      </label>

                      <select
                        value={formData.bhk_type || ""}
                        onChange={(e) => {
                          handleInputChange("bhk_type", e.target.value);
                          setConfigurations(e.target.value);
                        }}
                        className="w-full mt-1 p-3 border rounded-lg text-gray-700 outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="">Select BHK Type</option>

                        {(propertyType === "1RK/Studio Apartment"
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
                      value={formData.carpet_area || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,10}$/.test(value)) {
                          handleInputChange("carpet_area", value);
                        }
                      }}
                      className="w-full mt-1 p-3 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Unit</label>
                    <select
                      value={formData.carpet_area_unit || ""}
                      onChange={(e) =>
                        handleInputChange("carpet_area_unit", e.target.value)
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
                      value={formData.area || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,10}$/.test(value)) {
                          handleInputChange("area", value);
                        }
                      }}
                      className="w-full mt-1 p-3 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Unit</label>
                    <select
                      value={formData.area_in || ""}
                      onChange={(e) =>
                        handleInputChange("area_in", e.target.value)
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
                      propertyType === "Plot") ||
                    (buildingType === "Commercial" &&
                      [
                        "Land",
                        "Storage",
                        "Hospitality",
                        "Industry",
                        "Retail",
                        "Warehouse",
                        "Plot/Land",
                      ].includes(propertyType))
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Bathroom
                      </label>

                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.bathroom || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bathroom: Number(e.target.value), // convert to integer
                          })
                        }
                      >
                        <option value="">Select Bathrooms</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                  )}
                  {buildingType === "Commercial" &&
                    propertyType === "Retail" && (
                      <div>
                        <label className="font-medium text-gray-700">
                          Washroom
                        </label>

                        <select
                          value={retailWashroom}
                          onChange={(e) => {
                            setRetailWashroom(e.target.value);

                            setFormData((prev) => ({
                              ...prev,
                              commercial_washroom: e.target.value,
                            }));
                          }}
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
                      propertyType,
                    ) && (
                      <div>
                        <label className="font-medium text-gray-700">
                          Washroom
                        </label>

                        <select
                          name="washroom"
                          value={formData.commercial_washroom}
                          onChange={handleInputChange}
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

                  <div className="md:col-span-3 mt-2">
                    {/* <label className="font-medium text-gray-700">
                      Price Details
                    </label> */}

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
              </div>

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

                {/* {buildingType === "Commercial" &&
                  !["Land", "Plot/Land"].includes(propertyType) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Security Deposit Amount{" "}
                        <span className="text-xl font-bold text-red-500">
                          *
                        </span>
                      </label>

                      <input
                        type="text"
                        name="custom_deposit_amount"
                        value={formData.custom_deposit_amount || ""}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (/^\d{0,10}$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                        placeholder="Enter Security Deposit Amount"
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                      />

                      {errors?.custom_deposit_amount && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <MdErrorOutline className="text-lg" />
                          {errors.custom_deposit_amount}
                        </p>
                      )}
                    </div>
                  )} */}
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
                {!(
                  (buildingType === "Residential" && propertyType === "Plot") ||
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
                      Total Floor
                    </label>

                    <input
                      type="text"
                      name="total_floor"
                      value={formData.total_floor}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                          handleInputChange(e);
                        }
                      }}
                      className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                )}
                {!(
                  (buildingType === "Residential" && propertyType === "Plot") ||
                  (buildingType === "Commercial" &&
                    [
                      "Land",
                      "Plot/Land",
                      "Warehouse",
                      "Industry",
                      "Storage",
                      "Hospitality",
                    ].includes(propertyType))
                ) && (
                  <div>
                    <label className="font-medium text-gray-700">
                      Flat on the floor
                    </label>

                    <select
                      name="project_floor"
                      value={formData.project_floor || ""}
                      onChange={handleInputChange}
                      className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select Floor</option>

                      <option value="Lower Basement">Lower Basement</option>

                      <option value="Basement">Basement</option>

                      <option value="Lower Ground">Lower Ground</option>

                      <option value="Ground">Ground</option>

                      <option value="Rooftop/Terrace">Rooftop/Terrace</option>

                      {[...Array(Number(formData.total_floor) || 0)].map(
                        (_, index) => (
                          <option key={index + 1} value={`${index + 1}`}>
                            {index + 1}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                )}
                {/* {[
                  "Apartment",
                  "1RK/Studio Apartment",
                  "Service Apartment",
                  "Office",
                ].includes(propertyType) && (
                  <div>
                    <label className="font-medium text-gray-700">
                      Total Number of Parking
                    </label>

                    <input
                      type="text"
                      value={formData.total_number_parking || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "total_number_parking",
                          e.target.value,
                        )
                      }
                      className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Enter total parking"
                    />
                  </div>
                )} */}
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
                        // {
                        //   value: "Not Available",
                        //   label: "Not Available",
                        // },
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
                {buildingType === "Commercial" && propertyType === "Office" && (
                  <div>
                    <label className="font-medium text-gray-700">
                      No. of Cabines
                    </label>

                    <select
                      value={formData.no_of_cabines || ""}
                      onChange={(e) =>
                        handleInputChange("no_of_cabines", e.target.value)
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
                {buildingType === "Commercial" && propertyType === "Office" && (
                  <div>
                    <label className="font-medium text-gray-700">
                      No. of Meeting Rooms
                    </label>

                    <select
                      value={formData.no_of_meeting_Rooms || ""}
                      onChange={(e) =>
                        handleInputChange("no_of_meeting_Rooms", e.target.value)
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
                {buildingType === "Commercial" && propertyType === "Office" && (
                  <div>
                    <label className="font-medium text-gray-700">
                      No. of Conference Room
                    </label>

                    <select
                      value={formData.no_of_conference_room || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "no_of_conference_room",
                          e.target.value,
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
                  propertyType === "Hospitality" && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Total Number of Rooms
                      </label>

                      <input
                        type="text"
                        value={formData.total_number_of_rooms || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            handleInputChange("total_number_of_rooms", value);
                          }
                        }}
                        placeholder="Enter Total Rooms"
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
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

                {((buildingType === "Residential" && propertyType === "Plot") ||
                  (buildingType === "Commercial" &&
                    ["Land", "Plot/Land"].includes(propertyType))) && (
                  <div>
                    <label className="font-medium text-gray-700">Facing</label>

                    <select
                      name="facing"
                      value={formData.facing || ""}
                      onChange={handleInputChange}
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
                {((buildingType === "Residential" && propertyType === "Plot") ||
                  (buildingType === "Commercial" &&
                    propertyType === "Plot/Land")) && (
                  <>
                    {/* Length */}
                    <div>
                      <label className="font-medium text-gray-700">
                        Length of Plot (ft){" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        value={formData.property_dimensions_length || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            handleInputChange(
                              "property_dimensions_length",
                              value,
                            );
                          }
                        }}
                        placeholder="Enter Length"
                        className={`w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${
                          errors?.property_dimensions_length
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
                        value={formData.property_dimensions_breadth || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            handleInputChange(
                              "property_dimensions_breadth",
                              value,
                            );
                          }
                        }}
                        placeholder="Enter Breadth"
                        className={`w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${
                          errors?.property_dimensions_breadth
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
                {((buildingType === "Residential" && propertyType === "Plot") ||
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
                {((buildingType === "Residential" && propertyType === "Plot") ||
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
                {/* {((buildingType === "Residential" && propertyType === "Plot") ||
                  (buildingType === "Commercial" &&
                    propertyType === "Plot/Land")) && (
                  <div>
                    <label className="font-medium text-gray-700">
                      Possession By
                    </label>

                    <select
                      value={formData.possession_by || ""}
                      onChange={(e) =>
                        handleInputChange("possession_by", e.target.value)
                      }
                      className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select Possession</option>
                      <option value="Immediate">Immediate</option>
                      <option value="Within 3 Months">Within 3 Months</option>
                      <option value="Within 6 Months">Within 6 Months</option>
                      <option value="By 2026">By 2026</option>
                      <option value="By 2027">By 2027</option>
                      <option value="By 2028">By 2028</option>
                      <option value="By 2029">By 2029</option>
                      <option value="By 2030">By 2030</option>
                      <option value="By 2031">By 2031</option>
                      <option value="By 2032">By 2032</option>
                    </select>
                  </div>
                )} */}
                {!(
                  (buildingType === "Residential" && propertyType === "Plot") ||
                  (buildingType === "Commercial" &&
                    [
                      "Land",
                      "Plot/Land",
                      "Industry",
                      "Storage",
                      "Hospitality",
                    ].includes(propertyType)) ||
                  formData.possession_status === "Under Construction"
                ) && (
                  <div>
                    <label className="font-medium text-gray-700">
                      Age of Property
                    </label>

                    <select
                      value={formData.age_of_property || ""}
                      onChange={(e) =>
                        handleInputChange("age_of_property", e.target.value)
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
                {propertyType !== "Plot/Land" && (
                  <div>
                    <label className="font-medium text-gray-700">
                      Furnishing Type{" "}
                      <span className="text-xl font-bold text-red-500">*</span>
                    </label>

                    <select
                      value={formData.furnished_type || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          furnished_type: e.target.value,
                        }))
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
                {buildingType === "Residential" && propertyType !== "Plot" && (
                  <div>
                    <label className="font-medium text-gray-700">Balcony</label>

                    <select
                      name="balcony"
                      value={formData.balcony || ""}
                      onChange={handleInputChange}
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

                {/* {!(
                  (buildingType === "Residential" && propertyType === "Plot") ||
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
                    <label className="font-medium text-gray-700">Balcony</label>

                    <select
                      name="balcony"
                      value={formData.balcony || ""}
                      onChange={handleInputChange}
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
                )} */}
                {!(
                  (buildingType === "Residential" && propertyType === "Plot") ||
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
                {buildingType === "Commercial" &&
                  propertyType === "Office" &&
                  [
                    "Bare shell office space",
                    "Ready to move office space",
                  ].includes(officeSubType) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Pantry
                      </label>

                      <select
                        value={formData.pantry_option || ""}
                        onChange={(e) =>
                          handleInputChange("pantry_option", e.target.value)
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

                {buildingType === "Commercial" && propertyType === "Office" && (
                  <div>
                    <label className="font-medium text-gray-700">
                      Central AC
                    </label>

                    <select
                      value={formData.central_AC || ""}
                      onChange={(e) =>
                        handleInputChange("central_AC", e.target.value)
                      }
                      className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select Option</option>

                      {formData.office_type === "Ready to move office space" ? (
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
                {buildingType === "Commercial" && propertyType === "Office" && (
                  <div>
                    <label className="font-medium text-gray-700">
                      Reception Area
                    </label>

                    <select
                      value={formData.reception_area || ""}
                      onChange={(e) =>
                        handleInputChange("reception_area", e.target.value)
                      }
                      className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select Option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                )}

                {/* {buildingType === "Commercial" &&
                  [
                    "Office",
                    "Retail",
                    "Storage",
                    "Industry",
                    "Hospitality",
                    "Other",
                  ].includes(propertyType) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Investment Option
                      </label>

                      <select
                        name="investment_options"
                        value={formData.investment_options || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="">Select Investment Option</option>
                        <option value="Pre-Leased Spaces">
                          Pre-Leased Spaces
                        </option>
                        <option value="Restaurants">Restaurants</option>
                        <option value="SCO Plots">SCO Plots</option>
                        <option value="Business Center">Business Center</option>
                        <option value="Food Court">Food Court</option>
                        <option value="Multiplex">Multiplex</option>
                        <option value="Co-working">Co-working</option>
                      </select>
                    </div>
                  )}
                {((buildingType === "Commercial" &&
                  [
                    "Office",
                    "Retail",
                    "Storage",
                    "Industry",
                    "Hospitality",
                    "Other",
                  ].includes(propertyType)) ||
                  (buildingType === "Residential" &&
                    propertyType === "Other")) && (
                  <div>
                    <label className="font-medium text-gray-700">
                      Purchase Type
                    </label>

                    <select
                      name="purchase_type"
                      value={formData.purchase_type || ""}
                      onChange={handleInputChange}
                      className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select Purchase Type</option>
                      <option value="Resale">Resale</option>
                      <option value="New Bookings">New Bookings</option>
                    </select>
                  </div>
                )} */}
                {buildingType === "Commercial" &&
                  ["Office Space"].includes(propertyType) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Personal Washroom
                      </label>

                      <select
                        name="personal_washroom"
                        value={formData.personal_washroom || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="">Select</option>
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
                        <option value="4+">4+</option>
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
                  (buildingType === "Residential" && propertyType === "Plot") ||
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
                  (buildingType === "Residential" && propertyType === "Plot") ||
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
                  (buildingType === "Residential" && propertyType === "Plot") ||
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
              </div>

              <div className="p-3 mx-auto mb-16 bg-white border max-w-7xl rounded-xl">
                {/* Header Section */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Project Info
                  </h2>
                  <p className="text-gray-500">
                    Details about the project, including an overview and
                    description that provides insight into the project's
                    purpose, goals, and unique aspects.
                  </p>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-[2.9fr_1fr]">
                  {/* About Project  */}
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      About Project
                    </label>
                    <div className="flex justify-end mb-2">
                      <button
                        type="button"
                        onClick={generateDescription}
                        disabled={isGeneratingDescription}
                        className="px-4 py-2 text-white rounded-lg bg-rose-500 hover:bg-rose-600 disabled:opacity-50"
                      >
                        {isGeneratingDescription
                          ? "Generating..."
                          : "Generate Description"}
                      </button>
                    </div>
                    <textarea
                      type="text"
                      value={description}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDescription(value);
                      }}
                      className="w-full h-40 p-3 text-gray-700 border rounded-md outline-none focus:ring-2 focus:ring-rose-500"
                    />
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
                        src={URL.createObjectURL(companyLogo)}
                        alt="Company Logo"
                        className="object-contain w-full h-full border rounded"
                      />
                      <button
                        onClick={() => setCompanyLogo(null)}
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
                          src={URL.createObjectURL(coverImage)}
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
                          src={video}
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
                          src={img}
                          alt={`img-${index}`}
                          className="object-cover w-full h-24 rounded-lg"
                        />
                        <button
                          onClick={() => handleDelete(index)}
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
                      {/* <option value="">Select Virtual Tour Available?</option> */}
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
                      Accepted formats: .jpg, .png, .jpeg, .pdf | Max size: 50MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons - Fixed at Bottom */}
          <div
            className={`fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md flex mx-32 ${
              activeStep === 0 ? "justify-end" : "justify-between"
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
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>

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
export default AddNewProject;
