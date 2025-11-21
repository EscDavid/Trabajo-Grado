import { db } from "../../config/db.js";
import { logger } from "../../config/logger.js";

// Buscar customere por correo
export const findcustomerByEmail = async (email) => {
  const [rows] = await db.query("SELECT C.id AS id, Z.name AS zone FROM customers C INNER JOIN zones Z ON C.zone_id = Z.id WHERE C.email = ?", [email]);
  return rows[0];
};

// Crear ticket
export const createTicketDB = async (customerId, subject, description) => {
  const [result] = await db.query(
    `INSERT INTO tickets (customer_id, subject, description)
     VALUES (?, ?, ?)`,
    [customerId, subject, description]
  );
  return result.insertId;
};



export const getTicketsFilteredDB = async ({
  sortField,
  sortOrder,
  limit = 10,
  offset = 0,
  countOnly = false
} = {}) => {

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
      z.name AS zone, 
      t.created_at
    FROM tickets t
    INNER JOIN customers c ON t.customer_id = c.id
    INNER JOIN zones z ON c.zone_id = z.id
  `;

  const allowedFields = ["created_at", "subject", "status", "customer", "zone"];
  const allowedOrders = ["asc", "desc"];

  const safeSortField = allowedFields.includes(sortField)
    ? sortField
    : "created_at";

  const safeSortOrder = allowedOrders.includes(sortOrder?.toLowerCase())
    ? sortOrder.toUpperCase()
    : "ASC";

  let orderField;

  switch (safeSortField) {
    case "customer":
      orderField = "c.last_name";
      break;
    case "zone":
      orderField = "z.name";
      break;
    default:
      orderField = `t.${safeSortField}`;
  }

  query += ` ORDER BY ${orderField} ${safeSortOrder} LIMIT ? OFFSET ?`;

  const [rows] = await db.query(query, [
    parseInt(limit, 10),
    parseInt(offset, 10)
  ]);

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
        ty.name AS ticket_type,
        t.subject, 
        t.description, 
        t.status, 
        z.name AS zone, 
        t.solution_description, 
        t.created_at, 
        t.closed_at
     FROM tickets t
     INNER JOIN customers c ON t.customer_id = c.id
     INNER JOIN zones z ON c.zone_id = z.id
     INNER JOIN ticket_types ty ON t.ticket_type_id = ty.id
     LEFT JOIN ticket_assignments a ON a.ticket_id = t.id
     WHERE t.id = ?`,
    [id]
  );

  if (!rows.length) return null;

  const ticket = rows[0];
  ticket.customer = `${ticket.customer_first_name} ${ticket.customer_last_name}`.trim();

  return ticket;
};


export const getTicketsByDateDB = async (fechaInicio) => {
  const [rows] = await db.query(
    `SELECT status FROM tickets WHERE created_at >= ?`,
    [fechaInicio]
  );
  return rows;
};




/*
export const updateTicketDB = async (id, status, solution_description, technicianId) => {
  const closedAt = status === "Cerrado" ? new Date() : null;
  const [result] = await db.query(
    `UPDATE tickets 
     SET status=?,solution_description=? , technician_id=?, closed_at=? 
     WHERE id=?`,
    [status, solution_description, technicianId, closedAt, id]
  );
  return result.affectedRows;
};
*/