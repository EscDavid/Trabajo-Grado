// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import TicketDashboard from "./modules/tickets/pages/TicketDashboard";
import TicketFormWrapper from "./modules/tickets/components/TicketWrapper";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tickets" replace />} />
        <Route path="/tickets" element={<TicketDashboard />} />
        <Route path="/crear-ticket" element={<TicketFormWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}
