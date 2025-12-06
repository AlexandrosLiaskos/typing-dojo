export interface TypingStats {
    sessionsCompleted: number;
    averageWpm: number;
    lastWpm: number;
    lastAccuracy: number;
    bestWpm: number;
    bestAccuracy: number;
    totalPoints: number;
}

export interface ProfileData {
    name: string;
    email: string;
    githubConnected: boolean;
}

export interface LeaderboardEntry {
    name: string;
    wpm: number;
    accuracy: number;
    points: number;
    sessions: number;
    timestamp: number;
}

export const DEFAULT_STATS: TypingStats = {
    sessionsCompleted: 0,
    averageWpm: 0,
    lastWpm: 0,
    lastAccuracy: 0,
    bestWpm: 0,
    bestAccuracy: 0,
    totalPoints: 0
};

export const DEFAULT_PROFILE: ProfileData = {
    name: 'Guest User',
    email: '',
    githubConnected: false
};
