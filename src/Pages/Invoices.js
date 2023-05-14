import React, { useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import PageTitle from "../Components/PageTitle";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const navigate = useNavigate();

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <PageTitle>Invoices</PageTitle>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => navigate("/add-invoice")}
            >
              <AddIcon sx={{ mr: 1 }} />
              Create Invoice
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ mt: 5 }}>
          Table
        </Grid>
      </Grid>
    </>
  );
};

export default Invoices;
