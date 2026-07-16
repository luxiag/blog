'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const CodeRunnerEditor = dynamic(() => import('./CodeRunnerEditor'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-[var(--border-color)] border-t-[#ea580c] rounded-full animate-spin" />
                <div className="font-mono text-[11px] tracking-widest uppercase text-[var(--foreground)] opacity-30">
                    Loading Code Runner...
                </div>
            </div>
        </div>
    ),
});

const codeSnippets: Record<string, Record<string, string>> = {
    javascript: {
        hello: `console.log('Hello, World!');`,
        fibonacci: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}`,
        sort: `const arr = [64, 34, 25, 12, 22, 11, 90];

arr.sort((a, b) => a - b);
console.log('Sorted:', arr.join(', '));`,
        closure: `function counter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}

const c = counter();
console.log(c.increment());
console.log(c.increment());
console.log(c.decrement());
console.log('Current:', c.value());`,
        promise: `function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Start...');
  await delay(500);
  console.log('500ms passed');
  await delay(500);
  console.log('1s passed');
  console.log('Done!');
}

main();`,
        regex: `const text = 'Contact us at hello@example.com or support@test.org';
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g;

const matches = text.match(emailRegex);
console.log('Found emails:', matches);

const replaced = text.replace(emailRegex, '[REDACTED]');
console.log('Redacted:', replaced);`,
        table: `const users = [
  { name: 'Alice', age: 30, city: 'Beijing' },
  { name: 'Bob', age: 25, city: 'Shanghai' },
  { name: 'Charlie', age: 35, city: 'Shenzhen' },
];

console.table(users);

const ages = users.map(u => u.age);
console.log('Average age:', ages.reduce((a, b) => a + b, 0) / ages.length);`,
        destructuring: `const person = {
  name: 'Alice',
  age: 30,
  address: {
    city: 'Beijing',
    zip: '100000'
  }
};

const { name, age, address: { city } } = person;
console.log(name, age, city);

const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log('First:', first);
console.log('Rest:', rest);`,
    },
    typescript: {
        hello: `interface User {
  name: string;
  age: number;
}

const user: User = { name: 'Alice', age: 30 };
console.log(\`Hello, \${user.name}! You are \${user.age} years old.\`);`,
        generic: `function identity<T>(arg: T): T {
  return arg;
}

console.log(identity('hello'));
console.log(identity(42));
console.log(identity(true));`,
        enum_example: `enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

function move(dir: Direction): string {
  return \`Moving \${dir}\`;
}

console.log(move(Direction.Up));
console.log(move(Direction.Right));`,
        utility_types: `interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

type UserPreview = Pick<User, 'id' | 'name'>;
type UserCreate = Omit<User, 'id'>;
type ReadOnlyUser = Readonly<User>;

const preview: UserPreview = { id: 1, name: 'Alice' };
console.log('Preview:', JSON.stringify(preview));`,
        async_type: `interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchUser(id: number): Promise<ApiResponse<{ name: string; age: number }>> {
  return {
    data: { name: 'Alice', age: 30 },
    status: 200,
    message: 'OK'
  };
}

fetchUser(1).then(res => {
  console.log(\`\${res.data.name} (age: \${res.data.age})\`);
  console.log(\`Status: \${res.status}\`);
});`,
    },
    python: {
        hello: `print('Hello, World!')`,
        list: `fruits = ['apple', 'banana', 'cherry']
for fruit in fruits:
    print(f'I like {fruit}')`,
        dict: `person = {
    'name': 'Alice',
    'age': 30,
    'city': 'Beijing'
}

for key, value in person.items():
    print(f'{key}: {value}')`,
        comprehension: `squares = [x**2 for x in range(10)]
print('Squares:', squares)

evens = [x for x in range(20) if x % 2 == 0]
print('Evens:', evens)

matrix = [[i*3+j for j in range(3)] for i in range(3)]
for row in matrix:
    print(row)`,
        class_example: `class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

    def speak(self):
        return f'{self.name} says {self.sound}!'

class Dog(Animal):
    def __init__(self, name):
        super().__init__(name, 'Woof')

    def fetch(self, item):
        return f'{self.name} fetches the {item}'

dog = Dog('Rex')
print(dog.speak())
print(dog.fetch('ball'))`,
        decorator: `import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f'{func.__name__} took {elapsed:.4f}s')
        return result
    return wrapper

@timer
def slow_sum(n):
    return sum(range(n))

result = slow_sum(1_000_000)
print(f'Result: {result}')`,
    },
};

export default function CodeRunnerPage() {
    return (
        <div className="h-[calc(100vh-45px)] flex flex-col bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--background)] border-b border-[var(--border-color)]">
                <div className="flex items-center gap-4">
                    <Link href="/tools" className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--foreground)] opacity-40 hover:opacity-70 transition-opacity uppercase tracking-wider">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7-7 7 7 7" /></svg>
                        Tools
                    </Link>
                    <div className="w-px h-3 bg-[var(--border-color)]" />
                    <span className="text-[12px] font-mono text-[var(--foreground)] opacity-50">Code Runner</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-[var(--foreground)] opacity-20 tracking-wider">⌘+ENTER TO RUN</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <CodeRunnerEditor snippets={codeSnippets} />
            </div>
        </div>
    );
}
