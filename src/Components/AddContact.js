import React, { useState, useEffect } from "react";
import { Modal, Box, Grid, TextField, Button } from "@mui/material";
import PageTitle from "./PageTitle";
import { useForm, Controller } from "react-hook-form";
import AutocompleteInput from "./AutocompleteInput";
import AsyncAutocomplete from "./AsyncAutocomplete";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import { getData } from "../utils";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const style = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  height: 460,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: "32px 32px 0 32px",
  overflowY: "auto",
};

const AddContact = ({
  open,
  setOpenForm,
  data,
  getContacts,
  setSelectedRow,
}) => {
  const getAccessToken = useGetAccessToken();
  const [companies, setCompanies] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity] =
    useOutletContext();

  useEffect(() => {
    prefillData();
  }, [data]);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm();

  const onSubmit = (formData) => {
    const dataToUpdate = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      title: formData.title.name,
      email: formData.email,
      designation: formData.designation,
      companyId: formData.companies.id,
      isAdmin: false,
    };
    submitData(dataToUpdate);
  };

  const updateContact = async (dataToUpdate) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.put(
        `${process.env.REACT_APP_DB_SERVER}/contacts/${selectedId}`,
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

  const addContact = async (dataToUpdate) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.post(
        `${process.env.REACT_APP_DB_SERVER}/contacts/`,
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
      await updateContact(dataToUpdate);
      setFeedbackSeverity("success");
      setFeedbackMsg(`Contact Updated`);
    } else {
      await addContact(dataToUpdate);
      setFeedbackSeverity("success");
      setFeedbackMsg(`Contact Added`);
    }
    getContacts();
    setOpenFeedback(true);
    handleClose();
  };

  const getCompanies = async () => {
    try {
      const accessToken = await getAccessToken();
      const data = await getData(accessToken, "companies/names");
      setCompanies(data);
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const prefillData = () => {
    if (data) {
      setSelectedId(data.id);
      const company = {
        label: data.fullCompany.name,
        id: data.fullCompany.id,
        billingAddress: data.fullCompany.billingAddress,
      };
      setSelectedId(data.id);
      setValue("firstName", data.firstName);
      setValue("lastName", data.lastName);
      setValue("email", data.email);
      setValue("designation", data.designation);
      setValue("companies", company);
      setValue("title", { name: data.title, id: 0 });
      setSelectedCompany(company);
    }
  };

  const handleClose = () => {
    setSelectedCompany(null);
    setSelectedRow(null);
    setSelectedId(null);
    reset();
    setOpenForm(false);
  };

  const titleOptions = [
    { name: "Mr", id: 1 },
    { name: "Ms", id: 2 },
    { name: "Mrs", id: 3 },
    { name: "Dr", id: 4 },
    { name: "Prof", id: 5 },
  ];

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpenForm(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PageTitle>Add Contact</PageTitle>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Grid
              container
              sx={{ width: "100%", justifyContent: "space-between" }}
            >
              <Grid item xs={5.8}>
                <label className="form-label">First Name</label>
                <Controller
                  control={control}
                  name="firstName"
                  rules={{ required: "Please enter first name" }}
                  defaultValue=""
                  render={({
                    field: { ref, onChange, ...field },
                    fieldState: { error },
                  }) => (
                    <TextField
                      id={`firstName`}
                      variant="outlined"
                      size="small"
                      error={error}
                      value={field.value}
                      onChange={onChange}
                      helperText={error?.message}
                      placeholder="First Name"
                      sx={{ width: "100%" }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5.8}>
                <label className="form-label">Last Name</label>
                <Controller
                  control={control}
                  name="lastName"
                  rules={{ required: "Please enter last name" }}
                  defaultValue=""
                  render={({
                    field: { ref, onChange, ...field },
                    fieldState: { error },
                  }) => (
                    <TextField
                      id={`lastName`}
                      variant="outlined"
                      size="small"
                      error={error}
                      value={field.value}
                      onChange={onChange}
                      helperText={error?.message}
                      placeholder="Last Name"
                      sx={{ width: "100%" }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid
              container
              sx={{ width: "100%", justifyContent: "space-between", mt: 3.5 }}
            >
              <Grid item xs={7.8}>
                <label className="form-label">Email</label>
                <Controller
                  control={control}
                  name="email"
                  rules={{ required: "Please enter email" }}
                  defaultValue=""
                  render={({
                    field: { ref, onChange, ...field },
                    fieldState: { error },
                  }) => (
                    <TextField
                      id={`email`}
                      variant="outlined"
                      size="small"
                      error={error}
                      value={field.value}
                      onChange={onChange}
                      helperText={error?.message}
                      placeholder="Email"
                      sx={{ width: "100%" }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3.8}>
                <label className="form-label">Title</label>
                <Controller
                  control={control}
                  name="title"
                  defaultValue=""
                  rules={{ required: "Please select a title" }}
                  render={({ field: { ref, onChange, ...field } }) => (
                    <AutocompleteInput
                      id="title"
                      placeholder="Title"
                      options={titleOptions}
                      columnName="name"
                      hasTwoColumns={false}
                      columnNameTwo=""
                      value={field.value}
                      onChange={onChange}
                      error={errors.title?.message}
                      width="100%"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid
              container
              sx={{ width: "100%", justifyContent: "space-between", mt: 3.5 }}
            >
              <Grid item xs={5.8}>
                <label className="form-label">Company</label>
                <Controller
                  control={control}
                  name="companies"
                  defaultValue=""
                  rules={{ required: "Please select a company" }}
                  render={({ field: { ref, onChange, ...field } }) => (
                    <AsyncAutocomplete
                      id="companies-input"
                      placeholder="Select a company"
                      options={companies}
                      setOptions={setCompanies}
                      getData={getCompanies}
                      prerequisiteData=""
                      prerequisite={false}
                      columnName="label"
                      value={field.value}
                      onOptionSelected={(option) => {
                        setSelectedCompany(option);
                        onChange(option);
                      }}
                      error={errors.companies?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5.8}>
                <label className="form-label">Designation</label>
                <Controller
                  control={control}
                  name="designation"
                  rules={{ required: "Please enter designation" }}
                  defaultValue=""
                  render={({
                    field: { ref, onChange, ...field },
                    fieldState: { error },
                  }) => (
                    <TextField
                      id={`designation`}
                      variant="outlined"
                      size="small"
                      error={error}
                      value={field.value}
                      onChange={onChange}
                      helperText={error?.message}
                      placeholder="Designation"
                      sx={{ width: "100%" }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid
              container
              sx={{
                width: "90%",
                justifyContent: "space-between",
                gap: 4,
                mt: 1,
                position: "absolute",
                bottom: 0,
              }}
            >
              <Grid item xs={5.5}>
                <Button
                  color="primary"
                  variant="outlined"
                  sx={{ mt: 4, mb: 2, width: "100%" }}
                  onClick={handleClose}
                >
                  Close
                </Button>
              </Grid>
              <Grid item xs={5.5}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  sx={{ mt: 4, mb: 2, width: "100%" }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AddContact;
