import AppointmentService from "../services/appointment.service.js";
import { validatePatientId } from "../utils/validation.js";


validatePatientId

const appointmentService = new AppointmentService();

export const requestAppointment = async (request, reply) => {
  try {
    const { doctorId, appointmentTime } = request.body;
    const patientId = request.user.id;
    const appointment = await appointmentService.requestAppointment(
      patientId,
      doctorId,
      appointmentTime
    );
    reply.status(201).send(appointment);
  } catch (error) {
    reply.status(error.statusCode || 500).send({ message: error.message });
  }
};

export const getMyAppointments = async (request, reply) => {
  try {
    const patientId = request.user.id;
    validatePatientId(patientId);
    const appointments = await appointmentService.getPatientAppointments(
      patientId
    );
    reply.send(appointments);
  } catch (error) {
    reply.status(error.statusCode || 500).send({ message: error.message });
  }
};
