import type { TrainingContent, ContentRequest, ContentCategory } from '../types/content';

export const contentLibrary: TrainingContent[] = [
  // ==================== GENERAL TEXT ====================

  // General - Short (~30 seconds)
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
  {
    id: 'gen_short_3',
    title: 'Morning Routine',
    text: 'A consistent morning routine sets the tone for the entire day. Start with movement, hydration, and a clear intention.',
    category: 'general',
    language: 'en',
    difficulty: 'easy',
    length: 'short',
  },
  {
    id: 'gen_short_4',
    title: 'Active Listening',
    text: 'Active listening means fully concentrating on what is being said rather than passively hearing. It builds trust and understanding.',
    category: 'general',
    language: 'en',
    difficulty: 'easy',
    length: 'short',
  },
  {
    id: 'gen_short_5',
    title: 'Growth Mindset',
    text: 'A growth mindset embraces challenges as opportunities to learn. Failure becomes feedback, not a final verdict on ability.',
    category: 'general',
    language: 'en',
    difficulty: 'easy',
    length: 'short',
  },
  {
    id: 'gen_short_6',
    title: 'Digital Minimalism',
    text: 'Digital minimalism is about being intentional with technology. Use tools that serve your values and ignore the rest.',
    category: 'general',
    language: 'en',
    difficulty: 'easy',
    length: 'short',
  },

  // General - Medium (~1 minute)
  {
    id: 'gen_med_1',
    title: 'Deep Work',
    text: 'Deep work is the ability to focus without distraction on cognitively demanding tasks. In a world full of notifications, cultivating deep work is a competitive advantage that lets you produce higher-quality output in less time. Schedule blocks of uninterrupted time and guard them fiercely.',
    category: 'general',
    language: 'en',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'gen_med_2',
    title: 'The Compound Effect',
    text: 'Small, consistent actions compound over time into remarkable results. Reading ten pages a day becomes fifty books a year. Walking thirty minutes daily transforms your health. The key is consistency, not intensity. Start small, stay steady, and let time work its magic.',
    category: 'general',
    language: 'en',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'gen_med_3',
    title: 'First Principles Thinking',
    text: 'First principles thinking breaks problems down to their fundamental truths. Instead of reasoning by analogy, you question assumptions and rebuild from the ground up. This approach led to innovations like reusable rockets and electric vehicles. Ask: What do we know is definitely true?',
    category: 'general',
    language: 'en',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'gen_med_4',
    title: 'The Feynman Technique',
    text: 'To truly understand something, try explaining it simply. Write down everything you know about a topic as if teaching a child. Identify gaps in your knowledge, return to the source material, and simplify again. This reveals what you actually understand versus what you only memorize.',
    category: 'general',
    language: 'en',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'gen_med_5',
    title: 'Decision Fatigue',
    text: 'Every decision depletes mental energy. By the end of a long day, willpower is exhausted and choices become harder. Combat this by automating routine decisions, making important choices early, and reducing options. This is why many leaders wear the same outfit daily.',
    category: 'general',
    language: 'en',
    difficulty: 'medium',
    length: 'medium',
  },

  // General - Long (~2 minutes)
  {
    id: 'gen_long_1',
    title: 'The Art of Learning',
    text: 'Mastery requires deliberate practice, not just repetition. Deliberate practice means working at the edge of your abilities, receiving immediate feedback, and focusing on specific weaknesses. A chess player who analyzes losses improves faster than one who only plays. A musician who drills difficult passages grows more than one who plays easy songs. Embrace discomfort as a sign of growth. The brain builds new neural pathways when challenged, not when coasting. Set specific goals, track progress, and celebrate small wins along the way.',
    category: 'general',
    language: 'en',
    difficulty: 'medium',
    length: 'long',
  },
  {
    id: 'gen_long_2',
    title: 'Systems vs Goals',
    text: 'Goals are useful for setting direction, but systems determine progress. A goal to write a book is less powerful than a system of writing five hundred words every morning. Goals create a pass-fail dynamic; systems create continuous improvement. When you achieve a goal, you lose motivation. When you follow a system, you build identity. Instead of saying I want to be a runner, become someone who runs every day. The outcome follows naturally from the process. Focus on inputs you control, not outputs you desire.',
    category: 'general',
    language: 'en',
    difficulty: 'medium',
    length: 'long',
  },
  {
    id: 'gen_long_3',
    title: 'Cognitive Load Theory',
    text: 'Working memory can only hold a limited amount of information at once. When learning something new, the brain must process both the content and the format of delivery. Effective teaching minimizes extraneous load, manages intrinsic complexity, and builds schemas for organization. Chunking breaks large concepts into digestible pieces. Spaced repetition strengthens long-term retention. Interleaving different topics improves transfer to new situations. Understanding these principles helps anyone become a more efficient learner and communicator.',
    category: 'general',
    language: 'en',
    difficulty: 'hard',
    length: 'long',
  },

  // ==================== CODE - JAVASCRIPT ====================

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
  {
    id: 'code_js_3',
    title: 'Destructuring',
    text: 'const { name, age } = user;\nconst [first, second, ...rest] = items;\nconst { data: { users } } = response;',
    category: 'code',
    language: 'js',
    difficulty: 'easy',
    length: 'short',
  },
  {
    id: 'code_js_4',
    title: 'Async/Await',
    text: 'async function fetchUser(id) {\n  try {\n    const response = await fetch(`/api/users/${id}`);\n    const user = await response.json();\n    return user;\n  } catch (error) {\n    console.error("Failed to fetch user:", error);\n  }\n}',
    category: 'code',
    language: 'js',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'code_js_5',
    title: 'Promise Chain',
    text: 'fetch("/api/data")\n  .then(res => res.json())\n  .then(data => processData(data))\n  .then(result => saveResult(result))\n  .catch(err => handleError(err))\n  .finally(() => cleanup());',
    category: 'code',
    language: 'js',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'code_js_6',
    title: 'Object Methods',
    text: 'const keys = Object.keys(user);\nconst values = Object.values(user);\nconst entries = Object.entries(user);\nconst merged = { ...defaults, ...options };',
    category: 'code',
    language: 'js',
    difficulty: 'easy',
    length: 'short',
  },
  {
    id: 'code_js_7',
    title: 'Event Handling',
    text: 'element.addEventListener("click", (event) => {\n  event.preventDefault();\n  const target = event.target;\n  console.log("Clicked:", target.id);\n});',
    category: 'code',
    language: 'js',
    difficulty: 'easy',
    length: 'short',
  },
  {
    id: 'code_js_8',
    title: 'Class Definition',
    text: 'class Counter {\n  constructor(initial = 0) {\n    this.count = initial;\n  }\n\n  increment() {\n    this.count += 1;\n  }\n\n  decrement() {\n    this.count -= 1;\n  }\n\n  get value() {\n    return this.count;\n  }\n}',
    category: 'code',
    language: 'js',
    difficulty: 'medium',
    length: 'long',
  },

  // ==================== CODE - TYPESCRIPT ====================

  {
    id: 'code_ts_1',
    title: 'Type Annotations',
    text: 'interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nfunction getUser(id: number): User | undefined {\n  return users.find(u => u.id === id);\n}',
    category: 'code',
    language: 'ts',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'code_ts_2',
    title: 'Generic Function',
    text: 'function first<T>(arr: T[]): T | undefined {\n  return arr.length > 0 ? arr[0] : undefined;\n}\n\nconst num = first([1, 2, 3]);\nconst str = first(["a", "b", "c"]);',
    category: 'code',
    language: 'ts',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'code_ts_3',
    title: 'Type Guards',
    text: 'function isString(value: unknown): value is string {\n  return typeof value === "string";\n}\n\nif (isString(input)) {\n  console.log(input.toUpperCase());\n}',
    category: 'code',
    language: 'ts',
    difficulty: 'medium',
    length: 'short',
  },
  {
    id: 'code_ts_4',
    title: 'Union Types',
    text: 'type Status = "pending" | "success" | "error";\ntype Result<T> = { ok: true; data: T } | { ok: false; error: string };\n\nfunction handle(result: Result<User>) {\n  if (result.ok) {\n    console.log(result.data.name);\n  }\n}',
    category: 'code',
    language: 'ts',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'code_ts_5',
    title: 'Mapped Types',
    text: 'type Readonly<T> = {\n  readonly [K in keyof T]: T[K];\n};\n\ntype Partial<T> = {\n  [K in keyof T]?: T[K];\n};\n\ntype Required<T> = {\n  [K in keyof T]-?: T[K];\n};',
    category: 'code',
    language: 'ts',
    difficulty: 'hard',
    length: 'medium',
  },
  {
    id: 'code_ts_6',
    title: 'Enum Definition',
    text: 'enum Direction {\n  Up = "UP",\n  Down = "DOWN",\n  Left = "LEFT",\n  Right = "RIGHT",\n}\n\nfunction move(dir: Direction): void {\n  console.log(`Moving ${dir}`);\n}',
    category: 'code',
    language: 'ts',
    difficulty: 'easy',
    length: 'short',
  },

  // ==================== CODE - PYTHON ====================

  {
    id: 'code_py_1',
    title: 'List Comprehension',
    text: 'squares = [x**2 for x in range(10)]\nevens = [x for x in numbers if x % 2 == 0]\npairs = [(x, y) for x in range(3) for y in range(3)]',
    category: 'code',
    language: 'py',
    difficulty: 'medium',
    length: 'short',
  },
  {
    id: 'code_py_2',
    title: 'Dictionary Operations',
    text: 'user = {"name": "Alice", "age": 30}\nname = user.get("name", "Unknown")\nuser.update({"city": "Paris"})\nkeys = list(user.keys())',
    category: 'code',
    language: 'py',
    difficulty: 'easy',
    length: 'short',
  },
  {
    id: 'code_py_3',
    title: 'Function Definition',
    text: 'def greet(name: str, greeting: str = "Hello") -> str:\n    """Return a personalized greeting."""\n    return f"{greeting}, {name}!"\n\nmessage = greet("World")',
    category: 'code',
    language: 'py',
    difficulty: 'easy',
    length: 'short',
  },
  {
    id: 'code_py_4',
    title: 'Class Definition',
    text: 'class User:\n    def __init__(self, name: str, email: str):\n        self.name = name\n        self.email = email\n\n    def __repr__(self) -> str:\n        return f"User({self.name!r}, {self.email!r})"',
    category: 'code',
    language: 'py',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'code_py_5',
    title: 'Context Manager',
    text: 'with open("data.txt", "r") as file:\n    content = file.read()\n    lines = content.splitlines()\n    for line in lines:\n        print(line.strip())',
    category: 'code',
    language: 'py',
    difficulty: 'easy',
    length: 'short',
  },
  {
    id: 'code_py_6',
    title: 'Exception Handling',
    text: 'try:\n    result = divide(x, y)\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")\nexcept ValueError as e:\n    print(f"Invalid value: {e}")\nfinally:\n    cleanup()',
    category: 'code',
    language: 'py',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'code_py_7',
    title: 'Lambda and Map',
    text: 'double = lambda x: x * 2\nresult = list(map(double, numbers))\nfiltered = list(filter(lambda x: x > 0, values))\nsorted_items = sorted(items, key=lambda x: x.name)',
    category: 'code',
    language: 'py',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'code_py_8',
    title: 'Async Function',
    text: 'async def fetch_data(url: str) -> dict:\n    async with aiohttp.ClientSession() as session:\n        async with session.get(url) as response:\n            return await response.json()',
    category: 'code',
    language: 'py',
    difficulty: 'hard',
    length: 'short',
  },

  // ==================== CODE - RUST ====================

  {
    id: 'code_rs_1',
    title: 'Option Handling',
    text: 'fn find_user(id: u32) -> Option<User> {\n    users.iter().find(|u| u.id == id).cloned()\n}\n\nif let Some(user) = find_user(1) {\n    println!("Found: {}", user.name);\n}',
    category: 'code',
    language: 'rs',
    difficulty: 'hard',
    length: 'medium',
  },
  {
    id: 'code_rs_2',
    title: 'Result Type',
    text: 'fn divide(a: i32, b: i32) -> Result<i32, String> {\n    if b == 0 {\n        Err("Division by zero".to_string())\n    } else {\n        Ok(a / b)\n    }\n}',
    category: 'code',
    language: 'rs',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'code_rs_3',
    title: 'Struct Definition',
    text: '#[derive(Debug, Clone)]\nstruct User {\n    id: u32,\n    name: String,\n    email: String,\n}\n\nimpl User {\n    fn new(name: &str) -> Self {\n        Self { id: 0, name: name.to_string(), email: String::new() }\n    }\n}',
    category: 'code',
    language: 'rs',
    difficulty: 'medium',
    length: 'long',
  },
  {
    id: 'code_rs_4',
    title: 'Pattern Matching',
    text: 'match value {\n    0 => println!("zero"),\n    1..=9 => println!("single digit"),\n    n if n < 0 => println!("negative"),\n    _ => println!("other"),\n}',
    category: 'code',
    language: 'rs',
    difficulty: 'medium',
    length: 'short',
  },
  {
    id: 'code_rs_5',
    title: 'Iterator Chain',
    text: 'let result: Vec<i32> = numbers\n    .iter()\n    .filter(|&n| n % 2 == 0)\n    .map(|n| n * 2)\n    .collect();',
    category: 'code',
    language: 'rs',
    difficulty: 'medium',
    length: 'short',
  },
  {
    id: 'code_rs_6',
    title: 'Ownership and Borrowing',
    text: 'fn process(data: &str) -> String {\n    data.to_uppercase()\n}\n\nlet text = String::from("hello");\nlet result = process(&text);\nprintln!("{} -> {}", text, result);',
    category: 'code',
    language: 'rs',
    difficulty: 'hard',
    length: 'short',
  },

  // ==================== NUMBERS ====================

  // Numbers - Short
  {
    id: 'num_short_1',
    title: 'Basic Digits',
    text: '123 456 789 012 345 678 901 234 567 890',
    category: 'numbers',
    language: 'en',
    difficulty: 'easy',
    length: 'short',
  },
  {
    id: 'num_short_2',
    title: 'Phone Numbers',
    text: '555-1234 800-555-0199 +1-212-555-3456 123-456-7890',
    category: 'numbers',
    language: 'en',
    difficulty: 'medium',
    length: 'short',
  },
  {
    id: 'num_short_3',
    title: 'Dates',
    text: '2024-01-15 12/25/2023 2023.06.30 01-01-2000 2025/12/31',
    category: 'numbers',
    language: 'en',
    difficulty: 'medium',
    length: 'short',
  },
  {
    id: 'num_short_4',
    title: 'Currency',
    text: '$19.99 $1,234.56 $99.00 $5.50 $10,000.00 $0.99',
    category: 'numbers',
    language: 'en',
    difficulty: 'medium',
    length: 'short',
  },

  // Numbers - Medium
  {
    id: 'num_med_1',
    title: 'Mathematical Constants',
    text: '3.14159 2.71828 1.41421 1.61803 0.57721 2.30258 1.20205 0.69314 1.44466 0.91596',
    category: 'numbers',
    language: 'en',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'num_med_2',
    title: 'IP Addresses',
    text: '192.168.1.1 10.0.0.255 172.16.0.100 8.8.8.8 127.0.0.1 255.255.255.0',
    category: 'numbers',
    language: 'en',
    difficulty: 'medium',
    length: 'medium',
  },
  {
    id: 'num_med_3',
    title: 'Percentages',
    text: '25% 50% 75% 100% 12.5% 33.33% 66.67% 99.9% 0.1% 150%',
    category: 'numbers',
    language: 'en',
    difficulty: 'easy',
    length: 'medium',
  },
  {
    id: 'num_med_4',
    title: 'Coordinates',
    text: '(40.7128, -74.0060) (51.5074, -0.1278) (35.6762, 139.6503) (48.8566, 2.3522)',
    category: 'numbers',
    language: 'en',
    difficulty: 'hard',
    length: 'medium',
  },

  // Numbers - Long
  {
    id: 'num_long_1',
    title: 'Mixed Number Formats',
    text: '1,234,567.89 -456.78 +123.45 0.001 1e10 2.5e-3 1/2 3/4 5/8 7/16 $99.99 50% 192.168.0.1 2024-12-25 555-0123 #FF00FF',
    category: 'numbers',
    language: 'en',
    difficulty: 'hard',
    length: 'long',
  },
  {
    id: 'num_long_2',
    title: 'Credit Card Practice',
    text: '4532-1234-5678-9012 5412-7534-9821-0043 3782-822463-10005 6011-0009-9013-9424',
    category: 'numbers',
    language: 'en',
    difficulty: 'medium',
    length: 'long',
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

