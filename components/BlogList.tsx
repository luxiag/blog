
'use client';

import { useState } from 'react';
import BlogCard from './BlogCard';
import TagFilter from './TagFilter';
import { Post } from '@/types/blog';

export default function BlogList({ posts }: { posts: Post[] }) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">博客文章</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            分享技术见解、学习心得和思考感悟
          </p>
        </div>

        <TagFilter posts={posts} onFilter={setFilteredPosts} />

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {posts.length > 0 ? '没有匹配的文章' : '暂无博客文章'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
