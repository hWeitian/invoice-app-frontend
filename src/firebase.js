import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: "invoicegenie-e9b69.firebaseapp.com",
  projectId: "invoicegenie-e9b69",
  storageBucket: "invoicegenie-e9b69.appspot.com",
  messagingSenderId: "33090697945",
  appId: "1:33090697945:web:e07bd79bebe94d13f65cc8",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);
