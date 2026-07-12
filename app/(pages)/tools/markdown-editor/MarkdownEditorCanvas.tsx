'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from 'react-simple-code-editor';
import { Highlight } from 'prism-react-renderer';
import { Edit3, Eye, Columns, Terminal } from 'lucide-react';

const initialMarkdown = `# MARKDOWN_IDE_v1.0

## SYSTEM_OVERVIEW
Minimalist, high-performance Markdown editor with real-time feedback.

### FEATURES
- **TECHNICAL_CONTRAST**: Oklch-based color palette
- **STRUCTURAL_INTEGRITY**: Remark-GFM compliant
- **MONO_TYPOGRAPHY**: IBM Plex Mono for technical labels

\`\`\`javascript
const engine = "Markdown/Editor";
function render(input) {
  return parse(input);
}
\`\`\`

> NOTICE: Always verify structural coherence before export.

| COMPONENT | STATUS |
| :--- | :--- |
| Core Engine | OPERATIONAL |
| GFM Parser | ACTIVE |
| Previewer | ONLINE |
`;

const codeHighlightTheme = {
    plain: {
        color: 'oklch(0.145 0 0)',
        backgroundColor: 'transparent',
    },
    styles: [
        { types: ['comment'], style: { color: '#888', fontStyle: 'italic' } },
        { types: ['keyword', 'operator'], style: { color: 'oklch(0.145 0 0)', fontWeight: 'bold' } },
        { types: ['string', 'url', 'attr-value'], style: { color: '#ea580c' } },
        { types: ['function', 'property'], style: { color: 'oklch(0.145 0 0)' } },
        { types: ['number', 'boolean'], style: { color: '#ea580c' } },
        { types: ['tag', 'selector'], style: { color: 'oklch(0.145 0 0)' } },
    ],
};

export default function MarkdownEditorCanvas() {
    const [markdown, setMarkdown] = useState(initialMarkdown);
    const [activeTab, setActiveTab] = useState<'both' | 'edit' | 'preview'>('both');

    return (
        <>
            {/* View Controls */}
            <div className="flex bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] p-1.5 rounded-xl shadow-[4px_4px_0_oklch(0.145_0_0)] h-fit items-center">
                {[
                    { id: 'edit', label: 'EDIT_MODE', icon: Edit3 },
                    { id: 'both', label: 'SPLIT_VIEW', icon: Columns },
                    { id: 'preview', label: 'READ_ONLY', icon: Eye }
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-2 font-mono font-bold text-[10px] tracking-widest transition-all rounded-lg ${activeTab === tab.id
                                    ? 'bg-[oklch(0.145_0_0)] text-white'
                                    : 'hover:bg-neutral-100 text-neutral-400'
                                }`}
                        >
                            <Icon className="w-3 h-3" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className={`grid gap-8 items-start h-[calc(100vh-320px)] min-h-[700px] transition-all ${activeTab === 'both' ? 'grid-cols-2' : 'grid-cols-1'
                }`}>
                {(activeTab === 'both' || activeTab === 'edit') && (
                    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-2xl overflow-hidden shadow-[2px_2px_0_oklch(0.145_0_0)]">
                        <div className="px-6 py-4 border-b border-[oklch(0.145_0_0)] flex items-center justify-between bg-[#f5f5f5] dark:bg-neutral-800/50">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border border-[oklch(0.145_0_0)] rounded-sm" />
                                <span className="text-xs font-mono font-bold uppercase tracking-widest">Editor_Buffer</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-neutral-300" />
                                <div className="w-2 h-2 rounded-full bg-neutral-300" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto bg-white dark:bg-neutral-900">
                            <Editor
                                value={markdown}
                                onValueChange={setMarkdown}
                                highlight={code => (
                                    <Highlight theme={codeHighlightTheme as any} code={code} language="markdown">
                                        {({ tokens, getLineProps, getTokenProps }) => (
                                            <>
                                                {tokens.map((line, i) => (
                                                    <div key={i} {...getLineProps({ line })}>
                                                        <span className="inline-block w-8 text-[10px] font-mono opacity-20 select-none mr-4">{i + 1}</span>
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
                                    fontSize: 13,
                                    minHeight: '100%',
                                    outline: 'none',
                                }}
                                placeholder="// TYPE_MARKDOWN_HERE..."
                            />
                        </div>
                    </div>
                )}

                {(activeTab === 'both' || activeTab === 'preview') && (
                    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-2xl overflow-hidden shadow-[2px_2px_0_oklch(0.145_0_0)]">
                        <div className="px-6 py-4 border-b border-[oklch(0.145_0_0)] flex items-center justify-between bg-[#f5f5f5] dark:bg-neutral-800/50">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border border-[oklch(0.145_0_0)] bg-[oklch(0.145_0_0)] rounded-sm" />
                                <span className="text-xs font-mono font-bold uppercase tracking-widest">Rendered_View</span>
                            </div>
                            <Terminal className="w-4 h-4 opacity-40" />
                        </div>
                        <div className="flex-1 overflow-auto p-12 bg-white dark:bg-neutral-900 markdown-body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {markdown}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-between items-center text-[10px] font-mono opacity-40 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-4">
                    <span>LENGTH: {markdown.length}</span>
                    <span>LINES: {markdown.split('\n').length}</span>
                </div>
                <span>SYNC_STATUS: ENCRYPTED_LOCAL_SAVE</span>
            </div>

            <style jsx global>{`
                .markdown-body {
                    color: oklch(0.145 0 0);
                    line-height: 1.6;
                }
                .markdown-body h1, .markdown-body h2, .markdown-body h3 {
                    font-weight: 900;
                    letter-spacing: -0.02em;
                    text-transform: uppercase;
                    border-bottom: 2px solid oklch(0.145 0 0);
                    padding-bottom: 0.5rem;
                    margin-bottom: 1.5rem;
                    margin-top: 2rem;
                    color: oklch(0.145 0 0);
                }
                .markdown-body h1 { font-size: 2rem; }
                .markdown-body h2 { font-size: 1.5rem; }
                .markdown-body h3 { font-size: 1.25rem; }
                .markdown-body p { margin-bottom: 1rem; }
                .markdown-body ul, .markdown-body ol { margin-bottom: 1rem; padding-left: 1.5rem; }
                .markdown-body li { margin-bottom: 0.25rem; }
                .markdown-body blockquote {
                    padding: 1.5rem;
                    background: #f5f5f5;
                    border: 1px solid oklch(0.145 0 0);
                    border-left-width: 6px;
                    border-left-color: #ea580c;
                    border-radius: 8px;
                    margin: 2rem 0;
                    font-style: italic;
                    color: oklch(0.145 0 0 / 0.7);
                }
                .markdown-body code:not(pre code) {
                    background: #ea580c;
                    color: white;
                    padding: 0.2rem 0.4rem;
                    border-radius: 4px;
                    font-size: 0.85em;
                }
                .markdown-body pre {
                    background: white;
                    border: 1px solid oklch(0.145 0 0);
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin: 1.5rem 0;
                    overflow: auto;
                    box-shadow: 4px 4px 0 oklch(0.145 0 0);
                }
                .markdown-body table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 2rem 0;
                    font-size: 0.9em;
                }
                .markdown-body th, .markdown-body td {
                    border: 1px solid oklch(0.145 0 0);
                    padding: 0.75rem 1rem;
                    text-align: left;
                }
                .markdown-body th {
                    background: oklch(0.145 0 0);
                    color: white;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .markdown-body hr {
                    border: none;
                    border-top: 1px dashed oklch(0.145 0 0);
                    margin: 3rem 0;
                }
            `}</style>
        </>
    );
}
