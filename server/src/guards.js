import { getDb } from './store.js';

/** preHandler: exige un Bearer token JWT válido. */
export async function authenticate(req, reply) {
  try {
    await req.jwtVerify();
  } catch {
    reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Token ausente o inválido' });
  }
}

/** Devuelve el usuario de la BD correspondiente al token, o null. */
export function currentUser(req) {
  const sub = req.user?.sub;
  if (!sub) return null;
  return getDb().users.find((u) => u.id === sub) ?? null;
}

/** preHandler factory: exige un rol concreto (p.ej. teacher). */
export function requireRole(role) {
  return async function (req, reply) {
    const user = currentUser(req);
    if (!user) {
      return reply
        .code(401)
        .send({ code: 'UNAUTHORIZED', message: 'Token ausente o inválido' });
    }
    if (user.role !== role) {
      return reply
        .code(403)
        .send({ code: 'FORBIDDEN', message: 'El rol no permite la operación' });
    }
  };
}
