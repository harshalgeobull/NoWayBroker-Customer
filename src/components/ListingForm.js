import React, { useState } from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
import PropTypes from "prop-types";
import "./listingForm.css"; // Import the external CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const ListingForm = (props) => {
    const [formData, setFormData] = useState({
        sale_type: "For Sale",
        price: "$0+",
        bedrooms: "0+",
        home_type: "House",
        bathrooms: "0+",
        sqft: "1000+",
        days_listed: "Any",
        has_photos: "1+",
        keywords: "",
    });

    const {
        sale_type,
        price,
        bedrooms,
        home_type,
        bathrooms,
        sqft,
        days_listed,
        has_photos,
        keywords,
    } = formData;

    const open_house = "true";
    const [loading, setLoading] = useState(false);

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        setLoading(true);
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/api/listings/search`,
                {
                    sale_type,
                    price,
                    bedrooms,
                    home_type,
                    bathrooms,
                    sqft,
                    days_listed,
                    has_photos,
                    open_house,
                    keywords,
                },
                config
            )
            .then((res) => {
                setLoading(false);
                props.setListings(res.data);
                window.scrollTo(0, 0);
            })
            .catch((err) => {
                setLoading(false);
                window.scrollTo(0, 0);
            });
    };

    return (
        <div className="container">
            {/* <hr className="hr" /> */}
            <div className="search-container">
                <input
                    className="search-input"
                    name="keywords"
                    type="text"
                    placeholder="Search listings by location..."
                    onChange={(e) => onChange(e)}
                    value={keywords}
                />
                <button className="search-button" onClick={onSubmit}>
                    <FontAwesomeIcon icon={faSearch} />
                    <span className="button-text">Search</span>
                </button>
            </div>
            {loading && (
                <div className="loader-container">
                    <Loader
                        type="Oval"
                        color="#ffffff"
                        height={40}
                        width={40}
                    />
                </div>
            )}
            {/* <hr className="hr" /> */}
        </div>
    );
};

ListingForm.propTypes = {
    setListings: PropTypes.func.isRequired,
};

export default ListingForm;








