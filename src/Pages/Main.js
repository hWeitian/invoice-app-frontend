import React from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import {
  Drawer,
  Box,
  Toolbar,
  ListItem,
  ListItemButton,
  ListItemText,
  List,
  Avatar,
  IconButton,
} from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import ApartmentIcon from "@mui/icons-material/Apartment";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import LogoutIcon from "@mui/icons-material/Logout";

import { getFirstLetter } from "../utils";
import Home from "./Home";

import { Outlet, Link, useLocation } from "react-router-dom";

const drawerWidth = 260;

const navMenu = [
  ["Home", "", <HomeIcon sx={{ color: "#FFFFFF" }} />],
  ["Magazine", "magazine", <MenuBookIcon sx={{ color: "#FFFFFF" }} />],
  [
    "Contacts",
    "contacts",
    <PermContactCalendarIcon sx={{ color: "#FFFFFF" }} />,
  ],
  ["Companies", "companies", <ApartmentIcon sx={{ color: "#FFFFFF" }} />],
  [
    "Insertion Orders",
    "insertion-orders",
    <StickyNote2Icon sx={{ color: "#FFFFFF" }} />,
  ],
  ["Invoices", "invoices", <RequestQuoteIcon sx={{ color: "#FFFFFF" }} />],
  ["Credit Notes", "credit-notes", <MoneyOffIcon sx={{ color: "#FFFFFF" }} />],
  ["Reports", "reports", <InsertChartIcon sx={{ color: "#FFFFFF" }} />],
];

const Main = () => {
  const { logout, isAuthenticated, user } = useAuth0();

  const avatarName = getFirstLetter(user.name);
  const currentPath = useLocation().pathname;

  return (
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
        PaperProps={{
          sx: {
            backgroundColor: "#012B61",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            margin: "5px 0 0 0",
            padding: "0",
          }}
        >
          <img
            src={require("../Assets/Logo-White.png")}
            alt="logo"
            style={{ maxWidth: "150px" }}
          />
        </Toolbar>
        <List>
          {navMenu.map((item, index) => (
            <ListItem key={`${item}-${index}`}>
              <Link to={`/${item[1]}`} className="nav-link">
                <ListItemButton selected={currentPath === `/${item[1]}`}>
                  <ListItemIcon>{item[2]}</ListItemIcon>
                  <ListItemText primary={item[0]} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <List style={{ marginTop: "auto" }}>
          <ListItem>
            <Avatar
              sx={{ ml: 1, backgroundColor: "#FFF7D6", color: "#000000" }}
            >
              {avatarName}
            </Avatar>
            <ListItemText sx={{ color: "#FFFFFF", pl: 2 }}>
              {user.name}
            </ListItemText>
            <IconButton
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              <LogoutIcon sx={{ color: "#FFFFFF" }} />
            </IconButton>
          </ListItem>
        </List>
      </Drawer>
      <div
        style={{
          width: "100%",
          padding: "10px 20px",
        }}
      >
        {currentPath === "/" ? <Home /> : <Outlet />}
      </div>
    </Box>
  );
};

export default withAuthenticationRequired(Main, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Redirecting you to the login page...</div>,
});
