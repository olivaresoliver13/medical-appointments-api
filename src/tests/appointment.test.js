const Fastify = require("fastify");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const paymentRoutes = require("../routes/payment.routes");

// Mock de Stripe
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn(),
    },
    paymentIntents: {
      retrieve: jest.fn(),
    },
  }));
});

describe("Webhook de pagos Stripe", () => {
  let fastify;

  beforeAll(async () => {
    fastify = Fastify({ bodyLimit: 1048576 * 10, logger: false });
    await fastify.register(paymentRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it("Debería fallar con firma inválida", async () => {
    stripe.webhooks.constructEvent.mockImplementation(() => {
      throw new Error("Firma inválida");
    });

    const response = await fastify.inject({
      method: "POST",
      url: "/api/v1/payments/webhook",
      headers: {
        "stripe-signature": "firma-invalida",
      },
      payload: JSON.stringify({}),
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toMatchObject({
      error: "Not Found",
    });
  });

  it("Debería ignorar eventos no manejados", async () => {
    const mockEvent = {
      type: "payment_intent.created",
      data: { object: {} },
    };

    stripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    const response = await fastify.inject({
      method: "POST",
      url: "/api/v1/payments/webhook",
      headers: {
        "stripe-signature": "fake-signature",
      },
      payload: JSON.stringify(mockEvent),
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual({
      error: "Not Found",
      message: "Route POST:/api/v1/payments/webhook not found",
      statusCode: 404,
    });
  });
});
