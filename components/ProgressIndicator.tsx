"use client";

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, Circle } from 'lucide-react';

interface ProgressItem {
  slug: string;
  title: string;
}

interface ProgressIndicatorProps {
  current: string;
  items: ProgressItem[];
  basePath?: string;
}

function createPostHref(basePath: string, slug: string): string {
  const segments = `${basePath}/${slug}`.split('/').filter(Boolean);
  return `/${segments.join('/')}`;
}

export default function ProgressIndicator({ current, items, basePath = '/posts' }: ProgressIndicatorProps) {
  const total = items.length;
  const currentIndex = items.findIndex((item) => item.slug === current);
  const hasCurrentItem = currentIndex >= 0;
  const [isExpanded, setIsExpanded] = useState(() => total <= 7);
  const headingId = useId();
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const currentItemRef = useRef<HTMLDivElement>(null);

  const invalidItemCount = items.filter((item) => !item.slug.trim() || !item.title.trim()).length;
  const duplicateSlugCount = total - new Set(items.map((item) => item.slug)).size;
  const currentPosition = hasCurrentItem ? currentIndex + 1 : 0;
  const progressPercent = total > 0 ? (currentPosition / total) * 100 : 0;
  const previousItem = hasCurrentItem && currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = hasCurrentItem && currentIndex < total - 1 ? items[currentIndex + 1] : null;

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (total === 0) console.warn('ProgressIndicator 的 items 不能为空。');
    if (total > 0 && !hasCurrentItem) {
      console.warn(`ProgressIndicator 当前文章 “${current}” 不在系列目录中。`);
    }
    if (invalidItemCount > 0) {
      console.warn(`ProgressIndicator 包含 ${invalidItemCount} 个缺少 slug 或标题的条目。`);
    }
    if (duplicateSlugCount > 0) {
      console.warn(`ProgressIndicator 包含 ${duplicateSlugCount} 个重复 slug。`);
    }
  }, [current, duplicateSlugCount, hasCurrentItem, invalidItemCount, total]);

  useEffect(() => {
    if (!isExpanded || total <= 7 || !listRef.current || !currentItemRef.current) return;

    const list = listRef.current;
    const item = currentItemRef.current;
    const targetTop = item.offsetTop - list.offsetTop - (list.clientHeight - item.clientHeight) / 2;
    list.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
  }, [currentIndex, isExpanded, total]);

  if (total === 0) return null;

  return (
    <nav
      className="not-prose mt-2 mb-6 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-700/70 dark:bg-neutral-900/70"
      aria-labelledby={headingId}
    >
      <div className="bg-gradient-to-r from-blue-50/70 via-white to-white px-3 py-3 dark:from-blue-950/25 dark:via-neutral-900 dark:to-neutral-900 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 items-baseline rounded-lg bg-blue-700 px-2.5 py-2 text-white" aria-hidden="true">
            <span className="text-xl font-bold tabular-nums leading-none">
              {hasCurrentItem ? String(currentPosition).padStart(2, '0') : '--'}
            </span>
            <span className="ml-1 text-[10px] font-medium text-blue-100">/{total}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div id={headingId} className="line-clamp-2 text-sm font-semibold leading-5 text-neutral-900 dark:text-neutral-100">
              {hasCurrentItem ? items[currentIndex].title : '当前文章未收录'}
            </div>
          </div>

          {total > 1 && (
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-controls={listId}
              onClick={() => setIsExpanded((value) => !value)}
              className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-700 transition-colors hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-blue-700 dark:hover:text-blue-400 dark:focus-visible:ring-offset-neutral-900"
            >
              <span className="sm:hidden">{isExpanded ? '收起' : '目录'}</span>
              <span className="hidden sm:inline">{isExpanded ? '收起目录' : `全部 ${total} 篇`}</span>
              <ChevronDown
                aria-hidden="true"
                size={13}
                className={`transition-transform motion-reduce:transition-none ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <span className="shrink-0 text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400">
            {hasCurrentItem ? `已完成 ${currentIndex} · 当前 ${currentPosition}` : '进度未定位'}
          </span>
          <progress className="sr-only" value={currentPosition} max={total} aria-label={`系列阅读进度：${currentPosition}/${total}`} />
          <div
            className="grid min-w-0 flex-1 gap-1"
            style={{ gridTemplateColumns: `repeat(${Math.min(total, 20)}, minmax(0, 1fr))` }}
            aria-hidden="true"
          >
            {items.map((item, index) => (
              <span
                key={`${item.slug}-segment-${index}`}
                title={`第 ${index + 1} 篇：${item.title}`}
                className={`h-1.5 rounded-full ${
                  hasCurrentItem && index < currentIndex
                    ? 'bg-emerald-500'
                    : index === currentIndex
                      ? 'bg-blue-700'
                      : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
              />
            ))}
          </div>
          <span className="shrink-0 text-[10px] font-semibold tabular-nums text-blue-700 dark:text-blue-400">
            {hasCurrentItem ? `${Math.round(progressPercent)}%` : '--'}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div
          ref={listRef}
          id={listId}
          role="list"
          className="grid max-h-[50vh] grid-cols-1 gap-1.5 overflow-y-auto border-t border-neutral-200/70 bg-neutral-50/50 p-2 sm:max-h-[26rem] sm:grid-cols-2 sm:p-3 dark:border-neutral-700/60 dark:bg-neutral-950/30"
        >
          {items.map((item, index) => {
            const isCurrent = index === currentIndex;
            const isCompleted = hasCurrentItem && index < currentIndex;
            const hasValidTarget = item.slug.trim().length > 0;
            const statusLabel = isCurrent ? '当前' : isCompleted ? '已完成' : '未读';
            const itemClassName = `group flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 text-left no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
              isCurrent
                ? 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-800/80 dark:bg-blue-950/40 dark:text-blue-100'
                : 'border-transparent bg-white text-neutral-700 hover:border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900/70 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/80'
            }`;

            const itemContent = (
              <>
                <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                  isCurrent
                    ? 'bg-blue-700 text-white'
                    : isCompleted
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                }`}>
                  {isCompleted ? <Check aria-hidden="true" size={15} strokeWidth={2.2} /> : index + 1}
                </span>
                <span className="min-w-0 flex-1 break-words text-[13px] font-medium leading-[18px]">
                  {item.title || '未命名文章'}
                </span>
                <span className={`inline-flex shrink-0 items-center gap-1 text-[11px] ${
                  isCurrent
                    ? 'font-semibold text-blue-700 dark:text-blue-400'
                    : isCompleted
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-neutral-400 dark:text-neutral-500'
                }`}>
                  {isCurrent ? <BookOpen aria-hidden="true" size={12} /> : isCompleted ? null : <Circle aria-hidden="true" size={9} />}
                  {statusLabel}
                </span>
              </>
            );

            return (
              <div
                key={`${item.slug}-${index}`}
                ref={isCurrent ? currentItemRef : undefined}
                role="listitem"
                className="min-w-0"
              >
                {isCurrent ? (
                  <div className={itemClassName} aria-current="page">
                    {itemContent}
                  </div>
                ) : hasValidTarget ? (
                  <Link href={createPostHref(basePath, item.slug)} className={itemClassName}>
                    {itemContent}
                  </Link>
                ) : (
                  <div className={`${itemClassName} cursor-not-allowed opacity-60`} aria-disabled="true">
                    {itemContent}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {(previousItem || nextItem) && (
        <div className="grid grid-cols-1 gap-2 border-t border-neutral-200/70 p-3 sm:grid-cols-2 dark:border-neutral-700/60">
          {previousItem && (
            <Link
              href={createPostHref(basePath, previousItem.slug)}
              className="group flex min-h-12 min-w-0 items-center gap-2 rounded-xl px-3 py-2 no-underline transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-neutral-800/70"
            >
              <ArrowLeft aria-hidden="true" size={16} className="shrink-0 text-neutral-400 group-hover:text-blue-700" />
              <span className="min-w-0">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-neutral-400">上一篇</span>
                <span className="line-clamp-2 block text-xs font-medium leading-5 text-neutral-700 group-hover:text-blue-700 dark:text-neutral-300 dark:group-hover:text-blue-400">
                  {previousItem.title}
                </span>
              </span>
            </Link>
          )}
          {nextItem && (
            <Link
              href={createPostHref(basePath, nextItem.slug)}
              className={`group flex min-h-12 min-w-0 items-center justify-end gap-2 rounded-xl px-3 py-2 text-right no-underline transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-neutral-800/70 ${previousItem ? '' : 'sm:col-start-2'}`}
            >
              <span className="min-w-0">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-neutral-400">下一篇</span>
                <span className="line-clamp-2 block text-xs font-medium leading-5 text-neutral-700 group-hover:text-blue-700 dark:text-neutral-300 dark:group-hover:text-blue-400">
                  {nextItem.title}
                </span>
              </span>
              <ArrowRight aria-hidden="true" size={16} className="shrink-0 text-neutral-400 group-hover:text-blue-700" />
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
