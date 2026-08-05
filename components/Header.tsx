'use client';

import Link from 'next/link';
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutGrid, BookOpen } from 'lucide-react';

const AlgoliaSearch = dynamic(() => import('./AlgoliaSearch'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-xs h-9 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
  )
});

interface HeaderContextType {
  registerCategoryDrawer: (setter: (open: boolean) => void) => void;
  registerTocDrawer: (setter: (open: boolean) => void) => void;
  openCategoryDrawer: () => void;
  openTocDrawer: () => void;
  isOnPostPage: boolean;
}

export const HeaderContext = createContext<HeaderContextType>({
  registerCategoryDrawer: () => {},
  registerTocDrawer: () => {},
  openCategoryDrawer: () => {},
  openTocDrawer: () => {},
  isOnPostPage: false,
});

export function useHeaderContext() {
  return useContext(HeaderContext);
}

export default function Header({ children }: { children?: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isOnPostPage = pathname.startsWith('/posts/');
  const isOnPostsListPage = pathname === '/posts';

  // Refs to store drawer open callbacks
  const categoryDrawerRef = useRef<((open: boolean) => void) | null>(null);
  const tocDrawerRef = useRef<((open: boolean) => void) | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const registerCategoryDrawer = (setter: (open: boolean) => void) => {
    categoryDrawerRef.current = setter;
  };

  const registerTocDrawer = (setter: (open: boolean) => void) => {
    tocDrawerRef.current = setter;
  };

  const openCategoryDrawer = () => {
    categoryDrawerRef.current?.(true);
  };

  const openTocDrawer = () => {
    tocDrawerRef.current?.(true);
  };

  return (
    <HeaderContext.Provider
      value={{
        registerCategoryDrawer,
        registerTocDrawer,
        openCategoryDrawer,
        openTocDrawer,
        isOnPostPage,
      }}
    >
      <header className="sticky top-0 z-50 md:relative bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Left side - Logo and category/toc button */}
            <div className="flex items-center gap-2">
              {/* Mobile category/toc button */}
              {isOnPostsListPage && (
                <button
                  type="button"
                  className="md:hidden p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  onClick={openCategoryDrawer}
                  aria-label="打开分类菜单"
                >
                  <LayoutGrid size={20} />
                </button>
              )}
              {isOnPostPage && (
                <button
                  type="button"
                  className="md:hidden p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  onClick={openTocDrawer}
                  aria-label="打开目录菜单"
                >
                  <BookOpen size={20} />
                </button>
              )}
              <Link href="/" className="text-xl font-semibold font-sans text-neutral-900 dark:text-neutral-100" aria-label="Home">
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/posts" className="text-sm text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                Post
              </Link>
              <Link href="/todos" className="text-sm text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                Todo
              </Link>
              <Link href="/tools" className="text-sm text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                Tools
              </Link>
              <AlgoliaSearch />
            </nav>

            {/* Mobile right side - Search and menu */}
            <div className="md:hidden flex items-center gap-2">
              <AlgoliaSearch />
              <button
                type="button"
                className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'max-h-64 opacity-100 pb-4' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="flex flex-col gap-1 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <Link
                href="/posts"
                className="px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Post
              </Link>
              <Link
                href="/todos"
                className="px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Todo
              </Link>
              <Link
                href="/tools"
                className="px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Tools
              </Link>
            </nav>
          </div>
        </div>
      </header>
      {children}
    </HeaderContext.Provider>
  );
}
