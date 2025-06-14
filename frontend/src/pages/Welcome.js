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
import Cookies from "js-cookie";
import Util from "../utils/Util.js";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import Avatar from "@mui/material/Avatar";
import axiosInstance from "../utils/axiosInstance";
import Link from "@mui/material/Link";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import useSnackbar from "../component/snackbar/useSnackbar";

const toolbarStyle = {
  minHeight: "50px",
};

function Welcome({ onLoginSuccess }) {
  //const { loginWithRedirect } = useAuth0();
  //const integration = UtilUseQuery.useQueryParam({ queryKey: "int" });
  //const hideWelcome = !Util.isEmpty(integration) && integration;

  useEffect(() => {}, []);

  const [open, setOpen] = useState(false);
  const [signup, setSignup] = useState(false);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [newuserId, setNewuserId] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);

  const showSnackbar = useSnackbar(); // Use the custom hook
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchRoles();
  }, []);


  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/login/roles"
      );
      setLoading(false);
      const inputdata = response.data;
      console.log("Fetched Roles:::"+inputdata)
      if (inputdata) {
        setRoles(inputdata);
      } else {
        setRoles([]);
        showSnackbar("Login Role is not loaded.", "warning");
      }
    } catch (err) {
      showSnackbar("Failed to fetch 'role' data.", "error");
      console.error(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError(""); // Clear previous errors

    // Validation
    if (!userId.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const request_body = { userId, password };
      setLoading(true);
      const response = await axiosInstance.post("/login/token", request_body);
      setLoading(false);
      if (response.status === 200) {
        const { message, token } = response.data;
        if (message === "success") {
          const decodedToken = Util.decodeJwt(token);
          const { exp } = decodedToken;
          //Util.setCookies(token, exp);
          onLoginSuccess(decodedToken);
          setOpen(false);
          setSignup(false);
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

  const createUser = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError(""); // Clear previous errors
    console.log("Called createuser/1");
    // Validation
    if (
      !newuserId.trim() ||
      !newpassword.trim() ||
      !firstName.trim() ||
      !lastName.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }
    console.log("Called createuser/2");
    try {
      const userId = newuserId;
      const password = newpassword;
      console.log("Called createuser/3"+userId +":::"+password);
      const request_body = { userId, password, firstName, lastName, role };
      console.log("Called createuser/4"+request_body);
      setLoading(true);
      const response = await axiosInstance.post("/login/create", request_body);
      setLoading(false);
      console.log("Called createuser/5");
      if (response.status === 201) {
        console.log("Called createuser/6");
        //response.data;
        setOpen(true);
        setSignup(false);
      } else {
        console.log("Called createuser/7");
        setError("Error: " + response.status);
      }
    } catch (err) {
      console.error("Exception in createuser:"+err);
      setError(err.response?.data?.message || "Signup failed.");
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

      {/** SIGNIN */}
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
                Sign In
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
                <Typography sx={{ textAlign: "center" }}>
                  Don&apos;t have an account?{" "}
                  <Link
                    href="#"
                    variant="body2"
                    sx={{ alignSelf: "center" }}
                    onClick={() => {
                      setSignup(true); // open Sign Up
                      setOpen(false); //  close Sign In
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Container>
        </DialogContent>
      </Dialog>

      {/** SIGNUP */}
      <Dialog open={signup} onClose={() => setSignup(false)}>
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
                Sign Up
              </Typography>
              <Box
                component="form"
                onSubmit={createUser}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  autoFocus
                  margin="normal"
                  required
                  fullWidth
                  id="newuserId"
                  label="Email Id"
                  name="newuserId"
                  autoComplete="newuserId"
                  value={newuserId}
                  onChange={(e) => setNewuserId(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="newpassword"
                  label="New Password"
                  type="newpassword"
                  id="newpassword"
                  autoComplete="newpassword"
                  value={newpassword}
                  onChange={(e) => setNewpassword(e.target.value)}
                />
                <TextField
                  autoFocus
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                  autoFocus
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    labelId="signup-role-label"
                    id="signup-role-select"
                    label="Role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.name} value={role.name}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  Sign Up
                </Button>
                <Typography sx={{ textAlign: "center" }}>
                  Already have an account?{" "}
                  <Link
                    href="#"
                    variant="body2"
                    sx={{ alignSelf: "center" }}
                    onClick={() => {
                      setSignup(false); // close Sign Up
                      setOpen(true); // open Sign In
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Container>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Welcome;
