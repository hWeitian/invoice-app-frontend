import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Grid, TextField, Button, Typography } from "@mui/material";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

const CompanyForm = ({ setOpenForm, data, setSelectedRow, getCompanies }) => {
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
      name: formData.companyName,
      billingAddress: formData.billingAddress,
    };
    submitData(dataToUpdate);
  };

  useEffect(() => {
    prefillData();
  }, [data]);

  const prefillData = () => {
    if (data) {
      setSelectedId(data.id);
      setValue("companyName", data.name);
      setValue("billingAddress", data.billingAddress);
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

  const updateCompany = async (dataToUpdate) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.put(
        `${process.env.REACT_APP_DB_SERVER}/companies/${selectedId}`,
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

  const addCompany = async (dataToUpdate) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.post(
        `${process.env.REACT_APP_DB_SERVER}/companies/`,
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
      await updateCompany(dataToUpdate);
      setFeedbackSeverity("success");
      setFeedbackMsg(`${data.name} Updated`);
    } else {
      await addCompany(dataToUpdate);
      setFeedbackSeverity("success");
      setFeedbackMsg(`New Company Added`);
    }
    getCompanies();
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
        {data ? `Editing ${data.name}` : "Add Company"}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={12}>
            <label className="form-label">Company Name</label>
            <Controller
              control={control}
              name="companyName"
              rules={{ required: "Please enter company name" }}
              defaultValue=""
              render={({
                field: { ref, onChange, ...field },
                fieldState: { error },
              }) => (
                <TextField
                  id={`companyName`}
                  variant="outlined"
                  size="small"
                  error={error}
                  value={field.value}
                  onChange={onChange}
                  helperText={error?.message}
                  placeholder="Company Name"
                  sx={{ width: "100%" }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <label className="form-label">Billing Address</label>
            <Controller
              control={control}
              name="billingAddress"
              rules={{ required: "Please enter billing address" }}
              defaultValue=""
              render={({
                field: { ref, onChange, ...field },
                fieldState: { error },
              }) => (
                <TextField
                  id={`billingAddress`}
                  variant="outlined"
                  size="small"
                  error={error}
                  value={field.value}
                  onChange={onChange}
                  helperText={error?.message}
                  placeholder="Billing Address"
                  sx={{ width: "100%" }}
                  multiline
                  rows={3}
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

export default CompanyForm;
