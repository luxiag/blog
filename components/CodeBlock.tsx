"use client";

import React, { useState, useCallback, useEffect } from 'react';
// import {MermaidExcalidraw} from './MermaidToExcalidraw';
import dynamic from 'next/dynamic';
import { createLowlight, all } from 'lowlight';

const MermaidExcalidraw = dynamic(
  () => import('./MermaidToExcalidraw').then((mod) => mod.MermaidExcalidraw),
  { 
    ssr: false,
    loading: () => <p>Loading Diagram Engine...</p> 
  }
);
const MAX_CODE_LINES = 15;

// 创建 lowlight 实例，包含所有语言
const lowlight = createLowlight(all);

const LANGUAGE_ALIASES: Record<string, string> = {
  redis: 'bash',
  shell: 'bash',
  sh: 'bash',
  cs: 'csharp',
  yml: 'yaml',
  plain: 'plaintext',
  text: 'plaintext',
};

function resolveLanguage(className?: string) {
  const match = /language-(\w+)/.exec(className || '');
  const rawLanguage = match ? match[1].toLowerCase() : 'plaintext';

  if (rawLanguage === 'mermaid') {
    return 'mermaid';
  }

  const normalizedLanguage = LANGUAGE_ALIASES[rawLanguage] || rawLanguage;

  return lowlight.registered(normalizedLanguage) ? normalizedLanguage : 'plaintext';
}

export default function CodeBlock({ children, className, codeContent: propCodeContent, ...props }: {
  children?: React.ReactNode;
  className?: string;
  codeContent?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState('');
  const [showMermaidPreview, setShowMermaidPreview] = useState(true);

  const codeChild = children as React.ReactElement<{ children?: React.ReactNode }>;
  // 优先使用 propCodeContent，其次从 children 中提取
  const codeContent = propCodeContent || codeChild?.props?.children || '';
  const codeString = typeof codeContent === 'string' ? codeContent : '';
  const lines = codeString.split('\n');
  const showGradient = lines.length > MAX_CODE_LINES && !isExpanded;

  const displayLines = isExpanded ? lines : lines.slice(0, MAX_CODE_LINES);
  const displayContent = displayLines.join('\n');

  // 代码高亮处理
  useEffect(() => {
    if (!displayContent) {
      setHighlightedCode(displayContent);
      return;
    }

    try {
      // 提取语言
      const language = resolveLanguage(className);
      const isMermaid = language === 'mermaid';

      if (isMermaid) {
        setHighlightedCode(displayContent);
        return;
      }

      // 使用 lowlight 进行代码高亮
      const result = lowlight.highlight(language, displayContent);

      // 递归转换节点为 HTML
      const nodeToHtml = (node: any): string => {
        if (node.type === 'text') {
          return node.value;
        }
        if (node.type === 'element') {
          const className = node.properties?.className?.join(' ') || '';
          const children = node.children.map((child: any) => nodeToHtml(child)).join('');
          return `<span class="${className}">${children}</span>`;
        }
        return '';
      };

      // 将 lowlight 的结果转换为 HTML
      const html = result.children.map((node: any) => nodeToHtml(node)).join('');

      setHighlightedCode(html);
    } catch (error) {
      console.error('Error highlighting code:', error);
      setHighlightedCode(displayContent);
    }
  }, [displayContent, className]);

  // console.log(displayContent,'displayContent')
  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const toggleMermaidView = useCallback(() => {
    setShowMermaidPreview(prev => !prev);
  }, []);

  // 检查是否为 Mermaid 代码
  const language = resolveLanguage(className);
  const isMermaid = language === 'mermaid';

  return (
    <div className="relative my-4">
      {isMermaid ? (
        <>
          {showMermaidPreview ? (
            <div className="relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
              <button
                onClick={toggleMermaidView}
                className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors z-10"
              >
                查看代码
              </button>
              <MermaidExcalidraw code={codeString} />
            </div>
          ) : (
            <div className={`relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 ${!isExpanded ? 'max-h-[400px]' : ''}`}>
              <button
                onClick={toggleMermaidView}
                className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors z-10"
              >
                查看预览
              </button>
              <pre
                className="p-4 overflow-x-auto font-mono text-sm leading-6 text-neutral-800 dark:text-neutral-200 m-0"
                {...props}
              >
                <code
                  className={className}
                  dangerouslySetInnerHTML={{ __html: highlightedCode || displayContent }}
                />
              </pre>
              {showGradient && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none" />
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className={`overflow-hidden rounded-lg  border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 ${!isExpanded ? 'max-h-[400px]' : ''}`}>
            <pre
              className="p-4 overflow-x-auto font-mono text-sm leading-6 text-neutral-800 dark:text-neutral-200 m-0"
              {...props}
            >
              <code
                className={className}
                dangerouslySetInnerHTML={{ __html: highlightedCode || displayContent }}
              />
            </pre>
            {showGradient && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none" />
            )}
          </div>
          {lines.length > MAX_CODE_LINES && (
            <button
              onClick={toggleExpand}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-mono rounded-full shadow-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer z-10"
            >
              {isExpanded ? '收起代码' : `展开全部 (${lines.length} 行)`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
