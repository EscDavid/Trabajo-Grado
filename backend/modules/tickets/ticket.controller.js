import { findCustomerByEmail, createTicketDB, getTicketsFilteredDB, getTicketByIdDB, getTicketsByDateDB, getTicketsTypes } from "./ticket.model.js";
import { logger } from "../../config/logger.js";

//elimine del import updateticketbyID


export const crearTicket = async (req, res) => {
  try {
    let { email, subject, ticket_type_id, zone, ticket_address, description } = req.body;
    let customer_id = null;


    if (!subject || !description || !ticket_address || !zone || !ticket_type_id) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Si NO es instalación, buscar cliente por email
    if (ticket_type_id !== 1) {
      if (!email) {
        return res.status(400).json({ error: "El correo del cliente es obligatorio para tickets no de instalación" });
      }

      const customer = await findCustomerByEmail(email);

      if (!customer) {
        return res.status(404).json({ error: "Cliente no encontrado" });
      }

      customer_id = customer.id;
      zone = customer.zone;
      ticket_address = customer.billing_address
    }


    const ticketId = await createTicketDB(
      ticket_type_id, 
      customer_id,
      subject,
      ticket_address,
      zone,
      description,
    );

    return res.status(201).json({
      message: "Ticket creado exitosamente",
      ticketId,
    });
  } catch (error) {
    console.error("Error creando ticket:", error);
    res.status(500).json({ error: "Error interno al crear el ticket" });
  }
};



export const obtenerTicketsDashboard = async (req, res) => {
  try {

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

  
    res.json({ tickets, totalRecords, totalPages});

  } catch (err) {
    logger.error(`Error en tickets/dashboard: ${err.message}`);
    res.status(500).json({ message: "Error al obtener tickets" });
  }
};


export const getStatusStats = async () => {
  const tickets = await getTicketsByDateDB();

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
};
/*
export const assignTicketsController = async (req, res) => {
  try {
    const { ticketIds, technicianIds } = req.body;

    if (!ticketIds || !technicianIds) {
      return res.status(400).json({ error: "Faltan datos para asignación" });
    }

    await assignTicketsDB(ticketIds, technicianIds);

    return res.json({
      message: "Tickets asignados correctamente",
      tickets: ticketIds.length,
      technicians: technicianIds.length,
    });

  } catch (error) {
    console.error("Error en assignTicketsController:", error);
    res.status(500).json({ error: "Error asignando tickets" });
  }
};
export const getTechniciansController = async (req, res) => {
  try {
    const technicians = await getUsersByRoleDB("TECHNICAL");
    res.json(technicians);
  } catch (error) {
    console.error("Error cargando técnicos:", error);
    res.status(500).json({ error: "Error cargando técnicos" });
  }
};*/
export const obtenerStatsDashboard = async (req, res) => {
  try {
    const statsObj = await getStatusStats();

    // Convierto a array (formato que tu FE requiere)
    const statsArray = Object.values(statsObj);

    res.json({
      stats: statsArray,
      //statsObject: statsObj, 
    });

  } catch (error) {
    console.error("Error en obtenerStatsDashboard:", error);
    res.status(500).json({ error: "Error obteniendo estadísticas" });
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

export const getTicketTypes = async (req, res) => {
  try {

    const types = await getTicketsTypes();
    res.json(types)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo estadísticas del dashboard" });
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