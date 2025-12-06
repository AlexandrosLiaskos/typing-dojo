import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class FileStorage {
    private storageDir: string;

    constructor(storageRoot: string) {
        this.storageDir = storageRoot;
        this.ensureStorageDir();
    }

    private ensureStorageDir() {
        if (!fs.existsSync(this.storageDir)) {
            fs.mkdirSync(this.storageDir, { recursive: true });
            // Copy README template
            const templatePath = path.join(__dirname, '../../.typing-training-template/README.md');
            const readmePath = path.join(this.storageDir, 'README.md');
            if (fs.existsSync(templatePath)) {
                fs.copyFileSync(templatePath, readmePath);
            }
        }
    }

    public getFilePath(filename: string): string {
        return path.join(this.storageDir, filename);
    }

    public readJSON<T>(filename: string, defaultValue: T): T {
        const filePath = this.getFilePath(filename);
        if (!fs.existsSync(filePath)) {
            this.writeJSON(filename, defaultValue);
            return defaultValue;
        }
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            return defaultValue;
        }
    }

    public writeJSON<T>(filename: string, data: T): void {
        const filePath = this.getFilePath(filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    public async openFile(filename: string): Promise<void> {
        const filePath = this.getFilePath(filename);
        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc);
    }

    public getStorageDir(): string {
        return this.storageDir;
    }
}
