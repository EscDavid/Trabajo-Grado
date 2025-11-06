import { findClientByEmail, createTicketDB, getTicketsDB, updateTicketDB } from "./ticket.model.js";

export const crearTicket = async (req, res) => {
  try {
    const { correoCliente, asunto, descripcionProblema } = req.body;

    // Verificar cliente existente
    const client = await findClientByEmail(correoCliente);
    if (!client) return res.status(404).json({ error: "El cliente no existe en la base de datos." });

    // Crear ticket
    const ticketId = await createTicketDB(client.id, asunto, descripcionProblema);
    res.status(201).json({ message: "Ticket creado con éxito", ticketId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el ticket" });
  }
};

export const obtenerTickets = async (req, res) => {
  const tickets = await getTicketsDB();
  res.json(tickets);
};

export const actualizarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcionSolucion, estado, tecnicoId } = req.body;

    await updateTicketDB(id, descripcionSolucion, estado, tecnicoId);
    res.json({ message: "Ticket actualizado correctamente" });

  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar el ticket" });
  }
};
