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
  List,
  createTheme,
  ThemeProvider,
} from "@mui/material";

import ListItemIcon from "@mui/material/ListItemIcon";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import ApartmentIcon from "@mui/icons-material/Apartment";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import { Outlet, Link, useLocation } from "react-router-dom";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#012b61",
    },
    secondary: {
      main: "#00b5c5",
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Inter",
    button: {
      fontWeight: 700,
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingRight: "0",
          borderRadius: "8px",
          width: "100%",
          "&.Mui-selected": {
            backgroundColor: "#00B5C5",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#00B5C5",
          },
          "&:hover": {
            backgroundColor: "rgba(102, 112, 133, 0.5)",
          },
        },
      },
    },
  },
});

const drawerWidth = 260;

const navMenu = [
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

const Home = () => {
  const { logout, isAuthenticated, user } = useAuth0();

  const currentPath = useLocation().pathname;

  return (
    <ThemeProvider theme={theme}>
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "80%" }}
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Logout
            </Button>
          </div>
        </Drawer>
        <Outlet />
      </Box>
    </ThemeProvider>
  );
};

export default withAuthenticationRequired(Home, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Redirecting you to the login page...</div>,
});
