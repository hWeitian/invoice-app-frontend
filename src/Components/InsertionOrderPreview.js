import "../App.css";
import { convertDate, createStringDate } from "../Utils/utils";
import { generateIoHtml } from "../Utils/generateIoHtml";

const InsertionOrderPreview = ({ formData, userName, gstRate }) => {
  const html = generateIoHtml(formData, gstRate);

  return html;
};

export default InsertionOrderPreview;
