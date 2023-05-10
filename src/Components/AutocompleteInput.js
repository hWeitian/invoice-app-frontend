import React from "react";
import { TextField, Autocomplete } from "@mui/material";

const AutocompleteInput = ({
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
  return (
    <Autocomplete
      id={id}
      disablePortal
      isOptionEqualToValue={(option, value) =>
        hasTwoColumns
          ? `${option[columnName]} - ${option[columnNameTwo]}` ===
            `${value[columnName]} - ${value[columnNameTwo]}`
          : option[columnName] === value[columnName]
      }
      getOptionLabel={(option) =>
        hasTwoColumns
          ? `${option[columnName]} - ${option[columnNameTwo]}`
          : option[columnName]
      }
      options={options || []}
      value={typeof value === "object" ? value : null}
      onChange={(event, option) => onChange(option)}
      sx={{
        width: width,
      }}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
            {hasTwoColumns
              ? `${option[columnName]} - ${option[columnNameTwo]}`
              : option[columnName]}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          error={Boolean(error)}
          helperText={error}
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default AutocompleteInput;
