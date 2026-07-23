
# 交互式组件使用指南

本指南介绍博客中可直接在 `.mdx` 文件里使用的交互式组件，均已在 `MDXComponents.tsx` 中注册，无需 import。

写作展示类组件（CodeTabs、Steps、FileTree 等）的用法见 [MDX 特殊语法](./mdx-syntax.md)。

---

## InteractiveComponent — HTML + Script 沙箱

嵌入自定义 HTML 结构和 JavaScript 交互逻辑：

```mdx
<InteractiveComponent
  html={`
    <div style="text-align:center; padding:16px;">
      <div id="counter-display" style="font-size:2rem; font-weight:bold;">0</div>
      <button id="inc-btn">+</button>
      <button id="dec-btn">−</button>
    </div>
  `}
  script={`
    var count = 0;
    var display = document.getElementById('counter-display');
    function render() { display.textContent = count; }
    document.getElementById('inc-btn').addEventListener('click', function() { count++; render(); });
    document.getElementById('dec-btn').addEventListener('click', function() { count--; render(); });
  `}
/>
```

**可用 API**：脚本中可直接使用 `React`、`useState`、`useRef`、`useEffect`、`useMemo`、`useCallback`、`logger`，以及受限的 `document`（仅限组件内部查询）。

## CodePenDemo — 实时 JSX 编辑器

CodePen 风格的代码编辑 + 实时预览，代码必须定义一个 React 函数组件，组件会自动调用 `render()` 渲染：

```mdx
<CodePenDemo title="交互式计数器" height="240px" code={`function Demo() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{count}</div>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}`} />
```

**Props**：`code`（JSX 代码）、`title`、`height`。代码中可直接使用 `useState` 等 React Hooks，底层由 `react-live` 驱动。

## SqlSimulator — SQL 练习环境

内置 SQL.js 数据库，支持建表、插入、查询，带代码高亮：

```mdx
<SqlSimulator
  title="SQL 查询练习"
  description="尝试查询年龄大于 25 的用户"
  initialSql={`
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER);
INSERT INTO users VALUES (1, 'Alice', 28);
INSERT INTO users VALUES (2, 'Bob', 22);
  `}
  defaultQuery="SELECT * FROM users WHERE age > 25"
  answerSql="SELECT name, age FROM users WHERE age > 25"
/>
```

**Props**：`initialSql`（建表/插入语句）、`defaultQuery`（默认查询）、`answerSql`（参考答案）、`title`、`description`、`dataset`（内置数据集 ID）。

## FunctionPlotter — 函数绘图器

交互式数学函数可视化，支持拖拽平移、滚轮缩放：

```mdx
<FunctionPlotter
  expressions={[
    { expr: 'sin(x)', color: '#ea580c' },
    { expr: 'cos(x)', color: '#6bcb77' },
  ]}
  xMin={-6} xMax={6} yMin={-3} yMax={3}
  height={320}
/>
```

**Props**：`expressions`（`{ expr, color }[]`）、`xMin/xMax/yMin/yMax`（视口范围）、`height`、`editable`（是否可编辑表达式）、`showTime`（动画时间变量 `t`）、`paramExpr`（参数表达式）。

内置函数：`sin`、`cos`、`tan`、`sqrt`、`abs`、`exp`、`log`、`pow`、`floor`、`ceil`、`round`、`clamp`、`mix`、`smoothstep`、`fract`、`mod` 等。

## ShaderPreview — GLSL 着色器预览

实时 WebGL 着色器渲染 + 代码编辑，支持暂停/重置：

```mdx
<ShaderPreview
  title="渐变波浪"
  code={`
precision mediump float;
uniform float uTime;
varying vec2 vUv;
void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float wave = sin(uv.x * 3.0 + uTime * 2.0) * 0.3;
  float d = length(vec2(uv.x, uv.y - wave));
  float glow = 0.02 / d;
  vec3 col = vec3(0.91, 0.35, 0.05);
  gl_FragColor = vec4(col * glow, 1.0);
}
  `}
/>
```

**Props**：`code`（fragment shader 代码）、`vertexCode`（可选顶点着色器）、`title`、`editable`（默认 `true`，设为 `false` 只读展示）。内置 `uTime` uniform 动画。

---

## 故障排除

1. **组件不渲染**：检查浏览器控制台是否有报错
2. **CodePenDemo 报 "must call render"**：确保代码定义了一个函数组件（组件名任意），系统会自动追加 `render(<组件名 />)`
3. **InteractiveComponent 报 "already declared"**：脚本中不要重复声明沙箱已注入的变量（`useState`、`document` 等）
4. **ShaderPreview 黑屏**：检查 GLSL 代码语法，`uTime` 为内置 uniform，`vUv` 需在 vertex shader 中定义
5. **SqlSimulator 加载失败**：确保 `public/sql/` 目录下有 `sql-wasm.js` 和 `sql-wasm.wasm`
