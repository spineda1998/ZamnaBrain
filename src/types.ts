export type AppLanguage = 'es' | 'nah' | 'myn' | 'en';

export interface User {
  id: string;
  email: string;
  nickname: string;
  role: 'student' | 'teacher';
  avatar?: string;
  difficulty?: 'aprendiz' | 'sacerdote' | 'ajau';
  language?: AppLanguage;
}

export interface GameSettings {
  bgm: boolean;
  sfx: boolean;
  volume: number;
  difficulty: 'aprendiz' | 'sacerdote' | 'ajau';
  language: AppLanguage;
}

export interface Section {
  id: string;
  name: string;
  order: number;
  description: string;
}

export interface GameNode {
  id: string;
  sectionId: string;
  order: number;
  title: string;
  subtitle?: string;
  rewardLabel?: string;
  requiredForUnlock?: string;
  category?: string;
  isBoss: boolean;
  status: 'completed' | 'active' | 'locked';
  stars: number;
  jadeCoins: number;
}

export interface ProgressSummary {
  jadeCoins: number;
  totalStars: number;
  nodeProgress: {
    nodeId: string;
    stars: number;
    jadeCoins: number;
    completedAt: string;
  }[];
  lastPlayedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  nickname: string;
  jadeCoins: number;
  totalStars: number;
  nodesCount: number;
}

export interface Classroom {
  id: string;
  code: string;
  name: string;
  teacherId: string;
  sectionIds: string[];
  studentCount: number;
}

export interface StudentProgress {
  user: User;
  jadeCoins: number;
  totalStars: number;
  nodesCompleted: number;
}

export interface CodexEntry {
  id: string;
  title: string;
  topic: string;
  summary: string;
  content?: string;
  unlocked: boolean;
}
