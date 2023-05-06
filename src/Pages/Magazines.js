import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Magazines = () => {
  const { logout, isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();

  return (
    <>
      <p>Magazine page</p>
    </>
  );
};

export default Magazines;
