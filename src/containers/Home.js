import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import RecommendedProperties from "../containers/RecommendedProperties";
import OffersForYou from "../containers/OffersForYou";
import Spotlight from "../containers/Spotlight";
import Adviser from "./Adviser";
import Cities from "./Cities";
import OwnerProperty from "./OwnerProperty";
import ManyMore from "./ManyMore";
import Search from "../containers/Search";
import ExploreServices from "../containers/ExploreServices";
import axios from "axios";
import ShareModal from "../containers/ShareModal";
import BuyProperty from "./BuyProperty";
import Commercial from "./Commercial";
import FeaturesSection from "./FeaturesSection";
const Home = () => {
  const [cityName, setCityName] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const userId = sessionStorage.getItem("accessToken");

  const [homeData, setHomeData] = useState({
    recommendedProperties: [],
    offersForYou: [],
    spotlight: [],
    manyMore: [],
    cities: [],
    adviser: {},
  });

  const [ownerProperties, setOwnerProperties] = useState([]);

  const [buyData, setBuyProperty] = useState({
    status: 0,
    data: [],
  });
  const fetchBuyData = async () => {
    try {
      const formData = new FormData();
      formData.append("page", 1);
      formData.append("page_size", 10);
      formData.append("property_category_type", "Buy");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/filter_property`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("BUY API DATA:", response.data);

      if (response.data.status === 1) {
        setBuyProperty({
          status: 1,
          data: response.data.data || [],
        });
      }
    } catch (error) {
      console.error("Error fetching buy properties:", error);
    }
  };


  const [commercialData, setCommercialData] = useState({
    status: 0,
    data: [],
  });

  const fetchCommercialData = async () => {
    try {
      const formData = new FormData();
      formData.append("page", 1);
      formData.append("page_size", 10);
      formData.append("property_category_type", "Commercial Buy");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/filter_property`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("COMMERCIAL API DATA:", response.data);

      if (response.data.status === 1) {
        setCommercialData({
          status: 1,
          data: response.data.data || [],
        });
      }
    } catch (error) {
      console.error("Error fetching commercial properties:", error);
    }
  };

  useEffect(() => {
    fetchCommercialData();
  }, []);
  useEffect(() => {
    fetchBuyData();
  }, []);
  // Memoized fetchHomeData
  const fetchHomeData = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("city_name", cityName);



      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_home_data`,
        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data) {
        setHomeData({
          recommendedProperties: response.data.featured_properties || [],
          offersForYou: response.data.offers || [],
          spotlight: response.data.projects || [],
          manyMore: response.data.recommended_properties || [],
          cities: response.data.city_property_count || [],
          adviser: response.data.user_type_property_count || {},
        });
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    }
  }, [cityName, userId]);

  const fetchOwnerProperties = async () => {
    try {
      const formData = new FormData();

      formData.append("page", 1);
      formData.append("page_size", 10);
      formData.append("user_type", "Owner");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/filter_property`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 1) {
        // console.log("OWNER API DATA:", response.data.data);
        setOwnerProperties(response.data.data || []);
      }
    } catch (error) {
      console.error("Owner API Error:", error);
    }
  };
  // Geolocation useEffect
  useEffect(() => {
    const storedCityName = sessionStorage.getItem("cityName");
    if (storedCityName) {
      setCityName(storedCityName);
      return;
    }

    if ("geolocation" in navigator) {
      // console.log("Geolocation supported");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // console.log("Location permission granted");

          const { latitude, longitude } = position.coords;

          // console.log("Latitude:", latitude);
          // console.log("Longitude:", longitude);

          sessionStorage.setItem(
            "userLocation",
            JSON.stringify({ latitude, longitude }),
          );

          // Reload page after saving location
          window.location.reload();

          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAUCNwxnNo52kFWJNGhRVj-AnkoffmzYe0`,
            );

            // console.log("Google API Response:", response.data);

            if (response.data.status === "OK") {
              const addressComponents =
                response.data.results[0].address_components;

              // console.log("Address Components:", addressComponents);

              const cityComponent = addressComponents.find((component) =>
                component.types.includes("locality"),
              );

              // console.log("Detected City:", cityComponent);

              if (cityComponent) {
                setCityName(cityComponent.long_name);

                sessionStorage.setItem("cityName", cityComponent.long_name);

                // console.log("Saved city:", sessionStorage.getItem("cityName"));
              }
            }
          } catch (error) {
            console.error("Google API Error:", error);
          }
        },

        (error) => {
          console.error("Geolocation Error:", error);
        },
      );
    } else {
      // console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch home data with debounce
  useEffect(() => {
    // if (!cityName) return;

    const debounceFetch = setTimeout(() => {
      fetchHomeData();
      fetchOwnerProperties();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [cityName, fetchHomeData]); //fetchOwnerProperties]);

  const openRecommendedShareModal = useCallback((propertyId) => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/propertydetails/${propertyId}`;
    setCurrentShareUrl(fullUrl);
    setShowShareModal(true);
  }, []);

  const openSpotlightShareModal = useCallback((projectId) => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/projectdetail/${projectId}`;
    setCurrentShareUrl(fullUrl);
    setShowShareModal(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setShowShareModal(false);
  }, []);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(currentShareUrl);
    alert("Link copied: " + currentShareUrl);
  }, [currentShareUrl]);
  //console.log("ownerProperties", ownerProperties);

  return (
    <>
      <Helmet>
        <title>NOWAYBROKER - Home</title>
        <meta name="description" content="sign up page" />
      </Helmet>


      <section className="">
        <Search />
        <FeaturesSection />

        <div className="w-full mx-auto px-2 space-y-6 md:max-w-[97%]">
          <Cities data={homeData?.cities || []} />


          {/* <Shots /> */}
          <BuyProperty
            data={buyData}
            fetchHomeData={fetchHomeData}
            openRecommendedShareModal={openRecommendedShareModal}
            closeShareModal={closeShareModal}
            copyLink={copyLink}
            currentShareUrl={currentShareUrl}
          />
          <Commercial
            data={commercialData}
            fetchHomeData={fetchHomeData}
            openRecommendedShareModal={openRecommendedShareModal}
            closeShareModal={closeShareModal}
            copyLink={copyLink}
            currentShareUrl={currentShareUrl}
          />
          <OwnerProperty
            data={{
              status: 1,
              data: ownerProperties,
            }}
            openRecommendedShareModal={openRecommendedShareModal}
            closeShareModal={closeShareModal}
            copyLink={copyLink}
            currentShareUrl={currentShareUrl}
            fetchHomeData={fetchHomeData}
          />
          <ManyMore
            data={homeData.manyMore}
            openRecommendedShareModal={openRecommendedShareModal}
            closeShareModal={closeShareModal}
            copyLink={copyLink}
            currentShareUrl={currentShareUrl}
            fetchHomeData={fetchHomeData}
          />
          <Spotlight
            data={homeData.spotlight}
            openSpotlightShareModal={openSpotlightShareModal}
            closeShareModal={closeShareModal}
            copyLink={copyLink}
            currentShareUrl={currentShareUrl}
            fetchHomeData={fetchHomeData}
          />
          <OffersForYou data={homeData.offersForYou} />
          <RecommendedProperties
            data={homeData.recommendedProperties}
            openRecommendedShareModal={openRecommendedShareModal}
            closeShareModal={closeShareModal}
            copyLink={copyLink}
            currentShareUrl={currentShareUrl}
            fetchHomeData={fetchHomeData}
          />
          <Adviser data={homeData.adviser} />
          <ExploreServices />
        </div>

        {showShareModal && (
          <ShareModal
            currentShareUrl={currentShareUrl}
            closeShareModal={closeShareModal}
            copyLink={copyLink}
          />
        )}
      </section>
    </>
  );
};

export default Home;
