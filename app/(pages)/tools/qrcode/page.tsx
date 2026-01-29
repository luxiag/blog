'use client';

import PageTitle from '@/components/PageTitle';
import Link from 'next/link';

export default function QrcodePage() {
  return (
    <>
      <PageTitle title="二维码生成" />
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
            二维码生成
          </h1>
          <p style={{
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-neutral-500)',
            marginBottom: '32px'
          }}>
            生成自定义二维码
          </p>

          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '48px',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--color-neutral-500)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
              即将上线...
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
