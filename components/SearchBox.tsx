
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/blog';

interface SearchBoxProps {
  posts: Post[];
}

export default function SearchBox({ posts }: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filteredPosts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    setSearchResults(filteredPosts);
  }, [searchTerm, posts]);

  const handlePostClick = (slug: string) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearchOpen(false);
    router.push(`/blog/${slug}`);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchOpen(true)}
          placeholder="搜索文章..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {isSearchOpen && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-96 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          {searchResults.map((post) => (
            <div
              key={post.slug}
              className="cursor-pointer hover:bg-gray-100 px-4 py-3"
              onClick={() => handlePostClick(post.slug)}
            >
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-900">{post.title}</p>
                <p className="text-sm text-gray-500 truncate">{post.excerpt}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isSearchOpen && searchTerm && searchResults.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base focus:outline-none sm:text-sm">
          <div className="px-4 py-3 text-sm text-gray-500">未找到匹配的文章</div>
        </div>
      )}
    </div>
  );
}
