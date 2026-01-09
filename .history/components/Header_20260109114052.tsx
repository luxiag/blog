
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
    <header className="sticky top-0 z-50 bg-white" style={{borderBottom: '1px solid var(--border-color)'}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center" style={{padding: '12px 0'}}>
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold" style={{fontFamily: 'var(--font-sans)', color: 'var(--foreground)'}}>
              {/* 我的博客 */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center" style={{gap: '32px'}}>
            <Link href="/" className="transition-colors" style={{color: 'var(--foreground)', fontSize: '14px'}}>
              首页
            </Link>
            <Link href="/blog" className="transition-colors" style={{color: 'var(--foreground)', fontSize: '14px'}}>
              博客
            </Link>
            <Link href="/about" className="transition-colors" style={{color: 'var(--foreground)', fontSize: '14px'}}>
              关于
            </Link>
            <SearchBox posts={posts} />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center" style={{gap: '16px'}}>
            <div className="w-full max-w-xs">
              <SearchBox posts={posts} />
            </div>
            <button
              type="button"
              className="focus:outline-none transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              style={{color: 'var(--foreground)'}}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden" style={{paddingBottom: '16px', borderTop: '1px solid var(--border-color)', marginTop: '12px', paddingTop: '12px'}}>
            <nav className="flex flex-col" style={{gap: '16px'}}>
              <Link href="/" className="transition-colors" style={{color: 'var(--foreground)', fontSize: '14px'}}>
                首页
              </Link>
              <Link href="/blog" className="transition-colors" style={{color: 'var(--foreground)', fontSize: '14px'}}>
                博客
              </Link>
              <Link href="/about" className="transition-colors" style={{color: 'var(--foreground)', fontSize: '14px'}}>
                关于
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
