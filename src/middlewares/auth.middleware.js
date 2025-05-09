export const authenticate = async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ message: "Autenticación requerida." });
  }
};

export const authorize = (role) => async (request, reply) => {
  try {
    await request.jwtVerify();
    if (request.user.type !== role) {
      reply
        .status(403)
        .send({ message: "No tienes permisos para acceder a este recurso." });
    }
  } catch (err) {
    reply.status(401).send({ message: "Autenticación requerida." });
  }
};