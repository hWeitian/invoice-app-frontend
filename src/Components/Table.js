import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createStringDate, combineProducts } from "../utils";
import { Button, Chip } from "@mui/material";
import SignedIoModal from "./SignedIoModal";
import axios from "axios";
import useGetAccessToken from "../Hooks/useGetAccessToken";

const Table = () => {
  const getAccessToken = useGetAccessToken();
  const [openUploadIo, setOpenUploadIo] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [insertionOrders, setInsertionOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  let columns;
  let rows;

  useEffect(() => {
    getInsertionOrders();
  }, [paginationModel]);

  const getInsertionOrders = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      console.log(paginationModel);
      const response = await axios.get(
        `${process.env.REACT_APP_DB_SERVER}/insertion-orders/table-data/${paginationModel.page}/${paginationModel.pageSize}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setTotalPages(response.data.count);
      setInsertionOrders(response.data.rows);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

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
        width: 200,
      },
      { field: "type", headerName: "Type", width: 320 },
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
    <>
      <div style={{ width: "100%" }}>
        {insertionOrders && (
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
      <SignedIoModal
        open={openUploadIo}
        setOpenUploadIo={setOpenUploadIo}
        data={selectedData}
        getInsertionOrders={getInsertionOrders}
      />
    </>
  );
};

export default Table;
