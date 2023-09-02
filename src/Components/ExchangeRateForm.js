import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Grid, Button, Typography, TextField } from "@mui/material";
import DatePickerInput from "./DatePickerInput";
import AutocompleteInput from "./AutocompleteInput";
import dayjs from "dayjs";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { formatDate } from "../Utils/utils";

const ExchangeRateForm = ({
  setOpenForm,
  data,
  setSelectedRow,
  getExchangeRates,
  resetSearch,
  setResetSearch,
}) => {
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity] =
    useOutletContext();
  const [selectedId, setSelectedId] = useState(null);
  const getAccessToken = useGetAccessToken();
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm();

  const onSubmit = (formData) => {
    const dataToUpdate = {
      rate: formData.rate,
      date: formatDate(formData.date),
    };
    // console.log(dataToUpdate);
    submitData(dataToUpdate);
  };

  useEffect(() => {
    prefillData();
  }, [data]);

  const prefillData = () => {
    if (data) {
      setSelectedId(data.id);
      setValue("rate", data.rate);
      setValue("date", dayjs(new Date(data.date)));
    } else {
      reset();
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setSelectedRow(null);
    reset();
    setSelectedId(null);
  };

  const updateRateInDb = async (dataToUpdate) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.put(
        `${process.env.REACT_APP_DB_SERVER}/exchange-rates/${selectedId}`,
        dataToUpdate,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  const addNewRate = async (dataToUpdate) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.post(
        `${process.env.REACT_APP_DB_SERVER}/exchange-rates/`,
        dataToUpdate,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  const submitData = async (dataToUpdate) => {
    if (selectedId) {
      await updateRateInDb(dataToUpdate);
      setFeedbackSeverity("success");
      setFeedbackMsg(`${data.date}'s Rate Updated`);
    } else {
      await addNewRate(dataToUpdate);
      setFeedbackSeverity("success");
      setFeedbackMsg(`New Rate Added`);
    }
    getExchangeRates();
    setResetSearch(!resetSearch);
    setOpenFeedback(true);
    handleFormClose();
  };

  return (
    <>
      <Typography sx={{ fontWeight: 700, fontSize: "1rem", mb: 2 }}>
        {data ? `Editing ${data.date}` : "Add Rate"}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={12}>
            <label className="form-label">Date</label>
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
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <label className="form-label">Rate</label>
            <Controller
              control={control}
              name="rate"
              rules={{ required: "Please enter a rate" }}
              defaultValue=""
              render={({
                field: { ref, onChange, ...field },
                fieldState: { error },
              }) => (
                <TextField
                  id={`rate`}
                  variant="outlined"
                  size="small"
                  error={error}
                  value={field.value}
                  onChange={onChange}
                  helperText={error?.message}
                  placeholder="Rate"
                  sx={{ width: "100%" }}
                  type="number"
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid
          container
          sx={{
            justifyContent: "flex-end",
            position: "absolute",
            bottom: "20px",
            right: "20px",
          }}
        >
          <Button
            color="primary"
            variant="outlined"
            sx={{ mr: 2 }}
            onClick={handleFormClose}
          >
            Close
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Save
          </Button>
        </Grid>
      </form>
    </>
  );
};

export default ExchangeRateForm;
