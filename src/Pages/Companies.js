import React, { useEffect, useState } from "react";
import { Button, Grid, Box, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { useOutletContext } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import { getData } from "../Utils/utils";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import CompanyForm from "../Components/CompanyForm";
import axios from "axios";
import ConfirmationModal from "../Components/ConfirmationModal";
import SearchBar from "../Components/SearchBar";

const Companies = () => {
  const defaultPage = 0;
  const defaultPageSize = 10;
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity] =
    useOutletContext();
  const getAccessToken = useGetAccessToken();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSearch, setResetSearch] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: defaultPage,
    pageSize: defaultPageSize,
  });
  const [searchValue, setSearchValue] = useState("");

  let columns = [];
  let rows = [];

  useEffect(() => {
    if (searchValue.length <= 0) {
      getCompanies();
    } else {
      searchCompaniesAfterPageChange();
    }
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
    setResetSearch(!resetSearch);
  };

  const searchCompanies = async () => {
    try {
      const accessToken = await getAccessToken();

      const data = await getData(
        accessToken,
        `companies/search/${searchValue}/${defaultPage}/${defaultPageSize}`
      );
      setPaginationModel({
        page: defaultPage,
        pageSize: defaultPageSize,
      });
      setTotalPages(data.count);
      setCompanies(data.rows);
    } catch (e) {
      console.log(e);
    }
  };

  const searchCompaniesAfterPageChange = async () => {
    try {
      const accessToken = await getAccessToken();

      const data = await getData(
        accessToken,
        `companies/search/${searchValue}/${paginationModel.page}/${paginationModel.pageSize}`
      );
      setTotalPages(data.count);
      setCompanies(data.rows);
    } catch (e) {
      console.log(e);
    }
  };

  const clearSearch = () => {
    setPaginationModel({
      page: defaultPage,
      pageSize: defaultPageSize,
    });
    getCompanies();
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
        <Grid
          container
          sx={{ justifyContent: "space-between", minHeight: "683px" }}
        >
          <Grid item xs={7} sx={{ mt: 0 }}>
            <Grid container sx={{ mb: 0, width: "100%" }}>
              <Grid item sx={{ mb: 2 }} xs={12}>
                <SearchBar
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  search={searchCompanies}
                  clearSearch={clearSearch}
                  resetSearch={resetSearch}
                  selectedSearchOption={{
                    name: "company",
                    type: "text",
                    id: 1,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
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
          <Grid item xs={4.7} sx={{ mt: 0, position: "relative" }}>
            <Paper
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#FFFFFF",
                p: 2,
              }}
            >
              {openForm ? (
                <div>
                  <CompanyForm
                    setOpenForm={setOpenForm}
                    data={selectedRow}
                    setSelectedRow={setSelectedRow}
                    getCompanies={getCompanies}
                    resetSearch={resetSearch}
                    setResetSearch={setResetSearch}
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
