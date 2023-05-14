import React from "react";
import PageTitle from "../Components/PageTitle";
import InsertionOrderForm from "./InsertionOrderForm";

const AddInsertionOrder = (props) => {
  return (
    <>
      <PageTitle>Create Insertion Order</PageTitle>
      <InsertionOrderForm userId={props.userId} />
    </>
  );
};

export default AddInsertionOrder;