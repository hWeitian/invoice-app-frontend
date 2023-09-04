import "../App.css";
import { convertDate, createStringDate } from "../Utils/utils";
import { generateIoHtml } from "../Utils/generateIoHtml";

const InsertionOrderPreview = ({ formData, userName }) => {
  const html = generateIoHtml(formData);

  return html;
};

export default InsertionOrderPreview;
