import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useHistory } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";

const Shots = () => {
  const sliderRef = useRef(null);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [videos, setVideos] = useState([]);
  const accesstoken = sessionStorage.getItem("accessToken");
  const history = useHistory();

  useEffect(() => {
    fetch("http://crm.houzza.in/HouzzaShorts/api/trending_videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "accessToken",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === 1 && Array.isArray(data?.data)) {
          setVideos(data.data);
        }
      })
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  // Slider settings
  const [activeIndexes, setActiveIndexes] = useState({});

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

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffInSeconds = Math.floor((now - updated) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hrs ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const handleClick = () => {
    history.push("/downloadhouzzashots");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-white p-0">
      <div className="max-w-9xl mx-auto  lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 mb-3 px-4">
          <div className="flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 tracking-wide">
              NoWayBroker Shorts
            </h2>
            <p className="text-gray-500">Go from browsing to buying</p>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5 mt-4 sm:mt-0 ml-20">
            <button
              className="bg-white my-text my-border py-2 px-4 sm:px-6 text-sm rounded-lg"
              onClick={handleClick}
            >
              View All Shorts
            </button>

            <button
              className="bg-white text-gray-700 rounded-full text-lg sm:text-2xl font-semibold p-2 shadow-md hover:shadow-lg"
              onClick={() => sliderRef.current.slickPrev()}
            >
              <GoArrowLeft className="text-black text-3xl" />
            </button>

            <button
              className="bg-white text-gray-700 rounded-full text-lg sm:text-2xl font-semibold p-2  shadow-md hover:shadow-lg "
              onClick={() => sliderRef.current.slickNext()}
            >
              <GoArrowRight className="text-black text-3xl" />
            </button>
          </div>
        </div>

        <Slider {...settings} className="slider-container" ref={sliderRef}>
          {videos.map((item, index) => (
            <div key={index} className="px-2">
              {" "}
              {/* Don't use Link as direct child of Slider */}
              <Link to="#">
                <div className="bg-white rounded-3xl shadow-md relative overflow-hidden">
                  <Link to="/downloadhouzzashots">
                    <img
                      src={`http://crm.houzza.in/HouzzaShorts/images/video_thumbnail/${item.video.thumbnail}`}
                      alt={item.video.video_caption || "Video Thumbnail"}
                      className="w-full h-[550px] object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback-image.jpg";
                      }}
                    />
                  </Link>
                  {/* Bottom shadow overlay */}
                  <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-950 via-transparent to-transparent rounded-b-3xl"></div>

                  {/* Overlay Content */}
                  <div className="absolute bottom-4 left-4 flex items-center text-white">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                      <img
                        src={`http://crm.houzza.in/HouzzaShorts/images/video_thumbnail/${item.video.thumbnail}`}
                        alt={item.video.video_caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-xl mb-1">
                        {item.video.city}
                      </p>
                      <p className="text-sm">
                        {getTimeAgo(item.video.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Shots;
