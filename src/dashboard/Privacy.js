// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";

// const Privacy = () => {
//   const [privacyContent, setPrivacyContent] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchPrivacyPolicy = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/cust_api/get-privacy-policy`);
//         console.log("API response:", response.data);

//         if (response.status === 200 && response.data.status === 1) {
//           const content = response.data.data?.[0]?.content;
//           console.log("Extracted content:", content);
//           setPrivacyContent(content);
//         } else {
//           setError("Privacy policy content is not available.");
//         }
//       } catch (err) {
//         console.error("Error fetching privacy policy:", err);
//         setError("Failed to load privacy policy.");
//       }
//     };

//     fetchPrivacyPolicy();
//   }, []);

//    useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Navbar */}
//       <nav className="items-center justify-between hidden w-full p-4 px-20 text-black bg-gray-100 md:flex">
//         <h1 className="text-xl">Privacy Policy</h1>
//         <div className="flex items-center gap-4">
//           <div className="text-sm text-gray-500">
//             <Link to="/" className="text-gray-500 no-underline hover:no-underline hover:text-gray-700">Home</Link>
//             <span className="mx-1">›</span>
//             <span className="font-medium my-text">Dashboard</span>
//           </div>
//         </div>
//       </nav>

//        {/* Content */}
//        {error ? (
//           <p className="text-red-500">{error}</p>
//         ) : privacyContent ? (
//           <div
//             className="leading-relaxed text-gray-800"
//             dangerouslySetInnerHTML={{ __html: privacyContent }}
//           />
//         ) : (
//           <p className="text-gray-500">Loading Privacy and Policies...</p>
//         )}
//     </div>
//   );
// };

// export default Privacy;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
  const privacyContent = `
  <p>NoWayBroker (“we,” “our,” or “us”) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share your information when you use the NoWayBroker mobile app, website, and related services (collectively, the “Services”).</p>

  <h2 class="mt-4 font-semibold text-lg">1. Information We Collect</h2>
  <p>We may collect the following types of information:</p>

  <p><strong>a. Personal Information:</strong></p>
  <ul class="list-disc ml-6">
    <li>Name, email address, phone number</li>
    <li>Profile information (photos, property details)</li>
    <li>Location data (for property search and directions)</li>
  </ul>

  <p><strong>b. Usage Information:</strong></p>
  <ul class="list-disc ml-6">
    <li>Device information (device type, operating system, app version)</li>
    <li>IP address and browser type</li>
    <li>App usage patterns and analytics</li>
  </ul>

  <p><strong>c. Communications:</strong></p>
  <ul class="list-disc ml-6">
    <li>Messages you send via the app to property owners, agents, or NoWayBroker support</li>
    <li>Feedback and inquiries</li>
  </ul>

  <h2 class="mt-4 font-semibold text-lg">2. How We Use Your Information</h2>
  <p>We use your information to:</p>
  <ul class="list-disc ml-6">
    <li>Provide, operate, and maintain the Services</li>
    <li>Facilitate buying, selling, renting, and listing properties</li>
    <li>Send notifications, alerts, and promotional messages (with consent where required)</li>
    <li>Improve and personalize your experience</li>
    <li>Analyze app performance and user behavior</li>
    <li>Respond to inquiries and provide customer support</li>
  </ul>

  <h2 class="mt-4 font-semibold text-lg">3. How We Share Your Information</h2>
  <p>We do not sell your personal information. We may share information in limited ways:</p>
  <ul class="list-disc ml-6">
    <li><strong>With other users:</strong> Property owners, agents, and buyers may see your publicly shared information.</li>
    <li><strong>Service Providers:</strong> Analytics, cloud hosting, messaging, and payment providers assisting us.</li>
    <li><strong>Legal Requirements:</strong> If required by law, to protect rights, safety, or property.</li>
  </ul>

  <h2 class="mt-4 font-semibold text-lg">4. Data Security</h2>
  <p>We implement reasonable technical, administrative, and physical safeguards to protect your personal data. However, no system is completely secure, and we cannot guarantee absolute security.</p>

  <h2 class="mt-4 font-semibold text-lg">5. User Control</h2>
  <ul class="list-disc ml-6">
    <li>You can edit or delete your profile information at any time.</li>
    <li>You may opt out of marketing communications by updating your preferences in the app or contacting us.</li>
    <li>Requests to access, correct, or delete your data can be made via our contact information below.</li>
  </ul>

  <h2 class="mt-4 font-semibold text-lg">6. Cookies and Analytics</h2>
  <p>We may use cookies, web beacons, and similar technologies in our website version to collect analytics and improve user experience. You may manage cookie preferences via your browser settings.</p>

  <h2 class="mt-4 font-semibold text-lg">7. Children’s Privacy</h2>
  <p>NoWayBroker is not intended for children under 13 years old. We do not knowingly collect personal information from children. If we learn we have collected data from a child under 13, we will delete it.</p>

  <h2 class="mt-4 font-semibold text-lg">8. Changes to This Privacy Policy</h2>
  <p>We may update this Privacy Policy from time to time. Any changes will be reflected here with a revised effective date. We encourage you to review the policy periodically.</p>

  <h2 class="mt-4 font-semibold text-lg">9. Contact Us</h2>
  <p>If you have any questions, concerns, or requests regarding your data or this Privacy Policy, contact us at:</p>
  <p><strong>Email:</strong> support@NoWayBroker.in<br/>
  <strong>Website:</strong> <a href="https://customer.nowaybroker.in" class="text-blue-600 underline">https://customer.nowaybroker.in</a></p>

  <p class="mt-4">By using NoWayBroker you agree to the terms of this Privacy Policy.</p>
  `;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="items-center justify-between hidden w-full p-4 px-20 text-black bg-gray-100 md:flex">
        <h1 className="text-xl font-semibold">Privacy Policy</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            <Link
              to="/"
              className="text-gray-500 no-underline hover:text-gray-700"
            >
              Home
            </Link>
            <span className="mx-1">›</span>
            <span className="font-medium my-text">Dashboard</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div
        className="max-w-4xl p-6 mx-auto leading-relaxed text-gray-800 md:p-12"
        dangerouslySetInnerHTML={{ __html: privacyContent }}
      />
    </div>
  );
};

export default Privacy;
