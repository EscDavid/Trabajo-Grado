import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "isp_management_system", // 👈 aquí va el nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
});
