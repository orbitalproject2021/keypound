import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import Signup from "./components/Signup";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <React.StrictMode>
    <Signup />
  </React.StrictMode>,
  document.getElementById("root")
);
