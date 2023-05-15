import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const OverviewCard = ({ title, content }) => {
  return (
    <Card sx={{ minWidth: 250 }}>
      <CardContent>
        <Typography
          sx={{ mb: 1.5, fontWeight: 500, fontSize: "1rem", color: "#667085" }}
        >
          {title}
        </Typography>
        <Typography
          sx={{ fontSize: "1.6rem", fontWeight: 700, color: "#012B61" }}
        >
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
