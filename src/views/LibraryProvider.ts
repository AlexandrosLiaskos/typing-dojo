import * as vscode from 'vscode';
import { getAllContent, TrainingContent } from '../data/content';

export class LibraryProvider implements vscode.TreeDataProvider<LibraryItem> {
    private static cachedCategories: string[] | null = null;
    private static categoryContentCache = new Map<string, LibraryItem[]>();

    private readonly _onDidChangeTreeData = new vscode.EventEmitter<LibraryItem | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    getTreeItem(element: LibraryItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: LibraryItem): Thenable<LibraryItem[]> {
        if (element) {
            if (element.type === 'category') {
                let items = LibraryProvider.categoryContentCache.get(element.label);
                if (!items) {
                    const filtered = getAllContent().filter(c => c.category === element.label);
                    items = filtered.map(c => new LibraryItem(
                        c.text.length > 50 ? c.text.substring(0, 50) + '...' : c.text,
                        vscode.TreeItemCollapsibleState.None,
                        'content',
                        c
                    ));
                    LibraryProvider.categoryContentCache.set(element.label, items);
                }
                return Promise.resolve(items);
            }
            return Promise.resolve([]);
        } else {
            if (!LibraryProvider.cachedCategories) {
                const categorySet = new Set<string>();
                for (const item of getAllContent()) {
                    categorySet.add(item.category);
                }
                LibraryProvider.cachedCategories = Array.from(categorySet);
            }
            const items = LibraryProvider.cachedCategories.map(c => 
                new LibraryItem(c, vscode.TreeItemCollapsibleState.Collapsed, 'category')
            );
            return Promise.resolve(items);
        }
    }


    refresh(): void {
        LibraryProvider.cachedCategories = null;
        LibraryProvider.categoryContentCache.clear();
        this._onDidChangeTreeData.fire();
    }
}

class LibraryItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly type: 'category' | 'content',
        public readonly content?: TrainingContent
    ) {
        super(label, collapsibleState);
        if (type === 'category') {
            this.description = 'Category';
            this.contextValue = 'category';
            this.iconPath = new vscode.ThemeIcon('symbol-folder');
        } else {
            this.description = content?.difficulty;
            this.contextValue = 'content';
            this.tooltip = content?.text;
            this.iconPath = new vscode.ThemeIcon('file-text');
        }
    }
}
