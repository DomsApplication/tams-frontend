// src/context/toastContext.js
import React, { createContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

// Create the context
const ToastContext = createContext();

// Toast Provider component
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error", // "error", "warning", "info", "success"
  });

  // Function to show toast
  const showToast = (message, severity = "error") => {
    setToast({ open: true, message, severity });
  };

  // Function to close toast
  const closeToast = () => {
    setToast({ ...toast, open: false });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={10000} // 10 seconds delay
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={closeToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

// Custom hook to use toast context
export const useToast = () => React.useContext(ToastContext);

export default ToastContext;
