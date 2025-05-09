export async function seed(knex) {
  await knex("appointments").del();
  await knex("appointments").insert([
    {
      appointment_time: "2025-05-15 10:00:00",
      doctor_id: 2,
      patient_id: 1,
      payment_status: "pagada",
      status: "confirmada",
    },
    {
      appointment_time: "2025-05-16 14:30:00",
      doctor_id: 1,
      patient_id: 2,
      payment_status: "nopagada",
      status: "pendiente",
    },
  ]);
}