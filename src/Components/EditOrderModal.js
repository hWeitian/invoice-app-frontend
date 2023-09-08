import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import PageTitle from "./PageTitle";
import axios from "axios";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import AutocompleteInput from "./AutocompleteInput";
import { getData } from "../Utils/utils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  height: 350,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
  overflowY: "auto",
};

const EditOrderModal = ({
  open,
  setEditOrderModalOpen,
  data,
  setFeedbackMsg,
  setOpenFeedback,
  setFeedbackSeverity,
  magazineIssue,
  getOrders,
  updateTableData,
}) => {
  const getAccessToken = useGetAccessToken();
  const [magazines, setMagazines] = useState([]);

  useEffect(() => {
    if (open) {
      getStartingData();
    }
  }, [open]);

  const {
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    control,
    reset,
  } = useForm();

  const handleModalClose = () => {
    reset();
    setEditOrderModalOpen(false);
  };

  const updateOrder = async (formData) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.put(
        `${process.env.REACT_APP_DB_SERVER}/orders/${data.id}/${formData.magazines.id}`,
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

  // If form is submitted successfully
  useEffect(() => {
    if (isSubmitSuccessful) {
      resetData();
    }
  }, [isSubmitSuccessful]);

  const resetData = async () => {
    // updateTableData function is to refetch and calculate card data
    // getOrders function is to refetch table data
    const promises = [updateTableData(magazineIssue.id), getOrders()];
    await Promise.all(promises);
    reset();
    handleModalClose();
    setFeedbackSeverity("success");
    setFeedbackMsg("Order Updated");
    setOpenFeedback(true);
  };

  const onSubmit = async (formData) => {
    updateOrder(formData);
  };

  const getStartingData = async () => {
    try {
      const accessToken = await getAccessToken();
      const magazines = await getData(accessToken, `magazines`);
      magazines.forEach((magazine) => {
        magazine.name = `${magazine.year} - ${magazine.month}`;
      });
      setMagazines(magazines);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="edit-order-modal"
      >
        <Box sx={style}>
          <PageTitle>Edit Order</PageTitle>
          <Typography
            sx={{ mt: -2, p: 0, color: "#667085", fontSize: "0.9rem" }}
          >
            Change magazine issue for the order
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: "10px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ width: "40%" }}>
                  <Typography
                    className="edit-order"
                    style={{ fontWeight: 600 }}
                  >
                    Current Issue:
                  </Typography>
                </div>
                <div style={{ width: "60%" }}>
                  <Typography className="edit-order">{`${magazineIssue.year}-${magazineIssue.month}`}</Typography>
                </div>
              </div>
              <div style={{ width: "100%", marginTop: "5px" }}>
                <label className="form-label">New Issue:</label>
                <Controller
                  control={control}
                  name={`magazines`}
                  defaultValue=""
                  rules={{ required: "Please select a magazine" }}
                  render={({
                    field: { ref, onChange, ...field },
                    fieldState: { error },
                  }) => (
                    <AutocompleteInput
                      id={`magazines`}
                      placeholder="Select an magazine"
                      options={magazines}
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
              </div>

              <div
                style={{
                  width: "100%",
                  marginTop: errors?.magazines?.message ? "70px" : "90px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "48%" }}>
                  <Button
                    onClick={handleModalClose}
                    variant="outlined"
                    style={{ width: "100%" }}
                  >
                    Cancel
                  </Button>
                </div>
                <div style={{ width: "48%" }}>
                  <Button
                    variant="contained"
                    type="submit"
                    style={{ width: "100%" }}
                  >
                    Update Order
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default EditOrderModal;
