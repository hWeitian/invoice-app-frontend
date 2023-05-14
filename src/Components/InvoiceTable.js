import React, { useState } from "react";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { createStringDate, combineProducts } from "../utils";
import { Button, Chip, IconButton, Menu, MenuItem } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TableMenu from "./TableMenu";

const InvoiceTable = ({ data }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let columns = [];
  let rows = [];
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
          let icon = "";
          if (cellValue === "paid") {
            output = "Paid";
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
        width: 500,
      },
      { field: "totalAmount", headerName: "Amount", width: 130 },
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
            menuOptions={["Add Payment", "View Payment"]}
            rowData={params.row}
          />
        ),
      },
    ];

    rows = data.map((invoice, index) => ({
      id: invoice.id,
      date: createStringDate(invoice.invoiceDate),
      status: invoice.status,
      company: invoice.company.name,
      totalAmount: invoice.totalAmount,
      url: invoice.url,
      more: "",
    }));
  }

  // const ActionsCell = ({ menuOptions }) => {
  //   const [anchorEl, setAnchorEl] = useState(null);

  //   const handleMenuOpen = (event) => {
  //     setAnchorEl(event.currentTarget);
  //   };

  //   const handleMenuClose = () => {
  //     setAnchorEl(null);
  //   };

  //   return (
  //     <div>
  //       <IconButton onClick={handleMenuOpen}>
  //         <MoreVertIcon />
  //         {/* Add your icon component here */}
  //       </IconButton>
  //       <Menu
  //         anchorEl={anchorEl}
  //         open={Boolean(anchorEl)}
  //         onClose={handleMenuClose}
  //       >
  //         {menuOptions.map((option) => (
  //           <MenuItem key={option} onClick={handleMenuClose}>
  //             {option}
  //           </MenuItem>
  //         ))}
  //       </Menu>
  //     </div>
  //   );
  // };

  console.log(data);

  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        {data && (
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
        )}
      </div>
    </>
  );
};

export default InvoiceTable;
