import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAmenityName, setNewAmenityName] = useState('');
  const [newAmenityIcon, setNewAmenityIcon] = useState(null);
  const [addErrorMessage, setAddErrorMessage] = useState('');
  const [editAmenityId, setEditAmenityId] = useState(null);
  const [editAmenityName, setEditAmenityName] = useState('');
  const [editAmenityIcon, setEditAmenityIcon] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const AccessToken = sessionStorage.getItem('AccessToken'); // Fetch the access token

  const fetchAmenities = async () => {
    try {
      const userId = sessionStorage.getItem('AccessToken');
  
      if (!userId) {
        console.error('User ID is not found in session storage.');
        setAddErrorMessage('User ID is missing.');
        return;
      }
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_amenities`,
        { user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${AccessToken}`,
          },
        }
      );
  
      if (Array.isArray(response.data.data)) {
        setAmenities(response.data.data);
      } else {
        console.error('Amenities response is not an array:', response.data);
        setAmenities([]);
      }
    } catch (error) {
      console.error('Error fetching amenities:', error);
      setAddErrorMessage('Failed to fetch amenities.');
      setAmenities([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAmenities();
  }, []);
  
  const handleAddAmenity = async () => {
    if (!newAmenityName || !newAmenityIcon) {
      setAddErrorMessage("Please provide both name and icon for the amenity.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", AccessToken);
    formData.append("amenity_name", newAmenityName);
    formData.append("amenity_icon", newAmenityIcon);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/cust_api/add_property_amenities`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newAmenity = await response.json();
        setAmenities((prevAmenities) => [...prevAmenities, newAmenity]);
        setShowModal(false);
        setNewAmenityName('');
        setNewAmenityIcon(null);
      } else {
        const errorResponse = await response.json();
        setAddErrorMessage(errorResponse.message || "Failed to add the amenity.");
      }
    } catch (error) {
      console.error("Error adding amenity:", error);
      setAddErrorMessage("Error adding amenity.");
    }
  };



  const handleDeleteAmenity = async (amenityId) => {
    console.log("Attempting to delete amenity with property_amenity_id:", amenityId);

    if (!amenityId) {
        console.error("Amenity ID is not defined.");
        return;
    }

    // Construct the URL for deletion
    const url = `${process.env.REACT_APP_API_URL}/cust_api/remove_property_amenity`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AccessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ property_amenity_id: amenityId }), // Pass the property_amenity_id in the request body
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);

        // Check if the status is 1 from the response
        if (data.status === 1) {
            console.log("Amenity deleted successfully");

            setAmenities((prevAmenities) => {
                const updatedAmenities = prevAmenities.filter(amenity => amenity._id !== amenityId);
                console.log("Updated amenities state:", updatedAmenities);
                return updatedAmenities;
            });
        } else {
            console.error("Failed to delete the amenity. Response message:", data.error || data.message);
            setErrorMessage(data.error || data.message || "Failed to delete the amenity.");
        }
    } catch (error) {
        console.error("Error deleting amenity:", error);
        setErrorMessage("Error deleting amenity.");
    }
};


  return (
    <div className="p-5">


     <div className='text-end'>
       {/* Floating "+" button for adding new amenity */}
       <button
        onClick={() => setShowModal(true)}
        className="btn btn-primary"
      >
        Add Amenity
      </button>
     </div>

      <h2 className="text-2xl font-bold mb-4">Manage Amenities</h2>

      {loading ? (
        <p>Loading amenities...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-4">

          
         {console.log("Rendering amenities after deletion:", amenities)}
        {amenities.length > 0 ? (
            amenities.map((amenity) => (
                <div key={amenity._id} className="flex items-center border rounded-lg p-3 hover:shadow-md transition duration-200">
                    <img
                        src={`${process.env.REACT_APP_API_URL}${amenity.amenity_icon}`}
                        alt={amenity.amenity_name}
                        className="w-8 h-8 object-cover mr-2"
                    />
                    <label className="text-lg">{amenity.amenity_name}</label>
                    <button onClick={() => handleDeleteAmenity(amenity._id)} className="ml-2 text-red-500 hover:text-red-600">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ))

          ) : (
            <p>No amenities available.</p>
          )}
        </div>
      )}


      {/* Modal for adding new amenity */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Amenity</h3>
            <form onSubmit={handleAddAmenity}>
              <div className="mb-4">
                <label className="block text-gray-700">Amenity Name</label>
                <input
                  type="text"
                  value={newAmenityName}
                  onChange={(e) => setNewAmenityName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Amenity Icon</label>
                <input
                  type="file"
                  onChange={(e) => setNewAmenityIcon(e.target.files[0])}
                  className="w-full px-3 py-2 border rounded-lg"
                  accept="image/*"
                  required
                />
              </div>
              {addErrorMessage && <p className="text-red-500">{addErrorMessage}</p>}
              <div className="flex justify-between">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg">Cancel</button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Add Amenity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Amenities;

