import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Paper, Grid, Divider } from "@mui/material";
import AutocompleteInput from "./AutocompleteInput";

const OrderItems = ({ options, control }) => {
  return (
    <Grid container>
      <Grid item>
        <label className="form-label">Product Type</label>
        <Controller
          control={control}
          name="products"
          defaultValue=""
          rules={{ required: "Please select a product" }}
          render={({ field: { ref, onChange, onBlur, ...field } }) => (
            <AutocompleteInput
              id="product-input"
              placeholder="Select a product"
              options={options}
              columnName="name"
              hasTwoColumns={false}
              columnNameTwo=""
              value={field.value}
              onChange={onChange}
              error={errors.products?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default OrderItems;
