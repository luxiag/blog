'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import TagFilter from './TagFilter';
import CategoryDrawer from './CategoryDrawer';
import { useHeaderContext } from './Header';
import { Post } from '@/types/blog';
import { ArrowRight, Calendar } from 'lucide-react';

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
  }
}

export default function BlogList({ posts }: { posts: Post[] }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [hydrated, setHydrated] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const { registerCategoryDrawer } = useHeaderContext();

  useEffect(() => {
    registerCategoryDrawer(setIsCategoryDrawerOpen);
  }, [registerCategoryDrawer]);

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

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveState({
        category: selectedCategory,
        visibleCount,
        scrollY: window.scrollY,
      });
    };

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
    <div className="flex flex-col gap-6 sm:gap-8">
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        posts={posts}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="hidden md:block p-2 sm:p-6">
        <TagFilter
          posts={posts}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {selectedCategory && (
        <div className="md:hidden mt-2 px-4">
          <div className="flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-gray-200 rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-700 dark:bg-blue-900" />
              <span className="text-xs text-gray-500 dark:text-gray-500">Filter:</span>
              <span className="px-2 py-0.5 bg-blue-700 dark:bg-blue-900 text-white text-xs font-medium rounded">
                {selectedCategory}
              </span>
            </div>
            <button
              onClick={() => handleCategoryChange('')}
              className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {postsByYear.length > 0 ? (
        <div className="flex flex-col gap-10 md:px-6">
          {postsByYear.map(([year, yearPosts]) => (
            <section key={year}>
              <div className="mb-6 px-3 md:px-0">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold font-sans text-gray-1000 dark:text-gray-1000 tracking-tight">
                    {year}
                  </h2>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
                    {yearPosts.length} posts
                  </span>
                </div>
                <div className="mt-3 h-px bg-gray-200 dark:bg-gray-200" />
              </div>

              <div className="flex flex-col">
                {yearPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="group px-3 md:px-0"
                  >
                    <div className="flex items-start md:items-center gap-3 md:gap-4 py-4 border-b border-gray-200 dark:border-gray-200 group-hover:bg-gray-100 dark:group-hover:bg-gray-100 md:group-hover:bg-transparent transition-colors -mx-3 px-3 md:mx-0 md:px-0 rounded md:rounded-none">
                      <div className="hidden md:block w-20 shrink-0">
                        <span className="text-sm text-gray-500 dark:text-gray-500 font-sans">
                          {post.date.substring(0, 10).replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, '$2/$3')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-medium text-gray-1000 dark:text-gray-1000 group-hover:text-blue-900 dark:group-hover:text-blue-900 transition-colors leading-snug">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500 line-clamp-1 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-1 md:hidden">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {post.date.substring(0, 10)}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-900 transition-colors shrink-0 mt-1 md:mt-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {hasMore && (
            <div className="text-center pt-8 pb-12">
              <button
                onClick={loadMore}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-1000 dark:bg-gray-1000 text-background font-medium text-sm rounded-md hover:opacity-90 transition-all active:scale-95"
              >
                Load More ({filteredPosts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center mx-4">
          <Calendar className="w-10 h-10 text-gray-300 dark:text-gray-300 mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-500">
            No posts found.
          </p>
        </div>
      )}
    </div>
  );
}
