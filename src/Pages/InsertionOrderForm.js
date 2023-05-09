import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Paper, Grid, Divider, Button, TextField } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import AsyncAutocomplete from "../Components/AsyncAutocomplete";
import DatePickerInput from "../Components/DatePickerInput";
import AutocompleteInput from "../Components/AutocompleteInput";
import MultipleAutocompleteInput from "../Components/MultipleAutocompleteInput";

const InsertionOrderForm = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [companies, setCompanies] = useState();
  const [selectedCompany, setSelectedCompany] = useState({});
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState();
  const [magazines, setMagazines] = useState([]);
  const [products, setProducts] = useState([]);
  const [regions, setRegions] = useState([]);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    resetField,
  } = useForm({
    defaultValues: {
      orderItems: [
        { product: "", position: "", colour: "", regions: "", amount: 0 },
      ],
    },
  });

  const {
    fields: items,
    append,
    prepend,
    remove,
    swap,
    move,
    insert,
  } = useFieldArray({
    control,
    name: "orderItems",
  });
  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  // Get magazines when page load
  useEffect(() => {
    getMagazine();
    getProducts();
    getRegions();
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

  const getRegions = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${process.env.REACT_APP_DB_SERVER}/regions`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(response.data);
      setRegions(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getProducts = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${process.env.REACT_APP_DB_SERVER}/products`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setProducts(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getMagazine = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${process.env.REACT_APP_DB_SERVER}/magazines`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setMagazines(response.data);
    } catch (e) {
      console.log(e);
    }
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
              render={({ field: { ref, onChange, onBlur, ...field } }) => (
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
          <Grid item xs={6}>
            <label className="form-label">Contact Person</label>
            <Controller
              control={control}
              name="contacts"
              defaultValue=""
              rules={{ required: "Please select a contact" }}
              render={({ field: { ref, onChange, onBlur, ...field } }) => (
                <AsyncAutocomplete
                  id="contacts-input"
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

        <Grid container sx={{ mt: 5 }}>
          <Grid item xs={6}>
            <label className="form-label">Insertion Order Date</label>
            <Controller
              control={control}
              name="ioDate"
              defaultValue=""
              rules={{ required: "Please select a date" }}
              render={({
                field: { ref, onChange, onBlur, ...field },
                fieldState,
              }) => (
                <DatePickerInput
                  error={errors.ioDate?.message}
                  value={field.value}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <label className="form-label">Magazine Issue</label>
            <Controller
              control={control}
              name="magazine"
              defaultValue=""
              rules={{ required: "Please select an issue" }}
              render={({ field: { ref, onChange, onBlur, ...field } }) => (
                <AutocompleteInput
                  id="magazine-input"
                  placeholder="Select an issue"
                  options={magazines}
                  columnName="year"
                  hasTwoColumns={true}
                  columnNameTwo="month"
                  value={field.value}
                  onChange={onChange}
                  error={errors.magazine?.message}
                  width="300px"
                />
              )}
            />
          </Grid>
        </Grid>
        <Divider sx={{ mt: 5, mb: 5 }} />
        <Grid container>
          <Grid item xs={3}>
            <label className="form-label">Product Type</label>
          </Grid>
          <Grid item xs={2}>
            <label className="form-label">Position</label>
          </Grid>
          <Grid item xs={2}>
            <label className="form-label">Colour</label>
          </Grid>
          <Grid item xs={2}>
            <label className="form-label">Regions</label>
          </Grid>
          <Grid item xs={2}>
            <label className="form-label">Amount</label>
          </Grid>
        </Grid>
        {items.map((field, index) => (
          <Grid container key={field.id} sx={{ mt: 2 }}>
            <Grid item xs={2}>
              <Controller
                control={control}
                name={`products-${index}`}
                defaultValue=""
                rules={{ required: "Please select a product" }}
                render={({
                  field: { ref, onChange, ...field },
                  fieldState: { error },
                }) => (
                  <AutocompleteInput
                    id={`products-${index}`}
                    placeholder="Select a product"
                    options={products}
                    columnName="name"
                    hasTwoColumns={false}
                    columnNameTwo=""
                    value={field.value}
                    onChange={onChange}
                    error={error?.message}
                    width="250px"
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                control={control}
                name={`position-${index}`}
                defaultValue=""
                rules={{ required: "Please enter a position" }}
                render={({
                  field: { ref, onChange, ...field },
                  fieldState: { error },
                }) => (
                  <TextField
                    id={`position-${index}`}
                    variant="outlined"
                    size="small"
                    error={error}
                    onChange={onChange}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                control={control}
                name={`colour-${index}`}
                defaultValue=""
                rules={{ required: "Please enter a position" }}
                render={({
                  field: { ref, onChange, ...field },
                  fieldState: { error },
                }) => (
                  <TextField
                    id={`position-${index}`}
                    variant="outlined"
                    size="small"
                    error={error}
                    onChange={onChange}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                control={control}
                name={`regions-${index}`}
                defaultValue=""
                rules={{ required: "Please select a region" }}
                render={({
                  field: { ref, onChange, ...field },
                  fieldState: { error },
                }) => (
                  <MultipleAutocompleteInput
                    id={`regions-${index}`}
                    placeholder="Select a region"
                    options={regions}
                    columnName="name"
                    hasTwoColumns={false}
                    columnNameTwo=""
                    value={field.value}
                    onChange={onChange}
                    error={error?.message}
                    width="200px"
                  />
                )}
              />
            </Grid>
          </Grid>
        ))}
        <Button
          type="button"
          color="secondary"
          onClick={() => {
            append({
              product: "",
            });
          }}
        >
          Add Item
        </Button>

        <input type="submit" />
      </Paper>
    </form>
  );
};

export default InsertionOrderForm;
