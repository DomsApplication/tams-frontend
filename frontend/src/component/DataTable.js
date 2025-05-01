import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  TableSortLabel,
  Checkbox,
  IconButton,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { Link } from "react-router-dom";

const DataTable = ({ columns, rows, props }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    props && props.initialPageSize ? props.initialPageSize : 10
  );
  const [searchColumn, setSearchColumn] = useState(
    props && props.searchColumns ? props.searchColumns : []
  );
  const [searchQuery, setSearchQuery] = useState(
    props && props.searchQuery ? props.searchQuery : ""
  );
  const [sortConfig, setSortConfig] = useState({
    key: props && props.initialSortKey ? props.initialSortKey : "",
    direction:
      props && props.initialSortKeyDirection
        ? props.initialSortKeyDirection
        : "asc",
  });

  const [filters, setFilters] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [temporaryFilters, setTemporaryFilters] = useState(
    Array(1).fill({ column: "", operation: "", value: "" })
  );

  const [selected, setSelected] = useState([]);

  const [visibleColumns, setVisibleColumns] = useState(
    props.initialVisibleColumns || columns.map((col) => col.id) // default to showing all columns
  );

  const handleFilterDialogOpen = () => {
    setFilterDialogOpen(true);
  };
  const handleFilterDialogClose = () => {
    setTemporaryFilters([{ column: "", operation: "", value: "" }]);
    setFilters([]); // Optionally, reset filters here too if needed
    setFilterDialogOpen(false);
  };

  const handleAddFilter = () => {
    setTemporaryFilters([
      ...temporaryFilters,
      { column: "", operation: "", value: "" },
    ]);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const setCheckBoxRowId = (row) => {
    const row_id =
      props.checkboxSelection !== null &&
      props.checkboxSelection === true &&
      props.checkboxSelectionId !== null
        ? row[props.checkboxSelectionId]
        : row.id;
    return row_id;
  };

  useEffect(() => {
    if (props.onSelectionChange) {
      props.onSelectionChange(selected);
    }
  }, [selected]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((row) => setCheckBoxRowId(row));
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = (columnId) => {
    const direction =
      sortConfig.key === columnId && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnId, direction });
  };

  const applyFilters = (rows) => {
    return rows.filter((row) => {
      return filters.every((filter) => {
        if (!filter.column || !filter.value) return true;
        const rowValue = row[filter.column]?.toString().toLowerCase();
        const filterValue = filter.value.toLowerCase();
        switch (filter.operation) {
          case "equals":
            return rowValue === filterValue;
          case "startsWith":
            return rowValue?.startsWith(filterValue);
          case "endsWith":
            return rowValue?.endsWith(filterValue);
          case "contains":
            return rowValue?.includes(filterValue);
          default:
            return true;
        }
      });
    });
  };

  const filteredAndSortedRows = React.useMemo(() => {
    let filteredRows = rows.filter((row) => {
      // If specific columns are provided for searching
      if (searchColumn && searchQuery) {
        // If multiple columns are selected for searching
        return searchColumn.some((col) => {
          const value = row[col]; // Check if any of the selected columns contain the search query
          return (
            value &&
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
      }
      // If no column is specified, the search will look in all columns
      return Object.values(row).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    // Apply filters
    filteredRows = applyFilters(filteredRows); // This applies the filter logic when the "Apply" button is clicked

    if (sortConfig.key) {
      filteredRows.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredRows;
  }, [rows, searchQuery, sortConfig, searchColumn, filters]);

  const handleColumnVisibilityChange = (event) => {
    const selectedColumns = event.target.value;
    setVisibleColumns(selectedColumns);
  };

  const handleFilterChange = (index, field, value) => {
    console.log("handleFilterChange Before update:", temporaryFilters); // Log the state before the update

    // Make a copy of the temporaryFilters array to avoid direct mutation
    const updatedTemporaryFilters = [...temporaryFilters];

    // Update the specific field for the given row (index)
    updatedTemporaryFilters[index] = {
      ...updatedTemporaryFilters[index], // preserve other fields
      [field]: value, // update only the field being changed
    };

    // Update the state with the new filters array
    setTemporaryFilters(updatedTemporaryFilters);

    console.log("handleFilterChange After update:", updatedTemporaryFilters); // Log the state after the update
  };

  return (
    <Paper>
      <Grid
        container
        direction="row"
        alignItems="center"
        rowSpacing={0}
        sx={{ mt: 0, mb: 1 }}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        {/* Left-Aligned Search Field */}
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <TextField
            sx={{
              m: 1,
              width: {
                xs: "80%", // 80% width on extra-small screens
                sm: "70%", // 70% width on small screens
                md: "40%", // 50% width on medium screens
                lg: "40%", // 50% width on large screens
              },
            }}
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
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
          {/* Dropdown for Column Visibility */}
          <FormControl sx={{ m: 1 }}>
            <Select
              multiple
              value={visibleColumns}
              onChange={handleColumnVisibilityChange}
              renderValue={(selected) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ViewColumnIcon style={{ marginRight: 4 }} />{" "}
                  {`${selected.length} Columns`}
                </div>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    width: 200,
                  },
                },
              }}
            >
              {columns.map((column) => (
                <MenuItem key={column.id} value={column.id}>
                  <Checkbox checked={visibleColumns.indexOf(column.id) > -1} />
                  {column.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Filter Dropdown for table data */}
          <FormControl sx={{ m: 1 }}>
            <Select
              open={false} // Prevent dropdown from actually opening
              displayEmpty
              value="" // Placeholder value
              onClick={handleFilterDialogOpen} // Trigger the dialog on click
              renderValue={() => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FilterListIcon style={{ marginRight: 4 }} />
                  Filters
                </div>
              )}
              sx={{
                cursor: "pointer", // Ensure it feels clickable
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    width: 200,
                  },
                },
              }}
            />
          </FormControl>
        </Grid>
      </Grid>

      {/*****************  Filter Dialog *****************/}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        fullWidth
        maxWidth="md" // Adjust width as needed (e.g., "sm", "lg", "xl")
        sx={{
          "& .MuiDialog-container": {
            alignItems: "flex-start", // Align to the top
          },
          "& .MuiPaper-root": {
            marginTop: "10vh", // Add margin from the top
          },
        }}
      >
        <DialogTitle>Apply Filters</DialogTitle>
        <DialogContent>
          {temporaryFilters.map((filter, index) => {
            // Check the condition: not the first record and filter values are not empty
            return (
              <Grid
                container
                spacing={2}
                key={index}
                alignItems="center"
                sx={{ mb: 1, mt: 1 }}
              >
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>Column</InputLabel>
                    <Select
                      value={filter.column || ""} // Make sure filter.column is set to temporaryFilters[index].column
                      onChange={
                        (e) =>
                          handleFilterChange(index, "column", e.target.value) // Handle column change
                      }
                    >
                      {columns.map((col) => (
                        <MenuItem key={col.id} value={col.id}>
                          {col.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Operation</InputLabel>
                    <Select
                      value={filter.operation || ""} // Make sure filter.operation is set to temporaryFilters[index].operation
                      onChange={(e) =>
                        handleFilterChange(index, "operation", e.target.value)
                      }
                    >
                      <MenuItem value="equals">Equals</MenuItem>
                      <MenuItem value="startsWith">Starts With</MenuItem>
                      <MenuItem value="endsWith">Ends With</MenuItem>
                      <MenuItem value="contains">Contains</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    placeholder="Value"
                    value={filter.value || ""} // Make sure filter.value is set to temporaryFilters[index].value
                    onChange={(e) =>
                      handleFilterChange(index, "value", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={1}>
                  {index === temporaryFilters.length - 1 && (
                    <IconButton onClick={handleAddFilter} color="primary">
                      <AddCircleOutlineIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            );
          })}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleFilterDialogClose}>Clear</Button>
          <Button
            onClick={() => {
              setFilters(temporaryFilters); // Update the filters state only when "Apply" is clicked
              setFilterDialogOpen(false); // Apply filters and close dialog
            }}
            color="primary"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/** ************************ TABLE ************************ */}
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "lightgray" }}>
            <TableRow>
              {props.checkboxSelection === null ||
              props.checkboxSelection === true ? (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < rows.length
                    }
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ "aria-label": "select all users" }}
                  />
                </TableCell>
              ) : null}

              {columns.map(
                (column) =>
                  visibleColumns.includes(column.id) && (
                    <TableCell key={column.id}>
                      {column.sort === null || column.sort === true ? (
                        <TableSortLabel
                          active={sortConfig.key === column.id}
                          direction={sortConfig.direction}
                          onClick={() => handleSort(column.id)}
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAndSortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const row_id = setCheckBoxRowId(row);
                const isItemSelected = isSelected(row_id);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row_id}
                    selected={isItemSelected}
                  >
                    {props.checkboxSelection === null ||
                    props.checkboxSelection === true ? (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onClick={(event) =>
                            handleCheckboxClick(event, row_id)
                          }
                          inputProps={{
                            "aria-labelledby": `enhanced-table-checkbox-${index}`,
                          }}
                        />
                      </TableCell>
                    ) : null}

                    {columns.map(
                      (column) =>
                        visibleColumns.includes(column.id) && (
                          <TableCell key={column.id}>
                            {props.index &&
                            props.index.indexField === column.id ? (
                              <Link
                                to={`${props.index.routerPath}${
                                  row[column.id]
                                }`}
                              >
                                {row[column.id]}
                              </Link>
                            ) : typeof row[column.id] === "boolean" ? (
                              row[column.id] ? (
                                "Yes"
                              ) : (
                                "No"
                              )
                            ) : (
                              row[column.id]
                            )}
                          </TableCell>
                        )
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={props.rowsPerPageOptions}
        component="div"
        count={filteredAndSortedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;
