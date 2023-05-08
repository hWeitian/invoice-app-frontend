import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField, Autocomplete } from "@mui/material";

const AsyncAutocomplete = ({
  placeholder,
  options,
  getData,
  columnName,
  setOptions,
  error,
  onOptionSelected,
  id,
  prerequisiteData,
  prerequisite,
  value,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noCompanySelected, setNoCompanySelected] = useState(false);

  const updateData = async () => {
    let data;
    // Check if the dropdown options of this input depends on the input of another field
    // If yes, pass the data of the another input field into the getData function to retrieve options
    if (prerequisite && Object.keys(prerequisiteData).length > 0) {
      data = await getData(prerequisiteData.id);
    } else {
      data = await getData();
    }
    setOptions(data);
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      // If dropdown is opened, check if the options have been loaded
      if (options.length === 0) {
        // If options are not loaded, get data from server
        setLoading(true);
        // Check if the dropdown options of this input depends on the input of another field
        // If yes, show an error message if the other field is not selected
        if (
          prerequisiteData === null ||
          prerequisiteData === undefined ||
          (prerequisite && Object.keys(prerequisiteData).length === 0)
        ) {
          setNoCompanySelected(true);
          setOpen(false);
        } else {
          updateData();
          setNoCompanySelected(false);
        }
      }
    } else {
      // If dropdown is closed, reset options to empty array
      // to allow system to fetch from server again in case there are updates
      // to list of companies
      setOptions([]);
      setLoading(false);
    }
  }, [open]);

  return (
    <Autocomplete
      size="small"
      id={id}
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) =>
        option[columnName] === value[columnName]
      }
      value={typeof value === "object" ? value : null}
      getOptionLabel={(option) => option[columnName]}
      onChange={(event, option) => onOptionSelected(option)}
      options={options || []}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          error={Boolean(error) || noCompanySelected}
          helperText={noCompanySelected ? "Please select a company" : error}
        />
      )}
    />
  );
};

export default AsyncAutocomplete;
