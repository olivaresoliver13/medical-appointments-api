import {
  getMyAppointmentsToday,
  confirmAppointment,
  rejectAppointment,
} from "../controllers/doctor.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

async function doctorRoutes(fastify, options) {
  fastify.addHook("preHandler", authenticate);

  fastify.get(
    "/appointments/today",
    { preHandler: authorize("doctor") },
    getMyAppointmentsToday
  );
  fastify.patch(
    "/appointments/:appointmentId/confirm",
    { preHandler: authorize("doctor") },
    confirmAppointment
  );
  fastify.patch(
    "/appointments/:appointmentId/reject",
    { preHandler: authorize("doctor") },
    rejectAppointment
  );
}

export default doctorRoutes;
