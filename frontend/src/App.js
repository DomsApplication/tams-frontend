import React, { createContext, useEffect, useState, useRef } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Main from "./main.js";
import { DEFAULT_THEME } from "./themes/DefautTheme.js";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import LoadMask from "./component/LoadMask.tsx";
import Welcome from "./pages/Welcome";
import useSnackbar from "./component/snackbar/useSnackbar";
import Cookies from 'js-cookie';
import Util from "./utils/Util.js";

export const TenantContext = createContext(null);

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const showSnackbar = useSnackbar(); // Use the custom hook

  useEffect(() => {
    const token = Util.getCookies();
    if (token) {
      console.log('Access token is available.');
      setUserDetails(Util.decodeJwt(token));
      setIsAuthenticated(true);
    } else {
      console.log('Access token has expired or does not exist');
      setUserDetails(null);
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginSuccess = (userDetails) => {
    setUserDetails(userDetails);
    setIsAuthenticated(true);
  };

  return (
    <div id="app" style={{ height: "100vh", display: "flex" }}>
      {!isAuthenticated && <Welcome onLoginSuccess={handleLoginSuccess} />}
      {isAuthenticated &&  (
        <TenantContext.Provider value={{ userDetails }}>
          <CssBaseline>
            <ThemeProvider theme={DEFAULT_THEME}>
              <Main />
            </ThemeProvider>
          </CssBaseline>
        </TenantContext.Provider>
      )}
    </div>
  );
}

export default App;
