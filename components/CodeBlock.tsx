"use client";

import React, { useState, useMemo, useCallback } from 'react';
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
  html: 'xml',
  svg: 'xml',
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
  const [showMermaidPreview, setShowMermaidPreview] = useState(true);

  const codeString = codeContent || '';
  const language = resolveLanguage(className);
  const isMermaid = language === 'mermaid';

  const highlightedCode = useMemo(() => highlightCode(language, codeString), [language, codeString]);

  const toggleMermaidView = useCallback(() => {
    setShowMermaidPreview(prev => !prev);
  }, []);

  return (
    <div className="my-4 rounded-md not-prose" data-geist-code-block="">
      {isMermaid ? (
        <>
          {showMermaidPreview ? (
            <div className="relative overflow-hidden rounded-md border border-gray-200 dark:border-gray-200 bg-background">
              <button
                onClick={toggleMermaidView}
                className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium bg-gray-1000 dark:bg-gray-1000 text-background rounded-md hover:opacity-90 transition-colors z-10"
              >
                查看代码
              </button>
              <MermaidExcalidraw code={codeString} />
            </div>
          ) : (
            <div className="relative rounded-md border border-gray-200 dark:border-gray-200 bg-background overflow-y-auto max-h-[400px]">
              <button
                onClick={toggleMermaidView}
                className="sticky top-3 float-right mr-3 mb-2 px-3 py-1.5 text-xs font-medium bg-gray-1000 dark:bg-gray-1000 text-background rounded-md hover:opacity-90 transition-colors z-10"
              >
                查看预览
              </button>
              <pre className="p-5 overflow-x-auto m-0">
                <code
                  className={className}
                  dangerouslySetInnerHTML={{ __html: highlightedCode || codeString }}
                />
              </pre>
            </div>
          )}
        </>
      ) : (
          <div className="border border-gray-200 dark:border-gray-200 bg-background rounded-md overflow-y-auto max-h-[400px]">
            <pre className="p-5 overflow-x-auto m-0">
              <code
                className={className}
                dangerouslySetInnerHTML={{ __html: highlightedCode || codeString }}
              />
            </pre>
          </div>
      )}
    </div>
  );
}
