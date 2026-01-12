
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { calculateReadingTime } from './reading-time';
import { Post, PostFrontMatter } from '@/types/blog';
import { logger } from './logger';

// 博客文章目录
const postsDirectory = path.join(process.cwd(), 'content/posts');

// 获取所有博客文章的 slug
export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((name) => {
    return {
      params: {
        slug: name.replace(/\.md$/, ''),
      },
    };
  });
}

// 根据 slug 获取博客文章数据
export async function getPostData(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  // 检查文件是否存在
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post with slug: ${slug} not found`);
  }

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 使用 gray-matter 解析 frontmatter 和内容
    // 确保正确解析嵌套对象
    const { data, content } = matter(fileContents, {
      engines: {
        yaml: (s: string) => {
          // 使用简单的解析方法处理嵌套对象
          try {
            return require('js-yaml').load(s);
          } catch (e) {
            logger.error('Error parsing YAML:', e);
            return {};
          }
        }
      }
    });

    // 组合 frontmatter 和内容
    const frontMatter = data as PostFrontMatter;

    return {
      slug,
      content,
      title: frontMatter.title || '无标题',
      date: frontMatter.date || new Date().toISOString().split('T')[0],
      excerpt: frontMatter.excerpt || '',
      coverImage: frontMatter.coverImage,
      author: frontMatter.author,
      tags: frontMatter.tags || [],
      readingTime: calculateReadingTime(content),
    };
  } catch (error) {
    logger.error(`Error reading post ${slug}:`, error);
    throw new Error(`Failed to read post with slug: ${slug}`);
  }
}

// 获取所有博客文章的列表（按日期排序）
export async function getAllPosts(): Promise<Post[]> {
  const slugs = getAllPostSlugs();
  const posts = await Promise.all(
    slugs.map(({ params }) => getPostData(params.slug))
  );

  // 按日期降序排序
  return posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}
