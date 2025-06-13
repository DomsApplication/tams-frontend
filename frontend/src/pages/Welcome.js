import React, { useEffect, useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Cookies from 'js-cookie';
import Util from "../utils/Util.js";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import Avatar from "@mui/material/Avatar";
import axiosInstance from "../utils/axiosInstance";


const toolbarStyle = {
  minHeight: "50px",
};

function Welcome({ onLoginSuccess }) {
  //const { loginWithRedirect } = useAuth0();
  //const integration = UtilUseQuery.useQueryParam({ queryKey: "int" });
  //const hideWelcome = !Util.isEmpty(integration) && integration;

  useEffect(() => {}, []);

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError(""); // Clear previous errors

    // Validation
    if (!userId.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const request_body = {userId,password};
      const response = await axiosInstance.post(
          "/login/token", 
          request_body
        );
      if (response.status === 200) {
        const { message, token } = response.data;
        if (message === "success") {
          const decodedToken = Util.decodeJwt(token);
          const { exp } = decodedToken;
          //Util.setCookies(token, exp);
          onLoginSuccess(decodedToken);
          setOpen(false);
        } else {
          setError(message || "Login failed.");
        }
      } else {
        setError("Error: " + response.status);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={0}>
        <Toolbar style={toolbarStyle}>
          {/** 3 line icon */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          ></IconButton>

          {/** Application Name */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Time Attendance System
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setOpen(true)}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                marginTop: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar>
                <PersonPinIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  autoFocus
                  margin="normal"
                  required
                  fullWidth
                  id="userId"
                  label="Email Id"
                  name="userId"
                  autoComplete="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
                <Button
                  variant="contained" 
                  size="medium"
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Container>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Welcome;
