import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Puerto del API local. Nota: el `servers` del openapi.yaml documenta 8080,
 * pero en el sandbox usamos 8090 para no chocar con otros dev-servers
 * (p.ej. Vite) que suelen ocupar 8080. Se puede sobreescribir con PORT.
 */
export const PORT = Number(process.env.PORT ?? 8090);

/** Host: 0.0.0.0 permite que emuladores/dispositivos de la red local se conecten. */
export const HOST = process.env.HOST ?? '0.0.0.0';

/** Prefijo de todos los endpoints (coincide con el `servers` del openapi.yaml). */
export const API_PREFIX = '/v1';

/** Secreto de firma JWT (solo sandbox; en producción viene del entorno). */
export const JWT_SECRET = process.env.JWT_SECRET ?? 'zumabrain-sandbox-dev-secret';

/** Vigencias de tokens. */
export const ACCESS_TTL = process.env.ACCESS_TTL ?? '30m';
export const REFRESH_TTL = process.env.REFRESH_TTL ?? '7d';

/** Persistencia simple en JSON (no requiere instalar base de datos). */
export const DATA_FILE =
  process.env.DATA_FILE ?? path.join(here, '..', '.data', 'db.json');

/** Ruta del contrato OpenAPI servido en /openapi.yaml. */
export const OPENAPI_FILE = path.join(here, '..', '..', 'docs', 'openapi.yaml');

/** Contraseña de las cuentas demo del seed. */
export const DEMO_PASSWORD = 'zuma1234';
