import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

const AllOffers = () => {
  const [offers, setOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const itemsPerPage = 3;
  // const userId = sessionStorage.getItem("accessToken");

  // Fetch offers from API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const formData = new FormData();
        // formData.append("user_id", userId);
        formData.append("page", currentPage);
        formData.append("page_size", itemsPerPage);

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get_offer`,
          formData,
        );
        if (response.data.status === 1 && Array.isArray(response.data.data)) {
          setOffers(response.data.data);
          setTotalPages(response.data.total_pages || 1);
        }
      } catch (error) {
        console.error("Error fetching offered properties:", error);
      }
    };

    fetchOffers();
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Pagination UI logic
  const getPaginationRange = () => {
    const range = [];
    const groupSize = 3;

    const groupStart =
      Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
    const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);

    for (let i = groupStart; i <= groupEnd; i++) {
      range.push(i);
    }

    if (groupEnd < totalPages) {
      range.push("...");
      range.push(totalPages);
    }

    return range;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="bg-white py-4 ml-10 mr-10 rounded-2xl">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          All Offers
        </h2>
      </div>

      {/* Offers List */}
      <div className="grid grid-cols-1 gap-6 pt-6 px-2">
        {offers.map((offer) => (
          <Link
            to={{
              pathname: `/offerdetail/${offer?.property_id}`,
              state: { offer },
            }}
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
                {/* <p className="text-gray-600 text-sm">
                  {offer?.offer_description || "Exclusive discounts on premium properties."}
                </p> */}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Render dynamic pagination numbers */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 
        ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <MdOutlineNavigateBefore className="text-xl text-gray-700" />
          </button>

          {getPaginationRange().map((page, index) => (
            <button
              key={index}
              onClick={() => page !== "..." && handlePageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors 
          ${currentPage === page ? "my-border text-black font-semibold" : "text-gray-700"}`}
            >
              {page === "..." ? "..." : page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
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
