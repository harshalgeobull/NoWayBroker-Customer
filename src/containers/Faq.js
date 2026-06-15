import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Aboutus = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/cust_api/get-faqs`);
        if (response.data.status === 1) {
          // Content is in the data array
          const apiContent = response.data.data[0].content;
          setContent(apiContent);
        } else {
          setError('Failed to fetch content.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Faq</h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-xl"> {/* Updated container styling */}
          <div
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: content }} // Render HTML content
          />
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
