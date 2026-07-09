import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import axios from "axios";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AiFillHome, AiOutlineUser } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import ContactDetails from "../containers/ContactDetails";

const ProjectBuilder = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("accessToken");
  const [projects, setProjects] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState();
  const [nextPage, setNextPages] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);
  const propertiesPerPage = 6;

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [openContactModalAfterLogin, setOpenContactModalAfterLogin] =
    useState(false);

  useEffect(() => {
    if (id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, id, userId]);

  // useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("accessToken") && openContactModalAfterLogin) {
      setIsContactModalOpen(true);
      setOpenContactModalAfterLogin(false);
    }
  }, [openContactModalAfterLogin]);

  const fetchProjects = async () => {
    try {
      const formData = new FormData();
      formData.append("user_id", id);
      formData.append("customer_id", userId);
      formData.append("page", currentPage);
      formData.append("page_size", propertiesPerPage);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/agent_project_list`,
        formData,
      );

      if (response.data && response.data.data) {
        setProjects(response.data.data);
        setUserDetails(response.data.user_details);
        setTotalCount(response.data.total_count || 0);
        setTotalPages(response.data.total_pages || 0);
        setCurrentPage(response.data.current_page || 0);
        setNextPages(response.data.next_page || 0);
        setPreviousPage(response.data.previous_page || 0);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error fetching agent projects:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("userdetails", userDetails);

  useEffect(() => {
    if (id) {
      fetchProjects();
    }
  }, [id, currentPage]);

  if (loading) return <p>Loading projects...</p>;

  // Pagination Handlers
  const handlePrev = () => {
    previousPage && setCurrentPage(currentPage + 1);
  };

  const handleNext = () => {
    nextPage && setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className="min-h-screen ">
        <div className="bg-white shadow-lg rounded-2xl ">
          <div className="relative w-full h-auto p-2 mb-4 rounded-lg shadow-sm bg-rose-50">
            {userDetails &&
              Array.isArray(userDetails) &&
              userDetails.length > 0 && (
                <>
                  {/* Extract builder info */}
                  {(() => {
                    const builder = userDetails[0];
                    return (
                      <>
                        {/* Agent Info */}
                        <div className="flex items-center gap-4 pb-6 ml-4">
                          <img
                            src={builder.profile_image || "/default-avatar.jpg"}
                            alt="Agent"
                            className="object-cover w-12 h-12 rounded-full"
                          />
                          <div>
                            <h1 className="text-2xl font-semibold">
                              {builder.full_name}
                            </h1>
                            <p className="text-gray-600">{builder.user_type}</p>
                          </div>
                          <button
                            className="px-4 py-2 ml-auto text-white my-bg rounded-lg"
                            onClick={() => {
                              const token =
                                sessionStorage.getItem("accessToken");
                              if (token) {
                                setIsContactModalOpen(true);
                              } else {
                                setOpenContactModalAfterLogin(true);
                                setIsLoginModalOpen(true);
                              }
                            }}
                          >
                            Contact Builder
                          </button>
                        </div>

                        {isContactModalOpen && (
                          <ContactDetails
                            onClose={() => setIsContactModalOpen(false)}
                            fullName={builder.full_name}
                            mobile={builder.mobile_number}
                          />
                        )}

                        {/* Agent Stats */}
                        <div className="flex items-center ml-8 space-x-8">
                          <div className="flex flex-col items-center pr-4 border-r-2 border-rose-100">
                            <p className="flex items-center">
                              <AiFillHome className="text-xl text-rose-700" />
                              <span className="ml-1">
                                {builder.experience}
                              </span>{" "}
                              years
                            </p>
                            <span className="text-sm leading-none text-gray-600">
                              Experience
                            </span>
                          </div>

                          <div className="flex flex-col items-center px-4 border-r-2 border-rose-100">
                            <p className="flex items-center">
                              <AiFillHome className="text-xl text-rose-700" />
                              <span className="ml-1">{totalCount}</span>
                            </p>
                            <span className="text-sm leading-none text-gray-600">
                              Properties
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
          </div>
          <div className="ml-4 ">
            <p className="text-2xl font-medium text-black">Projects</p>
          </div>

          {/* Property List 2 */}
          <div className="py-4 ml-10 mr-10 bg-white rounded-2xl">
            <div className="flex items-center justify-between px-3 py-2">
              {/* Title and Subtitle */}
              {/* Navigation Buttons */}
            </div>

            <div className="grid grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <div key={index} className="bg-white shadow-md rounded-3xl">
                  {/* Image Section */}
                  <div className="relative">
                    <Link
                      to={`/projectdetail/${project._id}`}
                      className="block"
                    >
                      <img
                        src={project.cover_image}
                        alt={project.project_name}
                        className="w-full h-[350px] object-cover rounded-3xl"
                      />
                    </Link>
                    {/* Gradient Overlay - Centered */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[80%] sm:w-80 h-[100px] bg-gray-800/60 backdrop-blur-md flex flex-col justify-end p-4 rounded-t-3xl">
                      {/* Logo inside white circle */}
                      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 w-[55px] h-[55px] rounded-full flex justify-center items-center shadow-lg overflow-hidden">
                        <img
                          src={project.logo}
                          alt="Project Logo"
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Project Title */}
                      <h3 className="text-lg font-semibold text-center text-white">
                        {project.project_name}
                      </h3>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="px-6 py-4 text-center">
                    <p className="text-xs text-gray-500 sm:text-sm">
                      {project.project_description}
                    </p>
                    <h4 className="mt-2 text-lg font-bold text-gray-800 sm:text-md">
                      {project.average_project_price}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={handlePrev}
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
                    ${
                      currentPage === i + 1
                        ? "my-border text-black font-normal"
                        : "text-gray-700"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 
                  ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <MdOutlineNavigateNext className="text-xl text-gray-700" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectBuilder;
