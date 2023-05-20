import React, { useState, useEffect } from "react";
import { Grid, Button, Box } from "@mui/material";
import PageTitle from "../Components/PageTitle";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import InvoiceTable from "../Components/InvoiceTable";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const Invoices = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [invoices, setInvoices] = useState();

  useEffect(() => {
    getInvoices();
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

  const getInvoices = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${process.env.REACT_APP_DB_SERVER}/invoices/table-data`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setInvoices(response.data);
    } catch (e) {
      console.log(e);
    }
  };

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
          <InvoiceTable data={invoices} getInvoices={getInvoices} />
        </Grid>
      </Grid>
    </>
  );
};

export default Invoices;
