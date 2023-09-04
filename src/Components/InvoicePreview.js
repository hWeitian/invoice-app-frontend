import "../App.css";
import { convertDate } from "../Utils/utils";
import { generateInvHtml } from "../Utils/generateInvToHtml";

const InvoicePreview = ({ formData }) => {
  const html = generateInvHtml(formData);

  return html;
};

export default InvoicePreview;
