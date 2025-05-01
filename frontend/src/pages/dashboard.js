import Widgets from "../component/Widgets.js";
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { LineChart } from "@mui/x-charts/LineChart";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PageTitle from "../component/PageTitle";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const page_title = {
  title: "Dashboard",
  navLinks: [{ link: "/dashboard", label: "Dashboard", hidden: true }],
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [widgetsData, setWidgetsData] = useState([]);
  const [deviceLogColumnData, setDeviceLogColumnData] = useState([]);
  const [deviceLogData, setDeviceLogData] = useState([]);
  const [timeLogColumnData, setTimeLogColumnData] = useState([]);
  const [timeLogData, setTimeLogData] = useState([]);

  useEffect(() => {
    fetchWidgetsData();
    fetchDevicelogData();
    fetchTimelogData();
  }, []);

  const fetchWidgetsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8999/api/dashboard/widgets"
      );
      setLoading(false);
      const inputdata = response.data;
      if (inputdata.length > 0) {
        setWidgetsData(inputdata);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDevicelogData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8999/api/dashboard/devicelog"
      );
      setLoading(false);
      const inputdata = response.data;
      if (inputdata.length > 0) {
        const keys = Object.keys(inputdata[0]);
        const cols = keys.map((key) => ({
          label: key.charAt(0).toUpperCase() + key.slice(1),
        }));
        setDeviceLogColumnData(cols);
        setDeviceLogData(inputdata);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTimelogData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8999/api/dashboard/timelog"
      );
      setLoading(false);
      const inputdata = response.data;
      if (inputdata.length > 0) {
        const keys = Object.keys(inputdata[0]);
        const cols = keys.map((key) => ({
          label: key.charAt(0).toUpperCase() + key.slice(1),
        }));
        setTimeLogColumnData(cols);
        setTimeLogData(inputdata);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box role="presentation" width={"100%"} sx={{ p: 0 }}>
      <PageTitle {...page_title} />

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        rowSpacing={2}
        sx={{ mt: 1, mb: 2 }}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        {/** Widgetes */}
        {widgetsData.map((widget) => (
          <Grid item xs={12} md={3} lg={3}>
            <Widgets props={widget} />
          </Grid>
        ))}

        {/** Device ping Log */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 400,
            }}
          >
            <Typography
              component="h2"
              variant="h5"
              color="primary"
              gutterBottom
            >
              Latest Devicel ping
            </Typography>
            {deviceLogData.length == 0 ? (
              <div> No data found...</div>
            ) : (
              <TableContainer component={Paper}>
                <Table fullWidth aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {deviceLogColumnData.map((column) => (
                        <TableCell align="left">{column.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deviceLogData.map((row) => (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {row.deviceSerialNo}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.deviceTime}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.productName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/** latest Time Log */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 400,
            }}
          >
            <Typography
              component="h2"
              variant="h5"
              color="primary"
              gutterBottom
            >
              Latest Time Log
            </Typography>
            {timeLogData.length == 0 ? (
              <div> No data found...</div>
            ) : (
              <TableContainer component={Paper}>
                <Table fullWidth aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {timeLogColumnData.map((column) => (
                        <TableCell align="left">{column.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {timeLogData.map((row) => (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {row.deviceSerialNo}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.userId}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.time}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
