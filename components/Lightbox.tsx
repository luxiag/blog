"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play, Pause } from 'lucide-react';

export interface MediaItem {
  src: string;
  alt?: string;
  type: 'image' | 'video';
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: MediaItem[];
  initialIndex: number;
}

export default function Lightbox({ isOpen, onClose, items, initialIndex }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useCallback((node: HTMLVideoElement | null) => {
    if (node && isPlaying) {
      node.play();
    } else if (node && !isPlaying) {
      node.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setIsPlaying(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
        case '=':
          setZoom(z => Math.min(z + 0.25, 3));
          break;
        case '-':
          setZoom(z => Math.max(z - 0.25, 0.5));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setZoom(1);
    setIsPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    setZoom(1);
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
      >
        <X size={24} />
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div className="flex items-center gap-2 absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        <span>{currentIndex + 1} / {items.length}</span>
      </div>

      <div className="flex items-center gap-2 absolute bottom-4 right-4">
        <button
          onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
          className="p-2 text-white/80 hover:text-white transition-colors"
          disabled={zoom <= 0.5}
        >
          <ZoomOut size={20} />
        </button>
        <span className="text-white/60 text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(z => Math.min(z + 0.25, 3))}
          className="p-2 text-white/80 hover:text-white transition-colors"
          disabled={zoom >= 3}
        >
          <ZoomIn size={20} />
        </button>
        {currentItem.type === 'video' && (
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 text-white/80 hover:text-white transition-colors ml-2"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        )}
      </div>

      <div
        className="max-w-[90vw] max-h-[85vh] flex items-center justify-center overflow-hidden"
        style={{ transform: `scale(${zoom})` }}
      >
        {currentItem.type === 'image' ? (
          <div className="relative">
            <img
              src={currentItem.src}
              alt={currentItem.alt || ''}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            src={currentItem.src}
            className="max-w-full max-h-[85vh] w-auto h-auto"
            controls={!isPlaying}
            loop
            muted
            playsInline
          />
        )}
      </div>

      {currentItem.alt && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/80 text-sm max-w-[80%] text-center">
          {currentItem.alt}
        </div>
      )}
    </div>
  );
}

export function useLightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [initialIndex, setInitialIndex] = useState(0);

  const openLightbox = (newItems: MediaItem[], index: number = 0) => {
    setItems(newItems);
    setInitialIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setItems([]);
    setInitialIndex(0);
  };

  return { isOpen, items, initialIndex, openLightbox, closeLightbox };
}
