const app = require("./app.js");
const { pool } = require("./modules/customers/db.js");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const connection = await pool.getConnection();
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
