import React from "react";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DatePickerInput = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={typeof props.value === "object" ? props.value : null}
        onChange={props.onChange}
        sx={{ display: "block", width: 300 }}
        slotProps={{
          textField: {
            error: Boolean(props.error),
            helperText: props.error,
            size: "small",
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerInput;
