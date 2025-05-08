import {
  createCheckoutSession,
  handleWebhook,
  paymentSuccess,
  paymentCancel,
} from "../controllers/payment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

async function paymentRoutes(fastify, options) {
  fastify.post(
    "/checkout/:appointmentId",
    { preHandler: authenticate },
    createCheckoutSession
  );
  
  // Configurar correctamente el webhook con rawBody
  fastify.post("/webhook", {
    preHandler: (req, reply, done) => {
      // No es necesario hacer nada adicional aquí, el cuerpo raw se maneja globalmente
      done();
    },
    handler: handleWebhook,
  });

  // Rutas para el éxito y cancelación del pago
  fastify.get("/success", paymentSuccess);
  fastify.get("/cancel", paymentCancel);
}

export default paymentRoutes;
