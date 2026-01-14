'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import TagFilter from './TagFilter';
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        <TagFilter posts={posts} onFilter={handleFilter} />

        {postsByYear.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {postsByYear.map(([year, yearPosts]) => (
              <section key={year}>
                {/* Year Header - Stacked Outline Effect */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      lineHeight: 0.9,
                      fontSize: 'clamp(120px, 20vw, 200px)',
                      fontWeight: 900,
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        style={{
                          WebkitTextStroke: '1px var(--foreground)',
                          color: 'var(--background)',
                          marginTop: i === 0 ? 0 : '-0.55em',
                          userSelect: 'none',
                        }}
                        aria-hidden="true"
                      >
                        {year}
                      </span>
                    ))}
                    <span style={{ marginTop: '-0.55em', color: 'var(--foreground)' }}>
                      {year}
                    </span>
                  </span>
                </div>

                {/* Post Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {yearPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <article
                        style={{
                          background: 'white',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '24px',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{
                              fontSize: '18px',
                              fontWeight: 600,
                              color: 'var(--foreground)',
                              marginBottom: '8px',
                              fontFamily: 'var(--font-sans)',
                            }}>
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p style={{
                                fontSize: '14px',
                                color: 'var(--color-neutral-500)',
                                lineHeight: 1.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}>
                                {post.excerpt}
                              </p>
                            )}
                            {post.tags && post.tags.length > 0 && (
                              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    style={{
                                      padding: '4px 8px',
                                      fontSize: '11px',
                                      fontFamily: 'var(--font-mono)',
                                      border: '1px solid var(--border-color)',
                                      borderRadius: '4px',
                                      color: 'var(--color-neutral-500)',
                                      backgroundColor: 'white',
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div style={{
                            fontSize: '13px',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--color-neutral-500)',
                            whiteSpace: 'nowrap',
                            paddingTop: '2px',
                          }}>
                            {post.date}
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  onClick={loadMore}
                  style={{
                    padding: '16px 48px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--foreground)',
                    backgroundColor: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  ··· 加载更多 ({filteredPosts.length - visibleCount} 篇)
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px 24px',
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
          }}>
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--color-neutral-500)', 
              fontFamily: 'var(--font-mono)' 
            }}>
              {posts.length > 0 ? '没有匹配的文章' : '暂无博客文章'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
