import { db } from "../../config/db.js";
import { logger } from "../../config/logger.js";

// Buscar customere por correo
export const findcustomerByEmail = async (email) => {
  const [rows] = await db.query("SELECT id, zone FROM customers WHERE email = ?", [email]);
  return rows[0] || null;
};

// Crear ticket
export const createTicketDB = async (customerId, subject, problemDescription,zone) => {
  const [result] = await db.query(
    `INSERT INTO tickets (customer_id, subject, problem_description,zone)
     VALUES (?, ?, ?, ?)`,
    [customerId, subject, problemDescription,zone]
  );
  return result.insertId;
};

// Obtener lista de tickets con orden dinámico
// Obtener lista de tickets con orden dinámico
export const getTicketsFilteredDB = async ({ sortField, sortOrder, limit = 10, offset = 0, countOnly = false } = {}) => {
  if (countOnly) {
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM tickets");
    return rows[0].count;
  }

  let query = `
    SELECT 
      t.id, 
      c.first_name AS customer_first_name,
      c.last_name AS customer_last_name, 
      t.subject, 
      t.status,
      t.zone, 
      t.created_at
    FROM tickets t
    INNER JOIN customers c ON t.customer_id = c.id
  `;

  const allowedFields = ["created_at", "subject", "status", "customer", "zone"];
  const allowedOrders = ["asc", "desc"];
  const safeSortField = allowedFields.includes(sortField) ? sortField : "created_at";
  const safeSortOrder = allowedOrders.includes(sortOrder?.toLowerCase()) ? sortOrder.toUpperCase() : "ASC";
  const orderField = safeSortField === "customer" ? "c.last_name" : `t.${safeSortField}`;

  query += ` ORDER BY ${orderField} ${safeSortOrder} LIMIT ? OFFSET ?`;

  const [rows] = await db.query(query, [parseInt(limit, 10), parseInt(offset, 10)]);

  // ✅ Combinar nombres sin alterar estructura original
  const formattedRows = rows.map(r => ({
    ...r,
    customer: `${r.customer_first_name || ""} ${r.customer_last_name || ""}`.trim()
  }));

  return formattedRows;
};


// Obtener ticket por ID
export const getTicketByIdDB = async (id) => {
  const [rows] = await db.query(
    `SELECT 
        t.id, 
        c.first_name AS customer_first_name,
        c.last_name AS customer_last_name, 
        t.subject, 
        t.problem_description, 
        t.status, 
        t.zone, 
        t.solution_description, 
        t.created_at, 
        t.closed_at, 
        u.name AS technician_name
     FROM tickets t
     INNER JOIN customers c ON t.customer_id = c.id
     LEFT JOIN users u ON t.technician_id = u.id
     WHERE t.id = ?`,
    [id]
  );

  if (!rows.length) return null;

  // ✅ Combinar nombres del cliente
  const ticket = rows[0];
  ticket.customer = `${ticket.customer_first_name || ""} ${ticket.customer_last_name || ""}`.trim();

  return ticket;
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
