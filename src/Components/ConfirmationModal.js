import React from "react";
import { Modal, Box, Typography, Grid, Button } from "@mui/material";
import PageTitle from "./PageTitle";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 200,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  pt: 4,
  pr: 4,
  pl: 4,
  pb: 0,
  overflowY: "auto",
};

const ConfirmationModal = ({ open, setOpenConfirmation, handleDelete }) => {
  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpenConfirmation(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PageTitle>Delete Issue</PageTitle>
          <Typography
            sx={{ mt: -1, p: 0, color: "#000000", fontSize: "0.9rem" }}
          >
            Are you sure you want to delete this issue? This action cannot be
            undone.
          </Typography>
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              mt: 3,
            }}
          >
            <Grid item xs={5.5}>
              <Button
                color="primary"
                variant="outlined"
                sx={{ width: "100%" }}
                onClick={() => setOpenConfirmation(false)}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={5.5}>
              <Button
                variant="contained"
                onClick={handleDelete}
                sx={{ width: "100%", backgroundColor: "#D92D20" }}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default ConfirmationModal;
