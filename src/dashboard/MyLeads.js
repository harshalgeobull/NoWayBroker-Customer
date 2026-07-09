import React, { useEffect, useState } from "react";
import { FaSearch, FaSort } from "react-icons/fa";
import { FiSmartphone } from "react-icons/fi";
import { User } from "@phosphor-icons/react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";

const MyLeads = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("property");
  const user_id = sessionStorage.getItem("accessToken");
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const formatPrice = (price) => {
  if (!price) return "";

  price = Number(price);

  if (price >= 10000000) {
    return `${(price / 10000000).toFixed(2).replace(/\.?0+$/, "")} Cr`;
  } else if (price >= 100000) {
    return `${(price / 100000).toFixed(2).replace(/\.?0+$/, "")} L`;
  } else if (price >= 1000) {
    return `${(price / 1000).toFixed(2).replace(/\.?0+$/, "")} K`;
  } else {
    return price.toString();
  }
};

  const formatAverageProjectPrice = (price) => {
    if (!price) return "";

    const formatValue = (val) => {
  if (val === null || val === undefined) return "";
  return formatPrice(Number(val));
};
    let values;
    if (typeof price === "string" && /[-–—]/.test(price)) {
      values = price
        .split(/[-–—]/)
        .map((p) => p.trim())
        .filter(Boolean);
    } else {
      values = [price];
    }

    return (
      <>
        {values.map((v, idx) => (
          <span key={idx} className="inline-flex items-center">
            <FaRupeeSign className="inline-block mr-1" />
            {formatValue(v)}
            {idx === 0 && values.length > 1 && " - "}
          </span>
        ))}
      </>
    );
  };

  useEffect(() => {
    const fetchLeads = async () => {
      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("page", currentPage);
      formData.append("page_size", itemsPerPage);
      formData.append("search", search);
      formData.append("sortby", sortBy);

      const endpoint =
        activeTab === "property"
          ? "/cust_api/get_property_enquiry"
          : "/cust_api/get_project_enquiry";

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}${endpoint}`,
          formData,
        );

        if (response.data.status === 1) {
          const formattedLeads = response.data.data.map((item, index) => {
            const isProperty =
              !!item.enquiry_property_name ||
              !!item.enquiry_property_price ||
              !!item.property_id;
            const isProject =
              !!item.enquiry_average_project_price ||
              !!item.enquiry_project_name ||
              !!item.project_id;

            return {
              id: index + 1,
              property_id: isProperty ? item.property_id : null,
              project_id: isProject ? item.project_id : null,
              name: item.name,
              type: item.user_type || "Individual",
              phone: item.contact_number,
              status: item.enquiry_property_category_type,
              title: item.enquiry_property_name || item.project_name,
              // location: item.enquiry_address || "Not provided",
              location:
                item?.property_details?.address_area ||
                item?.project_details?.address_area ||
                "Not provided",
              price: isProperty
  ? `₹ ${formatPrice(item.enquiry_property_price)}`
  : isProject
    ? `₹ ${formatPrice(item.enquiry_average_project_price)}`
    : "N/A",
              rent: item.rent,
              rent_duration: item.rent_duration,
              receivedOn: new Date(item.created_at).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                },
              ),
              message: item.message || "",
              image: item.enquiry_cover_image,
              profile_image:
                item.property_owner_image || item.project_owner_image || null,
            };
          });
          setLeads(formattedLeads);
          setTotalCount(response.data.total_count);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, [currentPage, search, sortBy, activeTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            className={`px-4 py-2 font-semibold border-b-2 ${
              activeTab === "property"
                ? "border-rose-600 my-text"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("property");
              setCurrentPage(1);
            }}
          >
            Leads on Property
          </button>
          {!["buyer", "owner"].includes(
            (sessionStorage.getItem("user_type") || "").toLowerCase(),
          ) && (
            <button
              className={`px-4 py-2 font-semibold border-b-2 ${
                activeTab === "project"
                  ? "border-rose-600 my-text"
                  : "border-transparent text-gray-500"
              }`}
              onClick={() => {
                setActiveTab("project");
                setCurrentPage(1);
              }}
            >
              Leads on Project
            </button>
          )}
        </div>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">View Leads</h2>
          <div className="flex flex-col md:flex-row items-center gap-4 mt-3 md:mt-0">
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search listing"
                  className="border rounded-lg pl-10 pr-10 py-2 w-72 outline-none"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />

                {/* Clear (cross) button */}
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-900 text-lg"
                  >
                    <IoMdClose />
                  </button>
                )}
              </div>

              <FaSearch className="absolute left-3 top-3 text-gray-500" />
            </div>
            <button
              className="flex items-center gap-2 border rounded-lg px-4 py-2 text-gray-600"
              onClick={() => {
                setSortBy((prev) => (prev === "latest" ? "oldest" : "latest"));
                setCurrentPage(1);
              }}
            >
              <FaSort /> Sort by:{" "}
              <span className="font-semibold">{sortBy}</span>
            </button>
          </div>
        </div>

        {leads.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            {search.trim() !== ""
              ? "No results found for your search."
              : "No Data Found"}
          </p>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-lg p-3 mb-4 border">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-rose-100  rounded-full">
                    {console.log(lead)}
                    {lead?.profile_image ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/media/${lead.profile_image}`}
                        alt={sessionStorage.getItem("user_type") || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="my-text text-4xl" />
                    )}
                  </div>

                  <div className="mt-3">
                    <p className="font-semibold mb-0">{lead.name}</p>
                    <p className="text-gray-500 text-sm">{lead.type}</p>
                  </div>
                </div>
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-1 mr-20 my-text"
                >
                  <FiSmartphone /> {lead.phone}
                </a>
              </div>

              <hr className="my-4" />

              <div className="flex gap-4 relative">
                <div className="relative w-36 h-24">
                  <Link
                    to={
                      activeTab === "property"
                        ? `/propertydetails/${lead.property_id}`
                        : activeTab === "project"
                          ? `/projectdetail/${lead.project_id}`
                          : "#"
                    }
                  >
                    <img
                      src={
                        lead?.image
                          ? `${process.env.REACT_APP_API_URL}/media/${lead.image}`
                          : "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={lead?.title || "Image"}
                      className="w-full h-full object-cover rounded-md cursor-pointer"
                    />
                  </Link>
                  {activeTab === "property" && (
                    <span
                      className={`absolute top-0 left-0 text-white text-xs font-semibold px-2 py-1 rounded-md ${
                        lead.status === "Buy"
                          ? "bg-green-600"
                          : lead.status === "Rent"
                            ? "bg-blue-600"
                            : lead.status === "Residential"
                              ? "my-bg"
                              : "bg-yellow-600"
                      }`}
                    >
                      {lead.status === "Buy"
                        ? "For Buy"
                        : lead.status === "Rent"
                          ? "For Rent"
                          : lead.status === "Residential"
                            ? "Residential"
                            : "Commercial"}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-0">{lead.title}</p>
                  <p className="text-gray-500 text-sm">{lead.location}</p>
                  {lead.status === "Rent" ? (
                    <p className="text-black font-semibold">
                      {formatPrice(lead.rent)} / {lead.rent_duration}
                    </p>
                  ) : (
                    <p className="text-black font-semibold">
                      {/* {lead.price} */}
                      {formatAverageProjectPrice(lead.price)}
                    </p>
                  )}
                </div>
                <div className="text-right text-gray-500">
                  <p className="text-sm">Received On</p>
                  <p className="font-semibold">{lead.receivedOn}</p>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-gray-500 text-sm">Message</p>
                <p className="text-gray-700">{lead.message}</p>
              </div>
            </div>
          ))
        )}

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
    </>
  );
};

export default MyLeads;
