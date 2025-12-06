import * as vscode from 'vscode';
import { FileStorage } from '../storage/file-storage';
import { TypingStats, DEFAULT_STATS } from '../storage/types';

export { TypingStats };

export class DashboardProvider implements vscode.TreeDataProvider<DashboardItem> {
    public static readonly viewId = 'typing-training-dashboard-view';

    private readonly _onDidChangeTreeData = new vscode.EventEmitter<DashboardItem | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private readonly storage: FileStorage) {}

    getTreeItem(element: DashboardItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: DashboardItem): Promise<DashboardItem[]> {
        if (element) {
            return [];
        }
        const stats = this.getStats();
        const statsFile = this.storage.getFilePath('stats.json');
        return [
            new DashboardItem('📊 View Stats File', 'Click to open', 'file', statsFile),
            new DashboardItem('Sessions Completed', (stats.sessionsCompleted || 0).toString(), 'check'),
            new DashboardItem('Average WPM', (stats.averageWpm || 0).toFixed(1), 'graph'),
            new DashboardItem('Best WPM', (stats.bestWpm || 0).toFixed(1), 'run'),
            new DashboardItem('Last Session WPM', (stats.lastWpm || 0).toFixed(1), 'debug-breakpoint-conditional'),
            new DashboardItem('Last Accuracy', `${(stats.lastAccuracy || 0).toFixed(1)}%`, 'target'),
            new DashboardItem('Best Accuracy', `${(stats.bestAccuracy || 0).toFixed(1)}%`, 'shield'),
            new DashboardItem('Total Leaderboard Points', (stats.totalPoints || 0).toString(), 'trophy')
        ];
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    private getStats(): TypingStats {
        return this.storage.readJSON<TypingStats>('stats.json', DEFAULT_STATS);
    }
}

class DashboardItem extends vscode.TreeItem {
    constructor(label: string, value: string, iconId: string, resourceUri?: string) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.description = value;
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
