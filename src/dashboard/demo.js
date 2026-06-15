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

          // Set the badge color and type based on the property category type
          if (item.property_category_type === "Buy") {
            badgeColor = "bg-green-600";
            type = "FOR BUY";
            status =
              item.available_status === "Sold" ? "Sold Out" : "Available";
          } else if (item.property_category_type === "Rent") {
            badgeColor = "bg-blue-600";
            type = "FOR RENT";
            status =
              item.available_status === "Sold" ? "Rented Out" : "Available";
          } else if (item.property_category_type === "PG") {
            badgeColor = "bg-yellow-500";
            type = "PG";
            status =
              item.available_status === "Sold" ? "Rented Out" : "Available";
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
    const value = Number(e.target.value);
    setMaxPrice(value);

    if (minPrice && value < minPrice) {
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

          if (item.property_category_type === "Buy") {
            badgeColor = "bg-green-600";
            type = "FOR BUY";
            status =
              item.available_status === "Sold" ? "Sold Out" : "Available";
          } else if (item.property_category_type === "Rent") {
            badgeColor = "bg-blue-600";
            type = "FOR RENT";
            status =
              item.available_status === "Sold" ? "Rented Out" : "Available";
          } else if (item.property_category_type === "PG") {
            badgeColor = "bg-yellow-500";
            type = "PG";
            status =
              item.available_status === "Sold" ? "Rented Out" : "Available";
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
  useEffect(() => {
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

            if (item.property_category_type === "Buy") {
              badgeColor = "bg-green-600";
              type = "FOR BUY";
              status =
                item.available_status === "Sold" ? "Sold Out" : "Available";
            } else if (item.property_category_type === "Rent") {
              badgeColor = "bg-blue-600";
              type = "FOR RENT";
              status =
                item.available_status === "Sold" ? "Rented Out" : "Available";
            } else if (item.property_category_type === "PG") {
              badgeColor = "bg-yellow-500";
              type = "PG";
              status =
                item.available_status === "Sold" ? "Rented Out" : "Available";
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

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <h2 className="text-2xl font-semibold">My Properties</h2>
          <div className="relative md:mt-0">
            <IoIosSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
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
              className="border rounded-lg px-10 py-2 w-72 outline-none focus:ring-2 focus:ring-rose-400 pr-10"
            />
            {searchKeyword && (
              <button
                onClick={() => {
                  setSearchKeyword("");
                  fetchProperties();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-900 text-lg"
              >
                <IoMdClose />
              </button>
            )}
          </div>
          <Link
            to="/add_new_property"
            className="my-bg text-white font-medium px-4 py-2 rounded border border-gray-300 hover:my-bg no-underline hover:no-underline text-base text-center"
          >
            Add New Property{" "}
            {freePostCount > 0 && (
              <span className="bg-green-500 text-black text-sm px-2 py-0 rounded-full ml-2">
                FREE
              </span>
            )}
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-9 mt-6 justify-around">
          <select
            className="border px-2 py-2 rounded-lg outline-none w-40"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Category Type</option>
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
          </select>
          <select
            className="border px-2 py-2 rounded-lg outline-none w-32"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">City</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Ahmedabad">Ahmedabad</option>
          </select>
          <div className="w-0 md:w-40"></div>
          <select
            className="border px-2 py-2 rounded-lg outline-none w-40"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Plot">Plot</option>
            <option value="Villa">Villa</option>
            <option value="Independent House">Independent House</option>
            <option value="Builder Floor">Builder Floor</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Office Space">Office Space</option>
            <option value="Shop">Shop</option>
            <option value="Land">Land</option>
            <option value="Office Space IT/SEZ">Office Space IT/SEZ</option>
            <option value="Showroom">Showroom</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Industrial Plot">Industrial Plot</option>
            <option value="Working Space">Co-Working Space</option>
            <option value="PG">PG</option>
          </select>
          <div>
            <select
              value={minPrice}
              onChange={handleMinChange}
              className="border px-2 py-2 rounded-lg w-28 outline-none"
            >
              <option value="">₹ Min</option>
              {priceOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            &nbsp;&nbsp;&nbsp;
            <select
              value={maxPrice}
              onChange={handleMaxChange}
              className="border px-2 py-2 rounded-lg w-28 outline-none"
            >
              <option value="">₹ Max</option>
              {priceOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {priceError && (
              <p className="text-red-500 text-sm mt-1">{priceError}</p>
            )}
          </div>
        </div>

        {/* Property Listings */}
        <div className="mt-6 space-y-4">
          {!properties || properties.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-10">
              No properties found.
            </p>
          ) : (
            properties.map((property) => (
              <div
                key={property.id}
                className={`bg-white shadow-sm rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between relative
                  ${
                    property.published === "Approved"
                      ? "border-2 border-green-500"
                      : property.published === "Rejected"
                        ? "border-2 border-red-500"
                        : property.published === "Pending"
                          ? "border-2 border-yellow-500"
                          : "border border-gray-300"
                  }`}
              >
                {/* Published Badge (Top Left Corner) */}
                <div
                  className={`absolute top-2 left-6 text-xs font-medium px-3 py-1 rounded-md 
                    ${
                      property.published === "Approved"
                        ? "bg-green-200 text-green-700 border border-green-700"
                        : property.published === "Rejected"
                          ? "bg-red-200 text-red-700 border border-red-700"
                          : property.published === "Pending"
                            ? "bg-yellow-200 text-yellow-700 border border-yellow-700"
                            : "bg-gray-300 text-gray-600 border border-gray-600"
                    }`}
                >
                  {property.published === "Approved"
                    ? "Approved"
                    : property.published === "Rejected"
                      ? "Rejected"
                      : property.published === "Pending"
                        ? "Pending"
                        : "Not Published"}
                </div>

                {/* Left Section (Image + Badge) */}
                <div className="relative w-40 h-28">
                  <Link
                    to={`/propertydetails/${property.id}`}
                    key={property.id}
                    className="block"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-64 h-24 object-cover rounded-md"
                    />
                  </Link>
                  <div
                    className={`absolute top-1 left-1 text-white ${property.badgeColor} text-xs px-2 py-1 rounded-md`}
                  >
                    {property.type}
                  </div>
                </div>

                {/* Middle Section (Details) */}
                <div className="ml-4 flex-1 mt-3">
                  <h3 className="text-lg font-semibold mb-0">
                    {property.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-0">
                    {property.location}
                  </p>
                  {property.type === "FOR RENT" ? (
                    <p className="text-black font-bold mt-1">
                      ₹{" "}
                      {property.rent >= 10000000
                        ? `${(property.rent / 10000000).toFixed(1).replace(/\.0$/, "")} Cr`
                        : property.rent >= 100000
                          ? `${(property.rent / 100000).toFixed(1).replace(/\.0$/, "")} L`
                          : property.rent >= 1000
                            ? `${(property.rent / 1000).toFixed(1).replace(/\.0$/, "")} K`
                            : property.rent}
                      {property.rent_duration &&
                      property.rent_duration !== "N/A"
                        ? ` / ${property.rent_duration}`
                        : ""}
                    </p>
                  ) : (
                    property.price &&
                    property.price !== "N/A" && (
                      <p className="text-black font-bold mt-1">
                        ₹{" "}
                        {Number(property.price) >= 10000000
                          ? `${(Number(property.price) / 10000000).toFixed(1).replace(/\.0$/, "")} Cr`
                          : Number(property.price) >= 100000
                            ? `${(Number(property.price) / 100000).toFixed(1).replace(/\.0$/, "")} L`
                            : Number(property.price) >= 1000
                              ? `${(Number(property.price) / 1000).toFixed(1).replace(/\.0$/, "")} K`
                              : property.price}
                      </p>
                    )
                  )}
                  <p className="text-gray-400 text-sm mt-1">
                    Posted on: {property.date}
                  </p>
                </div>

                {/* Right Section (Stats & Actions) */}
                <div className="flex flex-col items-center gap-4 mt-4 md:mt-0">
                  <div className="flex gap-20 mt-3">
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">Views</p>
                      <p className="text-black font-semibold">
                        {property.view_count || "0"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">Leads</p>
                      <p className="text-black font-semibold">
                        {property.leads_count || "0"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {property.status === "Available" && (
                      <>
                        <button
                          onClick={() => handlePropertyClick(property)}
                          className="my-bg text-white px-4 py-1 rounded-lg"
                        >
                          Create Offer
                        </button>
                        <button
                          className="border-1 border-rose-500 my-text px-4 py-1 rounded-lg"
                          onClick={(e) => {
                            e.preventDefault();
                            history.push(`/edit_property/${property.id}`);
                          }}
                        >
                          Edit Property
                        </button>
                        <button
                          className="text-red-500 p-2 rounded-lg hover:bg-red-100 transition border-1 border-red-500"
                          onClick={() => handleDeleteClick(property)}
                        >
                          <Trash />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className={`absolute top-2 right-2 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                    property.status === "Rented Out" ||
                    property.status === "Sold Out"
                      ? "bg-gray-300 text-gray-600"
                      : "border border-black"
                  }`}
                  onClick={() => handleStatusClick(property)}
                >
                  {property.status}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 mt-6">
            <button
              className={`px-3 py-2 border rounded-full ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-medium ${
                  currentPage === index + 1
                    ? "my-border my-text"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className={`px-3 py-2 border rounded-full ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 w-96 text-center shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-black hover:text-black text-2xl"
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
            <p className="text-gray-500 mt-2">
              {selectedProperty?.status === "Available"
                ? `Are you sure you want to mark this property as ${
                    selectedProperty?.type === "FOR BUY"
                      ? "Sold Out"
                      : "Rented Out"
                  }?`
                : `Are you sure you want to mark this property as Available?`}
            </p>
            <div className="flex justify-center gap-8 mt-4">
              <button
                className="my-bg text-white px-16 py-2 rounded-md"
                onClick={async () => {
                  await handleMarkAsSold();
                  setShowModal(false);
                  fetchProperties();
                }}
              >
                Yes
              </button>
              <button
                className="bg-white text-black border-1 border-black px-16 py-2 rounded-md"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleConfirmDelete(selectedProperty?.id)}
      />

      {showNextModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 rounded-lg w-full max-w-md md:max-w-3xl relative max-h-[90vh] overflow-y-auto">
            <div className="bg-white p-4 flex justify-center items-center border-b">
              <h2 className="text-xl font-semibold">Offer Details</h2>
              <button
                className="absolute top-2 right-2 text-black hover:text-black text-2xl"
                onClick={() => setShowNextModal(false)}
              >
                <IoCloseCircleOutline />
              </button>
            </div>
            <div className="flex items-center bg-white p-3 rounded-lg">
              <div className="relative w-24 h-24">
                <img
                  src={selectedProperty.image}
                  alt="Property Image"
                  className="w-full h-full rounded-lg object-cover"
                />
                <span
                  className={`absolute top-1 left-1 text-xs px-2 rounded-md text-white ${selectedProperty.badgeColor}`}
                >
                  {selectedProperty.type || "UNKNOWN"}
                </span>
              </div>
              <div className="ml-3">
                <p className="font-semibold">{selectedProperty.title}</p>
                <p className="text-gray-500 text-sm">
                  {selectedProperty.location}
                </p>
                <p className="text-black font-bold mt-1">
                  ₹{" "}
                  {Number(selectedProperty.price) >= 10000000
                    ? `${(Number(selectedProperty.price) / 10000000).toFixed(1).replace(/\.0$/, "")} Cr`
                    : Number(selectedProperty.price) >= 100000
                      ? `${(Number(selectedProperty.price) / 100000).toFixed(1).replace(/\.0$/, "")} L`
                      : Number(selectedProperty.price) >= 1000
                        ? `${(Number(selectedProperty.price) / 1000).toFixed(1).replace(/\.0$/, "")} K`
                        : selectedProperty.price}
                  {selectedProperty.type?.toLowerCase() === "for rent" && (
                    <span className="text-gray-500"> /month</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row p-4 gap-6 bg-white">
              <div className="md:w-1/2 flex flex-col items-center justify-center bg-gray-100 p-2 border-dashed border-2 border-gray-300 rounded-xl">
                <div className="p-6 text-center w-full">
                  {offerPhotoPreview ? (
                    <div className="relative inline-block w-full">
                      <img
                        src={offerPhotoPreview}
                        alt="Offer Preview"
                        className="w-full h-40 object-cover rounded-lg shadow"
                      />
                      <button
                        onClick={handleCoverImageDelete}
                        className="absolute top-2 right-2 bg-black bg-opacity-60 p-1 rounded-full z-10"
                      >
                        <Trash className="text-white w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-500 mb-2">Upload Offer</p>
                      <button
                        type="button"
                        className="my-bg text-white px-4 py-2 rounded-lg text-sm"
                        onClick={() =>
                          document.getElementById("offer_img").click()
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
                        setOfferPhotoPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
              </div>
              <div className="md:w-1/2 my-auto">
                <input
                  type="text"
                  placeholder="Offer Name"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  className="w-full border rounded-lg p-2 mb-3"
                />
                <textarea
                  placeholder="Offer Description"
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  className="w-full border rounded-lg p-2 mb-3"
                />
              </div>
            </div>
            <div className="bg-white flex justify-between items-center p-4 border-t">
              <p className="text-gray-500 font-bold flex items-center">
                1 Property Selected
              </p>
              <button
                className="my-bg text-white px-4 py-2 rounded-lg"
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
      {showOfferCountModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Offer Posting Limit Reached
            </h2>
            <p className="mb-6 text-gray-700">
              You have reached your maximum limit for posting offers. Please
              purchase a plan to continue creating new offers.
            </p>
            <div className="flex justify-between items-center px-1">
              <button
                className="my-bg text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => {
                  setShowOfferCountModal(false);
                  history.push({
                    pathname: "/dashboard",
                    state: { page: "mySubscriptions" },
                  });
                }}
              >
                Purchase Plan
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
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
