import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BiRupee } from "react-icons/bi";
import { AiOutlineInfo } from "react-icons/ai";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
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
import { PiShareNetworkLight } from "react-icons/pi";
import { ShareNetwork } from "@phosphor-icons/react";
import { PiCubeFocus } from "react-icons/pi";

const AllProperty = () => {
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

  const toggleSquareFtDropdown = () => {
    setSquareFtDropdownOpen((prev) => !prev);
  };

  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const togglePriceDropdown = () => {
    setPriceDropdownOpen((prev) => !prev);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [propertyImages, setPropertyImages] = useState([]); // Dynamic images
  // const [loadingImages, setLoadingImages] = useState(false);

  const fetchPropertyImages = async (propertyId) => {
    try {
      const formData = new FormData();
      formData.append("property_id", propertyId); // Add propertyId to formData

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_property_images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (response.data.status === 1) {
        setPropertyImages(response.data.data);
        // console.log("Fetched images:", response.data.data);
        setCurrentIndex(0); // Start from the first image
      } else {
        // console.error("No images found for the property.");
      }
    } catch (error) {
      // console.error("Error fetching property images:", error);
    }
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
      
      .custom-marker.active .marker-wrapper .price-tooltip{
         background-color: green;
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
        background-color: white; /* Change to gray on hover */
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

    fetchProperties(label);
  }, [label]);

  const fetchProperties = async (label) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/filter_property`,
        {
          property_listed_by: label,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200 && response.data.status === 1) {
        setProperties(response.data.data); // Storing the fetched properties
      } else {
        // console.log("No properties available");
        setProperties([]);
      }
    } catch (error) {
      setError("Failed to load properties.");
      // console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") return "";

  price = Number(price);

  const formatNumber = (value) =>
    value.toFixed(2).replace(/\.?0+$/, "");

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

  const createCustomIcon = (price, isActive = false) =>
    L.divIcon({
      className: `custom-marker ${isActive ? "active" : ""}`, // Add 'active' class dynamically
      html: `
          <div class="marker-wrapper">
            <div class="price-tooltip">
              ${formatPrice(price)} <!-- Formatted Price -->
              <div class="pointer"></div>
            </div>
          </div>
        `,
      iconSize: [50, 60],
      iconAnchor: [25, 60], // Anchor tooltip above the marker
    });

  // Handle button click
  const handleButtonClick = async () => {
    setError(null);
    setProperties([]);
    // Add async here
    if (filtersApplied) {
      setSearch("");
      setPropertyType("");
      setBhkType("");
      setFurnishedStatus("");
      setMinPrice("");
      setMaxPrice("");
      setMinSquareFt("");
      setMaxSquareFt("");

      fetchProperties(label);
    } else {
      const filters = {
        area: search,
        property_category_type: propertyType,
        bhk_type: bhkType,
        furnished_type: furnishedStatus,
        property_listed_by: label,
        min_price: minPrice,
        max_price: maxPrice,
        min_area: minSquareFt,
        max_area: maxSquareFt,
      };

      try {
        const formData = new FormData();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/filter_property`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        // console.log("Filter response:", response.data); // Log the response

        if (response.status === 200 && response.data.status === 1) {
          setProperties(response.data.data); // Update properties
        } else {
          setProperties([]); // Clear map if no results
        }
      } catch (error) {
        // console.error("Error applying filters:", error);
        setError("Failed to apply filters.");
      }
    }

    setFiltersApplied(!filtersApplied); // Toggle the state
  };

  const toggleFavorite = async (propertyId) => {
    const userId = sessionStorage.getItem("AccessToken");
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
        setIsFavorited(true); // Set heart to filled state
        alert("Property has been saved to your favorites!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/remove_from_favorite`,
          data,
        );
        setIsFavorited(false); // Set heart to unfilled state
        alert("Property has been removed from your favorites!");
      }
    } catch (error) {
      // console.error("Error toggling favorite status:", error);
      alert("Failed to update the property. Please try again.");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination values
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProperties = properties.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="flex flex-col p-1 sm:p-6 bg-rose-50 rounded-xl space-y-4">
      {/* Search and Filter Section */}
      <div className="flex items-center justify-between  flex-wrap gap-4 md:gap-6 lg:gap-8 ml-14">
        {/* Search Input - Left Side */}

        {/* Right Side Fields */}
        <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-6 w-full  md:flex-row flex-col mt-2 ">
          {/* Property Type Dropdown */}
          <div className="w-[200px] ">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full space-x-3 h-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300"
            >
              <option value="">Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Commercial">Commercial</option>
              <option value="Residential">Residential</option>
            </select>
          </div>

          {/* Price Range Button */}
          <div className="relative w-full sm:w-48 md:w-60 lg:w-52 rounded-md">
            <button
              onClick={togglePriceDropdown}
              className="w-full h-16 flex items-center justify-between px-4 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300 bg-white"
            >
              <span>Budget</span>
              <RiArrowDropDownLine className="text-2xl" />
            </button>
            {priceDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full p-4 bg-white border-2 border-gray-300 rounded-md z-10 shadow-lg">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-600">Min Price</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="p-2 border-2 border-gray-300 rounded-md focus:outline-none"
                    placeholder="Min"
                  />
                  <label className="text-sm text-gray-600">Max Price</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="p-2 border-2 border-gray-300 rounded-md focus:outline-none"
                    placeholder="Max"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Furnished Status Dropdown */}
          <div className="w-[200px]  ">
            <select
              value={furnishedStatus}
              onChange={(e) => setFurnishedStatus(e.target.value)}
              className="w-full p-2  h-16 border-2 border-gray-300 rounded-md focus:outline-none hover:bg-gray-300"
            >
              <option value="">Select Furnished </option>
              <option value="Furnished">Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* BHK Type Dropdown */}
          <div className="w-[150px] ">
            <select
              value={bhkType}
              onChange={(e) => setBhkType(e.target.value)}
              className="w-full h-16 p-2 border-2 border-gray-300 rounded-md  focus:outline-none hover:bg-gray-300"
            >
              <option value="">Select BHK</option>
              <option value="Single Room">Single Room</option>
              <option value="1 RK">1 RK</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4+ BHK">4+ BHK</option>
            </select>
          </div>

          {/* Sq. Ft Range Button */}
          <div className="w-full sm:w-1/2 md:w-auto relative">
            <button
              onClick={toggleSquareFtDropdown}
              className="w-[150px] h-16 p-2 border-2 border-gray-300 rounded-md bg-white flex items-center text-end justify-center gap-2 focus:outline-none hover:bg-gray-300"
            >
              <span>sq.Ft</span>
              <RiArrowDropDownLine className="text-2xl " />
            </button>
            {squareFtDropdownOpen && (
              <div className="absolute right-0 mt-2 p-2 bg-white border-2 border-gray-300 rounded-md z-10">
                <label className="text-sm text-gray-600">Min Sq. Ft</label>
                <input
                  type="number"
                  value={minSquareFt}
                  onChange={(e) => setMinSquareFt(e.target.value)}
                  className="w-full p-2 border-2 border-gray-300 rounded-md shadow-md focus:outline-none mb-2"
                  placeholder="Min"
                />
                <label className="text-sm text-gray-600">Max Sq. Ft</label>
                <input
                  type="number"
                  value={maxSquareFt}
                  onChange={(e) => setMaxSquareFt(e.target.value)}
                  className="w-full p-2 border-2 border-gray-300 rounded-md shadow-md focus:outline-none"
                  placeholder="Max"
                />
              </div>
            )}
          </div>

          {/* Apply Filters Button */}
          <div className="flex justify-center gap-6 ml-10">
            <div className="flex justify-center">
              <button
                onClick={handleButtonClick}
                className="p-2 text-rose-700 border-rose-500 rounded-md hover:bg-gray-300 focus:outline-none"
              >
                {filtersApplied ? "Reset Filters" : "Apply Filter"}
              </button>
            </div>
            <div className="flex justify-center mt-1">
              <button className="p-2 border-2 w-40 h-12 border-rose-500 rounded-md hover:bg-gray-300 focus:outline-none">
                Save Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row-reverse bg-white shadow-md border-white ">
        {/* Right: Properties */}

        <div className="flex-1 p-4 shadow-2xl overflow-y-auto h-[650px] sm:max-h-[90vh]  border-white   ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {visibleProperties.length > 0 ? (
              visibleProperties.map((property) => (
                <Link
                  key={property._id}
                  to={`/propertydetails/${property._id}`}
                  className="shadow-md rounded-2xl overflow-hidden block no-underline hover:no-underline"
                >
                  {/* Property Image with Featured Tag */}

                  <div className="relative">
                    <img
                      src={property.cover_image}
                      alt="Property Image"
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />

                    {/* 10 Days NoWayBroker Tag (Top Left) */}
                    <span className="absolute top-2 left-2 bg-gray-800/60 backdrop-blur-sm text-white text-xs font-normal py-1 px-2 rounded-full">
                      10 Days NoWayBroker
                    </span>

                    {/* Virtual Tour & Heart Icon (Top Right) */}
                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                      <span className="bg-gray-800/60 backdrop-blur-sm text-white text-xs font-normal py-1 px-2 rounded-full flex items-center gap-1">
                        <PiCubeFocus className="text-white text-sm" />
                        Virtual Tour
                      </span>
                      <button className="bg-gray-800/60 backdrop-blur-sm text-white text-xs font-normal bg-opacity-50 rounded-full p-1">
                        🤍
                      </button>
                    </div>

                    {/* FOR BUY & FEATURED Tags (Bottom of the Image) */}
                    <div className="absolute bottom-0 left-0">
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-se-lg">
                        FOR BUY
                      </span>
                    </div>
                    <div className="absolute bottom-0 right-0">
                      <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-ss-lg">
                        FEATURED
                      </span>
                    </div>

                    {/* Dots Navigation (Bottom Center) */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    </div>
                  </div>

                  {/* Property Description */}
                  <div className="p-1">
                    {/* Property Name & Share Button */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-800 truncate">
                        {property.property_name}
                      </h3>
                      <PiShareNetworkLight
                        className="text-gray-500 bg-white p-2 rounded shadow cursor-pointer"
                        size={32}
                      />
                    </div>

                    {/* Property Details (Only 3 elements on top) */}
                    <div className="flex flex-wrap items-center text-gray-700 mt-1 gap-4">
                      {/* Price */}
                      <div className="flex items-center gap-1 text-lg font-semibold">
                        <FaRupeeSign className="my-text text-xl" />
                        <span>{property.property_price}</span>
                      </div>

                      {/* BHK Type */}
                      {property.bhk_type && (
                        <div className="flex items-center gap-1">
                          <MdOutlineBedroomParent className="my-text text-xl" />
                          <p className="m-0 font-semibold">
                            {property.bhk_type}
                          </p>
                        </div>
                      )}

                      {/* Area in Sq Ft */}
                      {property.area_sq && (
                        <div className="flex items-center gap-1">
                          <BiArea className="my-text text-xl" />
                          <p className="m-0 font-semibold">
                            {property.area_sq} sq ft
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Furnished/Semi-Furnished - Moved Below */}
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
                    <p className="text-gray-400 text-sm truncate mt-2">
                      <b>{property.address}</b>
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 text-sm truncate mt-2">
                      {property.property_description}
                    </p>

                    {/* Owner Section */}
                    <div className="flex items-center text-gray-700">
                      {/* User Icon */}
                      <div className="bg-blue-100 rounded-full p-1 ml-2">
                        <AiOutlineUser className="text-gray-600 text-xl" />
                      </div>

                      {/* Owner Info */}
                      <div className="flex flex-col ml-3">
                        <span className="text-sm font-semibold">
                          {property.connect_to_name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {property.property_owner_type}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-white">
                <p>No properties available at the moment.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-full  border-2 border-gray-300  ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <MdOutlineNavigateBefore className="text-xl text-gray-700" />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`mx-1 px-3 py-1 rounded-full text-sm ${
                    currentPage === i + 1
                      ? "my-border text-black"
                      : " text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-full  border-2 border-gray-300  ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <MdOutlineNavigateNext className="text-xl text-gray-700" />
              </button>
            </div>
          )}
        </div>

        {/* Left: Map */}
        <div className="w-[560px] w-1/2 h-[600px] sm:h-[630px] overflow-hidden bg-white rounded-lg shadow-md">
          {loading ? (
            <p>Loading properties...</p>
          ) : (
            <MapContainer
              center={
                properties.length > 0
                  ? [properties[0].latitude, properties[0].longitude] // Center the map on the first property
                  : [18.5204, 73.8567] // Default map center (Pune) when no properties are present
              } // Default map center (Pune)
              zoom={12}
              scrollWheelZoom={false}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" />
              {properties.map((property, index) => (
                <Marker
                  key={property._id}
                  position={[property.latitude, property.longitude]}
                  icon={createCustomIcon(
                    property.property_price,
                    property._id === activePropertyId,
                  )}
                  eventHandlers={{
                    click: (e) => {
                      e.target.openPopup(); // Open the popup when the marker is clicked
                      fetchPropertyImages(property._id); // Fetch property images for the clicked marker
                    }, // Open popup on marker click
                  }}
                >
                  <Popup>
                    <div className="w-[300px] relative">
                      {/* Heart Button */}
                      <button
                        className="leaflet-popup-heart-button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent popup from closing
                          toggleFavorite(property._id); // Call the toggle function
                        }}
                      >
                        {isFavorited ? <FaHeart /> : <FaRegHeart />}
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
                          style={{ width: "100%", height: "200px" }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                          }}
                          className="absolute top-1/2 left-1 transform -translate-y-1/2 bg-white p-1 pe-2 rounded"
                        >
                          <b>&#x3008;</b>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                          }}
                          className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-white p-1 ps-2 rounded"
                        >
                          <b>&#x232A;</b>
                        </button>
                      </div>

                      {/* Property Info */}
                      <div className="px-2">
                        <div className="flex items-center justify-between text-lg font-semibold text-black">
                          {/* Price Information */}
                          <div className="flex items-center">
                            <BiRupee className="text-black mr-1 bg-white" />
                            <span>{property.property_price}</span>
                          </div>

                          <Link
                            key={property._id} // Use the unique property ID
                            to={`/propertydetails/${property._id}`} // Link to the individual property page
                            className="border-2 rounded-lg  bg-white overflow-hidden block no-underline hover:no-underline"
                          >
                            {/* Info Button */}
                            <button className="flex items-center text-white rounded-full btn btn-secondary">
                              <b>
                                <AiOutlineInfo />
                              </b>
                            </button>
                          </Link>
                        </div>
                        <div className="text-gray-600 text-sm">
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
  );
};
export default AllProperty;
