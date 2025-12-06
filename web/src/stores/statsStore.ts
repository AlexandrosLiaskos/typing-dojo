import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { TypingStats, LeaderboardEntry } from '../types/content';
import { DEFAULT_STATS } from '../types/content';

interface DbUserStats {
  id: string;
  user_id: string;
  sessions_completed: number;
  average_wpm: number;
  last_wpm: number;
  last_accuracy: number;
  best_wpm: number;
  best_accuracy: number;
  total_points: number;
  created_at: string;
  updated_at: string;
}

interface DbLeaderboardEntry {
  user_id: string;
  name: string;
  avatar_url: string | null;
  points: number;
  wpm: number;
  accuracy: number;
  sessions: number;
  last_active: string;
}

interface StatsState {
  stats: TypingStats;
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  fetchStats: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  updateStats: (wpm: number, accuracy: number) => Promise<void>;
}

function calculateSessionPoints(wpm: number, accuracy: number): number {
  // WPM is the main factor - more speed = more points
  // Accuracy acts as a multiplier (0.5x to 1.0x)
  //
  // Examples:
  // 30 WPM, 90% accuracy = 30 * 0.90 = 27 pts
  // 60 WPM, 95% accuracy = 60 * 0.95 = 57 pts
  // 80 WPM, 98% accuracy = 80 * 0.98 = 78 pts
  // 100 WPM, 100% accuracy = 100 * 1.0 = 100 pts
  // 50 WPM, 70% accuracy = 50 * 0.70 = 35 pts

  const accuracyMultiplier = accuracy / 100;
  return Math.round(wpm * accuracyMultiplier);
}

export const useStatsStore = create<StatsState>((set, get) => ({
  stats: DEFAULT_STATS,
  leaderboard: [],
  loading: false,

  fetchStats: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ stats: DEFAULT_STATS, loading: false });
        return;
      }

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching stats:', error);
      }

      if (data) {
        const d = data as unknown as DbUserStats;
        set({
          stats: {
            sessionsCompleted: d.sessions_completed,
            averageWpm: d.average_wpm,
            lastWpm: d.last_wpm,
            lastAccuracy: d.last_accuracy,
            bestWpm: d.best_wpm,
            bestAccuracy: d.best_accuracy,
            totalPoints: d.total_points,
          },
          loading: false,
        });
      } else {
        set({ stats: DEFAULT_STATS, loading: false });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      set({ loading: false });
    }
  },

  fetchLeaderboard: async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(25);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }

      if (data) {
        const entries = data as unknown as DbLeaderboardEntry[];
        set({
          leaderboard: entries.map(entry => ({
            userId: entry.user_id,
            name: entry.name,
            avatarUrl: entry.avatar_url,
            points: entry.points,
            wpm: entry.wpm,
            accuracy: entry.accuracy,
            sessions: entry.sessions,
            lastActive: entry.last_active,
          })),
        });
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  },

  updateStats: async (wpm: number, accuracy: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const currentStats = get().stats;
    const sessionsCompleted = currentStats.sessionsCompleted + 1;
    const averageWpm = sessionsCompleted === 1
      ? wpm
      : (currentStats.averageWpm * currentStats.sessionsCompleted + wpm) / sessionsCompleted;

    // Calculate points for THIS session and ADD to total
    const sessionPoints = calculateSessionPoints(wpm, accuracy);
    const totalPoints = currentStats.totalPoints + sessionPoints;

    const newStats = {
      user_id: user.id,
      sessions_completed: sessionsCompleted,
      average_wpm: averageWpm,
      last_wpm: wpm,
      last_accuracy: accuracy,
      best_wpm: Math.max(currentStats.bestWpm, wpm),
      best_accuracy: Math.max(currentStats.bestAccuracy, accuracy),
      total_points: totalPoints,
      updated_at: new Date().toISOString(),
    };

    // Use upsert to handle case where user_stats row doesn't exist yet
    const { error } = await supabase
      .from('user_stats')
      .upsert(newStats as never, { onConflict: 'user_id' });

    if (error) {
      console.error('Error updating stats:', error);
      return;
    }

    set({
      stats: {
        sessionsCompleted,
        averageWpm,
        lastWpm: wpm,
        lastAccuracy: accuracy,
        bestWpm: newStats.best_wpm,
        bestAccuracy: newStats.best_accuracy,
        totalPoints,
      },
    });
  },
}));

