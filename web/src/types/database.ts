export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          name?: string;
          email?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      user_stats: {
        Row: {
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
        };
        Insert: {
          user_id: string;
          sessions_completed?: number;
          average_wpm?: number;
          last_wpm?: number;
          last_accuracy?: number;
          best_wpm?: number;
          best_accuracy?: number;
          total_points?: number;
        };
        Update: {
          sessions_completed?: number;
          average_wpm?: number;
          last_wpm?: number;
          last_accuracy?: number;
          best_wpm?: number;
          best_accuracy?: number;
          total_points?: number;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          content_id: string;
          category: string;
          language: string;
          wpm: number;
          accuracy: number;
          points: number;
          duration_seconds: number;
          completed_at: string;
        };
        Insert: {
          user_id: string;
          content_id: string;
          category: string;
          language: string;
          wpm: number;
          accuracy: number;
          points: number;
          duration_seconds: number;
        };
        Update: never;
      };
    };
    Views: {
      leaderboard: {
        Row: {
          user_id: string;
          name: string;
          avatar_url: string | null;
          points: number;
          wpm: number;
          accuracy: number;
          sessions: number;
          last_active: string;
        };
      };
    };
  };
}

