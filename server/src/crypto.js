import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

/**
 * Hash de contraseña con scrypt (sin dependencias externas).
 * Formato almacenado: "<saltHex>:<hashHex>".
 */
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password, stored) {
  if (typeof stored !== 'string' || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const expected = Buffer.from(hash, 'hex');
  const candidate = scryptSync(password, salt, 64);
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}
