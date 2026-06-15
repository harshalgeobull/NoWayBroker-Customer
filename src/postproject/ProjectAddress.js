import React, { useState } from "react";

const ProjectAddress = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl mb-32">
      {/* Section Title */}
      <h2 className="text-2xl text-gray-900">Project Address</h2>
      <p className="text-gray-500 mt-1">Place the listing pin on the map</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Map Section */}
        <div className="w-full h-80 rounded-lg overflow-hidden bg-gray-200">
          <img
            src="https://via.placeholder.com/400x250"
            alt="Map"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Address Form */}
        <div className="grid grid-cols-2 gap-4">
          {/* Address Auto-Complete Input */}
          <div className="col-span-2">
            <label className="text-gray-700 font-medium">Address</label>
            <input
              id="address"
              type="text"
              placeholder="Enter Address"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Country Dropdown */}
          <div>
            <label className="text-gray-700 font-medium">Country</label>
            <select className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500">
              <option>Country</option>
            </select>
          </div>

          {/* State Dropdown */}
          <div>
            <label className="text-gray-700 font-medium">State</label>
            <select className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500">
              <option>State</option>
            </select>
          </div>

          {/* City Dropdown */}
          <div>
            <label className="text-gray-700 font-medium">City</label>
            <select className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500">
              <option>City</option>
            </select>
          </div>

          {/* Zip Code */}
          <div>
            <label className="text-gray-700 font-medium">Zip</label>
            <input
              type="text"
              placeholder="Zip"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAddress;
