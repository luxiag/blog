
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { remarkDetails } from './remark-details';
import rehypeHighlight from 'rehype-highlight';
import { calculateReadingTime } from './reading-time';
import { Post, PostFrontMatter } from '@/types/blog';
import { logger } from './logger';
import jsYaml from 'js-yaml';

const postsDirectory = path.join(process.cwd(), 'posts');

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
  const lines = content.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith('::: details')) {
      const titleMatch = line.match(/::: details\s+(.+)/);
      const title = titleMatch ? titleMatch[1].trim() : 'Details';
      result.push(`<details data-details-title="${title}">`);
      result.push('<summary>');
      result.push('</summary>');
      i++;

      while (i < lines.length) {
        if (lines[i].trim() === ':::') {
          result.push('</details>');
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
        const compiled = await compile(content, {
          outputFormat: 'function-body',
          remarkPlugins: [remarkGfm, remarkDetails],
          rehypePlugins: [rehypeHighlight],
        });
        compiledContent = String(compiled);
        isMdxCompiled = true;
      } catch (e) {
        logger.error('Error compiling MDX:', e);
        compiledContent = processedContent;
      }
    } else {
      compiledContent = processedContent;
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

export async function getAllPosts(): Promise<Post[]> {
  const slugs = getAllPostSlugs();
  const posts = await Promise.all(
    slugs.map(({ params }) => getPostData(params.slug))
  );

  return posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(content: string): TocItem[] {
  const toc: TocItem[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    toc.push({ id, text, level });
  }

  return toc;
}
