import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

// Custom styles for Snackbar and Alert
const useStyles = makeStyles({
  snackbar: {
    maxWidth: "350px", // Set a fixed maximum width for the Snackbar
    width: "350px", // Ensure the width is exactly 400px
  },
  alert: {
    width: "100%", // Ensure Alert takes full width of the Snackbar
    whiteSpace: "nowrap", // Prevent text from wrapping
    overflow: "hidden", // Ensure content that overflows is hidden
    textOverflow: "ellipsis", // Show ellipsis for overflowing text
  },
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarComponent = ({ snackbars, closeSnackbar }) => {
  const classes = useStyles(); // Get the styles
  const theme = useTheme(); // Access the theme for colors

  return (
    <>
      {snackbars.map((snackbar, index) => (
        <Snackbar
          key={index}
          open={snackbar.open}
          autoHideDuration={5000} // Close after 5 seconds
          onClose={() => closeSnackbar(index)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          // Adjust the position dynamically based on the index
          //style={{ top: `${index * 70 + 20}px` }} // 70px per snackbar + initial 20px from top
          className={classes.snackbar} // Apply fixed width to the Snackbar
        >
          <Alert
            onClose={() => closeSnackbar(index)}
            severity={snackbar.type}
            className={classes.alert} // Apply truncation to the text
            sx={{
              backgroundColor: "white", // Background color
              color: theme.palette[snackbar.type].main, // Text color based on type
            }}
          >
            {snackbar.message} {/* Text will be truncated if it overflows */}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default SnackbarComponent;
