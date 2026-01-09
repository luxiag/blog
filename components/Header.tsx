
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchBox from './SearchBox';
// 移除直接导入服务器端函数
import { Post } from '@/types/blog';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const allPosts = await response.json();
        setPosts(allPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              我的博客
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              首页
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">
              博客
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              关于
            </Link>
            <SearchBox posts={posts} />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <div className="w-full max-w-xs">
              <SearchBox posts={posts} />
            </div>
            <button
              type="button"
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              onClick={toggleMenu}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                首页
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">
                博客
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                关于
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
