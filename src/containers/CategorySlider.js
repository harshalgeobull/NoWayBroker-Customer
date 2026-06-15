import React from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faDollarSign,
  faBuilding,
  faHotel,
  faTree,
} from "@fortawesome/free-solid-svg-icons";

const CardSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
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
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  const cards = [
    { icon: faHome, title: "Buy" },
    { icon: faDollarSign, title: "Rent" },
    { icon: faBuilding, title: "Commercial" },
    { icon: faHotel, title: "PG" },
    { icon: faTree, title: "Plot" },
  ];

  return (
    <div className="section-category">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-black-500">
          Categories
        </h2>
        <div className="slider-container">
          <Slider {...settings}>
            {cards.map((card, index) => (
              <div key={index} className="card-wrapper px-2 sm:px-4">
                <div className="card bg-white rounded-lg p-6 shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                  <FontAwesomeIcon
                    icon={card.icon}
                    size="2x"
                    className="card-icon text-rose-400 mb-4 "
                  />
                  <h4 className="card-title text-lg  text-center">
                    {card.title}
                  </h4>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default CardSlider;
