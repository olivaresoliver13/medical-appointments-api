import Stripe from "stripe";
import Appointment from "../models/appointment.model.js";
import ApiError from "../utils/api-error.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  async createCheckoutSession(appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(404, "Cita no encontrada.");
    }
    if (appointment.payment_status === "pagada") {
      throw new ApiError(400, "La cita ya ha sido pagada.");
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd", // Cambiar a la moneda deseada
            unit_amount: 5000, // Ejemplo de precio: $50.00
            product_data: {
              name: `Cita Médica - ID: ${appointment.id}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.API_BASE_URL}/api/v1/payments/success?appointmentId=${appointment.id}`, // Define tus URLs
      cancel_url: `${process.env.API_BASE_URL}/api/v1/payments/cancel?appointmentId=${appointment.id}`,
      metadata: { appointmentId: appointment.id },
    });

    return { sessionId: session.id };
  }

  async handlePaymentWebhook(payload, signature) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET no esta configurada");
    }

    let event;

    try {
      // Ensure payload is a string if using rawBody
      const payloadString = payload.toString("utf8");
      event = stripe.webhooks.constructEvent(
        payloadString,
        signature,
        webhookSecret
      );
    } catch (err) {
      throw new Error(
        `Error en la verificación de la firma del webhook: ${err.message}`
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const appointmentId = session.metadata?.appointmentId;

      if (!appointmentId) {
        console.warn("No hay ID de cita en los metadatos de la sesión");
        return;
      }

      try {
        await Appointment.updatePaymentStatus(appointmentId, "pagada");
        console.log(`Pago exitoso para la cita: ${appointmentId}`);
      } catch (dbError) {
        throw new Error("No se pudo actualizar el estado de la cita");
      }
    }

    return event;
  }
}

export default PaymentService;
