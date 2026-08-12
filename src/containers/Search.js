// import React, { useState } from "react";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaCity,
  FaPlus,
  FaPlusCircle,
  FaMapMarkerAlt,
  FaHome,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { MdOutlineAddLocation, MdMyLocation } from "react-icons/md";
import { RiHomeLine } from "react-icons/ri";
// import { useContext } from "react";
import { SearchContext } from "./SearchContext";

// Shared tab config — every tab is rendered from this single list so all
// tabs share the exact same markup, classes, and animation behavior.
const NAV_TABS = [
  { label: "BUY", key: "Buy", type: "Buy" },
  { label: "RENT", key: "Rent", type: "Rent" },
  { label: "PG", key: "PG", type: "PG/Co-living" },
  { label: "Plots/Land", key: "Plot", type: "Plot/Land" },
  { label: "COMMERCIAL", key: "Commercial", type: "Commercial" },
];

const Search = () => {
  const history = useHistory();
  const { searchCity, setSearchCity } = useContext(SearchContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const GOOGLE_MAPS_API_KEY = "AIzaSyAt8bj4UACvakZfiSy-0c1o_ivfplm7jEU";
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // ==========================================================
  // Shared nav-tab hover indicator.
  // No tab is "active" by default — the underline only appears
  // while the cursor is actually over a tab, and it fades out
  // (not snaps to another tab) once the cursor leaves the row.
  // ==========================================================
  const tabRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const moveIndicator = (key) => {
    const el = tabRefs.current[key];
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
    }
  };

  const handleTabMouseEnter = (key) => moveIndicator(key);
  const handleTabRowMouseLeave = () => {
    setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setSearchCity(selectedCity);
  };

  // Rotating placeholder text (cycles every 3s, then repeats)
  const placeholderTexts = [
    "Search by City or Locality...",
    "Search Properties by Location",
    "Enter City, Area",
    'Search "Pune"',
    'Search "Mumbai"',
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 3000);

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleNearMeSearch = async (e) => {
    e.preventDefault();

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoadingLocation(true);
    setError("");

    // Request the user's current location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          // Reverse Geocoding using Google Maps API
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`);
          const data = await response.json();

          setIsLoadingLocation(false);

          if (data.status === "OK" && data.results.length > 0) {
            let detectedCity = "";

            // Find 'locality' (City Name) in the address components
            const addressComponents = data.results[0].address_components;
            for (let component of addressComponents) {
              if (component.types.includes("locality")) {
                detectedCity = component.long_name;
                break;
              }
            }

            if (detectedCity) {
              sessionStorage.setItem("cityName", detectedCity);
              // Redirect to dashboard with the detected city
              setSearchCity(detectedCity);
              history.push({
                pathname: "/searchdashboard",
                state: {
                  searchCity: detectedCity,
                  searchQuery: "",
                  type: type,
                },
              });
            } else {
              setError("Unable to detect your city. Please enter it manually.");
            }
          } else {
            setError("Failed to fetch city details from your location.");
          }
        } catch (error) {
          setIsLoadingLocation(false);
          setError("Network error. Please try again.");
        }
      },
      (err) => {
        setIsLoadingLocation(false);
        if (err.code === 1) {
          setError("Please allow location access to use the 'Near Me' feature.");
        } else {
          setError("Could not retrieve your location. Please try again.");
        }
      }
    );
  };
  const handleSearchChange = async (e) => {
    const value = e.target.value;

    setSearchQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/search_suggestions`,
        {
          query: value,
        }
      );

      if (response.data.status === 1) {
        setSuggestions(response.data.data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    if (!searchQuery && !searchCity && !type) {
      setError("Please enter what you're looking for.");
      return;
    }

    setError("");
    history.push({
      pathname: "/searchdashboard",
      state: {
        searchCity,
        searchQuery,
        type,
      },
    });
  };

  // useEffect(() => {
  //   const loadGoogleMapsScript = () => {
  //     if (window.google && window.google.maps) {
  //       initAutocomplete();
  //       return;
  //     }

  //     const script = document.createElement("script");
  //     script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  //     script.async = true;
  //     script.defer = true;

  //     script.onload = () => {
  //       initAutocomplete();
  //     };

  //     document.body.appendChild(script);
  //   };

  //   const initAutocomplete = () => {
  //     const autocomplete = new window.google.maps.places.Autocomplete(
  //       inputRef.current,
  //       {
  //         types: ["(cities)"],
  //         componentRestrictions: { country: "in" },
  //       },
  //     );

  //     autocomplete.addListener("place_changed", () => {
  //       const place = autocomplete.getPlace();

  //       if (place && place.name) {
  //         setSearchQuery(place.name);
  //         setSearchCity(place.name);
  //       }
  //     });
  //   };

  //   loadGoogleMapsScript();
  // }, []);
  // useEffect(() => {
  //   if (!window.google) return;

  //   const autocomplete = new window.google.maps.places.Autocomplete(
  //     inputRef.current,
  //     {
  //       types: ["(cities)"],
  //       componentRestrictions: { country: "in" },
  //     },
  //   );

  //   autocomplete.addListener("place_changed", () => {
  //     const place = autocomplete.getPlace();

  //     if (place && place.name) {
  //       setSearchQuery(place.name);
  //       setSearchCity(place.name);
  //     }
  //   });
  // }, []);
  console.log(suggestions);
  return (
    <div className="relative flex items-center justify-center m-3 bg-white min-h-[200px] py-9 sm:py-18">
      <div
        className="absolute top-0 bottom-0 left-0 right-0 w-full h-full bg-center bg-cover rounded-3xl sm:rounded-3xl"
        style={{
          backgroundImage: "url('/image/modern.jpg')",
        }}
      ></div>

      <div className="relative w-full max-w-6xl p-2 bg-transparent rounded-3xl mx-auto sm:p-6">
        {/* Heading Section */}
        <div className="mb-6 text-center sm:mb-11">
          <h1 className="text-2xl font-semibold tracking-widest text-white sm:text-2xl lg:text-3xl">
            Let's find your home
            <br />
            that's perfect for you
          </h1>
        </div>

        {/* Search Form */}
        {/* Row 1 — Property Tabs & Search Form */}
        <div className="flex flex-col w-full bg-white rounded-2xl shadow-lg">

          {/* Top Tabs */}
          <div
            className="relative flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-16 text-gray-700 font-semibold tracking-wider border-b border-gray-100 p-3"
            onMouseLeave={handleTabRowMouseLeave}
          >
            {NAV_TABS.map((tab) => (
              <Link
                key={tab.key}
                ref={(el) => {
                  tabRefs.current[tab.key] = el;
                }}
                to={{
  pathname: "/property",
  state: {
    propertyType: tab.type,
    cityName: sessionStorage.getItem("cityName") || "",
  },
}}
                onMouseEnter={() => handleTabMouseEnter(tab.key)}
                className="nav-tab text-lg font-medium tracking-wider text-gray-600 no-underline hover:no-underline"
              >
                {tab.label}
              </Link>
            ))}

            {/* Single shared sliding indicator — this is the ONLY underline.
                Hidden by default, fades in and slides to whichever tab is hovered,
                fades out when the cursor leaves the whole tab row. */}
            <span
              className="nav-tab-indicator hidden sm:block"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                opacity: indicatorStyle.opacity,
              }}
            />
          </div>

          {/* Shared hover styles — identical for every tab, no per-tab overrides,
              no "active" state; color + underline only appear on hover. */}
          <style>{`
            .nav-tab {
              position: relative;
              transition: color 0.3s ease;
            }
            .nav-tab:hover {
              color: #8B1E3F;
            }
            .nav-tab-indicator {
              position: absolute;
              bottom: 6px;
              height: 3px;
              background-color: #8B1E3F;
              opacity: 0;
              transition: left 0.3s ease, width 0.3s ease, opacity 0.2s ease;
            }
          `}</style>

          {/* Bottom Search Inputs (Fixed: Removed duplicate background/shadows) */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center p-3 gap-3 lg:gap-2">

            {/* Search Field + Dropdowns wrapper: stacks on mobile/tablet, row on desktop */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center w-full flex-1 gap-2 md:gap-0 md:divide-x md:divide-gray-100">

              {/* Search Field */}
              <div className="relative flex items-center w-full px-2 py-2 md:py-1 md:pr-1">
                <button
                  type="button"
                  className="p-1 my-text rounded-full focus:outline-none shrink-0"
                >
                  <FiSearch size={22} />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  id="search"
                  placeholder={placeholderTexts[placeholderIndex]}
                  className="w-full min-w-0 px-2 ml-2 text-sm text-gray-600 bg-transparent outline-none border-none sm:text-base"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {suggestions.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                        onClick={() => {
                          setSearchQuery(item.text);
                          setShowSuggestions(false);
                        }}
                      >
                        {item.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* City Dropdown */}
              <div className="flex items-center w-full md:w-[230px] lg:w-[240px] px-2 py-2 md:px-3">
                <MdOutlineAddLocation className="my-text shrink-0" size={20} />
                <select
                  id="city"
                  className="w-full min-w-0 ml-1 text-sm sm:text-base text-gray-600 bg-transparent outline-none border-none cursor-pointer"
                  value={searchCity}
                  onChange={handleCityChange}
                >
                  <option value="">Select a City</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  {/* <option value="Jaipur">Jaipur</option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Surat">Surat</option>
                  <option value="Noida">Noida</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Indore">Indore</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Bhopal">Bhopal</option>
                  <option value="Visakhapatnam">Visakhapatnam</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Patna">Patna</option>
                  <option value="Ranchi">Ranchi</option>
                  <option value="Raipur">Raipur</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                  <option value="Kochi">Kochi</option>
                  <option value="Kanpur">Kanpur</option>
                  <option value="Ludhiana">Ludhiana</option>
                  <option value="Amritsar">Amritsar</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Faridabad">Faridabad</option>
                  <option value="Meerut">Meerut</option>
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Rajkot">Rajkot</option>
                  <option value="Jodhpur">Jodhpur</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Jabalpur">Jabalpur</option> */}
                </select>
              </div>

              {/* Subtle Divider Line */}


              {/* Type Dropdown */}
              <div className="flex items-center w-full md:w-[243px] lg:w-[253px] px-2 py-2 md:px-3">
                <RiHomeLine className="my-text shrink-0" size={18} />

                <select
                  id="type"
                  className="w-full min-w-0 ml-1 text-sm sm:text-base text-gray-600 bg-transparent outline-none border-none cursor-pointer"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Property Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              {/* Near Me Button */}
              <div className="flex items-center justify-center md:justify-start p-2 relative group shrink-0">
                <button
                  onClick={handleNearMeSearch}
                  disabled={isLoadingLocation}
                  type="button"
                  className={`flex items-center justify-center p-2 transition rounded-full focus:outline-none ${isLoadingLocation
                    ? "bg-gray-100 text-gray-400 animate-pulse"
                    : "bg-rose-50 my-text hover:bg-rose-100"
                    }`}
                >
                  <MdMyLocation size={20} />
                </button>

                {/* Tooltip */}
                <div className="absolute right-0 items-center hidden px-3 py-2 text-sm text-[#0f172a] whitespace-nowrap bg-white border border-gray-100 rounded shadow-lg top-12 group-hover:flex z-50">
                  <div className="absolute top-[-5px] right-3 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                  <MdMyLocation size={16} className="mr-1 my-text" /> Search <span className="ml-1 font-bold">Near Me</span>
                </div>
              </div>
            </div>

            {/* Subtle Divider Line (Helps match the clean look of your target image) */}


            {/* Search Button */}
            <button
              className="flex items-center justify-center w-full lg:w-auto gap-2 px-6 py-2.5 text-white transition-all duration-300 my-bg rounded-lg hover:opacity-90 font-medium shrink-0"
              onClick={handleSearch}
            >
              <FiSearch size={20} />
              <span className="inline">Search</span>
            </button>
          </div>
        </div>
        {/* Error Message */}
        {error && (
          <div className="mt-3 text-center">
            <span className="px-4 mt-4 text-sm text-center text-white bg-gray-800 rounded">
              {error}
            </span>
          </div>
        )}

        {/* Suggestions Section */}
        <div className="mt-6 text-center sm:mt-10">
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            <h3
              className="w-full mt-2 sm:w-auto"
              style={{
                fontSize: "1rem",
                color: "rgb(229, 231, 235)",
                marginBottom: "0.5rem",
              }}
            >
              Suggestion:
            </h3>
            {["Ahmedabad", "Bengaluru", "Chennai", "Delhi", "Hyderabad", "Kolkata", "Mumbai", "Pune",].map(
              (location) => (
                <Link
                  key={location}
                  to={`/citywiseproperties/${location}`}
                  className="px-3 py-2 text-sm text-white no-underline rounded-full cursor-pointer bg-gray-900/20 backdrop-blur-sm bg-transparnt/70 bg-opacity-70 hover:bg-gray-600 hover:no-underline"
                >
                  {location}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </div>


  );
};

export default Search;