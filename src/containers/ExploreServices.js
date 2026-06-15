
import { Link } from "react-router-dom";
import React, { useState } from "react";

const ExploreServices = () => {
  const [type, setType] = useState("");

  const services = [
    {
      image: "/image/plots.jpg",
      title: "Modern Residences",
      description: "Beautifully curated residential properties perfect for individuals and families from apartments to villas",
      link: "/property",
      propertyType: "Residential",
      payloadKey: "building_type",
    },
    {
      image: "/image/leasing.jpg",
      title: "Smart Spaces for Business",
      description: "Top commercial spaces for offices, retail, and startups.",
      link: "/property",
      propertyType: "Commercial",
      payloadKey: "building_type",
    },
    {
      image: "/image/commercial.jpg",
      title: "Industrial and Investment Land",
      description: "Warehouses, industrial plots, and raw land - perfect for factories, logistics, or future projects.",
      link: "/property",
      propertyType: "Buy",
      payloadKey: "property_category_type",
    },
    {
      image: "/image/pgpg.jpg",
      title: "PG and Co-living",
      description: "Affordable and community-style living for students and working professionals with shared amenities.",
      link: "/property",
      propertyType: "PG/Co-living",
      payloadKey: "property_category_type",
    }
  ];

  return (
    <div className="bg-white py-8">
      <div className="max-w-9xl mx-auto px-10">
        <h2 className="text-2xl sm:text-4xl text-gray-900">
          Explore our services
        </h2>
        <p className="text-gray-500 text-[18px]">Go from browsing to buying</p>

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