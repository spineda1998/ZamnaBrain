import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { randomBytes, scryptSync, timingSafeEqual, randomInt } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'zumabrain-sandbox-dev-secret';
const DEMO_PASSWORD = 'zuma1234';

// ── Passwords & Crypto ─────────────────────────────────────────
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, stored: string): boolean {
  if (typeof stored !== 'string' || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const expected = Buffer.from(hash, 'hex');
  const candidate = scryptSync(password, salt, 64);
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

// ── In-Memory Database / Seed ──────────────────────────────────
interface User {
  id: string;
  email: string;
  nickname: string;
  role: 'student' | 'teacher';
  passwordHash: string;
  createdAt: string;
}

interface Section {
  id: string;
  name: string;
  order: number;
  description: string;
}

interface GameNode {
  id: string;
  sectionId: string;
  order: number;
  title: string;
  subtitle?: string;
  rewardLabel?: string;
  requiredForUnlock?: string;
  category?: string;
  isBoss?: boolean;
}

interface Classroom {
  id: string;
  code: string;
  name: string;
  teacherId: string;
  sectionIds: string[];
  memberIds: string[];
  createdAt: string;
}

interface ProgressRecord {
  userId: string;
  nodeId: string;
  stars: number;
  jadeCoins: number;
  completedAt: string;
}

interface CodexEntry {
  id: string;
  title: string;
  topic: string;
  summary: string;
  content: string;
  unlockNodeId: string | null;
}

interface DB {
  users: User[];
  sections: Section[];
  nodes: GameNode[];
  classrooms: Classroom[];
  progress: ProgressRecord[];
  codex: CodexEntry[];
}

function initSeed(): DB {
  const now = new Date().toISOString();
  const pw = hashPassword(DEMO_PASSWORD);

  const users: User[] = [
    { id: 'u_balam', email: 'balam@zuma.dev', nickname: 'BALAM', role: 'student', passwordHash: pw, createdAt: now },
    { id: 'u_ixchel', email: 'ixchel@zuma.dev', nickname: 'IXCHEL', role: 'student', passwordHash: pw, createdAt: now },
    { id: 'u_chac', email: 'chac@zuma.dev', nickname: 'CHAC', role: 'student', passwordHash: pw, createdAt: now },
    { id: 'u_itzamna', email: 'itzamna@zuma.dev', nickname: 'ITZAMNA', role: 'student', passwordHash: pw, createdAt: now },
    { id: 'u_kukulkan', email: 'profe@zuma.dev', nickname: 'KUKULKAN', role: 'teacher', passwordHash: pw, createdAt: now },
  ];

  const sections: Section[] = [
    {
      id: 's_alba',
      name: 'Sendero del Alba',
      order: 1,
      description: 'Los primeros pasos del cazador de templos mesoamericano.',
    },
    {
      id: 's_kukulkan',
      name: 'Cámara de Kukulkán',
      order: 2,
      description: 'Pruebas avanzadas del Gran Ajau en la pirámide central.',
    },
  ];

  const nodes: GameNode[] = [
    {
      id: 'n1',
      sectionId: 's_alba',
      order: 1,
      title: 'UMBRAL DEL JAGUAR',
      subtitle: 'Sumas y restas en base-20 con puntos (1) y barras (5).',
      rewardLabel: 'Sello Solar del Umbral',
      category: 'aritmetica',
    },
    {
      id: 'n2',
      sectionId: 's_alba',
      order: 2,
      title: 'CUENTAS DE JADE',
      subtitle: 'Simetría de pirámides, ángulos solares y patrones rituales.',
      rewardLabel: 'Cuentas de Jade Ceremoniales',
      category: 'geometria',
    },
    {
      id: 'n3',
      sectionId: 's_alba',
      order: 3,
      title: 'RUEDA TZOLKIN',
      subtitle: 'Conteo de kin en la rueda sagrada de 260 días y 13 numerales.',
      rewardLabel: 'Sello Solar de la Rueda',
      category: 'calendario',
    },
    {
      id: 'n4',
      sectionId: 's_kukulkan',
      order: 1,
      title: 'CÁLCULO FRACCIONARIO',
      subtitle: 'Fracciones y proporciones en arquitectura maya monumental.',
      rewardLabel: 'Reliquia de Jade Ancestral',
      requiredForUnlock: 'Superar la Rueda Tzolkin',
      category: 'aritmetica',
    },
    {
      id: 'n5',
      sectionId: 's_kukulkan',
      order: 2,
      title: 'TEMPLO DE LOS GLIFOS',
      subtitle: 'Desafío de agilidad y descifrado vigesimal contra el Guardián.',
      rewardLabel: 'Glifo Dorado de la Sabiduría Vigesimal',
      requiredForUnlock: 'Vencer al Guardián de Glifos',
      category: 'glifos',
      isBoss: true,
    },
    {
      id: 'n6',
      sectionId: 's_kukulkan',
      order: 3,
      title: 'CÁMARA DE KUKULKÁN',
      subtitle: 'El Gran Ajau Regional te espera para el ritual final.',
      rewardLabel: 'Título de Gran Ajau Supremo',
      requiredForUnlock: 'Descifrar el Templo de los Glifos',
      category: 'historia',
      isBoss: true,
    },
  ];

  const classrooms: Classroom[] = [
    {
      id: 'c_kukul',
      code: 'KUKUL-04',
      name: '4° A — Matemáticas Mayas',
      teacherId: 'u_kukulkan',
      sectionIds: ['s_alba', 's_kukulkan'],
      memberIds: ['u_balam', 'u_ixchel', 'u_chac', 'u_itzamna'],
      createdAt: now,
    },
  ];

  const progress: ProgressRecord[] = [
    { userId: 'u_balam', nodeId: 'n1', stars: 3, jadeCoins: 120, completedAt: now },
    { userId: 'u_balam', nodeId: 'n2', stars: 2, jadeCoins: 100, completedAt: now },
    { userId: 'u_ixchel', nodeId: 'n1', stars: 3, jadeCoins: 130, completedAt: now },
    { userId: 'u_ixchel', nodeId: 'n2', stars: 3, jadeCoins: 125, completedAt: now },
    { userId: 'u_ixchel', nodeId: 'n3', stars: 3, jadeCoins: 160, completedAt: now },
    { userId: 'u_chac', nodeId: 'n1', stars: 2, jadeCoins: 90, completedAt: now },
  ];

  const codex: CodexEntry[] = [
    {
      id: 'gy_aritmetica',
      title: 'Aritmética Vigesimal Maya',
      topic: 'aritmetica',
      summary: 'El sistema posicional vigesimal: puntos (1), barras (5) y conchas (0).',
      content: 'Los mayas crearon uno de los sistemas matemáticos más precisos de la historia. Usaban base 20 con valor posicional que aumentaba de abajo hacia arriba en potencias de 20 (1, 20, 400, 8000...). Tres símbolos bastaban para cualquier cantidad: un punto (1), una barra horizontal (5) y una concha estilizada o semilla para el cero (0).',
      unlockNodeId: 'n1',
    },
    {
      id: 'gy_geometria',
      title: 'Geometría Sagrada y Pirámides',
      topic: 'geometria',
      summary: 'Simetría ceremonial, orientaciones astronómicas y escalinatas.',
      content: 'Las pirámides mayas como El Castillo en Chichén Itzá están alineadas con los equinoccios solares. Cada detalle arquitectónico codifica cuentas calendáricas: 4 escaleras de 91 escalones más la plataforma superior suman 365 días del año Haab. En los equinoccios, las sombras crean el descenso serpenteante de Kukulkán.',
      unlockNodeId: 'n2',
    },
    {
      id: 'gy_tzolkin',
      title: 'La Rueda Ritual Tzolkin',
      topic: 'calendario',
      summary: 'Ciclo ceremonial de 260 días combinando 13 números y 20 días sagrados.',
      content: 'El Tzolkin es la rueda del tiempo ritual. Combina 13 números con 20 nombres de kin (como Imix, Ik, Akbal, Kan, Chicchan, Cimi, Manik, Lamat...). La combinación tarda exactamente 260 días (13 × 20) en repetirse, guiando ceremonias, siembras y destinos cósmicos.',
      unlockNodeId: 'n3',
    },
    {
      id: 'gy_glifos',
      title: 'Descifrado de Glifos Epigráficos',
      topic: 'glifos',
      summary: 'Escritura jeroglífica maya: logogramas y bloques silábicos.',
      content: 'La escritura maya es un sistema mixto fonético-silábico y logográfico. Se leía en pares de columnas de izquierda a derecha y de arriba a abajo. Cada cartucho o bloque glífico incluye un signo principal rodeado de afijos (prefijos, superfijos, sufijos, subfijos).',
      unlockNodeId: 'n5',
    },
    {
      id: 'gy_historia',
      title: 'El Sendero Sagrado y el Ajau',
      topic: 'historia',
      summary: 'El viaje ritual de iniciación del sabio y astrónomo maya.',
      content: 'El Sendero Sagrado representa el viaje espiritual y mental del estudiante para alcanzar el rango de Ahau o sacerdote astrónomo. A través de la agilidad mental, el dominio de los números y la armonía cósmica, se superan los senderos oscuros de Xibalba para ascender hacia la sabiduría luminosa.',
      unlockNodeId: null,
    },
  ];

  return { users, sections, nodes, classrooms, progress, codex };
}

const db: DB = initSeed();

// ── Domain Helpers ─────────────────────────────────────────────
function orderedNodes(): GameNode[] {
  const sectionOrder = new Map(db.sections.map((s) => [s.id, s.order]));
  return [...db.nodes].sort(
    (a, b) =>
      (sectionOrder.get(a.sectionId) ?? 0) - (sectionOrder.get(b.sectionId) ?? 0) ||
      a.order - b.order,
  );
}

function progressForUser(userId: string): ProgressRecord[] {
  return db.progress.filter((p) => p.userId === userId);
}

function progressMapForUser(userId: string): Map<string, ProgressRecord> {
  const map = new Map<string, ProgressRecord>();
  for (const p of progressForUser(userId)) map.set(p.nodeId, p);
  return map;
}

function activeNodeId(userId: string): string | null {
  const pm = progressMapForUser(userId);
  const next = orderedNodes().find((n) => !pm.has(n.id));
  return next?.id ?? null;
}

function serializeNode(userId: string, node: GameNode, activeId = activeNodeId(userId)) {
  const pm = progressMapForUser(userId);
  const done = pm.get(node.id);
  let status: 'completed' | 'active' | 'locked';
  if (done) status = 'completed';
  else if (node.id === activeId) status = 'active';
  else status = 'locked';

  return {
    id: node.id,
    sectionId: node.sectionId,
    order: node.order,
    title: node.title,
    subtitle: node.subtitle,
    rewardLabel: node.rewardLabel,
    requiredForUnlock: node.requiredForUnlock,
    category: node.category,
    isBoss: node.isBoss ?? false,
    status,
    stars: done?.stars ?? 0,
    jadeCoins: done?.jadeCoins ?? 0,
  };
}

function progressSummaryFor(userId: string) {
  const rows = progressForUser(userId);
  const jadeCoins = rows.reduce((s, r) => s + (r.jadeCoins ?? 0), 0);
  const totalStars = rows.reduce((s, r) => s + (r.stars ?? 0), 0);
  const lastPlayedAt = rows.map((r) => r.completedAt).sort().at(-1);

  return {
    jadeCoins,
    totalStars,
    nodeProgress: rows.map((r) => ({
      nodeId: r.nodeId,
      stars: r.stars,
      jadeCoins: r.jadeCoins,
      completedAt: r.completedAt,
    })),
    lastPlayedAt,
  };
}

function publicUser(u: User) {
  return { id: u.id, email: u.email, nickname: u.nickname, role: u.role };
}

function issueTokens(user: User) {
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role, type: 'access' },
    JWT_SECRET,
    { expiresIn: '1h' },
  );
  const refreshToken = jwt.sign(
    { sub: user.id, role: user.role, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
  return { accessToken, refreshToken, user: publicUser(user) };
}

// ── Express Setup ──────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// Auth Middleware
interface AuthRequest extends Request {
  user?: User;
}

function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Token requerido' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; type: string };
    const user = db.users.find((u) => u.id === payload.sub);
    if (!user) {
      return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Usuario no encontrado' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Token inválido o expirado' });
  }
}

// ── Endpoints ──────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: 'sandbox', app: 'ZumaBrain' });
});

app.get('/openapi.yaml', (_req, res) => {
  const openapiPath = path.join(__dirname, 'docs', 'openapi.yaml');
  if (fs.existsSync(openapiPath)) {
    res.type('text/yaml').sendFile(openapiPath);
  } else {
    res.status(404).send('openapi.yaml no encontrado');
  }
});

// Auth Routes
app.post('/v1/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const normalized = String(email || '').trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalized);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Correo o contraseña incorrectos' });
  }
  return res.json(issueTokens(user));
});

app.post('/v1/auth/register', (req, res) => {
  const { email, password, nickname, role } = req.body || {};
  if (!email || !password || !nickname) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: 'Faltan campos requeridos' });
  }
  const normalized = String(email).trim().toLowerCase();
  if (db.users.some((u) => u.email.toLowerCase() === normalized)) {
    return res.status(409).json({ code: 'EMAIL_TAKEN', message: 'Ese correo ya está registrado' });
  }
  const userRole = role === 'teacher' ? 'teacher' : 'student';
  const newUser: User = {
    id: `u_${randomBytes(5).toString('hex')}`,
    email: normalized,
    nickname: String(nickname).trim().toUpperCase(),
    role: userRole,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  return res.status(201).json(issueTokens(newUser));
});

app.post('/v1/auth/refresh', (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: 'refreshToken requerido' });
  }
  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as { sub: string; type: string };
    if (payload.type !== 'refresh') {
      return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Token no es de refresco' });
    }
    const user = db.users.find((u) => u.id === payload.sub);
    if (!user) {
      return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Usuario no existe' });
    }
    return res.json(issueTokens(user));
  } catch {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: 'refreshToken inválido' });
  }
});

// Users
app.get('/v1/users/me', authenticate as any, (req: AuthRequest, res) => {
  res.json(publicUser(req.user!));
});

app.patch('/v1/users/me', authenticate as any, (req: AuthRequest, res) => {
  if (typeof req.body?.nickname === 'string' && req.body.nickname.trim()) {
    req.user!.nickname = req.body.nickname.trim().toUpperCase();
  }
  res.json(publicUser(req.user!));
});

// Sections & Sendero
app.get('/v1/sections', authenticate as any, (_req, res) => {
  const sections = [...db.sections].sort((a, b) => a.order - b.order);
  res.json(sections);
});

app.get('/v1/sections/:sectionId/nodes', authenticate as any, (req: AuthRequest, res) => {
  const section = db.sections.find((s) => s.id === req.params.sectionId);
  if (!section) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'Sección no encontrada' });
  }
  const nodes = orderedNodes()
    .filter((n) => n.sectionId === section.id)
    .map((n) => serializeNode(req.user!.id, n));
  res.json(nodes);
});

// Progress
app.get('/v1/me/progress', authenticate as any, (req: AuthRequest, res) => {
  res.json(progressSummaryFor(req.user!.id));
});

app.put('/v1/me/progress/:nodeId', authenticate as any, (req: AuthRequest, res) => {
  const node = db.nodes.find((n) => n.id === req.params.nodeId);
  if (!node) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'Nodo no encontrado' });
  }

  const userId = req.user!.id;
  const pm = progressMapForUser(userId);
  const ordered = orderedNodes();
  const activeId = ordered.find((n) => !pm.has(n.id))?.id ?? null;
  const isLocked = node.id !== activeId && !pm.has(node.id);
  if (isLocked) {
    return res.status(409).json({ code: 'NODE_LOCKED', message: 'El nodo aún está bloqueado' });
  }

  const stars = Math.min(3, Math.max(1, Number(req.body?.stars || 1)));
  const jadeCoins = Math.max(10, Number(req.body?.jadeCoins || 50));

  const existing = pm.get(node.id);
  if (existing) {
    existing.stars = Math.max(existing.stars, stars);
    existing.jadeCoins = Math.max(existing.jadeCoins, jadeCoins);
    existing.completedAt = new Date().toISOString();
  } else {
    db.progress.push({
      userId,
      nodeId: node.id,
      stars,
      jadeCoins,
      completedAt: new Date().toISOString(),
    });
  }

  res.json(progressSummaryFor(userId));
});

// Leaderboard
app.get('/v1/leaderboard', authenticate as any, (req: AuthRequest, res) => {
  const { classroomId } = req.query as { classroomId?: string };
  let targetUserIds: string[] | null = null;
  if (classroomId) {
    const classroom = db.classrooms.find((c) => c.id === classroomId);
    if (!classroom) {
      return res.status(404).json({ code: 'NOT_FOUND', message: 'Aula no encontrada' });
    }
    targetUserIds = classroom.memberIds ?? [];
  }

  const students = db.users.filter(
    (u) => u.role === 'student' && (!targetUserIds || targetUserIds.includes(u.id)),
  );

  const leaderboard = students
    .map((u) => {
      const rows = progressForUser(u.id);
      return {
        userId: u.id,
        nickname: u.nickname,
        jadeCoins: rows.reduce((s, r) => s + (r.jadeCoins ?? 0), 0),
        totalStars: rows.reduce((s, r) => s + (r.stars ?? 0), 0),
        nodesCount: rows.length,
      };
    })
    .sort((a, b) => b.jadeCoins - a.jadeCoins || b.totalStars - a.totalStars)
    .map((r, i) => ({ rank: i + 1, ...r }));

  res.json(leaderboard);
});

// Classrooms
app.get('/v1/classrooms', authenticate as any, (req: AuthRequest, res) => {
  const user = req.user!;
  const list =
    user.role === 'teacher'
      ? db.classrooms.filter((c) => c.teacherId === user.id)
      : db.classrooms.filter((c) => (c.memberIds ?? []).includes(user.id));

  res.json(
    list.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      teacherId: c.teacherId,
      sectionIds: c.sectionIds,
      studentCount: c.memberIds.length,
    })),
  );
});

app.post('/v1/classrooms', authenticate as any, (req: AuthRequest, res) => {
  if (req.user!.role !== 'teacher') {
    return res.status(403).json({ code: 'FORBIDDEN', message: 'Solo profesores pueden crear aulas' });
  }
  const name = String(req.body?.name ?? '').trim();
  if (!name) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: 'Nombre es requerido' });
  }
  const code = `KUKUL-${String(randomInt(10, 99))}`;
  const classroom: Classroom = {
    id: `c_${randomInt(1000, 9999)}`,
    code,
    name,
    teacherId: req.user!.id,
    sectionIds: ['s_alba', 's_kukulkan'],
    memberIds: [],
    createdAt: new Date().toISOString(),
  };
  db.classrooms.push(classroom);
  res.status(201).json({
    id: classroom.id,
    code: classroom.code,
    name: classroom.name,
    teacherId: classroom.teacherId,
    sectionIds: classroom.sectionIds,
    studentCount: 0,
  });
});

app.post('/v1/classrooms/join', authenticate as any, (req: AuthRequest, res) => {
  const code = String(req.body?.code ?? '').trim().toUpperCase();
  const classroom = db.classrooms.find((c) => c.code.toUpperCase() === code);
  if (!classroom) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'Código de aula no existe' });
  }
  if (!classroom.memberIds.includes(req.user!.id)) {
    classroom.memberIds.push(req.user!.id);
  }
  res.json({
    id: classroom.id,
    code: classroom.code,
    name: classroom.name,
    teacherId: classroom.teacherId,
    sectionIds: classroom.sectionIds,
    studentCount: classroom.memberIds.length,
  });
});

app.get('/v1/classrooms/:id/students', authenticate as any, (req: AuthRequest, res) => {
  if (req.user!.role !== 'teacher') {
    return res.status(403).json({ code: 'FORBIDDEN', message: 'Solo profesores' });
  }
  const classroom = db.classrooms.find((c) => c.id === req.params.id);
  if (!classroom) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'Aula no encontrada' });
  }
  const students = classroom.memberIds
    .map((id) => db.users.find((u) => u.id === id))
    .filter((u): u is User => Boolean(u))
    .map((u) => {
      const rows = progressForUser(u.id);
      return {
        user: publicUser(u),
        jadeCoins: rows.reduce((s, r) => s + (r.jadeCoins ?? 0), 0),
        totalStars: rows.reduce((s, r) => s + (r.stars ?? 0), 0),
        nodesCompleted: rows.length,
      };
    })
    .sort((a, b) => b.jadeCoins - a.jadeCoins);

  res.json(students);
});

// Codex
app.get('/v1/codex/entries', authenticate as any, (req: AuthRequest, res) => {
  const { topic, query } = req.query as { topic?: string; query?: string };
  const q = query ? String(query).toLowerCase() : null;
  const pm = progressMapForUser(req.user!.id);

  const results = db.codex
    .filter((e) => (!topic ? true : e.topic === topic))
    .filter((e) => (!q ? true : e.title.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q)))
    .map((e) => {
      const unlocked = req.user!.role === 'teacher' || !e.unlockNodeId || pm.has(e.unlockNodeId);
      return {
        id: e.id,
        title: e.title,
        topic: e.topic,
        summary: e.summary,
        unlocked,
      };
    });

  res.json(results);
});

app.get('/v1/codex/entries/:entryId', authenticate as any, (req: AuthRequest, res) => {
  const entry = db.codex.find((e) => e.id === req.params.entryId);
  if (!entry) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'Entrada no encontrada' });
  }
  const pm = progressMapForUser(req.user!.id);
  const unlocked = req.user!.role === 'teacher' || !entry.unlockNodeId || pm.has(entry.unlockNodeId);
  res.json({
    id: entry.id,
    title: entry.title,
    topic: entry.topic,
    summary: entry.summary,
    content: entry.content,
    unlocked,
  });
});

// ── Dev Server / Production Serving ────────────────────────────
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[ZumaBrain] Server running on http://${HOST}:${PORT}`);
    console.log(`[ZumaBrain] Seed loaded with ${db.users.length} users, ${db.nodes.length} nodes, ${db.codex.length} codex entries`);
  });
}

startServer().catch((err) => {
  console.error('[ZumaBrain] Failed to start server:', err);
  process.exit(1);
});
