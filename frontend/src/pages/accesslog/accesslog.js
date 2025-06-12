import React, { useState, useEffect } from "react";
import PageTitle from "../../component/PageTitle";
import DataTable from "../../component/DataTable";
import {
  Box,
  Grid,
  Tab,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  FormHelperText
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import axios from "axios";
import useSnackbar from "../../component/snackbar/useSnackbar";

const page_title = {
  title: "Access",
  navLinks: [{ link: "/dashboard", label: "Dashboard" }],
};

const AccessLog = () => {
  const showSnackbar = useSnackbar(); // Use the custom hook

  const [loading, setLoading] = useState(true); // Loading state
  const [props, setProps] = useState([]);

  const [tabvalue, setTabvalue] = React.useState("1");

  const [devicelist, setDevicelist] = useState([]);
  const [selecteddevice, setSelecteddevice] = useState("");

  const [timeLogColumns, setTimeLogColumns] = useState([]);
  const [timeLogRows, setTimeLogRows] = useState([]);
  const [timeError, setTimeError] = useState(null); // Error message

  const [adminLogColumns, setAdminLogColumns] = useState([]);
  const [adminLogRows, setAdminLogRows] = useState([]);
  const [adminError, setAdminError] = useState(null); // Error message

  const properties = {
    initialPageSize: 5,
    rowsPerPageOptions: [5, 10, 20, 50],
    checkboxSelection: false,
    initialSortKey: "logTime",
    initialSortKeyDirection: "desc", // 'asc' OR 'desc'
    searchQuery: "",
    searchColumns: [
      "userId",
      "userName",
      "action",
      "logTime",
      "deviceSerialNo",
    ],
    initialVisibleColumns: [
      "userId",
      "userName",
      "action",
      "logTime",
      "deviceSerialNo",
    ], // Initial columns to display
  };

  /**
   * initial useEffect
   */
  useEffect(() => {
    fetchDeviceList();
  }, []);

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
        setSelecteddevice(_deviceList[0].id); // Set the first device as default
      } else {
        showSnackbar("Device List is empty..", "error");
      }
    } catch (err) {
      setTimeError("Failed to fetch data. Please try again later.");
      console.error(err);
    }
  };

  /**
   *
   * @param {*} event
   */
  const handleDeviceChange = (event) => {
    const selectedDevice = event.target.value;
    setSelecteddevice(selectedDevice);
  };

  /**
   * initial useEffect
   */
  useEffect(() => {
    setProps(properties);
    fetchTimeLogList();
    fetchAdminLogList();
  }, [selecteddevice]);

  const fetchTimeLogList = async () => {
    try {
      if (!selecteddevice) {
        return;
      }
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/access/timelog/${selecteddevice}`
      );
      const inputdata = response.data;
      setLoading(false);
      if (inputdata.length > 0) {
        const keys = Object.keys(inputdata[0]);

        const cols = keys.map((key) => ({
          id: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          sort: [
            "userId",
            "userName",
            "action",
            "logTime",
            "deviceSerialNo",
          ].includes(key),
        }));
        let reorderedColumns = cols;
        if (properties.index && properties.index.indexField) {
          reorderedColumns = [
            ...cols.filter((col) => col.id === properties.index.indexField), // Ensure indexField column is first
            ...cols.filter((col) => col.id !== properties.index.indexField), // Add the rest of the columns
          ];
        }
        setTimeLogColumns(reorderedColumns);
        setTimeLogRows(inputdata);
      } else {
        setTimeLogRows([]);
        setTimeError("No records found.");
      }
    } catch (err) {
      setTimeError("Failed to fetch data. Please try again later.");
      console.error(err);
    }
  };

  const fetchAdminLogList = async () => {
    try {
      if (!selecteddevice) {
        return;
      }
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/access/adminlog/${selecteddevice}`
      );
      const inputdata = response.data;
      setLoading(false);
      if (inputdata.length > 0) {
        const keys = Object.keys(inputdata[0]);

        const cols = keys.map((key) => ({
          id: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          sort: [
            "userId",
            "userName",
            "action",
            "logTime",
            "deviceSerialNo",
          ].includes(key),
        }));
        let reorderedColumns = cols;
        if (properties.index && properties.index.indexField) {
          reorderedColumns = [
            ...cols.filter((col) => col.id === properties.index.indexField), // Ensure indexField column is first
            ...cols.filter((col) => col.id !== properties.index.indexField), // Add the rest of the columns
          ];
        }
        setAdminLogColumns(reorderedColumns);
        setAdminLogRows(inputdata);
      } else {
        setAdminLogRows([]);
        setAdminError("No records found.");
      }
    } catch (err) {
      setAdminError("Failed to fetch data. Please try again later.");
      console.error(err);
    }
  };

  /**
   * Tab onclick changes
   */
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Box role="presentation" sx={{ p: 0 }}>
      <PageTitle {...page_title} />

      <Grid
        container
        direction="row"
        justifycontent="center"
        alignitems="center"
        rowSpacing={1}
        sx={{ pt: 1, pb: 1 }}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <TabContext value={tabvalue}>
          {/** Top row for 'Tab(s)' & 'Device Dropdown' */}
          <Grid container direction="row" alignItems="center" sx={{ ml: 3 }}>
            {/* Left-Aligned Tabs */}
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <Box sx={{ borderBottom: 0, borderColor: "divider" }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Time Log" value="1" />
                  <Tab label="Admin Log" value="2" />
                </TabList>
              </Box>
            </Grid>

            {/* Right-Aligned Device Dropdown */}
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
              {/* Dropdown for Column Visibility */}
              <FormControl sx={{ m: 1 }}>
                <Select
                  value={selecteddevice}
                  onChange={handleDeviceChange}
                  renderValue={(selected) => {
                    // If no value is selected, default to the first device's label
                    const selectedDevice = devicelist.find(
                      (device) => device.id === selected
                    );
                    return (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <PhoneAndroidIcon style={{ marginRight: 4 }} />
                        {selectedDevice
                          ? selectedDevice.label
                          : "Select Device"}
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
                  {devicelist.map((device) => (
                    <MenuItem key={device.id} value={device.id}>
                      {device.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select Device to fetch logs</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          {/** Grid or new row for Time / Access log table */}
          <Grid item xs={12}>
            {/**
             *  Time Log table
             */}
            <TabPanel value="1" sx={{ m: 0, p: 0 }}>
              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <CircularProgress />
                </Box>
              ) : timeError ? (
                <Typography color="error">{timeError}</Typography>
              ) : (
                <DataTable
                  columns={timeLogColumns}
                  rows={timeLogRows}
                  props={props}
                />
              )}
            </TabPanel>

            <TabPanel value="2" sx={{ m: 0, p: 0 }}>
              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <CircularProgress />
                </Box>
              ) : adminError ? (
                <Typography color="error">{adminError}</Typography>
              ) : (
                <DataTable
                  columns={adminLogColumns}
                  rows={adminLogRows}
                  props={props}
                />
              )}
            </TabPanel>
          </Grid>
        </TabContext>
      </Grid>
    </Box>
  );
};

export default AccessLog;
