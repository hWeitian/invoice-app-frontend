import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Grid, Typography } from "@mui/material";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item sx={{ textAlign: "center" }}>
        <img src={require("../Assets/Logo.png")} alt="logo" width="350px" />
        <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, mt: 3 }}>
          Authentication required
        </Typography>
        <Typography sx={{ fontSize: "1rem" }}>
          Please log in to access this page
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => loginWithRedirect()}
          sx={{ width: "200px", mt: 3 }}
        >
          Log in
        </Button>
      </Grid>
    </Grid>
  );
};

export default Login;
