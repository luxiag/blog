"use client";

import React, { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import bash from 'highlight.js/lib/languages/bash';
import sql from 'highlight.js/lib/languages/sql';
import java from 'highlight.js/lib/languages/java';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import diff from 'highlight.js/lib/languages/diff';
import markdown from 'highlight.js/lib/languages/markdown';
import plaintext from 'highlight.js/lib/languages/plaintext';

const MermaidExcalidraw = dynamic(
  () => import('./MermaidDiagram').then((mod) => mod.MermaidDiagram),
  {
    ssr: false,
    loading: () => <p>Loading Diagram Engine...</p>
  }
);
const MAX_CODE_LINES = 15;

const lowlight = createLowlight({
  javascript, typescript, python, css, scss, xml, json, yaml,
  bash, sql, java, go, rust, cpp, csharp, php, ruby, swift, kotlin,
  diff, markdown, plaintext,
  js: javascript, ts: typescript, py: python, rb: ruby, kt: kotlin,
  'c++': cpp, 'c#': csharp, sh: bash, shell: bash, yml: yaml,
});

const LANGUAGE_ALIASES: Record<string, string> = {
  redis: 'bash',
  shell: 'bash',
  sh: 'bash',
  cs: 'csharp',
  yml: 'yaml',
  plain: 'plaintext',
  text: 'plaintext',
  mdx: 'javascript',
  jsx: 'javascript',
  tsx: 'typescript',
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

function nodeToHtml(node: any): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') {
    const cls = node.properties?.className?.join(' ') || '';
    const children = node.children.map((child: any) => nodeToHtml(child)).join('');
    return `<span class="${cls}">${children}</span>`;
  }
  return '';
}

function highlightCode(language: string, code: string): string {
  if (language === 'mermaid' || language === 'plaintext' || !code) return code;
  try {
    const result = lowlight.highlight(language, code);
    return result.children.map((node: any) => nodeToHtml(node)).join('');
  } catch {
    return code;
  }
}

export default function CodeBlock({ className, codeContent }: {
  className?: string;
  codeContent?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMermaidPreview, setShowMermaidPreview] = useState(true);

  const codeString = codeContent || '';
  const lines = codeString.split('\n');
  const showGradient = lines.length > MAX_CODE_LINES && !isExpanded;

  const displayLines = isExpanded ? lines : lines.slice(0, MAX_CODE_LINES);
  const displayContent = displayLines.join('\n');

  const language = resolveLanguage(className);
  const isMermaid = language === 'mermaid';

  const highlightedCode = useMemo(() => highlightCode(language, displayContent), [language, displayContent]);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const toggleMermaidView = useCallback(() => {
    setShowMermaidPreview(prev => !prev);
  }, []);

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
          <div className={`overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 ${!isExpanded ? 'max-h-[400px]' : ''}`}>
            <pre
              className="p-4 overflow-x-auto font-mono text-sm leading-6 text-neutral-800 dark:text-neutral-200 m-0"
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
