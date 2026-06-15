import { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

const AppDownloadPopup = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center relative">
            <button
              className="absolute top-2 right-2 text-black hover:text-black text-2xl"
              onClick={() => setIsOpen(false)}
            >
              <IoCloseCircleOutline />
            </button>

            <h2 className="text-xl font-semibold">Go to Mobile App</h2>
            <p className="text-gray-500 text-sm mt-1">
              This features only work NoWayBroker App
            </p>

            <button className="my-bg text-white px-4 py-2 rounded-lg mt-4 w-full">
              Download
            </button>

            <div className="flex justify-center mt-4 space-x-2">
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
    </>
  );
};
export default AppDownloadPopup;
