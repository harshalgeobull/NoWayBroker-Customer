import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import { useHistory } from "react-router-dom"; 

const InquiriesList = () => {
  const [inquiries, setInquiries] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();
  const userId = sessionStorage.getItem('AccessToken');

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/get_property_enquiries`,
          { user_id: userId },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.data && response.data.data) {
          setInquiries(response.data.data); // Set inquiries only if data exists
        } else {
          setInquiries([]); // Set inquiries as an empty array if no data found
          setError("No inquiries found.");
        }
      } catch (error) {
        setError("Error fetching inquiries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [userId]);

  const handleViewClick = (inquiryId) => {
    history.push(`/propertydetails/${inquiryId}`);
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="max-w-6xl container mt-28">
      <div className="p-4 bg-white border rounded shadow-lg">
        <h4 className="p-4 m-4 text-center bg-white border rounded shadow-sm h4">
          Inquiries List
        </h4>

        <div style={{ overflowY: 'auto', maxHeight: '70vh' }}>
          <table
            id="inquiriesTable"
            className="table table-striped table-bordered"
            style={{ width: "100%", borderCollapse: 'collapse', border: '2px solid #B0C4DE' }}
          >
            <thead style={{ backgroundColor: '#0056b3', color: 'white' }}>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Contact Number</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length > 0 ? (
                inquiries.map((inquiry, index) => (
                  <tr key={inquiry._id}>
                    <td>{index + 1}</td>
                    <td>{inquiry.name}</td>
                    <td>{inquiry.contact_number}</td>
                    <td>{inquiry.email}</td>
                    <td>{inquiry.message}</td>
                    <td>{inquiry.time_date}</td>
                    <td>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleViewClick(inquiry.property_id)}
                      >
                        View
                      </button>
                    </td> 
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No inquiries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InquiriesList;
