import React, { useState, useEffect } from "react";
import { Grid, Button, Box, Chip } from "@mui/material";
import PageTitle from "../Components/PageTitle";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { createStringDate } from "../Utils/utils";
import axios from "axios";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import SearchBar from "../Components/SearchBar";
import AutocompleteInput from "../Components/AutocompleteInput";
import { getData } from "../Utils/utils";
import TableMenu from "../Components/TableMenu";

const Invoices = () => {
  const defaultPage = 0;
  const defaultPageSize = 10;
  const navigate = useNavigate();
  const getAccessToken = useGetAccessToken();
  const [invoices, setInvoices] = useState();
  const [resetSearch, setResetSearch] = useState(false);
  const [selectedSearchOption, setSelectedSearchOption] = useState({
    name: "Search Company",
    type: "text",
    id: 1,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: defaultPage,
    pageSize: defaultPageSize,
  });
  const [searchValue, setSearchValue] = useState("");

  let columns = [];
  let rows = [];

  useEffect(() => {
    if (searchValue.length <= 0) {
      getInvoices();
    } else {
      searchInvoicesAfterPageChange();
    }
  }, [paginationModel]);

  const getInvoices = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${process.env.REACT_APP_DB_SERVER}/invoices/table-data/${paginationModel.page}/${paginationModel.pageSize}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setTotalPages(response.data.count);
      setInvoices(response.data.rows);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const searchInvoices = async () => {
    let data;
    try {
      const accessToken = await getAccessToken();
      if (selectedSearchOption.name === "Search Company") {
        data = await getData(
          accessToken,
          `invoices/search/company/${searchValue}/${defaultPage}/${defaultPageSize}`
        );
      } else {
        data = await getData(
          accessToken,
          `invoices/search/id/${searchValue}/${defaultPage}/${defaultPageSize}`
        );
      }
      setPaginationModel({
        page: defaultPage,
        pageSize: defaultPageSize,
      });
      setTotalPages(data.count);
      setInvoices(data.rows);
    } catch (e) {
      console.log(e);
    }
  };

  const searchInvoicesAfterPageChange = async () => {
    let data;
    try {
      const accessToken = await getAccessToken();
      if (selectedSearchOption.name === "Search Company") {
        data = await getData(
          accessToken,
          `invoices/search/company/${searchValue}/${paginationModel.page}/${paginationModel.pageSize}`
        );
      } else {
        data = await getData(
          accessToken,
          `invoices/search/id/${searchValue}/${paginationModel.page}/${paginationModel.pageSize}`
        );
      }
      setTotalPages(data.count);
      setInvoices(data.rows);
    } catch (e) {
      console.log(e);
    }
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const usdPrice = {
    type: "number",
    valueFormatter: ({ value }) => currencyFormatter.format(value),
    cellClassName: "font-tabular-nums",
  };

  const clearSearch = () => {
    setPaginationModel({
      page: defaultPage,
      pageSize: defaultPageSize,
    });
    getInvoices();
  };

  const searchOptions = [
    {
      name: "Search Company",
      type: "text",
      id: 1,
    },
    {
      name: "Search Invoice Number",
      type: "number",
      id: 2,
    },
  ];

  if (invoices) {
    columns = [
      { field: "id", headerName: "Invoice #", width: 100 },
      { field: "date", headerName: "Date", width: 130 },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        renderCell: (params) => {
          const cellValue = params.row["status"];
          let output = "";
          let color = "";
          if (cellValue === "Paid") {
            output = "Paid";
            color = "chipGreen";
          } else if (cellValue === "Partial Paid") {
            output = "Partial Paid";
            color = "chipOrange";
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
        width: 290,
      },
      {
        field: "totalAmount",
        headerName: "Amount",
        width: 160,
        ...usdPrice,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "outstanding",
        headerName: "Outstanding Amount",
        width: 190,
        ...usdPrice,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "url",
        headerName: "File",
        width: 90,
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
        field: "more",
        headerName: "",
        width: 90,
        sortable: false,
        disableClickEventBubbling: true,
        renderCell: (params) => (
          <TableMenu
            rowData={params.row}
            getInvoices={getInvoices}
            resetSearch={resetSearch}
            setResetSearch={setResetSearch}
          />
        ),
      },
    ];

    rows = invoices.map((invoice, index) => ({
      id: `${invoice.id}.INV`,
      date: createStringDate(invoice.invoiceDate),
      status: invoice.status,
      company: invoice.company.name,
      totalAmount: invoice.totalAmount,
      outstanding: invoice.outstanding,
      url: invoice.url,
      //Data pass in but will not be shown. Use to update payment.
      companyId: invoice.company.id,
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
            <PageTitle>Invoices</PageTitle>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ mt: 0 }}>
          <div style={{ width: "100%" }}>
            <Grid container sx={{ mb: 2, width: "100%" }}>
              <Grid item sx={{ mr: 1 }} xs={3}>
                <SearchBar
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  search={searchInvoices}
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
                  onClick={() => navigate("/add-invoice")}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  Create Invoice
                </Button>
              </Grid>
            </Grid>
            <DataGrid
              autoHeight
              disableRowSelectionOnClick
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
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Invoices;
