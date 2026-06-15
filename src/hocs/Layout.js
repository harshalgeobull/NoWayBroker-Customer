import React from "react";
import Footer from "../Header/Footer";
import HorizontalNav from "../Header/HorizontalNav";
import { useLocation } from "react-router-dom";

const Layout = (props) => {
  const location = useLocation();

  // Define base routes where Footer should be hidden
  const noFooterRoutes = ["/add_new_property", "/add_new_project", "/edit_property/", "/Editproject/"];

  // Check if the current path starts with any route in noFooterRoutes
  const hideFooter = noFooterRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      <HorizontalNav />
      {props.children}

      {/* Conditionally render Footer */}
      {!hideFooter && <Footer />}
    </>
  );
};

export default Layout;
