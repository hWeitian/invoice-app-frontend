import { convertDate, createStringDate, numberWithCommas } from "./utils";

export const generateIoHtml = (formData) => {
  console.log(formData);
  const html = Object.keys(formData).length > 0 && (
    <>
      <div id="io" style={{ fontSize: "12px", boxSizing: "border-box" }}>
        <div style={{ width: "155mm", padding: "6mm" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "65%" }}>
              <h1 style={{ fontSize: "20px" }}>Insertion Order</h1>
            </div>
            <div style={{ width: "35%" }}>
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
            <div style={{ width: "100%" }}>
              <hr />
            </div>
            <div style={{ width: "50%" }}>
              <p className="io-title">Bill to:</p>
              <p className="io-text">{formData.companies.label}</p>
              <p className="io-text">Attn: {formData.contacts.name}</p>
              <p className="io-text">{formData.contacts.designation}</p>
              <p className="io-text" style={{ marginTop: "10px" }}>
                {formData.companies.label}
              </p>
              <p className="io-text">{formData.companies.billingAddress}</p>
              <p className="io-text" style={{ marginTop: "10px" }}>
                {formData.contacts.email}
              </p>
            </div>
            <div style={{ width: "40%", marginTop: "10px" }}>
              <p className="io-text-bold">
                Sales: <span className="io-text">Don</span>
              </p>
              <p className="io-text-bold">
                Insertion Order #:{" "}
                <span className="io-text">{formData.insertionId}</span>
              </p>
              <p className="io-text-bold">
                Order Date:{" "}
                <span className="io-text">{convertDate(formData.ioDate)}</span>
              </p>
              <p className="io-text-bold" style={{ marginTop: "10px" }}>
                Questions about your order: <br />
                <span className="io-text">
                  <a href="mailto:questions@invoicegenie.com">
                    questions@invoicegenie.com
                  </a>
                </span>
              </p>
              <p className="io-text-bold" style={{ marginTop: "15px" }}>
                We, the advertiser, agree to purchase the following advertiser
                space according to this contract and subject to terms specified.
              </p>
            </div>
            <div style={{ width: "100%", marginTop: "10px" }}>
              <hr />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ width: "43%" }}>
                  <p className="io-text-bold">Ad Description:</p>
                </div>
                <div style={{ width: "57%" }}>
                  <p className="io-text">EWAP</p>
                </div>
                <div style={{ width: "43%" }}>
                  <p className="io-text-bold">Publication Date:</p>
                </div>
                <div style={{ width: "57%" }}>
                  <p className="io-text">
                    {formData.magazine.month} {formData.magazine.year} Issue
                  </p>
                </div>
                <div style={{ width: "43%" }}>
                  <p className="io-text-bold">Closing Date:</p>
                </div>
                <div style={{ width: "57%" }}>
                  <p className="io-text">
                    {createStringDate(formData.magazine.closingDate)}
                  </p>
                </div>
                <div style={{ width: "43%" }}>
                  <p className="io-text-bold">Material Deadline:</p>
                </div>
                <div style={{ width: "57%" }}>
                  <p className="io-text">
                    {createStringDate(formData.magazine.materialDeadline)}
                  </p>
                </div>
              </div>
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ width: "43%" }}>
                  <p className="io-text-bold">Gross:</p>
                </div>
                <div
                  style={{
                    width: "57%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "30%" }}>
                    <p className="io-text">USD</p>
                  </div>
                  <div style={{ width: "70%" }}>
                    <p className="io-text">
                      {numberWithCommas(formData.discount + formData.netAmount)}
                    </p>
                  </div>
                </div>
                <div style={{ width: "43%" }}>
                  <p className="io-text-bold">Discount:</p>
                </div>
                <div
                  style={{
                    width: "57%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "30%" }}>
                    <p className="io-text">USD</p>
                  </div>
                  <div style={{ width: "70%" }}>
                    <p className="io-text">
                      {numberWithCommas(formData.discount)}
                    </p>
                  </div>
                </div>
                <div style={{ width: "43%" }}>
                  <p className="io-text-bold">Net Rate:</p>
                </div>
                <div
                  style={{
                    width: "57%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "30%" }}>
                    <p className="io-text">USD</p>
                  </div>
                  <div style={{ width: "70%" }}>
                    <p className="io-text">
                      {numberWithCommas(formData.netAmount)}
                    </p>
                  </div>
                </div>
                <div style={{ width: "43%" }}>
                  <p className="io-text-bold">GST @ 8%:</p>
                </div>
                <div
                  style={{
                    width: "57%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "30%" }}>
                    <p className="io-text">USD</p>
                  </div>
                  <div style={{ width: "70%" }}>
                    <p className="io-text">
                      {numberWithCommas(formData.usdGst)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", width: "100%" }}>
              <div
                style={{
                  width: "71.5%",
                  textAlign: "right",
                }}
              >
                <p className="io-text-bold" style={{ marginRight: "47px" }}>
                  Order Total:
                </p>
              </div>
              <div
                style={{
                  width: "28.5%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "30%" }}>
                  <p className="io-text-bold">USD</p>
                </div>
                <div style={{ width: "70%" }}>
                  <p className="io-text-bold">
                    {numberWithCommas(formData.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginTop: "5px",
              }}
            >
              <div style={{ width: "21.5%" }}>
                <p className="io-text-bold">Position:</p>
              </div>
              <div style={{ width: "78.5%" }}>
                <p className="io-text">{formData.orderItems[0].position}</p>
              </div>
              <div style={{ width: "21.5%" }}>
                <p className="io-text-bold">Ad size:</p>
              </div>
              <div style={{ width: "78.5%" }}>
                <p className="io-text">
                  {formData.orderItems[0].products.name}
                </p>
              </div>
              <div style={{ width: "21.5%" }}>
                <p className="io-text-bold">Color:</p>
              </div>
              <div style={{ width: "78.5%" }}>
                <p className="io-text">{formData.orderItems[0].colour}</p>
              </div>
              <div style={{ width: "21.5%" }}>
                <p className="io-text-bold">Region(s):</p>
              </div>
              <div style={{ width: "78.5%" }}>
                <p className="io-text">
                  {formData.orderItems[0].regions.map((region, index) =>
                    index + 1 === formData.orderItems[0].regions.length
                      ? region.name
                      : `${region.name}, `
                  )}
                </p>
              </div>
            </div>
            {formData?.notes.length > 0 && (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ width: "21.5%" }}>
                  <p className="io-text-bold">Sales Notes:</p>
                </div>
                <div style={{ width: "78.5%" }}>
                  <p className="io-text">{formData.notes}</p>
                </div>
              </div>
            )}

            <div style={{ width: "100%", marginTop: "10px" }}>
              <hr />
            </div>
            <div style={{ width: "100%" }}>
              <p style={{ fontSize: "10px" }}>
                We agree to pay for any production cost incurred in addition to
                the charges listed. <br />
                We agree to be bound by the terms and conditions specified on
                the advertiser agreement.
              </p>
            </div>
            <div style={{ width: "100%", display: "flex", marginTop: "20px" }}>
              <div
                style={{
                  width: "15%",
                  textAlign: "bottom",
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
            <div style={{ width: "100%", display: "flex", marginTop: "20px" }}>
              <div
                style={{
                  width: "15%",
                  textAlign: "bottom",
                }}
              >
                <p className="io-text">Printed Name:</p>
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
                }}
              >
                <p className="io-text">Position:</p>
              </div>
              <div
                style={{
                  width: "35%",
                  borderBottom: "1px solid",
                }}
              ></div>
            </div>
            <div style={{ width: "100%", display: "flex", marginTop: "20px" }}>
              <div
                style={{
                  width: "15%",
                  textAlign: "bottom",
                }}
              >
                <p className="io-text">Accepted By:</p>
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
            <div style={{ width: "100%", marginTop: "3px" }}>
              <p className="io-text" style={{ fontSize: "9px" }}>
                Publisher or Authorized Sales Representative
              </p>
            </div>
            <div style={{ width: "100%", marginTop: "25px" }}>
              <hr />
              <p
                className="io-text-bold"
                style={{ fontSize: "9px", textAlign: "center" }}
              >
                Please verify and mail, email, or fax completed agreement before
                issue closing date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  return html;
};
