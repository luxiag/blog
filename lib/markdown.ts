
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { calculateReadingTime } from './reading-time';
import { Post, PostFrontMatter } from '@/types/blog';
import { logger } from './logger';
import jsYaml from 'js-yaml';
import { slugify } from './slugify';

const postsDirectory = path.join(process.cwd(), 'posts');

// 模块级缓存：避免重复读取和编译所有文章
let allPostsCache: Post[] | null = null;

// 单篇文章缓存
const postCache = new Map<string, Post>();

// 元数据缓存
let allPostsMetadataCache: Post[] | null = null;

interface PostFile {
  slug: string;
  filePath: string;
  category?: string;
}

function getPostFiles(dir: string, category?: string): PostFile[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: PostFile[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
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

export function getAllPostSlugs() {
  const postFiles = getPostFiles(postsDirectory);
  return postFiles.map((file) => ({
    params: {
      slug: file.slug,
    },
  }));
}

function transformMarkdownDetails(content: string): string {
  const escapeHtml = (input: string) =>
    input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const lines = content.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    const openMatch = line.trim().match(/^:::\s*details(?:\s+(.+))?$/);
    if (openMatch) {
      const title = (openMatch[1] ?? 'Details').trim();
      const escapedTitle = escapeHtml(title);
      result.push('');
      result.push(`<details data-details-title="${escapedTitle}">`);
      result.push('');
      result.push(`<summary>${escapedTitle}</summary>`);
      result.push('');
      i++;

      while (i < lines.length) {
        if (lines[i].trim() === ':::') {
          result.push('');
          result.push('</details>');
          result.push('');
          i++;
          break;
        }
        result.push(lines[i]);
        i++;
      }
    } else {
      result.push(line);
      i++;
    }
  }

  return result.join('\n');
}

export async function getPostData(slug: string): Promise<Post> {
  // 如果已有缓存，直接返回
  if (postCache.has(slug)) {
    return postCache.get(slug)!;
  }

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
        yaml: (s: string): object => {
          try {
            return jsYaml.load(s) as object;
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

    const processedContent = transformMarkdownDetails(content);


    if (isMdx) {
      try {
        const [{ compile }, { default: remarkGfm }, { default: remarkMath }, { remarkAdmonitionsCustom }, { default: rehypeHighlight }, { default: rehypeKatex }, { default: rehypeSlug }] = await Promise.all([
          import('@mdx-js/mdx'),
          import('remark-gfm'),
          import('remark-math'),
          import('./remark-admonitions-custom'),
          import('rehype-highlight'),
          import('rehype-katex'),
          import('rehype-slug'),
        ]);

        const compiled = await compile(content, {
          outputFormat: 'function-body',
          remarkPlugins: [remarkGfm, remarkMath, [remarkAdmonitionsCustom, { keywords: ['details', 'note', 'warning', 'tip', 'important', 'info'], format: 'mdx' }]],
          rehypePlugins: [rehypeSlug as any, rehypeHighlight as any, rehypeKatex as any],
          development: false,
        });
        compiledContent = String(compiled);
        isMdxCompiled = true;
      } catch (e) {
        const errorDetails = e instanceof Error ? {
          message: e.message,
          name: e.name,
          stack: e.stack,
          file: fullPath,
          postSlug: slug,
          postCategory: postFile.category,
        } : { error: String(e), file: fullPath, postSlug: slug, postCategory: postFile.category };
        logger.error(`Error compiling MDX for file: ${fullPath} (slug: ${slug}):`, errorDetails);
        compiledContent = processedContent;
      }
    } else {
      compiledContent = processedContent;
    }

    const post: Post = {
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
      tags: ensureCategoryInTags(frontMatter.tags || [], postFile.category),
      readingTime: calculateReadingTime(content),
      hidden: frontMatter.hidden === true
    };

    // 缓存结果
    postCache.set(slug, post);
    return post;
  } catch (error) {
    logger.error(`Error reading post ${slug}:`, error);
    throw new Error(`Failed to read post with slug: ${slug}`);
  }
}

function ensureCategoryInTags(tags: string[], category?: string): string[] {
  if (!category) return tags;

  const normalizedCategory = category.toLowerCase();
  const normalizedTags = tags.map(t => t.toLowerCase());

  if (normalizedTags.includes(normalizedCategory)) {
    return tags;
  }

  return [...tags, category];
}

export async function getAllPosts(): Promise<Post[]> {
  // 列表页仅需要元数据，避免编译 MDX
  if (allPostsMetadataCache) {
    return allPostsMetadataCache;
  }

  const postFiles = getPostFiles(postsDirectory);

  const posts = postFiles.map(postFile => {
    try {
      const fileContents = fs.readFileSync(postFile.filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const frontMatter = data as PostFrontMatter;

      const hasValidTitle = frontMatter.title && frontMatter.title !== '无标题';
      const hasValidDate = !!frontMatter.date;
      const isNotHidden = frontMatter.hidden !== true;

      if (!hasValidTitle || !hasValidDate || !isNotHidden) {
        return null;
      }

      return {
        slug: postFile.slug,
        title: frontMatter.title,
        date: typeof frontMatter.date === 'object' && frontMatter.date !== null
          ? new Date(frontMatter.date as unknown as string).toISOString().split('T')[0]
          : (frontMatter.date || new Date().toISOString().split('T')[0]),
        excerpt: frontMatter.excerpt || '',
        category: postFile.category,
        tags: ensureCategoryInTags(frontMatter.tags || [], postFile.category),
        readingTime: calculateReadingTime(content),
        content: '', // 列表页不需要内容
        hidden: frontMatter.hidden
      } as Post;
    } catch {
      return null;
    }
  }).filter((p): p is Post => p !== null);

  allPostsMetadataCache = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return allPostsMetadataCache;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(content: string): TocItem[] {
  const toc: TocItem[] = [];
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  let match;

  // 用于追踪 ID 出现的次数
  const idCounts = new Map<string, number>();

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();

    // 使用统一的 slugify 函数生成基础 ID
    let baseId = slugify(text);

    // 如果 ID 为空（例如标题全是特殊符号），给个默认值
    if (!baseId) baseId = 'section';

    // 关键：处理重复逻辑
    let finalId = baseId;
    const count = idCounts.get(baseId) || 0;

    if (count > 0) {
      finalId = `${baseId}-${count}`;
    }

    idCounts.set(baseId, count + 1);

    toc.push({ id: finalId, text, level });
  }

  return toc;
}
