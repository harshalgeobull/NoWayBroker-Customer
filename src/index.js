import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./App.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.render(
	<React.StrictMode>
		<GoogleOAuthProvider clientId="867447693808-ch4k6ili6o5lfjm2j0r96ka4imljaek4.apps.googleusercontent.com">
			<App />
		</GoogleOAuthProvider>
	</React.StrictMode>,
	document.getElementById("root")
);


