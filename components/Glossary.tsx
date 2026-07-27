"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface GlossaryProps {
  term: string;
  children?: React.ReactNode;
}

export default function Glossary({ term, children }: GlossaryProps) {
  const displayText = children
    ? Array.isArray(children)
      ? children.map(c => (typeof c === 'string' ? c : '')).join('')
      : typeof children === 'string'
        ? children
        : term
    : term;

  const triggerRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 6,
    });
  }, []);

  const show = useCallback(() => {
    setVisible(true);
    updatePos();
  }, [updatePos]);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    updatePos();
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [visible, updatePos]);

  return (
    <>
      <span
        ref={triggerRef}
        className="glossary-term relative inline cursor-help border-b border-dotted border-neutral-400/60 dark:border-neutral-500/60 align-baseline"
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {displayText}
      </span>
      {mounted && visible && pos && createPortal(
        <span
          className="px-3 py-1.5 bg-[oklch(0.22_0.01_260)] dark:bg-[oklch(0.35_0.01_260)] text-white text-[0.8125rem] leading-[1.5] rounded-md max-w-[280px] pointer-events-none shadow-[0_2px_8px_rgba(0,0,0,0.12)] font-sans z-[9999]"
          style={{
            position: 'fixed',
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -100%)',
          }}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {term}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[oklch(0.22_0.01_260)] dark:border-t-[oklch(0.35_0.01_260)]"
          />
        </span>,
        document.body
      )}
    </>
  );
}
