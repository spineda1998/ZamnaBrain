import { hashPassword } from './crypto.js';
import { DEMO_PASSWORD } from './config.js';

/**
 * Datos demo del sandbox. Se inspiran en el GDD §5 (Sendero Sagrado, 6 nodos,
 * categorías educativas) y en el contrato docs/openapi.yaml.
 */
export function buildSeed() {
  const now = new Date().toISOString();

  const pw = hashPassword(DEMO_PASSWORD);

  const users = [
    mkUser('u_balam', 'balam@zuma.dev', 'BALAM', 'student', pw, now),
    mkUser('u_ixchel', 'ixchel@zuma.dev', 'IXCHEL', 'student', pw, now),
    mkUser('u_chac', 'chac@zuma.dev', 'CHAC', 'student', pw, now),
    mkUser('u_itzamna', 'itzamna@zuma.dev', 'ITZAMNA', 'student', pw, now),
    mkUser('u_kukulkan', 'profe@zuma.dev', 'KUKULKAN', 'teacher', pw, now),
  ];

  const sections = [
    {
      id: 's_alba',
      name: 'Sendero del Alba',
      order: 1,
      description: 'Los primeros pasos del cazador de templos.',
    },
    {
      id: 's_kukulkan',
      name: 'Cámara de Kukulkán',
      order: 2,
      description: 'Pruebas avanzadas del Gran Ajau.',
    },
  ];

  const nodes = [
    node('n1', 's_alba', 1, 'UMBRAL DEL JAGUAR', 'Aritmética Vigesimal I', {
      subtitle: 'Sumas y restas en base-20 con puntos y barras.',
      rewardLabel: 'Sello Solar del Umbral',
      category: 'aritmetica',
    }),
    node('n2', 's_alba', 2, 'CUENTAS DE JADE', 'Geometría Sagrada', {
      subtitle: 'Simetría de pirámides y patrones rituales.',
      rewardLabel: 'Cuentas de Jade',
      category: 'geometria',
    }),
    node('n3', 's_alba', 3, 'RUEDA TZOLKIN', 'Calendario Ritual', {
      subtitle: 'Conteo de kin en la rueda de 260 días.',
      rewardLabel: 'Sello Solar de la Rueda',
      category: 'calendario',
    }),
    node('n4', 's_kukulkan', 1, 'CÁLCULO FRACCIONARIO', 'Fracciones Mayas', {
      subtitle: 'Fracciones en contexto histórico maya/azteca.',
      rewardLabel: 'Cuentas de Jade',
      requiredForUnlock: 'Superar la Rueda Tzolkin',
      category: 'aritmetica',
    }),
    node('n5', 's_kukulkan', 2, 'TEMPLO DE LOS GLIFOS', 'Descifrado Vigesimal', {
      subtitle: 'Desafío de agilidad y descifrado vigesimal en 60 segundos.',
      rewardLabel: 'Glifo Dorado de la Sabiduría Vigesimal',
      requiredForUnlock: 'Vencer al Guardián de Glifos',
      category: 'glifos',
      isBoss: true,
    }),
    node('n6', 's_kukulkan', 3, 'CÁMARA DE KUKULKÁN', 'Boss Final', {
      subtitle: 'El Gran Ajau Regional te espera.',
      rewardLabel: 'Título de Gran Ajau',
      requiredForUnlock: 'Descifrar el Templo de los Glifos',
      category: 'historia',
      isBoss: true,
    }),
  ];

  const classrooms = [
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

  const progress = [
    prog('u_balam', 'n1', 3, 120, now),
    prog('u_balam', 'n2', 2, 100, now),
    prog('u_ixchel', 'n1', 3, 130, now),
    prog('u_ixchel', 'n2', 3, 125, now),
    prog('u_ixchel', 'n3', 3, 160, now),
    prog('u_chac', 'n1', 2, 90, now),
  ];

  const codex = [
    entry(
      'gy_aritmetica',
      'Aritmética Vigesimal',
      'aritmetica',
      'El sistema maya usa base 20: puntos (1) y barras (5).',
      'Los mayas representaban números con tres símbolos: el punto (uno), la barra (cinco) y la concha (cero). Cada nivel representa una potencia de veinte.',
      'n1',
    ),
    entry(
      'gy_geometria',
      'Geometría Sagrada',
      'geometria',
      'Simetría y proporción en las pirámides.',
      'La simetría y las proporciones de las pirámides reflejan conocimientos astronómicos y rituales.',
      'n2',
    ),
    entry(
      'gy_tzolkin',
      'Rueda Tzolkin',
      'calendario',
      'Calendario ritual de 260 días (13 números × 20 días).',
      'El Tzolkin combina 13 números con 20 nombres de día; cada día se llama "kin".',
      'n3',
    ),
    entry(
      'gy_glifos',
      'Glifos Mayas',
      'glifos',
      'Introducción al descifrado de la escritura maya.',
      'Los glifos combinan elementos fonéticos y logográficos; su lectura requiere contexto.',
      'n5',
    ),
    entry(
      'gy_historia',
      'El Sendero Sagrado',
      'historia',
      'Contexto histórico del camino ritual del juego.',
      'El Sendero Sagrado es una metáfora del aprendizaje por niveles, inspirada en rutas ceremoniales y astronómicas de Mesoamérica.',
      null,
    ),
  ];

  return { users, sections, nodes, classrooms, progress, codex };
}

function mkUser(id, email, nickname, role, passwordHash, createdAt) {
  return { id, email, nickname, role, passwordHash, createdAt };
}

function node(id, sectionId, order, title, subtitle, extra = {}) {
  return {
    id,
    sectionId,
    order,
    title,
    subtitle: extra.subtitle ?? subtitle,
    rewardLabel: extra.rewardLabel ?? '',
    requiredForUnlock: extra.requiredForUnlock ?? null,
    category: extra.category ?? null,
    isBoss: extra.isBoss ?? false,
  };
}

function prog(userId, nodeId, stars, jadeCoins, completedAt) {
  return { userId, nodeId, stars, jadeCoins, completedAt };
}

function entry(id, title, topic, summary, content, unlockNodeId) {
  return { id, title, topic, summary, content, unlockNodeId };
}
