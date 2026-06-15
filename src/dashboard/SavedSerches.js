import { useEffect, useState } from "react";
import { FaDollarSign, FaCog } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaSearch, FaPhoneAlt, FaEnvelope, FaSort } from "react-icons/fa";
import { Heart, Share2, Camera, Home, Ruler } from "lucide-react";
import { FaTrash, FaShareAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import {
  FaHome,
  FaEye,
  FaVideo,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { FiSmartphone } from "react-icons/fi";
import ShareModal from "../containers/ShareModal";

const SavedSerches = () => {
  const [activeTa, setActiveTa] = useState("Buy");
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;
  const user_id = sessionStorage.getItem("accessToken");
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareId, setActiveShareId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSearchId, setSelectedSearchId] = useState(null);

  const tabs = ["Buy", "Rent", "PG", "Commercial"];

  const fetchSavedSearches = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("user_id", user_id);
      formData.append("page", currentPage);
      formData.append("page_size", itemsPerPage);

      // =========================
      //  FIXED PAYLOAD MAPPING
      // =========================

      let payloadKey = "property_category_type";
      let payloadValue = activeTa;

      if (activeTa === "Commercial") {
        payloadKey = "building_type";
        payloadValue = "Commercial";
      } else if (activeTa === "PG") {
        payloadKey = "property_category_type";
        payloadValue = "PG/Co-living"; // MUST match backend
      }

      formData.append(payloadKey, payloadValue);

      // =========================
      //  DEBUG (REMOVE LATER)
      // =========================
      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_save_search`,
        formData,
      );

      if (response.data && response.data.data) {
        setSavedSearches(response.data.data);
        setTotalCount(response.data.total_count);
        setTotalPages(Math.ceil(response.data.total_count / itemsPerPage));
      } else {
        setSavedSearches([]);
        setTotalCount(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching saved searches:", error);
      setSavedSearches([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user_id) {
      fetchSavedSearches();
    }
  }, [currentPage, activeTa]);

  const handleDelete = async (saved_search_id) => {
    try {
      // Create FormData and append saved_search_id
      const formData = new FormData();
      formData.append("saved_search_id", saved_search_id);
      console.log("Deleted ID is:", saved_search_id);

      // Make DELETE request with FormData
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/cust_api/delete_save_search`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        },
      );

      if (response.data.status === 1) {
        toast.success("Saved search deleted successfully!");
        fetchSavedSearches();
      } else {
        toast.error(response.data.message || "Failed to delete saved search.");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting.");
      console.error("Error deleting saved search:", error);
    }
  };

  const openShareModal1 = (url, propertyId) => {
    setCurrentShareUrl(url);
    setActiveShareId(propertyId);
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setActiveShareId(null);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const confirmDelete = () => {
    if (selectedSearchId) {
      handleDelete(selectedSearchId);
      setShowModal(false);
      setSelectedSearchId(null);
    }
  };

  return (
    <>
      <div className="max-w-6xl p-6 mx-auto">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          Saved Searches
        </h2>

        {/* Tabs */}
        <div className="flex space-x-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`pb-2 text-lg font-medium ${
                activeTa === tab
                  ? "my-text border-b-2 border-rose-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTa(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search List */}
        <div className="mt-6 space-y-4">
          {savedSearches.map((search) => (
            <div
              key={search._id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
            >
              <Link
                to={`/propertydetails/${search.property_id}`}
                className="flex-1 no-underline hover:no-underline"
              >
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    <p className="text-lg font-medium text-gray-800">
                      {search.property_name}{" "}
                      {search.address ? ` - ${search.address}` : ""}
                    </p>
                  </p>
                  <p className="text-sm text-gray-500">
                    Saved on:{" "}
                    {new Date(search.saved_on).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>

              <div className="flex ml-4 space-x-3">
                <button className="relative p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <FaShareAlt
                    className="text-gray-600"
                    onClick={() =>
                      openShareModal1(
                        `${window.location.origin}/propertydetails/${search.property_id}`,
                        search.property_id,
                      )
                    }
                  />
                  {isShareModalOpen && activeShareId === search.property_id && (
                    <div className="absolute right-0 z-50">
                      <ShareModal
                        currentShareUrl={currentShareUrl}
                        closeShareModal={handleCloseShareModal}
                        copyLink={() => {
                          const url = currentShareUrl;

                          if (navigator.clipboard && window.isSecureContext) {
                            navigator.clipboard
                              .writeText(url)
                              .then(() => {
                                alert("Link copied!");
                              })
                              .catch((err) => {
                                console.error("Clipboard API failed:", err);
                                fallbackCopyTextToClipboard(url);
                              });
                          } else {
                            fallbackCopyTextToClipboard(url);
                          }

                          function fallbackCopyTextToClipboard(text) {
                            const textArea = document.createElement("textarea");
                            textArea.value = text;
                            textArea.style.position = "fixed"; // Prevent scroll jump
                            textArea.style.left = "-9999px";
                            document.body.appendChild(textArea);
                            textArea.focus();
                            textArea.select();

                            try {
                              const successful = document.execCommand("copy");
                              alert(
                                successful ? "Link copied!" : "Copy failed",
                              );
                            } catch (err) {
                              console.error("Fallback copy failed:", err);
                              alert("Copy failed");
                            }

                            document.body.removeChild(textArea);
                          }
                        }}
                      />
                    </div>
                  )}
                </button>
                <button
                  className="p-2 bg-red-100 rounded-lg hover:bg-red-200"
                  onClick={() => {
                    setSelectedSearchId(search._id);
                    setShowModal(true);
                  }}
                >
                  <FaTrash className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-6 space-x-3">
            <button
              className={`px-3 py-2 border rounded-full ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-medium ${
                  currentPage === index + 1
                    ? "my-border my-text"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className={`px-3 py-2 border rounded-full ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-6 text-center bg-white shadow-lg rounded-2xl w-96">
            {/* Close (X) Icon */}
            <button
              className="absolute text-2xl text-black top-2 right-2"
              onClick={() => setShowModal(false)}
            >
              <IoCloseCircleOutline />
            </button>

            <h2 className="text-2xl font-semibold">Are you sure?</h2>
            <p className="mt-2 text-gray-500">
              You want to delete this save search!
            </p>

            <div className="flex justify-center gap-6 mt-4">
              <button
                className="px-8 py-2 text-white my-bg rounded-md hover:my-bg"
                onClick={confirmDelete}
              >
                Yes
              </button>
              <button
                className="px-8 py-2 text-black bg-white border border-black rounded-md hover:bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default SavedSerches;
