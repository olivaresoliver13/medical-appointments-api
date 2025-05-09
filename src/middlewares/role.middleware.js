// Este middleware ya está implementado dentro de `auth.middleware.js`
// con la función `authorize`. No es necesario un archivo separado
// a menos que tengas una lógica de autorización mucho más compleja.

import { authenticate } from "./auth.middleware.js";

export const authorize = (role) => async (request, reply) => {
  try {
    await authenticate(request, reply); // Asegurarse de que el usuario esté autenticado

    if (request.user && request.user.type !== role) {
      reply
        .status(403)
        .send({ message: "No tienes permisos para acceder a este recurso." });
    }
  } catch (err) {
    // La autenticación fallida ya es manejada por `authenticate`
    // No es necesario repetir el error aquí.
  }
};