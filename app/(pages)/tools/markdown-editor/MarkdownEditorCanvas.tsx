'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from 'react-simple-code-editor';
import { Highlight } from 'prism-react-renderer';
import {
    Edit3, Eye, Columns, Bold, Italic, Link2, Code2,
    List, ListOrdered, Heading1, Heading2, Quote,
    Download, Copy, Check, PanelLeftOpen, PanelLeftClose,
    FileText
} from 'lucide-react';

const codeHighlightTheme = {
    plain: { color: 'oklch(0.32 0 0)', backgroundColor: 'transparent' },
    styles: [
        { types: ['comment'], style: { color: '#9ca3af', fontStyle: 'italic' } },
        { types: ['keyword', 'operator'], style: { color: '#ea580c', fontWeight: 'bold' } },
        { types: ['string', 'url', 'attr-value'], style: { color: '#ea580c' } },
        { types: ['function', 'property'], style: { color: '#7c3aed' } },
        { types: ['number', 'boolean'], style: { color: '#2563eb' } },
        { types: ['tag', 'selector'], style: { color: '#ea580c' } },
    ],
};

const initialMarkdown = `# Markdown Editor

A minimalist editor with **real-time preview** and useful features.

## Features

- **Live preview** with GFM support
- **Toolbar** for quick formatting
- **Table of contents** sidebar
- **Export** to HTML

### Code Example

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

### Table

| Feature | Status |
| :--- | :--- |
| Live Preview | Active |
| GFM Support | Enabled |
| Export HTML | Ready |

> This is a blockquote. Useful for notes and callouts.

---

*Enjoy writing!*
`;

interface TocItem { id: string; text: string; level: number; }

function extractToc(md: string): TocItem[] {
    const items: TocItem[] = [];
    const lines = md.split('\n');
    for (const line of lines) {
        const match = line.match(/^(#{1,6})\s+(.+)/);
        if (match) {
            const level = match[1].length;
            const text = match[2].replace(/[*_`\[\]()]/g, '').trim();
            const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
            items.push({ id, text, level });
        }
    }
    return items;
}

type ViewMode = 'both' | 'edit' | 'preview';

export default function MarkdownEditorCanvas() {
    const [markdown, setMarkdown] = useState(initialMarkdown);
    const [viewMode, setViewMode] = useState<ViewMode>('both');
    const [showToc, setShowToc] = useState(true);
    const [copied, setCopied] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    const toc = useMemo(() => extractToc(markdown), [markdown]);

    const insertMarkdown = useCallback((before: string, after: string = '') => {
        const textarea = document.querySelector('.md-editor textarea') as HTMLTextAreaElement;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = markdown.substring(start, end);
        const newMd = markdown.substring(0, start) + before + selected + after + markdown.substring(end);
        setMarkdown(newMd);
    }, [markdown]);

    const toolbarActions = useMemo(() => [
        { icon: Heading1, action: () => insertMarkdown('## ', ''), title: 'Heading' },
        { icon: Bold, action: () => insertMarkdown('**', '**'), title: 'Bold' },
        { icon: Italic, action: () => insertMarkdown('*', '*'), title: 'Italic' },
        { icon: Code2, action: () => insertMarkdown('`', '`'), title: 'Code' },
        { icon: Link2, action: () => insertMarkdown('[', '](url)'), title: 'Link' },
        { icon: List, action: () => insertMarkdown('- ', ''), title: 'Unordered list' },
        { icon: ListOrdered, action: () => insertMarkdown('1. ', ''), title: 'Ordered list' },
        { icon: Quote, action: () => insertMarkdown('> ', ''), title: 'Quote' },
    ], [insertMarkdown]);

    const handleExportHtml = useCallback(() => {
        const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Markdown Export</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#333}
h1,h2,h3{margin-top:1.5em;margin-bottom:0.5em}code{background:#f0f0f0;padding:0.2em 0.4em;border-radius:3px}
pre{background:#f5f5f5;padding:1rem;border-radius:6px;overflow-x:auto}blockquote{border-left:4px solid #ea580c;padding:0.5em 1em;margin:1em 0;color:#666}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:0.5em 1em;text-align:left}th{background:#f5f5f5}</style>
</head><body>${previewRef.current?.innerHTML || ''}</body></html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'document.html'; a.click();
        URL.revokeObjectURL(url);
    }, []);

    const handleCopyMd = useCallback(async () => {
        await navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [markdown]);

    const scrollToHeading = useCallback((id: string) => {
        const el = previewRef.current?.querySelector(`[data-heading="${id}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const lineCount = markdown.split('\n').length;
    const gutterWidth = Math.max(3, String(lineCount).length) * 8 + 24;

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--background)] border-b border-[var(--border-color)] shrink-0">
                <div className="flex items-center gap-1">
                    <button onClick={() => setShowToc(!showToc)}
                        className="p-1.5 text-[var(--foreground)] opacity-20 hover:opacity-50 transition-opacity" title="Toggle TOC">
                        {showToc ? <PanelLeftClose size={13} /> : <PanelLeftOpen size={13} />}
                    </button>
                    <div className="w-px h-3 bg-[var(--border-color)] mx-1" />
                    {toolbarActions.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <button key={i} onClick={item.action}
                                className="p-1.5 text-[var(--foreground)] opacity-20 hover:opacity-50 hover:bg-black/5 rounded transition-all" title={item.title}>
                                <Icon size={13} />
                            </button>
                        );
                    })}
                </div>
                <div className="flex items-center gap-1">
                    {(['edit', 'both', 'preview'] as ViewMode[]).map(mode => (
                        <button key={mode} onClick={() => setViewMode(mode)}
                            className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-colors ${
                                viewMode === mode ? 'bg-[var(--foreground)] text-white' : 'text-[var(--foreground)] opacity-25 hover:opacity-50 hover:bg-black/5'
                            }`}>
                            {mode === 'edit' ? <><Edit3 size={10} />Edit</> : mode === 'both' ? <><Columns size={10} />Split</> : <><Eye size={10} />Preview</>}
                        </button>
                    ))}
                    <div className="w-px h-3 bg-[var(--border-color)] mx-1" />
                    <button onClick={handleCopyMd} className="p-1.5 text-[var(--foreground)] opacity-20 hover:opacity-50 transition-opacity" title="Copy markdown">
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                    <button onClick={handleExportHtml} className="p-1.5 text-[var(--foreground)] opacity-20 hover:opacity-50 transition-opacity" title="Export HTML">
                        <Download size={13} />
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex min-h-0">
                {/* TOC sidebar */}
                {showToc && toc.length > 0 && (
                    <div className="w-48 shrink-0 bg-[var(--background)] border-r border-[var(--border-color)] flex flex-col">
                        <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-[var(--foreground)] opacity-20 uppercase tracking-wider border-b border-[var(--border-color)]">
                            TOC
                        </div>
                        <div className="flex-1 overflow-y-auto py-1">
                            {toc.map((item, i) => (
                                <button key={i} onClick={() => scrollToHeading(item.id)}
                                    className="w-full text-left px-3 py-1 text-[11px] font-mono text-[var(--foreground)] opacity-30 hover:opacity-70 hover:bg-black/5 transition-all truncate"
                                    style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}>
                                    {item.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Editor */}
                {(viewMode === 'both' || viewMode === 'edit') && (
                    <div className="md-editor flex-1 flex min-w-0 border-r border-[var(--border-color)]">
                        <div className="shrink-0 bg-white text-right select-none overflow-hidden" style={{ width: gutterWidth, fontSize: 13, lineHeight: '1.6', fontFamily: 'var(--font-mono)' }}>
                            <div className="pt-4">
                                {Array.from({ length: lineCount }, (_, i) => (
                                    <div key={i} className="text-[var(--foreground)] opacity-15 pr-3">{i + 1}</div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto min-w-0 bg-white">
                            <Editor
                                value={markdown}
                                onValueChange={setMarkdown}
                                highlight={code => (
                                    <Highlight theme={codeHighlightTheme as any} code={code} language="markdown">
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
                )}

                {/* Preview */}
                {(viewMode === 'both' || viewMode === 'preview') && (
                    <div ref={previewRef} className="flex-1 overflow-auto min-w-0 bg-white mdx-content" style={{ padding: '24px 32px' }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                            h1: ({ children, ...props }: any) => <h1 data-heading={String(children).toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '')} {...props}>{children}</h1>,
                            h2: ({ children, ...props }: any) => <h2 data-heading={String(children).toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '')} {...props}>{children}</h2>,
                            h3: ({ children, ...props }: any) => <h3 data-heading={String(children).toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '')} {...props}>{children}</h3>,
                        }}>
                            {markdown}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            {/* Status bar */}
            <div className="px-4 py-1 bg-[var(--background)] border-t border-[var(--border-color)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--foreground)] opacity-15">
                    <span>{markdown.length} chars</span>
                    <span>{lineCount} lines</span>
                    <span>{toc.length} headings</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--foreground)] opacity-10">GFM</span>
            </div>
        </div>
    );
}
