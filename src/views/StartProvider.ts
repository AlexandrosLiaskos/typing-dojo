import * as vscode from 'vscode';
import type { ContentCategory, ContentLanguage, ContentLength, ContentRequest } from '../data/content';

// We expose a structured Start view:
// - General text grouped by passage length
// - Code grouped by programming / markup language
// - Numbers grouped by length
// - Plus explicit actions for completing a session and opening the session guide

type StartNodeKind =
    | 'section-general'
    | 'section-code'
    | 'section-numbers'
    | 'length-general'
    | 'length-numbers'
    | 'language-code'
    | 'action';

interface BaseNode {
    kind: StartNodeKind;
    label: string;
    description?: string;
    icon?: string;
}

interface GeneralLengthNode extends BaseNode {
    kind: 'length-general';
    category: ContentCategory;
    length: ContentLength;
}

interface NumbersLengthNode extends BaseNode {
    kind: 'length-numbers';
    category: ContentCategory;
    length: ContentLength;
}

interface CodeLanguageNode extends BaseNode {
    kind: 'language-code';
    category: ContentCategory;
    language: ContentLanguage;
}

interface SectionNode extends BaseNode {
    kind: 'section-general' | 'section-code' | 'section-numbers';
}

interface ActionNode extends BaseNode {
    kind: 'action';
    command: string;
    tooltip: string;
}

type StartNode = SectionNode | GeneralLengthNode | NumbersLengthNode | CodeLanguageNode | ActionNode;

const ROOT_NODES: StartNode[] = [
    {
        kind: 'section-general',
        label: 'General Text (by length)',
        description: 'Short, medium, long and huge knowledge-rich passages.',
        icon: 'book'
    },
    {
        kind: 'section-code',
        label: 'Code (by language / markup)',
        description: 'JavaScript, TypeScript, Python, Rust, HTML, Markdown.',
        icon: 'code'
    },
    {
        kind: 'section-numbers',
        label: 'Numbers',
        description: 'Sequences and constants grouped by length.',
        icon: 'symbol-number'
    },
    {
        kind: 'action',
        label: 'Complete Current Session',
        description: 'Manually finish the active typing session and record your score.',
        icon: 'check',
        command: 'typing-training.completeSession',
        tooltip: 'Use this when you reached the end of a passage or want to stop early.'
    },
    {
        kind: 'action',
        label: 'Show Guide',
        description: 'Learn how to use Typing Training.',
        icon: 'question',
        command: 'typing-training.showGuide',
        tooltip: 'Opens a guide explaining how to use this extension.'
    }
];

const GENERAL_LENGTH_NODES: GeneralLengthNode[] = [
    {
        kind: 'length-general',
        label: 'Short passages',
        description: 'Warm-up sentences and quick concepts.',
        icon: 'symbol-key',
        category: 'general',
        length: 'short'
    },
    {
        kind: 'length-general',
        label: 'Medium passages',
        description: 'A few paragraphs about focused work.',
        icon: 'versions',
        category: 'general',
        length: 'medium'
    },
    {
        kind: 'length-general',
        label: 'Long passages',
        description: 'Deeper technical explanations.',
        icon: 'book',
        category: 'general',
        length: 'long'
    },
    {
        kind: 'length-general',
        label: 'Huge passages',
        description: 'Long-form, knowledge-dense texts.',
        icon: 'notebook',
        category: 'general',
        length: 'huge'
    }
];

const CODE_LANGUAGE_NODES: CodeLanguageNode[] = [
    {
        kind: 'language-code',
        label: 'JavaScript',
        description: 'Practical JS snippets and utilities.',
        icon: 'symbol-file',
        category: 'code',
        language: 'js'
    },
    {
        kind: 'language-code',
        label: 'TypeScript',
        description: 'Strongly-typed patterns and helpers.',
        icon: 'symbol-class',
        category: 'code',
        language: 'ts'
    },
    {
        kind: 'language-code',
        label: 'Python',
        description: 'Scripting and data structures.',
        icon: 'symbol-method',
        category: 'code',
        language: 'py'
    },
    {
        kind: 'language-code',
        label: 'Rust',
        description: 'Ownership and systems-level snippets.',
        icon: 'debug',
        category: 'code',
        language: 'rs'
    },
    {
        kind: 'language-code',
        label: 'HTML',
        description: 'Semantic markup and layout.',
        icon: 'code',
        category: 'code',
        language: 'html'
    },
    {
        kind: 'language-code',
        label: 'Markdown',
        description: 'README-style documentation.',
        icon: 'markdown',
        category: 'code',
        language: 'md'
    }
];

const NUMBERS_LENGTH_NODES: NumbersLengthNode[] = [
    {
        kind: 'length-numbers',
        label: 'Short sequences',
        description: 'Simple counting patterns.',
        icon: 'symbol-number',
        category: 'numbers',
        length: 'short'
    },
    {
        kind: 'length-numbers',
        label: 'Constants',
        description: 'Famous mathematical constants.',
        icon: 'symbol-constant',
        category: 'numbers',
        length: 'medium'
    },
    {
        kind: 'length-numbers',
        label: 'Long numeric strings',
        description: 'Alternating numeric patterns.',
        icon: 'symbol-array',
        category: 'numbers',
        length: 'long'
    }
];

export class StartProvider implements vscode.TreeDataProvider<StartItem> {
    public static readonly viewId = 'typing-training-start-view';

    private readonly _onDidChangeTreeData = new vscode.EventEmitter<StartItem | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    getTreeItem(element: StartItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: StartItem): Thenable<StartItem[]> {
        let result: StartItem[];
        if (!element) {
            result = ROOT_NODES.map((node) => new StartItem(node));
        } else {
            switch (element.node.kind) {
                case 'section-general':
                    result = GENERAL_LENGTH_NODES.map((n) => new StartItem(n));
                    break;
                case 'section-code':
                    result = CODE_LANGUAGE_NODES.map((n) => new StartItem(n));
                    break;
                case 'section-numbers':
                    result = NUMBERS_LENGTH_NODES.map((n) => new StartItem(n));
                    break;
                default:
                    result = [];
            }
        }
        
        return Promise.resolve(result);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}

export class StartItem extends vscode.TreeItem {
    constructor(public readonly node: StartNode) {
        super(node.label, inferCollapsibleState(node));
        this.description = node.description;
        if (node.icon) {
            this.iconPath = new vscode.ThemeIcon(node.icon);
        }

        if (node.kind === 'length-general' || node.kind === 'length-numbers') {
            const request: ContentRequest = {
                category: node.category,
                length: node.length
            };
            this.tooltip = `Start a ${node.length} ${node.category} passage.`;
            this.command = {
                command: 'typing-training.startSession',
                title: 'Start Session',
                arguments: [request]
            };
        } else if (node.kind === 'language-code') {
            const request: ContentRequest = {
                category: node.category,
                language: node.language
            };
            this.tooltip = `Start a ${node.label} code snippet session.`;
            this.command = {
                command: 'typing-training.startSession',
                title: 'Start Session',
                arguments: [request]
            };
        } else if (node.kind === 'action') {
            this.tooltip = node.tooltip;
            this.command = {
                command: node.command,
                title: node.label,
                arguments: []
            };
        }
    }
}

function inferCollapsibleState(node: StartNode): vscode.TreeItemCollapsibleState {
    switch (node.kind) {
        case 'section-general':
        case 'section-code':
        case 'section-numbers':
            return vscode.TreeItemCollapsibleState.Collapsed;
        default:
            return vscode.TreeItemCollapsibleState.None;
    }
}
