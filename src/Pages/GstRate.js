import React, { useEffect, useState } from "react";
import { Button, Grid, Box, TextField } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import { getData } from "../Utils/utils";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import LoadingScreen from "../Components/LoadingScreen";
import InputAdornment from "@mui/material/InputAdornment";

const GstRate = () => {
  const [setOpenFeedback, setFeedbackMsg, setFeedbackSeverity] =
    useOutletContext();
  const getAccessToken = useGetAccessToken();
  const [gstRateId, setGstRateId] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  useEffect(() => {
    getGstRate();
  }, []);

  const getGstRate = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      const response = await getData(accessToken, `gst-rate/`);
      setGstRateId(response[0]["id"]);
      setValue("gstRate", response[0]["rate"]);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setFeedbackSeverity("error");
      setFeedbackMsg(`Error: ${e.message}`);
      setOpenFeedback(true);
    }
  };

  const handleLoadingClose = () => setIsLoading(false);

  const updateGstRate = async (dataToUpdate) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.put(
        `${process.env.REACT_APP_DB_SERVER}/gst-rate/${gstRateId}`,
        dataToUpdate,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
      setFeedbackSeverity("error");
      setFeedbackMsg(`Error: ${e.message}`);
      setOpenFeedback(true);
    }
  };

  const onSubmit = async (newGstRate) => {
    try {
      setIsLoading(true);
      const dataToUpdate = {
        id: gstRateId,
        rate: newGstRate["gstRate"],
      };
      await updateGstRate(dataToUpdate);
      setIsLoading(false);
      setFeedbackSeverity("success");
      setFeedbackMsg("GST rate updated");
      setOpenFeedback(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <PageTitle>GST Rate</PageTitle>
          </Box>
        </Grid>
        <Grid
          container
          sx={{ justifyContent: "space-between", minHeight: "583px" }}
        >
          <Grid item xs={7} sx={{ mt: 0 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container>
                <Grid item xs={4}>
                  <Controller
                    control={control}
                    name="gstRate"
                    defaultValue=""
                    rules={{
                      required: "Please enter GST rate",
                      valueAsNumber: true,
                      pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/,
                      },
                    }}
                    render={({
                      field: { ref, onChange, ...field },
                      fieldState: { error },
                    }) => (
                      <TextField
                        id={`gstRate`}
                        variant="outlined"
                        size="small"
                        error={error}
                        value={field.value}
                        onChange={onChange}
                        helperText={error?.message}
                        placeholder="GST Rate"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                        sx={{ width: "100%" }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container xs={3} sx={{ mt: 2 }}>
                <Button type="submit" color="primary" variant="contained">
                  Update
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
      <LoadingScreen open={isLoading} handleClose={handleLoadingClose} />
    </>
  );
};

export default GstRate;
