import { convertDate, numberWithCommas, spellOutAmount } from "./utils";

export const generateInvHtml = (formData, gstRate) => {
  const html = Object.keys(formData).length > 0 && (
    <>
      <div id="invoice" style={{ fontSize: "12px" }}>
        <div style={{ width: "159mm", padding: "6mm" }}>
          <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
            <div style={{ width: "70%" }}>
              <h1 style={{ fontSize: "2em" }}>Tax Invoice</h1>
            </div>
            <div style={{ width: "30%" }}>
              <img
                src={require("../Assets/Logo.png")}
                alt="logo"
                width="100%"
              />
              <div style={{ fontSize: "0.8em", textAlign: "right" }}>
                <p>ABC Street, Singapore 122345</p>
                <p>UEN: S123423545F</p>
                <p>GST Reg No: S123423545F</p>
              </div>
            </div>
            <div
              style={{
                marginBottom: "30px",
                marginTop: "10px",
                display: "flex",
              }}
            >
              <div style={{ width: "50%", display: "flex", flexWrap: "wrap" }}>
                <div
                  style={{ width: "35%", textAlign: "left", margin: "auto" }}
                >
                  <p className="io-title">Invoice No:</p>
                </div>
                <div
                  style={{ width: "65%", textAlign: "left", margin: "auto" }}
                >
                  <p className="io-title">{formData.invoiceNum}.INV</p>
                </div>
                <div
                  style={{ width: "35%", textAlign: "left", margin: "auto" }}
                >
                  <p className="io-text-bold">Date:</p>
                </div>
                <div
                  style={{ width: "65%", textAlign: "left", margin: "auto" }}
                >
                  <p className="io-text">{convertDate(formData.invoiceDate)}</p>
                </div>
                <div
                  style={{ width: "35%", textAlign: "left", margin: "auto" }}
                >
                  <p className="io-text-bold">Payment Due:</p>
                </div>
                <div
                  style={{ width: "65%", textAlign: "left", margin: "auto" }}
                >
                  <p className="io-text">{convertDate(formData.dueDate)}</p>
                </div>
                {formData.purchaseOrder && (
                  <>
                    <div
                      style={{
                        width: "40%",
                        textAlign: "left",
                        margin: "auto",
                      }}
                    >
                      <p className="io-text-bold">Purchase Order:</p>
                    </div>
                    <div
                      style={{
                        width: "60%",
                        textAlign: "left",
                        margin: "auto",
                      }}
                    >
                      <p className="io-text">{formData.purchaseOrder}</p>
                    </div>
                  </>
                )}
              </div>
              <div style={{ width: "50%", display: "flex", flexWrap: "wrap" }}>
                <div
                  style={{ width: "30%", textAlign: "left", margin: "auto" }}
                >
                  <p className="io-text-bold">Bill to:</p>
                </div>
                <div
                  style={{ width: "70%", textAlign: "left", margin: "auto" }}
                >
                  <p className="io-text">{formData.companies.label}</p>
                </div>
                <div
                  style={{ width: "30%", textAlign: "left", margin: "auto" }}
                ></div>
                <div style={{ width: "70%", textAlign: "left", margin: "0" }}>
                  <p className="io-text">{formData.companies.billingAddress}</p>
                </div>
                <div
                  style={{ width: "30%", textAlign: "left", margin: "auto" }}
                >
                  <p className="io-text-bold">Attention:</p>
                </div>
                <div
                  style={{ width: "70%", textAlign: "left", margin: "auto" }}
                >
                  <p className="io-text">{formData.contacts.name}</p>
                </div>
              </div>
            </div>
            <table
              style={{
                width: "100%",
                border: "solid 1px #000000",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <tr
                  style={{
                    backgroundColor: "#012B61",
                    color: "#FFFFFF",
                    fontSize: "1em",
                    height: "10px",
                  }}
                >
                  <th style={{ width: "5%", textAlign: "center" }}>S/N</th>
                  <th
                    style={{
                      width: "75%",
                      textAlign: "left",
                      borderLeft: "solid 1px #FFFFFF",
                      borderRight: "solid 1px #FFFFFF",
                    }}
                  >
                    Description
                  </th>
                  <th style={{ width: "20%", textAlign: "center" }}>Amount</th>
                </tr>
                {formData.invoiceItems.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        borderBottom: "solid 1px #000000",
                        textAlign: "center",
                      }}
                    >
                      <p className="io-text">{index + 1}</p>
                    </td>
                    <td
                      style={{
                        borderLeft: "solid 1px #000000",
                        borderRight: "solid 1px #000000",
                        borderBottom: "solid 1px #000000",
                      }}
                    >
                      <p className="io-text">{item.description}</p>
                    </td>
                    <td
                      style={{
                        borderBottom: "solid 1px #000000",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <p className="io-text">USD</p>
                        </div>
                        <div>
                          <p className="io-text">
                            {numberWithCommas(item.amount)}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table
              style={{ width: "100%", borderCollapse: "collapse" }}
              className="total-table"
            >
              <tbody>
                {formData.discount > 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      style={{ textAlign: "right", width: "80%" }}
                    >
                      <p className="io-text-bold">Discount:</p>
                    </td>
                    <td
                      colSpan={2}
                      style={{
                        textAlign: "center",
                        width: "20%",
                        paddingLeft: "5px",
                        paddingRight: "1px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <p className="io-text">(USD</p>
                        </div>
                        <div>
                          <p className="io-text">
                            {numberWithCommas(formData.discount)})
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                <tr style={{ height: "25px" }}>
                  <td colSpan={2} style={{ textAlign: "right", width: "80%" }}>
                    <p className="io-text-bold">Sub-Total:</p>
                  </td>
                  <td
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      width: "20%",
                      paddingLeft: "5px",
                      paddingRight: "1px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p className="io-text">USD</p>
                      </div>
                      <div>
                        <p className="io-text">
                          {numberWithCommas(formData.netAmount)}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ textAlign: "right", width: "80%" }}>
                    <p className="io-text-bold">GST @ {gstRate}%:</p>
                  </td>
                  <td
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      width: "20%",
                      paddingLeft: "5px",
                      paddingRight: "1px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p className="io-text">USD</p>
                      </div>
                      <div>
                        <p className="io-text">
                          {numberWithCommas(formData.usdGst)}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ textAlign: "right", width: "80%" }}>
                    <p className="io-text" style={{ fontSize: "0.8em" }}>
                      <i>
                        (SGD equivalent {numberWithCommas(formData.sgdGst)})
                      </i>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      textAlign: "right",
                      width: "80%",
                      padding: "5px",
                    }}
                  >
                    <p className="io-text-bold">Total Amount</p>
                  </td>
                  <td
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      width: "20%",
                      paddingLeft: "5px",
                      paddingRight: "1px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p className="io-text-bold">USD</p>
                      </div>
                      <div>
                        <p className="io-text-bold">
                          {numberWithCommas(formData.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr
                  style={{
                    borderBottom: "solid 1px black",
                    height: "28px",
                    verticleAlign: "bottom",
                  }}
                >
                  <td colSpan={2}>
                    <p
                      className="io-text-bold"
                      style={{ fontSize: "0.9167em", margin: 0, padding: 0 }}
                    >
                      {spellOutAmount(formData.totalAmount)}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              style={{ width: "100%", marginTop: "10px", fontSize: "0.9167em" }}
            >
              <p style={{ marginBottom: "2px" }}>
                GST: Singapore Goods and Service Tax
              </p>
              <p style={{ marginBottom: "2px" }}>
                Exchange rate: 1 USD = {formData.exchangeRate.rate} SGD
              </p>
              <p>
                All rates are inclusive of {gstRate}% Singapore Government Goods
                & Services Tax (GST).
              </p>
            </div>
            <div style={{ width: "100%", marginTop: "10px" }}>
              <p className="io-text-bold">
                <u>Payment Details</u>
              </p>
              <p className="io-text-bold">
                Account Name:{" "}
                <span className="io-text"> InvoiceGenie Pte Ltd</span>
              </p>
              <p className="io-text-bold">
                Bank Account (USD):{" "}
                <span className="io-text"> 1234-124332445-123-1</span>
              </p>
              <p className="io-text-bold">
                Bank Name: <span className="io-text"> XYZ Bank, Singapore</span>
              </p>
              <p className="io-text-bold">
                Bank Address:{" "}
                <span className="io-text">
                  {" "}
                  ABC Road, Level 99, Tower 89, Singapore 123456
                </span>
              </p>
              <p className="io-text-bold">
                Swift Code: <span className="io-text"> XYZBSSSSS</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  return html;
};
