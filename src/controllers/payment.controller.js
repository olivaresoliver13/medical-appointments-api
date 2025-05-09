import PaymentService from "../services/payment.service.js";
import crypto from "crypto";
import { validateAppointmentId } from "../utils/validation.js";

const paymentService = new PaymentService();

export const createCheckoutSession = async (request, reply) => {
  try {
    const { appointmentId } = request.params;
    validateAppointmentId(appointmentId);
    const { sessionId } = await paymentService.createCheckoutSession(
      appointmentId
    );
    reply.send({ sessionId });
  } catch (error) {
    reply.status(error.statusCode || 500).send({ message: error.message });
  }
};

export const handleWebhook = async (request, reply) => {
  try {
    let sig = request.headers["stripe-signature"];

    if (!sig) {
      throw new Error("No se proporciona encabezado stripe-signature.");
    }

    // Si el signature es solo el secreto (whsec_...), construimos el encabezado manualmente
    if (sig.startsWith("whsec_")) {
      if (process.env.NODE_ENV !== "development") {
        throw new Error(
          "Formato de firma inválido - solo permitido en desarrollo"
        );
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const payloadString = request.rawBody.toString("utf8");
      const signedPayload = `${timestamp}.${payloadString}`;

      const signature = crypto
        .createHmac("sha256", sig)
        .update(signedPayload)
        .digest("hex");

      sig = `t=${timestamp},v1=${signature}`;
    }

    const payload = request.rawBody;
    try {
      const event = await paymentService.handlePaymentWebhook(payload, sig);

      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          // Aquí tu lógica para manejar el pago completado
          console.log(`Pago completado para sesión: ${session.id}`);
          break;
        default:
          console.log(`Evento no manejado: ${event.type}`);
      }

      reply.send({ received: true });
    } catch (error) {
      console.error("Error en procesamiento de webhook:", {
        error: error.message,
        stack: error.stack,
      });
      reply.status(400).send({ error: "Error procesando webhook" });
    }
  } catch (error) {
    console.error("Error general en webhook:", {
      error: error.message,
      headers: request.headers,
      rawBodySample: request.rawBody?.toString().substring(0, 100),
    });
    reply.status(400).send({ error: error.message });
  }
};

export const paymentSuccess = async (request, reply) => {
  const { appointmentId } = request.query;
  validateAppointmentId(appointmentId);
  // Aquí podrías redirigir al paciente a una página de éxito o enviar una respuesta JSON
  reply.send({ message: `Pago exitoso para la cita ${appointmentId}` });
};

export const paymentCancel = async (request, reply) => {
  const { appointmentId } = request.query;
  validateAppointmentId(appointmentId);
  // Aquí podrías redirigir al paciente a una página de cancelación o enviar una respuesta JSON
  reply.send({ message: `Pago cancelado para la cita ${appointmentId}` });
};