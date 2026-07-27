"use client";

import React from 'react';

type DiffLineType = 'add' | 'remove' | 'context';

interface DiffLine {
  type: DiffLineType;
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
}

interface DiffCompareProps {
  language?: string;
  title?: string;
  diff: DiffLine[];
}

export default function DiffCompare({ language, title, diff }: DiffCompareProps) {
  const maxOldLine = Math.max(...diff.filter(d => d.oldLineNum !== undefined).map(d => d.oldLineNum!)) || 0;
  const maxNewLine = Math.max(...diff.filter(d => d.newLineNum !== undefined).map(d => d.newLineNum!)) || 0;
  const oldWidth = String(maxOldLine).length;
  const newWidth = String(maxNewLine).length;

  return (
    <div className="my-6 rounded-xl border border-neutral-200/80 dark:border-neutral-700/60 overflow-hidden bg-white dark:bg-neutral-900/50">
      {(title || language) && (
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-neutral-200/60 dark:border-neutral-700/40 bg-neutral-50/80 dark:bg-neutral-800/40">
          {title && <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">{title}</span>}
          {language && <span className="text-[0.6875rem] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{language}</span>}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-[0.8125rem] font-mono border-collapse">
          <tbody>
            {diff.map((line, i) => {
              const bgClass =
                line.type === 'add'
                  ? 'bg-green-50 dark:bg-green-900/15'
                  : line.type === 'remove'
                  ? 'bg-red-50 dark:bg-red-900/15'
                  : '';
              const prefix =
                line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' ';
              const prefixColor =
                line.type === 'add'
                  ? 'text-green-600 dark:text-green-400'
                  : line.type === 'remove'
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-neutral-300 dark:text-neutral-600';
              const contentColor =
                line.type === 'remove'
                  ? 'text-red-700/60 dark:text-red-300/60'
                  : '';

              return (
                <tr key={i} className={`${bgClass} hover:bg-neutral-50 dark:hover:bg-neutral-800/30`}>
                  <td className="px-2 py-0 text-right text-neutral-300 dark:text-neutral-600 select-none w-[1%] whitespace-nowrap" style={{ minWidth: `${oldWidth + 2}ch` }}>
                    {line.oldLineNum ?? ''}
                  </td>
                  <td className="px-2 py-0 text-right text-neutral-300 dark:text-neutral-600 select-none w-[1%] whitespace-nowrap" style={{ minWidth: `${newWidth + 2}ch` }}>
                    {line.newLineNum ?? ''}
                  </td>
                  <td className={`px-1 py-0 select-none ${prefixColor}`}>
                    {prefix}
                  </td>
                  <td className={`px-4 py-0.5 whitespace-pre ${contentColor}`}>
                    {line.content}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
