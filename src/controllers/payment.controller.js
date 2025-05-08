import PaymentService from "../services/payment.service.js";
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
    const sig = request.headers["stripe-signature"];

    if (!sig) {
      throw new Error("No stripe-signature header provided");
    }

    // Make sure you're getting the raw body, not parsed JSON
    const payload = request.rawBody;
    try {
      const event = await paymentService.handlePaymentWebhook(payload, sig);

      // Manejar diferentes tipos de eventos
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          // Procesar pago completado
          break;
        default:
          console.log(`Evento desconocido: ${event.type}`);
      }

      reply.send({ received: true });
    } catch (error) {
      console.error("Error de procesamiento de webhook:", error);
      reply.status(400).send({ error: error.message });
    }
  } catch (error) {
    console.error("Error de webhook:", error.message);
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
