import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faPlus } from '@fortawesome/free-solid-svg-icons'; 

const UpdateDeveloper = () => {
  const [developerData, setDeveloperData] = useState(null);
  const [inquiryData, setInquiryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [inquiryError, setInquiryError] = useState(false);
  const history = useHistory();
  const [developerId, setDeveloperId] = useState(null);

  // Check if the user is logged in and fetch developer profile
  useEffect(() => {
    const accessToken = sessionStorage.getItem('AccessToken');
    if (!accessToken) {
      history.push('/login');
      return;
    }

    // Fetch developer profile
    const fetchDeveloperProfile = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/cust_api/get_profile`, { user_id: accessToken });
        
        if (response.data.status === 1) {
          setDeveloperData(response.data.developer_data); // Set developerData

          // Only set developerId if developer_data is not empty
          if (response.data.developer_data.length > 0) {
            setDeveloperId(response.data.developer_data[0]._id); 
          }
        } else {
          setError(true); // Only set error if status is not 1
        }
      } catch (err) {
        console.error('Error fetching developer profile:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperProfile();
  }, [history]);

  // Fetch developer enquiries when developerId is set
  useEffect(() => {
    if (!developerId) return; // Avoid API call if developerId is not set

    const fetchDeveloperEnquiries = async () => {
      const formData = new FormData();
      formData.append('developer_id', developerId);

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/cust_api/get_developer_enquiry`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
          },
        });
        
        if (response.data && response.data.data.length > 0) {
          setInquiryData(response.data.data);
        } else {
          setInquiryError(true);
        }
      } catch (err) {
        console.error('Error fetching developer enquiries:', err);
        setInquiryError(true);
      }
    };

    fetchDeveloperEnquiries();
  }, [developerId]);

  // Function to create developer data
  const handleAddProfile = () => {
    history.push('/add-developer');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;

  return (
    <div className="flex flex-col items-center p-5">
      <h2 className="text-3xl font-bold mb-5">Developer Profile</h2>
      <div className="flex flex-wrap justify-center max-w-4xl w-full">
        {developerData && Array.isArray(developerData) && developerData.length > 0 ? (
          developerData.map(developer => (
            <div key={developer._id} className="flex items-center bg-gray-100 p-5 m-3 shadow-lg w-full">
              <img
                src={`${process.env.REACT_APP_API_URL}${developer.brand_img}`} 
                alt={`${developer.developer_name} Logo`}
                className="w-32 h-32 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{developer.developer_name}</h3>
                <p><strong>Designation:</strong> {developer.designation}</p>
                <p><strong>Address:</strong> {developer.address}</p>
                <p><strong>Status:</strong> {developer.approval_status}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-full">
            <p>No developer data available.</p>
            <button 
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" 
              onClick={handleAddProfile}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Profile
            </button>
          </div>
        )}
      </div>

      {/* Developer Enquiries */}
      <div className="mt-5 w-full">
        <h3 className='text-2xl font-bold text-center'>Developer Enquiries</h3>
        {inquiryData.length > 0 ? (
          <table className="min-w-full bg-white mt-3 border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Contact Number</th>
                <th className="border px-4 py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {inquiryData.map((inquiry, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{inquiry.name}</td>
                  <td className="border px-4 py-2">{inquiry.email}</td>
                  <td className="border px-4 py-2">{inquiry.contact_number}</td>
                  <td className="border px-4 py-2">{inquiry.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          inquiryError ? <p>No developer enquiries found.</p> : <p>Loading enquiries...</p>
        )}
      </div>
    </div>
  );
};

export default UpdateDeveloper;
