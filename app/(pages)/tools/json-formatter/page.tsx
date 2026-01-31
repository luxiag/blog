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
        <div className="max-w-6xl mx-auto px-4" style={{ padding: '48px 24px' }}>
          <div style={{ marginBottom: '32px' }}>
            <Link
              href="/tools"
              className="inline-flex items-center transition-colors"
              style={{ color: 'var(--color-orange-800)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回工具箱
            </Link>
          </div>

          <h1 style={{
            fontSize: '32px',
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
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
                style={{
                  width: '100%',
                  height: '450px',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'white',
                  color: 'var(--foreground)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'none'
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
                style={{
                  width: '100%',
                  height: '450px',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--color-neutral-100)',
                  color: 'var(--foreground)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleFormat}
              style={{
                background: 'var(--foreground)',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              格式化 (Beautify)
            </button>
            <button
              onClick={handleMinify}
              style={{
                background: 'white',
                color: 'var(--foreground)',
                border: '1px solid var(--border-color)',
                padding: '10px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              压缩 (Minify)
            </button>

            {error && (
              <span style={{
                color: '#ef4444',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                marginLeft: '12px'
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
