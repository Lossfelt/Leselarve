import React from "react";
import { render } from "react-dom";
import "./index.css";
import BOOKS from "./BOOKS.json";
import Presentation from "./Presentation";

render(<Presentation books={BOOKS} />, document.getElementById("root"));
