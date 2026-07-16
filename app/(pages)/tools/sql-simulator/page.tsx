'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const SqlSimulator = dynamic(() => import('./components/SqlSimulator'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-[var(--background)]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-[var(--border-color)] border-t-[#ea580c] rounded-full animate-spin" />
                <div className="font-mono text-[11px] tracking-widest uppercase text-[var(--foreground)] opacity-30">
                    Loading SQL Engine...
                </div>
            </div>
        </div>
    ),
});

export default function SqlSimulatorPage() {
    return (
        <div className="h-[calc(100vh-45px)] flex flex-col bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--background)] border-b border-[var(--border-color)] shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/tools" className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--foreground)] opacity-40 hover:opacity-70 transition-opacity uppercase tracking-wider">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7-7 7 7 7" /></svg>
                        Tools
                    </Link>
                    <div className="w-px h-3 bg-[var(--border-color)]" />
                    <span className="text-[12px] font-mono text-[var(--foreground)] opacity-50">SQL Simulator</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-[var(--foreground)] opacity-20 tracking-wider">⌘+ENTER TO RUN</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <SqlSimulator
                    dataset="comprehensive"
                    title="综合数据库"
                    description="包含电商、ERP、医疗三大业务模块，30+数据表，数千条数据。支持复杂 JOIN、聚合分析、子查询等高级 SQL 练习。"
                />
            </div>
        </div>
    );
}
