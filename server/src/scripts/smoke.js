/**
 * Smoke test del API sandbox (Node >= 18, usa fetch nativo).
 * Uso: node src/scripts/smoke.js   (o BASE=http://localhost:8080 npm run smoke)
 */
const BASE = process.env.BASE ?? 'http://127.0.0.1:8090';
const API = `${BASE}/v1`;

let passed = 0;
let failed = 0;

function ok(label, extra = '') {
  passed++;
  console.log(`  \u2713 ${label}${extra ? ` — ${extra}` : ''}`);
}
function bad(label, detail) {
  failed++;
  console.error(`  \u2717 ${label}${detail ? ` — ${detail}` : ''}`);
}

async function req(method, path, { token, body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* sin cuerpo */
  }
  return { status: res.status, data };
}

async function waitForServer(timeoutMs = 20000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const r = await fetch(`${BASE}/health`);
      if (r.ok) return true;
    } catch {
      /* aún no arriba */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`El servidor no respondió en ${BASE} tras ${timeoutMs}ms`);
}

async function main() {
  console.log(`\nSmoke test ZumaBrain API @ ${BASE}\n`);
  await waitForServer();
  ok('GET /health');

  // Auth
  const login = await req('POST', '/auth/login', {
    body: { email: 'balam@zuma.dev', password: 'zuma1234' },
  });
  login.status === 200 && login.data?.accessToken
    ? ok('POST /auth/login (alumno)', `rol=${login.data.user.role}`)
    : bad('POST /auth/login', `status=${login.status}`);
  const token = login.data?.accessToken;

  const badLogin = await req('POST', '/auth/login', {
    body: { email: 'balam@zuma.dev', password: 'incorrecta' },
  });
  badLogin.status === 401 ? ok('login con contraseña mala → 401') : bad('login malo', badLogin.status);

  const noAuth = await req('GET', '/users/me');
  noAuth.status === 401 ? ok('sin token → 401') : bad('sin token', noAuth.status);

  const me = await req('GET', '/users/me', { token });
  me.status === 200 && me.data.nickname === 'BALAM'
    ? ok('GET /users/me', me.data.nickname)
    : bad('GET /users/me', `status=${me.status}`);

  const patched = await req('PATCH', '/users/me', { token, body: { nickname: 'BALAM' } });
  patched.status === 200 ? ok('PATCH /users/me') : bad('PATCH /users/me', patched.status);

  // Sendero
  const sections = await req('GET', '/sections', { token });
  Array.isArray(sections.data) && sections.data.length >= 2
    ? ok('GET /sections', `${sections.data.length} secciones`)
    : bad('GET /sections', JSON.stringify(sections.data));

  const nodes = await req('GET', '/sections/s_alba/nodes', { token });
  const statuses = (nodes.data ?? []).map((n) => `${n.title}:${n.status}`).join(', ');
  Array.isArray(nodes.data) && nodes.data.some((n) => n.status === 'active')
    ? ok('GET /sections/s_alba/nodes', statuses)
    : bad('GET /sections/s_alba/nodes', statuses);

  // Progress
  const progress = await req('GET', '/me/progress', { token });
  progress.status === 200 ? ok('GET /me/progress', `jade=${progress.data.jadeCoins} stars=${progress.data.totalStars}`) : bad('GET /me/progress', progress.status);

  // Nodo bloqueado → 409
  const lockedNode = (nodes.data ?? []).find((n) => n.status === 'locked');
  if (lockedNode) {
    const locked = await req('PUT', `/me/progress/${lockedNode.id}`, {
      token,
      body: { stars: 3, jadeCoins: 100 },
    });
    locked.status === 409 ? ok('PUT nodo bloqueado → 409') : bad('nodo bloqueado', `status=${locked.status}`);
  }

  // Completar nodo activo
  const activeNode = (nodes.data ?? []).find((n) => n.status === 'active');
  if (activeNode) {
    const done = await req('PUT', `/me/progress/${activeNode.id}`, {
      token,
      body: { stars: 2, jadeCoins: 80 },
    });
    done.status === 200 ? ok(`PUT /me/progress/${activeNode.id}`, `totalStars=${done.data.totalStars}`) : bad('PUT progreso activo', `status=${done.status} ${JSON.stringify(done.data)}`);
  }

  // Leaderboard
  const lb = await req('GET', '/leaderboard', { token });
  Array.isArray(lb.data) && lb.data[0]?.rank === 1
    ? ok('GET /leaderboard', `#1 ${lb.data[0].nickname} (${lb.data[0].jadeCoins} jade)`)
    : bad('GET /leaderboard', JSON.stringify(lb.data));

  const lbClass = await req('GET', '/leaderboard?classroomId=c_kukul', { token });
  Array.isArray(lbClass.data) && lbClass.data.length === 4
    ? ok('GET /leaderboard?classroomId', `${lbClass.data.length} alumnos`)
    : bad('GET /leaderboard?classroomId', JSON.stringify(lbClass.data));

  // Códice
  const codex = await req('GET', '/codex/entries', { token });
  Array.isArray(codex.data) && codex.data.length >= 4
    ? ok('GET /codex/entries', `${codex.data.length} entradas`)
    : bad('GET /codex/entries', JSON.stringify(codex.data));

  const codexTopic = await req('GET', '/codex/entries?topic=calendario', { token });
  codexTopic.data?.every((e) => e.topic === 'calendario')
    ? ok('GET /codex/entries?topic=calendario', `${codexTopic.data.length} entrada(s)`)
    : bad('codex filtro topic', JSON.stringify(codexTopic.data));

  const codexDetail = await req('GET', '/codex/entries/gy_glifos', { token });
  codexDetail.data?.content ? ok('GET /codex/entries/{id} (con content)') : bad('codex detalle', JSON.stringify(codexDetail.data));

  // Aulas (profesor)
  const teacherLogin = await req('POST', '/auth/login', {
    body: { email: 'profe@zuma.dev', password: 'zuma1234' },
  });
  const teacherToken = teacherLogin.data?.accessToken;
  teacherLogin.status === 200 ? ok('POST /auth/login (profesor)') : bad('login profesor', teacherLogin.status);

  const students = await req('GET', '/classrooms/c_kukul/students', { token: teacherToken });
  Array.isArray(students.data) && students.data.length === 4
    ? ok('GET /classrooms/c_kukul/students', `${students.data.length} alumnos`)
    : bad('classroom students', JSON.stringify(students.data));

  const studentForbidden = await req('GET', '/classrooms/c_kukul/students', { token });
  studentForbidden.status === 403 ? ok('alumno en endpoint de profesor → 403') : bad('403 profesor', studentForbidden.status);

  // Registro
  const email = `test_${Date.now()}@zuma.dev`;
  const reg = await req('POST', '/auth/register', {
    body: { email, password: 'zuma1234', nickname: 'TEST', role: 'student' },
  });
  reg.status === 201 ? ok('POST /auth/register') : bad('register', `status=${reg.status} ${JSON.stringify(reg.data)}`);

  const dup = await req('POST', '/auth/register', {
    body: { email, password: 'zuma1234', nickname: 'TEST', role: 'student' },
  });
  dup.status === 409 ? ok('registro duplicado → 409') : bad('duplicado', dup.status);

  console.log(`\nResultado: ${passed} ok, ${failed} fallidos\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
