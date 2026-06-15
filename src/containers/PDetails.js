import React, { useState, useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import {
  Wifi as WiFiIcon,
  DirectionsBus as DirectionsBusIcon,
  Elevator as ElevatorIcon,
  Pool as PoolIcon,
  Tv as TvIcon,
  AcUnit as AcUnitIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import axios from "axios";

const PDetail = () => {
  const { _id } = useParams();
  const location = useLocation();
  const { property } = location.state || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    name: "",
    email: "",
    contact_number: "",
    message: "",
    time_date: "",
  });
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [amenities, setAmenities] = useState([]);

  const amenityIcons = {
    WiFi: <WiFiIcon />,
    Transport: <DirectionsBusIcon />,
    Elevator: <ElevatorIcon />,
    Pool: <PoolIcon />,
    TV: <TvIcon />,
    "Air Conditioned": <AcUnitIcon />,
  };

  useEffect(() => {
    const fetchAmenities = async () => {
      if (property && property.amenities) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/get_amenity/${property.amenities}`,
          );
          setAmenities(response.data);
        } catch (error) {
          console.error("Error fetching amenities:", error);
        }
      }
    };
    fetchAmenities();
  }, [property]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryData({ ...enquiryData, [name]: value });
  };

  const handleEnquirySubmit = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const userId = sessionStorage.getItem("AccessToken");
    if (!userId) {
      setError("User ID is missing. Please log in again.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("property_id", property?._id);
    formData.append("user_id", userId);
    formData.append("name", enquiryData.name);
    formData.append("email", enquiryData.email);
    formData.append("contact_number", enquiryData.contact_number);
    formData.append("message", enquiryData.message);
    formData.append("time_date", enquiryData.time_date);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_property_enquiry`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setSuccessMessage("Enquiry submitted successfully!");
      // setTimeout(() => {
      //     history.push(`/pdetails/${property._id}`);
      // }, 2000);
    } catch (error) {
      console.error(
        "Error submitting enquiry:",
        error.response ? error.response.data : error.message,
      );
      setError("Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!property) {
    return <div>No property found.</div>;
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Explore Detail Of Property
      </h2>

      <div className="flex justify-center items-center">
        <div className="w-full max-w-5xl">
          <div className="rounded-lg overflow-hidden bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.images && property.images.length > 0 ? (
                property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`property-${index}`}
                    className={`object-cover ${
                      index === 0
                        ? "col-span-2 row-span-2 h-96"
                        : index === 1
                          ? "h-48"
                          : index === 2
                            ? "h-64"
                            : index === 3
                              ? "h-32"
                              : index === 4
                                ? "h-80"
                                : "h-48"
                    } w-full`}
                  />
                ))
              ) : (
                <div>No images available for this property.</div>
              )}
            </div>

            <div className="p-6">
              {property.cover_image ? (
                <img
                  src={property.cover_image}
                  alt="Cover"
                  className="w-full h-64 object-cover mb-4 rounded"
                />
              ) : (
                <div>No cover image available.</div>
              )}
              <h3 className="text-3xl font-semibold mb-2 text-gray-800">
                {property.property_name}
              </h3>
              <p className="text-lg text-gray-600 mb-4">{property.address}</p>
              <p className="text-lg font-bold my-text">
                ${property.property_price}
              </p>

              <div className="mt-4">
                <h4 className="text-xl font-semibold mb-2 text-gray-800">
                  Amenities
                </h4>
                {amenities.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {amenities.map((amenity) => (
                      <div key={amenity._id} className="flex items-center">
                        <span className="mr-2 text-gray-700">
                          {amenityIcons[amenity.name] || amenity.name[0]}
                        </span>
                        <span className="text-gray-700">
                          {amenity.amenity_name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No amenities specified</p>
                )}
              </div>

              <h4 className="text-xl font-semibold mt-4 text-gray-800">
                About Property
              </h4>
              <p className="mt-4 text-sm text-gray-700">
                {property.property_description}
              </p>

              <div className="mt-6">
                <h4 className="text-xl font-semibold mb-2 text-gray-800">
                  Location
                </h4>
                <iframe
                  title="Property Location"
                  className="w-full h-80 border-0"
                  src={`https://maps.google.com/maps?q=${property.address}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                ></iframe>
                <div className="mt-4 text-center">
                  <button
                    className="my-bg text-white px-4 py-2 rounded-full hover:my-bg transition duration-300"
                    onClick={openModal}
                  >
                    Enquire Now
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                  {/* <PersonIcon className="text-gray-600 mr-2" /> */}
                  <span className="text-lg text-gray-700">
                    {property.connect_to_name}
                  </span>

                  {/* <button
                                        className="ml-4 my-bg text-white px-4 py-2 rounded-full hover:my-bg transition duration-300"
                                        onClick={() => alert(`Call Now: ${property.connect_to_no}`)}
                                    >
                                        <PhoneIcon className="text-white mr-2" />
                                        Call No
                                   </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Enquiry Form</h3>
            <form onSubmit={handleEnquirySubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={enquiryData.name}
                onChange={handleInputChange}
                className="border rounded w-full p-2 mb-4"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={enquiryData.email}
                onChange={handleInputChange}
                className="border rounded w-full p-2 mb-4"
                required
              />
              <input
                type="tel"
                name="contact_number"
                placeholder="Your Contact Number"
                value={enquiryData.contact_number}
                onChange={handleInputChange}
                className="border rounded w-full p-2 mb-4"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={enquiryData.message}
                onChange={handleInputChange}
                className="border rounded w-full p-2 mb-4"
              />
              <input
                type="datetime-local"
                name="time_date"
                value={enquiryData.time_date}
                onChange={handleInputChange}
                className="border rounded w-full p-2 mb-4"
              />
              {loading ? (
                <p>Loading...</p>
              ) : (
                <button
                  type="button"
                  className="my-bg text-white px-4 py-2 rounded hover:my-bg transition duration-300"
                  onClick={handleEnquirySubmit}
                >
                  Submit Enquiry
                </button>
              )}
              {error && <p className="text-red-500">{error}</p>}
              {successMessage && (
                <p className="text-green-500">{successMessage}</p>
              )}
            </form>
            <button className="mt-4 text-gray-500" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDetail;
