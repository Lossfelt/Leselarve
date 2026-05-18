import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import BOOKS from "./BOOKS.json";
import Presentation from "./Presentation.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Presentation books={BOOKS} />
  </React.StrictMode>
);
