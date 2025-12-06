import * as vscode from 'vscode';
import type { ContentRequest, ContentCategory, ContentLength, ContentLanguage } from '../data/content';

export async function showQuickStart(): Promise<ContentRequest | undefined> {
    const categories = await vscode.window.showQuickPick(
        [
            { label: '$(book) General Text', description: 'Knowledge-rich passages', value: 'general' as const },
            { label: '$(code) Code', description: 'Programming snippets', value: 'code' as const },
            { label: '$(symbol-number) Numbers', description: 'Numeric sequences', value: 'numbers' as const }
        ],
        { placeHolder: 'Choose a category', title: 'Start Typing Session' }
    );

    if (!categories) return undefined;

    if (categories.value === 'general') {
        const length = await vscode.window.showQuickPick(
            [
                { label: 'Short', description: 'Quick warm-up', value: 'short' as ContentLength },
                { label: 'Medium', description: 'Few paragraphs', value: 'medium' as ContentLength },
                { label: 'Long', description: 'Deeper dive', value: 'long' as ContentLength },
                { label: 'Huge', description: 'Long-form text', value: 'huge' as ContentLength }
            ],
            { placeHolder: 'Select passage length' }
        );
        if (!length) return undefined;
        return { category: 'general', length: length.value };
    }

    if (categories.value === 'code') {
        const language = await vscode.window.showQuickPick(
            [
                { label: 'JavaScript', value: 'js' as ContentLanguage },
                { label: 'TypeScript', value: 'ts' as ContentLanguage },
                { label: 'Python', value: 'py' as ContentLanguage },
                { label: 'Rust', value: 'rs' as ContentLanguage },
                { label: 'HTML', value: 'html' as ContentLanguage },
                { label: 'Markdown', value: 'md' as ContentLanguage }
            ],
            { placeHolder: 'Choose a language' }
        );
        if (!language) return undefined;
        return { category: 'code', language: language.value };
    }

    if (categories.value === 'numbers') {
        const length = await vscode.window.showQuickPick(
            [
                { label: 'Short', description: 'Simple sequences', value: 'short' as ContentLength },
                { label: 'Medium', description: 'Constants', value: 'medium' as ContentLength },
                { label: 'Long', description: 'Long patterns', value: 'long' as ContentLength }
            ],
            { placeHolder: 'Select length' }
        );
        if (!length) return undefined;
        return { category: 'numbers', length: length.value };
    }

    return undefined;
}

export async function showDashboard(context: vscode.ExtensionContext): Promise<void> {
    const stats = context.globalState.get<any>('typingTraining.stats', {
        sessionsCompleted: 0,
        averageWpm: 0,
        lastWpm: 0,
        lastAccuracy: 0,
        bestWpm: 0,
        bestAccuracy: 0,
        totalPoints: 0
    });

    const items = [
        `Sessions: ${stats.sessionsCompleted || 0}`,
        `Average WPM: ${(stats.averageWpm || 0).toFixed(1)}`,
        `Best WPM: ${(stats.bestWpm || 0).toFixed(1)}`,
        `Last WPM: ${(stats.lastWpm || 0).toFixed(1)}`,
        `Last Accuracy: ${(stats.lastAccuracy || 0).toFixed(1)}%`,
        `Best Accuracy: ${(stats.bestAccuracy || 0).toFixed(1)}%`,
        `Total Points: ${stats.totalPoints || 0}`
    ];

    await vscode.window.showQuickPick(items, {
        placeHolder: 'Your Typing Stats',
        title: 'Dashboard'
    });
}
