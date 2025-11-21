import { Router } from "express";
import { body } from "express-validator";
import {
  crearTicket,
  obtenerTicketsDashboard,
  obtenerTicketPorId
} from "./ticket.controller.js";

const router = Router();

// Obtener lista de tickets (para dashboard)
router.get("/dashboard", obtenerTicketsDashboard);

// Crear un nuevo ticket
router.post(
  "/",
  [
    body("email").isEmail(),
    body("subject").notEmpty(),
    body("description").notEmpty()
  ],
  crearTicket
);

// Actualizar un ticket por ID
/*
router.put(
  "/:id",
  [
    body("status").notEmpty(),
    body("solution_description").notEmpty(),
    body("technicianId")
  ],
  actualizarTicket
);
*/
// Obtener un ticket por ID
router.get("/:id", obtenerTicketPorId);

export default router;

