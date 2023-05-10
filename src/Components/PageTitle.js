import React from "react";
import { Typography } from "@mui/material";

const PageTitle = (props) => {
  return (
    <Typography sx={{ fontWeight: 700, fontSize: "1.4rem", mb: 2 }}>
      {props.children}
    </Typography>
  );
};

export default PageTitle;
