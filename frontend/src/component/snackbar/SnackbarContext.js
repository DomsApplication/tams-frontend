// component/snackbar/SnackbarContext.js
import React, { createContext, useState } from 'react';
import SnackbarComponent from './SnackbarComponent';

export const SnackbarContext = createContext(null);

export const SnackbarProvider = ({ children }) => {
  const [snackbars, setSnackbars] = useState([]);

  const openSnackbar = (message, type) => {
    // Add a new snackbar to the queue
    setSnackbars((prev) => [...prev, { open: true, message, type }]);
  };

  const closeSnackbar = (index) => {
    setSnackbars((prev) =>
      prev.map((snackbar, i) =>
        i === index ? { ...snackbar, open: false } : snackbar
      )
    );
  };

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      <SnackbarComponent snackbars={snackbars} closeSnackbar={closeSnackbar} />
    </SnackbarContext.Provider>
  );
};
