"use client";

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  generatedLanguageMap,
  generatedLowlight as lowlight,
} from '@/lib/generated/lowlight-languages';

const MermaidExcalidraw = dynamic(
  () => import('./MermaidDiagram').then((mod) => mod.MermaidDiagram),
  {
    ssr: false,
    loading: () => <p>Loading Diagram Engine...</p>
  }
);

function resolveLanguage(className?: string) {
  const match = /\blanguage-([^\s]+)/.exec(className || '');
  const rawLanguage = match ? match[1].trim().toLowerCase() : 'plaintext';
  const normalizedLanguage = generatedLanguageMap[rawLanguage] || 'plaintext';

  if (normalizedLanguage === 'mermaid') return 'mermaid';
  return lowlight.registered(normalizedLanguage) ? normalizedLanguage : 'plaintext';
}

type HighlightNode = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: {
    className?: string | string[];
  };
  children?: HighlightNode[];
};

function renderHighlightedNode(node: HighlightNode, key: string): React.ReactNode {
  if (node.type === 'text') return node.value || '';
  if (node.type !== 'element') return null;

  const rawClassName = node.properties?.className;
  const className = Array.isArray(rawClassName) ? rawClassName.join(' ') : rawClassName;
  const children = (node.children || []).map((child, index) =>
    renderHighlightedNode(child, `${key}-${index}`),
  );

  return React.createElement(node.tagName || 'span', { key, className }, children);
}

function highlightCode(language: string, code: string): React.ReactNode {
  // Return source as a React text node on every non-highlighted path. React will
  // escape HTML-like code instead of allowing it to become real DOM.
  if (language === 'mermaid' || language === 'plaintext' || !code) return code;

  try {
    const result = lowlight.highlight(language, code);
    return (result.children as HighlightNode[]).map((node, index) =>
      renderHighlightedNode(node, String(index)),
    );
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
                <code className={className}>{highlightedCode}</code>
              </pre>
            </div>
          )}
        </>
      ) : (
        <div className="border border-gray-200 dark:border-gray-200 bg-background rounded-md overflow-y-auto max-h-[400px]">
          <pre className="p-5 overflow-x-auto m-0">
            <code className={className}>{highlightedCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
