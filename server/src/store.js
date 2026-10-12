import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { DATA_FILE } from './config.js';
import { buildSeed } from './seed.js';

let db = null;

/** Carga el estado desde disco o genera el seed inicial. */
export function loadDatabase() {
  if (existsSync(DATA_FILE)) {
    db = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
  } else {
    db = buildSeed();
    persist();
  }
  return db;
}

export function getDb() {
  if (!db) loadDatabase();
  return db;
}

/** Guarda el estado en disco (persistencia simple del sandbox). */
export function persist() {
  if (!db) return;
  mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
}

/** Regenera el seed (borra cambios locales). */
export function resetDatabase() {
  db = buildSeed();
  persist();
  return db;
}

/** Fechas "ahora" en ISO (helper compartido). */
export const now = () => new Date().toISOString();
