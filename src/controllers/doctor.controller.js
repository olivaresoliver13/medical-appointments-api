import AppointmentService from "../services/appointment.service.js";
import { validateAppointmentId, validateDoctortId } from "../utils/validation.js";

const appointmentService = new AppointmentService();

export const getMyAppointmentsToday = async (request, reply) => {
  try {
    const doctorId = request.user.id;
    validateDoctortId(doctorId);
    const appointments = await appointmentService.getDoctorAppointmentsToday(
      doctorId
    );
    reply.send(appointments);
  } catch (error) {
    reply.status(error.statusCode || 500).send({ message: error.message });
  }
};

export const confirmAppointment = async (request, reply) => {
  try {
    const { appointmentId } = request.params;
    validateAppointmentId(appointmentId);
    await appointmentService.confirmAppointment(appointmentId);
    reply.send({ message: "Cita confirmada." });
  } catch (error) {
    reply.status(error.statusCode || 500).send({ message: error.message });
  }
};

export const rejectAppointment = async (request, reply) => {
  try {
    const { appointmentId } = request.params;
    validateAppointmentId(appointmentId);
    // Aquí podrías agregar lógica adicional para el rechazo, como notificar al paciente.
    await appointmentService.rejectAppointment(appointmentId, "rejected");
    reply.send({ message: "Cita rechazada." });
  } catch (error) {
    reply.status(error.statusCode || 500).send({ message: error.message });
  }
};
