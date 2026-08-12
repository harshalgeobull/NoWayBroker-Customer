import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Slider from "react-slick";

const Cities = React.memo(({ data }) => {
  const [citiesData, setCitiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  // useEffect(() => {
  //   if (Array.isArray(data.data) && data.data.length > 0) {
  //     setCitiesData(data.data);
  //   } else {
  //     setCitiesData([{ city_name: "Default City", property_count: 0 }]);
  //   }
  // }, [data]);


useEffect(() => {
  if (Array.isArray(data.data) && data.data.length > 0) {
    setCitiesData(data.data);
    setLoading(false);
  } else {
    setCitiesData([]);
    setLoading(true);
  }
}, [data]);

  const cities = useMemo(() => [
    { name: "Mumbai", imageUrl: "/image/mumbai.jpg", properties: "0" },
    { name: "Delhi", imageUrl: "/image/delhi.jpg", properties: "0" },
    { name: "Bengaluru", imageUrl: "/image/banglore.jpg", properties: "0" },
    // {
    //   name: "Bengaluru",
    //   apiName: "Bangalore",
    //   imageUrl: "/image/banglore.jpg",
    //   properties: "0",
    // },
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

  // const handleCityClick = useCallback((cityName) => {
  //   history.push({
  //     pathname: `/citywiseproperties/${encodeURIComponent(cityName)}`
  //   });
  // }, [history]);

 const handleCityClick = useCallback((cityName) => {
  sessionStorage.setItem("selectedCity", cityName);

  history.push({
    pathname: `/citywiseproperties/${encodeURIComponent(cityName)}`
  });
}, [history]);
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1023,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 767,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false },
      },
    ],
  };

  return (
    <section className="px-4 sm:px-6 lg:px-10 pt-2 pb-4 sm:pt-3 sm:pb-5 mx-auto bg-white lg:max-w-full">
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-100">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 lg:text-3xl">
          Explore Real Estate in Popular Indian Cities
        </h1>
        <p className="pb-3 text-sm sm:text-base text-gray-500">Your dream property is just a few clicks away</p>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6">
          {updatedCities.map((city) => (
            <div
              key={city.name}
              className="flex items-center min-w-0 p-3 transition-shadow bg-white cursor-pointer rounded-2xl hover:shadow-lg"
              onClick={() => handleCityClick(city.name)}
            >
              <div className="flex-shrink-0 w-24 h-20 xl:w-32 xl:h-24 2xl:w-36 2xl:h-28">
                <img
                  src={city.imageUrl}
                  alt={city.name}
                  className="object-cover w-full h-full rounded-xl"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0 ml-3 xl:ml-4">
                <h3 className="mb-0 text-sm xl:text-base font-medium text-gray-800 truncate">
                  {city.name}
                </h3>
                <p className="text-xs xl:text-sm text-gray-600 truncate">
                  {loading ? "Loading..." : `${city.properties} properties`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile / Tablet Slider */}
        <div className="block lg:hidden">
          <Slider {...sliderSettings}>
            {updatedCities.map((city) => (
              <div key={city.name} className="px-1.5 sm:px-2">
                <div
                  className="flex flex-col items-center h-full p-3 sm:p-4 transition-shadow bg-white rounded-lg cursor-pointer hover:shadow-lg"
                  onClick={() => handleCityClick(city.name)}
                >
                  <div className="w-full h-32 sm:h-40 mb-3 sm:mb-4 overflow-hidden">
                    <img
                      src={city.imageUrl}
                      alt={city.name}
                      className="object-cover w-full h-full rounded-t-lg"
                      loading="lazy"
                    />
                  </div>
                  <div className="w-full text-center min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                      {city.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {loading ? "Loading..." : `${city.properties} properties`}
                    </p>
                  </div>
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