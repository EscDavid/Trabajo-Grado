import { Router } from "express";
import { body} from "express-validator";
import { 
  crearTicket, 
  obtenerTicketsDashboard, 
  obtenerTicketPorId,
  actualizarTicket
} from "./ticket.controller.js";

const router = Router();
router.get("/dashboard", obtenerTicketsDashboard);
router.post("/",
    [
      body("correoCliente").isEmail(),
      body("asunto").notEmpty(),
      body("descripcionProblema").notEmpty()
    ],
    crearTicket
  );
router.put("/:id", actualizarTicket);
router.get("/:id", obtenerTicketPorId);
export default router;
