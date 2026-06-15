import { useState } from "react";
import { X } from "lucide-react";

export default function AdsNotApprovedModal() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm text-center relative">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900">Ads Not Approved</h2>

          {/* Description */}
          <p className="text-gray-600 mt-4 text-sm leading-relaxed">
            When they say there’s no place like home, the adage rings true. Your
            home is a sanctuary whose walls are privy to every joyful moment. It
            is the hearth of your family and a distinct expression of your
            stature.
          </p>

          {/* Okay Button */}
          <button
            className="mt-6 px-6 py-2 my-bg text-white rounded-lg font-medium hover:my-bg transition"
            onClick={() => setIsOpen(false)}
          >
            Okay
          </button>
        </div>
      </div>
    )
  );
}
