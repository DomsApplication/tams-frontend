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
  Tooltip,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import axios from "axios";
import useSnackbar from "../../component/snackbar/useSnackbar";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PersonIcon from "@mui/icons-material/Person";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import SyncIcon from "@mui/icons-material/Sync";

const page_title = {
  title: "Edit",
  navLinks: [
    { link: "/dashboard", label: "Dashboard" },
    { link: "/users", label: "User" },
  ],
};

const UserEdit = () => {
  const navigate = useNavigate();

  const { id } = useParams(); // Extract the `id` from the URL

  const [pageTitle, setPageTitle] = useState(page_title); // Loading state
  const showSnackbar = useSnackbar(); // Use the custom hook
  const [loading, setLoading] = useState(true); // Loading state
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});

  const [devicelist, setDevicelist] = useState([]);

  const [selectedTab, setSelectedTab] = useState(0);

  const [imageSrc, setImageSrc] = useState(null);

  const [additionalUserInfo, setAdditionalUserInfo] = useState([]);

  const [userFingerInfo, setUserFingerInfo] = useState([]);

  const privileges = [
    { name: "User" },
    { name: "Manager" },
    { name: "Administrator" },
  ];

  useEffect(() => {
    fetchUserDetails();
    fetchUserImage();
    fetchUserFinger();
    fetchDepartmentList();
    fetchDeviceList();
  }, []);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/${id}`);
      setLoading(false);
      const inputdata = response.data;
      if (inputdata) {
        setFormData({
          userId: inputdata.userId || "",
          name: inputdata.username || "",
          departmentId: inputdata.departmentId || "",
          privilege: inputdata.privilege || "",
          enabled: inputdata.enabled === "Yes", // Convert "Yes" to true and anything else to false
          selecteddevice: [],
          downloadUserInfo: false,
        });
        setAddUserInfo(inputdata);
      } else {
        handleClearForm();
        showSnackbar("No user data found. Try again.", "warning");
      }
    } catch (err) {
      showSnackbar("Failed to fetch 'user' data.", "error");
      console.error(err);
    }
  };

  const setAddUserInfo = (data) => {
    // Excluded keys
    const excludedKeys = [
      "userId",
      "username",
      "privilege",
      "enabled",
      "departmentId",
    ];
    // Transform into array of objects
    const result = Object.entries(data)
      .filter(([key]) => !excludedKeys.includes(key))
      .map(([key, value]) => ({ [key]: value }));

    setAdditionalUserInfo(result);

    console.log("setAdditionalUserInfo::::::" + additionalUserInfo);
  };

  const fetchDepartmentList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/department`);
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
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/device`);
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

  const fetchUserImage = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/${id}/photo`,
        {
          responseType: "arraybuffer", // To handle byte[] response
        }
      );
      const base64Image = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      setImageSrc(`data:image/jpeg;base64,${base64Image}`);
    } catch (err) {
      setImageSrc(null); // Set to null if image is not loaded
      showSnackbar("Failed to fetch user photo data.", "error");
      console.error(err);
    }
  };

  const fetchUserFinger = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/${id}/finger`
      );
      const inputdata = response.data;
      setLoading(false);
      if (inputdata.length > 0) {
        setUserFingerInfo(inputdata);
      } else {
        showSnackbar("User Finger List is empty..", "error");
      }
    } catch (err) {
      showSnackbar("Failed to fetch User Finger data.", "error");
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
    if (!formData.departmentId || formData.departmentId === "0") {
      errors.departmentId = "Department need to select.";
    }
    if (!formData.privilege) {
      errors.privilege = "Privilege need to select.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (validateForm()) {
      console.log("handleFormSubmit:::" + JSON.stringify(formData));
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
          console.log("RESPONSE DATA::::::::" + data);
          const userId = data.userId; // Extract userId from the response
          if (userId) {
            showSnackbar("User added successfully.", "success");
            handleClearForm();
            fetchUserDetails();
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
      downloadUserInfo: false,
    });
    setErrors({}); // Clear any error messages
  };


  const [devicesyncFormData, setDevicesyncFormData] = useState({
    userId: id,
    setUserData: false,
    setFingerData: false,
    setFaceData: false,
    setUserPhoto: false,
    getUserData: false,
    getFingerData: false,
    getFaceData: false,
    getUserPhoto: false,
    selecteddevice: [],
  });

  const handleDeviceSyncInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name === "selecteddevice") {
      if (value.includes("selectAll")) {
        const allSelected =
        devicesyncFormData.selecteddevice.length === devicelist.length;
          setDevicesyncFormData({
          ...devicesyncFormData,
          selecteddevice: allSelected
            ? []
            : devicelist.map((device) => device.id), // Select all or clear selection
        });
      } else {
        setDevicesyncFormData({
          ...devicesyncFormData,
          selecteddevice: value, // Update with the selected values
        });
      }
    } else {
      setDevicesyncFormData({
        ...devicesyncFormData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const validateDeviceSyncForm = () => {
    let errors = {};
    if (devicesyncFormData.selecteddevice.length == 0) {
      errors.selecteddevice ="Alleast need to select one device for device sync.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSyncFormSubmit = async () => {
    if (validateDeviceSyncForm()) {
      console.log("handleSyncFormSubmit:::" + JSON.stringify(devicesyncFormData));
      fetch(`${process.env.REACT_APP_API_BASE_URL}/user/updateuserflag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(devicesyncFormData),
      })
        .then((response) => {
          if (response.ok) {
            showSnackbar("Sync command flag successfully.", "success");
            handleSyncClearForm();
            setSelectedTab(0);
            fetchUserDetails();
          } else {
            showSnackbar("Error in Sync command flag.", "error");
            throw new Error("Failed to add user.");
          }
        })
        .catch((error) =>
          showSnackbar("Error in submitting form:" + error, "error")
        );
    }
  };

  const handleSyncClearForm = () => {
    setDevicesyncFormData({
      userId: id,
      setUserData: false,
      setFingerData: false,
      setFaceData: false,
      setUserPhoto: false,
      getUserData: false,
      getFingerData: false,
      getFaceData: false,
      getUserPhoto: false,
      selecteddevice: [],
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
              User: {id}
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
            sx={{ pr: 3 }}
          >
            <IconButton aria-label="back" onClick={() => navigate("/users")}>
              <ArrowBackRoundedIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/* Top Section */}
        <Grid item xs={12}>
          {/* Tabs Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: { xs: "flex", md: "block" },
                flexDirection: "row",
                width: { xs: "100%", md: "10%" },
                backgroundColor: "#f5f5f5",
                padding: { xs: "10px 0", md: "10px 0" },
                borderRight: { md: "1px solid #ddd" },
                borderBottom: { xs: "1px solid #ddd", md: "none" },
              }}
            >
              <Box
                sx={{
                  padding: { xs: "10px", md: "15px 20px" },
                  cursor: "pointer",
                  color: selectedTab === 0 ? "primary.main" : "text.secondary",
                  fontWeight: selectedTab === 0 ? "bold" : "normal",
                  borderBottom:
                    selectedTab === 0 ? "2px solid #1976d2" : "none",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
                onClick={() => setSelectedTab(0)}
              >
                User Info
              </Box>
              <Box
                sx={{
                  padding: { xs: "10px", md: "15px 20px" },
                  cursor: "pointer",
                  color: selectedTab === 1 ? "primary.main" : "text.secondary",
                  fontWeight: selectedTab === 1 ? "bold" : "normal",
                  borderBottom:
                    selectedTab === 1 ? "2px solid #1976d2" : "none",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
                onClick={() => setSelectedTab(1)}
              >
                Finger Info
              </Box>
              <Box
                sx={{
                  padding: { xs: "10px", md: "15px 20px" },
                  cursor: "pointer",
                  color: selectedTab === 2 ? "primary.main" : "text.secondary",
                  fontWeight: selectedTab === 2 ? "bold" : "normal",
                  borderBottom:
                    selectedTab === 2 ? "2px solid #1976d2" : "none",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
                onClick={() => setSelectedTab(2)}
              >
                User Sync
              </Box>
            </Box>

            <Box
              sx={{
                width: { xs: "100%", md: "90%" },
                padding: "10px",
              }}
            >
              {selectedTab === 0 && (
                <Box>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    rowSpacing={1}
                    sx={{ pt: 1, pb: 1 }}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={12}>
                      <Paper sx={{ p: 1 }}>
                        {/** Controlpanel Grid */}
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          sx={{
                            ml: 0,
                          }}
                        >
                          {/* Left-Aligned Search Field */}
                          <Grid item xs={6} sm={6} md={6} lg={6}>
                            <Typography
                              sx={{
                                display: "inline-block", // Ensures background only wraps around the text
                                backgroundColor: "lightgray", // Background color for the text
                                color: "black", // Optional: Text color for better contrast
                                borderRadius: "4px", // Optional: Rounding for better aesthetics
                                px: 1, // Horizontal padding for spacing inside the background
                                mb: 2,
                              }}
                            >
                              User Info
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
                            <Button
                              sx={{ m: 0 }}
                              variant="contained"
                              color="primary"
                              size="medium"
                              startIcon={<EditNoteIcon />}
                              onClick={handleFormSubmit}
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="flex-start"
                            >
                              Edit
                            </Button>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                          {/* First Three Rows */}
                          <Grid item container spacing={2} xs={12} md={6}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="User ID"
                                name="userId"
                                value={formData.userId}
                                onChange={handleInputChange}
                                error={!!errors.userId}
                                helperText={errors.userId}
                                variant="outlined"
                                disabled
                              />
                            </Grid>

                            <Grid item xs={12}>
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

                            {/* Third Row - Department */}
                            <Grid item xs={12}>
                              <FormControl
                                fullWidth
                                error={!!errors.departmentId}
                              >
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
                                <FormHelperText>
                                  {errors.departmentId}
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
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
                                <FormHelperText>
                                  {errors.privilege}
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
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

                          {/* Image Box */}
                          <Grid item container spacing={2} xs={12} md={6}>
                            <Grid
                              item
                              xs={12}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "200px",
                                  height: "200px",
                                  backgroundColor: "#f5f5f5",
                                  border: "1px solid #ddd",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  textAlign: "center",
                                }}
                              >
                                {imageSrc ? (
                                  <img
                                    src={imageSrc}
                                    alt="User Photo"
                                    style={{
                                      maxWidth: "100%",
                                      maxHeight: "100%",
                                    }}
                                  />
                                ) : (
                                  <PersonIcon
                                    sx={{
                                      fontSize: 80,
                                      color: "text.secondary",
                                    }}
                                  />
                                )}
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <FormControl
                                sx={{
                                  m: 1,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  textAlign: "center",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  startIcon={<UploadFileIcon />}
                                  disabled
                                >
                                  Upload Photo
                                </Button>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper sx={{ p: 1 }}>
                        {/* Label at the top-left corner */}
                        <Typography
                          sx={{
                            display: "inline-block", // Ensures background only wraps around the text
                            backgroundColor: "lightgray", // Background color for the text
                            color: "black", // Optional: Text color for better contrast
                            borderRadius: "4px", // Optional: Rounding for better aesthetics
                            px: 1, // Horizontal padding for spacing inside the background
                            mb: 2,
                          }}
                        >
                          Additional Info
                        </Typography>

                        <Grid container spacing={2}>
                          {additionalUserInfo.map((item, index) => {
                            const [key, value] = Object.entries(item)[0];
                            return (
                              <Grid item xs={12} sm={6}>
                                <Box
                                  sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    padding: "1px",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    variant="h10"
                                    sx={{
                                      display: "block",
                                      textAlign: "left",
                                      color: "text.secondary",
                                      pt: 1,
                                      pl: 1,
                                    }}
                                  >
                                    {key
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) =>
                                        str.toUpperCase()
                                      )}{" "}
                                    {/* Format key for readability */}
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: "bold",
                                      textAlign: "right",
                                      pr: 1,
                                    }}
                                  >
                                    {value}
                                  </Typography>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {selectedTab === 1 && (
                <Box>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    rowSpacing={1}
                    sx={{ pt: 1, pb: 1 }}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={12}>
                      <Paper sx={{ p: 1 }}>
                        {/* Label at the top-left corner */}
                        <Typography
                          sx={{
                            display: "inline-block", // Ensures background only wraps around the text
                            backgroundColor: "lightgray", // Background color for the text
                            color: "black", // Optional: Text color for better contrast
                            borderRadius: "4px", // Optional: Rounding for better aesthetics
                            px: 1, // Horizontal padding for spacing inside the background
                            mb: 2,
                          }}
                        >
                          Finger Info
                        </Typography>

                        <Grid container spacing={2}>
                          {/* Left Hand Column */}
                          <Grid item xs={6}>
                            {Array.from({ length: 5 }).map((_, index) => {
                              const fingerId = index + 6; // Finger IDs 6 to 10 (Left Hand)
                              const fingerData = userFingerInfo.find(
                                (finger) => finger.fingerId === fingerId
                              );

                              // Determine finger label
                              const fingerLabels = [
                                "Thumb",
                                "Index",
                                "Middle",
                                "Ring",
                                "Little",
                              ];
                              const fingerLabel = fingerLabels[index];

                              return (
                                <Box
                                  key={fingerId}
                                  sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    marginBottom: "8px",
                                    padding: "1px",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      display: "block",
                                      textAlign: "left",
                                      color: "text.secondary",
                                      pt: 1,
                                      pl: 1,
                                    }}
                                  >
                                    {`Left Hand - ${fingerLabel}`}
                                  </Typography>
                                  <Box
                                    sx={{
                                      padding: "1px",
                                      position: "relative", // For positioning the bottom-right text
                                      height: "50px", // Set a fixed height for proper alignment
                                    }}
                                  >
                                    {/* Icon in the center */}
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Tooltip
                                        title={
                                          fingerData?.fingerData
                                            ? "Fingerprint available"
                                            : "Fingerprint not available"
                                        }
                                        arrow
                                      >
                                        <FingerprintIcon
                                          sx={{
                                            fontSize: "30px",
                                            color: fingerData?.fingerData
                                              ? "primary.main"
                                              : "text.disabled",
                                          }}
                                        />
                                      </Tooltip>
                                    </Box>

                                    {/* Bottom-right text */}
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        bottom: "4px",
                                        right: "4px",
                                        textAlign: "right",
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: "text.secondary",
                                        }}
                                      >
                                        {fingerData
                                          ? fingerData.enrolled
                                            ? "Enrolled"
                                            : "Not Enrolled"
                                          : "Not Registered"}{" "}
                                        {fingerData
                                          ? fingerData.duress
                                            ? " / Duress"
                                            : " / Not Duress"
                                          : ""}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              );
                            })}
                          </Grid>

                          {/* Right Hand Column */}
                          <Grid item xs={6}>
                            {Array.from({ length: 5 }).map((_, index) => {
                              const fingerId = index + 1; // Finger IDs 1 to 5 (Right Hand)
                              const fingerData = userFingerInfo.find(
                                (finger) => finger.fingerId === fingerId
                              );

                              // Determine finger label
                              const fingerLabels = [
                                "Thumb",
                                "Index",
                                "Middle",
                                "Ring",
                                "Little",
                              ];
                              const fingerLabel = fingerLabels[index];

                              return (
                                <Box
                                  key={fingerId}
                                  sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    marginBottom: "8px",
                                    padding: "1px",
                                    position: "relative", // For positioning the bottom-right text
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      display: "block",
                                      textAlign: "left",
                                      color: "text.secondary",
                                      pt: 1,
                                      pl: 1,
                                    }}
                                  >
                                    {`Right Hand - ${fingerLabel}`}
                                  </Typography>
                                  <Box
                                    sx={{
                                      padding: "1px",
                                      position: "relative", // For positioning the bottom-right text
                                      height: "50px", // Set a fixed height for proper alignment
                                    }}
                                  >
                                    {/* Icon in the center */}
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Tooltip
                                        title={
                                          fingerData?.fingerData
                                            ? "Fingerprint available"
                                            : "Fingerprint not available"
                                        }
                                        arrow
                                      >
                                        <FingerprintIcon
                                          sx={{
                                            fontSize: "30px",
                                            color: fingerData?.fingerData
                                              ? "primary.main"
                                              : "text.disabled",
                                          }}
                                        />
                                      </Tooltip>
                                    </Box>

                                    {/* Bottom-right text */}
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        bottom: "4px",
                                        right: "4px",
                                        textAlign: "right",
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: "text.secondary",
                                        }}
                                      >
                                        {fingerData
                                          ? fingerData.enrolled
                                            ? "Enrolled"
                                            : "Not Enrolled"
                                          : "Not Registered"}{" "}
                                        {fingerData
                                          ? fingerData.duress
                                            ? " / Duress"
                                            : " / Not Duress"
                                          : ""}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              );
                            })}
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {selectedTab === 2 && (
                <Box>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    rowSpacing={1}
                    sx={{ pt: 1, pb: 1 }}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={12}>
                      <Paper sx={{ p: 1 }}>
                        {/* Header row */}
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          sx={{
                            ml: 0,
                          }}
                        >
                          {/* Left-Aligned Search Field */}
                          <Grid item xs={6} sm={6} md={6} lg={6}>
                            <Typography
                              sx={{
                                display: "inline-block", // Ensures background only wraps around the text
                                backgroundColor: "lightgray", // Background color for the text
                                color: "black", // Optional: Text color for better contrast
                                borderRadius: "4px", // Optional: Rounding for better aesthetics
                                px: 1, // Horizontal padding for spacing inside the background
                                mb: 2,
                              }}
                            >
                              User Sync
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
                            <Button
                              sx={{ m: 0 }}
                              variant="contained"
                              color="primary"
                              size="medium"
                              startIcon={<SyncIcon />}
                              onClick={handleSyncFormSubmit}
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="flex-start"
                            >
                              Update
                            </Button>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                          {/* First Three Rows */}
                          <Grid item container spacing={2} xs={12} md={6}>
                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={devicesyncFormData.setUserData || false}
                                      name="setUserData"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Set User Information"
                                />
                                <FormHelperText>
                                  Download the user: '{id}' information into
                                  selecting device(s).
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={devicesyncFormData.setFingerData || false}
                                      name="setFingerData"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Set User Finger Data"
                                />
                                <FormHelperText>
                                  Download the user: '{id}' registered
                                  fingerprits, which is available in server
                                  database into selecting device(s).
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={devicesyncFormData.setFaceData || false}
                                      name="setFaceData"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Set User Face Data"
                                />
                                <FormHelperText>
                                  Download the user: '{id}' available face data
                                  from server database into selecting device(s).
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={devicesyncFormData.setUserPhoto || false}
                                      name="setUserPhoto"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Set User Photo"
                                />
                                <FormHelperText>
                                  Download the user: '{id}' available photo from
                                  server database into selecting device(s).
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          </Grid>

                          {/* Get User data right side */}
                          <Grid item container spacing={2} xs={12} md={6}>
                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={devicesyncFormData.getUserData || false}
                                      name="getUserData"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Get User Information"
                                />
                                <FormHelperText>
                                  Uplaod the user: '{id}' information from
                                  selecting device(s) to server.
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={devicesyncFormData.getFingerData || false}
                                      name="getFingerData"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Get User Finger Data"
                                />
                                <FormHelperText>
                                  Upload the user: '{id}' fingerprits from
                                  registered device(s) into server.
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={devicesyncFormData.getFaceData || false}
                                      name="getFaceData"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Get User Face Data"
                                />
                                <FormHelperText>
                                  Upload the user: '{id}' face data from the
                                  selecting device(s) into the server.
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={devicesyncFormData.getUserPhoto || false}
                                      name="getUserPhoto"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Get User Photo"
                                />
                                <FormHelperText>
                                  Upload the user: '{id}' photo from selecting
                                  device(s) to server.
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ mt: 3, mb: 3 }}>
                          <Grid
                            item
                            xs={12}
                            md={12}
                            sx={{pr:10}}
                            container
                            justifyContent="flex-end" // Push all items to the right
                            alignItems="center"
                          >
                            <FormControl error={!!errors.selecteddevice}>
                              <InputLabel id="device-select-label">
                                Selecte Device
                              </InputLabel>
                              <Select
                                labelId="device-select-label"
                                id="device-select-select"
                                label="Selecte Device"
                                name="selecteddevice"
                                multiple
                                value={devicesyncFormData.selecteddevice}
                                onChange={handleDeviceSyncInputChange}
                                error={!!errors.selecteddevice}
                                helperText={errors.selecteddevice}
                                renderValue={(selected) => {
                                  if (selected.length === 0) {
                                    return (
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <PhoneAndroidIcon
                                          style={{ marginRight: 4 }}
                                        />
                                        Select Device
                                      </div>
                                    );
                                  }
                                  const selectedDevices = devicelist
                                    .filter((device) =>
                                      selected.includes(device.id)
                                    )
                                    .map((device) => device.label)
                                    .join(", ");
                                  return (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <PhoneAndroidIcon
                                        style={{ marginRight: 4 }}
                                      />
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
                                      devicesyncFormData.selecteddevice.length ===
                                      devicelist.length
                                    }
                                    indeterminate={
                                      devicesyncFormData.selecteddevice.length > 0 &&
                                      devicesyncFormData.selecteddevice.length <
                                        devicelist.length
                                    }
                                  />
                                  Select All
                                </MenuItem>
                                {devicelist.map((device) => (
                                  <MenuItem key={device.id} value={device.id}>
                                    <Checkbox
                                      checked={devicesyncFormData.selecteddevice.includes(
                                        device.id
                                      )}
                                    />
                                    {device.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>
                                {errors.selecteddevice}
                              </FormHelperText>
                              <FormHelperText>
                                User information will sync with selected
                                device(s).
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserEdit;
