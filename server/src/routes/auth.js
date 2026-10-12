import { randomBytes } from 'node:crypto';
import { getDb, persist, now } from '../store.js';
import { publicUser } from '../domain.js';
import { hashPassword, verifyPassword } from '../crypto.js';
import { ACCESS_TTL, REFRESH_TTL } from '../config.js';

const ROLES = new Set(['student', 'teacher']);

function issueTokens(fastify, user) {
  const accessToken = fastify.jwt.sign(
    { sub: user.id, role: user.role, type: 'access' },
    { expiresIn: ACCESS_TTL },
  );
  const refreshToken = fastify.jwt.sign(
    { sub: user.id, role: user.role, type: 'refresh' },
    { expiresIn: REFRESH_TTL },
  );
  return { accessToken, refreshToken, user: publicUser(user) };
}

export default async function authRoutes(fastify) {
  // POST /auth/register
  fastify.post('/auth/register', { schema: registerSchema }, async (req, reply) => {
    const db = getDb();
    const { email, password, nickname, role } = req.body;
    const normalized = String(email).trim().toLowerCase();

    if (db.users.some((u) => u.email.toLowerCase() === normalized)) {
      return reply
        .code(409)
        .send({ code: 'EMAIL_TAKEN', message: 'Ese correo ya está registrado' });
    }

    const user = {
      id: `u_${randomBytes(5).toString('hex')}`,
      email: normalized,
      nickname: String(nickname).trim(),
      role,
      passwordHash: hashPassword(password),
      createdAt: now(),
    };
    db.users.push(user);
    persist();
    return reply.code(201).send(issueTokens(fastify, user));
  });

  // POST /auth/login
  fastify.post('/auth/login', { schema: loginSchema }, async (req, reply) => {
    const db = getDb();
    const { email, password } = req.body;
    const normalized = String(email).trim().toLowerCase();
    const user = db.users.find((u) => u.email.toLowerCase() === normalized);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return reply
        .code(401)
        .send({ code: 'INVALID_CREDENTIALS', message: 'Correo o contraseña incorrectos' });
    }
    return issueTokens(fastify, user);
  });

  // POST /auth/refresh
  fastify.post('/auth/refresh', async (req, reply) => {
    const token = req.body?.refreshToken;
    if (!token) {
      return reply
        .code(401)
        .send({ code: 'UNAUTHORIZED', message: 'refreshToken requerido' });
    }
    let payload;
    try {
      payload = fastify.jwt.verify(token);
    } catch {
      return reply
        .code(401)
        .send({ code: 'UNAUTHORIZED', message: 'refreshToken inválido o expirado' });
    }
    if (payload.type !== 'refresh') {
      return reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Token no es de refresco' });
    }
    const user = getDb().users.find((u) => u.id === payload.sub);
    if (!user) {
      return reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Usuario no existe' });
    }
    const accessToken = fastify.jwt.sign(
      { sub: user.id, role: user.role, type: 'access' },
      { expiresIn: ACCESS_TTL },
    );
    return { accessToken, refreshToken: token, user: publicUser(user) };
  });
}

const registerSchema = {
  body: {
    type: 'object',
    required: ['email', 'password', 'nickname', 'role'],
    properties: {
      email: { type: 'string' },
      password: { type: 'string', minLength: 8 },
      nickname: { type: 'string', minLength: 1 },
      role: { type: 'string', enum: [...ROLES] },
    },
  },
};

const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
};
