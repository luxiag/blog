"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import PageTitle from '@/components/PageTitle';
import { CustomDateInput } from './CustomDateInput';
import { CustomTimeInput } from './CustomTimeInput';
import GanttTimeline from './GanttTimeline';
import {
  getCategories,
  getTodos,
  addCategory,
  deleteCategory,
  updateCategory,
  addTodo,
  deleteTodo,
  updateTodo,
  initializeData,
  getDailyTodos,
  resetDailyTodosForNewDay,
  Category,
  Todo,
  TodoType,
  TODO_TYPE_COLORS,
  TimeSlot,
  PlanNode,
  openDB,
} from '@/lib/todos-db';

// Context menu component
function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: { label: string; icon: React.ReactNode; onClick: () => void; danger?: boolean }[];
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border rounded-lg shadow-lg p-1 min-w-[140px] z-50"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-left border-none cursor-pointer transition-colors rounded-md ${
            item.danger ? 'hover:bg-red-100' : 'hover:bg-neutral-100'
          }`}
          style={{ color: item.danger ? '#dc2626' : 'var(--foreground)' }}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}

// Get calendar data
function getCalendarData(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
}

function getMonthName(month: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month];
}

// Time slot selection component
function TimeSlotEditor({
  slots,
  onChange,
}: {
  slots: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
}) {
  const addSlot = () => {
    onChange([...slots, { startTime: '09:00', endTime: '17:00' }]);
  };

  const removeSlot = (index: number) => {
    onChange(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    onChange(newSlots);
  };

  return (
    <div className="space-y-2">
      {slots.map((slot, index) => (
        <div key={index} className="flex items-center gap-2">
          <CustomTimeInput
            value={slot.startTime}
            onChange={(value) => updateSlot(index, 'startTime', value)}
            className="w-28"
          />
          <span className="text-neutral-500">-</span>
          <CustomTimeInput
            value={slot.endTime}
            onChange={(value) => updateSlot(index, 'endTime', value)}
            className="w-28"
          />
          {slots.length > 1 && (
            <button
              onClick={() => removeSlot(index)}
              className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addSlot}
        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Time Slot
      </button>
    </div>
  );
}

// Plan node editor
function PlanNodeEditor({
  nodes,
  onChange,
  startDate,
  endDate,
}: {
  nodes: PlanNode[];
  onChange: (nodes: PlanNode[]) => void;
  startDate: string;
  endDate: string;
}) {
  const addNode = () => {
    onChange([...nodes, { date: startDate, notificationType: 'once' }]);
  };

  const removeNode = (index: number) => {
    onChange(nodes.filter((_, i) => i !== index));
  };

  const updateNode = (index: number, field: keyof PlanNode, value: string) => {
    const newNodes = [...nodes];
    newNodes[index] = { ...newNodes[index], [field]: value };
    onChange(newNodes);
  };

  return (
    <div className="space-y-2">
      {nodes.map((node, index) => (
        <div key={index} className="flex items-center gap-2 p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <span className="text-xs font-mono text-neutral-500">Node {index + 1}</span>
          <CustomDateInput
            value={node.date}
            onChange={(value) => updateNode(index, 'date', value)}
            min={startDate}
            max={endDate}
            className="w-32"
          />
          <CustomTimeInput
            value={node.time || ''}
            onChange={(value) => updateNode(index, 'time', value)}
            className="w-24"
          />
           <select
             value={node.notificationType}
             onChange={(e) => updateNode(index, 'notificationType', e.target.value as 'once' | 'daily')}
             aria-label="Notification type"
             className="px-2 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20 outline-none"
           >
            <option value="once">Once</option>
            <option value="daily">Daily</option>
          </select>
          <button
            onClick={() => removeNode(index)}
            className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={addNode}
        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Time Node
      </button>
    </div>
  );
}

export default function TodosPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);

  // New category modal state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Rename modal state
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{ type: 'category' | 'todo'; id: string | number; name: string } | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // New todo modal state
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('personal');
  const [newTodoType, setNewTodoType] = useState<TodoType>('onetime');
  const [newTodoEnableNotification, setNewTodoEnableNotification] = useState(false);
  
  // Time-related state
  const [newTodoDate, setNewTodoDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTodoEndDate, setNewTodoEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTodoDateTimeMode, setNewTodoDateTimeMode] = useState<'full_day' | 'specific_time' | 'time_range'>('full_day');
  const [newTodoSpecificTime, setNewTodoSpecificTime] = useState('');
  const [newTodoStartTime, setNewTodoStartTime] = useState('');
  const [newTodoEndTime, setNewTodoEndTime] = useState('');
  
  // Fixed time repeat specific
  const [newTodoTimeSlots, setNewTodoTimeSlots] = useState<TimeSlot[]>([{ startTime: '09:00', endTime: '17:00' }]);
  const [newTodoRepeatInterval, setNewTodoRepeatInterval] = useState(30);
  const [newTodoRepeatUnit, setNewTodoRepeatUnit] = useState<'minutes' | 'hours'>('minutes');
  
  // Plan type specific
  const [newTodoPlanNodes, setNewTodoPlanNodes] = useState<PlanNode[]>([]);
  const [newTodoHasPlanNodes, setNewTodoHasPlanNodes] = useState(false);
  
  // Yearly plan specific
  const [newTodoYear, setNewTodoYear] = useState(new Date().getFullYear());
  
  // Legacy state compatibility (kept)
  const [newTodoImportant, setNewTodoImportant] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; type: string; data: any } | null>(null);

  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [ganttViewMode, setGanttViewMode] = useState<'2week' | 'month' | 'quarter'>('month');
  const [ganttCurrentDate, setGanttCurrentDate] = useState(new Date());

  // Initialize and load data
  useEffect(() => {
    async function loadData() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const lastVisit = localStorage.getItem('lastVisitDate');

        if (lastVisit && lastVisit !== today) {
          await resetDailyTodosForNewDay();
        }
        localStorage.setItem('lastVisitDate', today);

        const data = await initializeData();
        setCategories(data.categories);
        setTodos(data.todos);

        // Save to localStorage for Service Worker use
        localStorage.setItem('todos', JSON.stringify(data.todos));

        // Notify Service Worker via BroadcastChannel
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('todo-reminder-channel');
          bc.postMessage({ type: 'TODOS_UPDATED', todos: data.todos });
          bc.close();
        }
      } catch (error) {
        // handled
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Request notification permission and set reminders
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Register Service Worker for background notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/blog/js/todo-notification-sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          // Notify Service Worker to start checking reminders
          navigator.serviceWorker.ready.then((swRegistration) => {
            swRegistration.active?.postMessage('start');
          });
        })
        .catch((error) => {
          // handled
        });
    }
  }, []);

  // Periodically check reminders
  useEffect(() => {
    const checkReminders = setInterval(async () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentDate = now.toISOString().split('T')[0];

      const dailyTodos = await getDailyTodos();

      for (const todo of dailyTodos) {
        // Check if notification is enabled
        if (!todo.enableNotification) continue;

        // Check reminders based on type
        let shouldNotify = false;

        switch (todo.todoType) {
          case 'onetime':
            if (todo.date === currentDate && todo.specificTime === currentTime) {
              shouldNotify = true;
            }
            break;
          case 'allDayRepeat':
            if (todo.specificTime === currentTime && !todo.completed) {
              shouldNotify = true;
            }
            break;
          case 'fixedRepeat':
            if (todo.timeSlots && todo.repeatInterval) {
              for (const slot of todo.timeSlots) {
                if (currentTime >= slot.startTime && currentTime <= slot.endTime) {
                  // Check if at interval time point
                  const startMinutes = parseInt(slot.startTime.split(':')[0]) * 60 + parseInt(slot.startTime.split(':')[1]);
                  const currentMinutes = now.getHours() * 60 + now.getMinutes();
                  const intervalMinutes = todo.repeatUnit === 'hours' ? todo.repeatInterval * 60 : todo.repeatInterval;
                  
                  if ((currentMinutes - startMinutes) % intervalMinutes === 0) {
                    shouldNotify = true;
                  }
                }
              }
            }
            break;
          case 'planned':
            if (todo.planNodes) {
              for (const node of todo.planNodes) {
                if (node.date === currentDate && node.time === currentTime) {
                  shouldNotify = true;
                }
              }
            }
            break;
          case 'yearly':
            // Yearly plan: no specific time reminders yet, extensible
            break;
        }

        if (shouldNotify && !todo.completed) {
          if (Notification.permission === 'granted') {
            new Notification(`Reminder: ${todo.title}`, {
              body: `Time is up!${now.toLocaleTimeString()}`,
              icon: '/favicon.ico',
            });
          }
        }
      }
    }, 60000);

    return () => clearInterval(checkReminders);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendarDays = getCalendarData(year, month);

  // Check if todo should be visible in date range
  const isTodoVisibleOnDate = useCallback((todo: Todo, dateStr: string): boolean => {
    // One-time: only show on specified date
    if (todo.todoType === 'onetime') {
      return todo.date === dateStr;
    }
    
    // Fixed time repeat: show every day (infinite loop)
    if (todo.todoType === 'fixedRepeat') {
      return true;
    }
    
    // All-day repeat: show every day
    if (todo.todoType === 'allDayRepeat') {
      return true;
    }
    
    // Plan: show within date range
    if (todo.todoType === 'planned') {
      if (todo.date && todo.endDate) {
        return dateStr >= todo.date && dateStr <= todo.endDate;
      }
      return todo.date === dateStr;
    }
    
    // Yearly plan: show within specified year
    if (todo.todoType === 'yearly') {
      const year = parseInt(dateStr.split('-')[0]);
      return todo.year === year;
    }
    
    // Legacy compatibility (without todoType)
    return todo.date === dateStr;
  }, []);

  // Filter logic
  const filteredTodos = useCallback(() => {
    return todos.filter(todo => {
      if (selectedCategory !== 'all' && todo.category !== selectedCategory) {
        return false;
      }
      if (filter === 'pending' && todo.completed) {
        return false;
      }
      if (filter === 'completed' && !todo.completed) {
        return false;
      }
      // Date filter: check if in selected date range based on type
      if (selectedDate && !isTodoVisibleOnDate(todo, selectedDate)) {
        return false;
      }
      if (searchQuery && !todo.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [todos, selectedCategory, filter, selectedDate, searchQuery, isTodoVisibleOnDate]);

  // Statistics
  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Get todos for a specific date
  const getTodosOnDate = useCallback((day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return todos.filter(t => {
      // One-time
      if (t.todoType === 'onetime' && t.date === dateStr) return true;
      // Fixed repeat (show every day)
      if (t.todoType === 'fixedRepeat') return true;
      // All-day repeat (show every day)
      if (t.todoType === 'allDayRepeat') return true;
      // Plan (within date range)
      if (t.todoType === 'planned' && t.date && t.endDate) {
        return dateStr >= t.date && dateStr <= t.endDate;
      }
      // Yearly (within current year)
      if (t.todoType === 'yearly' && t.year === year) return true;
      // Legacy compatibility
      if (t.date === dateStr) return true;
      return false;
    });
  }, [todos, year, month]);

  // Sync todo data to Service Worker
  const syncTodosToSW = useCallback((todosData: Todo[]) => {
    localStorage.setItem('todos', JSON.stringify(todosData));
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('todo-reminder-channel');
      bc.postMessage({ type: 'TODOS_UPDATED', todos: todosData });
      bc.close();
    }
  }, []);

  // Toggle todo completion status
  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      const newTodos = todos.map(t => t.id === id ? updatedTodo : t);
      setTodos(newTodos);
      await updateTodo(updatedTodo);
      syncTodosToSW(newTodos);
    }
  };

  // Date click handler
  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (selectedDate === dateStr) {
      setSelectedDate(null);
    } else {
      setSelectedDate(dateStr);
    }
  };

  // Gantt handlers
  const handleGanttDateClick = (dateStr: string) => {
    if (selectedDate === dateStr) {
      setSelectedDate(null);
    } else {
      setSelectedDate(dateStr);
    }
  };

  const handleGanttTodoClick = (todoId: number) => {
    setSelectedTodoId(prev => prev === todoId ? null : todoId);
  };

  const handleGanttNavigate = (direction: -1 | 1 | 0) => {
    if (direction === 0) {
      setGanttCurrentDate(new Date());
      return;
    }
    if (ganttViewMode === '2week') {
      setGanttCurrentDate(prev => {
        const d = new Date(prev);
        d.setDate(d.getDate() + direction * 14);
        return d;
      });
    } else if (ganttViewMode === 'month') {
      setGanttCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
    } else {
      setGanttCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction * 3, 1));
    }
  };

  const handleGanttAddAtDate = async (dateStr: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title: 'New task',
      category: categories.find(c => c.id !== 'all')?.id || 'personal',
      completed: false,
      isImportant: false,
      todoType: 'onetime',
      enableNotification: false,
      date: dateStr,
      dateTimeMode: 'full_day',
    };
    await addTodo(newTodo);
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    syncTodosToSW(newTodos);
    setSelectedTodoId(newTodo.id);
  };

  // Add category
  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      const newCat: Category = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
        name: newCategoryName,
        icon: 'custom',
        isCustom: true,
      };
      await addCategory(newCat);
      setCategories(prev => [...prev, newCat]);
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (catId: string) => {
    await deleteCategory(catId);
    setCategories(prev => prev.filter(c => c.id !== catId));
    if (selectedCategory === catId) {
      setSelectedCategory('all');
    }
  };

  // Rename category
  const handleRenameCategory = (cat: Category) => {
    setRenameTarget({ type: 'category', id: cat.id, name: cat.name });
    setRenameValue(cat.name);
    setShowRenameModal(true);
  };

  // Rename todo
  const handleRenameTodo = (todo: Todo) => {
    setRenameTarget({ type: 'todo', id: todo.id, name: todo.title });
    setRenameValue(todo.title);
    setShowRenameModal(true);
  };

  // Delete todo
  const handleDeleteTodo = async (todoId: number) => {
    await deleteTodo(todoId);
    const newTodos = todos.filter(t => t.id !== todoId);
    setTodos(newTodos);
    syncTodosToSW(newTodos);
  };

  // Execute rename
  const handleRename = async () => {
    if (renameTarget && renameValue.trim()) {
      if (renameTarget.type === 'category') {
        const updatedCat = { ...categories.find(c => c.id === renameTarget.id)!, name: renameValue.trim() };
        await updateCategory(updatedCat);
        setCategories(prev => prev.map(c => c.id === renameTarget.id ? updatedCat : c));
      } else {
        const updatedTodo = { ...todos.find(t => t.id === renameTarget.id)!, title: renameValue.trim() };
        await updateTodo(updatedTodo);
        const newTodos = todos.map(t => t.id === renameTarget.id ? updatedTodo : t);
        setTodos(newTodos);
        syncTodosToSW(newTodos);
      }
    }
    setShowRenameModal(false);
    setRenameTarget(null);
    setRenameValue('');
  };

  // Add todo
  const handleAddTodo = async () => {
    if (newTodoTitle.trim()) {
      const today = new Date().toISOString().split('T')[0];
      
      // Build todo data based on type
      const baseTodo: Partial<Todo> = {
        id: Date.now(),
        title: newTodoTitle,
        category: newTodoCategory,
        completed: false,
        isImportant: newTodoImportant,
        todoType: newTodoType,
        enableNotification: newTodoEnableNotification,
      };

      // Fill specific fields based on type
      switch (newTodoType) {
        case 'onetime':
          baseTodo.date = newTodoDate || today;
          baseTodo.dateTimeMode = newTodoDateTimeMode;
          if (newTodoDateTimeMode === 'specific_time') {
            baseTodo.specificTime = newTodoSpecificTime;
          } else if (newTodoDateTimeMode === 'time_range') {
            baseTodo.startTime = newTodoStartTime;
            baseTodo.endTime = newTodoEndTime;
          }
          break;
        case 'fixedRepeat':
          baseTodo.date = today;
          baseTodo.timeSlots = newTodoTimeSlots;
          baseTodo.repeatInterval = newTodoRepeatInterval;
          baseTodo.repeatUnit = newTodoRepeatUnit;
          break;
        case 'allDayRepeat':
          baseTodo.date = today;
          baseTodo.specificTime = newTodoSpecificTime;
          break;
        case 'planned':
          baseTodo.date = newTodoDate || today;
          baseTodo.endDate = newTodoEndDate;
          if (newTodoHasPlanNodes && newTodoPlanNodes.length > 0) {
            baseTodo.planNodes = newTodoPlanNodes;
          }
          break;
        case 'yearly':
          baseTodo.date = today;
          baseTodo.year = newTodoYear;
          break;
      }

      const newTodo = baseTodo as Todo;
      await addTodo(newTodo);
      const newTodos = [...todos, newTodo];
      setTodos(newTodos);
      syncTodosToSW(newTodos);
      
      // Reset form
      setNewTodoTitle('');
      setNewTodoType('onetime');
      setNewTodoEnableNotification(false);
      setNewTodoDate(new Date().toISOString().split('T')[0]);
      setNewTodoEndDate(new Date().toISOString().split('T')[0]);
      setNewTodoDateTimeMode('full_day');
      setNewTodoSpecificTime('');
      setNewTodoStartTime('');
      setNewTodoEndTime('');
      setNewTodoTimeSlots([{ startTime: '09:00', endTime: '17:00' }]);
      setNewTodoRepeatInterval(30);
      setNewTodoRepeatUnit('minutes');
      setNewTodoPlanNodes([]);
      setNewTodoHasPlanNodes(false);
      setNewTodoYear(new Date().getFullYear());
      setNewTodoImportant(false);
      setShowAddTodo(false);
    }
  };

  // Category context menu
  const handleCategoryContextMenu = (e: React.MouseEvent, cat: Category) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: 'category',
      data: cat,
    });
  };

  // Todo context menu
  const handleTodoContextMenu = (e: React.MouseEvent, todo: Todo) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: 'todo',
      data: todo,
    });
  };

  // Category menu items
  const categoryMenuItems = (cat: Category) => [
    {
      label: 'Rename',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
      onClick: () => handleRenameCategory(cat),
    },
    {
      label: 'Delete',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      ),
      onClick: () => handleDeleteCategory(cat.id),
      danger: true,
    },
  ];

  // Todo menu items
  const todoMenuItems = (todo: Todo) => [
    {
      label: 'Rename',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
      onClick: () => handleRenameTodo(todo),
    },
    {
      label: 'Delete',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      ),
      onClick: () => handleDeleteTodo(todo.id),
      danger: true,
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] text-sm text-neutral-500">
        Loading...
      </div>
    );
  }

  return (
    <>
      <PageTitle title="Todos" />
      <div className="flex flex-col" style={{ height: 'calc(100vh - 45px)' }}>
      {/* Upper: original three-column layout */}
      <div className="flex h-[55%] bg-white relative">
      {/* Left sidebar category navigation */}
      <div className="w-60 border-r p-6">
        <h2 className="text-xl font-semibold font-sans mb-6 text-neutral-900 dark:text-neutral-100">
          CATEGORY
        </h2>

        <nav className="flex flex-col gap-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedDate(null);
              }}
              onContextMenu={(e) => handleCategoryContextMenu(e, cat)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                  : 'text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {cat.icon === 'grid' && (
                  <>
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </>
                )}
                {cat.icon === 'user' && (
                  <>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </>
                )}
                {cat.icon === 'briefcase' && (
                  <>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </>
                )}
                {cat.icon === 'custom' && <circle cx="12" cy="12" r="3" />}
              </svg>
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Add category button */}
        <button
          onClick={() => setShowAddCategory(true)}
          className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg text-sm font-medium border border-dashed border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-neutral-500"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Center todo list */}
      <div className="flex-1 flex flex-col border-r overflow-hidden">
        {/* Search box and add todo */}
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search todos"
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none bg-white text-neutral-900 dark:text-neutral-100"
            />
          </div>

          {/* Add todo button */}
          <button
            onClick={() => setShowAddTodo(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Todo
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 px-6 py-4 border-b">
          {(['all', 'pending', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-mono font-medium rounded-lg transition-all border ${
                filter === f
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                  : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : 'Completed'}
            </button>
          ))}

          {/* Date filter tag */}
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-lg bg-orange-800 text-white"
            >
              {selectedDate}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {filteredTodos().length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredTodos().map(todo => {
                const typeConfig = TODO_TYPE_COLORS[todo.todoType] || TODO_TYPE_COLORS.onetime;
                return (
                  <div
                    key={todo.id}
                    onContextMenu={(e) => handleTodoContextMenu(e, todo)}
                    className="flex items-center gap-3 px-3 py-3 bg-white border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-context-menu transition-all"
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        todo.completed
                          ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100'
                          : 'bg-white border-neutral-300 dark:border-neutral-600'
                      }`}
                    >
                      {todo.completed && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      )}
                    </button>

                    <span className={`flex-1 text-sm font-medium font-sans ${todo.completed ? 'line-through' : ''} text-neutral-900 dark:text-neutral-100`}>
                      {todo.title}
                      {/* Type tag */}
                      <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 text-xs font-mono rounded ${typeConfig.bgLight} dark:${typeConfig.bgDark} ${typeConfig.textLight} dark:${typeConfig.textDark}`}>
                        {typeConfig.name}
                      </span>
                      {/* Notification indicator */}
                      {todo.enableNotification && (
                        <span className="ml-1 inline-flex items-center text-neutral-400" title="Notification Enabled">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                          </svg>
                        </span>
                      )}
                    </span>

                    <span className={`px-2 py-1 text-xs font-mono rounded ${
                      todo.isImportant
                        ? 'bg-orange-800 text-white border-none'
                        : 'bg-transparent text-neutral-500 border border-neutral-300 dark:border-neutral-600'
                    }`}>
                      {todo.category}
                    </span>

                    <span className="text-xs font-mono text-neutral-500">
                      {todo.date}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-15 text-sm text-neutral-500">
              No tasks found
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-80 flex flex-col">
        {/* Completed/Total stats */}
        <div className="p-6 border-b">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 p-4 rounded-xl text-center bg-neutral-100 dark:bg-neutral-800">
              <div className="text-3xl font-bold font-sans text-neutral-900 dark:text-neutral-100">
                {completedCount}
              </div>
              <div className="text-xs font-mono mt-1 text-neutral-500">
                Completed
              </div>
            </div>
            <div className="flex-1 p-4 rounded-xl text-center bg-neutral-100 dark:bg-neutral-800">
              <div className="text-3xl font-bold font-sans text-neutral-900 dark:text-neutral-100">
                {totalCount}
              </div>
              <div className="text-xs font-mono mt-1 text-neutral-500">
                Total
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between mb-2 text-xs font-mono text-neutral-500">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full rounded-lg transition-all duration-300 bg-orange-800"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Month navigation */}
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold font-sans text-neutral-900 dark:text-neutral-100">
              {getMonthName(month)} {year}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="w-7 h-7 rounded-lg border border-neutral-300 dark:border-neutral-600 flex items-center justify-center transition-all bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="w-7 h-7 rounded-lg border border-neutral-300 dark:border-neutral-600 flex items-center justify-center transition-all bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-mono font-semibold py-2 text-neutral-500"
              >
                {day.charAt(0)}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} />;
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              const dayTodos = getTodosOnDate(day);
              const hasTodo = dayTodos.length > 0;

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-mono transition-all relative ${
                    isSelected
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                      : hasTodo
                        ? 'text-neutral-900 dark:text-neutral-100 font-semibold'
                        : 'text-neutral-400'
                  }`}
                >
                  {day}
                  {/* Show all different type markers (deduped, all solid circles) */}
                  {hasTodo && !isSelected && (
                    <div className="absolute bottom-1 flex gap-0.5 flex-wrap justify-center max-w-[90%]">
                      {(() => {
                        // Extract all existing types for the day (deduped)
                        const types = [...new Set(dayTodos.map(t => t.todoType))];
                        
                        return types.map((type, idx) => {
                          const typeConfig = TODO_TYPE_COLORS[type] || TODO_TYPE_COLORS.onetime;
                          const color = typeConfig.color;
                          
                          // All types use solid circles
                          return <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} title={typeConfig.name} />;
                        });
                      })()}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      {/* Lower: full-width Gantt chart */}
      <div className="h-[45%] border-t border-neutral-200 dark:border-neutral-700 flex-shrink-0">
        <GanttTimeline
          todos={todos}
          currentDate={ganttCurrentDate}
          selectedDate={selectedDate}
          selectedTodoId={selectedTodoId}
          onDateClick={handleGanttDateClick}
          onTodoClick={handleGanttTodoClick}
          onNavigate={handleGanttNavigate}
          viewMode={ganttViewMode}
          onViewModeChange={(m: string) => setGanttViewMode(m as 'month' | '2week' | 'quarter')}
          onTodoUpdate={async (todo: Todo) => { await updateTodo(todo); const newTodos = todos.map(t => t.id === todo.id ? todo : t); setTodos(newTodos); syncTodosToSW(newTodos); }}
          onTodoEdit={(todo: Todo) => { handleRenameTodo(todo); }}
          onTodoDelete={handleDeleteTodo}
          onTodoAddAtDate={handleGanttAddAtDate}
          categories={categories.filter(c => c.id !== 'all')}
        />
      </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.type === 'category'
            ? categoryMenuItems(contextMenu.data)
            : todoMenuItems(contextMenu.data)
          }
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Add category modal */}
      {showAddCategory && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          onClick={() => setShowAddCategory(false)}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
              Add Category
            </h3>
            <input
              type="text"
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              aria-label="New category name"
              autoFocus
              className="w-full px-3 py-2.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none mb-4 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddCategory(false)}
                className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all text-neutral-900 dark:text-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 text-sm rounded-lg transition-all bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename modal */}
      {showRenameModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          onClick={() => {
            setShowRenameModal(false);
            setRenameTarget(null);
            setRenameValue('');
          }}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
              Rename {renameTarget?.type === 'category' ? 'Category' : 'Todo'}
            </h3>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              aria-label="Rename category"
              autoFocus
              className="w-full px-3 py-2.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none mb-4 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowRenameModal(false);
                  setRenameTarget(null);
                  setRenameValue('');
                }}
                className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all text-neutral-900 dark:text-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                disabled={!renameValue.trim()}
                className={`px-4 py-2 text-sm rounded-lg transition-all cursor-pointer ${
                  renameValue.trim()
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400'
                }`}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add todo modal */}
      {showAddTodo && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 overflow-y-auto"
          onClick={() => setShowAddTodo(false)}
        >
        <div
          className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-[500px] max-w-[90vw] my-8"
          onClick={(e) => e.stopPropagation()}
        >
            <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
              Add Todo
            </h3>

            {/* Title input */}
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1.5 text-neutral-900 dark:text-neutral-100">
                Title
              </label>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                autoFocus
                className="w-full px-3 py-2.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* Category and type selection */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1.5 text-neutral-900 dark:text-neutral-100">
                  Category
                </label>
                <select
                  value={newTodoCategory}
                  onChange={(e) => setNewTodoCategory(e.target.value)}
                  aria-label="Select category"
                  className="w-full px-3 py-2.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none bg-white dark:bg-neutral-700 cursor-pointer text-neutral-900 dark:text-neutral-100 focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
                >
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Todo type selection */}
            <div className="mb-4">
              <label className="block text-xs font-medium mb-2 text-neutral-900 dark:text-neutral-100">
                Type
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(TODO_TYPE_COLORS) as TodoType[]).map((type) => {
                  const config = TODO_TYPE_COLORS[type];
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewTodoType(type)}
                      className={`px-2 py-2 text-xs font-mono rounded-lg border transition-all flex flex-col items-center gap-1 ${
                        newTodoType === type
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                          : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                      {config.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notification toggle */}
            <div className="mb-4 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newTodoEnableNotification}
                  onChange={(e) => setNewTodoEnableNotification(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-neutral-900 dark:accent-neutral-100"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Enable Notification
                </span>
              </label>
            </div>

            {/* Show different config based on type */}
            <div className="mb-4 space-y-3">
              {/* One-time type */}
              {newTodoType === 'onetime' && (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1.5 text-neutral-900 dark:text-neutral-100">
                        Date
                      </label>
                      <CustomDateInput
                        value={newTodoDate}
                        onChange={(value) => setNewTodoDate(value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2 text-neutral-900 dark:text-neutral-100">
                      Time Mode
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: 'full_day', label: 'All Day' },
                        { value: 'specific_time', label: 'Specific Time' },
                        { value: 'time_range', label: 'Time Range' },
                      ].map((mode) => (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => setNewTodoDateTimeMode(mode.value as typeof newTodoDateTimeMode)}
                          className={`flex-1 px-3 py-2 text-xs font-mono rounded-lg border transition-all ${
                            newTodoDateTimeMode === mode.value
                              ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                              : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {newTodoDateTimeMode === 'specific_time' && (
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-neutral-900 dark:text-neutral-100">
                        Specific Time
                      </label>
                      <CustomTimeInput
                        value={newTodoSpecificTime}
                        onChange={(value) => setNewTodoSpecificTime(value)}
                        className="flex-1"
                      />
                    </div>
                  )}
                  {newTodoDateTimeMode === 'time_range' && (
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium mb-1.5 text-neutral-900 dark:text-neutral-100">
                          Start Time
                        </label>
                        <CustomTimeInput
                          value={newTodoStartTime}
                          onChange={(value) => setNewTodoStartTime(value)}
                          className="flex-1"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium mb-1.5 text-neutral-900 dark:text-neutral-100">
                          End Time
                        </label>
                        <CustomTimeInput
                          value={newTodoEndTime}
                          onChange={(value) => setNewTodoEndTime(value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Fixed time repeat */}
              {newTodoType === 'fixedRepeat' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-2 text-neutral-900 dark:text-neutral-100">
                      Time Range
                    </label>
                    <TimeSlotEditor slots={newTodoTimeSlots} onChange={setNewTodoTimeSlots} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-900 dark:text-neutral-100">Every</span>
                    <input
                       type="number"
                       min="1"
                       max="999"
                       value={newTodoRepeatInterval}
                       onChange={(e) => setNewTodoRepeatInterval(parseInt(e.target.value) || 1)}
                       aria-label="Repeat interval"
                       className="w-16 px-2 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                     />
                     <select
                       value={newTodoRepeatUnit}
                       onChange={(e) => setNewTodoRepeatUnit(e.target.value as 'minutes' | 'hours')}
                       aria-label="Repeat unit"
                       className="px-2 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none bg-white dark:bg-neutral-700 cursor-pointer text-neutral-900 dark:text-neutral-100 focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
                     >
                       <option value="minutes">Minutes</option>
                       <option value="hours">Hours</option>
                     </select>
                    <span className="text-sm text-neutral-900 dark:text-neutral-100">Remind Once</span>
                  </div>
                </div>
              )}

              {/* All-day repeat */}
              {newTodoType === 'allDayRepeat' && (
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-neutral-900 dark:text-neutral-100">
                    Daily Reminder Time
                  </label>
                  <CustomTimeInput
                    value={newTodoSpecificTime}
                    onChange={(value) => setNewTodoSpecificTime(value)}
                    className="w-40"
                  />
                </div>
              )}

              {/* Plan type */}
              {newTodoType === 'planned' && (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1.5 text-neutral-900 dark:text-neutral-100">
                        Start Date
                      </label>
                      <CustomDateInput
                        value={newTodoDate}
                        onChange={(value) => setNewTodoDate(value)}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1.5 text-neutral-900 dark:text-neutral-100">
                        End Date
                      </label>
                      <CustomDateInput
                        value={newTodoEndDate}
                        onChange={(value) => setNewTodoEndDate(value)}
                        min={newTodoDate}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newTodoHasPlanNodes}
                      onChange={(e) => setNewTodoHasPlanNodes(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-neutral-900 dark:accent-neutral-100"
                    />
                    <span className="text-sm text-neutral-900 dark:text-neutral-100">Set Time Nodes</span>
                  </label>
                  {newTodoHasPlanNodes && (
                    <PlanNodeEditor
                      nodes={newTodoPlanNodes}
                      onChange={setNewTodoPlanNodes}
                      startDate={newTodoDate}
                      endDate={newTodoEndDate}
                    />
                  )}
                </div>
              )}

              {/* Yearly plan */}
              {newTodoType === 'yearly' && (
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-neutral-900 dark:text-neutral-100">
                    Select Year
                  </label>
                   <select
                     value={newTodoYear}
                     onChange={(e) => setNewTodoYear(parseInt(e.target.value))}
                     aria-label="Month"
                     className="px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none bg-white dark:bg-neutral-700 cursor-pointer text-neutral-900 dark:text-neutral-100 focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
                   >
                    {[...Array(5)].map((_, i) => {
                      const year = new Date().getFullYear() + i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
              )}
            </div>

            {/* Mark as important section */}
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newTodoImportant}
                  onChange={(e) => setNewTodoImportant(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-neutral-900 dark:accent-neutral-100"
                />
                <span className="text-sm text-neutral-900 dark:text-neutral-100">
                  Mark as Important
                </span>
              </label>
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setShowAddTodo(false)}
                className="px-4 py-2.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all text-neutral-900 dark:text-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTodo}
                disabled={!newTodoTitle.trim()}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  newTodoTitle.trim()
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 cursor-pointer'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed'
                }`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
