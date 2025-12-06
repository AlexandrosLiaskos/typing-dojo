export type ContentCategory = 'general' | 'code' | 'numbers';
export type ContentLanguage = 'en' | 'js' | 'ts' | 'py' | 'rs' | 'html' | 'md';
export type ContentLength = 'short' | 'medium' | 'long' | 'huge';
export type ContentDifficulty = 'easy' | 'medium' | 'hard';

export interface TrainingContent {
  id: string;
  title: string;
  text: string;
  category: ContentCategory;
  language: ContentLanguage;
  difficulty: ContentDifficulty;
  length: ContentLength;
}

export interface ContentRequest {
  category: ContentCategory;
  language?: ContentLanguage;
  length?: ContentLength;
}

export interface TypingStats {
  sessionsCompleted: number;
  averageWpm: number;
  lastWpm: number;
  lastAccuracy: number;
  bestWpm: number;
  bestAccuracy: number;
  totalPoints: number;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatarUrl: string | null;
  points: number;
  wpm: number;
  accuracy: number;
  sessions: number;
  lastActive: string;
}

export const DEFAULT_STATS: TypingStats = {
  sessionsCompleted: 0,
  averageWpm: 0,
  lastWpm: 0,
  lastAccuracy: 0,
  bestWpm: 0,
  bestAccuracy: 0,
  totalPoints: 0,
};

