import React from "react";
import { Link } from "react-router-dom";

const Explore = () => {
  return (
    <section
      className="relative p-4 sm:p-6 lg:p-8 text-white"
      style={{
        backgroundImage: "url('/image/explore_bg1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for Better Text Contrast */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}
      {/* Heading and Description */}
      <div className="text-center mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-white">
          Our Services
        </h1>
        <h2 className="text-lg sm:text-2xl font-semibold my-text mb-4">
          Explore What We Offer
        </h2>
        <p className="text-sm sm:text-base text-white max-w-2xl mx-auto">
          Discover a range of services designed to meet your needs. Whether
          you're looking for property buying, leasing, or more, we have it
          covered.
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* First Row - Three Cards */}
        <Link to="/property" className="block no-underline hover:no-underline">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg flex items-center">
            <img
              src="/image/commercial.jpg"
              alt="Buying Property"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Buying Property
              </h3>
              <p className="text-sm text-gray-600">
                Shops, offices, land, factories, warehouses, and more.
              </p>
            </div>
          </div>
        </Link>

        <Link to="/property" className="block no-underline hover:no-underline">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg flex items-center">
            <img
              src="/image/leasing.jpg"
              alt="Leasing Property"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Leasing Property
              </h3>
              <p className="text-sm text-gray-600">
                Shops, offices, land, factories, warehouses, and more.
              </p>
            </div>
          </div>
        </Link>

        <Link to="/property" className="block no-underline hover:no-underline">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg flex items-center">
            <img
              src="/image/plots.jpg"
              alt="Buy Plots/Land"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Buy Plots/Land
              </h3>
              <p className="text-sm text-gray-600">
                Residential plots, agricultural farm lands, institutional lands,
                and more.
              </p>
            </div>
          </div>
        </Link>
        <Link to="/property" className="block no-underline hover:no-underline">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg flex items-center">
            <img
              src="/image/renting.jpg"
              alt="Renting a Home"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                Renting a Home
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Apartments, builder floors, villas, and more.
              </p>
            </div>
          </div>
        </Link>

        <Link to="/property" className="block no-underline hover:no-underline">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg flex items-center">
            <img
              src="/image/pgpg.jpg"
              alt="PG and Co-Living"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                PG and Co-Living
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Organized, owner and broker listed PGs.
              </p>
            </div>
          </div>
        </Link>

        <Link to="/property" className="block no-underline hover:no-underline">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg flex items-center">
            <img
              src="/image/studiohouse.jpg"
              alt="studio"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                Studio House
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Organized, owner and broker listed Studios.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Explore;
