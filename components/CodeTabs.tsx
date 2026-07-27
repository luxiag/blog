"use client";

import React, { useState } from 'react';

interface CodeTabsProps {
  items: string[];
  children: React.ReactNode;
}

export default function CodeTabs({ items, children }: CodeTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const childArray = React.Children.toArray(children);

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
      <div className="code-tabs-content min-h-[40px]">
        {childArray[activeIndex] || null}
      </div>
    </div>
  );
}
