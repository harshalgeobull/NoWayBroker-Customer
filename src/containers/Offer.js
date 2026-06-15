import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

const AllOffers = () => {
  const [offers, setOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1; // Display only one offer at a time

  // Fetch offers from API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const userId = sessionStorage.getItem("user_id") || "";
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get_offer`,
          { user_id: userId },
        );

        if (response.data.status === 1 && Array.isArray(response.data.data)) {
          setOffers(response.data.data);
        } else {
          setOffers([]);
        }
      } catch (error) {
        console.error("Error fetching offered properties:", error);
      }
    };

    fetchOffers();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(offers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleOffers = offers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white py-4 ml-10 mr-10 rounded-2xl">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          All Offers
        </h2>
      </div>

      {/* Offers List */}
      <div className="grid grid-cols-1 gap-6 pt-6 px-2">
        {visibleOffers.map((offer) => (
          <Link
            to={{ pathname: `/offer/${offer?._id || "#"}`, state: { offer } }}
            key={offer?._id}
            className="w-full no-underline hover:no-underline"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={
                  offer?.offer_img
                    ? `${process.env.REACT_APP_API_URL}${offer.offer_img}`
                    : "/image/property-search.jpg"
                }
                alt={offer?.offer_name || "Offer"}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {offer?.offer_name || "Hot Deals, Discount & Offers"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {offer?.offer_description ||
                    "Exclusive discounts on premium properties."}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 
            ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <MdOutlineNavigateBefore className="text-xl text-gray-700" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors 
              ${currentPage === i + 1 ? "my-border text-black font-normal" : "text-gray-700"}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 
            ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <MdOutlineNavigateNext className="text-xl text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AllOffers;
