import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const ReScheduleModal = ({
  setScheduledDateLabel,
  onClose,
  propertyDetails,
  setIsModalOpen,
  fetchAppointments,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(7);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isSelectingHour, setIsSelectingHour] = useState(true);
  const [isAM, setIsAM] = useState(true);

  const [isScheduled, setIsScheduled] = useState(false);

  // Generate dates for the calendar
  const getMonthDays = () => {
    const firstDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1,
    ).getDay();
    const daysInMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0,
    ).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getMonthDays();

  const handleDateClick = (day) => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day),
    );
  };

  const handleHourClick = (hour) => {
    setSelectedHour(hour);
  };

  const handleMinuteClick = (min) => {
    setSelectedMinute(min);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSchedule = async () => {
    try {
      // Get required values
      const tour_schedule_id = propertyDetails?.id || "";

      // Format date
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const monthName = selectedDate.toLocaleString("default", {
        month: "short",
      });
      const day = selectedDate.getDate();
      const year = selectedDate.getFullYear().toString().slice(-2);

      // Update the label with the new format
      const scheduledLabel = `Scheduled ${day} ${monthName} ${year}`;

      // Update scheduled date label
      setScheduledDateLabel(scheduledLabel);

      const generateUniqueChannelName = () => {
        const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
        const randomPart = "xxxxxxxxxxxxxxxx".replace(/x/g, () =>
          Math.floor(Math.random() * 16).toString(16),
        );
        return `property_${timestamp}${randomPart}_virtual_tour`;
      };

      // Generate unique channel name
      const channel_name = generateUniqueChannelName();

      // Prepare form data
      const formData = new FormData();
      formData.append("tour_schedule_id", tour_schedule_id);
      formData.append("schedule_date", formattedDate);
      formData.append("time_unit", isAM ? "AM" : "PM");
      const formattedTime = `${selectedHour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`;
      formData.append("timeslot", formattedTime);

      // API Call
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/reschedule_virtual_tour`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Scheduled successfully!");
        setIsScheduled(true);
        onClose();
        fetchAppointments();
      }
    } catch (error) {
      toast.error("An error occurred while scheduling.");
      setIsScheduled(false);
      onClose();
    }
  };

  useEffect(() => {
    if (setIsModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [setIsModalOpen]);

  if (!propertyDetails) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50 m-0">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Get Schedule</h2>
          <button
            aria-label="Close"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Calendar Section */}
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-4">
                <button
                  aria-label="Previous Month"
                  onClick={() =>
                    setSelectedDate(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth() - 1,
                      ),
                    )
                  }
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  <FaChevronLeft />
                </button>
                <span className="font-semibold">
                  {selectedDate.toLocaleString("default", { month: "long" })}{" "}
                  {selectedDate.getFullYear()}
                </span>
                <button
                  aria-label="Next Month"
                  onClick={() =>
                    setSelectedDate(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth() + 1,
                      ),
                    )
                  }
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  <FaChevronRight />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-sm text-gray-600">
                {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                  <span key={day} className="text-center font-medium">
                    {day}
                  </span>
                ))}
                {[...Array(firstDay)].map((_, i) => (
                  <div key={`empty-${i}`} className="h-8"></div>
                ))}
                {[...Array(daysInMonth)].map((_, day) => {
                  const isSelected = selectedDate.getDate() === day + 1;
                  return (
                    <button
                      key={day}
                      className={`h-8 w-8 flex items-center justify-center text-sm rounded-full transition-colors ${
                        isSelected ? "my-bg text-white" : "hover:bg-gray-200"
                      }`}
                      onClick={() => handleDateClick(day + 1)}
                    >
                      {day + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Picker */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <span className="text-gray-600 text-xs mb-2">SELECT TIME</span>

              <div className="flex items-center space-x-4">
                {/* Hour Selector */}
                <div className="flex items-center">
                  {/* Clickable Hour */}
                  <div
                    onClick={() => setIsSelectingHour(true)}
                    className={`px-4 py-2 rounded-md cursor-pointer text-lg font-semibold ${
                      isSelectingHour
                        ? "bg-rose-100 my-text"
                        : "text-gray-600 bg-white"
                    }`}
                  >
                    {selectedHour?.toString().padStart(2, "0") ?? "--"}
                  </div>
                  <span className="text-lg font-semibold mx-2">:</span>
                  {/* Clickable Minute */}
                  <div
                    onClick={() => setIsSelectingHour(false)}
                    className={`px-4 py-2 rounded-md cursor-pointer text-lg font-semibold ${
                      !isSelectingHour
                        ? "bg-rose-100 my-text"
                        : "text-gray-600 bg-white"
                    }`}
                  >
                    {selectedMinute?.toString().padStart(2, "0") ?? "--"}
                  </div>
                </div>

                {/* AM/PM Toggle */}
                <div className="flex flex-col rounded-md overflow-hidden">
                  <button
                    onClick={() => setIsAM(true)}
                    className={`px-4 py-1 text-sm transition-colors ${
                      isAM ? "bg-rose-100 my-text" : "text-gray-600 bg-white"
                    }`}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => setIsAM(false)}
                    className={`px-4 py-1 text-sm transition-colors ${
                      !isAM ? "bg-rose-100 my-text" : "text-gray-600 bg-white"
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>

              {/* Clock Layout */}
              <div className="relative w-40 h-40 flex items-center justify-center rounded-full border border-gray-300 mt-6">
                {/* Clock Center */}
                <div
                  id="center-point"
                  className="w-3 h-3 bg-black rounded-full absolute"
                ></div>

                {isSelectingHour
                  ? // Hour Buttons (1 to 12)
                    [...Array(12)].map((_, i) => {
                      const angle = (i + 1) * 30;
                      const radius = 60;
                      const x = radius * Math.sin((angle * Math.PI) / 180);
                      const y = -radius * Math.cos((angle * Math.PI) / 180);

                      return (
                        <button
                          key={i + 1}
                          className={`absolute w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors ${
                            selectedHour === i + 1
                              ? "my-bg text-white"
                              : "hover:bg-gray-200"
                          }`}
                          style={{ transform: `translate(${x}px, ${y}px)` }}
                          onClick={() => handleHourClick(i + 1)}
                        >
                          {i + 1}
                        </button>
                      );
                    })
                  : // Minute Buttons (0 to 55 every 5 mins)
                    [...Array(12)].map((_, i) => {
                      const minute = i * 5;
                      const angle = minute * 6; // 360/60 = 6°
                      const radius = 60;
                      const x = radius * Math.sin((angle * Math.PI) / 180);
                      const y = -radius * Math.cos((angle * Math.PI) / 180);

                      return (
                        <button
                          key={minute}
                          className={`absolute w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors ${
                            selectedMinute === minute
                              ? "my-bg text-white"
                              : "hover:bg-gray-200"
                          }`}
                          style={{ transform: `translate(${x}px, ${y}px)` }}
                          onClick={() => handleMinuteClick(minute)}
                        >
                          {minute.toString().padStart(2, "0")}
                        </button>
                      );
                    })}

                {/* Clock Hand */}
                {isSelectingHour ? (
                  // Hour hand
                  <div
                    className="absolute w-[2px] h-[50px] my-bg transition-transform -translate-y-20 top-7"
                    style={{
                      transform: `rotate(${(selectedHour % 12) * 30}deg)`,
                      transformOrigin: "bottom center",
                    }}
                  />
                ) : (
                  // Minute hand
                  <div
                    className="absolute w-[2px] h-[50px] my-bg transition-transform -translate-y-20 top-7"
                    style={{
                      transform: `rotate(${(selectedMinute % 60) * 6}deg)`,
                      transformOrigin: "bottom center",
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Schedule Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSchedule}
              className="my-bg text-white py-2 px-6 rounded-md hover:my-bg transition-colors max-w-xs"
            >
              Get Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReScheduleModal;
