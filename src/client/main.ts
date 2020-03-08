import "./styles.scss";
import ReactDOM from "react-dom";
import React from "react";
import { MainPage } from "./components/main-page";

let root = document.body.appendChild(document.createElement("div"));
ReactDOM.render(React.createElement(MainPage), root);
