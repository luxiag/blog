
import { getAllPosts } from '@/lib/markdown';
import BlogList from '@/components/BlogList';
import PageTitle from '@/components/PageTitle';

// 服务器组件，获取数据
export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <>
      <PageTitle title="博客" />
      <BlogList posts={posts} />
    </>
  );
}
