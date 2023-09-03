import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Grid, Button, Typography } from "@mui/material";
import DatePickerInput from "./DatePickerInput";
import AutocompleteInput from "./AutocompleteInput";
import dayjs from "dayjs";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { formatDate } from "../Utils/utils";

const MagazineForm = ({
  setOpenForm,
  data,
  setSelectedRow,
  getMagazines,
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
      year: formData.year.$y,
      month: formData.month.month,
      closingDate: formatDate(formData.closingDate),
      materialDeadline: formatDate(formData.materialDeadline),
    };
    submitData(dataToUpdate);
  };

  useEffect(() => {
    prefillData();
  }, [data]);

  const prefillData = () => {
    if (data) {
      setSelectedId(data.id);
      const year = dayjs(new Date(`${data.year}-01-01`));
      setValue("year", year);
      setValue("month", { month: data.month, id: 0 });
      setValue("closingDate", dayjs(new Date(data.closingDate)));
      setValue("materialDeadline", dayjs(new Date(data.materialDeadline)));
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

  const updateIssueInDb = async (dataToUpdate) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.put(
        `${process.env.REACT_APP_DB_SERVER}/magazines/${selectedId}`,
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

  const addNewIssue = async (dataToUpdate) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.post(
        `${process.env.REACT_APP_DB_SERVER}/magazines/`,
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
      await updateIssueInDb(dataToUpdate);
      setFeedbackSeverity("success");
      setFeedbackMsg(`${data.month} ${data.year} Issue Updated`);
    } else {
      await addNewIssue(dataToUpdate);
      setFeedbackSeverity("success");
      setFeedbackMsg(`New Issue Added`);
    }
    getMagazines();
    setResetSearch(!resetSearch);
    setOpenFeedback(true);
    handleFormClose();
  };

  // Month Options
  const options = [
    {
      month: "March",
      id: 1,
    },
    {
      month: "June",
      id: 2,
    },
    {
      month: "September",
      id: 3,
    },
    {
      month: "December",
      id: 4,
    },
  ];

  return (
    <>
      <Typography sx={{ fontWeight: 700, fontSize: "1rem", mb: 2 }}>
        {data ? `Editing ${data.month} ${data.year} Issue` : "Add Issue"}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={12}>
            <label className="form-label">Year</label>
            <Controller
              control={control}
              name="year"
              defaultValue=""
              rules={{ required: "Please select a year" }}
              render={({
                field: { ref, onChange, onBlur, ...field },
                fieldState,
              }) => (
                <DatePickerInput
                  error={errors.year?.message}
                  value={field.value}
                  onChange={onChange}
                  specialView={true}
                  viewOnly={["year"]}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <label className="form-label">Month</label>
            <Controller
              control={control}
              name="month"
              defaultValue=""
              rules={{ required: "Please select a month" }}
              render={({ field: { ref, onChange, ...field } }) => (
                <AutocompleteInput
                  id="month"
                  placeholder="Select an issue"
                  options={options}
                  columnName="month"
                  hasTwoColumns={false}
                  columnNameTwo=""
                  value={field.value}
                  onChange={onChange}
                  error={errors.month?.message}
                  width="100%"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <label className="form-label">Closing Date</label>
            <Controller
              control={control}
              name="closingDate"
              defaultValue=""
              rules={{ required: "Please select a date" }}
              render={({
                field: { ref, onChange, onBlur, ...field },
                fieldState,
              }) => (
                <DatePickerInput
                  error={errors.closingDate?.message}
                  value={field.value}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <label className="form-label">Material Deadline</label>
            <Controller
              control={control}
              name="materialDeadline"
              defaultValue=""
              rules={{ required: "Please select a date" }}
              render={({
                field: { ref, onChange, onBlur, ...field },
                fieldState,
              }) => (
                <DatePickerInput
                  error={errors.materialDeadline?.message}
                  value={field.value}
                  onChange={onChange}
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

export default MagazineForm;
