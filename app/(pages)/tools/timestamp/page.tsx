'use client';

import { useState, useEffect, useCallback } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';

export default function TimestampPage() {
  const [now, setNow] = useState(Date.now());
  const [tsInput, setTsInput] = useState('');
  const [dateOutput, setDateOutput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [tsOutput, setTsOutput] = useState('');
  const [unit, setUnit] = useState<'ms' | 's'>('s');

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTsToDate = useCallback(() => {
    if (!tsInput) return;
    try {
      const ts = parseInt(tsInput);
      const date = new Date(unit === 's' ? ts * 1000 : ts);
      if (isNaN(date.getTime())) {
        setDateOutput('无效的时间戳');
      } else {
        setDateOutput(date.toLocaleString('zh-CN', { hour12: false }));
      }
    } catch (err) {
      setDateOutput('转换错误');
    }
  }, [tsInput, unit]);

  const handleDateToTs = useCallback(() => {
    if (!dateInput) return;
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        setTsOutput('无效的日期格式');
      } else {
        const ts = unit === 's' ? Math.floor(date.getTime() / 1000) : date.getTime();
        setTsOutput(ts.toString());
      }
    } catch (err) {
      setTsOutput('转换错误');
    }
  }, [dateInput, unit]);

  return (
    <>
      <PageTitle title="时间戳转换" />
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

          <h1 className="text-2xl md:text-3xl" style={{
            fontWeight: 700,
            marginBottom: '8px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--foreground)'
          }}>
            时间戳转换
          </h1>
          <p style={{
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-neutral-500)',
            marginBottom: '32px'
          }}>
            Unix 时间戳与北京时间（GMT+8）相互转换
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
          }}>
            <span className="text-sm font-semibold">当前时间戳:</span>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <span className="text-lg sm:text-xl font-bold font-mono" style={{ color: 'var(--color-orange-800)' }}>
                {unit === 's' ? Math.floor(now / 1000) : now}
              </span>
              <div style={{ display: 'flex', background: 'var(--color-neutral-100)', padding: '2px', borderRadius: '4px' }}>
                <button
                  onClick={() => setUnit('s')}
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    borderRadius: '2px',
                    border: 'none',
                    cursor: 'pointer',
                    background: unit === 's' ? 'white' : 'transparent',
                    boxShadow: unit === 's' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                    fontWeight: unit === 's' ? 600 : 400
                  }}
                >
                  秒 (s)
                </button>
                <button
                  onClick={() => setUnit('ms')}
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    borderRadius: '2px',
                    border: 'none',
                    cursor: 'pointer',
                    background: unit === 'ms' ? 'white' : 'transparent',
                    boxShadow: unit === 'ms' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                    fontWeight: unit === 'ms' ? 600 : 400
                  }}
                >
                  毫秒 (ms)
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 时间戳转日期 */}
            <div className="p-4 sm:p-6" style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={tsInput}
                  onChange={(e) => setTsInput(e.target.value)}
                  placeholder="输入时间戳..."
                  className="flex-1"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleTsToDate}
                  className="whitespace-nowrap"
                  style={{
                    padding: '10px 24px',
                    background: 'var(--foreground)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  转换为日期
                </button>
                <input
                  type="text"
                  readOnly
                  value={dateOutput}
                  placeholder="结果将在此显示..."
                  className="flex-1"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--color-neutral-100)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* 日期转时间戳 */}
            <div className="p-4 sm:p-6" style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  placeholder="输入日期 (例如: 2025-01-01 12:00:00)"
                  className="flex-1"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleDateToTs}
                  className="whitespace-nowrap"
                  style={{
                    padding: '10px 24px',
                    background: 'var(--foreground)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  转换为时间戳
                </button>
                <input
                  type="text"
                  readOnly
                  value={tsOutput}
                  placeholder="结果将在此显示..."
                  className="flex-1"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--color-neutral-100)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
