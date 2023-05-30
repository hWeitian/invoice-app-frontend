import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Grid,
  TextField,
  Button,
  Switch,
  Tooltip,
  styled,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import PageTitle from "./PageTitle";
import { useForm, Controller } from "react-hook-form";
import AutocompleteInput from "./AutocompleteInput";
import AsyncAutocomplete from "./AsyncAutocomplete";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import { getData } from "../utils";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const style = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  height: 550,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: "32px 32px 0 32px",
  overflowY: "auto",
};

const TextSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const AddContact = ({
  open,
  setOpenForm,
  data,
  getContacts,
  setSelectedRow,
  resetSearch,
  setResetSearch,
}) => {
  const { logout, user } = useAuth0();
  const getAccessToken = useGetAccessToken();
  const [companies, setCompanies] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity, updateName] =
    useOutletContext();

  // console.log(user.email);

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
    // Check if there is a change in admin status
    // If there is no change in admin status, do not need to search for user in Auth0
    let adminChanged = false;
    if (data) {
      if (data.isAdmin !== formData.admin) {
        adminChanged = true;
      }
    }

    const dataToUpdate = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      title: formData.title.name,
      email: formData.email,
      designation: formData.designation,
      companyId: formData.companies.id,
      isAdmin: formData.admin,
    };

    submitData(dataToUpdate, adminChanged);
  };

  const updateContact = async (dataToUpdate, adminChanged) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.put(
        `${process.env.REACT_APP_DB_SERVER}/contacts/${adminChanged}/${selectedId}`,
        dataToUpdate,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    } catch (e) {
      setFeedbackSeverity("error");
      if (e.response.data.msg.name === "SequelizeUniqueConstraintError") {
        setFeedbackMsg(`Email Already Exist`);
      } else {
        setFeedbackMsg(`Opps..update contact failed`);
      }

      setOpenFeedback(true);
      handleClose();
      setLoading(false);
      throw new Error(e);
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
      setFeedbackSeverity("error");
      setFeedbackMsg(`Opps..add contact failed`);
      setOpenFeedback(true);
      handleClose();
      setLoading(false);
      throw new Error(e);
    }
  };

  const submitData = async (dataToUpdate, adminChanged) => {
    try {
      setLoading(true);
      if (selectedId) {
        await updateContact(dataToUpdate, adminChanged);
        setFeedbackSeverity("success");
        setFeedbackMsg(`Contact Updated`);
      } else {
        await addContact(dataToUpdate);
        setFeedbackSeverity("success");
        setFeedbackMsg(`Contact Added`);
      }

      // If user is currently logged in, update user's name to reflect on the nav bar
      if (user.email === dataToUpdate.email) {
        updateName(dataToUpdate.firstName);
      }

      setResetSearch(!resetSearch);
      getContacts();
      setOpenFeedback(true);
      handleClose();
      setLoading(false);

      if (
        user.email === dataToUpdate.email &&
        !dataToUpdate.isAdmin &&
        adminChanged
      ) {
        logout({ logoutParams: { returnTo: window.location.origin } });
      }
    } catch (e) {
      console.log(e);
    }
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
      setValue("admin", data.isAdmin);
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
        onClose={handleClose}
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
              sx={{
                width: "100%",
                justifyContent: "space-between",
                mt: 2.8,
              }}
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
                    <Tooltip
                      title={
                        data
                          ? data.isAdmin
                            ? "Unable to edit email of an admin"
                            : ""
                          : ""
                      }
                    >
                      <TextField
                        id={`email`}
                        variant="outlined"
                        size="small"
                        disabled={data ? (data.isAdmin ? true : false) : false}
                        error={error}
                        value={field.value}
                        onChange={onChange}
                        helperText={error?.message}
                        placeholder="Email"
                        sx={{ width: "100%" }}
                      />
                    </Tooltip>
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
              sx={{
                width: "100%",
                justifyContent: "space-between",
                mt: 2.8,
              }}
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
                width: "100%",
                justifyContent: "space-between",
                mt: 2.8,
              }}
            >
              <Grid item>
                <label className="form-label">Admin Access</label>
                <Controller
                  control={control}
                  name="admin"
                  defaultValue={false}
                  render={({
                    field: { ref, onChange, ...field },
                    fieldState: { error },
                  }) => (
                    <TextSwitch
                      id="admin"
                      color="secondary"
                      onChange={onChange}
                      checked={field.value}
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
                <LoadingButton
                  type="submit"
                  color="primary"
                  variant="contained"
                  loading={loading}
                  sx={{ mt: 4, mb: 2, width: "100%" }}
                >
                  Save
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AddContact;
