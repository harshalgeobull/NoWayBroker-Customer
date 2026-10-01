import React, { useEffect, useState, useRef } from "react";
import { useHistory, Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const OffersForYou = ({ data }) => {
  const sliderRef = useRef(null);
  const history = useHistory();
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    if (data && data.status === 1 && Array.isArray(data.data)) {
      setOffers(data.data);
    } else {
      setOffers([]);
    }
  }, [data]);

  // Slider settings
  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    cssEase: "linear",
    centerMode: false,
    centerPadding: "0px",
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
    <>
    <style>
  {`
    .offers-slider .slick-slide {
      margin: 0 !important;
      padding: 0 12px 0 0 !important;
    }

    .offers-slider .slick-slide > div {
      margin: 0 !important;
      padding: 0 !important;
    }

    .offers-slider .slick-list {
      margin: 0 !important;
      padding: 0 !important;
    }

    .offers-slider .slick-track {
      margin: 0 !important;
      padding: 0 !important;
    }

    .offers-slider .slick-slide a {
      display: block !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .offers-slider img {
      display: block !important;
      width: 100% !important;
    }

    /* Keep all offer slides the same height */
    .offers-slider .slick-slide > div {
      height: 100% !important;
    }

    .offers-slider .slick-slide a {
      height: 100% !important;
    }
  `}
</style>

    <div className="bg-white py-4 ml-4 mr-4 sm:ml-10 sm:mr-10 rounded-2xl">
      <div className="flex flex-col sm:flex-row items-center justify-between px-2">
        {/* Title and Subtitle */}
        <div className="flex flex-col sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Hot Deals & Exclusive Offers 
          </h2>
          <p className="text-gray-500 text-md">Limited-time property deals and special savings </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-3 mt-4 sm:mt-0 w-full sm:w-auto">
          {/* Mobile View Button */}
          <button
            className="bg-white text-rose-700 my-border py-2 px-4 sm:px-6 text-sm rounded-lg w-full sm:hidden"
            onClick={() => history.push("/all-offers")}
          >
            View Offers
          </button>

          {/* Desktop View Button */}
          <button
            className="bg-white my-text my-border py-2 px-4 sm:px-6 text-sm rounded-lg hidden sm:block"
            onClick={() => history.push("/all-offers")}
          >
            View All Offers
          </button>

          <button
            className="bg-white text-gray-700 rounded-full text-lg sm:text-2xl font-semibold p-2 shadow-md hover:shadow-lg"
            onClick={() => sliderRef.current.slickPrev()}
          >
            <GoArrowLeft className="text-black text-3xl" />
          </button>

          <button
            className="bg-white text-gray-700 rounded-full text-lg sm:text-2xl font-semibold p-2 shadow-md hover:shadow-lg"
            onClick={() => sliderRef.current.slickNext()}
          >
            <GoArrowRight className="text-black text-3xl" />
          </button>
        </div>
      </div>

      <div className="pt-6 px-0 overflow-hidden">
        {/* <Slider ref={sliderRef} {...settings}> */}
        <Slider
  ref={sliderRef}
  {...settings}
  className="offers-slider"
>
          {offers.map((offer) => (
            <Link
  to={{
    pathname: `/offerdetail/${offer?.property_id || "#"}`,
    state: { offer },
  }}
  key={offer?._id}
  className="w-full no-underline hover:no-underline"
>
              <div className="relative w-full h-64 sm:h-96">
                <img
                  src={
                    offer?.offer_img
                      ? `${process.env.REACT_APP_API_URL}${offer.offer_img}`
                      : "/image/property-search.jpg"
                  }
                  alt={offer?.offer_name || "Project"}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
                <span className="absolute top-2 left-2 bg-gray-600/70 text-white text-xs font-bold py-1 px-2 rounded-full">
                  {offer?.offer_name || "Hot Deals, Discount & Offers"}
                </span>
              </div>
              <div className="w-full bg-[#f5f8fc] p-4 text-gray-800 rounded-b-2xl">
  <h3 className="text-xl font-semibold no-underline hover:no-underline">
    {offer?.offer_name || "Hot Deals, Discount & Offers"}
  </h3>
                {/* <p className="text-md no-underline hover:no-underline">
                  {offer?.offer_description ||
                    "Offers on exclusive properties, Warehouses, Villas, and Independent Houses."}
                </p> */}
              </div>
            </Link>
          ))}
        </Slider>
      </div>
    </div>
    </>
  );
};

export default OffersForYou;
