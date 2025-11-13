import app from "./app.js";
<<<<<<< HEAD
import { logger } from "./config/logger.js";
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Servidor backend escuchando en puerto ${PORT}`);
});
=======
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
>>>>>>> 0c08c9898d71335585c73f712011f4fb8d6030fc
