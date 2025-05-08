import { swaggerConfig } from "../config/swagger.js";

export default async function swaggerPlugin(fastify) {
  await fastify.register(import("@fastify/swagger"), swaggerConfig);
  await fastify.register(import("@fastify/swagger-ui"), {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    staticCSP: true,
  });
}
