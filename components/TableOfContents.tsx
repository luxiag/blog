'use client';

import { useEffect, useState, useCallback } from 'react';
import { TocItem } from '@/lib/markdown';
import { ChevronRight, List, X } from 'lucide-react';

interface TableOfContentsProps {
  toc: TocItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const large = window.innerWidth >= 1280;
      setIsExpanded(large);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    if (activeId === item.id) {
      return 'active';
    }
    if (readIds.has(item.id)) {
      return 'read';
    }
    return 'unread';
  };

  return (
    <div
      className="fixed left-6 top-32 z-30"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-start gap-2">
        <div
          className={`bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 p-4 w-64 transition-all duration-300 ${isExpanded
            ? 'opacity-100 visible translate-x-0'
            : 'opacity-0 invisible -translate-x-4 pointer-events-none'
            }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              目录
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded transition-colors"
              title="收起目录"
            >
              <X size={14} />
            </button>
          </div>
          <nav className="space-y-0.5 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 custom-scrollbar">
            {toc.map((item) => {
              const status = getHeadingStatus(item);
              const isRead = status === 'read';
              const isActive = status === 'active';

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`group flex items-center w-full text-left transition-all duration-200 rounded px-2 py-1 ${item.level === 3 ? 'pl-6' : ''
                    } ${isActive
                      ? 'bg-orange-50 dark:bg-orange-900/20'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                >
                  <ChevronRight
                    size={12}
                    className={`mr-2 flex-shrink-0 transition-colors ${isActive
                      ? 'text-orange-500'
                      : isRead
                        ? 'text-neutral-600 dark:text-neutral-400'
                        : 'text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400'
                      }`}
                  />
                  <span
                    className={`text-sm transition-colors ${isActive
                      ? 'text-orange-600 dark:text-orange-400 font-medium'
                      : isRead
                        ? 'text-neutral-800 dark:text-neutral-200'
                        : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'
                      }`}
                  >
                    {item.text}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${!isExpanded && isHovering
          ? 'opacity-100 visible translate-x-0'
          : 'opacity-0 invisible -translate-x-4 pointer-events-none'
          }`}
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="w-10 h-10 mt-2 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 rounded-lg shadow-lg flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 border border-neutral-200 dark:border-neutral-700"
          title="展开目录"
        >
          <List size={20} />
        </button>
      </div>
    </div>
  );
}
