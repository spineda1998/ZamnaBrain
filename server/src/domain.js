import { getDb } from './store.js';

/** Nodos ordenados por sección (order) y luego por orden dentro de la sección. */
export function orderedNodes(db = getDb()) {
  const sectionOrder = new Map(db.sections.map((s) => [s.id, s.order]));
  return [...db.nodes].sort(
    (a, b) =>
      (sectionOrder.get(a.sectionId) ?? 0) - (sectionOrder.get(b.sectionId) ?? 0) ||
      a.order - b.order,
  );
}

export function progressForUser(db, userId) {
  return db.progress.filter((p) => p.userId === userId);
}

export function progressMapForUser(db, userId) {
  const map = new Map();
  for (const p of progressForUser(db, userId)) map.set(p.nodeId, p);
  return map;
}

/** Primer nodo sin completar = nodo ACTIVO del jugador. */
function activeNodeId(db, userId) {
  const pm = progressMapForUser(db, userId);
  const next = orderedNodes(db).find((n) => !pm.has(n.id));
  return next?.id ?? null;
}

/**
 * Serializa un nodo con su estado calculado para el usuario.
 * Reglas (GDD §5.4): completed → active (siguiente sin completar) → locked.
 */
export function serializeNode(db, userId, node, activeId = activeNodeId(db, userId)) {
  const pm = progressMapForUser(db, userId);
  const done = pm.get(node.id);
  let status;
  if (done) status = 'completed';
  else if (node.id === activeId) status = 'active';
  else status = 'locked';

  const out = {
    id: node.id,
    sectionId: node.sectionId,
    order: node.order,
    title: node.title,
    status,
  };
  if (node.subtitle) out.subtitle = node.subtitle;
  if (node.rewardLabel) out.rewardLabel = node.rewardLabel;
  if (done) out.stars = done.stars;
  if (node.requiredForUnlock) out.requiredForUnlock = node.requiredForUnlock;
  if (node.isBoss) out.isBoss = true;
  if (node.category) out.category = node.category;
  return out;
}

/** Resumen de progreso del alumno (schema ProgressSummary). */
export function progressSummaryFor(db, userId) {
  const rows = progressForUser(db, userId);
  const jadeCoins = rows.reduce((s, r) => s + (r.jadeCoins ?? 0), 0);
  const totalStars = rows.reduce((s, r) => s + (r.stars ?? 0), 0);
  const lastPlayedAt = rows
    .map((r) => r.completedAt)
    .sort()
    .at(-1);
  const summary = {
    jadeCoins,
    totalStars,
    nodeProgress: rows.map((r) => ({
      nodeId: r.nodeId,
      stars: r.stars,
      jadeCoins: r.jadeCoins,
      completedAt: r.completedAt,
    })),
  };
  if (lastPlayedAt) summary.lastPlayedAt = lastPlayedAt;
  return summary;
}

/** Ranking global o filtrado por aula (schema LeaderboardEntry). */
export function leaderboardFor(db, userIds = null) {
  const students = db.users.filter(
    (u) => u.role === 'student' && (!userIds || userIds.includes(u.id)),
  );
  const rows = students
    .map((u) => {
      const rows = progressForUser(db, u.id);
      return {
        userId: u.id,
        nickname: u.nickname,
        jadeCoins: rows.reduce((s, r) => s + (r.jadeCoins ?? 0), 0),
        totalStars: rows.reduce((s, r) => s + (r.stars ?? 0), 0),
      };
    })
    .sort((a, b) => b.jadeCoins - a.jadeCoins || b.totalStars - a.totalStars)
    .map((r, i) => ({ rank: i + 1, ...r }));
  return rows;
}

export function publicUser(user) {
  return { id: user.id, email: user.email, nickname: user.nickname, role: user.role };
}
