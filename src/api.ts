import { User, Section, GameNode, ProgressSummary, LeaderboardEntry, Classroom, StudentProgress, CodexEntry } from './types';

const BASE_URL = '/v1';

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
    return this.request<User>('/users/me');
  }

  async updateNickname(nickname: string): Promise<User> {
    return this.request<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ nickname }),
    });
  }

  async getSections(): Promise<Section[]> {
    return this.request<Section[]>('/sections');
  }

  async getNodes(sectionId: string): Promise<GameNode[]> {
    return this.request<GameNode[]>(`/sections/${sectionId}/nodes`);
  }

  async getProgress(): Promise<ProgressSummary> {
    return this.request<ProgressSummary>('/me/progress');
  }

  async updateProgress(nodeId: string, stars: number, jadeCoins: number): Promise<ProgressSummary> {
    return this.request<ProgressSummary>(`/me/progress/${nodeId}`, {
      method: 'PUT',
      body: JSON.stringify({ stars, jadeCoins }),
    });
  }

  async getLeaderboard(classroomId?: string): Promise<LeaderboardEntry[]> {
    const query = classroomId ? `?classroomId=${classroomId}` : '';
    return this.request<LeaderboardEntry[]>(`/leaderboard${query}`);
  }

  async getClassrooms(): Promise<Classroom[]> {
    return this.request<Classroom[]>('/classrooms');
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
    return this.request<StudentProgress[]>(`/classrooms/${classroomId}/students`);
  }

  async getCodexEntries(topic?: string, query?: string): Promise<CodexEntry[]> {
    const params = new URLSearchParams();
    if (topic) params.set('topic', topic);
    if (query) params.set('query', query);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request<CodexEntry[]>(`/codex/entries${qs}`);
  }

  async getCodexEntry(id: string): Promise<CodexEntry> {
    return this.request<CodexEntry>(`/codex/entries/${id}`);
  }
}

export const api = new ApiService();
