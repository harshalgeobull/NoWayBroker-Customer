import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { useHistory } from "react-router-dom";

const EditProperty = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [coverImage, setCoverImage] = useState("");
  const { _id } = useParams(); // Get property ID from URL
  const userId = sessionStorage.getItem("AccessToken"); // Get user ID from session storage
  const propertyOwnerType = sessionStorage.getItem("property_owner_type");
  const [propertyData, setPropertyData] = useState({
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
    property_added_date: "",
    bhk_type: "",
    units: "",
    area_sq: "",
    security: "No",
    furnished_type: "",
    bathroom_type: "",
    amenities: [],
    total_floor: "",
    property_floor: "",
    mark_as_featured: "",
    cover_image: null,
    admin_approval: "Pending",
    available_status: "Available",
    connect_to_name: "",
    connect_to_no: "",
    connect_to_email: "",
    added_by_type: "",
    category_price_type: "Buy",
    active_status: "Active",
    rating: "0",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const history = useHistory();

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_amenities`,
      );
      setAmenities(response.data.data);
    } catch (error) {
      console.error("Error fetching amenities:", error);
      setError("Failed to fetch amenities.");
    }
  };

  const handleRemoveImage = (index) => {
    setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Remove from selectedImages as well
  };

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!_id) {
        setError("Property ID not found");
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching details for property ID: ${_id}`);
        const requestUrl = `${process.env.REACT_APP_API_URL}/cust_api/get_property_details`;
        const payload = { property_id: _id };
        console.log(`Request URL: ${requestUrl}`);
        console.log(`Payload:`, payload);

        const response = await axios.post(requestUrl, payload);
        console.log("Response data:", response.data); // Log the response data

        // Check if response contains the expected structure
        if (
          response.data.status === 1 &&
          response.data.data &&
          response.data.data.property_details
        ) {
          const fetchedData = response.data.data.property_details;
          const amenityIds = fetchedData.amenities.split(","); // Assuming amenities are stored as comma-separated IDs in response

          setPropertyData((prevState) => ({
            ...prevState, // Preserve previous state
            ...fetchedData,
            amenities: amenityIds, // Add amenities to the fetched data
          }));

          console.log("Fetched property data:", fetchedData); // Log the fetched property data
        } else {
          setError("Failed to fetch property details");
        }
        setLoading(false);
      } catch (err) {
        console.error(
          "Error fetching property details:",
          err.response ? err.response.data : err.message,
        );
        setError(
          err.response
            ? err.response.data.message
            : "Error fetching property details",
        );
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [_id]); // Include _id as a dependency

  // Function to close the modal
  const closeUpgradeModal = () => setIsUpgradeModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData({ ...propertyData, [name]: value });
  };

  // Handle file input changes for images
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file)); // Create a preview URL for the selected file
      setPropertyData({ ...propertyData, cover_image: file }); // Store the file in propertyData
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      setPropertyData((prevData) => ({
        ...prevData,
        amenities: checked
          ? [...prevData.amenities, value]
          : prevData.amenities.filter((amenity) => amenity !== value),
      }));
    } else {
      setPropertyData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Check file sizes and alert if any file is too large
    const tooLarge = files.some((file) => file.size > 2 * 1024 * 1024); // 2MB in bytes
    if (tooLarge) {
      alert("One or more files are too large. Please select files under 2MB.");
      return;
    }

    // Check if adding the selected files will exceed the total image limit (5 images in total)
    if (images && images.length + selectedImages.length >= 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    // Update state with selected images and their previews
    setSelectedImages((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/cust_api/remove_property_image`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ property_image_id: imageId }),
          },
        );

        if (!response.ok) throw new Error("Failed to delete image.");

        fetchImages(); // Refresh images after deletion
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete image. Please try again.");
      }
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("property_id", _id); // Append property_id to formData

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_property_images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type for form data
          },
        },
      );

      setImages(response.data.data); // Set the images array
      setError(""); // Clear any existing error
    } catch (err) {
      console.error("Error fetching property images:", err.response || err);
      setError("There was an error fetching the images.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting property data:", propertyData);

      const formData = new FormData();

      // Append the cover image if it's a valid file
      if (propertyData.cover_image instanceof File) {
        formData.append("cover_image", propertyData.cover_image);
      }

      // Append other property data excluding cover_image
      for (const key in propertyData) {
        if (key !== "cover_image") {
          formData.append(key, propertyData[key]);
        }
      }

      formData.append("property_id", _id);
      formData.append("user_id", userId);

      // Ensure amenities is an array and join it as a string
      const amenitiesArray = Array.isArray(propertyData.amenities)
        ? propertyData.amenities
        : [];
      const amenitiesString = amenitiesArray.join(","); // Convert amenities array to a comma-separated string
      formData.append("amenities", amenitiesString);

      console.log("data:", [...formData.entries()]);

      let currentFreeViewCount,
        currentFreePostCount,
        currentPaidViewCount,
        currentPaidPostCount,
        currentFeatureCount,
        currentOfferCount,
        currentUpcomingProjectCount;

      // Fetch current counts
      const profileResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
        {
          user_id: userId,
        },
      );

      if (profileResponse.data.status === 1) {
        const countData = profileResponse.data.count_data;
        currentFreeViewCount = countData.free_view_count;
        currentFreePostCount = countData.free_post_count;
        currentPaidViewCount = countData.paid_view_count;
        currentPaidPostCount = countData.paid_post_count;
        currentFeatureCount = countData.feature_count;
        currentOfferCount = countData.offer_count;
        currentUpcomingProjectCount = countData.upcoming_project_count;

        if (
          propertyData.mark_as_featured === "Yes" &&
          currentFeatureCount <= 0
        ) {
          setIsUpgradeModalOpen(true);
          return;
        }

        let newFreePostCount = currentFreePostCount;
        let newPaidPostCount = currentPaidPostCount;
        let newFeatureCount = currentFeatureCount;

        if (propertyData.mark_as_featured === "Yes") {
          newFeatureCount -= 1;
          sessionStorage.setItem("feature_count", newFeatureCount);
        }

        const updateCountResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/add_count`,
          {
            user_id: userId,
            free_view_count: currentFreeViewCount,
            free_post_count: newFreePostCount,
            paid_view_count: currentPaidViewCount,
            paid_post_count: newPaidPostCount,
            feature_count: newFeatureCount,
            offer_count: currentOfferCount,
            upcoming_project_count: currentUpcomingProjectCount,
          },
        );

        if (updateCountResponse.data.status !== 1) {
          alert("Failed to update view count. Please try again.");
          return;
        }
      } else {
        alert("Error retrieving counts. Please try again.");
        return;
      }

      // Proceed with property update after count deduction
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/edit_property`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Update response:", response.data);

      if (response.data.status === 1) {
        alert("Property updated successfully");
        history.push("/postedproperties");
      } else {
        alert("Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Error updating property");
    }

    let uploadSuccess = true;

    // Handle image uploads
    for (let i = 0; i < selectedImages.length; i++) {
      const formData = new FormData();
      formData.append("property_id", _id);
      formData.append("property_image", selectedImages[i]);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/cust_api/add_property_images`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          alert(`Failed to upload image ${i + 1}.`);
          uploadSuccess = false;
          break; // Stop the loop if an upload fails
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        uploadSuccess = false;
        break; // Stop the loop if there's an error
      }
    }

    if (uploadSuccess) {
      console.log("Images uploaded successfully!");
      setPreviewImages([]);
      setSelectedImages([]);
      fetchImages(); // Fetch updated images after successful upload
    } else {
      setError("Some images failed to upload!");
    }
  };

  // Fetch property data for editing
  useEffect(() => {
    const fetchPropertyData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/get_property_details/${_id}`,
      );
      const data = await response.json();

      setPropertyData(data);

      // Set the existing cover image URL when property data is fetched
      if (data.cover_image) {
        setCoverImage(`${process.env.REACT_APP_API_URL}${data.cover_image}`); // Prepend server URL
      }
    };

    if (_id) {
      fetchPropertyData();
      fetchImages();
    }
  }, [_id]);

  // Set the existing cover image URL when property data is fetched
  useEffect(() => {
    if (propertyData.cover_image) {
      setCoverImage(`${propertyData.cover_image}`);
    }
  }, [propertyData]);

  // Determine which image to show: the selected file or the existing cover image
  const displayImage = selectedFile || coverImage;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Edit Property</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-2">
          {/* Left Column */}
          <div className="w-full md:w-1/2 px-2">
            <div className="mb-4">
              <label className="block text-sm font-medium">Property Name</label>
              <input
                type="text"
                name="property_name"
                value={propertyData.property_name || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Property Category Type
              </label>
              <select
                name="property_category_type"
                value={propertyData.property_category_type || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="">Select a category</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* <div className="mb-4">
                <label className="block text-sm font-medium">Property Owner Type</label>
                <select
                    name="property_owner_type"
                    value={propertyData.property_owner_type || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                >
                    <option value="">Select an owner type</option>
                    <option value="Owner">Owner</option>
                    <option value="Developer">Developer</option>
                    <option value="Broker">Broker</option>
                </select>
            </div> */}

            <div className="mb-4">
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={propertyData.address || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">City Name</label>
              <input
                type="text"
                name="city_name"
                value={propertyData.city_name || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">BHK Type</label>
              <select
                name="bhk_type"
                value={propertyData.bhk_type || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
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

            <div className="mb-4">
              <label className="block text-sm font-medium">Area (sqft)</label>
              <input
                type="number"
                name="area_sq"
                value={propertyData.area_sq || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>
            {/* <div className="mb-4">
                    <label className="block text-sm font-medium">Added By Type</label>
                    <input
                        type="text"
                        name="added_by_type"
                        value={propertyData.added_by_type || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                </div> */}

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Category Price Type
              </label>
              <input
                type="text"
                name="category_price_type"
                value={propertyData.category_price_type || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Active Status</label>
              <select
                name="active_status"
                value={propertyData.active_status || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="">Select Active Status</option>
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Available Status
              </label>
              <select
                name="available_status"
                value={propertyData.available_status || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
                readOnly
              >
                <option value="">Select Available Status</option>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Security</label>
              <select
                name="security"
                value={propertyData.security || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="">Select Security</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Rating</label>
              <input
                type="text"
                name="rating"
                value={propertyData.rating || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Mark As Featured
              </label>
              <select
                name="mark_as_featured"
                value={propertyData.mark_as_featured || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <h3 className="text-lg font-semibold mt-4 mb-2">More Images</h3>
            <div className="flex overflow-x-auto space-x-4 mb-4">
              {images && images.length > 0 ? (
                images.map((image, index) => (
                  <div
                    key={index}
                    className="relative border rounded-lg w-36 h-36"
                  >
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image._id)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-800"
                      aria-label="Delete image"
                      title="Delete image"
                    >
                      <FaTrashAlt size={15} />
                    </button>
                    <img
                      src={`${process.env.REACT_APP_API_URL}${image.image}`}
                      alt={`Property Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <p>No images available for this property.</p>
              )}
            </div>
            <div className="mb-4">
              <input
                type="file"
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="property_image"
                onChange={handleImageChange}
                multiple
                accept="image/*"
              />
            </div>
            {/* Preview of Selected New Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {previewImages && previewImages.length > 0 ? (
                previewImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative border rounded-lg w-36 h-36 overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Preview Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      X
                    </button>
                  </div>
                ))
              ) : (
                <p>No images selected yet.</p>
              )}
            </div>
          </div>
          {/* Right Column */}
          <div className="w-full md:w-1/2 px-2">
            {propertyData.property_category_type === "Residential" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Furnished Type
                  </label>
                  <select
                    name="furnished_type"
                    value={propertyData.furnished_type || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  >
                    <option value="">Select Furnished Type</option>
                    <option value="Furnished">Furnished</option>
                    <option value="UnFurnished">UnFurnished</option>
                    <option value="SemiFurnished">SemiFurnished</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Bathroom Type
                  </label>
                  <select
                    name="bathroom_type"
                    value={propertyData.bathroom_type || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  >
                    <option value="">Select Bathroom Type</option>
                    <option value="Combine">Combine</option>
                    <option value="Separate">Separate</option>
                  </select>
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium">Total Floor</label>
              <input
                type="number"
                name="total_floor"
                value={propertyData.total_floor || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Property Floor
              </label>
              <input
                type="number"
                name="property_floor"
                value={propertyData.property_floor || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                {propertyData.category_price_type === "Sell"
                  ? "Property Price"
                  : "Monthly Rent"}
              </label>
              <input
                type="text"
                name="property_price"
                value={propertyData.property_price || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            {(propertyData.category_price_type === "Rent" ||
              propertyData.category_price_type === "PG") && (
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Safety Deposit
                  </label>
                  <input
                    type="text"
                    name="safety_deposit"
                    value={propertyData.safety_deposit || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </div>
              )}

            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="property_description"
                value={propertyData.property_description || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={propertyData.latitude || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={propertyData.longitude || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Available On Date
              </label>
              <input
                type="date"
                name="available_on_date"
                value={propertyData.available_on_date || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Expiry Date</label>
              <input
                type="date"
                name="expiry_date"
                value={propertyData.expiry_date || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Admin Approval
              </label>

              <div className="inline-flex items-center bg-[#2DBE3F] text-white rounded-md px-3 py-2 shadow-sm">
                {/* Tick */}
                <span className="mr-2 text-sm font-bold">✓</span>

                {/* Text */}
                <span className="text-sm font-semibold">
                  {propertyData.admin_approval === "Approved"
                    ? "Verified"
                    : propertyData.admin_approval || "Pending"}
                </span>

                {/* Info Icon */}
                <span className="ml-2 flex items-center justify-center w-4 h-4 rounded-full border border-white text-[10px] font-bold">
                  i
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Cover Image</label>

              {/* Preview the existing cover image or the newly selected file */}
              {(displayImage || coverImage) && (
                <div className="mb-2">
                  <img
                    src={displayImage || coverImage} // Show either the selected file or existing cover image
                    alt="Cover Preview"
                    className="w-32 h-a32 mb-2 rounded-md"
                  />
                </div>
              )}

              {/* File input for cover image upload */}
              <input
                type="file"
                className="w-full px-4 py-2 border-2 border-indigo-400 rounded-xl focus:outline-none focus:border-indigo-600 transition-all duration-300"
                name="cover_image"
                onChange={handleFileChange} // Handle file selection
                required={propertyData.cover_image instanceof File} // Required if a new file is selected
              />

              {/* Button to trigger upload */}
            </div>
          </div>{" "}
        </div>
        {/* Amenities */}
        <div className="col-md-12">
          <label>Select Amenities</label>
          <div>
            <div className="container row pt-4">
              {amenities && amenities.length > 0 ? (
                amenities.map((amenity, index) => (
                  <div key={index} className="col-md-3 mb-4">
                    <div className="card border-secondary">
                      <div className="card-body position-relative">
                        {/* Label to include the input checkbox and the name */}
                        <label className="d-flex align-items-center mb-3">
                          <input
                            type="checkbox"
                            value={amenity._id} // Assuming the value should be the amenity ID
                            checked={propertyData.amenities.includes(
                              `${amenity._id}`,
                            )} // Use propertyData instead of formData
                            onChange={handleChange} // Ensure handleChange is wired up correctly
                          />
                          {/* Image and name in a row */}
                          <img
                            src={`${process.env.REACT_APP_API_URL}${amenity.amenity_icon}`}
                            alt={amenity.amenity_name}
                            className="rounded mx-2"
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                            }}
                          />
                          <h5
                            className="card-title"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "150px", // Adjust based on your card width
                            }}
                          >
                            {amenity.amenity_name}
                          </h5>
                        </label>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <p>No amenities found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Update Property
        </button>
        {/* Upgrade Modal */}
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Upgrade Your Plan</h2>
              <p>You have to Purchase Plan to Mark as Feature</p>
              <button
                type="button"
                onClick={() => (window.location.href = "/plan")} // Redirect to plan page
                className="mt-4 my-bg text-white py-2 px-4 rounded hover:my-bg"
              >
                Upgrade Now
              </button>
              <button
                onClick={closeUpgradeModal}
                className="mt-4 text-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditProperty;
