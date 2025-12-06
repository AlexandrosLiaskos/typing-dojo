import type { TrainingContent, ContentRequest, ContentCategory } from '../types/content';

export const contentLibrary: TrainingContent[] = [
  // General - Short
  {
    id: 'gen_short_1',
    title: 'Pomodoro Basics',
    text: 'The Pomodoro Technique breaks work into focused intervals separated by short breaks. This reduces context switching and protects attention.',
    category: 'general',
    language: 'en',
    difficulty: 'easy',
    length: 'short',
  },
  {
    id: 'gen_short_2',
    title: 'Flow State',
    text: 'Flow is the mental state of complete immersion in an activity. Time seems to disappear and productivity soars.',
    category: 'general',
    language: 'en',
    difficulty: 'easy',
    length: 'short',
  },
  // General - Medium
  {
    id: 'gen_med_1',
    title: 'Deep Work',
    text: 'Deep work is the ability to focus without distraction on cognitively demanding tasks. In a world full of notifications, cultivating deep work is a competitive advantage that lets you produce higher-quality output in less time.',
    category: 'general',
    language: 'en',
    difficulty: 'medium',
    length: 'medium',
  },
  // Code - JavaScript
  {
    id: 'code_js_1',
    title: 'Arrow Functions',
    text: 'const add = (a, b) => a + b;\nconst greet = name => `Hello, ${name}!`;\nconst getUser = () => ({ name: "Alice", age: 30 });',
    category: 'code',
    language: 'js',
    difficulty: 'easy',
    length: 'short',
  },
  {
    id: 'code_js_2',
    title: 'Array Methods',
    text: 'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconst evens = numbers.filter(n => n % 2 === 0);\nconst sum = numbers.reduce((acc, n) => acc + n, 0);',
    category: 'code',
    language: 'js',
    difficulty: 'medium',
    length: 'medium',
  },
  // Code - TypeScript
  {
    id: 'code_ts_1',
    title: 'Type Annotations',
    text: 'interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nfunction getUser(id: number): User | undefined {\n  return users.find(u => u.id === id);\n}',
    category: 'code',
    language: 'ts',
    difficulty: 'medium',
    length: 'medium',
  },
  // Code - Python
  {
    id: 'code_py_1',
    title: 'List Comprehension',
    text: 'squares = [x**2 for x in range(10)]\nevens = [x for x in numbers if x % 2 == 0]\npairs = [(x, y) for x in range(3) for y in range(3)]',
    category: 'code',
    language: 'py',
    difficulty: 'medium',
    length: 'short',
  },
  // Code - Rust
  {
    id: 'code_rs_1',
    title: 'Option Handling',
    text: 'fn find_user(id: u32) -> Option<User> {\n    users.iter().find(|u| u.id == id).cloned()\n}\n\nif let Some(user) = find_user(1) {\n    println!("Found: {}", user.name);\n}',
    category: 'code',
    language: 'rs',
    difficulty: 'hard',
    length: 'medium',
  },
  // Numbers
  {
    id: 'num_short_1',
    title: 'Basic Numbers',
    text: '123 456 789 012 345 678 901 234 567 890',
    category: 'numbers',
    language: 'en',
    difficulty: 'easy',
    length: 'short',
  },
  {
    id: 'num_med_1',
    title: 'Mixed Numbers',
    text: '3.14159 2.71828 1.41421 1.61803 0.57721 2.30258 1.20205 0.69314 1.44466 0.91596',
    category: 'numbers',
    language: 'en',
    difficulty: 'medium',
    length: 'medium',
  },
];

export function getRandomContent(request: ContentRequest): TrainingContent {
  const { category, language, length } = request;
  
  let filtered = contentLibrary.filter(c => c.category === category);
  
  if (language) {
    const byLanguage = filtered.filter(c => c.language === language);
    if (byLanguage.length > 0) filtered = byLanguage;
  }
  
  if (length) {
    const byLength = filtered.filter(c => c.length === length);
    if (byLength.length > 0) filtered = byLength;
  }
  
  if (filtered.length === 0) {
    filtered = contentLibrary.filter(c => c.category === category);
  }
  
  if (filtered.length === 0) {
    filtered = contentLibrary;
  }
  
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getContentByCategory(category: ContentCategory): TrainingContent[] {
  return contentLibrary.filter(c => c.category === category);
}

export function getAllContent(): TrainingContent[] {
  return contentLibrary;
}

