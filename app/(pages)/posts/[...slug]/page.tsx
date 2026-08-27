
import { notFound } from 'next/navigation';
import { getPostData, getAllPostSlugs, extractToc, getSeriesPosts, getAllCategoriesWithPosts } from '@/lib/markdown';
import MDXComponents from '@/components/MDXComponents';
import DocLayout from '@/components/DocLayout';
import Link from 'next/link';
import Image from 'next/image';
import { logger } from '@/lib/logger';
import PageTitle from '@/components/PageTitle';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((item) => ({
    slug: item.params.slug,
  }));
}

async function getPost(slugParts: string[]) {
  try {
    const slug = slugParts.join('/');
    const post = await getPostData(slug);
    return post;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugParts = resolvedParams?.slug;
  if (!slugParts || slugParts.length === 0) return {};

  const post = await getPost(slugParts);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugParts = resolvedParams?.slug;

  if (!slugParts || slugParts.length === 0) notFound();

  const post = await getPost(slugParts);
  if (!post) notFound();

  const toc = extractToc(post.rawContent || post.content);
  const seriesPosts = post.category ? getSeriesPosts(post.category) : undefined;
  const allCategoriesWithPosts = getAllCategoriesWithPosts();
  const currentSlug = slugParts.join('/');

  return (
    <DocLayout toc={toc} seriesPosts={seriesPosts} currentSlug={currentSlug} category={post.category} allCategoriesWithPosts={allCategoriesWithPosts}>
      <div className="font-sans text-gray-900 dark:text-gray-900 selection:bg-blue-600/20">
        <PageTitle title={post.title} />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 mb-8">
          <Link href="/posts" className="hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors">
            Posts
          </Link>
          <span className="text-gray-300 dark:text-gray-300">›</span>
          <span className="text-gray-1000 dark:text-gray-1000">{post.category}</span>
        </nav>

        {/* Article */}
        <article>
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-[2.25rem] font-bold tracking-tight leading-[1.2] mb-4 text-gray-1000 dark:text-gray-1000">
              {post.title}
            </h1>
            <div className="text-sm text-gray-900 dark:text-gray-900 mt-2 mb-6 font-sans">
              {post.date} · {post.readingTime || '---'} · {post.category}
            </div>
          </div>

          {/* Cover */}
          {post.coverImage && (
            <div className="mb-8 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-200">
              <div className="relative aspect-video w-full">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="no-prose-pre-border">
            <MDXComponents content={post.content} isMdxCompiled={post.isMdxCompiled} category={post.category} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-200">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-4">
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-700 bg-gray-100 dark:bg-gray-100 border border-gray-200 dark:border-gray-200 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Footer Nav */}
        <nav className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-200 flex items-center justify-between">
          <Link
            href="/posts"
            className="inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-700 hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Archive
          </Link>

          {post.nextPost && (
            <Link
              href={`/posts/${post.nextPost.slug}`}
              className="inline-flex items-center gap-1.5 text-sm text-blue-700 dark:text-blue-900 hover:text-blue-900 dark:hover:text-blue-700 transition-colors"
            >
              {post.nextPost.title}
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </nav>
      </div>
    </DocLayout>
  );
}
