'use client';

import { useState } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';

export default function UrlEncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      setOutput(encodeURIComponent(input));
    } catch (err) {
      console.error('编码失败:', err);
    }
  };

  const handleDecode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (err) {
      console.error('解码失败:', err);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
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
      <PageTitle title="URL 编码解码" />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-12">
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

          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '8px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--foreground)'
          }}>
            URL 编码解码
          </h1>
          <p style={{
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-neutral-500)',
            marginBottom: '32px'
          }}>
            对 URL 进行编码或解码处理
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', opacity: 0.6 }}>输入</label>
                <button
                  onClick={handleClear}
                  style={{ fontSize: '12px', color: 'var(--color-neutral-500)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  清空
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='在此输入需要编码或解码的内容...'
                style={{
                  width: '100%',
                  height: '150px',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'white',
                  color: 'var(--foreground)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleEncode}
                style={{
                  background: 'var(--foreground)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                URL 编码
              </button>
              <button
                onClick={handleDecode}
                style={{
                  background: 'white',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border-color)',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                URL 解码
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', opacity: 0.6 }}>输出</label>
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
                  height: '150px',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--color-neutral-100)',
                  color: 'var(--foreground)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
