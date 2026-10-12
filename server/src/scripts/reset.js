import { resetDatabase } from '../store.js';

const db = resetDatabase();
console.log(
  `[zumabrain] Seed regenerado: ${db.users.length} usuarios, ` +
    `${db.sections.length} secciones, ${db.nodes.length} nodos, ` +
    `${db.classrooms.length} aulas, ${db.codex.length} entradas de códice.`,
);
