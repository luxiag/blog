
'use client';

import { useState } from 'react';
import { Post } from '@/types/blog';

interface TagFilterProps {
  posts: Post[];
  onFilter: (filteredPosts: Post[]) => void;
}

export default function TagFilter({ posts, onFilter }: TagFilterProps) {
  // 提取所有唯一标签
  const allTags = Array.from(
    new Set(
      posts.flatMap((post) => post.tags || [])
    )
  ).sort();

  const [selectedTag, setSelectedTag] = useState<string>('');

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      // 如果点击已选中的标签，则清除筛选
      setSelectedTag('');
      onFilter(posts);
    } else {
      // 否则按标签筛选
      setSelectedTag(tag);
      const filteredPosts = posts.filter((post) =>
        post.tags && post.tags.includes(tag)
      );
      onFilter(filteredPosts);
    }
  };

  const handleClearFilter = () => {
    setSelectedTag('');
    onFilter(posts);
  };

  return (
    <div style={{marginBottom: '32px'}}>
      <div className="flex flex-wrap items-center" style={{gap: '8px'}}>
        <span style={{fontWeight: 600, fontSize: '14px', color: 'var(--foreground)', fontFamily: 'var(--font-mono)'}}>筛选标签:</span>
        {allTags.length > 0 ? (
          <>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="transition-colors"
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: selectedTag === tag 
                    ? 'var(--foreground)' 
                    : 'white',
                  color: selectedTag === tag 
                    ? 'white' 
                    : 'var(--foreground)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                {tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={handleClearFilter}
                className="transition-colors"
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'white',
                  color: 'var(--color-orange-800)',
                  border: '1px solid var(--color-orange-800)',
                  cursor: 'pointer'
                }}
              >
                清除筛选
              </button>
            )}
          </>
        ) : (
          <span style={{fontSize: '13px', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)'}}>暂无标签</span>
        )}
      </div>
    </div>
  );
}
