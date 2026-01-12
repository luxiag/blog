
---
title: 交互式组件演示
date: 2023-12-15
excerpt: 演示如何在博客中使用交互式组件，类似 VuePress 或 VitePress
tags: [交互式, React, 组件]
---

# 交互式组件演示

本篇博客演示了如何在 Markdown 文件中添加交互式组件，类似于 VuePress 或 VitePress 的功能。

## 基本用法

使用特殊的注释标记来包裹交互式组件内容：

<!-- interactive-component-start -->
<div id="demo-container">
  <p>点击下面的按钮改变文本颜色：</p>
  <button id="color-btn" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
    改变颜色
  </button>
  <p id="color-text" style="margin-top: 10px; font-size: 18px; font-weight: bold;">这段文字会改变颜色</p>
</div>

<script>
// 使用 React Hooks 来管理状态和副作用
const { useState, useEffect } = React;

// 在组件挂载后添加事件监听
useEffect(() => {
  const colorBtn = document.getElementById('color-btn');
  const colorText = document.getElementById('color-text');

  if (colorBtn && colorText) {
    const colors = ['#e53935', '#1e88e5', '#43a047', '#fb8c00', '#8e24aa'];
    let colorIndex = 0;

    colorBtn.addEventListener('click', () => {
      colorIndex = (colorIndex + 1) % colors.length;
      colorText.style.color = colors[colorIndex];
    });
  }
}, []);
</script>
<!-- interactive-component-end -->

## 计数器示例

<!-- interactive-component-start -->
<div id="counter-container">
  <h3>计数器示例</h3>
  <div style="display: flex; align-items: center; gap: 10px;">
    <button id="decrement-btn" style="padding: 8px 16px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">-</button>
    <span id="counter-value" style="font-size: 24px; font-weight: bold; min-width: 40px; text-align: center;">0</span>
    <button id="increment-btn" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">+</button>
  </div>
</div>

<script>
const { useState, useEffect } = React;

// 使用状态管理计数器
const [count, setCount] = useState(0);

// 在组件挂载后设置事件监听器
useEffect(() => {
  const decrementBtn = document.getElementById('decrement-btn');
  const incrementBtn = document.getElementById('increment-btn');
  const counterValue = document.getElementById('counter-value');

  if (decrementBtn && incrementBtn && counterValue) {
    decrementBtn.addEventListener('click', () => {
      setCount(prevCount => {
        const newCount = prevCount - 1;
        counterValue.textContent = newCount;
        return newCount;
      });
    });

    incrementBtn.addEventListener('click', () => {
      setCount(prevCount => {
        const newCount = prevCount + 1;
        counterValue.textContent = newCount;
        return newCount;
      });
    });

    // 初始化显示
    counterValue.textContent = count;
  }
}, [count]);
</script>
<!-- interactive-component-end -->

## 列表操作示例

<!-- interactive-component-start -->
<div id="list-container">
  <h3>待办事项列表</h3>
  <div style="margin-bottom: 15px;">
    <input id="todo-input" type="text" placeholder="添加新任务..." style="padding: 8px; width: 70%; border: 1px solid #ccc; border-radius: 4px;" />
    <button id="add-btn" style="padding: 8px 16px; margin-left: 10px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">添加</button>
  </div>
  <ul id="todo-list" style="list-style-type: none; padding: 0; max-height: 200px; overflow-y: auto;">
    <!-- 待办事项将在这里动态添加 -->
  </ul>
</div>

<script>
const { useState, useEffect } = React;

// 使用状态管理待办事项列表
const [todos, setTodos] = useState([
  { id: 1, text: '学习 React', completed: false },
  { id: 2, text: '写一篇博客', completed: false }
]);

// 渲染待办事项列表
const renderTodos = () => {
  const todoList = document.getElementById('todo-list');
  if (!todoList) return;

  todoList.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.style.cssText = 'padding: 8px; margin-bottom: 5px; background-color: #f5f5f5; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;';

    const textSpan = document.createElement('span');
    textSpan.textContent = todo.text;
    textSpan.style.textDecoration = todo.completed ? 'line-through' : 'none';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '删除';
    deleteBtn.style.cssText = 'padding: 4px 8px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;';
    deleteBtn.addEventListener('click', () => {
      setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
    });

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);

    li.addEventListener('click', (e) => {
      if (e.target !== deleteBtn) {
        setTodos(prevTodos => 
          prevTodos.map(t => 
            t.id === todo.id ? { ...t, completed: !t.completed } : t
          )
        );
      }
    });

    todoList.appendChild(li);
  });
};

// 在组件挂载后设置事件监听器
useEffect(() => {
  const todoInput = document.getElementById('todo-input');
  const addBtn = document.getElementById('add-btn');

  if (todoInput && addBtn) {
    addBtn.addEventListener('click', () => {
      const text = todoInput.value.trim();
      if (text) {
        setTodos(prevTodos => [
          ...prevTodos,
          { id: Date.now(), text, completed: false }
        ]);
        todoInput.value = '';
      }
    });

    todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addBtn.click();
      }
    });
  }

  // 初始渲染
  renderTodos();
}, [todos]);

// 当待办事项列表变化时重新渲染
useEffect(() => {
  renderTodos();
}, [todos]);
</script>
<!-- interactive-component-end -->

## 总结

通过使用交互式组件，你可以在博客中创建丰富的交互式内容，包括：

1. 动态 UI 元素和交互
2. 数据可视化和图表
3. 代码演示和实验环境
4. 表单和用户输入处理

这些组件使用 React Hooks 和安全的沙箱环境，确保了安全性和性能。
