import { useState } from "react";
import { X } from "lucide-react";

export default function OfferNotApprovedModal() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm text-center relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-semibold text-gray-900">
            Offer Not Approved
          </h2>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            When they say there’s no place like home, the adage rings true. Your
            home is a sanctuary whose walls are privy to every joyful moment. It
            is the hearth of your family and a distinct expression of your
            stature.
          </p>
          <button
            className="mt-6 px-6 py-2 my-bg text-white rounded-lg font-medium hover:my-bg"
            onClick={() => setIsOpen(false)}
          >
            Okay
          </button>
        </div>
      </div>
    )
  );
}
