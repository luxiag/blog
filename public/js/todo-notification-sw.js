let checkInterval = null;
let lastNotifiedDates = {};
let pendingTodos = [];

const channel = new BroadcastChannel('todo-reminder-channel');

channel.onmessage = (event) => {
  if (event.data.type === 'TODOS_UPDATED') {
    pendingTodos = event.data.todos;
  }
};

// Get todos from BroadcastChannel (Service Worker cannot access localStorage)
function getTodos() {
  return pendingTodos || [];
}

// Update new Todo type checking logic
function shouldNotifyTodo(todo, currentTime, currentDate) {
  if (todo.completed) return false;
  if (!todo.enableNotification) return false;

  switch (todo.todoType) {
    case 'onetime':
      // One-time: check based on time mode
      if (todo.date !== currentDate) return false;
      
      switch (todo.dateTimeMode) {
        case 'full_day':
          // All-day mode: only remind on specified date (can set a default reminder time, e.g., 9 AM)
          if (currentTime === '09:00') {
            return true;
          }
          break;
        case 'specific_time':
          // Specific time point mode: both date and time match
          if (todo.specificTime === currentTime) {
            return true;
          }
          break;
        case 'time_range':
          // Time range mode: date matches and within time range
          if (todo.startTime && todo.endTime) {
            if (currentTime >= todo.startTime && currentTime <= todo.endTime) {
              // Can remind once at start time
              if (currentTime === todo.startTime) {
                return true;
              }
            }
          }
          break;
        default:
          // Legacy compatibility (using specificTime)
          if (todo.specificTime === currentTime) {
            return true;
          }
          break;
      }
      break;
      
    case 'allDayRepeat':
      // All-day repeat: remind at the same time every day
      if (todo.specificTime === currentTime) {
        return true;
      }
      break;
      
    case 'fixedRepeat':
      // Fixed time repeat: remind at intervals within time slots
      if (todo.timeSlots && todo.repeatInterval) {
        for (const slot of todo.timeSlots) {
          if (currentTime >= slot.startTime && currentTime <= slot.endTime) {
            const startMinutes = parseInt(slot.startTime.split(':')[0]) * 60 + parseInt(slot.startTime.split(':')[1]);
            const currentMinutes = parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1]);
            const intervalMinutes = todo.repeatUnit === 'hours' ? todo.repeatInterval * 60 : todo.repeatInterval;
            
            if ((currentMinutes - startMinutes) % intervalMinutes === 0 && currentMinutes >= startMinutes) {
              return true;
            }
          }
        }
      }
      break;
      
    case 'planned':
      // Plan type: remind at node date and time
      if (todo.planNodes) {
        for (const node of todo.planNodes) {
          if (node.date === currentDate && node.time === currentTime) {
            return true;
          }
          // If node is daily type, remind at the same time every day
          if (node.notificationType === 'daily' && node.time === currentTime) {
            // Check if within plan date range
            if (todo.date && todo.endDate) {
              if (currentDate >= todo.date && currentDate <= todo.endDate) {
                return true;
              }
            }
          }
        }
      }
      break;
      
    case 'yearly':
      // Yearly plan: no specific time reminders set yet
      break;
      
    default:
      // Legacy compatibility
      if (todo.isDaily || todo.repeatType === 'daily') {
        if (todo.reminderTime && todo.reminderTime === currentTime && todo.date === currentDate) {
          return true;
        }
      }
      break;
  }
  
  return false;
}

async function checkReminders() {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const currentDate = now.toISOString().split('T')[0];

  const todos = getTodos();

  if (!todos || todos.length === 0) return;

  for (const todo of todos) {
    if (shouldNotifyTodo(todo, currentTime, currentDate)) {
      const key = `${todo.id}-${currentDate}-${currentTime}`;
      // Avoid duplicate reminders within the same minute
      if (!lastNotifiedDates[key]) {
        lastNotifiedDates[key] = true;
        showNotification(`Reminder: ${todo.title}`, `Time is up! ${currentTime}`);
        
        // Clean up old records (keep recent 100)
        const keys = Object.keys(lastNotifiedDates);
        if (keys.length > 100) {
          delete lastNotifiedDates[keys[0]];
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
