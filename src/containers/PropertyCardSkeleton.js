import React from "react";

const PropertyCardSkeleton = () => {
  return (
    <div className="w-full h-full p-2 animate-pulse">
      <div className="flex flex-col h-full overflow-hidden rounded-2xl shadow bg-slate-100 min-h-[440px] sm:min-h-[460px]">

        {/* Image */}
        <div className="relative w-full h-40 bg-gray-200 rounded-t-2xl sm:h-44 md:h-48">

          {/* Verified */}
          <div className="absolute top-2 left-2 w-20 h-6 bg-gray-300 rounded"></div>

          {/* Virtual Tour */}
          <div className="absolute top-2 right-12 w-20 h-6 bg-gray-300 rounded-full"></div>

          {/* Heart */}
          <div className="absolute top-2 right-2 w-9 h-9 bg-gray-300 rounded-full"></div>

          {/* Bottom Badges */}
          <div className="absolute bottom-0 left-0 w-16 h-6 bg-gray-300 rounded-tr"></div>

          <div className="absolute bottom-0 right-0 w-20 h-6 bg-gray-300 rounded-tl"></div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-3 bg-white">

          {/* Title */}
          <div className="w-2/3 h-5 bg-gray-300 rounded"></div>

          {/* Subtitle */}
          <div className="w-5/6 h-4 mt-2 bg-gray-200 rounded"></div>

          {/* Price */}
          <div className="flex items-center justify-between mt-4">
            <div className="w-24 h-7 bg-gray-300 rounded"></div>

            <div className="w-24 h-6 bg-gray-300 rounded-full"></div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 py-3 mt-4 border-t border-b">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`flex flex-col items-center ${
                  item !== 1 ? "border-l" : ""
                }`}
              >
                <div className="w-5 h-5 bg-gray-300 rounded"></div>

                <div className="w-14 h-3 mt-2 bg-gray-300 rounded"></div>

                <div className="w-12 h-2 mt-2 bg-gray-200 rounded"></div>
              </div>
            ))}

          </div>

          {/* Posted Row */}
          <div className="flex items-center justify-between mt-3">
            <div className="w-40 h-3 bg-gray-300 rounded"></div>

            <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Owner */}
          <div className="flex items-center pt-4 mt-auto">

            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

            <div className="flex-1 ml-3">
              <div className="w-28 h-4 bg-gray-300 rounded"></div>

              <div className="w-20 h-3 mt-2 bg-gray-200 rounded"></div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default PropertyCardSkeleton;