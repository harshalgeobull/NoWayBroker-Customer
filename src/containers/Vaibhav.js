import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { BiRupee } from "react-icons/bi";

const Vaibhav = () => {
  const locations = [
    {
      id: 1,
      name: "Property 1",
      coordinates: [18.5204, 73.8567],
      price: "5,50,000",
      address: "ABC Street, Pune",
      description: "Something new",
      size: "500 sq ft",
      bhk: "2 BHK",
      city: "pune",
    },
    {
      id: 2,
      name: "Property 2",
      coordinates: [18.5225, 73.8587],
      price: "7,00,000",
      address: "XYZ Street, Pune",
      description: "Brand new apartment",
      size: "650 sq ft",
      bhk: "3 BHK",
      city: "mumbai",
    },
  ];

  const [hoveredProperty, setHoveredProperty] = useState(null);

  const customIcon = new L.Icon({
    iconUrl: "https://img.icons8.com/ios-filled/50/000000/marker.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  const handleMouseEnter = (property) => {
    setHoveredProperty(property);
  };

  const handleMouseLeave = () => {
    setHoveredProperty(null);
  };

  const puneCoordinates = [18.5204, 73.8567];

  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bhkType, setBhkType] = useState("");
  const [furnishedStatus, setFurnishedStatus] = useState("");
  const [area, setArea] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSave = () => {
    console.log("Search:", search);
    console.log("Area:", area);
    console.log("Price Range:", priceRange);
    console.log("Property Type:", propertyType);
    console.log("BHK Type:", bhkType);
    console.log("Furnished Status:", furnishedStatus);
  };

  const resetFilters = () => {
    setSearch("");
    setPropertyType("");
    setBhkType("");
    setFurnishedStatus("");
    setArea("");
    setPriceRange("");
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setShowMoreDropdown(false); // Close the dropdown after selecting an option
  };

  const propertyImages = [
    "/image/property1.jpg", // Image 1
    "/image/property2.jpg", // Image 2
    "/image/property3.jpg", // Image 3
    "/image/property4.jpg", // Image 4
    "/image/property5.jpg",
    "/image/property6.jpg",
    "/image/property7.jpg",
    "/image/property8.jpg",
  ];

  return (
    <div className="flex flex-col p-4 sm:p-6 bg-white shadow-lg rounded-xl space-y-6">
      {/* Search and Filter Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Search Input */}
        <div className="flex-1 sm:w-1/5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for properties..."
            className="w-72 p-1 border-2 border-gray-300 rounded-md shadow-md focus:outline-none hover:bg-gray-300 "
          />
        </div>

        {/* Enter Price Range Input */}
        <div className="flex items-center border-2 border-gray-300 rounded-md shadow-md p-1 hover:bg-gray-300 ">
          {/* Min Price Input */}
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price"
            className="w-20  text-center focus:outline-none"
          />
          <span className="px-1 text-gray-500">-</span>
          {/* Max Price Input */}
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price"
            className="w-20  text-center focus:outline-none"
          />
        </div>

        {/* Property Type Dropdown */}
        <div className="flex-1 sm:w-1/5">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-40 p-1 border-2 border-gray-300 rounded-md shadow-md focus:outline-none hover:bg-gray-300"
          >
            <option value="">Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        {/* BHK Type Dropdown */}
        <div className="flex-1 sm:w-1/5">
          <select
            value={bhkType}
            onChange={(e) => setBhkType(e.target.value)}
            className="w-40 p-1 border-2 border-gray-300 rounded-md shadow-md focus:outline-none hover:bg-gray-300"
          >
            <option value="">BHK Type</option>
            <option value="1 BHK">1 BHK</option>
            <option value="2 BHK">2 BHK</option>
            <option value="3 BHK">3 BHK</option>
            <option value="4+ BHK">4+ BHK</option>
          </select>
        </div>

        {/* Furnished Status Dropdown */}
        <div className="flex-1 sm:w-1/5">
          <select
            value={furnishedStatus}
            onChange={(e) => setFurnishedStatus(e.target.value)}
            className="w-40 p-1 border-2 border-gray-300 rounded-md shadow-md focus:outline-none hover:bg-gray-300"
          >
            <option value="">Furnished</option>
            <option value="Furnished">Furnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="w-auto">
          <button
            onClick={handleSave}
            className="w-40 sm:w-auto p-1 px-2 bg-gray-300 text-black rounded-md shadow-md hover:bg-gray-600 focus:outline-none "
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row-reverse gap-4 border-t border-black">
        {/* Right: Properties */}
        <div className="flex-1 p-4 overflow-y-auto max-h-[80vh] sm:max-h-[85vh] ">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
              <a
                key={index}
                href={`/property/${index + 1}`} // Replace with actual dynamic URL
                className="border-2 rounded-lg overflow-hidden block no-underline hover:no-underline"
              >
                {/* Property Image with Featured Tag */}
                <div className="relative">
                  <img
                    src={propertyImages[index]} // Using the image from the array
                    alt={`Property ${index + 1}`}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />

                  {/* Featured Tag (Top Right Corner) */}
                  <span className="absolute top-2 right-2 my-bg text-white text-xs font-bold py-1 px-2 rounded-full">
                    Featured
                  </span>
                </div>

                {/* Property Description */}
                <div className="p-4  no-underline">
                  <h5 className="text-lg font-semibold text-gray-700 m-0 flex items-center">
                    &#8377; 5,5 CR.
                  </h5>
                  {/* Align Location and Price in a Single Row */}
                  <div className="flex text-gray-600 justify-between">
                    <p className="m-0">
                      <b>2</b>Bhk
                    </p>
                    |<p className="m-0">Pune</p>|
                    <p className="m-0">
                      <b>500</b>sq ft
                    </p>
                  </div>

                  {/* Address Below in Full Width */}

                  <p className="text-gray-600 m-0">
                    Address: <b>ABC Street, Pune</b>
                  </p>
                  <p className="text-gray-600 text-sm m-0">
                    Desc: Something new
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Left: Map */}
        <div className="w-full sm:w-1/2 h-[300px] sm:h-[500px] overflow-hidden rounded-lg shadow-md pt-5">
          <MapContainer
            center={[18.5204, 73.8567]} // Default map center (Pune)
            zoom={12}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Add markers for multiple locations */}
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={location.coordinates}
                icon={customIcon}
                eventHandlers={{
                  mouseover: () => handleMouseEnter(location),
                  mouseout: handleMouseLeave,
                }}
              >
                <Popup>
                  {/* Property Card inside Popup */}
                  <div className="w-[220px] bg-white rounded-lg shadow-md overflow-hidden">
                    <img
                      src={`/image/property${location.id}.jpg`} // Use the corresponding property image
                      alt={location.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="p-1">
                      <div className="flex items-center text-lg font-semibold text-gray-700">
                        <BiRupee className="text-gray-700 mr-1" />
                        <span>{location.price}</span>
                      </div>
                      <div className="text-gray-600 text-sm">
                        <p className="m-0">
                          <strong>{location.bhk}</strong> | {location.city} |{" "}
                          {location.size}
                        </p>
                        <p className="m-0">{location.address}</p>
                      </div>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                        {location.description}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Vaibhav;
