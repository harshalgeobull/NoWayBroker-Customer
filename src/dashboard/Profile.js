import React, { useState, useEffect, useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import {
  HouseSimple,
  Eye,
  IdentificationCard,
  User,
  CloudArrowUp,
} from "@phosphor-icons/react";
import { IoCloudUploadOutline } from "react-icons/io5"; // Updated icon
import axios from "axios";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [listingsCount, setListingsCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);
  const [virtualTourCount, setVirtualTourCount] = useState(0);
  const accessToken = sessionStorage.getItem("accessToken");

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: accessToken }),
        },
      );

      const data = await response.json();
      if (data.status === 1 && data.data) {
        setProfileData(data.data);
        setUpdatedData(data.data);
        // Set profile image if available
        if (data.data.profile_image) {
          setProfileImage(data.data.profile_image);
        }

        // Access compare_data counts (listings, leads, tours)
        if (data.compare_data) {
          setListingsCount(data.compare_data.listings_count || 0);
          setLeadsCount(data.compare_data.leads_count || 0);
          setVirtualTourCount(data.compare_data.virtual_tour_count || 0);
        }
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken, profileImage]);

  const displayValue = (value) =>
    value !== null && value !== "" ? value : "N/A";

  // Check if the logged-in user is a Builder (used to conditionally show Company Name)
  const isBuilder =
    (updatedData.user_type || profileData?.user_type || "")
      .toString()
      .toLowerCase() === "builder";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/edit_profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: accessToken,
            full_name: updatedData.full_name,
            email: updatedData.email,
            mobile_number: updatedData.mobile_number,
            proprietorship: updatedData.proprietorship,
            experience: updatedData.experience,
            city: updatedData.city,
            company_name: updatedData.company_name,
          }),
        },
      );
      const result = await response.json();
      if (result.status === 1) {
        setProfileData(updatedData);
        setIsModalOpen(false);
        // Save email in sessionStorage
        sessionStorage.setItem("user_email", updatedData.email);
      } else {
        console.error("Update failed:", result);
      }
    } catch (error) {
      console.error("API Update Error:", error);
    }
  };

  const handleImageChange = async (e) => {
    await fetchProfile();
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setProfileImage(previewURL);

    const formData = new FormData();
    formData.append("user_id", accessToken);
    formData.append("profile_image", file);

    // Prepare FormData with existing profile fields
    formData.append("user_id", accessToken);
    formData.append("profile_image", file);
    formData.append("full_name", profileData.full_name);
    formData.append("email", profileData.email);
    formData.append("mobile_number", profileData.mobile_number);
    formData.append("experience", profileData.experience || "");
    formData.append("proprietorship", profileData.proprietorship || "");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/edit_profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Upload success:", res.data);

      // If backend returns image URL, use it
      if (res.data.status === 1 && res.data.data?.profile_image) {
        setProfileImage(res.data.data.profile_image);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // return (
  //   <>
  //     <h2 className="text-xl font-semibold mb-4 pt-3">
  //       Welcome back,{" "}
  //       {profileData ? displayValue(profileData.full_name) : "Loading..."}!
  //     </h2>

  //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //       <div className="bg-white p-6 rounded-md border border-gray-100 flex items-center space-x-4">
  //         <div className="w-20 h-20 flex items-center justify-center border border-green-500 rounded-full bg-green-50">
  //           <HouseSimple className="text-green-500 text-4xl" />
  //         </div>
  //         <div>
  //           <p className="text-2xl font-bold">{listingsCount}</p>
  //           <p className="text-gray-600">Your Listings</p>
  //         </div>
  //       </div>
  //       <div className="bg-white p-6 rounded-md border border-gray-100 flex items-center space-x-4">
  //         <div className="w-20 h-20 flex items-center justify-center border border-yellow-500 rounded-full bg-yellow-50">
  //           <Eye className="text-yellow-500 text-3xl" />
  //         </div>
  //         <div>
  //           <p className="text-2xl font-bold">{leadsCount}</p>
  //           <p className="text-gray-600">Leads</p>
  //         </div>
  //       </div>
  //       <div className="bg-white p-6 rounded-md border border-gray-100 flex items-center space-x-4">
  //         <div className="w-20 h-20 flex items-center justify-center border border-rose-500 rounded-full bg-rose-50">
  //           <IdentificationCard className="my-text text-3xl" />
  //         </div>
  //         <div>
  //           <p className="text-2xl font-bold">{virtualTourCount}</p>
  //           <p className="text-gray-600">Virtual Appointments</p>
  //         </div>
  //       </div>
  //     </div>

  //     {profileData && (
  //       <div className="bg-white p-6 mt-6 rounded-md shadow-sm flex flex-col md:flex-row items-center md:items-start">
  //         <div className="relative w-48 h-48 rounded-xl flex items-center justify-center bg-gray-100">
  //           {profileImage ? (
  //             <img
  //               src={profileImage}
  //               alt="Profile"
  //               className="w-full h-full object-cover rounded-xl cursor-pointer"
  //               onClick={() => fileInputRef.current.click()}
  //             />
  //           ) : (
  //             <User
  //               className="my-text text-[14rem]"
  //               weight="thin"
  //               onClick={() => fileInputRef.current.click()}
  //             />
  //           )}

  //           <label className="absolute top-[-10px] right-[-10px] my-bg  p-1 rounded-full shadow-md">
  //             <CloudArrowUp className="text-white text-xl" />
  //             <input
  //               type="file"
  //               accept="image/*"
  //               className="hidden"
  //               ref={fileInputRef}
  //               onChange={handleImageChange}
  //             />
  //           </label>
  //         </div>

  //         <div className="ml-12 grid grid-cols-2 gap-x-24">
  //           <div>
  //             <p className="text-gray-600">Name</p>
  //             <h3 className="text-lg font-bold">
  //               {displayValue(profileData.full_name)}
  //             </h3>

  //             <p className="text-gray-600 mt-4">Email</p>
  //             <p className="text-gray-800">{displayValue(profileData.email)}</p>

  //             <p className="text-gray-600 mt-4">Mobile</p>
  //             <p className="text-gray-800">
  //               {displayValue(profileData.mobile_number)}
  //             </p>

  //             <p className="text-gray-600 mt-4">City</p>
  //             <p className="text-gray-800">{displayValue(profileData.city)}</p>
  //           </div>
  //           <div>
  //             <p className="text-gray-600">Experience</p>
  //             <p className="text-gray-800">
  //               {displayValue(profileData.experience)}
  //             </p>

  //             <p className="text-gray-600 mt-4">Proprietorship</p>
  //             <p className="text-gray-800 font-semibold">
  //               {displayValue(profileData.proprietorship)}
  //             </p>
  //             {isBuilder && (
  //               <>
  //                 <p className="text-gray-600 mt-4">Company Name</p>
  //                 <p className="text-gray-800 font-semibold">
  //                   {displayValue(profileData.company_name)}
  //                 </p>
  //               </>
  //             )}
  //           </div>
  //         </div>
  //         <button
  //           onClick={() => setIsModalOpen(true)}
  //           className="ml-auto px-4 py-2 bg-white my-text rounded-md mt-4 md:mt-0 border border-rose-500"
  //         >
  //           Edit Profile
  //         </button>
  //       </div>
  //     )}

  //     {isModalOpen && (
  //       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  //         <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
  //           <button
  //             className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
  //             onClick={() => setIsModalOpen(false)}
  //           >
  //             <IoCloseCircleOutline className="text-2xl" />
  //           </button>
  //           <h2 className="text-xl font-semibold mb-4 text-center">
  //             Edit Profile
  //           </h2>
  //           <div className="space-y-3">
  //             <label className="block">
  //               <span className="text-gray-600">Name</span>
  //               <input
  //                 type="text"
  //                 name="full_name"
  //                 className="w-full border rounded-md p-2"
  //                 value={updatedData.full_name}
  //                 onChange={handleInputChange}
  //                 onKeyDown={(e) => {
  //                   const key = e.key;
  //                   const isLetter = /^[a-zA-Z\s]$/.test(key);
  //                   const isControl = [
  //                     "Backspace",
  //                     "Tab",
  //                     "ArrowLeft",
  //                     "ArrowRight",
  //                     "Delete",
  //                   ].includes(key);

  //                   if (!isLetter && !isControl) {
  //                     e.preventDefault();
  //                   }
  //                 }}
  //               />
  //             </label>
  //             <label className="block">
  //               <span className="text-gray-600">Mobile Number</span>
  //               <input
  //                 type="text"
  //                 name="mobile_number"
  //                 className="w-full border rounded-md p-2"
  //                 value={updatedData.mobile_number || ""}
  //                 onChange={handleInputChange}
  //                 maxLength={10}
  //                 readOnly
  //               />
  //             </label>
  //             <label className="block">
  //               <span className="text-gray-600">Email</span>
  //               <input
  //                 type="email"
  //                 name="email"
  //                 className="w-full border rounded-md p-2"
  //                 value={updatedData.email}
  //                 onChange={handleInputChange}
  //                 pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
  //                 title="Please enter a valid email address"
  //               />
  //             </label>
  //             {isBuilder && (
  //               <label className="block">
  //                 <span className="text-gray-600">Company Name</span>
  //                 <input
  //                   type="text"
  //                   name="company_name"
  //                   className="w-full border rounded-md p-2"
  //                   value={updatedData.company_name || ""}
  //                   onChange={handleInputChange}
  //                 />
  //               </label>
  //             )}
  //             <label className="block">
  //               <span className="text-gray-600">City</span>
  //               <input
  //                 type="text"
  //                 name="city"
  //                 className="w-full border rounded-md p-2"
  //                 value={updatedData.city || ""}
  //                 onChange={handleInputChange}
  //               />
  //             </label>
  //             <label className="block">
  //               <span className="text-gray-600">Experience</span>
  //               <input
  //                 type="text"
  //                 name="experience"
  //                 className="w-full border rounded-md p-2"
  //                 value={updatedData.experience}
  //                 onChange={handleInputChange}
  //                 onKeyDown={(e) => {
  //                   const key = e.key;
  //                   const isNumber = /^[0-9]$/.test(key);
  //                   const isControlKey = [
  //                     "Backspace",
  //                     "Tab",
  //                     "ArrowLeft",
  //                     "ArrowRight",
  //                     "Delete",
  //                   ].includes(key);

  //                   if (!isNumber && !isControlKey) {
  //                     e.preventDefault();
  //                   }
  //                 }}
  //               />
  //             </label>
  //             <label className="block">
  //               <span className="text-gray-600">Proprietorship</span>
  //               <select
  //                 name="proprietorship"
  //                 className="w-full border rounded-md p-2"
  //                 value={updatedData.proprietorship}
  //                 onChange={handleInputChange}
  //               >
  //                 <option value="">Select</option>
  //                 <option value="Individual">Individual</option>
  //                 <option value="Partnership">Partnership</option>
  //                 <option value="Private Limited">Private Limited</option>
  //                 <option value="LLP">LLP</option>
  //               </select>
  //             </label>
  //           </div>
  //           <button
  //             className="mt-4 w-full my-bg text-white py-2 rounded-md"
  //             onClick={handleUpdateProfile}
  //           >
  //             Update Profile
  //           </button>
  //         </div>
  //       </div>
  //     )}
  //   </>
  // );
  return (
  <>
  <div className="max-w-6xl p-3 mx-auto sm:p-4 md:p-5 lg:p-0">
    {/* ==================== WELCOME ==================== */}
    <h2 className="pt-3 mb-4 text-xl font-semibold">
      Welcome back,{" "}
      {profileData ? displayValue(profileData.full_name) : "Loading..."}!
    </h2>

    {/* ==================== STATS ==================== */}
    
<div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">

  {/* Listings */}
  <div className="flex items-center p-3 space-x-2 bg-white border border-gray-100 rounded-md sm:p-4 sm:space-x-3 lg:p-6 lg:space-x-4">
    <div className="flex items-center justify-center flex-shrink-0 w-11 h-11 border border-green-500 rounded-full sm:w-14 sm:h-14 lg:w-20 lg:h-20 bg-green-50">
      <HouseSimple className="text-xl text-green-500 sm:text-2xl lg:text-4xl" />
    </div>

    <div className="min-w-0">
      <p className="text-lg font-bold sm:text-xl lg:text-2xl">
        {listingsCount}
      </p>

      <p className="text-xs text-gray-600 sm:text-sm lg:text-base">
        Your Listings
      </p>
    </div>
  </div>

  {/* Leads */}
  <div className="flex items-center p-3 space-x-2 bg-white border border-gray-100 rounded-md sm:p-4 sm:space-x-3 lg:p-6 lg:space-x-4">
    <div className="flex items-center justify-center flex-shrink-0 w-11 h-11 border border-yellow-500 rounded-full sm:w-14 sm:h-14 lg:w-20 lg:h-20 bg-yellow-50">
      <Eye className="text-xl text-yellow-500 sm:text-2xl lg:text-3xl" />
    </div>

    <div className="min-w-0">
      <p className="text-lg font-bold sm:text-xl lg:text-2xl">
        {leadsCount}
      </p>

      <p className="text-xs text-gray-600 sm:text-sm lg:text-base">
        Leads
      </p>
    </div>
  </div>

  {/* Virtual Appointments */}
  <div className="flex items-center p-3 space-x-2 bg-white border border-gray-100 rounded-md sm:p-4 sm:space-x-3 lg:p-6 lg:space-x-4">
    <div className="flex items-center justify-center flex-shrink-0 w-11 h-11 border border-rose-500 rounded-full sm:w-14 sm:h-14 lg:w-20 lg:h-20 bg-rose-50">
      <IdentificationCard className="text-xl sm:text-2xl lg:text-3xl my-text" />
    </div>

    <div className="min-w-0">
      <p className="text-lg font-bold sm:text-xl lg:text-2xl">
        {virtualTourCount}
      </p>

      <p className="text-xs text-gray-600 sm:text-sm lg:text-base">
        Virtual Appointments
      </p>
    </div>
  </div>

</div>
    {/* ==================== PROFILE INFORMATION ==================== */}
    {profileData && (
      <div
        className="
          flex flex-col items-center
          p-4 mt-5
          bg-white rounded-md shadow-sm

          sm:p-5
          md:items-start

          lg:flex-row
          lg:items-start
          lg:p-6
          lg:mt-6
        "
      >
        {/* ==================== PROFILE IMAGE ==================== */}
        <div
          className="
            relative flex items-center justify-center
            flex-shrink-0
            w-32 h-32
            bg-gray-100
            rounded-xl

            sm:w-36 sm:h-36

            md:w-40 md:h-40

            lg:w-48 lg:h-48
          "
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="object-cover w-full h-full rounded-xl cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            />
          ) : (
            <User
              className="
                text-[8rem]
                sm:text-[9rem]
                md:text-[10rem]
                lg:text-[14rem]
                my-text
              "
              weight="thin"
              onClick={() => fileInputRef.current.click()}
            />
          )}

          <label
            className="
              absolute
              top-[-6px] right-[-6px]
              lg:top-[-10px] lg:right-[-10px]
              p-1
              rounded-full
              shadow-md
              cursor-pointer
              my-bg
            "
          >
            <CloudArrowUp className="text-base text-white lg:text-xl" />

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* ==================== PROFILE DETAILS ==================== */}
        <div
          className="
            w-full
            mt-5

            sm:mt-6

            md:mt-6

            lg:w-auto
            lg:mt-0
            lg:ml-12
            lg:grid
            lg:grid-cols-2
            lg:gap-x-24
          "
        >
          {/* LEFT DETAILS */}
          <div>
            <p className="text-sm text-gray-600">Name</p>

            <h3 className="text-base font-bold break-words lg:text-lg">
              {displayValue(profileData.full_name)}
            </h3>

            <p className="mt-3 text-sm text-gray-600 lg:mt-4">
              Email
            </p>

            <p className="text-sm text-gray-800 break-all lg:text-base">
              {displayValue(profileData.email)}
            </p>

            <p className="mt-3 text-sm text-gray-600 lg:mt-4">
              Mobile
            </p>

            <p className="text-sm text-gray-800 lg:text-base">
              {displayValue(profileData.mobile_number)}
            </p>

            <p className="mt-3 text-sm text-gray-600 lg:mt-4">
              City
            </p>

            <p className="text-sm text-gray-800 lg:text-base">
              {displayValue(profileData.city)}
            </p>
          </div>

          {/* RIGHT DETAILS */}
          <div className="mt-4 lg:mt-0">
            <p className="text-sm text-gray-600">
              Experience
            </p>

            <p className="text-sm text-gray-800 lg:text-base">
              {displayValue(profileData.experience)}
            </p>

            <p className="mt-3 text-sm text-gray-600 lg:mt-4">
              Proprietorship
            </p>

            <p className="text-sm font-semibold text-gray-800 lg:text-base">
              {displayValue(profileData.proprietorship)}
            </p>

            {isBuilder && (
              <>
                <p className="mt-3 text-sm text-gray-600 lg:mt-4">
                  Company Name
                </p>

                <p className="text-sm font-semibold text-gray-800 break-words lg:text-base">
                  {displayValue(profileData.company_name)}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ==================== EDIT BUTTON ==================== */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="
            w-full
            px-4 py-2
            mt-5
            text-sm
            bg-white
            rounded-md
            my-text
            border border-rose-500

            sm:w-auto
            sm:self-center

            md:self-start

            lg:w-auto
            lg:ml-auto
            lg:mt-0
          "
        >
          Edit Profile
        </button>
      </div>
    )}
</div>
    {/* ==================== EDIT PROFILE MODAL ==================== */}
    {isModalOpen && (
      <div
        className="
          fixed inset-0 z-50
          flex items-center justify-center
          p-4
          bg-black bg-opacity-50
          overflow-y-auto
        "
      >
        <div
          className="
            relative
            w-full
            max-w-sm
            p-5
            my-4
            bg-white
            rounded-lg
            shadow-lg

            sm:max-w-md
            sm:p-6
          "
        >
          {/* Close */}
          <button
            className="
              absolute
              top-2 right-2
              text-gray-500
              hover:text-gray-800
            "
            onClick={() => setIsModalOpen(false)}
          >
            <IoCloseCircleOutline className="text-2xl" />
          </button>

          <h2 className="mb-4 text-xl font-semibold text-center">
            Edit Profile
          </h2>

          <div className="space-y-3">
            {/* Name */}
            <label className="block">
              <span className="text-sm text-gray-600">
                Name
              </span>

              <input
                type="text"
                name="full_name"
                className="
                  w-full
                  p-2
                  mt-1
                  text-sm
                  border
                  rounded-md
                  outline-none
                  focus:ring-1
                  focus:ring-rose-400
                "
                value={updatedData.full_name}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  const key = e.key;

                  const isLetter = /^[a-zA-Z\s]$/.test(key);

                  const isControl = [
                    "Backspace",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                  ].includes(key);

                  if (!isLetter && !isControl) {
                    e.preventDefault();
                  }
                }}
              />
            </label>

            {/* Mobile */}
            <label className="block">
              <span className="text-sm text-gray-600">
                Mobile Number
              </span>

              <input
                type="text"
                name="mobile_number"
                className="
                  w-full
                  p-2
                  mt-1
                  text-sm
                  border
                  rounded-md
                "
                value={updatedData.mobile_number || ""}
                onChange={handleInputChange}
                maxLength={10}
                readOnly
              />
            </label>

            {/* Email */}
            <label className="block">
              <span className="text-sm text-gray-600">
                Email
              </span>

              <input
                type="email"
                name="email"
                className="
                  w-full
                  p-2
                  mt-1
                  text-sm
                  border
                  rounded-md
                  outline-none
                  focus:ring-1
                  focus:ring-rose-400
                "
                value={updatedData.email}
                onChange={handleInputChange}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                title="Please enter a valid email address"
              />
            </label>

            {/* Company Name */}
            {isBuilder && (
              <label className="block">
                <span className="text-sm text-gray-600">
                  Company Name
                </span>

                <input
                  type="text"
                  name="company_name"
                  className="
                    w-full
                    p-2
                    mt-1
                    text-sm
                    border
                    rounded-md
                  "
                  value={updatedData.company_name || ""}
                  onChange={handleInputChange}
                />
              </label>
            )}

            {/* City */}
            <label className="block">
              <span className="text-sm text-gray-600">
                City
              </span>

              <input
                type="text"
                name="city"
                className="
                  w-full
                  p-2
                  mt-1
                  text-sm
                  border
                  rounded-md
                "
                value={updatedData.city || ""}
                onChange={handleInputChange}
              />
            </label>

            {/* Experience */}
            <label className="block">
              <span className="text-sm text-gray-600">
                Experience
              </span>

              <input
                type="text"
                name="experience"
                className="
                  w-full
                  p-2
                  mt-1
                  text-sm
                  border
                  rounded-md
                "
                value={updatedData.experience}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  const key = e.key;

                  const isNumber = /^[0-9]$/.test(key);

                  const isControlKey = [
                    "Backspace",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                  ].includes(key);

                  if (!isNumber && !isControlKey) {
                    e.preventDefault();
                  }
                }}
              />
            </label>

            {/* Proprietorship */}
            <label className="block">
              <span className="text-sm text-gray-600">
                Proprietorship
              </span>

              <select
                name="proprietorship"
                className="
                  w-full
                  p-2
                  mt-1
                  text-sm
                  border
                  rounded-md
                  bg-white
                "
                value={updatedData.proprietorship}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="Individual">Individual</option>
                <option value="Partnership">Partnership</option>
                <option value="Private Limited">
                  Private Limited
                </option>
                <option value="LLP">LLP</option>
              </select>
            </label>
          </div>

          {/* Update Button */}
          <button
            className="
              w-full
              px-4
              py-2
              mt-4
              text-sm
              text-white
              rounded-md
              my-bg
            "
            onClick={handleUpdateProfile}
          >
            Update Profile
          </button>
        </div>
      </div>
    )}
  </>
);

};

export default Profile;