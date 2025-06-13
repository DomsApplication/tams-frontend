import React, { useState, useEffect } from "react";
import PageTitle from "../../component/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Paper,
  Checkbox,
  FormControlLabel,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormHelperText,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import axiosInstance from "../../utils/axiosInstance";
import useSnackbar from "../../component/snackbar/useSnackbar";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const page_title = {
  title: "Add",
  navLinks: [
    { link: "/dashboard", label: "Dashboard" },
    { link: "/users", label: "User" },
  ],
};

const UserAdd = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar(); // Use the custom hook

  const [loading, setLoading] = useState(true); // Loading state

  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});

  const [devicelist, setDevicelist] = useState([]);

  const privileges = [
    { name: "User" },
    { name: "Manager" },
    { name: "Administrator" },
  ];

  useEffect(() => {
    fetchDepartmentList();
    fetchDeviceList();
  }, []);

  const fetchDepartmentList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/department"
      );
      setLoading(false);
      const inputdata = response.data;
      if (inputdata.length > 0) {
        setDepartments(inputdata);
      } else {
        setDepartments([]);
        showSnackbar("No department found. Try agai.", "warning");
      }
    } catch (err) {
      showSnackbar("Failed to fetch 'Department' data.", "error");
      console.error(err);
    }
  };

  const fetchDeviceList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/device"
      );
      const inputdata = response.data;
      setLoading(false);
      if (inputdata.length > 0) {
        const _deviceList = inputdata.map((item) => ({
          id:
            item.deviceSerialNo && item.deviceSerialNo.length > 0
              ? item.deviceSerialNo
              : "-",
          label:
            item.deviceSerialNo && item.deviceSerialNo.length > 0
              ? item.deviceSerialNo
              : "-",
        }));
        setDevicelist(_deviceList);
      } else {
        showSnackbar("Device List is empty..", "error");
      }
    } catch (err) {
      showSnackbar("Failed to fetch 'Device' data.", "error");
      console.error(err);
    }
  };

  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    departmentId: "",
    privilege: "",
    enabled: true,
    selecteddevice: [],
    downloadUserInfo: true,
  });

  const validateForm = () => {
    let errors = {};
    if (!formData.userId || !formData.userId.match(/^[a-zA-Z0-9_]{3,20}$/)) {
      errors.userId =
        "User ID must be 3-20 alphanumeric characters, underscores, or hyphens.";
    }
    if (!formData.name || !formData.name.match(/^[a-zA-Z0-9_ ]{6,30}$/)) {
      errors.name =
        "User Name must be 6-30 alphanumeric characters, underscores, or hyphens, or space.";
    }
    if (!formData.departmentId) {
      errors.departmentId = "Department need to select.";
    }
    if (!formData.privilege) {
      errors.privilege = "Privilege need to select.";
    }
    if (formData.selecteddevice.length == 0) {
      errors.selecteddevice =
        "Alleast need to select one device for user sync.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (validateForm()) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/user/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            showSnackbar("Error adding user.", "error");
            throw new Error("Failed to add user.");
          }
        })
        .then((data) => {
          const userId = data.userId; // Extract userId from the response
          if (userId) {
            showSnackbar("User added successfully.", "success");
            handleClearForm();
            navigate(`/useredit/${userId}`);
          } else {
            showSnackbar("Unexpected response format.", "error");
          }
        })
        .catch((error) =>
          showSnackbar("Error submitting form:" + error, "error")
        );
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name === "selecteddevice") {
      if (value.includes("selectAll")) {
        const allSelected =
          formData.selecteddevice.length === devicelist.length;
        setFormData({
          ...formData,
          selecteddevice: allSelected
            ? []
            : devicelist.map((device) => device.id), // Select all or clear selection
        });
      } else {
        setFormData({
          ...formData,
          selecteddevice: value, // Update with the selected values
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleClearForm = () => {
    setFormData({
      userId: "",
      name: "",
      departmentId: "",
      privilege: "",
      enabled: true,
      selecteddevice: [],
      downloadUserInfo: true,
    });
    setErrors({}); // Clear any error messages
  };

  return (
    <Box role="presentation" sx={{ p: 0 }}>
      <PageTitle {...page_title} />

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        rowSpacing={1}
        sx={{ pt: 1, pb: 1 }}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        {/** Controlpanel Grid */}
        <Grid
          container
          direction="row"
          alignItems="center"
          sx={{
            ml: 3,
            backgroundColor: "lightgray",
            borderRadius: "5px",
          }}
        >
          {/* Left-Aligned Search Field */}
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <Typography
              component="h3"
              variant="h5"
              color="primary"
              sx={{ pl: 1, pt: 1 }}
              gutterBottom
            >
              New User
            </Typography>
          </Grid>

          {/* Right-Aligned Buttons and Icons */}
          <Grid
            item
            xs={6} // Adjust size for the right-aligned items
            sm={6}
            md={6}
            lg={6}
            container
            justifyContent="flex-end" // Push all items to the right
            alignItems="center"
          >
            <IconButton aria-label="back" onClick={() => navigate("/users")}>
              <ArrowBackRoundedIcon />
            </IconButton>

            <Button
              sx={{ m: 1 }}
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleFormSubmit}
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              Add
            </Button>

            <Button
              sx={{ m: 1 }}
              variant="outlined"
              color="secondary"
              size="medium"
              startIcon={<HighlightOffIcon />}
              onClick={handleClearForm}
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              Clear
            </Button>
          </Grid>
        </Grid>

        {/* Top Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            {/* Label at the top-left corner */}
            <Typography
              sx={{
                display: "inline-block", // Ensures background only wraps around the text
                backgroundColor: "lightgray", // Background color for the text
                color: "black", // Optional: Text color for better contrast
                borderRadius: "4px", // Optional: Rounding for better aesthetics
                px: 1, // Horizontal padding for spacing inside the background
                mb: 1,
              }}
            >
              User Info
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="User ID"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  error={!!errors.userId}
                  helperText={errors.userId}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.departmentId}>
                  <InputLabel id="user-form-department-select-label">
                    Department
                  </InputLabel>
                  <Select
                    labelId="user-form-department-select-label"
                    id="user-form-department-select"
                    label="Department"
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    error={!!errors.departmentId}
                    helperText={errors.departmentId}
                  >
                    {departments.map((dept) => (
                      <MenuItem
                        key={dept.departmentId}
                        value={dept.departmentId}
                      >
                        {dept.departmentName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.departmentId}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.privilege}>
                  <InputLabel id="user-form-privilege-select-label">
                    Privilege
                  </InputLabel>
                  <Select
                    labelId="user-form-privilege-select-label"
                    id="user-form-privilege-select"
                    label="Privilege"
                    name="privilege"
                    value={formData.privilege}
                    onChange={handleInputChange}
                    error={!!errors.privilege}
                    helperText={errors.privilege}
                  >
                    {privileges.map((priv) => (
                      <MenuItem key={priv.name} value={priv.name}>
                        {priv.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.privilege}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.enabled || false}
                        name="enabled"
                        onChange={handleInputChange}
                      />
                    }
                    label="Enabled / Disable"
                  />
                  <FormHelperText>
                    Enable the user otherwise Disable it.
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Bottom Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            {/* Label at the top-left corner */}
            <Typography
              sx={{
                display: "inline-block", // Ensures background only wraps around the text
                backgroundColor: "lightgray", // Background color for the text
                color: "black", // Optional: Text color for better contrast
                borderRadius: "4px", // Optional: Rounding for better aesthetics
                px: 1, // Horizontal padding for spacing inside the background
                mb: 1,
              }}
            >
              Additional Info
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.selecteddevice}>
                  <InputLabel id="device-select-label">
                    Selecte Device
                  </InputLabel>
                  <Select
                    labelId="device-select-label"
                    id="device-select-select"
                    label="Selecte Device"
                    name="selecteddevice"
                    multiple
                    value={formData.selecteddevice}
                    onChange={handleInputChange}
                    error={!!errors.selecteddevice}
                    helperText={errors.selecteddevice}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <PhoneAndroidIcon style={{ marginRight: 4 }} />
                            Select Device
                          </div>
                        );
                      }
                      const selectedDevices = devicelist
                        .filter((device) => selected.includes(device.id))
                        .map((device) => device.label)
                        .join(", ");
                      return (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <PhoneAndroidIcon style={{ marginRight: 4 }} />
                          {selectedDevices}
                        </div>
                      );
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                          width: 200,
                        },
                      },
                    }}
                  >
                    <MenuItem value="selectAll">
                      <Checkbox
                        checked={
                          formData.selecteddevice.length === devicelist.length
                        }
                        indeterminate={
                          formData.selecteddevice.length > 0 &&
                          formData.selecteddevice.length < devicelist.length
                        }
                      />
                      Select All
                    </MenuItem>
                    {devicelist.map((device) => (
                      <MenuItem key={device.id} value={device.id}>
                        <Checkbox
                          checked={formData.selecteddevice.includes(device.id)}
                        />
                        {device.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.selecteddevice}</FormHelperText>
                  <FormHelperText>
                    User information will sync with selected device(s).
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.downloadUserInfo || false}
                        name="downloadUserInfo"
                        onChange={handleInputChange}
                      />
                    }
                    label="Download user Info"
                  />
                  <FormHelperText>
                    If select, The user information will downloaded in to the
                    selected device(s) in left dropdown.
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserAdd;
