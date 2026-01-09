
import { notFound } from 'next/navigation';
import { getPostData, getAllPostSlugs } from '@/lib/markdown';
import MDXComponents from '@/components/MDXComponents';
import Link from 'next/link';
import Image from 'next/image';

// 生成静态参数
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((item) => ({
    slug: item.params.slug,
  }));
}

// 获取博客文章数据
async function getPost(slug: string) {
  try {
    const post = await getPostData(slug);
    return post;
  } catch (error) {
    return null;
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 inline-flex items-center mb-8">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回博客列表
          </Link>
        </div>

        <article>
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-500 mb-6">
              <time dateTime={post.date}>{post.date}</time>
              {post.readingTime && (
                <>
                  <span className="mx-2">·</span>
                  <span>{post.readingTime}</span>
                </>
              )}
              {post.author && (
                <>
                  <span className="mx-2">·</span>
                  <span>{post.author.name}</span>
                </>
              )}
            </div>
            {post.coverImage && (
              <div className="relative h-64 md:h-96 w-full mb-8">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            <MDXComponents content={post.content} />
          </div>
        </article>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回博客列表
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
