import React, { useState } from "react";

const AllDeveloper = () => {
  // Sample data for developers
  const developers = [
    {
      id: 1,
      name: "John Doe",
      image: "/image/dev1.AVIF",
      company: "XYZ Developers",
      description:
        "John is an experienced developer specializing in residential properties.",
      projects: 25,
    },
    {
      id: 2,
      name: "Jane Smith",
      image: "/image/dev2.AVIF",
      company: "ABC Builders",
      description:
        "Jane has been in the real estate industry for over 10 years.",
      projects: 40,
    },
    {
      id: 3,
      name: " Alice Johnson",
      image: "/image/dev3.AVIF",
      company: "XYZ Developers",
      description:
        "John is an experienced developer specializing in residential properties.",
      projects: 25,
    },
    // Add more developers as needed
    {
      id: 4,
      name: "Bob Brown",
      image: "/image/dev4.AVIF",
      company: "XYZ Developers",
      description:
        "John is an experienced developer specializing in residential properties.",
      projects: 25,
    },
    {
      id: 5,
      name: "Bob Brown",
      image: "/image/dev4.AVIF",
      company: "ABC Builders",
      description:
        "Jane has been in the real estate industry for over 10 years.",
      projects: 40,
    },
    {
      id: 6,
      name: "Tob Crown",
      image: "/image/dev5.AVIF",
      company: "XYZ Developers",
      description:
        "John is an experienced developer specializing in residential properties.",
      projects: 25,
    },
    {
      id: 6,
      name: "Tob Crown",
      image: "/image/dev5.AVIF",
      company: "XYZ Developers",
      description:
        "John is an experienced developer specializing in residential properties.",
      projects: 25,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const developersPerPage = 3; // Number of developers to display per page

  // Calculate the total number of pages
  const totalPages = Math.ceil(developers.length / developersPerPage);

  // Get current developers to display based on the current page
  const indexOfLastDeveloper = currentPage * developersPerPage;
  const indexOfFirstDeveloper = indexOfLastDeveloper - developersPerPage;
  const currentDevelopers = developers.slice(
    indexOfFirstDeveloper,
    indexOfLastDeveloper,
  );

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        All Developers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentDevelopers.map((developer) => (
          <div key={developer.id} className="bg-white rounded-lg shadow-md p-4">
            <img
              src={developer.image}
              alt={developer.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {developer.name}
              </h3>
              <p className="text-gray-600">{developer.company}</p>
              <p className="text-sm text-gray-700 mt-2">
                {developer.description}
              </p>
              <p className="my-text mt-4">
                {developer.projects} projects completed
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handleClick(index + 1)}
            className={`mx-1 px-3 py-1 rounded-full ${
              currentPage === index + 1
                ? "my-bg text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllDeveloper;
