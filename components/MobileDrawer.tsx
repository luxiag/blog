'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function MobileDrawer({ isOpen, onClose, title, children }: MobileDrawerProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white dark:bg-neutral-900 z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header - only show if title is provided */}
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              aria-label="关闭菜单"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={`overflow-y-auto ${title ? 'h-[calc(100vh-53px)]' : 'h-full relative'}`}>
          {/* Close button when no title */}
          {!title && (
            <button
              onClick={onClose}
              className="sticky top-2 float-right mr-2 p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 bg-white dark:bg-neutral-800 rounded-full shadow-md transition-colors z-10"
              aria-label="关闭菜单"
            >
              <X size={16} />
            </button>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
