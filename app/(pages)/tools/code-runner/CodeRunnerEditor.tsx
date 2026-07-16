'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Editor from 'react-simple-code-editor';
import { Highlight, Prism } from 'prism-react-renderer';
import {
    Play, Square, Copy, Check, Trash2, Clock,
    Plus, X, Share2, History, Download, Settings2,
    PanelLeftOpen, PanelLeftClose, Terminal, Code2
} from 'lucide-react';

const lightTheme = {
    plain: { color: 'oklch(0.32 0 0)', backgroundColor: 'transparent' },
    styles: [
        { types: ['comment'], style: { color: '#9ca3af', fontStyle: 'italic' } },
        { types: ['keyword'], style: { color: '#ea580c' } },
        { types: ['operator'], style: { color: '#4b5563' } },
        { types: ['string', 'url', 'attr-value'], style: { color: '#ea580c' } },
        { types: ['function'], style: { color: '#7c3aed' } },
        { types: ['number', 'boolean', 'literal'], style: { color: '#2563eb' } },
        { types: ['variable', 'property'], style: { color: '#4b5563' } },
        { types: ['punctuation'], style: { color: '#9ca3af' } },
        { types: ['class-name', 'type'], style: { color: '#7c3aed' } },
        { types: ['built-in'], style: { color: '#2563eb' } },
        { types: ['preprocessor', 'meta'], style: { color: '#6b7280' } },
    ],
};

type Language = 'javascript' | 'typescript' | 'python';

const LANGUAGE_MAP: Record<Language, string> = {
    javascript: 'javascript', typescript: 'typescript', python: 'python',
};

const LANGUAGE_LABELS: Record<Language, string> = {
    javascript: 'JavaScript', typescript: 'TypeScript', python: 'Python',
};

const LANGUAGE_EXT: Record<Language, string> = {
    javascript: 'js', typescript: 'ts', python: 'py',
};

const LANG_DOT_COLOR: Record<Language, string> = {
    javascript: '#ea580c', typescript: '#2563eb', python: '#4b5563',
};

declare global {
    interface Window {
        loadPyodide?: (config: { indexURL: string }) => Promise<{
            runPythonAsync: (code: string) => Promise<string>;
            destroy: () => void;
        }>;
    }
}

let pyodidePromise: Promise<{ runPythonAsync: (code: string) => Promise<string>; destroy: () => void }> | null = null;

function loadPyodide() {
    if (pyodidePromise) return pyodidePromise;
    pyodidePromise = new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-pyodide="true"]');
        if (existing && window.loadPyodide) {
            window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/' }).then(resolve).catch(reject);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
        script.async = true;
        script.dataset.pyodide = 'true';
        script.onload = () => {
            if (!window.loadPyodide) { reject(new Error('Pyodide loaded but loadPyodide not found')); return; }
            window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/' }).then(resolve).catch(reject);
        };
        script.onerror = () => reject(new Error('Failed to load Pyodide'));
        document.head.appendChild(script);
    });
    return pyodidePromise;
}

interface Tab { id: string; name: string; language: Language; code: string; }
interface OutputEntry { type: 'output' | 'error' | 'info'; content: string; }
interface HistoryEntry { code: string; language: Language; timestamp: number; output: string; }

const EXECUTION_TIMEOUT = 5000;
const genId = () => Math.random().toString(36).substring(2, 8);
const fmtTime = (ms: number) => ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;

function renderTable(data: unknown): string | null {
    if (!Array.isArray(data) || !data.length || typeof data[0] !== 'object' || !data[0]) return null;
    const keys = Object.keys(data[0]);
    const ws = keys.map(k => Math.max(k.length, ...data.map((r: any) => String(r[k] ?? '').length)));
    const h = keys.map((k, i) => k.padEnd(ws[i])).join(' │ ');
    const s = ws.map(w => '─'.repeat(w)).join('─┼─');
    const rows = data.map(r => keys.map((k, i) => String((r as any)[k] ?? '').padEnd(ws[i])).join(' │ '));
    return [h, s, ...rows].join('\n');
}

interface Props { snippets: Record<string, Record<string, string>>; }

export default function CodeRunnerEditor({ snippets }: Props) {
    const [tabs, setTabs] = useState<Tab[]>([
        { id: genId(), name: 'main.js', language: 'javascript', code: snippets.javascript?.hello || "console.log('Hello, World!');" }
    ]);
    const [activeTabId, setActiveTabId] = useState(tabs[0].id);
    const [outputs, setOutputs] = useState<OutputEntry[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isPyodideLoading, setIsPyodideLoading] = useState(false);
    const [elapsedTime, setElapsedTime] = useState<number | null>(null);
    const [fontSize, setFontSize] = useState(13);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
    const [splitRatio, setSplitRatio] = useState(0.55);
    const [showOutput, setShowOutput] = useState(true);
    const [showSidebar, setShowSidebar] = useState(true);

    const outputRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const abortRef = useRef(false);

    const activeTab = useMemo(() => tabs.find(t => t.id === activeTabId) || tabs[0], [tabs, activeTabId]);

    useEffect(() => { if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight; }, [outputs]);
    useEffect(() => { try { const s = localStorage.getItem('cr-hist'); if (s) setHistory(JSON.parse(s)); } catch {} }, []);
    useEffect(() => { if (history.length) localStorage.setItem('cr-hist', JSON.stringify(history.slice(0, 50))); }, [history]);

    const addOutput = useCallback((type: OutputEntry['type'], content: string) => {
        setOutputs(prev => [...prev, { type, content }]);
    }, []);

    const runJS = useCallback((source: string, timeout: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            const logs: string[] = [];
            const tid = setTimeout(() => reject(new Error(`Timeout after ${timeout / 1000}s`)), timeout);
            try {
                const sbox: Record<string, unknown> = {
                    console: {
                        log: (...a: unknown[]) => logs.push(a.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(' ')),
                        error: (...a: unknown[]) => logs.push('✗ ' + a.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(' ')),
                        warn: (...a: unknown[]) => logs.push('⚠ ' + a.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(' ')),
                        info: (...a: unknown[]) => logs.push('ℹ ' + a.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(' ')),
                        table: (...a: unknown[]) => { const t = renderTable(a[0]); logs.push(t || a.map(v => JSON.stringify(v, null, 2)).join('\n')); },
                        time: (l: string) => logs.push(`⏱ ${l}: start`),
                        timeEnd: (l: string) => logs.push(`⏱ ${l}: end`),
                        clear: () => { logs.length = 0; },
                        assert: (c: boolean, ...a: unknown[]) => { if (!c) logs.push('Assertion failed: ' + a.map(String).join(' ')); },
                    },
                    setTimeout, setInterval, clearTimeout, clearInterval,
                    Math, JSON, Date, Array, Object, String, Number, Boolean, RegExp, Error, Map, Set, Promise, Symbol,
                    parseInt, parseFloat, isNaN, isFinite,
                    encodeURIComponent, decodeURIComponent, encodeURI, decodeURI, atob, btoa, URL, URLSearchParams,
                };
                const fn = new Function(...Object.keys(sbox), source);
                const res = fn(...Object.values(sbox));
                clearTimeout(tid);
                if (res instanceof Promise) { res.then(() => resolve(logs.join('\n'))).catch((e: Error) => { clearTimeout(tid); reject(e); }); }
                else resolve(logs.join('\n'));
            } catch (e) { clearTimeout(tid); reject(e); }
        });
    }, []);

    const runCode = useCallback(async () => {
        setIsRunning(true); setElapsedTime(null); abortRef.current = false;
        const t0 = performance.now();
        addOutput('info', `▸ Running ${LANGUAGE_LABELS[activeTab.language]}...`);
        setShowOutput(true);
        try {
            let result = '';
            if (activeTab.language === 'python') {
                setIsPyodideLoading(true);
                const py = await loadPyodide();
                if (abortRef.current) { setIsRunning(false); setIsPyodideLoading(false); return; }
                setIsPyodideLoading(false);
                await py.runPythonAsync('import sys, io\nsys.stdout = io.StringIO()\nsys.stderr = io.StringIO()');
                await py.runPythonAsync(activeTab.code);
                const stdout = await py.runPythonAsync('sys.stdout.getvalue()');
                const stderr = await py.runPythonAsync('sys.stderr.getvalue()');
                result = [stdout, stderr].filter(Boolean).join('\n');
            } else {
                result = await runJS(activeTab.code, EXECUTION_TIMEOUT);
            }
            const ms = performance.now() - t0; setElapsedTime(ms);
            if (result) addOutput('output', result);
            addOutput('info', `▸ Completed in ${fmtTime(ms)}`);
            setHistory(p => [{ code: activeTab.code, language: activeTab.language, timestamp: Date.now(), output: result || '(no output)' }, ...p].slice(0, 50));
        } catch (e: unknown) {
            const ms = performance.now() - t0; setElapsedTime(ms);
            addOutput('error', e instanceof Error ? e.message : String(e));
            addOutput('info', `▸ Failed in ${fmtTime(ms)}`);
        } finally { setIsRunning(false); setIsPyodideLoading(false); }
    }, [activeTab, runJS, addOutput]);

    const stopExec = useCallback(() => { abortRef.current = true; setIsRunning(false); setIsPyodideLoading(false); addOutput('info', '▸ Stopped'); }, [addOutput]);
    const clearOut = useCallback(() => { setOutputs([]); setElapsedTime(null); }, []);
    const updateCode = useCallback((id: string, code: string) => setTabs(p => p.map(t => t.id === id ? { ...t, code } : t)), []);
    const updateLang = useCallback((id: string, language: Language) => {
        setTabs(p => p.map(t => t.id !== id ? t : { ...t, language, name: `main.${LANGUAGE_EXT[language]}`, code: Object.values(snippets[language] || {})[0] || '' }));
    }, [snippets]);
    const addTab = useCallback(() => { const t: Tab = { id: genId(), name: 'untitled.js', language: 'javascript', code: '' }; setTabs(p => [...p, t]); setActiveTabId(t.id); }, []);
    const removeTab = useCallback((id: string) => { setTabs(p => { if (p.length <= 1) return p; const f = p.filter(t => t.id !== id); if (activeTabId === id) setActiveTabId(f[0].id); return f; }); }, [activeTabId]);
    const selectSnippet = useCallback((key: string) => { const s = snippets[activeTab.language]?.[key]; if (s) { updateCode(activeTab.id, s); setOutputs([]); } }, [activeTab, snippets, updateCode]);
    const copyClip = useCallback(async (text: string, id: string) => { await navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }, []);
    const shareCode = useCallback(() => { const d = btoa(encodeURIComponent(JSON.stringify({ code: activeTab.code, language: activeTab.language }))); navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#code=${d}`); addOutput('info', '▸ Share link copied'); }, [activeTab, addOutput]);
    const downloadCode = useCallback(() => { const b = new Blob([activeTab.code], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = `code.${LANGUAGE_EXT[activeTab.language]}`; a.click(); URL.revokeObjectURL(u); }, [activeTab]);
    const loadHist = useCallback((e: HistoryEntry) => { updateCode(activeTab.id, e.code); updateLang(activeTab.id, e.language); setShowHistory(false); }, [activeTab, updateCode, updateLang]);
    const clearHist = useCallback(() => { setHistory([]); localStorage.removeItem('cr-hist'); }, []);

    useEffect(() => {
        const h = window.location.hash;
        if (h.startsWith('#code=')) { try { const d = JSON.parse(decodeURIComponent(atob(h.slice(6)))); if (d.code && d.language) { updateCode(activeTab.id, d.code); updateLang(activeTab.id, d.language); window.location.hash = ''; } } catch {} }
    }, []);

    useEffect(() => {
        const kd = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); if (!isRunning) runCode(); } if ((e.ctrlKey || e.metaKey) && e.key === 's') e.preventDefault(); };
        window.addEventListener('keydown', kd); return () => window.removeEventListener('keydown', kd);
    }, [runCode, isRunning]);

    useEffect(() => {
        const mm = (e: MouseEvent) => {
            if (!draggingRef.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const r = Math.max(0.2, Math.min(0.8, (e.clientY - rect.top) / rect.height));
            setSplitRatio(r);
        };
        const mu = () => { draggingRef.current = false; };
        window.addEventListener('mousemove', mm); window.addEventListener('mouseup', mu);
        return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
    }, []);

    const curSnippets = snippets[activeTab.language] || {};
    const lineCount = activeTab.code.split('\n').length;
    const gutterWidth = Math.max(3, String(lineCount).length) * 8 + 24;

    return (
        <div ref={containerRef} className="h-full flex flex-col bg-white">
            {/* Tab bar */}
            <div className="flex items-center bg-[var(--background)] border-b border-[var(--border-color)] select-none shrink-0">
                <div className="flex items-center px-1">
                    <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 text-[var(--foreground)] opacity-20 hover:opacity-50 transition-opacity" title="Toggle snippets">
                        {showSidebar ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
                    </button>
                </div>
                <div className="flex flex-1 overflow-auto">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTabId(tab.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-[12px] font-mono cursor-pointer border-r border-[var(--border-color)] transition-colors shrink-0 ${
                                activeTabId === tab.id
                                    ? 'bg-white text-[var(--foreground)] border-t-[2px] border-t-[#ea580c] border-b-[2px] border-b-white -mb-[2px]'
                                    : 'bg-[var(--background)] text-[var(--foreground)] opacity-30 hover:opacity-60 border-t-[2px] border-t-transparent'
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full" style={{ background: LANG_DOT_COLOR[tab.language] }} />
                            {tab.name}
                            {tabs.length > 1 && (
                                <button onClick={(e) => { e.stopPropagation(); removeTab(tab.id); }} className="ml-1 opacity-20 hover:opacity-60 transition-opacity">
                                    <X size={10} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button onClick={addTab} className="px-2 py-1.5 opacity-20 hover:opacity-50 transition-opacity" title="New tab">
                        <Plus size={14} />
                    </button>
                </div>
                <div className="flex items-center gap-0.5 px-2">
                    {(['javascript', 'typescript', 'python'] as Language[]).map(lang => (
                        <button
                            key={lang}
                            onClick={() => updateLang(activeTab.id, lang)}
                            className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors ${
                                activeTab.language === lang
                                    ? 'bg-[var(--foreground)] text-white'
                                    : 'text-[var(--foreground)] opacity-30 hover:opacity-50 hover:bg-black/5'
                            }`}
                        >
                            {lang === 'javascript' ? 'JS' : lang === 'typescript' ? 'TS' : 'PY'}
                        </button>
                    ))}
                    <div className="w-px h-3 bg-[var(--border-color)] mx-1" />
                    <div className="relative">
                        <button onClick={() => setShowFontSizeMenu(!showFontSizeMenu)} className="p-1.5 text-[var(--foreground)] opacity-20 hover:opacity-50 transition-opacity" title="Font size">
                            <Settings2 size={13} />
                        </button>
                        {showFontSizeMenu && (
                            <div className="absolute top-full right-0 mt-1 bg-white border border-[var(--border-color)] rounded-md shadow-[var(--shadow-tooltip)] z-50 py-1 min-w-[80px]">
                                {[11, 12, 13, 14, 15, 16, 18].map(s => (
                                    <button key={s} onClick={() => { setFontSize(s); setShowFontSizeMenu(false); }}
                                        className={`w-full px-3 py-1 text-left text-[12px] font-mono transition-colors ${
                                            fontSize === s ? 'bg-[#ea580c] text-white' : 'text-[var(--foreground)] opacity-50 hover:bg-black/5'
                                        }`}>
                                        {s}px
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => copyClip(activeTab.code, 'code')} className="p-1.5 text-[var(--foreground)] opacity-20 hover:opacity-50 transition-opacity" title="Copy code">
                        {copiedId === 'code' ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                    <button onClick={downloadCode} className="p-1.5 text-[var(--foreground)] opacity-20 hover:opacity-50 transition-opacity" title="Download">
                        <Download size={13} />
                    </button>
                    <button onClick={shareCode} className="p-1.5 text-[var(--foreground)] opacity-20 hover:opacity-50 transition-opacity" title="Share">
                        <Share2 size={13} />
                    </button>
                    <button onClick={() => { activeTab.code.split('\n').map(l => l.trimEnd()).join('\n').replace(/\n{3,}/g, '\n\n'); }} className="p-1.5 text-[var(--foreground)] opacity-20 hover:opacity-50 transition-opacity" title="Format">
                        <Code2 size={13} />
                    </button>
                    <div className="w-px h-3 bg-[var(--border-color)] mx-1" />
                    <button onClick={isRunning ? stopExec : runCode}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono font-bold transition-colors ${
                            isRunning
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-[#ea580c] hover:bg-[#d94f04] text-white'
                        }`}>
                        {isRunning ? <><Square size={10} />{isPyodideLoading ? 'Loading...' : 'Stop'}</> : <><Play size={10} />Run</>}
                    </button>
                </div>
            </div>

            {/* Main area */}
            <div className="flex-1 flex min-h-0">
                {/* Snippet sidebar */}
                {showSidebar && (
                    <div className="w-48 shrink-0 bg-[var(--background)] border-r border-[var(--border-color)] flex flex-col">
                        <div className="px-3 py-2 text-[10px] font-mono font-bold text-[var(--foreground)] opacity-20 uppercase tracking-wider border-b border-[var(--border-color)]">
                            Snippets
                        </div>
                        <div className="flex-1 overflow-y-auto py-1">
                            {Object.entries(curSnippets).map(([key]) => (
                                <button key={key} onClick={() => selectSnippet(key)}
                                    className="w-full px-3 py-1.5 text-left text-[11px] font-mono text-[var(--foreground)] opacity-30 hover:opacity-70 hover:bg-black/5 transition-colors truncate">
                                    {key}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Editor + Output split */}
                <div className="flex-1 flex flex-col min-h-0 min-w-0">
                    {/* Editor area */}
                    <div style={{ height: `${showOutput ? splitRatio * 100 : 100}%` }} className="min-h-0 flex">
                        <div className="shrink-0 bg-white text-right select-none overflow-hidden" style={{ width: gutterWidth, fontSize, lineHeight: '1.6', fontFamily: 'var(--font-mono)' }}>
                            <div className="pt-4">
                                {Array.from({ length: lineCount }, (_, i) => (
                                    <div key={i} className="text-[var(--foreground)] opacity-15 pr-3">{i + 1}</div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto min-w-0 bg-white">
                            <Editor
                                value={activeTab.code}
                                onValueChange={(c) => updateCode(activeTab.id, c)}
                                highlight={(src) => (
                                    <Highlight theme={lightTheme as any} code={src} language={LANGUAGE_MAP[activeTab.language]}>
                                        {({ tokens, getLineProps, getTokenProps }) => (
                                            <>{tokens.map((line, i) => (
                                                <div key={i} {...getLineProps({ line })}>
                                                    {line.map((tok, k) => <span key={k} {...getTokenProps({ token: tok })} />)}
                                                </div>
                                            ))}</>
                                        )}
                                    </Highlight>
                                )}
                                padding={16}
                                style={{ fontFamily: 'var(--font-mono)', fontSize, lineHeight: 1.6, backgroundColor: 'transparent', minHeight: '100%', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Drag handle */}
                    {showOutput && (
                        <div
                            onMouseDown={() => { draggingRef.current = true; }}
                            className="h-[3px] bg-[var(--border-color)] hover:bg-[#ea580c] cursor-row-resize shrink-0 transition-colors"
                        />
                    )}

                    {/* Output panel */}
                    {showOutput && (
                        <div style={{ height: `${(1 - splitRatio) * 100}%` }} className="min-h-0 flex flex-col bg-[var(--background)]">
                            <div className="flex items-center justify-between px-3 py-1 bg-[var(--background)] border-y border-[var(--border-color)] shrink-0">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setShowOutput(false)} className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--foreground)] opacity-30 hover:opacity-60 transition-opacity">
                                        <Terminal size={12} />
                                        OUTPUT
                                    </button>
                                    {outputs.length > 0 && (
                                        <span className="text-[10px] font-mono text-[var(--foreground)] opacity-15 bg-black/5 px-1.5 py-0.5 rounded">
                                            {outputs.length}
                                        </span>
                                    )}
                                    {elapsedTime !== null && (
                                        <span className="flex items-center gap-1 text-[10px] font-mono text-[#ea580c]">
                                            <Clock size={10} />
                                            {fmtTime(elapsedTime)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    {outputs.length > 0 && (
                                        <>
                                            <button onClick={() => { const t = outputs.filter(o => o.type !== 'info').map(o => o.content).join('\n'); copyClip(t, 'out'); }}
                                                className="p-1 text-[var(--foreground)] opacity-15 hover:opacity-40 transition-opacity" title="Copy output">
                                                {copiedId === 'out' ? <Check size={11} /> : <Copy size={11} />}
                                            </button>
                                            <button onClick={clearOut} className="p-1 text-[var(--foreground)] opacity-15 hover:opacity-40 transition-opacity" title="Clear">
                                                <Trash2 size={11} />
                                            </button>
                                        </>
                                    )}
                                    <button onClick={() => setShowHistory(!showHistory)} className={`p-1 transition-opacity ${showHistory ? 'opacity-50' : 'opacity-15 hover:opacity-40'}`} title="History">
                                        <History size={11} />
                                    </button>
                                </div>
                            </div>

                            {showHistory && history.length > 0 && (
                                <div className="border-b border-[var(--border-color)] max-h-[140px] overflow-y-auto bg-[var(--background)] shrink-0">
                                    <div className="flex justify-end px-2 py-0.5 border-b border-[var(--border-color)]">
                                        <button onClick={clearHist} className="text-[10px] font-mono text-red-500 opacity-50 hover:opacity-100 bg-transparent border-none cursor-pointer">Clear All</button>
                                    </div>
                                    {history.map((e, i) => (
                                        <div key={i} onClick={() => loadHist(e)}
                                            className="flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-black/5 transition-colors border-b border-[var(--border-color)]">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: LANG_DOT_COLOR[e.language] }} />
                                                <span className="text-[11px] font-mono text-[var(--foreground)] opacity-30 truncate">{e.code.split('\n')[0]}</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-[var(--foreground)] opacity-15 shrink-0 ml-2">{new Date(e.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div ref={outputRef} className="flex-1 overflow-y-auto min-h-0">
                                <pre className="p-3 m-0 font-mono text-[12px] leading-[1.6] whitespace-pre-wrap">
                                    {outputs.length === 0 ? (
                                        <span className="text-[var(--foreground)] opacity-15 italic">Press ⌘+Enter or click Run to execute...</span>
                                    ) : outputs.map((e, i) => (
                                        <div key={i} className={
                                            e.type === 'error' ? 'text-red-600' :
                                            e.type === 'info' ? 'text-[var(--foreground)] opacity-20 italic' :
                                            'text-[var(--foreground)] opacity-70'
                                        }>{e.content}</div>
                                    ))}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Collapsed output button */}
                    {!showOutput && (
                        <button onClick={() => setShowOutput(true)}
                            className="flex items-center gap-1.5 px-3 py-1 bg-[var(--background)] border-t border-[var(--border-color)] text-[11px] font-mono text-[var(--foreground)] opacity-25 hover:opacity-50 transition-opacity shrink-0">
                            <Terminal size={12} />
                            OUTPUT
                            {elapsedTime !== null && <span className="text-[#ea580c] ml-1">{fmtTime(elapsedTime)}</span>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
