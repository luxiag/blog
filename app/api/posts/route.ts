import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
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

export async function GET() {
  try {
    const postFiles = getPostFiles(postsDirectory);
    const posts = postFiles.map((file) => {
      const fileContents = fs.readFileSync(file.filePath, 'utf8');
      const { data } = matter(fileContents, {
        engines: {
          yaml: (s: string): object => {
            try {
              return jsYaml.load(s) as object;
            } catch (e) {
              console.error('Error parsing YAML:', e);
              return {};
            }
          }
        }
      });
      
      const frontMatter = data as any;
      const date = typeof frontMatter.date === 'object' && frontMatter.date !== null
        ? new Date(frontMatter.date as unknown as string).toISOString().split('T')[0]
        : (frontMatter.date || new Date().toISOString().split('T')[0]);

      // 确保分类在标签中
      const tags = frontMatter.tags || [];
      if (file.category && !tags.map((t: string) => t.toLowerCase()).includes(file.category.toLowerCase())) {
        tags.push(file.category);
      }

      return {
        slug: file.slug,
        title: frontMatter.title || '无标题',
        date,
        excerpt: frontMatter.excerpt || '',
        tags,
        category: file.category,
      };
    });

    return Response.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return Response.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
