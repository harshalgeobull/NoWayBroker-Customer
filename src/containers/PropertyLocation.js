import React from "react";

const PropertyLocation = () => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      {/* Property Location */}
      <div className="mb-4">
        <h2 className="text-sm text-gray-500">Property Location</h2>
        <p className="text-lg font-semibold">Sai Niwas, Mohammed Wadi, Pune</p>
      </div>

      {/* Nearby Places */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Around This Property
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* School */}
          <div className="flex items-center border rounded-lg p-3 gap-3">
            <div className="w-8 h-8 bg-rose-100 my-text rounded-full flex items-center justify-center">
              🎓
            </div>
            <div>
              <h4 className="text-sm font-semibold">School</h4>
              <p className="text-xs text-gray-500">
                Caelum High School and Junior College
              </p>
            </div>
          </div>

          {/* Hospital */}
          <div className="flex items-center border rounded-lg p-3 gap-3">
            <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
              🏥
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold">Hospital</h4>
              <p className="text-xs text-gray-500">
                Sangam Hospital - Undri IVF & Maternity Centre
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">5 mins</p>
              <p className="text-xs text-gray-500">(1.8 km)</p>
            </div>
          </div>
        </div>
      </div>

      {/* View More */}
      <div className="text-center mt-4">
        <a href="#" className="my-text font-semibold hover:underline text-sm">
          View more on Maps
        </a>
      </div>
    </div>
  );
};

export default PropertyLocation;
