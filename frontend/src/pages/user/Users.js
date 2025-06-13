import React, { useState, useEffect } from "react";
import PageTitle from "../../component/PageTitle";
import DataTable from "../../component/DataTable";
import { Box, Grid, Typography, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../utils/axiosInstance";
import useSnackbar from "../../component/snackbar/useSnackbar";
import AlertDialog from "../../component/alertdialog";

const page_title = {
  title: "Users",
  navLinks: [{ link: "/dashboard", label: "Dashboard" }],
};

const Users = () => {
  const navigate = useNavigate();

  const [pageTitle, setPageTitle] = useState(page_title); // Loading state

  const [loading, setLoading] = useState(true); // Loading state
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [props, setProps] = useState([]);
  const [error, setError] = useState(null); // Error message

  const [selectedRows, setSelectedRows] = useState(null); // Selected Row for Delete
  const showSnackbar = useSnackbar(); // Use the custom hook
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation dialog
  const [deleteFromDevices, setDeleteFromDevices] = useState(false); // State for toggle switch

  // Set columns and rows based on fetched users
  useEffect(() => {
    fetchData();
  }, []); // Update rows and columns when users change

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        "/user"
      );
      const inputdata = response.data;
      if (inputdata.length > 0) {
        const keys = Object.keys(inputdata[0]);

        const properties = {
          initialPageSize: 5,
          rowsPerPageOptions: [5, 10, 20],
          checkboxSelection: true,
          checkboxSelectionId: "userId",
          initialSortKey: "userId",
          initialSortKeyDirection: "asc", // 'asc' OR 'desc'
          searchQuery: "",
          searchColumns: [
            "userId",
            "username",
            "privilege",
            "enabled",
            "departmentId",
          ],
          index: {
            indexField: "userId",
            routerPath: "/useredit/",
          },
          initialVisibleColumns: [
            "userId",
            "username",
            "privilege",
            "enabled",
            "departmentId",
            "faceDataAvailable",
            "fingerDataAvailable",
            "photoDataAvailable",
          ],
        };

        const cols = keys.map((key) => ({
          id: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
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
    const useId = selectedRows[0];
    setOpenDeleteDialog(false); // Close the dialog
    try {
      setLoading(true);
      const response = await axiosInstance.delete(
        `/user/${useId}`,
        { data: { deleteFromDevices } } // Pass the toggle state
      );
      setLoading(false);
      if (response.status === 200) {
        showSnackbar("User deleted successfully.", "success");
      } else {
        showSnackbar(
          `Unexpected status: ${response.status}. Please try again.`,
          "error"
        );
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      showSnackbar(
        "Failed to delete user. Please check your connection or try again.",
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
              onClick={() => navigate("/useradd")}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={openDeleteDialog}
        title="Delete Confirmation"
        message="Are you sure you want to delete the selected record?"
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        withToggle={true}
        toggleLabel="Note: Do you need to delete from devices also ?."
        onToggleChange={setDeleteFromDevices}
        toggleValue={deleteFromDevices}
      />
    </Box>
  );
};

export default Users;
