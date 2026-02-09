
import { notFound } from 'next/navigation';
import { getPostData, getAllPostSlugs, extractToc } from '@/lib/markdown';
import MDXComponents from '@/components/MDXComponents';
import TableOfContents from '@/components/TableOfContents';
import Link from 'next/link';
import Image from 'next/image';
import { logger } from '@/lib/logger';
import PageTitle from '@/components/PageTitle';
import { ChevronLeft } from 'lucide-react';

export async function generateStaticParams() {
  try {
    const slugs = getAllPostSlugs();
    return slugs.map((item) => ({
      slug: item.params.slug,
    }));
  } catch (error) {
    logger.error('Error generating static params:', error);
    return [];
  }
}

async function getPost(slug: string) {
  try {
    const post = await getPostData(slug);
    return post;
  } catch (error) {
    return null;
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) notFound();

  const post = await getPost(slug);
  if (!post) notFound();

  const toc = extractToc(post.rawContent || post.content);

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[oklch(0.145_0_0)] selection:bg-orange-500/20">
      <PageTitle title={post.title} />
      <TableOfContents toc={toc} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Nav */}
        <nav className="mb-8">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ea580c] hover:opacity-70"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
        </nav>

        {/* Article */}
        <article>
          {/* Header */}
          <div className="py-8 border-b border-[oklch(0.145_0_0)]">

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6">
              {post.title}
            </h1>
            <div className="text-xs font-mono opacity-50">
              {post.date} · {post.readingTime || '---'} · {post.category}
            </div>
          </div>

          {/* Cover */}
          {post.coverImage && (
            <div className="border-b border-[oklch(0.145_0_0)]">
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
          <div className="py-8">
            <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-blockquote:border-l-[#ea580c] prose-a:text-[#ea580c] prose-pre:border prose-pre:border-[oklch(0.145_0_0)] prose-pre:rounded-lg prose-pre:bg-white">
              <MDXComponents content={post.content} isMdxCompiled={post.isMdxCompiled} category={post.category} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[oklch(0.145_0_0)]">
                <div className="text-[10px] font-mono uppercase tracking-widest opacity-40 mb-4">
                  Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-mono border border-[oklch(0.145_0_0)] rounded hover:bg-[oklch(0.145_0_0)] hover:text-white transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Footer Nav */}
        <nav className="mt-8">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[oklch(0.145_0_0)] rounded text-xs font-mono uppercase tracking-widest hover:bg-[#f5f5f5] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Archive
          </Link>
        </nav>
      </div>
    </div>
  );
}
