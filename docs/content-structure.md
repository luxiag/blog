## 文章目录结构

```
posts/
  <category>/           # 分类名，例如 react、nextjs、mysql
    <slug>.md(x)        # 文章文件，slug 即文件名去掉扩展名
    images/             # 该分类的图片（构建时复制到 public/posts/<category>/images/）
```

分类名会被自动追加到文章的 `tags` 数组中（`lib/markdown.ts:ensureCategoryInTags`）。

---

## frontmatter 规范

```mdx
---
title: '文章标题'
date: '2024-01-15'
excerpt: '摘要，用于文章列表展示'
tags: ['tag1', 'tag2']
coverImage: '/posts/react/images/cover.png'   # 可选
author:
  name: '作者名'                               # 可选
nextPost: 'category/slug'                      # 可选
---
```

- `date` 支持字符串和 Date 对象，最终统一转为 `YYYY-MM-DD`
- `excerpt` 显示在文章列表卡片中
- `coverImage` 路径需要带 `/blog` basePath（构建后访问路径为 `/blog/posts/...`）
- `nextPost` 指向同系列下一篇文章的 slug（格式 `<category>/<slug>`），文章底部会渲染"下一篇"按钮。不需要加 `/posts/` 前缀，也无需加 `/blog` basePath
