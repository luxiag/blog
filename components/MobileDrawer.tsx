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
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-background z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-200">
            <h2 className="text-sm font-semibold text-gray-1000 dark:text-gray-1000">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 dark:text-gray-500 hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors"
              aria-label="关闭菜单"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className={`overflow-y-auto ${title ? 'h-[calc(100vh-53px)]' : 'h-full relative'}`}>
          {!title && (
            <button
              onClick={onClose}
              className="sticky top-2 float-right mr-2 p-2 text-gray-500 dark:text-gray-500 hover:text-gray-1000 dark:hover:text-gray-1000 bg-background rounded-full shadow-md transition-colors z-10"
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
