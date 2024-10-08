import { jsPDF } from "jspdf";
import axios from "axios";
import XLSX from "xlsx";
import { ToWords } from "to-words";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * Function to get the first letter of the name in caps
 * @param {string} name
 * @returns {string} First letter of the name
 */
export const getFirstLetter = (name) => {
  return name.split("")[0].toUpperCase();
};

/**
 * Function to calculate the total amount of all order items after deducting discount
 * @param {array} orderItems
 * @param {number} discount
 * @returns {number} Total amount after deducting discount
 */
export const calculateTotalAmount = (orderItems, discount) => {
  let totalAmount = 0;
  orderItems.forEach((item) => {
    totalAmount += parseFloat(item.amount);
  });
  return totalAmount - parseFloat(discount);
};

/**
 * Function to calculate the GST for the input amount
 * @param {number} amount
 * @returns {number} GST
 */
export const calculateGST = (amount, gstRate) => {
  const gstRateInDecimal = parseInt(gstRate) / 100;
  return (
    Math.round(Math.abs(parseFloat(amount) * gstRateInDecimal) * 100) / 100
  );
};

/**
 * Function to calculate the net amount
 * @param {number} amount
 * @param {number} gst
 * @returns {number} net amount
 */
export const calculateNetAmount = (amount, gst) => {
  return Math.abs(parseFloat(amount) + parseFloat(gst));
};

/**
 * Function to convert date object from MUI to string
 * @param {object} dateObj
 * @returns {string} date in string
 */
export const convertDate = (dateObj) => {
  const dateArr = dateObj.toString().split(" ");
  const month = getMonthString(dateObj.getMonth());
  const day = dateArr[2];
  const year = dateArr[3];
  const newDate = day + " " + month + " " + year;
  return newDate;
};

/**
 * Function to convert date to string before sending data to database
 * to prevent change in timezone
 * @param {object} dateObj
 * @returns {string} date string
 */
export const convertDateForDb = (dateObj) => {
  const dateArr = dateObj.toString().split(" ");
  const months = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };
  const day = dateArr[2];
  const year = dateArr[3];
  const month = months[dateArr[1]];
  return `${year}-${month}-${day}`;
};

/**
 * Helper function to get the month based on the string number
 * @param {string} stringNum
 * @returns {string}
 */
const getMonthString = (stringNum) => {
  const num = Number(stringNum);
  let month;
  switch (num) {
    case 0:
      month = "Jan";
      break;
    case 1:
      month = "Feb";
      break;
    case 2:
      month = "Mar";
      break;
    case 3:
      month = "Apr";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "Jun";
      break;
    case 6:
      month = "Jul";
      break;
    case 7:
      month = "Aug";
      break;
    case 8:
      month = "Sept";
      break;
    case 9:
      month = "Oct";
      break;
    case 10:
      month = "Nov";
      break;
    default:
      month = "Dec";
  }
  return month;
};

/**
 * Function to convert a string of date and time into date
 * @param {string} dateString
 * @returns {string} date
 */
export const createStringDate = (dateString) => {
  const dateTimeArr = dateString.split("T");
  const dateArr = dateTimeArr[0].split("-");
  const year = dateArr[0];
  const month = Number(dateArr[1]) - 1;
  const fullMonth = getMonthString(month);
  const day = Number(dateArr[2]);
  const stringDate = day + "-" + fullMonth + "-" + year;
  return stringDate;
};

/**
 * Function to combine multiple products into a string
 * @param {array} orders
 * @returns {string} Sentence that list all products
 */
export const combineProducts = (orders) => {
  let productString = "";
  orders.forEach((order, index) => {
    if (index === orders.length - 1) {
      productString += order.product.name;
    } else {
      productString += order.product.name + ", ";
    }
  });
  return productString;
};

/**
 * Function to generate a description for the invoice item based on insertion order item
 * @param {object} order
 * @returns {string} description for invoice item
 */
export const generateDescription = (order) => {
  let description = "";
  const productType = order.product.name;
  const position = order.position;
  const magazineIssue = `${order.magazine.month} ${order.magazine.year}`;
  description = `${productType} ${position} in the Magazine ${magazineIssue} issue`;
  return description;
};

/**
 * Function to convert GST in USD to SGD based on the given exchange rate
 * @param {number} gstAmount
 * @param {object} exchangeRate
 * @returns {number} GST in SGD
 */
export const convertGstToSgd = (gstAmount, exchangeRate) => {
  const rate = Number(exchangeRate.rate);
  const gstSgd = Math.round(Math.abs(rate * gstAmount * 100)) / 100;
  return gstSgd;
};

/**
 * Function to generate PDF from a html string
 * @param {string} html
 * @param {string} fileName
 * @returns {object} a blob file which will be used to uplaod onto Firebase
 */
export const generatePdfFromHtml = async (html, fileName) => {
  // Create a new pdf instance
  const report = new jsPDF("portrait", "pt", "a4");

  // Add html content into the pdf instance and download the pdf
  await report.html(html, {
    callback: function (report) {
      report.save(fileName);
    },
  });

  // Convert the pdf into a blob that will be used to upload onto Firebase
  const fileForStorage = report.output("blob");

  return fileForStorage;
};

/**
 * Function to get data from database according to the provided endpoint
 * @param {string} accessToken
 * @param {string} endPoint
 * @returns {array} data from database
 */
export const getData = async (accessToken, endPoint) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_DB_SERVER}/${endPoint}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (response.data) {
      return response.data;
    }
    throw new Error("Error in get");
  } catch (error) {
    throw new Error(error?.response?.data ?? "Error");
  }
};

/**
 * Function to calculate total amount for orders based on the given type of amount to calculate
 * @param {array} orders
 * @param {string} type
 * @returns {number} total amount for oders
 */
export const calculateOrdersAmount = (orders, type) => {
  let totalAmount = 0;
  for (let i = 0; i < orders.length; i++) {
    totalAmount += Number(orders[i].invoice[type]);
  }

  return totalAmount;
};

/**
 * Function to calculate outstanding amount for the orders
 * @param {array} orders
 * @returns {number} outstanding amount
 */
export const calculateOutstanding = (orders) => {
  const amountPaid = calculateOrdersAmount(orders, "amountPaid");
  const invoicedAmount = calculateOrdersAmount(orders, "totalAmount");

  const outstanding = Math.abs(invoicedAmount - amountPaid);

  return outstanding;
};

/**
 * Function to convert numbers to USD currency
 */
export const formatToUsdCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
};

/**
 * Function to create date object from MUI datepicker
 * @param {object} dateObj
 * @returns {object} date object
 */
export const formatDate = (dateObj) => {
  const day = dateObj["$D"];
  const month = dateObj["$M"];
  const year = dateObj["$y"];
  const newDate = new Date(year, month, day);
  return newDate;
};

/**
 * Function to export data into Excel file
 * @param {object} data json object
 * @param {string} sheetName
 * @param {string} fileName
 * @returns {function: void} a function to download the excel file
 */
export const exportDataToXlsx = (data, sheetName, fileName) => {
  const wb = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, sheet, sheetName);

  return XLSX.writeFile(wb, fileName);
};

/**
 * Function to convert numbers to string and add in thousand separator
 * @param {number} amount
 * @returns {string}
 */
export const numberWithCommas = (amount) => {
  let finalAmount = amount
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  if (amount % 1 === 0) {
    finalAmount += ".00";
  } else {
    const centsArray = finalAmount.split(".");
    if (centsArray[1]?.length === 1) {
      finalAmount += "0";
    }
  }
  return finalAmount;
  // return amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Function to convert amount with currency into words using the to-words package
 * @param {number} amount
 * @returns {string}
 */
export const spellOutAmount = (amount) => {
  const toWords = new ToWords({
    localeCode: "en-US",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        // can be used to override defaults for the selected locale
        name: "United State Dollar",
        plural: "United State Dollar",
        symbol: "$",
        fractionalUnit: {
          name: "Cent",
          plural: "Cents",
          symbol: "",
        },
      },
    },
  });
  const word = toWords.convert(amount);
  return word;
};

/**
 * Function to find if the required keyword exists in the object inside an array of objects
 * @param {array} arrayObjects
 * @param {string} keyword
 * @param {string} objProperty
 * @returns {boolean} Returns true if found, false is not found
 */
export const findKeyInArrayOfObjects = (arrayObjects, keyword, objProperty) => {
  for (let i = 0; i < arrayObjects.length; i++) {
    const obj = arrayObjects[i];
    if (obj[objProperty] === keyword) {
      return true;
    }
  }
  return false;
};

/**
 * Function to get gst rate from database
 * @param {string} accessToken
 * @returns {array} gst rate from database
 */
export const getGstRateFromBackend = async (accessToken) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_DB_SERVER}/gst-rate/`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (response.data[0]) {
      return response.data[0];
    }
    throw new Error("Error in getGstRateFromBackend");
  } catch (error) {
    throw new Error(error?.response?.data ?? "Error");
  }
};
