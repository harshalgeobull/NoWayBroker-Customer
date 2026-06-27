// import { useState, useEffect, useRef, useCallback } from "react";
// import { useHistory } from "react-router-dom";
// import axios from "axios";
// import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
// import { Heart } from "lucide-react";
// import { toast } from "react-toastify";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
// import { FaRupeeSign } from "react-icons/fa";
// import ShareModal from "./ShareModal";

// const FALLBACK_IMAGE = "/image/placeholder.png"; // update to your actual placeholder path

// const ProjectList = () => {
//   const sliderRef = useRef(null);
//   const history = useHistory();
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [currentShareUrl, setCurrentShareUrl] = useState("");
//   const [projects, setProjects] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [projectList, setProjectList] = useState([]);
//   const itemsPerPage = 8;

//   const openSpotlightShareModal = useCallback((projectId) => {
//     const baseUrl = window.location.origin;
//     const fullUrl = `${baseUrl}/projectdetail/${projectId}`;
//     setCurrentShareUrl(fullUrl);
//     setShowShareModal(true);
//   }, []);

//   const closeShareModal = useCallback(() => {
//     setShowShareModal(false);
//   }, []);

//   const copyLink = useCallback(() => {
//     navigator.clipboard.writeText(currentShareUrl);
//     alert("Link copied: " + currentShareUrl);
//   }, [currentShareUrl]);

//   const fetchProjects = async () => {
//     try {
//       const token = sessionStorage.getItem("accessToken");
//       const formData = new FormData();
//       if (token) {
//         formData.append("user_id", token);
//       }

//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/cust_api/all_project_list`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         },
//       );

//       setProjects(Array.isArray(response.data.data) ? response.data.data : []);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       setProjects([]);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   // Pagination logic
//   const totalPages = Math.ceil(projects.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const visibleProjects = projects.slice(startIndex, startIndex + itemsPerPage);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [currentPage]);

//   const formatPrice = (price) => {
//     if (!price) return "";
//     price = parseInt(price);

//     if (price >= 10000000) {
//       return parseFloat((price / 10000000).toFixed(1)) + " Cr";
//     } else if (price >= 100000) {
//       return parseFloat((price / 100000).toFixed(1)) + " L";
//     } else if (price >= 1000) {
//       return parseFloat((price / 1000).toFixed(1)) + " K";
//     } else {
//       return price.toString();
//     }
//   };

//   const formatAverageProjectPrice = (price) => {
//     if (!price) return "";

//     if (typeof price === "string" && price.includes("-")) {
//       const parts = price.split("-").map((p) => p.trim());
//       return (
//         <>
//           {parts.map((p, idx) => (
//             <span key={idx} className="inline-flex items-center">
//               <FaRupeeSign className="inline-block mr-1" />
//               {formatPrice(p)}
//               {idx === 0 && " - "}
//             </span>
//           ))}
//         </>
//       );
//     }

//     price = parseInt(price);
//     if (isNaN(price)) return "";

//     let formatted;
//     if (price >= 10000000) {
//       formatted = parseFloat((price / 10000000).toFixed(1)) + " Cr";
//     } else if (price >= 100000) {
//       formatted = parseFloat((price / 100000).toFixed(1)) + " L";
//     } else if (price >= 1000) {
//       formatted = parseFloat((price / 1000).toFixed(1)) + " K";
//     } else {
//       formatted = price.toString();
//     }

//     return (
//       <span className="inline-flex items-center">
//         <FaRupeeSign className="inline-block mr-1" />
//         {formatted}
//       </span>
//     );
//   };

//   // Add to favorites
//   const addToFavoritesRecommendedProperty = async (projectId) => {
//     if (!sessionStorage.getItem("accessToken")) {
//       toast.error("Please login to add to favorites");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("user_id", sessionStorage.getItem("accessToken"));
//       formData.append("project_id", projectId);

//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/cust_api/add_favorite_project`,
//         formData,
//       );

//       const favId = res.data?.favorite_id || projectId;

//       setProjects((prev) =>
//         prev.map((proj) =>
//           proj._id === projectId
//             ? { ...proj, is_favorite: true, favorite_id: favId }
//             : proj,
//         ),
//       );
//       fetchProjects();
//     } catch (error) {
//       toast.error("Failed to save the Project. Please try again.");
//     }
//   };

//   // Remove from favorites
//   const removeFromFavoritesRecommendedProperty = async (
//     favoriteId,
//     projectId,
//   ) => {
//     try {
//       const formData = new FormData();
//       formData.append("favorite_id", favoriteId);

//       await axios.delete(
//         `${process.env.REACT_APP_API_URL}/cust_api/remove_favorite_project`,
//         {
//           data: formData,
//         },
//       );

//       setProjects((prev) =>
//         prev.map((proj) =>
//           proj._id === projectId
//             ? { ...proj, is_favorite: false, favorite_id: null }
//             : proj,
//         ),
//       );
//       fetchProjects();
//     } catch (error) {
//       toast.error("Failed to remove the Project. Please try again.");
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen">
//         <div className="bg-transparent rounded-2xl">
//           <div className="bg-transparent py-4 ml-10 mr-10 rounded-2xl">
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-black">All Projects</p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
//               {visibleProjects.map((project) => (
//                 <div
//                   key={project._id}
//                   className="bg-white rounded-[24px] shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
//                 >
//                   {/* Image Section */}
//                   <div className="relative">
//                     <img
//                       src={project.cover_image || project.logo || FALLBACK_IMAGE}
//                       alt={project.project_name}
//                       className="w-full h-[350px] object-cover"
//                       onClick={() =>
//                         history.push(`/projectdetail/${project._id}`)
//                       }
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = FALLBACK_IMAGE;
//                       }}
//                     />

//                     {/* Heart + Share Icons */}
//                     <div className="absolute top-2 right-2 flex items-center space-x-2">
//                       <button
//                         className="bg-gray-800/60 backdrop-blur-sm p-2 rounded-full shadow"
//                         onClick={() => {
//                           if (!sessionStorage.getItem("accessToken")) {
//                             toast.error("Please login to add to favorites");
//                             return;
//                           }
//                           if (project.is_favorite) {
//                             removeFromFavoritesRecommendedProperty(
//                               project.favorite_id,
//                               project._id,
//                             );
//                           } else {
//                             addToFavoritesRecommendedProperty(project._id);
//                           }
//                         }}
//                       >
//                         <Heart
//                           size={22}
//                           stroke={project.is_favorite ? "none" : "white"}
//                           color={
//                             project.is_favorite
//                               ? "red"
//                               : "rgba(75, 85, 99, 0.4) "
//                           }
//                           fill={
//                             project.is_favorite
//                               ? "red"
//                               : "rgba(75, 85, 99, 0.4) "
//                           }
//                           strokeWidth={2}
//                         />
//                       </button>

//                       <FontAwesomeIcon
//                         icon={faShareNodes}
//                         className="text-gray-500 bg-white p-2 rounded shadow cursor-pointer"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           openSpotlightShareModal(project._id);
//                         }}
//                       />
//                     </div>

//                     {/* Name + Badge overlay */}
//                     <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[85%] h-[90px] bg-gray-800/60 backdrop-blur-md flex flex-col justify-end p-3 rounded-t-3xl">
//                       <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 w-[55px] h-[55px] rounded-full flex justify-center items-center shadow-lg overflow-hidden">
//                         <img
//                           src={project.logo || project.cover_image || FALLBACK_IMAGE}
//                           alt={project.project_name}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = FALLBACK_IMAGE;
//                           }}
//                         />
//                       </div>

//                       <h3 className="text-center text-white text-lg font-semibold">
//                         {project.project_name || "Not Project Name Available"}
//                       </h3>
//                     </div>
//                   </div>

//                   {/* Project Details */}
//                   <div className="px-6 pt-5 pb-6">
//                     <div className="p-3 bg-white shadow-sm rounded-b-3xl">
//                       <p className="text-[17px] text-gray-500 p-0 m-1 truncate whitespace-nowrap overflow-hidden">
//                         {project.congfigurations
//                           ? project.congfigurations.includes("BHK")
//                             ? project.congfigurations
//                             : project.congfigurations
//                               .split(",")
//                               .map((c) => `${c.trim()} BHK`)
//                               .join(", ")
//                           : "No Configurations"}
//                       </p>

//                       <p className="text-sm text-gray-500 p-0 m-1">
//                         {project.project_type}
//                       </p>
//                       <p className="text-sm font-bold text-gray-500 mt-1 flex items-center gap-2">
//                         <img
//                           src="/image/address_icon.png"
//                           alt="Location Icon"
//                           className="w-4 h-4 object-contain"
//                         />
//                         {project.address_area || "No Address Provided"}
//                       </p>

//                       <div className="flex-1">
//                         {project.project_properties &&
//                           project.project_properties.length > 0 &&
//                           (() => {
//                             const prices = project.project_properties.map((p) =>
//                               Number(p.price),
//                             );
//                             const minPrice = Math.min(...prices);
//                             const maxPrice = Math.max(...prices);

//                             return (
//                               <h4 className="flex items-center text-xl font-bold my-text mb-0 sm:text-2xl">
//                                 {minPrice === maxPrice ? (
//                                   formatAverageProjectPrice(minPrice)
//                                 ) : (
//                                   <>
//                                     {formatAverageProjectPrice(minPrice)}{" "}
//                                     <span className="mx-1">-</span>{" "}
//                                     {formatAverageProjectPrice(maxPrice)}
//                                   </>
//                                 )}
//                               </h4>
//                             );
//                           })()}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Pagination Controls */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center mt-6 gap-2">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 
//                 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 <MdOutlineNavigateBefore className="text-xl text-gray-700" />
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors 
//                   ${currentPage === i + 1 ? "my-border text-black font-normal" : "text-gray-700"}`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}

//               <button
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages}
//                 className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 
//                 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 <MdOutlineNavigateNext className="text-xl text-gray-700" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       {showShareModal && (
//         <ShareModal
//           currentShareUrl={currentShareUrl}
//           closeShareModal={closeShareModal}
//           copyLink={copyLink}
//         />
//       )}
//     </>
//   );
// };

// export default ProjectList;



/////old code 



// import { useState, useEffect, useRef, useCallback } from "react";
// import { useHistory } from "react-router-dom";
// import axios from "axios";
// import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
// import { Heart } from "lucide-react";
// import { toast } from "react-toastify";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
// import { FaRupeeSign } from "react-icons/fa";
// import ShareModal from "./ShareModal";

// const ProjectList = () => {
//   const history = useHistory();
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [currentShareUrl, setCurrentShareUrl] = useState("");
//   const [projects, setProjects] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8;

//   const openSpotlightShareModal = useCallback((projectId) => {
//     const baseUrl = window.location.origin;
//     const fullUrl = `${baseUrl}/projectdetail/${projectId}`;
//     setCurrentShareUrl(fullUrl);
//     setShowShareModal(true);
//   }, []);

//   const closeShareModal = useCallback(() => {
//     setShowShareModal(false);
//   }, []);

//   const copyLink = useCallback(() => {
//     navigator.clipboard.writeText(currentShareUrl);
//     alert("Link copied: " + currentShareUrl);
//   }, [currentShareUrl]);

//   const handleProjectClick = (projectId) => {
//     history.push(`/projectdetail/${encodeURIComponent(projectId)}`);
//   };

//   const fetchProjects = async () => {
//     try {
//       const token = sessionStorage.getItem("accessToken");
//       const formData = new FormData();
//       if (token) {
//         formData.append("user_id", token);
//       }

//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/cust_api/all_project_list`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         },
//       );

//       setProjects(Array.isArray(response.data.data) ? response.data.data : []);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       setProjects([]);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   // Pagination logic
//   const totalPages = Math.ceil(projects.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const visibleProjects = projects.slice(startIndex, startIndex + itemsPerPage);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [currentPage]);

//   const formatPrice = (price) => {
//     if (!price) return "";
//     price = parseInt(price);

//     if (price >= 10000000) {
//       return parseFloat((price / 10000000).toFixed(1)) + " Cr";
//     } else if (price >= 100000) {
//       return parseFloat((price / 100000).toFixed(1)) + " L";
//     } else if (price >= 1000) {
//       return parseFloat((price / 1000).toFixed(1)) + " K";
//     } else {
//       return price.toString();
//     }
//   };

//   const formatAverageProjectPrice = (price) => {
//     if (!price) return "";

//     // If it's a range (contains "-"), split and format both
//     if (typeof price === "string" && price.includes("-")) {
//       const parts = price.split("-").map((p) => p.trim());
//       return (
//         <>
//           {parts.map((p, idx) => (
//             <span key={idx} className="inline-flex items-center">
//               <FaRupeeSign className="inline-block mr-1" />
//               {formatPrice(p)}
//               {idx === 0 && " - "}
//             </span>
//           ))}
//         </>
//       );
//     }

//     // Normal number formatting
//     price = parseInt(price);
//     if (isNaN(price)) return "";

//     let formatted;
//     if (price >= 10000000) {
//       formatted = parseFloat((price / 10000000).toFixed(1)) + " Cr";
//     } else if (price >= 100000) {
//       formatted = parseFloat((price / 100000).toFixed(1)) + " L";
//     } else if (price >= 1000) {
//       formatted = parseFloat((price / 1000).toFixed(1)) + " K";
//     } else {
//       formatted = price.toString();
//     }
//     return (
//       <span className="inline-flex items-center">
//         <FaRupeeSign className="inline-block mr-1" />
//         {formatted}
//       </span>
//     );
//   };

//   // Add to favorites
//   const addToFavoritesRecommendedProperty = async (projectId) => {
//     if (!sessionStorage.getItem("accessToken")) {
//       toast.error("Please login to add to favorites");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("user_id", sessionStorage.getItem("accessToken"));
//       formData.append("project_id", projectId);

//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/cust_api/add_favorite_project`,
//         formData,
//       );

//       const favId = res.data?.favorite_id || projectId;
//       setProjects((prev) =>
//         prev.map((proj) =>
//           proj._id === projectId
//             ? { ...proj, is_favorite: true, favorite_id: favId }
//             : proj,
//         ),
//       );
//       fetchProjects();
//     } catch (error) {
//       toast.error("Failed to save the Project. Please try again.");
//     }
//   };

//   // Remove from favorites
//   const removeFromFavoritesRecommendedProperty = async (
//     favoriteId,
//     projectId,
//   ) => {
//     try {
//       const formData = new FormData();
//       formData.append("favorite_id", favoriteId);

//       await axios.delete(
//         `${process.env.REACT_APP_API_URL}/cust_api/remove_favorite_project`,
//         {
//           data: formData,
//         },
//       );

//       setProjects((prev) =>
//         prev.map((proj) =>
//           proj._id === projectId
//             ? { ...proj, is_favorite: false, favorite_id: null }
//             : proj,
//         ),
//       );
//       fetchProjects();
//     } catch (error) {
//       toast.error("Failed to remove the Project. Please try again.");
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen">
//         <div className="bg-transparent rounded-2xl">
//           <div className="bg-transparent py-4 ml-10 mr-10 rounded-2xl">
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-black">All Projects</p>
//             </div>

//             {/* Same card grid using Spotlights card design */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 mt-4">
//               {visibleProjects.map((project, index) => (
//                 <div key={project._id || index} className="px-2 md:px-0">
//                   <div className="w-full overflow-hidden bg-white shadow-lg rounded-3xl hover:shadow-xl transition-all duration-300">
//                     <div className="relative">
//                       <img
//                         src={project.cover_image}
//                         alt={project.project_name}
//                         className="w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[320px] object-cover rounded-t-3xl cursor-pointer"
//                         onClick={() => handleProjectClick(project._id)}
//                       />
//                       <div className="absolute top-2 right-2 flex items-center space-x-2">
//                         <button
//                           className="bg-gray-800/60 backdrop-blur-sm p-2 rounded-full shadow"
//                           onClick={() => {
//                             if (!sessionStorage.getItem("accessToken")) {
//                               toast.error("Please login to add to favorites");
//                               return;
//                             }
//                             if (project.is_favorite) {
//                               removeFromFavoritesRecommendedProperty(
//                                 project.favorite_id,
//                                 project._id,
//                               );
//                             } else {
//                               addToFavoritesRecommendedProperty(project._id);
//                             }
//                           }}
//                         >
//                           <Heart
//                             size={20}
//                             stroke={project.is_favorite ? "none" : "white"}
//                             color={
//                               project.is_favorite
//                                 ? "red"
//                                 : "rgba(75, 85, 99, 0.4) "
//                             }
//                             fill={
//                               project.is_favorite
//                                 ? "red"
//                                 : "rgba(75, 85, 99, 0.4) "
//                             }
//                             strokeWidth={2}
//                           />
//                         </button>

//                         <FontAwesomeIcon
//                           icon={faShareNodes}
//                           className="text-gray-500 bg-white p-2 rounded shadow cursor-pointer"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             openSpotlightShareModal(project._id);
//                           }}
//                         />
//                       </div>

//                       <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[90%] sm:w-[85%] md:w-[80%] h-[90px] md:h-[100px] bg-gray-800/60 backdrop-blur-md flex flex-col justify-end p-4 rounded-t-3xl">
//                         <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full flex justify-center items-center shadow-lg overflow-hidden">
//                           <img
//                             src={project.logo}
//                             alt="Project Logo"
//                             className="object-cover w-full h-full"
//                           />
//                         </div>

//                         <h3 className="text-center text-white text-base md:text-lg font-semibold line-clamp-2 min-h-[48px]">
//                           {project.project_name || "No Project Name Available"}
//                         </h3>
//                       </div>
//                     </div>

//                     <div className="px-0">
//                       <div className="p-4 bg-white rounded-b-3xl">
//                         <p className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2">
//                           {project.congfigurations
//                             ? project.congfigurations.includes("BHK")
//                               ? project.congfigurations
//                               : project.congfigurations
//                                 .split(",")
//                                 .map((c) => `${c.trim()} BHK`)
//                                 .join(", ")
//                             : "No Configurations"}
//                         </p>

//                         <p className="text-xs uppercase tracking-wider text-gray-400 mt-2">
//                           {project.project_type}
//                         </p>
//                         <p className="text-sm md:text-base font-semibold text-slate-800 mt-2 flex items-center gap-2 line-clamp-1">
//                           {project.address_area || "No Address Provided"}
//                         </p>

//                         <div className="flex-1 mt-3">
//                           {project.average_project_price && (
//                             <h4 className="text-xl md:text-2xl font-bold text-slate-800 mt-3">
//                               {formatAverageProjectPrice(
//                                 Number(project.average_project_price),
//                               )}
//                             </h4>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Pagination Controls */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center mt-6 gap-2">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 
//                 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 <MdOutlineNavigateBefore className="text-xl text-gray-700" />
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors 
//                   ${currentPage === i + 1 ? "my-border text-black font-normal" : "text-gray-700"}`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}

//               <button
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages}
//                 className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 
//                 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 <MdOutlineNavigateNext className="text-xl text-gray-700" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       {showShareModal && (
//         <ShareModal
//           currentShareUrl={currentShareUrl}
//           closeShareModal={closeShareModal}
//           copyLink={copyLink}
//         />
//       )}
//     </>
//   );
// };

// export default ProjectList;


/////////NEW COde 3



import { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FaRupeeSign } from "react-icons/fa";
import ShareModal from "./ShareModal";

const ProjectList = () => {
  const history = useHistory();
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const openSpotlightShareModal = useCallback((projectId) => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/projectdetail/${projectId}`;
    setCurrentShareUrl(fullUrl);
    setShowShareModal(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setShowShareModal(false);
  }, []);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(currentShareUrl);
    alert("Link copied: " + currentShareUrl);
  }, [currentShareUrl]);

  const handleProjectClick = (projectId) => {
    history.push(`/projectdetail/${encodeURIComponent(projectId)}`);
  };

  const fetchProjects = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const formData = new FormData();
      if (token) {
        formData.append("user_id", token);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/all_project_list`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setProjects(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const formatPrice = (price) => {
    if (!price) return "";
    price = parseInt(price);

    if (price >= 10000000) {
      return parseFloat((price / 10000000).toFixed(1)) + " Cr";
    } else if (price >= 100000) {
      return parseFloat((price / 100000).toFixed(1)) + " L";
    } else if (price >= 1000) {
      return parseFloat((price / 1000).toFixed(1)) + " K";
    } else {
      return price.toString();
    }
  };

  const formatAverageProjectPrice = (price) => {
    if (!price) return "";

    // If it's a range (contains "-"), split and format both
    if (typeof price === "string" && price.includes("-")) {
      const parts = price.split("-").map((p) => p.trim());
      return (
        <>
          {parts.map((p, idx) => (
            <span key={idx} className="inline-flex items-center">
              <FaRupeeSign className="inline-block mr-1" />
              {formatPrice(p)}
              {idx === 0 && " - "}
            </span>
          ))}
        </>
      );
    }

    // Normal number formatting
    price = parseInt(price);
    if (isNaN(price)) return "";

    let formatted;
    if (price >= 10000000) {
      formatted = parseFloat((price / 10000000).toFixed(1)) + " Cr";
    } else if (price >= 100000) {
      formatted = parseFloat((price / 100000).toFixed(1)) + " L";
    } else if (price >= 1000) {
      formatted = parseFloat((price / 1000).toFixed(1)) + " K";
    } else {
      formatted = price.toString();
    }
    return (
      <span className="inline-flex items-center">
        <FaRupeeSign className="inline-block mr-1" />
        {formatted}
      </span>
    );
  };

  // Add to favorites
  const addToFavoritesRecommendedProperty = async (projectId) => {
    if (!sessionStorage.getItem("accessToken")) {
      toast.error("Please login to add to favorites");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user_id", sessionStorage.getItem("accessToken"));
      formData.append("project_id", projectId);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_favorite_project`,
        formData,
      );

      const favId = res.data?.favorite_id || projectId;
      setProjects((prev) =>
        prev.map((proj) =>
          proj._id === projectId
            ? { ...proj, is_favorite: true, favorite_id: favId }
            : proj,
        ),
      );
      fetchProjects();
    } catch (error) {
      toast.error("Failed to save the Project. Please try again.");
    }
  };

  // Remove from favorites
  const removeFromFavoritesRecommendedProperty = async (
    favoriteId,
    projectId,
  ) => {
    try {
      const formData = new FormData();
      formData.append("favorite_id", favoriteId);

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cust_api/remove_favorite_project`,
        {
          data: formData,
        },
      );

      setProjects((prev) =>
        prev.map((proj) =>
          proj._id === projectId
            ? { ...proj, is_favorite: false, favorite_id: null }
            : proj,
        ),
      );
      fetchProjects();
    } catch (error) {
      toast.error("Failed to remove the Project. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="bg-transparent rounded-2xl">
          <div className="bg-transparent py-4 ml-10 mr-10 rounded-2xl">
            <div className="ml-4">
              <p className="text-2xl font-bold text-black">All Projects</p>
            </div>

            {/* Equal height card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 mt-4">
              {visibleProjects.map((project, index) => (
                <div key={project._id || index} className="px-2 md:px-0 h-full">
                  <div className="w-full h-full flex flex-col overflow-hidden bg-white shadow-lg rounded-3xl hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <img
                        src={project.cover_image}
                        alt={project.project_name}
                        className="w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[320px] object-cover rounded-t-3xl cursor-pointer"
                        onClick={() => handleProjectClick(project._id)}
                      />
                      <div className="absolute top-2 right-2 flex items-center space-x-2">
                        <button
                          className="bg-gray-800/60 backdrop-blur-sm p-2 rounded-full shadow"
                          onClick={() => {
                            if (!sessionStorage.getItem("accessToken")) {
                              toast.error("Please login to add to favorites");
                              return;
                            }
                            if (project.is_favorite) {
                              removeFromFavoritesRecommendedProperty(
                                project.favorite_id,
                                project._id,
                              );
                            } else {
                              addToFavoritesRecommendedProperty(project._id);
                            }
                          }}
                        >
                          <Heart
                            size={20}
                            stroke={project.is_favorite ? "none" : "white"}
                            color={
                              project.is_favorite
                                ? "red"
                                : "rgba(75, 85, 99, 0.4) "
                            }
                            fill={
                              project.is_favorite
                                ? "red"
                                : "rgba(75, 85, 99, 0.4) "
                            }
                            strokeWidth={2}
                          />
                        </button>

                        <FontAwesomeIcon
                          icon={faShareNodes}
                          className="text-gray-500 bg-white p-2 rounded shadow cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            openSpotlightShareModal(project._id);
                          }}
                        />
                      </div>

                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[90%] sm:w-[85%] md:w-[80%] h-[90px] md:h-[100px] bg-gray-800/60 backdrop-blur-md flex flex-col justify-end p-4 rounded-t-3xl">
                        <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full flex justify-center items-center shadow-lg overflow-hidden">
                          <img
                            src={project.logo}
                            alt="Project Logo"
                            className="object-cover w-full h-full"
                          />
                        </div>

                        <h3 className="text-center text-white text-base md:text-lg font-semibold line-clamp-2 min-h-[48px]">
                          {project.project_name || "No Project Name Available"}
                        </h3>
                      </div>
                    </div>

                    <div className="px-0 flex flex-col flex-1">
                      <div className="p-4 bg-white rounded-b-3xl flex flex-col flex-1">
                        <p className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2 min-h-[28px] md:min-h-[32px]">
                          {project.congfigurations
                            ? project.congfigurations.includes("BHK")
                              ? project.congfigurations
                              : project.congfigurations
                                .split(",")
                                .map((c) => `${c.trim()} BHK`)
                                .join(", ")
                            : "No Configurations"}
                        </p>

                        <p className="text-xs uppercase tracking-wider text-gray-400 mt-2 min-h-[16px]">
                          {project.project_type}
                        </p>
                        <p className="text-sm md:text-base font-semibold text-slate-800 mt-2 flex items-center gap-2 line-clamp-1 min-h-[20px]">
                          {project.address_area || "No Address Provided"}
                        </p>

                        <div className="flex-1 mt-3 flex items-end">
                          <h4 className="text-xl md:text-2xl font-bold text-slate-800">
                            {project.average_project_price
                              ? formatAverageProjectPrice(
                                Number(project.average_project_price),
                              )
                              : "\u00A0"}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
      </div>
      {showShareModal && (
        <ShareModal
          currentShareUrl={currentShareUrl}
          closeShareModal={closeShareModal}
          copyLink={copyLink}
        />
      )}
    </>
  );
};

export default ProjectList;
