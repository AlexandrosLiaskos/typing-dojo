import * as fs from 'fs';
import * as path from 'path';
import { TrainingContent, ContentRequest, ContentCategory, ContentLanguage, ContentLength } from './content';

export class ContentLoader {
    private contentCache: Map<string, TrainingContent[]> = new Map();
    private contentDir: string;
    private initialized: boolean = false;

    constructor(storageRoot: string) {
        this.contentDir = path.join(storageRoot, 'content');
    }

    private ensureContentDir(): void {
        if (!fs.existsSync(this.contentDir)) {
            fs.mkdirSync(this.contentDir, { recursive: true });
            this.createDefaultContentFiles();
        }
    }

    private createDefaultContentFiles(): void {
        const categories: ContentCategory[] = ['general', 'code', 'numbers'];

        for (const category of categories) {
            const categoryDir = path.join(this.contentDir, category);
            if (!fs.existsSync(categoryDir)) {
                fs.mkdirSync(categoryDir, { recursive: true });
            }
        }

        const generalContent: TrainingContent[] = [
            {
                id: 'gen_short_1',
                title: 'Pomodoro Basics',
                text: 'The Pomodoro Technique breaks work into focused intervals separated by short breaks. This reduces context switching and protects attention.',
                category: 'general',
                language: 'en',
                difficulty: 'easy',
                length: 'short'
            },
            {
                id: 'gen_med_1',
                title: 'Deep Work',
                text: 'Deep work is the ability to focus without distraction on cognitively demanding tasks. In a world full of notifications, cultivating deep work is a competitive advantage that lets you produce higher-quality output in less time.',
                category: 'general',
                language: 'en',
                difficulty: 'medium',
                length: 'medium'
            },
            {
                id: 'gen_long_1',
                title: 'TCP Three-Way Handshake',
                text: 'Before two computers exchange data over TCP, they perform a three-way handshake. First, the client sends a SYN packet to signal the start of a connection. Second, the server replies with a SYN-ACK to acknowledge the request and advertise its own initial sequence number. Finally, the client responds with an ACK, confirming receipt of the server sequence number. Only after this exchange do both sides consider the connection established and begin sending application data.',
                category: 'general',
                language: 'en',
                difficulty: 'medium',
                length: 'long'
            },
            {
                id: 'gen_huge_1',
                title: 'Caching Fundamentals',
                text: 'Caching is the practice of storing the result of an expensive computation or a remote fetch so that future requests can be served faster. Effective caches start with carefully chosen keys: the key must uniquely identify both the data and the context in which it is valid. Time-to-live values determine how long a cached entry remains trustworthy; overly short TTLs waste work while overly long TTLs risk serving stale data. Layered caches—for example, an in-memory LRU in front of a distributed cache—can dramatically reduce average latency. But every cache introduces complexity: you must handle invalidation, stampedes under coordinated load, and consistency expectations. A well-designed cache is invisible to users except for the feeling that everything is simply more responsive.',
                category: 'general',
                language: 'en',
                difficulty: 'hard',
                length: 'huge'
            }
        ];

        const codeContent: TrainingContent[] = [
            {
                id: 'code_js_1',
                title: 'JavaScript Debounce',
                text: 'function debounce(fn, delay) {\n    let id;\n    return (...args) => {\n        clearTimeout(id);\n        id = setTimeout(() => fn(...args), delay);\n    };\n}',
                category: 'code',
                language: 'js',
                difficulty: 'medium',
                length: 'medium'
            },
            {
                id: 'code_ts_1',
                title: 'TypeScript Result Type',
                text: 'type Result<T, E> =\n    | { ok: true; value: T }\n    | { ok: false; error: E };',
                category: 'code',
                language: 'ts',
                difficulty: 'easy',
                length: 'short'
            },
            {
                id: 'code_py_1',
                title: 'Python Context Manager',
                text: 'from contextlib import contextmanager\n\n@contextmanager\ndef timer(label: str):\n    import time\n    start = time.time()\n    try:\n        yield\n    finally:\n        end = time.time()\n        print(f"{label} took {end - start:.3f}s")',
                category: 'code',
                language: 'py',
                difficulty: 'medium',
                length: 'long'
            },
            {
                id: 'code_rs_1',
                title: 'Rust Fibonacci',
                text: 'fn fibonacci(n: u32) -> u32 {\n    match n {\n        0 => 0,\n        1 => 1,\n        _ => fibonacci(n - 1) + fibonacci(n - 2),\n    }\n}',
                category: 'code',
                language: 'rs',
                difficulty: 'medium',
                length: 'medium'
            },
            {
                id: 'code_html_1',
                title: 'Semantic HTML Layout',
                text: '<main>\n    <header>Typing Training</header>\n    <section aria-label="practice">\n        <article>Improve your speed and accuracy by repeating meaningful passages.</article>\n    </section>\n</main>',
                category: 'code',
                language: 'html',
                difficulty: 'easy',
                length: 'medium'
            },
            {
                id: 'code_md_1',
                title: 'Markdown README Snippet',
                text: '# Typing Training Extension\n\nImprove your typing directly inside VS Code using realistic snippets from code, documentation, and mathematical text.',
                category: 'code',
                language: 'md',
                difficulty: 'easy',
                length: 'short'
            }
        ];

        const numbersContent: TrainingContent[] = [
            {
                id: 'num_short_1',
                title: 'Basic Sequences',
                text: '1 2 3 4 5 6 7 8 9 10',
                category: 'numbers',
                language: 'en',
                difficulty: 'easy',
                length: 'short'
            },
            {
                id: 'num_med_1',
                title: 'Famous Constants',
                text: '3.1415 2.7182 1.6180 0.5772 4.6692',
                category: 'numbers',
                language: 'en',
                difficulty: 'medium',
                length: 'medium'
            },
            {
                id: 'num_long_1',
                title: 'Alternating Patterns',
                text: '98765-43210 | 27182-81828 | 31415-92653 | 00100-11001',
                category: 'numbers',
                language: 'en',
                difficulty: 'hard',
                length: 'long'
            }
        ];

        this.writeContentFile('general', generalContent);
        this.writeContentFile('code', codeContent);
        this.writeContentFile('numbers', numbersContent);
    }

    private writeContentFile(category: ContentCategory, content: TrainingContent[]): void {
        const filePath = path.join(this.contentDir, category, 'index.json');
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
    }

    private loadContentFile(category: ContentCategory): TrainingContent[] {
        const filePath = path.join(this.contentDir, category, 'index.json');

        if (!fs.existsSync(filePath)) {
            return [];
        }

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content) as TrainingContent[];
        } catch (error) {
            console.error(`Failed to load content file ${filePath}:`, error);
            return [];
        }
    }

    public initialize(): void {
        if (this.initialized) {
            return;
        }

        this.ensureContentDir();

        const categories: ContentCategory[] = ['general', 'code', 'numbers'];
        for (const category of categories) {
            const content = this.loadContentFile(category);
            this.contentCache.set(category, content);
        }

        this.initialized = true;
    }

    public getAllContent(): TrainingContent[] {
        this.initialize();

        const allContent: TrainingContent[] = [];
        for (const content of this.contentCache.values()) {
            allContent.push(...content);
        }
        return allContent;
    }

    public getContentByCategory(category: ContentCategory): TrainingContent[] {
        this.initialize();
        return this.contentCache.get(category) || [];
    }

    public getRandomContent(request: ContentRequest): TrainingContent {
        this.initialize();

        const { category, language, length } = request;
        const byCategory = this.getContentByCategory(category);

        const filtered = byCategory.filter((c) => {
            if (language && c.language !== language) return false;
            if (length && c.length !== length) return false;
            return true;
        });

        const pool = filtered.length > 0 ? filtered : byCategory.length > 0 ? byCategory : this.getAllContent();
        return pool[Math.floor(Math.random() * pool.length)];
    }

    public addContent(content: TrainingContent): void {
        this.initialize();

        const categoryContent = this.contentCache.get(content.category) || [];
        categoryContent.push(content);
        this.contentCache.set(content.category, categoryContent);

        this.writeContentFile(content.category, categoryContent);
    }

    public reload(): void {
        this.contentCache.clear();
        this.initialized = false;
        this.initialize();
    }
}
