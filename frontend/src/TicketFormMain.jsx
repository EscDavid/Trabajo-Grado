// src/modules/tickets/TicketFormMain.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import TicketWrapper from "./components/TicketWrapper";
import "./index.css"; // si necesitas estilos globales

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TicketWrapper />
  </React.StrictMode>
);
