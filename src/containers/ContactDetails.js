import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom";

const ContactDetails = ({
  fullName,
  mobile,
  userEmail,
  onClose,
  onContinue,
  showUpgradePrompt,
}) => {
  const history = useHistory();

  const handlePurchaseClick = () => {
    history.push({
      pathname: "/dashboard",
      state: { page: "mySubscriptions" },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 w-full max-w-sm relative">
        {/* Close Button */}
        <div className="flex justify-end">
          <button onClick={onClose} className="text-black hover:text-black">
            <IoCloseCircleOutline size={20} />
          </button>
        </div>

        {/* Conditional Heading */}
        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-4">
          {showUpgradePrompt
            ? "View Plans to Unlock Details"
            : "Contact Details"}
        </h2>

        {/* Optional Prompt */}
        {showUpgradePrompt && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              Your free views are over. Purchase a plan to see complete contact
              info.
            </p>
          </div>
        )}

        {/* Input Fields */}
        <div className="flex flex-col gap-4 mb-16">
          <input
            type="text"
            value={fullName}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-100 focus:outline-none"
          />
          <input
            type="text"
            value={mobile}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-100 focus:outline-none"
          />
          {/* <input
            type="text"
            value={userEmail}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-100 focus:outline-none"
          /> */}
        </div>

        {/* Always Show Button on Bottom-Right */}
        <div className="absolute bottom-4 right-4">
          {showUpgradePrompt && (
            <button
              onClick={handlePurchaseClick}
              className="my-bg text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Purchase Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
