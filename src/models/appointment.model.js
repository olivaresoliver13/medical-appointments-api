import db from "../config/database.js";

class Appointment {
  static async create(patientId, doctorId, appointmentTime) {
    const [id] = await db("appointments").insert({
      patient_id: patientId,
      doctor_id: doctorId,
      appointment_time: appointmentTime,
      status: "pendiente",
      payment_status: "nopagada",
    });
    return this.findById(id);
  }

  static async findById(id) {
    return db("appointments").where({ id }).first();
  }

  static async findByTimeAndDoctor(doctorId, appointmentTime) {
    return db("appointments")
      .where({ doctor_id: doctorId, appointment_time: appointmentTime })
      .first();
  }

  static async findByPatientId(patientId) {
    return db("appointments").where({ patient_id: patientId }).select("*");
  }

  static async findTodayByDoctorId(doctorId) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return db("appointments")
      .where("doctor_id", doctorId)
      .whereBetween("appointment_time", [todayStart, todayEnd]);
  }

  static async updatePaymentStatus(id, paymentStatus) {
    return db("appointments")
      .where({ id })
      .update({ payment_status: paymentStatus });
  }

  static async updateStatus(id, status) {
    return db("appointments").where({ id }).update({ status });
  }
}

export default Appointment;
