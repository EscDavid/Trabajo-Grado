import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TicketDashboard from "./modules/tickets/pages/TicketDashboard";

export default function App() {
  return (
    <Routes>
      {/* Página principal */}
      <Route path="/" element={<Home />} />

      {/* Módulo de tickets */}
      <Route path="/tickets" element={<TicketDashboard />} />
    </Routes>
  );
}
