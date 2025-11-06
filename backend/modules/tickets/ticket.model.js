import { db } from "../../config/db.js";

export const findClientByEmail = async (email) => {
  const [rows] = await db.query("SELECT id FROM clients WHERE email = ?", [email]);
  return rows[0] || null;
};

export const createTicketDB = async (clientId, subject, problemDescription) => {
  const [result] = await db.query(
    `INSERT INTO tickets (client_id, subject, problem_description)
     VALUES (?, ?, ?)`,
    [clientId, subject, problemDescription]
  );
  return result.insertId;
};

export const getTicketsDB = async () => {
  const [rows] = await db.query(
    `SELECT t.id, c.name AS client, t.technician_id, t.subject, t.problem_description, t.status, t.solution_description, t.created_at, t.closed_at
     FROM tickets t
     INNER JOIN clients c ON t.client_id = c.id
     ORDER BY t.created_at DESC`
  );
  return rows;
};

export const updateTicketDB = async (id, solution, status, technicianId) => {
  const closedAt = status === "Cerrado" ? new Date() : null;
  await db.query(
    `UPDATE tickets SET solution_description=?, status=?, technician_id=?, closed_at=? WHERE id=?`,
    [solution, status, technicianId, closedAt, id]
  );
};
