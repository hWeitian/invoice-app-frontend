import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createStringDate, combineProducts } from "../utils";
import { Button, Chip } from "@mui/material";

const Table = ({ data }) => {
  let columns;
  let rows;

  if (data) {
    columns = [
      { field: "id", headerName: "Order #", width: 90 },
      { field: "date", headerName: "Date", width: 130 },
      {
        field: "isSigned",
        headerName: "Status",
        width: 120,
        renderCell: (params) => {
          const cellValue = params.row["isSigned"];
          let output = "";
          let color = "";
          if (cellValue) {
            output = "signed";
            color = "chipGreen";
          } else {
            output = "Pending";
            color = "chipOrange";
          }
          return <Chip label={output} color={color} size="small"></Chip>;
        },
      },
      {
        field: "company",
        headerName: "Company",
        width: 190,
      },
      { field: "type", headerName: "Type", width: 400 },
      { field: "invoice", headerName: "Invoice", width: 130 },
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
    ];

    rows = data.map((order, index) => ({
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
    <>
      <div style={{ width: "100%" }}>
        {data && (
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
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

export default Table;
