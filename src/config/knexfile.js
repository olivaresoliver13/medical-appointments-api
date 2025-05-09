import dotenv from "dotenv";
dotenv.config();

export default {
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST || "db",
    port: process.env.DATABASE_PORT || 3306,
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "userpassword123",
    database: process.env.DATABASE_NAME || "medical_appointments",
  },
  migrations: {
    directory: "../database/migrations",
  },
  seeds: {
    directory: "../database/seeds",
  },
};
