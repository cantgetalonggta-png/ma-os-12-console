import React from "react";
import ReactDOM from "react-dom/client";
import { Desk } from "./routes/index";
import "./styles.css";

// Standalone mount for production static / simple Vite build
const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Desk />
    </React.StrictMode>
  );
}
