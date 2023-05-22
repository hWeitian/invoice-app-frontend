import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import PageTitle from "./PageTitle";
import { useForm, Controller } from "react-hook-form";
import DragDropInput from "./DragDropInput";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 330,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
  overflowY: "auto",
};

const SignedIoModal = ({ setOpenUploadIo, open, data, getInsertionOrders }) => {
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity] =
    useOutletContext();
  const getAccessToken = useGetAccessToken();

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    updateIo(data.file);
  };

  const handleModalClose = () => {
    setOpenUploadIo(false);
    reset();
  };

  const uploadPdf = async (file) => {
    const fileName = data.id.split("-")[1];
    const storageRef = ref(storage, `insertion-orders/${fileName}.pdf`);
    try {
      // Upload the pdf onto Firebase storage
      const snapshot = await uploadBytes(storageRef, file);
      // Get the download url for the uploaded pdf
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (e) {
      console.log(e);
    }
  };

  const updateSignedStatus = async () => {
    const id = data.id.split("-")[1];
    const updatedData = {
      isSigned: true,
    };
    try {
      const accessToken = await getAccessToken();
      const response = await axios.put(
        `${process.env.REACT_APP_DB_SERVER}/insertion-orders/status/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  const updateIo = async (file) => {
    await uploadPdf(file);
    await updateSignedStatus();
    await getInsertionOrders();
    handleModalClose();
    setFeedbackSeverity("success");
    setFeedbackMsg("Signed Insertion Order Uploaded");
    setOpenFeedback(true);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PageTitle>Upload Insertion Order</PageTitle>
          <Typography
            sx={{ mt: -2, p: 0, color: "#667085", fontSize: "0.9rem" }}
          >
            Upload signed insertion order for {data && data.id}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Controller
              control={control}
              name="file"
              defaultValue=""
              rules={{ required: "Please upload a signed insertion order" }}
              render={({
                field: { ref, onChange, ...field },
                fieldState: { error },
              }) => (
                <DragDropInput
                  onChange={onChange}
                  error={error}
                  errorMsg="Please attach a signed insertion order"
                />
              )}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <div style={{ width: "48%", marginTop: "20px" }}>
                <Button
                  onClick={handleModalClose}
                  variant="outlined"
                  style={{ width: "100%" }}
                >
                  Cancel
                </Button>
              </div>
              <div style={{ width: "48%", marginTop: "20px" }}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ width: "100%" }}
                >
                  Upload
                </Button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default SignedIoModal;
