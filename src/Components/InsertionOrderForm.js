import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import { Paper, TextField, MenuItem, Autocomplete, Grid } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const InsertionOrderForm = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [companies, setCompanies] = useState();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const onSubmit = (data) => console.log(data);

  useEffect(() => {
    if (isAuthenticated) {
      getCompanies();
    }
  }, []);

  const getCompanies = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUDIENCE,
          scope: "read:current_user",
        },
      });
      const response = await axios.get(
        `${process.env.REACT_APP_DB_SERVER}/companies/names`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setCompanies(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper elevation={0} sx={{ backgroundColor: "#F9FAFB", p: 2 }}>
        <Grid container>
          <Grid item xs={6}>
            <label className="form-label">Bill To</label>
            {companies && (
              <>
                <Controller
                  control={control}
                  name="companies"
                  rules={{ required: true }}
                  render={({
                    field: { ref, onChange, ...field },
                    fieldState,
                  }) => (
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={companies}
                      onChange={(event, newInputValue) =>
                        onChange(newInputValue)
                      }
                      sx={{ width: 300, mt: 1 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Company"
                          error={!!fieldState.error}
                          helperText={
                            fieldState.error && "Please select a company"
                          }
                        />
                      )}
                      size="small"
                    />
                  )}
                />
              </>
            )}
          </Grid>
        </Grid>

        <input type="submit" />
      </Paper>
    </form>
  );
};

export default InsertionOrderForm;
