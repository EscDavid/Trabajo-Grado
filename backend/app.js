const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const customerRoutes = require("./modules/customers/customers.routes.js");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/customers", customerRoutes);

// ruta raíz opcional
app.get("/", (req, res) => {
  res.json({ message: "API MVP ISP - backend activo" });
});

module.exports = app;
