# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 写新文章的要求

写新文章时必须遵守以下质量标准。

### 1. 内容必须准确

- 所有技术描述、API 说明、代码示例必须基于真实知识，不能编造
- 涉及版本特性时需明确说明适用版本
- 知识点不确定时宁可不写，也不能写错误的内容

### 2. 内容要系统全面，有逻辑关联

文章不是知识点的堆砌，而是一条有逻辑的叙述链路：

- **有完整的知识脉络**：从"为什么"出发，讲清楚"是什么"，再讲"怎么用"，最后讲"边界和注意事项"
- **章节之间要有承接**：后面的章节建立在前面章节的认知基础上，避免跳跃式展开
- **不能草草带过**：每个核心概念都要展开讲透，给出足够的上下文

**推荐文章结构：**

```
1. 引言 —— 这篇文章解决什么问题，适合什么读者
2. 核心概念建立 —— 搭建读者理解后续内容所需的心智模型
3. 主体内容（多个章节） —— 每个章节深入一个子主题，章节间有递进关系
4. 实际应用 / 完整示例 —— 把前面的知识点串起来
5. 常见问题 / 注意事项 —— 补充边界情况和易错点
```

### 3. 优先使用 `.mdx` 格式，代码示例要具体

新文章统一使用 `.mdx`（而非 `.md`），放在 `posts/<category>/<slug>.mdx`。`.mdx` 支持内置的交互组件（`CodeRunner`、`SqlSimulator`、`ShaderPreview` 等）。

**每个核心概念都必须有对应的代码示例**，示例要满足：

- **完整可运行**：不要只贴片段，要让读者能直接复制运行
- **有注释说明关键行**：复杂逻辑必须在代码内注释
- **示例要循序渐进**：先给最简单的用法，再给进阶用法

具体的 MDX 特殊语法（告示块、折叠块、可运行代码块、Mermaid、数学公式、图片、内置组件等）参考 [docs/mdx-syntax.md](./docs/mdx-syntax.md)。

### 4. 文章内部链接不要加 `/blog` 前缀

`basePath: '/blog'` 已在 `next.config.ts` 中配置，Next.js 会自动添加。文章中的内部链接只写 `/posts/...`，不要写 `/blog/posts/...`。

## 详细文档

更改对应的组件内容后，对应的文档也需要同步进行更新

- [架构与内容管道](./docs/architecture.md) —— Commands、整体架构、`.md`/`.mdx` 到页面的完整链路
- [文章目录与 frontmatter](./docs/content-structure.md) —— `posts/` 目录规范与元数据写法
- [MDX 特殊语法与 CodeBlock](./docs/mdx-syntax.md) —— 告示块、折叠块、可运行代码、Mermaid、数学公式、图片等
- [TOC 与客户端渲染](./docs/rendering.md) —— Heading ID 生成、MDX/Markdown 两条渲染路径
- [路由、路径别名、样式系统](./docs/development.md) —— 路由表、`@/` 别名、Tailwind v4 与设计 token
- [交互式组件指南](./docs/interactive-components-guide.md) —— 各个交互组件的详细用法
