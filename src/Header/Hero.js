import React from "react";
import Slider from "react-slick";
import Alert from "../components/Alert";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Header/Hero.css";


const Hero = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <>
            <section id="how-it-works" className="full-width">
                <div className="container">
                    <h2>Our Categories</h2>
                    <Slider {...settings}>
                        <div className="card">
                            <span className="fas fa-home"></span>
                            <h4>Buy</h4>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        </div>
                        <div className="card">
                            <span className="fas fa-dollar-sign"></span>
                            <h4>Rent</h4>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        </div>
                        <div className="card">
                            <span className="fas fa-chart-line"></span>
                            <h4>Commercial</h4>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        </div>
                        <div className="card">
                            <span className="fas fa-building"></span>
                            <h4>PG</h4>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        </div>
                        <div className="card">
                            <span className="fas fa-tree"></span>
                            <h4>Plot</h4>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        </div>
                    </Slider>
                </div>
            </section>
            <Alert />
        </>
    );
};

export default Hero;