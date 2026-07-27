"use client";

import { useRef } from 'react';

// Custom Time Input with click-to-open and orange accent color
export function CustomTimeInput({
  value,
  onChange,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
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
        type="time"
        value={value}
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
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    </div>
  );
}
