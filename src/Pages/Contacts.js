import React, { useEffect, useState } from "react";
import { Button, Grid, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { useOutletContext } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import { getData } from "../utils";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import axios from "axios";
import ConfirmationModal from "../Components/ConfirmationModal";
import AddIcon from "@mui/icons-material/Add";
import AddContact from "../Components/AddContact";
import SearchBar from "../Components/SearchBar";
import AutocompleteInput from "../Components/AutocompleteInput";

const Contacts = () => {
  const defaultPage = 0;
  const defaultPageSize = 10;
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity] =
    useOutletContext();
  const getAccessToken = useGetAccessToken();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSearch, setResetSearch] = useState(false);
  const [selectedSearchOption, setSelectedSearchOption] = useState({
    name: "Search Name",
    type: "text",
    id: 2,
  });
  const [paginationModel, setPaginationModel] = useState({
    page: defaultPage,
    pageSize: defaultPageSize,
  });
  const [searchValue, setSearchValue] = useState("");

  let columns = [];
  let rows = [];

  useEffect(() => {
    if (searchValue.length <= 0) {
      getContacts();
    } else {
      searchContactsAfterPageChange();
    }
  }, [paginationModel]);

  const getContacts = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      const response = await getData(
        accessToken,
        `contacts/${paginationModel.page}/${paginationModel.pageSize}`
      );
      setTotalPages(response.count);
      setContacts(response.rows);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClick = () => {
    setOpenForm(true);
  };

  const handleDelete = async () => {
    setOpenConfirmation(false);
    try {
      const accessToken = await getAccessToken();
      const response = await axios.delete(
        `${process.env.REACT_APP_DB_SERVER}/contacts/${selectedRow.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      await getContacts();
      setSelectedRow(null);
      setFeedbackSeverity("success");
      setFeedbackMsg("Contact deleted");
      setOpenFeedback(true);
    } catch (e) {
      setSelectedRow(null);
      setFeedbackSeverity("error");
      setFeedbackMsg(
        "Unable to delete. An invoice or insertion order has been created for this contact."
      );
      setOpenFeedback(true);
      console.log(e);
    }
  };

  const searchContacts = async () => {
    try {
      const accessToken = await getAccessToken();
      if (selectedSearchOption.name === "Search Company") {
        const data = await getData(
          accessToken,
          `contacts/search/company/${searchValue}/${defaultPage}/${defaultPageSize}`
        );
        setPaginationModel({
          page: defaultPage,
          pageSize: defaultPageSize,
        });
        setTotalPages(data.count);
        setContacts(data.rows);
      } else {
        const data = await getData(
          accessToken,
          `contacts/search/name/${searchValue}/${defaultPage}/${defaultPageSize}`
        );
        setPaginationModel({
          page: defaultPage,
          pageSize: defaultPageSize,
        });
        setTotalPages(data.count);
        setContacts(data.rows);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const searchContactsAfterPageChange = async () => {
    try {
      const accessToken = await getAccessToken();
      if (selectedSearchOption.name === "Search Company") {
        const data = await getData(
          accessToken,
          `contacts/search/company/${searchValue}/${paginationModel.page}/${paginationModel.pageSize}`
        );
        setTotalPages(data.count);
        setContacts(data.rows);
      } else {
        const data = await getData(
          accessToken,
          `contacts/search/name/${searchValue}/${paginationModel.page}/${paginationModel.pageSize}`
        );
        setTotalPages(data.count);
        setContacts(data.rows);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const clearSearch = () => {
    setPaginationModel({
      page: defaultPage,
      pageSize: defaultPageSize,
    });
    getContacts();
  };

  const searchOptions = [
    {
      name: "Search Company",
      type: "text",
      id: 1,
    },
    {
      name: "Search Name",
      type: "text",
      id: 2,
    },
  ];

  if (contacts) {
    columns = [
      { field: "id", headerName: "ID", width: 50 },
      {
        field: "title",
        headerName: "Title",
        width: 70,
      },
      { field: "firstName", headerName: "First Name", width: 120 },
      { field: "lastName", headerName: "Last Name", width: 120 },
      {
        field: "email",
        headerName: "Email",
        width: 250,
      },
      {
        field: "company",
        headerName: "Company",
        width: 250,
      },
      {
        field: "designation",
        headerName: "Designation",
        width: 230,
      },

      {
        field: "delete",
        headerName: "",
        width: 50,
        sortable: false,
        renderCell: (params) => {
          const deleteClicked = () => {
            setOpenConfirmation(true);
            setSelectedRow(params.row);
          };
          return (
            <IconButton onClick={deleteClicked}>
              <DeleteIcon sx={{ fontSize: 21 }} />
            </IconButton>
          );
        },
      },
      {
        field: "edit",
        headerName: "",
        width: 50,
        sortable: false,
        renderCell: (params) => {
          const onClick = () => {
            setOpenForm(true);
            setSelectedRow(params.row);
          };
          return (
            <IconButton onClick={onClick}>
              <EditIcon sx={{ fontSize: 21 }} />
            </IconButton>
          );
        },
      },
    ];

    rows = contacts.map((contact, index) => ({
      firstName: contact.firstName,
      lastName: contact.lastName,
      title: contact.title,
      email: contact.email,
      designation: contact.designation,
      company: contact.company.name,
      id: contact.id,
      fullCompany: contact.company,
      isAdmin: contact.isAdmin,
    }));
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <PageTitle>Contacts</PageTitle>
          </Box>
        </Grid>
        <Grid container sx={{ mb: 2, width: "100%" }}>
          <Grid item sx={{ mr: 1 }} xs={3}>
            <SearchBar
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              search={searchContacts}
              clearSearch={clearSearch}
              selectedSearchOption={selectedSearchOption}
              resetSearch={resetSearch}
            />
          </Grid>
          <Grid item xs={6}>
            <AutocompleteInput
              id="magazine-input"
              placeholder="Select an issue"
              options={searchOptions}
              columnName="name"
              hasTwoColumns={false}
              columnNameTwo=""
              value={selectedSearchOption}
              onChange={(e) => setSelectedSearchOption(e)}
              error={false}
              disableClear={true}
              width="260px"
            />
          </Grid>
          <Grid
            item
            sx={{
              textAlign: "right",
            }}
            xs={2.9}
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleClick}
            >
              <AddIcon sx={{ mr: 1 }} />
              Add Contact
            </Button>
          </Grid>
        </Grid>
        <Grid container sx={{ justifyContent: "space-between" }}>
          <Grid item xs={12} sx={{ mt: 0 }}>
            <DataGrid
              disableRowSelectionOnClick
              autoHeight
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10]}
              disableColumnFilter
              disableColumnMenu
              paginationMode="server"
              rowCount={totalPages}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              loading={isLoading}
            />
          </Grid>
        </Grid>
      </Grid>
      <ConfirmationModal
        open={openConfirmation}
        setOpenConfirmation={setOpenConfirmation}
        handleDelete={handleDelete}
        title="Delete Contact"
      >
        Are you sure you want to delete this contact? This action cannot be
        undone.
      </ConfirmationModal>
      <AddContact
        open={openForm}
        setOpenForm={setOpenForm}
        data={selectedRow}
        getContacts={getContacts}
        setSelectedRow={setSelectedRow}
        resetSearch={resetSearch}
        setResetSearch={setResetSearch}
      />
    </>
  );
};

export default Contacts;
