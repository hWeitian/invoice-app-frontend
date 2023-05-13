import React from "react";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingScreen = ({ open, handleClose }) => {
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default LoadingScreen;
