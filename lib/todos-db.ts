// IndexedDB Todo Application Database

const DB_NAME = 'TodoAppDB';
const DB_VERSION = 1;
const STORE_CATEGORIES = 'categories';
const STORE_TODOS = 'todos';

// 新颜色方案（根据设计文档）
export const TODO_TYPE_COLORS = {
  onetime: {
    name: 'One-time',
    color: '#6366F1',      // Indigo
    bgLight: 'bg-indigo-100',
    bgDark: 'bg-indigo-900/30',
    textLight: 'text-indigo-800',
    textDark: 'text-indigo-300',
    lightBg: '#EEF2FF',
    darkMain: '#4F46E5',
    textColor: '#4338CA',
  },
  fixedRepeat: {
    name: 'Fixed Repeat',
    color: '#10B981',      // Emerald
    bgLight: 'bg-emerald-100',
    bgDark: 'bg-emerald-900/30',
    textLight: 'text-emerald-800',
    textDark: 'text-emerald-300',
    lightBg: '#ECFDF5',
    darkMain: '#059669',
    textColor: '#047857',
  },
  allDayRepeat: {
    name: 'All-day Repeat',
    color: '#F59E0B',      // Amber
    bgLight: 'bg-amber-100',
    bgDark: 'bg-amber-900/30',
    textLight: 'text-amber-800',
    textDark: 'text-amber-300',
    lightBg: '#FEF3C7',
    darkMain: '#D97706',
    textColor: '#B45309',
  },
  planned: {
    name: 'Plan',
    color: '#3B82F6',      // Blue
    bgLight: 'bg-blue-100',
    bgDark: 'bg-blue-900/30',
    textLight: 'text-blue-800',
    textDark: 'text-blue-300',
    lightBg: '#EFF6FF',
    darkMain: '#2563EB',
    textColor: '#1D4ED8',
  },
  yearly: {
    name: 'Yearly',
    color: '#EAB308',      // Yellow
    bgLight: 'bg-yellow-100',
    bgDark: 'bg-yellow-900/30',
    textLight: 'text-yellow-800',
    textDark: 'text-yellow-300',
    lightBg: '#FEFCE8',
    darkMain: '#CA8A04',
    textColor: '#A16207',
  },
} as const;

export type TodoType = keyof typeof TODO_TYPE_COLORS;

// One-time task time mode
export type DateTimeMode = 'full_day' | 'specific_time' | 'time_range';

// Time slot configuration
export interface TimeSlot {
  startTime: string;    // HH:mm
  endTime: string;      // HH:mm
  label?: string;       // Time slot label (e.g. "Morning Work")
}

// Plan node
export interface PlanNode {
  date: string;
  time?: string;
  notificationType: 'once' | 'daily';
}

export interface Todo {
  id: number;
  title: string;
  category: string;
  completed: boolean;
  isImportant: boolean;
  
  // New type system
  todoType: TodoType;
  
  // Notification toggle
  enableNotification: boolean;
  
  // Base date
  date: string;
  
  // End date (used by plan type)
  endDate?: string;
  
  // One-time task specific: time mode
  dateTimeMode?: DateTimeMode;
  
  // One-time task specific: time range (start and end time)
  startTime?: string;   // HH:mm
  endTime?: string;     // HH:mm
  
  // All-day repeat specific: daily time point
  specificTime?: string; // HH:mm
  
  // Fixed time repeat specific
  timeSlots?: TimeSlot[];
  repeatInterval?: number;
  repeatUnit?: 'minutes' | 'hours';
  
  // Plan type specific
  planNodes?: PlanNode[];
  
  // Yearly plan specific
  year?: number;
  
  // Legacy compatibility (optional)
  isAllDay?: boolean;
  isDaily?: boolean;
  repeatType?: 'none' | 'daily' | 'interval';
  reminderTime?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  isCustom?: boolean;
}

// Open database
export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create category store
      if (!db.objectStoreNames.contains(STORE_CATEGORIES)) {
        const categoryStore = db.createObjectStore(STORE_CATEGORIES, { keyPath: 'id' });
        categoryStore.createIndex('name', 'name', { unique: false });
      }

      // Create todo store
      if (!db.objectStoreNames.contains(STORE_TODOS)) {
        const todoStore = db.createObjectStore(STORE_TODOS, { keyPath: 'id' });
        todoStore.createIndex('category', 'category', { unique: false });
        todoStore.createIndex('date', 'date', { unique: false });
        todoStore.createIndex('completed', 'completed', { unique: false });
      }
    };
  });
}

// Category operations
export async function getCategories(): Promise<Category[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_CATEGORIES, 'readonly');
    const store = transaction.objectStore(STORE_CATEGORIES);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function saveCategories(categories: Category[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_CATEGORIES, 'readwrite');
    const store = transaction.objectStore(STORE_CATEGORIES);

    // Clear existing data
    store.clear();

    // Batch add
    categories.forEach((cat) => store.put(cat));

    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}

export async function addCategory(category: Category): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_CATEGORIES, 'readwrite');
    const store = transaction.objectStore(STORE_CATEGORIES);
    const request = store.put(category);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function deleteCategory(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_CATEGORIES, 'readwrite');
    const store = transaction.objectStore(STORE_CATEGORIES);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function updateCategory(category: Category): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_CATEGORIES, 'readwrite');
    const store = transaction.objectStore(STORE_CATEGORIES);
    const request = store.put(category);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Todo operations
export async function getTodos(): Promise<Todo[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_TODOS, 'readonly');
    const store = transaction.objectStore(STORE_TODOS);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function saveTodos(todos: Todo[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_TODOS, 'readwrite');
    const store = transaction.objectStore(STORE_TODOS);

    // Clear existing data
    store.clear();

    // Batch add
    todos.forEach((todo) => store.put(todo));

    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}

export async function addTodo(todo: Todo): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_TODOS, 'readwrite');
    const store = transaction.objectStore(STORE_TODOS);
    const request = store.put(todo);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function deleteTodo(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_TODOS, 'readwrite');
    const store = transaction.objectStore(STORE_TODOS);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function updateTodo(todo: Todo): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_TODOS, 'readwrite');
    const store = transaction.objectStore(STORE_TODOS);
    const request = store.put(todo);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Initialize default data
export async function initializeData(): Promise<{ categories: Category[]; todos: Todo[] }> {
  const defaultCategories: Category[] = [
    { id: 'all', name: 'All', icon: 'grid' },
    { id: 'personal', name: 'Personal', icon: 'user' },
    { id: 'work', name: 'Work', icon: 'briefcase' },
  ];
  
  const today = new Date().toISOString().split('T')[0];
  const defaultTodos: Todo[] = [
    { id: 1, title: 'Make UI design', category: 'personal', date: today, completed: false, isImportant: true, todoType: 'onetime', enableNotification: false },
    { id: 2, title: 'Code prototype', category: 'work', date: today, completed: false, isImportant: true, todoType: 'onetime', enableNotification: false },
    { id: 3, title: 'User testing', category: 'work', date: today, completed: true, isImportant: false, todoType: 'planned', enableNotification: false, endDate: today },
    { id: 4, title: 'Handover', category: 'work', date: today, completed: false, isImportant: true, todoType: 'yearly', enableNotification: true, year: new Date().getFullYear() },
    { id: 5, title: 'Team sync', category: 'work', date: today, completed: false, isImportant: false, todoType: 'fixedRepeat', enableNotification: true, timeSlots: [{ startTime: '09:00', endTime: '10:00' }], repeatInterval: 30, repeatUnit: 'minutes' },
    { id: 6, title: 'Read book', category: 'personal', date: today, completed: false, isImportant: false, todoType: 'onetime', enableNotification: false },
    { id: 7, title: 'Exercise', category: 'personal', date: today, completed: false, isImportant: true, todoType: 'allDayRepeat', enableNotification: true, specificTime: '18:00' },
    { id: 8, title: 'Morning Standup', category: 'work', date: today, completed: false, isImportant: true, todoType: 'allDayRepeat', enableNotification: true, specificTime: '09:00' },
    { id: 9, title: 'Drink Water', category: 'personal', date: today, completed: false, isImportant: false, todoType: 'fixedRepeat', enableNotification: true, timeSlots: [{ startTime: '08:00', endTime: '20:00' }], repeatInterval: 60, repeatUnit: 'minutes' },
  ];

  const existingCategories = await getCategories();
  const existingTodos = await getTodos();

  // If no data, initialize default data
  if (existingCategories.length === 0) {
    await saveCategories(defaultCategories);
  }

  if (existingTodos.length === 0) {
    await saveTodos(defaultTodos);
  }

  return {
    categories: existingCategories.length > 0 ? existingCategories : defaultCategories,
    todos: existingTodos.length > 0 ? existingTodos : defaultTodos,
  };
}

export async function getDailyTodos(): Promise<Todo[]> {
  const todos = await getTodos();
  return todos.filter(todo => 
    todo.todoType === 'allDayRepeat' || 
    todo.todoType === 'fixedRepeat' ||
    todo.isDaily || 
    todo.repeatType === 'daily' || 
    todo.repeatType === 'interval'
  );
}

export async function resetDailyTodosForNewDay(): Promise<void> {
  const todos = await getTodos();
  const today = new Date().toISOString().split('T')[0];
  const repeatingTodos = todos.filter(todo => 
    todo.todoType === 'allDayRepeat' || 
    todo.todoType === 'fixedRepeat' ||
    todo.isDaily || 
    todo.repeatType === 'daily' || 
    todo.repeatType === 'interval'
  );

  for (const todo of repeatingTodos) {
    const updatedTodo = { ...todo, date: today, completed: false };
    await updateTodo(updatedTodo);
  }
}
