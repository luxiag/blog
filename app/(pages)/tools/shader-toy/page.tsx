'use client';

import dynamic from 'next/dynamic';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const ShaderEditor = dynamic(
  () => import('./ShaderEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 border border-[oklch(0.145_0_0)] rounded-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neutral-400 border-t-[oklch(0.145_0_0)] rounded-full animate-spin" />
          <div className="font-mono text-xs tracking-widest uppercase text-neutral-400" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-neutral-500)' }}>
            Loading Shader Editor...
          </div>
        </div>
      </div>
    )
  }
);

export default function ShaderToyPage() {
  return (
    <>
      <PageTitle title="GLSL Shader" />
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-neutral-950 font-sans text-[oklch(0.145_0_0)] dark:text-neutral-100">
        <div className="max-w-[1600px] mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 relative">
            <div className="relative z-10">
              <Link
                href="/tools"
                className="inline-flex items-center text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#ea580c] mb-6 group"
              >
                <ChevronLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back_To_Library
              </Link>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4">
                GLSL<span className="text-[#ea580c]">/</span>SHADER
              </h1>
              <div className="flex items-center gap-3 text-sm font-mono opacity-60">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                WebGL_Realtime_Rendering_Engine
              </div>
            </div>
          </div>

          <div style={{ height: 'calc(100vh - 260px)' }}>
            <ShaderEditor />
          </div>
        </div>
      </div>
    </>
  );
}
