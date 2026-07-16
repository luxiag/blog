'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
    Copy, Check, Download, Trash2, Search, ChevronRight,
    ChevronDown, Braces, TreePine, GitCompare, AlertCircle,
    FileJson, Minimize2, Layers
} from 'lucide-react';

type ViewMode = 'formatted' | 'tree' | 'diff';

interface TreeNode {
    key: string;
    value: unknown;
    type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
    children?: TreeNode[];
    path: string;
}

function buildTree(data: unknown, key: string = '$', path: string = '$'): TreeNode {
    if (data === null) return { key, value: null, type: 'null', path };
    if (Array.isArray(data)) {
        return {
            key, value: data, type: 'array', path,
            children: data.map((item, i) => buildTree(item, String(i), `${path}[${i}]`)),
        };
    }
    if (typeof data === 'object') {
        const obj = data as Record<string, unknown>;
        return {
            key, value: data, type: 'object', path,
            children: Object.entries(obj).map(([k, v]) => buildTree(v, k, /^\w+$/.test(k) ? `${path}.${k}` : `${path}["${k}"]`)),
        };
    }
    if (typeof data === 'boolean') return { key, value: data, type: 'boolean', path };
    if (typeof data === 'number') return { key, value: data, type: 'number', path };
    return { key, value: String(data), type: 'string', path };
}

function jsonPathQuery(data: unknown, path: string): unknown {
    try {
        const parts = path.replace(/^\$\.?/, '').split(/\.|\["?(.*?)"?\]/).filter(Boolean);
        let current: unknown = data;
        for (const part of parts) {
            if (current === null || current === undefined) return undefined;
            if (Array.isArray(current)) current = current[parseInt(part)];
            else if (typeof current === 'object') current = (current as Record<string, unknown>)[part];
            else return undefined;
        }
        return current;
    } catch { return undefined; }
}

function TreeNodeItem({ node, depth, expandedPaths, togglePath, queryResult, copied, onCopy }: {
    node: TreeNode; depth: number; expandedPaths: Set<string>; togglePath: (p: string) => void;
    queryResult: string | null; copied: string | null; onCopy: (text: string, id: string) => void;
}) {
    const isExpanded = expandedPaths.has(node.path);
    const isContainer = node.type === 'object' || node.type === 'array';
    const isQueryMatch = queryResult !== null && node.path === queryResult;

    return (
        <div>
            <div
                className={`flex items-center gap-1 py-0.5 px-2 hover:bg-black/[0.03] cursor-pointer group transition-colors ${isQueryMatch ? 'bg-[#ea580c]/10' : ''}`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                onClick={() => isContainer && togglePath(node.path)}
            >
                {isContainer ? (
                    isExpanded ? <ChevronDown size={11} className="text-[var(--foreground)] opacity-30 shrink-0" /> : <ChevronRight size={11} className="text-[var(--foreground)] opacity-30 shrink-0" />
                ) : <span className="w-[11px] shrink-0" />}

                <span className="text-[12px] font-mono text-[#ea580c] shrink-0">{node.key}</span>
                <span className="text-[12px] font-mono text-[var(--foreground)] opacity-20 shrink-0">:</span>

                {isContainer ? (
                    <span className="text-[11px] font-mono text-[var(--foreground)] opacity-30">
                        {node.type === 'object' ? `{${(node.children || []).length}}` : `[${(node.children || []).length}]`}
                    </span>
                ) : (
                    <span className={`text-[12px] font-mono truncate ${
                        node.type === 'string' ? 'text-[#ea580c]' :
                        node.type === 'number' ? 'text-[#2563eb]' :
                        node.type === 'boolean' ? 'text-[#7c3aed]' :
                        'text-[var(--foreground)] opacity-20 italic'
                    }`}>
                        {node.type === 'string' ? `"${node.value}"` : String(node.value)}
                    </span>
                )}

                <button
                    onClick={(e) => { e.stopPropagation(); onCopy(node.path, node.path); }}
                    className="ml-auto opacity-0 group-hover:opacity-30 hover:!opacity-60 p-0.5 transition-opacity shrink-0"
                    title="Copy path">
                    {copied === node.path ? <Check size={10} /> : <Copy size={10} />}
                </button>
            </div>

            {isExpanded && (node.children || []).map((child, i) => (
                <TreeNodeItem key={i} node={child} depth={depth + 1} expandedPaths={expandedPaths}
                    togglePath={togglePath} queryResult={queryResult} copied={copied} onCopy={onCopy} />
            ))}
        </div>
    );
}

const SAMPLE_JSON = `{
  "name": "Blog Project",
  "version": "1.0.0",
  "tools": ["json-formatter", "diff-checker", "markdown-editor", "qrcode"],
  "config": {
    "theme": "light",
    "accent": "#ea580c",
    "fonts": {
      "sans": "Inter",
      "mono": "IBM Plex Mono"
    },
    "features": {
      "darkMode": false,
      "search": true
    }
  },
  "stats": {
    "posts": 220,
    "tools": 17,
    "active": true
  }
}`;

export default function JsonFormatterPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('formatted');
    const [diffInput, setDiffInput] = useState('');
    const [diffError, setDiffError] = useState('');
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['$']));
    const [jsonPath, setJsonPath] = useState('');
    const [indentSize, setIndentSize] = useState(2);

    const parsed = useMemo<{ data: unknown; tree: TreeNode } | null>(() => {
        if (!input.trim()) return null;
        try {
            const data = JSON.parse(input);
            return { data, tree: buildTree(data) };
        } catch { return null; }
    }, [input]);

    const handleFormat = useCallback(() => {
        setError('');
        try {
            if (!input.trim()) return;
            const p = JSON.parse(input);
            setOutput(JSON.stringify(p, null, indentSize));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid JSON');
        }
    }, [input, indentSize]);

    const handleMinify = useCallback(() => {
        setError('');
        try {
            if (!input.trim()) return;
            const p = JSON.parse(input);
            setOutput(JSON.stringify(p));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid JSON');
        }
    }, [input]);

    const handleCopy = useCallback(async (text: string, id: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    }, []);

    const handleDownload = useCallback(() => {
        const blob = new Blob([output || input], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'formatted.json'; a.click();
        URL.revokeObjectURL(url);
    }, [output, input]);

    const togglePath = useCallback((path: string) => {
        setExpandedPaths(prev => {
            const next = new Set(prev);
            if (next.has(path)) next.delete(path); else next.add(path);
            return next;
        });
    }, []);

    const queryResult = useMemo(() => {
        if (!jsonPath || !parsed) return null;
        const result = jsonPathQuery(parsed.data, jsonPath);
        return result !== undefined ? jsonPath : null;
    }, [jsonPath, parsed]);

    const diffLines = useMemo(() => {
        if (viewMode !== 'diff' || !input.trim() || !diffInput.trim()) return [];
        try {
            const a = JSON.stringify(JSON.parse(input), null, 2);
            const b = JSON.stringify(JSON.parse(diffInput), null, 2);
            if (a === b) return a.split('\n').map(l => ({ left: l, right: l, type: 'same' as const }));
            const linesA = a.split('\n');
            const linesB = b.split('\n');
            const maxLen = Math.max(linesA.length, linesB.length);
            const result: { left: string; right: string; type: 'same' | 'added' | 'removed' }[] = [];
            const setB = new Set(linesB);
            const setA = new Set(linesA);
            for (let i = 0; i < maxLen; i++) {
                const la = linesA[i] || '';
                const lb = linesB[i] || '';
                if (la === lb) result.push({ left: la, right: lb, type: 'same' });
                else if (!setB.has(la)) result.push({ left: la, right: lb, type: 'removed' });
                else if (!setA.has(lb)) result.push({ left: la, right: lb, type: 'added' });
                else result.push({ left: la, right: lb, type: 'removed' });
            }
            return result;
        } catch { return []; }
    }, [viewMode, input, diffInput]);

    const stats = useMemo(() => {
        if (!parsed) return null;
        const data = parsed.data;
        const str = JSON.stringify(data);
        return { keys: typeof data === 'object' && data !== null ? Object.keys(data as object).length : 0, size: str.length, depth: (() => { let d = 0; let c: unknown = data; while (c && typeof c === 'object') { d++; c = Array.isArray(c) ? c[0] : Object.values(c as object)[0]; } return d; })() };
    }, [parsed]);

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
                    <span className="text-[12px] font-mono text-[var(--foreground)] opacity-50">JSON Formatter</span>
                </div>
                <div className="flex items-center gap-1">
                    {(['formatted', 'tree', 'diff'] as ViewMode[]).map(mode => (
                        <button key={mode} onClick={() => setViewMode(mode)}
                            className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-colors ${
                                viewMode === mode ? 'bg-[var(--foreground)] text-white' : 'text-[var(--foreground)] opacity-25 hover:opacity-50 hover:bg-black/5'
                            }`}>
                            {mode === 'formatted' ? <Braces size={11} /> : mode === 'tree' ? <TreePine size={11} /> : <GitCompare size={11} />}
                            {mode === 'formatted' ? 'Format' : mode === 'tree' ? 'Tree' : 'Diff'}
                        </button>
                    ))}
                    <div className="w-px h-3 bg-[var(--border-color)] mx-1" />
                    <button onClick={() => { setInput(SAMPLE_JSON); setError(''); }} className="p-1.5 text-[var(--foreground)] opacity-20 hover:opacity-50 transition-opacity" title="Load sample">
                        <FileJson size={13} />
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex min-h-0">
                {/* Left: Input */}
                <div className="flex-1 flex flex-col min-w-0 border-r border-[var(--border-color)]">
                    <div className="px-3 py-1.5 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--background)] shrink-0">
                        <span className="text-[10px] font-mono font-bold text-[var(--foreground)] opacity-20 uppercase tracking-wider">Input</span>
                        <div className="flex items-center gap-1">
                            {stats && <span className="text-[10px] font-mono text-[var(--foreground)] opacity-15">{stats.keys} keys · {stats.size} chars</span>}
                            <button onClick={() => { setInput(''); setOutput(''); setError(''); }}
                                className="p-1 text-[var(--foreground)] opacity-15 hover:opacity-40 transition-opacity" title="Clear">
                                <Trash2 size={11} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0">
                        <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(''); }}
                            placeholder="Paste JSON here..."
                            className="w-full h-full p-4 font-mono text-[13px] leading-[1.6] resize-none outline-none text-[var(--foreground)] opacity-70 bg-white selection:bg-orange-500/20" />
                    </div>
                    {error && (
                        <div className="px-3 py-2 flex items-center gap-2 bg-red-50 border-t border-red-200/50 shrink-0">
                            <AlertCircle size={12} className="text-red-500 shrink-0" />
                            <span className="text-[11px] font-mono text-red-600/80 truncate">{error}</span>
                        </div>
                    )}
                    {/* Action bar */}
                    <div className="px-3 py-2 flex items-center gap-2 border-t border-[var(--border-color)] bg-[var(--background)] shrink-0">
                        <button onClick={handleFormat}
                            className="px-3 py-1 bg-[#ea580c] hover:bg-[#d94f04] text-white text-[11px] font-mono font-bold rounded-md transition-colors">
                            Format
                        </button>
                        <button onClick={handleMinify}
                            className="px-3 py-1 bg-white border border-[var(--border-color)] text-[var(--foreground)] opacity-50 hover:opacity-80 text-[11px] font-mono font-bold rounded-md transition-colors">
                            Minify
                        </button>
                        <div className="flex items-center gap-1 ml-auto">
                            <span className="text-[10px] font-mono text-[var(--foreground)] opacity-15">Indent:</span>
                            {[2, 4].map(n => (
                                <button key={n} onClick={() => setIndentSize(n)}
                                    className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${indentSize === n ? 'bg-[var(--foreground)] text-white' : 'text-[var(--foreground)] opacity-25 hover:opacity-50'}`}>
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Output */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="px-3 py-1.5 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--background)] shrink-0">
                        <span className="text-[10px] font-mono font-bold text-[var(--foreground)] opacity-20 uppercase tracking-wider">
                            {viewMode === 'formatted' ? 'Output' : viewMode === 'tree' ? 'Tree View' : 'Diff'}
                        </span>
                        <div className="flex items-center gap-1">
                            {viewMode === 'tree' && (
                                <div className="flex items-center gap-1 mr-2">
                                    <Search size={10} className="text-[var(--foreground)] opacity-20" />
                                    <input value={jsonPath} onChange={(e) => setJsonPath(e.target.value)}
                                        placeholder="$.config.theme"
                                        className="w-32 px-1.5 py-0.5 text-[11px] font-mono bg-white border border-[var(--border-color)] rounded outline-none text-[var(--foreground)] opacity-50 focus:opacity-80" />
                                </div>
                            )}
                            {viewMode === 'formatted' && output && (
                                <>
                                    <button onClick={() => handleCopy(output, 'output')}
                                        className="p-1 text-[var(--foreground)] opacity-15 hover:opacity-40 transition-opacity" title="Copy">
                                        {copied === 'output' ? <Check size={11} /> : <Copy size={11} />}
                                    </button>
                                    <button onClick={handleDownload}
                                        className="p-1 text-[var(--foreground)] opacity-15 hover:opacity-40 transition-opacity" title="Download">
                                        <Download size={11} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto min-h-0">
                        {viewMode === 'formatted' && (
                            <textarea value={output} readOnly placeholder="Formatted JSON will appear here..."
                                className="w-full h-full p-4 font-mono text-[13px] leading-[1.6] resize-none outline-none text-[var(--foreground)] opacity-70 bg-[var(--background)] selection:bg-orange-500/20" />
                        )}

                        {viewMode === 'tree' && parsed && (
                            <div className="py-1">
                                <TreeNodeItem node={parsed.tree} depth={0} expandedPaths={expandedPaths}
                                    togglePath={togglePath} queryResult={queryResult} copied={copied} onCopy={handleCopy} />
                            </div>
                        )}

                        {viewMode === 'tree' && !parsed && input.trim() && (
                            <div className="flex items-center justify-center h-full text-[var(--foreground)] opacity-15">
                                <span className="text-[11px] font-mono">Invalid JSON — fix input to see tree</span>
                            </div>
                        )}

                        {viewMode === 'diff' && (
                            <div className="h-full flex flex-col">
                                <div className="px-3 py-1.5 border-b border-[var(--border-color)] bg-[var(--background)] shrink-0">
                                    <span className="text-[10px] font-mono text-[var(--foreground)] opacity-20 uppercase tracking-wider">Compare with</span>
                                    <textarea value={diffInput} onChange={(e) => setDiffInput(e.target.value)}
                                        placeholder="Paste second JSON to compare..."
                                        className="w-full h-20 mt-1 p-2 font-mono text-[12px] leading-[1.5] resize-none outline-none border border-[var(--border-color)] rounded bg-white text-[var(--foreground)] opacity-60 selection:bg-orange-500/20" />
                                </div>
                                <div className="flex-1 overflow-auto min-h-0 font-mono text-[12px] leading-[1.6]">
                                    {diffLines.length > 0 ? diffLines.map((line, i) => (
                                        <div key={i} className={`px-4 py-0.5 ${
                                            line.type === 'added' ? 'bg-green-50 text-green-700' :
                                            line.type === 'removed' ? 'bg-red-50 text-red-700 line-through opacity-60' :
                                            'text-[var(--foreground)] opacity-50'
                                        }`}>
                                            <span className="inline-block w-5 text-[var(--foreground)] opacity-20 select-none">
                                                {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                                            </span>
                                            {line.left || line.right}
                                        </div>
                                    )) : (
                                        <div className="flex items-center justify-center h-full text-[var(--foreground)] opacity-10">
                                            <span className="text-[11px] font-mono">Paste both JSONs to compare</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
