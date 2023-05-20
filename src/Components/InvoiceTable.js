import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createStringDate } from "../utils";
import { Button, Chip } from "@mui/material";
import axios from "axios";
import useGetAccessToken from "../Hooks/useGetAccessToken";

import TableMenu from "./TableMenu";

const InvoiceTable = () => {
  const getAccessToken = useGetAccessToken();
  const [invoices, setInvoices] = useState();
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  let columns = [];
  let rows = [];

  useEffect(() => {
    getInvoices();
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

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const usdPrice = {
    type: "number",
    valueFormatter: ({ value }) => currencyFormatter.format(value),
    cellClassName: "font-tabular-nums",
  };

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
          <TableMenu rowData={params.row} getInvoices={getInvoices} />
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
      <div style={{ width: "100%" }}>
        {invoices && (
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
        )}
      </div>
    </>
  );
};

export default InvoiceTable;
