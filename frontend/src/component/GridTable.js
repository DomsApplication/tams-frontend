import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Paper, Typography } from "@mui/material";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    minWidth: 110,
    flex: 1,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    minWidth: 110,
    flex: 1,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    minWidth: 110,
    flex: 1,
    editable: true,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  { id: 10, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 11, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 12, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 13, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 14, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 15, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 16, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 17, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 18, lastName: "Roxie", firstName: "Harvey", age: 65 },
  { id: 19, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 20, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 21, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 22, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const GridTable = () => {
  return (
    <>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: 630,
        }}
      >
        <Typography component="h2" variant="h5" color="primary" gutterBottom>
          Table
        </Typography>
        <div style={{ height:570, width: '99%'}}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
            getRowHeight={() => "auto"}
            slots={{ toolbar: GridToolbar }}
            sx={{
              [`& .MuiDataGrid-cell`]: {
                paddingTop: .5,
                paddingBottom: .5,
                alignContent: "center",
                lineHeight: "unset !important",
                maxHeight: "none !important",
                whiteSpace: "normal",
              },
              [`& .MuiDataGrid-columnHeader`]: {
                maxHeight: "none !important",
                height: "auto !important",
                whiteSpace: "inherit !important",
                overflow: "inherit !important",
                lineHeight: "24px !important",
              },
              [`& .MuiDataGrid-columnHeaderTitle`]: {
                whiteSpace: "normal !important",
              },
            }}
          />
        </div>
      </Paper>
    </>
  );
};

export default GridTable;
