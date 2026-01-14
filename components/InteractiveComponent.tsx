"use client";

import React, { useState, useRef, useEffect } from 'react';
import { clientLogger as logger } from '@/lib/clientLogger';

interface InteractiveComponentProps {
  html: string;
  script?: string;
}

export default function InteractiveComponent({ html, script }: InteractiveComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!containerRef.current || !script) return;

    try {
      const sandbox = {
        React,
        useState,
        useRef,
        useEffect,
        logger,
        document: {
          createElement: document.createElement.bind(document),
          getElementById: (id: string) => containerRef.current?.querySelector(`#${id}`) || null,
          querySelector: (selector: string) => containerRef.current?.querySelector(selector) || null,
          querySelectorAll: (selector: string) => containerRef.current?.querySelectorAll(selector) || [],
        },
      };

      const executeScript = new Function(
        ...Object.keys(sandbox),
        `
        const { useState, useRef, useEffect, logger, document } = arguments;
        ${script}
        `
      );

      executeScript(...Object.values(sandbox));
    } catch (err) {
      logger.error('执行交互式组件脚本出错:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    }
  }, [script]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 font-mono text-sm">
        <strong>组件执行错误:</strong> {error}
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 my-6 bg-neutral-50 dark:bg-neutral-800/50">
      <div className="px-4 py-2 -m-4 mb-4 border-b border-neutral-200 dark:border-neutral-700 rounded-t-lg font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800">
        交互式组件
      </div>
      <div 
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
