import React, { useState } from "react";
import HeadLayout from "./headerLayout.js";
import SidebarLayout from "./sidebarLayout.js";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Copyright from "../pages/Copyright.js";

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuSelect = () => {
    setDrawerOpen(false); // Close the sidebar when a menu is selected
  };

  return (
    <>
      <HeadLayout toggle={handleDrawerToggle}></HeadLayout>
      <SidebarLayout
        open={drawerOpen}
        onClose={handleDrawerToggle}
        onMenuSelect={handleMenuSelect}
      />
      <div style={{ width: "100%" }}>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            overflow: "auto",
            pt: "70px",
            pl: "20px",
            pr: "20px",
            pb: "20px",
          }}
        >
          <Outlet />
          <Copyright sx={{ pt: 4 }} />
        </Box>
      </div>
    </>
  );
};

export default MainLayout;
