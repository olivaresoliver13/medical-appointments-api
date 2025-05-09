const Fastify = require("fastify");
const jwt = require("@fastify/jwt");
const authRoutes = require("../routes/auth.routes");
const knex = require("../config/database.test");

describe("Auth API", () => {
  let fastify;

  // Helper para crear usuarios de prueba únicos
  const createTestUser = (userType = "paciente") => ({
    name: `Test ${userType}`,
    email: `test-${userType}-${Date.now()}@example.com`,
    password: "securePassword123",
  });

  beforeAll(async () => {
    jest.setTimeout(15000); // Aumenta timeout para inicialización

    fastify = Fastify();

    // Configuración JWT
    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET || "test-secret",
    });

    // Registrar rutas
    await fastify.register(authRoutes, { prefix: "/api/auth" });

    // Asegurar tablas estén vacías al inicio
    await knex("patients").del();
    await knex("doctors").del();
  });

  afterEach(async () => {
    // Limpiar datos después de cada test
    await knex("patients").del();
    await knex("doctors").del();
  });

  afterAll(async () => {
    await fastify.close();
    await knex.destroy();
  });

  describe("Registrar paciente y doctor", () => {
    it("registra nuevo paciente correctamente", async () => {
      const testPatient = createTestUser("paciente");
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/register/patient",
        payload: testPatient,
      });

      expect(response.statusCode).toBe(201);
      const data = response.json();

      // Verificar en base de datos
      const [patient] = await knex("patients")
        .where("email", testPatient.email)
        .select("*");

      expect(patient).toBeDefined();
      expect(patient.email).toBe(testPatient.email);
      expect(patient.name).toBe(testPatient.name);
    });

    it("registra nuevo doctor correctamente", async () => {
      const testDoctor = createTestUser("doctor");
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/register/doctor",
        payload: testDoctor,
      });

      expect(response.statusCode).toBe(201);
      const data = response.json();

      // Verificar en base de datos
      const [doctor] = await knex("doctors")
        .where("email", testDoctor.email)
        .select("*");

      expect(doctor).toBeDefined();
      expect(doctor.email).toBe(testDoctor.email);
      expect(doctor.name).toBe(testDoctor.name);
    });
  });

  describe("Iniciar sesión con paciente y doctor", () => {
    it("inicia sesión correctamente como paciente", async () => {
      const testPatient = createTestUser("paciente");

      // Registro primero
      await fastify.inject({
        method: "POST",
        url: "/api/auth/register/patient",
        payload: testPatient,
      });

      // Login después
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: {
          email: testPatient.email,
          password: testPatient.password,
          userType: "paciente",
        },
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();
      expect(data).toHaveProperty("token");
    });

    it("inicia sesión correctamente como doctor", async () => {
      const testDoctor = createTestUser("doctor");

      // Registro primero
      await fastify.inject({
        method: "POST",
        url: "/api/auth/register/doctor",
        payload: testDoctor,
      });

      // Login después
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: {
          email: testDoctor.email,
          password: testDoctor.password,
          userType: "doctor",
        },
      });

      expect(response.statusCode).toBe(200);
      const data = response.json();
      expect(data).toHaveProperty("token");
    });

    it("inicia sesión con un rol no permitido", async () => {
      const testAnalyst = createTestUser("analista");

      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: {
          email: testAnalyst.email,
          password: testAnalyst.password,
          userType: "analista",
        },
      });

      expect(response.statusCode).toBe(400);

      const data = response.json();
      expect(data).toHaveProperty("message", "Tipo de usuario no válido.");
    });
  });
});
