import "../App.css";
import { generateInvHtml } from "../Utils/generateInvToHtml";

const InvoicePreview = ({ formData }) => {
  const html = generateInvHtml(formData);

  return html;
};

export default InvoicePreview;
