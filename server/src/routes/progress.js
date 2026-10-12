import { getDb, persist, now } from '../store.js';
import {
  progressSummaryFor,
  progressMapForUser,
  orderedNodes,
} from '../domain.js';
import { authenticate, currentUser } from '../guards.js';

export default async function progressRoutes(fastify) {
  // GET /me/progress
  fastify.get('/me/progress', { preHandler: [authenticate] }, async (req) => {
    return progressSummaryFor(getDb(), currentUser(req).id);
  });

  // PUT /me/progress/{nodeId}
  fastify.put('/me/progress/:nodeId', { preHandler: [authenticate] }, async (req, reply) => {
    const db = getDb();
    const user = currentUser(req);
    const node = db.nodes.find((n) => n.id === req.params.nodeId);
    if (!node) {
      return reply.code(404).send({ code: 'NOT_FOUND', message: 'Nodo no encontrado' });
    }

    // ¿El nodo está bloqueado para este usuario?
    const pm = progressMapForUser(db, user.id);
    const ordered = orderedNodes(db);
    const activeId = ordered.find((n) => !pm.has(n.id))?.id ?? null;
    const isLocked = node.id !== activeId && !pm.has(node.id);
    if (isLocked) {
      return reply
        .code(409)
        .send({ code: 'NODE_LOCKED', message: 'El nodo aún está bloqueado' });
    }

    const stars = clampInt(req.body?.stars, 0, 3);
    const jadeCoins = Math.max(0, int(req.body?.jadeCoins, 0));

    const existing = pm.get(node.id);
    if (existing && stars <= existing.stars && jadeCoins <= existing.jadeCoins) {
      return reply.code(409).send({
        code: 'ALREADY_BETTER',
        message: 'Ya hay un resultado mejor o igual registrado',
      });
    }

    if (existing) {
      existing.stars = Math.max(existing.stars, stars);
      existing.jadeCoins = Math.max(existing.jadeCoins, jadeCoins);
      existing.completedAt = now();
    } else {
      db.progress.push({
        userId: user.id,
        nodeId: node.id,
        stars,
        jadeCoins,
        completedAt: now(),
      });
    }
    persist();
    return progressSummaryFor(db, user.id);
  });
}

function int(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function clampInt(value, min, max) {
  return Math.min(max, Math.max(min, int(value, min)));
}
