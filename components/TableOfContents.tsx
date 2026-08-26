'use client';

import { useEffect, useState, useCallback } from 'react';
import { TocItem, SeriesPost } from '@/lib/markdown';
import { useHeaderContext } from './Header';

interface TableOfContentsProps {
  toc: TocItem[];
  seriesPosts?: SeriesPost[];
  currentSlug?: string;
}

export default function TableOfContents({ toc, seriesPosts, currentSlug }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  const updateReadHeadings = useCallback(() => {
    const viewportCenter = window.scrollY + window.innerHeight / 3;
    const newReadIds = new Set<string>();

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        if (elementTop < viewportCenter) {
          newReadIds.add(item.id);
        }
      }
    });

    setReadIds(newReadIds);
  }, [toc]);

  useEffect(() => {
    updateReadHeadings();
    window.addEventListener('scroll', updateReadHeadings, { passive: true });
    return () => window.removeEventListener('scroll', updateReadHeadings);
  }, [updateReadHeadings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  if (toc.length === 0) return null;

  const getHeadingStatus = (item: TocItem) => {
    if (activeId === item.id) return 'active';
    if (readIds.has(item.id)) return 'read';
    return 'unread';
  };

  return (
    <div className="hidden xl:block">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-500 mb-3 uppercase tracking-wider">On this page</h4>
      <nav className="space-y-1">
        {toc.map((item) => {
          const status = getHeadingStatus(item);
          const isActive = status === 'active';
          const isRead = status === 'read';

          return (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`block w-full text-left text-sm transition-colors rounded px-2 py-1 ${
                item.level === 3 ? 'pl-4' : ''
              } ${
                isActive
                  ? 'text-gray-1000 dark:text-gray-1000 font-medium bg-gray-100 dark:bg-gray-100'
                  : isRead
                    ? 'text-gray-900 dark:text-gray-900'
                    : 'text-gray-500 dark:text-gray-500 hover:text-gray-1000 dark:hover:text-gray-1000'
              }`}
            >
              {item.text}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
