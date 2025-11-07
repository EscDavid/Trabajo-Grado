import { Router } from "express";
import { 
  crearTicket, 
  obtenerTicketsDashboard, 
  obtenerTicketPorId,
  actualizarTicket
} from "./ticket.controller.js";

const router = Router();
router.get("/dashboard", obtenerTicketsDashboard);
router.post("/", crearTicket);
router.put("/:id", actualizarTicket);
router.get("/:id", obtenerTicketPorId);
export default router;
