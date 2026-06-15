import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card";
import { Helmet } from "react-helmet";
import "../styles/listing.css";

const Listing = () => {
    const [listings, setListings] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchListings = (url) => {
        setLoading(true);
        axios
            .get(url)
            .then((res) => {
                setListings((prevListings) => [...prevListings, ...res.data.results]);
                setNextPage(res.data.next);
                setLoading(false);
                window.scrollTo(0, 0);
            })
            .catch((err) => {
                setLoading(false);
                window.scrollTo(0, 0);
            });
    };

    useEffect(() => {
        fetchListings(`${process.env.REACT_APP_API_URL}/api/listings/`);
    }, []);

    return (
        <>
            <Helmet>
                <title>Real Estate - Properties</title>
                <meta name="description" content="Listing page" />
            </Helmet>
            <div className="container">
                <h1 className="listing-title">Available Properties</h1>
                <div className="row">
                    {listings.map((val, ind) => (
                        <div className="col-md-4" key={ind}>
                            <Card
                                title={val.title}
                                photo_main={val.photo_main}
                                address={val.address}
                                city={val.city}
                                state={val.state}
                                price={val.price}
                                bedrooms={val.bedrooms}
                                bathrooms={val.bathrooms}
                                sale_type={val.sale_type}
                                home_type={val.home_type}
                                sqft={val.sqft}
                                slug={val.slug}
                            />
                        </div>
                    ))}
                </div>
                {nextPage && !loading && (
                    <div className="text-center mt-3">
                        <button onClick={() => fetchListings(nextPage)} className="btn btn-primary load-more-btn">
                            Load More
                        </button>
                    </div>
                )}
                {loading && <p className="loading-text">Loading...</p>}
            </div>
        </>
    );
};

export default Listing;


