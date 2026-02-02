// IndexedDB Todo 应用数据库

const DB_NAME = 'TodoAppDB';
const DB_VERSION = 1;
const STORE_CATEGORIES = 'categories';
const STORE_TODOS = 'todos';

// 莫兰迪色系配色方案
export const TODO_TYPE_COLORS = {
  onetime: {
    name: '一次性',
    color: '#7c9cb5',      // 雾蓝
    bgLight: 'bg-slate-200',
    bgDark: 'bg-slate-800/50',
    textLight: 'text-slate-700',
    textDark: 'text-slate-300',
    dot: 'bg-slate-400',
  },
  fixedRepeat: {
    name: '固定重复',
    color: '#9b8aa5',      // 藕紫
    bgLight: 'bg-purple-200',
    bgDark: 'bg-purple-900/30',
    textLight: 'text-purple-700',
    textDark: 'text-purple-300',
    dot: 'bg-purple-400',
  },
  allDayRepeat: {
    name: '全天候',
    color: '#8db4a0',      // 豆绿
    bgLight: 'bg-emerald-200',
    bgDark: 'bg-emerald-900/30',
    textLight: 'text-emerald-700',
    textDark: 'text-emerald-300',
    dot: 'border-2 border-emerald-400 bg-transparent',
  },
  planned: {
    name: '计划',
    color: '#c9a86c',      // 暖黄
    bgLight: 'bg-amber-200',
    bgDark: 'bg-amber-900/30',
    textLight: 'text-amber-700',
    textDark: 'text-amber-300',
    dot: 'bg-amber-400',
    underline: true,
  },
  yearly: {
    name: '全年',
    color: '#b0706e',      // 砖红
    bgLight: 'bg-rose-200',
    bgDark: 'bg-rose-900/30',
    textLight: 'text-rose-700',
    textDark: 'text-rose-300',
    dot: 'border-2 border-rose-400 bg-transparent',
  },
} as const;

export type TodoType = keyof typeof TODO_TYPE_COLORS;

// 时间段配置
export interface TimeSlot {
  startTime: string;    // HH:mm
  endTime: string;      // HH:mm
}

// 计划节点
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
  
  // 新类型系统
  todoType: TodoType;
  
  // 通知开关
  enableNotification: boolean;
  
  // 基础时间（一次性、全天候使用）
  date: string;
  
  // 结束日期（计划类型使用）
  endDate?: string;
  
  // 是否为全天
  isAllDay?: boolean;
  
  // 具体时间
  specificTime?: string;
  
  // 固定时间重复专用
  timeSlots?: TimeSlot[];
  repeatInterval?: number;
  repeatUnit?: 'minutes' | 'hours';
  
  // 计划类型专用
  planNodes?: PlanNode[];
  
  // 全年计划专用
  year?: number;
  
  // 兼容旧数据（可选）
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

// 打开数据库
export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 创建分类存储
      if (!db.objectStoreNames.contains(STORE_CATEGORIES)) {
        const categoryStore = db.createObjectStore(STORE_CATEGORIES, { keyPath: 'id' });
        categoryStore.createIndex('name', 'name', { unique: false });
      }

      // 创建待办存储
      if (!db.objectStoreNames.contains(STORE_TODOS)) {
        const todoStore = db.createObjectStore(STORE_TODOS, { keyPath: 'id' });
        todoStore.createIndex('category', 'category', { unique: false });
        todoStore.createIndex('date', 'date', { unique: false });
        todoStore.createIndex('completed', 'completed', { unique: false });
      }
    };
  });
}

// 分类操作
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

    // 清空现有数据
    store.clear();

    // 批量添加
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

// 待办操作
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

    // 清空现有数据
    store.clear();

    // 批量添加
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

// 初始化默认数据
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

  // 如果没有数据，初始化默认数据
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
