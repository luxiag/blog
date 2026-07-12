'use client';

import dynamic from 'next/dynamic';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const MarkdownEditorCanvas = dynamic(() => import('./MarkdownEditorCanvas'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 animate-pulse">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-neutral-400 border-t-orange-600 rounded-full animate-spin" />
                <div className="font-mono text-xs tracking-widest uppercase text-neutral-400">
                    Loading Markdown Editor...
                </div>
            </div>
        </div>
    )
});

export default function MarkdownEditorPage() {
    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-neutral-950 font-sans text-[oklch(0.145_0_0)] dark:text-neutral-100 selection:bg-orange-500/20">
            <PageTitle title="MD 编辑器" />

            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative">
                    <div className="relative z-10">
                        <Link
                            href="/tools"
                            className="inline-flex items-center text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#ea580c] mb-6 group"
                        >
                            <ChevronLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                            BACK_TO_LIBRARY
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4">
                            MARKDOWN<span className="text-[#ea580c]">/</span>IDE
                        </h1>
                        <div className="flex items-center gap-3 text-sm font-mono opacity-60">
                            <span className="w-2 h-2 rounded-full bg-orange-600" />
                            REALTIME_SYMBOLS_RENDERING_ENGINE_v1.0
                        </div>
                    </div>
                </div>

                <MarkdownEditorCanvas />
            </div>
        </div>
    );
}
