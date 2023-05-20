import React from "react";
import { Grid, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import AddIcon from "@mui/icons-material/Add";
import Table from "../Components/Table";

const InsertionOrders = () => {
  const navigate = useNavigate();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <PageTitle>Insertion Orders</PageTitle>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate("/add-io")}
          >
            <AddIcon sx={{ mr: 1 }} />
            Add Insertion Order
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ mt: 5 }}>
        <Table />
      </Grid>
    </Grid>
  );
};

export default InsertionOrders;
