import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";

const PlanPurchase = () => {
  const [plans, setPlans] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showMoreFeatures, setShowMoreFeatures] = useState({});
  const [showMoreDescription, setShowMoreDescription] = useState({});
  const [activeTab, setActiveTab] = useState("All Plans");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cust_api/get_subscription_plans`
        );
        setPlans(response.data.data);

        const uniqueCategories = [
          ...new Set(response.data.data.map((plan) => plan.category_type)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      }
    };

    fetchPlans();
  }, []);

  const toggleShowMoreFeatures = (index) => {
    setShowMoreFeatures((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleShowMoreDescription = (index) => {
    setShowMoreDescription((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // const handlePurchase = async (plan) => {
  //   const userId = sessionStorage.getItem("AccessToken");
  //   const transactionId = `txn_${Date.now()}`;
  //   const paymentMode = "Credit Card";
  //   const currentDate = new Date();
  //   const expiryDate = new Date(currentDate);
  //   expiryDate.setMonth(expiryDate.getMonth() + plan.validity);

  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/cust_api/purchase_plan`,
  //       {
  //         plan_auto_id: plan._id,
  //         user_id: userId,
  //         payment_mode: paymentMode,
  //         transaction_id: transactionId,
  //         transaction_status: "Success",
  //         plan_purchase_date: currentDate.toISOString().split("T")[0],
  //         plan_expiry_date: expiryDate.toISOString().split("T")[0],
  //         plan_status: "Active",
  //         category_type: plan.category_type,
  //         no_of_units: plan.no_of_units || 1,
  //         plan_name: plan.plan_name,
  //         user_name: sessionStorage.getItem("user_name"),
  //       }
  //     );

  //     console.log("Response from API:", response);

  //     if (response.data.status === 1) {
  //       setMessage("Plan purchased successfully!");
  //       updateProfileAndCount(plan.category_type, plan.no_of_units || 1);
  //     } else {
  //       setMessage("Failed to purchase plan. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error purchasing plan:", error);
  //     setMessage("Error purchasing plan. Please try again.");
  //   } finally {
  //     // Set timeout for alert message
  //     setTimeout(() => {
  //       setMessage("");
  //     }, 3000); // 3 seconds
  //   }
  // };

  // import React, { useState, useEffect } from "react";
  // import axios from "axios";

  const handlePurchase = async (plan) => {
    const userId = sessionStorage.getItem("AccessToken");
    const paymentMode = "Razorpay";
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setMonth(expiryDate.getMonth() + plan.validity);

    try {
      // Step 1: Create an order on Razorpay
      const orderResponse = await axios.post(`https://api.razorpay.com/v1/orders`, {
        amount: plan.final_price * 100, // Convert amount to paise (Razorpay requires in smallest currency unit)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      const { id: orderId } = orderResponse.data;

      // Step 2: Open Razorpay Payment Modal
      const options = {
        key: "rzp_test_NUdFc6JnjprfBJ", // Razorpay Key ID
        amount: plan.final_price * 100, // Amount in paise
        currency: "INR",
        name: "Houzza",
        description: `Purchase of ${plan.plan_name}`,
        image: "https://your-logo-url.com/logo.png", // Replace with your logo URL
        order_id: orderId,
        handler: async (response) => {
          // Step 3: Handle success and call your API to store in database
          try {
            const apiResponse = await axios.post(
              `${process.env.REACT_APP_API_URL}/cust_api/purchase_plan`,
              {
                plan_auto_id: plan._id,
                user_id: userId,
                payment_mode: paymentMode,
                transaction_id: response.razorpay_payment_id, // Use Razorpay's payment ID
                transaction_status: "Success",
                plan_purchase_date: currentDate.toISOString().split("T")[0],
                plan_expiry_date: expiryDate.toISOString().split("T")[0],
                plan_status: "Active",
                category_type: plan.category_type,
                no_of_units: plan.no_of_units || 1,
                plan_name: plan.plan_name,
                user_name: sessionStorage.getItem("user_name"),
              }
            );

            // Check API Response
            if (apiResponse.data.status === 1) {
              setMessage("Plan purchased successfully!");
              updateProfileAndCount(plan.category_type, plan.no_of_units || 1); // Update UI or state
            } else {
              setMessage("Failed to purchase plan. Please try again.");
            }
          } catch (apiError) {
            console.error("Error calling purchase plan API:", apiError);
            setMessage("Error purchasing plan. Please try again.");
          } finally {
            setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
          }
        },
        prefill: {
          name: sessionStorage.getItem("user_name"),
          email: sessionStorage.getItem("user_email"), // Replace with user's email if available
          contact: sessionStorage.getItem("user_contact"), // Replace with user's contact if available
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Error in Razorpay payment process:", error);
      setMessage("Error initiating payment. Please try again.");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    // script.onload = () => {
      // console.log("Razorpay script loaded successfully.");
    // };

    document.body.appendChild(script);
  }, []);



  const updateProfileAndCount = async (categoryType, unitsAvailable) => {
    const userId = sessionStorage.getItem("AccessToken");
    try {
      const profileResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_profile`,
        {
          user_id: userId,
        }
      );

      const currentCounts = profileResponse.data.count_data;
      console.log("Fetched counts:", currentCounts);

      // Ensure current counts are treated as numbers
      const currentOfferCount = parseInt(currentCounts.offer_count, 10) || 0;
      const currentFeatureCount =
        parseInt(currentCounts.feature_count, 10) || 0;
      const currentUpcomingCount =
        parseInt(currentCounts.upcoming_project_count, 10) || 0;

      // Determine the updated count based on the category type
      let updatedCounts = {
        free_view_count: parseInt(currentCounts.free_view_count, 10) || 0,
        free_post_count: parseInt(currentCounts.free_post_count, 10) || 0,
        paid_view_count: parseInt(currentCounts.paid_view_count, 10) || 0,
        paid_post_count: parseInt(currentCounts.paid_post_count, 10) || 0,
        feature_count: currentFeatureCount,
        offer_count: currentOfferCount,
        upcoming_project_count: currentUpcomingCount,
      };

      if (categoryType === "Offers") {
        updatedCounts.offer_count += parseInt(unitsAvailable, 10) || 0;
      } else if (categoryType === "Featured Properties") {
        updatedCounts.feature_count += parseInt(unitsAvailable, 10) || 0;
      } else if (categoryType === "Upcoming Projects") {
        updatedCounts.upcoming_project_count +=
          parseInt(unitsAvailable, 10) || 0;
      } else if (categoryType === "Post Properties") {
        updatedCounts.paid_post_count += parseInt(unitsAvailable, 10) || 0;
      } else if (categoryType === "Contact Details") {
        updatedCounts.paid_view_count += parseInt(unitsAvailable, 10) || 0;
      }

      const updateCountResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/add_count`,
        {
          user_id: userId,
          free_view_count: updatedCounts.free_view_count,
          free_post_count: updatedCounts.free_post_count,
          paid_view_count: updatedCounts.paid_view_count,
          paid_post_count: updatedCounts.paid_post_count,
          feature_count: updatedCounts.feature_count,
          offer_count: updatedCounts.offer_count,
          upcoming_project_count: updatedCounts.upcoming_project_count,
        }
      );

      if (updateCountResponse.data.status === 1) {
        sessionStorage.setItem(
          "upcoming_project_count",
          updatedCounts.upcoming_project_count
        );
        sessionStorage.setItem("offer_count", updatedCounts.offer_count);
        sessionStorage.setItem("feature_count", updatedCounts.feature_count);
        sessionStorage.setItem(
          "paid_post_count",
          updatedCounts.paid_post_count
        );
        sessionStorage.setItem(
          "paid_view_count",
          updatedCounts.paid_view_count
        );
      }

      if (updateCountResponse.data.status !== 1) {
        alert("Failed to update count. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile and count:", error.message);
      setMessage("Error updating profile and count.");
    }
  };

  const renderSlider = (plansToDisplay) => {
    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,

      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: true,
          },
        },
      ],
    };

    // For smaller screens, use a flex layout
    if (plansToDisplay.length <= 2) {
      return (
        <div className="d-flex flex-wrap justify-content-center">
          {plansToDisplay.map((plan) => (
            <div
              key={plan._id}
              className="card cloud-card"
              style={{
                margin: "20px",
                width: "100%",
                height: "100%",
                maxWidth: "300px", // Ensures max card width on small screens
                border: "none",
                padding: "10px",
              }}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}${plan.plan_image}`}
                className="card-img-top"
                alt={plan.plan_name}
                style={{
                  height: "190px",
                  objectFit: "cover",
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                }}
              />
              <div
                className="offer-badge"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "20px",
                  backgroundColor: "#FF6347",
                  color: "white",
                  padding: "5px 10px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                {plan.offer_percentage}%
              </div>

              <div
                className="card-body"
                style={{ padding: "16px", backgroundColor: "#ffff" }}
              >
                <h5
                  className="card-title"
                  style={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                  {plan.plan_name}
                </h5>
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  <strong>Price:</strong> {plan.final_price}
                </p>
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  <strong>Validity:</strong> {plan.validity}{" "}
                  {plan.validity_unit}
                </p>

                {/* Features */}
                <p
                  className="mb-1 card-text"
                  style={{ marginBottom: "5px", fontSize: "0.8rem" }}
                >
                  <strong>Features:</strong>
                </p>
                <div
                  style={{
                    maxHeight: showMoreFeatures[plan._id] ? "120px" : "50px",
                    overflowY: showMoreFeatures[plan._id] ? "scroll" : "hidden",
                    transition: "max-height 0.3s ease-in-out",
                  }}
                >
                  <ul
                    style={{
                      paddingLeft: "1rem",
                      listStyle: "none",
                      margin: "0",
                    }}
                  >
                    {plan.features.split(",").map((feature, idx) => (
                      <li
                        key={idx}
                        style={{ marginBottom: "5px", fontSize: "0.8rem" }}
                      >
                        {feature.trim()}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button to toggle visibility of additional features */}
                <button
                  onClick={() => toggleShowMoreFeatures(plan._id)}
                  className="btn btn-link mt-1"
                  style={{
                    marginTop: "10px",
                    padding: "0",
                    fontSize: "0.7rem",
                  }}
                >
                  {showMoreFeatures[plan._id] ? "View Less" : "View More"}
                </button>

                {/* One-line description with ellipses below features */}
                <p
                  className="card-text"
                  style={{
                    fontSize: "0.8rem",
                    whiteSpace: showMoreDescription[plan._id]
                      ? "normal"
                      : "nowrap",
                    overflow: showMoreDescription[plan._id]
                      ? "visible"
                      : "hidden",
                    textOverflow: showMoreDescription[plan._id]
                      ? "unset"
                      : "ellipsis",
                    maxWidth: "100%",
                    marginTop: "5px",
                  }}
                >
                  {plan.description}
                </p>

                {/* Button to toggle visibility of additional features */}
                <button
                  onClick={() => toggleShowMoreDescription(plan._id)}
                  className="btn btn-link mt-1"
                  style={{
                    marginTop: "10px",
                    padding: "0",
                    fontSize: "0.7rem",
                  }}
                >
                  {showMoreDescription[plan._id] ? "View Less" : "View More"}
                </button>

                {/* Purchase Button */}
                <button
                  onClick={() => handlePurchase(plan)}
                  className="btn btn-primary ml-20"
                  style={{ fontSize: "0.8rem" }}
                >
                  Purchase
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <Slider {...settings}>
        {plansToDisplay.map((plan) => (
          <div
            key={plan._id}
            className="card cloud-card"
            style={{
              margin: "20px",
              width: "250px",
              height: "100%",
              border: "none",
              padding: "10px",
            }}
          >
            <img
              src={`${process.env.REACT_APP_API_URL}${plan.plan_image}`}
              className="card-img-top"
              alt={plan.plan_name}
              style={{
                height: "250px",
                objectFit: "cover",
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
              }}
            />
            <div
              className="offer-badge"
              style={{
                position: "absolute",
                top: "10px",
                right: "20px",
                backgroundColor: "#FF6347",
                color: "white",
                padding: "5px 10px",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              {plan.offer_percentage}%
            </div>
            <div
              className="card-body"
              style={{ padding: "16px", backgroundColor: "#ffff" }}
            >
              <h5
                className="card-title"
                style={{ fontSize: "1rem", fontWeight: "bold" }}
              >
                {plan.plan_name}
              </h5>
              <p className="card-text" style={{ fontSize: "0.8rem" }}>
                <strong>Price:</strong> {plan.final_price}
              </p>
              <p className="card-text" style={{ fontSize: "0.8rem" }}>
                <strong>Validity:</strong> {plan.validity} {plan.validity_unit}
              </p>

              {/* Features */}
              <p
                className="mb-1 card-text"
                style={{ marginBottom: "5px", fontSize: "0.8rem" }}
              >
                <strong>Features:</strong>
              </p>
              <div
                style={{
                  maxHeight: showMoreFeatures[plan._id] ? "120px" : "50px",
                  overflowY: showMoreFeatures[plan._id] ? "scroll" : "hidden",
                  transition: "max-height 0.3s ease-in-out",
                }}
              >
                <ul
                  style={{
                    paddingLeft: "1rem",
                    listStyle: "none",
                    margin: "0",
                  }}
                >
                  {plan.features.split(",").map((feature, idx) => (
                    <li
                      key={idx}
                      style={{ marginBottom: "5px", fontSize: "0.8rem" }}
                    >
                      {feature.trim()}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button to toggle visibility of additional features */}
              <button
                onClick={() => toggleShowMoreFeatures(plan._id)}
                className="btn btn-link mt-1"
                style={{ marginTop: "10px", padding: "0", fontSize: "0.7rem" }} // Reduced size
              >
                {showMoreFeatures[plan._id] ? "View Less" : "View More"}
              </button>

              {/* One-line description with ellipses below features */}
              <p
                className="card-text"
                style={{
                  fontSize: "0.8rem",
                  whiteSpace: showMoreDescription[plan._id]
                    ? "normal"
                    : "nowrap",
                  overflow: showMoreDescription[plan._id]
                    ? "visible"
                    : "hidden",
                  textOverflow: showMoreDescription[plan._id]
                    ? "unset"
                    : "ellipsis",
                  maxWidth: "100%",
                  marginTop: "5px",
                }}
              >
                {plan.description}
              </p>

              {/* Button to toggle visibility of additional features */}
              <button
                onClick={() => toggleShowMoreDescription(plan._id)}
                className="btn btn-link mt-1"
                style={{ marginTop: "10px", padding: "0", fontSize: "0.7rem" }} // Reduced size
              >
                {showMoreDescription[plan._id] ? "View Less" : "View More"}
              </button>

              {/* Purchase Button */}
              <button
                onClick={() => handlePurchase(plan)}
                className="btn btn-primary ml-20"
                style={{ fontSize: "0.8rem" }}
              >
                Purchase
              </button>
            </div>
          </div>
        ))}
      </Slider>
    );
  };

  return (
    <div className="plan-purchase p-10">
      {message && (
        <div
          className="alert alert-info"
          style={{ position: "absolute", top: 20, right: 20, zIndex: 1000 }}
        >
          {message}
        </div>
      )}
      <h2 className="text-center">Purchase Plans</h2>
      <div className="text-center">
        <button
          className={`btn btn-outline-primary ${activeTab === "All Plans" ? "active" : ""
            }`}
          onClick={() => setActiveTab("All Plans")}
          style={{ margin: "5px" }}
        >
          All Plans
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`btn btn-outline-primary ${activeTab === category ? "active" : ""
              }`}
            onClick={() => setActiveTab(category)}
            style={{ margin: "5px" }}
          >
            {category}
          </button>
        ))}
      </div>

      {activeTab === "All Plans"
        ? renderSlider(plans)
        : renderSlider(
          plans.filter((plan) => plan.category_type === activeTab)
        )}
    </div>
  );
};

export default PlanPurchase;
