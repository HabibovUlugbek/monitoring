import React, { useState } from "react";
import {
  Menu as MenuIcon,
  Search,
  ArrowDropDownOutlined,
  AccountCircleOutlined,
  NotificationsOutlined, // Import the notifications icon
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
  Badge,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { RoleEnum } from "constants";
import { deleteCookie, setCookie } from "helper";
import { useNavigate } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkAsReadNotificationMutation,
} from "state/api";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const isNotificationsOpen = Boolean(notificationsAnchorEl);

  const { data: notifications, refetch } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadNotificationMutation();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    refetch();
  };

  const handleNotificationsClose = () => setNotificationsAnchorEl(null);

  const handleLogout = () => {
    setCookie("accessToken", "", -1);
    setCookie("refreshToken", "", -1);
    setCookie("super-accessToken", "", -1);
    setCookie("super-refreshToken", "", -1);
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    handleClose();
    navigate("/login");

    setTimeout(() => {
      window.location.reload(); // Refresh to ensure correct user data is fetched
    }, 100);
  };

  const handleMarkAsRead = (id) => {
    markAsRead(id);
    handleNotificationsClose();
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "white",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon style={{ color: "#003366" }} />
          </IconButton>

          <FlexBetween
            backgroundColor={theme.palette.background.alt}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          >
            <InputBase
              placeholder="Search..."
              sx={{
                color: "#003366",
                "::placeholder": { color: "#003366" },
              }}
            />
            <IconButton>
              <Search style={{ color: "#003366" }} />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={handleNotificationsClick}>
            <Badge badgeContent={notifications?.length} color="error">
              <NotificationsOutlined
                sx={{ fontSize: "25px", color: "#003366" }}
              />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={notificationsAnchorEl}
            open={isNotificationsOpen}
            onClose={handleNotificationsClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <List>
              {notifications?.length ? (
                notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    button
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <ListItemText secondary={notification.message} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="Sizda bildirishnomalar yo'q" />
                </ListItem>
              )}
            </List>
          </Menu>

          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <AccountCircleOutlined
                sx={{ fontSize: "32px", color: "#003366" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: "#003366" }}
                >
                  {user.name}
                </Typography>
                <Typography fontSize="0.75rem" sx={{ color: "#003366" }}>
                  {RoleEnum[user.role]}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: "#003366", fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
