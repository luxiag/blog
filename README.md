# 我的博客

这是一个使用 [Next.js](https://nextjs.org) 和 [TypeScript](https://www.typescriptlang.org/) 构建的个人博客系统。

## 功能特点

- 📝 使用 Markdown 编写博客文章
- 🎨 基于 Tailwind CSS 的现代化设计
- 📱 响应式布局，支持各种设备
- 🔍 优秀的 SEO 支持
- 🏷️ 文章标签系统
- 📖 代码高亮显示
- ⚡ 静态生成，快速加载

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **内容管理**: Markdown + Gray Matter
- **Markdown 渲染**: React Markdown
- **代码高亮**: rehype-highlight

## 项目结构

```
blog/
├── app/                    # Next.js App Router
│   ├── (pages)/           # 路由组
│   │   ├── blog/          # 博客相关页面
│   │   └── about/         # 关于页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # 可复用组件
│   ├── BlogCard.tsx      # 博客卡片组件
│   ├── Header.tsx        # 页头组件
│   ├── Footer.tsx        # 页脚组件
│   └── MDXComponents.tsx # Markdown 渲染组件
├── content/               # 博客内容
│   └── posts/            # 博客文章
├── lib/                  # 工具函数
│   └── markdown.ts       # Markdown 处理函数
├── types/                # TypeScript 类型定义
│   └── blog.ts           # 博客相关类型
└── public/               # 静态资源
    └── images/           # 图片资源
```

## 开始使用

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 添加新博客文章

1. 在 `content/posts/` 目录下创建新的 Markdown 文件，文件名将是文章的 slug
2. 在文件顶部添加 frontmatter，例如：

```markdown
---
title: "文章标题"
date: "2023-10-15"
excerpt: "文章摘要"
coverImage: "/images/cover.jpg"
author: {
  name: "作者名",
  picture: "/images/author.jpg"
}
tags: ["标签1", "标签2"]
---

# 文章内容

这里是文章的正文内容...
```

3. 文章会自动出现在博客列表中

## 自定义

- 修改 `app/layout.tsx` 中的元数据来自定义网站标题、描述等
- 修改 `components/Header.tsx` 和 `components/Footer.tsx` 来自定义页头和页脚
- 修改 `tailwind.config.js` 来自定义样式主题

## 部署

推荐使用 [Vercel](https://vercel.com) 部署，这是最简单的方式：

1. 将代码推送到 GitHub
2. 在 Vercel 上导入你的 GitHub 仓库
3. Vercel 会自动构建和部署你的应用

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
