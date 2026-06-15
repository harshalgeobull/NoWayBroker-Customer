import React from "react";
import Slider from "react-slick";
import "../styles/CitySlider.css";

const CitySlider = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 400,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const cities = ["Pune", "Mumbai", "Delhi", "Chennai", "Nashik"];

    return (
        <div className="section-city">
             
        <div className="slider-container p-5">
        <h2 className="slider-heading text-center">Location Wise</h2>
            <div className="slider-header">
                <span className="last-searches"></span>
                <button className="see-all-button">See All</button>
            </div>
            <Slider {...settings}>
                {cities.map((city, index) => (
                    <div key={index} className="city-card-wrapper p-3">
                        <div className="city-card">
                            <h2 className="city-name">{city}</h2>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
        </div>
    );
};

export default CitySlider;


