const express = require("express");
const router = express.Router();
const customerController = require("./customers.controller.js");

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

module.exports = router;
