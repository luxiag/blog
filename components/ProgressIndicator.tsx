"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ProgressItem {
  slug: string;
  title: string;
}

interface ProgressIndicatorProps {
  current: string;
  items: ProgressItem[];
  basePath?: string;
}

export default function ProgressIndicator({ current, items, basePath = '/posts' }: ProgressIndicatorProps) {
  const currentIndex = items.findIndex(item => item.slug === current);
  const total = items.length;
  const [mounted, setMounted] = useState(false);
  const [hoverOffset, setHoverOffset] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardIndex: number) => {
    if (isScrolling) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX;
    const edgeThreshold = rect.width * 0.3;
    
    const distToLeft = mouseX - rect.left;
    const distToRight = rect.right - mouseX;
    const isLeftOfCenter = cardIndex < clampedIndex;
    const isRightOfCenter = cardIndex > clampedIndex;
    const isCenter = cardIndex === clampedIndex;
    
    if (distToLeft < edgeThreshold && (isCenter || isLeftOfCenter) && cardIndex > 0) {
      setIsScrolling(true);
      setHoverOffset(prev => Math.max(-currentIndex, prev - 1));
      setTimeout(() => setIsScrolling(false), 600);
    } else if (distToRight < edgeThreshold && (isCenter || isRightOfCenter) && cardIndex < total - 1) {
      setIsScrolling(true);
      setHoverOffset(prev => Math.min(total - 1 - currentIndex, prev + 1));
      setTimeout(() => setIsScrolling(false), 600);
    }
  };

  if (total <= 1 || currentIndex === -1) return null;

  const effectiveIndex = currentIndex + hoverOffset;
  const clampedIndex = Math.max(0, Math.min(total - 1, Math.round(effectiveIndex)));

  const getVisibleCards = () => {
    const cards: { item: ProgressItem; index: number; offset: number }[] = [];
    const maxVisible = Math.min(total, 7);
    const half = Math.floor(maxVisible / 2);
    
    let start = Math.max(0, clampedIndex - half);
    let end = Math.min(total - 1, clampedIndex + half);
    
    if (end - start < maxVisible - 1) {
      if (start === 0) {
        end = Math.min(total - 1, start + maxVisible - 1);
      } else {
        start = Math.max(0, end - maxVisible + 1);
      }
    }

    for (let i = start; i <= end; i++) {
      cards.push({
        item: items[i],
        index: i,
        offset: i - clampedIndex,
      });
    }
    return cards;
  };

  const visibleCards = getVisibleCards();

  return (
    <div className={`my-6 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        ref={containerRef}
        className="relative flex items-center justify-center h-28 overflow-hidden" 
        style={{ perspective: '1200px' }}
      >
        {visibleCards.map((card) => {
          const isCurrent = card.index === currentIndex;
          const offset = card.offset;
          const absOffset = Math.abs(offset);
          const direction = offset < 0 ? -1 : offset > 0 ? 1 : 0;

          const translateX = offset * 90;
          const translateZ = -absOffset * 60;
          const rotateY = direction * Math.min(absOffset * 10, 30);
          const scale = 1 - absOffset * 0.12;
          const opacity = 1 - absOffset * 0.2;
          const zIndex = 10 - absOffset;
          const delay = absOffset * 50;

          return (
            <Link
              key={card.item.slug}
              href={`${basePath}/${card.item.slug}`}
              className="no-underline absolute"
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity: mounted ? opacity : 0,
                zIndex,
                transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
              }}
            >
              <div 
                className={`
                  relative w-32 h-20 rounded-xl overflow-hidden cursor-pointer
                  transition-all duration-300 group
                  ${isCurrent 
                    ? 'bg-[#ea580c]' 
                    : 'bg-white dark:bg-neutral-700 hover:scale-105'
                  }
                `}
                onMouseMove={(e) => handleCardMouseMove(e, card.index)}
              >
                {isCurrent && (
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                      backgroundSize: '16px 16px'
                    }} />
                  </div>
                )}

                <div className="relative h-full flex flex-col items-center justify-center p-2 text-center">
                  <span className={`
                    text-[10px] font-semibold mb-1
                    ${isCurrent 
                      ? 'text-white/80' 
                      : 'text-neutral-400 dark:text-neutral-500 group-hover:text-[#ea580c]'
                    }
                  `}>
                    {card.index + 1}
                  </span>

                  <span className={`
                    text-[9px] font-medium line-clamp-3 leading-tight
                    ${isCurrent 
                      ? 'text-white' 
                      : 'text-neutral-600 dark:text-neutral-300 group-hover:text-[#ea580c]'
                    }
                  `}>
                    {card.item.title}
                  </span>

                  {isCurrent && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2">
                      <div className="w-1 h-1 rounded-full bg-white/80 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className={`
                  absolute inset-0 rounded-xl border pointer-events-none
                  ${isCurrent 
                    ? 'border-white/30' 
                    : 'border-neutral-200/30 dark:border-neutral-600/30'
                  }
                `} />
              </div>
            </Link>
          );
        })}

      </div>

      <div className="flex items-center justify-center gap-3 mt-2">
        {clampedIndex > 0 && (
          <Link href={`${basePath}/${items[clampedIndex - 1].slug}`} className="no-underline text-[9px] text-neutral-400 dark:text-neutral-500 hover:text-[#ea580c] transition-colors">
            ← {items[clampedIndex - 1].title}
          </Link>
        )}
        <span className="text-[9px] text-neutral-300 dark:text-neutral-600">|</span>
        {clampedIndex < total - 1 && (
          <Link href={`${basePath}/${items[clampedIndex + 1].slug}`} className="no-underline text-[9px] text-neutral-400 dark:text-neutral-500 hover:text-[#ea580c] transition-colors">
            {items[clampedIndex + 1].title} →
          </Link>
        )}
      </div>
    </div>
  );
}
