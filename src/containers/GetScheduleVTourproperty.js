import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const GetScheduleVTourproperty = ({
  setScheduledDateLabel,
  onClose,
  propertyDetails,
  setIsModalOpen,
  scheduledDateLabel,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(() => {
    const now = new Date();
    return now.getHours() >= 12 ? now.getHours() - 12 + 1 : now.getHours() + 1;
  });
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isSelectingHour, setIsSelectingHour] = useState(true);
  const [isAM, setIsAM] = useState(new Date().getHours() < 12);
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

  // Check if a date is in the past
  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const checkDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day,
    );
    return checkDate < today;
  };

  // Check if the current month is the system's current month
  const isCurrentMonth = () => {
    const today = new Date();
    return (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth()
    );
  };

  // Check if the selected date is today
  const isToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );
    return selected.getTime() === today.getTime();
  };

  // Check if a time is in the past (for today only)
  const isPastTime = (hour, minute) => {
    if (!isToday()) return false; // No restrictions for future dates
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const selectedHour24 = isAM ? hour : hour + 12;
    return (
      selectedHour24 < currentHour ||
      (selectedHour24 === currentHour && minute <= currentMinute)
    );
  };

  const handleDateClick = (day) => {
    if (!isPastDate(day)) {
      setSelectedDate(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day),
      );
      // Adjust time if selecting today to ensure it's a future time
      if (isToday()) {
        const now = new Date();
        const nextHour =
          now.getHours() >= 12 ? now.getHours() - 12 + 1 : now.getHours() + 1;
        setSelectedHour(nextHour);
        setSelectedMinute(0);
        setIsAM(now.getHours() < 12);
      }
    }
  };

  const handleHourClick = (hour) => {
    if (!isPastTime(hour, selectedMinute)) {
      setSelectedHour(hour);
    }
  };

  const handleMinuteClick = (min) => {
    if (!isPastTime(selectedHour, min)) {
      setSelectedMinute(min);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSchedule = async () => {
    try {
      const property_owner_id = propertyDetails?.user_id || "";
      const property_id = propertyDetails?._id || "";
      const user_id = sessionStorage.getItem("accessToken") || "";
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
      const monthName = selectedDate.toLocaleString("default", {
        month: "short",
      });
      const day = selectedDate.getDate();
      const year = selectedDate.getFullYear().toString().slice(-2);
      const scheduledLabel = `Scheduled ${day} ${monthName} ${year}`;
      setScheduledDateLabel(scheduledLabel);

      const generateUniqueChannelName = () => {
        const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
        const randomPart = "xxxxxxxxxxxxxxxx".replace(/x/g, () =>
          Math.floor(Math.random() * 16).toString(16),
        );
        return `property_${timestamp}${randomPart}_virtual_tour`;
      };

      const channel_name = generateUniqueChannelName();
      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("property_owner_id", property_owner_id);
      formData.append("property_id", property_id);
      formData.append("schedule_date", formattedDate);
      formData.append("time_unit", isAM ? "AM" : "PM");
      formData.append("channel_name", channel_name);
      formData.append("tour_type", "Property");
      const formattedTime = `${selectedHour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`;
      formData.append("timeslot", formattedTime);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/add_virtual_tour_schedule`,
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
      } else {
        toast.error(data?.msg || "Failed to schedule.");
        setIsScheduled(false);
        onClose();
      }
    } catch (error) {
      console.error("Schedule Error:", error);
      toast.error("An error occurred while scheduling.");
      setIsScheduled(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center m-0 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg md:max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Get Schedule</h2>
          <button
            aria-label="Close"
            onClick={handleClose}
            className="text-gray-500 transition-colors hover:text-gray-700"
          >
            <IoMdClose size={20} />
          </button>
        </div>
        {/* Main Content */}
        <div className="p-4">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Calendar Section */}
            <div className="w-full md:w-1/2">
              <div className="flex items-center justify-between mb-4">
                <button
                  aria-label="Previous Month"
                  onClick={() =>
                    !isCurrentMonth() &&
                    setSelectedDate(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth() - 1,
                        selectedDate.getDate(),
                      ),
                    )
                  }
                  className={`text-gray-500 hover:text-black transition-colors ${
                    isCurrentMonth() ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={isCurrentMonth()}
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
                        selectedDate.getDate(),
                      ),
                    )
                  }
                  className="text-gray-500 transition-colors hover:text-black"
                >
                  <FaChevronRight />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-sm text-gray-600">
                {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                  <span key={day} className="font-medium text-center">
                    {day}
                  </span>
                ))}
                {[...Array(firstDay)].map((_, i) => (
                  <div key={`empty-${i}`} className="h-8"></div>
                ))}
                {[...Array(daysInMonth)].map((_, day) => {
                  const isSelected = selectedDate.getDate() === day + 1;
                  const isDisabled = isPastDate(day + 1);
                  return (
                    <button
                      key={day}
                      className={`h-8 w-8 flex items-center justify-center text-sm rounded-full transition-colors ${
                        isSelected
                          ? "my-bg text-white"
                          : isDisabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-200"
                      }`}
                      onClick={() => handleDateClick(day + 1)}
                      disabled={isDisabled}
                    >
                      {day + 1}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Time Picker */}
            <div className="flex flex-col items-center w-full md:w-1/2">
              <span className="mb-2 text-xs text-gray-600">SELECT TIME</span>
              <div className="flex items-center space-x-4">
                {/* Hour Selector */}
                <div className="flex items-center">
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
                  <span className="mx-2 text-lg font-semibold">:</span>
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
                <div className="flex flex-col overflow-hidden rounded-md">
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
              <div className="relative flex items-center justify-center w-40 h-40 mt-6 border border-gray-300 rounded-full">
                <div
                  id="center-point"
                  className="absolute w-3 h-3 bg-black rounded-full"
                ></div>
                {isSelectingHour
                  ? // Hour Buttons (1 to 12)
                    [...Array(12)].map((_, i) => {
                      const hour = i + 1;
                      const isDisabled = isPastTime(hour, selectedMinute);
                      const angle = hour * 30;
                      const radius = 60;
                      const x = radius * Math.sin((angle * Math.PI) / 180);
                      const y = -radius * Math.cos((angle * Math.PI) / 180);
                      return (
                        <button
                          key={hour}
                          className={`absolute w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors ${
                            selectedHour === hour
                              ? "my-bg text-white"
                              : isDisabled
                                ? "text-gray-400 cursor-not-allowed"
                                : "hover:bg-gray-200"
                          }`}
                          style={{ transform: `translate(${x}px, ${y}px)` }}
                          onClick={() => handleHourClick(hour)}
                          disabled={isDisabled}
                        >
                          {hour}
                        </button>
                      );
                    })
                  : // Minute Buttons (0 to 55 every 5 mins)
                    [...Array(12)].map((_, i) => {
                      const minute = i * 5;
                      const isDisabled = isPastTime(selectedHour, minute);
                      const angle = minute * 6;
                      const radius = 60;
                      const x = radius * Math.sin((angle * Math.PI) / 180);
                      const y = -radius * Math.cos((angle * Math.PI) / 180);
                      return (
                        <button
                          key={minute}
                          className={`absolute w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors ${
                            selectedMinute === minute
                              ? "my-bg text-white"
                              : isDisabled
                                ? "text-gray-400 cursor-not-allowed"
                                : "hover:bg-gray-200"
                          }`}
                          style={{ transform: `translate(${x}px, ${y}px)` }}
                          onClick={() => handleMinuteClick(minute)}
                          disabled={isDisabled}
                        >
                          {minute.toString().padStart(2, "0")}
                        </button>
                      );
                    })}
                {/* Clock Hand */}
                {isSelectingHour ? (
                  <div
                    className="absolute w-[2px] h-[50px] my-bg transition-transform -translate-y-20 top-7"
                    style={{
                      transform: `rotate(${(selectedHour % 12) * 30}deg)`,
                      transformOrigin: "bottom center",
                    }}
                  />
                ) : (
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
              className="max-w-xs px-6 py-2 text-white transition-colors my-bg rounded-md hover:my-bg"
            >
              Get Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetScheduleVTourproperty;
