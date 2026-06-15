import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";

const AddOffer = ({ onClose }) => {
  const [formData, setFormData] = useState({
    property: [],
    title: "",
    image: "",
    description: "",
  });

  const [properties, setProperties] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const history = useHistory();
  const user_id = sessionStorage.getItem("AccessToken");

  useEffect(() => {
    if (!user_id) {
      history.push("/login");
    }

    const fetchProperties = async () => {
      const formData = new FormData();
      formData.append("user_id", user_id);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get-listing-properties`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.data.status === 1) {
          const approvedProperties = response.data.data.filter(
            (property) => property.admin_approval === "Approved",
          );
          setProperties(approvedProperties);
        } else {
          console.error("Failed to fetch properties:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [user_id, history]);

  const handlePropertySelect = (e) => {
    const selectedProperty = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      property: e.target.checked
        ? [...prevData.property, selectedProperty]
        : prevData.property.filter((property) => property !== selectedProperty),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.property.length === 0) {
      setAlert({
        message: "At least select one property to apply offers to.",
        type: "error",
      });
      setTimeout(() => setAlert({ message: "", type: "" }), 3000);
      return;
    }

    const offerData = new FormData();
    offerData.append("property_id", formData.property.join(","));
    offerData.append("offer_name", formData.title);
    offerData.append("offer_img", formData.image);
    offerData.append("offer_description", formData.description);
    offerData.append("user_id", user_id);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_offer`,
        offerData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data.status === 1) {
        setAlert({ message: "Offer submitted successfully!", type: "success" });
        setFormData({ property: [], title: "", image: "", description: "" });
        setTimeout(() => history.push("/offerproperties"), 2000);
      }

      const updateProfileAndCount = async () => {
        try {
          const profileResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
            {
              user_id: user_id,
            },
          );

          const currentCounts = profileResponse.data.count_data;
          const currentOfferCount =
            parseInt(currentCounts.offer_count, 10) || 0;
          const updatedOfferCount = currentOfferCount - 1;
          const newOfferCount = parseInt(updatedOfferCount, 10) || 0;
          console.log("Updated offer_count:", newOfferCount);

          const updateCountResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/cust_api/add_count`,
            {
              user_id: user_id,
              free_view_count: currentCounts.free_view_count,
              free_post_count: currentCounts.free_post_count,
              paid_view_count: currentCounts.paid_view_count,
              paid_post_count: currentCounts.paid_post_count,
              feature_count: currentCounts.feature_count,
              offer_count: newOfferCount,
              upcoming_project_count: currentCounts.upcoming_project_count,
            },
          );

          if (updateCountResponse.data.status === 1) {
            sessionStorage.setItem("offer_count", newOfferCount);
            onClose();
          }
          if (updateCountResponse.data.status !== 1) {
            console.error("Failed to update offer count");
            onClose();
          }
        } catch (error) {
          console.error("Error updating profile and count:", error.message);
        }
      };

      await updateProfileAndCount();
    } catch (error) {
      console.error("Error submitting offer:", error);
      setAlert({
        message: "Error submitting offer. Please try again.",
        type: "error",
      });
    }

    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <div className="w-1/2 bg-white p-6 border-r border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-center">
          Select Properties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((property) => (
            <div
              key={property._id}
              className="flex items-center bg-gray-100 p-4 rounded-md shadow"
            >
              <input
                type="checkbox"
                id={`property-${property._id}`}
                value={property._id}
                onChange={handlePropertySelect}
                className="mr-2"
              />
              <img
                src={property.cover_image}
                alt={property.property_name}
                className="h-16 w-24 object-cover rounded-md mr-4"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">
                  {property.property_name}
                </h3>
                <p className="text-sm text-gray-600">{property.city_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/2 bg-white p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add New Offer
        </h2>

        {alert.message && (
          <div
            className={`mb-4 p-2 text-white rounded ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}
          >
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Offer Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Enter offer title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Offer Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Offer Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Enter offer description"
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full my-bg text-white py-2 px-4 rounded-md hover:my-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Submit Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOffer;
