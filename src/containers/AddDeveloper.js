import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';

const AddDeveloper = () => {
  const [developerName, setDeveloperName] = useState('');
  const [designation, setDesignation] = useState('');
  const [address, setAddress] = useState('');
  const [brandImg, setBrandImg] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '', show: false });
  const history = useHistory();

  // Check if user is logged in and extract user ID
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('AccessToken');
    if (!token) {
      history.push('/login');
    } else {
      setUserId(token); // Assuming user ID is part of the token
    }
  }, [history]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (!developerName || !designation || !address || !brandImg) {
      setAlert({ message: 'All fields are required, including the image.', type: 'danger', show: true });
      setTimeout(() => setAlert({ ...alert, show: false }), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('developer_name', developerName);
    formData.append('designation', designation);
    formData.append('address', address);
    formData.append('brand_img', brandImg); // File upload
    formData.append('user_id', userId); // Assuming userId is part of the token

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/cust_api/add_developer`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.status === 1) {
        setAlert({ message: 'Developer added successfully!', type: 'success', show: true });
        setTimeout(() => {
          setAlert({ ...alert, show: false });
          history.push('/updatedeveloper'); // Navigate to the UpdateDeveloper page
        }, 2000);
      } else {
        setAlert({ message: 'Failed to add developer.', type: 'danger', show: true });
        setTimeout(() => setAlert({ ...alert, show: false }), 3000);
      }
    } catch (err) {
      console.error('Error adding developer:', err);
      setAlert({ message: 'Error adding developer. Please try again.', type: 'danger', show: true });
      setTimeout(() => setAlert({ ...alert, show: false }), 3000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-700">Add Developer</h2>

        {/* Alert */}
        {alert.show && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
            {alert.message}
            <button type="button" className="close" onClick={() => setAlert({ ...alert, show: false })}>
              <span>&times;</span>
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Developer Name:</label>
            <input
              type="text"
              value={developerName}
              onChange={(e) => setDeveloperName(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Designation:</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Brand Image:</label>
            <input
              type="file"
              onChange={(e) => setBrandImg(e.target.files[0])}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Add Profile
          </button>
          <Link to="/updatedeveloper">
            <button className="w-full py-2 mt-4 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200">
              Cancel
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AddDeveloper;
