import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AboutUs = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true); // optional loading state
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAboutUs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cust_api/get-about-us`,
        );
        if (
          response.data.status === 1 &&
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          setContent(response.data.data[0].content);
        } else {
          setContent("<p>No content available.</p>");
        }
      } catch (err) {
        console.error("Error fetching About Us content:", err);
        setError("Failed to load content.");
        setContent("<p>Failed to load content.</p>");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="items-center justify-between hidden w-full p-4 px-20 text-black bg-gray-100 md:flex">
        <h1 className="text-xl">About Us</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            <Link
              to="/"
              className="text-gray-500 no-underline hover:no-underline hover:text-gray-700"
            >
              Home
            </Link>
            <span className="mx-1">›</span>
            <span className="font-medium my-text">Dashboard</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="p-6 md:px-20">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div
            className="prose text-gray-700 max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default AboutUs;
