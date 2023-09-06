import React, { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Paper,
  Grid,
  Divider,
  Button,
  TextField,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import PageTitle from "../Components/PageTitle";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import AsyncAutocomplete from "../Components/AsyncAutocomplete";
import DatePickerInput from "../Components/DatePickerInput";
import DollarInput from "../Components/DollarInput";
import PreviewModal from "../Components/PreviewModal";
import InvoicePreview from "../Components/InvoicePreview";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";
import {
  generateDescription,
  calculateTotalAmount,
  calculateGST,
  calculateNetAmount,
  convertGstToSgd,
  getData,
  formatDate,
  convertDateForDb,
  generatePdfFromHtml,
} from "../Utils/utils";
import { generateInvHtml } from "../Utils/generateInvToHtml";
import { useNavigate, useOutletContext } from "react-router-dom";
import useGetAccessToken from "../Hooks/useGetAccessToken";

const AddInvoice = () => {
  const { user } = useAuth0();
  const getAccessToken = useGetAccessToken();
  const [userId, setUserId] = useState();
  const [invoiceNum, setInvoiceNum] = useState();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState();
  const [insertionOrders, setInsertionOrders] = useState();
  const [selectedIO, setSelectedIO] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [formData, setFormData] = useState({});
  const [openPreview, setOpenPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity] =
    useOutletContext();

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    resetField,
    setValue,
  } = useForm({
    defaultValues: {
      invoiceItems: [{ description: "", amount: "" }],
    },
  });

  const {
    fields: items,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "invoiceItems",
  });

  useEffect(() => {
    getStartingData();
  }, []);

  // Reset the contacts field if the selected company changes
  useEffect(() => {
    if (!selectedIO) {
      resetField("contacts");
    }
  }, [selectedCompany]);

  const onSubmit = (data) => {
    data["invoiceNum"] = invoiceNum;
    data["exchangeRate"] = exchangeRate;
    const newData = calculateData(data);
    setFormData(newData);
    handlePreviewOpen();
  };

  const handlePreviewOpen = () => setOpenPreview(true);
  const handlePreviewClose = () => setOpenPreview(false);

  const getStartingData = async () => {
    try {
      await getInvoiceNum();
      getExchangeRate();
    } catch (e) {
      console.log(e);
    }
  };

  const getAdminId = async () => {
    try {
      const accessToken = await getAccessToken();
      const data = await getData(accessToken, `contacts/email/${user.email}`);
      setUserId(data.id);
      return data.id;
    } catch (e) {
      console.log(e);
    }
  };

  const getCompanies = async () => {
    try {
      const accessToken = await getAccessToken();
      const data = await getData(accessToken, `companies/names`);
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const getContacts = async (companyId) => {
    try {
      const accessToken = await getAccessToken();
      const data = await getData(accessToken, `contacts/${companyId}`);
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

  const getInvoiceNum = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${process.env.REACT_APP_DB_SERVER}/invoices/latest-number`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      let id;
      if (response.data.length === 0) {
        id = 1;
      } else {
        id = response.data[0].id;
        id++;
      }
      setInvoiceNum(id);
    } catch (e) {
      console.log(e);
    }
  };

  const getFinalInvoiceNum = async (accessToken, adminId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DB_SERVER}/invoices/add-empty`,
        {
          invoiceDate: new Date(),
          companyId: null,
          contactId: null,
          dueDate: null,
          discount: 0,
          netAmount: 0,
          totalAmount: 0,
          usdGst: 0,
          sgdGst: 0,
          exchangeRateId: 0,
          amountPaid: 0,
          adminId: adminId,
          isDraft: true,
          url: null,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data.id;
    } catch (e) {
      console.log(e);
    }
  };

  const getInsertionOrders = async () => {
    try {
      const accessToken = await getAccessToken();
      const data = await getData(accessToken, `insertion-orders/invoice-data`);
      setInsertionOrders(data);
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const getExchangeRate = async () => {
    try {
      const accessToken = await getAccessToken();
      const data = await getData(accessToken, `exchange-rates/latest`);
      setExchangeRate(data);
    } catch (e) {
      console.log(e);
    }
  };

  const calculateData = (data) => {
    data.discount = parseFloat(data.discount);
    data.netAmount = calculateTotalAmount(data.invoiceItems, data.discount);
    data.usdGst = calculateGST(data.netAmount);
    data.totalAmount = calculateNetAmount(data.netAmount, data.usdGst);
    data.adminId = userId;
    data.sgdGst = convertGstToSgd(data.usdGst, exchangeRate);
    data.invoiceDate = formatDate(data.invoiceDate);
    data.dueDate = formatDate(data.dueDate);
    return data;
  };

  // Function to control the prefilling of data once an insertion order is selected
  const prefillData = (option) => {
    setSelectedIO(option);
    // If an option is selected
    if (option) {
      const company = {
        label: option.company.name,
        id: option.company.id,
        billingAddress: option.company.billingAddress,
      };
      // Prefill value in company input
      setValue("companies", company);
      // Update state of selectedCompany so that it can be read by the contact input
      setSelectedCompany(company);
      const contact = {
        name: `${option.contact.firstName} ${option.contact.lastName}`,
        id: option.contact.id,
        designation: option.contact.designation,
        email: option.contact.email,
      };
      // Prefill value in contact input and update state
      setValue("contacts", contact);
      setSelectedContacts(contact);

      // Add the number of desciption and amount input based on the number of orders in the insertion order
      for (let i = 1; i < option.orders.length; i++) {
        append({
          description: "",
          amount: "",
        });
      }

      // After the correct number of description and amount input is added, prefill the data according to the order items from the selected insertion order
      option.orders.forEach((order, index) => {
        const description = generateDescription(order);
        setValue(`invoiceItems.${index}.description`, description);
        setValue(`invoiceItems.${index}.amount`, order.cost);
        setValue(`invoiceItems.${index}.id`, order.id);
      });

      // Set the discount given in the insertion order
      setValue("discount", option.discount);
    } else {
      // If insertion order is removed, reset the company and contact fields
      setValue("companies", null);
      setSelectedCompany(null);
      setValue("contacts", null);
      setSelectedContacts(null);
      setValue("discount", 0);

      // Remove the additional input field for description and amount
      for (let i = 1; i < items.length; i++) {
        remove(i);
      }

      // Reset the input field for desciption and amount to empty string
      reset({
        invoiceItems: [{ description: "", amount: "" }],
      });
    }
  };

  const uploadPdf = async (data, finalInvNum) => {
    const storageRef = ref(storage, `invoices/${finalInvNum}.pdf`);
    try {
      // Generate the html for invoice
      const html = renderToStaticMarkup(generateInvHtml(data));
      // Generate the pdf from the html
      const pdf = await generatePdfFromHtml(html, `invoice-${finalInvNum}.pdf`);
      // Upload the pdf onto Firebase storage
      const snapshot = await uploadBytes(storageRef, pdf);
      // Get the download url for the uploaded pdf
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (e) {
      console.log(e);
    }
  };

  const addInvoiceToDb = async (accessToken, data, finalInvNum) => {
    try {
      data.invoiceDate = convertDateForDb(data.invoiceDate);
      const response = await axios.put(
        `${process.env.REACT_APP_DB_SERVER}/invoices/${finalInvNum}`,
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
      console.log(data);
      const response = await axios.put(
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

  const updateDatabase = async (data, finalInvNum, accessToken) => {
    try {
      // const accessToken = await getAccessToken();
      const pdfUrl = await uploadPdf(data, finalInvNum);
      data.url = pdfUrl;
      const promises = [
        addInvoiceToDb(accessToken, data, finalInvNum),
        addOrdersToDb(accessToken, data),
      ];
      await Promise.all(promises);
    } catch (e) {
      console.log(e);
    }
  };

  const saveInvoice = async () => {
    try {
      setLoading(true);
      const accessToken = await getAccessToken();
      const adminId = await getAdminId(accessToken);
      const finalInvNum = await getFinalInvoiceNum(accessToken, adminId);
      const finalData = {
        ...formData,
        invoiceNum: finalInvNum,
        adminId: adminId,
      };
      await updateDatabase(finalData, finalInvNum, accessToken);
      navigate("/invoices");
      setFeedbackSeverity("success");
      setFeedbackMsg("Invoice Created");
      setOpenFeedback(true);
      handlePreviewClose();
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <PageTitle>Create Invoice</PageTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper elevation={0} sx={{ backgroundColor: "#F9FAFB", p: 2 }}>
          <Grid container>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>
              Invoice{" "}
              <span style={{ color: "#00B5C5", marginLeft: "10px" }}>
                #{invoiceNum && invoiceNum}
              </span>
            </Typography>
            <Tooltip
              title="Temporary invoice number. Actual invoice number will be issued when generating invoice."
              sx={{ ml: 1, mt: 0.36, color: "#CCCCCC", cursor: "pointer" }}
            >
              <InfoIcon style={{ fontSize: "18px" }} />
            </Tooltip>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <label className="form-label">
                Insertion Order - Select to prefill data
              </label>
              <Controller
                control={control}
                name="insertionOrder"
                defaultValue=""
                render={({ field: { ref, onChange, ...field } }) => (
                  <AsyncAutocomplete
                    id="insertionOrder-input"
                    placeholder="Select an Insertion Order"
                    options={selectedIO}
                    setOptions={setSelectedIO}
                    getData={getInsertionOrders}
                    prerequisiteData=""
                    prerequisite={false}
                    columnName="label"
                    value={field.value}
                    onOptionSelected={(option) => {
                      prefillData(option);
                      onChange(option);
                    }}
                    error={errors.insertionOrder?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container sx={{ mt: 4 }}>
            <Grid item xs={4}>
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
            <Grid item xs={4}>
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
            <Grid item xs={4}>
              <label className="form-label">Purchase Order</label>
              <Controller
                control={control}
                name="purchaseOrder"
                defaultValue=""
                render={({
                  field: { ref, onChange, ...field },
                  fieldState: { error },
                }) => (
                  <TextField
                    id={`notes`}
                    variant="outlined"
                    size="small"
                    error={error}
                    value={field.value}
                    onChange={onChange}
                    helperText={error?.message}
                    placeholder="Purchase Order"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 5 }}>
            <Grid item xs={4}>
              <label className="form-label">Invoice Date</label>
              <Controller
                control={control}
                name="invoiceDate"
                defaultValue=""
                rules={{ required: "Please select a date" }}
                render={({
                  field: { ref, onChange, onBlur, ...field },
                  fieldState,
                }) => (
                  <DatePickerInput
                    error={errors.invoiceDate?.message}
                    value={field.value}
                    onChange={onChange}
                    width="300px"
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <label className="form-label">Due Date</label>
              <Controller
                control={control}
                name="dueDate"
                defaultValue=""
                rules={{ required: "Please select a date" }}
                render={({
                  field: { ref, onChange, onBlur, ...field },
                  fieldState,
                }) => (
                  <DatePickerInput
                    error={errors.dueDate?.message}
                    value={field.value}
                    onChange={onChange}
                    width="300px"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Divider sx={{ mt: 5, mb: 5 }} />
          <Grid container>
            <Grid item xs={9}>
              <label className="form-label">Description</label>
            </Grid>
            <Grid item xs={3}>
              <label className="form-label">Amount</label>
            </Grid>
          </Grid>
          {items.map((field, index) => (
            <Grid container key={field.id} sx={{ mt: 2 }}>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name={`invoiceItems.${index}.id`}
                  defaultValue=""
                  type="hidden"
                  render={({
                    field: { ref, onChange, ...field },
                    fieldState: { error },
                  }) => (
                    <input
                      id={`position-${index}`}
                      variant="outlined"
                      hidden
                      value={field.value}
                      onChange={onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`invoiceItems.${index}.description`}
                  defaultValue=""
                  rules={{ required: "Please enter a description" }}
                  render={({
                    field: { ref, onChange, ...field },
                    fieldState: { error },
                  }) => (
                    <TextField
                      id={`position-${index}`}
                      variant="outlined"
                      size="small"
                      error={error}
                      value={field.value}
                      onChange={onChange}
                      helperText={error?.message}
                      placeholder="Description"
                      sx={{ width: "850px" }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2}>
                <Controller
                  control={control}
                  name={`invoiceItems.${index}.amount`}
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
                <Grid item xs={1} sx={{ textAlign: "center" }}>
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
          </Grid>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            sx={{ mt: 4, mb: 2 }}
          >
            Preview
          </Button>
        </Paper>
      </form>
      <PreviewModal
        handlePreviewOpen={handlePreviewOpen}
        handlePreviewClose={handlePreviewClose}
        open={openPreview}
        save={saveInvoice}
        loading={loading}
        setButtonLoading={setLoading}
      >
        <InvoicePreview formData={formData} />
      </PreviewModal>
    </>
  );
};

export default AddInvoice;
