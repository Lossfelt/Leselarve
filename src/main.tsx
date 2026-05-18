import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import booksData from "./BOOKS.json";
import Presentation from "./Presentation.tsx";
import type { Book } from "./types.ts";

const books = booksData as Book[];

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing #root element");

createRoot(rootEl).render(
  <React.StrictMode>
    <Presentation books={books} />
  </React.StrictMode>
);
