'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, FileText } from 'lucide-react';
import { TocItem, SeriesPost, CategoryWithPosts } from '@/lib/markdown';

interface DocLayoutProps {
  toc: TocItem[];
  seriesPosts?: SeriesPost[];
  currentSlug?: string;
  category?: string;
  allCategoriesWithPosts?: CategoryWithPosts[];
  children: React.ReactNode;
}

export default function DocLayout({
  toc,
  seriesPosts,
  currentSlug,
  category,
  allCategoriesWithPosts,
  children,
}: DocLayoutProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(category ? [category] : []));

  const showSeries = seriesPosts && seriesPosts.length > 1;

  useEffect(() => {
    if (category) {
      setExpandedCategories(prev => {
        const next = new Set(prev);
        next.add(category);
        return next;
      });
    }
  }, [category]);

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-4 left-4 z-50 p-2.5 bg-background border border-gray-200 dark:border-gray-200 rounded-lg text-gray-700 dark:text-gray-700 hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors"
        aria-label="Toggle navigation"
      >
        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div className="px-6">
        <div className="relative mx-auto max-w-[var(--ds-page-width)] lg:flex lg:flex-row">
          <aside
            className={`sticky top-[64px] hidden h-[calc(100vh-64px)] w-[284px] lg:flex lg:shrink-0 lg:flex-col lg:justify-between bg-background overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isMobileMenuOpen ? '!flex' : ''
            }`}
            data-docs-sidebar
          >
            <nav className="styled-scrollbar overflow-y-auto flex flex-col pt-10 pb-4">
              {allCategoriesWithPosts && allCategoriesWithPosts.length > 0 ? (
                <ul className="px-0.5">
                  {allCategoriesWithPosts.map((catWithPosts) => {
                    const isExpanded = expandedCategories.has(catWithPosts.category);
                    const isCurrentCategory = category === catWithPosts.category;

                    return (
                      <li className="my-1.5" key={catWithPosts.category}>
                        <button
                          onClick={() => toggleCategory(catWithPosts.category)}
                          className={`hover:text-gray-1000 relative flex w-full cursor-pointer items-center justify-between rounded-md py-1.5 pl-2 pr-1 text-left text-sm font-semibold capitalize transition-colors ${
                            isCurrentCategory
                              ? 'text-gray-1000'
                              : 'text-gray-900 dark:text-gray-900'
                          }`}
                        >
                          <span className="truncate text-pretty">{catWithPosts.category}</span>
                          <svg
                            className={`w-3 h-3 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path fillRule="evenodd" d="m5.5 1.94.53.53 4.82 4.82a1 1 0 0 1 0 1.42l-4.82 4.82-.53.53L4.44 13l.53-.53L9.44 8 4.97 3.53 4.44 3z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {isExpanded && (
                          <ul className="px-0.5 mt-0.5 border-l border-gray-200 dark:border-gray-200 pl-3 ml-1">
                            {catWithPosts.posts.map((post) => {
                              const isCurrent = currentSlug === post.slug;
                              return (
                                <li className="my-1.5" key={post.slug} data-active={isCurrent ? 'true' : 'false'}>
                                  <Link
                                    href={`/posts/${post.slug}`}
                                    className={`hover:text-gray-1000 relative flex w-full cursor-pointer items-center justify-between rounded-md py-1 pl-2 text-left text-sm transition-colors ${
                                      isCurrent
                                        ? 'text-[var(--link-color)] font-medium'
                                        : 'text-gray-900 dark:text-gray-900'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      <span className="truncate text-pretty">{post.title}</span>
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : showSeries ? (
                <div className="px-2">
                  <div className="mb-4 pt-4 px-2">
                    <div className="flex items-center gap-2 px-2 py-2">
                      <div className="w-8 h-8 rounded-md border flex items-center justify-center bg-blue-100 border-blue-400 text-blue-700 dark:bg-blue-1000 dark:border-blue-900 dark:text-blue-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-[14px] leading-[20px] font-medium text-gray-1000 dark:text-gray-1000">{category || '文章'}</p>
                      </div>
                    </div>
                  </div>
                  <ul className="last-of-type:pb-3">
                    {seriesPosts.map((post) => {
                      const isCurrent = currentSlug === post.slug;
                      return (
                        <li className="my-1.5" key={post.slug} data-active={isCurrent ? 'true' : 'false'}>
                          <Link
                            href={`/posts/${post.slug}`}
                            className={`hover:text-gray-1000 relative flex w-full cursor-pointer items-center justify-between rounded-md py-1 pl-2 text-left text-sm transition-colors ${
                              isCurrent
                                ? 'text-[var(--link-color)] font-medium'
                                : 'text-gray-900 dark:text-gray-900'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="truncate text-pretty">{post.title}</span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-500 px-4">暂无相关文章</p>
              )}
            </nav>
          </aside>

          <article className="mt-4 pt-10 w-full min-w-0 px-1 md:px-6 lg:px-12 lg:pr-6">
            <div className="prose">
              {children}
            </div>
          </article>

          {toc.length > 0 && (
            <nav className="order-last hidden w-56 shrink-0 2xl:block">
              <div className="sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-10">
                <div className="text-gray-1000 dark:text-gray-1000 mb-1 text-sm font-medium">On this page</div>
                <ul className="space-y-2.5 py-2 text-sm">
                  {toc.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToHeading(item.id);
                          }}
                          className={`block leading-[1.6] transition-colors ${
                            item.level === 3 ? 'pl-3' : ''
                          } ${
                            isActive
                              ? 'text-[var(--link-color)]'
                              : 'text-gray-900 dark:text-gray-900 hover:text-gray-1000 dark:hover:text-gray-1000'
                          }`}
                        >
                          {item.text}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
