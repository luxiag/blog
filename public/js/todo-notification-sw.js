let checkInterval = null;
let lastNotifiedDates = {};
let pendingTodos = [];

const channel = new BroadcastChannel('todo-reminder-channel');

channel.onmessage = (event) => {
  if (event.data.type === 'TODOS_UPDATED') {
    pendingTodos = event.data.todos;
  }
};

// 从 BroadcastChannel 获取 todos（Service Worker 不能访问 localStorage）
function getTodos() {
  return pendingTodos || [];
}

// 更新新的 Todo 类型检查逻辑
function shouldNotifyTodo(todo, currentTime, currentDate) {
  if (todo.completed) return false;
  if (!todo.enableNotification) return false;

  switch (todo.todoType) {
    case 'onetime':
      // 一次性：在指定日期和具体时间提醒
      if (todo.date === currentDate && todo.specificTime === currentTime) {
        return true;
      }
      break;
      
    case 'allDayRepeat':
      // 全天候重复：每天到时间就提醒
      if (todo.specificTime === currentTime) {
        return true;
      }
      break;
      
    case 'fixedRepeat':
      // 固定时间重复：在时间段内按间隔提醒
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
      // 计划类型：在节点日期和时间提醒
      if (todo.planNodes) {
        for (const node of todo.planNodes) {
          if (node.date === currentDate && node.time === currentTime) {
            return true;
          }
          // 如果节点是 daily 类型，每天到时间都提醒
          if (node.notificationType === 'daily' && node.time === currentTime) {
            // 检查是否在计划日期范围内
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
      // 全年计划暂不设置具体时间点提醒
      break;
      
    default:
      // 兼容旧数据
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
      // 避免同一分钟内重复提醒
      if (!lastNotifiedDates[key]) {
        lastNotifiedDates[key] = true;
        showNotification(`提醒: ${todo.title}`, `时间到了！${currentTime}`);
        
        // 清理旧的记录（保留最近100条）
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
