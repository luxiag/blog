"use client";

import React, { useEffect, useId, useMemo, useState } from 'react';

interface CodeTabsProps {
  items: string[];
  children: React.ReactNode;
}

function isWhitespaceNode(node: React.ReactNode): boolean {
  return typeof node === 'string' && node.trim() === '';
}

function isTabSeparator(node: React.ReactNode): boolean {
  if (!React.isValidElement(node)) return false;
  if (node.type === 'hr') return true;
  if (typeof node.type === 'function') {
    const fn = node.type as Record<string, unknown>;
    if (fn.__isCodeTabsSeparator) return true;
  }
  return false;
}

function groupTabContent(children: React.ReactNode): React.ReactNode[][] {
  const nodes = React.Children.toArray(children).filter((node) => !isWhitespaceNode(node));
  if (nodes.length === 0) return [];

  const groups: React.ReactNode[][] = [[]];
  for (const node of nodes) {
    if (isTabSeparator(node)) {
      groups.push([]);
    } else {
      groups[groups.length - 1].push(node);
    }
  }

  return groups;
}

export default function CodeTabs({ items, children }: CodeTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const instanceId = useId();
  const contentGroups = useMemo(() => groupTabContent(children), [children]);
  const safeActiveIndex = activeIndex < items.length ? activeIndex : 0;
  const activeGroup = items.length > 0 ? contentGroups[safeActiveIndex] || [] : [];

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(0);
  }, [activeIndex, items.length]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && items.length !== contentGroups.length) {
      console.warn(
        `CodeTabs 标签数（${items.length}）与内容组数（${contentGroups.length}）不一致，请检查 --- 分隔符。`,
      );
    }
  }, [contentGroups.length, items.length]);

  return (
    <div className="code-tabs my-6 rounded-xl border border-neutral-200/80 dark:border-neutral-700/60 overflow-hidden bg-white dark:bg-neutral-900/50">
      <div className="flex border-b border-neutral-200/60 dark:border-neutral-700/40 bg-neutral-50/80 dark:bg-neutral-800/40">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors relative ${
              i === activeIndex
                ? 'text-[#ea580c] dark:text-[#ea580c]'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400'
            }`}
          >
            {item}
            {i === activeIndex && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ea580c]" />
            )}
          </button>
        ))}
      </div>
      <div
        id={`${instanceId}-panel`}
        className="code-tabs-content min-h-[40px]"
        role="tabpanel"
        aria-labelledby={items.length > 0 ? `${instanceId}-tab-${safeActiveIndex}` : undefined}
      >
        {activeGroup}
      </div>
    </div>
  );
}
