'use client';

import { Post } from '@/types/blog';

interface TagFilterProps {
  posts: Post[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function TagFilter({ posts, selectedCategory, onCategoryChange }: TagFilterProps) {
  const categoriesWithCounts = Array.from(
    posts.reduce((acc, post) => {
      const cat = post.category || 'Article';
      acc.set(cat, (acc.get(cat) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).sort((a, b) => b[1] - a[1]);

  const handleCategoryClick = (category: string) => {
    onCategoryChange(selectedCategory === category ? '' : category);
  };

  const handleClearFilter = () => {
    onCategoryChange('');
  };

  return (
    <div className="flex flex-col gap-3 py-3 sm:py-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleClearFilter}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            !selectedCategory
              ? 'bg-gray-1000 dark:bg-gray-1000 text-background'
              : 'text-gray-700 dark:text-gray-700 hover:text-gray-1000 dark:hover:text-gray-1000 hover:bg-gray-100 dark:hover:bg-gray-100'
          }`}
        >
          All ({posts.length})
        </button>

        {categoriesWithCounts.map(([category, count]) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedCategory === category
                ? 'bg-blue-700 dark:bg-blue-900 text-white'
                : 'text-gray-700 dark:text-gray-700 hover:text-gray-1000 dark:hover:text-gray-1000 hover:bg-gray-100 dark:hover:bg-gray-100'
            }`}
          >
            {category} ({count})
          </button>
        ))}
      </div>
    </div>
  );
}
