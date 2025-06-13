import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import axiosInstance from "../../utils/axiosInstance";
import useSnackbar from "../../component/snackbar/useSnackbar";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PersonIcon from "@mui/icons-material/Person";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import SyncIcon from "@mui/icons-material/Sync";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import { LineChart } from "@mui/x-charts/LineChart";
import { Chart } from "chart.js";

const page_title = {
  title: "Info",
  navLinks: [
    { link: "/dashboard", label: "Dashboard" },
    { link: "/device", label: "Devices" },
  ],
};

const DeviceForm = ({ isEditMode }) => {
  const navigate = useNavigate();

  const { id } = useParams(); // Extract the `id` from the URL

  const [pageTitle, setPageTitle] = useState(page_title); // Loading state
  const showSnackbar = useSnackbar(); // Use the custom hook
  const [loading, setLoading] = useState(true); // Loading state
  const [errors, setErrors] = useState({});

  const [selectedTab, setSelectedTab] = useState(0);

  const [data, setData] = useState([]);
  const [timePeriod, setTimePeriod] = useState("1d");

  const [devicelist, setDevicelist] = useState([]);

  const [deviceInfo, setDeviceInfo] = useState([]);

  const timePeriods = [
    { label: "5 minutes", value: "5m" },
    { label: "15 minutes", value: "15m" },
    { label: "30 minutes", value: "30m" },
    { label: "1 hour", value: "1h" },
    { label: "5 hours", value: "5h" },
    { label: "12 hours", value: "12h" },
    { label: "1 day", value: "1d" },
    { label: "2 days", value: "2d" },
    { label: "5 days", value: "5d" },
    { label: "15 days", value: "15d" },
    { label: "30 days", value: "30d" },
  ];

  useEffect(() => {
    fetchDeviceInfoDetails();
    fetchGraphData();
  }, [timePeriod]);

  const fetchGraphData = async () => {
    setLoading(true);
    try {
      const end = dayjs();
      const start = end.subtract(
        parseInt(timePeriod),
        timePeriod.includes("m") ? "minute" : "day"
      );
      const response = await axiosInstance.get(
        `/device/${id}/logs`,
        { params: { start: start.toISOString(), end: end.toISOString() } }
      );
      setData(
        response.data.map((d) => ({
          x: dayjs(d.deviceTime).toDate(),
          y: 1, // Assuming '1' represents "Connected"
        }))
      );
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchDeviceInfoDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/device/${id}`
      );
      setLoading(false);
      const inputdata = response.data;
      if (inputdata) {
        const excludedKeys = ["id"];
        const result = Object.entries(inputdata)
          .filter(([key]) => !excludedKeys.includes(key))
          .map(([key, value]) => ({ [key]: value }));
        setDeviceInfo(result);
      } else {
        showSnackbar("No Device data found. Try again.", "warning");
      }
    } catch (err) {
      showSnackbar("Failed to fetch 'device' data.", "error");
      console.error(err);
    }
  };

  const fetchDeviceList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/device`
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

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  /** ***************************** */
  const [devicesyncFormData, setDevicesyncFormData] = useState({
    deviceSerialNo: id,
    getDepartment: false,
    setDepartment: false,
    emptyTimeLog: false,
    emptyManageLog: false,
    emptyAllData: false,
    emptyUserEnrollmentData: false,
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

  const handleSyncFormSubmit = async () => {
    console.log("handleSyncFormSubmit:::" + JSON.stringify(devicesyncFormData));
    fetch("${process.env.REACT_APP_API_BASE_URL}/device/updatedeviceflag", {
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
        } else {
          showSnackbar("Error in Sync command flag.", "error");
          throw new Error("Failed to add user.");
        }
      })
      .catch((error) =>
        showSnackbar("Error in submitting form:" + error, "error")
      );
  };

  const handleSyncClearForm = () => {
    setDevicesyncFormData({
      deviceSerialNo: id,
      getDepartment: false,
      setDepartment: false,
      emptyTimeLog: false,
      emptyManageLog: false,
      emptyAllData: false,
      emptyUserEnrollmentData: false,
    });
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
              Device No: {id}
            </Typography>
          </Grid>

          {/* Right-Aligned Buttons and Icons */}
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
            container
            justifyContent="flex-end"
            alignItems="center"
            sx={{ pr: 3 }}
          >
            <IconButton aria-label="back" onClick={() => navigate("/device")}>
              <ArrowBackRoundedIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/** Screen Body */}
        <Grid item xs={12}>
          {/* Tabs Main Section */}
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
                Device Info
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
                Monitor
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
                Device Sync
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
                              Device Info
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
                          ></Grid>
                        </Grid>

                        <Grid container spacing={2}>
                          {deviceInfo.map((item, index) => {
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
                        {/** Controlpanel Grid */}
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          sx={{
                            ml: 0,
                            mt: 1,
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
                              Device Status
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
                            <FormControl
                              fullWidth
                              error={!!errors.departmentId}
                            >
                              <InputLabel id="time-period-select-label">
                                Time Period
                              </InputLabel>
                              <Select
                                labelId="time-period-select-label"
                                id="time-period-select"
                                label="Time Period"
                                name="timeperiod"
                                value={timePeriod}
                                onChange={handleTimePeriodChange}
                                renderValue={(selected) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <AccessAlarmIcon sx={{ mr: 1 }} />
                                    {
                                      timePeriods.find(
                                        (tp) => tp.value === selected
                                      )?.label
                                    }
                                  </Box>
                                )}
                              >
                                {timePeriods.map((tp) => (
                                  <MenuItem key={tp.value} value={tp.value}>
                                    {tp.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>
                                Select time range to check the device status.
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                          {/* First Three Rows */}
                          <Grid item container spacing={2} xs={12}>
                            <Grid item xs={12}>
                              {/** Graph here.... */}
                              {loading ? (
                                <CircularProgress />
                              ) : (
                                <Box sx={{ mt: 4 }}>
                                  <LineChart
                                    xAxis={[
                                      {
                                        data: data.map((point) => point.x),
                                        scaleType: "time",
                                        label: "Time",
                                      },
                                    ]}
                                    series={[
                                      {
                                        data: data.map((point) => point.y),
                                        label: "Device Status",
                                      },
                                    ]}
                                    height={400}
                                  />
                                </Box>
                              )}
                            </Grid>
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
                              Device Sync
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
                                      checked={
                                        devicesyncFormData.getDepartment ||
                                        false
                                      }
                                      name="getDepartment"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Upload Deparments"
                                />
                                <FormHelperText>
                                  Upload the department list from the device: '
                                  {id}' to server.
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={
                                        devicesyncFormData.emptyTimeLog || false
                                      }
                                      name="emptyTimeLog"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Empty Time Log"
                                />
                                <FormHelperText>
                                  Clear the time logs from the device: '{id}'.
                                  Note: Once it is cleared can't recover.
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={
                                        devicesyncFormData.emptyManageLog ||
                                        false
                                      }
                                      name="emptyManageLog"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Empty Admin Log"
                                />
                                <FormHelperText>
                                  Clear the Admin logs from the device: '{id}'.
                                  Note: Once it is cleared can't recover.
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
                                      checked={
                                        devicesyncFormData.setDepartment ||
                                        false
                                      }
                                      name="setDepartment"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Download Departments"
                                />
                                <FormHelperText>
                                  Download the list of departments into the
                                  device: '{id}'.
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={
                                        devicesyncFormData.emptyUserEnrollmentData ||
                                        false
                                      }
                                      name="emptyUserEnrollmentData"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Empty Enrolled User Data"
                                />
                                <FormHelperText>
                                  Clear the list of Enrolled user data from the
                                  device: '{id}'. Note: Once it is cleared can't
                                  recover.
                                </FormHelperText>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={
                                        devicesyncFormData.emptyAllData || false
                                      }
                                      name="emptyAllData"
                                      onChange={handleDeviceSyncInputChange}
                                    />
                                  }
                                  label="Empty All Data"
                                />
                                <FormHelperText>
                                  Clear the all 3 logs 'Time Log', 'Admin Log'
                                  and 'Enrolled Data' from the device: '{id}'.
                                  Note: Once it is cleared can't recover.
                                </FormHelperText>
                              </FormControl>
                            </Grid>
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

export default DeviceForm;
