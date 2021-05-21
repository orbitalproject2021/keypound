import firebase from "firebase/app";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, measurementId is an optional field
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC5Zv8RmOr8Zpyln0TxCenFmqg90DsaDZg",
    authDomain: "spendee-ccd4a.firebaseapp.com",
    databaseURL: "https://spendee-ccd4a-default-rtdb.firebaseio.com",
    projectId: "spendee-ccd4a",
    storageBucket: "spendee-ccd4a.appspot.com",
    messagingSenderId: "403463191645",
    appId: "1:403463191645:web:487516914c11ceb580e1b4",
    measurementId: "G-58QJD72GNK",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
