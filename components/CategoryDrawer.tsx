'use client';

import { useMemo } from 'react';
import { Post } from '@/types/blog';
import MobileDrawer from './MobileDrawer';
import { Check } from 'lucide-react';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryDrawer({
  isOpen,
  onClose,
  posts,
  selectedCategory,
  onCategoryChange,
}: CategoryDrawerProps) {
  const categoriesWithCounts = useMemo(() => {
    return Array.from(
      posts.reduce((acc, post) => {
        const cat = post.category || 'Article';
        acc.set(cat, (acc.get(cat) || 0) + 1);
        return acc;
      }, new Map<string, number>())
    ).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const handleCategoryClick = (category: string) => {
    onCategoryChange(selectedCategory === category ? '' : category);
    onClose();
  };

  return (
    <MobileDrawer isOpen={isOpen} onClose={onClose}>
      <nav className="py-2">
        <button
          onClick={() => handleCategoryClick('')}
          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
            !selectedCategory
              ? 'bg-blue-100 dark:bg-blue-100 text-blue-900 dark:text-blue-900'
              : 'text-gray-700 dark:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-100'
          }`}
        >
          <span className="text-sm font-medium">All</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-500">
              ({posts.length})
            </span>
            {!selectedCategory && (
              <Check size={16} className="text-blue-700 dark:text-blue-900" />
            )}
          </div>
        </button>

        {categoriesWithCounts.map(([category, count]) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
              selectedCategory === category
                ? 'bg-blue-100 dark:bg-blue-100 text-blue-900 dark:text-blue-900'
                : 'text-gray-700 dark:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-100'
            }`}
          >
            <span className="text-sm font-medium">{category}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-500">
                ({count})
              </span>
              {selectedCategory === category && (
                <Check size={16} className="text-blue-700 dark:text-blue-900" />
              )}
            </div>
          </button>
        ))}
      </nav>
    </MobileDrawer>
  );
}
