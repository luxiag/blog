
# 交互式组件使用指南

本指南介绍如何在博客文章中使用交互式组件，类似于 VuePress 或 VitePress 的功能。

## 基本语法

使用特殊的注释标记来包裹交互式组件内容：

```markdown
<!-- interactive-component-start -->
<div id="my-component">
  <!-- 你的 HTML 内容 -->
</div>

<script>
// 你的 JavaScript 代码
</script>
<!-- interactive-component-end -->
```

## 组件结构

每个交互式组件包含两部分：

1. **HTML 部分**：定义组件的结构和样式
2. **脚本部分**：包含组件的交互逻辑，使用 React Hooks

## 示例

### 简单点击交互

```markdown
<!-- interactive-component-start -->
<div id="click-demo">
  <button id="my-button">点击我</button>
  <p id="message">还没有点击</p>
</div>

<script>
const { useState, useEffect } = React;

const [clicked, setClicked] = useState(false);

useEffect(() => {
  const button = document.getElementById('my-button');
  const message = document.getElementById('message');

  if (button && message) {
    button.addEventListener('click', () => {
      setClicked(true);
      message.textContent = '按钮被点击了！';
    });
  }
}, []);
</script>
<!-- interactive-component-end -->
```

### 计数器

```markdown
<!-- interactive-component-start -->
<div id="counter-demo">
  <h3>计数器</h3>
  <button id="decrement">-</button>
  <span id="count">0</span>
  <button id="increment">+</button>
</div>

<script>
const { useState, useEffect } = React;

const [count, setCount] = useState(0);

useEffect(() => {
  const decrement = document.getElementById('decrement');
  const increment = document.getElementById('increment');
  const countDisplay = document.getElementById('count');

  if (decrement && increment && countDisplay) {
    decrement.addEventListener('click', () => {
      setCount(prev => prev - 1);
    });

    increment.addEventListener('click', () => {
      setCount(prev => prev + 1);
    });

    countDisplay.textContent = count;
  }
}, [count]);

useEffect(() => {
  const countDisplay = document.getElementById('count');
  if (countDisplay) {
    countDisplay.textContent = count;
  }
}, [count]);
</script>
<!-- interactive-component-end -->
```

## 可用的 React Hooks

在脚本部分，你可以使用以下 React Hooks：

- `useState`：管理组件状态
- `useEffect`：处理副作用和生命周期
- `useRef`：获取 DOM 元素引用

## 安全沙箱

交互式组件运行在受限的沙箱环境中，只能访问：

- React Hooks
- 安全的 DOM API（通过沙箱提供的 document 对象）
- 日志工具（logger）

## 注意事项

1. 确保每个交互式组件有唯一的 ID
2. 使用 `useEffect` 来处理 DOM 操作和事件监听
3. 避免直接修改 DOM，优先使用 React 的状态管理
4. 组件之间无法直接通信，每个组件都是独立的

## 最佳实践

1. 保持组件简单和专注
2. 使用语义化的 HTML 标签
3. 添加适当的错误处理
4. 为复杂的交互提供说明文字

## 故障排除

如果组件不工作：

1. 检查控制台是否有错误信息
2. 确保所有 ID 都是唯一的
3. 验证脚本语法是否正确
4. 检查是否正确使用了 React Hooks
