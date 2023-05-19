import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createStringDate } from "../utils";
import { Button, Chip } from "@mui/material";

import TableMenu from "./TableMenu";

const InvoiceTable = ({ data, getInvoices }) => {
  let columns = [];
  let rows = [];

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const usdPrice = {
    type: "number",
    valueFormatter: ({ value }) => currencyFormatter.format(value),
    cellClassName: "font-tabular-nums",
  };

  if (data) {
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

    rows = data.map((invoice, index) => ({
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
        {data && (
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: "id", sort: "desc" }],
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        )}
      </div>
    </>
  );
};

export default InvoiceTable;
