import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/api-error.js";

export default class AuthService {
  constructor(fastify) {
    this.fastify = fastify;
  }

  async registerPatient(name, email, password) {
    const existingPatient = await Patient.findByEmail(email);
    if (existingPatient) {
      throw new ApiError(409, "El correo electrónico ya está registrado.");
    }

    return Patient.create(name, email, password);
  }

  async registerDoctor(name, email, password) {
    const existingDoctor = await Doctor.findByEmail(email);
    if (existingDoctor) {
      throw new ApiError(409, "El correo electrónico ya está registrado.");
    }

    return Doctor.create(name, email, password);
  }

  async login(email, password, userType) {
    let user;
    if (userType === "paciente") {
      user = await Patient.findByEmail(email);
    } else if (userType === "doctor") {
      user = await Doctor.findByEmail(email);
    } else {
      throw new ApiError(400, "Tipo de usuario no válido.");
    }

    if (!user) {
      throw new ApiError(401, "Credenciales inválidas.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new ApiError(401, "Credenciales inválidas.");
    }

    const payload = {
      id: user.id,
      type: userType,
    };

    const token = this.fastify.jwt.sign(payload, { expiresIn: "1h" });

    return {
      token,
    };
  }
}
