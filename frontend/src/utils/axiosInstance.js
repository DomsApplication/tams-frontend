import axios from "axios";
import Util from "./Util.js"

// Create a custom axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true, // Send cookies with every request
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("[Request]", config);
    // No need to set token manually since it's in browser cookies
    return config;
  },
  (error) => {
    console.error("[Request Error]", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("[Response]", response);
    return response;
  },
  (error) => {
    console.error("[Response Error]", error);
    
    // Redirect or show message if session expired
    if (error.response?.status === 408) {
      alert("Session expired. Redirecting to login.");
      Util.removeCookies();
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
