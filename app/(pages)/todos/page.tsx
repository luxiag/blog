"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Plus,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Star,
  Sparkles,
  Clock,
  Flame,
  Search,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import PageTitle from '@/components/PageTitle';
import { CustomDateInput } from './CustomDateInput';
import { CustomTimeInput } from './CustomTimeInput';
import {
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
} from '@/lib/todos-db';

function ContextMenu({ x, y, items, onClose }: {
  x: number; y: number;
  items: { label: string; onClick: () => void; danger?: boolean }[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [onClose]);
  return (
    <div ref={ref} className="fixed bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 py-1 min-w-[120px] z-50" style={{ left: x, top: y, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
      {items.map((item, i) => (
        <button key={i} onClick={() => { item.onClick(); onClose(); }} className={`w-full px-4 py-2 text-sm text-left transition-colors ${item.danger ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}>{item.label}</button>
      ))}
    </div>
  );
}

import { Solar } from 'lunar-javascript';

function getLunarDay(year: number, month: number, day: number): { text: string; isHoliday: boolean } {
  try {
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    const festivals = lunar.getFestivals();
    const jieQi = lunar.getJieQi();
    if (festivals.length > 0) return { text: festivals[0], isHoliday: true };
    if (jieQi) return { text: jieQi, isHoliday: true };
    const dayChinese = lunar.getDayInChinese();
    if (dayChinese === '初一') return { text: lunar.getMonthInChinese() + '月', isHoliday: false };
    return { text: dayChinese, isHoliday: false };
  } catch {
    return { text: '', isHoliday: false };
  }
}

function getCalendarData(year: number, month: number) {
  const d = new Date(year, month + 1, 0);
  const start = new Date(year, month, 1).getDay();
  const days: (number | null)[] = [];
  for (let i = 0; i < start; i++) days.push(null);
  for (let i = 1; i <= d.getDate(); i++) days.push(i);
  return days;
}

function TimeSlotEditor({ slots, onChange }: { slots: TimeSlot[]; onChange: (s: TimeSlot[]) => void }) {
  const add = () => onChange([...slots, { startTime: '09:00', endTime: '17:00' }]);
  const rm = (i: number) => onChange(slots.filter((_, j) => j !== i));
  const up = (i: number, f: keyof TimeSlot, v: string) => { const s = [...slots]; s[i] = { ...s[i], [f]: v }; onChange(s); };
  return (
    <div className="space-y-2">
      {slots.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <CustomTimeInput value={s.startTime} onChange={v => up(i, 'startTime', v)} className="w-28" />
          <span className="text-neutral-400">–</span>
          <CustomTimeInput value={s.endTime} onChange={v => up(i, 'endTime', v)} className="w-28" />
          {slots.length > 1 && <button onClick={() => rm(i)} className="text-neutral-400 hover:text-red-500"><X size={14} /></button>}
        </div>
      ))}
      <button onClick={add} className="text-xs text-neutral-400 hover:text-orange-500 transition-colors">+ Add slot</button>
    </div>
  );
}

function PlanNodeEditor({ nodes, onChange, startDate, endDate }: { nodes: PlanNode[]; onChange: (n: PlanNode[]) => void; startDate: string; endDate: string }) {
  const add = () => onChange([...nodes, { date: startDate, notificationType: 'once' }]);
  const rm = (i: number) => onChange(nodes.filter((_, j) => j !== i));
  const up = (i: number, f: keyof PlanNode, v: string) => { const n = [...nodes]; n[i] = { ...n[i], [f]: v }; onChange(n); };
  return (
    <div className="space-y-2">
      {nodes.map((node, i) => (
        <div key={i} className="flex items-center gap-2 p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <CustomDateInput value={node.date} onChange={v => up(i, 'date', v)} min={startDate} max={endDate} className="w-32" />
          <CustomTimeInput value={node.time || ''} onChange={v => up(i, 'time', v)} className="w-24" />
          <select value={node.notificationType} onChange={e => up(i, 'notificationType', e.target.value as 'once' | 'daily')} className="px-2 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 outline-none">
            <option value="once">Once</option><option value="daily">Daily</option>
          </select>
          <button onClick={() => rm(i)} className="text-neutral-400 hover:text-red-500"><X size={14} /></button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-neutral-400 hover:text-orange-500 transition-colors">+ Add node</button>
    </div>
  );
}

const TYPE_SORT_ORDER: Record<string, number> = {
  onetime: 0,
  fixedRepeat: 1,
  allDayRepeat: 2,
  planned: 3,
  yearly: 4,
};

const TYPE_LABELS: Record<string, string> = {
  onetime: 'One-time',
  fixedRepeat: 'Fixed Repeat',
  allDayRepeat: 'Daily',
  planned: 'Planned',
  yearly: 'Yearly',
};

function getTodoTime(t: Todo): string {
  if (t.specificTime) return t.specificTime;
  if (t.startTime) return t.startTime;
  if (t.timeSlots && t.timeSlots.length > 0) return t.timeSlots[0].startTime;
  return '';
}

function getTodoTimeLabel(t: Todo): string {
  if (t.todoType === 'yearly') return `Yearly · ${t.year || ''}`;
  if (t.todoType === 'allDayRepeat') return t.specificTime ? `Daily · ${t.specificTime}` : 'All Day';
  if (t.todoType === 'fixedRepeat') return t.timeSlots && t.timeSlots.length > 0 ? `${t.timeSlots[0].startTime}-${t.timeSlots[0].endTime}` : 'Fixed Repeat';
  if (t.specificTime) return t.specificTime;
  if (t.startTime && t.endTime) return `${t.startTime}-${t.endTime}`;
  if (t.startTime) return t.startTime;
  return 'All Day';
}

function timeToMinutes(time: string): number {
  if (!time) return -1;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export default function TodosPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{ type: 'category' | 'todo'; id: string | number; name: string } | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('personal');
  const [newTodoType, setNewTodoType] = useState<TodoType>('onetime');
  const [newTodoEnableNotification, setNewTodoEnableNotification] = useState(false);
  const [newTodoDate, setNewTodoDate] = useState(todayStr);
  const [newTodoEndDate, setNewTodoEndDate] = useState(todayStr);
  const [newTodoDateTimeMode, setNewTodoDateTimeMode] = useState<'full_day' | 'specific_time' | 'time_range'>('full_day');
  const [newTodoSpecificTime, setNewTodoSpecificTime] = useState('');
  const [newTodoStartTime, setNewTodoStartTime] = useState('');
  const [newTodoEndTime, setNewTodoEndTime] = useState('');
  const [newTodoTimeSlots, setNewTodoTimeSlots] = useState<TimeSlot[]>([{ startTime: '09:00', endTime: '17:00' }]);
  const [newTodoRepeatInterval, setNewTodoRepeatInterval] = useState(30);
  const [newTodoRepeatUnit, setNewTodoRepeatUnit] = useState<'minutes' | 'hours'>('minutes');
  const [newTodoPlanNodes, setNewTodoPlanNodes] = useState<PlanNode[]>([]);
  const [newTodoHasPlanNodes, setNewTodoHasPlanNodes] = useState(false);
  const [newTodoYear, setNewTodoYear] = useState(today.getFullYear());
  const [newTodoImportant, setNewTodoImportant] = useState(false);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; type: string; data: Category | Todo } | null>(null);
  const [ganttCurrentDate, setGanttCurrentDate] = useState(new Date());
  const [ganttZoomLevel, setGanttZoomLevel] = useState(2);
  const GANTT_ZOOM_LEVELS = [
    { key: 'quarter', totalDays: 90, baseDayWidth: 12, label: '3M' },
    { key: 'month', totalDays: 31, baseDayWidth: 36, label: '1M' },
    { key: '2week', totalDays: 14, baseDayWidth: 60, label: '2W' },
    { key: 'week', totalDays: 7, baseDayWidth: 120, label: '1W' },
    { key: 'day', totalDays: 1, baseDayWidth: 576, label: '1D' },
    { key: 'halfday', totalDays: 1, baseDayWidth: 1152, label: '12H' },
    { key: '2hour', totalDays: 1, baseDayWidth: 3456, label: '2H' },
  ];
  const ganttLevel = GANTT_ZOOM_LEVELS[ganttZoomLevel];
  const ganttViewMode = ganttLevel.key as '2week' | 'month' | 'quarter';
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const ganttContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const td = new Date().toISOString().split('T')[0];
        const lv = localStorage.getItem('lastVisitDate');
        if (lv && lv !== td) await resetDailyTodosForNewDay();
        localStorage.setItem('lastVisitDate', td);
        const d = await initializeData();
        setCategories(d.categories); setTodos(d.todos);
        localStorage.setItem('todos', JSON.stringify(d.todos));
        if ('BroadcastChannel' in window) { const bc = new BroadcastChannel('todo-reminder-channel'); bc.postMessage({ type: 'TODOS_UPDATED', todos: d.todos }); bc.close(); }
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/blog/js/todo-notification-sw.js')
        .then(() => { navigator.serviceWorker.ready.then(r => { r.active?.postMessage('start'); }); }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const iv = setInterval(async () => {
      const now = new Date();
      const ct = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const cd = now.toISOString().split('T')[0];
      for (const t of await getDailyTodos()) {
        if (!t.enableNotification) continue;
        let n = false;
        switch (t.todoType) {
          case 'onetime': if (t.date === cd && t.specificTime === ct) n = true; break;
          case 'allDayRepeat': if (t.specificTime === ct && !t.completed) n = true; break;
          case 'fixedRepeat': if (t.timeSlots && t.repeatInterval) for (const s of t.timeSlots) { if (ct >= s.startTime && ct <= s.endTime) { const sm = parseInt(s.startTime.split(':')[0]) * 60 + parseInt(s.startTime.split(':')[1]); const cm = now.getHours() * 60 + now.getMinutes(); const im = t.repeatUnit === 'hours' ? t.repeatInterval * 60 : t.repeatInterval; if ((cm - sm) % im === 0) n = true; } } break;
          case 'planned': if (t.planNodes) for (const p of t.planNodes) { if (p.date === cd && p.time === ct) n = true; } break;
        }
        if (n && !t.completed && Notification.permission === 'granted') new Notification(`Reminder: ${t.title}`, { body: `Time is up! ${now.toLocaleTimeString()}`, icon: '/favicon.ico' });
      }
    }, 60000);
    return () => clearInterval(iv);
  }, []);

  const handleGanttWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY < 0) {
      setGanttZoomLevel(z => Math.min(GANTT_ZOOM_LEVELS.length - 1, z + 1));
    } else if (e.deltaY > 0) {
      setGanttZoomLevel(z => Math.max(0, z - 1));
    }
  }, []);

  useEffect(() => {
    const el = ganttContainerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleGanttWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleGanttWheel);
  }, [handleGanttWheel]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendarDays = getCalendarData(year, month);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const isTodoVisible = useCallback((t: Todo, d: string) => {
    if (t.todoType === 'onetime') return t.date === d;
    if (t.todoType === 'fixedRepeat' || t.todoType === 'allDayRepeat') return true;
    if (t.todoType === 'planned') return t.date && t.endDate ? d >= t.date && d <= t.endDate : t.date === d;
    if (t.todoType === 'yearly') return t.year === parseInt(d.split('-')[0]);
    return t.date === d;
  }, []);

  const filteredTodos = useCallback(() => todos.filter(t => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [todos, selectedCategory, searchQuery]);

  const todayTodos = todos.filter(t => isTodoVisible(t, todayStr) && !t.completed);
  const done = todos.filter(t => t.completed).length;
  const total = todos.length;
  const pct = total > 0 ? Math.round(done / total * 100) : 0;

  const getTodosOnDate = useCallback((day: number) => {
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return todos.filter(t => {
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      if (t.todoType === 'onetime' && t.date === ds) return true;
      if (t.todoType === 'fixedRepeat' || t.todoType === 'allDayRepeat') return true;
      if (t.todoType === 'planned' && t.date && t.endDate) return ds >= t.date && ds <= t.endDate;
      if (t.todoType === 'yearly' && t.year === year) return true;
      return t.date === ds;
    });
  }, [todos, year, month, searchQuery, selectedCategory]);

  const getTodosOnDateStr = useCallback((ds: string) => {
    return todos.filter(t => {
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      if (t.todoType === 'onetime' && t.date === ds) return true;
      if (t.todoType === 'fixedRepeat' || t.todoType === 'allDayRepeat') return true;
      if (t.todoType === 'planned' && t.date && t.endDate) return ds >= t.date && ds <= t.endDate;
      if (t.todoType === 'yearly' && t.year === parseInt(ds.split('-')[0])) return true;
      return t.date === ds;
    }).sort((a, b) => {
      const ta = TYPE_SORT_ORDER[a.todoType] ?? 9;
      const tb = TYPE_SORT_ORDER[b.todoType] ?? 9;
      if (ta !== tb) return ta - tb;
      const timeA = getTodoTime(a);
      const timeB = getTodoTime(b);
      if (!timeA && !timeB) return 0;
      if (!timeA) return 1;
      if (!timeB) return -1;
      return timeA.localeCompare(timeB);
    });
  }, [todos, searchQuery, selectedCategory]);

  const sync = useCallback((data: Todo[]) => {
    localStorage.setItem('todos', JSON.stringify(data));
    if ('BroadcastChannel' in window) { const bc = new BroadcastChannel('todo-reminder-channel'); bc.postMessage({ type: 'TODOS_UPDATED', todos: data }); bc.close(); }
  }, []);

  const toggle = async (id: number) => {
    const t = todos.find(x => x.id === id);
    if (t) { const u = { ...t, completed: !t.completed }; const n = todos.map(x => x.id === id ? u : x); setTodos(n); await updateTodo(u); sync(n); }
  };

  const handleDateClick = (day: number) => {
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(p => p === ds ? null : ds);
  };

  const ganttNav = (d: -1 | 1 | 0) => {
    if (d === 0) { setGanttCurrentDate(new Date()); return; }
    const key = ganttLevel.key;
    if (key === 'quarter') setGanttCurrentDate(p => new Date(p.getFullYear(), p.getMonth() + d * 3, 1));
    else if (key === 'month') setGanttCurrentDate(p => new Date(p.getFullYear(), p.getMonth() + d, 1));
    else if (key === '2week') setGanttCurrentDate(p => { const x = new Date(p); x.setDate(x.getDate() + d * 14); return x; });
    else if (key === 'week') setGanttCurrentDate(p => { const x = new Date(p); x.setDate(x.getDate() + d * 7); return x; });
    else setGanttCurrentDate(p => { const x = new Date(p); x.setDate(x.getDate() + d); return x; });
  };

  const addCat = async () => {
    if (newCategoryName.trim()) { const c: Category = { id: newCategoryName.toLowerCase().replace(/\s+/g, '-'), name: newCategoryName, icon: 'custom', isCustom: true }; await addCategory(c); setCategories(p => [...p, c]); setNewCategoryName(''); setShowAddCategory(false); }
  };
  const delCat = async (id: string) => { await deleteCategory(id); setCategories(p => p.filter(c => c.id !== id)); if (selectedCategory === id) setSelectedCategory('all'); };
  const renameCat = (c: Category) => { setRenameTarget({ type: 'category', id: c.id, name: c.name }); setRenameValue(c.name); setShowRenameModal(true); };
  const renameTodo = (t: Todo) => { setRenameTarget({ type: 'todo', id: t.id, name: t.title }); setRenameValue(t.title); setShowRenameModal(true); };
  const delTodo = async (id: number) => { await deleteTodo(id); const n = todos.filter(t => t.id !== id); setTodos(n); sync(n); };

  const doRename = async () => {
    if (renameTarget && renameValue.trim()) {
      if (renameTarget.type === 'category') { const u = { ...categories.find(c => c.id === renameTarget.id)!, name: renameValue.trim() }; await updateCategory(u); setCategories(p => p.map(c => c.id === renameTarget.id ? u : c)); }
      else { const u = { ...todos.find(t => t.id === renameTarget.id)!, title: renameValue.trim() }; await updateTodo(u); const n = todos.map(t => t.id === renameTarget.id ? u : t); setTodos(n); sync(n); }
    }
    setShowRenameModal(false); setRenameTarget(null); setRenameValue('');
  };

  const createTodo = async () => {
    if (!newTodoTitle.trim()) return;
    const td = new Date().toISOString().split('T')[0];
    const b: Partial<Todo> = { id: Date.now(), title: newTodoTitle, category: newTodoCategory, completed: false, isImportant: newTodoImportant, todoType: newTodoType, enableNotification: newTodoEnableNotification };
    switch (newTodoType) {
      case 'onetime': b.date = newTodoDate || td; b.dateTimeMode = newTodoDateTimeMode; if (newTodoDateTimeMode === 'specific_time') b.specificTime = newTodoSpecificTime; else if (newTodoDateTimeMode === 'time_range') { b.startTime = newTodoStartTime; b.endTime = newTodoEndTime; } break;
      case 'fixedRepeat': b.date = td; b.timeSlots = newTodoTimeSlots; b.repeatInterval = newTodoRepeatInterval; b.repeatUnit = newTodoRepeatUnit; break;
      case 'allDayRepeat': b.date = td; b.specificTime = newTodoSpecificTime; break;
      case 'planned': b.date = newTodoDate || td; b.endDate = newTodoEndDate; if (newTodoHasPlanNodes && newTodoPlanNodes.length > 0) b.planNodes = newTodoPlanNodes; break;
      case 'yearly': b.date = td; b.year = newTodoYear; break;
    }
    const t = b as Todo; await addTodo(t); const n = [...todos, t]; setTodos(n); sync(n);
    setNewTodoTitle(''); setNewTodoType('onetime'); setNewTodoEnableNotification(false); setNewTodoDate(todayStr); setNewTodoEndDate(todayStr); setNewTodoDateTimeMode('full_day'); setNewTodoSpecificTime(''); setNewTodoStartTime(''); setNewTodoEndTime(''); setNewTodoTimeSlots([{ startTime: '09:00', endTime: '17:00' }]); setNewTodoRepeatInterval(30); setNewTodoRepeatUnit('minutes'); setNewTodoPlanNodes([]); setNewTodoHasPlanNodes(false); setNewTodoYear(today.getFullYear()); setNewTodoImportant(false); setShowAddTodo(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}><span className="text-sm text-neutral-400">Loading...</span></div>;

  const pendingList = filteredTodos().filter(t => !t.completed);
  const doneList = filteredTodos().filter(t => t.completed);

  const ganttTodos = filteredTodos().sort((a, b) => {
    const ta = TYPE_SORT_ORDER[a.todoType] ?? 9;
    const tb = TYPE_SORT_ORDER[b.todoType] ?? 9;
    if (ta !== tb) return ta - tb;
    return (a.date || '').localeCompare(b.date || '');
  });
  const rangeStart = ganttCurrentDate;
  const totalDays = ganttLevel.totalDays;
  const rangeStartDate = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
  const ganttDays: string[] = [];
  const ganttDayLabels: string[] = [];
  const isDayView = ganttLevel.key === 'day' || ganttLevel.key === 'halfday' || ganttLevel.key === '2hour';
  if (isDayView) {
    const ds = `${rangeStartDate.getFullYear()}-${String(rangeStartDate.getMonth() + 1).padStart(2, '0')}-${String(rangeStartDate.getDate()).padStart(2, '0')}`;
    ganttDays.push(ds);
    ganttDayLabels.push(`${rangeStartDate.getMonth() + 1}/${rangeStartDate.getDate()}`);
  } else {
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(rangeStartDate); d.setDate(d.getDate() + i);
      ganttDays.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
      ganttDayLabels.push(ganttLevel.key === 'quarter' && i % 7 !== 0 ? '' : `${d.getMonth() + 1}/${d.getDate()}`);
    }
  }
  const getDayIndex = (ds: string) => { const idx = ganttDays.indexOf(ds); return idx >= 0 ? idx : -1; };
  const getTodoSpan = (t: Todo) => {
    const startIdx = t.date ? getDayIndex(t.date) : -1;
    if (startIdx < 0 && !isDayView) return null;
    if (isDayView) {
      const ds = ganttDays[0];
      if (t.todoType === 'onetime' && t.date === ds) return { start: 0, end: 0 };
      if (t.todoType === 'fixedRepeat' || t.todoType === 'allDayRepeat' || t.todoType === 'yearly') return { start: 0, end: 0 };
      if (t.todoType === 'planned' && t.date && t.endDate && ds >= t.date && ds <= t.endDate) return { start: 0, end: 0 };
      return null;
    }
    let endIdx = startIdx;
    if (t.endDate) { const ei = getDayIndex(t.endDate); if (ei >= 0) endIdx = ei; }
    else if (t.todoType === 'onetime') { endIdx = startIdx; }
    else if (t.todoType === 'fixedRepeat' || t.todoType === 'allDayRepeat' || t.todoType === 'yearly') { endIdx = totalDays - 1; }
    else { endIdx = Math.min(startIdx + 2, totalDays - 1); }
    return { start: startIdx, end: endIdx };
  };
  const baseDayWidth = ganttLevel.baseDayWidth;
  const dayWidth = baseDayWidth;
  const labelWidth = 140;
  const rowHeight = 36;
  const svgW = labelWidth + totalDays * dayWidth;

  const visibleGanttTodos = ganttTodos.filter(t => getTodoSpan(t) !== null);
  const ganttGroupedByType: { type: TodoType; todos: Todo[] }[] = [];
  let currentType: TodoType | null = null;
  for (const t of visibleGanttTodos) {
    if (t.todoType !== currentType) {
      currentType = t.todoType;
      ganttGroupedByType.push({ type: currentType, todos: [t] });
    } else {
      ganttGroupedByType[ganttGroupedByType.length - 1].todos.push(t);
    }
  }
  let ganttRowOffset = 0;
  const ganttGroupOffsets: { type: TodoType; startRow: number; count: number }[] = [];
  for (const g of ganttGroupedByType) {
    ganttGroupOffsets.push({ type: g.type, startRow: ganttRowOffset, count: g.todos.length });
    ganttRowOffset += g.todos.length;
  }
  const svgH = visibleGanttTodos.length * rowHeight + ganttGroupedByType.length * 28 + 20;

  const typeBarColor: Record<string, string> = { onetime: 'bg-blue-500/80 border-blue-400/60 text-blue-100', fixedRepeat: 'bg-purple-500/80 border-purple-400/60 text-purple-100', allDayRepeat: 'bg-emerald-500/80 border-emerald-400/60 text-emerald-100', planned: 'bg-amber-500/80 border-amber-400/60 text-amber-100', yearly: 'bg-orange-500/80 border-orange-400/60 text-orange-100' };
  const typeLineColor: Record<string, string> = { onetime: 'rgba(59,130,246,0.5)', fixedRepeat: 'rgba(168,85,247,0.5)', allDayRepeat: 'rgba(16,185,129,0.5)', planned: 'rgba(245,158,11,0.5)', yearly: 'rgba(249,115,22,0.5)' };

  const handleGanttDragStart = (idx: number) => { setDragIdx(idx); };
  const handleGanttDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleGanttDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
    const item = visibleGanttTodos[dragIdx];
    const reordered = [...visibleGanttTodos];
    reordered.splice(dragIdx, 1);
    reordered.splice(idx, 0, item);
    const newOrder = reordered.map(t => t.id);
    const updated = [...todos].sort((a, b) => {
      const ia = newOrder.indexOf(a.id);
      const ib = newOrder.indexOf(b.id);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    setTodos(updated);
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const selectedDateTodos = selectedDate ? getTodosOnDateStr(selectedDate) : [];

  const timelineRowH = 26;

  return (
    <>
      <PageTitle title="Todos" />
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <div>

          {/* ─── LIST + CALENDAR ─── */}
          <div className="flex gap-0 items-stretch">
              {/* LEFT: Categories + Today + full list */}
              <div className="flex-1 min-w-0 border-r border-neutral-200 dark:border-neutral-700">

                {/* Category pills */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 flex-wrap">
                  {categories.map(cat => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} onContextMenu={e => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, type: 'category', data: cat }); }}
                      className={`px-3 py-1 text-xs font-mono transition-all ${selectedCategory === cat.id ? 'bg-orange-600 text-white rounded' : 'text-neutral-500 border border-neutral-200 dark:border-neutral-700 rounded hover:text-neutral-700 dark:hover:text-neutral-300'}`}>
                      {cat.name}
                      <span className={`ml-1 ${selectedCategory === cat.id ? 'opacity-70' : 'text-neutral-300'}`}>{cat.id === 'all' ? todos.length : todos.filter(t => t.category === cat.id).length}</span>
                    </button>
                  ))}
                  <button onClick={() => setShowAddCategory(true)} className="px-2 py-1 text-neutral-400 hover:text-orange-500 transition-colors"><Plus size={14} /></button>
                </div>

                {/* Today focus list */}
                <div className="border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50/50 dark:bg-neutral-800/20">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold font-sans text-neutral-900 dark:text-neutral-100">Today</span>
                    <span className="text-xs text-neutral-400 font-mono">{todayTodos.length} pending</span>
                  </div>
                  {todayTodos.length === 0 ? (
                    <div className="px-4 py-4 text-center text-sm text-neutral-400">No tasks for today</div>
                  ) : (
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {todayTodos.map(todo => {
                        const tc = TODO_TYPE_COLORS[todo.todoType] || TODO_TYPE_COLORS.onetime;
                        const timeLabel = getTodoTimeLabel(todo);
                        return (
                          <div key={todo.id} className="flex items-center gap-3 px-4 py-2 group" onContextMenu={e => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, type: 'todo', data: todo }); }}>
                            <button onClick={() => toggle(todo.id)} className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-600 hover:border-orange-500 transition-colors flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-neutral-900 dark:text-neutral-100">{todo.title}</span>
                              {timeLabel && <div className="text-[10px] font-mono text-neutral-400 mt-0.5">{timeLabel}</div>}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {todo.isImportant && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 font-mono">紧急</span>}
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tc.color }} title={tc.name} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-mono text-neutral-500">Progress</span>
                    <span className="text-xs font-mono text-neutral-500">{done}/{total} · {pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {/* Task list */}
                <div>
                  {pendingList.length === 0 && doneList.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-neutral-400">
                      No tasks found
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {pendingList.map(todo => {
                        const tc = TODO_TYPE_COLORS[todo.todoType] || TODO_TYPE_COLORS.onetime;
                        const timeLabel = getTodoTimeLabel(todo);
                        return (
                          <div key={todo.id} onContextMenu={e => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, type: 'todo', data: todo }); }}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-all group">
                            <button onClick={() => toggle(todo.id)} className="w-4 h-4 rounded border-2 border-neutral-300 dark:border-neutral-600 hover:border-orange-500 transition-colors flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-neutral-900 dark:text-neutral-100">{todo.title}</span>
                              {timeLabel && <div className="text-[10px] font-mono text-neutral-400 mt-0.5">{timeLabel}</div>}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                              {todo.isImportant && <Star size={12} className="text-orange-500 fill-orange-500" />}
                              {todo.enableNotification && <Bell size={12} className="text-neutral-300" />}
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tc.color }} title={tc.name} />
                              <span className="text-[10px] font-mono text-neutral-400">{todo.category}</span>
                            </div>
                          </div>
                        );
                      })}
                      {doneList.length > 0 && (
                        <details className="group">
                          <summary className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer px-4 py-2 list-none flex items-center gap-1">
                            <ChevronRight className="w-3 h-3 transition-transform group-open:rotate-90" />
                            Completed ({doneList.length})
                          </summary>
                          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {doneList.map(todo => (
                              <div key={todo.id} onContextMenu={e => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, type: 'todo', data: todo }); }}
                                className="flex items-center gap-3 px-4 py-2">
                                <button onClick={() => toggle(todo.id)} className="w-4 h-4 rounded-full bg-orange-500 border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
                                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                                </button>
                                <span className="flex-1 text-sm text-neutral-400 line-through">{todo.title}</span>
                                <button onClick={() => delTodo(todo.id)} className="text-neutral-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Calendar with search + add */}
              <div className="w-[400px] shrink-0 hidden lg:block">

                {/* Search + Add button */}
                <div className="flex items-center gap-2 px-4 border-b border-neutral-200 dark:border-neutral-700" style={{ padding: '8px 16px' }}>
                  <div className="flex-1 relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-orange-500 transition-colors" />
                  </div>
                  <button onClick={() => setShowAddTodo(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-orange-600 hover:bg-orange-700 text-white transition-colors shrink-0">
                    <Plus className="w-3.5 h-3.5" />add todo
                  </button>
                </div>

                {/* Month nav */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-sans">{monthNames[month]} {year}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1 text-neutral-400 hover:text-neutral-600"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={() => { setCurrentDate(new Date()); setSelectedDate(todayStr); }} className="text-[10px] font-mono text-orange-500 hover:text-orange-600 px-2 py-0.5">Today</button>
                    <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1 text-neutral-400 hover:text-neutral-600"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Calendar header */}
                <div className="grid grid-cols-7 border-b border-neutral-100 dark:border-neutral-800">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-[10px] font-mono font-medium text-neutral-400 py-1.5 text-center">{d}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`e-${i}`} className="h-10" />;
                    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isSel = selectedDate === ds;
                    const isTod = ds === todayStr;
                    const dayTodos = getTodosOnDate(day);
                    const hasImportant = dayTodos.some(t => t.isImportant);
                    return (
                      <div key={day} onClick={() => handleDateClick(day)}
                        className={`h-16 flex flex-col items-center cursor-pointer transition-all ${
                          isSel
                            ? 'bg-orange-50/50 dark:bg-orange-900/10'
                            : isTod
                              ? ''
                              : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                        }`}>
                        {(() => { const lunar = getLunarDay(year, month, day); const lunarText = lunar.text; return (
                          <div className={`flex flex-col items-center mt-1 ${isSel ? 'bg-orange-500 rounded-full px-1.5 py-0.5' : isTod ? 'rounded-full border-2 border-orange-400 dark:border-orange-500 px-1.5 py-0.5' : ''}`}>
                            <span className={`text-xs font-mono leading-none ${isSel ? 'text-white font-bold' : isTod ? 'text-orange-500 font-bold' : 'text-neutral-500'}`}>{day}</span>
                            {lunarText && <span className={`text-[8px] leading-none ${isSel ? 'text-white/80' : isTod ? 'text-orange-400' : lunar.isHoliday ? 'text-orange-500 font-medium' : 'text-neutral-400'}`} style={{ marginTop: 1 }}>{lunarText}</span>}
                          </div>
                        ); })()}
                        {dayTodos.length > 0 && (() => {
                          return (
                            <div className="mt-1 flex items-center justify-center">
                              {dayTodos.length === 1 ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                              ) : (
                                <span className="text-[8px] font-mono font-bold text-purple-500">+{dayTodos.length}</span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>

                {/* Selected date: Timeline with x-axis */}
                {selectedDate && selectedDateTodos.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-4 py-2 bg-neutral-50/50 dark:bg-neutral-800/20">
                      <h3 className="text-xs font-mono text-neutral-500">{selectedDate}</h3>
                      <button onClick={() => setSelectedDate(null)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"><X size={12} /></button>
                    </div>

                    <div>
                      {/* Progress bar timeline - fits container width */}
                      {(() => {
                        const todos = selectedDateTodos;
                        const segments: { startMin: number; endMin: number; color: string }[] = [];
                        for (const t of todos) {
                          const tc = TODO_TYPE_COLORS[t.todoType] || TODO_TYPE_COLORS.onetime;
                          const sm = timeToMinutes(getTodoTime(t));
                          const em = t.endTime ? timeToMinutes(t.endTime) : sm >= 0 ? sm + 60 : -1;
                          if (sm >= 0 && em > sm) segments.push({ startMin: sm, endMin: em, color: tc.color });
                          else if (sm >= 0) segments.push({ startMin: sm, endMin: sm + 60, color: tc.color });
                        }
                        const earliest = segments.length > 0 ? Math.min(...segments.map(s => s.startMin)) : 0;
                        const latest = segments.length > 0 ? Math.max(...segments.map(s => s.endMin)) : 1440;
                        const rangeStart = Math.max(0, earliest - 30);
                        const rangeEnd = Math.min(1440, latest + 30);
                        const rangeMin = Math.max(rangeEnd - rangeStart, 120);
                        const toPercent = (min: number) => ((min - rangeStart) / rangeMin) * 100;
                        const tickStep = rangeMin <= 180 ? 15 : rangeMin <= 480 ? 30 : 60;
                        const ticks: number[] = [];
                        const firstTick = Math.ceil(rangeStart / tickStep) * tickStep;
                        for (let m = firstTick; m <= rangeEnd; m += tickStep) ticks.push(m);

                        return (
                          <div className="px-3 pt-2 pb-1">
                            {/* Progress bar */}
                            <div className="relative h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700">
                              {segments.map((seg, si) => (
                                <div key={si} className="absolute h-full rounded-full" style={{ left: `${toPercent(seg.startMin)}%`, width: `${toPercent(seg.endMin) - toPercent(seg.startMin)}%`, backgroundColor: seg.color + 'CC', top: -1, bottom: -1 }} />
                              ))}
                            </div>
                            {/* Time labels under bar */}
                            <div className="relative h-4 mt-0.5">
                              {ticks.map(min => {
                                const h = Math.floor(min / 60);
                                const m = min % 60;
                                const pct = toPercent(min);
                                return (
                                  <span key={min} className="absolute text-[8px] font-mono text-neutral-400 -translate-x-1/2" style={{ left: `${pct}%` }}>
                                    {m === 0 ? `${h}` : `${h}:${String(m).padStart(2, '0')}`}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Task list with vertical color line */}
                      <div className="p-2 flex flex-col gap-1.5">
                        {selectedDateTodos.map((todo) => {
                          const tc = TODO_TYPE_COLORS[todo.todoType] || TODO_TYPE_COLORS.onetime;
                          const startMin = timeToMinutes(getTodoTime(todo));
                          const endMin = todo.endTime ? timeToMinutes(todo.endTime) : startMin >= 0 ? startMin + 60 : -1;
                          const hasTime = startMin >= 0;
                          const timeLabel = hasTime
                            ? `${String(Math.floor(startMin / 60)).padStart(2, '0')}:${String(startMin % 60).padStart(2, '0')}` + (endMin > startMin ? `-${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}` : '')
                            : '';
                          return (
                            <div key={todo.id}
                              onClick={() => toggle(todo.id)}
                              className={`flex items-center rounded border border-neutral-200 dark:border-neutral-700 cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/30 ${todo.completed ? 'opacity-40' : ''}`}
                              style={{ minHeight: timelineRowH, borderLeft: `4px solid ${tc.color}` }}>
                              <span className={`text-xs truncate flex-1 min-w-0 px-2 ${todo.completed ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-700 dark:text-neutral-300'}`}>{todo.title}</span>
                              {timeLabel && <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 flex-shrink-0 pr-2">{timeLabel}</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                 )}
               </div>
            </div>

          {/* ─── GANTT TIMELINE ─── */}
          <section className="border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex justify-between items-center text-xs text-neutral-400 px-4 py-2 border-b border-neutral-200 dark:border-neutral-700 font-mono">
                <span className="font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  Timeline
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setGanttZoomLevel(z => Math.max(0, z - 1))} className="p-1 text-neutral-400 hover:text-neutral-600" title="Zoom out"><ZoomOut className="w-3.5 h-3.5" /></button>
                  <span className="text-[10px] text-neutral-500 w-8 text-center">{ganttLevel.label}</span>
                  <button onClick={() => setGanttZoomLevel(z => Math.min(GANTT_ZOOM_LEVELS.length - 1, z + 1))} className="p-1 text-neutral-400 hover:text-neutral-600" title="Zoom in"><ZoomIn className="w-3.5 h-3.5" /></button>
                  <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" />
                  <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 border border-neutral-200 dark:border-neutral-700">
                    {GANTT_ZOOM_LEVELS.map((lv, li) => (
                      <button key={lv.key} onClick={() => setGanttZoomLevel(li)} className={`px-1.5 py-0.5 text-[10px] transition-all ${ganttZoomLevel === li ? 'bg-orange-500 text-white' : 'text-neutral-400 hover:text-neutral-600'}`}>
                        {lv.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => ganttNav(-1)} className="p-1 text-neutral-400 hover:text-neutral-600"><ChevronLeft className="w-3.5 h-3.5" /></button>
                  <button onClick={() => ganttNav(0)} className="text-[10px] text-orange-500 hover:text-orange-600 font-mono">Today</button>
                  <button onClick={() => ganttNav(1)} className="p-1 text-neutral-400 hover:text-neutral-600"><ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="overflow-x-auto" ref={ganttContainerRef}>
                <div className="relative w-full" style={{ minWidth: svgW }}>
                  {/* Header with day/time labels */}
                  {!isDayView ? (
                    <div className="grid border-b border-neutral-200 dark:border-neutral-700 text-[10px] text-neutral-400 font-mono sticky top-0 bg-white dark:bg-neutral-900 z-10" style={{ gridTemplateColumns: `${labelWidth}px repeat(${totalDays}, minmax(${dayWidth}px, 1fr))` }}>
                      <div className="px-3 py-2 font-medium text-neutral-500 text-xs border-r border-neutral-200 dark:border-neutral-700">Task</div>
                      {ganttDayLabels.map((dl, i) => {
                        const isToday = ganttDays[i] === todayStr;
                        const isWeekend = new Date(ganttDays[i]).getDay() === 0 || new Date(ganttDays[i]).getDay() === 6;
                        return <div key={i} className={`py-2 text-center border-r border-neutral-100 dark:border-neutral-800 last:border-r-0 ${isToday ? 'text-orange-600 font-bold bg-orange-50/50 dark:bg-orange-900/10' : isWeekend ? 'text-neutral-300 bg-neutral-50/30 dark:bg-neutral-800/10' : ''}`}>{dl}</div>;
                      })}
                    </div>
                  ) : (() => {
                    const tickInterval = ganttLevel.key === '2hour' ? 5 : ganttLevel.key === 'halfday' ? 30 : 60;
                    const tickCount = (24 * 60) / tickInterval;
                    return (
                      <div className="border-b border-neutral-200 dark:border-neutral-700 sticky top-0 bg-white dark:bg-neutral-900 z-10 w-full" style={{ display: 'grid', gridTemplateColumns: `${labelWidth}px 1fr` }}>
                        <div className="px-3 py-2 font-medium text-neutral-500 text-xs border-r border-neutral-200 dark:border-neutral-700">Task</div>
                        <div className="relative w-full">
                          {Array.from({ length: tickCount }, (_, i) => {
                            const totalMin = i * tickInterval;
                            const h = Math.floor(totalMin / 60);
                            const m = totalMin % 60;
                            const showLabel = m === 0 || (tickInterval <= 15 && m % 30 === 0);
                            return <div key={i} className="absolute top-0 h-full border-r border-neutral-100 dark:border-neutral-800/50" style={{ left: `${(i / tickCount) * 100}%`, width: `${(1 / tickCount) * 100}%` }}>
                              {showLabel && <span className="text-[8px] font-mono text-neutral-400 block text-center pt-1">{String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}</span>}
                            </div>;
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* SVG dependency lines */}
                  <svg className="absolute inset-0 pointer-events-none" style={{ width: svgW, height: svgH }} preserveAspectRatio="none">
                    {(() => {
                      const lines: React.ReactNode[] = [];
                      let rowIdx = 0;
                      for (const group of ganttGroupedByType) {
                        const groupStartY = 28 + rowIdx * rowHeight + group.todos.length * rowHeight / 2;
                        group.todos.forEach((todo, ti) => {
                          const span = getTodoSpan(todo);
                          if (!span) return;
                          const barEndX = labelWidth + (span.end + 1) * dayWidth;
                          const barY = 28 + rowIdx * rowHeight + rowHeight / 2;
                          group.todos.forEach((other, oi) => {
                            if (oi <= ti) return;
                            const ospan = getTodoSpan(other);
                            if (!ospan) return;
                            const oStartX = labelWidth + ospan.start * dayWidth;
                            const oY = 28 + (rowIdx + oi - ti) * rowHeight + rowHeight / 2;
                            if (ospan.start <= span.end + 1 && ospan.start > span.start) {
                              const color = typeLineColor[todo.todoType] || typeLineColor.onetime;
                              lines.push(
                                <g key={`dep-${todo.id}-${other.id}`}>
                                  <path d={`M ${barEndX} ${barY} C ${barEndX + 20} ${barY}, ${oStartX - 20} ${oY}, ${oStartX} ${oY}`} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
                                  <polygon points={`${oStartX},${oY} ${oStartX-5},${oY-3} ${oStartX-5},${oY+3}`} fill={color} />
                                </g>
                              );
                            }
                          });
                          rowIdx++;
                        });
                      }
                      return lines;
                    })()}
                  </svg>

                  {/* Task rows grouped by type */}
                  <div className="relative">
                    {visibleGanttTodos.length === 0 ? (
                      <div className="py-12 text-center text-xs text-neutral-400">No tasks in this time range</div>
                    ) : (() => {
                      let rowIdx = 0;
                      return ganttGroupedByType.map((group, gi) => {
                        const tc = TODO_TYPE_COLORS[group.type] || TODO_TYPE_COLORS.onetime;
                        const startRow = rowIdx;
                        const rows = (
                          <React.Fragment key={`group-${gi}`}>
                            {/* Type section header */}
                            <div className={`flex items-center ${gi === 0 ? 'border-b' : 'border-t border-b'} border-neutral-200 dark:border-neutral-700`} style={{ height: 28, backgroundColor: tc.color + '10' }}>
                              <div className="px-3 flex items-center gap-2 w-full">
                                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: tc.color }} />
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wide" style={{ color: tc.color }}>{TYPE_LABELS[group.type]}</span>
                                <span className="text-[10px] font-mono text-neutral-400">({group.todos.length})</span>
                              </div>
                            </div>

                            {/* Task rows */}
                            {group.todos.map((todo, ti) => {
                              const span = getTodoSpan(todo);
                              if (!span) return null;
                              const barColor = typeBarColor[todo.todoType] || typeBarColor.onetime;
                              const globalIdx = startRow + ti;
                              const barLeftPct = isDayView ? (() => {
                                const startMin = timeToMinutes(getTodoTime(todo));
                                return startMin >= 0 ? (startMin / 1440) * 100 : 0;
                              })() : (span.start / totalDays) * 100;
                              const barWidthPct = isDayView ? (() => {
                                const startMin = timeToMinutes(getTodoTime(todo));
                                const endMin = todo.endTime ? timeToMinutes(todo.endTime) : startMin >= 0 ? startMin + 60 : -1;
                                if (startMin < 0) return 100;
                                return endMin > startMin ? ((endMin - startMin) / 1440) * 100 : (60 / 1440) * 100;
                              })() : ((span.end - span.start + 1) / totalDays) * 100;
                              const isTodayInRange = !isDayView && ganttDays.slice(span.start, span.end + 1).includes(todayStr);
                              return (
                                <div key={todo.id}
                                  draggable={!isDayView}
                                  onDragStart={isDayView ? undefined : () => handleGanttDragStart(globalIdx)}
                                  onDragOver={isDayView ? undefined : e => handleGanttDragOver(e, globalIdx)}
                                  onDrop={isDayView ? undefined : () => handleGanttDrop(globalIdx)}
                                  onDragEnd={isDayView ? undefined : () => { setDragIdx(null); setDragOverIdx(null); }}
                                  className={`grid items-center border-b border-neutral-100 dark:border-neutral-800/30 transition-all ${isDayView ? '' : 'cursor-grab active:cursor-grabbing'} ${dragOverIdx === globalIdx ? 'border-t-2 border-t-orange-400' : ''} ${dragIdx === globalIdx ? 'opacity-40' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/20'}`}
                                  style={{ gridTemplateColumns: isDayView ? `${labelWidth}px 1fr` : `${labelWidth}px repeat(${totalDays}, minmax(${dayWidth}px, 1fr))`, height: rowHeight }}>
                                  <div className="truncate text-neutral-700 dark:text-neutral-300 font-medium text-xs pr-2 px-3 flex items-center gap-1.5 border-r border-neutral-100 dark:border-neutral-800">
                                    {todo.isImportant && <Star size={10} className="text-orange-500 fill-orange-500 flex-shrink-0" />}
                                    <span className="truncate">{todo.title}</span>
                                  </div>
                                  {!isDayView ? (
                                    <div className="col-span-${totalDays} relative h-5 flex items-center" style={{ gridColumn: `2 / ${totalDays + 2}` }}>
                                      <div style={{ left: `${barLeftPct}%`, width: `${barWidthPct}%` }} className={`absolute h-5 rounded border px-2 flex items-center text-[10px] select-none ${todo.completed ? 'opacity-40 line-through' : ''} ${barColor}`}>
                                        <span className="truncate">{todo.title}</span>
                                      </div>
                                      {isTodayInRange && (
                                        <div className="absolute w-px h-6 bg-orange-400/60" style={{ left: `${((getDayIndex(todayStr) + 0.5) / totalDays) * 100}%` }} />
                                      )}
                                    </div>
                                  ) : (
                                    <div className="relative h-5 flex items-center">
                                      <div style={{ left: `${barLeftPct}%`, width: `${barWidthPct}%` }} className={`absolute h-5 rounded border px-2 flex items-center text-[10px] select-none ${todo.completed ? 'opacity-40 line-through' : ''} ${barColor}`}>
                                        <span className="truncate">{todo.title}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </React.Fragment>
                        );
                        rowIdx += group.todos.length;
                        return rows;
                      });
                    })()}
                  </div>
                </div>
              </div>
            </section>

        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} items={contextMenu.type === 'category'
          ? [{ label: 'Rename', onClick: () => renameCat(contextMenu.data as Category) }, { label: 'Delete', onClick: () => delCat((contextMenu.data as Category).id), danger: true }]
          : [{ label: 'Rename', onClick: () => renameTodo(contextMenu.data as Todo) }, { label: 'Delete', onClick: () => delTodo((contextMenu.data as Todo).id), danger: true }]
        } onClose={() => setContextMenu(null)} />
      )}

      {/* Add Category */}
      {showAddCategory && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm" onClick={() => setShowAddCategory(false)}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-80 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium mb-4 text-neutral-900 dark:text-neutral-100">New Category</h3>
            <input type="text" placeholder="Name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCat()} autoFocus className="w-full px-3 py-2 text-sm border-b border-neutral-200 dark:border-neutral-700 outline-none bg-transparent text-neutral-900 dark:text-neutral-100 focus:border-orange-500 transition-colors mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowAddCategory(false)} className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">Cancel</button>
              <button onClick={addCat} className="px-4 py-1.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Rename */}
      {showRenameModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm" onClick={() => { setShowRenameModal(false); setRenameTarget(null); setRenameValue(''); }}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-80 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium mb-4 text-neutral-900 dark:text-neutral-100">Rename</h3>
            <input type="text" value={renameValue} onChange={e => setRenameValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && doRename()} autoFocus className="w-full px-3 py-2 text-sm border-b border-neutral-200 dark:border-neutral-700 outline-none bg-transparent text-neutral-900 dark:text-neutral-100 focus:border-orange-500 transition-colors mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowRenameModal(false); setRenameTarget(null); setRenameValue(''); }} className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">Cancel</button>
              <button onClick={doRename} disabled={!renameValue.trim()} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${renameValue.trim() ? 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'}`}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Todo */}
      {showAddTodo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm overflow-y-auto" onClick={() => setShowAddTodo(false)}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-[460px] max-w-[90vw] my-8 shadow-xl" onClick={e => e.stopPropagation()}>
            <input type="text" placeholder="What needs to be done?" value={newTodoTitle} onChange={e => setNewTodoTitle(e.target.value)} autoFocus className="w-full text-lg font-sans outline-none bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-5" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 w-16 shrink-0">Category</span>
                <select value={newTodoCategory} onChange={e => setNewTodoCategory(e.target.value)} className="flex-1 px-2 py-1.5 text-sm border-b border-neutral-200 dark:border-neutral-700 outline-none bg-transparent text-neutral-900 dark:text-neutral-100">
                  {categories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <span className="text-xs text-neutral-400">Type</span>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {(Object.keys(TODO_TYPE_COLORS) as TodoType[]).map(type => {
                    const cfg = TODO_TYPE_COLORS[type];
                    return (
                      <button key={type} type="button" onClick={() => setNewTodoType(type)} className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border transition-all ${newTodoType === type ? 'border-orange-600 bg-orange-600 text-white' : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-300'}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />{cfg.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {newTodoType === 'onetime' && (
                <div className="space-y-3">
                  <CustomDateInput value={newTodoDate} onChange={v => setNewTodoDate(v)} />
                  <div className="flex gap-1.5">
                    {[{ v: 'full_day', l: 'All day' }, { v: 'specific_time', l: 'At time' }, { v: 'time_range', l: 'Range' }].map(m => (
                      <button key={m.v} type="button" onClick={() => setNewTodoDateTimeMode(m.v as typeof newTodoDateTimeMode)} className={`px-2.5 py-1 text-xs rounded-full transition-all ${newTodoDateTimeMode === m.v ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300' : 'text-neutral-400 hover:text-neutral-600'}`}>{m.l}</button>
                    ))}
                  </div>
                  {newTodoDateTimeMode === 'specific_time' && <CustomTimeInput value={newTodoSpecificTime} onChange={v => setNewTodoSpecificTime(v)} />}
                  {newTodoDateTimeMode === 'time_range' && <div className="flex gap-2"><CustomTimeInput value={newTodoStartTime} onChange={v => setNewTodoStartTime(v)} /><span className="text-neutral-300 self-center">–</span><CustomTimeInput value={newTodoEndTime} onChange={v => setNewTodoEndTime(v)} /></div>}
                </div>
              )}
              {newTodoType === 'fixedRepeat' && (
                <div className="space-y-3">
                  <TimeSlotEditor slots={newTodoTimeSlots} onChange={setNewTodoTimeSlots} />
                  <div className="flex items-center gap-2 text-xs"><span className="text-neutral-400">Every</span><input type="number" min="1" max="999" value={newTodoRepeatInterval} onChange={e => setNewTodoRepeatInterval(parseInt(e.target.value) || 1)} className="w-14 px-2 py-1 border-b border-neutral-200 dark:border-neutral-700 outline-none bg-transparent text-sm" /><select value={newTodoRepeatUnit} onChange={e => setNewTodoRepeatUnit(e.target.value as 'minutes' | 'hours')} className="px-1 py-1 text-xs border-b border-neutral-200 dark:border-neutral-700 outline-none bg-transparent"><option value="minutes">min</option><option value="hours">hr</option></select></div>
                </div>
              )}
              {newTodoType === 'allDayRepeat' && <CustomTimeInput value={newTodoSpecificTime} onChange={v => setNewTodoSpecificTime(v)} />}
              {newTodoType === 'planned' && (
                <div className="space-y-3">
                  <div className="flex gap-3"><CustomDateInput value={newTodoDate} onChange={v => setNewTodoDate(v)} /><CustomDateInput value={newTodoEndDate} onChange={v => setNewTodoEndDate(v)} min={newTodoDate} /></div>
                  <label className="flex items-center gap-2 text-xs text-neutral-500 cursor-pointer"><input type="checkbox" checked={newTodoHasPlanNodes} onChange={e => setNewTodoHasPlanNodes(e.target.checked)} className="accent-orange-500" />Time nodes</label>
                  {newTodoHasPlanNodes && <PlanNodeEditor nodes={newTodoPlanNodes} onChange={setNewTodoPlanNodes} startDate={newTodoDate} endDate={newTodoEndDate} />}
                </div>
              )}
              {newTodoType === 'yearly' && <select value={newTodoYear} onChange={e => setNewTodoYear(parseInt(e.target.value))} className="px-2 py-1 text-sm border-b border-neutral-200 dark:border-neutral-700 outline-none bg-transparent">{[...Array(5)].map((_, i) => { const y = new Date().getFullYear() + i; return <option key={y} value={y}>{y}</option>; })}</select>}

              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-xs text-neutral-500 cursor-pointer"><input type="checkbox" checked={newTodoEnableNotification} onChange={e => setNewTodoEnableNotification(e.target.checked)} className="accent-orange-500" />Notify</label>
                <label className="flex items-center gap-1.5 text-xs text-neutral-500 cursor-pointer"><input type="checkbox" checked={newTodoImportant} onChange={e => setNewTodoImportant(e.target.checked)} className="accent-orange-500" />Important</label>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button onClick={() => setShowAddTodo(false)} className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">Cancel</button>
              <button onClick={createTodo} disabled={!newTodoTitle.trim()} className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${newTodoTitle.trim() ? 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'}`}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
