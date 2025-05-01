import React, { useState, useEffect } from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";

const Widgets = ({ props }) => {

  const [properties, setProperties] = useState(props);

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        height: 100,
      }}
    >
      <CardContent>
        <Typography component="h2" variant="h5" color="primary" gutterBottom>
          <Box display="flex" justifyContent="end" sx={{ p: 0.3 }}>
            <Badge badgeContent={properties.count} color="primary" />
          </Box>
          {properties.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {properties.description}
        </Typography>
      </CardContent>
    </Paper>
  );
};

export default Widgets;
