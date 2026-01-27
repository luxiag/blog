import fs from 'fs';
import path from 'path';
import { getAllPosts } from '../lib/markdown';
import { Post } from '../types/blog';

async function generatePostsJson() {
  try {
    const posts = await getAllPosts();

    // 只保留搜索需要的基本字段
    const postsForSearch: Post[] = posts.map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      tags: post.tags,
      category: post.category,
    }));

    // 确保 public/blog 目录存在
    const publicBlogDir = path.join(process.cwd(), 'public', 'blog');
    if (!fs.existsSync(publicBlogDir)) {
      fs.mkdirSync(publicBlogDir, { recursive: true });
    }

    // 写入 posts.json
    const outputPath = path.join(publicBlogDir, 'posts.json');
    fs.writeFileSync(outputPath, JSON.stringify(postsForSearch, null, 2));

    console.log('✅ posts.json generated successfully at:', outputPath);
  } catch (error) {
    console.error('❌ Error generating posts.json:', error);
    process.exit(1);
  }
}

generatePostsJson();
