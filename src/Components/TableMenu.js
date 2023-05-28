import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PaymentModal from "./PaymentModal";
import ViewPaymentModal from "./ViewPaymentModal";
import { useOutletContext } from "react-router-dom";

const TableMenu = ({ rowData, getInvoices, resetSearch, setResetSearch }) => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [viewPaymentModalOpen, setViewPaymentModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity] =
    useOutletContext();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const openAddPayment = () => {
    handleMenuClose();
    setPaymentModalOpen(true);
  };

  const openViewPayment = () => {
    handleMenuClose();
    setViewPaymentModalOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleMenuOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={openAddPayment}>Add Payment</MenuItem>
        <MenuItem onClick={openViewPayment}>View Payment</MenuItem>
      </Menu>
      <PaymentModal
        open={paymentModalOpen}
        setPaymentModalOpen={setPaymentModalOpen}
        data={rowData}
        setOpenFeedback={setOpenFeedback}
        setFeedbackMsg={setFeedbackMsg}
        setFeedbackSeverity={setFeedbackSeverity}
        getInvoices={getInvoices}
        resetSearch={resetSearch}
        setResetSearch={setResetSearch}
      />
      <ViewPaymentModal
        setViewPaymentModalOpen={setViewPaymentModalOpen}
        open={viewPaymentModalOpen}
        data={rowData}
        getInvoices={getInvoices}
        resetSearch={resetSearch}
        setResetSearch={setResetSearch}
      />
    </div>
  );
};

export default TableMenu;
