'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import TagFilter from './TagFilter';
import { Post } from '@/types/blog';
import { Terminal, Calendar, Hash, ArrowRight } from 'lucide-react';

const POSTS_PER_PAGE = 20;
const STORAGE_KEY = 'blog_list_state';

interface SavedState {
  category: string;
  visibleCount: number;
  scrollY: number;
}

function loadState(): SavedState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state: SavedState) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export default function BlogList({ posts }: { posts: Post[] }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [hydrated, setHydrated] = useState(false);

  // Restore from sessionStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      if (saved.category) setSelectedCategory(saved.category);
      if (saved.visibleCount > POSTS_PER_PAGE) setVisibleCount(saved.visibleCount);
      if (saved.scrollY > 0) {
        requestAnimationFrame(() => {
          window.scrollTo(0, saved!.scrollY!);
        });
      }
    }
    setHydrated(true);
  }, []);

  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter((post) => (post.category || 'Article') === selectedCategory);
  }, [posts, selectedCategory]);

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

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setVisibleCount(POSTS_PER_PAGE);
  }, []);

  // Save state before navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveState({
        category: selectedCategory,
        visibleCount,
        scrollY: window.scrollY,
      });
    };

    // Save on link click (before navigation)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href) {
        handleBeforeUnload();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick);
    };
  }, [selectedCategory, visibleCount]);

  return (
    <div className="flex flex-col gap-12 overflow-hidden">
      <div className="p-2 sm:p-6">
        <TagFilter
          posts={posts}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {postsByYear.length > 0 ? (
        <div className="flex flex-col gap-16 sm:gap-32 px-2 sm:px-6">
          {postsByYear.map(([year, yearPosts]) => (
            <section key={year} className="relative">
              {/* 立体年份设计 */}
              <div className="relative mb-10">
                {/* 背景装饰层 */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ transform: 'translateY(10px)' }}
                >
                  <span
                    className="text-transparent font-black font-sans tracking-tighter select-none"
                    style={{
                      fontSize: 'clamp(80px, 15vw, 160px)',
                      WebkitTextStroke: '2px rgba(234, 88, 12, 0.1)',
                      transform: 'perspective(500px) rotateX(10deg)',
                    }}
                  >
                    {year}
                  </span>
                </div>

                {/* 主要年份堆叠 */}
                <div className="text-center relative z-10">
                  <span
                    className="flex flex-col items-center leading-none font-black font-sans tracking-tighter"
                    style={{
                      fontSize: 'clamp(80px, 15vw, 160px)',
                      filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                    }}
                  >
                    {/* 多层描边堆叠 - 减少层数以优化性能 */}
                    {[...Array(2)].map((_, i) => (
                      <span
                        key={i}
                        className="text-transparent relative"
                        style={{
                          WebkitTextStroke: `${1 + i * 0.5}px rgba(0, 0, 0, ${0.08 + i * 0.05})`,
                          marginTop: i === 0 ? 0 : '-0.65em',
                          transform: `translateZ(${i * 2}px)`,
                        }}
                        aria-hidden="true"
                      >
                        {year}
                      </span>
                    ))}
                    {/* 实心顶层 */}
                    <span
                      className="relative"
                      style={{
                        marginTop: '-0.65em',
                        background: 'linear-gradient(180deg, oklch(0.145 0 0) 0%, oklch(0.3 0 0) 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                      }}
                    >
                      {year}
                    </span>
                  </span>

                  {/* 年份统计徽章 */}
                  <div className="mt-4 flex justify-center">
                    <div
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[oklch(0.145_0_0)] rounded-full shadow-[4px_4px_0_rgba(0,0,0,0.15)]"
                      style={{ transform: 'translateY(-10px)' }}
                    >
                      <span className="w-4 h-4 rounded-full bg-[#ea580c] animate-pulse" />
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-[oklch(0.145_0_0)]">
                        {yearPosts.length} Records
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 文章网格 - 立体卡片 */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
                style={{ perspective: '1000px', contentVisibility: 'auto', containIntrinsicSize: '1px 500px' }}
              >
                {yearPosts.map((post, idx) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="group"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div
                      className="h-full flex flex-col bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-2xl overflow-hidden transition-all duration-300 group-hover:[transform:translateZ(20px)_rotateX(2deg)_rotateY(-2deg)] group-hover:shadow-[8px_8px_0_rgba(0,0,0,0.15),16px_16px_0_rgba(234,88,12,0.12)] will-change-transform"
                      style={{
                        boxShadow: '6px 6px 0 rgba(0, 0, 0, 0.12), 12px 12px 0 rgba(234, 88, 12, 0.08)',
                        transform: 'translateZ(0)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* 卡片头部 */}
                      <div className="px-4 sm:px-5 py-3 border-b border-[oklch(0.145_0_0)] flex items-center justify-between bg-gradient-to-r from-[#f5f5f5] to-white dark:from-neutral-800 dark:to-neutral-900 group-hover:[transform:translateZ(10px)] transition-transform duration-300">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-[#ea580c]" />
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[oklch(0.145_0_0)]">
                            Entry_{String(idx + 1).padStart(3, '0')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                          <span className="text-[9px] font-mono opacity-60 uppercase">Active</span>
                        </div>
                      </div>

                      {/* 卡片内容 */}
                      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between relative overflow-hidden group-hover:[transform:translateZ(15px)] transition-transform duration-300">
                        {/* 背景装饰 */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ea580c]/5 to-transparent rounded-full blur-2xl" />

                        <div className="relative z-10">
                          <h3 className="text-lg sm:text-xl font-bold mb-4 font-sans text-[oklch(0.145_0_0)] group-hover:text-[#ea580c] transition-colors leading-tight">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 mb-6 font-medium">
                              {post.excerpt}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-auto relative z-10">
                          <div className="flex gap-2 flex-wrap">
                            {post.tags?.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 border border-[oklch(0.145_0_0)] text-[10px] font-mono uppercase rounded-full bg-white shadow-[2px_2px_0_rgba(0,0,0,0.12)] group-hover:[transform:translateZ(25px)] transition-transform duration-300 hover:shadow-[3px_3px_0_rgba(234,88,12,0.3)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-[oklch(0.145_0_0)] shrink-0 ml-2">
                            {post.date.replace(/-/g, '.')}
                            <ArrowRight className="w-4 h-4 text-[oklch(0.145_0_0)] transform group-hover:translate-x-1 transition-transform group-hover:[transform:translateZ(30px)_scale(1.1)]" />
                          </div>
                        </div>
                      </div>

                      {/* 悬停时的3D效果覆盖层 */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:[transform:translateZ(5px)]"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, rgba(234,88,12,0.05) 100%)',
                        }}
                      />
                    </div>
                  </Link>
                ))}
              </div>

              {/* 年份底部装饰线 */}
              <div className="mt-12 sm:mt-16 flex items-center justify-center gap-4">
                <div className="h-px flex-1 max-w-[200px] bg-gradient-to-r from-transparent via-[oklch(0.145_0_0)]/20 to-transparent" />
                <div className="w-2 h-2 rounded-full bg-[oklch(0.145_0_0)]/20" />
                <div className="h-px flex-1 max-w-[200px] bg-gradient-to-r from-transparent via-[oklch(0.145_0_0)]/20 to-transparent" />
              </div>
            </section>
          ))}

          {/* 加载更多按钮 */}
          {hasMore && (
            <div className="text-center pt-8 sm:pt-12 pb-16 sm:pb-24">
              <button
                onClick={loadMore}
                className="relative inline-flex items-center gap-3 px-10 sm:px-12 py-4 sm:py-5 bg-[oklch(0.145_0_0)] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 0 4px rgba(234, 88, 12, 0.3)',
                }}
              >
                <Terminal className="w-4 h-4" />
                Fetch More ({filteredPosts.length - visibleCount})
                {/* 按钮光效 */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                </div>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 空状态 */
        <div className="bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-2xl p-12 sm:p-20 flex flex-col items-center justify-center text-center shadow-[6px_6px_0_rgba(0,0,0,0.12)]">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-dashed border-[oklch(0.145_0_0)] flex items-center justify-center mb-6 opacity-30">
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-[oklch(0.145_0_0)]" />
          </div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] opacity-40">
            No Results Found
          </p>
        </div>
      )}
    </div>
  );
}
