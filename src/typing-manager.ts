import * as vscode from 'vscode';
import { getRandomContent, TrainingContent, ContentRequest } from './data/content';
import { recordLeaderboardResult } from './services/leaderboard';
import { FileStorage } from './storage/file-storage';
import { TypingStats, DEFAULT_STATS } from './storage/types';

export class TypingManager {
    private storage: FileStorage;
    private currentSession: TrainingContent | undefined;
    private decorationCorrect: vscode.TextEditorDecorationType;
    private decorationWrong: vscode.TextEditorDecorationType;
    private decorationUntyped: vscode.TextEditorDecorationType;
    private typingListener: vscode.Disposable | undefined;
    private activeDocument: vscode.TextDocument | undefined;
    private targetDocument: vscode.TextDocument | undefined;
    private isFixing = false;
    private viewMode: 'split' | 'single' = 'split';

    // Stats
    private startTime = 0;
    private totalErrors = 0;
    private correctChars = 0;
    private lastAccuracy = 0;

    private activeCommand: Promise<void> | undefined;

    constructor(storage: FileStorage) {
        this.storage = storage;

        this.decorationCorrect = vscode.window.createTextEditorDecorationType({
            color: '#4EC9B0',
            backgroundColor: 'rgba(78, 201, 176, 0.1)'
        });
        this.decorationWrong = vscode.window.createTextEditorDecorationType({
            color: '#C586C0',
            backgroundColor: 'rgba(197, 134, 192, 0.1)',
            overviewRulerColor: '#C586C0',
            overviewRulerLane: vscode.OverviewRulerLane.Right
        });
        this.decorationUntyped = vscode.window.createTextEditorDecorationType({
            light: {
                color: 'rgba(0, 0, 0, 0.3)'
            },
            dark: {
                color: 'rgba(200, 200, 200, 0.3)'
            }
        });
    }

    public async startSession(requestOrCategory: ContentRequest | string) {
        if (this.activeCommand) {
            return this.activeCommand;
        }

        this.activeCommand = this._startSession(requestOrCategory);
        try {
            await this.activeCommand;
        } finally {
            this.activeCommand = undefined;
        }
    }

    private async _startSession(requestOrCategory: ContentRequest | string) {
        const config = vscode.workspace.getConfiguration('typingTraining');
        this.viewMode = config.get<'split' | 'single'>('viewMode', 'split');

        const request: ContentRequest =
            typeof requestOrCategory === 'string'
                ? { category: requestOrCategory as any }
                : requestOrCategory;

        const content = getRandomContent(request);
        this.currentSession = content;
        this.startTime = Date.now();
        this.totalErrors = 0;
        this.correctChars = 0;
        this.lastAccuracy = 0;

        // Normalize line endings for the target document display
        const normalizedText = content.text.replace(/\r\n|\r|\n/g, '\n');

        if (this.viewMode === 'split') {
            await this.setupSplitView(normalizedText);
        } else {
            await this.setupSingleView(normalizedText);
        }

        this.typingListener?.dispose();
        this.typingListener = vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.document === this.activeDocument) {
                void this.handleTyping(e);
            }
        });
    }

    private async setupSplitView(text: string) {
        // 1. Open Reference Document (Left/Top)
        this.targetDocument = await vscode.workspace.openTextDocument({
            content: text,
            language: 'typing' // Use same language for highlighting if we had syntax
        });
        await vscode.window.showTextDocument(this.targetDocument, {
            viewColumn: vscode.ViewColumn.One,
            preserveFocus: true,
            preview: false
        });

        // 2. Open Input Document (Right/Bottom)
        this.activeDocument = await vscode.workspace.openTextDocument({
            content: '',
            language: 'typing'
        });
        await vscode.window.showTextDocument(this.activeDocument, {
            viewColumn: vscode.ViewColumn.Two,
            preserveFocus: false,
            preview: false
        });

        vscode.window.showInformationMessage(
            `Typing Training: Session started! Read on LEFT, type on RIGHT.`
        );
    }

    private async setupSingleView(text: string) {
        this.activeDocument = await vscode.workspace.openTextDocument({
            content: text,
            language: 'typing'
        });
        await vscode.window.showTextDocument(this.activeDocument);

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.selection = new vscode.Selection(0, 0, 0, 0);
        }

        vscode.window.showInformationMessage(
            `Typing Training: Session started! Type over the text.`
        );

        // Initial decoration update
        this.updateDecorations(editor!);
    }

    public async completeActiveSession(): Promise<void> {
        if (this.activeCommand) {
            return this.activeCommand;
        }

        if (!this.activeDocument || !this.currentSession) {
            vscode.window.showInformationMessage('No active typing session to complete.');
            return;
        }

        this.activeCommand = this._completeActiveSession();
        try {
            await this.activeCommand;
        } finally {
            this.activeCommand = undefined;
        }
    }

    private async _completeActiveSession(): Promise<void> {
        if (!this.activeDocument) {
            return;
        }

        let typed = '';
        if (this.viewMode === 'split') {
            typed = this.activeDocument.getText();
        } else {
            const editor = vscode.window.visibleTextEditors.find(ed => ed.document === this.activeDocument);
            const limit = editor ? editor.document.offsetAt(editor.selection.active) : this.activeDocument.getText().length;
            typed = this.activeDocument.getText().substring(0, limit);
        }

        await this.finishSession(typed, 'manual');
    }

    private async handleTyping(e: vscode.TextDocumentChangeEvent) {
        if (this.viewMode === 'split') {
            this.handleTypingSplit(e);
        } else {
            await this.handleTypingSingle(e);
        }
    }

    private handleTypingSplit(e: vscode.TextDocumentChangeEvent) {
        const editor = vscode.window.visibleTextEditors.find(ed => ed.document === this.activeDocument);
        if (!editor) return;
        this.updateDecorations(editor);
    }

    private async handleTypingSingle(e: vscode.TextDocumentChangeEvent) {
        if (this.isFixing || !this.currentSession || !this.activeDocument) return;
        if (e.contentChanges.length === 0) return;

        const change = e.contentChanges[0];
        const editor = vscode.window.visibleTextEditors.find(ed => ed.document === this.activeDocument);
        if (!editor) return;

        this.isFixing = true;
        try {
            const edit = new vscode.WorkspaceEdit();
            const doc = this.activeDocument;

            // Handle Insert (Typing)
            if (change.text.length > 0) {
                const deletePos = change.rangeOffset + change.text.length;
                const deleteEnd = deletePos + change.text.length;

                if (deleteEnd <= doc.getText().length + change.text.length) {
                     const start = doc.positionAt(deletePos);
                     const end = doc.positionAt(deleteEnd);
                     edit.delete(doc.uri, new vscode.Range(start, end));
                }
            }
            // Handle Delete (Backspace)
            else if (change.rangeLength > 0) {
                const restoreStart = change.rangeOffset;
                const restoreLength = change.rangeLength;

                const eol = doc.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
                const targetText = this.currentSession.text.replace(/\r\n|\r|\n/g, eol);

                if (restoreStart < targetText.length) {
                    const textToRestore = targetText.substring(restoreStart, Math.min(restoreStart + restoreLength, targetText.length));
                    const pos = doc.positionAt(restoreStart);
                    edit.insert(doc.uri, pos, textToRestore);
                }
            }

            if (edit.size > 0) {
                await vscode.workspace.applyEdit(edit);
            }
        } finally {
            this.isFixing = false;
            this.updateDecorations(editor);
        }
    }

    private updateDecorations(editor: vscode.TextEditor) {
        if (!this.currentSession) return;

        const doc = editor.document;
        const userText = doc.getText();
        const eol = doc.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
        const targetText = this.currentSession.text.replace(/\r\n|\r|\n/g, eol);

        const correctRanges: vscode.Range[] = [];
        const wrongRanges: vscode.Range[] = [];
        const untypedRanges: vscode.Range[] = [];

        if (this.viewMode === 'split') {
            const minLength = Math.min(userText.length, targetText.length);
            for (let i = 0; i < minLength; i++) {
                const userChar = userText[i];
                const targetChar = targetText[i];
                const start = doc.positionAt(i);
                const end = doc.positionAt(i + 1);
                const range = new vscode.Range(start, end);

                if (userChar === targetChar) {
                    correctRanges.push(range);
                } else {
                    wrongRanges.push(range);
                }
            }
            if (userText.length > targetText.length) {
                const start = doc.positionAt(targetText.length);
                const end = doc.positionAt(userText.length);
                wrongRanges.push(new vscode.Range(start, end));
            }
        } else {
            // Single Mode
            const cursor = editor.selection.active;
            const cursorOffset = doc.offsetAt(cursor);

            // Check typed part (0 to cursor)
            for (let i = 0; i < cursorOffset; i++) {
                if (i >= targetText.length) break;

                const userChar = userText[i];
                const targetChar = targetText[i];
                const start = doc.positionAt(i);
                const end = doc.positionAt(i + 1);
                const range = new vscode.Range(start, end);

                if (userChar === targetChar) {
                    correctRanges.push(range);
                } else {
                    wrongRanges.push(range);
                }
            }

            // Untyped part (cursor to end)
            if (cursorOffset < userText.length) {
                const start = cursor;
                const end = doc.positionAt(userText.length);
                untypedRanges.push(new vscode.Range(start, end));
            }
        }

        editor.setDecorations(this.decorationCorrect, correctRanges);
        editor.setDecorations(this.decorationWrong, wrongRanges);
        editor.setDecorations(this.decorationUntyped, untypedRanges);

        this.correctChars = correctRanges.length;
        this.totalErrors = wrongRanges.length;
        const evaluated = this.correctChars + this.totalErrors;
        this.lastAccuracy = evaluated === 0 ? 0 : (this.correctChars / evaluated) * 100;

        // Auto-finish
        const isComplete = this.viewMode === 'split'
            ? (userText.length >= targetText.length && this.totalErrors === 0 && userText === targetText)
            : (editor.selection.active.isAfterOrEqual(doc.positionAt(targetText.length)));

        if (isComplete) {
             setTimeout(() => {
                 // Double check condition after delay
                 const currentText = editor.document.getText();
                 const currentCursor = editor.selection.active;
                 const stillComplete = this.viewMode === 'split'
                    ? currentText === targetText
                    : editor.document.offsetAt(currentCursor) >= targetText.length;

                 if (this.currentSession && stillComplete) {
                     void this.finishSession(currentText, 'auto');
                 }
             }, 100);
        }
    }

    private async finishSession(userText: string, reason: 'auto' | 'manual') {
        if (!this.currentSession) {
            return;
        }

        const endTime = Date.now();
        const durationMinutes = Math.max((endTime - this.startTime) / 60000, 1 / 60);
        const wpm = (userText.length / 5) / durationMinutes;

        const updatedStats = await this.persistStats(wpm, this.lastAccuracy);
        await recordLeaderboardResult(this.storage, {
            wpm,
            accuracy: this.lastAccuracy,
            sessionsCompleted: updatedStats.sessionsCompleted
        });

        this.typingListener?.dispose();
        this.typingListener = undefined;
        this.activeDocument = undefined;
        this.targetDocument = undefined;
        this.currentSession = undefined;

        const actions: vscode.MessageItem[] = [{ title: 'Open Dashboard' }];
        if (reason === 'manual') {
            actions.unshift({ title: 'Start Another Session' });
        }

        const selection = await vscode.window.showInformationMessage(
            `Session Complete! WPM: ${wpm.toFixed(1)} | Accuracy: ${this.lastAccuracy.toFixed(1)}%`,
            ...actions
        );

        if (selection?.title === 'Open Dashboard') {
            vscode.commands.executeCommand('typing-training.openDashboard');
        } else if (selection?.title === 'Start Another Session') {
            vscode.commands.executeCommand('typing-training.openDashboard');
        }
    }

    private async persistStats(wpm: number, accuracy: number): Promise<TypingStats> {
        const stats = this.storage.readJSON<TypingStats>('stats.json', DEFAULT_STATS);
        const sessionsCompleted = stats.sessionsCompleted + 1;
        const averageWpm =
            sessionsCompleted === 0
                ? wpm
                : (stats.averageWpm * stats.sessionsCompleted + wpm) / sessionsCompleted;

        const totalPoints = stats.totalPoints + calculatePointsContribution(wpm, accuracy, sessionsCompleted);

        const nextStats: TypingStats = {
            sessionsCompleted,
            averageWpm,
            lastWpm: wpm,
            lastAccuracy: accuracy,
            bestWpm: Math.max(stats.bestWpm, wpm),
            bestAccuracy: Math.max(stats.bestAccuracy, accuracy),
            totalPoints
        };

        this.storage.writeJSON('stats.json', nextStats);
        vscode.commands.executeCommand('typing-training.refreshDashboard');
        return nextStats;
    }
}

function calculatePointsContribution(wpm: number, accuracy: number, sessions: number): number {
    const speedScore = wpm * 4;
    const accuracyScore = accuracy * 10;
    const sessionBonus = Math.log2(sessions + 1) * 80;
    return Math.round(speedScore + accuracyScore + sessionBonus);
}
