import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Slider from "react-slick";

const Cities = React.memo(({ data }) => {
  const [citiesData, setCitiesData] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (Array.isArray(data.data) && data.data.length > 0) {
      setCitiesData(data.data);
    } else {
      setCitiesData([{ city_name: "Default City", property_count: 0 }]);
    }
  }, [data]);

  const cities = useMemo(() => [
    { name: "Mumbai", imageUrl: "/image/mumbai.jpg", properties: "0" },
    { name: "Delhi", imageUrl: "/image/delhi.jpg", properties: "0" },
    { name: "Bangalore", imageUrl: "/image/banglore.jpg", properties: "0" },
    { name: "Chennai", imageUrl: "/image/chennai.jpg", properties: "0" },
    { name: "Hyderabad", imageUrl: "/image/hyderabad.jpg", properties: "0" },
    { name: "Kolkata", imageUrl: "/image/kolkatta.jpg", properties: "0" },
    { name: "Pune", imageUrl: "/image/pune.jpg", properties: "0" },
    { name: "Ahmedabad", imageUrl: "/image/ahemdabad.jpg", properties: "0" },
  ], []);

  const updatedCities = useMemo(() => {
  return cities
    .map((city) => {
      const cityData = citiesData.find(
        (apiCity) => apiCity.city_name === city.name
      );
      return {
        ...city,
        propertyCount: cityData ? cityData.property_count : 0, // keep raw number
        properties: cityData ? `${cityData.property_count}+` : city.properties,
      };
    })
    .sort((a, b) => b.propertyCount - a.propertyCount); // sort descending
}, [cities, citiesData]);

  const handleCityClick = useCallback((cityName) => {
    history.push({
      pathname: `/citywiseproperties/${encodeURIComponent(cityName)}`
    });
  }, [history]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false },
      },
    ],
  };

  return (
    <section className="px-10 py-8 pt-10 mx-auto bg-white lg:max-w-full">
      <div className="p-6 rounded-2xl bg-slate-100">
        <h1 className="text-2xl font-bold text-gray-800 lg:text-3xl">
          Explore Real Estate in Popular Indian Cities
        </h1>
        <p className="pb-3 text-gray-500">Go from browsing to buying</p>

        {/* Desktop Grid */}
        <div className="hidden grid-cols-1 gap-6 lg:grid sm:grid-cols-2 lg:grid-cols-4">
          {updatedCities.map((city) => (
            <div
              key={city.name}
              className="flex items-center p-3 transition-shadow bg-white cursor-pointer rounded-2xl hover:shadow-lg"
              onClick={() => handleCityClick(city.name)}
            >
              <div className="flex-shrink-0 w-36 h-28">
                <img
                  src={city.imageUrl}
                  alt={city.name}
                  className="object-cover w-full h-full rounded-xl"
                  loading="lazy"
                />
              </div>
              <div className="ml-4">
                <h3 className="mb-0 text-sm text-gray-800">{city.name}</h3>
                <p className="text-sm text-gray-600">
                  {city.properties} properties
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="block lg:hidden">
          <Slider {...sliderSettings}>
            {updatedCities.map((city) => (
              <div
                key={city.name}
                className="flex flex-col items-center p-4 transition-shadow bg-white rounded-lg cursor-pointer hover:shadow-lg"
                onClick={() => handleCityClick(city.name)}
              >
                <div className="w-full h-40 mb-4 overflow-hidden">
                  <img
                    src={city.imageUrl}
                    alt={city.name}
                    className="object-cover w-full h-full rounded-t-lg"
                    loading="lazy"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {city.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {city.properties} properties
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
});

export default Cities;
