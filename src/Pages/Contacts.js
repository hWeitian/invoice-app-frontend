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

const Contacts = () => {
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity] =
    useOutletContext();
  const getAccessToken = useGetAccessToken();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  let columns = [];
  let rows = [];

  useEffect(() => {
    getContacts();
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
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleClick}
            >
              <AddIcon sx={{ mr: 1 }} />
              Add Contact
            </Button>
          </Box>
        </Grid>
        <Grid container sx={{ justifyContent: "space-between" }}>
          <Grid item xs={12} sx={{ mt: 5 }}>
            <DataGrid
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
      />
    </>
  );
};

export default Contacts;
