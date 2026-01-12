
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
      // 创建一个安全的沙箱环境
      const sandbox = {
        console: {
          log: (...args: any[]) => {
            setOutput((prev) => prev + args.join(' ') + '\n');
          },
          error: (...args: any[]) => {
            setOutput((prev) => prev + 'ERROR: ' + args.join(' ') + '\n');
          },
          warn: (...args: any[]) => {
            setOutput((prev) => prev + 'WARNING: ' + args.join(' ') + '\n');
          },
        },
        // 可以添加更多安全的全局对象
      };

      // 使用Function构造函数创建一个隔离的作用域
      const func = new Function(...Object.keys(sandbox), code);
      func(...Object.values(sandbox));
    } catch (err: any) {
      setError(err.message || '执行代码时出错');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="code-runner" style={{ marginBottom: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      <div style={{ backgroundColor: 'var(--color-neutral-100)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: '600' }}>
          {language === 'javascript' ? 'JavaScript' : language} 代码
        </span>
        <button
          onClick={runCode}
          disabled={isRunning}
          style={{
            backgroundColor: isRunning ? 'var(--color-neutral-300)' : 'var(--color-orange-800)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '0.25rem 0.75rem',
            fontSize: '0.875rem',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-mono)',
            fontWeight: '500'
          }}
        >
          {isRunning ? '运行中...' : '运行代码'}
        </button>
      </div>
      <pre style={{
        backgroundColor: 'white',
        padding: '1rem',
        margin: 0,
        overflowX: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.875rem',
        lineHeight: '1.5'
      }}>
        <code>{code}</code>
      </pre>
      {(output || error) && (
        <div style={{ backgroundColor: 'var(--color-neutral-50)', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ backgroundColor: 'var(--color-neutral-100)', padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: '600' }}>
              输出结果
            </span>
          </div>
          <pre style={{
            padding: '1rem',
            margin: 0,
            color: error ? 'var(--color-red-600)' : 'var(--foreground)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap',
            overflowX: 'auto'
          }}>
            {error || output}
          </pre>
        </div>
      )}
    </div>
  );
}
