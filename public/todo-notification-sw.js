let checkInterval = null;
let lastNotifiedDates = {};
let pendingTodos = [];

const channel = new BroadcastChannel('todo-reminder-channel');

channel.onmessage = (event) => {
  if (event.data.type === 'TODOS_UPDATED') {
    pendingTodos = event.data.todos;
  }
};

async function getTodos() {
  if (pendingTodos.length > 0) {
    return pendingTodos;
  }

  try {
    const stored = localStorage.getItem('todos');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to get todos from localStorage:', e);
  }

  return [];
}

async function checkReminders() {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const currentDate = now.toISOString().split('T')[0];

  const todos = await getTodos();

  if (!todos || todos.length === 0) return;

  for (const todo of todos) {
    if (todo.completed) continue;

    if (todo.isDaily || todo.repeatType === 'daily') {
      if (todo.reminderTime && todo.reminderTime === currentTime && todo.date === currentDate) {
        const key = `${todo.id}-${currentDate}`;
        if (!lastNotifiedDates[key]) {
          lastNotifiedDates[key] = true;
          showNotification(`提醒: ${todo.title}`, `时间到了！${currentTime}`);
        }
      }
    }
  }
}

function showNotification(title, body) {
  if (Notification.permission === 'granted') {
    self.registration.showNotification(title, {
      body: body,
      icon: '/favicon.ico',
      tag: `todo-${Date.now()}`,
      requireInteraction: true,
    });
  }
}

function startChecking() {
  if (checkInterval) return;

  checkInterval = setInterval(() => {
    checkReminders();
  }, 60000);

  checkReminders();
}

function stopChecking() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  startChecking();
});

self.addEventListener('message', (event) => {
  if (event.data === 'start') {
    startChecking();
  } else if (event.data === 'stop') {
    stopChecking();
  } else if (event.data.type === 'TODOS_UPDATED') {
    pendingTodos = event.data.todos;
  }
});

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/favicon.ico',
        tag: data.tag || 'todo-reminder',
        requireInteraction: true,
      })
    );
  }
});
