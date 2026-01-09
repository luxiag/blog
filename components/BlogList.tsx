
'use client';

import { useState } from 'react';
import BlogCard from './BlogCard';
import TagFilter from './TagFilter';
import { Post } from '@/types/blog';

export default function BlogList({ posts }: { posts: Post[] }) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--background)'}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{paddingTop: '48px', paddingBottom: '48px'}}>
        <div className="text-center" style={{marginBottom: '48px'}}>
          <h1 style={{fontSize: '48px', fontWeight: 900, marginBottom: '16px', fontFamily: 'var(--font-sans)', color: 'var(--foreground)'}}>博客文章</h1>
          <p style={{fontSize: '16px', maxWidth: '32rem', margin: '0 auto', color: 'var(--color-neutral-500)', lineHeight: '1.6'}}>
            分享技术见解、学习心得和思考感悟
          </p>
        </div>

        <TagFilter posts={posts} onFilter={setFilteredPosts} />

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{gap: '32px'}}>
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center" style={{padding: '48px 0'}}>
            <p style={{fontSize: '16px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>
              {posts.length > 0 ? '没有匹配的文章' : '暂无博客文章'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
