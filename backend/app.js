import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./modules/health/health.routes.js";
import apiRoutes from "./src/api/routes/index.js";

dotenv.config();
const app = express();

// Configurar CORS
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5173', 'http://127.0.0.1:3001', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas
app.use("/health", healthRoutes);
app.use("/api", apiRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ message: "API MVP ISP - backend activo" });
});

export default app;