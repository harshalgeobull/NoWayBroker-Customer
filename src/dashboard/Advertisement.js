import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
const projects = [
  {
    id: 1,
    //   type: "FOR RENT",
    title: "Shila Bina",
    location: "1421 San Pedro St, Los Angeles",
    bhk_type: "2, 3, BHK Apartments",
    date: "26 Jan, 2023",
    price: "2500",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzeeEyTOTywdDDuqdQRF49FbHOCYCSt7NGEqhS_XcrFTAAHbUxD0rYaPuMPWG2lkfnPSU&usqp=CAU",
    published: true,
  },
  {
    id: 2,
    //   type: "FOR BUY",
    title: "Shila Bina",
    location: "1421 San Pedro St, Los Angeles",
    bhk_type: "1, 2, 3, BHK Apartments",
    date: "26 Jan, 2023",
    published: true,
    price: "2500",

    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzeeEyTOTywdDDuqdQRF49FbHOCYCSt7NGEqhS_XcrFTAAHbUxD0rYaPuMPWG2lkfnPSU&usqp=CAU",
  },
  {
    id: 3,
    //   type: "FOR BUY",
    title: "Shila Bina",
    location: "1421 San Pedro St, Los Angeles",
    bhk_type: "1, 2, 3, BHK Apartments",
    date: "26 Jan, 2023",
    price: "2500",

    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzeeEyTOTywdDDuqdQRF49FbHOCYCSt7NGEqhS_XcrFTAAHbUxD0rYaPuMPWG2lkfnPSU&usqp=CAU",
  },
];

const Advertisement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const currentItems = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showNextModal, setShowNextModal] = useState(false);

  const [selectedProperties, setSelectedProperties] = useState([]);
  const toggleSelect = (id) => {
    setSelectedProperties((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <h2 className="text-2xl font-semibold">Advertisement</h2>

          {/* Search Box in the middle */}
          <div className="relative">
            <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg px-10 py-2 w-72 outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <button
            className="my-bg text-white px-4 py-2 rounded-lg  flex items-center"
            onClick={() => setShowModal(true)}
          >
            Create New Ads{" "}
          </button>
        </div>

        {/* Property Listings */}
        <div className="mt-6 space-y-4">
          {currentItems.map((project) => (
            <div
              key={project.id}
              className={`bg-white shadow-sm rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between relative 
              ${project.published ? "" : "border-1 border-red-500"}`}
            >
              {/* Published Badge (Top Left Corner) */}
              <div
                className={`absolute top-2 left-6 text-xs font-medium px-3 py-1 rounded-md ${
                  project.published
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {project.published ? "Published" : "Rejected"}
              </div>
              {/* Left Section (Image + Badge) */}
              <div className="relative w-40 h-28 mt-3">
                {/* Property Image */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              {/* Middle Section (Details) */}
              <div className="ml-4 flex-1 mt-3">
                <h3 className="text-lg font-semibold mb-0">{project.title}</h3>
                <p className="text-gray-500 text-sm mb-0">{project.location}</p>
                <p className="text-black font-bold ">{project.bhk_type}</p>
                <p className="text-gray-400 text-sm ">
                  Posted on: {project.date}
                </p>
              </div>

              {/* Right Section (Stats & Actions) */}
              <div className="flex flex-col items-center gap-4 mt-4 md:mt-0">
                {/* Views and Leads - Now stacked */}
                <div className="flex gap-20 mt-3">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Views</p>
                    <p className="text-black font-semibold">0</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Leads</p>
                    <p className="text-black font-semibold">0</p>
                  </div>
                </div>

                {/* Buttons - Now positioned below Views & Leads */}
                <div className="flex gap-4">
                  <button className="border-1 border-rose-500 my-text px-4 py-1 rounded-lg">
                    Edit Project
                  </button>
                  {project.published ? (
                    <button className="border bg-white text-red-500 px-4 py-1 rounded-lg border-red-500">
                      Stop
                    </button>
                  ) : (
                    <button
                      className="border bg-white text-black px-4 py-1 rounded-lg border-black border-1"
                      onClick={() => setShowModal(true)}
                    >
                      View Reason
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
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
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 rounded-lg w-full max-w-md md:max-w-3xl relative">
            <div className="bg-white p-4 flex justify-center items-center border-b">
              <h2 className="text-xl font-semibold">Select Property</h2>

              <button
                className="absolute top-2 right-2 text-black hover:text-black text-2xl"
                onClick={() => setShowModal(false)}
              >
                <IoCloseCircleOutline />
              </button>
            </div>
            {/* 🔍 Search Box */}
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
            <div className="max-h-80 overflow-y-auto">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 bg-white rounded-xl p-2 mb-3 shadow-sm hover:shadow-md transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(project.id)}
                    onChange={() => toggleSelect(project.id)}
                    className="h-5 w-5 accent-rose-600"
                  />

                  {/* Image Container with Relative Position */}
                  <div className="relative w-24 h-24">
                    <img
                      src={project.image}
                      alt="Property"
                      className="w-full h-full rounded-lg object-cover"
                    />

                    {/* Tag Positioned at Top Right */}
                    <span className="absolute top-1 left-1 my-bg text-white text-xs px-2 rounded-md">
                      FOR RENT
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{project.title}</h3>
                    <p className="text-gray-500 text-sm">{project.location}</p>
                    <p className="text-lg font-bold mt-1">
                      ${project.price}/month
                    </p>
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

      {/* Second Modal */}
      {showNextModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 rounded-lg w-full max-w-md md:max-w-3xl relative max-h-[90vh] overflow-y-auto">
            <div className="bg-white p-4 flex justify-center items-center border-b">
              <button
                className="absolute top-2 left-2 text-black hover:text-black text-2xl"
                onClick={() => {
                  setShowNextModal(false);
                  setShowModal(true); // Reopen the first modal
                }}
              >
                <IoArrowBackCircleOutline />
              </button>
              <h2 className="text-xl font-semibold">Create A Advertisement</h2>
              <button
                className="absolute top-2 right-2 text-black hover:text-black text-2xl"
                onClick={() => setShowNextModal(false)}
              >
                <IoCloseCircleOutline />
              </button>
            </div>

            {/* Property Card */}
            <div className="flex items-center bg-white p-3 rounded-lg">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzeeEyTOTywdDDuqdQRF49FbHOCYCSt7NGEqhS_XcrFTAAHbUxD0rYaPuMPWG2lkfnPSU&usqp=CAU"
                alt="Property"
                className="w-16 h-16 rounded-md object-cover"
              />
              <div className="ml-3">
                <p className="font-semibold">Home in Metric Way</p>
                <p className="text-gray-500 text-sm">
                  1421 San Pedro St, Los Angeles
                </p>
                <p className="text-black font-bold">
                  $2500 <span className="text-gray-500">/month</span>
                </p>
              </div>
            </div>

            {/* Modal Body with Two Columns */}
            <div className="flex flex-col md:flex-row p-4 gap-6 bg-white">
              {/* Left Section - Upload Images */}
              <div className="md:w-1/2 flex flex-col items-center justify-center bg-gray-100 p-2 border-dashed border-2 border-gray-300 rounded-xl">
                <div className="   p-6 text-center w-full">
                  <p className="text-gray-500 mb-2">Upload Large Images</p>
                  <button className="my-bg text-white px-4 py-2 rounded-lg text-sm">
                    + Add Photos
                  </button>
                </div>
              </div>

              <div className="md:w-1/2 flex flex-col items-center justify-center bg-gray-100 p-2 border-dashed border-2 border-gray-300 rounded-xl">
                <div className="   p-6 text-center w-full">
                  <p className="text-gray-500 mb-2">Upload Mobile Images</p>
                  <button className="my-bg text-white px-4 py-2 rounded-lg text-sm">
                    + Add Photos
                  </button>
                </div>
              </div>
            </div>
            <div className="px-3 py-2 bg-white">
              <input
                type="text"
                value={Advertisement}
                placeholder="Ads Time"
                className="flex justify-center w-full h-12 px-4  border border-gray-300 rounded-md text-sm "
              />
            </div>

            {/* Footer */}
            <div className="bg-white flex justify-between items-center p-4 border-t">
              <p className="text-gray-500 text-sm">1 Property Selected</p>
              <button
                className="my-bg text-white px-4 py-2 rounded-lg"
                onClick={() => setShowNextModal(false)}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Advertisement;
