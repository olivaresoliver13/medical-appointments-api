export const swaggerConfig = {
  openapi: {
    info: {
      title: "API de Gestión Médica",
      description: `
      Permite:
      - Registro y autenticación de pacientes y doctores
      - Programación, modificación y cancelación de citas
      - Procesamiento de pagos seguros
      - Gestión de agendas médicas
      - Historial de consultas
      
      Roles:
      - Pacientes: pueden solicitar citas y ver su historial
      - Médicos: pueden gestionar su agenda y confirmar citas
    `,
      version: "1.0.0",
    },
    servers: [
      { url: "http://localhost:3000/api/v1", description: "Development" },
    ],
    tags: [
      {
        name: "Auth",
        description: "Autenticación, registro y gestión de sesiones",
      },
      {
        name: "Patients",
        description: "Operaciones exclusivas para pacientes",
      },
      {
        name: "Doctors",
        description: "Operaciones exclusivas para médicos",
      },
      {
        name: "Payments",
        description: "Procesamiento seguro de pagos con Stripe",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Patient: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Juan Pérez" },
            email: {
              type: "string",
              format: "email",
              example: "juan@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "micontraseña123",
            },
          },
        },
        Doctor: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Juan Pérez" },
            email: {
              type: "string",
              format: "email",
              example: "juan@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "micontraseña123",
            },
          },
        },
        Appointment: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            patient_id: { type: "integer", example: 1 },
            doctor_id: { type: "integer", example: 2 },
            appointment_time: {
              type: "string",
              format: "date-time",
              example: "2023-12-25T10:00:00Z",
            },
            status: {
              type: "string",
              enum: ["pendiente", "confirmada", "cancelada", "rechazada"],
              example: "pendiente",
            },
            payment_status: {
              type: "string",
              enum: ["nopagada", "pagada"],
              example: "nopagada",
            },
          },
        },
      },
    },
    paths: {
      "/api/v1/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Iniciar sesión en el sistema",
          description:
            "Autentica a un usuario (paciente o doctor) y devuelve un token JWT",
          operationId: "login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "usuario@example.com",
                    },
                    password: {
                      type: "string",
                      format: "password",
                      example: "micontraseña123",
                    },
                    userType: {
                      type: "string",
                      enum: ["paciente", "doctor"],
                      example: "paciente",
                      description: "Tipo de usuario que está iniciando sesión",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Autenticación exitosa",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: {
                        type: "string",
                        description: "Token JWT para autenticación",
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Credenciales inválidas",
              content: {
                "application/json": {
                  example: {
                    statusCode: 401,
                    error: "Unauthorized",
                    message: "Credenciales inválidas",
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/auth/register/patient": {
        post: {
          tags: ["Auth"],
          summary: "Registrar nuevo paciente",
          operationId: "registerPatient",
          description: "Crea un nuevo paciente",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    name: { type: "string", example: "Juan Pérez" },
                    email: {
                      type: "string",
                      format: "email",
                      example: "juan@example.com",
                    },
                    password: {
                      type: "string",
                      format: "password",
                      example: "micontraseña123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Doctor creado exitoso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        example: 1,
                      },
                      name: {
                        type: "string",
                        example: "Jose",
                      },
                      email: {
                        type: "string",
                        example: "test@example.com",
                      },
                      password: {
                        type: "string",
                        example:
                          "$2b$10$DUfoI0XxSaECY7DnuHGH8.z5Cf9QcMTkMX3mpFTkE.NnsW0lFhpfW",
                      },
                      created_at: {
                        type: "string",
                        example: "2025-05-08T16:32:05.000Z",
                      },
                      updated_at: {
                        type: "string",
                        example: "2025-05-08T16:32:05.000Z",
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "Nombre obligatorio",
              content: {
                "application/json": {
                  example: {
                    message: "El nombre es obligatorio..",
                  },
                },
              },
            },
            404: {
              description: "Correo obligatorio",
              content: {
                "application/json": {
                  example: {
                    message: "El correo electrónico es obligatorio.",
                  },
                },
              },
            },
            404: {
              description: "Contraseña obligatoria",
              content: {
                "application/json": {
                  example: {
                    message: "La contraseña es obligatoria..",
                  },
                },
              },
            },
            409: {
              description: "Correo electrónico ya existe",
              content: {
                "application/json": {
                  example: {
                    statusCode: 409,
                    error: "Conflict",
                    message: "El correo electrónico ya está registrado",
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/auth/register/doctor": {
        post: {
          tags: ["Auth"],
          summary: "Registrar nuevo doctor",
          operationId: "registerDoctor",
          description: "Crea un nuevo paciente",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    name: { type: "string", example: "Juan Pérez" },
                    email: {
                      type: "string",
                      format: "email",
                      example: "juan@example.com",
                    },
                    password: {
                      type: "string",
                      format: "password",
                      example: "micontraseña123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Doctor creado exitoso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        example: 1,
                      },
                      name: {
                        type: "string",
                        example: "Jose",
                      },
                      email: {
                        type: "string",
                        example: "test@example.com",
                      },
                      password: {
                        type: "string",
                        example:
                          "$2b$10$DUfoI0XxSaECY7DnuHGH8.z5Cf9QcMTkMX3mpFTkE.NnsW0lFhpfW",
                      },
                      created_at: {
                        type: "string",
                        example: "2025-05-08T16:32:05.000Z",
                      },
                      updated_at: {
                        type: "string",
                        example: "2025-05-08T16:32:05.000Z",
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "Nombre obligatorio",
              content: {
                "application/json": {
                  example: {
                    message: "El nombre es obligatorio..",
                  },
                },
              },
            },
            404: {
              description: "Correo obligatorio",
              content: {
                "application/json": {
                  example: {
                    message: "El correo electrónico es obligatorio.",
                  },
                },
              },
            },
            404: {
              description: "Contraseña obligatoria",
              content: {
                "application/json": {
                  example: {
                    message: "La contraseña es obligatoria..",
                  },
                },
              },
            },
            409: {
              description: "Correo electrónico ya existe",
              content: {
                "application/json": {
                  example: {
                    statusCode: 409,
                    error: "Conflict",
                    message: "El correo electrónico ya está registrado",
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/patients/appointments": {
        post: {
          tags: ["Patients"],
          summary: "Solicitar cita médica",
          operationId: "requestAppointment",
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["doctorId", "appointmentTime"],
                  properties: {
                    doctorId: {
                      type: "integer",
                      example: "1",
                    },
                    appointmentTime: {
                      type: "string",
                      example: "2025-05-07 10:00:00",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Cita creada exitosa",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        example: 1,
                      },
                      patient_id: {
                        type: "integer",
                        example: 1,
                      },
                      doctor_id: {
                        type: "integer",
                        example: 1,
                      },
                      appointment_time: {
                        type: "date",
                        example: "2025-05-08T10:00:00.000Z",
                      },
                      status: {
                        type: "string",
                        example: "pendiente",
                      },
                      payment_status: {
                        type: "string",
                        example: "nopagada",
                      },
                      created_at: {
                        example: "2025-05-08T10:00:00.000Z",
                      },
                      updated_at: {
                        example: "2025-05-08T10:00:00.000Z",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Solictar cita con una fecha pasada",
              content: {
                "application/json": {
                  example: {
                    message: "No se puede pedir cita en una fecha pasada.",
                  },
                },
              },
            },
            404: {
              description: "ID del doctor es obligatorio",
              content: {
                "application/json": {
                  example: {
                    message: "ID del doctor es obligatorio.",
                  },
                },
              },
            },
            404: {
              description: "Fecha de cita obligatoria",
              content: {
                "application/json": {
                  example: {
                    message: "Fecha de cita es obligatoria.",
                  },
                },
              },
            },
            401: {
              description: "Token no válido",
              content: {
                "application/json": {
                  example: {
                    message: "Autenticación requerida",
                  },
                },
              },
            },
            401: {
              description: "Rol invalido",
              content: {
                "application/json": {
                  example: {
                    message: "No tienes permisos para acceder a este recurso.",
                  },
                },
              },
            },
            404: {
              description: "ID Doctor es existe",
              content: {
                "application/json": {
                  example: {
                    message: "Doctor no existe.",
                  },
                },
              },
            },
            409: {
              description: "Horario de cita ya ocupado",
              content: {
                "application/json": {
                  example: {
                    message: "El horario ya está ocupado.",
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ["Patients"],
          summary: "Solicitar cita médica",
          operationId: "getMyAppointments",
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "Listar cita",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        example: 1,
                      },
                      patient_id: {
                        type: "integer",
                        example: 1,
                      },
                      doctor_id: {
                        type: "integer",
                        example: 1,
                      },
                      appointment_time: {
                        type: "date",
                        example: "2025-05-08T10:00:00.000Z",
                      },
                      status: {
                        type: "string",
                        example: "pendiente",
                      },
                      payment_status: {
                        type: "string",
                        example: "nopagada",
                      },
                      created_at: {
                        example: "2025-05-08T10:00:00.000Z",
                      },
                      updated_at: {
                        example: "2025-05-08T10:00:00.000Z",
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Token no válido",
              content: {
                "application/json": {
                  example: {
                    message: "Autenticación requerida",
                  },
                },
              },
            },
            401: {
              description: "Rol invalido",
              content: {
                "application/json": {
                  example: {
                    message: "No tienes permisos para acceder a este recurso.",
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/doctors/appointments/today": {
        get: {
          tags: ["Doctors"],
          summary: "Listar cita médica del dia",
          operationId: "getMyAppointmentsToday",
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "Listado cita médica del dia",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        example: 1,
                      },
                      patient_id: {
                        type: "integer",
                        example: 1,
                      },
                      doctor_id: {
                        type: "integer",
                        example: 1,
                      },
                      appointment_time: {
                        type: "date",
                        example: "2025-05-08T10:00:00.000Z",
                      },
                      status: {
                        type: "string",
                        example: "pendiente",
                      },
                      payment_status: {
                        type: "string",
                        example: "nopagada",
                      },
                      created_at: {
                        example: "2025-05-08T10:00:00.000Z",
                      },
                      updated_at: {
                        example: "2025-05-08T10:00:00.000Z",
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Token no válido",
              content: {
                "application/json": {
                  example: {
                    message: "Autenticación requerida",
                  },
                },
              },
            },
            401: {
              description: "Rol invalido",
              content: {
                "application/json": {
                  example: {
                    message: "No tienes permisos para acceder a este recurso.",
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/doctors/appointments/:appointmentId/confirm": {
        patch: {
          tags: ["Doctors"],
          summary: "Confirmar cita",
          operationId: "confirmAppointment",
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "Cita confirmada",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        example: 1,
                      },
                      patient_id: {
                        type: "integer",
                        example: 1,
                      },
                      doctor_id: {
                        type: "integer",
                        example: 1,
                      },
                      appointment_time: {
                        type: "date",
                        example: "2025-05-08T10:00:00.000Z",
                      },
                      status: {
                        type: "string",
                        example: "pendiente",
                      },
                      payment_status: {
                        type: "string",
                        example: "nopagada",
                      },
                      created_at: {
                        example: "2025-05-08T10:00:00.000Z",
                      },
                      updated_at: {
                        example: "2025-05-08T10:00:00.000Z",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Cita confirmada",
              content: {
                "application/json": {
                  example: {
                    message: "La cita ya está confirmada.",
                  },
                },
              },
            },
            400: {
              description: "Cita no pagada",
              content: {
                "application/json": {
                  example: {
                    message: "No se puede confirmar una cita no pagada.",
                  },
                },
              },
            },
            400: {
              description:
                "No permitir confirmar citas canceladas o rechazadas",
              content: {
                "application/json": {
                  example: {
                    message: "No se puede confirmar una cita.",
                  },
                },
              },
            },
            401: {
              description: "Token no válido",
              content: {
                "application/json": {
                  example: {
                    message: "Autenticación requerida",
                  },
                },
              },
            },
            401: {
              description: "Rol invalido",
              content: {
                "application/json": {
                  example: {
                    message: "No tienes permisos para acceder a este recurso.",
                  },
                },
              },
            },
            404: {
              description: "Cita no existente",
              content: {
                "application/json": {
                  example: {
                    message: "Cita no encontrada.",
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/doctors/appointments/:appointmentId/reject": {
        patch: {
          tags: ["Doctors"],
          summary: "Rechazar cita",
          operationId: "rejectAppointment",
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "Cita confirmada",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        example: 1,
                      },
                      patient_id: {
                        type: "integer",
                        example: 1,
                      },
                      doctor_id: {
                        type: "integer",
                        example: 1,
                      },
                      appointment_time: {
                        type: "date",
                        example: "2025-05-08T10:00:00.000Z",
                      },
                      status: {
                        type: "string",
                        example: "pendiente",
                      },
                      payment_status: {
                        type: "string",
                        example: "nopagada",
                      },
                      created_at: {
                        example: "2025-05-08T10:00:00.000Z",
                      },
                      updated_at: {
                        example: "2025-05-08T10:00:00.000Z",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description:
                "No permitir rechazar una cita que ya fue rechazada o cancelada",
              content: {
                "application/json": {
                  example: {
                    message: "La cita ya está rechazada",
                  },
                },
              },
            },
            400: {
              description: "Cita ya confirmada",
              content: {
                "application/json": {
                  example: {
                    message: "No se puede rechazar una cita ya confirmada.",
                  },
                },
              },
            },
            401: {
              description: "Token no válido",
              content: {
                "application/json": {
                  example: {
                    message: "Autenticación requerida",
                  },
                },
              },
            },
            401: {
              description: "Rol invalido",
              content: {
                "application/json": {
                  example: {
                    message: "No tienes permisos para acceder a este recurso.",
                  },
                },
              },
            },
            404: {
              description: "Cita no existente",
              content: {
                "application/json": {
                  example: {
                    message: "Cita no encontrada.",
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/payments/checkout/:appointmentId": {
        post: {
          tags: ["Payments"],
          summary: "Crear sesión de pago (Stripe)",
          operationId: "createCheckoutSession",
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "Sesión de pago creada",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      sessionId: {
                        type: "string",
                        example:
                          "cs_test_a1AWgXLAIbRBaT9IyRsQWTcsL1EKE61lmCGdlXLH0upp88qJQcVcYLh7s4",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description:
                "No permitir rechazar una cita que ya fue rechazada o cancelada",
              content: {
                "application/json": {
                  example: {
                    message: "La cita ya está rechazada",
                  },
                },
              },
            },
            400: {
              description: "Cita ya paga",
              content: {
                "application/json": {
                  example: {
                    message: "La cita ya ha sido pagada.",
                  },
                },
              },
            },
            401: {
              description: "Token no válido",
              content: {
                "application/json": {
                  example: {
                    message: "Autenticación requerida",
                  },
                },
              },
            },
            401: {
              description: "Rol invalido",
              content: {
                "application/json": {
                  example: {
                    message: "No tienes permisos para acceder a este recurso.",
                  },
                },
              },
            },
            404: {
              description: "Cita no existente",
              content: {
                "application/json": {
                  example: {
                    message: "Cita no encontrada.",
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/payments/webhook": {
        post: {
          tags: ["Payments"],
          summary: "Webhook para eventos de pago",
          operationId: "handleWebhook",
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    type: {
                      type: "string",
                      example: "checkout.session.completed",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Sesión de pago creada",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      sessionId: {
                        type: "string",
                        example:
                          "cs_test_a1AWgXLAIbRBaT9IyRsQWTcsL1EKE61lmCGdlXLH0upp88qJQcVcYLh7s4",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Sin stripe-signature en el header",
              content: {
                "application/json": {
                  example: {
                    message:
                      "No se proporciona encabezado el valor de stripe-signature.",
                  },
                },
              },
            },
            400: {
              description:
                "No permitir rechazar una cita que ya fue rechazada o cancelada",
              content: {
                "application/json": {
                  example: {
                    message: "La cita ya está rechazada",
                  },
                },
              },
            },
            400: {
              description: "Cita ya paga",
              content: {
                "application/json": {
                  example: {
                    message: "La cita ya ha sido pagada.",
                  },
                },
              },
            },
            401: {
              description: "Token no válido",
              content: {
                "application/json": {
                  example: {
                    message: "Autenticación requerida",
                  },
                },
              },
            },
            401: {
              description: "Rol invalido",
              content: {
                "application/json": {
                  example: {
                    message: "No tienes permisos para acceder a este recurso.",
                  },
                },
              },
            },
            404: {
              description: "Cita no existente",
              content: {
                "application/json": {
                  example: {
                    message: "Cita no encontrada.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
