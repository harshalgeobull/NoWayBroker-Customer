import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Terms = () => {
  const [termsContent, setTermsContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cust_api/get-term-conditions`,
        );
        console.log("API response:", response.data);

        if (response.status === 200 && response.data.status === 1) {
          const content = response.data.data?.[0]?.content;
          console.log("Extracted content:", content);
          setTermsContent(content);
        } else {
          setError("Terms and conditions content is not available.");
        }
      } catch (err) {
        console.error("Error fetching terms:", err);
        setError("Failed to load terms and conditions.");
      }
    };

    fetchTerms();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <nav className="items-center justify-between hidden w-full p-4 px-20 text-black bg-gray-100 md:flex">
        <h1 className="text-xl font-semibold">Terms and Conditions</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="mx-1">›</span>
            <span className="font-medium my-text">Dashboard</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : termsContent ? (
        <div
          className="leading-relaxed text-gray-800"
          dangerouslySetInnerHTML={{ __html: termsContent }}
        />
      ) : (
        <p className="text-gray-500">Loading terms and conditions...</p>
      )}
    </div>
  );
};

export default Terms;
