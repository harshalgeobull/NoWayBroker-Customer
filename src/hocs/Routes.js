import React from "react";
import { useEffect } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "../containers/Home";
import About from "../containers/About";
import Listing from "../containers/Listing";
import Login from "../containers/Login";
import Signup from "../containers/Signup";
import Contact from "../containers/Contact";
import Profile from "../containers/Profile";
import NotFound from "../containers/NotFound";
import PostProperty from "../containers/PostProperty";
import PropertyDashboard from "../containers/PropertyDashboard";
import Offer from "../containers/Offer";
import AllProperty from "../containers/AllProperty";
import Detail from "../containers/Detail";
import AllDeveloper from "../containers/AllDeveloper";
import SavedSearch from "../containers/SavedSearch";
import PostedProperties from "../containers/PostedProperties";
import ChangePassword from "../containers/ChangePassword";
import Download from "../containers/Download";
import DownloadHouzzaShots from "../containers/DownloadHouzzaShots";
import City_Wise from "../containers/City_Wise";
import SpotliteDetail from "../containers/SpotliteDetail";
import PDetails from "../containers/PDetails";
import OfferProperties from "../containers/OfferProperties";
import OfferDetail from "../containers/OfferDetail";
import AddOffer from "../containers/AddOffer";
import PlanPurchase from "../containers/PlanPurchase";
import SearchResults from "../containers/SearchResults";
// import EditProperty from "../containers/EditProperty";
import Amenities from "../containers/Amenities";
import UpdateDeveloper from "../containers/UpdateDeveloper";
import AddDeveloper from "../containers/AddDeveloper";
import UpcomingProject from "../containers/UpcomingProject";
import AddUpcomingProject from "../containers/AddUpcomingProject"
import Faq from "../containers/Faq";
import InquiriesList from "../containers/InquiriesList";
import InquiryDetail from "../containers/InquiryDetail";
import PlanHistory from "../containers/PlanHistory";
import ContactedProperties from "../containers/ContactedProperties";
import BhkProperties from "../containers/BhkProperties";
import Vaibhav from "../containers/Vaibhav";
import AdvisorDashboard from "../containers/AdvisorDashboard";
import MyTour from "../containers/MyTour";
import AllScheduled from "../containers/AllScheduled";
import SearchDashboard from "../containers/SearchDashboard";
import Dashboard from "../dashboard/Dashboard";
import AddNewProperty from "../postproperty/AddNewProperty";
import EditProperty from "../postproperty/EditProperty";
import AddNewProject from "../postproject/AddNewProject";
import Editproject from "../postproject/Editproject";
import Login1 from "../auth/Login1";
import SignUp1 from "../auth/SignUp1";
import OtpVerification from "../auth/OtpVerification";
import AddNewOffer from "../addoffer/AddNewOffer";
import ProjectDetail from "../containers/ProjectDetail";
// import FeaturedDashboard from "../containers/FeaturedDashboard";
import AgentDetail from "../containers/AgentDetail";
import ProjectBuilder from "../containers/ProjectBuilder";
import ProjectList from "../containers/ProjectList";
import AllOffers from "../containers/AllOffers";
import GetScheduleModal from "../containers/GetScheduleModal";
import GetScheduleVTourproperty from "../containers/GetScheduleVTourproperty";
import AboutUs from "../dashboard/AboutUs";
import Privacy from "../dashboard/Privacy";
import Terms from "../dashboard/Terms";
import FAQ from "../dashboard/FAQ";
import CookiePolicy from "../dashboard/CookiePolicy";
import ContactUS from "../dashboard/ContactUS";
import OfferNotApprovedModal from "../dashboard/OfferNotApprovedModal";
import AdsNotApprovedModal from "../dashboard/AdsNotApprovedModal";
import AppDownloadPopup from "../containers/AppDownloadPopup";
import { ToastContainer } from 'react-toastify';
import FeaturedDashboard from "../containers/FeaturedDashboard";
import RecommendedPropertiesDashboard from "../containers/RecommendedPropertiesDashboard";
import RecommendedProperties from "../containers/RecommendedProperties";
import ShareModal from "../containers/ShareModal";
import ContactDetails from "../containers/ContactDetails";
import { useHistory } from 'react-router-dom'
import NRIPage from '../containers/NRIPage';



const Routes = () => {
  const accessToken = sessionStorage.getItem('accessToken');
  const history = useHistory();

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/listing" component={Listing} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />

        <Route exact path="/nri" component={NRIPage} />

        <Route exact path="/profile" component={Profile} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/add_new_property" component={AddNewProperty} />
        <Route path="/edit_property/:_id" component={EditProperty} />
        <Route exact path="/add_new_project" component={AddNewProject} />
        <Route path="/Editproject/:_id" component={Editproject} />
        <Route exact path="/add_new_offer" component={AddNewOffer} />
        <Route exact path="/get-shedule" component={GetScheduleModal} />
        <Route exact path="/get-shedule-property" component={GetScheduleVTourproperty} />
        <Route path="/post-property" component={PostProperty} />
        <Route path="/ContactDetails" component={ContactDetails} />

        <Route path="/mytour" component={MyTour} />
        <Route path="/ShareModal" component={ShareModal} />
        <Route path="/allschedules" component={AllScheduled} />
        <Route path="/property" component={PropertyDashboard} />
        <Route path="/allproperties" component={AllProperty} />
        <Route path="/recommendedpropertiesDashboard" component={RecommendedPropertiesDashboard} />
        <Route path="/featuredDashboard" component={FeaturedDashboard} />
        <Route path="/advisordashboard" component={AdvisorDashboard} />
        <Route path="/searchdashboard" component={SearchDashboard} />
        <Route path="/projectdetail/:projectId" component={ProjectDetail} />

        <Route exact path="/login1" component={Login1} />
        <Route exact path="/signup1" component={SignUp1} />
        <Route exact path="/otp" component={OtpVerification} />
        <Route exact path="/all-offers" component={AllOffers} />
        <Route exact path="/offerdetail/:_id" component={OfferDetail} />
        <Route path="/about-us" component={AboutUs} />
        <Route path="/privacy-policy" component={Privacy} />
        <Route path="/terms-conditions" component={Terms} />
        <Route path="/faq" component={FAQ} />
        <Route path="/cookies-policy" component={CookiePolicy} />
        <Route path="/contact-us" component={ContactUS} />
        <Route path="/offer-not-approved" component={OfferNotApprovedModal} />
        <Route path="/add-not-approved" component={AdsNotApprovedModal} />
        <Route path="/app-download" component={AppDownloadPopup} />

        <Route path="/vaibhav" component={Vaibhav} />
        <Route path="/alldeveloper" component={AllDeveloper} />
        <Route path="/offer/:id" component={Offer} />
        {/* <Route path="/details" component={Detail} /> */}
        <Route path="/propertydetails/:_id" component={Detail} />
        <Route path="/savedsearch" component={SavedSearch} />
        <Route path="/postedproperties" component={PostedProperties} />
        <Route path="/changepassword" component={ChangePassword} />
        <Route path="/download" component={Download} />
        <Route path="/downloadhouzzashots" component={DownloadHouzzaShots} />
        <Route path="/citywiseproperties/:city_name" component={City_Wise} />
        <Route
          path="/spotlitedetails/:developerId/:userId"
          component={SpotliteDetail}
        />
        <Route path="/pdetails/:_id" component={PDetails} />
        <Route path="/offerproperties" component={OfferProperties} />
        <Route path="/addoffer" component={AddOffer} />
        <Route path="/plan" component={PlanPurchase} />
        <Route path="/search/:cityName/:category" component={SearchResults} />
        <Route path="/amenity" component={Amenities} />
        <Route path="/updatedeveloper" component={UpdateDeveloper} />
        <Route path="/add-developer" component={AddDeveloper} />
        <Route path="/upcomingproject" component={UpcomingProject} />
        <Route path="/add-upcoming-project" component={AddUpcomingProject} />
        <Route path="/faq" component={Faq} />
        <Route path="/inquirieslist" component={InquiriesList} />
        <Route path="/inquiriesdetail/:_id" component={InquiryDetail} />
        <Route path="/plan-history" component={PlanHistory} />
        <Route path="/contactedproperties" component={ContactedProperties} />
        <Route path="/bhkproperties" component={BhkProperties} />
        <Route path="/agentdetail/:id" component={AgentDetail} />
        <Route path="/projectbuilder/:id" component={ProjectBuilder} />
        <Route path="/projectdetail/:id" component={ProjectDetail} />
        <Route path="/projectlist" component={ProjectList} />
        <Route component={NotFound} />
      </Switch >
    </>
  );
};

export default Routes;
