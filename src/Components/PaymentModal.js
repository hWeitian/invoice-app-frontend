import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import PageTitle from "./PageTitle";
import DatePickerInput from "./DatePickerInput";
import DollarInput from "./DollarInput";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";
import axios from "axios";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import DeleteIcon from "@mui/icons-material/Delete";
import AutocompleteInput from "./AutocompleteInput";
import { getData } from "../utils";
import DragDropInput from "./DragDropInput";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  height: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
  overflowY: "auto",
};

const PaymentModal = ({
  open,
  setPaymentModalOpen,
  data,
  setFeedbackMsg,
  setOpenFeedback,
  setFeedbackSeverity,
  getInvoices,
}) => {
  const getAccessToken = useGetAccessToken();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (open) {
      getStartingData();
    }
  }, [open]);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      paymentItems: [{ invoice: "", amount: "" }],
    },
  });

  const {
    fields: items,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "paymentItems",
  });

  const onSubmit = (formData) => {
    addPayment(formData);
  };

  const handleModalClose = () => {
    reset();
    setPaymentModalOpen(false);
  };

  const uploadPdf = async (file) => {
    const fileName = Date.now();
    const storageRef = ref(storage, `payments/${fileName}.pdf`);
    try {
      // Upload the pdf onto Firebase storage
      const snapshot = await uploadBytes(storageRef, file);
      // Get the download url for the uploaded pdf
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (e) {
      console.log(e);
    }
  };

  const addPaymentToDb = async (formData) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.post(
        `${process.env.REACT_APP_DB_SERVER}/payments`,
        formData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  const addPayment = async (formData) => {
    const url = await uploadPdf(formData.file);
    formData.url = url;
    await addPaymentToDb(formData);
    reset();
    await getInvoices();
    handleModalClose();
    setFeedbackSeverity("success");
    setFeedbackMsg("Payment Added");
    setOpenFeedback(true);
  };

  const getStartingData = async () => {
    try {
      const accessToken = await getAccessToken();
      const invoicesData = await getData(
        accessToken,
        `invoices/${data.companyId}`
      );
      invoicesData.forEach((invoice) => {
        invoice.name = `${invoice.id}.INV`;
      });

      // Loop through all invoices related to the selected company and prefill the invoice field with the selected invoice row
      invoicesData.forEach((invoice, index) => {
        const dataId = Number(data.id.split(".")[0]);
        if (invoice.id === dataId) {
          setValue(`paymentItems.${0}.invoices`, invoice);
        }
      });

      setInvoices(invoicesData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PageTitle>Add Payment</PageTitle>
          <Typography
            sx={{ mt: -2, p: 0, color: "#667085", fontSize: "0.9rem" }}
          >
            Upload and attach payment to invoices for {data.company}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <div style={{ marginTop: "10px", width: "100%" }}>
                <label className="form-label">Payee</label>
                <Controller
                  control={control}
                  name="payee"
                  rules={{ required: "Please enter payee" }}
                  defaultValue=""
                  render={({
                    field: { ref, onChange, ...field },
                    fieldState: { error },
                  }) => (
                    <TextField
                      id={`payee`}
                      variant="outlined"
                      size="small"
                      error={error}
                      value={field.value}
                      onChange={onChange}
                      helperText={error?.message}
                      placeholder="Payee"
                      sx={{ width: "100%" }}
                    />
                  )}
                />
              </div>
              <div style={{ marginTop: "20px", width: "100%" }}>
                <label className="form-label">Payment Date</label>
                <Controller
                  control={control}
                  name="date"
                  defaultValue=""
                  rules={{ required: "Please select a date" }}
                  render={({
                    field: { ref, onChange, onBlur, ...field },
                    fieldState,
                  }) => (
                    <DatePickerInput
                      error={errors.date?.message}
                      value={field.value}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
              <Grid container sx={{ mt: 2, width: "100%" }}>
                <Grid item xs={6.5}>
                  <label className="form-label">Invoice</label>
                </Grid>
                <Grid item xs={4.5}>
                  <label className="form-label">Amount</label>
                </Grid>
              </Grid>
              {items.map((field, index) => (
                <Grid container key={field.id} sx={{ mt: index === 0 ? 0 : 2 }}>
                  <Grid item xs={6.5}>
                    <Controller
                      control={control}
                      name={`paymentItems.${index}.invoices`}
                      defaultValue=""
                      rules={{ required: "Please select an invoice" }}
                      render={({
                        field: { ref, onChange, ...field },
                        fieldState: { error },
                      }) => (
                        <AutocompleteInput
                          id={`invoice-${index}`}
                          placeholder="Select an invoice"
                          options={invoices}
                          columnName="name"
                          hasTwoColumns={false}
                          columnNameTwo=""
                          value={field.value}
                          onChange={onChange}
                          error={error?.message}
                          width="280px"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={4.5}>
                    <Controller
                      control={control}
                      name={`paymentItems.${index}.amount`}
                      defaultValue=""
                      rules={{
                        required: "Please add an amount",
                        valueAsNumber: true,
                        pattern: {
                          value: /^(0|[1-9]\d*)(\.\d+)?$/,
                        },
                      }}
                      render={({
                        field: { ref, onChange, ...field },
                        fieldState: { error },
                      }) => (
                        <DollarInput
                          id={`amount-${index}`}
                          placeholder="Amount"
                          value={field.value}
                          onChange={onChange}
                          error={error}
                          currency="USD"
                          width="200px"
                        />
                      )}
                    />
                  </Grid>
                  {index > 0 && (
                    <Grid item xs={1} sx={{ textAlign: "right" }}>
                      <IconButton
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              ))}
              <Button
                type="button"
                color="secondary"
                onClick={() => {
                  append({
                    description: "",
                    amount: "",
                  });
                }}
              >
                Add Invoice
              </Button>
              <Controller
                control={control}
                name="file"
                defaultValue=""
                rules={{ required: "Please upload a transaction advice" }}
                render={({
                  field: { ref, onChange, ...field },
                  fieldState: { error },
                }) => (
                  <DragDropInput
                    onChange={onChange}
                    error={error}
                    errorMsg="Please attached a transaction advice"
                  />
                )}
              />
              <div style={{ width: "48%", marginTop: "20px" }}>
                <Button
                  onClick={handleModalClose}
                  variant="outlined"
                  style={{ width: "100%" }}
                >
                  Cancel
                </Button>
              </div>
              <div style={{ width: "48%", marginTop: "20px" }}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ width: "100%" }}
                >
                  Add Payment
                </Button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default PaymentModal;
