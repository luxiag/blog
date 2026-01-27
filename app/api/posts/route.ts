import { getAllPosts } from '@/lib/markdown';

export async function GET() {
  try {
    const posts = await getAllPosts();
    // 只返回搜索需要的基本字段，不包括 content 字段
    const postsForSearch = posts.map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      tags: post.tags,
      category: post.category,
    }));
    return Response.json(postsForSearch);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
