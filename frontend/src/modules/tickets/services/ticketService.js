// src/modules/tickets/services/ticketService.js



/**
 * Crear un nuevo ticket
 * @param {Object} formData - Datos del formulario (correoCliente, asunto, descripcionProblema)
 */
// frontend/src/modules/tickets/services/ticketService.js
const API_URL = `${import.meta.env.VITE_API_URL}/tickets`;

export const createTicket = async (formData) => {
  try {
    console.log(formData);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData), 
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error creating ticket: ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("[TicketService] Error:", error);
    throw error;
  }
};

/*

export const assignTickets = async (ticketIds, technicianIds) => {
  const { data } = await api.post("/tickets/assign", {
    ticketIds,
    technicianIds,
  });
  return data;
};
*/

/**
 * Obtener lista de tickets para el dashboard
 * @param {Object} params - Parámetros opcionales para paginación y orden
 */
export const getTickets = async ({
  sortField = "created_at",
  sortOrder = "asc",
  page = 1,
  perPage = 10, 
} = {}) => {
  try {
    
    const response = await fetch(
      `${API_URL}/dashboard?sortField=${sortField}&sortOrder=${sortOrder}&page=${page}&perPage=${perPage}`
    );

    if (!response.ok) throw new Error("Error al obtener los tickets");

    const data = await response.json();

    return data;
  } catch (err) {
    console.error("[TicketService] Error obteniendo tickets:", err);
    return { tickets: [], totalPages: 1, totalRecords: 0 };
  }
};

/**
 * Obtener un ticket por ID
 */
export const getTicketById = async (ticketId) => {
  try {
    const response = await fetch(`${API_URL}/${ticketId}`); 
    if (!response.ok) throw new Error("Ticket no encontrado");
    return await response.json();
  } catch (err) {
    console.error("[TicketService] Error obteniendo ticket por ID:", err);
    throw err;
  }
};

export const getTicketStats = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`);

    if (!response.ok) throw new Error("Error al obtener estadísticas de tickets");

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("[TicketService] Error obteniendo estadísticas de tickets:", err);
    // Retornamos un objeto vacío por defecto similar a getTickets
    return { totalTickets: 0, openTickets: 0, closedTickets: 0, pendingTickets: 0 };
  }
};

export const getTicketTypes = async () => {
  try {
    const response = await fetch(`${API_URL}/ticketTypes`); 
    if (!response.ok) throw new Error("Tipos de ticket no encontrados");
    return await response.json();
  } catch (err) {
    console.error("[TicketService] Error obteniendo los tipos de tickets:", err);
    throw err;
  }
};


/**
 * Actualizar un ticket por ID
 */
/*
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
*/