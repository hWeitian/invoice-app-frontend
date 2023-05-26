import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import axios from "axios";
import useGetAccessToken from "../Hooks/useGetAccessToken";

const OverviewTable = ({ magazineIssue, selectedRegions }) => {
  const getAccessToken = useGetAccessToken();
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  let columns = [];
  let rows = [];

  useEffect(() => {
    getOrders();
  }, [paginationModel, magazineIssue, selectedRegions]);

  const getOrders = async () => {
    try {
      setIsLoading(true);
      const regions = convertRegions(selectedRegions);
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${process.env.REACT_APP_DB_SERVER}/orders/magazine/${magazineIssue}/${regions}/${paginationModel.page}/${paginationModel.pageSize}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setTotalPages(response.data.count);
      setOrders(response.data.rows);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const convertRegions = (regions) => {
    let regionString = "";
    regions.forEach((region, index) => {
      if (index === regions.length - 1) {
        regionString += `${region.name}`;
      } else {
        regionString += `${region.name}&`;
      }
    });
    return regionString;
  };

  if (orders) {
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
        field: "status",
        headerName: "Payment",
        width: 120,
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
    ];

    rows = orders.map((order, index) => ({
      company: order.invoice.company.name,
      position: order.position,
      size: order.product.name,
      colour: order.colour,
      regions: order.regions,
      invoice: `${order.invoice.id}.INV`,
      status: order.status,
      id: order.id,
    }));
  }

  return (
    <>
      <div style={{ height: "100%", width: "100%" }}>
        {orders && (
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

export default OverviewTable;
