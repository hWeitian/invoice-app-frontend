import "./App.css";
import React, { useEffect } from "react";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import NotFound from "./Pages/NotFound";
import Magazines from "./Pages/Magazines";
import InsertionOrder from "./Pages/InsertionOrder";
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
          <Route path="insertion-order" element={<InsertionOrder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
