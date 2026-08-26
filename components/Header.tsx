'use client';

import Link from 'next/link';
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const AlgoliaSearch = dynamic(() => import('./AlgoliaSearch'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-xs h-8 bg-gray-100 dark:bg-gray-100 rounded-md animate-pulse" />
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
      <header className="sticky top-0 z-50 bg-background dark:bg-black border-b border-gray-200 dark:border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-[15px] font-bold text-gray-1000 dark:text-gray-1000 tracking-[-0.02em]" aria-label="Home">
                Blog
              </Link>
              <nav className="hidden md:flex items-center gap-[24px]">
                <Link href="/posts" className="text-[14px] text-gray-600 dark:text-gray-600 hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors">
                  Post
                </Link>
                <Link href="/todos" className="text-[14px] text-gray-600 dark:text-gray-600 hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors">
                  Todo
                </Link>
                <Link href="/tools" className="text-[14px] text-gray-600 dark:text-gray-600 hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors">
                  Tools
                </Link>
              </nav>
            </div>

            <div className="hidden md:flex items-center">
              <AlgoliaSearch />
            </div>

            <div className="md:hidden flex items-center gap-2">
              <AlgoliaSearch />
              <button
                type="button"
                className="p-1.5 text-gray-600 dark:text-gray-600 hover:text-gray-1000 dark:hover:text-gray-1000 transition-colors"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'max-h-64 opacity-100 pb-4' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="flex flex-col gap-0 pt-2 border-t border-gray-200 dark:border-gray-200">
              <Link
                href="/posts"
                className="px-3 py-2 text-[14px] text-gray-600 dark:text-gray-600 hover:text-gray-1000 dark:hover:text-gray-1000 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-md transition-colors"
              >
                Post
              </Link>
              <Link
                href="/todos"
                className="px-3 py-2 text-[14px] text-gray-600 dark:text-gray-600 hover:text-gray-1000 dark:hover:text-gray-1000 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-md transition-colors"
              >
                Todo
              </Link>
              <Link
                href="/tools"
                className="px-3 py-2 text-[14px] text-gray-600 dark:text-gray-600 hover:text-gray-1000 dark:hover:text-gray-1000 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-md transition-colors"
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
