'use client';

import { useState } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const initialMarkdown = `# Markdown 编辑器

这是一个实时预览的 Markdown 编辑器。

## 支持的特性
- **加粗** 和 *斜体*
- [链接](https://luxiag.blog)
- 代码块: \`const foo = "bar";\`
- 列表:
  1. 第一项
  2. 第二项
- 表格:

| 标题 | 描述 |
| :--- | :--- |
| EF Core | .NET ORM |
| LINQ | 查询语言 |

---

> 这是一个引用。

![图片示例](https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=150&q=80)
`;

import Editor from 'react-simple-code-editor';
import { Highlight, themes } from 'prism-react-renderer';

const codeHighlightTheme = {
    plain: {
        color: 'var(--hljs-fg)',
        backgroundColor: 'transparent',
    },
    styles: [
        {
            types: ['comment', 'prolog', 'doctype', 'cdata'],
            style: { color: 'var(--hljs-comment)' },
        },
        {
            types: ['punctuation'],
            style: { color: 'var(--hljs-operator)' },
        },
        {
            types: ['namespace'],
            style: { opacity: 0.7 },
        },
        {
            types: ['tag', 'operator', 'number'],
            style: { color: 'var(--hljs-number)' },
        },
        {
            types: ['property', 'function'],
            style: { color: 'var(--hljs-function)' },
        },
        {
            types: ['tag-id', 'selector', 'atrule-id'],
            style: { color: 'var(--hljs-symbol)' },
        },
        {
            types: ['attr-name'],
            style: { color: 'var(--hljs-attribute)' },
        },
        {
            types: ['boolean', 'string', 'entity', 'url', 'attr-value', 'keyword', 'control', 'directive', 'unit', 'statement', 'regex', 'at-rule', 'placeholder', 'variable'],
            style: { color: 'var(--hljs-keyword)' },
        },
        {
            types: ['tag'],
            style: { color: 'var(--hljs-tag)' }
        },
        {
            types: ['attr-value'],
            style: { color: 'var(--hljs-string)' }
        }
    ],
};

export default function MarkdownEditorPage() {
    const [markdown, setMarkdown] = useState(initialMarkdown);
    const [activeTab, setActiveTab] = useState<'both' | 'edit' | 'preview'>('both');

    return (
        <>
            <PageTitle title="Markdown 编辑器" />
            <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
                <div className="max-w-7xl mx-auto px-4" style={{ padding: '48px 24px' }}>
                    <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link
                            href="/tools"
                            className="inline-flex items-center transition-colors"
                            style={{ color: 'var(--color-orange-800)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            返回工具箱
                        </Link>

                        <div style={{ display: 'flex', background: 'white', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <button
                                onClick={() => setActiveTab('edit')}
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '13px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: activeTab === 'edit' ? 'var(--foreground)' : 'transparent',
                                    color: activeTab === 'edit' ? 'white' : 'var(--foreground)'
                                }}
                            >
                                编辑
                            </button>
                            <button
                                onClick={() => setActiveTab('both')}
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '13px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: activeTab === 'both' ? 'var(--foreground)' : 'transparent',
                                    color: activeTab === 'both' ? 'white' : 'var(--foreground)'
                                }}
                            >
                                分屏
                            </button>
                            <button
                                onClick={() => setActiveTab('preview')}
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '13px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: activeTab === 'preview' ? 'var(--foreground)' : 'transparent',
                                    color: activeTab === 'preview' ? 'white' : 'var(--foreground)'
                                }}
                            >
                                预览
                            </button>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: activeTab === 'both' ? '1fr 1fr' : '1fr',
                        gap: '24px',
                        height: 'calc(100vh - 250px)',
                        minHeight: '600px'
                    }}>
                        {/* 编辑器 */}
                        {(activeTab === 'both' || activeTab === 'edit') && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'white',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                overflow: 'auto',
                                boxShadow: 'var(--shadow-subtle)'
                            }}>
                                <Editor
                                    value={markdown}
                                    onValueChange={setMarkdown}
                                    highlight={code => (
                                        <Highlight theme={codeHighlightTheme as any} code={code} language="markdown">
                                            {({ tokens, getLineProps, getTokenProps }) => (
                                                <>
                                                    {tokens.map((line, i) => (
                                                        <div key={i} {...getLineProps({ line })}>
                                                            {line.map((token, key) => (
                                                                <span key={key} {...getTokenProps({ token })} />
                                                            ))}
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </Highlight>
                                    )}
                                    padding={24}
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: 14,
                                        minHeight: '100%',
                                        outline: 'none',
                                    }}
                                    placeholder="在此输入 Markdown 内容..."
                                />
                            </div>
                        )}

                        {/* 预览 */}
                        {(activeTab === 'both' || activeTab === 'preview') && (
                            <div style={{
                                background: 'white',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                padding: '24px',
                                overflowY: 'auto',
                                boxShadow: 'var(--shadow-subtle)',
                                backgroundColor: '#ffffff'
                            }}>
                                <div className="markdown-body" style={{ color: 'var(--foreground)' }}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {markdown}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .markdown-body h1 { fontSize: 2em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; margin-bottom: 16px; margin-top: 0; }
        .markdown-body h2 { fontSize: 1.5em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; margin-bottom: 16px; margin-top: 24px; }
        .markdown-body h3 { fontSize: 1.25em; margin-bottom: 16px; margin-top: 24px; }
        .markdown-body p { margin-bottom: 16px; line-height: 1.6; }
        .markdown-body ul, .markdown-body ol { padding-left: 2em; margin-bottom: 16px; }
        .markdown-body blockquote { border-left: 4px solid var(--color-orange-800); padding-left: 16px; color: var(--color-neutral-500); margin: 16px 0; }
        .markdown-body code { background: var(--color-neutral-100); padding: 2px 4px; borderRadius: 4px; font-family: var(--font-mono); font-size: 0.9em; }
        .markdown-body pre { background: var(--color-neutral-100); padding: 16px; borderRadius: 8px; margin-bottom: 16px; overflow: auto; }
        .markdown-body table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
        .markdown-body th, .markdown-body td { border: 1px solid var(--border-color); padding: 8px 12px; }
        .markdown-body th { background: var(--color-neutral-500); }
        .markdown-body hr { height: 1px; background: var(--border-color); border: none; margin: 24px 0; }
        .markdown-body img { max-width: 100%; height: auto; border-radius: 8px; }
      `}</style>
        </>
    );
}
