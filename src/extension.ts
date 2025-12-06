import * as vscode from 'vscode';
import { TypingManager } from './typing-manager';
import { StartProvider } from './views/StartProvider';
import { DashboardProvider } from './views/DashboardProvider';
import { LeaderboardProvider } from './views/LeaderboardProvider';
import { LibraryProvider } from './views/LibraryProvider';
import { ProfileProvider } from './views/ProfileProvider';
import { FileStorage } from './storage/file-storage';
import type { ContentRequest } from './data/content';

export function activate(context: vscode.ExtensionContext) {
    console.log('[Typing Training] Activation started');
    const start = Date.now();

    const storageRoot = context.globalStorageUri.fsPath;

    console.log('[Typing Training] Initializing content loader...');
    const { initializeContentLoader } = require('./data/content');
    initializeContentLoader(storageRoot);
    console.log(`[Typing Training] Content loader initialized in ${Date.now() - start}ms`);

    console.log('[Typing Training] Creating FileStorage...');
    const storage = new FileStorage(storageRoot);
    console.log(`[Typing Training] FileStorage created in ${Date.now() - start}ms`);

    console.log('[Typing Training] Creating TypingManager...');
    const typingManager = new TypingManager(storage);
    console.log(`[Typing Training] TypingManager created in ${Date.now() - start}ms`);

    console.log('[Typing Training] Creating providers...');
    const startProvider = new StartProvider();
    const dashboardProvider = new DashboardProvider(storage);
    const leaderboardProvider = new LeaderboardProvider(storage);
    const libraryProvider = new LibraryProvider();
    const profileProvider = new ProfileProvider(storage);
    console.log(`[Typing Training] Providers created in ${Date.now() - start}ms`);

    console.log('[Typing Training] Registering tree providers...');
    const regStart = Date.now();
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('typing-training-start-view', startProvider),
        vscode.window.registerTreeDataProvider('typing-training-dashboard-view', dashboardProvider),
        vscode.window.registerTreeDataProvider('typing-training-leaderboard-view', leaderboardProvider),
        vscode.window.registerTreeDataProvider('typing-training-library-view', libraryProvider),
        vscode.window.registerTreeDataProvider('typing-training-profile-view', profileProvider),

        vscode.commands.registerCommand('typing-training.startSession', (arg: ContentRequest | string) => {
            void typingManager.startSession(arg);
        }),

        vscode.commands.registerCommand('typing-training.completeSession', () => {
            void typingManager.completeActiveSession();
        }),

        vscode.commands.registerCommand('typing-training.showGuide', () => {
            showGuide(context);
        }),

        vscode.commands.registerCommand('typing-training.refreshDashboard', () => {
            dashboardProvider.refresh();
        }),

        vscode.commands.registerCommand('typing-training.syncLeaderboard', () => {
            void leaderboardProvider.sync();
        }),

        vscode.commands.registerCommand('typing-training.refreshLeaderboard', () => {
            leaderboardProvider.refresh();
        }),

        vscode.commands.registerCommand('typing-training.openDashboard', () => {
            vscode.commands.executeCommand('typing-training-dashboard-view.focus');
        }),

        vscode.commands.registerCommand('typing-training.profile.editField', (field: 'name' | 'email') => {
            void profileProvider.promptForField(field);
        }),

        vscode.commands.registerCommand('typing-training.profile.connectGitHub', () => {
            void profileProvider.connectGitHub();
        }),

        vscode.commands.registerCommand('typing-training.refreshLibrary', () => {
            libraryProvider.refresh();
        }),

        vscode.commands.registerCommand('typing-training.refreshProfile', () => {
            profileProvider.refresh();
        }),

        vscode.commands.registerCommand('typing-training.changeViewMode', async () => {
            const config = vscode.workspace.getConfiguration('typingTraining');
            const currentMode = config.get<string>('viewMode', 'split');

            const items = [
                { label: 'Split View', description: 'Reference on Left, Input on Right', picked: currentMode === 'split', value: 'split' },
                { label: 'Single View', description: 'Overwrite Mode', picked: currentMode === 'single', value: 'single' }
            ];

            const selection = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select Typing View Mode'
            });

            if (selection) {
                await config.update('viewMode', selection.value, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage(`Switched to ${selection.label}`);
            }
        })
    );
    console.log(`[Typing Training] Tree providers registered in ${Date.now() - regStart}ms`);
    console.log(`[Typing Training] ACTIVATION COMPLETE in ${Date.now() - start}ms`);
}

function showGuide(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'typingTrainingGuide',
        'Typing Training Guide',
        vscode.ViewColumn.One,
        {
            enableScripts: false
        }
    );

    panel.webview.html = getGuideHtml();
}

function getGuideHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
    <title>Typing Training Guide</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            color: var(--vscode-editor-foreground);
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 10px;
        }
        h2 {
            color: var(--vscode-editor-foreground);
            margin-top: 30px;
        }
        code {
            background-color: var(--vscode-textCodeBlock-background);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: var(--vscode-editor-font-family);
        }
        ol, ul {
            margin-left: 20px;
        }
        li {
            margin: 8px 0;
        }
        .section {
            margin: 20px 0;
        }
        strong {
            color: var(--vscode-textLink-foreground);
        }
    </style>
</head>
<body>
    <h1>🎯 Typing Training Guide</h1>

    <div class="section">
        <h2>How to Start a Session</h2>
        <ol>
            <li>Open the <strong>Start Training</strong> view in the sidebar</li>
            <li>Expand a category (General Text, Code, or Numbers)</li>
            <li>Click on a training type to start</li>
            <li>A new document will open with the passage to type</li>
        </ol>
    </div>

    <div class="section">
        <h2>During the Session</h2>
        <ul>
            <li><strong>Type the passage</strong> - The remaining text appears as gray italic preview</li>
            <li><strong>Correct characters</strong> appear in <span style="color: #4EC9B0;">green</span></li>
            <li><strong>Wrong characters</strong> appear in <span style="color: #C586C0;">purple</span></li>
            <li>The session <strong>auto-completes</strong> when you type the entire passage</li>
        </ul>
    </div>

    <div class="section">
        <h2>Completing a Session</h2>
        <ul>
            <li><strong>Automatic</strong>: Type the full passage and it completes automatically</li>
            <li><strong>Manual</strong>: Click "Complete Current Session" in the Start Training view</li>
            <li>Your WPM (words per minute) and accuracy will be calculated</li>
            <li>Stats are saved to your Dashboard</li>
        </ul>
    </div>

    <div class="section">
        <h2>Scoring System</h2>
        <ul>
            <li><strong>WPM</strong> = (Characters typed ÷ 5) ÷ Minutes elapsed</li>
            <li><strong>Accuracy</strong> = (Correct characters ÷ Total characters) × 100%</li>
            <li><strong>Points</strong> = (WPM × 4) + (Accuracy × 10) + Session bonus</li>
        </ul>
    </div>

    <div class="section">
        <h2>Views Explained</h2>
        <ul>
            <li><strong>Start Training</strong> - Choose passage type and start sessions</li>
            <li><strong>Dashboard</strong> - View your typing statistics</li>
            <li><strong>Leaderboard</strong> - See top performers (sync with server)</li>
            <li><strong>Library</strong> - Browse available training content</li>
            <li><strong>Profile</strong> - Manage your user information</li>
        </ul>
    </div>
</body>
</html>`;
}

export function deactivate() {}
