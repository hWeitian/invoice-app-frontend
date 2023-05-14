import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import "../App.css";
import { convertDate, createStringDate } from "../utils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 605,
  height: "90vh",
  borderRadius: "10px",
  backgroundColor: "#FFFFFF",
  border: "2px solid #000",
  boxShadow: 24,
  overflowY: "auto",
};

const PreviewModal = ({ children, open, handlePreviewClose, save }) => {
  return (
    <>
      <Modal
        open={open}
        onClose={handlePreviewClose}
        aria-labelledby="insertion-order-preview"
        aria-describedby="insertion-order-preview"
      >
        <Box sx={style}>
          {children}
          <div
            style={{
              display: "flex",
              width: "100%",
              gap: "20px",
              padding: "20px",
            }}
          >
            <div style={{ width: "50%" }}>
              {" "}
              <Button
                onClick={handlePreviewClose}
                variant="outlined"
                style={{ width: "100%" }}
              >
                Cancel
              </Button>
            </div>
            <div style={{ width: "50%" }}>
              {" "}
              <Button
                onClick={save}
                variant="contained"
                style={{ width: "100%" }}
              >
                Save
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default PreviewModal;
