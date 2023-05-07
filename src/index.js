import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_DOMAIN}
    clientId={process.env.REACT_APP_CLIENT_ID}
    authorizationParams={{
      redirectUri: window.location.origin,
      audience: process.env.REACT_APP_AUDIENCE,
      scope:
        "openid profile email read:current_user update:current_user_metadata",
    }}
  >
    <CssBaseline />
    <App />
  </Auth0Provider>
);
