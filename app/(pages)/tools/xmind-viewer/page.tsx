'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Upload, X, ZoomIn, ZoomOut, Maximize, Download,
  FileText, Layers, RotateCcw,
} from 'lucide-react';

interface SheetInfo {
  title: string;
  data: unknown;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

function sanitizeNodeData(obj: Record<string, unknown>): Record<string, unknown> {
  if (!obj || typeof obj !== 'object') return obj;
  if (obj.children && Array.isArray(obj.children)) {
    obj.children = (obj.children as Record<string, unknown>[]).filter(c => c && typeof c === 'object').map(c => sanitizeNodeData(c));
    if ((obj.children as unknown[]).length === 0) delete obj.children;
  }
  if (!obj.id) obj.id = Math.random().toString(36).substring(2, 11);
  if (obj.topic === undefined || obj.topic === null) obj.topic = '';
  return obj;
}

function sanitizeMindElixirData(data: Record<string, unknown>): Record<string, unknown> {
  if (data.nodeData) sanitizeNodeData(data.nodeData as Record<string, unknown>);
  if (data.arrows && Array.isArray(data.arrows)) {
    data.arrows = (data.arrows as Record<string, unknown>[]).filter(a => a && a.from && a.to);
  }
  return data;
}

export default function XMindViewerPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const meInstanceRef = useRef<unknown>(null);
  const [fileName, setFileName] = useState<string>('');
  const [sheets, setSheets] = useState<SheetInfo[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [scale, setScale] = useState(100);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [nodeCount, setNodeCount] = useState(0);

  useEffect(() => {
    const id = 'mind-elixir-css';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `${BASE_PATH}/styles/mind-elixir.css`;
    document.head.appendChild(link);
  }, []);

  const countNodes = useCallback((obj: Record<string, unknown>): number => {
    let count = 1;
    const children = obj.children as Record<string, unknown>[] | undefined;
    if (children) {
      for (const child of children) {
        count += countNodes(child);
      }
    }
    return count;
  }, []);

  const loadSheet = useCallback((index: number) => {
    if (!meInstanceRef.current || !sheets[index]) return;
    const me = meInstanceRef.current as { refresh: (data: unknown) => void; toCenter: () => void; scaleVal: number };
    me.refresh(sheets[index].data);
    setTimeout(() => me.toCenter(), 100);
    setActiveSheet(index);
    const data = sheets[index].data as { nodeData: Record<string, unknown> };
    if (data?.nodeData) setNodeCount(countNodes(data.nodeData));
  }, [sheets, countNodes]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.xmind')) {
      setError('Please upload a .xmind file');
      return;
    }
    setLoading(true);
    setError('');
    setFileName(file.name);
    try {
      const mod = await import('@mind-elixir/import-xmind');
      const rawSheets = await mod.importXMindFile(file);
      const converted: SheetInfo[] = rawSheets.map((sheet, idx) => ({
        title: sheet.title || `Sheet ${idx + 1}`,
        data: sanitizeMindElixirData(mod.convertXmindToMindElixir(sheet) as Record<string, unknown>),
      }));
      setSheets(converted);
      setActiveSheet(0);
    } catch (e) {
      setError(`Failed to parse: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || sheets.length === 0) return;
    let mounted = true;
    const el = containerRef.current;
    el.innerHTML = '';

    const initMindElixir = async () => {
      const MindElixirCtor = (await import('mind-elixir')).default;
      if (!mounted || !el) return;

      const me = new MindElixirCtor({
        el,
        direction: MindElixirCtor.SIDE,
        editable: false,
        contextMenu: false,
        toolBar: false,
        keypress: false,
        overflowHidden: false,
        scaleSensitivity: 0.1,
        scaleMin: 0.1,
        scaleMax: 4,
        handleWheel: (e: WheelEvent) => {
          e.stopPropagation();
          e.preventDefault();
          const me = meInstanceRef.current as { scaleVal: number; scale: (v: number, offset?: { x: number; y: number }) => void; move: (dx: number, dy: number) => void; scaleSensitivity: number; container: HTMLElement } | null;
          if (!me) return;
          if (e.shiftKey) { me.move(-e.deltaY, 0); return; }
          const viewportHeight = me.container.clientHeight || window.innerHeight;
          const deltaMode = e.deltaMode;
          let delta = deltaMode === WheelEvent.DOM_DELTA_LINE ? e.deltaY * 40 : deltaMode === WheelEvent.DOM_DELTA_PAGE ? e.deltaY * viewportHeight : e.deltaY;
          const scaleDelta = delta * me.scaleSensitivity * -0.01;
          if (scaleDelta !== 0) {
            me.scale(me.scaleVal + scaleDelta, { x: e.clientX, y: e.clientY });
            setScale(Math.round(me.scaleVal * 100));
          }
        },
        theme: {
          name: 'minimal-light',
          type: 'light' as const,
          palette: ['#ea580c', '#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#4f46e5'],
          cssVar: {
            '--node-gap-x': '24px',
            '--node-gap-y': '12px',
            '--main-gap-x': '40px',
            '--main-gap-y': '20px',
            '--main-color': '#000',
            '--main-bgcolor': '#f5f5f5',
            '--main-bgcolor-transparent': 'rgba(245,245,245,0.8)',
            '--color': '#171717',
            '--bgcolor': '#ffffff',
            '--selected': '#ea580c',
            '--accent-color': '#ea580c',
            '--root-color': '#fff',
            '--root-bgcolor': '#ea580c',
            '--root-border-color': '#ea580c',
            '--root-radius': '8px',
            '--main-radius': '6px',
            '--topic-padding': '8px 16px',
            '--panel-color': '#171717',
            '--panel-bgcolor': '#fff',
            '--panel-border-color': '#e5e5e5',
            '--map-padding': '40px',
          },
        },
      });

      me.init(sheets[0].data as Parameters<typeof me.init>[0]);
      meInstanceRef.current = me;

      const data = sheets[0].data as { nodeData: Record<string, unknown> };
      if (data?.nodeData) setNodeCount(countNodes(data.nodeData));
    };

    initMindElixir();
    return () => {
      mounted = false;
      const me = meInstanceRef.current as { destroy: () => void } | null;
      if (me) { me.destroy(); meInstanceRef.current = null; }
    };
  }, [sheets, countNodes]);

  const handleZoomIn = () => {
    const me = meInstanceRef.current as { scaleVal: number; scale: (v: number) => void } | null;
    if (!me) return;
    const newScale = Math.min(me.scaleVal + 0.1, 4);
    me.scale(newScale);
    setScale(Math.round(newScale * 100));
  };

  const handleZoomOut = () => {
    const me = meInstanceRef.current as { scaleVal: number; scale: (v: number) => void } | null;
    if (!me) return;
    const newScale = Math.max(me.scaleVal - 0.1, 0.1);
    me.scale(newScale);
    setScale(Math.round(newScale * 100));
  };

  const handleFit = () => {
    const me = meInstanceRef.current as { scaleFit: () => void; scaleVal: number } | null;
    if (!me) return;
    me.scaleFit();
    setTimeout(() => setScale(Math.round(me.scaleVal * 100)), 100);
  };

  const handleCenter = () => {
    const me = meInstanceRef.current as { toCenter: () => void } | null;
    if (me) me.toCenter();
  };

  const handleExportPng = async () => {
    const me = meInstanceRef.current as { exportPng: () => Promise<Blob | null> } | null;
    if (!me) return;
    const blob = await me.exportPng();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.replace('.xmind', '') || 'mindmap'}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExportSvg = () => {
    const me = meInstanceRef.current as { exportSvg: (noForeignObject?: boolean, injectCss?: string) => Blob } | null;
    if (!me) return;
    const blob = me.exportSvg();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace('.xmind', '') || 'mindmap'}-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => { setDragOver(false); }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleClear = () => {
    const me = meInstanceRef.current as { destroy: () => void } | null;
    if (me) me.destroy();
    meInstanceRef.current = null;
    if (containerRef.current) containerRef.current.innerHTML = '';
    setSheets([]);
    setActiveSheet(0);
    setFileName('');
    setError('');
    setScale(100);
    setNodeCount(0);
  };

  const hasFile = sheets.length > 0;

  return (
    <div className="h-[calc(100vh-45px)] flex flex-col bg-white overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--background)] border-b border-[var(--border-color)] shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/tools" className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--foreground)] opacity-40 hover:opacity-70 transition-opacity uppercase tracking-wider">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7-7 7 7 7" /></svg>
            Tools
          </Link>
          <div className="w-px h-3 bg-[var(--border-color)]" />
          <span className="text-[12px] font-mono text-[var(--foreground)] opacity-50">XMind Viewer</span>
          {fileName && (
            <>
              <div className="w-px h-3 bg-[var(--border-color)]" />
              <span className="text-[11px] font-mono text-[var(--foreground)] opacity-30 truncate max-w-[200px]">{fileName}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {hasFile && (
            <>
              <span className="text-[10px] font-mono text-[var(--foreground)] opacity-25">{scale}%</span>
              <span className="text-[10px] font-mono text-[var(--foreground)] opacity-30">{nodeCount} nodes</span>
              <div className="w-px h-3 bg-[var(--border-color)]" />
              <button onClick={handleZoomOut} className="p-1 text-[var(--foreground)] opacity-30 hover:opacity-70 transition-opacity" title="Zoom Out">
                <ZoomOut size={14} />
              </button>
              <button onClick={handleZoomIn} className="p-1 text-[var(--foreground)] opacity-30 hover:opacity-70 transition-opacity" title="Zoom In">
                <ZoomIn size={14} />
              </button>
              <button onClick={handleFit} className="p-1 text-[var(--foreground)] opacity-30 hover:opacity-70 transition-opacity" title="Fit to View">
                <Maximize size={14} />
              </button>
              <button onClick={handleCenter} className="p-1 text-[var(--foreground)] opacity-30 hover:opacity-70 transition-opacity" title="Center">
                <RotateCcw size={14} />
              </button>
              <div className="w-px h-3 bg-[var(--border-color)]" />
              <button onClick={handleExportSvg} className="p-1 text-[var(--foreground)] opacity-30 hover:opacity-70 transition-opacity" title="Export SVG">
                <FileText size={14} />
              </button>
              <button onClick={handleExportPng} className="p-1 text-[var(--foreground)] opacity-30 hover:opacity-70 transition-opacity" title="Export PNG">
                <Download size={14} />
              </button>
              <div className="w-px h-3 bg-[var(--border-color)]" />
              <button onClick={handleClear} className="p-1 text-[var(--foreground)] opacity-30 hover:opacity-70 transition-opacity" title="Clear">
                <X size={14} />
              </button>
            </>
          )}
          <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
        </div>
      </div>

      {/* Sheet tabs */}
      {sheets.length > 1 && (
        <div className="flex items-center gap-0 px-4 bg-[var(--background)] border-b border-[var(--border-color)] shrink-0">
          {sheets.map((sheet, i) => (
            <button
              key={i}
              onClick={() => loadSheet(i)}
              className={`px-3 py-1.5 text-[11px] font-mono transition-colors border-b-2 ${
                i === activeSheet
                  ? 'text-[var(--foreground)] border-[#ea580c]'
                  : 'text-[var(--foreground)] opacity-30 border-transparent hover:opacity-60'
              }`}
            >
              <Layers size={10} className="inline mr-1 opacity-50" />
              {sheet.title}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {!hasFile ? (
        <div
          className={`flex-1 flex items-center justify-center transition-colors ${
            dragOver ? 'bg-orange-50/60' : ''
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className={`flex flex-col items-center gap-6 transition-transform ${dragOver ? 'scale-105' : ''}`}>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors ${
              dragOver ? 'bg-[#ea580c]/10' : 'bg-[var(--foreground)]/[0.03]'
            }`}>
              <Upload size={32} className={dragOver ? 'text-[#ea580c]' : 'text-[var(--foreground)] opacity-30'} />
            </div>
            <div className="text-center">
              <p className="text-sm font-mono text-[var(--foreground)] opacity-50 mb-2">
                Drop .xmind file here
              </p>
              <p className="text-[11px] font-mono text-[var(--foreground)] opacity-25 mb-4">
                Supports XMind 8 (XML) and XMind 2020+ (JSON)
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider bg-[var(--foreground)] text-white rounded cursor-pointer hover:opacity-80 transition-opacity">
                <Upload size={12} />
                Choose File
                <input type="file" accept=".xmind" onChange={handleInputChange} className="hidden" />
              </label>
            </div>
            {error && (
              <p className="text-[11px] font-mono text-red-500">{error}</p>
            )}
          </div>
        </div>
      ) : loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[var(--foreground)] border-t-transparent rounded-full animate-spin" />
            <p className="text-[11px] font-mono text-[var(--foreground)] opacity-40">Parsing...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden relative" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
          <div ref={containerRef} className="w-full h-full" id="mind-elixir-container" />
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <p className="text-[11px] font-mono text-red-500">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
