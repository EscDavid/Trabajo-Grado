import { Router } from "express";
import { crearTicket, obtenerTickets, actualizarTicket } from "./ticket.controller.js";

const router = Router();

router.get("/", obtenerTickets);        // Técnico o Admin
router.post("/", crearTicket);          // Recepción / Usuario
router.put("/:id", actualizarTicket);   // Técnico actualiza solución y estado

export default router;
