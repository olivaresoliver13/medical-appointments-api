import ApiError from "../utils/api-error.js";
export const isValidWorkingHour = (hour) => {
  const parts = hour.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return false;
  }

  const timeInMinutes = hours * 60 + minutes;
  return (
    (timeInMinutes >= 7 * 60 && timeInMinutes < 12 * 60) ||
    (timeInMinutes >= 14 * 60 && timeInMinutes < 18 * 60)
  );
};

export const validateRegisterBody = (body) => {
  if (!body.name) {
    throw new ApiError(409, "El nombre es obligatorio.");
  }
  if (!body.email) {
    throw new ApiError(409, "El correo electrónico es obligatorio.");
  }
  if (!body.password) {
    throw new ApiError(409, "La contraseña es obligatoria.");
  }
}

export const validateLoginCredentials = (body) => {
  if (!body.email) {
    throw new ApiError(409, "El correo electrónico es obligatorio.");
  }
  if (!body.password) {
    throw new ApiError(409, "La contraseña es obligatoria.");
  }
  if (!body.userType) {
    throw new ApiError(409, "El rol es obligatorio.");
  }
}
export const validatePatientId = (patientId) => {
  if (!patientId) {
    throw new ApiError(409, "El ID del paciente es obligatorio.");
  }
}
export const validateDoctortId = (doctorId) => {
  if (!doctorId) {
    throw new ApiError(409, "El ID del doctor es obligatorio.");
  }
}

export const validateAppointmentId = (appointmentId) => {
  if (!appointmentId) {
    throw new ApiError(409, "El ID de cita es obligatorio.");
  }
}

export const validateAppointmentTime = (appointmentTime) => {
  if (!appointmentTime) {
    throw new ApiError(409, "Fecha de cita es obligatoria.");
  }
}