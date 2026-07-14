'use client';

import { useState } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setError('');
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
    } catch (err) {
      setError('无效的 JSON 格式: ' + (err as Error).message);
    }
  };

  const handleMinify = () => {
    setError('');
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (err) {
      setError('无效的 JSON 格式: ' + (err as Error).message);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <>
      <PageTitle title="JSON 格式化" />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-12">
          <div style={{ marginBottom: '32px' }}>
            <Link
              href="/tools"
              className="inline-flex items-center transition-colors"
              style={{ color: 'var(--color-orange-800)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              BACK_TO_LIBRARY
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl" style={{
            fontWeight: 700,
            marginBottom: '8px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--foreground)'
          }}>
            JSON 格式化
          </h1>
          <p style={{
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-neutral-500)',
            marginBottom: '32px'
          }}>
            格式化、验证、压缩 JSON 数据
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', opacity: 0.6 }}>输入 (Raw JSON)</label>
                <button
                  onClick={handleClear}
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-neutral-500)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  清空
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='在此粘贴 JSON 代码...'
                className="w-full"
                style={{
                  height: '300px',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'white',
                  color: 'var(--foreground)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', opacity: 0.6 }}>输出 (Result)</label>
                <button
                  onClick={handleCopy}
                  style={{
                    fontSize: '12px',
                    color: copied ? 'var(--color-orange-800)' : 'var(--color-neutral-500)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: copied ? 600 : 400
                  }}
                >
                  {copied ? '已复制!' : '复制到剪贴板'}
                </button>
              </div>
              <textarea
                value={output}
                readOnly
                placeholder='结果将在此显示...'
                className="w-full"
                style={{
                  height: '300px',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--color-neutral-100)',
                  color: 'var(--foreground)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={handleFormat}
              className="px-6 py-2.5 rounded-md font-semibold text-sm transition-colors"
              style={{
                background: 'var(--foreground)',
                color: 'white',
                border: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            >
              格式化
            </button>
            <button
              onClick={handleMinify}
              className="px-6 py-2.5 rounded-md font-semibold text-sm transition-colors"
              style={{
                background: 'white',
                color: 'var(--foreground)',
                border: '1px solid var(--border-color)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              压缩
            </button>

            {error && (
              <span className="text-sm font-mono" style={{
                color: '#ef4444',
              }}>
                ⚠️ {error}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
