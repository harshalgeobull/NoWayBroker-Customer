import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { SearchContext } from "../containers/SearchContext";

const NavbarSearch = () => {
    const history = useHistory();
    const location = useLocation();

    const { searchCity, setSearchCity } = useContext(SearchContext);

    const [searchQuery, setSearchQuery] = useState(() => {
        return location.pathname === "/searchdashboard"
            ? location.state?.searchQuery || ""
            : "";
    });
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [type, setType] = useState("");
    const [error, setError] = useState("");

    const inputRef = useRef(null);

    useEffect(() => {
        const showSearchBar =
            [
                "/searchdashboard",
                "/property",
                "/advisordashboard",
                "/featuredDashboard",
                "/recommendedpropertiesDashboard",
            ].includes(location.pathname) ||
            location.pathname.startsWith("/citywiseproperties");

        if (!showSearchBar) {
            setSearchCity("");
            setSearchQuery("");
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [location.pathname, setSearchCity]);

    useEffect(() => {
        if (
            location.pathname === "/searchdashboard" &&
            location.state?.searchQuery !== undefined
        ) {
            setSearchQuery(location.state.searchQuery);
        }
    }, [location.pathname, location.state]);

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

    return (
        <div className="relative flex items-center w-full max-w-md">
            <div className="flex items-center w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                <FiSearch className="ml-3 text-gray-500" size={20} />

                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search property, location, BHK..."
                    className="flex-1 px-3 py-2 bg-transparent outline-none"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />

                <button
                    onClick={handleSearch}
                    className="px-4 py-2 text-white rounded-r-lg my-bg hover:opacity-90"
                >
                    Search
                </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-50 mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg top-full max-h-72">
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

            {error && (
                <div className="absolute left-0 text-sm text-red-500 top-full mt-20">
                    {error}
                </div>
            )}
        </div>
    );
};

export default NavbarSearch;