import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { Trash } from "lucide-react";
import { Toast } from "bootstrap";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

const Offer = () => {
  const [projects, setProjects] = useState([]);
  const [offerProjects, setOfferProjects] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showNextModal, setShowNextModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalCount, setTotalCount] = useState(1);
  const itemsPerPage = 10;
  // Use totalPages based on filteredOffers
  const totalPages = Math.ceil(TotalCount / itemsPerPage);
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem("accessToken");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOfferTerm, setSearchOfferTerm] = useState("");
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const history = useHistory();

  // For Edit a Offer -
  const [offerName, setOfferName] = useState("");
  const [offerTime, setOfferTime] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [offerPhoto, setOfferPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // For cretae a new Offer -
  const [createOfferName, setCreateOfferName] = useState("");
  const [createOfferDescription, setCreateOfferDescription] = useState("");
  const [createOfferPhoto, setCreateOfferPhoto] = useState(null);
  const [offerPhotoPreview, setOfferPhotoPreview] = useState(null);
  const [showOfferCountModal, setShowOfferCountModal] = useState(false);
  const [offerCount, setOfferCount] = useState(0);

  useEffect(() => {
    const checkPostLimits = async () => {
      try {
        const profileForm = new FormData();
        profileForm.append("user_id", userId);

        const profileResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
          profileForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        const countData = profileResponse?.data?.count_data;

        if (countData) {
          setOfferCount(countData.offer_count || 0);
        }
      } catch (error) {
        console.error("Error checking post limits:", error);
      }
    };

    if (userId) {
      checkPostLimits();
    }
  }, [userId]);

  const fetchProjects = async () => {
    try {
      const formData2 = new FormData();
      formData2.append("user_id", userId);
      formData2.append("page_size", 999999);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get-listing-properties`,
        formData2,
      );

      if (response.data?.data) {
        setProjects(response.data.data);
        setOfferPhoto(response.data.offer_img);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("page", currentPage);
      formData.append("page_size", itemsPerPage);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_offer`,
        formData,
      );

      if (response.data && response.data.data) {
        setOfferProjects(response.data.data);
        setTotalCount(response.data.total_count || 0);
      } else {
        setOfferProjects([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOffers();
    }
  }, [userId, currentPage]);

  // Filter logic
  useEffect(() => {
    const search = searchOfferTerm.toLowerCase().trim();
    const filtered = offerProjects.filter((offer) => {
      const name = (offer.offer_name || "").toLowerCase();
      const desc = (offer.offer_description || "").toLowerCase();
      return name.includes(search) || desc.includes(search);
    });
    setFilteredOffers(filtered);
    setCurrentPage(1);
  }, [searchOfferTerm, offerProjects]);

  // Paginate filtered results
  const paginatedOffers = filteredOffers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleSelect = (propertyId) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties([]);
      setSelectedProperty({});
    } else {
      const selected = filteredProjects.find((p) => p._id === propertyId);
      setSelectedProperties([propertyId]);
      setSelectedProperty(selected);
    }
  };

  //  Here is for offfer cards -
  const filteredProjects = (projects || []).filter((project) => {
    if (!project || typeof project !== "object") return false;

    const search = String(searchTerm).toLowerCase().trim();
    const title = String(project.property_name).toLowerCase().trim();
    const location = String(project.address).toLowerCase().trim();

    return title.includes(search) || location.includes(search);
  });

  const handlePropertyClick = (project) => {
    setSelectedProperty(project);
    setOfferName(project.offer_name || "");
    setOfferDescription(project.offer_description || "");
    setOfferPhoto(`${process.env.REACT_APP_API_URL}/` + project.offer_img);
    setShowEditModal(true);
    console.log("Project: ", offerPhoto);
  };

  const handleOfferSubmit = async () => {
    if (!userId) {
      toast.error("You must be logged in to create an offer.");
      return;
    }

    if (!offerName || !offerDescription || !selectedProperty?._id) {
      toast.error("Please fill all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", selectedProperty.user_id);
    formData.append("offer_auto_id", selectedProperty._id);
    formData.append("offer_name", offerName);
    formData.append("offer_description", offerDescription);

    if (offerPhoto instanceof File) {
      formData.append("offer_img", offerPhoto);
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/update_offer`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Offer edited successfully!");
        fetchOffers();

        // Clean up
        if (previewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }

        setShowNextModal(false);
        setSelectedProperties([]);
        setOfferName("");
        setOfferDescription("");
        setOfferPhoto(null);
        setPreviewUrl("");
        setTotalCount(data.total_pages || 0);
      } else {
        setTotalCount(0);
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting offer:", error);
      toast.error("Error submitting offer.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOfferPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setOfferPhoto(null);
    setPreviewUrl("");
  };

  // Load existing property data when modal opens
  useEffect(() => {
    if (showEditModal || selectedProperty) {
      setOfferName(selectedProperty.offer_name);
      setOfferDescription(selectedProperty.offer_description);

      const imageUrl = `${process.env.REACT_APP_API_URL}${selectedProperty.offer_img}`;
      setOfferPhoto(imageUrl);
      setPreviewUrl(imageUrl);
    }
  }, [showEditModal, selectedProperty]);

  const handleAddOffer = async () => {
    if (!userId) {
      toast.error("You must be logged in to create an offer.");
      return;
    }

    if (!createOfferName || !createOfferDescription || !selectedProperty?._id) {
      toast.error("Please fill all fields and upload an image.");
      return;
    }

    const formData4 = new FormData();
    formData4.append("user_id", selectedProperty.user_id);
    formData4.append("property_id", selectedProperty._id);
    formData4.append("offer_name", createOfferName);
    formData4.append("offer_description", createOfferDescription);
    formData4.append("offer_img", createOfferPhoto);

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/cust_api/add_offer`,
      {
        method: "POST",
        body: formData4,
      },
    );

    const data = await res.json();
    if (res.ok && data.status === 1) {
      toast.success("Offer created successfully!");
      // Reset state or close modals
      setShowNextModal(false);
      fetchOffers();
      resetOfferFormFields();
      setSelectedProperties([]);
      setSelectedProperty({});
      setCreateOfferName("");
      setCreateOfferDescription("");
      setCreateOfferPhoto(null);
    } else {
      setTotalCount(0);
      toast.error(data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (showModal || showEditModal || showNextModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal, showEditModal, showNextModal]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const resetOfferFormFields = () => {
    setSearchTerm("");
    setCreateOfferName("");
    setCreateOfferDescription("");
    setCreateOfferPhoto(null);
    setSelectedProperty({});
    setSelectedProperties([]);
  };

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">My Offers</h2>

          {/* Search Box in the middle */}
          <div className="relative">
            {/* Search Icon (no onClick) */}
            <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

            {/* Input */}
            <input
              type="text"
              placeholder="Search properties..."
              className="border rounded-lg px-10 py-2 w-full outline-none focus:ring-2 focus:ring-rose-400 pr-10"
              value={searchOfferTerm}
              onChange={(e) => setSearchOfferTerm(e.target.value)}
            />

            {/* Clear Button */}
            {searchOfferTerm && (
              <button
                onClick={() => setSearchOfferTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-900 text-lg"
              >
                <IoMdClose />
              </button>
            )}
          </div>

          <button
            className="my-bg text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => {
              if (offerCount <= 0) {
                setShowOfferCountModal(true);
              } else {
                resetOfferFormFields();
                // Then show modal and fetch projects
                setShowModal(true);
                fetchProjects();
              }
            }}
          >
            Create New Offer
          </button>
        </div>

        {/* Property Listings */}
        <div className="mt-6 space-y-4">
          {paginatedOffers.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">
              {searchOfferTerm.trim() !== ""
                ? "No results found for your search."
                : "No data available."}
            </p>
          ) : (
            paginatedOffers.map((OfferProject) => (
              <div
                key={OfferProject._id}
                className={`bg-white shadow-sm rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between relative 
                  ${
                    OfferProject.status === "Approved"
                      ? "border-1 border-green-500"
                      : OfferProject.status === "Rejected" ||
                          OfferProject.status === "Disapproved"
                        ? "border-1 border-red-500"
                        : OfferProject.status === "Pending"
                          ? "border-1 border-yellow-500"
                          : ""
                  }`}
              >
                {/* Published Badge (Top Left Corner) */}
                <div
                  className={`absolute top-2 left-6 text-xs font-medium px-3 py-1 rounded-md ${
                    OfferProject.status === "Approved"
                      ? "bg-green-200 text-green-700"
                      : OfferProject.status === "Rejected" ||
                          OfferProject.status === "Disapproved"
                        ? "bg-red-200 text-red-700"
                        : "bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {OfferProject.status}
                </div>

                {/* Left Section (Image + Badge) */}
                <div className="relative w-40 h-28 mt-3">
                  {/* Property Image */}
                  <Link
                    to={{
                      pathname: `/offerdetail/${OfferProject?.property_id}`,
                      state: { offer: OfferProject },
                    }}
                  >
                    <img
                      src={
                        OfferProject.property_data?.cover_image
                          ? // ? `${process.env.REACT_APP_API_URL}${OfferProject.offer_img}`
                            `${process.env.REACT_APP_API_URL}${OfferProject.property_data?.cover_image}`
                          : "/image/app.png"
                      }
                      alt="Property Image"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </Link>
                  <span
                    className={`absolute top-1 left-1 text-xs px-2 rounded-md ${
                      OfferProject.property_data?.property_category_type ===
                      "Buy"
                        ? "my-bg text-white"
                        : OfferProject.property_data?.property_category_type ===
                            "Rent"
                          ? "bg-green-600 text-white"
                          : "bg-gray-400 text-white"
                    }`}
                  >
                    {OfferProject.property_data?.property_category_type ===
                    "Buy"
                      ? "FOR BUY"
                      : OfferProject.property_data?.property_category_type ===
                          "Rent"
                        ? "FOR RENT"
                        : "UNKNOWN"}
                  </span>
                </div>

                {/* Middle Section (Details) */}
                <div className="ml-4 flex-1 mt-3">
                  <h3 className="text-lg font-semibold mb-0">
                    {OfferProject.property_data?.property_name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-0">
                    {OfferProject.property_data?.address_area}
                  </p>
                  {OfferProject.property_data?.property_category_type ===
                  "Rent" ? (
                    <p className="text-black font-bold mt-1">
                      ₹{" "}
                      {Number(OfferProject.property_data?.rent) >= 10000000
                        ? (Number(OfferProject.property_data?.rent) / 10000000)
                            .toFixed(1)
                            .replace(/\.0$/, "") + " Cr"
                        : Number(OfferProject.property_data?.rent) >= 100000
                          ? (Number(OfferProject.property_data?.rent) / 100000)
                              .toFixed(1)
                              .replace(/\.0$/, "") + " L"
                          : Number(OfferProject.property_data?.rent) >= 1000
                            ? (Number(OfferProject.property_data?.rent) / 1000)
                                .toFixed(1)
                                .replace(/\.0$/, "") + " K"
                            : OfferProject.property_data?.rent}
                      {OfferProject.property_data?.rent_duration &&
                      OfferProject.property_data?.rent_duration !== "N/A"
                        ? ` / ${OfferProject.property_data?.rent_duration}`
                        : ""}
                    </p>
                  ) : (
                    OfferProject.property_data?.property_price &&
                    OfferProject.property_data?.property_price !== "N/A" && (
                      <p className="text-black font-bold mt-1">
                        ₹{" "}
                        {Number(OfferProject.property_data?.property_price) >=
                        10000000
                          ? (
                              Number(
                                OfferProject.property_data?.property_price,
                              ) / 10000000
                            )
                              .toFixed(1)
                              .replace(/\.0$/, "") + " Cr"
                          : Number(
                                OfferProject.property_data?.property_price,
                              ) >= 100000
                            ? (
                                Number(
                                  OfferProject.property_data?.property_price,
                                ) / 100000
                              )
                                .toFixed(1)
                                .replace(/\.0$/, "") + " L"
                            : Number(
                                  OfferProject.property_data?.property_price,
                                ) >= 1000
                              ? (
                                  Number(
                                    OfferProject.property_data?.property_price,
                                  ) / 1000
                                )
                                  .toFixed(1)
                                  .replace(/\.0$/, "") + " K"
                              : OfferProject.property_data?.property_price}
                      </p>
                    )
                  )}

                  <p className="text-gray-400 text-sm ">
                    Posted on:{" "}
                    {new Date(OfferProject.created_at).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>

                {/* Right Section (Stats & Actions) */}
                <div className="flex flex-col items-center gap-4 mt-4 md:mt-0">
                  {/* Views and Leads - Now stacked */}
                  <div className="flex gap-20 mt-3">
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">Views</p>
                      <p className="text-black font-semibold">
                        {OfferProject.property_data?.view_count || "0"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">Leads</p>
                      <p className="text-black font-semibold">
                        {OfferProject.property_data?.leads_count || "0"}
                      </p>
                    </div>
                  </div>

                  {/* Buttons - Now positioned below Views & Leads */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handlePropertyClick(OfferProject)}
                      className="border-1 border-rose-500 my-text px-4 py-1 rounded-lg"
                    >
                      Edit Offer
                    </button>

                    {OfferProject.status === "Approved" ? (
                      <button
                        className="border bg-white text-red-500 px-4 py-1 rounded-lg border-red-500"
                        onClick={() => {
                          setOfferToDelete(OfferProject); // store the offer info
                          setShowDeleteModal(true); // show modal
                        }}
                      >
                        Delete
                      </button>
                    ) : OfferProject.status === "Rejected" ||
                      OfferProject.status === "Disapproved" ? (
                      <button
                        className="border bg-white text-black px-4 py-1 rounded-lg border-black border-1"
                        onClick={() => {
                          setSelectedReason(
                            OfferProject.reason || "No reason provided",
                          );
                          setShowReasonModal(true);
                        }}
                      >
                        View Reason
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 mt-6">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 rounded-lg w-full max-w-md md:max-w-3xl relative">
            {/* Header */}
            <div className="bg-white p-4 flex justify-center items-center border-b">
              <h2 className="text-xl font-semibold">Select Property</h2>
              <button
                className="absolute top-2 right-2 text-black hover:text-black text-2xl"
                onClick={() => {
                  resetOfferFormFields();
                  setShowModal(false);
                }}
              >
                <IoCloseCircleOutline />
              </button>
            </div>

            {/* Search Box */}
            <div className="px-4 pt-4">
              <div className="relative w-full">
                <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="border rounded-lg px-10 py-2 w-full outline-none focus:ring-2 focus:ring-rose-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Property List */}
            <div className="max-h-80 overflow-y-auto px-4 pt-4">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-center gap-4 bg-white rounded-xl p-2 mb-3 shadow-sm hover:shadow-md transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(project._id)}
                    onChange={() => toggleSelect(project._id)}
                    className="h-5 w-5 accent-rose-600"
                  />

                  {/* Image */}
                  <div className="relative w-24 h-24">
                    <img
                      src={project.cover_image}
                      alt="Cover Image"
                      className="w-full h-full rounded-lg object-cover"
                    />
                    <span
                      className={`absolute top-1 left-1 text-xs px-2 rounded-md ${
                        project.property_category_type === "Buy"
                          ? "my-bg text-white"
                          : project.property_category_type === "Rent"
                            ? "bg-green-600 text-white"
                            : "bg-gray-400 text-white"
                      }`}
                    >
                      {project.property_category_type === "Buy"
                        ? "FOR BUY"
                        : project.property_category_type === "Rent"
                          ? "FOR RENT"
                          : "UNKNOWN"}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">
                      {project.property_name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {project.address_area}
                    </p>

                    {project.property_category_type === "Rent" ? (
                      <p className="text-black font-bold mt-1">
                        ₹{" "}
                        {Number(project.rent) >= 10000000
                          ? (Number(project.rent) / 10000000)
                              .toFixed(1)
                              .replace(/\.0$/, "") + " Cr"
                          : Number(project.rent) >= 100000
                            ? (Number(project.rent) / 100000)
                                .toFixed(1)
                                .replace(/\.0$/, "") + " L"
                            : Number(project.rent) >= 1000
                              ? (Number(project.rent) / 1000)
                                  .toFixed(1)
                                  .replace(/\.0$/, "") + " K"
                              : project.rent}
                        {project.rent_duration &&
                        project.rent_duration !== "N/A"
                          ? ` / ${project.rent_duration}`
                          : ""}
                      </p>
                    ) : (
                      project.property_price &&
                      project.property_price !== "N/A" && (
                        <p className="text-black font-bold mt-1">
                          ₹{" "}
                          {Number(project.property_price) >= 10000000
                            ? (Number(project.property_price) / 10000000)
                                .toFixed(1)
                                .replace(/\.0$/, "") + " Cr"
                            : Number(project.property_price) >= 100000
                              ? (Number(project.property_price) / 100000)
                                  .toFixed(1)
                                  .replace(/\.0$/, "") + " L"
                              : Number(project.property_price) >= 1000
                                ? (Number(project.property_price) / 1000)
                                    .toFixed(1)
                                    .replace(/\.0$/, "") + " K"
                                : project.property_price}
                        </p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-white flex justify-between items-center p-4 border-t">
              <p className="text-gray-700">
                {selectedProperties.length} Property Selected
              </p>
              <button
                className="my-bg text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
                disabled={selectedProperties.length === 0}
                onClick={() => {
                  setShowModal(false);
                  setShowNextModal(true);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Edite Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 rounded-lg w-full max-w-md md:max-w-3xl relative max-h-[90vh] overflow-y-auto">
            <div className="bg-white p-4 flex justify-center items-center border-b">
              <h2 className="text-xl font-semibold">Edit A Offer</h2>
              <button
                className="absolute top-2 right-2 text-black hover:text-black text-2xl"
                onClick={() => {
                  fetchOffers();
                  setShowEditModal(false);
                  resetOfferFormFields();
                }}
              >
                <IoCloseCircleOutline />
              </button>
            </div>

            <div className="flex items-center bg-white p-3 rounded-lg">
              <div className="relative w-24 h-24">
                <img
                  src={
                    selectedProperty.property_data?.cover_image
                      ? `${process.env.REACT_APP_API_URL}${selectedProperty.property_data?.cover_image}`
                      : "/default-image.jpg"
                  }
                  alt="Property Image"
                  className="w-full h-full rounded-lg object-cover"
                />
                <span
                  className={`absolute top-1 left-1 text-xs px-2 rounded-md ${
                    selectedProperty.property_data?.property_category_type ===
                    "Buy"
                      ? "my-bg text-white"
                      : selectedProperty.property_data
                            ?.property_category_type === "Rent"
                        ? "bg-green-600 text-white"
                        : "bg-gray-400 text-white"
                  }`}
                >
                  {selectedProperty.property_data?.property_category_type ===
                  "Buy"
                    ? "FOR BUY"
                    : selectedProperty.property_data?.property_category_type ===
                        "Rent"
                      ? "FOR RENT"
                      : "UNKNOWN"}
                </span>
              </div>
              <div className="ml-3">
                <p className="font-semibold">
                  {selectedProperty.property_data?.property_name}
                </p>
                <p className="text-gray-500 text-sm">
                  {selectedProperty.property_data?.address_area}
                </p>
                {selectedProperty.property_data?.property_category_type ===
                "Rent" ? (
                  <p className="text-black font-bold mt-1">
                    ₹{" "}
                    {Number(selectedProperty.property_data?.rent) >= 10000000
                      ? (
                          Number(selectedProperty.property_data?.rent) /
                          10000000
                        )
                          .toFixed(1)
                          .replace(/\.0$/, "") + " Cr"
                      : Number(selectedProperty.property_data?.rent) >= 100000
                        ? (
                            Number(selectedProperty.property_data?.rent) /
                            100000
                          )
                            .toFixed(1)
                            .replace(/\.0$/, "") + " L"
                        : Number(selectedProperty.property_data?.rent) >= 1000
                          ? (
                              Number(selectedProperty.property_data?.rent) /
                              1000
                            )
                              .toFixed(1)
                              .replace(/\.0$/, "") + " K"
                          : selectedProperty.property_data?.rent}
                    {selectedProperty.property_data?.rent_duration &&
                    selectedProperty.property_data?.rent_duration !== "N/A"
                      ? ` / ${selectedProperty.property_data?.rent_duration}`
                      : ""}
                  </p>
                ) : (
                  selectedProperty.property_data?.property_price &&
                  selectedProperty.property_data?.property_price !== "N/A" && (
                    <p className="text-black font-bold mt-1">
                      ₹{" "}
                      {Number(selectedProperty.property_data?.property_price) >=
                      10000000
                        ? (
                            Number(
                              selectedProperty.property_data?.property_price,
                            ) / 10000000
                          )
                            .toFixed(1)
                            .replace(/\.0$/, "") + " Cr"
                        : Number(
                              selectedProperty.property_data?.property_price,
                            ) >= 100000
                          ? (
                              Number(
                                selectedProperty.property_data?.property_price,
                              ) / 100000
                            )
                              .toFixed(1)
                              .replace(/\.0$/, "") + " L"
                          : Number(
                                selectedProperty.property_data?.property_price,
                              ) >= 1000
                            ? (
                                Number(
                                  selectedProperty.property_data
                                    ?.property_price,
                                ) / 1000
                              )
                                .toFixed(1)
                                .replace(/\.0$/, "") + " K"
                            : selectedProperty.property_data?.property_price}
                    </p>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row p-4 gap-6 bg-white">
              {/* Left Section - Upload Images */}
              <div className="md:w-1/2 flex flex-col items-center justify-center bg-gray-100 p-2 border-dashed border-2 border-gray-300 rounded-xl">
                <div className="text-center w-full">
                  <p className="text-gray-500 mb-2">Upload Offer</p>

                  {previewUrl ? (
                    <div className="mb-1 relative inline-block">
                      <button
                        onClick={handleDeleteImage}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded-full"
                      >
                        <Trash className="text-white w-4 h-4" />
                      </button>
                      <img
                        src={previewUrl}
                        alt="Offer Image"
                        className="w-40 h-28 object-cover mx-auto rounded-lg border shadow-md"
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        Selected image
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="my-bg text-white px-4 py-2 rounded-lg text-sm"
                      onClick={() =>
                        document.getElementById("offer_img").click()
                      }
                    >
                      + Add Photos
                    </button>
                  )}

                  <input
                    id="offer_img"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="md:w-1/2">
                <input
                  type="text"
                  placeholder="Offer Name"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  className="w-full border rounded-lg p-2 mb-3"
                />

                <textarea
                  placeholder="Offer Description"
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  className="w-full border rounded-lg p-2 mb-3"
                />
              </div>
            </div>

            <div className="bg-white flex justify-between items-center p-4 border-t">
              <p className="text-gray-500 font-bold flex items-center">
                1 Property Selected
              </p>
              <button
                className="my-bg text-white px-4 py-2 rounded-lg"
                onClick={() => {
                  handleOfferSubmit();
                  setShowEditModal(false);
                  fetchOffers();
                }}
              >
                Edit Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Next Modal */}
      {showNextModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 rounded-lg w-full max-w-md md:max-w-3xl relative max-h-[90vh] overflow-y-auto">
            <div className="bg-white p-4 flex justify-center items-center border-b">
              <button
                className="absolute top-2 left-2 text-black hover:text-black text-2xl"
                onClick={() => {
                  setShowNextModal(false);
                  setShowModal(true);
                }}
              >
                <IoArrowBackCircleOutline />
              </button>
              <h2 className="text-xl font-semibold">Offer Details</h2>
              <button
                className="absolute top-2 right-2 text-black hover:text-black text-2xl"
                onClick={() => {
                  fetchOffers();
                  setShowNextModal(false);
                }}
              >
                <IoCloseCircleOutline />
              </button>
            </div>

            {/* Property Card */}
            <div className="flex items-center bg-white p-3 rounded-lg">
              {/* Image */}
              {console.log(
                "Selected Property in Next Modal: ",
                selectedProperty,
              )}
              <div className="relative w-24 h-24">
                <img
                  src={selectedProperty.cover_image}
                  alt="Property Image"
                  className="w-full h-full rounded-lg object-cover"
                />
                <span
                  className={`absolute top-1 left-1 text-xs px-2 rounded-md ${
                    selectedProperty.property_category_type === "Buy"
                      ? "my-bg text-white"
                      : selectedProperty.property_category_type === "Rent"
                        ? "bg-green-600 text-white"
                        : "bg-gray-400 text-white"
                  }`}
                >
                  {selectedProperty.property_category_type === "Buy"
                    ? "FOR SALE"
                    : selectedProperty.property_category_type === "Rent"
                      ? "FOR RENT"
                      : "UNKNOWN"}
                </span>
              </div>
              <div className="ml-3">
                <p className="font-semibold">
                  {selectedProperty.property_name}
                </p>
                <p className="text-gray-500 text-sm">
                  {selectedProperty.address_area}
                </p>
                {/* {selectedProperty.property_category_type === "Rent" ? (
                  <p className="text-black font-bold mt-1">
                    ₹ {selectedProperty.rent}
                    {selectedProperty.rent_duration && selectedProperty.rent_duration !== "N/A"
                      ? ` / ${selectedProperty.rent_duration}`
                      : ""}
                  </p>
                ) : (
                  selectedProperty.property_price &&
                  selectedProperty.property_price !== "N/A" && (
                    <p className="text-black font-bold mt-1">₹ {selectedProperty.property_price}</p>
                  )
                )} */}
                {selectedProperty.property_category_type === "Rent" ? (
                  <p className="text-black font-bold mt-1">
                    ₹{" "}
                    {Number(selectedProperty.rent) >= 10000000
                      ? (Number(selectedProperty.rent) / 10000000)
                          .toFixed(1)
                          .replace(/\.0$/, "") + " Cr"
                      : Number(selectedProperty.rent) >= 100000
                        ? (Number(selectedProperty.rent) / 100000)
                            .toFixed(1)
                            .replace(/\.0$/, "") + " L"
                        : Number(selectedProperty.rent) >= 1000
                          ? (Number(selectedProperty.rent) / 1000)
                              .toFixed(1)
                              .replace(/\.0$/, "") + " K"
                          : selectedProperty.rent}
                    {selectedProperty.rent_duration &&
                    selectedProperty.rent_duration !== "N/A"
                      ? ` / ${selectedProperty.rent_duration}`
                      : ""}
                  </p>
                ) : (
                  selectedProperty.property_price &&
                  selectedProperty.property_price !== "N/A" && (
                    <p className="text-black font-bold mt-1">
                      ₹{" "}
                      {Number(selectedProperty.property_price) >= 10000000
                        ? (Number(selectedProperty.property_price) / 10000000)
                            .toFixed(1)
                            .replace(/\.0$/, "") + " Cr"
                        : Number(selectedProperty.property_price) >= 100000
                          ? (Number(selectedProperty.property_price) / 100000)
                              .toFixed(1)
                              .replace(/\.0$/, "") + " L"
                          : Number(selectedProperty.property_price) >= 1000
                            ? (Number(selectedProperty.property_price) / 1000)
                                .toFixed(1)
                                .replace(/\.0$/, "") + " K"
                            : selectedProperty.property_price}
                    </p>
                  )
                )}
              </div>
            </div>

            {/* Modal Body with Two Columns */}
            <div className="flex flex-col md:flex-row p-4 gap-6 bg-white">
              {/* Left Section - Upload Images */}
              <div className="md:w-1/2 flex flex-col items-center justify-center bg-gray-100 p-2 border-dashed border-2 border-gray-300 rounded-xl">
                <div className="text-center w-full">
                  <p className="text-gray-500 mb-2">Upload Images</p>

                  {/* Show Preview if Image is Selected */}
                  {createOfferPhoto && (
                    <div className="relative inline-block">
                      <button
                        onClick={() => setCreateOfferPhoto(null)}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded-full"
                      >
                        <Trash className="text-white w-4 h-4" />
                      </button>

                      <img
                        src={URL.createObjectURL(createOfferPhoto)}
                        alt="Selected"
                        className="w-40 h-28 object-cover mx-auto rounded-lg border shadow-md"
                      />
                      <p className="text-sm text-gray-400 mt-1 text-center">
                        Selected image
                      </p>
                    </div>
                  )}

                  {/* Hide Add Button if Image is Already Uploaded */}
                  {!createOfferPhoto && (
                    <>
                      <button
                        type="button"
                        className="my-bg text-white px-4 py-2 rounded-lg text-sm"
                        onClick={() =>
                          document.getElementById("offer_img").click()
                        }
                      >
                        + Add Photos
                      </button>
                      <input
                        id="offer_img"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => setCreateOfferPhoto(e.target.files[0])}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Right Section - Form Fields */}
              <div className="md:w-1/2">
                <input
                  type="text"
                  placeholder="Offer Name"
                  value={createOfferName}
                  onChange={(e) => setCreateOfferName(e.target.value)}
                  className="w-full border rounded-lg p-2 mb-3"
                />

                <textarea
                  placeholder="Offer Description"
                  value={createOfferDescription}
                  onChange={(e) => setCreateOfferDescription(e.target.value)}
                  className="w-full border rounded-lg p-2 mb-3"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white flex justify-between items-center p-4 border-t">
              <p className="text-gray-500 text-sm">
                {selectedProperties.length} Property
                {selectedProperties.length !== 1 && "ies"}
              </p>
              <button
                className="my-bg text-white px-4 py-2 rounded-lg"
                onClick={() => {
                  handleAddOffer();
                  fetchOffers();
                  setShowNextModal(false);
                }}
              >
                Create Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {showOfferCountModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Offer Posting Limit Reached
            </h2>
            <p className="mb-6 text-gray-700">
              You have reached your maximum limit for posting offers. Please
              purchase a plan to continue creating new offers.
            </p>
            {/* Align buttons side by side on the right */}
            <div className="flex justify-between items-center px-1">
              <button
                className="my-bg text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => {
                  setShowModal(false);
                  history.push({
                    pathname: "/dashboard",
                    state: { page: "mySubscriptions" },
                  });
                }}
              >
                Purchase Plan
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowModal(false); // FIXED
                  history.push("/");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* this is confirmation model tpo delete offres */}
      {showDeleteModal && offerToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-6 w-96 text-center shadow-lg relative">
            {/* Close Icon */}
            <button
              className="absolute top-2 right-2 text-black text-2xl"
              onClick={() => setShowDeleteModal(false)}
            >
              <IoCloseCircleOutline />
            </button>

            <h2 className="text-2xl font-semibold">Delete Offer?</h2>
            <p className="text-gray-500 mt-2">
              Are you sure you want to delete{" "}
              <strong>{offerToDelete.offer_name}</strong>?
            </p>

            <div className="flex justify-center gap-6 mt-4">
              <button
                className="my-bg text-white px-8 py-2 rounded-md"
                onClick={async () => {
                  try {
                    const { data } = await axios.delete(
                      `${process.env.REACT_APP_API_URL}/cust_api/delete_offer`,
                      {
                        data: {
                          user_id: offerToDelete.user_id,
                          offer_auto_id: offerToDelete._id,
                        },
                        headers: { "Content-Type": "application/json" },
                      },
                    );

                    if (data.status === 1) {
                      // Remove offer from UI
                      setOfferProjects((prev) =>
                        prev.filter((o) => o._id !== offerToDelete._id),
                      );
                      setShowDeleteModal(false); // Close modal
                      toast.success("Offer deleted successfully!"); // ✅ Show success toast
                    } else {
                      toast.error(data.detail || "Failed to delete offer"); // Show error toast
                    }
                  } catch (err) {
                    console.error(err);
                    toast.error("Something went wrong"); // Show error toast
                  }
                }}
              >
                Yes, Delete
              </button>

              <button
                className="bg-white border border-black text-black px-8 py-2 rounded-md"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showReasonModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-6 w-96 text-center shadow-lg relative">
            {/* Close (X) Icon */}
            <button
              className="absolute top-2 right-2 text-black text-2xl"
              onClick={() => setShowReasonModal(false)}
            >
              <IoCloseCircleOutline />
            </button>

            <h2 className="text-2xl font-semibold my-text">Reason</h2>
            <p className="text-gray-500 mt-2">{selectedReason}</p>
          </div>
        </div>
      )}
    </>
  );
};
export default Offer;
