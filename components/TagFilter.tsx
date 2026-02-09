'use client';

import { useState } from 'react';
import { Post } from '@/types/blog';

interface TagFilterProps {
  posts: Post[];
  onFilter: (filteredPosts: Post[]) => void;
}

export default function TagFilter({ posts, onFilter }: TagFilterProps) {
  const categoriesWithCounts = Array.from(
    posts.reduce((acc, post) => {
      const cat = post.category || 'Article';
      acc.set(cat, (acc.get(cat) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).sort((a, b) => b[1] - a[1]);

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory('');
      onFilter(posts);
    } else {
      setSelectedCategory(category);
      const filteredPosts = posts.filter((post) =>
        (post.category || 'Article') === category
      );
      onFilter(filteredPosts);
    }
  };

  const handleClearFilter = () => {
    setSelectedCategory('');
    onFilter(posts);
  };

  return (
    <div className="flex flex-col gap-6  border-y border-neutral-100 dark:border-neutral-800/50">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        {/* <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
          <span className="text-xs font-bold font-sans tracking-widest uppercase text-neutral-400">分类检索</span>
        </div> */}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleClearFilter}
            className={`px-4 py-1.5 text-xs font-mono rounded-lg transition-all duration-300 border ${!selectedCategory
                ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-100 dark:border-neutral-100 dark:text-neutral-900 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.1)]'
                : 'bg-transparent border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-900 dark:hover:border-neutral-100 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
          >
            all ({posts.length})
          </button>

          {categoriesWithCounts.map(([category, count]) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-1.5 text-xs font-mono transition-all rounded-lg duration-300 border ${selectedCategory === category
                  ? 'bg-orange-600  text-white shadow-[4px_4px_0px_rgba(234,88,12,0.2)]'
                  : 'bg-transparent border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-orange-600 hover:text-orange-600'
                }`}
            >
              {category} <span className="opacity-50 ml-1">({count})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

