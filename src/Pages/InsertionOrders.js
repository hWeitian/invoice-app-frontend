import React, { useState, useEffect } from "react";
import { Grid, Box, Button, Chip, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import { createStringDate, combineProducts } from "../Utils/utils";
import SignedIoModal from "../Components/SignedIoModal";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import SearchBar from "../Components/SearchBar";
import AutocompleteInput from "../Components/AutocompleteInput";
import { getData, exportDataToXlsx } from "../Utils/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "../Components/ConfirmationModal";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

const InsertionOrders = () => {
  const navigate = useNavigate();
  const defaultPage = 0;
  const defaultPageSize = 10;

  const getAccessToken = useGetAccessToken();
  const [openUploadIo, setOpenUploadIo] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [insertionOrders, setInsertionOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSearchOption, setSelectedSearchOption] = useState({
    name: "Search Company",
    type: "text",
    id: 1,
  });
  const [paginationModel, setPaginationModel] = useState({
    page: defaultPage,
    pageSize: defaultPageSize,
  });
  const [searchValue, setSearchValue] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity] =
    useOutletContext();

  let columns;
  let rows;

  useEffect(() => {
    if (searchValue.length <= 0) {
      getInsertionOrders();
    } else {
      searchInsertionOrdersAfterPageChange();
    }
  }, [paginationModel]);

  const getInsertionOrders = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      const data = await getData(
        accessToken,
        `insertion-orders/table-data/${paginationModel.page}/${paginationModel.pageSize}`
      );
      setTotalPages(data.count);
      setInsertionOrders(data.rows);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getAllInsertionOrders = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      const response = await getData(accessToken, `insertion-orders`);
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const searchInsertionOrders = async () => {
    let data;
    try {
      const accessToken = await getAccessToken();
      if (selectedSearchOption.name === "Search Company") {
        data = await getData(
          accessToken,
          `insertion-orders/search/company/${searchValue}/${defaultPage}/${defaultPageSize}`
        );
      } else {
        data = await getData(
          accessToken,
          `insertion-orders/search/id/${searchValue}/${defaultPage}/${defaultPageSize}`
        );
      }
      setPaginationModel({
        page: defaultPage,
        pageSize: defaultPageSize,
      });
      setTotalPages(data.count);
      setInsertionOrders(data.rows);
    } catch (e) {
      console.log(e);
    }
  };

  const searchInsertionOrdersAfterPageChange = async () => {
    let data;
    try {
      const accessToken = await getAccessToken();
      if (selectedSearchOption.name === "Search Company") {
        data = await getData(
          accessToken,
          `insertion-orders/search/company/${searchValue}/${paginationModel.page}/${paginationModel.pageSize}`
        );
      } else {
        data = await getData(
          accessToken,
          `insertion-orders/search/id/${searchValue}/${paginationModel.page}/${paginationModel.pageSize}`
        );
      }
      setTotalPages(data.count);
      setInsertionOrders(data.rows);
    } catch (e) {
      console.log(e);
    }
  };

  const clearSearch = () => {
    setPaginationModel({
      page: defaultPage,
      pageSize: defaultPageSize,
    });
    getInsertionOrders();
  };

  const handleOnExport = async () => {
    const data = await getAllInsertionOrders();
    setIsLoading(false);
    exportDataToXlsx(data, "sheet1", "InsertionOrders.xlsx");
  };

  const handleDelete = (insertionOrderId) => {
    setOpenConfirmation(true);
    setSelectedRow(insertionOrderId);
  };

  const handleDeleteConfirmationClick = async () => {
    setOpenConfirmation(false);
    try {
      const accessToken = await getAccessToken();
      const response = await axios.delete(
        `${process.env.REACT_APP_DB_SERVER}/insertion-orders/${selectedRow}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      await getInsertionOrders();
      setSelectedRow(null);
      setFeedbackSeverity("success");
      setFeedbackMsg("Insertion Order deleted");
      setOpenFeedback(true);
    } catch (e) {
      setSelectedRow(null);
      setFeedbackSeverity("error");
      setFeedbackMsg("Unable to delete.");
      setOpenFeedback(true);
      console.log(e);
    }
  };

  const searchOptions = [
    {
      name: "Search Company",
      type: "text",
      id: 1,
    },
    {
      name: "Search IO Number",
      type: "number",
      id: 2,
    },
  ];

  if (insertionOrders) {
    columns = [
      { field: "id", headerName: "Order", width: 90 },
      { field: "date", headerName: "Date", width: 120 },
      {
        field: "isSigned",
        headerName: "Status",
        width: 100,
        renderCell: (params) => {
          const cellValue = params.row["isSigned"];
          let output = "";
          let color = "";
          if (cellValue) {
            output = "Signed";
            color = "chipGreen";
          } else {
            output = "Pending";
            color = "chipRed";
          }
          return <Chip label={output} color={color} size="small"></Chip>;
        },
      },
      {
        field: "company",
        headerName: "Company",
        width: 200,
      },
      { field: "type", headerName: "Type", width: 280 },
      { field: "invoice", headerName: "Invoice", width: 100 },
      {
        field: "url",
        headerName: "File",
        width: 115,
        sortable: false,
        disableClickEventBubbling: true,
        renderCell: (params) => {
          const onClick = (e) => {
            const url = params.row["url"];
            window.open(url, "_blank");
          };

          return (
            <Button
              variant="text"
              color="secondary"
              size="small"
              onClick={onClick}
            >
              Download
            </Button>
          );
        },
      },
      {
        field: "upload",
        headerName: "",
        width: 125,
        sortable: false,
        disableClickEventBubbling: true,
        renderCell: (params) => {
          const onClick = (e) => {
            setSelectedData(params.row);
            setOpenUploadIo(true);
          };

          return (
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={onClick}
            >
              Upload Signed
            </Button>
          );
        },
      },
      {
        field: "delete",
        headerName: "",
        width: 50,
        sortable: false,
        disableClickEventBubbling: true,
        renderCell: (params) => {
          if (params.row.isSigned === false && params.row.invoice === null) {
            return (
              <IconButton onClick={() => handleDelete(params.row.id)}>
                <DeleteIcon sx={{ fontSize: 20 }} />
              </IconButton>
            );
          }
        },
      },
    ];

    rows = insertionOrders.map((order, index) => ({
      id: `IO-${order.id}`,
      date: createStringDate(order.date),
      isSigned: order.isSigned,
      company: order.company.name,
      type: combineProducts(order.orders),
      invoice:
        order.orders[0].invoiceId === null
          ? order.orders[0].invoiceId
          : `${order.orders[0].invoiceId}.INV`,
      url: order.url,
    }));
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <PageTitle>Insertion Orders</PageTitle>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ mt: 0 }}>
        <div style={{ width: "100%" }}>
          <Grid container sx={{ mb: 2, width: "100%" }}>
            <Grid item sx={{ mr: 1 }} xs={3}>
              <SearchBar
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                search={searchInsertionOrders}
                clearSearch={clearSearch}
                selectedSearchOption={selectedSearchOption}
              />
            </Grid>
            <Grid item xs={2.6}>
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
            <Grid item xs={3.4}>
              <Tooltip title="Download all Insertion Orders">
                <IconButton onClick={handleOnExport}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
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
                onClick={() => navigate("/add-io")}
              >
                <AddIcon sx={{ mr: 1 }} />
                Add Insertion Order
              </Button>
            </Grid>
          </Grid>
          {insertionOrders && (
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
          )}
        </div>
        <SignedIoModal
          open={openUploadIo}
          setOpenUploadIo={setOpenUploadIo}
          data={selectedData}
          getInsertionOrders={getInsertionOrders}
        />
        <ConfirmationModal
          open={openConfirmation}
          setOpenConfirmation={setOpenConfirmation}
          handleDelete={handleDeleteConfirmationClick}
          title="Delete Insertion Order"
        >
          Are you sure you want to delete this insertion order? This action
          cannot be undone.
        </ConfirmationModal>
      </Grid>
    </Grid>
  );
};

export default InsertionOrders;
