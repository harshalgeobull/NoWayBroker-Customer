import React, { useState, useEffect, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { Trash } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import DeleteProject from "./DeleteProject";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";

const MyProjects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const userId = sessionStorage.getItem("accessToken");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [priceError, setPriceError] = useState("");
  const history = useHistory();

  const priceOptions = [
    { label: "₹ 5 Lakhs", value: 500000 },
    { label: "₹ 10 Lakhs", value: 1000000 },
    { label: "₹ 15 Lakhs", value: 1500000 },
    { label: "₹ 20 Lakhs", value: 2000000 },
    { label: "₹ 25 Lakhs", value: 2500000 },
    { label: "₹ 30 Lakhs", value: 3000000 },
    { label: "₹ 40 Lakhs", value: 4000000 },
    { label: "₹ 50 Lakhs", value: 5000000 },
    { label: "₹ 60 Lakhs", value: 6000000 },
    { label: "₹ 75 Lakhs", value: 7500000 },
    { label: "₹ 90 Lakhs", value: 9000000 },

    { label: "₹ 1 Crore", value: 10000000 },
    { label: "₹ 1.25 Crore", value: 12500000 },
    { label: "₹ 1.5 Crore", value: 15000000 },
    { label: "₹ 1.75 Crore", value: 17500000 },
    { label: "₹ 2 Crore", value: 20000000 },
    { label: "₹ 3 Crore", value: 30000000 },
    { label: "₹ 4 Crore", value: 40000000 },
    { label: "₹ 5 Crore", value: 50000000 },
    { label: "₹ 7.5 Crore", value: 75000000 },

    { label: "₹ 10 Crore", value: 100000000 },
    { label: "₹ 15 Crore", value: 150000000 },
    { label: "₹ 20 Crore", value: 200000000 },
    { label: "₹ 25 Crore", value: 250000000 },
    { label: "₹ 30 Crore", value: 300000000 },
    { label: "₹ 40 Crore", value: 400000000 },
    { label: "₹ 50 Crore", value: 500000000 },
    { label: "₹ 60 Crore", value: 600000000 },
    { label: "₹ 75 Crore", value: 750000000 },
    { label: "₹ 90 Crore", value: 900000000 },

    { label: "₹ 100 Crore", value: 1000000000 },
    { label: "₹ 150 Crore", value: 1500000000 },
    { label: "₹ 200 Crore", value: 2000000000 },
    { label: "₹ 250 Crore", value: 2500000000 },
    { label: "₹ 300 Crore", value: 3000000000 },
    { label: "₹ 400 Crore", value: 4000000000 },
    { label: "₹ 500 Crore", value: 5000000000 },
    { label: "₹ 600 Crore", value: 6000000000 },
    { label: "₹ 750 Crore", value: 7500000000 },
    { label: "₹ 900 Crore", value: 9000000000 },

    { label: "₹ 1000 Crore", value: 10000000000 },
  ];

  const formatPrice = (price) => {
  if (!price) return "";

  price = Number(price);

  const formatNumber = (num) =>
    num.toFixed(2).replace(/\.?0+$/, "");

  if (price >= 10000000) {
    return `${formatNumber(price / 10000000)} Cr`;
  } else if (price >= 100000) {
    return `${formatNumber(price / 100000)} L`;
  } else if (price >= 1000) {
    return `${formatNumber(price / 1000)} K`;
  } else {
    return price.toString();
  }
};

 const formatAverageProjectPrice = (price) => {
  if (!price) return "";

  // Price Range
  if (typeof price === "string" && price.includes("-")) {
    const parts = price.split("-").map((p) => p.trim());

    return (
      <>
        {parts.map((p, idx) => (
          <span key={idx} className="inline-flex items-center">
            <FaRupeeSign className="inline-block mr-1" />
            {formatPrice(Number(p))}
            {idx === 0 && " - "}
          </span>
        ))}
      </>
    );
  }

    // Normal number formatting
    // price = parseInt(price);
    // if (isNaN(price)) return "";

    // let formatted;
    // if (price >= 10000000) {
    //   formatted = parseFloat((price / 10000000).toFixed(1)) + " Cr";
    // } else if (price >= 100000) {
    //   formatted = parseFloat((price / 100000).toFixed(1)) + " L";
    // } else if (price >= 1000) {
    //   formatted = parseFloat((price / 1000).toFixed(1)) + " K";
    // } else {
    //   formatted = price.toString();
    // }

    return (
      <span className="inline-flex items-center">
        <FaRupeeSign className="inline-block mr-1" />
        {formatPrice(Number(price))}
      </span>
    );
  };

  const getFinalPrice = (project) => {
    if (
      !project.project_properties ||
      project.project_properties.length === 0
    ) {
      return "";
    }

    // collect property prices
    const prices = project.project_properties
      .map((p) => parseInt(p.price))
      .filter((p) => !isNaN(p));

    if (prices.length === 0) return "";

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    // Single price
    if (min === max) {
      return formatAverageProjectPrice(min.toString());
    }

    // Price range
    return formatAverageProjectPrice(`${min} - ${max}`);
  };

  const handleMinChange = (e) => {
    const value = e.target.value;
    setMinPrice(value);

    if (maxPrice && Number(value) > Number(maxPrice)) {
      setPriceError("Min price should not be greater than Max price");
    } else {
      setPriceError("");
    }
  };

  const handleMaxChange = (e) => {
    const value = e.target.value;
    setMaxPrice(value);

    if (minPrice && Number(value) < Number(minPrice)) {
      setPriceError("Max price should not be less than Min price");
    } else {
      setPriceError("");
    }
  };

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async (project_id) => {
    setIsModalOpen(false);

    if (!userId) {
      toast.error("You must be logged in to delete a project.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("project_id", project_id);

      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/cust_api/delete_project`,
        {
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.status === 1) {
        toast.success("project deleted successfully.");
        setProjects((prev) => prev.filter((item) => item.id !== project_id));
      } else {
        toast.error(res.data.message || "Failed to delete project.");
        console.error("Failed to delete project:", res.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the project.");
      console.error("Error deleting project:", error);
    }
  };

  const handleStatusClick = (project) => {
    if (project.status === "Project Sold Out") {
      setSelectedProject(project);
      setShowModal(true);
    }
  };

  const fetchProjects = async () => {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("page", currentPage);
    formData.append("page_size", itemsPerPage);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_project_list`,
        formData,
      );

      // Log the response for debugging
      console.log(response.data);

      if (response.data.status === 1) {
        const transformed = response.data.data.map((item) => ({
          id: item._id,
          title: item.project_name,
          location: item.address_area,
          date: item.created_at
            ? new Date(item.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "N/A",
          status: "Project Sold Out",
          soldOut: false,
          image: item.cover_image || "https://via.placeholder.com/150",
          admin_approval: item.admin_approval,
         bhk_type: item.display_configuration || "Not Mentioned",
          view_count: item.view_count,
          leads_count: item.leads_count,
          // ✅ Keep price-related fields
          project_properties: item.project_properties,
          average_project_price: item.average_project_price,
        }));

        // Log transformed data
        console.log("Transformed projects:", transformed);

        setProjects(transformed);
        setTotalCount(response.data.total_count);
      } else {
        console.error(
          "Failed to fetch projects, status:",
          response.data.status,
        );
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userId, currentPage, itemsPerPage]);

  const handleSearch = async () => {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("search_keyword", searchKeyword);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/my_project_search`,
        formData,
      );
      console.log("Search API Response:", response.data);

      if (response.data.status === 1) {
        const transformed = response.data.data.map((item) => ({
          id: item._id,
          title: item.project_name,
          location: item.address_area,
          date: item.created_at
            ? new Date(item.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "N/A",
          status: "Project Sold Out",
          soldOut: false,
          image: item.cover_image
            ? `${process.env.REACT_APP_API_URL}/${item.cover_image}`
            : "https://via.placeholder.com/150",
          admin_approval: item.admin_approval,
          bhk_type: item.display_configuration || "Not Mentioned",
          view_count: item.view_count,
          leads_count: item.leads_count,
        }));

        setProjects(transformed);
        setTotalCount(response.data.total_count);
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const currentItems = projects;
      }
    } catch (error) {
      console.error("Error calling search API:", error);
    }
  };

  const firstLoad = useRef(true);
  const fetchFilteredProject = async () => {
    if (!userId) {
      console.warn("No userId found in session storage.");
      setProjects([]);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      if (city) formData.append("city_name", city);
      if (locality) formData.append("search_keyword", locality);
      if (minPrice) formData.append("min_price", minPrice);
      if (maxPrice) formData.append("max_price", maxPrice);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/my_project_search_filter`,
        formData,
      );

      console.log("Search API Response:", response.data);

      if (response.data.status === 1) {
        const transformed = response.data.data.map((item) => ({
          id: item._id,
          title: item.project_name,
          location: item.address_area,
          date: item.created_at
            ? new Date(item.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "N/A",
          status: "Project Sold Out",
          soldOut: false,
          image:
            item.cover_image ||
            `${process.env.REACT_APP_API_URL}/${item.cover_image}`,
          admin_approval: item.admin_approval,
          bhk_type: item.display_configuration || "Not Mentioned",
          view_count: item.view_count,
          leads_count: item.leads_count,
        }));

        setProjects(transformed);
        setTotalCount(response.data.total_count || 0);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching filtered properties:", error);
    }
  };
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
    } else if (userId) {
      fetchFilteredProject();
    }
  }, [city, locality, minPrice, maxPrice, userId]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const currentItems = projects;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    if (searchKeyword.trim() !== "") {
      handleSearch();
    } else {
      fetchProjects();
    }
  }, [searchKeyword]);

  return (
    <>
      <div className="max-w-6xl p-6 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <h2 className="text-2xl font-semibold">My Projects</h2>
          <div className="relative md:mt-0">
            <IoIosSearch
              className="absolute text-gray-500 transform -translate-y-1/2 cursor-pointer left-3 top-1/2"
              onClick={handleSearch}
            />

            <input
              type="text"
              placeholder="Search"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="px-10 py-2 pr-10 border rounded-lg outline-none w-72 focus:ring-2 focus:ring-rose-400"
            />

            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword("")}
                className="absolute text-lg text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-900"
              >
                <IoMdClose />
              </button>
            )}
          </div>
          <Link
            to="/add_new_project"
            className="px-4 py-2 text-base font-medium text-center text-white no-underline my-bg border border-gray-300 rounded hover:my-bg hover:no-underline"
          >
            <button className="">Add New Project </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-between mt-6">
          {/* Left Side Fields */}
          <div className="flex gap-4">
            <select
              className="w-24 px-4 py-2 border rounded-lg outline-none md:w-40"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">City</option>
              <option value="Nashik">Nashik</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Ahmedabad">Ahmedabad</option>
            </select>
            {/* <div className="relative md:mt-0">
              <input
                type="text"
                placeholder="Enter locality or projects"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-56 px-4 py-2 pr-10 border rounded-lg outline-none md:w-64"
              />

              {locality && (
                <button
                  onClick={() => setLocality("")}
                  className="absolute text-lg text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-900"
                >
                  <IoMdClose />
                </button>
              )}
            </div> */}
          </div>

          {/* Right Side Fields */}
          <div>
            <div className="flex gap-4">
              {/* Min Price Dropdown */}
              <select
                value={minPrice}
                onChange={handleMinChange}
                className="px-4 py-2 border rounded-lg outline-none w-28"
              >
                <option value="">₹ Min</option>
                {priceOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Max Price Dropdown */}
              <select
                value={maxPrice}
                onChange={handleMaxChange}
                className="px-4 py-2 border rounded-lg outline-none w-28"
              >
                <option value="">₹ Max</option>
                {priceOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {priceError && (
              <p className="mt-1 text-sm text-center text-red-500">
                {priceError}
              </p>
            )}
          </div>
        </div>

        {/* Property Listings */}
        <div className="mt-6 space-y-4">
          {!currentItems || currentItems.length === 0 ? (
            <p className="mt-10 text-lg text-center text-gray-500">
              No project found.
            </p>
          ) : (
            currentItems.map((project) => (
              <div
                key={project.id}
                className={`bg-white shadow-sm rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between relative
                  ${
                    project.admin_approval === "Approved"
                      ? "border-2 border-green-500"
                      : project.admin_approval === "Rejected"
                        ? "border-2 border-red-500"
                        : project.admin_approval === "Pending"
                          ? "border-2 border-yellow-500"
                          : "border border-gray-300"
                  }`}
              >
                {/* Published Badge (Top Left Corner) */}
                <div
                  className={`absolute top-2 left-6 text-xs font-medium px-3 py-1 rounded-md 
                    ${
                      project.admin_approval === "Approved"
                        ? "bg-green-200 text-green-700 border border-green-700"
                        : project.admin_approval === "Rejected"
                          ? "bg-red-200 text-red-700 border border-red-700"
                          : project.admin_approval === "Pending"
                            ? "bg-yellow-200 text-yellow-700 border border-yellow-700"
                            : "bg-gray-300 text-gray-600 border border-gray-600"
                    }`}
                >
                  {project.admin_approval === "Approved"
                    ? "Approved"
                    : project.admin_approval === "Rejected"
                      ? "Rejected"
                      : project.admin_approval === "Pending"
                        ? "Pending"
                        : "Not Published"}
                </div>

                {/* Left Section (Image + Badge) */}
                <div className="relative w-40 mt-3 h-28">
                  {/* Property Image */}
                  <Link
                    to={`/projectdetail/${project.id}`}
                    key={project.id}
                    className="block"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                      className="object-cover w-64 h-24 rounded-md"
                    />
                  </Link>
                </div>

                {/* Middle Section (Details) */}
                {/* Middle Section (Details) */}
                <div className="flex-1 mt-3 ml-4">
                  <h3 className="mb-0 text-lg font-semibold">
                    {project.title}
                  </h3>
                  <p className="mb-0 text-sm text-gray-500">
                    {project.location}
                  </p>

                  <p className="font-bold text-black">{project.bhk_type}</p>

                  {/* Price Range / Average Price */}
                  {project.project_properties &&
                    project.project_properties.length > 0 &&
                    (() => {
                      const prices = project.project_properties.map((p) =>
                        Number(p.price),
                      );
                      const minPrice = Math.min(...prices);
                      const maxPrice = Math.max(...prices);

                      return (
                        <p className="flex items-center mb-0 text-xl font-bold my-text sm:text-2xl">
                          {minPrice === maxPrice ? (
                            <>{formatAverageProjectPrice(minPrice)}</>
                          ) : (
                            <>
                              {formatAverageProjectPrice(
                                `${minPrice} - ${maxPrice}`,
                              )}
                            </>
                          )}
                        </p>
                      );
                    })}

                  <p className="text-sm text-gray-400">
                    Posted on: {project.date}
                  </p>
                </div>

                {/* Right Section (Stats & Actions) */}
                <div className="flex flex-col items-center gap-4 mt-4 md:mt-0">
                  {/* Views and Leads - Now stacked */}
                  <div className="flex gap-20 mt-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Views</p>
                      <p className="font-semibold text-black">
                        {project.view_count || "0"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Leads</p>
                      <p className="font-semibold text-black">
                        {project.leads_count || "0"}
                      </p>
                    </div>
                  </div>

                  {/* Buttons - Now positioned below Views & Leads */}
                  <div className="flex gap-4">
                    {/* <button className="px-4 py-1 text-white my-bg rounded-lg border-1">
                    Create Offers
                  </button> */}
                    <button
                      className="px-4 py-1 my-text border-rose-500 rounded-lg border-1"
                      onClick={(e) => {
                        e.preventDefault();
                        history.push(`/Editproject/${project.id}`);
                      }}
                    >
                      Edit Project
                    </button>
                    <button
                      className="p-2 text-red-500 transition border-red-500 rounded-lg hover:bg-red-100 border-1"
                      onClick={() => handleDeleteClick(project)}
                    >
                      <Trash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-6 text-center bg-white shadow-lg rounded-2xl w-96">
            {/* Close (X) Icon */}
            <button
              className="absolute text-2xl text-black top-2 right-2 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              <IoCloseCircleOutline />
            </button>

            <h2 className="text-2xl font-semibold"> Project Sold Out </h2>
            <p className="mt-2 text-gray-500">
              Are you sure your project is Sold?
            </p>

            <div className="flex justify-center gap-8 mt-4">
              <button
                className="px-16 py-2 text-white my-bg rounded-md"
                onClick={() => setShowModal(false)}
              >
                Yes
              </button>
              <button
                className="px-16 py-2 text-black bg-white border-black rounded-md border-1"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render the modal */}
      <DeleteProject
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleConfirmDelete(selectedProject?.id)}
      />
    </>
  );
};
export default MyProjects;
