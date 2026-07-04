import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const PropertySearch = () => {
  const [keywords, setKeywords] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Buy");
  const [searchResults, setSearchResults] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const categories = ["Buy", "Sell", "Rent", "Commercial", "PG"];

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSearchResults = useCallback(
    debounce(async (keywords) => {
      if (keywords) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/cust_api/search_location`,
            {
              params: { query: keywords, category: selectedCategory },
            }
          );
          setSearchResults(response.data || []);
          setIsDropdownVisible(
            response.data?.length > 0 || recentProperties.length > 0
          );
        } catch (error) {
          console.error("Error fetching search results:", error);
          setIsDropdownVisible(false);
        }
      } else {
        setSearchResults([]);
        setIsDropdownVisible(recentProperties.length > 0);
      }
    }, 300),
    [selectedCategory, recentProperties]
  );

  const onChange = (e) => {
    const inputValue = e.target.value;
    setKeywords(inputValue);
    fetchSearchResults(inputValue);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setKeywords("");
    setSearchResults([]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(`Searching for ${keywords} in ${selectedCategory}`);
    // Add navigation logic here
  };

  const handlePropertyClick = (propertyId) => {
    console.log(`Redirecting to property details: ${propertyId}`);
    setIsDropdownVisible(false);
  };

  return (
    <section
      className="property-search bg-cover bg-center p-6 md:p-10 lg:p-12 relative mb-10 content-center"
      style={{
        backgroundImage: "url('/image/propertysearchbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "70vh",
      }}
    >
      <div
        className="absolute inset-0 bg-black"
        style={{
          opacity: 0.4, // Add a subtle overlay
        }}
      ></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        {/* Left Side Heading */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 font-sans">
            Find Your Perfect Property
          </h2>
        </div>

        {/* Right Side Grid with Images */}
        <div className="flex flex-wrap justify-start gap-4 md:w-2/5">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div
              key={index}
              className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/5 relative"
            >
              {/* Image with Heading */}
              <div className="w-full h-64 bg-cover bg-center rounded-lg"
                style={{
                  backgroundImage: `url('/image/property${item}.jpg')`, // You can replace the URL with your actual image paths
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                  <h4 className="text-xl font-semibold text-white">Property {item}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
};

export default PropertySearch;
