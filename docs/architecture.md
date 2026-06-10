## Commands

```bash
# 开发
pnpm dev            # 先执行 scan-pdfs，再启动 next dev
pnpm build          # 先执行 scan-pdfs + copy-images，再静态导出 (next build)
pnpm lint           # eslint --ext .ts,.tsx,.js,.jsx

# 单独脚本
pnpm copy:images    # 把 posts/*/images/ 下的图片复制到 public/posts/*/images/
pnpm scan-pdfs      # 扫描 public/pdf/ 目录，生成 public/json/pdf-list.json
pnpm generate-posts # tsx scripts/generate-posts-json.ts（生成 posts JSON 索引）
```

没有测试框架，无 `test` 命令。

---

## 整体架构

项目是一个 **Next.js 16 纯静态博客**，在 `next.config.ts` 中配置了：

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',       // 静态导出，构建产物在 out/
  basePath: '/blog',      // 所有路由都带 /blog 前缀
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactCompiler: true,    // babel-plugin-react-compiler 已启用
  images: { unoptimized: true },
};
```

由于是纯静态导出，**没有服务端运行时**，`app/api/` 目录目前为空，所有数据都在构建期通过 `lib/markdown.ts` 读取 `posts/` 目录生成。

---

## 内容管道：从 `.md`/`.mdx` 到页面

整条内容链路如下：

```
posts/<category>/<slug>.md(x)
        ↓  lib/markdown.ts
   gray-matter 解析 frontmatter
        ↓
   .mdx → @mdx-js/mdx compile()   →  compiledContent (function-body 字符串)
   .md  → transformMarkdownDetails() →  rawMarkdown 字符串
        ↓
  Post 对象 { slug, title, date, content, isMdxCompiled, ... }
        ↓
  app/(pages)/posts/[slug]/page.tsx
        ↓
  components/MDXComponents.tsx（客户端渲染）
```

### `lib/markdown.ts` 核心函数

| 函数 | 说明 |
|---|---|
| `getAllPostSlugs()` | 递归扫描 `posts/` 目录，返回所有 slug |
| `getPostData(slug)` | 读取单篇文章，解析 frontmatter，编译 MDX |
| `getAllPosts()` | 获取全部文章，按日期降序排列 |
| `extractToc(content)` | 从 rawContent 提取 h2/h3/h4 生成目录项 |
| `transformMarkdownDetails(content)` | 把 `:::details` 语法预处理为 `<details>` HTML |

### MDX 编译配置

`.mdx` 文件在服务端通过 `@mdx-js/mdx` 的 `compile()` 编译为 `function-body` 格式的字符串，编译时应用以下插件：

```ts
// lib/markdown.ts
const compiled = await compile(content, {
  outputFormat: 'function-body',
  remarkPlugins: [
    remarkGfm,
    remarkMath,
    remarkDetails,          // 处理 ::: details
    [remarkAdmonitionsCustom, { keywords: ['details','note','warning','tip','important','info'] }],
  ],
  rehypePlugins: [
    rehypeSlug,             // 给标题生成 id
    rehypeHighlight,        // 代码高亮
    rehypeKatex,            // 数学公式
  ],
  development: false,
});
```

编译失败时会回退到 raw markdown，`isMdxCompiled` 字段标记实际使用的渲染路径。
