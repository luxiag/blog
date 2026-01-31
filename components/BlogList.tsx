'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import TagFilter from './TagFilter';
import { Post } from '@/types/blog';
import { Terminal, Calendar, Hash, ArrowRight } from 'lucide-react';

const POSTS_PER_PAGE = 20;

export default function BlogList({ posts }: { posts: Post[] }) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const postsByYear = useMemo(() => {
    const visiblePosts = filteredPosts.slice(0, visibleCount);
    const grouped: Record<string, Post[]> = {};
    visiblePosts.forEach((post) => {
      const year = new Date(post.date).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(post);
    });
    return Object.entries(grouped).sort(([a], [b]) => Number(b) - Number(a));
  }, [filteredPosts, visibleCount]);

  const hasMore = visibleCount < filteredPosts.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  const handleFilter = (filtered: Post[]) => {
    setFilteredPosts(filtered);
    setVisibleCount(POSTS_PER_PAGE);
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] p-6 rounded-2xl">
        <TagFilter posts={posts} onFilter={handleFilter} />
      </div>

      {postsByYear.length > 0 ? (
        <div className="flex flex-col gap-24">
          {postsByYear.map(([year, yearPosts]) => (
            <section key={year} className="relative">
              <div className="flex items-center gap-6 mb-12 overflow-hidden">
                <h2
                  className="text-8xl md:text-[120px] font-black leading-none tracking-tighter"
                  style={{
                    background: 'repeating-linear-gradient(0deg, oklch(0.145 0 0) 0px, oklch(0.145 0 0) 4px, transparent 4px, transparent 8px)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {year}
                </h2>
                <div className="flex-1 h-px bg-[oklch(0.145_0_0)] opacity-20" />
                <div className="hidden md:flex items-center gap-2 font-mono text-[10px] font-bold opacity-40 uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  TEMPORAL_MARKER
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {yearPosts.map((post, idx) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="group"
                  >
                    <div className="h-full flex flex-col bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-2xl overflow-hidden shadow-[4px_4px_0_oklch(0.145_0_0)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[8px_8px_0_oklch(0.145_0_0)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_oklch(0.145_0_0)] transition-all">
                      <div className="px-5 py-3 border-b border-[oklch(0.145_0_0)] flex items-center justify-between bg-[#f5f5f5] dark:bg-neutral-800/50">
                        <div className="flex items-center gap-2">
                          <Hash className="w-3 h-3 text-[#ea580c]" />
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Entry_{String(idx + 1).padStart(3, '0')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[9px] font-mono font-bold opacity-40 uppercase">LIVE_CONTENT</span>
                        </div>
                      </div>

                      <div className="p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-4 font-sans text-[oklch(0.145_0_0)] group-hover:text-[#ea580c] transition-colors leading-tight">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 mb-6 font-medium">
                              {post.excerpt}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex gap-2">
                            {post.tags?.slice(0, 2).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 border border-[oklch(0.145_0_0)] text-[9px] font-mono font-bold uppercase rounded bg-white">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono font-bold opacity-60">
                            {post.date.replace(/-/g, '.')}
                            <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {hasMore && (
            <div className="text-center pt-12 pb-24 border-t border-[oklch(0.145_0_0)] border-dashed">
              <button
                onClick={loadMore}
                className="inline-flex items-center gap-3 px-12 py-5 bg-[oklch(0.145_0_0)] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-[6px_6px_0_#ea580c] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0_#ea580c] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_#ea580c] transition-all"
              >
                <Terminal className="w-4 h-4" />
                FETCH_ADDITIONAL_RECORDS ({filteredPosts.length - visibleCount})
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-2xl p-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full border border-dashed border-[oklch(0.145_0_0)] flex items-center justify-center mb-6 opacity-20 text-[oklch(0.145_0_0)]">
            <Calendar className="w-8 h-8" />
          </div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] opacity-40">
            {posts.length > 0 ? 'NULL_RESULT: NO_MATCH_FOUND' : 'NULL_POINTER: NO_POSTS_INITIALIZED'}
          </p>
        </div>
      )}
    </div>
  );
}
