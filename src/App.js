import "./App.css";
import React from "react";
import Login from "./Pages/Login";
import Main from "./Pages/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import NotFound from "./Pages/NotFound";
import Magazines from "./Pages/Magazines";
import InsertionOrder from "./Pages/InsertionOrders";
import Companies from "./Pages/Companies";
import Invoices from "./Pages/Invoices";
import Contacts from "./Pages/Contacts";
import AddInsertionOrder from "./Pages/AddInsertionOrder";
import AddInvoice from "./Pages/AddInvoice";
import Loading from "./Pages/Loading";

import { createTheme, ThemeProvider } from "@mui/material";

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
    chipLightBlue: {
      main: "#EFF8FF",
      contrastText: "#175CD3",
    },
    chipDarkBlue: {
      main: "#EEF4FF",
      contrastText: "#3538CD",
    },
    chipPurple: {
      main: "#F9F5FF",
      contrastText: "#6941C6",
    },
    chipGreen: {
      main: "#ECFDF3",
      contrastText: "#027A48",
    },
    chipOrange: {
      main: "#FFFAEB",
      contrastText: "#B54708",
    },
    chipRed: {
      main: "#FDF2FA",
      contrastText: "#C01674",
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(102, 112, 133, 0.5)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "capitalize",
          height: "36px",
        },
      },
    },
    datePicker: {
      styleOverrides: {
        root: {
          "& .MuiTextField-root": {
            width: "300px",
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F6F8FF",
            color: "#000000",
          },
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
        },
      },
    },
  },
});

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Main /> : <Login />}>
            <Route path="magazine" element={<Magazines />} />
            <Route path="insertion-orders" element={<InsertionOrder />} />
            <Route path="companies" element={<Companies />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="add-io" element={<AddInsertionOrder />} />
            <Route path="add-invoice" element={<AddInvoice />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
