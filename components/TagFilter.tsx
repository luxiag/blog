
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
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-gray-700 font-medium">筛选标签:</span>
        {allTags.length > 0 ? (
          <>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={handleClearFilter}
                className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                清除筛选
              </button>
            )}
          </>
        ) : (
          <span className="text-gray-500 text-sm">暂无标签</span>
        )}
      </div>
    </div>
  );
}
