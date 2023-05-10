import React from "react";
import { TextField, InputAdornment } from "@mui/material";

const DollarInput = ({
  id,
  width,
  currency,
  placeholder,
  onChange,
  error,
  value,
}) => {
  return (
    <TextField
      id={id}
      sx={{ width: width }}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      error={error}
      helperText={error?.message}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">{currency}</InputAdornment>
        ),
      }}
      variant="outlined"
      size="small"
      type="text"
    />
  );
};

export default DollarInput;
