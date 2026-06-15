import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const CookiePolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="hidden md:flex w-full bg-gray-100 text-black p-4 justify-between items-center px-20">
        <h1 className="text-xl">Cookies and Policies</h1>
        <div className="flex items-center gap-4">
          <div className="text-gray-500 text-sm">
            <Link
              to="/"
              className="text-gray-500 no-underline hover:no-underline hover:text-gray-700"
            >
              Home
            </Link>
            <span className="mx-1">›</span>
            <span className="my-text font-medium">Dashboard</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CookiePolicy;
