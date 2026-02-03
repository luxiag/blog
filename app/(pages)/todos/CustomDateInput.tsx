"use client";

import { useRef } from 'react';

// Custom Date Input with click-to-open and orange accent color
export function CustomDateInput({
  value,
  onChange,
  min,
  max,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (inputRef.current?.showPicker) {
      try {
        inputRef.current.showPicker();
      } catch (err) {
        inputRef.current?.focus();
      }
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`relative cursor-pointer group ${className}`}
    >
      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 pr-10 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 cursor-pointer focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20 transition-all [&::-webkit-calendar-picker-indicator]:hidden"
      />
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-orange-500 transition-colors pointer-events-none"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </div>
  );
}
