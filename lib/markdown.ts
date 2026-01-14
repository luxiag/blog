
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
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
  return fileNames
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .map((name) => {
      return {
        params: {
          slug: name.replace(/\.mdx?$/, ''),
        },
      };
    });
}

// 根据 slug 获取博客文章数据
export async function getPostData(slug: string): Promise<Post> {
  let fullPath = path.join(postsDirectory, `${slug}.mdx`);
  let isMdx = true;
  
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${slug}.md`);
    isMdx = false;
  }

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post with slug: ${slug} not found`);
  }

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents, {
      engines: {
        yaml: (s: string) => {
          try {
            return require('js-yaml').load(s);
          } catch (e) {
            logger.error('Error parsing YAML:', e);
            return {};
          }
        }
      }
    });

    const frontMatter = data as PostFrontMatter;

    let compiledContent = content;
    let isMdxCompiled = false;
    
    if (isMdx) {
      try {
        const compiled = await compile(content, {
          outputFormat: 'function-body',
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight],
        });
        compiledContent = String(compiled);
        isMdxCompiled = true;
      } catch (e) {
        logger.error('Error compiling MDX:', e);
        compiledContent = content;
      }
    }

    return {
      slug,
      content: compiledContent,
      rawContent: content,
      isMdxCompiled,
      title: frontMatter.title || '无标题',
      date: typeof frontMatter.date === 'object' && frontMatter.date !== null
        ? new Date(frontMatter.date as unknown as string).toISOString().split('T')[0]
        : (frontMatter.date || new Date().toISOString().split('T')[0]),
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
