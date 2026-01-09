
import { getAllPosts } from '@/lib/markdown';
import BlogList from '@/components/BlogList';

// 服务器组件，获取数据
export default async function BlogPage() {
  const posts = await getAllPosts();
  return <BlogList posts={posts} />;
}
