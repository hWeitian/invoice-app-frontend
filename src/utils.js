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
export const calculateGST = (amount) => {
  return Math.round(Math.abs(parseFloat(amount) * 0.08) * 100) / 100;
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
  const month = getMonth(dateObj.$M);
  const newDate = dateObj.$D + " " + month + " " + dateObj.$y;
  return newDate;
};

/**
 * Helper function to get the month based on the string number
 * @param {string} stringNum
 * @returns {string}
 */
const getMonth = (stringNum) => {
  let month;
  switch (stringNum) {
    case "0":
      month = "Jan";
      break;
    case "1":
      month = "Feb";
      break;
    case "2":
      month = "Mar";
      break;
    case "3":
      month = "Apr";
      break;
    case "4":
      month = "May";
      break;
    case "5":
      month = "Jun";
      break;
    case "6":
      month = "Jul";
      break;
    case "7":
      month = "Aug";
      break;
    case "8":
      month = "Sept";
      break;
    case "9":
      month = "Oct";
      break;
    case "10":
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
  const month = Number(dateArr[1]);
  const fullMonth = getMonth(month);
  const day = dateArr[2];
  const stringDate = day + "-" + fullMonth + "-" + year;
  return stringDate;
};

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
