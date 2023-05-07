import React from "react";
import { Typography } from "@mui/material";

const PageTitle = (props) => {
  return <Typography sx={{ fontWeight: 700 }}>{props.children}</Typography>;
};

export default PageTitle;
