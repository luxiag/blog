
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
        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none" style={{paddingLeft: '12px'}}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" style={{color: 'var(--color-neutral-400)'}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchOpen(true)}
          placeholder="搜索文章..."
          className="block w-full focus:outline-none transition-colors"
          style={{
            paddingLeft: '36px',
            paddingRight: '12px',
            paddingTop: '8px',
            paddingBottom: '8px',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--foreground)',
            backgroundColor: 'white'
          }}
        />
      </div>

      {isSearchOpen && searchResults.length > 0 && (
        <div className="absolute z-10 w-full bg-white overflow-auto focus:outline-none" 
             style={{
               marginTop: '8px',
               maxHeight: '384px',
               borderRadius: '8px',
               padding: '4px',
               boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
               border: '1px solid var(--border-color)'
             }}>
          {searchResults.map((post) => (
            <div
              key={post.slug}
              className="cursor-pointer transition-colors"
              style={{
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '2px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => handlePostClick(post.slug)}
            >
              <div className="flex flex-col">
                <p style={{fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'var(--foreground)'}}>{post.title}</p>
                <p className="truncate" style={{fontSize: '13px', color: 'var(--color-neutral-500)', lineHeight: '1.5'}}>{post.excerpt}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap" style={{marginTop: '8px', gap: '4px'}}>
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center"
                        style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          backgroundColor: 'white',
                          color: 'var(--foreground)',
                          border: '1px solid var(--border-color)'
                        }}
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
        <div className="absolute z-10 w-full bg-white focus:outline-none"
             style={{
               marginTop: '8px',
               borderRadius: '8px',
               padding: '4px',
               boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
               border: '1px solid var(--border-color)'
             }}>
          <div style={{padding: '12px', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-neutral-500)'}}>未找到匹配的文章</div>
        </div>
      )}
    </div>
  );
}
