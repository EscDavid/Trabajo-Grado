import { Router } from "express";
const router = Router();
import * as customerController from "./customers.controller.js";

//Busca cliente por el nombre

router.get("/zones",customerController.findZones);

router.get("/search", customerController.findForSearch);

// Crear un nuevo cliente
router.post("/", customerController.create);

// Obtener todos los clientes
router.get("/", customerController.findAll);

// Obtener un cliente por ID
router.get("/:id", customerController.findOne);

// Actualizar un cliente
router.put("/:id", customerController.update);

// Cambiar estado de un cliente
router.patch("/:id/status", customerController.changeStatus);

// Eliminar (borrado lógico) un cliente
router.delete("/:id", customerController.delete);

export default router;
