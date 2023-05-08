import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper, TextField, MenuItem, Autocomplete, Grid } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import AsyncAutocomplete from "./AsyncAutocomplete";

const InsertionOrderForm = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [companies, setCompanies] = useState();
  const [selectedCompany, setSelectedCompany] = useState({});
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState();

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    resetField,
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  const getAccessToken = async () => {
    const accessToken = await getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.REACT_APP_AUDIENCE,
        scope: "read:current_user",
      },
    });
    return accessToken;
  };

  const getCompanies = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${process.env.REACT_APP_DB_SERVER}/companies/names`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  const getContacts = async (companyId) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${process.env.REACT_APP_DB_SERVER}/contacts/${companyId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = response.data;
      const newData = [];
      data.forEach((contact) => {
        let name = contact.firstName + " " + contact.lastName;
        newData.push({
          name: name,
          id: contact.id,
        });
      });
      return newData;
    } catch (e) {
      console.log(e);
    }
  };

  // Reset the contacts field if the selected company changes
  useEffect(() => {
    resetField("contacts");
  }, [selectedCompany]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper elevation={0} sx={{ backgroundColor: "#F9FAFB", p: 2 }}>
        <Grid container>
          <Grid item xs={6}>
            <label className="form-label">Bill To</label>
            <Controller
              control={control}
              name="companies"
              defaultValue=""
              rules={{ required: "Please select a company" }}
              render={({
                field: { ref, onChange, onBlur, ...field },
                fieldState,
              }) => (
                <AsyncAutocomplete
                  id="companies-input"
                  fieldState={fieldState}
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
          <Grid item xs={6}>
            <label className="form-label">Contact Person</label>
            <Controller
              control={control}
              name="contacts"
              defaultValue=""
              rules={{ required: "Please select a contact" }}
              render={({
                field: { ref, onChange, onBlur, ...field },
                fieldState,
              }) => (
                <AsyncAutocomplete
                  id="contacts-input"
                  fieldState={fieldState}
                  placeholder="Select a contact"
                  options={contacts}
                  setOptions={setContacts}
                  getData={getContacts}
                  prerequisiteData={selectedCompany}
                  prerequisite={true}
                  columnName="name"
                  value={field.value}
                  onOptionSelected={(option) => {
                    setSelectedContacts(option);
                    onChange(option);
                  }}
                  error={errors.contacts?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        <input type="submit" />
      </Paper>
    </form>
  );
};

export default InsertionOrderForm;
