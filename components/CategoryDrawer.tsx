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
        {/* All button */}
        <button
          onClick={() => handleCategoryClick('')}
          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
            !selectedCategory
              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <span className="text-sm font-medium">all</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              ({posts.length})
            </span>
            {!selectedCategory && (
              <Check size={16} className="text-orange-500" />
            )}
          </div>
        </button>

        {/* Category items */}
        {categoriesWithCounts.map(([category, count]) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
              selectedCategory === category
                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <span className="text-sm font-medium">{category}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                ({count})
              </span>
              {selectedCategory === category && (
                <Check size={16} className="text-orange-500" />
              )}
            </div>
          </button>
        ))}
      </nav>
    </MobileDrawer>
  );
}
