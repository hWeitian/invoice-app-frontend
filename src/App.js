import "./App.css";
import React, { useEffect } from "react";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
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

function App() {
  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />}>
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
  );
}

export default App;
