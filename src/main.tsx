import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Desk } from "./routes/index";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Desk />
  </StrictMode>,
);
