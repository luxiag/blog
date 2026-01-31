
import { notFound } from 'next/navigation';
import { getPostData, getAllPostSlugs, extractToc } from '@/lib/markdown';
import MDXComponents from '@/components/MDXComponents';
import TableOfContents from '@/components/TableOfContents';
import Link from 'next/link';
import Image from 'next/image';
import { logger } from '@/lib/logger';
import PageTitle from '@/components/PageTitle';
import { ChevronLeft, Calendar, Clock, User, Bookmark, MoreHorizontal } from 'lucide-react';

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
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-neutral-950 font-sans text-[oklch(0.145_0_0)] dark:text-neutral-100 selection:bg-orange-500/20">
      <PageTitle title={post.title} />
      <TableOfContents toc={toc} />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back Link */}
        <div className="mb-12">
          <Link
            href="/posts"
            className="inline-flex items-center text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#ea580c] group"
          >
            <ChevronLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
            BACK_TO_ARCHIVE
          </Link>
        </div>

        <article className="bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-3xl overflow-hidden shadow-[8px_8px_0_oklch(0.145_0_0)]">
          {/* Article Header */}
          <header className="p-8 md:p-12 border-b border-[oklch(0.145_0_0)] bg-[#f5f5f5] dark:bg-neutral-800/50">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-3 py-1 bg-[oklch(0.145_0_0)] text-white text-[9px] font-mono font-bold uppercase tracking-widest rounded shadow-[2px_2px_0_#ea580c]">
                <Bookmark className="w-3 h-3" />
                {post.category?.toUpperCase() || 'GENERAL'}
              </div>
              <div className="h-px w-8 bg-[oklch(0.145_0_0)] opacity-20" />
              <div className="text-[10px] font-mono font-bold opacity-40 uppercase tracking-widest">
                VER_2.4.0_STABLE
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-10 uppercase italic">
              {post.title}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Calendar, label: 'PUBLISHED_AT', value: post.date.replace(/-/g, '.') },
                { icon: Clock, label: 'READ_TIME', value: post.readingTime || '---' },
                { icon: User, label: 'AUTHOR_UID', value: post.author?.name?.toUpperCase() || 'SYSTEM' },
                { icon: MoreHorizontal, label: 'DATA_INTEGRITY', value: 'VERIFIED' }
              ].map((meta, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold opacity-40 uppercase tracking-widest">
                    <meta.icon className="w-3 h-3" />
                    {meta.label}
                  </div>
                  <div className="text-[11px] font-mono font-bold">{meta.value}</div>
                </div>
              ))}
            </div>
          </header>

          <div className="p-8 md:p-16">
            {post.coverImage && (
              <div className="relative aspect-video w-full mb-12 border border-[oklch(0.145_0_0)] rounded-2xl overflow-hidden shadow-[4px_4px_0_oklch(0.145_0_0)]">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-blockquote:border-l-orange-600 prose-a:text-orange-600">
              <MDXComponents content={post.content} isMdxCompiled={post.isMdxCompiled} category={post.category} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-[oklch(0.145_0_0)] border-dashed flex flex-wrap gap-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border border-[oklch(0.145_0_0)] rounded-full hover:bg-[oklch(0.145_0_0)] hover:text-white transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Footer Navigation */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/posts"
            className="flex items-center gap-3 px-8 py-4 border border-[oklch(0.145_0_0)] rounded-2xl font-mono font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-[4px_4px_0_oklch(0.145_0_0)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <ChevronLeft className="w-4 h-4" />
            RETURN_TO_ARCHIVES
          </Link>
        </div>
      </div>
    </div>
  );
}
