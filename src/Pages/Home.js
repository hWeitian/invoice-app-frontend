import React, { useEffect } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import {
  Button,
  Drawer,
  Box,
  Toolbar,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  List,
} from "@mui/material";

import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Outlet, Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

const Home = () => {
  const { logout, isAuthenticated, user } = useAuth0();

  const currentPath = useLocation().pathname;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List>
            <ListItem disablePadding>
              <Link to="/magazine">
                <ListItemButton selected={currentPath === "/magazine"}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Magazine" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link to="/insertion-order">
                <ListItemButton selected={currentPath === "/insertion-order"}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Insertion Order" />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
          <Button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Logout
          </Button>
        </Drawer>
        <Outlet />
      </Box>
    </>
  );
};

export default withAuthenticationRequired(Home, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Redirecting you to the login page...</div>,
});
