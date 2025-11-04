import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./modules/health/health.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);

// ruta raíz opcional
app.get("/", (req, res) => {
  res.json({ message: "API MVP ISP - backend activo" });
});

export default app;
