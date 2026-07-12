'use client';

import dynamic from 'next/dynamic';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';

const ImageEditorCanvas = dynamic(() => import('./ImageEditorCanvas'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 animate-pulse">
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
        <>
            <PageTitle title="图片编辑器" />
            <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
                <div className="max-w-7xl mx-auto px-4" style={{ padding: '48px 24px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <Link
                            href="/tools"
                            className="inline-flex items-center transition-colors"
                            style={{ color: 'var(--color-orange-800)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}
                        >
                            <svg
                                style={{ width: '16px', height: '16px', marginRight: '8px' }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
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
                        图片编辑器
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-neutral-500)',
                        marginBottom: '32px'
                    }}>
                        简单、强大的在线图片编辑工具。
                    </p>

                    <ImageEditorCanvas />
                </div>
            </div>

            <style jsx global>{`
                .canvas-container {
                    margin: 0 auto;
                }
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 10px;
                }
            `}</style>
        </>
    );
}
