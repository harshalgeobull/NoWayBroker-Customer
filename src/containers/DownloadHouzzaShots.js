import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const DownloadHouzzaShots = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between p-8 lg:p-20 gap-12">
        {/* Left Section - Text and Input */}
        <div className="lg:w-1/2 text-start">
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-snug">
            Download NoWayBroker Shorts
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Get the buzz, the trends, and the talk—jump into the NoWayBroker Shorts
            and vibe with the real estate tribe!
          </p>
          <div className="flex flex-col sm:flex-row items-center mt-6 gap-4">
            {/* Label + Input stacked together */}
            <div className="w-full sm:w-64 flex flex-col">
              <label
                htmlFor="mobileNumber"
                className="block text-gray-700 mb-2"
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
              <button className="my-bg text-white px-6 py-3 rounded-md hover:my-bg transition">
                Send Link
              </button>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <img
              src="https://cdn.grobiz.app/grobiz/cms/media/23/app-store.svg"
              alt="App Store"
              className="w-40 cursor-pointer"
            />
            <img
              src="https://cdn.grobiz.app/grobiz/cms/media/24/play-store.svg"
              alt="Google Play"
              className="w-40 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="/image/download-mobile-app.png"
            alt="Mobile App Preview"
            className="w-80 lg:w-96 rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadHouzzaShots;
