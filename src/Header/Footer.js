import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
  FaLocationDot,
} from "react-icons/fa6";
import { GoChevronRight } from "react-icons/go";
import axios from "axios";
import { FaHouse } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

const Footer = () => {
  const history = useHistory();

  const handleNavigation = (path) => {
    history.push(path);
  };

  const handleCityClick = (cityName) => {
    window.scrollTo(0, 0);
    history.push(`/citywiseproperties/${cityName}`);
  };

  const [socialLinks, setSocialLinks] = useState({
    facebook: "#",
    youtube: "#",
    linkedin: "#",
    instagram: "#",
    appstore: "#",
    playstore: "#",
    twitter: "#",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cust_api/get_setting`,
        );
        if (response.data.status === 1 && response.data.data.length > 0) {
          const data = response.data.data[0];
          setSocialLinks({
            facebook: data.facebook || "#",
            youtube: data.youtube || "#",
            linkedin: data.linkedin || "#",
            instagram: data.instagram || "#",
            appstore: data.appstore || "#",
            playstore: data.playstore || "#",
            twitter: data.twitter || "#",
          });
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
      }
    };
    fetchSettings();
  }, []);

  const icons = [
    { icon: FaFacebookF, link: socialLinks.facebook },
    { icon: FaYoutube, link: socialLinks.youtube },
    { icon: FaLinkedinIn, link: socialLinks.linkedin },
    { icon: FaInstagram, link: socialLinks.instagram },
    { icon: FaXTwitter, link: socialLinks.twitter }, // Twitter not in API response
  ];

  return (
    <footer
      className="w-full py-3 overflow-x-hidden bg-white shadow-sm"
      style={{ boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 pb-1 border-b border-gray-300">
          {/* Company Info */}
          <div className="lg:col-span-5 flex items-center gap-5">
            {/* Logo */}
            <div className="flex-shrink-0 pr-6 border-r border-gray-300 flex items-center">
              <img
                src="/image/app.png"
                alt="NoWayBroker Logo"
                className="w-32 h-28 object-contain"
              />
            </div>

            {/* Description */}
            <p className="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed max-w-lg">
              NowayBroker is a zero-brokerage real estate platform connecting verified owners, buyers, tenants, and builders directly for a transparent and smarter property experience.
            </p>
          </div>

          {/* Company Links */}
          {/* Company Links */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left lg:col-span-2">
            <h3 className="text-gray-800 text-[16px] sm:text-[17px] font-semibold mb-1">
              COMPANY
            </h3>

            {/* Gold accent */}
            <div className="w-10 h-[2px] bg-[#c99a3d] mb-3"></div>

            <ul className="space-y-1.5 ml-0 pl-0 list-none">
              <li>
                <span
                  onClick={() => handleNavigation("/about-us")}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-[#c99a3d] text-[14px] sm:text-[15px] font-medium cursor-pointer transition-colors duration-200"
                >
                  <GoChevronRight
                    className="text-[#c99a3d] flex-shrink-0"
                    size={15}
                  />
                  <span>About</span>
                </span>
              </li>

              <li>
                <span
                  onClick={() => handleNavigation("/faq")}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-[#c99a3d] text-[14px] sm:text-[15px] font-medium cursor-pointer transition-colors duration-200"
                >
                  <GoChevronRight
                    className="text-[#c99a3d] flex-shrink-0"
                    size={15}
                  />
                  <span>FAQ</span>
                </span>
              </li>

              <li>
                <span
                  onClick={() => handleNavigation("/contact")}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-[#c99a3d] text-[14px] sm:text-[15px] font-medium cursor-pointer transition-colors duration-200"
                >
                  <GoChevronRight
                    className="text-[#c99a3d] flex-shrink-0"
                    size={15}
                  />
                  <span>Contact Us</span>
                </span>
              </li>

              <li>
                <span
                  onClick={() => handleNavigation("/nri")}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-[#c99a3d] text-[14px] sm:text-[15px] font-medium cursor-pointer transition-colors duration-200"
                >
                  <GoChevronRight
                    className="text-[#c99a3d] flex-shrink-0"
                    size={15}
                  />
                  <span>NRI Page</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Properties in India */}
          <div className="sm:col-span-2 lg:col-span-5">
            <h3 className="text-gray-800 text-[16px] sm:text-[17px] font-semibold mb-1">
              PROPERTIES IN INDIA
            </h3>

            {/* Gold accent */}
            <div className="w-10 h-[2px] bg-[#c99a3d] mb-3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-3">
              {[
                "Ahmedabad",
                "Bengaluru",
                "Chennai",
                "Delhi",
                "Hyderabad",
                "Kolkata",
                "Mumbai",
                "Pune",
              ].map((city) => (
                <button
                  key={city}
                  onClick={() => handleCityClick(city)}
                  className="flex items-center gap-1.5 min-w-0 text-left text-gray-500 hover:text-[#c99a3d] text-[14px] sm:text-[15px] font-medium transition-colors duration-200"
                >
                  <FaLocationDot
                    className="text-[#c99a3d] flex-shrink-0"
                    size={12}
                  />

                  <span className="break-words">Property in {city}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-start py-3 border-b border-gray-300">
          <div className="flex flex-col items-start pl-8">
            <div className="mb-2">
              <h4 className="text-gray-700 text-[16px] font-semibold">
                GET THE NOWAYBROKER APP
              </h4>

              <div className="w-10 h-[2px] bg-[#c99a3d] mt-1"></div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                // href={socialLinks.playstore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/image/abc.jpg"
                  alt="Google Play"
                  className="object-cover h-10 w-auto rounded-lg"
                />
              </a>

              <a
                // href={socialLinks.appstore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/image/apl.png"
                  alt="App Store"
                  className="object-cover h-10 w-auto rounded-lg"
                />
              </a>
            </div>
            <div className="flex items-center mt-2">
              <img
                src="/image/qrbar.jpg"
                alt="QR Code"
                className="object-cover h-16 w-16"
              />

              <p className="text-[14px] text-gray-600 ml-3 translate-y-2">
    Your property search, right at your fingertips
  </p>
            </div>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col items-start pt-0 ml-0 lg:ml-[160px]">
            <div className="mb-2">
              <h4 className="text-gray-700 text-[16px] font-semibold">
                CONTACT US
              </h4>

              <div className="w-10 h-[2px] bg-[#c99a3d] mt-1"></div>
            </div>

            <p className="text-gray-700 text-[16px] font-medium mb-1">
              Toll Free - +91 8600199570
            </p>

            <p className="text-gray-500 text-[14px] mb-3">
              9:30 AM to 6:30 PM (Mon-Sun)
            </p>

            <p className="text-gray-700 text-[16px] font-medium">
              Email - support@nowaybroker.com
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-start pt-0">
            <div className="mb-2">
              <h4 className="text-gray-700 text-[16px] font-semibold">
                FOLLOW US
              </h4>

              <div className="w-10 h-[2px] bg-[#c99a3d] mt-1"></div>
            </div>

            <div className="flex space-x-2">
              {icons.map(({ icon: Icon, link }, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2 text-center sm:text-left">
          {/* Copyright */}
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <img
              src="/image/app.png"
              alt="NoWayBroker Logo"
              className="w-9 sm:w-10 h-auto object-contain flex-shrink-0"
            />

            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              © 2026 NOWAYBROKER ALL RIGHTS RESERVED
            </span>
          </div>

          {/* Legal Links */}
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <Link
              to="/privacy-policy"
              className="text-xs sm:text-sm text-gray-500 no-underline hover:text-gray-700 hover:no-underline whitespace-nowrap"
            >
              PRIVACY POLICY
            </Link>

            <Link
              to="/terms-conditions"
              className="text-xs sm:text-sm text-gray-500 no-underline hover:text-gray-700 hover:no-underline whitespace-nowrap"
            >
              TERMS OF SERVICE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
