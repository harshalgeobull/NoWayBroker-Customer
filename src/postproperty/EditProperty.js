import React, { useState, useEffect, useRef } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { ToWords } from "to-words";
import { Trash } from "lucide-react"; // Using Lucide Icons for delete button
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import axios from "axios";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { MdErrorOutline } from "react-icons/md";
import Select, { components } from "react-select";
import { Country, State } from "country-state-city";
import { useParams } from "react-router-dom";

const EditProperty = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 });
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
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const autoCompleteRef = useRef(null);
  const GOOGLE_MAPS_API_KEY = "AIzaSyAt8bj4UACvakZfiSy-0c1o_ivfplm7jEU";
  const userId = sessionStorage.getItem("accessToken");
  const userType = sessionStorage.getItem("user_type");
  const user_name = sessionStorage.getItem("user_name");
  const Mobile_Number = sessionStorage.getItem("Mobile_Number");
  const user_email = sessionStorage.getItem("user_email");
  const [virtualTourLink, setVirtualTourLink] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [markAsFeatured, setMarkAsFeatured] = useState("No");
  const [adminApproval, setAdminApproval] = useState("Approved");
  const [propertyPrice, setPropertyPrice] = useState("");
  const [bhkType, setBhkType] = useState("");
  const [bathroom, setBathroom] = useState("");
  // const [area, setArea] = useState("");
  // const [areaIn, setAreaIn] = useState("");
  // const [areaType, setAreaType] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [units, setUnits] = useState("");
  const [plotNo, setPlotNo] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableOn, setAvailableOn] = useState("");
  const [operatingSince, setOpertingSince] = useState("");
  const [furnishedType, setFurnishedType] = useState("");
  const [totalFloor, setTotalFloor] = useState("");
  const [propertyFloor, setPropertyFloor] = useState("");
  const [block, setblock] = useState("");
  const [security, setSecurity] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [availableStatus, setAvailableStatus] = useState("");
  const [amenities, setAmenities] = useState("");
  const [possessionStatus, setPossessionStatus] = useState("");
  const [possessionDate, setPossessionDate] = useState("");
  const [ageOfProperty, setAgeOfProperty] = useState("");
  const [coveredParking, setCoveredParking] = useState("");
  const [uncoveredParking, setUncoveredParking] = useState("");
  const [balcony, setBalcony] = useState("");
  const [powerBackup, setPowerBackup] = useState("");
  const [facing, setFacing] = useState("");
  const [view, setView] = useState("");
  const [flooring, setFlooring] = useState("");
  const [waterSource, setWaterSource] = useState("");
  const [additionalRooms, setAdditionalRooms] = useState("");
  const [liftAvailability, setLiftAvailability] = useState("");
  const [loanAvailability, setLoanAvailability] = useState("");
  const [propertyNo, setPropertyNo] = useState("");
  const [officeSpaceType, setOfficeSpaceType] = useState("");
  const [pantry, setPantry] = useState("");
  const [personalWashroom, setPersonalWashroom] = useState("No");
  const [ceilingHeight, setCeilingHeight] = useState("");
  const [parkingAvailability, setParkingAvailability] = useState("");
  const [seatType, setSeatType] = useState("");
  const [numberOfSeatsAvailable, setNumberOfSeatsAvailable] = useState("");
  const [rent, setRent] = useState("");
  const [rentDuration, setRentDuration] = useState("");
  const [maintenanceCost, setMaintenanceCost] = useState("");
  const [maintenanceFrequency, setMaintenanceFrequency] = useState("");
  const [maintenanceIncluded, setMaintenanceIncluded] = useState("");
  const [securityDepositType, setSecurityDepositType] = useState("");
  const [securityDepositAmount, setSecurityDepositAmount] = useState("");
  const [customDepositAmount, setCustomDepositAmount] = useState("");
  const [availableForCompanyLease, setAvailableForCompanyLease] = useState("");
  const [availableFor, setAvailableFor] = useState("");
  const [suitedFor, setSuitedFor] = useState("");
  const [roomType, setRoomType] = useState("");
  const [foodAvailable, setFoodAvailable] = useState("");
  const [foodChargesIncluded, setFoodChargesIncluded] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [noticePeriodOtherDays, setNoticePeriodOtherDays] = useState("");
  const [electricityChargesIncluded, setElectricityChargesIncluded] =
    useState("");
  const [totalBeds, setTotalBeds] = useState("");
  const [pgRules, setPgRules] = useState("");
  const [gateClosingTime, setGateClosingTime] = useState("");
  const [gateClosingHour, setGateClosingHour] = useState("");
  const [pgServices, setPgServices] = useState("");
  const [minLockinPeriod, setMinLockinPeriod] = useState("");
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const history = useHistory();
  const [showFeaturePopup, setShowFeaturePopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [freePostCount, setFreePostCount] = useState(0);
  const [paidPostCount, setPaidPostCount] = useState(0);
  const [featureCount, setFeatureCount] = useState(0);
  const [isPostCountLoaded, setIsPostCountLoaded] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isStepValid, setIsStepValid] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [officeSubType, setOfficeSubType] = useState("");
  const [RetailSubType, setRetailSubType] = useState("");
  const [landType, setLandType] = useState("");
  const [washroom, setWashroom] = useState("No");
  const [conferenceRoom, setConferenceRoom] = useState("No");
  const [lengthOfLand, setLengthOfLand] = useState("");
  const [breadthOfLand, setBreadthOfLand] = useState("");
  const [openSidesOfLand, setOpenSidesOfLand] = useState("");
  const [typeOfConstruction, setTypeOfConstruction] = useState("");
  const [builtUpArea, setBuiltUpArea] = useState("");
  const [builtUpAreaUnit, setBuiltUpAreaUnit] = useState("");
  const [retailLocation, setRetailLocation] = useState("");
  const [storageType, setStorageType] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [hospitalityType, setHospitalityType] = useState("");
  const [builderFloorType, setBuilderFloorType] = useState("");
  const [noOfCabines, setNoOfCabines] = useState("");
  const [noOfMeetingRooms, setNoOfMeetingRooms] = useState("");
  const [noOfConferenceRoom, setNoOfConferenceRoom] = useState("");
  const [receptionArea, setReceptionArea] = useState("");
  const [centralAC, setCentralAC] = useState("");
  const [retailWashroom, setRetailWashroom] = useState("");
  const [parkingTypes, setParkingTypes] = useState("");
  const [possessionBy, setPossessionBy] = useState("");
  const [totalNumberOfRooms, setTotalNumberOfRooms] = useState("");
  const [qualityRating, setQualityRating] = useState("");
  const [totalNumberParking, setTotalNumberParking] = useState("");
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [electricityAndWaterCharges, setElectricityAndWaterCharges] =
    useState(false);
  const [noOfPeoples, setNoOfPeoples] = useState("");
  const [availableBeds, setAvailableBeds] = useState("");
  const [attachedBalcony, setAttachedBalcony] = useState(false);
  const [attachedBathroom, setAttachedBathroom] = useState(false);
  const { _id } = useParams();
  const [carpetArea, setCarpetArea] = useState("");
  const [carpetAreaUnit, setCarpetAreaUnit] = useState("");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const buildPrompt = () => {
    return `
Write a professional real estate property description.

STRICT INSTRUCTIONS:
- The description MUST be between 600 and 700 characters ONLY
- Do NOT exceed 700 characters
- Do NOT go below 600 characters
- Write everything in ONE paragraph
- Do NOT use bullet points or line breaks

Property Details:
- Property Name: ${formData.property_name?.trim() || ""}
- Type: ${propertyType || ""}
- Category: ${propertyCategory === "Buy"
        ? "Buy"
        : propertyCategory === "Rent"
          ? "Rent"
          : "PG"
      }
- Price: �${formData.property_price || formData.rent || ""}
- City: ${city?.trim() || ""}
- Area: ${addressArea || ""}
- BHK: ${formData.bhk_type || ""}
- Bathrooms: ${formData.bathroom || ""}
- Built-up Area: ${builtUpArea || ""} ${builtUpAreaUnit || ""}
- Furnishing: ${formData.furnished_type || ""}
- Floor: ${formData.property_floor || ""}
- Total Floors: ${formData.total_floor || ""}
- Age: ${formData.age_of_property || ""}
- Facing: ${formData.facing || ""}
- Balcony: ${formData.balcony || ""}

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

      const description = response?.data?.choices?.[0]?.message?.content || "";

      setPropertyDescription(description);

      setFormData((prev) => ({
        ...prev,
        property_description: description,
      }));

      toast.success("Description generated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate description");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [_id]);

  const fetchPropertyDetails = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_property_details`,
        { property_id: _id },
      );

      const data = res.data.data.property_details;
      setAddress(data.address || "");
      setAddressArea(data.address_area || "");
      setCity(data.city_name || "");
      setState(data.state || "");
      setCountry(data.country || "");
      setZipCode(data.zip_code || "");
      setLocality(data.locality || "");
      setSubLocality(data.sub_locality || "");
      setLatitude(data.latitude || "");
      setLongitude(data.longitude || "");

      setMapCenter({
        lat: parseFloat(data.latitude) || 18.5204,
        lng: parseFloat(data.longitude) || 73.8567,
      });

      setFormData((prev) => ({
        ...prev,
        ...data,
        property_price: String(data.property_price || ""),
        rent: String(data.rent || ""),
        custom_deposit_amount: String(data.custom_deposit_amount || ""),
        units: String(data.units || ""),
        area: String(data.area || ""),
        carpet_area: String(data.carpet_area || ""),
      }));

      setPropertyCategory(
        data.property_category_type === "PG/Co-living"
          ? "Paying Guest"
          : data.property_category_type === "Commercial Buy"
            ? "Buy"
            : data.property_category_type === "Commercial Lease"
              ? "Rent"
              : data.property_category_type,
      );
      setBuildingType(data.building_type);
      setPropertyType(data.property_type);
      setPriceNegotiable(data.price_negotiable === "Yes");
      setElectricityAndWaterCharges(
        data.electricity_and_water_charges === "Yes",
      );
      setAttachedBalcony(data.attached_balcony === "Yes");
      setAttachedBathroom(data.attached_bathroom === "Yes");
      setPantry(data.pantry_option || "");
      setRoomType(data.room_type || "");
      setNoOfPeoples(data.no_of_peoples || "");
      setAvailableBeds(data.available_beds || "");
      setRetailWashroom(data.washroom || "");
      setPropertyPrice(String(data.property_price || ""));
      setBhkType(data.bhk_type || "");
      setBathroom(data.bathroom || "");
      setFurnishedType(data.furnished_type || "");
      setTotalFloor(data.total_floor || "");
      setFacing(data.facing || "");
      setBuiltUpArea(String(data.area || ""));
      setBuiltUpAreaUnit(data.area_in || "");
      setCarpetArea(String(data.carpet_area || ""));
      setCarpetAreaUnit(data.carpet_area_unit || "");
      //setSelectedAmenities(data.amenities || []);
      const amenitiesArray =
        typeof data.amenities === "string"
          ? data.amenities.split(",").map((id) => id.trim())
          : data.amenities || [];

      setSelectedAmenities(amenitiesArray);

      setCoverImage(data.cover_image || "");
      setVideo(data.property_video);

      if (res.data.data.property_images) {
        setPropertyImages(
          res.data.data.property_images.map((img) => ({
            _id: img._id,
            img: img.image,
            old: true,
          })),
        );
      }
    } catch (error) {
      console.log(error);
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

  const CustomMultiValue = (props) => {
    return (
      <components.MultiValue {...props}>
        <div title={props.data.label} className="flex items-center">
          {props.children}
        </div>
      </components.MultiValue>
    );
  };

  const officeOptions = [
    "Ready to Move Office Space",
    "Bare Sheell Office Space",
    "Co-working Office Space",
  ];

  const landOptions = [
    "Commercial Land/Inst. Land",
    "Industrial Lands/Plots",
    "Agricultural/Farm Land",
  ];

  const constructionOptions = ["Shed", "Rooms", "Washroom", "Others"];
  const retailOptions = ["Commercial Shops", "Commercial Showrooms"];

  const storageOptions = ["Ware House", "Cold Storage"];

  const industryOptions = ["Factory", "Manufacturing"];

  const builderFloorOptions = ["Single Floor", "Duplex", "Triplex"];

  const hospitalityOptions = ["Hotel/Resorts", "Guest-House/Banquet-Halls"];
  const retailLocationOptions = [
    "Mall",
    "Commercial Project",
    "Residential Project",
    "Retail Complex/Building",
    "Market/High Street",
    "Others",
  ];

  const options = [
    { value: "Pooja Room", label: "Pooja Room" },
    { value: "Servant Room", label: "Servant Room" },
    { value: "Study Room", label: "Study Room" },
    { value: "Extra Room", label: "Extra Room" },
  ];

  const roomOptions = [
    { label: "Private", value: "Private" },
    { label: "Sharing", value: "Sharing" },
    // { label: "Triple Sharing", value: "Triple Sharing" },
    // { label: "Quad Sharing", value: "Quad Sharing" },
  ];

  const pgRuleOptions = [
    { label: "1. No Smoking", value: "No Smoking" },
    { label: "2. No Guardian Stay", value: "No Guardian Stay" },
    { label: "3. No Drinking", value: "No Drinking" },
    { label: "4. No Non-Veg", value: "No Non-Veg" },
    { label: "5. Visitor Allow", value: "Visitor Allow" },
    { label: "6. Party", value: "Party" },
    { label: "7. Loud Music", value: "Loud Music" },
    { label: "8. Opposite Gender", value: "Opposite Gender" },
  ];

  const foodOptions = [
    { label: "Breakfast", value: "Breakfast" },
    { label: "Lunch", value: "Lunch" },
    { label: "Dinner", value: "Dinner" },
  ];

  useEffect(() => {
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
          setFreePostCount(countData.free_post_count || 0);
          setPaidPostCount(countData.paid_post_count || 0);
          setFeatureCount(countData.feature_count || 0);
        }

        setIsPostCountLoaded(true);
      } catch (error) {
        console.error("Error checking post limits:", error);
        setIsPostCountLoaded(true);
      }
    };

    if (userId) {
      checkPostLimits();
    }
  }, [userId]);

  useEffect(() => {
    if (isPostCountLoaded) {
      // Check both conditions only after data is loaded
      if (freePostCount <= 0 && paidPostCount <= 0) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    }
  }, [freePostCount, paidPostCount, isPostCountLoaded]);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup on component unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showModal]);

  const steps = [
    "Basic Info",
    "Address",
    "Property Details",
    "Amenities",
    "Photos / Videos",
  ];
  const [activeStep, setActiveStep] = useState(0);

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const nextStep = () => {
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps((prev) => [...prev, activeStep]);
    }
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const [propertyCategory, setPropertyCategory] = useState("Buy");
  const [buildingType, setBuildingType] = useState("Residential");
  const [propertyType, setPropertyType] = useState("Apartment");
  const propertyCategories = ["Buy", "Rent", "Paying Guest"];
  const buildingTypes = ["Residential", "Commercial"];
  const [propertyTypes, setPropertyTypes] = useState([
    "Apartment",
    "Plot",
    "Independent House/Villa",
    "Independent/Builder Floor",
    "1RK/Studio Apartment",
    "Service Apartment",
  ]);

  useEffect(() => {
    if (!_id) return;

    if (propertyCategory === "Buy" && buildingType === "Commercial") {
      setPropertyTypes([
        "Office Space",
        "Retail",
        "Land",
        "Storage",
        "Industry",
        "Hospitality",
        "Other",
      ]);
    } else if (propertyCategory === "Buy" && buildingType === "Residential") {
      setPropertyTypes([
        "Apartment",
        "Plot",
        "Independent House/Villa",
        "Independent/Builder Floor",
        "1RK/Studio Apartment",
        "Service Apartment",
        "Farmhouse",
        "Other",
      ]);
    } else if (propertyCategory === "Rent" && buildingType === "Commercial") {
      setPropertyTypes([
        "Office Space",
        "Retail",
        "Land",
        "Storage",
        "Industry",
        "Hospitality",
        "Other",
      ]);
    } else if (propertyCategory === "Rent" && buildingType === "Residential") {
      setPropertyTypes([
        "Apartment",
        "Independent House/Villa",
        "Independent/Builder Floor",
        "1RK/Studio Apartment",
        "Service Apartment",
        "Farmhouse",
        "Other",
      ]);
    } else if (
      propertyCategory === "Paying Guest" &&
      buildingType === "Residential"
    ) {
      setPropertyTypes([
        "Apartment",
        "Builder Floor",
        "1RK/Studio Apartment",
        "Independent House/Villa",
        "Service Apartment",
      ]);
    }
  }, [propertyCategory, buildingType, _id]);

  // Toggle logic for multiple selection
  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) => {
      const current = Array.isArray(prev)
        ? prev
        : String(prev)
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);

      return current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity];
    });
  };

  // Fetch amenities once
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

  // Sync selectedAmenities into formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      amenities: selectedAmenities,
    }));
  }, [selectedAmenities]);

  const [videoURL, setVideoURL] = useState("");
  const [videoSource, setVideoSource] = useState("");

  // Cover Images -
  const [coverImage, setCoverImage] = useState("");
  const imageInputRef = useRef(null);

  const handelCoverImageDelete = () => {
    setCoverImage(null);
  };

  // Properties Images -
  const fileInputRef2 = useRef();
  const [propertyimages, setPropertyImages] = useState([]);
  const [fileData2, setFileData2] = useState([]);

  const imageInputRef2 = useRef(null);
  const handleImageUpload2 = (input) => {
    // input can be event or array of files
    let files = [];

    if (input && input.target && input.target.files) {
      // called from <input onChange>
      files = Array.from(input.target.files);
    } else if (Array.isArray(input)) {
      // called from drag-drop with files array
      files = input;
    } else {
      return; // invalid input
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    const maxImages = 5;

    let oversizeFound = false;
    let oversizedFiles = [];
    let newImages = [];
    let newFiles = [];

    for (let file of files) {
      if (file.size > maxSize) {
        oversizeFound = true;
        oversizedFiles.push(file.name);
      } else {
        newImages.push(URL.createObjectURL(file));
        newFiles.push(file);
      }
    }

    if (oversizeFound) {
      toast.error(
        `The following images are larger than 50MB: ${oversizedFiles.join(", ")}`,
      );
    }

    if (propertyimages.length + newImages.length > maxImages) {
      toast.error("You can only upload a maximum of 5 images.");
      return;
    }

    setPropertyImages((prev) => [
      ...prev,
      ...newFiles.map((file) => ({
        file,
        img: URL.createObjectURL(file),
        old: false,
      })),
    ]);
    setFileData2((prev) => [...prev, ...newFiles]);

    // Clear the file input value if this was an event
    if (input.target) {
      input.target.value = "";
    }
  };

  const handleDelete2 = async (index) => {
    const image = propertyimages[index];

    if (image.old) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/delete_property_image`,
          {
            property_image_id: image._id,
          },
        );
      } catch (error) {
        console.log(error);
      }
    }

    const updated = propertyimages.filter((_, i) => i !== index);
    setPropertyImages(updated);
  };

  // Video Upload Section -
  const [video, setVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const videoInputRef = useRef();

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 10 * 1024 * 1024;

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Only video files are allowed.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Video must be smaller than 10MB.");
      return;
    }

    if (video) {
      toast.error("Only one video allowed.");
      return;
    }
    setVideo(URL.createObjectURL(file));
    setVideoFile(file);
  };

  const handleVideoDelete = () => {
    setVideo(null);
    setVideoFile(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
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

    setLatitude(location.lat().toString());
    setLongitude(location.lng().toString());

    setAddress(place.formatted_address || "");

    let extractedCountry = "";
    let extractedState = "";
    let extractedCity = "";
    let extractedZip = "";
    let extractedLocality = "";
    let extractedSubLocality = "";

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

      // if (
      //   types.includes("sublocality") ||
      //   types.includes("sublocality_level_1") ||
      //   types.includes("neighborhood")
      // ) {
      //   extractedArea = component.long_name; // Extract area (e.g., neighborhood or sublocality)
      // }
      if (types.includes("sublocality_level_1")) {
        extractedLocality = component.long_name;
      }

      if (types.includes("sublocality_level_2")) {
        extractedSubLocality = component.long_name;
      }
    });

    // Set address fields
    setCity(extractedCity);
    setZipCode(extractedZip);
    setLocality(extractedLocality);
    setSubLocality(extractedSubLocality);

    const addressArea =
      extractedLocality && extractedCity
        ? `${extractedLocality}, ${extractedCity}`
        : extractedCity || extractedLocality || "";
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

  const [formData, setFormData] = useState({
    user_id: userId,
    connect_to_name: user_name,
    connect_to_no: Mobile_Number,
    connect_to_email: user_email,
    building_type: buildingType,
    property_category_type: propertyCategory,
    user_type: userType,
    property_type: propertyType,
    ownership: "",
    all_inclusive_price: "No",
    price_onwards: "No",
    price_negotiable: "No",
    tax_and_goverment_charges: "No",
    property_dimensions_length: lengthOfLand,
    property_dimensions_breadth: breadthOfLand,
    property_name: propertyName,
    mark_as_featured: markAsFeatured,
    property_price: propertyPrice,
    bhk_type: bhkType,
    bathroom: bathroom,
    no_of_cabines: noOfCabines,
    no_of_meeting_Rooms: noOfMeetingRooms,
    no_of_conference_room: noOfConferenceRoom,
    reception_area: receptionArea,
    central_AC: centralAC,
    parking_types: parkingTypes,
    possession_by: possessionBy,
    total_number_of_rooms: totalNumberOfRooms,
    quality_rating: qualityRating,
    total_number_parking: totalNumberParking,
    // price_negotiable: "No",
    electricity_and_water_charges: "No",
    no_of_peoples: noOfPeoples,
    available_beds: availableBeds,
    attached_balcony: "No",
    attached_bathroom: "No",
    // area: area,
    // area_in: areaIn,
    // area_type: areaType,
    property_description: propertyDescription,
    units: units,
    plot_no: plotNo,
    available_from: availableFrom,
    available_on: availableOn,
    operating_since: operatingSince,
    furnished_type: furnishedType,
    total_floor: totalFloor,
    property_floor: propertyFloor,
    block: block,
    security: security,
    active_status: activeStatus,
    available_status: availableStatus,
    admin_approval: adminApproval,
    possession_status: possessionStatus,
    possession_date: possessionDate,
    age_of_property: ageOfProperty,
    covered_parking: coveredParking,
    uncovered_parking: uncoveredParking,
    balcony: balcony,
    power_backup: powerBackup,
    facing: facing,
    view: view,
    flooring: flooring,
    // property_video: video,
    water_source: waterSource,
    additional_rooms: additionalRooms,
    lift_availability: liftAvailability,
    loan_availability: loanAvailability,
    property_no: propertyNo,
    office_space_type: officeSpaceType,
    pantry_option: pantry,
    investment_options: "",
    purchase_type: "",
    sub_sub_property_type: "",
    builder_floor_type: builderFloorType,
    personal_washroom: personalWashroom,
    ceiling_height: ceilingHeight,
    parking_availability: parkingAvailability,
    seat_type: seatType,
    number_of_seats_available: numberOfSeatsAvailable,
    rent: rent,
    rent_duration: rentDuration,
    maintenance_cost: maintenanceCost,
    maintenance_frequency: maintenanceFrequency,
    maintenance_included: maintenanceIncluded,
    security_deposit_type: securityDepositType,
    security_deposit_amount: securityDepositAmount,
    custom_deposit_amount: customDepositAmount,
    available_for_company_lease: availableForCompanyLease,
    available_for: availableFor,
    suited_for: suitedFor,
    room_type: roomType,
    food_available: foodAvailable,
    food_charges_included: foodChargesIncluded,
    notice_period: noticePeriod,
    notice_period_other_days: noticePeriodOtherDays,
    electricity_charges_included: electricityChargesIncluded,
    total_beds: totalBeds,
    pg_rules: pgRules,
    gate_closing_time: gateClosingTime,
    gate_closing_hour: gateClosingHour,
    pg_services: pgServices,
    min_lockin_period: minLockinPeriod,
    video_url: videoURL,
    video_url_type: videoSource,
    virtual_tour_availability: virtualTourLink,
    office_type: officeSubType,
    washroom: retailWashroom,
    conferenceRoom: conferenceRoom,
    // length_of_land: lengthOfLand,
    // breadthOfLand: breadthOfLand,
    openSidesOfLand: openSidesOfLand,
    type_of_construction: typeOfConstruction,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      attached_balcony: attachedBalcony ? "Yes" : "No",
      attached_bathroom: attachedBathroom ? "Yes" : "No",
    }));
  }, [attachedBalcony, attachedBathroom]);
  useEffect(() => {
    if (propertyCategory !== "Paying Guest" || propertyType !== "Apartment") {
      setAvailableBeds("");

      setFormData((prev) => ({
        ...prev,
        available_beds: "",
      }));
    }
  }, [propertyCategory, propertyType]);

  useEffect(() => {
    if (roomType !== "Sharing") {
      setNoOfPeoples("");

      setFormData((prev) => ({
        ...prev,
        no_of_peoples: "",
      }));
    }
  }, [roomType]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      price_negotiable: priceNegotiable ? "Yes" : "No",
      electricity_and_water_charges: electricityAndWaterCharges ? "Yes" : "No",
    }));
  }, [priceNegotiable, electricityAndWaterCharges]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      total_number_parking: totalNumberParking,
    }));
  }, [totalNumberParking]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      quality_rating: qualityRating,
    }));
  }, [qualityRating]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      total_number_of_rooms: totalNumberOfRooms,
    }));
  }, [totalNumberOfRooms]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      possession_by: possessionBy,
    }));
  }, [possessionBy]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      parking_types: parkingTypes,
    }));
  }, [parkingTypes]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      washroom: retailWashroom,
    }));
  }, [retailWashroom]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      central_AC: centralAC,
    }));
  }, [centralAC]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      reception_area: receptionArea,
    }));
  }, [receptionArea]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      no_of_cabines: noOfCabines,
      no_of_meeting_Rooms: noOfMeetingRooms,
      no_of_conference_room: noOfConferenceRoom,
    }));
  }, [noOfCabines, noOfMeetingRooms, noOfConferenceRoom]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      builder_floor_type: builderFloorType,
    }));
  }, [builderFloorType]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      type_of_construction: typeOfConstruction,
    }));
  }, [typeOfConstruction]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      conferenceRoom: conferenceRoom,
    }));
  }, [conferenceRoom]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      washroom: washroom,
    }));
  }, [washroom]);
  useEffect(() => {
    if (
      propertyCategory === "Rent" &&
      buildingType === "Residential" &&
      [
        "Apartment",
        "Independent House/Villa",
        "Independent/Builder Floor",
        "1RK/Studio Apartment",
        "Service Apartment",
        "Plot",
        "PG",
      ].includes(propertyType)
    ) {
      setRentDuration("Per Month"); // keep state in sync
      setFormData((prev) => ({
        ...prev,
        rent_duration: "Per Month",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        rent_duration: rentDuration,
      }));
    }
  }, [propertyCategory, buildingType, propertyType]);

  // Inside your component
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const form = new FormData();

      /* ---------------- formData values ---------------- */
      for (const key in formData) {
        if (key === "cover_image") continue; // skip old string image
        if (key === "property_video") continue;

        let value = formData[key];

        if (key === "property_category_type") {
          if (value === "Buy" && buildingType === "Residential") {
            value = "Buy";
          } else if (value === "Buy" && buildingType === "Commercial") {
            value = "Commercial Buy";
          } else if (value === "Rent" && buildingType === "Residential") {
            value = "Rent";
          } else if (value === "Rent" && buildingType === "Commercial") {
            value = "Commercial Lease";
          } else if (value === "Paying Guest") {
            value = "PG/Co-living";
          }
        }

        if (key === "property_type") {
          if (value === "Plot" || value === "Land") value = "Plot/Land";
          if (value === "Office Space") value = "Office";
        }

        if (key === "pantry_option") {
          value = pantry;
        }

        form.append(key, value ?? "");
      }

      /* ---------------- Extra Fields ---------------- */
      form.append("property_id", _id);

      form.append("area", builtUpArea);
      form.append("area_in", builtUpAreaUnit);

      form.append("carpet_area", carpetArea);
      form.append("carpet_area_unit", carpetAreaUnit);

      form.append("address", address);
      form.append("address_area", addressArea);
      form.append("city_name", city);
      form.append("country", country);
      form.append("state", state);
      form.append("locality", locality);
      form.append("sub_locality", subLocality);
      form.append("zip_code", zipCode);
      form.append("latitude", latitude);
      form.append("longitude", longitude);

      /* ---------------- Office Type Dynamic ---------------- */
      form.append(
        "office_type",
        propertyType === "Retail"
          ? RetailSubType
          : propertyType === "Land"
            ? landType
            : propertyType === "Storage"
              ? storageType
              : propertyType === "Industry"
                ? industryType
                : propertyType === "Hospitality"
                  ? hospitalityType
                  : officeSubType,
      );

      /* ---------------- Cover Image ---------------- */
      if (coverImage instanceof File) {
        form.append("cover_image", coverImage);
      }

      /* ---------------- Video ---------------- */
      if (videoFile) {
        form.append("property_video", videoFile);
      }

      /* ---------------- Update Property API ---------------- */
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/edit_property`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const property_id = response?.data?.data?._id || _id;

      /* ---------------- Upload New Images ---------------- */
      for (let i = 0; i < fileData2.length; i++) {
        const imageForm = new FormData();

        imageForm.append("property_id", property_id);
        imageForm.append("property_image", fileData2[i]);

        await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/add_property_images`,
          imageForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      toast.success("Property updated successfully.");

      history.push({
        pathname: "/dashboard",
        state: { page: "myProperties" },
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to update property.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      if (name === "available_from") {
        updatedData.isImmediateAvailable =
          value === "Immediately" ? "Yes" : "No";

        updatedData.possession_date =
          value === "Immediately"
            ? new Date().toISOString().split("T")[0]
            : prev.possession_date;

        // remove available_from when Later selected
        if (value === "Later") {
          delete updatedData.available_from;
        }
      }

      return updatedData;
    });
  };

  const handleBuildingTypeChange = (type) => {
    setBuildingType(type);
    setFormData({ ...formData, building_type: type });
  };

  useEffect(() => {
    if (showModal || showFeaturePopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal, showFeaturePopup]);

  // Inline Error -
  const validateStepFields = () => {
    const errors = {};

    if (activeStep === 0) {
      if (!formData.property_name?.trim()) {
        errors.property_name = "Property Name is required";
      } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.property_name)) {
        errors.property_name = "Alphanumeric fields only";
      }
    }

    if (activeStep === 1) {
      if (!address?.trim()) {
        errors.address = "Address is required";
      }
      if (!country?.trim()) {
        errors.country = "country is required";
      }
      if (!state?.trim()) {
        errors.state = "state is required";
      }
      if (!zipCode?.trim()) {
        errors.zipCode = "zip code is required";
      }
      if (!city?.trim()) {
        errors.city = "city name is required";
      }
    }

    if (activeStep === 2) {
      if (propertyCategory === "Buy") {
        if (!String(formData.property_price || "").trim()) {
          errors.property_price = "Property Price is required";
        }
      }
      if (!String(builtUpArea || "").trim()) {
        errors.builtUpArea = "Built-up area is required";
      }

      if (
        propertyCategory === "Buy" &&
        buildingType === "Residential" &&
        propertyType === "Plot"
      ) {
        if (!lengthOfLand) {
          errors.property_dimensions_length = "Length is required";
        }

        if (!breadthOfLand) {
          errors.property_dimensions_breadth = "Breadth is required";
        }
      }
      if (!String(builtUpAreaUnit || "").trim()) {
        errors.builtUpAreaUnit = "Built-up area unit is required";
      }

      if (!String(carpetArea || "").trim()) {
        errors.carpetArea = "Carpet area is required";
      }

      if (!String(carpetAreaUnit || "").trim()) {
        errors.carpetAreaUnit = "Carpet area unit is required";
      }

      if (
        propertyCategory === "Rent" &&
        buildingType === "Residential" &&
        propertyType === "PG"
      ) {
        if (!formData.available_for?.trim()) {
          errors.available_for = "Available For is required";
        }
        if (!formData.suited_for?.trim()) {
          errors.suited_for = "Suited For is required";
        }
        if (!formData.room_type || formData.room_type.length === 0) {
          errors.room_type = "Room Type is required";
        }
        if (!formData.food_charges_included?.trim()) {
          errors.food_charges_included = "Food charges inclusion is required";
        }
      }

      if (
        !(
          (propertyCategory === "Buy" &&
            buildingType === "Residential" &&
            propertyType === "Plot") ||
          (propertyCategory === "Rent" &&
            buildingType === "Residential" &&
            propertyType === "Plot") ||
          (propertyCategory === "Rent" &&
            buildingType === "Commercial" &&
            propertyType === "Industry") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Land") ||
          (propertyCategory === "Rent" &&
            buildingType === "Commercial" &&
            propertyType === "Land") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Industry") ||
          (propertyCategory === "Rent" &&
            buildingType === "Commercial" &&
            propertyType === "Industry") ||
          (propertyCategory === "Rent" &&
            buildingType === "Residential" &&
            propertyType === "PG")
        )
      ) {
        // if (!formData.area_type?.trim()) {
        //   errors.area_type = "Area type is required";
        // }
      }

      // if (
      //   !(
      //     (propertyCategory === "Buy" &&
      //       buildingType === "Residential" &&
      //       propertyType === "Plot") ||
      //     (propertyCategory === "Rent" &&
      //       buildingType === "Residential" &&
      //       propertyType === "Plot") ||
      //     (propertyCategory === "Rent" &&
      //       buildingType === "Residential" &&
      //       propertyType === "PG")
      //   )
      // ) {
      //   if (!formData.units?.trim()) {
      //     errors.units = "Units is required";
      //   }
      // }

      if (
        !(
          (propertyCategory === "Buy" &&
            buildingType === "Residential" &&
            (propertyType === "Apartment" ||
              propertyType === "Independent House/Villa" ||
              propertyType === "Plot")) ||
          (propertyCategory === "Buy" &&
            buildingType === "Residential" &&
            propertyType === "Independent/Builder Floor") ||
          (propertyCategory === "Buy" &&
            buildingType === "Residential" &&
            propertyType === "1RK/Studio Apartment") ||
          (propertyCategory === "Buy" &&
            buildingType === "Residential" &&
            propertyType === "Service Apartment") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Storage ") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Office Space") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Retail") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Office Space in IT/SEZ") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Storage") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Warehouse") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Industry") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Hospitality") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Land")
        )
      ) {
        const rentValue = String(formData.rent || "").trim();

        if (!rentValue) {
          errors.rent = "Rent is required";
        } else if (!/^\d+$/.test(rentValue)) {
          errors.rent = "Rent must be a numeric value";
        }
      }

      // if (propertyCategory === "Rent") {
      //   if (!formData.rent_duration?.trim()) {
      //     errors.rent_duration = "Rent duration is required";
      //   }
      // }

      if (
        !(
          (propertyCategory === "Buy" &&
            buildingType === "Residential" &&
            (propertyType === "Apartment" ||
              propertyType === "Independent House/Villa" ||
              propertyType === "Plot")) ||
          (propertyCategory === "Buy" &&
            buildingType === "Residential" &&
            propertyType === "Independent/Builder Floor") ||
          (propertyCategory === "Buy" &&
            buildingType === "Residential" &&
            propertyType === "1RK/Studio Apartment") ||
          (propertyCategory === "Buy" &&
            buildingType === "Residential" &&
            propertyType === "Service Apartment") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Storage") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Office Space") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Retail") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Land") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Office Space in IT/SEZ") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Storage") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Warehouse") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Industry") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Hospitality")
        )
      ) {
        const depositValue = String(
          formData.custom_deposit_amount || "",
        ).trim();

        if (!depositValue) {
          errors.custom_deposit_amount = "Custom deposit amount is required";
        } else if (!/^\d+$/.test(depositValue)) {
          errors.custom_deposit_amount = "Deposit amount must be numeric";
        }
      }

      if (
        !(
          (propertyCategory === "Buy" &&
            buildingType === "Residential" &&
            propertyType === "Plot") ||
          (propertyCategory === "Rent" &&
            buildingType === "Residential" &&
            propertyType === "Plot") ||
          (propertyCategory === "Rent" &&
            buildingType === "Commercial" &&
            propertyType === "Land") ||
          (propertyCategory === "Rent" &&
            buildingType === "Commercial" &&
            propertyType === "Warehouse") ||
          (propertyCategory === "Rent" &&
            buildingType === "Commercial" &&
            propertyType === "Industry") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Land") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Warehouse") ||
          (propertyCategory === "Buy" &&
            buildingType === "Commercial" &&
            propertyType === "Industry")
        )
      ) {
        if (!formData.furnished_type?.trim()) {
          errors.furnished_type = "furnished type is required";
        }
      }

      if (
        (propertyCategory === "Buy" &&
          buildingType === "Residential" &&
          propertyType === "Plot") ||
        (propertyCategory === "Rent" &&
          buildingType === "Residential" &&
          propertyType === "Plot")
      ) {
        if (!formData.plot_no?.trim()) {
          errors.plot_no = "plot no is required";
        }
      }

      if (
        !(
          (propertyCategory === "Buy" &&
            buildingType === "Residential" &&
            propertyType === "Plot") ||
          (propertyCategory === "Rent" &&
            buildingType === "Residential" &&
            propertyType === "Plot") ||
          buildingType === "Commercial" ||
          (propertyCategory === "Rent" &&
            buildingType === "Residential" &&
            propertyType === "PG")
        )
      ) {
        if (!formData.bhk_type?.trim()) {
          errors.bhk_type = "bhk type is required";
        }
      }
      if (formData.possession_status === "Under Construction") {
        if (!formData.possession_date?.trim()) {
          errors.possession_date = "Possession Date is required";
        }
      }
      if (formData.available_from === "Later") {
        if (!formData.possession_date?.trim()) {
          errors.possession_date =
            "Possession Date is required for later availability";
        }
      }
    }

    if (activeStep === 3) {
      if (selectedAmenities.length === 0) {
        errors.amenities = "Please select at least one amenity";
      }
    }

    if (activeStep === 4) {
      if (!coverImage) {
        errors.cover_image = "Please upload a cover image";
      }
    }

    setFormErrors(errors);

    console.log(errors);
    return Object.keys(errors).length === 0;
  };

  const categoryLabelMap = {
    Buy: "Sell",
    Rent: "Rent/Lease",
    "Paying Guest": "Paying Guest",
  };

  const getPropertyTypeLabel = (type) => {
    if (type === "Plot") return "Plot/Land";
    if (type === "Land") return "Plot/Land"; //  ADD THIS
    if (type === "Office Space") return "Office";
    if (type === "Independent/Builder Floor") return "Builder Floor";
    return type;
  };

  const toWords = new ToWords({
    localeCode: "en-IN",
  });
  return (
    <>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
        <div className="flex flex-col items-center min-h-screen bg-white">
          {/* Navbar */}
          <nav className="flex items-center justify-center w-full p-4 text-black bg-gray-200">
            <h1 className="text-xl">Edit Your Property</h1>
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
                  if (completedSteps.includes(index)) {
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
              <div className="max-w-3xl p-3 mx-auto mb-20 border border-gray-300 rounded-xl">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  Basic Details
                </h2>

                {/* Property Name */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">
                    Building/Society/Project Name{" "}
                    <span className="text-xl font-bold text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter Name"
                    name="property_name"
                    className={`w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-rose-500 ${formErrors.property_name
                        ? "border border-red-600"
                        : "border border-gray-300"
                      }`}
                    value={formData.property_name}
                    onChange={handleInputChange}
                  />

                  {formErrors.property_name && (
                    <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                      <MdErrorOutline className="text-lg" />
                      {formErrors.property_name}
                    </p>
                  )}
                </div>

                {/* Featured Checkbox */}
                {/* <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="featured"
                  name="mark_as_featured"
                  className="mb-2 mr-2"
                  checked={formData.mark_as_featured === "Yes"}
                  onChange={(e) => {
                    if (e.target.checked && featureCount <= 0) {
                      setShowFeaturePopup(true);
                      return;
                    }

                    setFormData({
                      ...formData,
                      mark_as_featured: e.target.checked ? "Yes" : "No",
                    });
                  }}
                />
                <label
                  htmlFor="featured"
                  className="flex items-center text-gray-700"
                >
                  Showcase Your Featured Property{" "}
                  <IoIosInformationCircle className="ml-1 text-lg text-yellow-500 cursor-pointer" />
                </label>
              </div> */}

                {/* Property Category */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">
                    Property Category Type{" "}
                    <span className="text-xl font-bold text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {propertyCategories.map((category) => (
                      <button
                        key={category}
                        className={`px-4 py-2 rounded-full border transition ${propertyCategory === category
                            ? "bg-rose-100 text-rose-700 border-rose-500"
                            : "border-gray-300 text-gray-600 hover:bg-gray-100"
                          }`}
                        onClick={() => {
                          setPropertyCategory(category);
                          setFormData({
                            ...formData,
                            property_category_type: category,
                          });
                        }}
                      >
                        {categoryLabelMap[category]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Building Type */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">
                    Building Type{" "}
                    <span className="text-xl font-bold text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {buildingTypes
                      .filter((type) =>
                        propertyCategory === "Paying Guest"
                          ? type === "Residential"
                          : true,
                      )
                      .map((type) => (
                        <button
                          key={type}
                          className={`px-4 py-2 rounded-full border transition ${buildingType === type
                              ? "bg-rose-100 text-rose-700 border-rose-500"
                              : "border-gray-300 text-gray-600 hover:bg-gray-100"
                            }`}
                          onClick={() => handleBuildingTypeChange(type)}
                        >
                          {type}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Property Type */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">
                    Property Type{" "}
                    <span className="text-xl font-bold text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {propertyTypes.map((type) => (
                      <button
                        key={type}
                        className={`px-4 py-2 rounded-full border transition ${propertyType === type
                            ? "bg-rose-100 text-rose-700 border-rose-500"
                            : "border-gray-300 text-gray-600 hover:bg-gray-100"
                          }`}
                        onClick={() => {
                          setPropertyType(type);
                          setFormData({ ...formData, property_type: type });
                        }}
                      >
                        {getPropertyTypeLabel(type)} {/*  shows Plot/Land */}
                      </button>
                    ))}
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
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {propertyType === "Land" && (
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
                              setFormData({ ...formData, land_type: type });
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
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {propertyType === "Office Space" && (
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
                              setFormData({
                                ...formData,
                                office_sub_type: type,
                              });
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
                              setFormData({
                                ...formData,
                                office_type: type, //IMPORTANT (API key)
                              });
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
                              setFormData({
                                ...formData,
                                sub_sub_property_type: type, //  API KEY
                              });
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                        {/* <LoadScript
                        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                        libraries={["places"]}
                      > */}
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
                            className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${formErrors.address
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
                        {/* </LoadScript> */}
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
                          className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${formErrors.country
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
                          className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${formErrors.state
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
                          className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${formErrors.city
                              ? "border-red-600"
                              : "border-gray-300"
                            }`}
                        />
                        {formErrors.city && (
                          <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                            <MdErrorOutline className="text-lg" />
                            {formErrors.city}
                          </p>
                        )}
                      </div>
                      {/* Locality */}
                      {/* <div>
                        <label className="font-medium text-gray-700">
                          Locality{" "} */}
                      {/* <span className="text-xl font-bold text-red-500">
                          *
                        </span> */}
                      {/* </label>
                        <input
                          type="text"
                          value={locality}
                          onChange={(e) => setLocality(e.target.value)}
                          placeholder="Enter Locality"
                          className="w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none border-gray-300"
                        />
                      </div> */}

                      {/* Sub Locality */}
                      {/* <div>
                        <label className="font-medium text-gray-700">
                          Sub Locality{" "} */}
                      {/* <span className="text-xl font-bold text-red-500">
                          *
                        </span> */}
                      {/* </label>
                        <input
                          type="text"
                          value={subLocality}
                          onChange={(e) => setSubLocality(e.target.value)}
                          placeholder="Enter Sub Locality"
                          className="w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none border-gray-300"
                        />
                      </div> */}

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
                          className={`w-full border rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none ${formErrors.zipCode
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
              <div className="max-w-5xl mx-auto mb-20 bg-white rounded-xl">
                {!(
                  (
                    propertyCategory === "Rent" &&
                    buildingType === "Residential" &&
                    propertyType === "Plot"
                  )
                  // (propertyCategory === "Paying Guest" &&
                  //   buildingType === "Residential" &&
                  //   propertyType === "Apartment")
                  // (propertyCategory === "Rent" &&
                  //   buildingType === "Commercial" &&
                  //   propertyType === "Land") ||
                  // (propertyCategory === "Rent" &&
                  //   buildingType === "Commercial" &&
                  //   propertyType === "Industry")
                ) && (
                    <div className="p-3 mb-3 border border-gray-300 rounded-xl">
                      <h2 className="text-2xl text-gray-900">Property Details</h2>
                      <p className="mt-1 text-gray-500">
                        Enter and manage essential information related to your
                        property.
                      </p>

                      <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3 ">
                        {!(
                          propertyCategory === "Rent" ||
                          propertyCategory === "Paying Guest"
                        ) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Property Price{" "}
                                <span className="text-xl font-bold text-red-500">
                                  *
                                </span>
                              </label>
                              <input
                                type="text"
                                placeholder="� Expected Price"
                                name="property_price"
                                value={
                                  formData.property_price
                                    ? Number(
                                      formData.property_price,
                                    ).toLocaleString("en-IN")
                                    : ""
                                }
                                onChange={(e) => {
                                  const rawValue = e.target.value.replace(/,/g, "");
                                  if (/^\d*$/.test(rawValue)) {
                                    handleInputChange({
                                      target: {
                                        name: "property_price",
                                        value: rawValue,
                                      },
                                    });
                                  }
                                }}
                                className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${formErrors.property_price || !propertyPrice
                                    ? "border-red-600"
                                    : "border-gray-300"
                                  }`}
                              />
                              {formErrors.property_price && (
                                <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                                  <MdErrorOutline className="text-lg" />
                                  {formErrors.property_price}
                                </p>
                              )}

                              {/* Suggested Price Card */}
                              <div className="flex items-center p-1 mt-4 space-x-1 bg-pink-100 rounded-lg">
                                <span className="my-text"></span>
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {formData.property_price
                                      ? toWords.convert(
                                        Number(formData.property_price),
                                      )
                                      : ""}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Suggested price for your area
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        {!(
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "Plot") ||
                          (propertyCategory === "Rent" &&
                            buildingType === "Residential" &&
                            propertyType === "Plot") ||
                          buildingType === "Commercial" ||
                          (propertyCategory === "Rent" &&
                            buildingType === "Residential" &&
                            propertyType === "PG") ||
                          propertyType === "1RK/Studio Apartment"
                        ) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                BHK{" "}
                                <span className="text-xl font-bold text-red-500">
                                  *
                                </span>
                              </label>
                              <select
                                className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${formErrors.bhk_type || !propertyPrice
                                    ? "border-red-600"
                                    : "border-gray-300"
                                  }`}
                                value={formData.bhk_type}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    bhk_type: e.target.value,
                                  })
                                }
                              >
                                <option value="">Select Configuration</option>
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
                                <option value="6 BHK">6 BHK</option>
                                <option value="6+ BHK">6+ BHK</option>
                              </select>
                              {formErrors.bhk_type && (
                                <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                                  <MdErrorOutline className="text-lg" />
                                  {formErrors.bhk_type}
                                </p>
                              )}
                            </div>
                          )}

                        {/* {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry")
                    ) && (
                      <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">
                          Washroom
                        </label>

                        <div className="flex gap-3">
                          {["Yes", "No"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setWashroom(option)}
                              className={`px-6 py-2 rounded-full border transition ${
                                washroom === option
                                  ? "bg-rose-200 text-rose-600 border-rose-300"
                                  : "bg-gray-100 text-gray-700 border-gray-300"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )} */}

                        {!(
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "Plot") ||
                          (propertyCategory === "Rent" &&
                            buildingType === "Residential" &&
                            propertyType === "Plot") ||
                          (propertyCategory === "Rent" &&
                            buildingType === "Commercial" &&
                            propertyType === "Land") ||
                          (propertyCategory === "Rent" &&
                            buildingType === "Commercial" &&
                            propertyType === "Storage") ||
                          (propertyCategory === "Rent" &&
                            buildingType === "Commercial" &&
                            propertyType === "Hospitality") ||
                          (propertyCategory === "Rent" &&
                            buildingType === "Commercial" &&
                            propertyType === "Industry") ||
                          (propertyCategory === "Rent" &&
                            buildingType === "Commercial" &&
                            propertyType === "Retail") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Land") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Warehouse") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Retail") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Storage") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Hospitality") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Industry")
                        ) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Bathroom
                              </label>

                              <select
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                                value={formData.bathroom}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    bathroom: e.target.value,
                                  })
                                }
                              >
                                <option value="">Select Bathrooms</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="4+">4+</option>
                              </select>
                            </div>
                          )}
                        {(propertyCategory === "Buy" ||
                          propertyCategory === "Rent") &&
                          buildingType === "Commercial" &&
                          propertyType === "Retail" && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Washroom
                              </label>

                              <select
                                value={retailWashroom}
                                onChange={(e) =>
                                  setRetailWashroom(e.target.value)
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
                                <option value="Not Available">
                                  Not Available
                                </option>
                              </select>
                            </div>
                          )}
                        {/* Washrooms for Storage */}
                        {(propertyType === "Storage" ||
                          propertyType === "Industry" ||
                          propertyType === "Hospitality") && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Washrooms
                              </label>

                              <select
                                name="washroom"
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                                value={formData.washroom}
                                onChange={handleInputChange}
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
                        {propertyCategory === "Buy" &&
                          buildingType === "Residential" && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Ownership <span className="text-red-500">*</span>
                              </label>

                              <select
                                name="ownership"
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                                value={formData.ownership}
                                onChange={handleInputChange}
                              >
                                <option value="">Select Ownership</option>
                                <option value="Freehold">Freehold</option>
                                <option value="Leasehold">Leasehold</option>
                                <option value="Co-operative Society">
                                  Co-operative Society
                                </option>
                                <option value="Power of Attorney">
                                  Power of Attorney
                                </option>
                              </select>

                              {formErrors.ownership && (
                                <p className="text-sm text-red-500 mt-1">
                                  {formErrors.ownership}
                                </p>
                              )}
                            </div>
                          )}

                        {propertyCategory === "Buy" && (
                          <div className="md:col-span-3 mt-2">
                            {/* <label className="font-medium text-gray-700">
      Price Details
    </label> */}

                            <div className="flex flex-wrap gap-4 mt-2">
                              {/* All Inclusive Price */}
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
                                      price_onwards: e.target.checked
                                        ? "Yes"
                                        : "No",
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
                                      price_negotiable: e.target.checked
                                        ? "Yes"
                                        : "No",
                                    })
                                  }
                                />
                                Price Negotiable
                              </label>

                              {/* Tax & Govt Charges */}
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={
                                    formData.tax_and_goverment_charges === "Yes"
                                  }
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
                        )}
                        {/* {propertyType === "Office Space" && (
                      <div className="mt-4">
                        <label className="block mb-2 font-medium text-gray-700">
                          Conference Room
                        </label>

                        <div className="flex gap-3">
                          {["Yes", "No"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setConferenceRoom(option)}
                              className={`px-6 py-2 rounded-full border transition ${
                                conferenceRoom === option
                                  ? "bg-rose-200 text-rose-600 border-rose-300"
                                  : "bg-gray-100 text-gray-700 border-gray-300"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )} */}
                        {!(
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            (propertyType === "Apartment" ||
                              propertyType === "Independent House/Villa" ||
                              propertyType === "Plot")) ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "Independent/Builder Floor") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "1RK/Studio Apartment") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "Service Apartment") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Storage ") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Office Space") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Retail") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Office Space in IT/SEZ") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Storage") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Warehouse") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Industry") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Hospitality") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Land") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "Farmhouse")
                        ) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Rent{" "}
                                <span className="text-xl font-bold text-red-500">
                                  *
                                </span>
                              </label>
                              <input
                                type="text"
                                name="rent"
                                className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${formErrors.rent
                                    ? "border-red-600"
                                    : "border-gray-300"
                                  }`}
                                value={
                                  formData.rent
                                    ? Number(formData.rent).toLocaleString("en-IN")
                                    : ""
                                }
                                onChange={(e) => {
                                  const rawValue = e.target.value.replace(/,/g, "");

                                  if (/^\d*$/.test(rawValue)) {
                                    handleInputChange({
                                      target: {
                                        name: "rent",
                                        value: rawValue,
                                      },
                                    });
                                  }
                                }}
                              />
                              {formData.rent && (
                                <p className="mt-2 text-sm font-medium text-gray-600">
                                  {toWords.convert(Number(formData.rent))}
                                </p>
                              )}
                              {formErrors.rent && (
                                <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                                  <MdErrorOutline className="text-lg" />
                                  {formErrors.rent}
                                </p>
                              )}
                            </div>
                          )}

                        {!(
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            (propertyType === "Apartment" ||
                              propertyType === "Independent House/Villa" ||
                              propertyType === "Plot")) ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "Independent/Builder Floor") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "1RK/Studio Apartment") ||
                          (propertyCategory === "Rent" &&
                            buildingType === "Commercial" &&
                            propertyType === "Industry") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "Service Apartment") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "Farmhouse") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Storage") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Office Space") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Retail") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Land") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Office Space in IT/SEZ") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Storage") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Warehouse") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Industry") ||
                          (propertyCategory === "Rent" &&
                            buildingType === "Commercial" &&
                            propertyType === "Hospitality") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Hospitality") ||
                          (propertyCategory === "Paying Guest" &&
                            buildingType === "Residential" &&
                            propertyType === "Builder Floor") ||
                          (propertyCategory === "Paying Guest" &&
                            buildingType === "Residential" &&
                            propertyType === "Apartment") ||
                          (propertyCategory === "Paying Guest" &&
                            buildingType === "Residential" &&
                            propertyType === "1RK/Studio Apartment") ||
                          (propertyCategory === "Paying Guest" &&
                            buildingType === "Residential" &&
                            propertyType === "Independent House/Villa") ||
                          (propertyCategory === "Paying Guest" &&
                            buildingType === "Residential" &&
                            propertyType === "Service Apartment") ||
                          (propertyCategory === "Rent" &&
                            buildingType === "Residential" &&
                            (propertyType === "Apartment" ||
                              propertyType === "Independent House/Villa" ||
                              propertyType === "Independent/Builder Floor" ||
                              propertyType === "1RK/Studio Apartment" ||
                              propertyType === "Service Apartment" ||
                              propertyType === "Plot" ||
                              propertyType === "PG"))
                        ) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Rent Duration{" "}
                                <span className="text-xl font-bold text-red-500">
                                  *
                                </span>
                              </label>
                              <select
                                className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                                value={formData.rent_duration}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    rent_duration: e.target.value,
                                  })
                                }
                              >
                                <option value="">Select Rent Duration</option>
                                <option value="Per Month">Per Month</option>
                                <option value="Per Year">Per Year</option>
                              </select>
                              {formErrors.rent_duration && (
                                <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                                  <MdErrorOutline className="text-lg" />
                                  {formErrors.rent_duration}
                                </p>
                              )}
                            </div>
                          )}

                        {!(
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            (propertyType === "Apartment" ||
                              propertyType === "Independent House/Villa" ||
                              propertyType === "Plot")) ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "Independent/Builder Floor") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "1RK/Studio Apartment") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "Service Apartment") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Residential" &&
                            propertyType === "Farmhouse") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Storage") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Office Space") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Retail") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Land") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Office Space in IT/SEZ") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Storage") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Warehouse") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Industry") ||
                          (propertyCategory === "Buy" &&
                            buildingType === "Commercial" &&
                            propertyType === "Hospitality")
                        ) && (
                            <div>
                              <label className="font-medium text-gray-700">
                                Security Deposit Amount{" "}
                                <span className="text-xl font-bold text-red-500">
                                  *
                                </span>
                              </label>

                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={
                                  formData.custom_deposit_amount
                                    ? Number(
                                      formData.custom_deposit_amount,
                                    ).toLocaleString("en-IN")
                                    : ""
                                }
                                onChange={(e) => {
                                  const rawValue = e.target.value.replace(/,/g, "");

                                  if (/^\d*$/.test(rawValue)) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      custom_deposit_amount: rawValue,
                                    }));
                                  }
                                }}
                                className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${formErrors.security_deposit_amount
                                    ? "border-red-600"
                                    : "border-gray-300"
                                  }`}
                              />
                              {formData.custom_deposit_amount && (
                                <p className="mt-2 text-sm font-medium text-gray-600">
                                  {toWords.convert(
                                    Number(formData.custom_deposit_amount),
                                  )}
                                </p>
                              )}

                              {formErrors.custom_deposit_amount && (
                                <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                                  <MdErrorOutline className="text-lg" />
                                  {formErrors.custom_deposit_amount}
                                </p>
                              )}
                            </div>
                          )}

                        {(propertyCategory === "Rent" ||
                          propertyCategory === "Paying Guest") && (
                            <div className="md:col-span-3 mt-2">
                              <div className="flex flex-wrap gap-4 mt-2">
                                {/* Price Negotiable */}
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={formData.price_negotiable === "Yes"}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        price_negotiable: e.target.checked
                                          ? "Yes"
                                          : "No",
                                      })
                                    }
                                  />
                                  Price Negotiable
                                </label>

                                {/* Electricity & Water Charges Included */}
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={
                                      formData.electricity_and_water_charges ===
                                      "Yes"
                                    }
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        electricity_and_water_charges: e.target
                                          .checked
                                          ? "Yes"
                                          : "No",
                                      })
                                    }
                                  />
                                  Electricity & Water Charges Included
                                </label>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                {/* Area Details Section */}
                <div className="p-3 mb-3 border border-gray-300 rounded-xl">
                  <h2 className="text-2xl text-gray-900">Area Details</h2>
                  <p className="mt-1 text-gray-500">
                    Comprehensive overview covering scale, financials, features,
                    timeline, and compliance of the property Area Details.
                  </p>

                  <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-4">
                    {/* Carpet Area */}
                    <div>
                      <label className="font-medium text-gray-700">
                        Carpet Area <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={carpetArea}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,10}$/.test(value)) {
                            setCarpetArea(value);
                          }
                        }}
                        className="w-full mt-1 p-3 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="font-medium text-gray-700">Unit</label>
                      <select
                        value={carpetAreaUnit}
                        onChange={(e) => setCarpetAreaUnit(e.target.value)}
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
                        value={builtUpArea}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,10}$/.test(value)) {
                            setBuiltUpArea(value);
                          }
                        }}
                        className="w-full mt-1 p-3 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="font-medium text-gray-700">Unit</label>
                      <select
                        value={builtUpAreaUnit}
                        onChange={(e) => setBuiltUpAreaUnit(e.target.value)}
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
                  </div>
                  {/* <div>
                    <label className="font-medium text-gray-700">
                      Area{" "}
                      <span className="text-xl font-bold text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,10}$/.test(value)) {
                          handleInputChange(e);
                        }
                      }}
                      className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${
                        formErrors.area ? "border-red-600" : "border-gray-300"
                      }`}
                    />
                    {formErrors.area && (
                      <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                        <MdErrorOutline className="text-lg" />
                        {formErrors.area}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">
                      Area In{" "}
                      <span className="text-xl font-bold text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${
                        formErrors.area_in
                          ? "border-red-600"
                          : "border-gray-300"
                      }`}
                      value={formData.area_in}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          area_in: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Area Unit</option>
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
                    {formErrors.area_in && (
                      <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                        <MdErrorOutline className="text-lg" />
                        {formErrors.area_in}
                      </p>
                    )}
                  </div> */}

                  {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Area Type{" "}
                        <span className="text-xl font-bold text-red-500">
                          *
                        </span>
                      </label>
                      <select
                        className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${
                          formErrors.area_type
                            ? "border-red-600"
                            : "border-gray-300"
                        }`}
                        value={formData.area_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            area_type: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Area Type</option>
                        <option value="Carpet Area">Carpet Area</option>
                        <option value="Plot Area">Plot Area</option>
                        <option value="Saleable Area">Saleable Area</option>
                        <option value="Built-up Area">Built-up Area</option>
                      </select>
                      {formErrors.area_type && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <MdErrorOutline className="text-lg" />
                          {formErrors.area_type}
                        </p>
                      )}
                    </div>
                  )} */}
                </div>

                <div className="p-3 mb-3 border border-gray-300 rounded-xl">
                  <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3">
                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "PG") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Possession Status
                          </label>
                          <select
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
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
                        </div>
                      )}

                    {(formData.possession_status === "Under Construction" ||
                      formData.available_from === "Later") && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Possession Date{" "}
                            <span className="text-xl font-bold text-red-500">
                              *
                            </span>
                          </label>
                          <input
                            type="date"
                            name="possession_date"
                            className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${formErrors.possession_date
                                ? "border-red-600"
                                : "border-rose-300"
                              }`}
                            value={formData.possession_date || ""}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                possession_date: e.target.value,
                              })
                            }
                          />
                          {formErrors.possession_date && (
                            <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                              <MdErrorOutline className="text-lg" />
                              {formErrors.possession_date}
                            </p>
                          )}
                        </div>
                      )}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ 22") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Developer
                      </label>
                      <input
                        type="text"
                        name="developer"
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.developer}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                      />
                    </div>
                  )} */}

                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "PG") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Project Type
                          </label>
                          <input
                            type="text"
                            name="project_type"
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.project_type}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                                handleInputChange(e);
                              }
                            }}
                          />
                        </div>
                      )}
                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "PG") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Total Floor
                          </label>
                          <input
                            type="text"
                            name="total_floor"
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.total_floor}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                                handleInputChange(e);
                              }
                            }}
                          />
                        </div>
                      )}
                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "PG") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Flat on the floor
                          </label>
                          <input
                            type="text"
                            name="property_floor"
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.property_floor}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                                handleInputChange(e);
                              }
                            }}
                          />
                        </div>
                      )}
                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "PG") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Tower/Block Name
                          </label>
                          <input
                            type="text"
                            name="block"
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.block}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (
                                /^[a-zA-Z0-9\s\-_/().,#@&]{0,20}$/.test(value)
                              ) {
                                handleInputChange(e);
                              }
                            }}
                          />
                        </div>
                      )}

                    {/* {(propertyType === "Apartment" ||
                    propertyType === "1RK/Studio Apartment" ||
                    propertyType === "Service Apartment" ||
                    propertyType === "Office Space") &&
                    !(
                      propertyCategory === "Paying Guest" &&
                      (propertyType === "Apartment" ||
                        propertyType === "1RK/Studio Apartment" ||
                        propertyType === "Service Apartment")
                    ) && (
                      <div>
                        <label className="font-medium text-gray-700">
                          Total Number of Parking
                        </label>

                        <input
                          type="text"
                          value={totalNumberParking}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setTotalNumberParking(value);
                            }
                          }}
                          placeholder="Enter Total Parking"
                          className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    )} */}
                    {(propertyCategory === "Buy" ||
                      propertyCategory === "Rent") &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail" && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Parking Type
                          </label>

                          <select
                            value={parkingTypes}
                            onChange={(e) => setParkingTypes(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Parking Type</option>
                            <option value="Private Parking">
                              Private Parking
                            </option>
                            <option value="Public Parking">
                              Public Parking
                            </option>
                            <option value="Multilevel Parking">
                              Multilevel Parking
                            </option>
                            <option value="Not Available">Not Available</option>
                          </select>
                        </div>
                      )}
                    {/* No. of Cabines */}
                    {buildingType === "Commercial" &&
                      propertyType === "Office Space" && (
                        <div>
                          <label className="font-medium text-gray-700">
                            No. of Cabines
                          </label>

                          <select
                            value={noOfCabines}
                            onChange={(e) => setNoOfCabines(e.target.value)}
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

                    {/* No. of Meeting Rooms */}
                    {buildingType === "Commercial" &&
                      propertyType === "Office Space" && (
                        <div>
                          <label className="font-medium text-gray-700">
                            No. of Meeting Rooms
                          </label>

                          <select
                            value={noOfMeetingRooms}
                            onChange={(e) =>
                              setNoOfMeetingRooms(e.target.value)
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

                    {/* No. of Conference Room */}
                    {buildingType === "Commercial" &&
                      propertyType === "Office Space" && (
                        <div>
                          <label className="font-medium text-gray-700">
                            No. of Conference Room
                          </label>

                          <select
                            value={noOfConferenceRoom}
                            onChange={(e) =>
                              setNoOfConferenceRoom(e.target.value)
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

                    {propertyType === "Hospitality" && (
                      <div>
                        <label className="font-medium text-gray-700">
                          Total Number of Rooms
                        </label>

                        <input
                          type="text"
                          value={totalNumberOfRooms}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setTotalNumberOfRooms(value);
                            }
                          }}
                          placeholder="Enter Total Rooms"
                          className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    )}
                    {propertyType === "Hospitality" && (
                      <div>
                        <label className="font-medium text-gray-700">
                          Quality Rating
                        </label>

                        <select
                          value={qualityRating}
                          onChange={(e) => setQualityRating(e.target.value)}
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
                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Transaction Type
                      </label>
                      <input
                        type="text"
                        name="transaction_type"
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.transaction_type}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                      />
                    </div>
                  )} */}

                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "PG") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Additional Rooms
                          </label>
                          <Select
                            isMulti
                            name="additional_rooms"
                            options={options}
                            value={options.filter((opt) =>
                              formData.additional_rooms.includes(opt.value),
                            )}
                            onChange={(selectedOptions) =>
                              handleInputChange({
                                target: {
                                  name: "additional_rooms",
                                  value: selectedOptions.map((opt) => opt.value),
                                },
                              })
                            }
                            components={{ MultiValue: CustomMultiValue }}
                            placeholder="Select Additional Room"
                            classNamePrefix="react-select"
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                minHeight: "60px",
                                padding: "6px",
                                borderColor: state.isFocused
                                  ? "#a855f7"
                                  : "#d1d5db",
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

                    {!(
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Facing
                          </label>
                          <select
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.facing}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                facing: e.target.value,
                              })
                            }
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

                    {propertyType === "Independent/Builder Floor" && (
                      <div>
                        <label className="font-medium text-gray-700">
                          Builder Floor Type{" "}
                          <span className="text-red-500">*</span>
                        </label>

                        <select
                          className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          value={builderFloorType}
                          onChange={(e) => setBuilderFloorType(e.target.value)}
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
                    {(propertyCategory === "Buy" ||
                      propertyCategory === "Rent") &&
                      ((buildingType === "Residential" &&
                        propertyType === "Plot") ||
                        (buildingType === "Commercial" &&
                          propertyType === "Land")) && (
                        <>
                          {/* Length */}
                          <div>
                            <label className="font-medium text-gray-700">
                              Length of Plot (ft){" "}
                              <span className="text-red-500">*</span>
                            </label>

                            <input
                              type="text"
                              value={lengthOfLand}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  setLengthOfLand(value);
                                }
                              }}
                              placeholder="Enter Length"
                              className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                            />

                            {formErrors.property_dimensions_length && (
                              <p className="text-sm text-red-500 mt-1">
                                {formErrors.property_dimensions_length}
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
                              value={breadthOfLand}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  setBreadthOfLand(value);
                                }
                              }}
                              placeholder="Enter Breadth"
                              className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                            />

                            {formErrors.property_dimensions_breadth && (
                              <p className="text-sm text-red-500 mt-1">
                                {formErrors.property_dimensions_breadth}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    {/* Open Sides */}
                    {(propertyCategory === "Buy" ||
                      propertyCategory === "Rent") &&
                      ((buildingType === "Residential" &&
                        propertyType === "Plot") ||
                        (buildingType === "Commercial" &&
                          propertyType === "Land")) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            No. of Open Sides
                          </label>

                          <select
                            name="openSidesOfLand"
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.openSidesOfLand}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Open Sides</option>
                            <option value="1 Side">1 Side</option>
                            <option value="2 Sides">2 Sides</option>
                            <option value="3 Sides">3 Sides</option>
                            <option value="4 Sides">4 Sides</option>
                          </select>
                        </div>
                      )}

                    {/* Construction */}
                    {(propertyCategory === "Buy" ||
                      propertyCategory === "Rent") &&
                      ((buildingType === "Residential" &&
                        propertyType === "Plot") ||
                        (buildingType === "Commercial" &&
                          propertyType === "Land")) && (
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">
                            Any Construction on Property
                          </label>

                          <select
                            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={typeOfConstruction}
                            onChange={(e) =>
                              setTypeOfConstruction(e.target.value)
                            }
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
                    {propertyCategory === "Buy" &&
                      (propertyType === "Plot" || propertyType === "Land") && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Possession By
                          </label>

                          <select
                            value={possessionBy}
                            onChange={(e) => setPossessionBy(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Possession</option>
                            <option value="Immediate">Immediate</option>
                            <option value="Within 3 Months">
                              Within 3 Months
                            </option>
                            <option value="Within 6 Months">
                              Within 6 Months
                            </option>
                            <option value="By 2026">By 2026</option>
                            <option value="By 2027">By 2027</option>
                            <option value="By 2028">By 2028</option>
                            <option value="By 2029">By 2029</option>
                            <option value="By 2030">By 2030</option>
                            <option value="By 2031">By 2031</option>
                            <option value="By 2032">By 2032</option>
                          </select>
                        </div>
                      )}
                    {/* Length */}
                    {/* {propertyType === "Land" && (
  <div>
    <label className="font-medium text-gray-700">
      Length of Land
    </label>
    <input
      type="text"
      className="w-full p-3 mt-1 border rounded-lg"
      value={formData.length_of_land}
      onChange={(e) =>
        setFormData({
          ...formData,
          length_of_land: e.target.value,
        })
      }
    />
  </div>
)} */}

                    {/* Breadth */}
                    {/* {propertyType === "Land" && (
  <div>
    <label className="font-medium text-gray-700">
      Breadth of Land
    </label>
    <input
      type="text"
      className="w-full p-3 mt-1 border rounded-lg"
      value={formData.breadthOfLand}
      onChange={(e) =>
        setFormData({
          ...formData,
          breadthOfLand: e.target.value,
        })
      }
    />
  </div>
)} */}

                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Age of Property
                          </label>
                          <select
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.age_of_property}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                age_of_property: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Age of Property</option>
                            <option value="New Construction">New Construction</option>
                            <option value="1 to 5 Years">1 to 5 Years</option>
                            <option value="5 to 10 Years">5 to 10 Years</option>
                            <option value="10 to 15 Years">10 to 15 Years</option>
                            <option value="15 to 20 Years">15 to 20 Years</option>
                            <option value="Above 20 Years">Above 20 Years</option>
                          </select>
                        </div>
                      )}
                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Furnishing Type{" "}
                            <span className="text-xl font-bold text-red-500">
                              *
                            </span>
                          </label>
                          <select
                            className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${formErrors.furnished_type ? "border-red-600" : "border-gray-300"}`}
                            value={formData.furnished_type}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                furnished_type: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Furnishing Type</option>
                            <option value="Furnished">Furnished</option>
                            <option value="Unfurnished">Unfurnished</option>
                            <option value="Semi-Furnished">Semi-Furnished</option>
                          </select>
                          {formErrors.furnished_type && (
                            <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                              <MdErrorOutline className="text-lg" />
                              {formErrors.furnished_type}
                            </p>
                          )}
                        </div>
                      )}

                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "PG") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Covered Car Parking
                          </label>
                          <select
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.covered_parking}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                covered_parking: e.target.value,
                              })
                            }
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
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "PG") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Open Car Parking
                          </label>
                          <select
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.uncovered_parking}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                uncovered_parking: e.target.value,
                              })
                            }
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

                    {buildingType === "Residential" &&
                      !(
                        (propertyCategory === "Buy" &&
                          buildingType === "Residential" &&
                          propertyType === "Plot") ||
                        (propertyCategory === "Rent" &&
                          buildingType === "Commercial" &&
                          propertyType === "Land") ||
                        (propertyCategory === "Rent" &&
                          buildingType === "Commercial" &&
                          propertyType === "Storage") ||
                        (propertyCategory === "Rent" &&
                          buildingType === "Commercial" &&
                          propertyType === "Warehouse") ||
                        (propertyCategory === "Rent" &&
                          buildingType === "Commercial" &&
                          propertyType === "Industry") ||
                        (propertyCategory === "Rent" &&
                          buildingType === "Commercial" &&
                          propertyType === "Hospitality") ||
                        (propertyCategory === "Buy" &&
                          buildingType === "Commercial" &&
                          propertyType === "Storage") ||
                        (propertyCategory === "Buy" &&
                          buildingType === "Commercial" &&
                          propertyType === "Retail") ||
                        (propertyCategory === "Buy" &&
                          buildingType === "Commercial" &&
                          propertyType === "Land") ||
                        (propertyCategory === "Buy" &&
                          buildingType === "Commercial" &&
                          propertyType === "Storage") ||
                        (propertyCategory === "Buy" &&
                          buildingType === "Commercial" &&
                          propertyType === "Warehouse") ||
                        (propertyCategory === "Buy" &&
                          buildingType === "Commercial" &&
                          propertyType === "Industry") ||
                        (propertyCategory === "Buy" &&
                          buildingType === "Commercial" &&
                          propertyType === "Hospitality") ||
                        (propertyCategory === "Rent" &&
                          buildingType === "Residential" &&
                          propertyType === "Plot")
                      ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Balcony
                          </label>
                          <select
                            name="balcony"
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.balcony}
                            onChange={handleInputChange}
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
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||  
                       (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Power Backup
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.power_backup}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            power_backup: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Power Backup</option>
                        <option value="No Back-up">No Back-up</option>
                        <option value="Available">Available</option>
                      </select>
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">View</label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.view}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            view: e.target.value,
                          })
                        }
                      >
                        <option value="">Select View</option>
                        <option value="Beach View">Beach View</option>
                        <option value="Garden View">Garden View</option>
                        <option value="Golf View">Golf View</option>
                        <option value="Lake View">Lake View</option>
                        <option value="Park View">Park View</option>
                        <option value="Road View">Road View</option>
                        <option value="Community View">Community View</option>
                        <option value="Pool View">Pool View</option>
                        <option value="Creek View">Creek View</option>
                        <option value="Sea View">Sea View</option>
                      </select>
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&  
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Flooring
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.flooring}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            flooring: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Flooring</option>
                        <option value="Marble">Marble</option>
                        <option value="Concrete">Concrete</option>
                        <option value="Cemented">Cemented</option>
                        <option value="Carpeted">Carpeted</option>
                        <option value="Wooden">Wooden</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Water Source
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.water_source}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            water_source: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Water Source</option>
                        <option value="Municipal Supply">
                          Municipal Supply
                        </option>
                        <option value="Borewell/ Underground">
                          Borewell/ Underground
                        </option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  )} */}

                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "PG") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Lift Availability
                          </label>
                          <select
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.lift_availability}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lift_availability: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Lift Availability</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      )}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ 22") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                      (propertyCategory === "Rent" &&
                          buildingType === "Commercial" &&
                          propertyType === "Industry")||
                           (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Loan Availability
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.loan_availability}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            loan_availability: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Loan Availability</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Office Space Type
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.office_space_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            office_space_type: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Office Space Type</option>
                        <option value="Semi-Fitted">Semi-Fitted</option>
                        <option value="Fitted Space">Fitted Space</option>
                        <option value="Shell and Core">Shell and Core</option>
                      </select>
                    </div>
                  )} */}

                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "PG") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Pantry
                          </label>
                          <select
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={pantry}
                            onChange={(e) => setPantry(e.target.value)}
                          >
                            <option value="">Select Pantry</option>
                            <option value="Wet">Wet</option>
                            <option value="Dry">Dry</option>
                            <option value="None">None</option>
                          </select>
                        </div>
                      )}
                    {buildingType === "Commercial" &&
                      propertyType === "Office Space" && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Reception Area
                          </label>

                          <select
                            value={receptionArea}
                            onChange={(e) => setReceptionArea(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      )}
                    {buildingType === "Commercial" &&
                      propertyType === "Office Space" && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Central AC
                          </label>

                          <select
                            value={centralAC}
                            onChange={(e) => setCentralAC(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Option</option>
                            <option value="Duct Only">Duct Only</option>
                            <option value="Available">Available</option>
                            <option value="Not Available">Not Available</option>
                          </select>
                        </div>
                      )}
                    {(propertyType === "Office Space" ||
                      propertyType === "Retail" ||
                      propertyType === "Storage" ||
                      propertyType === "Industry" ||
                      propertyType === "Hospitality") && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Investment Option
                          </label>

                          <select
                            name="investment_options"
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.investment_options}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Investment Option</option>
                            <option value="Pre-Leased Spaces">
                              Pre-Leased Spaces
                            </option>
                            <option value="Restaurants">Restaurants</option>
                            <option value="SCO Plots">SCO Plots</option>
                            <option value="Business Center">
                              Business Center
                            </option>
                            <option value="Food Court">Food Court</option>
                            <option value="Multiplex">Multiplex</option>
                            <option value="Co-working">Co-working</option>
                            <option value="Multiplex">Multiplex</option>
                            <option value="Corner Shop">Corner Shop</option>
                            <option value="Main Road Shop">Main Road Shop</option>
                          </select>
                        </div>
                      )}

                    {(propertyType === "Office Space" ||
                      propertyType === "Retail" ||
                      propertyType === "Storage" ||
                      propertyType === "Industry" ||
                      propertyType === "Hospitality") && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Purchase Type
                          </label>

                          <select
                            name="purchase_type"
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.purchase_type}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Purchase Type</option>
                            <option value="Resale">Resale</option>
                            <option value="New Bookings">New Bookings</option>
                          </select>
                        </div>
                      )}

                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "PG") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Personal Washroom
                          </label>
                          <select
                            name="personal_washroom"
                            value={formData.personal_washroom}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      )}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space 18") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land 22") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ 22") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                        (propertyCategory === "Rent" &&
                          buildingType === "Commercial" &&
                          propertyType === "Industry")||
                        (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Ceiling Height
                      </label>
                      <input
                        type="text"
                        name="ceiling_height"
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.ceiling_height}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                      />
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType ===
 "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Seat Type
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.seat_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            seat_type: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Seat Type</option>
                        <option value="Open Seat">Open Seat</option>
                        <option value="Private Cabin">Private Cabin</option>
                        <option value="Conference Cabin">
                          Conference Cabin
                        </option>
                      </select>
                    </div>
                  )} */}

                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        (propertyType === "Apartment" ||
                          propertyType === "Independent House/Villa" ||
                          propertyType === "Plot")) ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space 18") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      // (propertyCategory === "Buy" &&
                      //   buildingType === "Commercial" &&
                      //   propertyType === "Office Space") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "PG")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Number of Seats Available
                          </label>
                          <input
                            type="text"
                            name="number_of_seats_available"
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.number_of_seats_available}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                                handleInputChange(e);
                              }
                            }}
                          />
                        </div>
                      )}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                        (propertyCategory === "Rent" &&
                          buildingType === "Commercial" &&
                          propertyType === "Industry")||
                           (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Maintenance Cost
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        name="maintenance_cost"
                        value={formData.maintenance_cost}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                      />
                      {formErrors.rent && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <MdErrorOutline className="text-lg" />
                          {formErrors.rent}
                        </p>
                      )}
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                         (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Maintenance Frequency
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.maintenance_frequency}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maintenance_frequency: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Maintenance Frequency</option>
                        <option value="Per Sqft">Per Sqft</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                        <option value="One-Time">One-Time</option>
                      </select>
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                       (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Maintenance Included
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.maintenance_included}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maintenance_included: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Maintenance Included</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                      (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                        (propertyCategory === "Rent" &&
                          buildingType === "Commercial" &&
                          propertyType === "Industry")||
                           (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Security Deposit Type
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.security_deposit_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            security_deposit_type: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Deposit Type</option>
                        <option value="Zero Deposit">Zero Deposit</option>
                        <option value="One Month">One Month</option>
                        <option value="Two Months">Two Months</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land 22") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Custom Deposit Amount
                      </label>
                      <input
                        type="text"
                        name="custom_deposit_amount"
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.custom_deposit_amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,10}$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                      />
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ 22") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                          buildingType === "Commercial" &&
                          propertyType === "Industry")||
                           (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Available for Company Lease
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.available_for_company_lease}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            available_for_company_lease: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  )} */}

                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        (propertyType === "Apartment" ||
                          propertyType === "Independent House/Villa" ||
                          propertyType === "Plot")) ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      // (propertyCategory === "Rent" &&
                      //   buildingType === "Residential" &&
                      //   propertyType === "Apartment") ||
                      // (propertyCategory === "Rent" &&
                      //   buildingType === "Residential" &&
                      //   propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      // (propertyCategory === "Rent" &&
                      //   buildingType === "Residential" &&
                      //   propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Available For{" "}
                            {propertyCategory === "Rent" &&
                              buildingType === "Residential" &&
                              propertyType === "PG" && (
                                <span className="text-xl font-bold text-red-500">
                                  *
                                </span>
                              )}
                          </label>
                          <select
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.available_for}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                available_for: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Availability</option>
                            <option value="Girls">Girls</option>
                            <option value="Boys">Boys</option>
                            <option value="Family">Family</option>
                            <option value="Single women">Single women</option>
                            <option value="Single Men">Single Men</option>
                          </select>
                          {formErrors.available_for && (
                            <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                              <MdErrorOutline className="text-lg" />
                              {formErrors.available_for}
                            </p>
                          )}
                        </div>
                      )}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space 18") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                       (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Suited For{" "}
                        {propertyCategory === "Rent" &&
                          buildingType === "Residential" &&
                          propertyType === "PG" && (
                            <span className="text-xl font-bold text-red-500">
                              *
                            </span>
                          )}
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.suited_for}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            suited_for: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Suitability</option>
                        <option value="Students">Students</option>
                        <option value="Working Professionals">
                          Working Professionals
                        </option>
                        <option value="Any">Any</option>
                      </select>
                      {formErrors.suited_for && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <MdErrorOutline className="text-lg" />
                          {formErrors.suited_for}
                        </p>
                      )}
                    </div>
                  )} */}

                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        (propertyType === "Apartment" ||
                          propertyType === "Independent House/Villa" ||
                          propertyType === "Plot")) ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality")
                    ) && (
                        // Replace button UI with dropdown UI

                        <div>
                          <label className="font-medium text-gray-700">
                            Room Type <span className="text-red-500">*</span>
                          </label>

                          <select
                            value={roomType}
                            onChange={(e) => {
                              setRoomType(e.target.value);

                              setFormData({
                                ...formData,
                                room_type: e.target.value,
                              });
                            }}
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Room Type</option>
                            <option value="Private">Private</option>
                            <option value="Sharing">Sharing</option>
                          </select>

                          {formErrors.room_type && (
                            <p className="text-sm text-red-500 mt-1">
                              {formErrors.room_type}
                            </p>
                          )}
                        </div>
                        // <div>
                        //   <label className="block mb-2 font-medium text-gray-700">
                        //     Room Type{" "}
                        //     {propertyCategory === "Rent" &&
                        //       buildingType === "Residential" &&
                        //       propertyType === "PG" && (
                        //         <span className="text-xl font-bold text-red-500">
                        //           *
                        //         </span>
                        //       )}
                        //   </label>

                        //   <Select
                        //     isMulti
                        //     name="room_type"
                        //     options={roomOptions}
                        //     value={roomOptions.filter((opt) =>
                        //       formData.room_type.includes(opt.value),
                        //     )}
                        //     onChange={(selectedOptions) =>
                        //       handleInputChange({
                        //         target: {
                        //           name: "room_type",
                        //           value: selectedOptions.map((opt) => opt.value),
                        //         },
                        //       })
                        //     }
                        //     components={{ MultiValue: CustomMultiValue }}
                        //     placeholder="Select Room Types"
                        //     classNamePrefix="react-select"
                        //     styles={{
                        //       control: (base, state) => ({
                        //         ...base,
                        //         minHeight: "60px",
                        //         padding: "6px",
                        //         borderColor: state.isFocused
                        //           ? "#a855f7"
                        //           : "#d1d5db",
                        //         boxShadow: state.isFocused
                        //           ? "0 0 0 2px #a855f7"
                        //           : "none",
                        //         borderRadius: "0.5rem",
                        //         fontSize: "16px",
                        //         display: "flex",
                        //         flexWrap: "nowrap",
                        //         overflowX: "auto",
                        //       }),
                        //       valueContainer: (base) => ({
                        //         ...base,
                        //         padding: "0 6px",
                        //         display: "flex",
                        //         flexWrap: "nowrap",
                        //         gap: "6px",
                        //         overflowX: "auto",
                        //         scrollbarWidth: "thin",
                        //         alignItems: "center",
                        //       }),
                        //       placeholder: (base) => ({
                        //         ...base,
                        //         color: "#1f2937",
                        //         fontSize: "16px",
                        //       }),
                        //       multiValue: (base) => ({
                        //         ...base,
                        //         backgroundColor: "#ede9fe",
                        //         borderRadius: "0.375rem",
                        //         display: "flex",
                        //         alignItems: "center",
                        //         padding: "2px 6px",
                        //         whiteSpace: "nowrap",
                        //       }),
                        //       multiValueLabel: (base) => ({
                        //         ...base,
                        //         color: "#6b21a8",
                        //         fontWeight: "500",
                        //       }),
                        //       multiValueRemove: (base) => ({
                        //         ...base,
                        //         color: "#6b21a8",
                        //         ":hover": {
                        //           backgroundColor: "#ddd6fe",
                        //           color: "#4c1d95",
                        //         },
                        //       }),
                        //     }}
                        //   />
                        //   {formErrors.room_type && (
                        //     <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                        //       <MdErrorOutline className="text-lg" />
                        //       {formErrors.room_type}
                        //     </p>
                        //   )}
                        // </div>
                      )}
                    {roomType === "Sharing" && (
                      <div>
                        <label className="block mb-1 font-medium text-gray-700">
                          How many people can share this room?
                        </label>

                        <select
                          value={noOfPeoples}
                          onChange={(e) => {
                            setNoOfPeoples(e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              no_of_peoples: e.target.value,
                            }));
                          }}
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
                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                       (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Food Available
                      </label>
                      <Select
                        isMulti
                        name="food_available"
                        options={foodOptions}
                        value={foodOptions.filter((opt) =>
                          formData.food_available.includes(opt.value),
                        )}
                        onChange={(selectedOptions) =>
                          handleInputChange({
                            target: {
                              name: "food_available",
                              value: selectedOptions.map((opt) => opt.value),
                            },
                          })
                        }
                        components={{ MultiValue: CustomMultiValue }}
                        placeholder="Select food available"
                        classNamePrefix="react-select"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            minHeight: "60px",
                            padding: "6px",
                            borderColor: state.isFocused
                              ? "#a855f7"
                              : "#d1d5db",
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
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                       (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Food Charges Included{" "}
                        {propertyCategory === "Rent" &&
                          buildingType === "Residential" &&
                          propertyType === "PG" && (
                            <span className="text-xl font-bold text-red-500">
                              *
                            </span>
                          )}
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.food_charges_included}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            food_charges_included: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Food Charges</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {formErrors.food_charges_included && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <MdErrorOutline className="text-lg" />
                          {formErrors.food_charges_included}
                        </p>
                      )}
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                        (propertyCategory === "Rent" &&
                          buildingType === "Commercial" &&
                          propertyType === "Industry")||
                           (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Notice Period
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.notice_period}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({
                            ...formData,
                            notice_period: value,
                            notice_period_other_days:
                              value === "Others"
                                ? formData.notice_period_other_days
                                : "",
                          });
                        }}
                      >
                        <option value="">Select Notice Period</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="45">45</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  )} */}

                    {/* Conditionally Render the "Notice Period (Other Days)" Input */}
                    {/* {formData.notice_period === "Others" && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Notice Period (Other Days)
                      </label>
                      <input
                        type="text"
                        name="notice_period_other_days"
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.notice_period_other_days}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            notice_period_other_days: e.target.value,
                          })
                        }
                      />
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space 18") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                       (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Electricity Charges Included
                      </label>
                      <select
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.electricity_charges_included}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            electricity_charges_included: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  )} */}

                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        (propertyType === "Apartment" ||
                          propertyType === "Independent House/Villa" ||
                          propertyType === "Plot")) ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Office Space in IT/SEZ") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Warehouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Total Beds
                          </label>
                          <input
                            type="text"
                            name="total_beds"
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.total_beds}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                                handleInputChange(e);
                              }
                            }}
                          />
                        </div>
                      )}
                    {propertyCategory === "Paying Guest" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Builder Floor" ||
                        propertyType === "1RK/Studio Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Service Apartment") && (
                        <div>
                          <label className="block mb-1 font-medium text-gray-700">
                            Available Beds
                          </label>

                          <input
                            type="text"
                            value={availableBeds}
                            placeholder="Enter Available Beds"
                            onChange={(e) => {
                              const value = e.target.value;

                              if (/^\d*$/.test(value)) {
                                setAvailableBeds(value);

                                setFormData((prev) => ({
                                  ...prev,
                                  available_beds: value,
                                }));
                              }
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          />
                        </div>
                      )}
                    {propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Builder Floor" ||
                        propertyType === "1RK/Studio Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Service Apartment") && (
                        <div className="md:col-span-3 mt-4">
                          <div className="flex flex-wrap gap-4">
                            {/* Attached Balcony */}
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={attachedBalcony}
                                onChange={(e) =>
                                  setAttachedBalcony(e.target.checked)
                                }
                              />
                              Attached Balcony
                            </label>

                            {/* Attached Bathroom */}
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={attachedBathroom}
                                onChange={(e) =>
                                  setAttachedBathroom(e.target.checked)
                                }
                              />
                              Attached Bathroom
                            </label>
                          </div>
                        </div>
                      )}
                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail 20") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                       (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa")
                  ) && (
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        PG Rules
                      </label>

                      <Select
                        isMulti
                        name="pg_rules"
                        options={pgRuleOptions}
                        value={pgRuleOptions.filter((opt) =>
                          formData.pg_rules.includes(opt.value),
                        )}
                        onChange={(selectedOptions) =>
                          handleInputChange({
                            target: {
                              name: "pg_rules",
                              value: selectedOptions.map((opt) => opt.value),
                            },
                          })
                        }
                        components={{ MultiValue: CustomMultiValue }}
                        placeholder="Select PG Rules"
                        classNamePrefix="react-select"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            minHeight: "60px",
                            padding: "6px",
                            borderColor: state.isFocused
                              ? "#a855f7"
                              : "#d1d5db",
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
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        (propertyCategory === "Buy" &&
                          buildingType === "Residential" &&
                          propertyType === "Independent/Builder Floor") ||
                          (propertyType === "Plot"))) ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                        (propertyCategory === "Rent" &&
                          buildingType === "Commercial" &&
                          propertyType === "Industry")||
                           (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Gate Closing Time
                      </label>
                      <select
                        name="gate_closing_time"
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.gate_closing_time}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Gate Closing Hour
                      </label>
                      <inputm
                        type="time"
                        name="gate_closing_hour"
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.gate_closing_hour}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleInputChange(e);
                        }}
                      />
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse ") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Hospitality")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        PG Services
                      </label>
                      <input
                        type="text"
                        name="pg_services"
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.pg_services}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                      />
                    </div>
                  )} */}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "Independent House/Villa" ||
                        propertyType === "Plot")) ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent/Builder Floor") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ 22") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Retail") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Land") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Office Space in IT/SEZ") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Storage") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Warehouse") ||
                    (propertyCategory === "Buy" &&
                      buildingType === "Commercial" &&
                      propertyType === "Industry") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Farmhouse") ||
                       (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Min Lock-in Period
                      </label>
                      <input
                        type="text"
                        name="min_lockin_period"
                        value={formData.min_lockin_period}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                        className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  )} */}

                    {!(
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Farmhouse") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Land") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Commercial" &&
                        propertyType === "Industry") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent House/Villa") ||
                      // (propertyCategory === "Buy" &&
                      //   buildingType === "Residential" &&
                      //   propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Independent/Builder Floor") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                      (propertyCategory === "Buy" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Retail") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Residential" &&
                        propertyType === "Service Apartment")
                    ) && (
                        <div>
                          <label className="font-medium text-gray-700">
                            Parking Availability
                          </label>
                          <select
                            className="w-full p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                            value={formData.parking_availability}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                parking_availability: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      )}

                    {/* {!(
                    (propertyCategory === "Buy" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot") ||
                      (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Storage") ||
                         (propertyCategory === "Rent" &&
                        buildingType === "Commercial" &&
                        propertyType === "Hospitality") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Apartment") ||
                        (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "Builder Floor") ||
                         (propertyCategory === "Paying Guest" &&
                        buildingType === "Residential" &&
                        propertyType === "1RK/Studio Apartment") ||
                         (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Independent House/Villa") ||
                       (propertyCategory === "Paying Guest" &&
                      buildingType === "Residential" &&
                      propertyType === "Service Apartment") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG")
                  ) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Units{" "}
                        <span className="text-xl font-bold text-red-500">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${
                          formErrors.units
                            ? "border-red-600"
                            : "border-gray-300"
                        }`}
                        name="units"
                        value={formData.units}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                      />
                      {formErrors.units && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <MdErrorOutline className="text-lg" />
                          {formErrors.units}
                        </p>
                      )}
                    </div>
                  )} */}

                    {/* {((propertyCategory === "Buy" &&
                    buildingType === "Residential" &&
                    propertyType === "Plot") ||
                    (propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "Plot")) && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Plot No{" "}
                        <span className="text-xl font-bold text-red-500">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none ${
                          formErrors.plot_no
                            ? "border-red-600"
                            : "border-gray-300"
                        }`}
                        name="plot_no"
                        value={formData.plot_no}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z0-9]{0,10}$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                      />
                      {formErrors.plot_no && (
                        <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                          <MdErrorOutline className="text-lg" />
                          {formErrors.plot_no}
                        </p>
                      )}
                    </div>
                  )} */}

                    {
                      /* Existing Rent Conditions */
                      ((propertyCategory === "Rent" &&
                        ((buildingType === "Residential" &&
                          (propertyType === "PG" ||
                            propertyType === "Independent House/Villa" ||
                            propertyType === "Service Apartment")) ||
                          (buildingType === "Commercial" &&
                            (propertyType === "Office Space" ||
                              propertyType === "Storage" ||
                              propertyType === "Industry" ||
                              propertyType === "Hospitality")))) ||
                        /* Plot / Land Conditions */
                        ((propertyCategory === "Buy" ||
                          propertyCategory === "Rent") &&
                          ((buildingType === "Residential" &&
                            propertyType === "Plot") ||
                            (buildingType === "Commercial" &&
                              propertyType === "Land"))) ||
                        /* Paying Guest + Apartment / Builder Floor */
                        (propertyCategory === "Paying Guest" &&
                          (propertyType === "Apartment" ||
                            propertyType === "Builder Floor" ||
                            propertyType === "1RK/Studio Apartment" ||
                            propertyType === "Independent House/Villa" ||
                            propertyType === "Service Apartment"))) && (
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">
                            Available From
                          </label>

                          <select
                            name="available_from"
                            value={formData.available_from}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 text-gray-800 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select availability</option>
                            <option value="Immediately">Immediate</option>
                            <option value="Later">Later</option>
                          </select>
                        </div>
                      )
                    }

                    {propertyCategory === "Rent" &&
                      buildingType === "Residential" &&
                      propertyType === "PG" && (
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">
                            Operating Since(Per year's)
                          </label>
                          <select
                            name="operating_since"
                            value={formData.operating_since}
                            onChange={handleInputChange}
                            className="w-full p-3 mt-1 text-gray-800 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select range</option>
                            <option value="0-1">01</option>
                            <option value="2-4">24</option>
                            <option value="5-8">58</option>
                            <option value="9-12">912</option>
                            <option value="13+">13+</option>
                          </select>
                        </div>
                      )}
                  </div>
                </div>

                <div className="p-3 mx-auto mb-16 bg-white border max-w-7xl rounded-xl">
                  {/* Header Section */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Property Info
                    </h2>
                    <p className="text-gray-500">
                      Details about the property, including an overview and
                      description that provides insight into the properties
                      purpose, goals, and unique aspects.
                    </p>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2.9fr_1fr]">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium text-gray-700">
                          About Property
                        </label>

                        <button
                          type="button"
                          onClick={generateDescription}
                          disabled={isGeneratingDescription}
                          className="px-4 py-2 text-sm text-white transition rounded-lg bg-rose-500 hover:bg-rose-600 disabled:opacity-50"
                        >
                          {isGeneratingDescription
                            ? "Generating..."
                            : "Generate with AI"}
                        </button>
                      </div>

                      <textarea
                        name="property_description"
                        className="w-full h-40 p-3 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
                        value={formData.property_description}
                        onChange={handleInputChange}
                        placeholder="Enter Property Description"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="max-w-5xl p-3 mx-auto mb-3 bg-white border border-gray-300 rounded-xl">
                <div>
                  <h2 className="text-2xl text-gray-900">Amenities</h2>
                  <p className="mt-1 text-gray-500">
                    This section allows users to select available amenities for
                    the property, with dynamically updated checkboxes to
                    represent selected features.
                  </p>
                  {formErrors.amenities && (
                    <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                      <MdErrorOutline className="text-lg" />
                      {formErrors.amenities}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3">
                  {amenitiesList.map((amenity, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity._id)}
                        onChange={() => toggleAmenity(amenity._id)}
                        className="w-5 h-5 my-text border-gray-300 form-checkbox focus:ring-rose-500"
                      />
                      <span
                        className={`text-gray-700 ${selectedAmenities.includes(amenity._id)
                            ? "my-text font-medium"
                            : ""
                          }`}
                      >
                        {amenity.amenity_name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="max-w-5xl p-6 mx-auto">
                <div className="grid grid-cols-1 gap-6 mb-4 md:grid-cols-2">
                  {/* Upload Property Cover Photo */}
                  <div
                    className="p-6 bg-white border-gray-200 rounded-xl border-1"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file && file.type.startsWith("image/")) {
                        setCoverImage(file);
                      }
                    }}
                  >
                    <h2 className="text-xl text-gray-900">
                      Upload property cover photo
                    </h2>
                    <p className="mt-1 text-gray-500">
                      This step allows users to upload cover photo.
                    </p>
                    <div className="relative flex flex-col items-center p-6 mt-4 border-2 border-gray-300 border-dashed rounded-lg">
                      {coverImage ? (
                        <div className="relative w-full">
                          {/* Uploaded Image */}
                          <img
                            src={
                              coverImage instanceof File
                                ? URL.createObjectURL(coverImage)
                                : coverImage
                            }
                            alt="Uploaded Preview"
                            className="object-cover w-full h-64 rounded-md"
                          />
                          {/* Delete Button */}
                          <button
                            onClick={handelCoverImageDelete}
                            className="absolute p-1 bg-black bg-opacity-50 rounded-full top-2 right-2"
                          >
                            <Trash className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Upload Section (only visible when no image) */}
                          <div className="text-gray-400 text-8xl">
                            <MdOutlineDriveFolderUpload />
                          </div>

                          <p className="mt-2 text-gray-500">
                            Drag and Drop Imag or Upload
                          </p>

                          <button
                            onClick={() => imageInputRef.current.click()}
                            className="px-4 py-2 mt-2 text-white my-bg rounded-md hover:my-bg"
                          >
                            + Add Photos
                          </button>

                          <p className="mt-2 text-xs text-center text-gray-400">
                            Property listing with more than 5 images get 3x more
                            views.
                            <br />
                            Accepted formats: .jpg, .gif, .bmp, .png | Max size:
                            50MB
                          </p>
                        </>
                      )}

                      {/* Hidden Input (always present) */}
                      <input
                        type="file"
                        name="cover_image"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={(e) => setCoverImage(e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                    {formErrors.cover_image && (
                      <p className="flex items-center gap-1 mt-4 text-sm text-red-500">
                        <MdErrorOutline className="text-lg" />
                        {formErrors.cover_image}
                      </p>
                    )}
                  </div>

                  {/* Upload Video Section */}
                  <div className="flex flex-col gap-6">
                    <div
                      className="p-6 bg-white border border-gray-200 rounded-xl"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (
                          file &&
                          file.type.startsWith("video/") &&
                          file.size <= 50 * 1024 * 1024
                        ) {
                          handleVideoUpload({ target: { files: [file] } });
                        }
                      }}
                    >
                      <h2 className="text-xl text-gray-900">Upload Video</h2>
                      <p className="mt-1 text-gray-500">
                        You can upload one video. Max size: 50MB.
                      </p>

                      {video ? (
                        <div className="relative mt-4">
                          <video
                            controls
                            src={video}
                            className="object-cover w-full rounded-lg h-72"
                          />
                          <button
                            onClick={handleVideoDelete}
                            className="absolute p-2 bg-black bg-opacity-50 rounded-full top-2 right-2"
                          >
                            <Trash className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() =>
                              videoInputRef.current &&
                              videoInputRef.current.click()
                            }
                            className="px-4 py-2 text-white my-bg rounded-md hover:my-bg"
                          >
                            Upload Video
                          </button>
                          <p className="mt-2 text-xs text-gray-400">
                            Accepted formats: .mp4, .mov, etc. | Max: 50MB
                          </p>
                        </div>
                      )}

                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center justify-center">
                      <div className="w-full border-t border-gray-300"></div>
                      <span className="px-4 text-lg font-bold text-gray-700">
                        OR
                      </span>
                      <div className="w-full border-t border-gray-300"></div>
                    </div>

                    {/* Video  Url Section */}
                    <div className="p-6 bg-white border-gray-200 rounded-xl border-1">
                      <h2 className="text-xl text-gray-900">Video Option</h2>
                      <p className="mt-1 text-gray-500">
                        This step allows users to upload video URL.
                      </p>
                      <div className="flex gap-4 mt-4">
                        <div className="w-1/2">
                          <label className="block mb-2 text-gray-700">
                            Select Video Source
                          </label>
                          <select
                            name="video_url_type"
                            value={formData.video_url_type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="">Select Video Source</option>
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
                            name="video_url"
                            value={formData.video_url}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Upload Property Photos */}
                  <div
                    className="p-6 bg-white border-gray-200 rounded-xl border-1"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files);
                      const imageFiles = files.filter(
                        (file) =>
                          file.type.startsWith("image/") &&
                          file.size <= 5 * 1024 * 1024,
                      );

                      if (imageFiles.length > 0) {
                        handleImageUpload2(imageFiles);
                      }
                    }}
                  >
                    <h2 className="text-xl text-gray-900">
                      Upload photos of your property
                    </h2>
                    <p className="mt-1 text-gray-500">
                      This step allows users to uploading additional images.
                    </p>
                    <div className="flex flex-col items-center p-8 mt-4 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="text-gray-400 text-8xl">
                        <MdOutlineDriveFolderUpload />
                      </div>
                      <p className="mt-2 text-gray-700">
                        Drag and Drop Image Or Upload
                      </p>
                      <button
                        disabled={propertyimages.length >= 5}
                        onClick={() => imageInputRef2.current.click()}
                        className={`mt-2 px-4 py-2 rounded-md ${propertyimages.length >= 5
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "my-bg text-white hover:my-bg"
                          }`}
                      >
                        + Add Photos
                      </button>
                      <p className="mt-2 text-xs text-center text-gray-400">
                        Property listing with more than 5 images gets 3x more
                        views.
                        <br />
                        Accepted formats: .jpg, .gif, .bmp, .png | Max size:
                        50MB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={imageInputRef2}
                        onChange={handleImageUpload2}
                        className="hidden"
                      />
                    </div>

                    {/* Uploaded Images Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-6 sm:grid-cols-4">
                      {propertyimages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.img}
                            alt={`Uploaded ${index}`}
                            className="object-cover w-full h-24 rounded-lg"
                          />
                          <button
                            onClick={() => handleDelete2(index)}
                            className="absolute p-1 bg-black bg-opacity-50 rounded-md top-1 right-1"
                          >
                            <Trash className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Virtual Tour Section */}
                  <div className="flex flex-col gap-6">
                    <div className="p-6 bg-white border-gray-200 rounded-xl border-1">
                      {/* Heading */}
                      <h2 className="text-xl font-semibold text-gray-900">
                        Virtual Tour
                      </h2>
                      <p className="mt-1 text-gray-500">
                        This step allows users to indicate if a virtual tour is
                        available for the property.
                      </p>

                      {/* Label */}
                      <label className="block mt-4 font-medium text-gray-700">
                        Is Virtual Tour Available?
                      </label>

                      {/* Dropdown for Yes/No */}
                      <select
                        value={virtualTourLink}
                        onChange={(e) => setVirtualTourLink(e.target.value)}
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="">Select Virtual Tour Available?</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Fixed at Bottom */}
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
                    if (validateStepFields()) {
                      nextStep();
                    }
                  }}
                  className="px-5 py-2 text-white my-bg rounded-lg hover:my-bg"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    if (validateStepFields()) {
                      handleEdit(e);
                    }
                  }}
                  disabled={isSubmitting}
                  className="bg-rose-500 text-white px-6 py-3 rounded-lg"
                >
                  {isSubmitting ? "Updating..." : "Update Property"}
                </button>
              )}
            </div>
          </div>
        </div>
      </LoadScript>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl">
            <h2 className="mb-4 text-xl font-semibold text-red-600">
              Free Property Posting Limit Reached
            </h2>
            <p className="mb-6 text-gray-700">
              Your free property posting limit has ended. Please purchase a plan
              to continue posting properties.
            </p>
            {/* Align buttons side by side on the right */}
            <div className="flex items-center justify-between px-1">
              <button
                className="px-4 py-2 text-white my-bg rounded hover:bg-green-700"
                onClick={() => {
                  setShowModal(false); // FIXED
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
                  setShowModal(false); // FIXED
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
              Your featured count has expired
            </h2>
            <p className="mb-6 text-gray-700">
              Please purchase a plan to feature more properties.
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

export default EditProperty;