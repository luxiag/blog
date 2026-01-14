"use client";

import React, { useState } from 'react';

interface CodeRunnerProps {
  code: string;
  language?: string;
}

export default function CodeRunner({ code, language = 'javascript' }: CodeRunnerProps) {
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string>('');

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
    <div className="mb-6 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <span className="font-mono text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          {language === 'javascript' ? 'JavaScript' : language} 代码
        </span>
        <button
          onClick={runCode}
          disabled={isRunning}
          className={`px-3 py-1 text-sm font-mono font-medium rounded transition-colors cursor-pointer ${
            isRunning
              ? 'bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
              : 'bg-orange-600 text-white hover:bg-orange-700'
          }`}
        >
          {isRunning ? '运行中...' : '运行代码'}
        </button>
      </div>
      <pre className="p-4 m-0 overflow-x-auto bg-white dark:bg-neutral-900 font-mono text-sm leading-6 text-neutral-800 dark:text-neutral-200">
        <code>{code}</code>
      </pre>
      {(output || error) && (
        <div className="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600">
            <span className="font-mono text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              输出结果
            </span>
          </div>
          <pre className="p-4 m-0 whitespace-pre-wrap overflow-x-auto font-mono text-sm text-red-600 dark:text-red-400">
            {error || output}
          </pre>
        </div>
      )}
    </div>
  );
}
