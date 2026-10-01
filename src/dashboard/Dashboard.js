import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";

import { FaBars, FaTimes } from "react-icons/fa";
import Profile from "./Profile";
import MyProperties from "./MyProperties";
import MyProjects from "./MyProjects";
import MyLeads from "./MyLeads";
import MyVirtualTour from "./MyVirtualTour";
import Subscription from "./Subscription";
import SavedSerches from "./SavedSerches";
import MyFavourite from "./MyFavourite";
import Offer from "./Offer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCloseCircleOutline } from "react-icons/io5";

const Dashboard = () => {
  const location = useLocation();
  const history = useHistory();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    location.state?.page || "profile",
  );
  const userType = sessionStorage.getItem("user_type");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.state?.page) {
      setActiveSection(location.state.page);
    }
  }, [location.state]);

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    sessionStorage.clear();
    history.push("/");
    toast.success("Logout Successfully");
    setShowModal(false);
  };

  // return (
    // <div className="flex flex-col min-h-screen">
    //   {/* Navbar */}
    //   <nav className="hidden md:flex w-full bg-gray-100 text-black p-4 justify-between items-center px-20">
    //     <h1 className="text-xl">Dashboard</h1>
    //     <div className="flex items-center gap-4">
    //       <div className="text-gray-500 text-sm">
    //         <Link to="/" className="hover:text-gray-700">
    //           Home
    //         </Link>
    //         <span className="mx-1">›</span>
    //         <span className="my-text font-medium">Dashboard</span>
    //       </div>
    //     </div>
    //   </nav>

    //   <div className="flex flex-1 flex-col md:flex-row">
    //     {/* Sidebar */}
    //     <aside
    //       className={`w-full md:w-64 bg-white text-black p-4 md:block h-screen sticky top-0 overflow-y-auto ${
    //         isSidebarOpen ? "block" : "hidden"
    //       }`}
    //     >
    //       <nav className="flex flex-col space-y-2">
    //         <button
    //           onClick={() => setActiveSection("profile")}
    //           className={`py-3 px-4 rounded-md text-left ${
    //             activeSection === "profile"
    //               ? "bg-gray-200 my-text"
    //               : "text-gray-700 hover:bg-gray-300"
    //           }`}
    //         >
    //           Profile
    //         </button>
    //         <button
    //           onClick={() => setActiveSection("myProperties")}
    //           className={`py-3 px-4 rounded-md text-left ${
    //             activeSection === "myProperties"
    //               ? "bg-gray-200 my-text"
    //               : "text-gray-700 hover:bg-gray-300"
    //           }`}
    //         >
    //           My Properties
    //         </button>
    //         {userType !== "Owner" && (
    //           <button
    //             onClick={() => setActiveSection("myProjects")}
    //             className={`py-3 px-4 rounded-md text-left ${
    //               activeSection === "myProjects"
    //                 ? "bg-gray-200 my-text"
    //                 : "text-gray-700 hover:bg-gray-300"
    //             }`}
    //           >
    //             My Projects
    //           </button>
    //         )}

    //         <button
    //           onClick={() => setActiveSection("myLeads")}
    //           className={`py-3 px-4 rounded-md text-left ${
    //             activeSection === "myLeads"
    //               ? "bg-gray-200 my-text"
    //               : "text-gray-700 hover:bg-gray-300"
    //           }`}
    //         >
    //           My Leads
    //         </button>
    //         <button
    //           onClick={() => setActiveSection("myVirtualtour")}
    //           className={`py-3 px-4 rounded-md text-left ${
    //             activeSection === "myVirtualtour"
    //               ? "bg-gray-200 my-text"
    //               : "text-gray-700 hover:bg-gray-300"
    //           }`}
    //         >
    //           My Virtual Tour
    //         </button>
    //         <button
    //           onClick={() => setActiveSection("mySubscriptions")}
    //           className={`py-3 px-4 rounded-md text-left ${
    //             activeSection === "mySubscriptions"
    //               ? "bg-gray-200 my-text"
    //               : "text-gray-700 hover:bg-gray-300"
    //           }`}
    //         >
    //           Subscriptions
    //         </button>
    //         <button
    //           onClick={() => setActiveSection("myFavourite")}
    //           className={`py-3 px-4 rounded-md text-left ${
    //             activeSection === "myFavourite"
    //               ? "bg-gray-200 my-text"
    //               : "text-gray-700 hover:bg-gray-300"
    //           }`}
    //         >
    //           My Favourites
    //         </button>
    //         <button
    //           onClick={() => setActiveSection("saveSerches")}
    //           className={`py-3 px-4 rounded-md text-left ${
    //             activeSection === "saveSerches"
    //               ? "bg-gray-200 my-text"
    //               : "text-gray-700 hover:bg-gray-300"
    //           }`}
    //         >
    //           Saved Searches
    //         </button>
    //         <button
    //           onClick={() => setActiveSection("offers")}
    //           className={`py-3 px-4 rounded-md text-left ${
    //             activeSection === "offers"
    //               ? "bg-gray-200 my-text"
    //               : "text-gray-700 hover:bg-gray-300"
    //           }`}
    //         >
    //           Offers
    //         </button>
    //         <button
    //           onClick={handleLogout}
    //           className="py-3 px-4 rounded-md text-left text-gray-700 hover:bg-gray-300"
    //         >
    //           Logout
    //         </button>
    //       </nav>
    //     </aside>

    //     {/* Mobile Sidebar Toggle */}
    //     <div className="md:hidden bg-gray-800 text-white p-4 flex justify-between items-center">
    //       <h2 className="text-xl font-bold">Dashboard</h2>
    //       <button
    //         className="text-white"
    //         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    //       >
    //         {isSidebarOpen ? (
    //           <FaTimes className="text-2xl" />
    //         ) : (
    //           <FaBars className="text-2xl" />
    //         )}
    //       </button>
    //     </div>

    //     {/* Main Content */}
    //     <main className="flex-1">
    //       {activeSection === "profile" && <Profile />}
    //       {activeSection === "myProperties" && <MyProperties />}
    //       {activeSection === "myProjects" && <MyProjects />}
    //       {activeSection === "myLeads" && <MyLeads />}
    //       {activeSection === "myVirtualtour" && <MyVirtualTour />}
    //       {activeSection === "mySubscriptions" && <Subscription />}
    //       {activeSection === "saveSerches" && <SavedSerches />}
    //       {activeSection === "myFavourite" && <MyFavourite />}
    //       {activeSection === "offers" && <Offer />}
    //     </main>
    //   </div>
    //   {showModal && (
    //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    //       <div className="bg-white rounded-2xl p-6 w-96 text-center shadow-lg relative">
    //         {/* Close (X) Icon */}
    //         <button
    //           className="absolute top-2 right-2 text-black text-2xl"
    //           onClick={() => setShowModal(false)}
    //         >
    //           <IoCloseCircleOutline />
    //         </button>

    //         <h2 className="text-2xl font-semibold">Are you sure?</h2>
    //         <p className="text-gray-500 mt-2">You will be logged out!</p>

    //         <div className="flex justify-center gap-6 mt-4">
    //           <button
    //             className="my-bg text-white px-8 py-2 rounded-md"
    //             onClick={confirmLogout}
    //           >
    //             Yes, logout!
    //           </button>
    //           <button
    //             className="bg-white border border-black text-black px-8 py-2 rounded-md"
    //             onClick={() => setShowModal(false)}
    //           >
    //             Cancel
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
  // );

  return (
  <div className="flex flex-col min-h-screen bg-white">

    {/* Dashboard Header */}
    <nav className="hidden md:flex w-full bg-gray-100 text-black px-4 sm:px-8 lg:px-20 py-4 justify-between items-center">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="text-gray-500 text-sm">
        <Link to="/" className="hover:text-gray-700">
          Home
        </Link>

        <span className="mx-1">›</span>

        <span className="my-text font-medium">
          Dashboard
        </span>
      </div>
    </nav>

    {/* Mobile Dashboard Header */}
    <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold">
        Dashboard
      </h2>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100"
      >
        {isSidebarOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaBars className="text-xl" />
        )}
      </button>
    </div>

    {/* Dashboard Body */}
    <div className="flex flex-col md:flex-row items-start w-full">

      {/* Sidebar */}
      <aside
        className={`
          w-full md:w-64
          bg-white
          border-r
          border-gray-200
          p-4
          shrink-0
          md:self-start

          ${
            isSidebarOpen
              ? "block"
              : "hidden md:block"
          }
        `}
      >
        <nav className="flex flex-col gap-1">

          {/* Profile */}
          <button
            onClick={() => {
              setActiveSection("profile");
              setIsSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 rounded-lg text-left ${
              activeSection === "profile"
                ? "bg-gray-100 my-text font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Profile
          </button>

          {/* My Properties */}
          <button
            onClick={() => {
              setActiveSection("myProperties");
              setIsSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 rounded-lg text-left ${
              activeSection === "myProperties"
                ? "bg-gray-100 my-text font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            My Properties
          </button>

          {/* My Projects */}
          {userType !== "Owner" && (
            <button
              onClick={() => {
                setActiveSection("myProjects");
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-3 rounded-lg text-left ${
                activeSection === "myProjects"
                  ? "bg-gray-100 my-text font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              My Projects
            </button>
          )}

          {/* My Leads */}
          <button
            onClick={() => {
              setActiveSection("myLeads");
              setIsSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 rounded-lg text-left ${
              activeSection === "myLeads"
                ? "bg-gray-100 my-text font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            My Leads
          </button>

          {/* My Virtual Tour */}
          <button
            onClick={() => {
              setActiveSection("myVirtualtour");
              setIsSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 rounded-lg text-left ${
              activeSection === "myVirtualtour"
                ? "bg-gray-100 my-text font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            My Virtual Tour
          </button>

          {/* Subscriptions */}
          <button
            onClick={() => {
              setActiveSection("mySubscriptions");
              setIsSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 rounded-lg text-left ${
              activeSection === "mySubscriptions"
                ? "bg-gray-100 my-text font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Subscriptions
          </button>

          {/* My Favourites */}
          <button
            onClick={() => {
              setActiveSection("myFavourite");
              setIsSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 rounded-lg text-left ${
              activeSection === "myFavourite"
                ? "bg-gray-100 my-text font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            My Favourites
          </button>

          {/* Saved Searches */}
          <button
            onClick={() => {
              setActiveSection("saveSerches");
              setIsSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 rounded-lg text-left ${
              activeSection === "saveSerches"
                ? "bg-gray-100 my-text font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Saved Searches
          </button>

          {/* Offers */}
          <button
            onClick={() => {
              setActiveSection("offers");
              setIsSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 rounded-lg text-left ${
              activeSection === "offers"
                ? "bg-gray-100 my-text font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Offers
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              w-full
              px-4
              py-3
              mt-2
              rounded-lg
              text-left
              text-gray-700
              hover:bg-gray-50
            "
          >
            Logout
          </button>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full overflow-x-hidden bg-white">
         {/* <div className="w-full p-4 sm:p-5 md:p-6 lg:p-8 bg-white"> */}

          {activeSection === "profile" && <Profile />}

          {activeSection === "myProperties" && <MyProperties />}

          {activeSection === "myProjects" && <MyProjects />}

          {activeSection === "myLeads" && <MyLeads />}

          {activeSection === "myVirtualtour" && <MyVirtualTour />}

          {activeSection === "mySubscriptions" && <Subscription />}

          {activeSection === "saveSerches" && <SavedSerches />}

          {activeSection === "myFavourite" && <MyFavourite />}

          {activeSection === "offers" && <Offer />}

        {/* </div> */}
      </main>

    </div>

    {/* Logout Modal */}
    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">

        <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-lg relative">

          <button
            className="absolute top-2 right-2 text-black text-2xl"
            onClick={() => setShowModal(false)}
          >
            <IoCloseCircleOutline />
          </button>

          <h2 className="text-2xl font-semibold">
            Are you sure?
          </h2>

          <p className="text-gray-500 mt-2">
            You will be logged out!
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mt-5">

            <button
              className="my-bg text-white px-8 py-2 rounded-md"
              onClick={confirmLogout}
            >
              Yes, logout!
            </button>

            <button
              className="bg-white border border-black text-black px-8 py-2 rounded-md"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

          </div>

        </div>

      </div>
    )}

  </div>
);


};

export default Dashboard;
