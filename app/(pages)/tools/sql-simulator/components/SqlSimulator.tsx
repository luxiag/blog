"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SQL_DATASETS, type SqlDatasetId } from '@/lib/sqlDatasets';
import {
    Database,
    Play,
    Trash2,
    Download,
    Table,
    Code2,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    Monitor,
    Layout,
    RefreshCw,
    Eye,
    EyeOff,
    Copy,
    Terminal,
    FileUp
} from 'lucide-react';

type SqlJsExecResult = { columns: string[]; values: any[][] };

type SqlJsDatabase = {
    exec: (sql: string) => SqlJsExecResult[];
    run: (sql: string) => void;
    close: () => void;
};

type SqlJsModule = {
    Database: new () => SqlJsDatabase;
};

declare global {
    interface Window {
        initSqlJs?: (config: { locateFile: (file: string) => string }) => Promise<SqlJsModule>;
    }
}

let sqlJsModulePromise: Promise<SqlJsModule> | null = null;

const SQLJS_LOCAL_PATH = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/sql`;

function loadSqlJsModule(): Promise<SqlJsModule> {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('SQL.js must be loaded in the browser'));
    }

    if (sqlJsModulePromise) return sqlJsModulePromise;

    sqlJsModulePromise = new Promise<SqlJsModule>((resolve, reject) => {
        const existing = document.querySelector('script[data-sqljs="true"]');
        if (existing && window.initSqlJs) {
            window
                .initSqlJs({ locateFile: (file) => `${SQLJS_LOCAL_PATH}/${file}` })
                .then(resolve)
                .catch(reject);
            return;
        }

        const script = document.createElement('script');
        script.src = `${SQLJS_LOCAL_PATH}/sql-wasm.js`;
        script.async = true;
        script.dataset.sqljs = 'true';
        script.onload = () => {
            if (!window.initSqlJs) {
                reject(new Error('SQL.js loaded but initSqlJs was not found'));
                return;
            }
            window
                .initSqlJs({ locateFile: (file) => `${SQLJS_LOCAL_PATH}/${file}` })
                .then(resolve)
                .catch(reject);
        };
        script.onerror = () => reject(new Error('Failed to load SQL.js'));

        document.head.appendChild(script);
    });

    return sqlJsModulePromise;
}

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

    const resolvedDataset = useMemo(() => {
        if (currentDatasetId === 'custom') return null;
        return SQL_DATASETS[currentDatasetId];
    }, [currentDatasetId]);

    const resolvedInitialSql = currentDatasetId === 'custom' ? customInitialSql : (resolvedDataset?.initialSql ?? initialSql);
    const resolvedDefaultQuery = resolvedDataset?.defaultQuery ?? defaultQuery;

    const [query, setQuery] = useState(resolvedDefaultQuery);
    const [resultSets, setResultSets] = useState<Array<{ columns: string[]; values: any[][] }> | null>(null);
    const [activeResultIndex, setActiveResultIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [activeTab, setActiveTab] = useState<'result' | 'error' | 'schema'>('result');
    const [schemaText, setSchemaText] = useState<string>('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

    const dbRef = useRef<SqlJsDatabase | null>(null);

    const toggleTable = (tableName: string) => {
        setExpandedTables(prev => {
            const next = new Set(prev);
            if (next.has(tableName)) next.delete(tableName);
            else next.add(tableName);
            return next;
        });
    };

    const initDB = useCallback(async () => {
        try {
            setIsInitialized(false);
            setError(null);
            setResultSets(null);
            setActiveResultIndex(0);
            setExpandedTables(new Set());

            if (dbRef.current) {
                dbRef.current.close();
                dbRef.current = null;
            }

            const SQL = await loadSqlJsModule();
            const db = new SQL.Database();
            dbRef.current = db;

            if (resolvedInitialSql) {
                db.run(resolvedInitialSql);
            }

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

    useEffect(() => {
        initDB();
        return () => {
            if (dbRef.current) dbRef.current.close();
        };
    }, [initDB]);

    const runQuery = useCallback(() => {
        if (!isInitialized || !dbRef.current) return;
        try {
            const res = dbRef.current.exec(query);
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
            setError(err.message);
            setActiveTab('error');
        }
    }, [query, isInitialized]);

    // Handle Ctrl+Enter to run query
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                runQuery();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [runQuery]);

    const exportCSV = () => {
        if (!resultSets || !resultSets[activeResultIndex]) return;
        const { columns, values } = resultSets[activeResultIndex];
        const csvContent = [
            columns.join(','),
            ...values.map(row => row.map(v => `"${v === null ? '' : v}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `query_result_${Date.now()}.csv`);
        link.click();
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportSql = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                setCustomInitialSql(content);
                setCurrentDatasetId('custom');
                // Setting query to empty or a generic select if no default
                setQuery('-- SQL Imported\n' + content.split('\n').slice(0, 5).join('\n') + '\n...');
                // The useEffect for initDB will pick up the change in resolvedInitialSql
            };
            reader.readAsText(file);
        }
    };

    const activeResult = resultSets ? resultSets[activeResultIndex] : null;

    return (
        <div className="flex flex-col h-[700px] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-950 shadow-2xl">
            {/* Toolbar */}
            <div className="h-14 bg-neutral-900 text-white px-4 flex items-center justify-between border-b border-neutral-800 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-orange-500" />
                        <span className="font-bold text-sm tracking-tight">{title}</span>
                    </div>

                    <div className="hidden md:flex h-6 w-px bg-neutral-700" />

                    <div className="flex items-center gap-1 bg-neutral-800 p-1 rounded-lg border border-neutral-700">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-1.5 rounded-md transition-colors ${isSidebarOpen ? 'bg-neutral-700 text-orange-400' : 'hover:bg-neutral-700 text-neutral-400'}`}
                            title="切换边栏 (表结构)"
                        >
                            <Layout className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-neutral-700 mx-1" />
                        <select
                            value={currentDatasetId}
                            onChange={(e) => {
                                const newId = e.target.value as any;
                                setCurrentDatasetId(newId);
                                // The useEffect will trigger initDB and reset query
                                if (newId !== 'custom') {
                                    setQuery(SQL_DATASETS[newId as SqlDatasetId].defaultQuery);
                                }
                            }}
                            className="bg-transparent text-xs font-bold outline-none cursor-pointer text-neutral-300 hover:text-white px-2"
                        >
                            <optgroup label="内置数据集">
                                <option value="commerce">E-Commerce</option>
                                <option value="enterprise">Enterprise ERP</option>
                            </optgroup>
                            <option value="custom">自定义 (空白)</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImportSql}
                        accept=".sql,.txt"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors text-xs font-bold border border-neutral-700"
                        title="导入外部 SQL 脚本"
                    >
                        <FileUp className="w-4 h-4 text-orange-400" />
                        <span className="hidden sm:inline">导入 SQL</span>
                    </button>
                    <button
                        onClick={initDB}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
                        title="重置引擎"
                    >
                        <RefreshCw className={`w-4 h-4 ${!isInitialized ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={runQuery}
                        disabled={!isInitialized}
                        className="flex items-center gap-2 px-4 py-1.5 bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-700 text-white text-sm font-black rounded-lg transition-all active:scale-95"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        <span className="hidden sm:inline">运行 (Ctrl+Enter)</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar: Schema Explorer */}
                {isSidebarOpen && (
                    <div className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex flex-col shrink-0">
                        <div className="p-4 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
                            <Table className="w-4 h-4 text-neutral-500" />
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">表结构</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3">
                            {schemaText ? (
                                <div className="space-y-4">
                                    {schemaText.split('\n\n').map((ddl, i) => {
                                        const tableName = ddl.match(/CREATE TABLE "(\w+)"|CREATE TABLE (\w+)/)?.[1] ||
                                            ddl.match(/CREATE TABLE "(\w+)"|CREATE TABLE (\w+)/)?.[2] || 'Table';
                                        return (
                                            <div key={i} className="mb-2">
                                                <div
                                                    className="flex items-center gap-2 mb-1 cursor-pointer select-none group"
                                                    onClick={() => toggleTable(tableName)}
                                                >
                                                    <ChevronRight className={`w-3 h-3 text-neutral-400 transition-all duration-300 ${expandedTables.has(tableName) ? 'rotate-90 text-orange-500' : 'group-hover:text-neutral-600'}`} />
                                                    <span className={`text-sm font-mono font-bold transition-colors ${expandedTables.has(tableName) ? 'text-orange-600 dark:text-orange-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
                                                        {tableName}
                                                    </span>
                                                </div>
                                                {expandedTables.has(tableName) && (
                                                    <pre className="text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 p-2 rounded-md border border-neutral-200 dark:border-neutral-700 mb-2 overflow-x-auto animate-in fade-in slide-in-from-top-1 duration-200">
                                                        {ddl}
                                                    </pre>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-10 opacity-30">
                                    <Database className="w-8 h-8 mx-auto mb-2" />
                                    <p className="text-[10px] uppercase font-bold">没有可用表</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Editor & Results */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Editor Area */}
                    <div className="h-1/2 relative flex flex-col">
                        <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                                <Code2 className="w-4 h-4" />
                                <span>QUERY EDITOR</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setQuery('')}
                                    className="p-1 hover:text-red-500 transition-colors"
                                    title="清空"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 w-full p-4 font-mono text-sm dark:bg-neutral-950 outline-none resize-none dark:text-orange-100/80 selection:bg-orange-500/30"
                            spellCheck={false}
                            placeholder="SELECT * FROM table_name..."
                        />
                    </div>

                    {/* Result Area */}
                    <div className="h-1/2 flex flex-col border-t-2 border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveTab('result')}
                                    className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'result' ? 'border-orange-500 text-orange-500' : 'border-transparent text-neutral-400'}`}
                                >
                                    Results
                                </button>
                                <button
                                    onClick={() => setActiveTab('error')}
                                    className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'error' ? 'border-red-500 text-red-500' : 'border-transparent text-neutral-400'}`}
                                >
                                    Console/Error
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                {activeTab === 'result' && activeResult && (
                                    <button
                                        onClick={exportCSV}
                                        className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold bg-neutral-200 text-white  dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-md transition-colors"
                                    >
                                        <Download className="w-3 h-3" />
                                        EXPORT CSV
                                    </button>
                                )}
                                {answerSql && (
                                    <button
                                        onClick={() => setShowAnswer(!showAnswer)}
                                        className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${showAnswer ? 'bg-orange-100 text-orange-600' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'}`}
                                    >
                                        {showAnswer ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                        ANSWER
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto bg-white dark:bg-neutral-950 font-mono">
                            {activeTab === 'result' && (
                                <>
                                    {activeResult && activeResult.columns.length > 0 ? (
                                        <div className="min-w-full">
                                            <table className="w-full text-[13px] border-collapse">
                                                <thead className="sticky top-0 bg-neutral-100 dark:bg-neutral-900 z-10">
                                                    <tr>
                                                        <th className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 text-left text-neutral-400 text-[10px] w-10">#</th>
                                                        {activeResult.columns.map((col, i) => (
                                                            <th key={i} className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 text-left font-bold text-orange-500/80 whitespace-nowrap">
                                                                {col}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                                                    {activeResult.values.map((row, i) => (
                                                        <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                                            <td className="px-3 py-2 text-neutral-400 text-[10px] tabular-nums border-r border-neutral-100 dark:border-neutral-900">{i + 1}</td>
                                                            {row.map((val, j) => (
                                                                <td key={j} className="px-4 py-2 text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                                                                    {val === null ? <span className="opacity-30 italic">null</span> : String(val)}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : error ? (
                                        <div className="flex items-center justify-center h-full text-red-500/80 gap-3 px-6">
                                            <AlertCircle className="w-8 h-8 shrink-0" />
                                            <div className="text-sm font-bold bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-500/20 max-w-lg">
                                                {error}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full opacity-20 select-none">
                                            <Monitor className="w-16 h-16 mb-2" />
                                            <p className="text-xs font-bold tracking-tighter uppercase">No Query Results</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'error' && (
                                <div className="p-6 space-y-4">
                                    {error ? (
                                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 animate-in fade-in slide-in-from-top-4">
                                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                            <div>
                                                <div className="text-sm font-black text-red-600 dark:text-red-400 mb-1">Execution Failed</div>
                                                <div className="text-[13px] font-mono leading-relaxed opacity-80">{error}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 animate-in fade-in slide-in-from-top-4">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <div>
                                                <div className="text-sm font-black text-green-600 dark:text-green-400 mb-1">Engine Ready</div>
                                                <div className="text-[13px] font-mono leading-relaxed opacity-80">
                                                    Database initialized successfully. Type your SQL and press <b>Ctrl+Enter</b>.
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {showAnswer && answerSql && (
                                        <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30">
                                            <div className="text-xs font-black text-orange-600 mb-2 uppercase tracking-widest flex items-center gap-2">
                                                <Code2 className="w-3 h-3" /> Suggested Solution
                                            </div>
                                            <pre className="text-[13px] text-orange-800 dark:text-orange-200/80 whitespace-pre-wrap">{answerSql}</pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="h-8 px-4 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                                <div className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${isInitialized ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 animate-pulse'}`} />
                                    {isInitialized ? 'Connected' : 'Connecting...'}
                                </div>
                                {activeResult && <div>{activeResult.values.length} Rows Fetched</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
