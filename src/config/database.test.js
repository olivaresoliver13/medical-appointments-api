const knex = require("knex");

const config = {
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST || "db",
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT || 3306,
  },
  pool: { min: 1, max: 1 }, // Importante para tests
};

module.exports = knex(config);
