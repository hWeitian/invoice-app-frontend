import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import "../App.css";
import { convertDate, createStringDate } from "../utils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 605,
  height: "90vh",
  borderRadius: "10px",
  backgroundColor: "#FFFFFF",
  border: "2px solid #000",
  boxShadow: 24,
  overflowY: "scroll",
};

const Preview = ({
  formData,
  open,
  handlePreviewClose,
  saveInsertionOrder,
}) => {
  return (
    <>
      <Modal
        open={open}
        onClose={handlePreviewClose}
        aria-labelledby="insertion-order-preview"
        aria-describedby="insertion-order-preview"
      >
        <Box sx={style}>
          {Object.keys(formData).length > 0 && (
            <>
              <div id="io">
                <div style={{ maxWidth: "210mm", padding: "8mm" }}>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", width: "100%" }}
                  >
                    <div style={{ width: "65%" }}>
                      <h1 style={{ fontSize: "20px" }}>Insertion Order</h1>
                    </div>
                    <div style={{ width: "35%" }}>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        InvoiceGenie
                      </p>
                      <p style={{ fontSize: "10px" }}>
                        ABC Street, Singapore 122345
                      </p>
                      <p style={{ fontSize: "10px" }}>UEN: S123423545F</p>
                      <p style={{ fontSize: "10px" }}>
                        GST Reg No: S123423545F
                      </p>
                    </div>
                    <div style={{ width: "100%" }}>
                      <hr />
                    </div>
                    <div style={{ width: "60%" }}>
                      <p className="io-title">Bill to:</p>
                      <p className="io-text">{formData.companies.label}</p>
                      <p className="io-text">Attn: {formData.contacts.name}</p>
                      <p className="io-text">
                        {formData.contacts.designation}
                      </p>{" "}
                      <p className="io-text">
                        {formData.companies.billingAddress}
                      </p>
                      <p className="io-text">{formData.contacts.email}</p>
                    </div>
                    <div style={{ width: "40%", marginTop: "10px" }}>
                      <p className="io-text-bold">
                        Sales: <span className="io-text">Huang Weitian</span>
                      </p>
                      <p className="io-text-bold">
                        Insertion Order #:{" "}
                        <span className="io-text">{formData.insertionId}</span>
                      </p>
                      <p className="io-text-bold">
                        Order Date:{" "}
                        <span className="io-text">
                          {convertDate(formData.ioDate)}
                        </span>
                      </p>
                      <p className="io-text-bold" style={{ marginTop: "10px" }}>
                        Questions about your order: <br />
                        <span className="io-text">
                          {" "}
                          <a href="mailto:questions@invoicegenie.com">
                            questions@invoicegenie.com
                          </a>
                        </span>
                      </p>
                    </div>
                    <div style={{ width: "60%", marginTop: "10px" }}>
                      <p className="io-text-bold">
                        Closing Date:{" "}
                        <span className="io-text">
                          {createStringDate(formData.magazine.closingDate)}
                        </span>
                      </p>
                      <p className="io-text-bold">
                        Material Deadline:{" "}
                        <span className="io-text">
                          {createStringDate(formData.magazine.materialDeadline)}
                        </span>
                      </p>
                    </div>
                    <div style={{ width: "40%", marginTop: "10px" }}>
                      <p className="io-text-bold">
                        Publication Date:{" "}
                        <span className="io-text">
                          {formData.magazine.month} {formData.magazine.year}{" "}
                          Issue
                        </span>
                      </p>
                    </div>
                    <div style={{ width: "100%", marginTop: "10px" }}>
                      <hr />
                    </div>
                    <table style={{ fontSize: "12px", width: "100%" }}>
                      <tbody>
                        <tr>
                          <th style={{ width: "30%", textAlign: "left" }}>
                            Ad Size
                          </th>
                          <th style={{ width: "10%", textAlign: "left" }}>
                            Position
                          </th>
                          <th style={{ width: "10%", textAlign: "left" }}>
                            Colour
                          </th>
                          <th style={{ width: "35%", textAlign: "left" }}>
                            Regions
                          </th>
                          <th style={{ width: "15%", textAlign: "left" }}>
                            Amount
                          </th>
                        </tr>
                        {formData.orderItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.products.name}</td>
                            <td>{item.position}</td>
                            <td>{item.colour}</td>
                            <td>
                              {item.regions.map((region, index) => (
                                <p key={index}>{region.name} </p>
                              ))}
                            </td>
                            <td>$ {item.amount}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="4" style={{ textAlign: "right" }}>
                            <p
                              className="io-text-bold"
                              style={{ marginRight: "5px" }}
                            >
                              Discount:
                            </p>
                          </td>
                          <td>- $ {formData.discount}</td>
                        </tr>
                        <tr>
                          <td colSpan="4" style={{ textAlign: "right" }}>
                            <p
                              className="io-text-bold"
                              style={{ marginRight: "5px" }}
                            >
                              Net Amount:
                            </p>
                          </td>
                          <td>$ {formData.netAmount}</td>
                        </tr>
                        <tr>
                          <td colSpan="4" style={{ textAlign: "right" }}>
                            <p
                              className="io-text-bold"
                              style={{ marginRight: "5px" }}
                            >
                              GST @ 8%:
                            </p>
                          </td>
                          <td>$ {formData.usdGst}</td>
                        </tr>
                        <tr>
                          <td colSpan="4" style={{ textAlign: "right" }}>
                            <p
                              className="io-text-bold"
                              style={{ marginRight: "5px" }}
                            >
                              Total Amount:
                            </p>
                          </td>
                          <td>$ {formData.totalAmount}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div style={{ width: "100%", marginTop: "10px" }}>
                      <hr />
                    </div>
                    <div style={{ width: "100%" }}>
                      <p style={{ fontSize: "10px" }}>
                        We agree to pay for any production cost incurred in
                        addition to the charges listed. <br />
                        We agree to be bound by the terms and conditions
                        specified on the advertiser agreement.
                      </p>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <div
                        style={{
                          width: "15%",
                          textAlign: "bottom",
                          marginTop: "20px",
                        }}
                      >
                        <p className="io-text">Signed:</p>
                      </div>
                      <div
                        style={{
                          width: "35%",
                          borderBottom: "1px solid",
                          marginRight: "25px",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "10%",
                          textAlign: "bottom",
                          marginTop: "20px",
                        }}
                      >
                        <p className="io-text">Date:</p>
                      </div>
                      <div
                        style={{
                          width: "35%",
                          borderBottom: "1px solid",
                        }}
                      ></div>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <div
                        style={{
                          width: "15%",
                          textAlign: "bottom",
                          marginTop: "10px",
                        }}
                      >
                        <p className="io-text">Accpeted By:</p>
                      </div>
                      <div
                        style={{
                          width: "35%",
                          borderBottom: "1px solid",
                          marginRight: "25px",
                        }}
                      ></div>
                      <div
                        style={{
                          width: "10%",
                          textAlign: "bottom",
                          marginTop: "10px",
                        }}
                      >
                        <p className="io-text">Date:</p>
                      </div>
                      <div
                        style={{
                          width: "35%",
                          borderBottom: "1px solid",
                        }}
                      ></div>
                    </div>
                    {formData.notes.length > 0 && (
                      <div style={{ width: "100%", marginTop: "20px" }}>
                        <p className="io-text-bold">Notes:</p>
                        <p className="io-text">{formData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  gap: "20px",
                  padding: "20px",
                }}
              >
                <div style={{ width: "50%" }}>
                  {" "}
                  <Button
                    onClick={handlePreviewClose}
                    variant="outlined"
                    style={{ width: "100%" }}
                  >
                    Cancel
                  </Button>
                </div>
                <div style={{ width: "50%" }}>
                  {" "}
                  <Button
                    onClick={saveInsertionOrder}
                    variant="contained"
                    style={{ width: "100%" }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Preview;
