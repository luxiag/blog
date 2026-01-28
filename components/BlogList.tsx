'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import TagFilter from './TagFilter';
import BorderedCard from './BorderedCard';
import { Post } from '@/types/blog';

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
    <div className="py-12 px-4">
      <TagFilter posts={posts} onFilter={handleFilter} />

      {postsByYear.length > 0 ? (
        <div className="flex flex-col gap-16">
          {postsByYear.map(([year, yearPosts]) => (
            <section key={year}>
              <div className="text-center mb-10">
                <span
                  className="flex flex-col items-center leading-none font-black font-sans tracking-tight"
                  style={{
                    fontSize: 'clamp(100px, 18vw, 180px)',
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="text-transparent stroke-text"
                      style={{
                        WebkitTextStroke: '1px var(--foreground)',
                        marginTop: i === 0 ? 0 : '-0.55em',
                      }}
                      aria-hidden="true"
                    >
                      {year}
                    </span>
                  ))}
                  <span className="text-neutral-900 dark:text-neutral-100 mt-0.5">{year}</span>
                </span>
              </div>

              <div className="flex flex-col gap-6">
                {yearPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="no-underline"
                  >
                    <BorderedCard>
                      <article
                        className="p-6 transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <div className="flex justify-between items-start gap-6">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold mb-2 font-sans text-neutral-900 dark:text-neutral-100">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 overflow-hidden text-ellipsis">
                                {post.excerpt}
                              </p>
                            )}
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex gap-2 mt-3 flex-wrap">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 text-xs font-mono border border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-xs font-mono text-neutral-500 whitespace-nowrap pt-0.5">
                            {post.date}
                          </div>
                        </div>
                      </article>
                    </BorderedCard>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {hasMore && (
            <div className="text-center mt-4">
              <button
                onClick={loadMore}
                className="px-12 py-4 text-sm font-medium font-mono text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 border border-neutral-900 dark:border-neutral-100 cursor-pointer transition-all duration-200 hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-neutral-900"
              >
                ··· 加载更多 ({filteredPosts.length - visibleCount} 篇)
              </button>
            </div>
          )}
        </div>
      ) : (
        <BorderedCard>
          <div className="text-center py-12 px-6">
            <p className="text-sm text-neutral-500 font-mono">
              {posts.length > 0 ? '没有匹配的文章' : '暂无博客文章'}
            </p>
          </div>
        </BorderedCard>
      )}
    </div>
  );
}
