import React, { useState, useEffect } from "react";
import PageTitle from "../../component/PageTitle";
import DataTable from "../../component/DataTable";
import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../utils/axiosInstance";
import useSnackbar from "../../component/snackbar/useSnackbar";
import AlertDialog from "../../component/alertdialog";

const page_title = {
  title: "Department",
  navLinks: [{ link: "/dashboard", label: "Dashboard" }],
};

const Department = () => {
  const navigate = useNavigate();

  const [pageTitle, setPageTitle] = useState(page_title); // Loading state

  const [loading, setLoading] = useState(true); // Loading state
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [props, setProps] = useState([]);
  const [error, setError] = useState(null); // Error message

  const [openAddDialog, setOpenAddDialog] = useState(false); // Add Dialog State
  const [formData, setFormData] = useState({
    departmentId: "",
    departmentName: "",
  }); // Form State
  const [formErrors, setFormErrors] = useState({});
  const [selectedRows, setSelectedRows] = useState(null); // Selected Row for Delete
  const [datasync, setDatasync] = useState(false); // Add Dialog State

  const showSnackbar = useSnackbar(); // Use the custom hook
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation dialog

  // Set columns and rows based on fetched users
  useEffect(() => {
    fetchData();
  }, [datasync]); // Update rows and columns when users change

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/department"
      );
      setLoading(false);
      const inputdata = response.data;
      if (inputdata.length > 0) {
        const keys = Object.keys(inputdata[0]);

        const properties = {
          initialPageSize: 5,
          rowsPerPageOptions: [5, 10, 20],
          checkboxSelection: true,
          checkboxSelectionId: "departmentId",
          initialSortKey: "departmentId",
          initialSortKeyDirection: "asc", // 'asc' OR 'desc'
          searchQuery: "",
          searchColumns: ["departmentId", "departmentName"],
          initialVisibleColumns: ["departmentId", "departmentName"], // Initial columns to display
        };

        const cols = keys.map((key) => ({
          id: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          sort: ["departmentId", "departmentName"].includes(key),
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
      showSnackbar("Failed to fetch data. Please try again later.", "danger");
      console.error(err);
    }
  };

  // Open Add Dialog
  const handleAddOpen = () => {
    setFormData({ departmentId: "", departmentName: "" }); // Reset form
    setFormErrors({});
    setOpenAddDialog(true);
  };

  // Close Add Dialog
  const handleAddClose = () => {
    setOpenAddDialog(false);
  };

  // Handle Form Change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate Form
  const validateForm = () => {
    const errors = {};
    const regex = /^[a-zA-Z0-9_-]{3,15}$/;
    if (!formData.departmentId || !regex.test(formData.departmentId)) {
      errors.departmentId =
        "Department ID must be 3-15 alphanumeric characters, underscores, or hyphens.";
    }
    if (!formData.departmentName || !regex.test(formData.departmentName)) {
      errors.departmentName =
        "Department Name must be 3-15 alphanumeric characters, underscores, or hyphens.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Add Form
  const handleFormSubmit = async () => {
    if (validateForm()) {
      try {
        setOpenAddDialog(false);
        setLoading(true);
        const response = await axiosInstance.post(
          "/department",
          formData
        );
        setLoading(false);

        if (response.status === 200) {
          showSnackbar("Department created successfully.", "success");
        } else {
          showSnackbar(
            `Unexpected status: ${response.status}. Please try again.`,
            "error"
          );
        }
        fetchData();
      } catch (err) {
        console.error("Failed to add department:", err);
        showSnackbar(
          "Failed to create department. Please check your connection or try again.",
          "error"
        );
      }
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = () => {
    if (!selectedRows || selectedRows.length !== 1) {
      showSnackbar("Select exactly one record to delete.", "warning");
      return;
    }
    setOpenDeleteDialog(true); // Open the delete dialog
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false); // Close the dialog
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    const departmentId = selectedRows[0];
    setOpenDeleteDialog(false); // Close the dialog
    try {
      setLoading(true);
      const response = await axiosInstance.delete(
        `/department/${departmentId}`
      );
      setLoading(false);
      if (response.status === 200) {
        showSnackbar("Department deleted successfully.", "success");
      } else {
        showSnackbar(
          `Unexpected status: ${response.status}. Please try again.`,
          "error"
        );
      }
    } catch (err) {
      console.error("Failed to delete department:", err);
      showSnackbar(
        "Failed to delete department. Please check your connection or try again.",
        "error"
      );
    } finally {
      fetchData();
    }
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
        {/** Buttn Grid */}
        <Grid container direction="row" alignItems="center" sx={{ ml: 3 }}>
          {/* Left-Aligned Search Field */}
          <Grid item xs={6} sm={6} md={6} lg={6}>
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
              sx={{ m: 1 }}
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddOpen}
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              Add
            </Button>

            <Button
              sx={{ m: 1 }}
              variant="outlined"
              color="primary"
              size="medium"
              startIcon={<DeleteIcon />}
              onClick={handleOpenDeleteDialog}
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              Delete
            </Button>
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
            <DataTable
              columns={columns}
              rows={rows}
              props={{
                ...props,
                onSelectionChange: (selectedRows) =>
                  setSelectedRows(selectedRows), // Update selectedRows when selection changes
              }}
            />
          )}
        </Grid>
      </Grid>

      {/* Add Department Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleAddClose}
        fullWidth
        maxWidth="sm" // Adjust width as needed (e.g., "sm", "md", "lg", "xl")
        sx={{
          "& .MuiDialog-container": {
            alignItems: "flex-start", // Align to the top
          },
          "& .MuiPaper-root": {
            marginTop: "10vh", // Add margin from the top
          },
        }}
      >
        <DialogTitle>Add Department</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Department ID"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleFormChange}
            error={!!formErrors.departmentId}
            helperText={formErrors.departmentId}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Department Name"
            name="departmentName"
            value={formData.departmentName}
            onChange={handleFormChange}
            error={!!formErrors.departmentName}
            helperText={formErrors.departmentName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Close</Button>
          <Button onClick={handleFormSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={openDeleteDialog}
        title="Delete Confirmation"
        message="Are you sure you want to delete the selected record?"
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default Department;
