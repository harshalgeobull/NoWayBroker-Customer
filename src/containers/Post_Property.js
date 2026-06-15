import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
const Post_Property = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  // Function to check login status
  const checkLoginStatus = () => {
    const userId = sessionStorage.getItem("AccessToken");
    setIsLoggedIn(!!userId); // Update state based on existence of AccessToken
  };

  useEffect(() => {
    // Check login status when the component mounts
    checkLoginStatus();

    // Set an interval to check for changes in session storage every second
    const intervalId = setInterval(checkLoginStatus, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handlePostPropertyClick = () => {
    if (isLoggedIn) {
      history.push("/post-property");
    } else {
      history.push("/login");
    }
  };

  return (
    <div className="bg-orange-50 p-8">
      <div className="flex flex-col lg:flex-row justify-between items-center max-w-6xl mx-auto space-y-8 lg:space-y-0">
        {/* Left Section */}
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-600">
            SELL OR RENT YOUR PROPERTY
          </p>
          <h2 className="text-3xl font-bold text-gray-800 mt-4">
            Register to post your property for free
          </h2>
          <h3 className="text-lg font-medium text-gray-600 mt-2">
            Post your residential / commercial property
          </h3>

          {/* Property Stats */}
          <div className="mt-6 space-y-4">
            <div className="text-base text-gray-700">
              <strong>1,000,000</strong>+ Properties Listed
            </div>
            <div className="text-base text-gray-700">
              <strong>500,000</strong>+ Monthly Searches
            </div>
            <div className="text-base text-gray-700">
              <strong>200,000</strong>+ Owners Advertise Monthly
            </div>
          </div>

          {/* Post Property Button */}
          <div className="mt-8">
            <button
              className="inline-block bg-gray-300 text-black py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-600 transition duration-300"
              onClick={handlePostPropertyClick}
            >
              Post a Property Free
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          <img
            src="/image/post_a_property1.jpg"
            alt="Property Illustration"
            className="w-full rounded-lg shadow-lg"
            style={{ height: "350px", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Post_Property;

// import React from 'react';

// const Post_Property = () => {
//   return (
//     <div className="bg-orange-50 p-8">
//       <div className="flex flex-col lg:flex-row justify-between items-center max-w-6xl mx-auto space-y-8 lg:space-y-0">

//         {/* Left Section */}
//         <div className="flex-1">
//           <p className="text-lg font-semibold text-indigo-600">
//             SELL OR RENT YOUR PROPERTY
//           </p>
//           <h2 className="text-3xl font-bold text-gray-800 mt-4">
//             Register to post your property for free
//           </h2>
//           <h3 className="text-lg font-medium text-gray-600 mt-2">
//             Post your residential / commercial property
//           </h3>

//           {/* Property Stats */}
//           <div className="mt-6 space-y-4">
//             <div className="text-xl text-gray-700">
//               <strong>1,000,000</strong>+ Properties Listed
//             </div>
//             <div className="text-xl text-gray-700">
//               <strong>500,000</strong>+ Monthly Searches
//             </div>
//             <div className="text-xl text-gray-700">
//               <strong>200,000</strong>+ Owners Advertise Monthly
//             </div>
//           </div>

//           {/* Post Property Button */}
//           <div className="mt-8">
//           <a
//             href="/post-property"
//             className="inline-block bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300"
//           >
//             Post a Property Free
//           </a>
//         </div>

//         </div>

//         {/* Right Section */}
//         <div className="flex-1">
//           <img
//             src="/image/2182135.jpg"
//             alt="Property Illustration"
//             className="w-full rounded-lg shadow-lg" style={{ height: '400px', objectFit: 'cover' }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Post_Property;
