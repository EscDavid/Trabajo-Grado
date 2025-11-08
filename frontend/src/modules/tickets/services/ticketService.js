// src/modules/tickets/services/ticketService.js

const API_URL = "http://localhost:5000/tickets";

/**
 * Crear un nuevo ticket
 * @param {Object} formData - Datos del formulario (correoCliente, asunto, descripcionProblema)
 */
export const createTicket = async (ticketData) => {
  try {
    console.log("[TicketService] Enviando:", ticketData);

    const res = await fetch("http://localhost:5000/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData),
    });

    const responseText = await res.text();
    if (!res.ok) {
      throw new Error(`(${res.status}) Error al crear ticket: ${responseText}`);
    }

    return JSON.parse(responseText);
  } catch (err) {
    console.error("[TicketService] Error creando ticket:", err);
    throw err;
  }
};


/**
 * Obtener lista de tickets para el dashboard
 * @param {Object} params - Parámetros opcionales para paginación y orden
 */
export const getTickets = async ({
  sortField = "created_at",
  sortOrder = "asc",
  page = 1,
  limit = 20,
} = {}) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard?sortField=${sortField}&sortOrder=${sortOrder}&page=${page}&limit=${limit}`
    );

    if (!response.ok) throw new Error("Error al obtener los tickets");

    return await response.json();
  } catch (err) {
    console.error("[TicketService] Error obteniendo tickets:", err);
    return { tickets: [], totalPages: 1, totalRecords: 0 };
  }
};

/**
 * Obtener un ticket por ID
 */
export const getTicketById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Ticket no encontrado");
    return await response.json();
  } catch (err) {
    console.error("[TicketService] Error obteniendo ticket por ID:", err);
    throw err;
  }
};

/**
 * Actualizar un ticket por ID
 */
export const updateTicket = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error("Error al actualizar ticket");
    return await response.json();
  } catch (err) {
    console.error("[TicketService] Error actualizando ticket:", err);
    throw err;
  }
};
