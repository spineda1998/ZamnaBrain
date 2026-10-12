import { getDb } from '../store.js';
import { orderedNodes, serializeNode } from '../domain.js';
import { authenticate, currentUser } from '../guards.js';

export default async function senderoRoutes(fastify) {
  // GET /sections
  fastify.get('/sections', { preHandler: [authenticate] }, async () => {
    const db = getDb();
    return [...db.sections].sort((a, b) => a.order - b.order).map((s) => ({
      id: s.id,
      name: s.name,
      order: s.order,
      description: s.description,
    }));
  });

  // GET /sections/{sectionId}/nodes
  fastify.get('/sections/:sectionId/nodes', { preHandler: [authenticate] }, async (req, reply) => {
    const db = getDb();
    const section = db.sections.find((s) => s.id === req.params.sectionId);
    if (!section) {
      return reply.code(404).send({ code: 'NOT_FOUND', message: 'Sección no encontrada' });
    }
    const user = currentUser(req);
    return orderedNodes(db)
      .filter((n) => n.sectionId === section.id)
      .map((n) => serializeNode(db, user.id, n));
  });
}
