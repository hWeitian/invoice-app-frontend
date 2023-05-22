import React, { useEffect, useState } from "react";
import { Button, Grid, Box, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { useOutletContext } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import { getData } from "../utils";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import CompanyForm from "../Components/CompanyForm";
import axios from "axios";
import ConfirmationModal from "../Components/ConfirmationModal";

const Companies = () => {
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity] =
    useOutletContext();
  const getAccessToken = useGetAccessToken();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  let columns = [];
  let rows = [];

  useEffect(() => {
    getCompanies();
  }, [paginationModel]);

  const getCompanies = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      const response = await getData(
        accessToken,
        `companies/${paginationModel.page}/${paginationModel.pageSize}`
      );
      setTotalPages(response.count);
      setCompanies(response.rows);
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
        `${process.env.REACT_APP_DB_SERVER}/companies/${selectedRow.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      await getCompanies();
      setSelectedRow(null);
      setFeedbackSeverity("success");
      setFeedbackMsg("Company deleted");
      setOpenFeedback(true);
    } catch (e) {
      setSelectedRow(null);
      setFeedbackSeverity("error");
      setFeedbackMsg(
        "Unable to delete. An invoice or insertion order has been created for this company."
      );
      setOpenFeedback(true);
      console.log(e);
    }
  };

  if (companies) {
    columns = [
      { field: "id", headerName: "ID", width: 50 },
      { field: "name", headerName: "Name", width: 220 },
      {
        field: "billingAddress",
        headerName: "Address",
        width: 300,
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

    rows = companies.map((company, index) => ({
      name: company.name,
      billingAddress: company.billingAddress,
      id: company.id,
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
            <PageTitle>Companies</PageTitle>
          </Box>
        </Grid>
        <Grid container sx={{ justifyContent: "space-between" }}>
          <Grid item xs={7} sx={{ mt: 5 }}>
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
          <Grid item xs={4.7} sx={{ mt: 5, position: "relative" }}>
            <Paper
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#FFFFFF",
                p: 2,
              }}
            >
              {openForm ? (
                <div style={{ height: "590px" }}>
                  <CompanyForm
                    setOpenForm={setOpenForm}
                    data={selectedRow}
                    setSelectedRow={setSelectedRow}
                    getCompanies={getCompanies}
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    alignContent: "center",
                    height: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  <p
                    style={{
                      width: "100%",
                      textAlign: "center",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    Select a company to edit or
                  </p>
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <Button
                      onClick={handleClick}
                      color="secondary"
                      variant="text"
                      sx={{ textTransform: "none" }}
                    >
                      Click to add a new company
                    </Button>
                  </div>
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <ConfirmationModal
        open={openConfirmation}
        setOpenConfirmation={setOpenConfirmation}
        handleDelete={handleDelete}
        title="Delete Company"
      >
        Are you sure you want to delete this company? This action cannot be
        undone.
      </ConfirmationModal>
    </>
  );
};

export default Companies;
