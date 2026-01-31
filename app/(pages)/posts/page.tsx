
import { getAllPosts } from '@/lib/markdown';
import BlogList from '@/components/BlogList';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import { ChevronLeft, Database } from 'lucide-react';

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-neutral-950 font-sans text-[oklch(0.145_0_0)] dark:text-neutral-100 selection:bg-orange-500/20">
      <PageTitle title="博客" />

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Technical Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#ea580c] mb-6 group"
            >
              <ChevronLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
              BACK_TO_HOME
            </Link>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-4 uppercase">
              ARCHIVE<span className="text-[#ea580c]">/</span>POSTS
            </h1>
            <div className="flex items-center gap-3 text-sm font-mono opacity-60">
              <span className="w-2 h-2 rounded-full bg-orange-600" />
              INDEXING_TOTAL_{posts.length}_ENTRIES_v2.0
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2 px-6 py-4 border border-[oklch(0.145_0_0)] rounded-xl bg-white dark:bg-neutral-900 shadow-[4px_4px_0_oklch(0.145_0_0)]">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#ea580c]">
              <Database className="w-3 h-3" />
              DATABASE_STATUS
            </div>
            <div className="text-xs font-mono font-bold">ONLINE_STABLE</div>
          </div>
        </div>

        <BlogList posts={posts} />
      </div>
    </div>
  );
}
