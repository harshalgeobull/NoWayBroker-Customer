import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link component for navigation

const MyTour = () => {
  const [tourSchedules, setTourSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourSchedules = async () => {
      try {
        const token = sessionStorage.getItem("AccessToken"); // Assuming access token is stored in localStorage
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/cust_api/get_virtual_tour_schedule`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: token })
          }
        );

        const data = await response.json();

        // console.log(data);
        if (data.status === 1) {
          setTourSchedules(data.data);
        } else {
          setError(data.msg);
        }
      } catch (err) {
        setError("No Schedules");
      } finally {
        setLoading(false);
      }
    };

    fetchTourSchedules();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="container d-flex justify-content-center align-items-center">
        <div className="w-100">
          <h1 className="text-center mb-4">Scheduled for Me</h1>
          {/* Table heading only when there is an error */}
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Schedule Date</th>
                <th>Timeslot</th>
                <th>Status</th>
                <th>Property Name</th>
                <th>Property Address</th>
                <th>Owner</th>
                <th>User</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8" className="text-center">
                  <span className="text-danger">{error}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100">
        <h1 className="text-center mb-4">My Tour Schedule</h1>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Schedule Date</th>
              <th>Timeslot</th>
              <th>Status</th>
              <th>Property Name</th>
              <th>Property Address</th>
              <th>Owner</th>
              <th>User</th>
              <th>Action</th> {/* New column for the button */}
            </tr>
          </thead>
          <tbody>
            {tourSchedules.map((tour) => (
              <tr key={tour._id}>
                <td>{tour.schedule_date}</td>
                <td>{tour.timeslot}</td>
                <td>{tour.status}</td>
                <td>{tour.property_details.property_name}</td>
                <td>{tour.property_details.address}</td>
                <td>{tour.property_owner_details.full_name}</td>
                <td>{tour.user_details.full_name}</td>
                <td>
                  <Link to={`/download`}>
                    <button className="btn btn-secondary">Join</button>{" "}
                    {/* Gray button */}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyTour;
