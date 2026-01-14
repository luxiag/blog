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
    <div className="relative w-full max-w-xs">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchOpen(true)}
          placeholder="搜索文章..."
          className="block w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none font-mono text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 focus:border-neutral-400 transition-colors"
        />
      </div>

      {isSearchOpen && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-2 max-h-96 overflow-auto bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 p-1">
          {searchResults.map((post) => (
            <div
              key={post.slug}
              className="cursor-pointer p-3 rounded mb-0.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={() => handlePostClick(post.slug)}
            >
              <div className="flex flex-col">
                <p className="text-sm font-semibold mb-1 text-neutral-900 dark:text-neutral-100">{post.title}</p>
                <p className="text-xs text-neutral-500 line-clamp-1">{post.excerpt}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-1.5 py-0.5 text-xs rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-mono"
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
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 p-1">
          <div className="p-3 text-xs font-mono text-neutral-500">未找到匹配的文章</div>
        </div>
      )}
    </div>
  );
}
