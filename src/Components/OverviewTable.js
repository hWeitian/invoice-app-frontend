import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Chip } from "@mui/material";

const OverviewTable = ({ data }) => {
  let columns = [];
  let rows = [];
  if (data) {
    columns = [
      { field: "company", headerName: "Company", width: 220 },
      { field: "position", headerName: "Position", width: 130 },
      {
        field: "size",
        headerName: "Size",
        width: 220,
      },
      {
        field: "colour",
        headerName: "Colour",
        width: 100,
      },
      {
        field: "regions",
        headerName: "Regions",
        width: 300,
        renderCell: (params) => {
          const data = params.row["regions"];
          let cellValues = data.map((item) => item.name);
          cellValues = cellValues.sort();
          const output = cellValues.map((value, index) => (
            <Chip
              label={value}
              key={value}
              size="small"
              sx={{ ml: index !== 0 ? 1 : 0 }}
              color={
                value === "Asia-Pacific"
                  ? "chipGreen"
                  : value === "China"
                  ? "chipLightBlue"
                  : value === "Korea"
                  ? "chipDarkBlue"
                  : "chipPurple"
              }
            />
          ));
          return output;
        },
      },
      {
        field: "invoice",
        headerName: "Invoice",
        width: 100,
      },
      {
        field: "payment",
        headerName: "Payment",
        width: 120,
        renderCell: (params) => {
          const cellValue = params.row["status"];
          let output = "";
          let color = "";
          if (cellValue === "paid") {
            output = "Paid";
            color = "chipGreen";
          } else {
            output = "Pending";
            color = "chipOrange";
          }
          return <Chip label={output} color={color} size="small"></Chip>;
        },
      },
    ];

    rows = data.map((order, index) => ({
      company: order.invoice.company.name,
      position: order.position,
      size: order.product.name,
      colour: order.colour,
      regions: order.regions,
      invoice: `${order.invoice.id}.INV`,
      payment: order.status,
      id: order.id,
    }));
  }

  return (
    <>
      <div style={{ height: "100%", width: "100%" }}>
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
                sortModel: [{ field: "company", sort: "desc" }],
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        )}
      </div>
    </>
  );
};

export default OverviewTable;
