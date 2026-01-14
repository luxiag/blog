
// 博客文章的类型定义
export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  rawContent?: string;
  isMdxCompiled?: boolean;
  coverImage?: string;
  author?: {
    name: string;
    picture?: string;
  };
  tags?: string[];
  readingTime?: string;
}

// 博客文章的 frontmatter 类型定义
export interface PostFrontMatter {
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  author?: {
    name: string;
    picture?: string;
  };
  tags?: string[];
}
