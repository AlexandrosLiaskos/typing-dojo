import * as vscode from 'vscode';
import { FileStorage } from '../storage/file-storage';
import { LeaderboardEntry, ProfileData, DEFAULT_PROFILE } from '../storage/types';

export async function recordLeaderboardResult(
    storage: FileStorage,
    params: { wpm: number; accuracy: number; sessionsCompleted: number }
): Promise<void> {
    const entries = storage.readJSON<LeaderboardEntry[]>('leaderboard.json', []);
    const profile = storage.readJSON<ProfileData>('profile.json', DEFAULT_PROFILE);

    const baseName = profile.name && profile.name.trim().length > 0 ? profile.name : 'Local User';
    const slug = slugify(baseName);

    const id = profile.githubConnected ? slug : 'local-user';
    const displayName = profile.githubConnected ? `@${slug}` : baseName;

    const existingIndex = entries.findIndex((e) => e.name === displayName);
    const sessions = existingIndex >= 0 ? entries[existingIndex].sessions + 1 : Math.max(params.sessionsCompleted, 1);
    const points = calculatePoints(params.wpm, params.accuracy, sessions);

    const nextEntry: LeaderboardEntry = {
        name: displayName,
        points,
        wpm: params.wpm,
        accuracy: params.accuracy,
        sessions,
        timestamp: Date.now()
    };

    if (existingIndex >= 0) {
        entries.splice(existingIndex, 1, nextEntry);
    } else {
        entries.push(nextEntry);
    }

    // Sort by points descending
    entries.sort((a, b) => b.points - a.points);

    storage.writeJSON('leaderboard.json', entries);
    vscode.commands.executeCommand('typing-training.refreshLeaderboard');
}

function calculatePoints(wpm: number, accuracy: number, sessions: number): number {
    const speedScore = wpm * 6;
    const accuracyScore = accuracy * 20;
    const sessionBonus = Math.log2(sessions + 1) * 150;
    return Math.round(speedScore + accuracyScore + sessionBonus);
}

function slugify(input: string): string {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .trim() || 'user';
}
