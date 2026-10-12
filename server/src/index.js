import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { readFile } from 'node:fs/promises';

import { HOST, PORT, API_PREFIX, JWT_SECRET, OPENAPI_FILE } from './config.js';
import { loadDatabase } from './store.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import classroomRoutes from './routes/classrooms.js';
import senderoRoutes from './routes/sendero.js';
import progressRoutes from './routes/progress.js';
import leaderboardRoutes from './routes/leaderboard.js';
import codexRoutes from './routes/codex.js';

export async function buildServer() {
  const fastify = Fastify({ logger: true });

  await fastify.register(cors, { origin: true });
  await fastify.register(jwt, { secret: JWT_SECRET });

  // ── Info raíz ───────────────────────────────────────────────
  fastify.get('/', async () => ({
    name: 'ZumaBrain API (sandbox)',
    version: '0.1.0',
    api: `${API_PREFIX}`,
    docs: '/docs',
    openapi: '/openapi.yaml',
    health: '/health',
  }));

  fastify.get('/health', async () => ({ status: 'ok', env: 'sandbox' }));

  // ── Contrato OpenAPI + Swagger UI ───────────────────────────
  fastify.get('/openapi.yaml', async (_req, reply) => {
    try {
      const yaml = await readFile(OPENAPI_FILE, 'utf8');
      return reply.type('text/yaml; charset=utf-8').send(yaml);
    } catch {
      return reply.code(404).send({ code: 'NOT_FOUND', message: 'openapi.yaml no encontrado' });
    }
  });

  fastify.get('/docs', async (_req, reply) => {
    reply.type('text/html; charset=utf-8').send(SWAGGER_HTML);
  });

  // ── Rutas de negocio (bajo /v1) ─────────────────────────────
  const opts = { prefix: API_PREFIX };
  await fastify.register(authRoutes, opts);
  await fastify.register(userRoutes, opts);
  await fastify.register(classroomRoutes, opts);
  await fastify.register(senderoRoutes, opts);
  await fastify.register(progressRoutes, opts);
  await fastify.register(leaderboardRoutes, opts);
  await fastify.register(codexRoutes, opts);

  // ── 404 uniforme (schema Error) ─────────────────────────────
  fastify.setNotFoundHandler((req, reply) => {
    reply.code(404).send({ code: 'NOT_FOUND', message: `Ruta no encontrada: ${req.url}` });
  });

  return fastify;
}

const SWAGGER_HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>ZumaBrain API — Sandbox</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>body{margin:0;background:#1a1a1a}</style>
  </head>
  <body>
    <div id="swagger"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/openapi.yaml',
          dom_id: '#swagger',
        });
      };
    </script>
  </body>
</html>`;

async function start() {
  const db = loadDatabase();
  const fastify = await buildServer();
  try {
    await fastify.listen({ host: HOST, port: PORT });
    fastify.log.info(
      `Seed cargado: ${db.users.length} usuarios, ${db.nodes.length} nodos, ` +
        `${db.classrooms.length} aulas.`,
    );
    fastify.log.info(`Swagger UI: http://localhost:${PORT}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Solo arranca si se ejecuta directamente (permite importarlo en tests).
const isMain = process.argv[1] && process.argv[1].endsWith('index.js');
if (isMain) start();
