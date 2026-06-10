## 路由结构

所有页面在 `app/(pages)/` 路由组下，路由组不影响 URL：

| 文件 | URL | 说明 |
|---|---|---|
| `app/page.tsx` | `/` | 首页 |
| `app/(pages)/posts/page.tsx` | `/posts` | 文章列表，服务端获取 `getAllPosts()`，传给客户端 `BlogList` |
| `app/(pages)/posts/[slug]/page.tsx` | `/posts/:slug` | 文章详情，`generateStaticParams` 生成所有静态路径 |
| `app/(pages)/about/page.tsx` | `/about` | 关于页 |
| `app/(pages)/todos/page.tsx` | `/todos` | Todo 应用，数据由 `lib/todos-db.ts` 管理 |
| `app/(pages)/tools/page.tsx` | `/tools` | 工具列表 |
| `app/(pages)/tools/[tool]/page.tsx` | `/tools/:tool` | 工具详情（diff-checker、json-formatter、sql-simulator 等） |

`generateStaticParams` 在 `app/(pages)/posts/[slug]/page.tsx` 中调用，确保所有文章在构建期生成静态 HTML。

---

## 关键路径别名

`tsconfig.json` 中配置：

```json
{ "paths": { "@/*": ["./*"] } }
```

项目内所有 import 使用 `@/` 前缀引用根目录下的文件，例如 `@/lib/markdown`、`@/components/CodeBlock`。

---

## 样式系统

- **Tailwind CSS v4**，配置文件 `tailwind.config.ts`，通过 `@tailwindcss/postcss` 处理
- 所有设计 token（颜色、字体、间距）定义为 CSS 变量，在 `app/globals.css` 的 `:root` 中声明
- 全局样式文件：`app/globals.css`（token + body 基础样式）、`styles/code-highlight.css`（代码高亮主题覆盖）、`styles/algolia-search.css`
- 字体：`Public_Sans`（UI sans）、`IBM_Plex_Mono`（代码）、`Noto_Sans_SC`（中文），通过 CSS 变量 `--font-public-sans`、`--font-ibm-plex-mono`、`--font-noto-sans-sc` 注入

主题色：`#ea580c`（orange-600），贯穿链接、高亮、TOC 激活状态。
