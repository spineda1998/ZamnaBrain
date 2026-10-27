import { User, Section, GameNode, ProgressSummary, LeaderboardEntry, Classroom, StudentProgress, CodexEntry } from './types';

const BASE_URL = '/v1';

const FALLBACK_SECTIONS: Section[] = [
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

const FALLBACK_NODES: Record<string, GameNode[]> = {
  s_alba: [
    {
      id: 'n1',
      sectionId: 's_alba',
      order: 1,
      title: 'UMBRAL DEL JAGUAR',
      subtitle: 'Sumas y restas en base-20 con puntos (1) y barras (5).',
      rewardLabel: 'Sello Solar del Umbral',
      category: 'aritmetica',
      isBoss: false,
      status: 'completed',
      stars: 3,
      jadeCoins: 120,
    },
    {
      id: 'n2',
      sectionId: 's_alba',
      order: 2,
      title: 'CUENTAS DE JADE',
      subtitle: 'Simetría de pirámides, ángulos solares y patrones rituales.',
      rewardLabel: 'Cuentas de Jade Ceremoniales',
      category: 'geometria',
      isBoss: false,
      status: 'active',
      stars: 2,
      jadeCoins: 100,
    },
    {
      id: 'n3',
      sectionId: 's_alba',
      order: 3,
      title: 'RUEDA TZOLKIN',
      subtitle: 'Conteo de kin en la rueda sagrada de 260 días y 13 numerales.',
      rewardLabel: 'Sello Solar de la Rueda',
      category: 'calendario',
      isBoss: false,
      status: 'locked',
      stars: 0,
      jadeCoins: 0,
    },
  ],
  s_kukulkan: [
    {
      id: 'n4',
      sectionId: 's_kukulkan',
      order: 1,
      title: 'CÁLCULO FRACCIONARIO',
      subtitle: 'Fracciones y proporciones en arquitectura maya monumental.',
      rewardLabel: 'Reliquia de Jade Ancestral',
      requiredForUnlock: 'Superar la Rueda Tzolkin',
      category: 'aritmetica',
      isBoss: false,
      status: 'locked',
      stars: 0,
      jadeCoins: 0,
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
      status: 'locked',
      stars: 0,
      jadeCoins: 0,
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
      status: 'locked',
      stars: 0,
      jadeCoins: 0,
    },
  ],
};

const FALLBACK_CODEX: CodexEntry[] = [
  {
    id: 'gy_aritmetica',
    title: 'Aritmética Vigesimal Maya',
    topic: 'aritmetica',
    summary: 'El sistema posicional vigesimal: puntos (1), barras (5) y conchas (0).',
    content: 'Los mayas crearon uno de los sistemas matemáticos más precisos de la historia. Usaban base 20 con valor posicional que aumentaba de abajo hacia arriba en potencias de 20 (1, 20, 400, 8000...). Tres símbolos bastaban para cualquier cantidad: un punto (1), una barra horizontal (5) y una concha estilizada o semilla para el cero (0).',
    unlocked: true,
  },
  {
    id: 'gy_geometria',
    title: 'Geometría Sagrada y Pirámides',
    topic: 'geometria',
    summary: 'Simetría ceremonial, orientaciones astronómicas y escalinatas.',
    content: 'Las pirámides mayas como El Castillo en Chichén Itzá están alineadas con los equinoccios solares. Cada detalle arquitectónico codifica cuentas calendáricas: 4 escaleras de 91 escalones más la plataforma superior suman 365 días del año Haab. En los equinoccios, las sombras crean el descenso serpenteante de Kukulkán.',
    unlocked: true,
  },
  {
    id: 'gy_tzolkin',
    title: 'La Rueda Ritual Tzolkin',
    topic: 'calendario',
    summary: 'Ciclo ceremonial de 260 días combinando 13 números y 20 días sagrados.',
    content: 'El Tzolkin es la rueda del tiempo ritual. Combina 13 números con 20 nombres de kin (como Imix, Ik, Akbal, Kan, Chicchan, Cimi, Manik, Lamat...). La combinación tarda exactamente 260 días (13 × 20) en repetirse, guiando ceremonias, siembras y destinos cósmicos.',
    unlocked: true,
  },
  {
    id: 'gy_glifos',
    title: 'Descifrado de Glifos Epigráficos',
    topic: 'glifos',
    summary: 'Escritura jeroglífica maya: logogramas y bloques silábicos.',
    content: 'La escritura maya es un sistema mixto fonético-silábico y logográfico. Se leía en pares de columnas de izquierda a derecha y de arriba a abajo. Cada cartucho o bloque glífico incluye un signo principal rodeado de afijos (prefijos, superfijos, sufijos, subfijos).',
    unlocked: true,
  },
  {
    id: 'gy_historia',
    title: 'El Sendero Sagrado y el Ajau',
    topic: 'historia',
    summary: 'El viaje ritual de iniciación del sabio y astrónomo maya.',
    content: 'El Sendero Sagrado representa el viaje espiritual y mental del estudiante para alcanzar el rango de Ahau o sacerdote astrónomo. A través de la agilidad mental, el dominio de los números y la armonía cósmica, se superan los senderos oscuros de Xibalba para ascender hacia la sabiduría luminosa.',
    unlocked: true,
  },
];

class ApiService {
  private token: string | null = localStorage.getItem('zuma_token');

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('zuma_token', token);
    } else {
      localStorage.removeItem('zuma_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Error en la petición');
    }

    return res.json();
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const data = await this.request<{ accessToken: string; refreshToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.accessToken);
    return data;
  }

  async register(email: string, password: string, nickname: string, role: 'student' | 'teacher'): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const data = await this.request<{ accessToken: string; refreshToken: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nickname, role }),
    });
    this.setToken(data.accessToken);
    return data;
  }

  async getCurrentUser(): Promise<User> {
    try {
      return await this.request<User>('/users/me');
    } catch {
      return {
        id: 'u_miguelito',
        email: 'miguelito@alumno.com',
        nickname: localStorage.getItem('zuma_user_nickname') || 'MIGUELITO',
        role: 'student',
        avatar: localStorage.getItem('zuma_user_avatar') || '🦅',
      };
    }
  }

  async updateNickname(nickname: string): Promise<User> {
    try {
      return await this.request<User>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ nickname }),
      });
    } catch {
      return {
        id: 'u_miguelito',
        email: 'miguelito@alumno.com',
        nickname,
        role: 'student',
      };
    }
  }

  async getSections(): Promise<Section[]> {
    try {
      return await this.request<Section[]>('/sections');
    } catch {
      return FALLBACK_SECTIONS;
    }
  }

  async getNodes(sectionId: string): Promise<GameNode[]> {
    try {
      return await this.request<GameNode[]>(`/sections/${sectionId}/nodes`);
    } catch {
      return FALLBACK_NODES[sectionId] || [];
    }
  }

  async getProgress(): Promise<ProgressSummary> {
    try {
      return await this.request<ProgressSummary>('/me/progress');
    } catch {
      const savedCoins = localStorage.getItem('zuma_progress_coins');
      return {
        jadeCoins: savedCoins ? Number(savedCoins) : 220,
        totalStars: 5,
        nodeProgress: [
          { nodeId: 'n1', stars: 3, jadeCoins: 120, completedAt: new Date().toISOString() },
          { nodeId: 'n2', stars: 2, jadeCoins: 100, completedAt: new Date().toISOString() },
        ],
        lastPlayedAt: new Date().toISOString(),
      };
    }
  }

  async updateProgress(nodeId: string, stars: number, jadeCoins: number): Promise<ProgressSummary> {
    try {
      return await this.request<ProgressSummary>(`/me/progress/${nodeId}`, {
        method: 'PUT',
        body: JSON.stringify({ stars, jadeCoins }),
      });
    } catch {
      const current = await this.getProgress();
      const updated = {
        ...current,
        jadeCoins: current.jadeCoins + jadeCoins,
        totalStars: current.totalStars + stars,
      };
      localStorage.setItem('zuma_progress_coins', updated.jadeCoins.toString());
      return updated;
    }
  }

  async getLeaderboard(classroomId?: string): Promise<LeaderboardEntry[]> {
    try {
      const query = classroomId ? `?classroomId=${classroomId}` : '';
      return await this.request<LeaderboardEntry[]>(`/leaderboard${query}`);
    } catch {
      return [
        { rank: 1, userId: 'u_1', nickname: 'KUKUL G-PILOT', jadeCoins: 1450, totalStars: 18, nodesCount: 6 },
        { rank: 2, userId: 'u_miguelito', nickname: 'MIGUELITO', jadeCoins: 850, totalStars: 12, nodesCount: 4 },
        { rank: 3, userId: 'u_3', nickname: 'BALAM APPLE', jadeCoins: 620, totalStars: 9, nodesCount: 3 },
      ];
    }
  }

  async getClassrooms(): Promise<Classroom[]> {
    try {
      return await this.request<Classroom[]>('/classrooms');
    } catch {
      return [
        {
          id: 'c_kukul',
          code: 'KUKUL-04',
          name: '4° A — Matemáticas Mayas',
          teacherId: 'u_miguelito',
          sectionIds: ['s_alba', 's_kukulkan'],
          studentCount: 24,
        },
      ];
    }
  }

  async createClassroom(name: string): Promise<Classroom> {
    return this.request<Classroom>('/classrooms', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async joinClassroom(code: string): Promise<Classroom> {
    return this.request<Classroom>('/classrooms/join', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async getClassroomStudents(classroomId: string): Promise<StudentProgress[]> {
    try {
      return await this.request<StudentProgress[]>(`/classrooms/${classroomId}/students`);
    } catch {
      return [];
    }
  }

  async getCodexEntries(topic?: string, query?: string): Promise<CodexEntry[]> {
    try {
      const params = new URLSearchParams();
      if (topic) params.set('topic', topic);
      if (query) params.set('query', query);
      const qs = params.toString() ? `?${params.toString()}` : '';
      return await this.request<CodexEntry[]>(`/codex/entries${qs}`);
    } catch {
      let filtered = [...FALLBACK_CODEX];
      if (topic) filtered = filtered.filter((e) => e.topic === topic);
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter((e) => e.title.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q));
      }
      return filtered;
    }
  }

  async getCodexEntry(id: string): Promise<CodexEntry> {
    try {
      return await this.request<CodexEntry>(`/codex/entries/${id}`);
    } catch {
      const found = FALLBACK_CODEX.find((e) => e.id === id);
      return found || FALLBACK_CODEX[0];
    }
  }
}

export const api = new ApiService();
