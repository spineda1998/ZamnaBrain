import { getDb } from '../store.js';
import { leaderboardFor } from '../domain.js';
import { authenticate } from '../guards.js';

export default async function leaderboardRoutes(fastify) {
  // GET /leaderboard?classroomId=
  fastify.get('/leaderboard', { preHandler: [authenticate] }, async (req, reply) => {
    const db = getDb();
    const { classroomId } = req.query ?? {};
    if (classroomId) {
      const classroom = db.classrooms.find((c) => c.id === classroomId);
      if (!classroom) {
        return reply.code(404).send({ code: 'NOT_FOUND', message: 'Aula no encontrada' });
      }
      return leaderboardFor(db, classroom.memberIds ?? []);
    }
    return leaderboardFor(db);
  });
}
