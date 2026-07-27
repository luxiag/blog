'use client';

import { useEffect } from 'react';

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${title} | 我的博客`;

    return () => {
      document.title = originalTitle;
    };
  }, [title]);

  return null;
}
