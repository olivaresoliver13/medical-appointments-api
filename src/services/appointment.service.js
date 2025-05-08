import Appointment from "../models/appointment.model.js";
import { isValidWorkingHour } from "../utils/validation.js";
import ApiError from "../utils/api-error.js";

class AppointmentService {
  async requestAppointment(patientId, doctorId, appointmentTime) {
    const timePart = appointmentTime.split(" ")[1];
    if (!timePart || !isValidWorkingHour(timePart)) {
      throw new ApiError(
        400,
        "No se puede pedir cita en un horario no permitido."
      );
    }

    const existingAppointment = await Appointment.findByTimeAndDoctor(
      doctorId,
      appointmentTime
    );
    if (existingAppointment) {
      throw new ApiError(409, "El horario ya está ocupado.");
    }

    return Appointment.create(patientId, doctorId, appointmentTime);
  }

  async getPatientAppointments(patientId) {
    return Appointment.findByPatientId(patientId);
  }

  async getDoctorAppointmentsToday(doctorId) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return Appointment.findTodayByDoctorId(doctorId);
  }

  async confirmAppointment(appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(404, "Cita no encontrada.");
    }
    // No permitir confirmar citas canceladas o rechazadas
    if (["cancelada", "rechazada"].includes(appointment.status)) {
      throw new ApiError(
        400,
        `No se puede confirmar una cita ${appointment.status}.`
      );
    }

    // Verificar si ya está confirmada
    if (appointment.status === "confirmada") {
      throw new ApiError(400, "La cita ya está confirmada.");
    }

    // Validar que esté pagada antes de confirmar
    if (appointment.payment_status !== "pagada") {
      throw new ApiError(400, "No se puede confirmar una cita no pagada.");
    }
    await Appointment.updateStatus(appointmentId, "confirmado");
  }

  async rejectAppointment(appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(404, "Cita no encontrada.");
    }
    // No permitir rechazar una cita que ya fue rechazada o cancelada
    if (["rechazada", "cancelada"].includes(appointment.status)) {
      throw new ApiError(400, `La cita ya está ${appointment.status}.`);
    }

    // Si tu lógica de negocio prohíbe rechazar citas confirmadas
    if (appointment.status === "confirmada") {
      throw new ApiError(400, "No se puede rechazar una cita ya confirmada.");
    }
    await Appointment.updateStatus(appointmentId, "rechazada");
  }
}

export default AppointmentService;
