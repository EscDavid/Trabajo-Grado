import { Router } from "express";
import { body } from "express-validator";
import {
  crearTicket,
  obtenerTicketsDashboard,
  obtenerTicketPorId,
  actualizarTicket
} from "./ticket.controller.js";

const router = Router();

// Obtener lista de tickets (para dashboard)
router.get("/dashboard", obtenerTicketsDashboard);

// Crear un nuevo ticket (con validación)
router.post(
  "/",
  [
    body("email").isEmail(),
    body("subject").notEmpty(),
    body("problemDescription").notEmpty()

  ],
  crearTicket
);

// Actualizar un ticket por ID
router.put("/:id", actualizarTicket);

// Obtener un ticket por ID
router.get("/:id", obtenerTicketPorId);

export default router;
