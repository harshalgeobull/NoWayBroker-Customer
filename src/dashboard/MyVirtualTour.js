import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineUser } from "react-icons/ai";
import { FaSearch, FaPhoneAlt, FaRegEnvelope, FaSort } from "react-icons/fa";
import { FiSmartphone } from "react-icons/fi";
import { User } from "@phosphor-icons/react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReScheduleModal from "../containers/ReScheduleModal";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const MyVirtualTour = () => {
  const [activeTab, setActiveTab] = useState("sent");
  const [appointments, setAppointments] = useState([]);
  const user_id = sessionStorage.getItem("accessToken");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [senttotalCount, setSendTotalCount] = useState(0);
  const [receivedTotalCount, setReceivedTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPhone, setShowPhone] = useState(false);
  // state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [freeViewCount, setFreeViewCount] = useState(0);
  const [paidViewCount, setPaidViewCount] = useState(0);
  const [visiblePhoneId, setVisiblePhoneId] = useState(null);

  const history = useHistory();

  const checkPostLimits = async () => {
    try {
      const profileForm = new FormData();
      profileForm.append("user_id", user_id);

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
        setFreeViewCount(countData.free_view_count || 0);
        setPaidViewCount(countData.paid_view_count || 0);
      }
    } catch (error) {
      console.error("Error checking post limits:", error);
    }
  };

  useEffect(() => {
    if (user_id) {
      checkPostLimits();
    }
  }, [user_id]);

  const handleAddCount = async (updatedCount) => {
    try {
      const addCountFormData = new FormData();
      if (freeViewCount > 0) {
        addCountFormData.append("free_view_count", updatedCount);
      } else {
        addCountFormData.append("paid_view_count", updatedCount);
      }
      addCountFormData.append("user_id", user_id);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/add_count`,
        {
          method: "POST",
          body: addCountFormData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        checkPostLimits();
      } else {
        console.error("Failed to update count:", data.message);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const fetchAppointments = async () => {
    const formData = new FormData();

    // Conditional formData field based on activeTab
    if (activeTab === "sent") {
      formData.append("user_id", user_id);
    } else if (activeTab === "received") {
      formData.append("property_owner_id", user_id);
    }

    formData.append("page", currentPage);
    formData.append("page_size", itemsPerPage);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_virtual_tour_schedule`,
        formData,
      );
      if (response.data.status === 1) {
        const mappedAppointments = response.data.data.map((item) => {
          // Use the correct user info depending on the tab
          const userInfo =
            activeTab === "sent"
              ? item.property_owner_details
              : item.user_details;

          let status = item.status || "Pending";
          let borderColor =
            {
              Booked: "border-yellow-400",
              Accepted: "border-green-400",
              Rejected: "border-red-400",
              Expired: "border-blue-400",
            }[status] || "border-yellow-400";

          // Common keys to be used in UI
          let appointmentData = {
            id: item._id,
            user_id: item.user_id,
            property_id: item.property_id,
            tour_type: item.tour_type,
            property_owner_id: item.property_owner_id,
            name: userInfo?.full_name || "N/A",
            role: userInfo?.user_type || "N/A",
            phone: userInfo?.mobile_number || "N/A",
            email: userInfo?.email || "N/A",
            status: item.status,
            date: new Date(item.schedule_date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            time: item.timeslot,
            time_unit: item.time_unit,
            borderColor,
          };

          // If the tour type is Property, set the property details
          if (item.tour_type === "Property") {
            appointmentData = {
              ...appointmentData,
              property_name: item.property_details.property_name,
              price: item.property_details.property_price,
              location: item.property_details.address_area,
              type: item.property_details.property_category_type,
              image: item.property_details?.cover_image,
              rent: item.property_details.rent,
              rent_duration: item.property_details.rent_duration,
              property_owner_image: item.property_owner_details.profile_image,
            };
          }
          // If the tour type is Project, set the project details
          else if (item.tour_type === "Project") {
            appointmentData = {
              ...appointmentData,
              property_name: item.project_details.project_name,
              price: item.project_details.average_project_price,
              location: item.project_details.address_area,
              image: item.project_details.cover_image,
              property_owner_image: item.property_owner_details.profile_image,
            };
          }
          return appointmentData;
        });
        setAppointments(mappedAppointments);
        setTotalPages(response.data.total_pages || 1);
      } else {
        setAppointments([]);
        setTotalPages(0);
      }
    } catch (error) {
      setAppointments([]);
      setTotalPages(0);
      console.error("Error fetching filtered properties:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, user_id, activeFilter]);

  // // Sent Invitation API
  const handleCount = async () => {
    try {
      // Create both FormData objects
      const sentFormData = new FormData();
      sentFormData.append("user_id", user_id);

      const receivedFormData = new FormData();
      receivedFormData.append("property_owner_id", user_id);

      // Call both in parallel using Promise.all
      const [sentResponse, receivedResponse] = await Promise.all([
        axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get_virtual_tour_schedule`,
          sentFormData,
        ),
        axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get_virtual_tour_schedule`,
          receivedFormData,
        ),
      ]);

      // Handle sent response
      if (sentResponse.data?.total_count !== undefined) {
        setSendTotalCount(sentResponse.data.total_count);
      }

      // Handle received response
      if (receivedResponse.data?.total_count !== undefined) {
        setReceivedTotalCount(receivedResponse.data.total_count);
      }
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

  // On load
  useEffect(() => {
    handleCount();
  }, [user_id]);

  const handleStatusUpdate = async (tour_schedule_id, status) => {
    try {
      const formData = new FormData();
      formData.append("tour_schedule_id", tour_schedule_id);
      formData.append("status", status);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/update_tour_status`,
        formData,
      );

      if (response.status === 200) {
        toast.success(`Tour ${status} successfully!`);
        // Refresh data
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === tour_schedule_id ? { ...appt, status } : appt,
          ),
        );
      }
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Failed to update tour status.");
    }
  };

  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const filteredSentAppointments = appointments.filter((appointment) =>
    activeFilter === "all"
      ? true
      : appointment.status.toLowerCase() === activeFilter,
  );

  const filteredReceivedAppointments = appointments.filter((appointment) => {
    const status = appointment.status.toLowerCase();

    if (activeFilter === "all") return true;

    if (activeFilter === "new leads") {
      return status !== "accepted" && status !== "rejected";
    }

    return status === activeFilter;
  });

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <>
      <div className="max-w-6xl p-6 mx-auto">
        <h2 className="text-2xl font-semibold">Virtual Appointment</h2>

        <div className="flex gap-6 mt-4 border-b">
          <button
            className={`pb-2 font-medium text-lg ${
              activeTab === "sent"
                ? "my-text border-b-2 border-rose-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("sent")}
          >
            Sent Invitations{" "}
            <span className="p-1 text-black bg-green-400 rounded-full">
              {" "}
              {senttotalCount.toString().padStart(2, "0")}
            </span>
          </button>
          <button
            className={`pb-2 font-medium text-lg ${
              activeTab === "received"
                ? "my-text border-b-2 border-rose-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("received")}
          >
            Received Invitations{" "}
            <span className="p-1 text-black bg-green-400 rounded-full">
              {receivedTotalCount.toString().padStart(2, "0")}
            </span>
          </button>
        </div>

        {activeTab === "sent" && (
          <>
            <div className="flex gap-4 mt-4">
              {["All", "Pending", "Accepted", "Rejected", "Expired"].map(
                (filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-3xl ${
                      activeFilter === filter.toLowerCase()
                        ? "bg-rose-100 my-text"
                        : "bg-gray-100 text-gray-500"
                    }`}
                    onClick={() => setActiveFilter(filter.toLowerCase())}
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>

            <div className="mt-6 space-y-4">
              {filteredSentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`border-2 ${
                    appointment.status === "Accepted"
                      ? "border-green-400"
                      : appointment.status === "Rejected"
                        ? "border-red-400"
                        : appointment.status === "Expired"
                          ? "border-blue-400"
                          : "border-yellow-400"
                  } bg-white p-6 rounded-lg shadow-md`}
                >
                  {/* Top Section: Name, Role, Phone, Email in a Row */}
                  <div className="flex flex-wrap items-center justify-between pb-3 border-b">
                    {/* Name & Role with User Icon */}
                    <div className="flex items-center gap-3">
                      {appointment.property_owner_image ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}/media/${appointment.property_owner_image}`}
                          alt="Owner"
                          className="object-cover w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="p-2 bg-rose-100 rounded-full">
                          <User className="text-4xl my-text" />
                        </div>
                      )}
                      <div>
                        <span className="block mb-0 text-lg font-semibold">
                          {appointment.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {appointment.role}
                        </span>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="flex items-center gap-20 text-sm">
                      {/* Phone */}
                      <div className="flex items-center gap-2">
                        <FiSmartphone className="text-lg my-text" />
                        {/* {showPhone ? ( */}
                        {visiblePhoneId === appointment.id ? (
                          <span className="text-black">
                            {appointment.phone}
                          </span>
                        ) : (
                          <button
                            // onClick={() => setShowPhone(true)}
                            onClick={() => {
                              if (user_id) {
                                if (freeViewCount || paidViewCount) {
                                  if (freeViewCount > 0) {
                                    const updatedCount = -1;
                                    setFreeViewCount(updatedCount);
                                    handleAddCount(updatedCount);
                                  } else if (paidViewCount > 0) {
                                    const updatedCount = -1;
                                    setPaidViewCount(updatedCount);
                                    handleAddCount(updatedCount);
                                  }
                                  setVisiblePhoneId(appointment.id);
                                  // setShowPhone(true)
                                } else {
                                  setShowModal(true);
                                }
                              } else {
                                toast.success("Plzz Log In To Continue...");
                              }
                            }}
                            className="px-3 py-1 text-sm text-white my-bg rounded-md"
                          >
                            Contact
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section: Two Columns Layout */}
                  <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                    {/* Left Column: Property Details */}
                    <div className="flex items-start gap-4">
                      {/* Image Wrapper */}
                      <div className="relative w-32 h-24">
                        <Link
                          to={{
                            pathname:
                              appointment.tour_type === "Property"
                                ? `/propertydetails/${appointment.property_id}`
                                : `/projectdetail/${appointment.property_id}`,
                            state: { propertyId: appointment.property_id },
                          }}
                        >
                          <img
                            src={
                              appointment.image?.startsWith("http")
                                ? appointment.image
                                : `${process.env.REACT_APP_API_URL}/${appointment.image}`
                            }
                            alt="Property Cover"
                            className="object-cover w-32 h-24 rounded-md cursor-pointer"
                          />
                        </Link>
                        <span
                          className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-md ${
                            appointment.type === "Buy"
                              ? "bg-green-500"
                              : appointment.type === "Rent"
                                ? "bg-blue-500"
                                : "bg-gray-800"
                          }`}
                        >
                          {appointment.type === "Buy"
                            ? "For Buy"
                            : appointment.type === "Rent"
                              ? "For Rent"
                              : "For Project"}
                        </span>
                      </div>
                      {/* Property Details */}
                      <div>
                        <h4 className="mb-0 font-semibold">
                          {appointment.property_name}
                        </h4>
                        <p className="text-gray-500">{appointment.location}</p>
                        <p className="font-bold">
                          {appointment.type === "Rent" ? (
                            <>
                              ₹{" "}
                              {Number(appointment.rent) >= 10000000
                                ? (Number(appointment.rent) / 10000000)
                                    .toFixed(1)
                                    .replace(/\.0$/, "") + " Cr"
                                : Number(appointment.rent) >= 100000
                                  ? (Number(appointment.rent) / 100000)
                                      .toFixed(1)
                                      .replace(/\.0$/, "") + " L"
                                  : Number(appointment.rent) >= 1000
                                    ? (Number(appointment.rent) / 1000)
                                        .toFixed(1)
                                        .replace(/\.0$/, "") + " K"
                                    : appointment.rent}
                              {appointment.rent_duration &&
                              appointment.rent_duration !== "N/A"
                                ? ` / ${appointment.rent_duration}`
                                : ""}
                            </>
                          ) : (
                            appointment.price &&
                            appointment.price !== "N/A" && (
                              <>
                                ₹{" "}
                                {Number(appointment.price) >= 10000000
                                  ? (Number(appointment.price) / 10000000)
                                      .toFixed(1)
                                      .replace(/\.0$/, "") + " Cr"
                                  : Number(appointment.price) >= 100000
                                    ? (Number(appointment.price) / 100000)
                                        .toFixed(1)
                                        .replace(/\.0$/, "") + " L"
                                    : Number(appointment.price) >= 1000
                                      ? (Number(appointment.price) / 1000)
                                          .toFixed(1)
                                          .replace(/\.0$/, "") + " K"
                                      : appointment.price}
                              </>
                            )
                          )}
                        </p>
                        {appointment.status === "Accepted" ? (
                          <p className="flex items-center gap-2 mt-2 font-medium text-green-600">
                            <span className="px-2 py-1 text-sm bg-green-100 rounded-md">
                              Accepted
                            </span>
                            <span className="text-black">
                              {appointment.date}
                            </span>
                          </p>
                        ) : appointment.status === "Rejected" ? (
                          <p className="flex items-center gap-2 mt-2 font-medium text-red-600">
                            <span className="px-2 py-1 text-sm bg-red-100 rounded-md">
                              Rejected
                            </span>
                            <span className="text-black">
                              {appointment.date}
                            </span>
                          </p>
                        ) : (
                          <p className="mt-2 font-medium text-yellow-600">
                            {appointment.status}{" "}
                            <span className="text-black">
                              {" "}
                              {appointment.date}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Appointment Details */}
                    <div className="flex justify-between text-sm">
                      {/* Left: Appointment Date */}
                      <div className="text-gray-500 ">
                        <p className="mb-0 ">Appointment Date:</p>
                        <span className="block font-bold text-black">
                          {appointment.date}
                        </span>
                      </div>

                      {/* Right: Appointment Time */}
                      <div className="text-gray-500">
                        <p className="mb-0">Appointment Time:</p>
                        <span className="block font-bold text-black">
                          {appointment.time} {appointment.time_unit}
                        </span>
                      </div>
                    </div>
                  </div>
                  {appointment.status === "Accepted" && (
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 my-text bg-white border-rose-500 rounded-lg border-1"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Go To Mobile App
                      </button>
                    </div>
                  )}

                  {/* Modal */}
                  {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="relative p-6 text-center bg-white shadow-lg rounded-2xl w-80">
                        {/* Close Button */}
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="absolute text-gray-500 top-3 right-3"
                        >
                          <IoCloseCircleOutline size={18} />
                        </button>

                        <h2 className="text-lg font-semibold">
                          Go to Mobile App
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                          This feature works only in the Housezo App.
                        </p>

                        <button
                          className="w-full py-2 mt-4 text-white my-bg rounded-lg"
                          onClick={() => history.push("/download")}
                        >
                          Download
                        </button>

                        {/* App Store and Play Store Icons */}
                        <div className="flex justify-center mt-3 space-x-4">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                            alt="Google Play"
                            className="h-10"
                          />
                          <img
                            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                            alt="App Store"
                            className="h-10"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* {appointment.status === "Rejected" && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleRescheduleClick(appointment)}
                        className="px-4 py-2 text-white my-bg rounded-lg"
                      >
                        Resheduled Appointment
                      </button>
                    </div>
                  )}
                  {showModal && selectedAppointment && (
                    <ReScheduleModal
                      setScheduledDateLabel={fetchAppointments}
                      onClose={() => setShowModal(false)}
                      propertyDetails={selectedAppointment}
                      setIsModalOpen={setShowModal}
                    />
                  )} */}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "received" && (
          <>
            {/* Filter Buttons */}
            <div className="flex gap-4 mt-4">
              {["All", "Pending", "Accepted", "Rejected", "Expired"].map(
                (filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-3xl ${
                      activeFilter === filter.toLowerCase()
                        ? "bg-rose-100 my-text"
                        : "bg-gray-100 text-gray-500"
                    }`}
                    onClick={() => setActiveFilter(filter.toLowerCase())}
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>

            {/* Appointment Cards */}
            <div className="mt-6 space-y-4">
              {filteredReceivedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`border-2 ${
                    appointment.status === "Accepted"
                      ? "border-green-400"
                      : appointment.status === "Rejected"
                        ? "border-red-400"
                        : appointment.status === "Expired"
                          ? "border-blue-400"
                          : "border-yellow-400"
                  } bg-white p-6 rounded-lg shadow-md`}
                >
                  {/* Top Section: Name, Role, Phone, Email */}
                  <div className="flex flex-wrap items-center justify-between pb-3 border-b">
                    {/* Name & Role */}
                    <div className="flex items-start gap-3">
                      {/* <div className="p-2 bg-rose-100 rounded-full">
                        <User className="text-4xl my-text" />
                      </div> */}
                      <div className="rounded-full bg-slate-100">
                        {appointment.property_owner_image ? (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/media/${appointment.property_owner_image}`}
                            alt="Owner"
                            className="object-cover w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="p-2 bg-rose-100 rounded-full">
                            <User className="text-4xl my-text" />
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="block text-lg font-semibold">
                          {appointment.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {appointment.role}
                        </span>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="flex items-center gap-20 text-sm">
                      {/* Phone */}
                      {/* <div className="flex items-center gap-2">
                        <FiSmartphone className="text-lg my-text" />
                        {showPhone ? (
                          <span className="text-black">{appointment.phone}</span>
                        ) : (
                          <button
                            onClick={() => setShowPhone(true)}
                            className="px-3 py-1 text-sm text-white my-bg rounded-md"
                          >
                            Contact
                          </button>
                        )}

                      </div> */}
                      <div className="flex items-center gap-2">
                        <FiSmartphone className="text-lg my-text" />
                        {/* {showPhone ? ( */}
                        {visiblePhoneId === appointment.id ? (
                          <span className="text-black">
                            {appointment.phone}
                          </span>
                        ) : (
                          <button
                            // onClick={() => setShowPhone(true)}
                            onClick={() => {
                              if (user_id) {
                                if (freeViewCount || paidViewCount) {
                                  if (freeViewCount > 0) {
                                    const updatedCount = -1;
                                    setFreeViewCount(updatedCount);
                                    handleAddCount(updatedCount);
                                  } else if (paidViewCount > 0) {
                                    const updatedCount = -1;
                                    setPaidViewCount(updatedCount);
                                    handleAddCount(updatedCount);
                                  }
                                  setVisiblePhoneId(appointment.id);
                                  // setShowPhone(true)
                                } else {
                                  setShowModal(true);
                                }
                              } else {
                                toast.success("Plzz Log In To Continue...");
                              }
                            }}
                            className="px-3 py-1 text-sm text-white my-bg rounded-md"
                          >
                            Contact
                          </button>
                        )}
                      </div>

                      {/* Email */}
                      {/* <div className="flex items-center gap-2 my-text">
                        <FaRegEnvelope className="text-lg my-text" />
                        <span className="text-black">{appointment.email}</span>
                      </div> */}
                    </div>
                  </div>

                  {/* Bottom Section: Two Columns Layout */}
                  <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                    {/* Left Column: Property Details */}
                    <div className="flex items-start gap-4">
                      {/* Image Wrapper */}
                      <div className="relative h-24 w-44">
                        <Link
                          to={{
                            pathname:
                              appointment.tour_type === "Property"
                                ? `/propertydetails/${appointment.property_id}`
                                : `/projectdetail/${appointment.property_id}`,
                            state: { propertyId: appointment.property_id },
                          }}
                        >
                          <img
                            src={
                              appointment.image?.startsWith("http")
                                ? appointment.image
                                : `${process.env.REACT_APP_API_URL}/${appointment.image}`
                            }
                            alt="Property Cover"
                            className="object-cover w-32 h-24 rounded-md"
                          />
                        </Link>
                        <span
                          className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-md ${
                            appointment.type === "Buy"
                              ? "bg-green-600"
                              : appointment.type === "Rent"
                                ? "bg-blue-600"
                                : "bg-gray-800"
                          }`}
                        >
                          {appointment.type === "Buy"
                            ? "For Buy"
                            : appointment.type === "Rent"
                              ? "For Rent"
                              : "For Project"}
                        </span>
                      </div>
                      {/* Property Details */}
                      <div>
                        <h4 className="mb-0 font-semibold">
                          {appointment.property_name}
                        </h4>
                        <p className="text-gray-500">{appointment.location}</p>
                        <p className="font-bold">
                          {appointment.type === "Rent" ? (
                            <>
                              ₹{" "}
                              {Number(appointment.rent) >= 10000000
                                ? (Number(appointment.rent) / 10000000)
                                    .toFixed(1)
                                    .replace(/\.0$/, "") + " Cr"
                                : Number(appointment.rent) >= 100000
                                  ? (Number(appointment.rent) / 100000)
                                      .toFixed(1)
                                      .replace(/\.0$/, "") + " L"
                                  : Number(appointment.rent) >= 1000
                                    ? (Number(appointment.rent) / 1000)
                                        .toFixed(1)
                                        .replace(/\.0$/, "") + " K"
                                    : appointment.rent}
                              {appointment.rent_duration &&
                              appointment.rent_duration !== "N/A"
                                ? ` / ${appointment.rent_duration}`
                                : ""}
                            </>
                          ) : (
                            appointment.price &&
                            appointment.price !== "N/A" && (
                              <>
                                ₹{" "}
                                {Number(appointment.price) >= 10000000
                                  ? (Number(appointment.price) / 10000000)
                                      .toFixed(1)
                                      .replace(/\.0$/, "") + " Cr"
                                  : Number(appointment.price) >= 100000
                                    ? (Number(appointment.price) / 100000)
                                        .toFixed(1)
                                        .replace(/\.0$/, "") + " L"
                                    : Number(appointment.price) >= 1000
                                      ? (Number(appointment.price) / 1000)
                                          .toFixed(1)
                                          .replace(/\.0$/, "") + " K"
                                      : appointment.price}
                              </>
                            )
                          )}
                        </p>
                        {appointment.status === "Accepted" ? (
                          <p className="flex items-center gap-2 mt-2 font-medium text-green-600">
                            <span className="px-2 py-1 text-sm bg-green-100 rounded-md">
                              Accepted
                            </span>
                            <span className="text-black">
                              {" "}
                              {appointment.date}
                            </span>
                          </p>
                        ) : appointment.status === "Rejected" ? (
                          <p className="flex items-center gap-2 mt-2 font-medium text-red-600">
                            <span className="px-2 py-1 text-sm bg-red-100 rounded-md">
                              Rejected
                            </span>
                            <span className="text-black">
                              {" "}
                              {appointment.date}
                            </span>
                          </p>
                        ) : (
                          <p className="mt-2 font-medium text-yellow-600">
                            {appointment.status}
                            <span className="text-black">
                              {" "}
                              {appointment.date}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Appointment Details */}
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">
                        Appointment Date
                        <span className="block font-bold text-black">
                          {appointment.date}
                        </span>
                      </p>
                      <p className="text-gray-500">
                        Appointment Time
                        <span className="block font-bold text-black">
                          {appointment.time} {appointment.time_unit}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 mt-4">
                    {appointment.status === "Pending" ? (
                      <>
                        <button
                          className="px-4 py-2 text-white bg-green-500 rounded-md"
                          onClick={() => {
                            setPendingAction({
                              id: appointment.id,
                              status: "Accepted",
                            });
                            setIsConfirmOpen(true);
                          }}
                        >
                          Accept
                        </button>

                        <button
                          className="px-4 py-2 text-white bg-red-500 rounded-md"
                          onClick={() => {
                            setPendingAction({
                              id: appointment.id,
                              status: "Rejected",
                            });
                            setIsConfirmOpen(true);
                          }}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <>
                        {appointment.status === "Accepted" && (
                          <div className="flex justify-end">
                            <button
                              className="px-4 py-2 my-text bg-white border-rose-500 rounded-lg border-1"
                              onClick={() => setIsModalOpen(true)}
                            >
                              Go To Mobile App
                            </button>
                          </div>
                        )}
                        {appointment.status === "Rejected" && (
                          <div className="flex justify-end"></div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
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

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-6 text-center bg-white shadow-lg rounded-2xl w-80">
            {/* Close Button */}
            <button
              onClick={() => setIsConfirmOpen(false)}
              className="absolute text-gray-500 top-3 right-3"
            >
              <IoCloseCircleOutline size={18} />
            </button>

            <h2 className="text-lg font-semibold">Confirm Action</h2>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to <b>{pendingAction?.status}</b> this tour?
            </p>

            <div className="flex justify-between mt-4">
              <button
                className="w-1/2 px-4 py-2 mr-2 text-black bg-gray-300 rounded-lg"
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`${
                  pendingAction?.status === "Accepted" ? "my-bg" : "my-bg"
                } text-white px-4 py-2 rounded-lg w-1/2`}
                onClick={() => {
                  handleStatusUpdate(pendingAction.id, pendingAction.status);
                  setIsConfirmOpen(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl">
            <h2 className="mb-4 text-xl font-semibold text-red-600">
              Free Property Posting Limit Reached
            </h2>
            <p className="mb-6 text-gray-700">
              Your free property posting limit has ended. Please purchase a plan
              to continue posting properties.
            </p>
            {/* Align buttons side by side on the right */}
            <div className="flex items-center justify-between px-1">
              <button
                className="px-4 py-2 text-white my-bg rounded hover:bg-green-700"
                onClick={() => {
                  setShowModal(false); // FIXED
                  history.push({
                    pathname: "/dashboard",
                    state: { page: "mySubscriptions" },
                  });
                }}
              >
                Purchase Plan
              </button>
              <button
                className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowModal(false);
                  history.push("/dashboard", { page: "myVirtualtour" });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default MyVirtualTour;
