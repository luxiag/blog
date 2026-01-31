"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SQL_DATASETS, type SqlDatasetId } from '@/lib/sqlDatasets';

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

const SQLJS_VERSION = '1.10.3';
// 使用本地 SQL.js 文件
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
  initialSql?: string; // Initialization SQL (CREATE TABLE, INSERT...)
  defaultQuery?: string; // Default query to show in editor
  answerSql?: string; // Expected answer SQL (for validation/hint)
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
  dataset,
  showSchema = true,
}: SqlSimulatorProps) {
  const resolvedDataset = useMemo(() => (dataset ? SQL_DATASETS[dataset] : null), [dataset]);
  const resolvedInitialSql = resolvedDataset?.initialSql ?? initialSql;
  const resolvedDefaultQuery = resolvedDataset?.defaultQuery ?? defaultQuery;

  const [query, setQuery] = useState(resolvedDefaultQuery);
  const [resultSets, setResultSets] = useState<Array<{ columns: string[]; values: any[][] }> | null>(null);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeTab, setActiveTab] = useState<'result' | 'error' | 'schema'>('result');
  const [schemaText, setSchemaText] = useState<string>('');
  const dbRef = useRef<SqlJsDatabase | null>(null);

  // Initialize database
  const initDB = useCallback(async () => {
    try {
      setIsInitialized(false);
      setError(null);
      setResultSets(null);
      setActiveResultIndex(0);

      // Clean up previous DB instance if exists
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
        try {
          const res = db.exec(
            "SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
          );
          if (res.length > 0) {
            const last = res[res.length - 1];
            const rows = last.values as Array<[string, string]>;
            setSchemaText(
              rows
                .map((r) => {
                  const name = r[0];
                  const ddl = r[1];
                  return `${name}\n${ddl}`;
                })
                .join('\n\n')
            );
          } else {
            setSchemaText('');
          }
        } catch {
          setSchemaText('');
        }
      }

      setIsInitialized(true);
    } catch (err: any) {
      console.error('SQL Init Error:', err);
      setError(`Initialization Error: ${err.message}`);
      setActiveTab('error');
    }
  }, [resolvedInitialSql, showSchema]);

  useEffect(() => {
    setQuery(resolvedDefaultQuery);
    initDB();

    return () => {
      if (dbRef.current) {
        dbRef.current.close();
        dbRef.current = null;
      }
    };
  }, [initDB, resolvedDefaultQuery]);

  const clearEditor = useCallback(() => {
    setQuery('');
  }, []);

  const runQuery = useCallback(() => {
    if (!isInitialized || !dbRef.current) return;
    const db = dbRef.current;

    try {
      const res = db.exec(query);
      if (res.length > 0) {
        setResultSets(res.map((r) => ({ columns: r.columns, values: r.values })));
        setActiveResultIndex(res.length - 1);
        setActiveTab('result');
      } else {
        setResultSets([{ columns: [], values: [] }]);
        setActiveResultIndex(0);
        setActiveTab('result');
      }

      setError(null);
    } catch (err: any) {
      setError(err.message);
      setResultSets(null);
      setActiveTab('error');
    }
  }, [query, isInitialized]);

  // Run default query on init
  useEffect(() => {
    if (isInitialized) {
      runQuery();
    }
  }, [isInitialized, runQuery]);

  const activeResult = useMemo(() => {
    if (!resultSets || resultSets.length === 0) return null;
    const idx = Math.min(Math.max(activeResultIndex, 0), resultSets.length - 1);
    return resultSets[idx];
  }, [activeResultIndex, resultSets]);

  const rowsAsObjects = useMemo(() => {
    if (!activeResult) return null;
    const { columns, values } = activeResult;
    if (columns.length === 0) return [];
    return values.map((row) => {
      const obj: Record<string, unknown> = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
  }, [activeResult]);

  return (
    <div className="my-6 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
      <div className="bg-neutral-50 dark:bg-neutral-800 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
        <h3 className="font-semibold text-neutral-700 dark:text-neutral-200 text-sm flex items-center gap-2">
          {title}
          {!isInitialized && <span className="text-xs font-normal text-neutral-500">(Initializing...)</span>}
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={initDB}
            className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            title="重置数据库状态"
          >
            重置数据
          </button>
          <button
            onClick={clearEditor}
            className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            title="清空编辑器"
          >
            清空编辑器
          </button>
          {answerSql && (
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 font-medium"
            >
              {showAnswer ? '隐藏答案' : '查看答案'}
            </button>
          )}
        </div>
      </div>

      {description && (
        <div className="p-4 text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-800/30 border-b border-neutral-200 dark:border-neutral-700">
          {description}
        </div>
      )}

      <div className="p-4 space-y-4">
        {resolvedDataset && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            数据集：{resolvedDataset.name} · {resolvedDataset.description}
          </div>
        )}

        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={!isInitialized}
            className="w-full h-32 p-3 font-mono text-sm bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-neutral-800 dark:text-neutral-200 resize-y disabled:opacity-50"
            placeholder={isInitialized ? "输入 SQL 语句..." : "数据库加载中..."}
          />
          <button
            onClick={runQuery}
            disabled={!isInitialized}
            className="absolute bottom-3 right-3 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            运行查询
          </button>
        </div>

        {showAnswer && answerSql && (
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-md p-3">
            <div className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">参考答案：</div>
            <pre className="text-sm font-mono text-green-800 dark:text-green-300 whitespace-pre-wrap">{answerSql}</pre>
          </div>
        )}

        <div className="border border-neutral-200 dark:border-neutral-700 rounded-md overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setActiveTab('result')}
              className={`text-xs px-2 py-1 rounded ${activeTab === 'result' ? 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
            >
              结果
            </button>
            <button
              onClick={() => setActiveTab('error')}
              className={`text-xs px-2 py-1 rounded ${activeTab === 'error' ? 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
            >
              错误
            </button>
            {showSchema && (
              <button
                onClick={() => setActiveTab('schema')}
                className={`text-xs px-2 py-1 rounded ${activeTab === 'schema' ? 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
              >
                表结构
              </button>
            )}
            <div className="flex-1" />
            {resultSets && resultSets.length > 1 && (
              <select
                value={activeResultIndex}
                onChange={(e) => setActiveResultIndex(Number(e.target.value))}
                className="text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1 text-neutral-700 dark:text-neutral-200"
              >
                {resultSets.map((_, i) => (
                  <option key={i} value={i}>
                    结果集 {i + 1}/{resultSets.length}
                  </option>
                ))}
              </select>
            )}
          </div>

          {activeTab === 'result' && (
            <div className="overflow-x-auto">
              {rowsAsObjects && rowsAsObjects.length > 0 ? (
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      {Object.keys(rowsAsObjects[0]).map((key) => (
                        <th key={key} className="px-4 py-2 text-left font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
                    {rowsAsObjects.map((row, i) => (
                      <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="px-4 py-2 text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                            {val === null ? <span className="text-neutral-400 italic">NULL</span> : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : rowsAsObjects && rowsAsObjects.length === 0 ? (
                <div className="p-4 text-center text-neutral-500 dark:text-neutral-400 text-sm italic">
                  查询结果为空 (0 rows)
                </div>
              ) : (
                <div className="p-4 text-sm text-neutral-500 dark:text-neutral-400 italic">
                  还没有结果，点击“运行查询”。
                </div>
              )}
            </div>
          )}

          {activeTab === 'error' && (
            <div className="p-4">
              {error ? (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-md p-3 text-sm text-red-600 dark:text-red-400 font-mono">
                  Error: {error}
                </div>
              ) : (
                <div className="text-sm text-neutral-500 dark:text-neutral-400 italic">暂无错误信息</div>
              )}
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="p-4">
              {schemaText ? (
                <pre className="text-xs font-mono text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{schemaText}</pre>
              ) : (
                <div className="text-sm text-neutral-500 dark:text-neutral-400 italic">暂无表结构信息</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
