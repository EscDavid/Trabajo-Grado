import { findClientByEmail, createTicketDB, getTicketsFilteredDB, getTicketByIdDB, updateTicketDB } from "./ticket.model.js";
import { logger } from "../../config/logger.js";



// Crear ticket
export const crearTicket = async (req, res) => {
  try {
    const { email, subject, problemDescription } = req.body;

    if (!email || !subject || !problemDescription) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const client = await findClientByEmail(email);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    const ticketId = await createTicketDB(client.id, subject, problemDescription, client.zone);

    res.status(201).json({
      message: "Ticket created successfully",
      ticketId,
      zone: client.zone,
    });
  } catch (error) {
    logger.error(`Error creating ticket: ${error.message}`);
    res.status(500).json({ error: "Error creating ticket" });
  }
};


// Obtener lista de tickets con filtro dinámico
// ✅ controllers/ticket.controller.js
export const obtenerTicketsDashboard = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10, // ✅ usar perPage, no limit
      sortField = "created_at",
      sortOrder = "asc",
    } = req.query;

    const pageNum = Number(page);
    const perPageNum = Number(perPage);
    const offset = (pageNum - 1) * perPageNum;

    // Obtener los tickets según la página y orden
    const tickets = await getTicketsFilteredDB({
      sortField,
      sortOrder,
      limit: perPageNum,
      offset,
    });

    // Contar total de registros (para la paginación)
    const totalRecords = await getTicketsFilteredDB({
      countOnly: true,
    });

    const totalPages = Math.ceil(totalRecords / perPageNum);

    res.json({ tickets, totalRecords, totalPages });
  } catch (err) {
    logger.error(`Error en tickets/dashboard: ${err.message}`);
    res.status(500).json({ message: "Error al obtener tickets" });
  }
};




export const obtenerTicketPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await getTicketByIdDB(id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(ticket);
  } catch (error) {
    logger.error(`Error al obtener tickets por Id: ${error.message}`);
    res.status(500).json({ error: "Error al obtener el ticket" });
  }
};

// Actualizar ticket
export const actualizarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcionSolucion, estado, tecnicoId } = req.body;

    const affected = await updateTicketDB(id, descripcionSolucion, estado, tecnicoId);
    if (affected === 0) return res.status(404).json({ error: "Ticket no encontrado o sin cambios" });

    res.json({ message: "Ticket actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo actualizar el ticket" });
  }
};
