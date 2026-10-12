import { getDb } from '../store.js';
import { progressMapForUser } from '../domain.js';
import { authenticate, currentUser } from '../guards.js';

function isUnlocked(entry, db, user) {
  if (!entry.unlockNodeId) return true;
  if (user.role !== 'student') return true;
  return progressMapForUser(db, user.id).has(entry.unlockNodeId);
}

export default async function codexRoutes(fastify) {
  // GET /codex/entries?query=&topic=
  fastify.get('/codex/entries', { preHandler: [authenticate] }, async (req) => {
    const db = getDb();
    const user = currentUser(req);
    const { query, topic } = req.query ?? {};
    const q = query ? String(query).toLowerCase() : null;
    return db.codex
      .filter((e) => (topic ? e.topic === topic : true))
      .filter((e) =>
        q
          ? e.title.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q)
          : true,
      )
      .map((e) => ({
        id: e.id,
        title: e.title,
        topic: e.topic,
        summary: e.summary,
        unlocked: isUnlocked(e, db, user),
      }));
  });

  // GET /codex/entries/{entryId}
  fastify.get('/codex/entries/:entryId', { preHandler: [authenticate] }, async (req, reply) => {
    const db = getDb();
    const user = currentUser(req);
    const entry = db.codex.find((e) => e.id === req.params.entryId);
    if (!entry) {
      return reply.code(404).send({ code: 'NOT_FOUND', message: 'Entrada no encontrada' });
    }
    return {
      id: entry.id,
      title: entry.title,
      topic: entry.topic,
      summary: entry.summary,
      content: entry.content,
      unlocked: isUnlocked(entry, db, user),
    };
  });
}
