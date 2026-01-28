"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import PageTitle from '@/components/PageTitle';
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
  Category,
  Todo,
} from '@/lib/todos-db';

// 右键菜单组件
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

// 获取日历数据
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

  // 新分类弹窗状态
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // 重命名弹窗状态
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{ type: 'category' | 'todo'; id: string | number; name: string } | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // 新待办弹窗状态
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('personal');
  const [newTodoDate, setNewTodoDate] = useState('');
  const [newTodoImportant, setNewTodoImportant] = useState(false);

  // 右键菜单状态
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; type: string; data: any } | null>(null);

  // 初始化加载数据
  useEffect(() => {
    async function loadData() {
      try {
        const data = await initializeData();
        setCategories(data.categories);
        setTodos(data.todos);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendarDays = getCalendarData(year, month);

  // 筛选逻辑
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
      if (selectedDate && todo.date !== selectedDate) {
        return false;
      }
      if (searchQuery && !todo.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [todos, selectedCategory, filter, selectedDate, searchQuery]);

  // 统计
  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // 获取某日期是否有待办
  const hasTodoOnDate = useCallback((day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return todos.some(t => t.date === dateStr);
  }, [todos, year, month]);

  // 切换待办完成状态
  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
      await updateTodo(updatedTodo);
    }
  };

  // 日期点击处理
  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (selectedDate === dateStr) {
      setSelectedDate(null);
    } else {
      setSelectedDate(dateStr);
    }
  };

  // 添加分类
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

  // 删除分类
  const handleDeleteCategory = async (catId: string) => {
    await deleteCategory(catId);
    setCategories(prev => prev.filter(c => c.id !== catId));
    if (selectedCategory === catId) {
      setSelectedCategory('all');
    }
  };

  // 重命名分类
  const handleRenameCategory = (cat: Category) => {
    setRenameTarget({ type: 'category', id: cat.id, name: cat.name });
    setRenameValue(cat.name);
    setShowRenameModal(true);
  };

  // 重命名待办
  const handleRenameTodo = (todo: Todo) => {
    setRenameTarget({ type: 'todo', id: todo.id, name: todo.title });
    setRenameValue(todo.title);
    setShowRenameModal(true);
  };

  // 删除待办
  const handleDeleteTodo = async (todoId: number) => {
    await deleteTodo(todoId);
    setTodos(prev => prev.filter(t => t.id !== todoId));
  };

  // 执行重命名
  const handleRename = async () => {
    if (renameTarget && renameValue.trim()) {
      if (renameTarget.type === 'category') {
        const updatedCat = { ...categories.find(c => c.id === renameTarget.id)!, name: renameValue.trim() };
        await updateCategory(updatedCat);
        setCategories(prev => prev.map(c => c.id === renameTarget.id ? updatedCat : c));
      } else {
        const updatedTodo = { ...todos.find(t => t.id === renameTarget.id)!, title: renameValue.trim() };
        await updateTodo(updatedTodo);
        setTodos(prev => prev.map(t => t.id === renameTarget.id ? updatedTodo : t));
      }
    }
    setShowRenameModal(false);
    setRenameTarget(null);
    setRenameValue('');
  };

  // 添加待办
  const handleAddTodo = async () => {
    if (newTodoTitle.trim() && newTodoDate) {
      const newTodo: Todo = {
        id: Date.now(),
        title: newTodoTitle,
        category: newTodoCategory,
        date: newTodoDate,
        completed: false,
        isImportant: newTodoImportant,
      };
      await addTodo(newTodo);
      setTodos(prev => [...prev, newTodo]);
      setNewTodoTitle('');
      setNewTodoDate('');
      setNewTodoImportant(false);
      setShowAddTodo(false);
    }
  };

  // 分类右键菜单
  const handleCategoryContextMenu = (e: React.MouseEvent, cat: Category) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: 'category',
      data: cat,
    });
  };

  // 待办右键菜单
  const handleTodoContextMenu = (e: React.MouseEvent, todo: Todo) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: 'todo',
      data: todo,
    });
  };

  // 分类菜单项
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

  // 待办菜单项
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

  // 加载中状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] text-sm text-neutral-500">
        Loading...
      </div>
    );
  }

  return (
    <>
      <PageTitle title="待办事项" />
      <div className="flex h-[calc(100vh-60px)] bg-white relative">
      {/* 左侧分类导航 */}
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

        {/* 添加分类按钮 */}
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

      {/* 中间 Todo 列表 */}
      <div className="flex-1 flex flex-col border-r overflow-hidden">
        {/* 搜索框和新增待办 */}
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
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none bg-white text-neutral-900 dark:text-neutral-100"
            />
          </div>

          {/* 新增待办按钮 */}
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

        {/* 筛选器 */}
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

          {/* 日期筛选标签 */}
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

        {/* 任务列表 */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {filteredTodos().length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredTodos().map(todo => (
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
              ))}
            </div>
          ) : (
            <div className="text-center py-15 text-sm text-neutral-500">
              No tasks found
            </div>
          )}
        </div>
      </div>

      {/* 右侧面板 */}
      <div className="w-80 flex flex-col">
        {/* 已办/全部统计 */}
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

          {/* 进度条 */}
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

        {/* 日历 */}
        <div className="flex-1 p-6 overflow-auto">
          {/* 月份导航 */}
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

          {/* 星期标题 */}
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

          {/* 日历网格 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} />;
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              const hasTodo = hasTodoOnDate(day);

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
                  {/* 有待办时显示的圆点 */}
                  {hasTodo && !isSelected && (
                    <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-orange-800" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 右键菜单 */}
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

      {/* 添加分类弹窗 */}
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

      {/* 重命名弹窗 */}
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

      {/* 新增待办弹窗 */}
      {showAddTodo && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          onClick={() => setShowAddTodo(false)}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-90"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
              Add Todo
            </h3>

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

            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1.5 text-neutral-900 dark:text-neutral-100">
                  Category
                </label>
                <select
                  value={newTodoCategory}
                  onChange={(e) => setNewTodoCategory(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none bg-white dark:bg-neutral-700 cursor-pointer text-neutral-900 dark:text-neutral-100"
                >
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-medium mb-1.5 text-neutral-900 dark:text-neutral-100">
                  Date
                </label>
                <input
                  type="date"
                  value={newTodoDate}
                  onChange={(e) => setNewTodoDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            <div className="mb-5">
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

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddTodo(false)}
                className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all text-neutral-900 dark:text-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTodo}
                disabled={!newTodoTitle.trim() || !newTodoDate}
                className={`px-4 py-2 text-sm rounded-lg transition-all cursor-pointer ${
                  newTodoTitle.trim() && newTodoDate
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400'
                }`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
