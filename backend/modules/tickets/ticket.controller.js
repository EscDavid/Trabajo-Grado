import { 
  findClientByEmail, 
  createTicketDB, 
  getTicketsFilteredDB, 
  getTicketByIdDB, 
  updateTicketDB 
} from "./ticket.model.js";

// Crear ticket
export const crearTicket = async (req, res) => {
  try {
    const { correoCliente, asunto, descripcionProblema } = req.body;
    const client = await findClientByEmail(correoCliente);
    if (!client) return res.status(404).json({ error: "El cliente no existe en la base de datos." });

    const ticketId = await createTicketDB(client.id, asunto, descripcionProblema);
    res.status(201).json({ message: "Ticket creado con éxito", ticketId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el ticket" });
  }
};

// Obtener lista de tickets con filtro dinámico
export const obtenerTicketsDashboard = async (req, res) => {
  try {
    const { sortField, sortOrder, limit } = req.query;
    const tickets = await getTicketsFilteredDB({
      sortField,
      sortOrder,
      limit: limit ? parseInt(limit, 10) : 20
    });
    res.json(tickets);
  } catch (error) {
    console.error("Error en obtenerTicketsDashboard:", error);
    res.status(500).json({ error: "Error al obtener tickets del dashboard" });
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
    console.error("Error en obtenerTicketPorId:", error);
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
