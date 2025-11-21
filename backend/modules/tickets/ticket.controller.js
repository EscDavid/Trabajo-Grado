import { findcustomerByEmail, createTicketDB, getTicketsFilteredDB, getTicketByIdDB, getTicketsByDateDB } from "./ticket.model.js";
import { logger } from "../../config/logger.js";

//elimine del import updateticketbyID


export const crearTicket = async (req, res) => {
  try {
    const { email, subject, description } = req.body;

    if (!email || !subject || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const customer = await findcustomerByEmail(email);
    if (!customer) {
      return res.status(404).json({ error: "customer not found" });
    }

    const ticketId = await createTicketDB(customer.id, subject, description, customer.zone);

    res.status(201).json({
      message: "Ticket created successfully",
      ticketId,
      zone: customer.zone,
    });
  } catch (error) {
    logger.error(`Error creating ticket: ${error.message}`);
    res.status(500).json({ error: "Error creating ticket" });
  }
};


export const obtenerTicketsDashboard = async (req, res) => {
  try {
    const statsArray =[];
    const {
      page = 1,
      perPage = 10,
      sortField = "created_at",
      sortOrder = "asc",
    } = req.query;

    const pageNum = Number(page);
    const perPageNum = Number(perPage);
    const offset = (pageNum - 1) * perPageNum;

    const tickets = await getTicketsFilteredDB({
      sortField,
      sortOrder,
      limit: perPageNum,
      offset,
    });

    const totalRecords = await getTicketsFilteredDB({
      countOnly: true,
    });

    const totalPages = Math.ceil(totalRecords / perPageNum);

    if (!page && !perPage && !sortField && !sortOrder) {
      const statsObj = await getDashboardStats();

       statsArray = Object.values(statsObj); 
   }
    res.json({ tickets, totalRecords, totalPages, stats: statsArray });

  } catch (err) {
    logger.error(`Error en tickets/dashboard: ${err.message}`);
    res.status(500).json({ message: "Error al obtener tickets" });
  }
};


export const getDashboardStats = async (req, res) => {
  try {

    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);


    const tickets = await getTicketsByDateDB(fechaInicio);


    const stats = tickets.reduce(
      (acc, ticket) => {
        switch (ticket.status) {
          case "Abierto":
            acc.Abierto++;
            break;
          case "En Progreso":
            acc.EnProgreso++;
            break;
          case "Cerrado":
            acc.Cerrado++;
            break;
        }
        return acc;
      },
      { Abierto: 0, EnProgreso: 0, Cerrado: 0 }
    );

    return stats;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo estadísticas del dashboard" });
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
/*
export const actualizarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await getTicketByIdDB(id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    if (ticket.status === 3) {
      return res
        .status(403)
        .json({ error: "No se puede actualizar un ticket Cerrado" });
    }
    const { status, solution_description, technicianId } = req.body;

    const affected = await updateTicketDB(id, status, solution_description, technicianId);
    if (affected === 0) return res.status(404).json({ error: "Ticket no encontrado o sin cambios" });

    return res.json({ message: "Ticket actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo actualizar el ticket" });
  }
};
*/