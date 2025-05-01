import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ScrollTop from "./component/scroll-top.js";
//import Auth0ConfigProvider from "./utils/Auth0ConfigProvider";
import { Auth0Provider } from "@auth0/auth0-react";
import { SnackbarProvider } from "./component/snackbar/SnackbarContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <SnackbarProvider>
        { /*<Auth0ConfigProvider OAuthProvider={Auth0Provider}> */}
          <ScrollTop>
            <App />
          </ScrollTop>
          { /*</Auth0ConfigProvider> */}
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
);
