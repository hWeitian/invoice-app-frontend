import React from "react";
import { TextField, Autocomplete } from "@mui/material";

const MultipleAutocompleteInput = ({
  id,
  options,
  columnName,
  columnNameTwo,
  hasTwoColumns,
  error,
  value,
  onChange,
  width,
  placeholder,
}) => {
  console.log(error);
  return (
    <Autocomplete
      multiple
      id={id}
      options={options}
      getOptionLabel={(option) => option[columnName]}
      defaultValue={[]}
      onChange={(event, option) => onChange(option)}
      value={value || []}
      sx={{
        width: width,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          placeholder={placeholder}
          error={Boolean(error)}
          helperText={error}
        />
      )}
    />
  );
};

export default MultipleAutocompleteInput;
