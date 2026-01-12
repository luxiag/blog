
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
      // 创建一个安全的执行环境
      const sandbox = {
        React,
        useState,
        useRef,
        useEffect,
        logger,
        // 添加其他需要的全局对象
        document: {
          createElement: document.createElement.bind(document),
          getElementById: (id: string) => containerRef.current?.querySelector(`#${id}`) || null,
          querySelector: (selector: string) => containerRef.current?.querySelector(selector) || null,
          querySelectorAll: (selector: string) => containerRef.current?.querySelectorAll(selector) || [],
        },
        // 其他安全的 DOM API
      };

      // 创建一个函数来执行脚本
      const executeScript = new Function(
        ...Object.keys(sandbox),
        `
        const { useState, useRef, useEffect, logger, document } = arguments;
        ${script}
        `
      );

      // 执行脚本
      executeScript(...Object.values(sandbox));
    } catch (err) {
      logger.error('执行交互式组件脚本出错:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    }
  }, [script]);

  if (error) {
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: 'var(--radius-lg)',
        color: '#c33',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.875rem'
      }}>
        <strong>组件执行错误:</strong> {error}
      </div>
    );
  }

  return (
    <div className="interactive-component" style={{
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem',
      margin: '1.5rem 0',
      backgroundColor: 'var(--color-neutral-50)'
    }}>
      <div style={{
        backgroundColor: 'var(--color-neutral-100)',
        padding: '0.5rem 1rem',
        margin: '-1rem -1rem 1rem -1rem',
        borderBottom: '1px solid var(--border-color)',
        borderTopLeftRadius: 'var(--radius-lg)',
        borderTopRightRadius: 'var(--radius-lg)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: 'var(--foreground)'
      }}>
        交互式组件
      </div>
      <div 
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
