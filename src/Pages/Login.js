import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, user, appState } = useAuth0();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (user) {
  //     console.log("Inside useEffect");
  //     navigate("/");
  //   } else {
  //     console.log("not authenticated");
  //   }
  // });

  // const handleClick = () => {
  //   console.log("HERE");
  //   loginWithRedirect();
  // };

  return (
    <>
      <p>Login page</p>
      <Button variant="contained" onClick={() => loginWithRedirect()}>
        Log in
      </Button>
      <p>{isAuthenticated && `Hi ${user.name}`}</p>
    </>
  );
};

export default Login;
