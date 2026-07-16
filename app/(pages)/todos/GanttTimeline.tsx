'use client';

import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { Todo, TodoType, TODO_TYPE_COLORS, PlanNode } from '@/lib/todos-db';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEK_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseDate(s: string): Date { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function fmtDate(d: Date): string { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function addDays(d: Date, n: number): Date { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function daysBetween(a: Date, b: Date): number { return Math.round((b.getTime() - a.getTime()) / 86400000); }

const ROW_H = 34;
const LABEL_W = 180;
const MIN_DAY_W = 8;
const MAX_DAY_W = 120;
const DEFAULT_DAY_W = 28;

interface Props {
  todos: Todo[];
  currentDate: Date;
  selectedDate: string | null;
  selectedTodoId: number | null;
  onDateClick: (s: string) => void;
  onTodoClick: (id: number) => void;
  onNavigate: (d: -1 | 1 | 0) => void;
  viewMode: string;
  onViewModeChange: (m: string) => void;
  onTodoUpdate: (todo: Todo) => void;
  onTodoEdit: (todo: Todo) => void;
  onTodoDelete: (id: number) => void;
  onTodoAddAtDate: (dateStr: string) => void;
  categories: { id: string; name: string }[];
}

export default function GanttTimeline({
  todos, currentDate, selectedDate, selectedTodoId,
  onDateClick, onTodoClick, onNavigate, viewMode, onViewModeChange,
  onTodoUpdate, onTodoEdit, onTodoDelete, onTodoAddAtDate, categories,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const labelScrollRef = useRef<HTMLDivElement>(null);
  const [dayWidth, setDayWidth] = useState(DEFAULT_DAY_W);
  const [centerDate, setCenterDate] = useState(new Date());
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [filterActive, setFilterActive] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; todo: Todo } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, scrollLeft: 0, scrollTop: 0 });

  const TOTAL_DAYS = 365;
  const startDate = useMemo(() => addDays(centerDate, -Math.floor(TOTAL_DAYS / 2)), [centerDate]);
  const days = useMemo(() => Array.from({ length: TOTAL_DAYS }, (_, i) => addDays(startDate, i)), [startDate]);
  const todayStr = fmtDate(new Date());
  const todayOffset = daysBetween(startDate, new Date());
  const chartW = TOTAL_DAYS * dayWidth;

  const visibleRange = useMemo(() => {
    if (!scrollRef.current) return { start: 0, end: 30 };
    const sl = scrollRef.current.scrollLeft;
    const vw = scrollRef.current.clientWidth - LABEL_W;
    return { start: Math.floor(sl / dayWidth), end: Math.ceil((sl + vw) / dayWidth) };
  }, [dayWidth]);

  const filtered = useMemo(() => {
    let list = todos;
    if (filterActive) list = list.filter(t => !t.completed);
    if (filterCat !== 'all') list = list.filter(t => t.category === filterCat);
    return list.filter(t => {
      if (!t.date) return false;
      if (t.todoType === 'planned' && t.endDate) {
        const s = parseDate(t.date), e = parseDate(t.endDate), r = addDays(startDate, TOTAL_DAYS - 1);
        return s <= r && e >= startDate;
      }
      if (t.todoType === 'fixedRepeat' || t.todoType === 'allDayRepeat') return true;
      if (t.todoType === 'yearly') return true;
      const d = parseDate(t.date), r = addDays(startDate, TOTAL_DAYS - 1);
      return d >= startDate && d <= r;
    });
  }, [todos, startDate, filterActive, filterCat]);

  const groups = useMemo(() => {
    const map = new Map<string, Todo[]>();
    for (const t of filtered) {
      const c = t.category || 'uncategorized';
      if (!map.has(c)) map.set(c, []);
      map.get(c)!.push(t);
    }
    const res: { category: string; todos: Todo[] }[] = [];
    for (const [c, ts] of map) res.push({ category: c, todos: ts.sort((a, b) => a.date.localeCompare(b.date)) });
    return res;
  }, [filtered]);

  const totalRows = useMemo(() => {
    let n = 0;
    for (const g of groups) { n++; if (!collapsed.has(g.category)) n += g.todos.length; }
    return n;
  }, [groups, collapsed]);

  const getBarPos = useCallback((todo: Todo) => {
    if (todo.todoType === 'planned' && todo.endDate) {
      const s = Math.max(0, daysBetween(startDate, parseDate(todo.date)));
      const e = Math.min(TOTAL_DAYS, daysBetween(startDate, parseDate(todo.endDate)) + 1);
      return { left: s, width: e - s, type: 'bar' as const };
    }
    if (todo.todoType === 'onetime') return { left: daysBetween(startDate, parseDate(todo.date)), width: 0, type: 'milestone' as const };
    if (todo.todoType === 'fixedRepeat' || todo.todoType === 'allDayRepeat') return { left: 0, width: TOTAL_DAYS, type: 'repeat' as const };
    if (todo.todoType === 'yearly') return { left: 0, width: TOTAL_DAYS, type: 'yearly' as const };
    return { left: daysBetween(startDate, parseDate(todo.date)), width: 1, type: 'milestone' as const };
  }, [startDate]);

  const isOverdue = useCallback((todo: Todo) => {
    if (todo.completed) return false;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (todo.todoType === 'onetime') return parseDate(todo.date) < today;
    if (todo.todoType === 'planned' && todo.endDate) return parseDate(todo.endDate) < today;
    return false;
  }, []);

  const planProgress = useCallback((todo: Todo) => {
    if (todo.todoType !== 'planned' || !todo.planNodes || todo.planNodes.length === 0) return null;
    const done = todo.planNodes.filter(n => parseDate(n.date) <= new Date()).length;
    return { done, total: todo.planNodes.length, pct: Math.round((done / todo.planNodes.length) * 100) };
  }, []);

  // Auto-scroll to today on mount / viewMode change
  useEffect(() => {
    if (scrollRef.current && todayOffset >= 0 && todayOffset < TOTAL_DAYS) {
      const targetLeft = todayOffset * dayWidth - (scrollRef.current.clientWidth - LABEL_W) / 2;
      scrollRef.current.scrollLeft = Math.max(0, targetLeft);
    }
  }, [viewMode]);

  // Sync label scroll with chart scroll
  useEffect(() => {
    const el = scrollRef.current;
    const lbl = labelScrollRef.current;
    if (!el || !lbl) return;
    const sync = () => { lbl.scrollTop = el.scrollTop; };
    el.addEventListener('scroll', sync);
    return () => el.removeEventListener('scroll', sync);
  }, []);

  // Scroll = zoom (centered on mouse)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -3 : 3;
        setDayWidth(w => Math.max(MIN_DAY_W, Math.min(MAX_DAY_W, w + delta)));
        return;
      }
      // Plain scroll = zoom
      e.preventDefault();
      const sc = scrollRef.current;
      if (!sc) return;
      const rect = sc.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - LABEL_W;
      const scrollX = sc.scrollLeft;
      const oldDayW = dayWidth;
      const delta = e.deltaY > 0 ? -3 : 3;
      const newDayW = Math.max(MIN_DAY_W, Math.min(MAX_DAY_W, oldDayW + delta));
      if (newDayW === oldDayW) return;

      const mouseDay = (scrollX + mouseX) / oldDayW;
      const newScrollLeft = mouseDay * newDayW - mouseX;

      setDayWidth(newDayW);
      requestAnimationFrame(() => { sc.scrollLeft = newScrollLeft; });
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [dayWidth]);

  // Pan: drag empty space to scroll
  const onPanStart = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX, scrollLeft: el.scrollLeft, scrollTop: el.scrollTop });
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - e.clientX;
      const dy = ev.clientY - e.clientY;
      el.scrollLeft = el.scrollLeft - dx;
      el.scrollTop = el.scrollTop - dy;
      e.clientX = ev.clientX;
      e.clientY = ev.clientY;
    };
    const onUp = () => { setIsPanning(false); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  // Drag task bar
  const onDragTaskStart = useCallback((e: React.MouseEvent, todoId: number, type: 'move' | 'resize') => {
    e.stopPropagation();
    e.preventDefault();
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;
    const startX = e.clientX;
    const origDate = todo.date;
    const origEndDate = todo.endDate;
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dDays = Math.round(dx / dayWidth);
      if (type === 'move') {
        const newDate = fmtDate(addDays(parseDate(origDate), dDays));
        const updates: Partial<Todo> = { date: newDate };
        if (origEndDate) updates.endDate = fmtDate(addDays(parseDate(origEndDate), dDays));
        const t2 = todos.find(t => t.id === todoId);
        if (t2) onTodoUpdate({ ...t2, ...updates } as Todo);
      } else if (origEndDate) {
        const t2 = todos.find(t => t.id === todoId);
        if (t2) onTodoUpdate({ ...t2, endDate: fmtDate(addDays(parseDate(origEndDate), dDays)) });
      }
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [todos, dayWidth, onTodoUpdate]);

  // Double-click empty space = add todo at date
  const onChartDoubleClick = useCallback((e: React.MouseEvent) => {
    const sc = scrollRef.current;
    if (!sc) return;
    const rect = sc.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - LABEL_W;
    const scrollX = sc.scrollLeft;
    const dayIndex = Math.floor((scrollX + mouseX) / dayWidth);
    if (dayIndex >= 0 && dayIndex < TOTAL_DAYS) {
      onTodoAddAtDate(fmtDate(days[dayIndex]));
    }
  }, [dayWidth, days]);

  // Fullscreen
  useEffect(() => {
    const el = rootRef.current; if (!el) return;
    if (isFullscreen) el.requestFullscreen?.();
    else if (document.fullscreenElement === el) document.exitFullscreen?.();
  }, [isFullscreen]);
  useEffect(() => {
    const h = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const exportPNG = useCallback(async () => {
    if (!rootRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(rootRef.current, { backgroundColor: '#fff', scale: 2 });
      const link = document.createElement('a'); link.download = 'gantt.png'; link.href = canvas.toDataURL(); link.click();
    } catch { /* ignore */ }
  }, []);

  const toggleCat = (c: string) => setCollapsed(p => { const n = new Set(p); n.has(c) ? n.delete(c) : n.add(c); return n; });
  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

  const zoomLabel = dayWidth <= 12 ? 'Year' : dayWidth <= 22 ? 'Quarter' : dayWidth <= 35 ? 'Month' : dayWidth <= 60 ? '2 Week' : dayWidth <= 90 ? 'Week' : 'Day';
  const showWeekHeaders = dayWidth >= 20;
  const showDayNumbers = dayWidth >= 14;
  const showDayLabels = dayWidth >= 30;
  const showBarLabels = dayWidth >= 20;
  const showBarProgress = dayWidth >= 25;

  let rowIdx = 0;

  const renderTaskBar = (todo: Todo, top: number) => {
    const bar = getBarPos(todo);
    const cfg = TODO_TYPE_COLORS[todo.todoType] || TODO_TYPE_COLORS.onetime;
    const color = cfg.color;
    const sel = todo.id === selectedTodoId;
    const hov = todo.id === hoveredId;
    const over = isOverdue(todo);
    const prog = planProgress(todo);
    const leftPx = bar.left * dayWidth;
    const widthPx = Math.max(bar.type === 'milestone' ? 0 : 4, bar.width * dayWidth);

    if (bar.type === 'bar') {
      return (
        <div key={todo.id} className="absolute" style={{ top, left: leftPx, width: widthPx, height: 26 }}>
          <div
            className={`absolute inset-0 rounded-md cursor-grab active:cursor-grabbing transition-shadow ${isPanning ? 'pointer-events-none' : ''}`}
            style={{ backgroundColor: color, opacity: todo.completed ? 0.35 : hov ? 1 : 0.85, outline: sel ? '2px solid #ea580c' : 'none', outlineOffset: 1, boxShadow: over ? '0 0 0 2px rgba(220,38,38,0.4)' : undefined }}
            onClick={e => { e.stopPropagation(); onTodoClick(todo.id); }}
            onMouseDown={e => onDragTaskStart(e, todo.id, 'move')}
            onMouseEnter={e => { setHoveredId(todo.id); const r = e.currentTarget.getBoundingClientRect(); setTooltip({ x: r.right + 8, y: r.top, todo }); }}
            onMouseLeave={() => { setHoveredId(null); setTooltip(null); }}
            onDoubleClick={e => { e.stopPropagation(); onTodoEdit(todo); }}
            onContextMenu={e => e.preventDefault()}
          >
            {prog && showBarProgress && <div className="absolute inset-y-0 left-0 rounded-l-md" style={{ width: `${prog.pct}%`, backgroundColor: 'rgba(255,255,255,0.25)' }} />}
            <div className="relative flex items-center h-full px-1.5 gap-1">
              {todo.isImportant && <div className="w-1.5 h-1.5 rounded-full bg-white/80 flex-shrink-0" />}
              {showBarLabels && <span className="text-[10px] font-semibold font-sans text-white truncate leading-none">{todo.title}</span>}
              {prog && showBarProgress && <span className="ml-auto text-[8px] font-mono text-white/70 flex-shrink-0">{prog.done}/{prog.total}</span>}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20 rounded-r-md" onMouseDown={e => onDragTaskStart(e, todo.id, 'resize')} />
            {todo.planNodes?.map((node, ni) => {
              const nOff = daysBetween(parseDate(todo.date), parseDate(node.date));
              const pct = bar.width > 0 ? (nOff / bar.width) * 100 : 50;
              return <div key={ni} className="absolute top-1/2 -translate-y-1/2 pointer-events-none" style={{ left: `${pct}%`, width: 6, height: 6, transform: 'translate(-3px,-50%) rotate(45deg)', backgroundColor: '#fff', opacity: 0.9, boxShadow: '0 0 0 1.5px rgba(0,0,0,0.2)' }} />;
            })}
          </div>
        </div>
      );
    }
    if (bar.type === 'milestone') {
      const cx = (bar.left + 0.5) * dayWidth;
      const sz = Math.min(18, Math.max(10, dayWidth * 0.5));
      return (
        <div key={todo.id} className={`absolute ${isPanning ? 'pointer-events-none' : ''}`} style={{ top: top + (26 - sz) / 2, left: cx }}>
          <div
            className="cursor-grab active:cursor-grabbing"
            style={{ width: sz, height: sz, transform: `translate(${-sz / 2}px,0) rotate(45deg)`, backgroundColor: color, opacity: todo.completed ? 0.3 : hov ? 1 : 0.8, outline: sel ? '2px solid #ea580c' : 'none', outlineOffset: 2, boxShadow: over ? '0 0 0 3px rgba(220,38,38,0.4)' : undefined }}
            onClick={e => { e.stopPropagation(); onTodoClick(todo.id); }}
            onMouseDown={e => onDragTaskStart(e, todo.id, 'move')}
            onMouseEnter={e => { setHoveredId(todo.id); const r = e.currentTarget.getBoundingClientRect(); setTooltip({ x: r.right + 8, y: r.top, todo }); }}
            onMouseLeave={() => { setHoveredId(null); setTooltip(null); }}
            onDoubleClick={e => { e.stopPropagation(); onTodoEdit(todo); }}
          />
        </div>
      );
    }
    if (bar.type === 'repeat') {
      const stripeW = Math.max(3, dayWidth * 0.6);
      return (
        <div key={todo.id} className={`absolute ${isPanning ? 'pointer-events-none' : ''}`} style={{ top, left: leftPx, width: widthPx, height: 26 }}>
          <div
            className="absolute inset-0 rounded-md cursor-pointer"
            style={{ outline: sel ? '2px solid #ea580c' : 'none', outlineOffset: 1 }}
            onClick={e => { e.stopPropagation(); onTodoClick(todo.id); }}
            onMouseEnter={e => { setHoveredId(todo.id); const r = e.currentTarget.getBoundingClientRect(); setTooltip({ x: r.right + 8, y: r.top, todo }); }}
            onMouseLeave={() => { setHoveredId(null); setTooltip(null); }}
            onDoubleClick={e => { e.stopPropagation(); onTodoEdit(todo); }}
          >
            <div className="w-full h-full rounded-md overflow-hidden" style={{ background: `repeating-linear-gradient(90deg, ${color} 0px, ${color} ${stripeW}px, transparent ${stripeW}px, transparent ${stripeW * 1.5}px)`, opacity: todo.completed ? 0.25 : hov ? 0.8 : 0.5 }} />
            {showBarLabels && <div className="absolute inset-0 flex items-center px-2"><span className="text-[10px] font-medium font-sans truncate leading-none opacity-70" style={{ color: 'var(--foreground)' }}>{todo.title}</span></div>}
          </div>
        </div>
      );
    }
    if (bar.type === 'yearly') {
      return (
        <div key={todo.id} className={`absolute ${isPanning ? 'pointer-events-none' : ''}`} style={{ top: top + 5, left: leftPx, width: widthPx, height: 16 }}>
          <div className="w-full h-full rounded-full cursor-pointer" style={{ backgroundColor: color, opacity: todo.completed ? 0.2 : hov ? 0.5 : 0.3, outline: sel ? '2px solid #ea580c' : 'none', outlineOffset: 1 }}
            onClick={e => { e.stopPropagation(); onTodoClick(todo.id); }}
            onMouseEnter={e => { setHoveredId(todo.id); const r = e.currentTarget.getBoundingClientRect(); setTooltip({ x: r.right + 8, y: r.top, todo }); }}
            onMouseLeave={() => { setHoveredId(null); setTooltip(null); }}
            onDoubleClick={e => { e.stopPropagation(); onTodoEdit(todo); }}
          >
            {showBarLabels && <span className="text-[9px] font-mono text-white/60 px-2 truncate leading-[16px]">{todo.title}</span>}
          </div>
        </div>
      );
    }
    return null;
  };

  // Dependency arrows
  const renderDeps = () => {
    const posMap = new Map<number, { right: number; left: number; top: number }>();
    let ri = 0;
    for (const g of groups) { ri++; if (collapsed.has(g.category)) continue; for (const t of g.todos) { const bar = getBarPos(t); posMap.set(t.id, { left: bar.left * dayWidth, right: (bar.left + bar.width) * dayWidth, top: ri * ROW_H + 4 + 13 }); ri++; } }
    const els: React.ReactNode[] = [];
    for (const t of filtered) {
      if (!t.dependsOn) continue;
      for (const depId of t.dependsOn) {
        const from = posMap.get(depId), to = posMap.get(t.id);
        if (!from || !to) continue;
        const x1 = from.right, y1 = from.top, x2 = to.left, y2 = to.top;
        const mx = x1 + (x2 - x1) * 0.4;
        els.push(
          <svg key={`d-${t.id}-${depId}`} className="absolute top-0 left-0 pointer-events-none" style={{ width: chartW, height: totalRows * ROW_H + 20, overflow: 'visible' }}>
            <path d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" strokeDasharray="4 2" />
            <polygon points={`${x2},${y2} ${x2 - 5},${y2 - 3} ${x2 - 5},${y2 + 3}`} fill="rgba(0,0,0,0.2)" />
          </svg>
        );
      }
    }
    return els;
  };

  return (
    <div ref={rootRef} className={`flex flex-col h-full select-none bg-white dark:bg-neutral-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 h-9 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-1.5">
          <button onClick={() => onNavigate(-1)} aria-label="Navigate backward" className="w-6 h-6 rounded border border-neutral-200 dark:border-neutral-700 flex items-center justify-center bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg></button>
          <button onClick={() => onNavigate(0)} className="px-2 h-6 text-[9px] font-mono font-medium rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300">Today</button>
          <button onClick={() => onNavigate(1)} aria-label="Navigate forward" className="w-6 h-6 rounded border border-neutral-200 dark:border-neutral-700 flex items-center justify-center bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg></button>
          <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-1" />
          <div className="flex items-center gap-0.5">
            <button onClick={() => setDayWidth(w => Math.max(MIN_DAY_W, w - 4))} aria-label="Zoom out" className="w-6 h-6 rounded text-[11px] font-mono border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700">−</button>
            <span className="text-[9px] font-mono text-neutral-400 w-7 text-center">{Math.round(dayWidth / DEFAULT_DAY_W * 100)}%</span>
            <button onClick={() => setDayWidth(w => Math.min(MAX_DAY_W, w + 4))} aria-label="Zoom in" className="w-6 h-6 rounded text-[11px] font-mono border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700">+</button>
          </div>
          <span className="text-[9px] font-mono text-neutral-400 ml-1">{zoomLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} aria-label="Filter by category" className="h-6 px-1.5 text-[9px] font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 outline-none">
            <option value="all">All</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={filterActive} onChange={e => setFilterActive(e.target.checked)} className="w-3 h-3 accent-[#ea580c]" /><span className="text-[9px] font-mono text-neutral-500">Active</span></label>
          <div className="flex items-center gap-1.5 ml-1">
            {(Object.keys(TODO_TYPE_COLORS) as TodoType[]).map(t => { const c = TODO_TYPE_COLORS[t]; return <div key={t} className="flex items-center gap-0.5">{t === 'onetime' ? <svg width="7" height="7" viewBox="0 0 8 8" fill={c.color} transform="rotate(45 4 4)"><rect x="2" y="2" width="4" height="4" rx="0.5" /></svg> : <div className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: c.color }} />}<span className="text-[7px] font-mono text-neutral-400">{c.name}</span></div>; })}
          </div>
          <button onClick={() => setIsFullscreen(f => !f)} className="w-6 h-6 rounded border border-neutral-200 dark:border-neutral-700 flex items-center justify-center bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700" title="Fullscreen" aria-label="Toggle fullscreen">
            {isFullscreen ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" /></svg> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" /></svg>}
          </button>
          <button onClick={exportPNG} className="w-6 h-6 rounded border border-neutral-200 dark:border-neutral-700 flex items-center justify-center bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700" title="Export PNG" aria-label="Export as PNG"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg></button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left labels (synced scroll) */}
        <div ref={labelScrollRef} className="flex-shrink-0 border-r border-neutral-200 dark:border-neutral-700 overflow-y-auto bg-neutral-50 dark:bg-neutral-800/50" style={{ width: LABEL_W }}>
          <div className="h-7 border-b border-neutral-200 dark:border-neutral-700 flex items-center px-3"><span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-neutral-400">Task</span></div>
          {groups.map(g => {
            const isCol = collapsed.has(g.category);
            const catColor = TODO_TYPE_COLORS[g.todos[0]?.todoType || 'onetime']?.color || '#6366F1';
            rowIdx++;
            return (
              <div key={g.category}>
                <div onClick={() => toggleCat(g.category)} className="flex items-center gap-1.5 h-7 px-3 border-b border-neutral-100 dark:border-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700/50">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-transform flex-shrink-0 ${isCol ? '' : 'rotate-90'}`}><path d="m9 18 6-6-6-6" /></svg>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: catColor }} />
                  <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 truncate">{g.category}</span>
                  <span className="text-[8px] font-mono text-neutral-400 ml-auto">{g.todos.length}</span>
                </div>
                {!isCol && g.todos.map(todo => {
                  rowIdx++;
                  const cfg = TODO_TYPE_COLORS[todo.todoType] || TODO_TYPE_COLORS.onetime;
                  const sel = todo.id === selectedTodoId;
                  const hov = todo.id === hoveredId;
                  const over = isOverdue(todo);
                  return (
                    <div key={todo.id} className={`flex items-center gap-1.5 h-[34px] px-3 border-b border-neutral-50 dark:border-neutral-800/50 cursor-pointer transition-colors ${sel ? 'bg-orange-50 dark:bg-orange-900/20' : hov ? 'bg-neutral-100 dark:bg-neutral-700/30' : ''}`} onClick={() => onTodoClick(todo.id)} onMouseEnter={() => setHoveredId(todo.id)} onMouseLeave={() => { setHoveredId(null); setTooltip(null); }}>
                      <div className={`w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center ${todo.completed ? 'bg-neutral-800 dark:bg-neutral-200 border-transparent' : 'border-neutral-300 dark:border-neutral-600'}`}>
                        {todo.completed && <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M5 12l5 5L20 7" /></svg>}
                      </div>
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: over && !todo.completed ? '#dc2626' : cfg.color }} />
                      <span className={`text-[10px] font-medium font-sans truncate ${todo.completed ? 'line-through text-neutral-400' : over ? 'text-red-600 dark:text-red-400' : 'text-neutral-800 dark:text-neutral-200'}`}>{todo.title}</span>
                      {todo.isImportant && <div className="w-1 h-1 rounded-full bg-orange-500 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Right: scrollable timeline */}
        <div ref={scrollRef} className="flex-1 overflow-auto relative" onMouseDown={onPanStart} onDoubleClick={onChartDoubleClick} style={{ cursor: isPanning ? 'grabbing' : 'grab' }}>
          <div className="relative" style={{ width: chartW, minHeight: totalRows * ROW_H + 40 }}>
            {/* Sticky date header */}
            <div className="sticky top-0 z-20 h-7 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700" style={{ width: chartW }}>
              {days.map((day, i) => {
                const isTod = fmtDate(day) === todayStr;
                const isFirst = day.getDate() === 1;
                const isMon = day.getDay() === 1;
                const isWE = isWeekend(day);
                return (
                  <div key={i} className="absolute top-0 h-full flex flex-col items-center justify-center" style={{ left: i * dayWidth, width: dayWidth }}>
                    {/* Month label on 1st */}
                    {isFirst && showWeekHeaders && (
                      <div className="absolute -left-px top-0 h-full flex items-center z-10" style={{ width: Math.max(50, dayWidth * 3) }}>
                        <span className="text-[9px] font-mono font-bold text-neutral-800 dark:text-neutral-200 pl-1">{MONTH_SHORT[day.getMonth()]} {day.getFullYear()}</span>
                      </div>
                    )}
                    {/* Weekend bg */}
                    {isWE && <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-800/30" />}
                    {/* Grid line */}
                    {(isFirst || (showWeekHeaders && isMon)) && <div className="absolute left-0 top-0 bottom-0 border-l border-neutral-200 dark:border-neutral-700" />}
                    {isTod && <div className="absolute left-0 top-0 bottom-0 border-l-2 border-[#ea580c]" />}
                    {/* Date number */}
                    {showDayNumbers && (isFirst || dayWidth >= 18) && (
                      <span className={`relative text-[8px] font-mono leading-none z-10 ${isTod ? 'bg-[#ea580c] text-white rounded px-0.5 font-bold' : isWE ? 'text-neutral-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        {day.getDate()}
                      </span>
                    )}
                    {showDayLabels && !isFirst && dayWidth >= 50 && (
                      <span className="relative text-[7px] font-mono leading-none text-neutral-400 z-10">{WEEK_SHORT[day.getDay()]}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Weekend columns */}
            <div className="absolute inset-0 top-7 pointer-events-none">
              {days.map((day, i) => isWeekend(day) ? <div key={`we-${i}`} className="absolute top-0 bottom-0 bg-neutral-50/50 dark:bg-neutral-800/20" style={{ left: i * dayWidth, width: dayWidth }} /> : null)}
              {/* Month grid lines */}
              {days.map((day, i) => { const isFirst = day.getDate() === 1; const isMon = day.getDay() === 1; const isTod = fmtDate(day) === todayStr; if (!isFirst && !(showWeekHeaders && isMon) && !isTod) return null; return <div key={`gl-${i}`} className="absolute top-0 bottom-0 pointer-events-none" style={{ left: i * dayWidth, borderLeft: isTod ? '2px solid #ea580c' : isFirst ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(0,0,0,0.04)' }} />; })}
              {/* Today line */}
              {todayOffset >= 0 && todayOffset < TOTAL_DAYS && <div className="absolute top-0 bottom-0 z-10 pointer-events-none" style={{ left: (todayOffset + 0.5) * dayWidth, width: 2, backgroundColor: '#ea580c', opacity: 0.4 }} />}
            </div>

            {/* Dependencies */}
            <div className="absolute inset-0 top-7 pointer-events-none">
              {renderDeps()}
            </div>

            {/* Task bars */}
            <div className="relative" style={{ top: 28, minHeight: totalRows * ROW_H }}>
              {(() => {
                let r = 0; const els: React.ReactNode[] = [];
                for (const g of groups) { r++; if (collapsed.has(g.category)) continue; for (const t of g.todos) { els.push(renderTaskBar(t, r * ROW_H + 4)); r++; } }
                return els;
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="fixed z-[100] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl p-3 w-52 pointer-events-none" style={{ left: tooltip.x, top: tooltip.y }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: TODO_TYPE_COLORS[tooltip.todo.todoType]?.color }} />
            <span className="text-[11px] font-semibold font-sans text-neutral-900 dark:text-neutral-100 truncate">{tooltip.todo.title}</span>
          </div>
          <div className="space-y-0.5 text-[9px] font-mono text-neutral-500">
            <div>{TODO_TYPE_COLORS[tooltip.todo.todoType]?.name} • {tooltip.todo.category}</div>
            <div>{tooltip.todo.date}{tooltip.todo.endDate ? ` → ${tooltip.todo.endDate}` : ''}</div>
            {tooltip.todo.specificTime && <div>⏰ {tooltip.todo.specificTime}</div>}
            <div>{tooltip.todo.completed ? '✓ Done' : isOverdue(tooltip.todo) ? '⚠ Overdue' : '○ Active'}</div>
            {(() => { const p = planProgress(tooltip.todo); return p ? <div>▸ {p.done}/{p.total} nodes ({p.pct}%)</div> : null; })()}
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 h-5 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 flex-shrink-0">
        <span className="text-[8px] font-mono text-neutral-400">Scroll=Zoom • Drag=Pan • Dbl-click empty=Add task • Drag bar=Move/Resize • Dbl-click bar=Edit</span>
        <span className="text-[8px] font-mono text-neutral-400">{filtered.length} tasks • {zoomLabel} view</span>
      </div>
    </div>
  );
}
