import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

const TopRatedDevelopers = () => {
  // Static data for top-rated developers
  const developers = [
    {
      id: 1,
      name: "John Doe",
      estDate: "2020",
      image: "/image/dev1.AVIF",
    },
    {
      id: 2,
      name: "Jane Smith",
      estDate: "2015",
      image: "/image/dev2.AVIF",
    },
    {
      id: 3,
      name: "Alice Johnson",
      estDate: "2018",
      image: "/image/dev3.AVIF",
    },
    {
      id: 4,
      name: "Bob Brown",
      estDate: "2012",
      image: "/image/dev4.AVIF",
    },
    {
      id: 5,
      name: "Tob Crown",
      estDate: "2012",
      image: "/image/dev5.AVIF",
    },
  ];

  // Slider settings
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
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gray-100 pb-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-black-500 text-center mb-3">
            Top Developers
          </h2>
          <Link
            to="/alldeveloper"
            className="bg-rose-400 text-white px-4 py-2 rounded-full hover:my-bg transition duration-300"
          >
            View All
          </Link>
        </div>
        <Slider {...settings}>
          {developers.map((developer) => (
            <div key={developer.id} className="p-2">
              <div className="flex items-center rounded-2xl overflow-hidden  transform transition-transform duration-300 hover:scale-105 hover:shadow-xl bg-white">
                <img
                  src={developer.image}
                  alt={developer.name}
                  className="w-1/3 h-full object-cover object-center"
                />
                <div className="w-2/3 p-4 text-left">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {developer.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Est. {developer.estDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TopRatedDevelopers;
