import React from "react";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { createStringDate, combineProducts } from "../utils";
import { Button, Chip } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const Table = ({ data }) => {
  const columns = [
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
        let icon = "";
        if (cellValue) {
          output = "signed";
          color = "success";
          icon = <DoneIcon fontSize="small" />;
        } else {
          output = "Pending";
          color = "default";
          icon = <HourglassEmptyIcon fontSize="small" />;
        }
        return <Chip label={output} color={color} icon={icon}></Chip>;
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

  const rows = data.map((order, index) => ({
    id: order.id,
    date: createStringDate(order.date),
    isSigned: order.isSigned,
    company: order.company.name,
    type: combineProducts(order.orders),
    invoice: order.orders[0].invoiceId,
    url: order.url,
  }));

  console.log(data);

  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
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
      </div>
    </>
  );
};

export default Table;
