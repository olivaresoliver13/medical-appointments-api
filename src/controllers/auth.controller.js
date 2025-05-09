import AuthService from "../services/auth.service.js";
import {
  validateRegisterBody,
  validateLoginCredentials,
} from "../utils/validation.js";

export const registerPatient = async (request, reply) => {
  const authService = new AuthService(request.server);
  try {
    validateRegisterBody(request.body);
    const { name, email, password } = request.body;
    const patient = await authService.registerPatient(name, email, password);
    reply.status(201).send(patient);
  } catch (error) {
    reply.status(error.statusCode || 500).send({ message: error.message });
  }
};

export const registerDoctor = async (request, reply) => {
  const authService = new AuthService(request.server);
  try {
    validateRegisterBody(request.body);
    const { name, email, password } = request.body;
    const doctor = await authService.registerDoctor(name, email, password);
    reply.status(201).send(doctor);
  } catch (error) {
    reply.status(error.statusCode || 500).send({ message: error.message });
  }
};

export const login = async (request, reply) => {
  const authService = new AuthService(request.server);
  try {
    validateLoginCredentials(request.body);
    const { email, password, userType } = request.body;
    const { token, user } = await authService.login(email, password, userType);
    reply.send({ token, user });
  } catch (error) {
    reply.status(error.statusCode || 401).send({ message: error.message });
  }
};