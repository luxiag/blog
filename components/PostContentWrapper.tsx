'use client';

import { TocItem, SeriesPost } from '@/lib/markdown';
import TocDrawer from './TocDrawer';
import { useHeaderContext } from './Header';
import { useEffect, useState } from 'react';

interface PostContentWrapperProps {
  toc: TocItem[];
  seriesPosts?: SeriesPost[];
  currentSlug?: string;
  children: React.ReactNode;
}

export default function PostContentWrapper({
  toc,
  seriesPosts,
  currentSlug,
  children,
}: PostContentWrapperProps) {
  const [isTocDrawerOpen, setIsTocDrawerOpen] = useState(false);
  const { registerTocDrawer } = useHeaderContext();

  useEffect(() => {
    registerTocDrawer(setIsTocDrawerOpen);
  }, [registerTocDrawer]);

  return (
    <>
      <TocDrawer
        isOpen={isTocDrawerOpen}
        onClose={() => setIsTocDrawerOpen(false)}
        toc={toc}
        seriesPosts={seriesPosts}
        currentSlug={currentSlug}
      />
      {children}
    </>
  );
}
