import "../App.css";
import { generateInvHtml } from "../Utils/generateInvToHtml";

const InvoicePreview = ({ formData, gstRate }) => {
  const html = generateInvHtml(formData, gstRate);

  return html;
};

export default InvoicePreview;
