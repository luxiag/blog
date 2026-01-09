import { getAllPosts } from '@/lib/markdown';

export async function GET() {
  try {
    const posts = await getAllPosts();
    return Response.json(posts);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
