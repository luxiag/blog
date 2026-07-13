'use client';

import { useState, useCallback } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import { diffLines, Change } from 'diff';

export default function DiffCheckerPage() {
    const [oldText, setOldText] = useState('');
    const [newText, setNewText] = useState('');
    const [diffResult, setDiffResult] = useState<Change[]>([]);

    const handleCompare = useCallback(() => {
        const changes = diffLines(oldText, newText);
        setDiffResult(changes);
    }, [oldText, newText]);

    const handleClear = () => {
        setOldText('');
        setNewText('');
        setDiffResult([]);
    };

    return (
        <>
            <PageTitle title="文本对比" />
            <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
                <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-12">
                    <div style={{ marginBottom: '32px' }}>
                        <Link
                            href="/tools"
                            className="inline-flex items-center transition-colors"
                            style={{ color: 'var(--color-orange-800)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}
                        >
                            <svg
                                style={{ width: '16px', height: '16px', marginRight: '8px' }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            返回工具箱
                        </Link>
                    </div>

                    <h1 className="text-2xl md:text-3xl" style={{
                        fontWeight: 700,
                        marginBottom: '8px',
                        fontFamily: 'var(--font-sans)',
                        color: 'var(--foreground)'
                    }}>
                        文本对比
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-neutral-500)',
                        marginBottom: '32px'
                    }}>
                        对比两个文本的差异，支持行级比较。
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', opacity: 0.7 }}>原文本 (Old)</label>
                            <textarea
                                value={oldText}
                                onChange={(e) => setOldText(e.target.value)}
                                placeholder="在此输入旧文本..."
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    background: 'white',
                                    color: 'var(--foreground)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', opacity: 0.7 }}>新文本 (New)</label>
                            <textarea
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                                placeholder="在此输入新文本..."
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    background: 'white',
                                    color: 'var(--foreground)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                        <button
                            onClick={handleCompare}
                            style={{
                                background: 'var(--foreground)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 24px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'var(--font-sans)',
                                transition: 'opacity 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            对比差异
                        </button>
                        <button
                            onClick={handleClear}
                            style={{
                                background: 'white',
                                color: 'var(--foreground)',
                                border: '1px solid var(--border-color)',
                                padding: '10px 24px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'var(--font-sans)',
                            }}
                        >
                            清空
                        </button>
                    </div>

                    {diffResult.length > 0 && (
                        <div style={{
                            background: 'white',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-subtle)'
                        }}>
                            <div style={{
                                padding: '12px 16px',
                                background: 'var(--color-neutral-100)',
                                borderBottom: '1px solid var(--border-color)',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--foreground)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span>对比结果</span>
                                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', fontWeight: 400 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ width: '12px', height: '12px', background: '#dcfce7', border: '1px solid #166534' }}></span> 新增
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ width: '12px', height: '12px', background: '#fee2e2', border: '1px solid #991b1b' }}></span> 删除
                                    </span>
                                </div>
                            </div>
                            <div style={{
                                padding: '0',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '13px',
                                lineHeight: '1.6',
                                maxHeight: '600px',
                                overflowY: 'auto'
                            }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                                    <tbody>
                                        {diffResult.map((part, index) => {
                                            const bgColor = part.added ? '#dcfce7' : part.removed ? '#fee2e2' : 'transparent';
                                            const textColor = part.added ? '#166534' : part.removed ? '#991b1b' : 'var(--foreground)';
                                            const prefix = part.added ? '+' : part.removed ? '-' : ' ';

                                            return (
                                                <tr key={index} style={{ backgroundColor: bgColor, color: textColor }}>
                                                    <td style={{
                                                        width: '30px',
                                                        textAlign: 'center',
                                                        userSelect: 'none',
                                                        opacity: 0.5,
                                                        borderRight: '1px solid rgba(0,0,0,0.05)',
                                                        padding: '4px 0',
                                                        verticalAlign: 'top'
                                                    }}>
                                                        {prefix}
                                                    </td>
                                                    <td style={{
                                                        padding: '4px 12px',
                                                        whiteSpace: 'pre-wrap',
                                                        wordBreak: 'break-all'
                                                    }}>
                                                        {part.value}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
