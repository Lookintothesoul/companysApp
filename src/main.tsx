import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { DataBaseContext } from "./context/DataBaseContext.ts";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwPXF2dGY3HcdEDFfu3bTKtc-DtS7K7UM",
  authDomain: "companys-app-a3b89.firebaseapp.com",
  databaseURL:
    "https://companys-app-a3b89-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "companys-app-a3b89",
  storageBucket: "companys-app-a3b89.appspot.com",
  messagingSenderId: "295855173241",
  appId: "1:295855173241:web:dfc876a16e28c9ef2faea8",
  measurementId: "G-GWXK4NQMQZ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <DataBaseContext.Provider value={{ db }}>
    <Provider store={store}>
      <App />
    </Provider>
  </DataBaseContext.Provider>,
);
