// IndexedDB Todo 应用数据库

const DB_NAME = 'TodoAppDB';
const DB_VERSION = 1;
const STORE_CATEGORIES = 'categories';
const STORE_TODOS = 'todos';

export interface Todo {
  id: number;
  title: string;
  category: string;
  date: string;
  completed: boolean;
  isImportant: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  isCustom?: boolean;
}

// 打开数据库
function openDB(): Promise<IDBDatabase> {
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
  const existingCategories = await getCategories();
  const existingTodos = await getTodos();

  // 如果没有数据，初始化默认数据
  if (existingCategories.length === 0) {
    const defaultCategories: Category[] = [
      { id: 'all', name: 'All', icon: 'grid' },
      { id: 'personal', name: 'Personal', icon: 'user' },
      { id: 'work', name: 'Work', icon: 'briefcase' },
    ];
    await saveCategories(defaultCategories);
  }

  if (existingTodos.length === 0) {
    const defaultTodos: Todo[] = [
      { id: 1, title: 'Make UI design', category: 'personal', date: '2024-12-12', completed: false, isImportant: true },
      { id: 2, title: 'Code prototype', category: 'work', date: '2024-12-13', completed: true, isImportant: true },
      { id: 3, title: 'User testing', category: 'work', date: '2024-12-13', completed: true, isImportant: false },
      { id: 4, title: 'Handover', category: 'work', date: '2024-12-15', completed: false, isImportant: true },
      { id: 5, title: 'Team sync', category: 'work', date: '2024-12-16', completed: false, isImportant: false },
      { id: 6, title: 'Read book', category: 'personal', date: '2024-12-14', completed: false, isImportant: false },
      { id: 7, title: 'Exercise', category: 'personal', date: '2024-12-14', completed: false, isImportant: true },
    ];
    await saveTodos(defaultTodos);
    return { categories: defaultCategories, todos: defaultTodos };
  }

  return {
    categories: existingCategories.length > 0 ? existingCategories : [
      { id: 'all', name: 'All', icon: 'grid' },
      { id: 'personal', name: 'Personal', icon: 'user' },
      { id: 'work', name: 'Work', icon: 'briefcase' },
    ],
    todos: existingTodos,
  };
}
