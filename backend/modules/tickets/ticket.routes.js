import { Router } from "express";
import { body } from "express-validator";
import {
  crearTicket,
  obtenerTicketsDashboard,
  obtenerTicketPorId,
  getTicketTypes, obtenerStatsDashboard
} from "./ticket.controller.js";

const router = Router();

// Obtener lista de tickets (para dashboard)
router.get("/dashboard", obtenerTicketsDashboard);
//router.post("/assign", assignTicketsController);
//router.get("/technicians", getTechniciansController);
router.get("/stats", obtenerStatsDashboard);
router.post(
  "/",
  [
    body("email")
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage("El correo no es válido"),

    body("customer_id")
      .optional({ checkFalsy: true })
      .isInt()
      .withMessage("El ID del cliente debe ser numérico"),

    body("ticket_type_id")
      .notEmpty()
      .withMessage("El tipo de ticket es obligatorio"),

    // Validación condicional según el tipo de ticket
    body().custom((value, { req }) => {
      const { ticket_type_id, email, customer_id } = req.body;

      // Si NO es instalación, debe tener email o customer_id
      if (parseInt(ticket_type_id) !== 1 && !email && !customer_id) {
        throw new Error("Debe proporcionar un email o un customer_id si no es una instalación");
      }

      // Si es instalación (1), ambos pueden ser nulos
      return true;
    }),

    body("subject").notEmpty().withMessage("El asunto es obligatorio"),
    body("ticket_address").notEmpty().withMessage("La dirección es obligatoria"),
    body("zone").notEmpty().withMessage("La zona es obligatoria"),
    body("description").notEmpty().withMessage("La descripción es obligatoria"),
  ],
  crearTicket
);


router.get("/ticketTypes",getTicketTypes)

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

