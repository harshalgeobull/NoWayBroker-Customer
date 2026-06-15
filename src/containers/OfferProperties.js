import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const OfferProperties = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const offerCount = sessionStorage.getItem("offer_count");

  useEffect(() => {
    const accessToken = sessionStorage.getItem("AccessToken");
    if (!accessToken) {
      history.push("/login");
      return;
    }

    const fetchOffers = async () => {
      const formData = new FormData();
      formData.append("user_id", accessToken);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get_offer`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.data && response.data.data.length > 0) {
          setOffers(response.data.data);
        } else {
          setOffers([]);
          setError(false);
        }
      } catch (err) {
        console.error("Error fetching offers:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [history]);

  const handleDelete = (offerId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this offer?",
    );
    if (!isConfirmed) return;

    const accessToken = sessionStorage.getItem("AccessToken");
    const formData = new FormData();
    formData.append("user_id", accessToken);
    formData.append("offer_auto_id", offerId);

    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/cust_api/delete_offer`,
      data: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        if (response.data.status === 1) {
          setOffers((prevOffers) =>
            prevOffers.filter((offer) => offer._id !== offerId),
          );
        } else {
          console.error("Error deleting offer:", response.data.message);
        }
      })
      .catch((err) => {
        console.error("Error deleting offer:", err);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Failed to load offers.</p>;

  return (
    <div className="bg-white p-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Conditional Header and Add Offer Button */}
        {offerCount !== "0" && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-black">Offers</h2>
            <Link to="/addoffer">
              <button className="my-bg text-white px-4 py-2 rounded-md hover:my-bg transition duration-300">
                <FontAwesomeIcon icon={faPlus} className="text-white mr-2" />{" "}
                Add Offer
              </button>
            </Link>
          </div>
        )}

        {/* Display message and upgrade button if offer_count is 0 */}
        {offerCount === "0" ? (
          <div className="text-center text-gray-700 my-10">
            <p className="text-lg">
              To post an offer, please upgrade your plan.
            </p>
            <p className="text-sm mb-4">
              Plan Purchase is required to proceed with offer posting.
            </p>
            <Link to="/plan">
              <button className="my-bg text-white px-4 py-2 rounded-md hover:my-bg transition duration-300">
                Upgrade Plans
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {offers.length > 0 ? (
              offers.map((offer) => (
                <div
                  key={offer._id}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL}${offer.offer_img}`}
                    alt={offer.offer_name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {offer.offer_name.toUpperCase()}
                    </h3>
                    <p className="text-gray-600 mt-2 truncate">
                      {offer.offer_description}
                    </p>
                    <div className="flex items-center mt-2">
                      <p className="font-semibold text-gray-700 mr-2">
                        Status:
                      </p>
                      <p
                        className={`${
                          offer.status === "Success"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {offer.status}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(offer._id)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">
                No offers available at the moment.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferProperties;
