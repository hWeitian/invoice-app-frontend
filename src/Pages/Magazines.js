import React, { useEffect, useState } from "react";
import { Button, Grid, Box, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { useOutletContext } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import { getData, createStringDate } from "../utils";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import MagazineForm from "../Components/MagazineForm";
import axios from "axios";
import ConfirmationModal from "../Components/ConfirmationModal";
import SearchBar from "../Components/SearchBar";
import AutocompleteInput from "../Components/AutocompleteInput";

const Magazines = () => {
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity] =
    useOutletContext();
  const getAccessToken = useGetAccessToken();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [magazines, setMagazines] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSearch, setResetSearch] = useState(false);
  const [selectedSearchOption, setSelectedSearchOption] = useState({
    name: "Search Year",
    id: 1,
    type: "number",
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  let columns = [];
  let rows = [];

  useEffect(() => {
    getMagazines();
  }, [paginationModel]);

  const getMagazines = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      const response = await getData(
        accessToken,
        `magazines/${paginationModel.page}/${paginationModel.pageSize}`
      );
      setTotalPages(response.count);
      setMagazines(response.rows);
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
        `${process.env.REACT_APP_DB_SERVER}/magazines/${selectedRow.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      await getMagazines();
      setSelectedRow(null);
      setFeedbackSeverity("success");
      setFeedbackMsg("Issue deleted");
      setOpenFeedback(true);
    } catch (e) {
      setSelectedRow(null);
      setFeedbackSeverity("error");
      setFeedbackMsg(
        "Unable to delete. An invoice or insertion order has been created for this issue."
      );
      setOpenFeedback(true);
      console.log(e);
    }
    setResetSearch(!resetSearch);
  };

  const searchMagazines = async (searchText) => {
    try {
      const accessToken = await getAccessToken();
      if (selectedSearchOption.name === "Search Year") {
        const data = await getData(
          accessToken,
          `magazines/search/year/${searchText}/${paginationModel.page}/${paginationModel.pageSize}`
        );
        setTotalPages(data.count);
        setMagazines(data.rows);
      } else {
        const data = await getData(
          accessToken,
          `magazines/search/month/${searchText}/${paginationModel.page}/${paginationModel.pageSize}`
        );
        setTotalPages(data.count);
        setMagazines(data.rows);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const clearSearch = () => {
    getMagazines();
  };

  const searchOptions = [
    {
      name: "Search Year",
      type: "number",
      id: 1,
    },
    {
      name: "Search Month",
      type: "text",
      id: 2,
    },
  ];

  if (magazines) {
    columns = [
      { field: "year", headerName: "Year", width: 100 },
      { field: "month", headerName: "Month", width: 140 },
      {
        field: "closingDate",
        headerName: "Closing Date",
        width: 160,
      },
      {
        field: "materialDeadline",
        headerName: "Material Deadline",
        width: 180,
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

    rows = magazines.map((magazine, index) => ({
      year: magazine.year,
      month: magazine.month,
      closingDate: createStringDate(magazine.closingDate),
      materialDeadline: createStringDate(magazine.materialDeadline),
      id: magazine.id,
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
            <PageTitle>Magazine Issues</PageTitle>
          </Box>
        </Grid>
        <Grid
          container
          sx={{ justifyContent: "space-between", minHeight: "583px" }}
        >
          <Grid item xs={7} sx={{ mt: 0 }}>
            <Grid container sx={{ mb: 2, width: "100%" }}>
              <Grid item sx={{ mr: 1 }} xs={7.4}>
                <SearchBar
                  search={searchMagazines}
                  clearSearch={clearSearch}
                  resetSearch={resetSearch}
                  selectedSearchOption={selectedSearchOption}
                />
              </Grid>
              <Grid item>
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
            </Grid>
            <Grid container>
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
          <Grid
            item
            xs={4.7}
            sx={{ mt: 0, position: "relative", height: "100%" }}
          >
            <Paper
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#FFFFFF",
                p: 2,
              }}
            >
              {openForm ? (
                <div style={{ minHeight: "490px" }}>
                  <MagazineForm
                    setOpenForm={setOpenForm}
                    data={selectedRow}
                    setSelectedRow={setSelectedRow}
                    getMagazines={getMagazines}
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
                    Select an issue to edit or
                  </p>
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <Button
                      onClick={handleClick}
                      color="secondary"
                      variant="text"
                      sx={{ textTransform: "none" }}
                    >
                      Click to add a new Issue
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
        title="Delete Issue"
      >
        Are you sure you want to delete this issue? This action cannot be
        undone.
      </ConfirmationModal>
    </>
  );
};

export default Magazines;
