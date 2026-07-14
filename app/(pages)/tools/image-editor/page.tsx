'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const ImageEditorCanvas = dynamic(() => import('./ImageEditorCanvas'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 animate-pulse">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-neutral-400 border-t-orange-600 rounded-full animate-spin" />
                <div className="font-mono text-xs tracking-widest uppercase text-neutral-400">
                    Loading Image Editor...
                </div>
            </div>
        </div>
    )
});

export default function ImageEditorPage() {
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                padding: '12px 24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexShrink: 0,
            }}>
                <Link
                    href="/tools"
                    className="inline-flex items-center transition-colors"
                    style={{ color: 'var(--color-orange-800)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}
                >
                    <svg
                        style={{ width: '14px', height: '14px', marginRight: '6px' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    TOOLS
                </Link>
                <span style={{ fontSize: '13px', color: 'var(--border-color)' }}>/</span>
                <h1 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--foreground)',
                    margin: 0,
                }}>
                    图片编辑器
                </h1>
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
                <ImageEditorCanvas />
            </div>


        </div>
    );
}
