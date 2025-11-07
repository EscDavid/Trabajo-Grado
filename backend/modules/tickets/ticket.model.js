import { db } from "../../config/db.js";

// Buscar cliente por correo
export const findClientByEmail = async (email) => {
  const [rows] = await db.query("SELECT id FROM clients WHERE email = ?", [email]);
  return rows[0] || null;
};

// Crear ticket
export const createTicketDB = async (clientId, subject, problemDescription) => {
  const [result] = await db.query(
    `INSERT INTO tickets (client_id, subject, problem_description)
     VALUES (?, ?, ?)`,
    [clientId, subject, problemDescription]
  );
  return result.insertId;
};

// Obtener lista de tickets con orden dinámico
export const getTicketsFilteredDB = async ({ sortField, sortOrder, limit = 20, offset = 0 } = {}) => {
  let query = `
    SELECT 
      t.id, 
      c.name AS client, 
      t.subject, 
      t.status, 
      t.created_at
    FROM tickets t
    INNER JOIN clients c ON t.client_id = c.id
  `;

  const allowedFields = ["created_at", "subject", "status", "client"];
  const allowedOrders = ["asc", "desc"];
  const safeSortField = allowedFields.includes(sortField) ? sortField : "created_at";
  const safeSortOrder = allowedOrders.includes(sortOrder?.toLowerCase()) ? sortOrder.toUpperCase() : "ASC";
  const orderField = safeSortField === "client" ? "c.name" : `t.${safeSortField}`;

  query += ` ORDER BY ${orderField} ${safeSortOrder} LIMIT ? OFFSET ?`;

  const [rows] = await db.query(query, [parseInt(limit, 10), parseInt(offset, 10)]);
  return rows;
};

// Obtener ticket por ID
export const getTicketByIdDB = async (id) => {
  const [rows] = await db.query(
    `SELECT t.id, c.name AS client, c.email, t.technician_id, t.subject, t.problem_description, 
            t.status, t.solution_description, t.created_at, t.closed_at
     FROM tickets t
     INNER JOIN clients c ON t.client_id = c.id
     WHERE t.id = ?`,
    [id]
  );
  return rows[0] || null;
};

// Actualizar ticket
export const updateTicketDB = async (id, solution, status, technicianId) => {
  const closedAt = status === "Cerrado" ? new Date() : null;
  const [result] = await db.query(
    `UPDATE tickets 
     SET solution_description=?, status=?, technician_id=?, closed_at=? 
     WHERE id=?`,
    [solution, status, technicianId, closedAt, id]
  );
  return result.affectedRows;
};
