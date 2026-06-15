import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
// Add map options to disable satellite and other unnecessary UI
const mapOptions = {
  mapTypeControl: false, // Disables map type (including satellite) toggle
  fullscreenControl: false, // Disables fullscreen option if not needed
};

const PostProperty = ({ userId }) => {
  const history = useHistory();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCY4i1-nQFNVTSYetMw7aofzBRwGvCH_Ms", // Your API Key
    libraries: ["places"], // The libraries you are using
  });

  const [showModal, setShowModal] = useState(false); // Manage modal visibility
  const [newAmenityName, setNewAmenityName] = useState(""); // Manage new amenity name input
  const [newAmenityIcon, setNewAmenityIcon] = useState(null); // Manage new amenity icon input
  const [addErrorMessage, setAddErrorMessage] = useState(""); // Manage error message when adding amenity
  const [images, setImages] = useState([]); // State for holding images
  const [availablePropertyTypes, setAvailablePropertyTypes] = useState([]);
  const [availablePriceTypes, setAvailablePriceTypes] = useState([]); // Ne
  const [amenities, setAmenities] = useState([]); // State to hold fetched amenities
  const [selectedAmenities, setSelectedAmenities] = useState([]); // State for selected amenities
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [autocomplete, setAutocomplete] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showMap, setShowMap] = useState(false); // Control map visibility
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 }); // Default center
  const [selectedImages, setSelectedImages] = useState([]);
  const AccessToken = sessionStorage.getItem("AccessToken");
  const connect_to_name =
    sessionStorage.getItem("connect_to_name") || "Default Name";
  const connect_to_no = sessionStorage.getItem("connect_to_no") || "0000000000";
  const connect_to_email =
    sessionStorage.getItem("connect_to_email") || "default@example.com";
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const propertyOwnerType = sessionStorage.getItem("property_owner_type");

  const [formData, setFormData] = useState({
    user_id: "",
    property_category_type: "",
    property_owner_type: propertyOwnerType,
    address: "",
    city_name: "",
    property_type: "",
    property_name: "",
    property_price: "",
    safety_deposit: "",
    property_description: "",
    latitude: "",
    longitude: "",
    available_on_date: "",
    expiry_date: "",
    property_added_date: new Date().toISOString().split("T")[0],
    bhk_type: "",
    units: "",
    area_sq: "",
    security: "No",
    furnished_type: "",
    bathroom_type: "",
    total_floor: "",
    property_floor: "",
    mark_as_featured: "No",
    cover_image: null,
    admin_approval: "Approved",
    available_status: "Available",
    connect_to_name: connect_to_name,
    connect_to_no: connect_to_no,
    connect_to_email: connect_to_email,
    added_by_type: propertyOwnerType,
    category_price_type: "Buy",
    active_status: "Active",
    rating: "0",
    amenities: "", // Initialize as an empty array
    // ...initialize other fields as needed
  });

  const feature_count =
    parseInt(sessionStorage.getItem("feature_count"), 10) || 0;
  const paid_post_count =
    parseInt(sessionStorage.getItem("paid_post_count"), 10) || 0;
  const free_post_count =
    parseInt(sessionStorage.getItem("free_post_count"), 10) || 0;

  const openModal = () => {
    const accessToken = sessionStorage.getItem("AccessToken");
    if (!accessToken) {
      alert("Please log in to submit your enquiry.");
      return;
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isUpgradeModalOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling on body
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling on body
    }

    return () => {
      document.body.style.overflow = "auto"; // Clean up when the component unmounts or modal is closed
    };
  }, [isUpgradeModalOpen]);

  // Function to close the modal
  const closeUpgradeModal = () => {
    const freePostCount = sessionStorage.getItem("free_post_count");
    const paidPostCount = sessionStorage.getItem("paid_post_count");

    // Convert to numbers for proper comparison
    const freePostCountNum = freePostCount ? parseInt(freePostCount, 10) : 0;
    const paidPostCountNum = paidPostCount ? parseInt(paidPostCount, 10) : 0;

    if (freePostCountNum <= 0 && paidPostCountNum <= 0) {
      history.push("/");
    } else {
      setIsUpgradeModalOpen(false); // Close the modal
      setFormData((prevData) => ({
        ...prevData,
        mark_as_featured: "No", // Set mark_as_featured to "No"
      }));
    }
  };

  useEffect(() => {
    if (
      formData.property_owner_type === "Owner" ||
      formData.property_owner_type === "Customer"
    ) {
      setFormData((prevData) => ({
        ...prevData,
        units: 1, // Automatically set units to 1 if the owner type is "Owner"
      }));
    }
  }, [formData.property_owner_type]); // Depend on property_owner_type

  useEffect(() => {
    if (formData.property_type === "Plot") {
      setFormData((prevData) => ({
        ...prevData,
        bhk_type: "", // Reset BHK Type to empty
        furnished_type: "", // Reset furnished_type if property_type is Plot
        total_floor: "",
        property_floor: "",
        bathroom_type: "",
      }));
    }
  }, [formData.property_type]);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("AccessToken"); // Assuming you store the user ID as '_id'
    if (storedUserId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        user_id: storedUserId,
      }));
    }
  }, []);

  // Handle image file changes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert the FileList to an array
    const validImages = [];
    let allValid = true;

    // Validate each selected file
    files.forEach((file) => {
      // Check file format: if it's not JPG, PNG, or GIF, mark as invalid
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(
          `${file.name} is not a supported file type. Only JPG, PNG, and GIF are allowed.`,
        );
        allValid = false;

        return; // Skip size validation for unsupported file formats
      }

      // Check file size: if it exceeds 2MB, mark as invalid
      if (file.size <= 2 * 1024 * 1024) {
        // 2MB in bytes
        validImages.push(file);
      } else {
        window.alert(`${file.name} exceeds the 2MB size limit.`);
        allValid = false; // Mark that not all images are valid
      }
    });

    // Ensure no more than 5 images are selected in total
    if (validImages.length + selectedImages.length > 5) {
      window.alert("You can upload a maximum of 5 images.");
      return; // Stop the process if the max limit is exceeded
    }

    // If all selected images are valid, update the selectedImages state
    if (allValid) {
      setSelectedImages((prevImages) => [...prevImages, ...validImages]);
    }
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove),
    );
  };

  const fetchAmenities = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_amenities`,
        {
          // Optionally send user_id or other params if needed
        },
      );

      console.log("Response from amenities API:", response.data);

      if (Array.isArray(response.data.data)) {
        setAmenities(response.data.data);
      } else {
        console.error("Amenities response is not an array:", response.data);
        setAmenities([]);
      }
    } catch (error) {
      console.error("Error fetching amenities:", error);
      setAddErrorMessage("Failed to fetch amenities.");
      setAmenities([]);
    } finally {
      setLoading(false); // Ensure loading state is false after fetching
    }
  };

  useEffect(() => {
    fetchAmenities(); // Call the fetchAmenities function on component mount
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = sessionStorage.getItem("AccessToken");
      if (!AccessToken) {
        history.push("/login");
      }
      console.log("Posting property with User ID:", userId);
      setLoading(true); // Show loading spinner while fetching data

      try {
        // Fetch current free_view_count
        const profileResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
          {
            user_id: userId,
          },
        );

        const countData = profileResponse.data.count_data;
        const currentFreePostCount = countData.free_post_count;
        const currentPaidPostCount = countData.paid_post_count;
        const currentFeatureCount = countData.feature_count;

        console.log("Fetched free_post_count:", currentFreePostCount);

        // Check for errors in retrieving the count data
        if (
          currentFreePostCount === undefined ||
          currentFreePostCount === null
        ) {
          setErrorMessage("Error retrieving post count. Please try again.");
          setLoading(false);
          return;
        }

        // Logic for checking free and paid post count and feature count
        if (currentFreePostCount <= 0 && currentPaidPostCount <= 0) {
          setIsUpgradeModalOpen(true); // Open upgrade modal if conditions are met
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrorMessage("An error occurred while fetching profile data.");
      } finally {
        setLoading(false); // Hide loading spinner when done
      }
    };

    fetchProfileData();
  }, []);

  const handleAddAmenity = async () => {
    // Check if the name and icon are provided
    if (!newAmenityName || !newAmenityIcon) {
      setAddErrorMessage("Please provide both name and icon for the amenity.");
      return; // Prevent the function from proceeding
    }

    const formData = new FormData();
    formData.append("user_id", AccessToken); // Add user_id
    formData.append("amenity_name", newAmenityName);
    formData.append("amenity_icon", newAmenityIcon);

    // Log form data to verify if fields are correctly populated
    console.log("Form Data:", {
      user_id: AccessToken,
      amenity_name: newAmenityName,
      amenity_icon: newAmenityIcon,
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/add_property_amenities`,
        {
          method: "POST",
          body: formData,
        },
      );

      // Log response status to verify if the request was successful
      console.log("API Response Status:", response.status);

      if (response.ok) {
        const newAmenity = await response.json();
        console.log("New Amenity:", newAmenity); // Log the newly added amenity data

        // Update the amenities state to instantly show the new amenity
        setAmenities((prevAmenities) => [...prevAmenities, newAmenity]);

        // Call the fetchAmenities function to refresh the amenities list
        await fetchAmenities(); // Refresh amenities list

        setShowModal(false); // Close the modal after successful addition
        setNewAmenityName(""); // Clear the input
        setNewAmenityIcon(null); // Clear the file input
      } else {
        const errorResponse = await response.json();
        console.log("Error Response:", errorResponse); // Log the error response from the server
        setAddErrorMessage(
          errorResponse.message || "Failed to add the amenity.",
        );
      }
    } catch (error) {
      console.error("Error adding amenity:", error); // Log any errors
      setAddErrorMessage("Error adding amenity.");
    }
  };

  const handleAmenityChange = (amenityId) => {
    setSelectedAmenities((prevSelected) => {
      if (prevSelected.includes(amenityId)) {
        // Remove the amenity if it's already selected
        return prevSelected.filter((id) => id !== amenityId);
      } else {
        // Add the amenity to the selected list
        return [...prevSelected, amenityId];
      }
    });
  };

  const stepLabels = [
    "Basic Info",
    "Property Pricing",
    "Property Details",
    "More Details",
    "Aminities",
    "Additional Info",
  ];

  const handlePlaceSelect = () => {
    const place = autocomplete.getPlace();
    const address = place.formatted_address;
    const city =
      place.address_components?.find((component) =>
        component.types.includes("locality"),
      )?.long_name || "";

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setFormData({
      ...formData,
      address: address || formData.address,
      city_name: city || formData.city_name,
      latitude: lat, // Set the latitude in formData
      longitude: lng, // Set the longitude in formData
    });

    setMapCenter({ lat, lng });
    setShowMap(true);
  };

  const onAutocompleteLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "cover_image") {
      const file = files[0];
      if (file) {
        // Check the file extension
        const validExtensions = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
        ];
        if (!validExtensions.includes(file.type)) {
          setErrorMessage(
            "Please select a valid file format (jpg, jpeg, png,gif)",
          );
          formData.cover_image = null;
          return; // Prevent further processing
        }

        // Clear error message if the file is valid
        setErrorMessage("");
      }

      setFormData({
        ...formData,
        [name]: file,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Add logic for "Mark as Featured"
    if (name === "mark_as_featured" && value === "Yes") {
      if (feature_count === 0) {
        setIsUpgradeModalOpen(true);
        return;
      }
    }
  };
  //..............................................................................................access
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const data = new FormData();
    for (let key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    if (selectedAmenities.length > 0) {
      const amenitiesString = selectedAmenities.join(",");
      data.append("amenities", amenitiesString);
    } else {
      setErrorMessage("Please select at least one amenity.");
      setLoading(false);
      return;
    }

    const userId = sessionStorage.getItem("AccessToken");
    data.append("user_id", userId);

    try {
      // Step 1: Post the property
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/post_property`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Response from post_property API:", response.data);
      const propertyId = response.data.data._id;

      if (propertyId) {
        const imagesData = new FormData();
        console.log("Images array:", images); // Log images array

        // Ensure images array is not empty
        if (selectedImages && selectedImages.length > 0) {
          selectedImages.forEach((image) => {
            imagesData.append(`property_image`, image);
            imagesData.append("property_id", propertyId);
          });

          const imageResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/cust_api/add_property_images`,
            imagesData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          for (let pair of imagesData.entries()) {
            console.log(pair[0] + ", " + pair[1]);
          }

          console.log(
            "Response from add_property_images API:",
            imageResponse.data,
          );
          setAlert({ type: "success", message: "Images added successfully!" });
        } else {
          console.error("No images to upload.");
          setAlert({
            type: "warning",
            message: "No images provided for upload.",
          });
        }
      }

      // Step 2: Update user counts
      const profileResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
        { user_id: userId },
      );

      const counts = profileResponse.data.count_data;
      let newFreePostCount = counts.free_post_count;
      let newPaidPostCount = counts.paid_post_count;
      let newFeatureCount = counts.feature_count;

      if (newFreePostCount > 0) {
        newFreePostCount -= 1;
        sessionStorage.setItem("free_post_count", newFreePostCount);
      } else if (newPaidPostCount > 0) {
        newPaidPostCount -= 1;
        sessionStorage.setItem("paid_post_count", newPaidPostCount);
      }

      if (formData.mark_as_featured === "Yes") {
        newFeatureCount -= 1;
        sessionStorage.setItem("feature_count", newFeatureCount);
      }

      const updateCountResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_count`,
        {
          user_id: userId,
          free_post_count: newFreePostCount,
          paid_post_count: newPaidPostCount,
          feature_count: newFeatureCount,
        },
      );

      if (updateCountResponse.data.status !== 1) {
        console.warn("Failed to update counts.");
      }

      setAlert({ type: "success", message: "Property posted successfully!" });

      // Redirect after success
      setTimeout(() => {
        history.push("/postedproperties");
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error("Error during submission:", error);

      if (error.response?.data?.errors) {
        setErrorMessage(
          JSON.stringify(error.response.data.errors) || "An error occurred",
        );
      } else {
        setErrorMessage("Failed to post property.");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
    switch (step) {
      case 1:
        return (
          formData.property_category_type.trim() !== "" &&
          formData.property_owner_type.trim() !== "" &&
          formData.address.trim() !== "" &&
          formData.city_name.trim() !== "" &&
          formData.property_type.trim() !== "" &&
          formData.property_name.trim() !== ""
        );
      case 2:
        // Check if category_price_type is either "Rent" or "PG"
        const isRentOrPgType =
          formData.category_price_type === "Rent" ||
          formData.category_price_type === "PG";

        return (
          // If Rent or PG is selected, validate both property_price and safety_deposit
          isRentOrPgType
            ? formData.property_price.trim() !== "" &&
                formData.safety_deposit.trim() !== "" && // Ensure safety deposit is required for Rent and PG
                formData.property_description.trim() !== "" &&
                String(formData.category_price_type).trim() !== "" &&
                formData.available_on_date.trim() !== "" &&
                formData.expiry_date.trim() !== "" &&
                formData.property_added_date.trim() !== ""
            : // If Sell is selected, validate only property_price
              formData.category_price_type === "Sell"
              ? formData.property_price.trim() !== "" &&
                formData.property_description.trim() !== "" &&
                String(formData.category_price_type).trim() !== "" &&
                formData.available_on_date.trim() !== "" &&
                formData.expiry_date.trim() !== "" &&
                formData.property_added_date.trim() !== ""
              : // If neither Rent/PG nor Sell is selected, return false
                false
        );

      case 3:
        return (
          formData.units &&
          formData.units.toString().trim() !== "" &&
          formData.area_sq.trim() !== "" &&
          formData.security.trim() !== "" &&
          // If it's not residential, require bathroom_type
          (formData.property_category_type === "Residential" &&
          formData.property_type !== "Plot"
            ? formData.bhk_type.trim() !== "" &&
              formData.furnished_type.trim() !== "" &&
              formData.total_floor.trim() !== ""
            : // If it's Commercial, BHK type must be empty
              formData.property_category_type === "Commercial" &&
                formData.property_type !== "Plot"
              ? formData.bhk_type.trim() === "" &&
                formData.furnished_type.trim() !== "" &&
                formData.total_floor.trim() !== ""
              : true) &&
          // Check BHK Type for Plot (allow empty for Plot)
          (formData.property_type === "Plot"
            ? formData.bhk_type.trim() === "" &&
              formData.furnished_type.trim() === "" &&
              formData.total_floor.trim() === "" &&
              formData.bathroom_type.trim() === ""
            : true)
        );

      case 4:
        console.log("Validating Step 4 Fields:", formData);
        console.log(
          "Session Data:",
          sessionStorage.getItem("connect_to_name"),
          sessionStorage.getItem("connect_to_no"),
          sessionStorage.getItem("connect_to_email"),
        );
        return (
          (formData.property_type === "Plot" ||
            String(formData.property_floor).trim() !== "") && // Ensure it's a string
          String(formData.mark_as_featured).trim() !== "" && // Ensure it's a string
          formData.connect_to_email !== undefined &&
          formData.connect_to_email !== null && // Check if it's defined and not null
          formData.connect_to_name !== undefined &&
          formData.connect_to_name !== null && // Check if it's defined and not null
          formData.connect_to_no !== undefined &&
          formData.connect_to_no !== null && // Check if it's defined and not null
          String(formData.rating).trim() !== "" &&
          formData.cover_image !== null &&
          formData.cover_image !== undefined && // Check if cover_image is present
          // Validate added_by_type only if property_owner_type is not set
          (formData.property_owner_type === "" ||
            String(formData.added_by_type).trim() !== "")
        );

      case 5:
        return (
          formData.amenities.length > 0 // Ensure at least one amenity is selected
        );
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateFields()) {
      setErrorMessage(""); // Clear any previous error message
      setStep((prevStep) => Math.min(prevStep + 1, 6)); // Proceed to the next step
    } else {
      setErrorMessage("Please fill out all required fields for this step."); // Set error message
    }
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1)); // Go back to the previous step
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value })); // Update the corresponding field value
  };

  let autocompleteCity = null;

  // Callback for city autocomplete
  const onAutocitycompleteLoad = (autocomplete) => {
    autocompleteCity = autocomplete;
  };

  // Handle place selection for city
  const handlecityPlaceSelect = () => {
    if (autocompleteCity) {
      const place = autocompleteCity.getPlace();
      setFormData({
        ...formData,
        city: place.name, // Extract the city name
      });
    }
  };

  // Input change handler for manual input
  const handlecityChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "property_category_type") {
      if (value === "Commercial") {
        setAvailablePropertyTypes([
          "Retail Shop",
          "Office",
          "Warehouse",
          "Plot",
        ]);
        setAvailablePriceTypes([
          "Sell",
          "Rent", // Only "Sell" and "Rent" for Commercial
        ]);
      } else if (value === "Residential") {
        setAvailablePropertyTypes([
          "Apartment",
          "Plot",
          "Flat",
          "Independent House",
          "Villa",
          "Vacation Home",
          "Hostel",
          "Independent Floor",
        ]);
        setAvailablePriceTypes([
          "Sell",
          "Rent",
          "PG", // Add "PG" option for Residential
        ]);
      } else {
        setAvailablePropertyTypes([]); // Reset if no valid category is selected
        setAvailablePriceTypes([]); // Reset price types
      }
    }
  };
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Set added_by_type based on property_owner_type
  useEffect(() => {
    if (formData.property_owner_type) {
      let addedByType = "";

      switch (formData.property_owner_type) {
        case "Owner":
          addedByType = "Owner";
          break;
        case "Customer":
          addedByType = "Customer";
          break;
        case "Developer":
          addedByType = "Developer";
          break;
        case "Broker":
          addedByType = "Broker";
          break;
        case "Dealer":
          addedByType = "Dealer";
          break;
        case "Cp":
          addedByType = "Cp";
          break;
        default:
          addedByType = ""; // Default case if needed
      }

      setFormData((prevData) => ({
        ...prevData,
        added_by_type: addedByType,
      }));
    }
  }, [formData.property_owner_type]); // Trigger when property_owner_type changes

  // Renamed function to handle form submission or API request
  const onFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      property_owner_type: formData.property_owner_type,
      added_by_type: formData.added_by_type,
      // include other necessary fields...
    };

    try {
      const response = await fetch("API_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      //......

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        // Handle success, like redirect or showing a message
      } else {
        console.error("Error submitting form");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleAddImage = (e) => {
    e.preventDefault();
    // Your logic to handle image addition goes here

    // Move to step 6 after processing
    setStep(6);
  };

  const [showFields, setShowFields] = useState(false); // or true based on your requirement

  // Check if category_price_type is either "Rent" or "PG"
  const isRentOrPG =
    formData.category_price_type === "Rent" ||
    formData.category_price_type === "PG";

  // Check if category_price_type is "Sell"
  const isSell = formData.category_price_type === "Sell";
  // Check if the property category type is Commercial
  const isResidential = formData.property_category_type === "Residential";
  const isCommercial = formData.property_category_type === "Commercial";

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  py-4  bg-white text-black">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-black">Post a Property</h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Add Your Property Details
        </h2>
        <p className="text-gray-500">
          Fill out the form below to list your property. Provide as much detail
          as possible to help potential buyers or renters find what they're
          looking for.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="relative w-full max-w-6xl mb-10">
        <div className="flex justify-between items-center w-full">
          {stepLabels.map((label, index) => (
            <div className="relative flex-1" key={index}>
              {/* Conditionally render the horizontal line only if it's not the last step */}
              {index !== stepLabels.length - 1 && (
                <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-400 transform -translate-y-1/2 z-0"></div>
              )}
              <div
                style={{ width: "150px" }} // Adjust the width as needed
                className={`relative z-10 h-12 rounded-full flex items-center justify-center font-semibold text-black transition-all duration-500 ease-in-out ${
                  step >= index + 1
                    ? "bg-white shadow-lg border-2 border-indigo-500 transform scale-110"
                    : "bg-gray-200 border-2 border-gray-500"
                }`}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form
        className="w-full max-w-4xl bg-white text-gray-800 p-8 rounded-xl shadow-2xl space-y-8 transform transition-all duration-500"
        onSubmit={handleSubmit}
      >
        {/* Alerts */}
        {alert && (
          <div
            className={`p-4 mb-4 text-white rounded ${
              alert.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="property_category_type"
              >
                Property Category Type<span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="property_category_type"
                value={formData.property_category_type}
                onChange={handleChanges}
                required
              >
                <option value="" disabled>
                  Select Category Type
                </option>
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="address"
              >
                Address<span className="text-red-500">*</span>
              </label>
              <Autocomplete
                onLoad={onAutocompleteLoad}
                onPlaceChanged={handlePlaceSelect}
              >
                <input
                  type="text"
                  placeholder="Enter property address"
                  className="input w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                  value={formData.address}
                  onChange={handleChanges} // Using handleChanges for consistency
                  name="address"
                />
              </Autocomplete>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="city_name"
              >
                City<span className="text-red-500">*</span>
              </label>
              <Autocomplete
                onLoad={onAutocitycompleteLoad}
                onPlaceChanged={handlecityPlaceSelect}
                options={{ types: ["(cities)"] }}
              >
                <input
                  type="text"
                  placeholder="Enter city"
                  className="input w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                  value={formData.city_name}
                  onChange={handleChanges} // Using handleChanges for consistency
                  name="city_name"
                />
              </Autocomplete>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="property_type"
              >
                Property Type<span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="property_type"
                value={formData.property_type}
                onChange={handleChanges}
                required
              >
                <option value="" disabled>
                  Select Property Type
                </option>
                {availablePropertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="property_name"
              >
                Property Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="property_name"
                placeholder="Enter Property Name"
                value={formData.property_name}
                onChange={handleChanges}
                required
              />
            </div>

            {/* Latitude Field */}
            {/* <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="latitude"
              >
                Latitude
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="latitude"
                placeholder="Enter Latitude"
                value={formData.latitude}
                onChange={handleChanges}
                required
              />
            </div> */}

            {/* Longitude Field */}
            {/* <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="longitude"
              >
                Longitude
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="longitude"
                placeholder="Enter Longitude"
                value={formData.longitude}
                onChange={handleChanges}
                required
              />
            </div> */}
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="property_description"
              >
                Property Description<span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="property_description"
                placeholder="Enter Property Description"
                value={formData.property_description}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="available_on_date"
              >
                Available On Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="available_on_date"
                value={formData.available_on_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="expiry_date"
              >
                Expiry Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                required
              />
            </div>

            {/* <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="property_added_date"
              >
                Current Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="property_added_date"
                value={formData.property_added_date}
                onChange={handleChange}
                required
              />
            </div> */}
            {/* Category Price Type Select */}
            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="category_price_type"
              >
                Category Price Type<span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="category_price_type"
                value={formData.category_price_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Price Type</option>
                {availablePriceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly Rent Section */}
            <div className="mb-4">
              <div className="flex space-x-4">
                {/* Monthly Rent Section */}
                <div className="w-full">
                  <label
                    className="block text-gray-600 text-sm font-bold mb-2"
                    htmlFor="property_price"
                  >
                    {isSell ? "Property Price" : "Monthly Rent"}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                    name="property_price"
                    placeholder="Enter Property Price"
                    value={formData.property_price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            {/* Safety Deposit Section */}

            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="safety_deposit"
              >
                Safety Deposit
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="safety_deposit"
                placeholder="Enter Safety Deposit"
                value={formData.safety_deposit}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        {/* Step 3  */}
        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BHK Type */}
            {/* Show BHK Type only if the property type is not 'Plot' and 'Commercial' */}
            {formData.property_type !== "Plot" &&
              formData.property_category_type !== "Commercial" && (
                <div className="mb-4">
                  <label
                    className="block text-gray-600 text-sm font-bold mb-2"
                    htmlFor="bhk_type"
                  >
                    BHK Type<span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                    name="bhk_type"
                    value={formData.bhk_type}
                    onChange={handleChange}
                    required={
                      formData.property_category_type === "Residential" &&
                      formData.property_type !== "Plot"
                    }
                  >
                    <option value="">Select BHK Type</option>
                    <option value="Single Room">Single Room</option>
                    <option value="1 RK">1 RK</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="3 BHK+">3 BHK+</option>
                  </select>
                </div>
              )}

            {/* Units */}
            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="units"
              >
                Units<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="units"
                value={formData.units}
                onChange={handleChange}
                required
              />
            </div>

            {/* Area in sq.ft */}
            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="area_sq"
              >
                Area (sq.ft)<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="area_sq"
                value={formData.area_sq}
                onChange={handleChange}
                required
              />
            </div>

            {/* Security */}
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-bold mb-2">
                Security<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="security"
                    value="Yes"
                    checked={formData.security === "Yes"}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-indigo-600 transition-all duration-300"
                  />
                  <span className="ml-2 text-gray-800">Yes</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="security"
                    value="No"
                    checked={formData.security === "No"}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-indigo-600 transition-all duration-300"
                  />
                  <span className="ml-2 text-gray-800">No</span>
                </label>
              </div>
            </div>

            {/* Furnished Type */}
            {formData.property_type !== "Plot" && (
              <div className="mb-4">
                <label
                  className="block text-gray-600 text-sm font-bold mb-2"
                  htmlFor="furnished_type"
                >
                  Furnished Type<span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                  name="furnished_type"
                  value={formData.furnished_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Furnished Type</option>
                  <option value="Furnished">Furnished</option>
                  <option value="UnFurnished">UnFurnished</option>
                  <option value="SemiFurnished">SemiFurnished</option>
                </select>
              </div>
            )}

            {/* Hide these fields if Commercial is selected */}
            {isResidential ||
              (formData.property_type !== "Plot" && (
                <>
                  {/* Bathroom Type */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-600 text-sm font-bold mb-2"
                      htmlFor="bathroom_type"
                    >
                      Bathroom Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                      name="bathroom_type"
                      value={formData.bathroom_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Bathroom Type</option>
                      <option value="Combine">Combine</option>
                      <option value="Separate">Separate</option>
                    </select>
                  </div>
                </>
              ))}

            {/* Total Floor */}
            {formData.property_type !== "Plot" && (
              <div className="mb-4">
                <label
                  className="block text-gray-600 text-sm font-bold mb-2"
                  htmlFor="total_floor"
                >
                  Total Floor<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                  name="total_floor"
                  value={formData.total_floor}
                  onChange={handleChange}
                  required={formData.property_type !== "Plot"}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 4 (More Details) */}
        {step === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Floor */}
            {formData.property_type !== "Plot" && (
              <div className="mb-4">
                <label
                  className="block text-gray-600 text-sm font-bold mb-2"
                  htmlFor="property_floor"
                >
                  Property Floor<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                  name="property_floor"
                  value={formData.property_floor}
                  onChange={handleChange}
                  required={formData.property_type !== "Plot"}
                />
              </div>
            )}

            {/* Mark as Featured */}

            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-bold mb-2">
                Mark as Featured<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="mark_as_featured"
                    value="Yes"
                    checked={formData.mark_as_featured === "Yes"}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-indigo-600 transition-all duration-300"
                  />
                  <span className="ml-2 text-gray-800">Yes</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="mark_as_featured"
                    value="No"
                    checked={formData.mark_as_featured === "No"}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-indigo-600 transition-all duration-300"
                  />
                  <span className="ml-2 text-gray-800">No</span>
                </label>
              </div>
            </div>

            {/* Cover Image */}
            <div className="mb-4">
              <label
                className="block text-gray-600 text-sm font-bold mb-2"
                htmlFor="cover_image"
              >
                Cover Image<span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="cover_image"
                onChange={handleChange}
                required
              />
            </div>

            {/* Hidden Inputs for Connect To Email, Added By Type, Rating */}
            <input
              type="hidden"
              name="connect_to_email"
              value={formData.connect_to_email}
            />
            <input
              type="hidden"
              name="connect_to_name"
              value={formData.connect_to_name}
            />
            <input
              type="hidden"
              name="connect_to_no"
              value={formData.connect_to_no}
            />
            <input type="hidden" name="rating" value={formData.rating} />
            <input
              type="hidden"
              name="added_by_type"
              value={formData.added_by_type}
            />
          </div>
        )}

        {/* Step 5 (Aminities Info) */}
        {step === 5 && (
          <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">
              Select Amenities<span className="text-red-500">*</span>
            </h2>

            {loading ? (
              <p>Loading amenities...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {amenities.length > 0 ? (
                  amenities.map((amenity) => (
                    <div
                      key={amenity._id}
                      className="flex items-center border rounded-lg gap-2  p-3 hover:shadow-md transition duration-200"
                    >
                      <input
                        type="checkbox"
                        value={amenity._id}
                        onChange={() => handleAmenityChange(amenity._id)}
                        checked={selectedAmenities.includes(amenity._id)}
                        className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <img
                        src={`${process.env.REACT_APP_API_URL}${amenity.amenity_icon}`}
                        alt={amenity.amenity_name}
                        className="w-8 h-8 object-cover mr-2"
                      />
                      <label className="text-lg">{amenity.amenity_name}</label>
                    </div>
                  ))
                ) : (
                  <p>No amenities available.</p>
                )}
              </div>
            )}

            {/* Floating "+" button */}
            <button
              type="button"
              onClick={() => setShowModal(true)} // Only opens the modal
              className="fixed top-10 right-10 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-blue-600"
            >
              +
            </button>

            {/* Modal for adding new amenity */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">Add New Amenity</h3>

                  <form onSubmit={handleAddAmenity}>
                    {/* Amenity Name Input */}
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Amenity Name
                      </label>
                      <input
                        type="text"
                        value={newAmenityName}
                        onChange={(e) => setNewAmenityName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>

                    {/* Amenity Image Input */}
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Amenity Icon
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setNewAmenityIcon(e.target.files[0])}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>

                    {/* Error Message */}
                    {addErrorMessage && (
                      <p className="text-red-500 mb-4">{addErrorMessage}</p>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="button" // Change type to "button"
                        onClick={handleAddAmenity} // Call the function directly
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Add Amenity
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 text-red-500">
                <p>{errorMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 5 (Additional Info) */}
        {step === 6 && (
          <div className="mb-4">
            <label
              className="block text-gray-600 text-sm font-bold mb-2"
              htmlFor="property_images"
            >
              Property Images<span className="text-gray-600">(optional)</span>
            </label>

            {/* Multiple Image Upload Input */}
            <input
              className="w-full px-4 py-2 mb-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
              type="file"
              name="property_images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />

            {/* Image Upload Instructions */}
            <p className="text-gray-500 text-xs mt-2">
              Upload up to 5 images. Supported formats: JPG, PNG, GIF. Max size:
              2MB each.
            </p>

            {/* Display Selected Images */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-auto border rounded-lg size-2mb"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          {/* Render your step form based on the current step */}
          {/* {step === 1 && (
            <div>
              <input
                type="text"
                name="field1"
                value={formData.field1}
                onChange={handleInputChange}
                placeholder="Field 1"
                required
              />
            </div>
          )}
          {step === 2 && (
            <div>
              <input
                type="text"
                name="field2"
                value={formData.field2}
                onChange={handleInputChange}
                placeholder="Field 2"
                required
              />
            </div>
          )} */}
          {/* Add forms for other steps as needed */}

          {/* Display error message */}
          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}

          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl"
                onClick={handlePreviousStep}
              >
                Previous
              </button>
            )}

            {/* Handle step 5 Add Image button */}
            {step === 5 ? (
              <button
                type="button" // Change to type="button" to prevent form submission here
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl"
                disabled={loading}
                onClick={handleAddImage}
              >
                {loading ? "Submitting..." : "Add Image"}
              </button>
            ) : (
              // Show the Next button for steps less than 5
              step < 6 && (
                <button
                  type="button"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl"
                  onClick={handleNextStep}
                >
                  Next
                </button>
              )
            )}

            {/* Show Submit button only for Step 6 */}
            {step === 6 && (
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl"
                disabled={loading}
                onClick={handleSubmit} // Function to handle submission in step 6
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </form>
      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-10">
            <h2 className="text-xl font-bold mb-4">Upgrade Your Plan</h2>

            {/* Conditional message based on counts */}
            <p>
              {feature_count === 0 &&
              paid_post_count === 0 &&
              free_post_count === 0
                ? "Please upgrade your plan to continue."
                : feature_count === 0
                  ? "Please purchase the Feature plan to mark as Featured."
                  : paid_post_count === 0 || free_post_count === 0
                    ? "Please upgrade your plan to continue to post property."
                    : ""}
            </p>

            <button
              onClick={() => {
                history.push("/plan");
              }} // Redirect to plan page
              className="mt-4 my-bg text-white py-2 px-4 rounded hover:my-bg mr-4"
            >
              Upgrade Now
            </button>
            <button
              onClick={closeUpgradeModal}
              className="mt-4 border-2 border-gray-600 text-gray-600 rounded py-2 px-4 hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostProperty;
