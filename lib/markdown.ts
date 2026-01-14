
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
const postsDirectory = path.join(process.cwd(), 'posts');

interface PostFile {
  slug: string;
  filePath: string;
  category?: string;
}

// 递归获取目录下所有 md/mdx 文件
function getPostFiles(dir: string, category?: string): PostFile[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: PostFile[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // 子文件夹名称作为 category
      const subFiles = getPostFiles(fullPath, entry.name);
      files.push(...subFiles);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      files.push({
        slug: entry.name.replace(/\.mdx?$/, ''),
        filePath: fullPath,
        category,
      });
    }
  }

  return files;
}

// 获取所有博客文章的 slug
export function getAllPostSlugs() {
  const postFiles = getPostFiles(postsDirectory);
  return postFiles.map((file) => ({
    params: {
      slug: file.slug,
    },
  }));
}

// 根据 slug 获取博客文章数据
export async function getPostData(slug: string): Promise<Post> {
  const postFiles = getPostFiles(postsDirectory);
  const postFile = postFiles.find((f) => f.slug === slug);

  if (!postFile) {
    throw new Error(`Post with slug: ${slug} not found`);
  }

  const fullPath = postFile.filePath;
  const isMdx = fullPath.endsWith('.mdx');

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
      category: postFile.category,
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
