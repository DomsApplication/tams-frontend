import React, { useState, useEffect, useCallback } from "react";
import PageTitle from "../../component/PageTitle";
import DataTable from "../../component/DataTable";
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const page_title = {
  title: "Devices",
  navLinks: [{ link: "/dashboard", label: "Dashboard" }],
};

const DeviceList = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("registered");
  const [pageTitle] = useState(page_title);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [props, setProps] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        filter === "registered"
          ? "/device/registered"
          : "/device/unregistered";
      const response = await axiosInstance.get(url);
      const inputdata = response.data;

      if (inputdata.length > 0) {
        const keys = Object.keys(inputdata[0]);

        const properties = {
          initialPageSize: 5,
          rowsPerPageOptions: [5, 10, 20],
          checkboxSelection: true,
          initialSortKey: "deviceSerialNo",
          initialSortKeyDirection: "asc",
          searchQuery: "",
          searchColumns: ["deviceSerialNo", "productName", "status"],
          index: {
            indexField: "deviceSerialNo",
            routerPath: "/device/",
          },
          initialVisibleColumns: [
            "deviceSerialNo",
            "cloudId",
            "productName",
            "terminalType",
            "status",
            "registeredOn",
            "actions",
          ],
        };

        const cols = keys.map((key) => ({
          id: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          sort: ["deviceSerialNo", "status", "registeredOn"].includes(key),
        }));

        cols.push({
          id: "actions",
          label: "",
          sort: false,
        });

        const updatedData = inputdata.map((row) => ({
          ...row,
          actions: (
            <RegisterActionButton
              row={row}
              onRegisterSuccess={fetchData}
              filter={filter}
            />
          ),
        }));

        setColumns(cols);
        setRows(updatedData);
        setProps(properties);
        setError(null);
      } else {
        setRows([]);
        setError("No devices found for the selected filter.");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box role="presentation" sx={{ p: 0 }}>
      <PageTitle {...page_title} />

      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 3, mb: 2 }}
      >
        <Grid item>
          <Typography
            component="h3"
            variant="h5"
            color="primary"
            sx={{ pl: 1 }}
            gutterBottom
          >
            {pageTitle.title}
          </Typography>
        </Grid>

        <Grid item>
          <Box display="flex" gap={2} alignItems="center">
            <FormControl size="small" variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Filter"
              >
                <MenuItem value="registered">Registered Devices</MenuItem>
                <MenuItem value="unregistered">Unregistered Devices</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              disabled
            >
              Add
            </Button>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<DeleteIcon />}
              disabled
            >
              Delete
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ px: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <Typography variant="h6" color="textSecondary">
              {error}
            </Typography>
          </Box>
        ) : (
          <DataTable columns={columns} rows={rows} props={props} />
        )}
      </Grid>
    </Box>
  );
};

export default DeviceList;

// -----------------------
// Register Button Component with Icon and Confirmation
// -----------------------

const RegisterActionButton = ({ row, onRegisterSuccess, filter }) => {
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleConfirmOpen = () => {
    setOpenConfirm(true);
  };

  const handleConfirmClose = () => {
    setOpenConfirm(false);
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      await axiosInstance.post("/device/register", {
        deviceSerialNo: row.deviceSerialNo,
      });
      onRegisterSuccess(); // Refresh based on current filter
    } catch (error) {
      console.error("Device registration failed", error);
    } finally {
      setLoading(false);
      handleConfirmClose();
    }
  };

  if (filter === "registered") {
    return (
      <Typography variant="body2" color="success.main">
        ✔ Registered
      </Typography>
    );
  }

  return (
    <>
      <IconButton
        color="primary"
        onClick={handleConfirmOpen}
        disabled={loading}
        title="Register device"
      >
        <HowToRegIcon />
      </IconButton>

      <Dialog open={openConfirm} onClose={handleConfirmClose}>
        <DialogTitle>
          Confirm registration for device <strong>{row.deviceSerialNo}</strong>?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleRegister}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Registering..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
