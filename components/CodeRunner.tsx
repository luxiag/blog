"use client";

import React, { useState, useEffect } from 'react';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';

const lowlight = createLowlight({
  javascript, typescript,
  js: javascript, ts: typescript,
});

export default function CodeRunner({ code, language = 'javascript' }: { code: string; language?: string }) {
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string>('');
  const [highlightedCode, setHighlightedCode] = useState('');

  useEffect(() => {
    try {
      const lang = language === 'js' ? 'javascript' : language;
      const registered = lowlight.registered(lang);
      const result = registered
        ? lowlight.highlight(lang, code)
        : lowlight.highlight('javascript', code);

      const nodeToHtml = (node: any): string => {
        if (node.type === 'text') return node.value;
        if (node.type === 'element') {
          const cls = node.properties?.className?.join(' ') || '';
          const children = node.children.map((c: any) => nodeToHtml(c)).join('');
          return cls ? `<span class="${cls}">${children}</span>` : children;
        }
        return '';
      };
      setHighlightedCode(result.children.map((n: any) => nodeToHtml(n)).join(''));
    } catch {
      setHighlightedCode(code);
    }
  }, [code, language]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setError('');

    try {
      const sandbox = {
        console: {
          log: (...args: unknown[]) => {
            setOutput((prev) => prev + args.join(' ') + '\n');
          },
          error: (...args: unknown[]) => {
            setOutput((prev) => prev + 'ERROR: ' + args.join(' ') + '\n');
          },
          warn: (...args: unknown[]) => {
            setOutput((prev) => prev + 'WARNING: ' + args.join(' ') + '\n');
          },
        },
      };

      const func = new Function(...Object.keys(sandbox), code);
      func(...Object.values(sandbox));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '执行代码时出错');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="my-4 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-900">
      <div className="flex justify-between items-center px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700">
        <span className="font-mono text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {language === 'javascript' || language === 'js' ? 'JavaScript' : language}
        </span>
        <button
          onClick={runCode}
          disabled={isRunning}
          className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
            isRunning
              ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
              : 'bg-[#ea580c] text-white hover:bg-[#c2410c]'
          }`}
        >
          {isRunning ? '运行中...' : '运行'}
        </button>
      </div>
      <div className="max-h-[320px] overflow-auto">
        <pre className="p-4 m-0 overflow-x-auto font-mono text-sm leading-6 text-neutral-800 dark:text-neutral-200">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode || code }} />
        </pre>
      </div>
      {(output || error) && (
        <div className="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60">
          <div className="px-4 py-1.5 border-b border-neutral-100 dark:border-neutral-700/50">
            <span className="font-mono text-xs font-medium text-neutral-400 dark:text-neutral-500">
              输出
            </span>
          </div>
          <div className="max-h-[200px] overflow-auto">
            <pre className="p-4 m-0 whitespace-pre-wrap font-mono text-sm leading-6 text-red-600 dark:text-red-400">
              {error || output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
