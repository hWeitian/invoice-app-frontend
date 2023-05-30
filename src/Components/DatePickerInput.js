import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// dayjs.extend(utc);
// dayjs.extend(timezone);

// // dayjs.tz.setDefault("America/New_York");
// dayjs.tz.setDefault("Asia/Singapore");

const DatePickerInput = (props) => {
  console.log("DatePicker");
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      // dateLibInstance={dayjs.utc}
    >
      <DatePicker
        value={typeof props.value === "object" ? props.value : null}
        onChange={props.onChange}
        views={props.specialView && props.viewOnly}
        sx={{ display: "block", width: props.width }}
        slotProps={{
          textField: {
            error: Boolean(props.error),
            helperText: props.error,
            size: "small",
            fullWidth: true,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerInput;
