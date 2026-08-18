import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import { Trash } from "@phosphor-icons/react";
import { IoCloseCircleOutline } from "react-icons/io5";
import DeleteModal from "./DeleteModal";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";

const MyProperties = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const userId = sessionStorage.getItem("accessToken");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const itemsPerPage = 10;
  const history = useHistory();
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [priceError, setPriceError] = useState("");
  const [showOfferCountModal, setShowOfferCountModal] = useState(false);
  const [offerCount, setOfferCount] = useState(0);

  const priceOptions = [
    { label: "₹ 5 Lakhs", value: 500000 },
    { label: "₹ 10 Lakhs", value: 1000000 },
    { label: "₹ 15 Lakhs", value: 1500000 },
    { label: "₹ 20 Lakhs", value: 2000000 },
    { label: "₹ 25 Lakhs", value: 2500000 },
    { label: "₹ 30 Lakhs", value: 3000000 },
    { label: "₹ 40 Lakhs", value: 4000000 },
    { label: "₹ 50 Lakhs", value: 5000000 },
    { label: "₹ 60 Lakhs", value: 6000000 },
    { label: "₹ 75 Lakhs", value: 7500000 },
    { label: "₹ 90 Lakhs", value: 9000000 },
    { label: "₹ 1 Crore", value: 10000000 },
    { label: "₹ 1.25 Crore", value: 12500000 },
    { label: "₹ 1.5 Crore", value: 15000000 },
    { label: "₹ 1.75 Crore", value: 17500000 },
    { label: "₹ 2 Crore", value: 20000000 },
    { label: "₹ 3 Crore", value: 30000000 },
    { label: "₹ 4 Crore", value: 40000000 },
    { label: "₹ 5 Crore", value: 50000000 },
    { label: "₹ 10 Crore", value: 100000000 },
    { label: "₹ 20 Crore", value: 200000000 },
    { label: "₹ 30 Crore", value: 300000000 },
    { label: "₹ 50 Crore", value: 500000000 },
    { label: "₹ 75 Crore", value: 750000000 },
  ];


  const rentAndPgPriceOptions = [
    { label: "₹ 5 Thousand", value: 5000 },
    { label: "₹ 6 Thousand", value: 6000 },
    { label: "₹ 7 Thousand", value: 7000 },
    { label: "₹ 8 Thousand", value: 8000 },
    { label: "₹ 9 Thousand", value: 9000 },
    { label: "₹ 10 Thousand", value: 10000 },
    { label: "₹ 15 Thousand", value: 15000 },
    { label: "₹ 20 Thousand", value: 20000 },
    { label: "₹ 25 Thousand", value: 25000 },
    { label: "₹ 30 Thousand", value: 30000 },
    { label: "₹ 40 Thousand", value: 40000 },
    { label: "₹ 50 Thousand", value: 50000 },
    { label: "₹ 60 Thousand", value: 60000 },
    { label: "₹ 70 Thousand", value: 70000 },
    { label: "₹ 80 Thousand", value: 80000 },
    { label: "₹ 90 Thousand", value: 90000 },
    { label: "₹ 1 Lakh", value: 100000 },
    { label: "₹ 2 Lakhs", value: 200000 },
    { label: "₹ 3 Lakhs", value: 300000 },
    { label: "₹ 4 Lakhs", value: 400000 },
    { label: "₹ 5 Lakhs", value: 500000 },
    { label: "₹ 6 Lakhs", value: 600000 },
    { label: "₹ 7 Lakhs", value: 700000 },
    { label: "₹ 8 Lakhs", value: 800000 },
    { label: "₹ 9 Lakhs", value: 900000 },
    { label: "₹ 10 Lakhs", value: 1000000 },
  ];
  const budgetOptions =
    category === "Rent" || category === "PG/Co-living"
      ? rentAndPgPriceOptions
      : priceOptions;
  // State Setup
  const [showNextModal, setShowNextModal] = useState(false);
  const [offerName, setOfferName] = useState("");
  const [offerTime, setOfferTime] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [offerPhoto, setOfferPhoto] = useState(null);
  const [offerPhotoPreview, setOfferPhotoPreview] = useState(null);
  const [freePostCount, setFreePostCount] = useState(0);

  useEffect(() => {
    const checkPostLimits = async () => {
      try {
        const profileForm = new FormData();
        profileForm.append("user_id", userId);

        const profileResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
          profileForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        const countData = profileResponse?.data?.count_data;

        if (countData) {
          setFreePostCount(countData.free_post_count || 0);
          setOfferCount(countData.offer_count || 0);
        }
      } catch (error) {
        console.error("Error checking post limits:", error);
      }
    };

    if (userId) {
      checkPostLimits();
    }
  }, [userId]);

  const fetchProperties = async () => {
    const formData = new FormData();
    formData.append("page", currentPage);
    formData.append("page_size", itemsPerPage);
    formData.append("user_id", userId);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get-listing-properties`,
        formData,
      );

      if (response.data.status === 1) {
        const transformed = response.data.data.map((item) => {
          let badgeColor = "bg-gray-400";
          let type = "UNKNOWN";
          let status = "Available";

          // Set badge color, type, and status based on property category type
          switch (item.property_category_type) {
            case "Buy":
              badgeColor = "bg-[#8B1E3F]";
              type = "FOR BUY";
              status =
                item.available_status === "Sold" ? "Sold Out" : "Available";
              break;

            case "Rent":
              badgeColor = "bg-blue-600";
              type = "FOR RENT";
              status =
                item.available_status === "Sold" ? "Rented Out" : "Available";
              break;

            case "Commercial Buy":
              badgeColor = "bg-purple-600";
              type = "COMMERCIAL BUY";
              status =
                item.available_status === "Sold" ? "Sold Out" : "Available";
              break;

            case "Commercial Lease":
              badgeColor = "bg-indigo-600";
              type = "COMMERCIAL LEASE";
              status =
                item.available_status === "Sold" ? "Leased Out" : "Available";
              break;

            case "PG/Co-living":
              badgeColor = "bg-yellow-500";
              type = "PG / CO-LIVING";
              status =
                item.available_status === "Sold" ? "Occupied" : "Available";
              break;

            default:
              badgeColor = "bg-gray-400";
              type = item.property_category_type?.toUpperCase() || "UNKNOWN";
              status = "Available";
          }

          return {
            id: item._id,
            type,
            title: item.property_name,
            location: item.address_area,
            price: item.property_price,
            date: item.created_at
              ? new Date(item.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
              : "N/A",
            badgeColor,
            status,
            soldOut: item.available_status,
            image: item.cover_image,
            published: item.admin_approval,
            rent: item.rent,
            rent_duration: item.rent_duration,
            view_count: item.view_count,
            leads_count: item.leads_count,
          };
        });

        setProperties(transformed);
        setTotalPages(response.data.total_pages);
      } else {
        setProperties([]);
        setTotalPages(0);
      }
    } catch (err) {
      setProperties([]);
      setTotalPages(0);
      console.error("Failed to fetch property enquiries", err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [userId, currentPage]);

  const handleDeleteClick = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    setMinPrice(value);

    if (maxPrice && value > maxPrice) {
      setPriceError("Min price should not be greater than Max price");
    } else {
      setPriceError("");
    }
  };


  const handleMaxChange = (e) => {
  let value = e.target.value;

  if (value === "1000001") {
    value = "";
  }

  setMaxPrice(value);

  if (minPrice && value && Number(value) < Number(minPrice)) {
    setPriceError("Max price should not be less than Min price");
  } else {
    setPriceError("");
  }
};
  const handleConfirmDelete = async (property_id) => {
    setIsModalOpen(false);

    if (!userId) {
      toast.error("You must be logged in to delete a property.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("property_id", property_id);

      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/cust_api/delete_listing_property`,
        {
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.status === 1) {
        toast.success("Property deleted successfully.");
        setProperties((prev) => prev.filter((item) => item.id !== property_id));
      } else {
        toast.error(res.data.message || "Failed to delete property.");
        console.error("Failed to delete property:", res.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the property.");
      console.error("Error deleting property:", error);
    }
  };

  const handleSearch = async () => {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("search_keyword", searchKeyword);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/my_properties_search`,
        formData,
      );

      if (response.data.status === 1) {
        const transformed = response.data.data.map((item) => {
          let badgeColor = "bg-gray-400";
          let type = "UNKNOWN";
          let status = "Available";

          switch (item.property_category_type) {
            case "Buy":
              badgeColor = "bg-green-600";
              badgeColor = "bg-[#8B1E3F]";
              status =
                item.available_status === "Sold" ? "Sold Out" : "Available";
              break;

            case "Rent":
              badgeColor = "bg-[#8B1E3F]";
              type = "FOR RENT";
              status =
                item.available_status === "Sold" ? "Rented Out" : "Available";
              break;

            case "Commercial Buy":
              badgeColor = "bg-[#8B1E3F]";
              type = "COMMERCIAL BUY";
              status =
                item.available_status === "Sold" ? "Sold Out" : "Available";
              break;

            case "Commercial Lease":
              badgeColor = "bg-[#8B1E3F]";
              type = "COMMERCIAL LEASE";
              status =
                item.available_status === "Sold" ? "Leased Out" : "Available";
              break;

            case "PG/Co-living":
              badgeColor = "bg-[#8B1E3F]";
              type = "PG / CO-LIVING";
              status =
                item.available_status === "Sold" ? "Occupied" : "Available";
              break;

            default:
              badgeColor = "bg-[#8B1E3F]";
              type = item.property_category_type?.toUpperCase() || "UNKNOWN";
              status = "Available";
          }

          return {
            id: item._id,
            type,
            title: item.property_name,
            location: item.address_area,
            price: item.property_price,
            date: item.created_at
              ? new Date(item.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
              : "N/A",
            badgeColor,
            status,
            soldOut: item.available_status,
            image:
              `${process.env.REACT_APP_API_URL}${item.cover_image}` ||
              "https://via.placeholder.com/300x200?text=No+Image",
            published: item.admin_approval,
            rent: item.rent,
            rent_duration: item.rent_duration,
            view_count: item.view_count,
            leads_count: item.leads_count,
          };
        });

        setProperties(transformed);
        setTotalPages(response.data.total_pages);
      } else {
        setProperties([]);
        setTotalPages(0);
      }
    } catch (error) {
      setProperties([]);
      setTotalPages(0);
      console.error("Error calling search API:", error);
    }
  };

  const handleCreateOffer = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      history.push("/addoffer");
    } else {
      history.push("/login1");
    }
  };

  const firstLoad = useRef(true);

  const fetchFilteredProperties = async () => {
    if (!userId) {
      console.warn("No userId found in session storage.");
      setProperties([]);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      if (category) formData.append("property_category_type", category);
      if (city) formData.append("city_name", city);
      if (propertyType) formData.append("property_type", propertyType);
      if (locality) formData.append("area", locality);
      if (minPrice) formData.append("min_price", minPrice);
      if (maxPrice) formData.append("max_price", maxPrice);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/filter_property`,
        formData,
      );

      if (response.data.status === 1) {
        const transformed = response.data.data.map((item) => {
          let badgeColor = "bg-gray-400";
          let type = "UNKNOWN";
          let status = "Available";

          switch (item.property_category_type) {
            case "Buy":
              badgeColor = "bg-green-600";
              type = "FOR BUY";
              status =
                item.available_status === "Sold" ? "Sold Out" : "Available";
              break;

            case "Rent":
              badgeColor = "bg-blue-600";
              type = "FOR RENT";
              status =
                item.available_status === "Sold" ? "Rented Out" : "Available";
              break;

            case "Commercial Buy":
              badgeColor = "bg-purple-600";
              type = "COMMERCIAL BUY";
              status =
                item.available_status === "Sold" ? "Sold Out" : "Available";
              break;

            case "Commercial Lease":
              badgeColor = "bg-indigo-600";
              type = "COMMERCIAL LEASE";
              status =
                item.available_status === "Sold" ? "Leased Out" : "Available";
              break;

            case "PG/Co-living":
              badgeColor = "bg-yellow-500";
              type = "PG / CO-LIVING";
              status =
                item.available_status === "Sold" ? "Occupied" : "Available";
              break;

            default:
              badgeColor = "bg-gray-400";
              type = item.property_category_type?.toUpperCase() || "UNKNOWN";
              status = "Available";
          }

          return {
            id: item._id,
            type,
            title: item.property_name,
            location: item.address_area,
            price: item.property_price,
            date: item.created_at
              ? new Date(item.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
              : "N/A",
            badgeColor,
            status,
            soldOut: item.available_status,
            image:
              item.cover_image ||
              "https://via.placeholder.com/300x200?text=No+Image",
            published: item.admin_approval,
            rent: item.rent,
            rent_duration: item.rent_duration,
            view_count: item.view_count,
            leads_count: item.leads_count,
          };
        });

        setProperties(transformed);
        setTotalPages(response.data.total_pages || 0);
      } else {
        setProperties([]);
        setTotalPages(0);
      }
    } catch (error) {
      setProperties([]);
      setTotalPages(0);
      console.error("Error fetching filtered properties:", error);
    }
  };

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
    } else if (userId) {
      fetchFilteredProperties();
    }
  }, [category, city, locality, propertyType, minPrice, maxPrice, userId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleMarkAsSold = async () => {
    if (!selectedPropertyId) return;

    const formData = new FormData();
    formData.append("property_id", selectedPropertyId);
    formData.append("user_id", userId);
    formData.append(
      "available_status",
      selectedProperty.status === "Available" ? "Sold" : "Available",
    );

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/change_property_status`,
        formData,
      );

      if (response.data.status === 1) {
        setShowModal(false);
        const updatedProperties = properties.map((property) =>
          property.id === selectedPropertyId
            ? {
              ...property,
              soldOut:
                selectedProperty.status === "Available"
                  ? "Sold"
                  : "Available",
              status:
                selectedProperty.status === "Available"
                  ? property.type === "FOR BUY"
                    ? "Sold Out"
                    : "Rented Out"
                  : "Available",
            }
            : property,
        );
        setProperties(updatedProperties);
      } else {
        console.error("Status not updated:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating property status:", error);
    }
  };

  const handleStatusClick = (property) => {
    setSelectedProperty(property);
    setSelectedPropertyId(property.id);
    setShowModal(true);
  };

  const handlePropertyClick = (property) => {
    if (offerCount <= 0) {
      setShowOfferCountModal(true);
    } else {
      setSelectedProperty(property);
      setShowNextModal(true);
    }
  };

  const handleAddOffer = async () => {
    if (!userId) {
      toast.error("You must be logged in to create an offer.");
      return;
    }

    if (!selectedProperty) {
      toast.error("No property selected.");
      return;
    }

    const formData = new FormData();
    formData.append("property_id", selectedProperty.id);
    formData.append("user_id", userId);
    formData.append("offer_name", offerName);
    formData.append("offer_time", offerTime);
    formData.append("offer_description", offerDescription);
    if (offerPhoto) {
      formData.append("offer_img", offerPhoto);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cust_api/add_offer`,
        {
          method: "POST",
          body: formData,
        },
      );

      // if (response.ok) {
      //   toast.success("Offer created successfully!");
      //   setShowNextModal(false);
      //   setOfferName('');
      //   setOfferTime('');
      //   setOfferDescription('');
      //   setOfferPhoto('');
      //   setOfferPhotoPreview('')
      // } else {
      //   toast.error("Failed to create offer.");
      // }

      if (response.ok) {
        const data = await response.json();
        if (data.status === 1) {
          toast.success("Offer created successfully!");
          setShowNextModal(false);
          setOfferName("");
          setOfferTime("");
          setOfferDescription("");
          setOfferPhoto(null);
          setOfferPhotoPreview(null);
        } else if (data.status === 0) {
          toast.error("Offer already exists!");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error("An error occurred while creating the offer.");
    }
  };

  const handleCoverImageDelete = () => {
    setOfferPhoto(null);
    setOfferPhotoPreview(null);
  };

  useEffect(() => {
    if (searchKeyword.trim() !== "") {
      handleSearch();
    }
  }, [searchKeyword]);

//   return (
//     <>
//       {/* <div className="w-full max-w-7xl mx-auto px-0 sm:px-2 lg:px-4 py-2"> */}
//       <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4">
      

//         {/* Filters */}
//         <div className="flex flex-wrap justify-around mt-6 gap-9">
//           <select
//             className="w-40 px-2 py-2 border rounded-lg outline-none"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             <option value="">Category Type</option>
//             <option value="Buy">Buy</option>
//             <option value="Rent">Rent</option>
//             <option value="Commercial Buy">Commercial Buy</option>
//             <option value="Commercial Lease">Commercial Lease</option>
//             <option value="PG/Co-living">PG/Co-living</option>
//           </select>
//           <select
//             className="w-32 px-2 py-2 border rounded-lg outline-none"
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//           >
//             <option value="">City</option>
//             <option value="Ahmedabad">Ahmedabad</option>
//             <option value="Bangalore">Bengaluru</option>
//             <option value="Chennai">Chennai</option>
//             <option value="Delhi">Delhi</option>
//             <option value="Hyderabad">Hyderabad</option>
//             <option value="Kolkata">Kolkata</option>
//             <option value="Mumbai">Mumbai</option>
//             <option value="Pune">Pune</option>
//           </select>
//           <div className="w-0 md:w-40"></div>
//           {/* <div className="relative md:mt-0">
//             <input
//               type="text"
//               placeholder="Enter locality or projects"
//               value={locality}
//               onChange={(e) => setLocality(e.target.value)}

//               className="w-64 px-4 py-2 border rounded-lg outline-none"
//             />
//             {locality && (
//               <button
//                 onClick={() => {
//                   setLocality("");
//                 }}
//                 className="absolute text-lg text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-900"
//               >
//                 <IoMdClose />
//               </button>
//             )}
//           </div> */}
//           <select
//             className="w-40 px-2 py-2 border rounded-lg outline-none"
//             value={propertyType}
//             onChange={(e) => setPropertyType(e.target.value)}
//           >
//             <option value="">Property Type</option>
//             <option value="Flat/Apartment">Flat/Apartment</option>
//             <option value="Builder Floor">Builder Floor</option>
//             <option value="Independent House/Villa">
//               Independent House/Villa
//             </option>
//             <option value="Independent/Builder Floor">
//               Independent/Builder Floor
//             </option>
//             <option value="1RK/Studio Apartment">1RK/Studio Apartment</option>
//             <option value="Service Apartment">Service Apartment</option>
//             <option value="Farmhouse">Farmhouse</option>
//             <option value="Plot/Land">Plot/Land</option>
//             <option value="Office">Office</option>
//             <option value="Retail">Retail</option>
//             <option value="Storage">Storage</option>
//             <option value="Industry">Industry</option>
//             <option value="Hospitality">Hospitality</option>
//             <option value="Other">Other</option>
//           </select>
//           <div>
//             <select
//               value={minPrice}
//               onChange={handleMinChange}
//               className="border px-2 py-2 rounded-lg w-28 outline-none"
//             >
//               <option value="">₹ Min</option>
//               {budgetOptions.map((option, index) => (
//                 <option key={index} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             &nbsp;&nbsp;&nbsp;
//             <select
//               value={maxPrice}
//               onChange={handleMaxChange}
//               className="border px-2 py-2 rounded-lg w-28 outline-none"
//             >
//               <option value="">₹ Max</option>
//               {budgetOptions.map((option, index) => (
//                 <option key={index} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             {priceError && (
//               <p className="mt-1 text-sm text-red-500">{priceError}</p>
//             )}
//           </div>
//         </div>

//         {/* Property Listings */}
//         <div className="mt-6 space-y-4">
//           {!properties || properties.length === 0 ? (
//             <p className="mt-10 text-lg text-center text-gray-500">
//               No properties found.
//             </p>
//           ) : (
//             properties.map((property) => (
//               <div
//                 key={property.id}
//                 // className={`bg-white shadow-sm rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between relative
//                 className={`bg-white shadow-sm rounded-lg p-3 sm:p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between relative
//     ${property.published === "Approved"
//                     ? "border-2 border-green-500"
//                     : property.published === "Pending"
//                       ? "border-2 border-yellow-500"
//                       : "border border-gray-300"
//                   }`}
//               >
//                 {/* Published Badge (Top Left Corner) */}
//                 {/* Published Badge (Top Left Corner) */}
//                 <div
//                   className={`absolute top-2 left-6 text-xs font-medium px-3 py-1 rounded-md 
//     ${property.published === "Approved"
//                       ? "bg-green-200 text-green-700 border border-green-700"
//                       : property.published === "Pending"
//                         ? "bg-yellow-200 text-yellow-700 border border-yellow-700"
//                         : "bg-gray-300 text-gray-600 border border-gray-600"
//                     }`}
//                 >
//                   {property.published === "Approved"
//                     ? "Approved"
//                     : property.published === "Pending"
//                       ? "Pending"
//                       : "Not Published"}
//                 </div>

//                 {/* Left Section (Image + Badge) */}
//                 {/* <div className="relative w-40 h-28">
//                   <Link
//                     to={`/propertydetails/${property.id}`}
//                     key={property.id}
//                     className="block"
//                   >
//                     <img
//                       src={property.image}
//                       alt={property.title}
//                       className="object-cover w-64 h-24 rounded-md"
//                     />
//                   </Link>
//                   <div
//                     className={`absolute top-1 left-1 text-white ${property.badgeColor} text-xs px-2 py-1 rounded-md`}
//                   >
//                     {property.type}
//                   </div>
//                 </div> */}
//                 <div className="relative w-28 h-20 sm:w-32 sm:h-24 lg:w-40 lg:h-28 flex-shrink-0">
//                     <Link
//                       to={`/propertydetails/${property.id}`}
//                       key={property.id}
//                       className="block w-full h-full"
//                     >
//                       <img
//                         src={property.image}
//                         alt={property.title}
//                         className="object-cover w-full h-full rounded-md"
//                       />
//                     </Link>

//                     <div
//                       className={`absolute top-1 left-1 text-white ${property.badgeColor} text-[10px] sm:text-xs px-2 py-1 rounded-md`}
//                     >
//                       {property.type}
//                     </div>
//                   </div>

//                 {/* Middle Section (Details) */}
//                 <div className="flex-1 min-w-0 mt-2 ml-0 sm:ml-3 lg:ml-4">
//                   <h3 className="mb-0 text-base sm:text-lg font-semibold break-word">
//                     {property.title}
//                   </h3>
//                   <p className="mb-0 text-sm text-gray-500 break-words">
//                     {property.location}
//                   </p>
//                   {property.type === "FOR RENT" ||
//                     property.type === "PG / CO-LIVING" ? (
//                     <p className="mt-1 font-bold text-black">
//                       ₹{" "}
//                       {property.rent >= 10000000
//                         ? `${(property.rent / 10000000).toFixed(2).replace(/\.?0+$/, "")} Cr`
//                         : property.rent >= 100000
//                           ? `${(property.rent / 100000).toFixed(2).replace(/\.?0+$/, "")} L`
//                           : property.rent >= 1000
//                             ? `${(property.rent / 1000).toFixed(2).replace(/\.?0+$/, "")} K`
//                             : property.rent}
//                       {property.rent_duration &&
//                         property.rent_duration !== "N/A"
//                         ? ` / ${property.rent_duration}`
//                         : ""}
//                     </p>
//                   ) : (
//                     property.price &&
//                     property.price !== "N/A" && (
//                       <p className="mt-1 font-bold text-black">
//                         ₹{" "}
//                         {Number(property.price) >= 10000000
//                           ? `${(Number(property.price) / 10000000).toFixed(2).replace(/\.?0+$/, "")} Cr`
//                           : Number(property.price) >= 100000
//                             ? `${(Number(property.price) / 100000).toFixed(2).replace(/\.?0+$/, "")} L`
//                             : Number(property.price) >= 1000
//                               ? `${(Number(property.price) / 1000).toFixed(2).replace(/\.?0+$/, "")} K`
//                               : property.price}
//                       </p>
//                     )
//                   )}
//                   <p className="mt-1 text-sm text-gray-400">
//                     Posted on: {property.date}
//                   </p>
//                 </div>

//                 {/* Right Section (Stats & Actions) */}
//                 {/* <div className="flex flex-col items-center gap-4 mt-4 md:mt-0"> */}
//                 <div className="flex flex-col items-center w-full gap-3 mt-3 lg:w-auto lg:gap-4 lg:mt-0">
//                   <div className="flex justify-center w-full gap-8 sm:gap-16 lg:gap-20 mt-3">
//                     <div className="text-center">
//                       <p className="text-sm text-gray-500">Views</p>
//                       <p className="font-semibold text-black">
//                         {property.view_count || "0"}
//                       </p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-sm text-gray-500">Leads</p>
//                       <p className="font-semibold text-black">
//                         {property.leads_count || "0"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Buttons - Now positioned below Views & Leads */}
//                   <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
//                     {property.status === "Available" && (
//                       <>
//                         <button
//                           onClick={() => handlePropertyClick(property)}
//                           // className="px-4 py-1 text-white my-bg rounded-lg"
//                           className="px-3 sm:px-4 py-1.5 sm:py-1 text-sm sm:text-base text-white my-bg rounded-lg whitespace-nowrap"
//                         >
//                           Create Offer
//                         </button>
//                         <button
//                           // className="px-4 py-1 my-text border-rose-500 rounded-lg border-1"
//                            className="px-3 sm:px-4 py-1.5 sm:py-1 text-sm sm:text-base my-text border-rose-500 rounded-lg border whitespace-nowrap"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             history.push(`/edit_property/${property.id}`);
//                           }}
//                         >
//                           Edit Property
//                         </button>
//                         <button
//                           // className="p-2 text-red-500 transition border-red-500 rounded-lg hover:bg-red-100 border-1"
//                           className="p-2 text-red-500 transition border border-red-500 rounded-lg hover:bg-red-100 flex-shrink-0"
//                           onClick={() => handleDeleteClick(property)}
//                         >
//                           <Trash />
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Status Badge */}
//                 <div
//                   className={`absolute top-2 right-2 px-3 py-2 text-sm rounded-lg cursor-pointer ${property.status === "Rented Out" ||
//                     property.status === "Sold Out"
//                     ? "bg-gray-300 text-gray-600"
//                     : "border border-black"
//                     }`}
//                   //             onClick={() => {
//                   //  handleStatusClick(property);
//                   //  setSelectedPropertyId(property.id);
//                   //  setShowModal(true);
//                   // }}
//                   onClick={() => handleStatusClick(property)}
//                 >
//                   {property.status}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-center mt-6 space-x-3">
//             <button
//               className={`px-3 py-2 border rounded-full ${currentPage === 1
//                 ? "text-gray-400 cursor-not-allowed"
//                 : "hover:bg-gray-100"
//                 }`}
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//             >
//               &lt;
//             </button>
//             {[...Array(totalPages)].map((_, index) => (
//               <button
//                 key={index}
//                 className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-medium ${currentPage === index + 1
//                   ? "my-border my-text"
//                   : "text-gray-500 hover:bg-gray-100"
//                   }`}
//                 onClick={() => setCurrentPage(index + 1)}
//               >
//                 {index + 1}
//               </button>
//             ))}
//             <button
//               className={`px-3 py-2 border rounded-full ${currentPage === totalPages
//                 ? "text-gray-400 cursor-not-allowed"
//                 : "hover:bg-gray-100"
//                 }`}
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//             >
//               &gt;
//             </button>
//           </div>
//         )}
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="relative p-6 text-center bg-white shadow-lg rounded-2xl w-96">
//             <button
//               className="absolute text-2xl text-black top-2 right-2 hover:text-black"
//               onClick={() => setShowModal(false)}
//             >
//               <IoCloseCircleOutline />
//             </button>
//             <h2 className="text-2xl font-semibold">
//               {selectedProperty?.status === "Available"
//                 ? selectedProperty?.type === "FOR BUY"
//                   ? "Mark as Sold Out"
//                   : "Mark as Rented Out"
//                 : selectedProperty?.status === "Sold Out" ||
//                   selectedProperty?.status === "Rented Out"
//                   ? "Mark as Available"
//                   : null}
//             </h2>
//             <p className="mt-2 text-gray-500">
//               {selectedProperty?.status === "Available"
//                 ? `Are you sure you want to mark this property as ${selectedProperty?.type === "FOR BUY"
//                   ? "Sold Out"
//                   : "Rented Out"
//                 }?`
//                 : `Are you sure you want to mark this property as Available?`}
//             </p>
//             <div className="flex justify-center gap-8 mt-4">
//               <button
//                 className="px-16 py-2 text-white my-bg rounded-md"
//                 onClick={async () => {
//                   await handleMarkAsSold();
//                   setShowModal(false);
//                   fetchProperties();
//                 }}
//               >
//                 Yes
//               </button>
//               <button
//                 className="px-16 py-2 text-black bg-white border-black rounded-md border-1"
//                 onClick={() => setShowModal(false)}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <DeleteModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={() => handleConfirmDelete(selectedProperty?.id)}
//       />

//       {showNextModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-gray-100 rounded-lg w-full max-w-md md:max-w-3xl relative max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-center p-4 bg-white border-b">
//               <h2 className="text-xl font-semibold">Offer Details</h2>
//               <button
//                 className="absolute text-2xl text-black top-2 right-2 hover:text-black"
//                 onClick={() => setShowNextModal(false)}
//               >
//                 <IoCloseCircleOutline />
//               </button>
//             </div>

//             {/* Property Card */}
//             <div className="flex items-center p-3 bg-white rounded-lg">
//               <div className="relative w-24 h-24">
//                 <img
//                   src={selectedProperty.image}
//                   alt="Property Image"
//                   className="object-cover w-full h-full rounded-lg"
//                 />
//                 <span
//                   className={`absolute top-1 left-1 text-xs px-2 rounded-md text-white ${selectedProperty.badgeColor}`}
//                 >
//                   {selectedProperty.type || "UNKNOWN"}
//                 </span>
//               </div>
//               <div className="ml-3">
//                 <p className="font-semibold">{selectedProperty.title}</p>
//                 <p className="text-sm text-gray-500">
//                   {selectedProperty.location}
//                 </p>
//                 <p className="mt-1 font-bold text-black">
//                   ₹{" "}
//                   {Number(selectedProperty.price) >= 10000000
//                     ? `${(Number(selectedProperty.price) / 10000000).toFixed(1).replace(/\.0$/, "")} Cr`
//                     : Number(selectedProperty.price) >= 100000
//                       ? `${(Number(selectedProperty.price) / 100000).toFixed(1).replace(/\.0$/, "")} L`
//                       : Number(selectedProperty.price) >= 1000
//                         ? `${(Number(selectedProperty.price) / 1000).toFixed(1).replace(/\.0$/, "")} K`
//                         : selectedProperty.price}
//                   {selectedProperty.type?.toLowerCase() === "for rent" && (
//                     <span className="text-gray-500"> /month</span>
//                   )}
//                 </p>
//               </div>
//             </div>

//             {/* Modal Body with Two Columns */}
//             <div className="flex flex-col gap-6 p-4 bg-white md:flex-row">
//               {/* Left Section - Upload Images */}
//               <div className="flex flex-col items-center justify-center p-2 bg-gray-100 border-2 border-gray-300 border-dashed md:w-1/2 rounded-xl">
//                 <div className="w-full p-6 text-center">
//                   {offerPhotoPreview ? (
//                     <div className="relative inline-block w-full">
//                       <img
//                         src={offerPhotoPreview}
//                         alt="Offer Preview"
//                         className="object-cover w-full h-40 rounded-lg shadow"
//                       />
//                       <button
//                         onClick={handleCoverImageDelete}
//                         className="absolute z-10 p-1 bg-black rounded-full top-2 right-2 bg-opacity-60"
//                       >
//                         <Trash className="w-5 h-5 text-white" />
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <p className="mb-2 text-gray-500">Upload Offer</p>
//                       <button
//                         type="button"
//                         className="px-4 py-2 text-sm text-white my-bg rounded-lg"
//                         onClick={() =>
//                           document.getElementById("offer_img").click()
//                         }
//                       >
//                         + Add Photos
//                       </button>
//                     </>
//                   )}
//                   <input
//                     id="offer_img"
//                     type="file"
//                     accept="image/*"
//                     style={{ display: "none" }}
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       if (file) {
//                         setOfferPhoto(file);
//                         setOfferPhotoPreview(URL.createObjectURL(file));
//                       }
//                     }}
//                   />
//                 </div>
//               </div>
//               <div className="my-auto md:w-1/2">
//                 <input
//                   type="text"
//                   placeholder="Offer Name"
//                   value={offerName}
//                   onChange={(e) => setOfferName(e.target.value)}
//                   className="w-full p-2 mb-3 border rounded-lg"
//                 />
//                 <textarea
//                   placeholder="Offer Description"
//                   value={offerDescription}
//                   onChange={(e) => setOfferDescription(e.target.value)}
//                   className="w-full p-2 mb-3 border rounded-lg"
//                 />
//               </div>
//             </div>
//             <div className="flex items-center justify-between p-4 bg-white border-t">
//               <p className="flex items-center font-bold text-gray-500">
//                 1 Property Selected
//               </p>
//               <button
//                 className="px-4 py-2 text-white my-bg rounded-lg"
//                 onClick={() => {
//                   handleAddOffer();
//                   setShowNextModal(false);
//                 }}
//               >
//                 Create Offer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showOfferCountModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl">
//             <h2 className="mb-4 text-xl font-semibold text-red-600">
//               Offer Posting Limit Reached
//             </h2>
//             <p className="mb-6 text-gray-700">
//               You have reached your maximum limit for posting offers. Please
//               purchase a plan to continue creating new offers.
//             </p>
//             {/* Align buttons side by side on the right */}
//             <div className="flex items-center justify-between px-1">
//               <button
//                 className="px-4 py-2 text-white my-bg rounded hover:bg-green-700"
//                 onClick={() => {
//                   setShowOfferCountModal(false);
//                   history.push({
//                     pathname: "/dashboard",
//                     state: { page: "mySubscriptions" },
//                   });
//                 }}
//               >
//                 Purchase Plan
//               </button>
//               <button
//                 className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-400"
//                 onClick={() => {
//                   setShowOfferCountModal(false);
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   ); 
return (
  <>
    <div className="max-w-6xl p-3 mx-auto sm:p-4 md:p-5 lg:p-0">
      {/* =========================================================
          HEADER SECTION
      ========================================================== */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-0">
        <h2 className="text-2xl font-semibold">My Properties</h2>

        {/* Search */}
        <div className="relative w-full md:w-auto">
          <IoIosSearch
            className="absolute text-gray-500 transform -translate-y-1/2 cursor-pointer left-3 top-1/2"
            onClick={handleSearch}
          />

          <input
            type="text"
            placeholder="Search"
            value={searchKeyword}
            onChange={(e) => {
              const value = e.target.value;
              setSearchKeyword(value);
              handleSearch();
            }}
            className="w-full md:w-72 px-10 py-2 pr-10 border rounded-lg outline-none focus:ring-2 focus:ring-rose-400"
          />

          {searchKeyword && (
            <button
              onClick={() => {
                setSearchKeyword("");
                fetchFilteredProperties();
              }}
              className="absolute text-lg text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-900"
            >
              <IoMdClose />
            </button>
          )}
        </div>

        {/* Add New Property */}
        <Link
          to="/add_new_property"
          className="w-full md:w-auto px-4 py-2 text-base font-medium text-center text-white no-underline my-bg border border-gray-300 rounded hover:my-bg hover:no-underline"
        >
          Add New Property{" "}
          {freePostCount > 0 && (
            <span className="px-2 py-0 ml-2 text-sm text-black bg-green-500 rounded-full">
              FREE
            </span>
          )}
        </Link>
      </div>

      {/* =========================================================
          FILTERS
      ========================================================== */}
      <div
        className="
          flex flex-wrap
          justify-center md:justify-around
          mt-6
          gap-3 md:gap-9
        "
      >
        {/* Category */}
        <select
          className="w-full sm:w-40 px-2 py-2 border rounded-lg outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Category Type</option>
          <option value="Buy">Buy</option>
          <option value="Rent">Rent</option>
          <option value="Commercial Buy">Commercial Buy</option>
          <option value="Commercial Lease">Commercial Lease</option>
          <option value="PG/Co-living">PG/Co-living</option>
        </select>

        {/* City */}
        <select
          className="w-full sm:w-32 px-2 py-2 border rounded-lg outline-none"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">City</option>
          <option value="Ahmedabad">Ahmedabad</option>
          <option value="Bangalore">Bengaluru</option>
          <option value="Chennai">Chennai</option>
          <option value="Delhi">Delhi</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Kolkata">Kolkata</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Pune">Pune</option>
        </select>

        {/* Desktop spacing */}
        <div className="hidden md:block w-40"></div>

        {/* Property Type */}
        <select
          className="w-full sm:w-40 px-2 py-2 border rounded-lg outline-none"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">Property Type</option>
          <option value="Flat/Apartment">Flat/Apartment</option>
          <option value="Builder Floor">Builder Floor</option>
          <option value="Independent House/Villa">
            Independent House/Villa
          </option>
          <option value="Independent/Builder Floor">
            Independent/Builder Floor
          </option>
          <option value="1RK/Studio Apartment">
            1RK/Studio Apartment
          </option>
          <option value="Service Apartment">Service Apartment</option>
          <option value="Farmhouse">Farmhouse</option>
          <option value="Plot/Land">Plot/Land</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
          <option value="Storage">Storage</option>
          <option value="Industry">Industry</option>
          <option value="Hospitality">Hospitality</option>
          <option value="Other">Other</option>
        </select>

        {/* Price */}
        <div className="flex flex-col w-full sm:w-auto">
          <div className="flex items-center justify-center gap-2">
            <select
              value={minPrice}
              onChange={handleMinChange}
              className="border px-2 py-2 rounded-lg w-full sm:w-28 outline-none"
            >
              <option value="">₹ Min</option>

              {budgetOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={maxPrice}
              onChange={handleMaxChange}
              className="border px-2 py-2 rounded-lg w-full sm:w-28 outline-none"
            >
              <option value="">₹ Max</option>

              {budgetOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {priceError && (
            <p className="mt-1 text-sm text-red-500">
              {priceError}
            </p>
          )}
        </div>
      </div>

      {/* Property Listings */}
<div className="mt-6 space-y-4">
  {!properties || properties.length === 0 ? (
    <p className="mt-10 text-lg text-center text-gray-500">
      No properties found.
    </p>
  ) : (
    properties.map((property) => (
      <div
        key={property.id}
        className={`bg-white shadow-sm rounded-lg p-4
          flex flex-col md:flex-row
          items-start md:items-center
          justify-between relative
          overflow-hidden
          ${
            property.published === "Approved"
              ? "border-2 border-green-500"
              : property.published === "Pending"
                ? "border-2 border-yellow-500"
                : "border border-gray-300"
          }`}
      >
        {/* Published Badge */}
        <div
          className={`absolute top-2 left-6 text-xs font-medium px-3 py-1 rounded-md
            ${
              property.published === "Approved"
                ? "bg-green-200 text-green-700 border border-green-700"
                : property.published === "Pending"
                  ? "bg-yellow-200 text-yellow-700 border border-yellow-700"
                  : "bg-gray-300 text-gray-600 border border-gray-600"
            }`}
        >
          {property.published === "Approved"
            ? "Approved"
            : property.published === "Pending"
              ? "Pending"
              : "Not Published"}
        </div>

        {/* Status Badge */}
        <div
          className={`absolute top-2 right-2 px-3 py-2 text-sm rounded-lg cursor-pointer
            ${
              property.status === "Rented Out" ||
              property.status === "Sold Out"
                ? "bg-gray-300 text-gray-600"
                : "border border-black"
            }`}
          onClick={() => handleStatusClick(property)}
        >
          {property.status}
        </div>

        {/* LEFT SECTION - IMAGE */}
        <div
          className="
            relative
            w-40 h-28
            flex-shrink-0
            mt-8 md:mt-0
            sm:w-40 sm:h-28
            max-[639px]:w-28 max-[639px]:h-20
          "
        >
          <Link
            to={`/propertydetails/${property.id}`}
            key={property.id}
            className="block w-full h-full"
          >
            <img
              src={property.image}
              alt={property.title}
              className="
                object-cover
                w-full h-full
                rounded-md
              "
            />
          </Link>

          {/* Property Type Badge */}
          <div
            className={`absolute top-1 left-1 text-white ${property.badgeColor}
              text-xs px-2 py-1 rounded-md
              max-[639px]:text-[10px]
              max-[639px]:px-1.5
              max-[639px]:py-0.5`}
          >
            {property.type}
          </div>
        </div>

        {/* MIDDLE SECTION - DETAILS */}
        <div
          className="
            flex-1
            mt-3 ml-4
            min-w-0
            md:mt-0
            max-[639px]:mt-2
            max-[639px]:ml-2
            max-[639px]:pr-20
          "
        >
          <h3
            className="
              mb-0 text-lg font-semibold
              truncate
              max-[639px]:text-sm
            "
          >
            {property.title}
          </h3>

          <p
            className="
              mb-0 text-sm text-gray-500
              truncate
              max-[639px]:text-xs
            "
          >
            {property.location}
          </p>

          {property.type === "FOR RENT" ||
          property.type === "PG / CO-LIVING" ? (
            <p
              className="
                mt-1 font-bold text-black
                max-[639px]:text-sm
              "
            >
              ₹{" "}
              {property.rent >= 10000000
                ? `${(property.rent / 10000000)
                    .toFixed(2)
                    .replace(/\.?0+$/, "")} Cr`
                : property.rent >= 100000
                  ? `${(property.rent / 100000)
                      .toFixed(2)
                      .replace(/\.?0+$/, "")} L`
                  : property.rent >= 1000
                    ? `${(property.rent / 1000)
                        .toFixed(2)
                        .replace(/\.?0+$/, "")} K`
                    : property.rent}

              {property.rent_duration &&
              property.rent_duration !== "N/A"
                ? ` / ${property.rent_duration}`
                : ""}
            </p>
          ) : (
            property.price &&
            property.price !== "N/A" && (
              <p
                className="
                  mt-1 font-bold text-black
                  max-[639px]:text-sm
                "
              >
                ₹{" "}
                {Number(property.price) >= 10000000
                  ? `${(Number(property.price) / 10000000)
                      .toFixed(2)
                      .replace(/\.?0+$/, "")} Cr`
                  : Number(property.price) >= 100000
                    ? `${(Number(property.price) / 100000)
                        .toFixed(2)
                        .replace(/\.?0+$/, "")} L`
                    : Number(property.price) >= 1000
                      ? `${(Number(property.price) / 1000)
                          .toFixed(2)
                          .replace(/\.?0+$/, "")} K`
                      : property.price}
              </p>
            )
          )}

          <p
            className="
              mt-1 text-sm text-gray-400
              max-[639px]:text-xs
            "
          >
            Posted on: {property.date}
          </p>
        </div>

        {/* RIGHT SECTION - STATS + ACTIONS */}
        <div
          className="
            flex flex-col items-center gap-4
            mt-4 md:mt-0
            flex-shrink-0
            max-[639px]:w-full
            max-[639px]:mt-3
          "
        >
          {/* Views / Leads */}
          <div
            className="
              flex gap-20 mt-3
              max-[767px]:gap-10
              max-[639px]:gap-8
              max-[639px]:mt-0
            "
          >
            <div className="text-center">
              <p className="text-sm text-gray-500 max-[639px]:text-xs">
                Views
              </p>
              <p className="font-semibold text-black">
                {property.view_count || "0"}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 max-[639px]:text-xs">
                Leads
              </p>
              <p className="font-semibold text-black">
                {property.leads_count || "0"}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div
            className="
              flex gap-4
              max-[767px]:gap-2
              max-[639px]:gap-2
              max-[639px]:flex-wrap
              max-[639px]:justify-center
            "
          >
            {property.status === "Available" && (
              <>
                {/* Create Offer */}
                <button
                  onClick={() => handlePropertyClick(property)}
                  className="
                    px-4 py-1 text-white my-bg rounded-lg
                    whitespace-nowrap
                    max-[767px]:px-3
                    max-[639px]:px-2.5
                    max-[639px]:py-1
                    max-[639px]:text-xs
                  "
                >
                  Create Offer
                </button>

                {/* Edit Property */}
                <button
                  className="
                    px-4 py-1 my-text border-rose-500 rounded-lg border
                    whitespace-nowrap
                    max-[767px]:px-3
                    max-[639px]:px-2.5
                    max-[639px]:py-1
                    max-[639px]:text-xs
                  "
                  onClick={(e) => {
                    e.preventDefault();
                    history.push(`/edit_property/${property.id}`);
                  }}
                >
                  Edit Property
                </button>

                {/* Delete */}
                <button
                  className="
                    p-2 text-red-500 transition
                    border-red-500 rounded-lg
                    hover:bg-red-100 border
                    flex-shrink-0
                    max-[639px]:p-1.5
                  "
                  onClick={() => handleDeleteClick(property)}
                >
                  <Trash className="max-[639px]:w-4 max-[639px]:h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    ))
  )}
</div>
       

      {/* =========================================================
          PAGINATION
      ========================================================== */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6 space-x-3">
          <button
            className={`
              px-3
              py-2
              border
              rounded-full

              ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }
            `}
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`
                w-10
                h-10
                flex
                items-center
                justify-center
                rounded-full
                text-lg
                font-medium

                ${
                  currentPage === index + 1
                    ? "my-border my-text"
                    : "text-gray-500 hover:bg-gray-100"
                }
              `}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className={`
              px-3
              py-2
              border
              rounded-full

              ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }
            `}
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>

    {/* =========================================================
        STATUS MODAL
    ========================================================== */}
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="relative w-full max-w-md p-6 text-center bg-white shadow-lg rounded-2xl">
          <button
            className="absolute text-2xl text-black top-2 right-2"
            onClick={() => setShowModal(false)}
          >
            <IoCloseCircleOutline />
          </button>

          <h2 className="text-2xl font-semibold">
            {selectedProperty?.status === "Available"
              ? selectedProperty?.type === "FOR BUY"
                ? "Mark as Sold Out"
                : "Mark as Rented Out"
              : selectedProperty?.status === "Sold Out" ||
                  selectedProperty?.status === "Rented Out"
                ? "Mark as Available"
                : null}
          </h2>

          <p className="mt-2 text-gray-500">
            {selectedProperty?.status === "Available"
              ? `Are you sure you want to mark this property as ${
                  selectedProperty?.type === "FOR BUY"
                    ? "Sold Out"
                    : "Rented Out"
                }?`
              : `Are you sure you want to mark this property as Available?`}
          </p>

          <div className="flex flex-col justify-center gap-3 mt-4 sm:flex-row sm:gap-8">
            <button
              className="w-full px-8 py-2 text-white my-bg rounded-md sm:w-auto sm:px-16"
              onClick={async () => {
                await handleMarkAsSold();
                setShowModal(false);
                fetchProperties();
              }}
            >
              Yes
            </button>

            <button
              className="w-full px-8 py-2 text-black bg-white border-black rounded-md border sm:w-auto sm:px-16"
              onClick={() => setShowModal(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    )}

    {/* =========================================================
        DELETE MODAL
    ========================================================== */}
    <DeleteModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onConfirm={() =>
        handleConfirmDelete(selectedProperty?.id)
      }
    />

    {/* =========================================================
        OFFER DETAILS MODAL
    ========================================================== */}
    {showNextModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black bg-opacity-50">
        <div
          className="
            bg-gray-100
            rounded-lg
            w-full
            max-w-md
            md:max-w-3xl
            relative
            max-h-[90vh]
            overflow-y-auto
          "
        >
          {/* Modal Header */}
          <div className="flex items-center justify-center p-4 bg-white border-b">
            <h2 className="text-xl font-semibold">
              Offer Details
            </h2>

            <button
              className="absolute text-2xl text-black top-2 right-2"
              onClick={() => setShowNextModal(false)}
            >
              <IoCloseCircleOutline />
            </button>
          </div>

          {/* Property Card */}
          <div className="flex items-center p-3 bg-white rounded-lg">
            <div className="relative w-20 h-20 flex-shrink-0 md:w-24 md:h-24">
              <img
                src={selectedProperty.image}
                alt="Property Image"
                className="object-cover w-full h-full rounded-lg"
              />

              <span
                className={`
                  absolute
                  top-1
                  left-1
                  text-xs
                  px-2
                  rounded-md
                  text-white
                  ${selectedProperty.badgeColor}
                `}
              >
                {selectedProperty.type || "UNKNOWN"}
              </span>
            </div>

            <div className="ml-3 min-w-0">
              <p className="font-semibold truncate">
                {selectedProperty.title}
              </p>

              <p className="text-sm text-gray-500 truncate">
                {selectedProperty.location}
              </p>

              <p className="mt-1 font-bold text-black">
                ₹{" "}
                {Number(selectedProperty.price) >= 10000000
                  ? `${(
                      Number(selectedProperty.price) /
                      10000000
                    )
                      .toFixed(1)
                      .replace(/\.0$/, "")} Cr`
                  : Number(selectedProperty.price) >= 100000
                    ? `${(
                        Number(selectedProperty.price) /
                        100000
                      )
                        .toFixed(1)
                        .replace(/\.0$/, "")} L`
                    : Number(selectedProperty.price) >= 1000
                      ? `${(
                          Number(selectedProperty.price) /
                          1000
                        )
                          .toFixed(1)
                          .replace(/\.0$/, "")} K`
                      : selectedProperty.price}

                {selectedProperty.type?.toLowerCase() ===
                  "for rent" && (
                  <span className="text-gray-500">
                    {" "}
                    /month
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex flex-col gap-6 p-4 bg-white md:flex-row">
            {/* Upload Images */}
            <div className="flex flex-col items-center justify-center p-2 bg-gray-100 border-2 border-gray-300 border-dashed md:w-1/2 rounded-xl">
              <div className="w-full p-4 md:p-6 text-center">
                {offerPhotoPreview ? (
                  <div className="relative inline-block w-full">
                    <img
                      src={offerPhotoPreview}
                      alt="Offer Preview"
                      className="object-cover w-full h-40 rounded-lg shadow"
                    />

                    <button
                      onClick={handleCoverImageDelete}
                      className="absolute z-10 p-1 bg-black rounded-full top-2 right-2 bg-opacity-60"
                    >
                      <Trash className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="mb-2 text-gray-500">
                      Upload Offer
                    </p>

                    <button
                      type="button"
                      className="px-4 py-2 text-sm text-white my-bg rounded-lg"
                      onClick={() =>
                        document
                          .getElementById("offer_img")
                          .click()
                      }
                    >
                      + Add Photos
                    </button>
                  </>
                )}

                <input
                  id="offer_img"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      setOfferPhoto(file);
                      setOfferPhotoPreview(
                        URL.createObjectURL(file)
                      );
                    }
                  }}
                />
              </div>
            </div>

            {/* Offer Inputs */}
            <div className="my-auto md:w-1/2">
              <input
                type="text"
                placeholder="Offer Name"
                value={offerName}
                onChange={(e) =>
                  setOfferName(e.target.value)
                }
                className="w-full p-2 mb-3 border rounded-lg"
              />

              <textarea
                placeholder="Offer Description"
                value={offerDescription}
                onChange={(e) =>
                  setOfferDescription(e.target.value)
                }
                className="w-full p-2 mb-3 border rounded-lg"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col items-center justify-between gap-3 p-4 bg-white border-t sm:flex-row">
            <p className="flex items-center font-bold text-gray-500">
              1 Property Selected
            </p>

            <button
              className="w-full px-4 py-2 text-white my-bg rounded-lg sm:w-auto"
              onClick={() => {
                handleAddOffer();
                setShowNextModal(false);
              }}
            >
              Create Offer
            </button>
          </div>
        </div>
      </div>
    )}

    {/* =========================================================
        OFFER COUNT MODAL
    ========================================================== */}
    {showOfferCountModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl">
          <h2 className="mb-4 text-xl font-semibold text-red-600">
            Offer Posting Limit Reached
          </h2>

          <p className="mb-6 text-gray-700">
            You have reached your maximum limit for posting
            offers. Please purchase a plan to continue creating
            new offers.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              className="w-full px-4 py-2 text-white my-bg rounded sm:w-auto hover:bg-green-700"
              onClick={() => {
                setShowOfferCountModal(false);

                history.push({
                  pathname: "/dashboard",
                  state: {
                    page: "mySubscriptions",
                  },
                });
              }}
            >
              Purchase Plan
            </button>

            <button
              className="w-full px-4 py-2 text-black bg-gray-300 rounded sm:w-auto hover:bg-gray-400"
              onClick={() => {
                setShowOfferCountModal(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);

};

export default MyProperties;