import React from "react";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
// import EmailIcon from '/icons/email-svgrepo-com (1).svg'; // Adjust the path as necessary
// import WhatsAppIcon from '../icons/WhatsApp.svg.png'; // Adjust the path as necessary     

const ShareModal = ({ currentShareUrl, closeShareModal, copyLink }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black bg-opacity-50 md:items-center">
      <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-4 border-b">
          <h5 className="text-lg font-bold">Share this link</h5>
          <button onClick={closeShareModal} className="text-2xl">
            &times;
          </button>
        </div>

        {/* URL + Copy */}
        <div className="flex items-center mb-4">
          <input
            type="text"
            className="flex-grow p-2 border rounded"
            value={currentShareUrl}
            readOnly
          />
          <button className="p-2 ml-2 bg-gray-200 rounded" onClick={copyLink}>
            Copy Link
          </button>
        </div>

        {/* Social Links */}
        <div className="flex justify-around text-white">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(currentShareUrl)}`}
            className="p-3 rounded-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/image/WhatsApp.svg.png" alt="WhatsApp" className="w-11 h-11" />
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              currentShareUrl
            )}`}
            className="p-3 rounded-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/image/Facebook.svg.png" alt="Facebook" className="w-9 h-9" />
          </a>

          <a
            href={`https://www.instagram.com`}
            className="p-3 rounded-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/image/Instagram.svg.png"
              alt="Instagram"
              className="w-8 h-8"
            />
          </a>

          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              currentShareUrl
            )}`}
            className="p-3 rounded-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/image/Twitter.svg.png" alt="Twitter" className="w-8 h-8" />
          </a>

          <a
            href={`mailto:?subject=Check out this page&body=${encodeURIComponent(
              currentShareUrl
            )}`}
            className="p-3 rounded-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/image/email-svgrepo-com (1).svg" alt="Email" className="w-10 h-10" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
