'use client';

import { useState } from 'react';
import { TocItem, SeriesPost } from '@/lib/markdown';
import MobileDrawer from './MobileDrawer';
import { ChevronRight, List, BookOpen } from 'lucide-react';
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
      {/* Tabs */}
      {showSeries && (
        <div className="flex border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setActiveTab('toc')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors ${
              activeTab === 'toc'
                ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <List size={14} />
            TOC
          </button>
          <button
            onClick={() => setActiveTab('series')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors ${
              activeTab === 'series'
                ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <BookOpen size={14} />
            Series
          </button>
        </div>
      )}

      {/* TOC Content */}
      {activeTab === 'toc' && (
        <nav className="py-2">
          {toc.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`w-full flex items-center text-left px-4 py-2.5 transition-colors ${
                item.level === 3 ? 'pl-8' : ''
              } text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800`}
            >
              <ChevronRight size={12} className="mr-2 flex-shrink-0 text-neutral-400" />
              <span className="text-sm truncate">{item.text}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Series Content */}
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
                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span className={`mr-3 flex-shrink-0 text-xs font-mono w-5 text-right ${
                  isCurrent ? 'text-orange-500' : 'text-neutral-400'
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
