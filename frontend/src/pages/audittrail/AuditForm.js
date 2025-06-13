import React, { useState, useEffect } from "react";
import PageTitle from "../../component/PageTitle";
import DataTable from "../../component/DataTable";
import { Box, Grid, Typography, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, Link, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../utils/axiosInstance";

const page_title = {
  title: "Trace",
  navLinks: [
    { link: "/dashboard", label: "Dashboard" },
    { link: "/audit", label: "Audit Trail" },
  ],
};

const AuditForm = () => {
  const navigate = useNavigate();

  const { id } = useParams(); // Extract the `id` from the URL

  const [pageTitle, setPageTitle] = useState(page_title); // Loading state

  const [loading, setLoading] = useState(true); // Loading state
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [props, setProps] = useState([]);
  const [error, setError] = useState(null); // Error message

  // Set columns and rows based on fetched users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/audit/${id}`
        );
        const inputdata = response.data;
        if (inputdata.length > 0) {
          const keys = Object.keys(inputdata[0]);

          const properties = {
            initialPageSize: 5,
            rowsPerPageOptions: [5, 10],
            checkboxSelection: false,
            initialSortKey: "startTime",
            initialSortKeyDirection: "asc", // 'asc' OR 'desc'
            searchQuery: "",
            searchColumns: ["spanId", "createdOn", "deviceSerialNo", "command", "duration", "input", "output", "startTime"],
            initialVisibleColumns: ["spanId", "deviceSerialNo", "command", "duration", "input", "output", "startTime"], // Initial columns to display
          };

          const cols = keys.map((key) => ({
            id: key,
            label: key === "duration" ? key.charAt(0).toUpperCase() + key.slice(1)+"(ms)" : key.charAt(0).toUpperCase() + key.slice(1),
            sort: ["spanId", "duration", "startTime"].includes(key),
          }));

          let reorderedColumns = cols;
          if (properties.index && properties.index.indexField) {
            reorderedColumns = [
              ...cols.filter((col) => col.id === properties.index.indexField), // Ensure indexField column is first
              ...cols.filter((col) => col.id !== properties.index.indexField), // Add the rest of the columns
            ];
          }
          setColumns(reorderedColumns);
          setRows(inputdata);
          setProps(properties);
        } else {
          setRows([]);
          setError("No records found.");
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Update rows and columns when users change

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
        {/** Buttn Grid */}
        <Grid container direction="row" alignItems="center" sx={{ ml: 3 }}>
          {/* Left-Aligned Search Field */}
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <Typography
              component="h3"
              variant="h5"
              color="primary"
              sx={{ pl: 1, pt: 1 }}
              gutterBottom
            >
              {pageTitle.title}
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
            
          </Grid>
        </Grid>

        {/** Table Grid*/}
        <Grid item xs={12}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <DataTable columns={columns} rows={rows} props={props} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuditForm;
