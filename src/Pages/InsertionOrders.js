import React, { useState, useEffect } from "react";
import { Grid, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import AddIcon from "@mui/icons-material/Add";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Table from "../Components/Table";

const InsertionOrders = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuth0();
  const [insertionOrders, setInsertionOrders] = useState([]);

  useEffect(() => {
    getInsertionOrders();
  }, []);

  const getAccessToken = async () => {
    const accessToken = await getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.REACT_APP_AUDIENCE,
        scope: "read:current_user",
      },
    });
    return accessToken;
  };

  const getInsertionOrders = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${process.env.REACT_APP_DB_SERVER}/insertion-orders/table-data`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setInsertionOrders(response.data);
    } catch (e) {
      console.log(e);
    }
  };

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
        <Table data={insertionOrders} />
      </Grid>
    </Grid>
  );
};

export default InsertionOrders;
