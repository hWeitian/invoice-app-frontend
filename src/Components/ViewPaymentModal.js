import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import PageTitle from "./PageTitle";
import { getData, createStringDate, formatToUsdCurrency } from "../utils";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
  overflowY: "auto",
};

const ViewPaymentModal = ({ setViewPaymentModalOpen, open, data }) => {
  const [payments, setPayments] = useState([]);
  const getAccessToken = useGetAccessToken();

  useEffect(() => {
    if (open) {
      getPayments();
    }
  }, [open]);

  const getPayments = async () => {
    const id = data.id.split(".")[0];

    try {
      const accessToken = await getAccessToken();
      const data = await getData(accessToken, `payments/${id}`);

      setPayments(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDownloadClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setViewPaymentModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PageTitle>Payment Received</PageTitle>
          <Typography
            sx={{ mt: -2, p: 0, color: "#667085", fontSize: "0.9rem" }}
          >
            Invoice {data.id}
          </Typography>

          {payments.length > 0 ? (
            payments.map((payment, index) => (
              <Grid
                container
                sx={{ pt: 1, m: "auto", alignItems: "center" }}
                key={index}
              >
                <Grid item xs={7.5}>
                  <Typography sx={{ m: "0", p: 0 }}>
                    Received on {createStringDate(payment.paymentDate)}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ m: 0, p: 0 }}>
                    {formatToUsdCurrency(payment.amount)}
                  </Typography>
                </Grid>
                <Grid item xs={1.5}>
                  <IconButton onClick={() => handleDownloadClick(payment.url)}>
                    <CloudDownloadIcon
                      sx={{ fontSize: 20 }}
                      color="secondary"
                    />
                  </IconButton>
                </Grid>
              </Grid>
            ))
          ) : (
            <div
              style={{
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              <Typography>No payments</Typography>
            </div>
          )}
          <div
            style={{
              width: "100%",
              marginTop: "30px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "70%" }}>
              <Button
                onClick={() => setViewPaymentModalOpen(false)}
                variant="contained"
                style={{ width: "100%" }}
              >
                Close
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ViewPaymentModal;