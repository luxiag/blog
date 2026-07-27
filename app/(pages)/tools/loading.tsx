'use client';

export default function ToolsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-neutral-200 border-t-orange-600 rounded-full animate-spin" />
        <div className="text-sm font-mono text-neutral-400 tracking-widest uppercase">
          Loading...
        </div>
      </div>
    </div>
  );
}
