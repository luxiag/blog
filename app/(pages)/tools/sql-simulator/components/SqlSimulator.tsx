'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SQL_DATASETS, type SqlDatasetId } from '@/lib/sqlDatasets';
import Editor from 'react-simple-code-editor';
import { Highlight, Prism } from 'prism-react-renderer';
import {
    Play, Trash2, Download, Table, Code2, AlertCircle,
    CheckCircle2, ChevronRight, RefreshCw, Eye, EyeOff,
    Copy, Check, Terminal, FileUp, Clock, Layout,
    PanelLeftOpen, PanelLeftClose
} from 'lucide-react';

const sqlHighlightTheme = {
    plain: { color: 'oklch(0.32 0 0)', backgroundColor: 'transparent' },
    styles: [
        { types: ['comment'], style: { color: '#9ca3af', fontStyle: 'italic' } },
        { types: ['keyword'], style: { color: '#ea580c', fontWeight: 'bold' } },
        { types: ['operator'], style: { color: '#4b5563' } },
        { types: ['string', 'url', 'attr-value'], style: { color: '#ea580c' } },
        { types: ['function'], style: { color: '#7c3aed' } },
        { types: ['number', 'boolean', 'literal'], style: { color: '#2563eb' } },
        { types: ['variable', 'property'], style: { color: '#4b5563' } },
        { types: ['punctuation'], style: { color: '#9ca3af' } },
        { types: ['class-name', 'type'], style: { color: '#7c3aed' } },
        { types: ['built-in'], style: { color: '#2563eb' } },
    ],
};

type SqlJsExecResult = { columns: string[]; values: any[][] };
type SqlJsDatabase = { exec: (sql: string) => SqlJsExecResult[]; run: (sql: string) => void; close: () => void };
type SqlJsModule = { Database: new () => SqlJsDatabase };

declare global {
    interface Window {
        initSqlJs?: (config: { locateFile: (file: string) => string }) => Promise<SqlJsModule>;
    }
}

let sqlJsModulePromise: Promise<SqlJsModule> | null = null;
const SQLJS_LOCAL_PATH = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/sql`;

function loadSqlJsModule(): Promise<SqlJsModule> {
    if (typeof window === 'undefined') return Promise.reject(new Error('SQL.js must be loaded in the browser'));
    if (sqlJsModulePromise) return sqlJsModulePromise;

    sqlJsModulePromise = new Promise<SqlJsModule>((resolve, reject) => {
        const existing = document.querySelector('script[data-sqljs="true"]');
        if (existing && window.initSqlJs) {
            window.initSqlJs({ locateFile: (file) => `${SQLJS_LOCAL_PATH}/${file}` }).then(resolve).catch(reject);
            return;
        }
        const script = document.createElement('script');
        script.src = `${SQLJS_LOCAL_PATH}/sql-wasm.js`;
        script.async = true;
        script.dataset.sqljs = 'true';
        script.onload = () => {
            if (!window.initSqlJs) { reject(new Error('SQL.js loaded but initSqlJs was not found')); return; }
            window.initSqlJs({ locateFile: (file) => `${SQLJS_LOCAL_PATH}/${file}` }).then(resolve).catch(reject);
        };
        script.onerror = () => reject(new Error('Failed to load SQL.js'));
        document.head.appendChild(script);
    });
    return sqlJsModulePromise;
}

const fmtTime = (ms: number) => ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;

interface SqlSimulatorProps {
    initialSql?: string;
    defaultQuery?: string;
    answerSql?: string;
    title?: string;
    description?: string;
    dataset?: SqlDatasetId;
    showSchema?: boolean;
}

export default function SqlSimulator({
    initialSql = '',
    defaultQuery = 'SELECT * FROM users',
    answerSql,
    title = 'SQL 模拟器',
    description,
    dataset: initialDatasetId,
    showSchema = true,
}: SqlSimulatorProps) {
    const [currentDatasetId, setCurrentDatasetId] = useState<SqlDatasetId | 'custom'>(initialDatasetId || 'comprehensive');
    const [customInitialSql, setCustomInitialSql] = useState<string>('');
    const [query, setQuery] = useState(defaultQuery);
    const [resultSets, setResultSets] = useState<Array<{ columns: string[]; values: any[][] }> | null>(null);
    const [activeResultIndex, setActiveResultIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [activeTab, setActiveTab] = useState<'result' | 'error'>('result');
    const [schemaText, setSchemaText] = useState<string>('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
    const [splitRatio, setSplitRatio] = useState(0.45);
    const [elapsedTime, setElapsedTime] = useState<number | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [rowLimit, setRowLimit] = useState(100);

    const dbRef = useRef<SqlJsDatabase | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resolvedDataset = useMemo(() => {
        if (currentDatasetId === 'custom') return null;
        return SQL_DATASETS[currentDatasetId];
    }, [currentDatasetId]);

    const resolvedInitialSql = currentDatasetId === 'custom' ? customInitialSql : (resolvedDataset?.initialSql ?? initialSql);
    const resolvedDefaultQuery = resolvedDataset?.defaultQuery ?? defaultQuery;

    const toggleTable = (tableName: string) => {
        setExpandedTables(prev => {
            const next = new Set(prev);
            if (next.has(tableName)) next.delete(tableName); else next.add(tableName);
            return next;
        });
    };

    const copyClip = useCallback(async (text: string, id: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }, []);

    const initDB = useCallback(async () => {
        try {
            setIsInitialized(false);
            setError(null);
            setResultSets(null);
            setActiveResultIndex(0);
            setExpandedTables(new Set());
            setElapsedTime(null);

            if (dbRef.current) { dbRef.current.close(); dbRef.current = null; }

            const SQL = await loadSqlJsModule();
            const db = new SQL.Database();
            dbRef.current = db;

            if (resolvedInitialSql) db.run(resolvedInitialSql);

            if (showSchema) {
                const res = db.exec("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
                if (res.length > 0) {
                    const rows = res[0].values as Array<[string, string]>;
                    setSchemaText(rows.map(r => r[1]).join('\n\n'));
                } else {
                    setSchemaText('');
                }
            }
            setIsInitialized(true);
        } catch (err: any) {
            setError(`Init Error: ${err.message}`);
            setActiveTab('error');
        }
    }, [resolvedInitialSql, showSchema]);

    useEffect(() => { initDB(); return () => { if (dbRef.current) dbRef.current.close(); }; }, [initDB]);

    const runQuery = useCallback(() => {
        if (!isInitialized || !dbRef.current) return;
        const t0 = performance.now();
        try {
            const res = dbRef.current.exec(query);
            const ms = performance.now() - t0;
            setElapsedTime(ms);
            if (res.length > 0) {
                setResultSets(res.map(r => ({ columns: r.columns, values: r.values })));
                setActiveResultIndex(res.length - 1);
                setActiveTab('result');
                setError(null);
            } else {
                setResultSets([{ columns: [], values: [] }]);
                setActiveTab('result');
                setError(null);
            }
        } catch (err: any) {
            const ms = performance.now() - t0;
            setElapsedTime(ms);
            setError(err.message);
            setActiveTab('error');
        }
    }, [query, isInitialized]);

    useEffect(() => {
        const kd = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runQuery(); } };
        window.addEventListener('keydown', kd);
        return () => window.removeEventListener('keydown', kd);
    }, [runQuery]);

    useEffect(() => {
        const mm = (e: MouseEvent) => {
            if (!draggingRef.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setSplitRatio(Math.max(0.2, Math.min(0.8, (e.clientY - rect.top) / rect.height)));
        };
        const mu = () => { draggingRef.current = false; };
        window.addEventListener('mousemove', mm);
        window.addEventListener('mouseup', mu);
        return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
    }, []);

    const exportCSV = () => {
        if (!resultSets || !resultSets[activeResultIndex]) return;
        const { columns, values } = resultSets[activeResultIndex];
        const csvContent = [columns.join(','), ...values.map(row => row.map(v => `"${v === null ? '' : v}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `query_result_${Date.now()}.csv`);
        link.click();
    };

    const handleImportSql = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                setCustomInitialSql(content);
                setCurrentDatasetId('custom');
                setQuery('-- SQL Imported\n' + content.split('\n').slice(0, 5).join('\n') + '\n...');
            };
            reader.readAsText(file);
        }
    };

    const activeResult = resultSets ? resultSets[activeResultIndex] : null;
    const lineCount = query.split('\n').length;
    const gutterWidth = Math.max(3, String(lineCount).length) * 8 + 24;
    const displayRows = activeResult ? activeResult.values.slice(0, rowLimit) : [];
    const totalRows = activeResult?.values.length ?? 0;

    return (
        <div ref={containerRef} className="h-full flex flex-col bg-white">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--background)] border-b border-[var(--border-color)] select-none shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 text-[var(--foreground)] opacity-20 hover:opacity-50 transition-opacity" title="Toggle schema sidebar">
                        {isSidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
                    </button>
                    <div className="w-px h-3 bg-[var(--border-color)]" />
                    <select
                        value={currentDatasetId}
                        onChange={(e) => {
                            const newId = e.target.value as SqlDatasetId | 'custom';
                            setCurrentDatasetId(newId);
                            if (newId !== 'custom') setQuery(SQL_DATASETS[newId as SqlDatasetId].defaultQuery);
                        }}
                        className="bg-transparent text-[11px] font-mono font-bold outline-none cursor-pointer text-[var(--foreground)] opacity-50 hover:opacity-70 transition-opacity px-1"
                    >
                        <optgroup label="Built-in Datasets">
                            <option value="comprehensive">综合数据库 (30+ tables)</option>
                            <option value="commerce">电商数据集 (5 tables)</option>
                        </optgroup>
                        <option value="custom">自定义 (空白)</option>
                    </select>
                </div>

                <div className="flex items-center gap-1.5">
                    <input type="file" ref={fileInputRef} onChange={handleImportSql} accept=".sql,.txt" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono font-medium text-[var(--foreground)] opacity-30 hover:opacity-60 hover:bg-black/5 rounded transition-all"
                        title="Import SQL script">
                        <FileUp size={13} />
                        <span className="hidden sm:inline">Import</span>
                    </button>
                    <button onClick={initDB}
                        className="p-1.5 text-[var(--foreground)] opacity-20 hover:opacity-50 transition-opacity"
                        title="Reset database">
                        <RefreshCw className={`w-[14px] h-[14px] ${!isInitialized ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="w-px h-3 bg-[var(--border-color)] mx-1" />
                    <button onClick={runQuery} disabled={!isInitialized}
                        className="flex items-center gap-1.5 px-3 py-1 bg-[#ea580c] hover:bg-[#d94f04] disabled:bg-black/10 disabled:text-white/30 text-white text-[11px] font-mono font-bold rounded-md transition-colors">
                        <Play size={10} className="fill-current" />
                        Run
                    </button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0">
                {/* Sidebar: Schema Explorer */}
                {isSidebarOpen && (
                    <div className="w-56 shrink-0 bg-[var(--background)] border-r border-[var(--border-color)] flex flex-col">
                        <div className="px-3 py-2 text-[10px] font-mono font-bold text-[var(--foreground)] opacity-20 uppercase tracking-wider border-b border-[var(--border-color)]">
                            Schema
                        </div>
                        <div className="flex-1 overflow-y-auto py-1">
                            {schemaText ? (
                                <div className="space-y-1">
                                    {schemaText.split('\n\n').map((ddl, i) => {
                                        const tableName = ddl.match(/CREATE TABLE "?(\w+)"?/)?.[1] || 'Table';
                                        return (
                                            <div key={i}>
                                                <div
                                                    className="flex items-center gap-1.5 px-3 py-1 cursor-pointer select-none group"
                                                    onClick={() => toggleTable(tableName)}
                                                >
                                                    <ChevronRight className={`w-3 h-3 text-[var(--foreground)] opacity-20 transition-all duration-200 ${expandedTables.has(tableName) ? 'rotate-90 text-[#ea580c] opacity-100' : 'group-hover:opacity-40'}`} />
                                                    <span className={`text-[11px] font-mono font-bold transition-colors ${expandedTables.has(tableName) ? 'text-[#ea580c]' : 'text-[var(--foreground)] opacity-50 group-hover:opacity-80'}`}>
                                                        {tableName}
                                                    </span>
                                                </div>
                                                {expandedTables.has(tableName) && (
                                                    <pre className="mx-3 mb-1 text-[10px] font-mono text-[var(--foreground)] opacity-30 bg-white p-2 rounded border border-[var(--border-color)] overflow-x-auto">
                                                        {ddl}
                                                    </pre>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-[var(--foreground)] opacity-15">
                                    <Table className="w-6 h-6 mx-auto mb-2" />
                                    <p className="text-[10px] uppercase font-bold font-mono">No tables</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Editor + Results */}
                <div className="flex-1 flex flex-col min-h-0 min-w-0">
                    {/* Editor Area */}
                    <div style={{ height: `${splitRatio * 100}%` }} className="min-h-0 flex">
                        <div className="shrink-0 bg-white text-right select-none overflow-hidden" style={{ width: gutterWidth, fontSize: 13, lineHeight: '1.6', fontFamily: 'var(--font-mono)' }}>
                            <div className="pt-4">
                                {Array.from({ length: lineCount }, (_, i) => (
                                    <div key={i} className="text-[var(--foreground)] opacity-15 pr-3">{i + 1}</div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col min-w-0 bg-white">
                            <div className="flex items-center justify-between px-3 py-1 bg-[var(--background)] border-b border-[var(--border-color)] shrink-0">
                                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--foreground)] opacity-25">
                                    <Code2 size={12} />
                                    QUERY
                                </div>
                                <button onClick={() => setQuery('')}
                                    className="p-1 text-[var(--foreground)] opacity-15 hover:opacity-40 hover:text-red-500 transition-all"
                                    title="Clear">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto relative">
                                {!query && (
                                    <div className="absolute top-4 left-4 font-mono text-[13px] text-[var(--foreground)] opacity-10 pointer-events-none select-none">
                                        SELECT * FROM table_name...
                                    </div>
                                )}
                                <Editor
                                    value={query}
                                    onValueChange={setQuery}
                                    highlight={code => (
                                        <Highlight theme={sqlHighlightTheme as any} code={code} language="sql">
                                            {({ tokens, getLineProps, getTokenProps }) => (
                                                <>{tokens.map((line, i) => (
                                                    <div key={i} {...getLineProps({ line })}>
                                                        {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
                                                    </div>
                                                ))}</>
                                            )}
                                        </Highlight>
                                    )}
                                    padding={16}
                                    style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.6, backgroundColor: 'transparent', minHeight: '100%', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Drag handle */}
                    <div
                        onMouseDown={() => { draggingRef.current = true; }}
                        className="h-[3px] bg-[var(--border-color)] hover:bg-[#ea580c] cursor-row-resize shrink-0 transition-colors"
                    />

                    {/* Result Area */}
                    <div style={{ height: `${(1 - splitRatio) * 100}%` }} className="min-h-0 flex flex-col bg-[var(--background)]">
                        <div className="flex items-center justify-between px-3 py-1 bg-[var(--background)] border-b border-[var(--border-color)] shrink-0">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setActiveTab('result')}
                                    className={`text-[11px] font-mono font-bold uppercase tracking-wider pb-0.5 border-b-2 transition-all ${activeTab === 'result' ? 'border-[#ea580c] text-[#ea580c]' : 'border-transparent text-[var(--foreground)] opacity-25 hover:opacity-50'}`}>
                                    Results
                                </button>
                                <button onClick={() => setActiveTab('error')}
                                    className={`text-[11px] font-mono font-bold uppercase tracking-wider pb-0.5 border-b-2 transition-all ${activeTab === 'error' ? 'border-red-500 text-red-500' : 'border-transparent text-[var(--foreground)] opacity-25 hover:opacity-50'}`}>
                                    Console
                                </button>
                                {elapsedTime !== null && (
                                    <span className="flex items-center gap-1 text-[10px] font-mono text-[#ea580c]">
                                        <Clock size={10} />
                                        {fmtTime(elapsedTime)}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {activeTab === 'result' && activeResult && activeResult.columns.length > 0 && (
                                    <>
                                        <button onClick={() => {
                                            const text = [activeResult.columns.join('\t'), ...activeResult.values.map(r => r.join('\t'))].join('\n');
                                            copyClip(text, 'result');
                                        }} className="p-1 text-[var(--foreground)] opacity-15 hover:opacity-40 transition-opacity" title="Copy results">
                                            {copiedId === 'result' ? <Check size={12} /> : <Copy size={12} />}
                                        </button>
                                        <button onClick={exportCSV}
                                            className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--foreground)] opacity-30 hover:opacity-60 hover:bg-black/5 rounded transition-all">
                                            <Download size={11} />
                                            CSV
                                        </button>
                                    </>
                                )}
                                {answerSql && (
                                    <button onClick={() => setShowAnswer(!showAnswer)}
                                        className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-colors ${showAnswer ? 'bg-[#ea580c] text-white' : 'text-[var(--foreground)] opacity-30 hover:opacity-60'}`}>
                                        {showAnswer ? <EyeOff size={11} /> : <Eye size={11} />}
                                        Answer
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto min-h-0 bg-white font-mono">
                            {activeTab === 'result' && (
                                <>
                                    {activeResult && activeResult.columns.length > 0 ? (
                                        <div className="min-w-full">
                                            <table className="w-full text-[12px] border-collapse">
                                                <thead className="sticky top-0 bg-[var(--background)] z-10">
                                                    <tr>
                                                        <th className="px-3 py-2 border-b border-[var(--border-color)] text-left text-[var(--foreground)] opacity-20 text-[10px] w-10 font-mono">#</th>
                                                        {activeResult.columns.map((col, i) => (
                                                            <th key={i} className="px-4 py-2 border-b border-[var(--border-color)] text-left font-bold text-[#ea580c] whitespace-nowrap font-mono text-[11px]">
                                                                {col}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {displayRows.map((row, i) => (
                                                        <tr key={i} className="hover:bg-[var(--background)] transition-colors">
                                                            <td className="px-3 py-1.5 text-[var(--foreground)] opacity-15 text-[10px] tabular-nums border-r border-[var(--border-color)] font-mono">{i + 1}</td>
                                                            {row.map((val, j) => (
                                                                <td key={j} className="px-4 py-1.5 text-[var(--foreground)] opacity-70 whitespace-nowrap font-mono text-[12px]">
                                                                    {val === null ? <span className="opacity-20 italic">null</span> : String(val)}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {totalRows > rowLimit && (
                                                <div className="px-4 py-2 text-[10px] font-mono text-[var(--foreground)] opacity-20 border-t border-[var(--border-color)] text-center">
                                                    Showing {rowLimit} of {totalRows} rows{' '}
                                                    <button onClick={() => setRowLimit(prev => prev + 100)} className="text-[#ea580c] opacity-70 hover:opacity-100 underline">Load more</button>
                                                </div>
                                            )}
                                        </div>
                                    ) : error ? (
                                        <div className="flex items-center justify-center h-full text-red-500 gap-3 px-6">
                                            <AlertCircle className="w-6 h-6 shrink-0 opacity-60" />
                                            <div className="text-[12px] font-mono bg-red-50 p-4 rounded-lg border border-red-200/50 max-w-lg">
                                                {error}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-[var(--foreground)] opacity-10 select-none">
                                            <Terminal className="w-12 h-12 mb-2" />
                                            <p className="text-[11px] font-mono font-bold tracking-tighter uppercase">No Query Results</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'error' && (
                                <div className="p-4 space-y-4">
                                    {error ? (
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200/50">
                                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                            <div>
                                                <div className="text-[11px] font-mono font-bold text-red-600 mb-1">Execution Failed</div>
                                                <div className="text-[12px] font-mono leading-relaxed text-red-600/70">{error}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200/50">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            <div>
                                                <div className="text-[11px] font-mono font-bold text-green-600 mb-1">Engine Ready</div>
                                                <div className="text-[12px] font-mono leading-relaxed text-green-600/70">
                                                    Database initialized. Press <b>⌘+Enter</b> to run.
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {showAnswer && answerSql && (
                                        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200/50">
                                            <div className="text-[10px] font-mono font-bold text-[#ea580c] mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                                <Code2 size={11} /> Suggested Solution
                                            </div>
                                            <pre className="text-[12px] text-[#ea580c]/80 whitespace-pre-wrap font-mono">{answerSql}</pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Status bar */}
                        <div className="px-4 py-1 bg-[var(--background)] border-t border-[var(--border-color)] flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--foreground)] opacity-20 uppercase tracking-tighter">
                                <div className="flex items-center gap-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${isInitialized ? 'bg-[#ea580c]' : 'bg-red-500 animate-pulse'}`} />
                                    {isInitialized ? 'Connected' : 'Connecting...'}
                                </div>
                                {activeResult && totalRows > 0 && <div>{totalRows} rows</div>}
                                {resultSets && resultSets.length > 1 && <div>{resultSets.length} result sets</div>}
                            </div>
                            <div className="text-[10px] font-mono text-[var(--foreground)] opacity-10">SQLite WASM</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
