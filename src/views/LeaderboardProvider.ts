import * as vscode from 'vscode';
import { FileStorage } from '../storage/file-storage';
import { LeaderboardEntry } from '../storage/types';

export class LeaderboardProvider implements vscode.TreeDataProvider<LeaderboardItem> {
    public static readonly viewId = 'typing-training-leaderboard-view';

    private readonly _onDidChangeTreeData = new vscode.EventEmitter<LeaderboardItem | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private readonly storage: FileStorage) {}

    getTreeItem(element: LeaderboardItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: LeaderboardItem): Thenable<LeaderboardItem[]> {
        if (element) {
            return Promise.resolve([]);
        }
        const entries = this.storage.readJSON<LeaderboardEntry[]>('leaderboard.json', []);
        const leaderboardFile = this.storage.getFilePath('leaderboard.json');
        const items: LeaderboardItem[] = [
            new LeaderboardItem('📋 View Leaderboard File', 'Click to open', 'file', leaderboardFile)
        ];
        entries.slice(0, 25).forEach((entry, index) => {
            items.push(new LeaderboardItem(
                `#${index + 1} ${entry.name}`,
                `${entry.points} pts`,
                index === 0 ? 'trophy' : 'star-full'
            ));
        });
        return Promise.resolve(items);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    async sync(): Promise<void> {
        vscode.window.showInformationMessage('Leaderboard sync simulated (stored locally in leaderboard.json)');
        this.refresh();
    }
}

class LeaderboardItem extends vscode.TreeItem {
    constructor(label: string, description: string, iconId: string, resourceUri?: string) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.description = description;
        this.iconPath = new vscode.ThemeIcon(iconId);
        if (resourceUri) {
            this.resourceUri = vscode.Uri.file(resourceUri);
            this.command = {
                command: 'vscode.open',
                title: 'Open File',
                arguments: [this.resourceUri]
            };
        }
    }
}
