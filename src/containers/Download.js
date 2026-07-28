import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Download = () => {
  const [socialLinks, setSocialLinks] = useState({
    appstore: "#",
    playstore: "#",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cust_api/get_setting`,
        );
        if (response.data.status === 1 && response.data.data.length > 0) {
          const data = response.data.data[0];
          setSocialLinks({
            appstore: data.appstore || "#",
            playstore: data.playstore || "#",
          });
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex flex-col-reverse items-center justify-between gap-12 p-8 lg:flex-row lg:p-20">
        {/* Left Section - Text and Input */}
        <div className="lg:w-1/2 text-start">
          <h1 className="text-3xl font-bold leading-snug text-gray-900 lg:text-5xl">
            Download NoWayBroker Mobile App
          </h1>
          <p className="mt-4 text-lg font-bold my-text ">
            Download our top-rated app, made just for you! <br />
            It’s free, easy, and smart.
          </p>
          <div className="flex flex-col items-center gap-4 mt-6 sm:flex-row">
            {/* Label + Input stacked together */}
            <div className="flex flex-col w-full sm:w-64">
              <label
                htmlFor="mobileNumber"
                className="block mb-2 text-gray-700"
              >
                Enter Mobile Number
              </label>
              <input
                id="mobileNumber"
                type="text"
                placeholder="Enter your mobile number"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-600 focus:outline-none"
              />
            </div>

            {/* Button aligned to the bottom of the label */}
            <div className="flex items-end h-full pt-6 sm:pt-8">
              <button className="px-6 py-3 text-white transition my-bg rounded-md hover:my-bg">
                Send Link
              </button>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <a
              href={socialLinks.appstore}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/image/apl.png"
                alt="App Store"
                className="w-40 cursor-pointer"
              />
            </a>

            <a
              href={socialLinks.playstore}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/image/abc.jpg"
                alt="Google Play"
                className="w-40 cursor-pointer"
              />
            </a>
          </div>
        </div>

        {/* Right Section - Video */}
        <div className="flex justify-center lg:w-3/4">
          <video
            src="/app-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="shadow-lg w-96 lg:w-full lg:h-[425px] rounded-2xl object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default Download;