import {
  requestAppointment,
  getMyAppointments,
} from "../controllers/patient.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

async function patientRoutes(fastify, options) {
  fastify.addHook("preHandler", authenticate);

  fastify.post(
    "/appointments",
    { preHandler: authorize("paciente") },
    requestAppointment
  );

  fastify.get(
    "/appointments",
    { preHandler: authorize("paciente") },
    getMyAppointments
  );
}

export default patientRoutes;
