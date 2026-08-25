
import { Link } from "react-router-dom";
import React, { useState } from "react";

const ExploreServices = () => {
  const [type, setType] = useState("");

  const services = [
    {
      image: "/image/plots.jpg",
      title: "Residential Properties",
      description: "Discover verified apartments, flats, villas, independent houses, and residential properties for sale and rent.",
      link: "/property",
      propertyType: "Residential",
      payloadKey: "building_type",
    },
    {
      image: "/image/leasing.jpg",
      title: "Commercial Properties",
      description: "Find verified shops, offices, showrooms, warehouses, and commercial spaces for your business and investment needs.",
      link: "/property",
      propertyType: "Commercial",
      payloadKey: "building_type",
    },
    {
      image: "/image/commercial.jpg",
      title: "Plots & Land",
      description: "Explore residential, commercial, agricultural, and investment plots with location, size, and ownership details.",
      link: "/property",
      propertyType: "Buy",
      payloadKey: "property_category_type",
    },
    {
      image: "/image/pgpg.jpg",
      title: "PG & Co-Living",
      description: "Find comfortable PGs, shared accommodations, and co-living spaces for students and working professionals.",
      link: "/property",
      propertyType: "PG/Co-living",
      payloadKey: "property_category_type",
    }
  ];

  return (
    <div className="bg-white py-8">
      <div className="max-w-9xl mx-auto px-10">
        <h2 className="text-2xl sm:text-4xl text-gray-900">
          Explore Our Real Estate Services
        </h2>
        <p className="text-gray-500 text-[18px]">Find, buy, rent, sell, and invest in property with confidence</p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 ">
          {services.map((service, index) => (
            <Link
              key={index}
              to={{
                pathname: service.link,
                state: { propertyType: service.propertyType },
              }}
              className="flex items-center bg-white rounded-2xl border border-gray-300 transform hover:scale-105 p-3 no-underline text-gray-800 hover:no-underline"
            >
              {/* Images Section - Left Side */}
              <div className="w-1/3">
                <div className="w-full h-20 mb-2">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Vertical Images */}
                <div className="flex space-x-2">
                  <div className="w-1/2 h-12">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="w-1/2 h-12">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Text Section - Right Side */}
              <div className="ml-4 w-1/2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-base text-gray-600">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreServices;