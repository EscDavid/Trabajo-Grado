import app from "./app.js";
import { db } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const connection = await db.getConnection();
    console.log("✅ Conectado correctamente a la base de datos MySQL.");
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
  }
}

startServer();
