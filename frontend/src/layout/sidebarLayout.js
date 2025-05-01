import React, { useState, useContext } from "react";
import { styled } from "@mui/material/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Close as CloseIcon, Logout } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TabletAndroidIcon from "@mui/icons-material/TabletAndroid";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import Util from "../utils/Util.js";
import { TenantContext } from "../App.js";

const SidebarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  height: "100vh", // Full viewport height for better space utilization
  padding: theme.spacing(1), // Add padding for better spacing

  [theme.breakpoints.up("lg")]: {
    width: 280,
    height: "100vh",
  },
  [theme.breakpoints.down("lg")]: {
    width: 250,
    height: "100vh",
  },
  [theme.breakpoints.down("md")]: {
    width: 250,
    height: "95vh",
    minHeight: "90vh",
  },
  [theme.breakpoints.down("sm")]: {
    width: 250,
    height: "95vh",
    minHeight: "90vh",
  },
}));

const SidebarTop = styled("div")({
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "4px",
  borderBottom: "2px solid lightgray",
});

const ScrollableList = styled("div")({
  flexGrow: 1,
  paddingBottom: 16,
  overflowY: "auto",
  overflowX: "hidden",
});

const BottomSection = styled("div")({
  flexShrink: 0,
  position: "relative",
  width: "100%",
  bottom: 0,
});

const BottomList = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: 0,
});

const UserProfile = styled("div")({
  width: "100%",
  padding: "10px 12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderTop: "1px solid lightgray",
});

function SidebarLayout({ open, onClose, onMenuSelect }) {
  const { userDetails } = useContext(TenantContext);
  const navigate = useNavigate();
  const [adminOpen, setAdminOpen] = useState(false);

  const handleLogout = () => {
    Util.removeCookies();
    navigate("/");
    window.location.reload();
  };

  const handleAdminClick = () => {
    setAdminOpen(!adminOpen);
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <Grid container direction="column">
        <Grid item>
          <SidebarContainer>
            {/************* Sidebar Top: *************/}
            <SidebarTop>
              <UserProfile>
                <Box display="flex" alignItems="center" width="100%">
                  <Avatar
                    alt="User Icon"
                    style={{ marginRight: 10, height: 36, width: 36 }}
                  >
                    {(() => {
                      const format = (name) =>
                        name && name.trim().length > 0
                          ? name[0].toUpperCase()
                          : "";
                      const fName = format(userDetails.firstName);
                      const lName = format(userDetails.lastName);
                      // Combine formatted first letter of firstName and lastName
                      return `${fName}${lName}`;
                    })()}
                  </Avatar>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body2" fontSize="0.9rem">
                      <b>{userDetails.userId}</b>
                    </Typography>
                    <Typography variant="caption">
                      {`${userDetails.firstName || ""} ${
                        userDetails.lastName || ""
                      }`.trim()}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  display="flex"
                  justifyContent="flex-end"
                  width="100%"
                  paddingTop="5px"
                >
                  <IconButton
                    size="small"
                    style={{
                      padding: "2px 8px",
                      border: "1px solid red",
                      borderRadius: "3px",
                    }}
                    onClick={handleLogout}
                  >
                    <Logout fontSize="small" style={{ marginRight: 4 }} />
                    <Typography variant="caption">Log Out</Typography>
                  </IconButton>
                </Box>
              </UserProfile>

              {/* Close Button aligned to the top-right */}
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </SidebarTop>

            {/************* Sidebar Menus: *************/}
            <ScrollableList>
              <ListItem
                button
                component={Link}
                to="/dashboard"
                onClick={onMenuSelect}
              >
                <HomeOutlinedIcon style={{ marginRight: 8 }} />
                <ListItemText primary="Dashboard" />
              </ListItem>

              {["admin", "user"].some(
                (role) => role === userDetails.role.toLowerCase()
              ) && (
                <ListItem
                  button
                  component={Link}
                  to="/device"
                  onClick={onMenuSelect}
                >
                  <TabletAndroidIcon style={{ marginRight: 8 }} />
                  <ListItemText primary="Device Management" />
                </ListItem>
              )}

              {["admin", "user"].some(
                (role) => role === userDetails.role.toLowerCase()
              ) && (
                <ListItem
                  button
                  component={Link}
                  to="/deparement"
                  onClick={onMenuSelect}
                >
                  <ManageAccountsIcon style={{ marginRight: 8 }} />
                  <ListItemText primary="Department" />
                </ListItem>
              )}

              {["admin", "user"].some(
                (role) => role === userDetails.role.toLowerCase()
              ) && (
                <ListItem
                  button
                  component={Link}
                  to="/users"
                  onClick={onMenuSelect}
                >
                  <ManageAccountsIcon style={{ marginRight: 8 }} />
                  <ListItemText primary="User Management" />
                </ListItem>
              )}

              {["admin"].some(
                (role) => role === userDetails.role.toLowerCase()
              ) && (
                <ListItem
                  button
                  component={Link}
                  to="/audit"
                  onClick={onMenuSelect}
                >
                  <ContentPasteSearchIcon style={{ marginRight: 8 }} />
                  <ListItemText primary="Audit Trail" />
                </ListItem>
              )}

              {["admin", "user"].some(
                (role) => role === userDetails.role.toLowerCase()
              ) && (
                <ListItem
                  button
                  component={Link}
                  to="/access"
                  onClick={onMenuSelect}
                >
                  <AccessAlarmsIcon style={{ marginRight: 8 }} />
                  <ListItemText primary="Access Log" />
                </ListItem>
              )}
            </ScrollableList>

            {/************* Sidebar Bottom: *************/}
            <BottomSection />
          </SidebarContainer>
        </Grid>
      </Grid>
    </Drawer>
  );
}

export default SidebarLayout;
