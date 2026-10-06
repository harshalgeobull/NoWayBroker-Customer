import { IoCloseCircleOutline } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";

const Subscription = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [myPlans, setMyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = sessionStorage.getItem("accessToken");
  const [currentPageAll, setCurrentPageAll] = useState(1);
  const [currentPageMy, setCurrentPageMy] = useState(1);
  const [isPlanAlertModalOpen, setIsPlanAlertModalOpen] = useState(false);
  const itemsPerPage = 10;
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isAllPlanModalOpen, setIsAllPlanModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPageAll, currentPageMy]);

  useEffect(() => {
    if (isPlanModalOpen || isAllPlanModalOpen || isPlanAlertModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPlanModalOpen, isAllPlanModalOpen, isPlanAlertModalOpen]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cust_api/get_subscription_plans`,
        );
        if (response.data && response.data.data) {
          setAllPlans(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Fetch user-purchased plans
  const fetchMyPlans = async () => {
    try {
      const formData = new FormData();
      formData.append("user_id", user_id);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/Plan_purchased_History`,
        formData,
      );
      if (response.data?.data) {
        setMyPlans(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch plan history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPlans();
  }, []);

  if (loading) return <div>Loading...</div>;

  // const handlePlanPurchase = async (plan, user_id) => {
  //   try {
  //     const today = moment();
  //     const expiryDate = moment().add(parseInt(plan.validity), plan.validity_unit.toLowerCase());

  //     const formData = new FormData();
  //     formData.append("user_id", user_id);
  //     formData.append("plan_auto_id", plan._id);
  //     formData.append("plan_name", plan.plan_name);
  //     formData.append("category_type", plan.category_type);
  //     formData.append("no_of_units", plan.no_of_units);
  //     formData.append("payment_mode", "Online");
  //     formData.append("transaction_id", uuidv4());
  //     formData.append("transaction_status", "Success");
  //     formData.append("plan_status", "Active");
  //     formData.append("plan_purchase_date", today.format("YYYY-MM-DD"));
  //     formData.append("plan_expiry_date", expiryDate.format("YYYY-MM-DD"));

  //     const response = await axios.post(`${process.env.REACT_APP_API_URL}/cust_api/purchase_plan`, formData);

  //     if (response.data.status === 1) {
  //       toast.success("Plan purchased successfully!");
  //     } else {
  //       toast.error(" Failed: " + (response.data.message || "Try again."));
  //     }
  //   } catch (error) {
  //     console.error("Error purchasing plan:", error);
  //     toast.error("Something went wrong. Please try again.");
  //   }
  // };

 const loadCashfreeScript = () => {
  return new Promise((resolve) => {
    if (window.Cashfree) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

 const handlePlanPurchase = async (plan, user_id) => {
  try {
    // Step 1: Load Cashfree SDK
    const loaded = await loadCashfreeScript();

    if (!loaded) {
      toast.error(
        "Cashfree SDK failed to load. Check your internet connection."
      );
      return;
    }

    // Step 2: Create Cashfree order through backend
    const orderResponse = await axios.post(
      `${BASE_URL}/cust_api/create_razorpay_order`,
      {
        user_id: user_id,
        plan_auto_id: plan._id,
      }
    );

    console.log("Cashfree order response:", orderResponse.data);

    if (orderResponse.data.status !== 1) {
      toast.error(
        orderResponse.data.msg || "Failed to create payment order"
      );
      return;
    }

    const {
      payment_session_id,
      order_id,
    } = orderResponse.data;

    if (!payment_session_id || !order_id) {
      toast.error("Payment session was not created.");
      return;
    }

    // Step 3: Initialize Cashfree
    const cashfree = window.Cashfree({
      mode: "sandbox",
    });

    // Step 4: Open Cashfree payment popup
    const result = await cashfree.checkout({
      paymentSessionId: payment_session_id,
      redirectTarget: "_modal",
    });

    console.log("Cashfree checkout result:", result);

    // Step 5: Verify payment through backend
    const verifyRes = await axios.post(
      `${BASE_URL}/cust_api/verify_payment`,
      {
        cashfree_order_id: order_id,
      }
    );

    console.log("Cashfree verification response:", verifyRes.data);

    if (verifyRes.data.status !== 1) {
      toast.error(
        verifyRes.data.msg || "Payment verification failed"
      );
      return;
    }

    // Step 6: Save plan purchase in DB
    const today = moment();

    const expiryDate = moment().add(
      parseInt(plan.validity),
      plan.validity_unit.toLowerCase()
    );

    const formData = new FormData();

    formData.append("user_id", user_id);
    formData.append("plan_auto_id", plan._id);
    formData.append("plan_name", plan.plan_name);
    formData.append("category_type", plan.category_type);
    formData.append("no_of_units", plan.no_of_units);

    // IMPORTANT: Changed from Razorpay to Cashfree
    formData.append("payment_mode", "Cashfree");

    formData.append(
      "transaction_id",
      verifyRes.data.transaction_id
    );

    formData.append(
      "transaction_status",
      verifyRes.data.transaction_status
    );

    formData.append(
      "plan_purchase_date",
      today.format("YYYY-MM-DD")
    );

    formData.append(
      "plan_expiry_date",
      expiryDate.format("YYYY-MM-DD")
    );

    formData.append("plan_status", "Active");

    // Step 7: Save purchase
    const purchaseRes = await axios.post(
      `${BASE_URL}/cust_api/purchase_plan`,
      formData
    );

    console.log("Purchase response:", purchaseRes.data);

    if (purchaseRes.data.status === 1) {
      toast.success("Plan purchased successfully!");

      // Refresh user's plans
      fetchMyPlans();
    } else {
      toast.error(
        "Purchase failed: " +
          (purchaseRes.data.message || "Try again.")
      );
    }
  } catch (error) {
    console.error("Cashfree payment error:", error);

    console.error(
      "Cashfree error response:",
      error.response?.data
    );

    toast.error(
      error.response?.data?.msg ||
        "Payment failed. Please try again."
    );
  }
};

  const totalPagesForAllPlans = Math.ceil(allPlans.length / itemsPerPage);
  const totalPagesForMyPlans = Math.ceil(myPlans.length / itemsPerPage);

  const plansToShow = activeTab === "all" ? allPlans : myPlans;
  const totalPages =
    activeTab === "all" ? totalPagesForAllPlans : totalPagesForMyPlans;

  const paginatedPlans =
    activeTab === "all"
      ? allPlans.slice(
          (currentPageAll - 1) * itemsPerPage,
          currentPageAll * itemsPerPage,
        )
      : myPlans.slice(
          (currentPageMy - 1) * itemsPerPage,
          currentPageMy * itemsPerPage,
        );

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "all") {
      setCurrentPageAll(1);
    } else {
      setCurrentPageMy(1);
      fetchMyPlans();
    }
  };

  const checkPlanAndPurchase = async (plan, user_id) => {
    const userId = sessionStorage.getItem("accessToken");

    try {
      const formData = new FormData();
      formData.append("user_id", userId);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/Plan_purchased_History`,
        formData,
      );

      const planHistory = res.data?.data || [];
      let isCategoryPlanActive = false;

      for (let item of planHistory) {
        if (
          item.category_type === plan.category_type &&
          item.plan_status === "Active"
        ) {
          isCategoryPlanActive = true;
          break;
        }
      }

      if (isCategoryPlanActive) {
        setSelectedPlan(plan);
        setIsPlanAlertModalOpen(true);
      } else {
        handlePlanPurchase(plan, user_id);
      }
    } catch (error) {
      console.error("Error fetching plan history:", error);
    }
  };

  return (
    <div className="max-w-6xl p-3 mx-auto bg-white rounded-2xl">
      <h2 className="mb-4 text-2xl font-semibold">Subscription</h2>

      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "all" ? "my-text border-b-2 border-rose-600" : "text-gray-500"}`}
          onClick={() => handleTabClick("all")}
        >
          All Plans
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "my" ? "my-text border-b-2 border-rose-600" : "text-gray-500"}`}
          onClick={() => handleTabClick("my")}
        >
          My Plans
        </button>
      </div>

      {paginatedPlans.length > 0 ? (
        <>
          {paginatedPlans.map((plan) => {
            const isExpired =
              activeTab === "my" && plan.plan_status === "Expired";

            return (
              <div
                key={plan._id}
                className={`relative border rounded-2xl shadow-md p-4 flex flex-col md:flex-row items-center md:items-start gap-4 mb-4 ${
                  isExpired
                    ? "bg-gray-100 opacity-60 cursor-not-allowed"
                    : "bg-white"
                }`}
              >
                {/* EXPIRED Watermark */}
                {isExpired && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <div className="text-red-700 text-[60px] font-extrabold opacity-10 transform rotate-[-30deg]">
                      EXPIRED
                    </div>
                  </div>
                )}

                <img
                  src={`${BASE_URL}${plan.plan_image}` || plan.plan_image}
                  alt={plan.plan_name}
                  className="object-cover w-full h-48 md:w-48 rounded-2xl"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {plan.plan_name}
                  </h3>
                  <div className="flex items-center mt-1 space-x-2">
                    {activeTab === "my" && (
                      <span
                        className={`${
                          isExpired
                            ? "bg-gray-300 text-gray-600"
                            : "bg-green-200 text-green-700"
                        } text-xs font-semibold px-2 py-1 rounded-md`}
                      >
                        {plan.plan_status}
                      </span>
                    )}
                    {/* <span className="text-sm text-gray-500">Plan ID: {plan._id || plan.id}</span> */}
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-base font-medium text-gray-500">
                      <span>Price</span>
                      <span>Validity</span>
                      {activeTab !== "all" && <span>Expiry Date</span>}
                    </div>
                    <div className="flex justify-between mt-1 text-base font-semibold text-gray-800">
                      <span>₹{plan.final_price}</span>
                      <span>
                        {plan.validity} {plan.validity_unit}
                      </span>
                      {activeTab !== "all" && (
                        <span>
                          {new Date(plan.plan_expiry_date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    {activeTab === "all" ? (
                      <>
                        <button
                          className="px-4 py-2 mt-3 mr-2 text-sm text-white bg-green-400 rounded-lg sm:px-6"
                          onClick={() => checkPlanAndPurchase(plan, user_id)}
                        >
                          Pay Now
                        </button>

                        {/* Custom Modal Block */}
                        {isPlanAlertModalOpen && selectedPlan && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-10">
                            <div className="w-full max-w-sm p-4 bg-white rounded-2xl md:p-8">
                              <h2 className="mb-4 text-lg font-semibold">
                                You already purchased this plan.
                              </h2>
                              <p className="mb-6">
                                Do you want to purchase it again?
                              </p>
                              <div className="flex justify-between">
                                <button
                                  onClick={() => {
                                    handlePlanPurchase(selectedPlan, user_id);
                                    setIsPlanAlertModalOpen(false);
                                  }}
                                  className="px-4 py-2 text-white bg-green-500 rounded"
                                >
                                  Purchase Again
                                </button>
                                <button
                                  onClick={() => setIsPlanAlertModalOpen(false)}
                                  className="px-4 py-2 text-black bg-gray-300 rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          className="px-4 py-2 mt-3 text-sm text-white bg-green-400 rounded-lg sm:px-6"
                          onClick={() => {
                            setSelectedPlan(plan);
                            setIsAllPlanModalOpen(true);
                          }}
                        >
                          View More Details
                        </button>
                      </>
                    ) : (
                      <button
                        disabled={isExpired}
                        className={`py-2 px-4 sm:px-6 text-sm rounded-lg mt-3 ${
                          isExpired
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-green-400 text-white"
                        }`}
                        onClick={() => {
                          if (!isExpired) {
                            setSelectedPlan(plan);
                            setIsPlanModalOpen(true);
                          }
                        }}
                      >
                        View More Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-4 space-x-3">
              <button
                className={`px-3 py-2 border rounded-full ${(activeTab === "all" && currentPageAll === 1) || (activeTab === "my" && currentPageMy === 1) ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
                onClick={() =>
                  activeTab === "all"
                    ? setCurrentPageAll((prev) => Math.max(prev - 1, 1))
                    : setCurrentPageMy((prev) => Math.max(prev - 1, 1))
                }
                disabled={
                  (activeTab === "all" && currentPageAll === 1) ||
                  (activeTab === "my" && currentPageMy === 1)
                }
              >
                &lt;
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-medium ${(activeTab === "all" && currentPageAll === index + 1) || (activeTab === "my" && currentPageMy === index + 1) ? "my-border my-text" : "text-gray-500 hover:bg-gray-100"}`}
                  onClick={() =>
                    activeTab === "all"
                      ? setCurrentPageAll(index + 1)
                      : setCurrentPageMy(index + 1)
                  }
                >
                  {index + 1}
                </button>
              ))}

              <button
                className={`px-3 py-2 border rounded-full ${(activeTab === "all" && currentPageAll === totalPages) || (activeTab === "my" && currentPageMy === totalPages) ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
                onClick={() =>
                  activeTab === "all"
                    ? setCurrentPageAll((prev) =>
                        Math.min(prev + 1, totalPages),
                      )
                    : setCurrentPageMy((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={
                  (activeTab === "all" && currentPageAll === totalPages) ||
                  (activeTab === "my" && currentPageMy === totalPages)
                }
              >
                &gt;
              </button>
            </div>
          )}
        </>
      ) : (
        <div>No Plans Available</div>
      )}

      {isPlanModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl w-[50%] max-w-lg shadow-2xl relative">
            <h2 className="mb-4 text-2xl font-bold text-center">
              Plan Details
            </h2>

            <img
              src={`${BASE_URL}/${selectedPlan.plan_image}`}
              alt={selectedPlan.plan_name}
              className="object-cover w-full h-40 mb-4 rounded-md"
            />

            <div className="space-y-2 text-sm">
              <p className="mb-0">
                <strong>Plan Name:</strong> {selectedPlan.plan_name}
              </p>
              <p>
                <strong>Price:</strong> ₹{selectedPlan.plan_price}
              </p>
              <p>
                <strong>Offer:</strong> {selectedPlan.offer_percentage}%
              </p>
              <p>
                <strong>Final Price:</strong> ₹{selectedPlan.final_price}
              </p>
              <p>
                <strong>Validity:</strong> {selectedPlan.validity}{" "}
                {selectedPlan.category_type}
              </p>
              <p>
                <strong>Category Type:</strong> {selectedPlan.category_type}
              </p>
              <p>
                <strong>No. of Units:</strong> {selectedPlan.no_of_units}
              </p>
              <p>
                <strong>Features:</strong> {selectedPlan.features}
              </p>
              <p>
                <strong>Description:</strong> {selectedPlan.description}
              </p>
              <p>
                <strong>Status:</strong> {selectedPlan.plan_status}
              </p>
            </div>

            <button
              className="absolute text-xl font-bold top-3 right-4 text-black-500"
              onClick={() => setIsPlanModalOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {isAllPlanModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl w-[50%] max-w-lg shadow-2xl relative">
            <h2 className="mb-4 text-2xl font-bold text-center">
              Plan Details
            </h2>

            <img
              src={
                `${BASE_URL}${selectedPlan.plan_image}` ||
                selectedPlan.plan_image
              }
              alt={selectedPlan.plan_name}
              className="object-cover w-full h-40 mb-4 rounded-md"
            />

            <div className="space-y-2 text-sm">
              <p className="mb-0">
                <strong>Plan Name:</strong> {selectedPlan.plan_name}
              </p>
              <p>
                <strong>Price:</strong> ₹{selectedPlan.plan_price}
              </p>
              <p>
                <strong>Offer:</strong> {selectedPlan.offer_percentage}%
              </p>
              <p>
                <strong>Final Price:</strong> ₹{selectedPlan.final_price}
              </p>
              <p>
                <strong>Validity:</strong> {selectedPlan.validity}{" "}
                {selectedPlan.validity_unit}
              </p>
              <p>
                <strong>Category Type:</strong> {selectedPlan.category_type}
              </p>
              <p>
                <strong>No. of Units:</strong> {selectedPlan.no_of_units}
              </p>
              <p>
                <strong>Features:</strong> {selectedPlan.features}
              </p>
              <p>
                <strong>Description:</strong> {selectedPlan.description}
              </p>
            </div>

            <button
              className="absolute text-xl font-bold top-3 right-4 text-black-500"
              onClick={() => setIsAllPlanModalOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
