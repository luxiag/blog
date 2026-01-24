'use client';

import { useState } from 'react';
import { Post } from '@/types/blog';

interface TagFilterProps {
  posts: Post[];
  onFilter: (filteredPosts: Post[]) => void;
}

export default function TagFilter({ posts, onFilter }: TagFilterProps) {
  const allCategories = Array.from(
    new Set(
      posts.flatMap((post) => post.category ? [post.category] : [])
    )
  ).sort();

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory('');
      onFilter(posts);
    } else {
      setSelectedCategory(category);
      const filteredPosts = posts.filter((post) =>
        post.category === category
      );
      onFilter(filteredPosts);
    }
  };

  const handleClearFilter = () => {
    setSelectedCategory('');
    onFilter(posts);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold font-mono text-neutral-900 dark:text-neutral-100">筛选分类:</span>
        {allCategories.length > 0 ? (
          <>
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer border ${
                  selectedCategory === category
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                    : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
              >
                {category}
              </button>
            ))}
            {selectedCategory && (
              <button
                onClick={handleClearFilter}
                className="px-3 py-1.5 text-xs font-mono rounded bg-white dark:bg-neutral-800 text-orange-600 dark:text-orange-400 border border-orange-600 dark:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors cursor-pointer"
              >
                清除筛选
              </button>
            )}
          </>
        ) : (
          <span className="text-xs font-mono text-neutral-500">暂无分类</span>
        )}
      </div>
    </div>
  );
}
