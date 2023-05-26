import React from "react";
import { TextField, Autocomplete, Chip } from "@mui/material";

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
  const getOptionDisabled = (option) => {
    if (value) {
      return value.some((value) => value.id === option.id);
    }
  };

  return (
    <Autocomplete
      multiple
      id={id}
      options={options}
      getOptionLabel={(option) => option[columnName]}
      defaultValue={[]}
      onChange={(event, option) => onChange(option)}
      value={value || []}
      getOptionDisabled={getOptionDisabled}
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
          InputProps={{ ...params.InputProps, style: { fontSize: "15px" } }}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            key={index}
            label={option.name}
            {...getTagProps({ index })}
            color={
              option.name === "Asia-Pacific"
                ? "chipGreen"
                : option.name === "China"
                ? "chipLightBlue"
                : option.name === "Korea"
                ? "chipDarkBlue"
                : "chipPurple"
            }
          />
        ))
      }
    />
  );
};

export default MultipleAutocompleteInput;
