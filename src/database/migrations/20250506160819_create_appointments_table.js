export async function up(knex) {
  return knex.schema.createTable("appointments", (table) => {
    table.increments("id").primary();
    table
      .integer("patient_id")
      .unsigned()
      .references("id")
      .inTable("patients")
      .onDelete("CASCADE")
      .notNullable();
    table
      .integer("doctor_id")
      .unsigned()
      .references("id")
      .inTable("doctors")
      .onDelete("CASCADE")
      .notNullable();
    table.dateTime("appointment_time").notNullable();
    table
      .enum("status", ["pendiente", "confirmada", "rechazada", "cancelada"])
      .defaultTo("pendiente");
    table.enum("payment_status", ["nopagada", "pagada"]).defaultTo("nopagada");
    table.timestamps(true, true);
    table.unique(["doctor_id", "appointment_time"]);
  });
}

export async function down(knex) {
  return knex.schema.dropTable("appointments");
}