import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";
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
          `${process.env.REACT_APP_API_URL}/cust_api/get_setting`
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
      className="w-full py-6 overflow-x-hidden bg-white shadow-sm"
      style={{ boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="w-full max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-gray-300">
          {/* Company Info */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:col-span-2 lg:col-span-5">
            <img
              src="/image/app.png"
              alt="NoWayBroker Logo"
              className="object-cover w-20 h-16 mb-4 sm:w-24 sm:h-20"
            />
            <p className="text-gray-500 text-[15px] sm:text-[17px] leading-relaxed max-w-md">
              We offer full-stack services for all real estate needs,
              including home loans, pay rent, packers and movers, legal
              assistance, property valuation, and expert advice.
            </p>
          </div>

          {/* Company Links */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left lg:col-span-2">
            <h3 className="text-gray-700 text-[17px] sm:text-[18px] font-semibold mb-4 sm:ml-4">
              COMPANY
            </h3>
            <ul className="space-y-3">
              <li>
                <span
                  onClick={() => handleNavigation("/about-us")}
                  className="text-gray-500 hover:text-gray-700 text-[15px] sm:text-[17px] font-medium no-underline hover:no-underline cursor-pointer"
                >
                  About
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleNavigation("/faq")}
                  className="text-gray-500 hover:text-gray-700 text-[15px] sm:text-[17px] font-medium no-underline hover:no-underline cursor-pointer"
                >
                  FAQ
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleNavigation("/contact")}
                  className="text-gray-500 hover:text-gray-700 text-[15px] sm:text-[17px] font-medium no-underline hover:no-underline cursor-pointer"
                >
                  Contact Us
                </span>
              </li>

              <li>
                <span
                  onClick={() => handleNavigation("/nri")}
                  className="text-gray-500 hover:text-gray-700 text-[15px] sm:text-[17px] font-medium no-underline hover:no-underline cursor-pointer"
                >
                  NRIPage
                </span>
              </li>
            </ul>
          </div>

          {/* Properties in India */}
          <div className="sm:col-span-2 lg:col-span-5">
            <h3 className="text-gray-700 text-[17px] sm:text-[18px] font-semibold mb-4 text-center sm:text-left">
              PROPERTIES IN INDIA
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                "Delhi",
                "Mumbai",
                "Chennai",
                "Pune",
                "Noida",
                "Gurgaon",
              ].map((city) => (
                <button
                  key={city}
                  onClick={() => handleCityClick(city)}
                  className="text-left text-gray-500 hover:text-gray-700 text-[15px] sm:text-[17px] font-medium hover:no-underline no-underline break-words"
                >
                  Property in {city}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Middle Section */}
        <div className="flex flex-col items-center justify-between py-8 border-b border-gray-300 md:flex-row">
          <div className="flex flex-col items-center mb-6 md:items-start md:mb-0">
            <h4 className="text-gray-700 text-[18px] font-semibold mb-4">
              DOWNLOAD MOBILE APP
            </h4>
            <div className="flex space-x-4">
              <a
                // href={socialLinks.playstore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/image/abc.jpg"
                  alt="Google Play"
                  className="object-cover h-12 rounded-lg"
                />
              </a>
              <a
                //href={socialLinks.appstore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/image/apl.png"
                  alt="App Store"
                  className="object-cover h-12 rounded-lg"
                />
              </a>
            </div>
            <div className="flex items-center mb-6 md:mb-0">
              <img
                src="/image/qrbar.jpg"
                alt="QR Code"
                className="object-cover h-24"
              />
              <p className="text-[17px] text-gray-600 ml-4 break-words">
                Scan the QR code to download the app.
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-gray-700 text-[18px] font-semibold mb-4">
              WE IN SOCIAL
            </h4>
            <div className="flex space-x-4">
              {icons.map(({ icon: Icon, link }, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 py-4 text-center sm:flex-row sm:text-left sm:gap-2">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <img src="/image/app.png" alt="NoWayBroker Logo" className="w-9 sm:w-11" />
            <span className="text-xs sm:text-sm text-gray-500">
              © 2026 NOWAYBROKER ALL RIGHTS RESERVED
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <Link
              to="/privacy-policy"
              className="text-xs text-gray-500 no-underline hover:text-gray-700 hover:no-underline whitespace-nowrap"
            >
              PRIVACY POLICY
            </Link>
            <Link
              to="/terms-conditions"
              className="text-xs text-gray-500 no-underline hover:text-gray-700 hover:no-underline whitespace-nowrap"
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