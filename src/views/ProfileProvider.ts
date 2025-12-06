import * as vscode from 'vscode';
import { FileStorage } from '../storage/file-storage';
import { ProfileData, DEFAULT_PROFILE } from '../storage/types';

export class ProfileProvider implements vscode.TreeDataProvider<ProfileItem> {
    public static readonly viewId = 'typing-training-profile-view';

    private readonly _onDidChangeTreeData = new vscode.EventEmitter<ProfileItem | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private readonly storage: FileStorage) {}

    getTreeItem(element: ProfileItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ProfileItem): Promise<ProfileItem[]> {
        if (element) {
            return [];
        }
        const profile = this.getProfile();
        const profileFile = this.storage.getFilePath('profile.json');
        return [
            new ProfileItem('📄 View Profile File', 'Click to open', 'file', 'profile:file', profileFile),
            new ProfileItem('Name', profile.name || 'Guest User', 'account', 'profile:name'),
            new ProfileItem('Email', profile.email || 'Not set', 'mail', 'profile:email'),
            new ProfileItem(
                'GitHub',
                profile.githubConnected ? 'Connected' : 'Not connected',
                profile.githubConnected ? 'github' : 'plug',
                'profile:github'
            )
        ];
    }

    async promptForField(field: 'name' | 'email'): Promise<void> {
        const profile = this.getProfile();
        const value = await vscode.window.showInputBox({
            title: `Update ${field === 'name' ? 'Name' : 'Email'}`,
            value: profile[field] || '',
            placeHolder: field === 'name' ? 'Ada Lovelace' : 'ada@example.com',
            validateInput: (text) =>
                field === 'email' && text && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text)
                    ? 'Enter a valid email address'
                    : undefined
        });

        if (value === undefined) {
            return;
        }

        this.storage.writeJSON('profile.json', {
            ...profile,
            [field]: value.trim()
        });
        this.refresh();
        vscode.window.showInformationMessage(`Profile ${field} updated.`);
    }

    async connectGitHub(): Promise<void> {
        const profile = this.getProfile();
        if (profile.githubConnected) {
            vscode.window.showInformationMessage('GitHub is already connected.');
            return;
        }

        this.storage.writeJSON('profile.json', {
            ...profile,
            githubConnected: true
        });
        this.refresh();
        vscode.window.showInformationMessage('GitHub connection simulated.');
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    private getProfile(): ProfileData {
        return this.storage.readJSON<ProfileData>('profile.json', DEFAULT_PROFILE);
    }
}

class ProfileItem extends vscode.TreeItem {
    constructor(
        label: string,
        value: string,
        iconId: string,
        contextValue: string,
        resourceUri?: string
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.description = value;
        this.iconPath = new vscode.ThemeIcon(iconId);
        this.contextValue = contextValue;
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
