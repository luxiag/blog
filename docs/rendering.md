## 目录（TOC）与 Heading ID 机制

这是系统中**最需要保持一致性**的部分：服务端生成目录、客户端渲染标题，必须用相同的逻辑生成相同的 ID，否则目录点击跳转会失效。

### `lib/slugify.ts:slugify`

这是唯一的 slug 生成函数，服务端和客户端都必须通过它生成 ID：

```ts
export function slugify(text: string): string {
  const normalizedText = text
    .replace(/[""''""「」『』]/g, '')   // 去引号
    .replace(/[（）()]/g, '')           // 去括号
    .replace(/[：:]/g, '')              // 去冒号
    .replace(/[、，,]/g, '')            // 去顿号逗号
    .replace(/[？?]/g, '')              // 去问号
    .replace(/[\/]/g, '')              // 去斜杠
    .replace(/[.]/g, '')               // 去点号
    .replace(/[—–]+/g, '-');           // 破折号→连字符

  return normalizedText
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, '-')  // 保留中文、字母、数字
    .replace(/^-+|-+$/g, '');
}
```

### 重复 ID 的去重规则

服务端（`lib/markdown.ts:extractToc`）和客户端（`components/MDXComponents.tsx:generateHeadingId`）都维护一个 `Map<baseId, count>`，第一次出现 ID 直接用 `baseId`，后续重复依次加 `-1`、`-2`……

```ts
// 第一次 "安装" → id="安装"
// 第二次 "安装" → id="安装-1"
// 第三次 "安装" → id="安装-2"
```

**修改 `slugify` 或去重逻辑时，服务端和客户端必须同步修改。**

---

## 客户端渲染路径

`components/MDXComponents.tsx` 是纯客户端组件（`"use client"`），接收三个 prop：

```ts
interface MDXContentProps {
  content: string;        // 编译后的 MDX function-body 字符串，或原始 markdown 字符串
  isMdxCompiled?: boolean; // true → 走 new Function() 执行路径；false → 走 react-markdown
  category?: string;      // 用于图片路径解析
}
```

**MDX 渲染路径**（`isMdxCompiled = true`）：

```ts
// 1. useMemo 中 new Function(content) 执行编译后的 function-body
const fn = new Function(content);
const result = fn.call(null, { Fragment, jsx, jsxs, ... });
// 2. result.default 是 React 组件
const MDXComponent = result.default;
// 3. 传入 mdxComponents 覆盖默认元素
<MDXComponent components={mdxComponents} />
```

**Markdown 渲染路径**（`isMdxCompiled = false`）：

```ts
<ReactMarkdown
  remarkPlugins={[remarkGfm, remarkMath, [remarkAdmonitionsCustom, ...]]}
  rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
  components={mdxComponents}
>
  {content}
</ReactMarkdown>
```

重型组件（`ShaderPreview`、`CodePenDemo`、`SqlSimulator`、`CodeRunner`、`InteractiveComponent`）全部通过 `next/dynamic` + `{ ssr: false }` 懒加载，避免 SSR 阶段报错也减少初始 bundle 体积。
