'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchBox from './SearchBox';
import { Post } from '@/types/blog';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/blog/posts.json');
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
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold font-sans text-neutral-900 dark:text-neutral-100">
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
              Home
            </Link>
            <Link href="/blog" className="text-sm text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
              Post
            </Link>
            <Link href="/todos" className="text-sm text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
              Todo
            </Link>
            <SearchBox posts={posts} />
          </nav>

          <div className="md:hidden flex items-center gap-4">
            <div className="w-full max-w-xs">
              <SearchBox posts={posts} />
            </div>
            <button
              type="button"
              className="focus:outline-none text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-neutral-200 dark:border-neutral-800 mt-3 pt-3">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-sm text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                首页
              </Link>
              <Link href="/blog" className="text-sm text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                博客
              </Link>
              <Link href="/todos" className="text-sm text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                Todo
              </Link>
              <Link href="/about" className="text-sm text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                关于
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
