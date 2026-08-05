'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import TagFilter from './TagFilter';
import CategoryDrawer from './CategoryDrawer';
import { useHeaderContext } from './Header';
import { Post } from '@/types/blog';
import { Terminal, Calendar, Hash, ArrowRight, X } from 'lucide-react';

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
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const { registerCategoryDrawer } = useHeaderContext();

  // Register drawer setter with header
  useEffect(() => {
    registerCategoryDrawer(setIsCategoryDrawerOpen);
  }, [registerCategoryDrawer]);

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
    <div className="flex flex-col gap-6 sm:gap-12 overflow-hidden">
      {/* Category Drawer for mobile */}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        posts={posts}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Desktop TagFilter - hidden on mobile */}
      <div className="hidden md:block p-2 sm:p-6">
        <TagFilter
          posts={posts}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Mobile selected category indicator */}
      {selectedCategory && (
        <div className="md:hidden  mt-2">
          <div className="flex items-center justify-between px-4 py-3   border border-[oklch(0.145_0_0)]  shadow-[3px_3px_0_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Filter:
              </span>
              <span className="px-2.5 py-1 bg-[#ea580c] text-white text-xs font-mono font-bold rounded-md shadow-[2px_2px_0_rgba(0,0,0,0.15)]">
                {selectedCategory}
              </span>
            </div>
            <button
              onClick={() => handleCategoryChange('')}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 hover:text-[#ea580c] border border-neutral-200 dark:border-neutral-700 hover:border-[#ea580c]  transition-colors"
            >
              <X size={10} />
              Clear
            </button>
          </div>
        </div>
      )}

      {postsByYear.length > 0 ? (
        <div className="flex flex-col gap-12 sm:gap-32 md:px-6">
          {postsByYear.map(([year, yearPosts]) => (
            <section key={year} className="relative">
              {/* 年份标题 - 移动端简化版 */}
              <div className="mb-6 sm:mb-8 md:mb-10 px-3 md:px-0">
                {/* 移动端简洁年份 */}
                <div className="md:hidden flex items-center justify-center gap-3 mb-2">
                  <span className="text-3xl font-black font-sans text-[oklch(0.145_0_0)] tracking-tighter">
                    {year}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">
                      {yearPosts.length}
                    </span>
                  </div>
                </div>

                {/* 桌面端立体年份设计 */}
                <div className="hidden md:block relative">
                  {/* 背景装饰层 */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ transform: 'translateY(10px)' }}
                  >
                    <span
                      className="text-transparent font-black font-sans tracking-tighter select-none"
                      style={{
                        fontSize: 'clamp(60px, 15vw, 160px)',
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
                        fontSize: 'clamp(60px, 15vw, 160px)',
                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                      }}
                    >
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
              </div>

              {/* 文章网格 - 移动端单列，桌面端双列 */}
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
                {yearPosts.map((post, idx) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="group"
                  >
                    {/* 移动端卡片 - 小米格子风格 */}
                    <div className="md:hidden flex border border-neutral-200 dark:border-neutral-700 -mt-px">
                      <div className="w-12 flex items-center justify-center border-r border-neutral-200 dark:border-neutral-700">
                        <span className="text-[11px] font-mono" style={{ color: '#999' }}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 py-3 px-3">
                        <h3 className="leading-snug" style={{ fontWeight: 'normal', fontSize: '18px', color: '#000', fontFamily: '"Noto Serif SC", "PT Serif", Georgia, "Times New Roman", serif' }}>
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-1 line-clamp-2" style={{ fontSize: '13px', color: '#666', fontFamily: '"Noto Serif SC", "PT Serif", Georgia, "Times New Roman", serif' }}>
                            {post.excerpt}
                          </p>
                        )}
                        <p className="mt-1.5" style={{ fontSize: '11px', color: '#999' }}>
                          {post.date.substring(0, 10).replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, '$1年$2月$3日')}
                        </p>
                      </div>
                      <div className="w-12 flex items-center justify-center border-l border-neutral-200 dark:border-neutral-700">
                        <span style={{ color: '#999' }}>→</span>
                      </div>
                    </div>

                    {/* 桌面端完整卡片 */}
                    <div
                      className="hidden md:flex h-full flex-col bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-2xl overflow-hidden transition-all duration-300 group-hover:[transform:translateZ(20px)_rotateX(2deg)_rotateY(-2deg)] group-hover:shadow-[8px_8px_0_rgba(0,0,0,0.15),16px_16px_0_rgba(234,88,12,0.12)] will-change-transform"
                      style={{
                        boxShadow: '6px 6px 0 rgba(0, 0, 0, 0.12), 12px 12px 0 rgba(234, 88, 12, 0.08)',
                        transform: 'translateZ(0)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* 卡片头部 */}
                      <div className="px-5 py-3 border-b border-[oklch(0.145_0_0)] flex items-center justify-between bg-gradient-to-r from-[#f5f5f5] to-white dark:from-neutral-800 dark:to-neutral-900 group-hover:[transform:translateZ(10px)] transition-transform duration-300">
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
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between relative overflow-hidden group-hover:[transform:translateZ(15px)] transition-transform duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ea580c]/5 to-transparent rounded-full blur-2xl" />

                        <div className="relative z-10">
                          <h3 className="text-lg md:text-xl font-bold mb-4 font-sans text-[oklch(0.145_0_0)] group-hover:text-[#ea580c] transition-colors leading-tight">
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

              {/* 年份底部装饰线 - 移动端简化 */}
              <div className="mt-6 sm:mt-12 md:mt-16 flex items-center justify-center gap-3 sm:gap-4">
                <div className="h-px flex-1 max-w-[100px] sm:max-w-[200px] bg-gradient-to-r from-transparent via-[oklch(0.145_0_0)]/20 to-transparent" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[oklch(0.145_0_0)]/20" />
                <div className="h-px flex-1 max-w-[100px] sm:max-w-[200px] bg-gradient-to-r from-transparent via-[oklch(0.145_0_0)]/20 to-transparent" />
              </div>
            </section>
          ))}

          {/* 加载更多按钮 */}
          {hasMore && (
            <div className="text-center pt-4 sm:pt-8 md:pt-12 pb-8 sm:pb-16 md:pb-24">
              <button
                onClick={loadMore}
                className="relative inline-flex items-center gap-2 px-6 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 bg-[oklch(0.145_0_0)] text-white font-mono font-bold text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] rounded-lg sm:rounded-xl transition-all duration-300 active:scale-95"
                style={{
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                }}
              >
                <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Fetch More ({filteredPosts.length - visibleCount})</span>
                <span className="sm:hidden">More ({filteredPosts.length - visibleCount})</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 空状态 */
        <div className="bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-xl sm:rounded-2xl p-6 sm:p-12 md:p-20 flex flex-col items-center justify-center text-center mx-4">
          <div className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border border-dashed border-[oklch(0.145_0_0)] flex items-center justify-center mb-3 sm:mb-6 opacity-30">
            <Calendar className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[oklch(0.145_0_0)]" />
          </div>
          <p className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-40">
            No Results Found
          </p>
        </div>
      )}
    </div>
  );
}
