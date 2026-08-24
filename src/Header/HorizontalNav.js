// import React, { useState, useEffect, useContext, useRef } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { SearchContext } from "../containers/SearchContext";
// import NavbarSearch from "../containers/NavbarSearch";
// import Login1 from "../auth/Login1";
// import SignUp1 from "../auth/SignUp1";
// import { useHistory } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { IoCloseCircleOutline } from "react-icons/io5";

// import { FiUser, FiMenu, FiHeadphones, FiPhoneCall } from "react-icons/fi";
// const HorizontalNav = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const dropdownRef = useRef(null); // Reference to the dropdown menu
//   const { propertyCity, setPropertyCity } = useContext(SearchContext);
//   const { searchCity, setSearchCity } = useContext(SearchContext);
//   const [inputValue, setInputValue] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [type, setType] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const location = useLocation();
//   const history = useHistory();
//   const isPropertyDashboard = location.pathname === "/property-dashboard";
//   const [profileImage, setProfileImage] = useState("");
//   const [showLogoPreview, setShowLogoPreview] = useState(false);
//   const [isContactOpen, setIsContactOpen] = useState(false);
//   const navTabRefs = useRef({});
//   const navTabsContainerRef = useRef(null);
// const [navIndicatorStyle, setNavIndicatorStyle] = useState({
//   left: 0,
//   width: 0,
//   opacity: 0,
// });
// const moveNavIndicator = (key) => {
//   const el = navTabRefs.current[key];

//   if (el) {
//     setNavIndicatorStyle({
//       left: el.offsetLeft - 32,
//       top: el.offsetTop + el.offsetHeight + 4,
//       width: el.getBoundingClientRect().width,
//       opacity: 1,
//     });
//   }
// };

// const handleNavMouseEnter = (key) => {
//   moveNavIndicator(key);
// };

// const handleNavMouseLeave = () => {
//   setNavIndicatorStyle((prev) => ({
//     ...prev,
//     opacity: 0,
//   }));
// };
//   const searchBarRoutes = [
//     "/property",
//     "/advisordashboard",
//     "/searchdashboard",
//     "/allproperties",
//   ];

//   const showSearchBar =
//     [

//       "/searchdashboard",
//       "/property",
//       "/advisordashboard",
//       "/featuredDashboard",
//       "/recommendedpropertiesDashboard",
//     ].includes(location.pathname) ||
//     location.pathname.startsWith("/citywiseproperties");

//   const hideTabLinks = showSearchBar;

//   // useEffect(() => {
//   //   if (!showSearchBar) {
//   //     setSearchCity("");
//   //     setInputValue("");
//   //   }
//   // }, [location.pathname]);

//   const checkLoginStatus = () => {
//     const userId = sessionStorage.getItem("accessToken");
//     setIsLoggedIn(!!userId);
//   };
//   useEffect(() => {
//     if (isContactOpen) {
//       const timer = setTimeout(() => {
//         setIsContactOpen(false);
//       }, 5000); // Closes after 5 seconds
//       return () => clearTimeout(timer);
//     }
//   }, [isContactOpen]);

//   useEffect(() => {
//     checkLoginStatus();
//     const intervalId = setInterval(checkLoginStatus, 1000);
//     return () => clearInterval(intervalId);
//   }, []);

//   const handleLogout = () => {
//     setShowModal(true); // open custom modal
//   };

//   const confirmLogout = () => {
//     sessionStorage.clear();
//     setShowModal(false);
//     toast.success("Logout Successfully");
//     setIsLoggedIn(false);
//     history.push("/");
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setIsDropdownOpen(false);
//       }
//     };

//     if (isDropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isDropdownOpen]);

//   const [freePostCount, setFreePostCount] = useState(0);
//   const userId = sessionStorage.getItem("accessToken");
//   const userType = sessionStorage.getItem("user_type");

//   useEffect(() => {
//     const checkPostLimits = async () => {
//       try {
//         const profileForm = new FormData();
//         profileForm.append("user_id", userId);

//         const profileResponse = await axios.post(
//           `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
//           profileForm,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           },
//         );

//         const countData = profileResponse?.data?.count_data;

//         if (countData) {
//           setFreePostCount(countData.free_post_count || 0);
//         }
//         setProfileImage(profileResponse?.data?.data?.profile_image || "");
//       } catch (error) {
//         console.error("Error checking post limits:", error);
//       }
//     };

//     if (userId) {
//       checkPostLimits();
//     }
//   }, [userId]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   // Prevent background scrolling when modal is open
//   useEffect(() => {
//     if (isLoginModalOpen || isSignUpModalOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//     // Cleanup when component unmounts
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isLoginModalOpen, isSignUpModalOpen]);

//   return (
//     <nav className="flex flex-wrap items-center justify-between px-4 py-3 text-sm font-light bg-white rounded-lg md:flex-nowrap lg:px-8 gap-y-4 md:gap-y-0 shadow-sm">

//       {/* 1. Left side: Logo */}
//       <div className="flex items-center justify-between w-full md:w-auto flex-shrink-0">
//         <Link to="/" className="cursor-pointer">
//           <img
//             src="/image/app.png"
//             alt="NoWayBroker Logo"
//             className="w-[120px] h-[115px]"
//           />
//         </Link>
//         {/* 1. Left side: Logo */}
//         {/* <div className="flex items-center justify-between w-full md:w-auto flex-shrink-0">
//         <Link to="/" className="flex items-center">
//           <img
//             src="/image/app.png"
//             alt="NoWayBroker Logo"
//             className="w-full h-auto object-contain min-w-[64px] max-w-[160px]"
//           />
//         </Link> */}
//         {/* Hamburger Menu for Mobile */}
//         <button
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="md:hidden focus:outline-none"
//         >
//           <FiMenu className="text-2xl text-black" />
//         </button>
//       </div>

//       {/* --- DESKTOP WRAPPER (Forces Links & Buttons on ONE line) --- */}
//       <div
//         className={`${isMobileMenuOpen ? "flex" : "hidden"
//           } flex-col items-center w-full mt-2 space-y-4 md:space-y-0 md:mt-0 md:flex md:flex-row md:flex-1 md:justify-between md:ml-8`}
//       >

//         {/* 2. Middle: Navigation Tabs and Search Bar */}
//         <div className="flex justify-center w-full md:w-auto md:flex-1">
//           {showSearchBar && (
//             // <div className="flex items-center flex-wrap gap-2 my-border rounded-md px-3 py-2 w-full md:w-[300px] bg-white min-h-12">
//             //   {searchCity && (
//             //     <span className="flex items-center px-3 py-1 text-sm text-black bg-gray-200 rounded-full">
//             //       {searchCity}
//             //       <button
//             //         className="ml-2 text-black hover:text-gray-600 focus:outline-none"
//             //         onClick={() => setSearchCity("")}
//             //       >
//             //         ✕
//             //       </button>
//             //     </span>
//             //   )}

//             //   {searchQuery && (
//             //     <span className="flex items-center px-3 py-1 text-sm text-black bg-gray-200 rounded-full">
//             //       {searchQuery}
//             //       <button
//             //         className="ml-2 text-black hover:text-gray-600 focus:outline-none"
//             //         onClick={() => setSearchQuery("")}
//             //       >
//             //         ✕
//             //       </button>
//             //     </span>
//             //   )}

//             //   <input
//             //     type="text"
//             //     className="bg-transparent border-none outline-none"
//             //     placeholder="Search Location..."
//             //     value={inputValue}
//             //     onChange={(e) => setInputValue(e.target.value)}
//             //     onKeyDown={(e) => {
//             //       if (e.key === "Enter" && inputValue.trim() !== "") {
//             //         setSearchCity(inputValue.trim());
//             //         setInputValue("");
//             //       }
//             //     }}
//             //   />
//             // </div>
//             <NavbarSearch />
//           )}

//           {!hideTabLinks && (
//             <ul
//   className="relative flex flex-col items-center w-full p-0 m-0 space-y-4 md:flex-row md:space-y-0 md:space-x-4 lg:space-x-8 md:w-auto"
//   onMouseLeave={handleNavMouseLeave}
// >
//               <li>
//                 <Link
//  ref={(el) => { 
//     navTabRefs.current["buyers"] = el;
//   }}
//   onMouseEnter={() => handleNavMouseEnter("buyers")}
//   to={{
//     pathname: "/property",
//     state: {
//       propertyType: "Buy",
//       cityName: sessionStorage.getItem("cityName") || "",
//     },
//   }}
//   className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap"
// >
//   For Buyers
// </Link>
//               </li>
//               <li>
//                 <Link
//     ref={(el) => {
//       navTabRefs.current["tenants"] = el;
//     }}
//     onMouseEnter={() => handleNavMouseEnter("tenants")}
//     to={{
//       pathname: "/property",
//       state: {
//         propertyType: "Rent",
//         cityName: sessionStorage.getItem("cityName") || "",
//       },
//     }}
//     className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap"
//   >
//     For Tenants
//   </Link>
//               </li>
//               <li>
//                <Link
//     ref={(el) => {
//       navTabRefs.current["owners"] = el;
//     }}
//     onMouseEnter={() => handleNavMouseEnter("owners")}
//     to={{
//       pathname: "/advisordashboard",
//       search: "?label=Owner",
//       state: {
//         cityName: sessionStorage.getItem("cityName") || "",
//       },
//     }}
//     className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap"
//   >
//     For Owners
//   </Link>
//               </li>
//               <li>
//                 <Link
//     ref={(el) => {
//       navTabRefs.current["builders"] = el;
//     }}
//     onMouseEnter={() => handleNavMouseEnter("builders")}
//     to={{
//       pathname: "/advisordashboard",
//       search: "?label=Builder",
//       state: {
//         cityName: sessionStorage.getItem("cityName") || "",
//       },
//     }}
//     className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap"
//   >
//     For Builders
//   </Link>
//               </li>
//                {/* Add this here */}
//   <span
//     className="navbar-nav-tab-indicator hidden md:block"
//     style={{
//       left: navIndicatorStyle.left,
//       top: navIndicatorStyle.top,
//       width: navIndicatorStyle.width,
//       opacity: navIndicatorStyle.opacity,
//     }}
//   />
//             </ul>
//           )}
//         </div>

//         {/* 3. Right side: Buttons and Icons */}
//         <div className="flex flex-col items-center w-full space-y-4 md:w-auto md:flex-row md:space-y-0 md:space-x-3 lg:space-x-4 flex-shrink-0">

//           <Link
//             to="/download"
//             className="px-3 py-2 text-sm font-medium no-underline transition border rounded lg:text-base my-text border-rose-500 hover:text-rose-700 hover:no-underline whitespace-nowrap"
//           >
//             Download Mobile App
//           </Link>

//           {isLoggedIn ? (
//             <Link
//               to="/add_new_property"
//               className="px-3 py-2 text-sm font-medium text-center text-white no-underline transition border border-gray-300 rounded lg:text-base my-bg hover:my-bg hover:no-underline whitespace-nowrap"
//             >
//               Post Property{" "}
//               {freePostCount > 0 && (
//                 <span className="px-2 py-0 ml-1 text-xs text-black bg-green-500 rounded-full">
//                   FREE
//                 </span>
//               )}
//             </Link>
//           ) : (
//             <button
//               onClick={() => setIsLoginModalOpen(true)}
//               className="px-3 py-2 text-sm font-medium text-center text-white transition border border-gray-300 rounded lg:text-base my-bg hover:my-bg hover:no-underline whitespace-nowrap"
//             >
//               Post Property{" "}
//               <span className="px-2 py-0 ml-1 text-xs text-black bg-green-500 rounded-full">
//                 FREE
//               </span>
//             </button>
//           )}

//           {isLoggedIn && userType !== "Owner" && (
//             <Link
//               to="/add_new_project"
//               className="no-underline hover:no-underline whitespace-nowrap"
//             >
//               <button className="px-3 py-2 text-sm font-medium text-center text-white transition border border-gray-300 rounded lg:text-base my-bg hover:my-bg">
//                 Post Project
//               </button>
//             </Link>
//           )}

//           {/* Icons Block (Headphones & Profile) */}
//           <div className="flex items-center space-x-3 lg:space-x-4">

//             {/* Contact Us Popover */}
//             <div className="relative flex items-center">
//               <button
//                 onClick={() => setIsContactOpen(!isContactOpen)}
//                 className="flex items-center justify-center p-2 text-black transition bg-gray-100 rounded-full focus:outline-none hover:bg-gray-200"
//               >
//                 <FiHeadphones className="text-2xl" />
//               </button>

//               {isContactOpen && (
//                 <div className="absolute right-0 z-50 p-6 mt-2 bg-white border border-gray-200 shadow-2xl top-12 rounded-xl w-[340px]">
//                   <h4 className="mb-5 text-[13px] font-bold tracking-wider text-[#0f172a] uppercase">
//                     Contact Us
//                   </h4>

//                   {/* Toll Free */}
//                   <div className="flex items-start mb-6">
//                     {/* Solid Phone Icon */}
//                     <svg className="w-[18px] h-[18px] mt-1 mr-4 text-[#334155] fill-current" viewBox="0 0 24 24">
//                       <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
//                     </svg>
//                     <div>
//                       <p className="mb-1 text-[13px] font-medium text-gray-500 leading-tight">
//                         Toll Free | 9:30 AM to 6:30 PM <br /> (Mon-Sun)
//                       </p>
//                       <p className="text-[19px] font-bold text-[#1e293b]">
//                         +91 8600199570
//                       </p>
//                     </div>
//                   </div>

//                   {/* International Users */}
//                   {/* <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-start">
//                       {/* Solid Phone Icon */}
//                       {/* <svg className="w-[18px] h-[18px] mt-1 mr-4 text-[#334155] fill-current" viewBox="0 0 24 24">
//                         <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
//                       </svg>
//                       <div>
//                         <p className="mb-1 text-[13px] font-medium text-gray-500 leading-tight">
//                           For International Users
//                         </p>
//                         <p className="text-[19px] font-bold text-[#1e293b]">
//                           +91-120-6637501
//                         </p>
//                       </div>
//                     </div> */}
//                     {/* Small dark triangle arrow */}
//                     {/* <div className="mb-2 text-xl text-[#1e293b]">
//                       ▸
//                     </div> */}
//                   {/* </div> */} 

//                   {/* Call Back Button */}
//                   <button className="flex items-center justify-center w-full py-2.5 mb-4 text-[15px] font-bold text-[#4064d7] transition bg-white border-[1.5px] border-[#4064d7] rounded-[4px] hover:bg-blue-50">
//                     <FiPhoneCall className="mr-2 text-lg" /> Request a Call Back
//                   </button>

//                   {/* FAQ Link */}
//                   <p className="m-0 text-[13px] text-gray-800">
//                     To check all the FAQ{" "}
//                     <Link to="/faq" className="text-[#4064d7] no-underline hover:underline">
//                       click here
//                     </Link>
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Profile Dropdown */}
//             <div className="relative flex items-center" ref={dropdownRef}>
//               {isLoggedIn ? (
//                 <>
//                   <button
//                     onClick={() => setIsDropdownOpen((prev) => !prev)}
//                     className="focus:outline-none"
//                   >
//                     {profileImage &&
//                       profileImage !== "null" &&
//                       profileImage.trim() !== "" ? (
//                       <img
//                         src={profileImage}
//                         alt="Profile"
//                         className="object-cover w-10 h-10 border border-gray-300 rounded-full"
//                       />
//                     ) : (
//                       <FiUser
//                         className="p-2 text-black bg-gray-100 rounded-full"
//                         style={{ fontSize: "40px" }}
//                       />
//                     )}
//                   </button>

//                   {isDropdownOpen && (
//                     <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-lg top-12 w-44">
//                       <ul className="py-2 pl-0 m-0 list-none">
//                         <li>
//                           <Link
//                             to={{ pathname: "/dashboard", state: { page: "profile" } }}
//                             onClick={() => setIsDropdownOpen(false)}
//                             className="block px-4 py-2 text-gray-800 no-underline hover:bg-gray-100 hover:no-underline"
//                           >
//                             Profile
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to={{ pathname: "/dashboard", state: { page: "myProperties" } }}
//                             onClick={() => setIsDropdownOpen(false)}
//                             className="block px-4 py-2 text-gray-800 no-underline hover:bg-gray-100 hover:no-underline"
//                           >
//                             My Properties
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to={{ pathname: "/dashboard", state: { page: "myVirtualtour" } }}
//                             onClick={() => setIsDropdownOpen(false)}
//                             className="block px-4 py-2 text-gray-800 no-underline hover:bg-gray-100 hover:no-underline"
//                           >
//                             My Virtual Tour
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to={{ pathname: "/dashboard", state: { page: "myFavourite" } }}
//                             onClick={() => setIsDropdownOpen(false)}
//                             className="block px-4 py-2 text-gray-800 no-underline hover:bg-gray-100 hover:no-underline"
//                           >
//                             My Favourites
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to={{ pathname: "/dashboard", state: { page: "saveSerches" } }}
//                             onClick={() => setIsDropdownOpen(false)}
//                             className="block px-4 py-2 text-gray-800 no-underline hover:bg-gray-100 hover:no-underline"
//                           >
//                             Saved Searches
//                           </Link>
//                         </li>
//                         <li>
//                           <button
//                             onClick={() => {
//                               setIsDropdownOpen(false);
//                               handleLogout();
//                             }}
//                             className="w-full px-4 py-2 text-left text-gray-800 no-underline hover:bg-gray-100 hover:no-underline"
//                           >
//                             Logout
//                           </button>
//                         </li>
//                       </ul>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <button
//                   onClick={() => setIsLoginModalOpen(true)}
//                   className="focus:outline-none"
//                 >
//                   <FiUser
//                     className="p-2 text-black bg-gray-100 rounded-full"
//                     style={{ fontSize: "40px" }}
//                   />
//                 </button>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* Logout Warning Modal */}
//       {
//         showModal && (
//           <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
//             <div className="relative p-6 text-center bg-white shadow-lg rounded-2xl w-96">
//               <button
//                 className="absolute text-2xl text-black top-2 right-2"
//                 onClick={() => setShowModal(false)}
//               >
//                 <IoCloseCircleOutline />
//               </button>
//               <h2 className="text-2xl font-semibold">Are you sure?</h2>
//               <p className="mt-2 text-gray-500">You will be logged out!</p>
//               <div className="flex justify-center gap-6 mt-4">
//                 <button
//                   className="px-8 py-2 text-white my-bg rounded-md hover:my-bg"
//                   onClick={confirmLogout}
//                 >
//                   Yes, logout!
//                 </button>
//                 <button
//                   className="px-8 py-2 text-black bg-white border border-black rounded-md hover:bg-gray-100"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )
//       }

//       {/* Auth & Image Modals */}
//       <Login1
//         isOpen={isLoginModalOpen}
//         onClose={() => setIsLoginModalOpen(false)}
//         onSwitchToSignUp={() => {
//           setIsLoginModalOpen(false);
//           setIsSignUpModalOpen(true);
//         }}
//       />
//       <SignUp1
//         isOpen={isSignUpModalOpen}
//         onClose={() => setIsSignUpModalOpen(false)}
//         onSwitchToLogin={() => {
//           setIsSignUpModalOpen(false);
//           setIsLoginModalOpen(true);
//         }}
//       />
//       {
//         showLogoPreview && (
//           <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-80">
//             <button
//               onClick={() => setShowLogoPreview(false)}
//               className="absolute text-4xl text-white top-5 right-5"
//             >
//               <IoCloseCircleOutline />
//             </button>
//             <img
//               src="/image/app.png"
//               alt="Logo Preview"
//               className="max-w-[90%] max-h-[90vh] object-contain rounded-xl"
//             />
//           </div>
//         )
//       }
//       <style>{`
//         .nav-tab {
//           position: relative;
//           transition: color 0.3s ease;
//         }

//         .nav-tab:hover {
//           color: #8B1E3F;
//         }

//         .navbar-nav-tab-indicator {
//           position: absolute;
//           height: 3px;
//           background-color: #8B1E3F;
//           opacity: 0;
//           transition: left 0.3s ease, width 0.3s ease, opacity 0.2s ease;
//           pointer-events: none;
//         }
//       `}</style>

//     </nav >
//   );
// };

// export default HorizontalNav;

import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { SearchContext } from "../containers/SearchContext";
import NavbarSearch from "../containers/NavbarSearch";
import Login1 from "../auth/Login1";
import SignUp1 from "../auth/SignUp1";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IoCloseCircleOutline } from "react-icons/io5";

import { FiUser, FiMenu, FiHeadphones, FiPhoneCall } from "react-icons/fi";
const HorizontalNav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference to the dropdown menu
  const { propertyCity, setPropertyCity } = useContext(SearchContext);
  const { searchCity, setSearchCity } = useContext(SearchContext);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [type, setType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const isPropertyDashboard = location.pathname === "/property-dashboard";
  const [profileImage, setProfileImage] = useState("");
  const [showLogoPreview, setShowLogoPreview] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const navTabRefs = useRef({});
  const navTabsContainerRef = useRef(null);
const [navIndicatorStyle, setNavIndicatorStyle] = useState({
  left: 0,
  width: 0,
  opacity: 0,
});
const moveNavIndicator = (key) => {
  const el = navTabRefs.current[key];

  if (el) {
    setNavIndicatorStyle({
      left: el.offsetLeft - 32,
      top: el.offsetTop + el.offsetHeight + 4,
      width: el.getBoundingClientRect().width,
      opacity: 1,
    });
  }
};

const handleNavMouseEnter = (key) => {
  moveNavIndicator(key);
};

const handleNavMouseLeave = () => {
  setNavIndicatorStyle((prev) => ({
    ...prev,
    opacity: 0,
  }));
};
  const searchBarRoutes = [
    "/property",
    "/advisordashboard",
    "/searchdashboard",
    "/allproperties",
  ];

  const showSearchBar =
    [

      "/searchdashboard",
      "/property",
      "/advisordashboard",
      "/featuredDashboard",
      "/recommendedpropertiesDashboard",
    ].includes(location.pathname) ||
    location.pathname.startsWith("/citywiseproperties");

  const hideTabLinks = showSearchBar;

  // useEffect(() => {
  //   if (!showSearchBar) {
  //     setSearchCity("");
  //     setInputValue("");
  //   }
  // }, [location.pathname]);

  const checkLoginStatus = () => {
    const userId = sessionStorage.getItem("accessToken");
    setIsLoggedIn(!!userId);
  };
  useEffect(() => {
    if (isContactOpen) {
      const timer = setTimeout(() => {
        setIsContactOpen(false);
      }, 5000); // Closes after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isContactOpen]);

  useEffect(() => {
    checkLoginStatus();
    const intervalId = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    setShowModal(true); // open custom modal
  };

  const confirmLogout = () => {
    sessionStorage.clear();
    setShowModal(false);
    toast.success("Logout Successfully");
    setIsLoggedIn(false);
    history.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const [freePostCount, setFreePostCount] = useState(0);
  const userId = sessionStorage.getItem("accessToken");
  const userType = sessionStorage.getItem("user_type");

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
          setFreePostCount(countData.free_post_count || 0);
        }
        setProfileImage(profileResponse?.data?.data?.profile_image || "");
      } catch (error) {
        console.error("Error checking post limits:", error);
      }
    };

    if (userId) {
      checkPostLimits();
    }
  }, [userId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isLoginModalOpen || isSignUpModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoginModalOpen, isSignUpModalOpen]);

  return (
    <nav className="flex flex-wrap items-center justify-between px-4 py-3 text-sm font-light bg-white rounded-lg md:flex-nowrap lg:px-8 gap-y-4 md:gap-y-0 shadow-sm">

      {/* 1. Left side: Logo */}
      <div className="flex items-center justify-between w-full md:w-auto flex-shrink-0">
        <Link to="/" className="cursor-pointer">
          <img
            src="/image/app.png"
            alt="NoWayBroker Logo"
            className="w-[120px] h-[115px]"
          />
        </Link>
        {/* Hamburger Menu for Mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden focus:outline-none"
        >
          <FiMenu className="text-2xl text-black" />
        </button>
      </div>

      {/* --- DESKTOP WRAPPER (Forces Links & Buttons on ONE line) --- */}
      <div
        className={`${isMobileMenuOpen ? "flex" : "hidden"
          } flex-col items-center w-full mt-2 space-y-4 md:space-y-0 md:mt-0 md:flex md:flex-row md:flex-1 md:justify-between md:ml-8 max-[767px]:space-y-3 max-[767px]:mt-1`}
      >

        {/* 2. Middle: Navigation Tabs and Search Bar */}
        <div className="flex justify-center w-full md:w-auto md:flex-1">
          {showSearchBar && (
            <NavbarSearch />
          )}

          {/* {!hideTabLinks && (
            <ul
  // className="relative flex flex-col items-center w-full p-0 m-0 space-y-4 md:flex-row md:space-y-0 md:space-x-4 lg:space-x-8 md:w-auto max-[767px]:grid max-[767px]:grid-cols-2 max-[767px]:space-y-0 max-[767px]:gap-x-8 max-[767px]:gap-y-3 max-[767px]:justify-items-center max-[767px]:w-full"
      className="relative flex flex-col items-center w-full p-0 m-0 space-y-4 md:flex-row md:space-y-0 md:space-x-4 lg:space-x-8 md:w-auto max-[767px]:grid max-[767px]:grid-cols-2 max-[767px]:space-y-0 max-[767px]:gap-x-6 max-[767px]:gap-y-3 max-[767px]:justify-items-center max-[767px]:w-full"
 onMouseLeave={handleNavMouseLeave}
>
              <li>
                <Link
 ref={(el) => { 
    navTabRefs.current["buyers"] = el;
  }}
  onMouseEnter={() => handleNavMouseEnter("buyers")}
  to={{
    pathname: "/property",
    state: {
      propertyType: "Buy",
      cityName: sessionStorage.getItem("cityName") || "",
    },
  }}
  className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap max-[767px]:inline-block max-[767px]:pb-1 max-[767px]:border-b-2 max-[767px]:border-transparent max-[767px]:hover:border-[#8B1E3F] max-[767px]:hover:text-[#8B1E3F] max-[767px]:active:border-[#8B1E3F] max-[767px]:active:text-[#8B1E3F]"
>
  For Buyers
</Link>
              </li>
              <li>
                <Link
    ref={(el) => {
      navTabRefs.current["tenants"] = el;
    }}
    onMouseEnter={() => handleNavMouseEnter("tenants")}
    to={{
      pathname: "/property",
      state: {
        propertyType: "Rent",
        cityName: sessionStorage.getItem("cityName") || "",
      },
    }}
    className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap max-[767px]:inline-block max-[767px]:pb-1 max-[767px]:border-b-2 max-[767px]:border-transparent max-[767px]:hover:border-[#8B1E3F] max-[767px]:hover:text-[#8B1E3F] max-[767px]:active:border-[#8B1E3F] max-[767px]:active:text-[#8B1E3F]"
  >
    For Tenants
  </Link>
              </li>
              <li>
               <Link
    ref={(el) => {
      navTabRefs.current["owners"] = el;
    }}
    onMouseEnter={() => handleNavMouseEnter("owners")}
    to={{
      pathname: "/advisordashboard",
      search: "?label=Owner",
      state: {
        cityName: sessionStorage.getItem("cityName") || "",
      },
    }}
    className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap max-[767px]:inline-block max-[767px]:pb-1 max-[767px]:border-b-2 max-[767px]:border-transparent max-[767px]:hover:border-[#8B1E3F] max-[767px]:hover:text-[#8B1E3F] max-[767px]:active:border-[#8B1E3F] max-[767px]:active:text-[#8B1E3F]"
  >
    For Owners
  </Link>
              </li>
              <li>
                <Link
    ref={(el) => {
      navTabRefs.current["builders"] = el;
    }}
    onMouseEnter={() => handleNavMouseEnter("builders")}
    to={{
      pathname: "/advisordashboard",
      search: "?label=Builder",
      state: {
        cityName: sessionStorage.getItem("cityName") || "",
      },
    }}
    className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap max-[767px]:inline-block max-[767px]:pb-1 max-[767px]:border-b-2 max-[767px]:border-transparent max-[767px]:hover:border-[#8B1E3F] max-[767px]:hover:text-[#8B1E3F] max-[767px]:active:border-[#8B1E3F] max-[767px]:active:text-[#8B1E3F]"
  >
    For Builders
  </Link>
              </li>
               {/* Add this here */}
  {/* <span
    className="navbar-nav-tab-indicator hidden md:block"
    style={{
      left: navIndicatorStyle.left,
      top: navIndicatorStyle.top,
      width: navIndicatorStyle.width,
      opacity: navIndicatorStyle.opacity,
    }}
  />
            </ul>
          )} */}

            {/* {!hideTabLinks && (
            <ul
  className="relative flex flex-col items-center w-full p-0 m-0 space-y-4 md:flex-row md:space-y-0 md:space-x-4 lg:space-x-8 md:w-auto max-[767px]:flex max-[767px]:flex-row max-[767px]:flex-nowrap max-[767px]:space-y-0 max-[767px]:gap-x-6 max-[767px]:overflow-x-auto max-[767px]:justify-start max-[767px]:w-full max-[767px]:pb-3 max-[767px]:mobile-tab-scroll"
  onMouseLeave={handleNavMouseLeave}
>
              <li className="max-[767px]:flex-shrink-0">
                <Link
 ref={(el) => { 
    navTabRefs.current["buyers"] = el;
  }}
  onMouseEnter={() => handleNavMouseEnter("buyers")}
  to={{
    pathname: "/property",
    state: {
      propertyType: "Buy",
      cityName: sessionStorage.getItem("cityName") || "",
    },
  }}
  className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap max-[767px]:inline-block max-[767px]:pb-1 max-[767px]:border-b-2 max-[767px]:border-transparent max-[767px]:cursor-pointer max-[767px]:transition-all max-[767px]:duration-200 max-[767px]:hover:border-[#8B1E3F] max-[767px]:hover:text-[#8B1E3F] max-[767px]:hover:scale-105 max-[767px]:active:border-[#8B1E3F] max-[767px]:active:text-[#8B1E3F] max-[767px]:active:scale-105"
>
  For Buyers
</Link>
              </li>
              <li className="max-[767px]:flex-shrink-0">
                <Link
    ref={(el) => {
      navTabRefs.current["tenants"] = el;
    }}
    onMouseEnter={() => handleNavMouseEnter("tenants")}
    to={{
      pathname: "/property",
      state: {
        propertyType: "Rent",
        cityName: sessionStorage.getItem("cityName") || "",
      },
    }}
    className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap max-[767px]:inline-block max-[767px]:pb-1 max-[767px]:border-b-2 max-[767px]:border-transparent max-[767px]:cursor-pointer max-[767px]:transition-all max-[767px]:duration-200 max-[767px]:hover:border-[#8B1E3F] max-[767px]:hover:text-[#8B1E3F] max-[767px]:hover:scale-105 max-[767px]:active:border-[#8B1E3F] max-[767px]:active:text-[#8B1E3F] max-[767px]:active:scale-105"
  >
    For Tenants
  </Link>
              </li>
              <li className="max-[767px]:flex-shrink-0">
               <Link
    ref={(el) => {
      navTabRefs.current["owners"] = el;
    }}
    onMouseEnter={() => handleNavMouseEnter("owners")}
    to={{
      pathname: "/advisordashboard",
      search: "?label=Owner",
      state: {
        cityName: sessionStorage.getItem("cityName") || "",
      },
    }}
    className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap max-[767px]:inline-block max-[767px]:pb-1 max-[767px]:border-b-2 max-[767px]:border-transparent max-[767px]:cursor-pointer max-[767px]:transition-all max-[767px]:duration-200 max-[767px]:hover:border-[#8B1E3F] max-[767px]:hover:text-[#8B1E3F] max-[767px]:hover:scale-105 max-[767px]:active:border-[#8B1E3F] max-[767px]:active:text-[#8B1E3F] max-[767px]:active:scale-105"
  >
    For Owners
  </Link>
              </li>
              <li className="max-[767px]:flex-shrink-0">
                <Link
    ref={(el) => {
      navTabRefs.current["builders"] = el;
    }}
    onMouseEnter={() => handleNavMouseEnter("builders")}
    to={{
      pathname: "/advisordashboard",
      search: "?label=Builder",
      state: {
        cityName: sessionStorage.getItem("cityName") || "",
      },
    }}
    className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap max-[767px]:inline-block max-[767px]:pb-1 max-[767px]:border-b-2 max-[767px]:border-transparent max-[767px]:cursor-pointer max-[767px]:transition-all max-[767px]:duration-200 max-[767px]:hover:border-[#8B1E3F] max-[767px]:hover:text-[#8B1E3F] max-[767px]:hover:scale-105 max-[767px]:active:border-[#8B1E3F] max-[767px]:active:text-[#8B1E3F] max-[767px]:active:scale-105"
  >
    For Builders
  </Link>
              </li>
               {/* Add this here */}
  {/* <span
    className="navbar-nav-tab-indicator hidden md:block"
    style={{
      left: navIndicatorStyle.left,
      top: navIndicatorStyle.top,
      width: navIndicatorStyle.width,
      opacity: navIndicatorStyle.opacity,
    }}
  />
            </ul>
          )} */} 

                  {!hideTabLinks && (
            <ul
  // className="relative flex flex-col items-center w-full p-0 m-0 space-y-4 md:flex-row md:space-y-0 md:space-x-4 lg:space-x-8 md:w-auto max-[767px]:flex max-[767px]:flex-row max-[767px]:flex-nowrap max-[767px]:space-y-0 max-[767px]:gap-x-6 max-[767px]:overflow-x-auto max-[767px]:justify-start max-[767px]:w-full max-[767px]:pb-2 max-[767px]:mobile-tab-scroll"
  className="mobile-tab-scroll relative flex flex-col items-center w-full p-0 m-0 space-y-4 md:flex-row md:space-y-0 md:space-x-4 lg:space-x-8 md:w-auto max-[1023px]:flex-row max-[1023px]:flex-nowrap max-[1023px]:space-y-0 max-[1023px]:gap-x-6 max-[1023px]:overflow-x-auto max-[1023px]:justify-start max-[1023px]:w-full max-[1023px]:pb-2"
  onMouseLeave={handleNavMouseLeave}
>
              <li className="max-[767px]:flex-shrink-0">
                <Link
 ref={(el) => { 
    navTabRefs.current["buyers"] = el;
  }}
  onMouseEnter={() => handleNavMouseEnter("buyers")}
  to={{
    pathname: "/property",
    state: {
      propertyType: "Buy",
      cityName: sessionStorage.getItem("cityName") || "",
    },
  }}
  className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap max-[767px]:inline-block max-[767px]:pb-1 max-[767px]:border-b-2 max-[767px]:border-transparent max-[767px]:cursor-pointer max-[767px]:transition-all max-[767px]:duration-200 max-[767px]:hover:border-[#8B1E3F] max-[767px]:hover:text-[#8B1E3F] max-[767px]:hover:scale-105 max-[767px]:active:border-[#8B1E3F] max-[767px]:active:text-[#8B1E3F] max-[767px]:active:scale-105"
>
  For Buyers
</Link>
              </li>
              <li className="max-[767px]:flex-shrink-0">
                <Link
    ref={(el) => {
      navTabRefs.current["tenants"] = el;
    }}
    onMouseEnter={() => handleNavMouseEnter("tenants")}
    to={{
      pathname: "/property",
      state: {
        propertyType: "Rent",
        cityName: sessionStorage.getItem("cityName") || "",
      },
    }}
    className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap max-[767px]:inline-block max-[767px]:pb-1 max-[767px]:border-b-2 max-[767px]:border-transparent max-[767px]:cursor-pointer max-[767px]:transition-all max-[767px]:duration-200 max-[767px]:hover:border-[#8B1E3F] max-[767px]:hover:text-[#8B1E3F] max-[767px]:hover:scale-105 max-[767px]:active:border-[#8B1E3F] max-[767px]:active:text-[#8B1E3F] max-[767px]:active:scale-105"
  >
    For Tenants
  </Link>
              </li>
              <li className="max-[767px]:flex-shrink-0">
               <Link
    ref={(el) => {
      navTabRefs.current["owners"] = el;
    }}
    onMouseEnter={() => handleNavMouseEnter("owners")}
    to={{
      pathname: "/advisordashboard",
      search: "?label=Owner",
      state: {
        cityName: sessionStorage.getItem("cityName") || "",
      },
    }}
    className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap max-[767px]:inline-block max-[767px]:pb-1 max-[767px]:border-b-2 max-[767px]:border-transparent max-[767px]:cursor-pointer max-[767px]:transition-all max-[767px]:duration-200 max-[767px]:hover:border-[#8B1E3F] max-[767px]:hover:text-[#8B1E3F] max-[767px]:hover:scale-105 max-[767px]:active:border-[#8B1E3F] max-[767px]:active:text-[#8B1E3F] max-[767px]:active:scale-105"
  >
    For Owners
  </Link>
              </li>
              <li className="max-[767px]:flex-shrink-0">
                <Link
    ref={(el) => {
      navTabRefs.current["builders"] = el;
    }}
    onMouseEnter={() => handleNavMouseEnter("builders")}
    to={{
      pathname: "/advisordashboard",
      search: "?label=Builder",
      state: {
        cityName: sessionStorage.getItem("cityName") || "",
      },
    }}
    className="nav-tab text-base font-medium tracking-wider text-gray-600 no-underline transition lg:text-lg hover:no-underline whitespace-nowrap max-[767px]:inline-block max-[767px]:pb-1 max-[767px]:border-b-2 max-[767px]:border-transparent max-[767px]:cursor-pointer max-[767px]:transition-all max-[767px]:duration-200 max-[767px]:hover:border-[#8B1E3F] max-[767px]:hover:text-[#8B1E3F] max-[767px]:hover:scale-105 max-[767px]:active:border-[#8B1E3F] max-[767px]:active:text-[#8B1E3F] max-[767px]:active:scale-105"
  >
    For Builders
  </Link>
              </li>
               {/* Add this here */}
  <span
    className="navbar-nav-tab-indicator hidden md:block"
    style={{
      left: navIndicatorStyle.left,
      top: navIndicatorStyle.top,
      width: navIndicatorStyle.width,
      opacity: navIndicatorStyle.opacity,
    }}
  />
            </ul>
          )}
        </div>

        {/* 3. Right side: Buttons and Icons */}
        <div className="flex flex-col items-center w-full space-y-4 md:w-auto md:flex-row md:space-y-0 md:space-x-3 lg:space-x-4 flex-shrink-0 max-[767px]:space-y-3">
            <Link
            to="/download"
          className="px-3 py-2 text-sm font-medium no-underline transition border rounded lg:text-base my-text border-rose-500 hover:text-rose-700 hover:no-underline whitespace-nowrap max-[767px]:order-2 max-[767px]:w-auto max-[767px]:text-center max-[767px]:mt-2"
          >
            Download Mobile App
          </Link>

          {/* Post Property + Post Project — grouped so they share one line on mobile, shown first */}
          {/* <div className="flex items-center gap-3 md:contents max-[767px]:order-1 max-[767px]:w-full max-[767px]:justify-center"> */}
            <div className="flex items-center gap-3 max-[767px]:order-1 max-[767px]:w-full max-[767px]:justify-center">
            {isLoggedIn ? (
              <Link
                to="/add_new_property"
                className="px-3 py-2 text-sm font-medium text-center text-white no-underline transition border border-gray-300 rounded lg:text-base my-bg hover:my-bg hover:no-underline whitespace-nowrap"
              >
                Post Property{" "}
                {freePostCount > 0 && ( 
                  <span className="px-2 py-0 ml-1 text-xs text-black bg-green-500 rounded-full">
                    FREE
                  </span>
                )}
              </Link>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3 py-2 text-sm font-medium text-center text-white transition border border-gray-300 rounded lg:text-base my-bg hover:my-bg hover:no-underline whitespace-nowrap"
              >
                Post Property{" "}
                <span className="px-2 py-0 ml-1 text-xs text-black bg-green-500 rounded-full">
                  FREE
                </span>
              </button>
            )}

            {isLoggedIn && userType !== "Owner" && (
              <Link
                to="/add_new_project"
                className="no-underline hover:no-underline whitespace-nowrap"
              >
                <button className="px-3 py-2 text-sm font-medium text-center text-white transition border border-gray-300 rounded lg:text-base my-bg hover:my-bg">
                  Post Project
                </button>
              </Link>
            )}
          </div>

          {/* <Link
            to="/download"
            className="px-3 py-2 text-sm font-medium no-underline transition border rounded lg:text-base my-text border-rose-500 hover:text-rose-700 hover:no-underline whitespace-nowrap max-[767px]:order-2 max-[767px]:w-auto max-[767px]:text-center"
          >
            Download Mobile App
          </Link> */}

          {/* Icons Block (Headphones & Profile) */}
          <div className="flex items-center space-x-3 lg:space-x-4 max-[767px]:order-3 max-[767px]:w-full max-[767px]:justify-center">

            {/* Contact Us Popover */}
            <div className="relative flex items-center">
              <button
                onClick={() => setIsContactOpen(!isContactOpen)}
                className="flex items-center justify-center p-2 text-black transition bg-gray-100 rounded-full focus:outline-none hover:bg-gray-200"
              >
                <FiHeadphones className="text-2xl" />
              </button>

              {isContactOpen && (
                <div className="absolute right-0 z-50 p-6 mt-2 bg-white border border-gray-200 shadow-2xl top-12 rounded-xl w-[340px] max-[767px]:right-auto max-[767px]:left-1/2 max-[767px]:-translate-x-1/2 max-[767px]:w-[85vw] max-[767px]:max-w-[340px] max-[767px]:p-4">
                  <h4 className="mb-5 text-[13px] font-bold tracking-wider text-[#0f172a] uppercase">
                    Contact Us
                  </h4>

                  {/* Toll Free */}
                  <div className="flex items-start mb-6">
                    {/* Solid Phone Icon */}
                    <svg className="w-[18px] h-[18px] mt-1 mr-4 text-[#334155] fill-current" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    <div>
                      <p className="mb-1 text-[13px] font-medium text-gray-500 leading-tight">
                        Toll Free | 9:30 AM to 6:30 PM <br /> (Mon-Sun)
                      </p>
                      <p className="text-[19px] font-bold text-[#1e293b]">
                        +91 8600199570
                      </p>
                    </div>
                  </div>

                  {/* Call Back Button */}
                  <button className="flex items-center justify-center w-full py-2.5 mb-4 text-[15px] font-bold text-[#4064d7] transition bg-white border-[1.5px] border-[#4064d7] rounded-[4px] hover:bg-blue-50">
                    <FiPhoneCall className="mr-2 text-lg" /> Request a Call Back
                  </button>

                  {/* FAQ Link */}
                  <p className="m-0 text-[13px] text-gray-800">
                    To check all the FAQ{" "}
                    <Link to="/faq" className="text-[#4064d7] no-underline hover:underline">
                      click here
                    </Link>
                  </p>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative flex items-center" ref={dropdownRef}>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="focus:outline-none"
                  >
                    {profileImage &&
                      profileImage !== "null" &&
                      profileImage.trim() !== "" ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="object-cover w-10 h-10 border border-gray-300 rounded-full"
                      />
                    ) : (
                      <FiUser
                        className="p-2 text-black bg-gray-100 rounded-full"
                        style={{ fontSize: "40px" }}
                      />
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-lg top-12 w-44 max-[767px]:right-auto max-[767px]:left-1/2 max-[767px]:-translate-x-1/2">
                      <ul className="py-2 pl-0 m-0 list-none">
                        <li>
                          <Link
                            to={{ pathname: "/dashboard", state: { page: "profile" } }}
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-gray-800 no-underline hover:bg-gray-100 hover:no-underline"
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={{ pathname: "/dashboard", state: { page: "myProperties" } }}
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-gray-800 no-underline hover:bg-gray-100 hover:no-underline"
                          >
                            My Properties
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={{ pathname: "/dashboard", state: { page: "myVirtualtour" } }}
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-gray-800 no-underline hover:bg-gray-100 hover:no-underline"
                          >
                            My Virtual Tour
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={{ pathname: "/dashboard", state: { page: "myFavourite" } }}
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-gray-800 no-underline hover:bg-gray-100 hover:no-underline"
                          >
                            My Favourites
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={{ pathname: "/dashboard", state: { page: "saveSerches" } }}
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-gray-800 no-underline hover:bg-gray-100 hover:no-underline"
                          >
                            Saved Searches
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              handleLogout();
                            }}
                            className="w-full px-4 py-2 text-left text-gray-800 no-underline hover:bg-gray-100 hover:no-underline"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="focus:outline-none"
                >
                  <FiUser
                    className="p-2 text-black bg-gray-100 rounded-full"
                    style={{ fontSize: "40px" }}
                  />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Logout Warning Modal */}
      {
        showModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative p-6 text-center bg-white shadow-lg rounded-2xl w-96">
              <button
                className="absolute text-2xl text-black top-2 right-2"
                onClick={() => setShowModal(false)}
              >
                <IoCloseCircleOutline />
              </button>
              <h2 className="text-2xl font-semibold">Are you sure?</h2>
              <p className="mt-2 text-gray-500">You will be logged out!</p>
              <div className="flex justify-center gap-6 mt-4">
                <button
                  className="px-8 py-2 text-white my-bg rounded-md hover:my-bg"
                  onClick={confirmLogout}
                >
                  Yes, logout!
                </button>
                <button
                  className="px-8 py-2 text-black bg-white border border-black rounded-md hover:bg-gray-100"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Auth & Image Modals */}
      <Login1
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignUp={() => {
          setIsLoginModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
      />
      <SignUp1
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
      {
        showLogoPreview && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-80">
            <button
              onClick={() => setShowLogoPreview(false)}
              className="absolute text-4xl text-white top-5 right-5"
            >
              <IoCloseCircleOutline />
            </button>
            <img
              src="/image/app.png"
              alt="Logo Preview"
              className="max-w-[90%] max-h-[90vh] object-contain rounded-xl"
            />
          </div>
        )
      }
      {/* <style>{`
        .nav-tab {
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-tab:hover {
          color: #8B1E3F;
        }

        .navbar-nav-tab-indicator {
          position: absolute;
          height: 3px;
          background-color: #8B1E3F;
          opacity: 0;
          transition: left 0.3s ease, width 0.3s ease, opacity 0.2s ease;
          pointer-events: none;
        }
      `}</style> */}

          <style>{`
  .nav-tab {
    position: relative;
    transition: color 0.3s ease;
  }

  .nav-tab:hover {
    color: #8B1E3F;
  }

  .navbar-nav-tab-indicator {
    position: absolute;
    height: 3px;
    background-color: #8B1E3F;
    opacity: 0;
    transition: left 0.3s ease, width 0.3s ease, opacity 0.2s ease;
    pointer-events: none;
  }

  /* Responsive horizontal scrollbar */
  .mobile-tab-scroll {
    scrollbar-width: thin;
    scrollbar-color: #d1a3af transparent;
  }

  .mobile-tab-scroll::-webkit-scrollbar {
    width: 3px;
    height: 2px;
  }

  .mobile-tab-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .mobile-tab-scroll::-webkit-scrollbar-thumb {
    background-color: #d1a3af;
    border-radius: 999px;
  }

  .mobile-tab-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #b87d8d;
  }
`}</style>

    </nav >
  );
};

export default HorizontalNav;
