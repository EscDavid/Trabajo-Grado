const { pool } = require("./db.js"); // Conexión MySQL

// Crear un nuevo cliente
const create = async (req, res) => {
  try {
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "billing_address",
      "registration_date",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `El campo '${field}' es obligatorio.`,
        });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO customers 
        (first_name, last_name, email, phone_primary, phone_secondary, document_type, document_number, billing_address, service_address, registration_date, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.phone_primary || null,
        req.body.phone_secondary || null,
        req.body.document_type || null,
        req.body.document_number || null,
        req.body.billing_address,
        req.body.service_address || req.body.billing_address,
        req.body.registration_date,
        req.body.status || "pending_activation",
        req.body.notes || null,
      ]
    );

    res.status(201).json({
      message: "✅ Cliente creado correctamente",
      customerId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error al crear cliente:", error);
    res.status(500).json({
      message: "Error al crear el cliente.",
      error: error.message,
    });
  }
};

// Obtener todos los clientes
const findAll = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM customers ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener clientes:", error);
    res.status(500).json({ message: "Error al obtener los clientes." });
  }
};

// Obtener un cliente por ID
const findOne = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener cliente:", error);
    res.status(500).json({ message: "Error al obtener el cliente." });
  }
};

// Actualizar un cliente
const update = async (req, res) => {
  try {
    const [result] = await pool.query("UPDATE customers SET ? WHERE id = ?", [
      req.body,
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Cliente no encontrado o sin cambios." });
    }

    res.json({ message: "✅ Cliente actualizado correctamente." });
  } catch (error) {
    console.error("❌ Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar el cliente." });
  }
};

// Cambiar estado de un cliente
const changeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status)
      return res.status(400).json({ message: "Debe proporcionar un estado." });

    const [result] = await pool.query(
      "UPDATE customers SET status = ? WHERE id = ?",
      [status, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Cliente no encontrado." });

    res.json({ message: `✅ Estado actualizado a '${status}'` });
  } catch (error) {
    console.error("❌ Error al cambiar estado:", error);
    res
      .status(500)
      .json({ message: "Error al cambiar el estado del cliente." });
  }
};

// Borrado lógico (cambia estado a 'cancelled')
const remove = async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE customers SET status = 'cancelled' WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Cliente no encontrado." });

    res.json({ message: "🗑️ Cliente cancelado exitosamente." });
  } catch (error) {
    console.error("❌ Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error al eliminar el cliente." });
  }
};

// Exportación para CommonJS
module.exports = {
  create,
  findAll,
  findOne,
  update,
  changeStatus,
  delete: remove,
};
