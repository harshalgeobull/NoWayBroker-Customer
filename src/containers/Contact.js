// import React, { useState, useEffect } from "react";
// import { Helmet } from "react-helmet";
// import axios from "axios";
// import { connect } from "react-redux";
// import setAlert from "../store/actions/alert";
// import Loader from "react-loader-spinner";
// import Email from "@mui/icons-material/Email";
// import LocationOn from "@mui/icons-material/LocationOn";
// import Phone from "@mui/icons-material/Phone";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faStar } from "@fortawesome/free-solid-svg-icons";

// const Contact = ({ setAlert }) => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//     fetchContactInfo(); // Fetch contact info on mount
//   }, []);

//   const [formData, setFormData] = useState({
//     name: "",
//     contact_number: "",
//     email: "",
//     rating: 1,
//     feedback_msg: "",
//   });

//   const { name, contact_number, email, rating, feedback_msg } = formData;

//   const [loading, setLoading] = useState(false);
//   const [alert, setLocalAlert] = useState(null);

//   // State for contact information
//   const [contactInfo, setContactInfo] = useState({
//     address: "",
//     email: "",
//     phone: "",
//     latitude: "",
//     longitude: "",
//   });

//   const fetchContactInfo = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/cust_api/get_setting`,
//       );
//       const { data } = response.data; // Accessing the "data" array from the response
//       if (data && data.length > 0) {
//         const { address, emaild_id, contact, latitude } = data[0]; // Extracting required fields from the first object
//         setContactInfo({ address, email: emaild_id, phone: contact });
//       }
//     } catch (error) {
//       setAlert("Error fetching contact information", "error");
//       setLocalAlert({
//         msg: "Error fetching contact information",
//         type: "danger",
//       });
//     }
//   };

//   const onChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleStarClick = (newRating) => {
//     setFormData({ ...formData, rating: newRating });
//   };

//   const onSubmit = (e) => {
//     e.preventDefault();

//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };

//     setLoading(true);
//     axios
//       .post(
//         `${process.env.REACT_APP_API_URL}/cust_api/give_us_feedback`,
//         { name, contact_number, email, rating, feedback_msg },
//         config,
//       )
//       .then((res) => {
//         setAlert("Feedback Submitted", "success");
//         setLocalAlert({
//           msg: "Feedback Submitted Successfully!",
//           type: "success",
//         });
//         setLoading(false);
//         setFormData({
//           name: "",
//           contact_number: "",
//           email: "",
//           rating: 1,
//           feedback_msg: "",
//         });
//         window.scrollTo(0, 0);
//         setTimeout(() => {
//           setLocalAlert(null);
//         }, 3000);
//       })
//       .catch((err) => {
//         setAlert("Error Submitting Feedback", "error");
//         setLocalAlert({ msg: "Error Submitting Feedback", type: "danger" });
//         setLoading(false);
//         window.scrollTo(0, 0);
//         setTimeout(() => {
//           setLocalAlert(null);
//         }, 3000);
//       });
//   };

//   const renderStars = () => {
//     return [...Array(5)].map((_, index) => {
//       const starValue = index + 1;
//       return (
//         <FontAwesomeIcon
//           key={index}
//           icon={faStar}
//           className={`cursor-pointer ${starValue <= rating ? "text-yellow-500" : "text-gray-300"}`}
//           onClick={() => handleStarClick(starValue)}
//         />
//       );
//     });
//   };

//   return (
//     <div className="min-h-screen px-4 bg-gray-100 feedback">
//       <Helmet>
//         <title>Real Estate - Feedback</title>
//         <meta name="description" content="Feedback form" />
//       </Helmet>

//       <div className="container max-w-6xl p-8 mx-auto bg-white rounded-lg shadow-lg">
//         <h2 className="mb-3 text-3xl font-bold text-center text-black-500">
//           Feedback Form
//         </h2>

//         {alert && (
//           <div
//             className={`mb-4 p-4 text-white rounded ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}
//           >
//             {alert.msg}
//           </div>
//         )}
//         <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
//           <div>
//             <div className="flex items-start mb-6 address">
//               <LocationOn className="my-text" style={{ fontSize: 40 }} />
//               <div className="ml-4">
//                 <h4 className="text-xl font-semibold">Location:</h4>
//                 <p className="text-gray-600">{contactInfo.address}</p>{" "}
//                 {/* Address is now updated from geocoding */}
//               </div>
//             </div>
//             <div className="flex items-start mb-6 email">
//               <Email className="my-text" style={{ fontSize: 40 }} />
//               <div className="ml-4">
//                 <h4 className="text-xl font-semibold">Email:</h4>
//                 <p className="text-gray-600">{contactInfo.email}</p>
//               </div>
//             </div>
//             <div className="flex items-start mb-6 phone">
//               <Phone className="my-text" style={{ fontSize: 40 }} />
//               <div className="ml-4">
//                 <h4 className="text-xl font-semibold">Phone:</h4>
//                 <p className="text-gray-600">{contactInfo.phone}</p>
//               </div>
//             </div>

//             <div>
//               <iframe
//                 width="100%"
//                 height="250"
//                 title="Contact map"
//                 frameBorder="0"
//                 scrolling="no"
//                 marginHeight="0"
//                 marginWidth="0"
//                 src={`https://maps.google.com/maps?q=${contactInfo.latitude},${contactInfo.address},${contactInfo.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`} // Use latitude and longitude from contactInfo
//                 className="rounded-lg"
//               ></iframe>
//             </div>
//           </div>
//           <div>
//             <form className="form" onSubmit={(e) => onSubmit(e)}>
//               <div className="mb-4 form-group">
//                 <label
//                   className="block mb-2 text-sm font-bold text-gray-700"
//                   htmlFor="name"
//                 >
//                   Name <span className="text-red-500"> *</span>
//                 </label>
//                 <input
//                   className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//                   name="name"
//                   type="text"
//                   placeholder="Full Name"
//                   onChange={(e) => onChange(e)}
//                   value={name}
//                   required
//                 />
//               </div>
//               <div className="mb-4 form-group">
//                 <label
//                   className="block mb-2 text-sm font-bold text-gray-700"
//                   htmlFor="phone"
//                 >
//                   Phone Number <span className="text-red-500"> *</span>
//                 </label>
//                 <input
//                   className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//                   name="contact_number"
//                   type="tel"
//                   placeholder="+91 1234567890"
//                   onChange={(e) => {
//                     const currentValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters (digits only)
//                     if (currentValue.length < 7 || currentValue.length > 15) {
//                       e.target.setCustomValidity(
//                         "Phone number must be between 7 and 15 digits",
//                       );
//                     } else {
//                       e.target.setCustomValidity(""); // Clear the message if valid
//                     }
//                     onChange(e); // Call your original onChange handler
//                   }}
//                   value={contact_number}
//                   required
//                   onKeyPress={(e) => {
//                     const currentValue = e.target.value.replace(/\D/g, ""); // Get only digits from current value
//                     const key = e.key;
//                     if (!/[0-9\s+]/.test(key)) {
//                       e.preventDefault();
//                     }
//                     if (currentValue.length >= 15 && /[0-9]/.test(key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   title="Please enter a valid phone number"
//                 />
//               </div>

//               <div className="mb-4 form-group">
//                 <label
//                   className="block mb-2 text-sm font-bold text-gray-700"
//                   htmlFor="email"
//                 >
//                   Email <span className="text-red-500"> *</span>
//                 </label>
//                 <input
//                   className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//                   name="email"
//                   type="email"
//                   placeholder="example@gmail.com"
//                   onChange={(e) => onChange(e)}
//                   value={email}
//                   required
//                 />
//               </div>

//               <div className="mb-4 form-group">
//                 <label
//                   className="block mb-2 text-sm font-bold text-gray-700"
//                   htmlFor="feedback_msg"
//                 >
//                   Feedback <span className="text-red-500"> *</span>
//                 </label>
//                 <textarea
//                   className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//                   name="feedback_msg"
//                   placeholder="Your feedback here..."
//                   onChange={(e) => onChange(e)}
//                   value={feedback_msg}
//                   required
//                 ></textarea>
//               </div>

//               <div className="mb-4 form-group">
//                 <label
//                   className="block mb-2 text-sm font-bold text-gray-700"
//                   htmlFor="rating"
//                 >
//                   Rating <span className="text-red-500"> *</span>
//                 </label>
//                 <div className="flex mb-4">{renderStars()}</div>
//               </div>

//               <button
//                 className={`my-bg hover:my-bg text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
//                   loading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 type="submit"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <Loader
//                     type="ThreeDots"
//                     color="#fff"
//                     height={15}
//                     width={15}
//                   />
//                 ) : (
//                   "Submit"
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default connect(null, { setAlert })(Contact);

// import React, { useState, useEffect } from "react";
// import { Helmet } from "react-helmet";
// import axios from "axios";
// import { connect } from "react-redux";
// import setAlert from "../store/actions/alert";
// import Loader from "react-loader-spinner";
// import { Email, LocationOn, Phone } from "@material-ui/icons";

// const Contact = ({ setAlert }) => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const { name, email, subject, message } = formData;

//   const [loading, setLoading] = useState(false);

//   const onChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const onSubmit = (e) => {
//     e.preventDefault();

//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };

//     setLoading(true);
//     axios
//       .post(
//         `${process.env.REACT_APP_API_URL}/api/contacts/`,
//         { name, email, subject, message },
//         config
//       )
//       .then((res) => {
//         setAlert("Message Sent", "success");
//         setLoading(false);
//         setFormData({ name: "", email: "", subject: "", message: "" });
//         window.scrollTo(0, 0);
//       })
//       .catch((err) => {
//         setAlert("Error with Sending Message", "error");
//         setLoading(false);
//         window.scrollTo(0, 0);
//       });
//     setFormData({
//       name: "",
//       email: "",
//       subject: "",
//       message: "",
//     });
//   };

//   return (
//     <div className="min-h-screen px-4 bg-gray-100 contact">
//       <Helmet>
//         <title>Real Estate - Contact</title>
//         <meta name="description" content="Contact us" />
//       </Helmet>

//       <div className="container max-w-6xl p-8 mx-auto bg-white rounded-lg shadow-lg">
//       <h2 className="mb-3 text-3xl font-bold text-center text-black-500">Contact Us</h2>
//         <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
//           <div>
//             <div className="flex items-start mb-6 address">
//               <LocationOn className="my-text" style={{ fontSize: 40 }} />
//               <div className="ml-4">
//                 <h4 className="text-xl font-semibold">Location:</h4>
//                 <p className="text-gray-600">B2-710, Balewadi High Street, PN, Pune, 123456, Maharashtra</p>
//               </div>
//             </div>
//             <div className="flex items-start mb-6 email">
//               <Email className="my-text" style={{ fontSize: 40 }} />
//               <div className="ml-4">
//                 <h4 className="text-xl font-semibold">Email:</h4>
//                 <p className="text-gray-600">example@gmail.com</p>
//               </div>
//             </div>
//             <div className="flex items-start mb-6 phone">
//               <Phone className="my-text" style={{ fontSize: 40 }} />
//               <div className="ml-4">
//                 <h4 className="text-xl font-semibold">Phone:</h4>
//                 <p className="text-gray-600">+91 1234567890</p>
//               </div>
//             </div>
//             <div>
//               <iframe
//                 width="100%"
//                 height="250"
//                 frameBorder="0"
//                 scrolling="no"
//                 marginHeight="0"
//                 marginWidth="0"
//                 src="https://maps.google.com/maps?q=Mumbai&t=&z=13&ie=UTF8&iwloc=&output=embed"
//                 className="rounded-lg"
//               ></iframe>
//             </div>
//           </div>
//           <div>
//             <form className="form" onSubmit={(e) => onSubmit(e)}>
//               <div className="mb-4 form-group">
//                 <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="name">
//                   Name <span className="text-red-500"> *</span>
//                 </label>
//                 <input
//                   className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//                   name="name"
//                   type="text"
//                   placeholder="Full Name"
//                   onChange={(e) => onChange(e)}
//                   value={name}
//                   required
//                 />
//               </div>
//               <div className="mb-4 form-group">
//                 <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
//                   Email <span className="text-red-500"> *</span>
//                 </label>
//                 <input
//                   className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//                   name="email"
//                   type="email"
//                   placeholder="example@gmail.com"
//                   onChange={(e) => onChange(e)}
//                   value={email}
//                   required
//                 />
//               </div>
//               <div className="mb-4 form-group">
//                 <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="subject">
//                   Subject <span className="text-red-500"> *</span>
//                 </label>
//                 <input
//                   className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//                   name="subject"
//                   type="text"
//                   placeholder="Buying Home"
//                   onChange={(e) => onChange(e)}
//                   value={subject}
//                   required
//                 />
//               </div>
//               <div className="mb-4 form-group">
//                 <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="message">
//                   Message <span className="text-red-500"> *</span>
//                 </label>
//                 <textarea
//                   className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//                   name="message"
//                   cols="30"
//                   rows="5"
//                   placeholder="Message"
//                   style={{ resize: "none" }}
//                   onChange={(e) => onChange(e)}
//                   value={message}
//                 />
//               </div>
//               {loading ? (
//                 <div className="flex justify-center my-3">
//                   <Loader type="Oval" color="#424242" height={50} width={50} />
//                 </div>
//               ) : (
//                 <div className="flex justify-center send-btn">
//                   <button
//                     className="px-4 py-2 font-bold text-white my-bg rounded hover:my-bg focus:outline-none focus:shadow-outline"
//                     type="submit"
//                   >
//                     Send
//                   </button>
//                 </div>
//               )}
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default connect(null, { setAlert })(Contact);






////////////////////////////////////////ADD NEW CODE//////////////
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { connect } from "react-redux";
import setAlert from "../store/actions/alert";
import Loader from "react-loader-spinner";
import Email from "@mui/icons-material/Email";
import LocationOn from "@mui/icons-material/LocationOn";
import Phone from "@mui/icons-material/Phone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Contact = ({ setAlert }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchContactInfo(); // Fetch contact info on mount
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    contact_number: "",
    email: "",
    property_name: "",
    rating: 1,
    feedback_msg: "",
  });

  const { name, contact_number, email, property_name, rating, feedback_msg } = formData;

  const [loading, setLoading] = useState(false);
  const [alert, setLocalAlert] = useState(null);

  // State for contact information
  const [contactInfo, setContactInfo] = useState({
    address: "",
    email: "",
    phone: "",
    latitude: "",
    longitude: "",
  });

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/cust_api/get_setting`,
      );
      const { data } = response.data; // Accessing the "data" array from the response
      if (data && data.length > 0) {
        const { address, emaild_id, contact, latitude } = data[0]; // Extracting required fields from the first object
        setContactInfo({
  address,
  email: emaild_id,
  phone: contact ? `+91 ${contact}` : "",
});
      }
    } catch (error) {
      setAlert("Error fetching contact information", "error");
      setLocalAlert({
        msg: "Error fetching contact information",
        type: "danger",
      });
    }
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleStarClick = (newRating) => {
    setFormData({ ...formData, rating: newRating });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/cust_api/give_us_feedback`,
        { name, contact_number, email, property_name, rating, feedback_msg },
        config,
      )
      .then((res) => {
        setAlert("Feedback Submitted", "success");
        setLocalAlert({
          msg: "Feedback Submitted Successfully!",
          type: "success",
        });
        setLoading(false);
        setFormData({
          name: "",
          contact_number: "",
          email: "",
          property_name: "",
          rating: 1,
          feedback_msg: "",
        });
        window.scrollTo(0, 0);
        setTimeout(() => {
          setLocalAlert(null);
        }, 3000);
      })
      .catch((err) => {
        setAlert("Error Submitting Feedback", "error");
        setLocalAlert({ msg: "Error Submitting Feedback", type: "danger" });
        setLoading(false);
        window.scrollTo(0, 0);
        setTimeout(() => {
          setLocalAlert(null);
        }, 3000);
      });
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <FontAwesomeIcon
          key={index}
          icon={faStar}
          className={`cursor-pointer ${starValue <= rating ? "text-yellow-500" : "text-gray-300"}`}
          onClick={() => handleStarClick(starValue)}
        />
      );
    });
  };

  return (
    <div className="min-h-screen px-4 bg-gray-100 feedback">
      <Helmet>
        <title>Real Estate - Feedback</title>
        <meta name="description" content="Feedback form" />
      </Helmet>

      <div className="container max-w-6xl p-8 mx-auto bg-white rounded-lg shadow-lg">
        <h2 className="mb-3 text-3xl font-bold text-center text-black-500">
          Rate Us
        </h2>

        {alert && (
          <div
            className={`mb-4 p-4 text-white rounded ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}
          >
            {alert.msg}
          </div>
        )}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <div className="flex items-start mb-6 address">
              <LocationOn className="my-text" style={{ fontSize: 40 }} />
              <div className="ml-4">
                <h4 className="text-xl font-semibold">Location:</h4>
                <p className="text-gray-600">{contactInfo.address}</p>{" "}
                {/* Address is now updated from geocoding */}
              </div>
            </div>
            <div className="flex items-start mb-6 email">
              <Email className="my-text" style={{ fontSize: 40 }} />
              <div className="ml-4">
                <h4 className="text-xl font-semibold">Email:</h4>
                <p className="text-gray-600">{contactInfo.email}</p>
              </div>
            </div>
            <div className="flex items-start mb-6 phone">
              <Phone className="my-text" style={{ fontSize: 40 }} />
              <div className="ml-4">
                <h4 className="text-xl font-semibold">Phone:</h4>
                <p className="text-gray-600">{contactInfo.phone}</p>
              </div>
            </div>

            <div>
              <iframe
                width="100%"
                height="250"
                title="Contact map"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://maps.google.com/maps?q=${contactInfo.latitude},${contactInfo.address},${contactInfo.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`} // Use latitude and longitude from contactInfo
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
          <div>
            <form className="form" onSubmit={(e) => onSubmit(e)}>
              <div className="mb-4 form-group">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="name"
                >
                  Name <span className="text-red-500"> *</span>
                </label>
                <input
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  onChange={(e) => onChange(e)}
                  value={name}
                  required
                />
              </div>
              <div className="mb-4 form-group">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="phone"
                >
                  Phone Number <span className="text-red-500"> *</span>
                </label>
                <input
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  name="contact_number"
                  type="tel"
                  placeholder="+91 1234567890"
                  onChange={(e) => {
                    const currentValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters (digits only)
                    if (currentValue.length < 7 || currentValue.length > 15) {
                      e.target.setCustomValidity(
                        "Phone number must be between 7 and 15 digits",
                      );
                    } else {
                      e.target.setCustomValidity(""); // Clear the message if valid
                    }
                    onChange(e); // Call your original onChange handler
                  }}
                  value={contact_number}
                  required
                  onKeyPress={(e) => {
                    const currentValue = e.target.value.replace(/\D/g, ""); // Get only digits from current value
                    const key = e.key;
                    if (!/[0-9\s+]/.test(key)) {
                      e.preventDefault();
                    }
                    if (currentValue.length >= 15 && /[0-9]/.test(key)) {
                      e.preventDefault();
                    }
                  }}
                  title="Please enter a valid phone number"
                />
              </div>

              <div className="mb-4 form-group">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="email"
                >
                  Email <span className="text-red-500"> *</span>
                </label>
                <input
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  onChange={(e) => onChange(e)}
                  value={email}
                  required
                />
              </div>

              <div className="mb-4 form-group">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="property_name"
                >
                  Property/Project Name <span className="text-red-500"> *</span>
                </label>
                <input
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  name="property_name"
                  type="text"
                  placeholder="Property Name"
                  onChange={(e) => onChange(e)}
                  value={property_name}
                  required
                />
              </div>

              <div className="mb-4 form-group">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="feedback_msg"
                >
                  Feedback <span className="text-red-500"> *</span>
                </label>
                <div className="relative w-full mt-1">
                  <textarea
                    name="feedback_msg"
                    placeholder="Your feedback here..."
                    value={feedback_msg}
                    maxLength={555}
                    onChange={(e) => onChange(e)}
                    className="w-full h-32 p-3 pb-7 pr-16 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500 resize-none block"
                    required
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-gray-400 pointer-events-none select-none z-10">
                    {(feedback_msg || "").length}/555
                  </span>
                </div>
              </div>

              <div className="mb-4 form-group">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="rating"
                >
                  Rating <span className="text-red-500"> *</span>
                </label>
                <div className="flex mb-4">{renderStars()}</div>
              </div>

              <button
                className={`my-bg hover:my-bg text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Loader
                    type="ThreeDots"
                    color="#fff"
                    height={15}
                    width={15}
                  />
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { setAlert })(Contact);