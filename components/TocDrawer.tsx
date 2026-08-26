'use client';

import { useState } from 'react';
import { TocItem, SeriesPost } from '@/lib/markdown';
import MobileDrawer from './MobileDrawer';
import { List, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface TocDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  toc: TocItem[];
  seriesPosts?: SeriesPost[];
  currentSlug?: string;
}

type TabType = 'toc' | 'series';

export default function TocDrawer({ isOpen, onClose, toc, seriesPosts, currentSlug }: TocDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('toc');
  const showSeries = seriesPosts && seriesPosts.length > 1;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
      onClose();
    }
  };

  if (toc.length === 0 && !showSeries) return null;

  return (
    <MobileDrawer isOpen={isOpen} onClose={onClose}>
      {showSeries && (
        <div className="flex border-b border-gray-200 dark:border-gray-200">
          <button
            onClick={() => setActiveTab('toc')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors ${
              activeTab === 'toc'
                ? 'text-blue-700 dark:text-blue-900 border-b-2 border-blue-700 dark:border-blue-900'
                : 'text-gray-500 dark:text-gray-500 hover:text-gray-1000 dark:hover:text-gray-1000'
            }`}
          >
            <List size={14} />
            TOC
          </button>
          <button
            onClick={() => setActiveTab('series')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors ${
              activeTab === 'series'
                ? 'text-blue-700 dark:text-blue-900 border-b-2 border-blue-700 dark:border-blue-900'
                : 'text-gray-500 dark:text-gray-500 hover:text-gray-1000 dark:hover:text-gray-1000'
            }`}
          >
            <BookOpen size={14} />
            Series
          </button>
        </div>
      )}

      {activeTab === 'toc' && (
        <nav className="py-2">
          {toc.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`w-full flex items-center text-left px-4 py-2.5 transition-colors ${
                item.level === 3 ? 'pl-8' : ''
              } text-gray-700 dark:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-100`}
            >
              <span className="text-sm truncate">{item.text}</span>
            </button>
          ))}
        </nav>
      )}

      {activeTab === 'series' && showSeries && (
        <nav className="py-2">
          {seriesPosts.map((post, index) => {
            const isCurrent = currentSlug === post.slug;
            return (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                onClick={onClose}
                className={`flex items-center w-full text-left px-4 py-2.5 transition-colors ${
                  isCurrent
                    ? 'bg-blue-100 dark:bg-blue-100 text-blue-900 dark:text-blue-900'
                    : 'text-gray-700 dark:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-100'
                }`}
              >
                <span className={`mr-3 flex-shrink-0 text-xs font-mono w-5 text-right ${
                  isCurrent ? 'text-blue-700 dark:text-blue-900' : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {index + 1}
                </span>
                <span className="text-sm truncate">{post.title}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </MobileDrawer>
  );
}
