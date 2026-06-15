import { useEffect } from "react";

const BasicInfo = () => {
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        script.async = true;
        script.onload = initAutocomplete;
        document.body.appendChild(script);
      } else {
        initAutocomplete();
      }
    };

    const initAutocomplete = () => {
      const input = document.getElementById("address");
      if (input) {
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ["geocode"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          console.log("Selected Place: ", place);
        });
      }
    };

    loadGoogleMapsScript();
  }, []);

  return (
    <div className="max-w-3xl mx-auto  rounded-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Basic Details
      </h2>

      {/* Property Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Project Name
        </label>
        <input
          type="text"
          placeholder="Enter Name"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Featured Checkbox */}
      <div className="flex items-center mb-4">
        <input type="checkbox" id="featured" className="mr-2 mb-2" />
        <label htmlFor="featured" className="text-gray-700 flex items-center">
          Mark as featured this project{" "}
          <IoIosInformationCircle className="text-yellow-500 ml-1 cursor-pointer text-lg" />
        </label>
      </div>

      {/* Building Type */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Building Type
        </label>
        <div className="flex gap-3">
          {buildingTypes.map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-full border transition ${
                buildingType === type
                  ? "bg-rose-100 text-rose-700 border-rose-500"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setBuildingType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Project Type
        </label>
        <div className="flex flex-wrap gap-1">
          {propertyTypes.map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-full border transition ${
                propertyType === type
                  ? "bg-rose-100 text-rose-700 border-rose-500"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setPropertyType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
