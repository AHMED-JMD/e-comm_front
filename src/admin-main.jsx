import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AdminApp from "./AdminApp.jsx";
import { hidePageLoaderAfterPaint } from "./utils/pageLoader.js";

createRoot(document.getElementById("admin-root")).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
);

hidePageLoaderAfterPaint();
