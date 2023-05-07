import "./App.css";
import React, { useEffect } from "react";
import Login from "./Pages/Login";
import Main from "./Pages/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import NotFound from "./Pages/NotFound";
import Magazines from "./Pages/Magazines";
import InsertionOrder from "./Pages/InsertionOrders";
import Companies from "./Pages/Companies";
import Invoices from "./Pages/Invoices";
import CreditNotes from "./Pages/CreditNotes";
import Reports from "./Pages/Reports";
import Contacts from "./Pages/Contacts";
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
            <Route path="credit-notes" element={<CreditNotes />} />
            <Route path="reports" element={<Reports />} />
            <Route path="contacts" element={<Contacts />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
