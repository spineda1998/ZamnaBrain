import { persist } from '../store.js';
import { publicUser } from '../domain.js';
import { authenticate, currentUser } from '../guards.js';

export default async function userRoutes(fastify) {
  // GET /users/me
  fastify.get('/users/me', { preHandler: [authenticate] }, async (req, reply) => {
    const user = currentUser(req);
    if (!user) return reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Sin sesión' });
    return publicUser(user);
  });

  // PATCH /users/me
  fastify.patch('/users/me', { preHandler: [authenticate] }, async (req, reply) => {
    const user = currentUser(req);
    if (!user) return reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Sin sesión' });
    if (typeof req.body?.nickname === 'string' && req.body.nickname.trim()) {
      user.nickname = req.body.nickname.trim();
      persist();
    }
    return publicUser(user);
  });
}
