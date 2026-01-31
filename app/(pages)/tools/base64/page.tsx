'use client';

import { useState } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';

export default function Base64Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // 处理 UTF-8 编码的 Base64
  const utf8ToBase64 = (str: string) => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  };

  const base64ToUtf8 = (str: string) => {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  };

  const handleEncode = () => {
    setError('');
    try {
      setOutput(utf8ToBase64(input));
    } catch (err) {
      setError('编码失败: ' + (err as Error).message);
    }
  };

  const handleDecode = () => {
    setError('');
    try {
      setOutput(base64ToUtf8(input));
    } catch (err) {
      setError('解码失败: 不是有效的 Base64 字符串');
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
      <PageTitle title="Base64 转换" />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4" style={{ padding: '48px 24px' }}>
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
            Base64 转换
          </h1>
          <p style={{
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-neutral-500)',
            marginBottom: '32px'
          }}>
            Base64 编码解码工具，支持 UTF-8 字符
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
                placeholder='在此输入需要转换的内容...'
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

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                Base64 编码
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
                Base64 解码
              </button>
              {error && <span style={{ color: '#ef4444', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>{error}</span>}
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
