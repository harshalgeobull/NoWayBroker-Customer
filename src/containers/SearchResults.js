import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SearchResults = () => {
  const { cityName, category } = useParams();
  const [properties, setProperties] = useState([]);

  // State for filters
  const [filters, setFilters] = useState({
    area_sq: "",
    bhk_type: "",
    furnished_type: "",
    property_type: "",
    property_owner_type: "",
    city_name: cityName,
  });

  // Fetch properties based on the initial parameters
  const fetchProperties = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/search_location`,
        {
          city_name: cityName,
          category: category,
        },
      );

      if (response.status === 200) {
        if (response.data && Array.isArray(response.data.data)) {
          setProperties(response.data.data);
        } else {
          setProperties([]);
        }
      } else if (response.status === 204) {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    }
  };

  // Fetch filtered properties
  const fetchFilteredProperties = async () => {
    try {
      const formData = new FormData();

      // Append filters to FormData
      for (const key in filters) {
        if (filters[key]) {
          formData.append(key, filters[key]);
        }
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/filter_property`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        if (response.data && Array.isArray(response.data.data)) {
          setProperties(response.data.data);
        } else {
          setProperties([]);
        }
      } else if (response.status === 204) {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching filtered properties:", error);
      setProperties([]);
    }
  };

  useEffect(() => {
    fetchProperties(); // Initial fetch of properties
  }, [cityName, category]);

  const handleViewDetails = async (property) => {
    try {
      const user_id = sessionStorage.getItem("AccessToken");
      const data = {
        user_id: user_id,
        property_id: property._id,
        property_category_type: category,
        property_name: property.name,
        address: property.address,
        bhk_type: property.bhk_type || "N/A",
        rating: property.rating || 0,
        date: new Date().toISOString(),
        city_name: property.city_name,
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_recent_search_properties`,
        data,
      );

      window.location.href = `/propertydetails/${property._id}`;
    } catch (error) {
      console.error("Error adding to recent search properties:", error);
      alert("Failed to add recent search!");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    fetchFilteredProperties(); // Fetch properties based on the applied filters
  };

  // Reset Filters function
  const resetFilters = () => {
    setFilters({
      area_sq: "",
      bhk_type: "",
      furnished_type: "",
      property_type: "",
      property_owner_type: "",
      city_name: cityName,
    });
    fetchProperties(); // Re-fetch properties without filters
  };

  return (
    <div className="py-10 bg-gray-100 min-h-screen">
      <h1 className="text-center text-3xl font-bold mb-8">
        Properties in {cityName}
      </h1>

      <div className="flex">
        {/* Filter Section */}
        <div className="w-1/4 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-4">Filters</h2>

          {/* BHK Type Filter */}
          <div className="mb-2">
            <label
              htmlFor="bhk_type"
              className="block text-sm font-medium text-gray-700"
            >
              BHK Type
            </label>
            <select
              id="bhk_type"
              name="bhk_type"
              value={filters.bhk_type}
              onChange={handleFilterChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select BHK</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4 BHK">4 BHK</option>
              <option value="1 RK">1 RK</option>
            </select>
          </div>

          {/* Area Filter */}
          <div className="mb-2">
            <label
              htmlFor="area_sq"
              className="block text-sm font-medium text-gray-700"
            >
              Area (sq ft)
            </label>
            <input
              type="number"
              name="area_sq"
              id="area_sq"
              value={filters.area_sq}
              onChange={handleFilterChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* Furnish Status Filter */}
          <div className="mb-2">
            <label
              htmlFor="furnished_type"
              className="block text-sm font-medium text-gray-700"
            >
              Furnish Status
            </label>
            <select
              id="furnished_type"
              name="furnished_type"
              value={filters.furnished_type}
              onChange={handleFilterChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Furnish Status</option>
              <option value="Furnished">Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Property Listed By Filter */}
          <div className="mb-2">
            <label
              htmlFor="property_owner_type"
              className="block text-sm font-medium text-gray-700"
            >
              Property Listed By
            </label>
            <select
              id="property_owner_type"
              name="property_owner_type"
              value={filters.property_owner_type}
              onChange={handleFilterChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select</option>
              <option value="Owner">Owner</option>
              <option value="Agent">Agent</option>
            </select>
          </div>

          {/* Property Type Filter */}
          <div className="mb-2">
            <label
              htmlFor="property_type"
              className="block text-sm font-medium text-gray-700"
            >
              Property Type
            </label>
            <select
              id="property_type"
              name="property_type"
              value={filters.property_type}
              onChange={handleFilterChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Land">Land</option>
              <option value="Flat">Flat</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={applyFilters}
              className="w-full my-bg text-white py-2 rounded-md hover:my-bg"
            >
              Apply Filters
            </button>

            <button
              onClick={resetFilters}
              className="w-full bg-gray-200 py-2 rounded-md hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="w-3/4 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-[600px]   overflow-y-auto">
            {Array.isArray(properties) && properties.length > 0 ? (
              properties.map((property) => (
                <div
                  key={property._id}
                  className="relative bg-white shadow-md rounded-lg  transition-transform transform hover:scale-105"
                >
                  {/* Card image */}
                  <img
                    src={property.cover_image || "/default-property.jpg"}
                    alt={property.name}
                    className="w-full h-48 object-cover"
                  />

                  {/* Card content */}
                  <div className="p-4">
                    <h2 className="text-2xl font-bold mb-2">{property.name}</h2>
                    <p className="text-gray-700">{property.address}</p>
                    <p className="text-gray-600">
                      {property.bhk_type} | {property.area_sq} sq ft
                    </p>
                    <p className="text-lg font-semibold my-text">
                      &#8377;{property.property_price}
                    </p>
                  </div>

                  {/* "View Details" Button fixed at the bottom-right */}
                  <button
                    className="absolute bottom-4 right-4 my-bg text-white px-4 py-2 rounded"
                    onClick={() => handleViewDetails(property)}
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">
                No properties found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const SearchResults = () => {
//     const { cityName, category } = useParams();
//     const [properties, setProperties] = useState([]);

//     useEffect(() => {
//         const fetchProperties = async () => {
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/cust_api/search_location`,
//                     {
//                         city_name: cityName,
//                         category: category
//                     }
//                 );

//                 if (response.status === 200) {
//                     if (response.data && Array.isArray(response.data.data)) {
//                         setProperties(response.data.data);
//                     } else {
//                         setProperties([]);
//                     }
//                 } else if (response.status === 204) {
//                     setProperties([]);
//                 }
//             } catch (error) {
//                 console.error("Error fetching properties:", error);
//                 setProperties([]);
//             }
//         };

//         fetchProperties();
//     }, [cityName, category]);

//     const handleViewDetails = async (property) => {
//         try {
//             const user_id = sessionStorage.getItem('AccessToken');
//             const data = {
//                 user_id: user_id,
//                 property_id: property._id,
//                 property_category_type: category,
//                 property_name: property.name,
//                 address: property.address,
//                 bhk_type: property.bhk_type || "N/A",
//                 rating: property.rating || 0,
//                 date: new Date().toISOString(),
//                 city_name: property.city_name
//             };

//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/cust_api/add_recent_search_properties`,
//                 data
//             );

//             // Use alert for success message
//             alert('Recent search added successfully!');

//             // Redirect to the property details page
//             window.location.href = `/propertydetails/${property._id}`;
//         } catch (error) {
//             console.error('Error adding to recent search properties:', error);
//             // Use alert for error message
//             alert('Failed to add recent search!');
//         }
//     };

//     return (
//         <div className="py-10 bg-gray-100 min-h-screen">
//             <h1 className="text-center text-3xl font-bold mb-8">
//                 Properties in {cityName}
//             </h1>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
//                 {Array.isArray(properties) && properties.length > 0 ? (
//                     properties.map((property) => (
//                         <div key={property.id} className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
//                             <img src={property.cover_image || "/default-property.jpg"} alt={property.name} className="w-full h-48 object-cover" />
//                             <div className="p-4">
//                                 <h2 className="text-2xl font-bold mb-2">{property.name}</h2>
//                                 <p className="text-gray-600 mb-2">{property.address}, {property.city_name}</p>
//                                 <p className="my-text font-bold mb-4">₹ {property.property_price.toLocaleString()}</p>
//                                 <button
//                                     className="my-bg text-white px-4 py-2 rounded-full"
//                                     onClick={() => handleViewDetails(property)} // Pass entire property object
//                                 >
//                                     View Details
//                                 </button>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <p className="text-center w-full col-span-3">No properties found for {category} in {cityName}</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SearchResults;
