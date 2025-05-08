import {
  registerPatient,
  registerDoctor,
  login,
} from "../controllers/auth.controller.js";

async function authRoutes(fastify, options) {
  fastify.post("/register/patient", registerPatient);
  fastify.post("/register/doctor", registerDoctor);
  fastify.post("/login", login);
}

export default authRoutes;
