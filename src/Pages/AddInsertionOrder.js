import React, { useState, useEffect } from "react";
import PageTitle from "../Components/PageTitle";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Paper,
  Grid,
  Divider,
  Button,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import AsyncAutocomplete from "../Components/AsyncAutocomplete";
import DatePickerInput from "../Components/DatePickerInput";
import AutocompleteInput from "../Components/AutocompleteInput";
import MultipleAutocompleteInput from "../Components/MultipleAutocompleteInput";
import DollarInput from "../Components/DollarInput";
import InsertionOrderPreview from "../Components/InsertionOrderPreview";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";
import {
  calculateTotalAmount,
  calculateGST,
  calculateNetAmount,
  generatePDF,
  getData,
  formatDate,
  convertDateForDb,
} from "../utils";
import LoadingScreen from "../Components/LoadingScreen";
import PreviewModal from "../Components/PreviewModal";
import { useNavigate, useOutletContext } from "react-router-dom";
import useGetAccessToken from "../Hooks/useGetAccessToken";

const AddInsertionOrder = () => {
  const { user } = useAuth0();
  const getAccessToken = useGetAccessToken();
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [insertionOrderNum, setInsertionOrderNum] = useState();
  const [companies, setCompanies] = useState();
  const [selectedCompany, setSelectedCompany] = useState({});
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState();
  const [magazines, setMagazines] = useState([]);
  const [products, setProducts] = useState([]);
  const [regions, setRegions] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const navigate = useNavigate();
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity] =
    useOutletContext();

  // Get magazines when page load
  useEffect(() => {
    getStartingData();
  }, []);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    resetField,
  } = useForm({
    defaultValues: {
      orderItems: [
        { products: "", position: "", colour: "", regions: "", amount: "" },
      ],
    },
  });

  const {
    fields: items,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "orderItems",
  });

  const onSubmit = (data) => {
    data["insertionId"] = insertionOrderNum;
    const newData = calculateData(data);
    //console.log(newData);
    setFormData(newData);
    handlePreviewOpen();
  };

  const getStartingData = async () => {
    const accessToken = await getAccessToken();
    const promises = [
      getMagazine(accessToken),
      getProducts(accessToken),
      getRegions(accessToken),
    ];
    try {
      const adminId = await getAdminId(accessToken);
      await getInsertionOrderNum(accessToken, adminId);
      await Promise.all(promises);
      const timer = setTimeout(() => {
        handleLoadingClose();
      }, 500);
      return () => clearTimeout(timer);
    } catch (e) {
      console.log(e);
    }
  };

  const getAdminId = async (accessToken) => {
    try {
      const data = await getData(accessToken, `contacts/email/${user.email}`);
      setUserId(data.id);
      setUserName(data.firstName);
      return data.id;
    } catch (e) {
      console.log(e);
    }
  };

  const handlePreviewOpen = () => setOpenPreview(true);
  const handlePreviewClose = () => setOpenPreview(false);

  const handleLoadingOpen = () => setIsLoading(true);
  const handleLoadingClose = () => setIsLoading(false);

  const getInsertionOrderNum = async (accessToken, adminId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DB_SERVER}/insertion-orders`,
        {
          date: new Date(),
          companyId: null,
          contactId: null,
          adminId: adminId,
          discount: 0,
          usdGst: 0,
          netAmount: 0,
          totalAmount: 0,
          isSigned: false,
          isDraft: true,
          url: null,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setInsertionOrderNum(response.data.id);
    } catch (e) {
      console.log(e);
    }
  };

  const getRegions = async (accessToken) => {
    try {
      const regions = await getData(accessToken, `regions`);
      setRegions(regions);
    } catch (e) {
      console.log(e);
    }
  };

  const getProducts = async (accessToken) => {
    try {
      const products = await getData(accessToken, `products`);
      setProducts(products);
    } catch (e) {
      console.log(e);
    }
  };

  const getMagazine = async (accessToken) => {
    try {
      const magazines = await getData(accessToken, `magazines`);
      setMagazines(magazines);
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
          designation: contact.designation,
          email: contact.email,
        });
      });
      return newData;
    } catch (e) {
      console.log(e);
    }
  };

  const uploadPdf = async () => {
    const storageRef = ref(
      storage,
      `insertion-orders/${insertionOrderNum}.pdf`
    );
    try {
      // Generate the pdf from this component
      const pdf = await generatePDF("#io", "insertion-order.pdf");
      // Upload the pdf onto Firebase storage
      const snapshot = await uploadBytes(storageRef, pdf);
      // Get the download url for the uploaded pdf
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (e) {
      console.log(e);
    }
  };

  const updateDatabase = async (data, pdfUrl) => {
    data.url = pdfUrl;
    try {
      const accessToken = await getAccessToken();
      const promises = [
        addInsertionOrdersToDb(accessToken, data),
        addOrdersToDb(accessToken, data),
      ];
      await Promise.all(promises);
    } catch (e) {
      console.log(e);
    }
  };

  const addInsertionOrdersToDb = async (accessToken, data) => {
    try {
      data.ioDate = convertDateForDb(data.ioDate);
      console.log(data);
      const response = await axios.put(
        `${process.env.REACT_APP_DB_SERVER}/insertion-orders/${insertionOrderNum}`,
        data,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  const addOrdersToDb = async (accessToken, data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DB_SERVER}/orders`,
        data,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  const calculateData = (data) => {
    data.discount = parseFloat(data.discount);
    data.netAmount = calculateTotalAmount(data.orderItems, data.discount);
    data.usdGst = calculateGST(data.netAmount);
    data.totalAmount = calculateNetAmount(data.netAmount, data.usdGst);
    data.adminId = userId;
    data.ioDate = formatDate(data.ioDate);
    return data;
  };

  const saveInsertionOrder = async () => {
    try {
      setButtonLoading(true);
      const pdfUrl = await uploadPdf();
      await updateDatabase(formData, pdfUrl);
      reset();
      navigate("/insertion-orders");
      setFeedbackSeverity("success");
      setFeedbackMsg("Insertion Order Created");
      setOpenFeedback(true);
      handlePreviewClose();
      setButtonLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  // Reset the contacts field if the selected company changes
  useEffect(() => {
    resetField("contacts");
  }, [selectedCompany]);

  return (
    <>
      <PageTitle>Create Insertion Order</PageTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper elevation={0} sx={{ backgroundColor: "#F9FAFB", p: 2 }}>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>
            Insertion Order{" "}
            <span style={{ color: "#00B5C5", marginLeft: "10px" }}>
              #{insertionOrderNum && insertionOrderNum}
            </span>
          </Typography>
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
                    width={300}
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
            <Grid item xs={2.3}>
              <label className="form-label">Product Type</label>
            </Grid>
            <Grid item xs={1.3}>
              <label className="form-label">Position</label>
            </Grid>
            <Grid item xs={1.3}>
              <label className="form-label">Colour</label>
            </Grid>
            <Grid item xs={4.6}>
              <label className="form-label">Regions</label>
            </Grid>
            <Grid item xs={2}>
              <label className="form-label">Amount</label>
            </Grid>
          </Grid>

          {items.map((field, index) => (
            <Grid container key={field.id} sx={{ mt: index === 0 ? 1 : 2 }}>
              <Grid item xs={2.3}>
                <Controller
                  control={control}
                  name={`orderItems.${index}.products`}
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
                      width="96%"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={1.3}>
                <Controller
                  control={control}
                  name={`orderItems.${index}.position`}
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
                      placeholder="Position"
                      sx={{ width: "93%" }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={1.3}>
                <Controller
                  control={control}
                  name={`orderItems.${index}.colour`}
                  defaultValue=""
                  rules={{ required: "Please enter a colour" }}
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
                      placeholder="Colour"
                      sx={{ width: "93%" }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4.6}>
                <Controller
                  control={control}
                  name={`orderItems.${index}.regions`}
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
                      width="98%"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2}>
                <Controller
                  control={control}
                  name={`orderItems.${index}.amount`}
                  defaultValue=""
                  rules={{
                    required: "Please add a cost",
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
                      width="95%"
                    />
                  )}
                />
              </Grid>
              {index > 0 && (
                <Grid item xs={0.5} sx={{ textAlign: "right" }}>
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
                products: "",
                position: "",
                colour: "",
                regions: "",
                amount: "",
              });
            }}
          >
            Add Item
          </Button>
          <Grid container sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <label className="form-label">Discount</label>
              <Controller
                control={control}
                name="discount"
                defaultValue={0}
                rules={{
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
                    id="discount"
                    placeholder="Discount"
                    onChange={onChange}
                    error={error}
                    value={field.value}
                    currency="USD"
                    width="250px"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2, mb: 5 }}>
              <label className="form-label">Sales Notes</label>
              <Controller
                control={control}
                name="notes"
                defaultValue=""
                render={({
                  field: { ref, onChange, ...field },
                  fieldState: { error },
                }) => (
                  <TextField
                    id={`notes`}
                    multiline
                    variant="outlined"
                    size="small"
                    error={error}
                    value={field.value}
                    onChange={onChange}
                    helperText={error?.message}
                    placeholder="Sales Notes"
                    sx={{ width: "100%" }}
                    rows={4}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button type="submit" color="secondary" variant="contained">
            Preview
          </Button>
        </Paper>
      </form>
      <PreviewModal
        handlePreviewOpen={handlePreviewOpen}
        handlePreviewClose={handlePreviewClose}
        open={openPreview}
        save={saveInsertionOrder}
        loading={buttonLoading}
        setButtonLoading={setButtonLoading}
      >
        <InsertionOrderPreview formData={formData} userName={userName} />
      </PreviewModal>
      <LoadingScreen open={isLoading} handleClose={handleLoadingClose} />
    </>
  );
};

export default AddInsertionOrder;
