import React from "react";
import Slider from "react-slick";
import { FaHome } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom"; // Use this if you are using React Router

const BHK_MIND = () => {
  // Sample data for the cards
  const cards = [
    { id: 1, title: "Single Room", link: "/property" },
    { id: 1, title: "1 RK", link: "/property" },
    { id: 1, title: "1 BHK", link: "/property" },
    { id: 2, title: "2 BHK", link: "/property" },
    { id: 3, title: "3 BHK", link: "/property" },
    { id: 4, title: "4 BHK", link: "/property" },
    { id: 5, title: "4+ BHK", link: "/property" },
  ];

  // Slider settings
  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
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
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-white">
      {/* Orange Section */}
      <div className="bg-gray-100 py-8 px-4 md:px-12 text-center">
        {/* GIF before Heading */}
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Heading */}

          {/* Image and Subheading */}
          <div className="flex items-center justify-center space-x-4">
            {/* Image */}
            <img
              src="/image/A_minimalistic_and_clean_vector-style_illustration-removebg-preview.png"
              alt="Icon"
              className="w-32 h-32"
            />

            {/* Content (Heading and Subheading) */}
            <div className="flex flex-col items-start">
              {/* Heading */}
              <h2 className="text-2xl font-bold text-black">
                Have a preferred BHK type?
              </h2>

              {/* Subheading */}
              <p className="text-base md:text-xl text-black">
                Explore homes by bedroom number
              </p>
            </div>
          </div>
        </div>

        {/* Card Slider */}
        <div className="relative">
          <div className="bg-gray-100 p-3 md:p-10 rounded-lg w-full">
            <Slider {...settings}>
              {cards.map((card) => (
                <div key={card.id} className="p-4">
                  {/* Pass the title as a query parameter */}
                  <Link
                    to={`/bhkproperties?bhk_type=${encodeURIComponent(
                      card.title
                    )}`}
                    className="no-underline hover:no-underline"
                  >
                    <div className="bg-white p-1 rounded-lg shadow-md border border-gray-200">
                      <div className="flex justify-center">
                        <img
                          src="/image/bhk-removebg-preview.png"
                          alt="Home"
                          className="w-16 h-16"
                        />
                      </div>

                      <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                        {card.title}
                      </h3>

                      <p className="text-gray-600">100 Properties</p>
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BHK_MIND;
// icons8-house-1001.png