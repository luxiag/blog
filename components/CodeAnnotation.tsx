"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import sql from 'highlight.js/lib/languages/sql';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';

const lowlight = createLowlight({
  javascript, typescript, python, css, json, bash, sql,
  go, rust, java, cpp, csharp,
  js: javascript, ts: typescript, py: python, sh: bash,
  'c++': cpp, 'c#': csharp,
});

const ALIASES: Record<string, string> = {
  shell: 'bash', cs: 'csharp', yml: 'json', plain: 'plaintext', text: 'plaintext',
  mdx: 'javascript', jsx: 'javascript', tsx: 'typescript',
};

function resolveLang(lang?: string): string {
  const raw = (lang || 'plaintext').toLowerCase();
  const norm = ALIASES[raw] || raw;
  return lowlight.registered(norm) ? norm : 'plaintext';
}

interface AnnotatedLine {
  code: string;
  note?: string;
  __html?: string;
}

interface CodeAnnotationProps {
  language?: string;
  lines: AnnotatedLine[];
}

export default function CodeAnnotation({ language, lines }: CodeAnnotationProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const resolvedLang = useMemo(() => resolveLang(language), [language]);

  const annotatedLines = useMemo(() => {
    const fullCode = lines.map(l => l.code).join('\n');
    if (resolvedLang === 'plaintext') {
      return lines.map(l => ({ ...l, __html: escapeHtml(l.code) }));
    }
    try {
      const result = lowlight.highlight(resolvedLang, fullCode);
      const htmlLines = nodeToLineArray(result.children).split('\n');
      return lines.map((l, i) => ({ ...l, __html: htmlLines[i] || escapeHtml(l.code) }));
    } catch {
      return lines.map(l => ({ ...l, __html: escapeHtml(l.code) }));
    }
  }, [lines, resolvedLang]);

  return (
    <div className="my-6 rounded-xl border border-neutral-200/80 dark:border-neutral-700/60 overflow-hidden bg-white dark:bg-neutral-900/50">
      {language && (
        <div className="px-4 py-1.5 border-b border-neutral-200/60 dark:border-neutral-700/40 bg-neutral-50/80 dark:bg-neutral-800/40 text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          {language}
        </div>
      )}
      <div className="relative flex">
        <div className="flex-1 overflow-x-auto">
          <pre className="!m-0 !rounded-none !border-0 !p-0">
            <code className={`language-${language || 'text'} block !p-4 !bg-transparent`}>
              {annotatedLines.map((line, i) => (
                <div
                  key={i}
                  className={`group/line relative px-3 py-0.5 leading-relaxed transition-colors ${
                    line.note ? 'cursor-default' : ''
                  } ${hoveredIndex === i && line.note ? 'bg-[#ea580c]/8 dark:bg-[#ea580c]/12' : ''}`}
                  onMouseEnter={() => line.note && setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className="font-mono text-[0.875rem]" dangerouslySetInnerHTML={{ __html: line.__html || '&nbsp;' }} />
                  {line.note && hoveredIndex === i && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#ea580c]/60" />
                  )}
                </div>
              ))}
            </code>
          </pre>
        </div>
        {hoveredIndex !== null && lines[hoveredIndex]?.note && (
          <div className="absolute right-0 top-0 h-full w-[260px] border-l border-neutral-200/60 dark:border-neutral-700/40 bg-neutral-50/90 dark:bg-neutral-800/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#ea580c]/10 dark:bg-[#ea580c]/20 flex items-center justify-center">
                <span className="text-[#ea580c] text-[0.625rem] font-mono font-bold">{hoveredIndex + 1}</span>
              </span>
              <p className="text-[0.8125rem] leading-relaxed text-neutral-600 dark:text-neutral-400 font-sans">
                {lines[hoveredIndex].note}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function nodeToLineArray(children: any[]): string {
  const parts: string[] = [];
  for (const node of children) {
    if (node.type === 'text') {
      parts.push(node.value);
    } else if (node.type === 'element') {
      const cls = node.properties?.className?.join(' ') || '';
      const inner = nodeToLineArray(node.children);
      if (cls) {
        parts.push(`<span class="${cls}">${inner}</span>`);
      } else {
        parts.push(inner);
      }
    }
  }
  return parts.join('');
}
