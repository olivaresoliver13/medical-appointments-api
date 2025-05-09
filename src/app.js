import Fastify from "fastify";
import dotenv from "dotenv";
import db from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import swagger from "./plugins/swagger.js";
import jwt from "@fastify/jwt";
import { jwtSecret } from "./config/jwt.js";

dotenv.config();

const fastify = Fastify({ bodyLimit: 1048576 * 10, logger: true });
const API_VERSION = process.env.API_VERSION || "v1";
const API_BASE_PATH = `/api/${API_VERSION}`;

fastify.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  (req, body, done) => {
    req.rawBody = body;
    try {
      done(null, JSON.parse(body));
    } catch (err) {
      err.statusCode = 400;
      done(err, undefined);
    }
  }
);

async function startServer() {
  try {
    await db.raw("SELECT 1");
    console.log("Base de datos conectada correctamente!");

    await fastify.register(jwt, {
      secret: jwtSecret,
    });

    if (!fastify.hasRequestDecorator("user")) {
      fastify.decorateRequest("user", null);
      fastify.addHook("onRequest", async (request, reply) => {
        try {
          await request.jwtVerify();
          request.user = request.user;
        } catch (err) {
          request.user = null;
        }
      });
    }

    await fastify.register(swagger);

    await fastify.register(authRoutes, { prefix: API_BASE_PATH + "/auth" });

    await fastify.register(patientRoutes, {
      prefix: API_BASE_PATH + "/patients",
    });
    await fastify.register(doctorRoutes, {
      prefix: API_BASE_PATH + "/doctors",
    });
    await fastify.register(paymentRoutes, {
      prefix: API_BASE_PATH + "/payments",
    });
    await fastify.register(patientRoutes, {
      prefix: API_BASE_PATH + "/appointments",
    });

    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`Servidor escuchando ${fastify.server.address().port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();
