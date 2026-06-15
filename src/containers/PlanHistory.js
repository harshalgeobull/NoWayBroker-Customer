import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import { useHistory } from "react-router-dom";

const PlanHistory = () => {
  const [planHistory, setPlanHistory] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null); // State to hold selected plan details
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const history = useHistory(); // Initialize navigate for redirecting

  const fetchPlanPurchaseHistory = async () => {
    const storedUserId = sessionStorage.getItem("AccessToken"); // Ensure the user ID is stored correctly
    console.log("Fetching Plan Purchase History for User ID:", storedUserId);

    if (!storedUserId) return; // Avoid fetching if userId is not set

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/Plan_purchased_History`,
        {
          user_id: storedUserId,
        },
      );

      console.log("Plan Purchase History Response:", response.data);

      if (response.data && response.data.data) {
        setPlanHistory(response.data.data);
        console.log("Plan History Set:", response.data.data);
      } else {
        console.warn("Plan history data not found in response.");
      }
    } catch (error) {
      console.error("Error fetching plan purchase history:", error.message);
    }
  };

  useEffect(() => {
    fetchPlanPurchaseHistory(); // Fetch plan purchase history using the userId from session storage
  }, []); // No dependency on userId, it fetches directly from session storage

  // Function to handle view click and open the modal
  const handleViewClick = (planId) => {
    const plan = planHistory.find((p) => p._id === planId); // Find the selected plan by ID
    if (plan) {
      setSelectedPlan(plan); // Set the selected plan details
      setShowModal(true); // Show the modal
    }
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null); // Clear selected plan when closing the modal
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center">Your Plan Purchase History</h2>
        <button
          className="btn btn-primary"
          onClick={() => history.push("/plan")}
        >
          Go to Plans
        </button>
      </div>
      {planHistory.length > 0 ? (
        <div style={{ overflowY: "auto", maxHeight: "70vh" }}>
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Plan Name</th>
                <th>Purchase Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {planHistory.map((plan, index) => (
                <tr key={index}>
                  <td>{plan.plan_name}</td>
                  <td>{plan.plan_purchase_date}</td>
                  <td>
                    <span
                      className={`font-weight-bold ${plan.plan_status === "Active" ? "text-success" : "text-danger"}`}
                    >
                      {plan.plan_status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleViewClick(plan._id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted text-center">
          No plan purchase history found.
        </p>
      )}

      {/* Modal for Plan Details */}
      {selectedPlan && (
        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          style={{ display: showModal ? "block" : "none" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedPlan.plan_name} Details
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Plan Name:</strong> {selectedPlan.plan_name}
                </p>
                <p>
                  <strong>Payment Mode:</strong> {selectedPlan.payment_mode}
                </p>
                <p>
                  <strong> Transaction Status:</strong>{" "}
                  <span
                    className={
                      selectedPlan.plan_status === "Active"
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {selectedPlan.transaction_status}
                  </span>
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      selectedPlan.plan_status === "Active"
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {selectedPlan.plan_status}
                  </span>
                </p>
                <p>
                  <strong>Purchase Date:</strong>{" "}
                  {selectedPlan.plan_purchase_date}
                </p>
                <p>
                  <strong>Plan Expiry Date:</strong>{" "}
                  {selectedPlan.plan_expiry_date}
                </p>
                <p>
                  <strong>Category:</strong> {selectedPlan.category_type}
                </p>
                <p>
                  <strong>No of Units:</strong> {selectedPlan.no_of_units}
                </p>

                {/* Add any other details you want to show */}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanHistory;

// // PlanHistory.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const PlanHistory = () => {
//     const [planHistory, setPlanHistory] = useState([]);

//     const fetchPlanPurchaseHistory = async () => {
//         const storedUserId = sessionStorage.getItem("AccessToken"); // Ensure the user ID is stored correctly
//         console.log("Fetching Plan Purchase History for User ID:", storedUserId);

//         if (!storedUserId) return; // Avoid fetching if userId is not set

//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/cust_api/Plan_purchased_History`, {
//                 user_id: storedUserId,
//             });

//             console.log("Plan Purchase History Response:", response.data);

//             if (response.data && response.data.data) {
//                 setPlanHistory(response.data.data);
//                 console.log("Plan History Set:", response.data.data);
//             } else {
//                 console.warn("Plan history data not found in response.");
//             }
//         } catch (error) {
//             console.error("Error fetching plan purchase history:", error.message);
//         }
//     };

//     useEffect(() => {
//         fetchPlanPurchaseHistory(); // Fetch plan purchase history using the userId from session storage
//     }, []); // No dependency on userId, it fetches directly from session storage

//     return (
//         <div className="max-w-7xl mx-auto p-6">
//             <h2 className="text-4xl font-bold my-text mb-6 text-center">Your Plan Purchase History</h2>
//             {planHistory.length > 0 ? (
//                 <div className="flex flex-col space-y-4">
//                     {planHistory.map((plan, index) => (
//                         <div key={index} className="p-4 border-l-4 border-rose-500 bg-gradient-to-br from-rose-200 to-white rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105">
//                             <h3 className="text-xl font-bold text-rose-700">{plan.plan_name}</h3>
//                             <p className="text-gray-600 mt-1">Purchase Date: <span className="font-medium">{plan.plan_purchase_date}</span></p>
//                             <p className="text-gray-600 mt-1">Status: <span className={`font-medium ${plan.plan_status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{plan.plan_status}</span></p>
//                             <div className="mt-2">
//                                 <button className="my-bg text-white px-3 py-1 rounded-md hover:my-bg transition duration-150">
//                                     View Details
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p className="text-gray-600 text-center py-4">No plan purchase history found.</p>
//             )}
//         </div>
//     );
// };

// export default PlanHistory;
