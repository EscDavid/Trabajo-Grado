import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./modules/health/health.routes.js";
import ticketRoutes from "./modules/tickets/ticket.routes.js";
import customerRoutes from "./modules/customers/customers.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// Rutas
app.use("/customers", customerRoutes);

app.use("/health", healthRoutes);
app.use("/tickets", ticketRoutes);
// ruta raíz opcional
app.get("/", (req, res) => {
  res.json({ message: "API MVP ISP - backend activo" });
});

app.use(errorHandler);

export default app;
