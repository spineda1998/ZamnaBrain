import { randomInt } from 'node:crypto';
import { getDb, persist, now } from '../store.js';
import { publicUser, progressForUser } from '../domain.js';
import { authenticate, currentUser, requireRole } from '../guards.js';

const MAYA_WORDS = ['KUKUL', 'BALAM', 'IXCHEL', 'CHAC', 'ITZAMNA', 'TZOLKIN'];

function generateCode(db) {
  for (let i = 0; i < 50; i++) {
    const word = MAYA_WORDS[randomInt(MAYA_WORDS.length)];
    const code = `${word}-${String(randomInt(1, 99)).padStart(2, '0')}`;
    if (!db.classrooms.some((c) => c.code === code)) return code;
  }
  return `AULA-${randomInt(100, 999)}`;
}

function serializeClassroom(c) {
  return {
    id: c.id,
    code: c.code,
    name: c.name,
    teacherId: c.teacherId,
    sectionIds: c.sectionIds ?? [],
    studentCount: (c.memberIds ?? []).length,
  };
}

export default async function classroomRoutes(fastify) {
  // POST /classrooms — solo profesor
  fastify.post(
    '/classrooms',
    { preHandler: [authenticate, requireRole('teacher')] },
    async (req, reply) => {
      const db = getDb();
      const name = String(req.body?.name ?? '').trim();
      if (!name) {
        return reply.code(400).send({ code: 'BAD_REQUEST', message: 'name es requerido' });
      }
      const classroom = {
        id: `c_${randomInt(1000, 9999)}`,
        code: generateCode(db),
        name,
        teacherId: currentUser(req).id,
        sectionIds: Array.isArray(req.body?.sectionIds) ? req.body.sectionIds : [],
        memberIds: [],
        createdAt: now(),
      };
      db.classrooms.push(classroom);
      persist();
      return reply.code(201).send(serializeClassroom(classroom));
    },
  );

  // GET /classrooms — aulas del profesor o del alumno
  fastify.get('/classrooms', { preHandler: [authenticate] }, async (req) => {
    const db = getDb();
    const user = currentUser(req);
    const list =
      user.role === 'teacher'
        ? db.classrooms.filter((c) => c.teacherId === user.id)
        : db.classrooms.filter((c) => (c.memberIds ?? []).includes(user.id));
    return list.map(serializeClassroom);
  });

  // POST /classrooms/join — el alumno se une con el código
  fastify.post('/classrooms/join', { preHandler: [authenticate] }, async (req, reply) => {
    const db = getDb();
    const user = currentUser(req);
    const code = String(req.body?.code ?? '').trim().toUpperCase();
    const classroom = db.classrooms.find((c) => c.code.toUpperCase() === code);
    if (!classroom) {
      return reply.code(404).send({ code: 'NOT_FOUND', message: 'Código de aula inválido' });
    }
    classroom.memberIds ??= [];
    if (!classroom.memberIds.includes(user.id)) {
      classroom.memberIds.push(user.id);
      persist();
    }
    return serializeClassroom(classroom);
  });

  // GET /classrooms/{id}
  fastify.get('/classrooms/:id', { preHandler: [authenticate] }, async (req, reply) => {
    const classroom = getDb().classrooms.find((c) => c.id === req.params.id);
    if (!classroom) {
      return reply.code(404).send({ code: 'NOT_FOUND', message: 'Aula no encontrada' });
    }
    return serializeClassroom(classroom);
  });

  // GET /classrooms/{id}/students — solo profesor
  fastify.get(
    '/classrooms/:id/students',
    { preHandler: [authenticate, requireRole('teacher')] },
    async (req, reply) => {
      const db = getDb();
      const classroom = db.classrooms.find((c) => c.id === req.params.id);
      if (!classroom) {
        return reply.code(404).send({ code: 'NOT_FOUND', message: 'Aula no encontrada' });
      }
      const students = (classroom.memberIds ?? [])
        .map((id) => db.users.find((u) => u.id === id))
        .filter(Boolean)
        .map((u) => {
          const rows = progressForUser(db, u.id);
          return {
            user: publicUser(u),
            jadeCoins: rows.reduce((s, r) => s + (r.jadeCoins ?? 0), 0),
            totalStars: rows.reduce((s, r) => s + (r.stars ?? 0), 0),
            nodesCompleted: rows.length,
          };
        })
        .sort((a, b) => b.jadeCoins - a.jadeCoins);
      return students;
    },
  );
}
