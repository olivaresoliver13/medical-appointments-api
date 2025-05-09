import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.DATABASE_HOST ||
  !process.env.DATABASE_USER ||
  !process.env.DATABASE_PASSWORD ||
  !process.env.DATABASE_NAME
) {
  throw new Error(
    "Faltan algunas variables de entorno para la configuración de la base de datos"
  );
}

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST || "db",
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT || 3306,
  },
});

export default db;