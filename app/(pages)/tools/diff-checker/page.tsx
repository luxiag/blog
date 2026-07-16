'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { diffLines, diffChars, Change } from 'diff';
import {
    Copy, Check, Trash2, ArrowRightLeft, Rows, Columns,
    CaseSensitive, Space, FileText
} from 'lucide-react';

type ViewMode = 'unified' | 'side-by-side';

function highlightCharDiff(oldStr: string, newStr: string): { oldParts: { text: string; changed: boolean }[]; newParts: { text: string; changed: boolean }[] } {
    const charChanges = diffChars(oldStr, newStr);
    const oldParts: { text: string; changed: boolean }[] = [];
    const newParts: { text: string; changed: boolean }[] = [];
    for (const part of charChanges) {
        if (part.added) newParts.push({ text: part.value, changed: true });
        else if (part.removed) oldParts.push({ text: part.value, changed: true });
        else { oldParts.push({ text: part.value, changed: false }); newParts.push({ text: part.value, changed: false }); }
    }
    return { oldParts, newParts };
}

export default function DiffCheckerPage() {
    const [oldText, setOldText] = useState('');
    const [newText, setNewText] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
    const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
    const [ignoreCase, setIgnoreCase] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const preprocess = useCallback((text: string) => {
        let result = text;
        if (ignoreWhitespace) result = result.replace(/\s+/g, ' ').trim();
        if (ignoreCase) result = result.toLowerCase();
        return result;
    }, [ignoreWhitespace, ignoreCase]);

    const changes = useMemo(() => {
        if (!oldText && !newText) return [];
        return diffLines(preprocess(oldText), preprocess(newText));
    }, [oldText, newText, preprocess]);

    const stats = useMemo(() => {
        let added = 0, removed = 0, unchanged = 0;
        for (const c of changes) {
            const lineCount = c.value.split('\n').filter((_, i, arr) => i < arr.length - 1 || arr[i] !== '').length;
            if (c.added) added += lineCount;
            else if (c.removed) removed += lineCount;
            else unchanged += lineCount;
        }
        return { added, removed, unchanged };
    }, [changes]);

    const handleCopy = useCallback(async (text: string, id: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    }, []);

    const handleSwap = useCallback(() => {
        setOldText(newText);
        setNewText(oldText);
    }, [oldText, newText]);

    const handleLoadSample = useCallback(() => {
        setOldText(`function greet(name) {
  console.log("Hello, " + name);
  return true;
}

const users = ["Alice", "Bob", "Charlie"];
for (const user of users) {
  greet(user);
}`);
        setNewText(`function greet(name: string): boolean {
  console.log(\`Hello, \${name}!\`);
  return true;
}

const users = ["Alice", "Bob", "Charlie", "Diana"];
for (const user of users) {
  greet(user);
}

// Added export
export { greet };`);
    }, []);

    const lineNums = useMemo(() => {
        let oldLine = 0, newLine = 0;
        return changes.map(c => {
            const lines = c.value.split('\n');
            const count = lines.length - (lines[lines.length - 1] === '' ? 1 : 0);
            const nums = { oldStart: c.removed ? oldLine + 1 : (c.added ? null : oldLine + 1), newStart: c.added ? newLine + 1 : (c.removed ? null : newLine + 1), count };
            if (!c.added) oldLine += count;
            if (!c.removed) newLine += count;
            return nums;
        });
    }, [changes]);

    const unifiedLines = useMemo(() => {
        let oldLine = 0, newLine = 0;
        const result: { type: 'same' | 'added' | 'removed'; oldNum: number | null; newNum: number | null; text: string }[] = [];
        for (const c of changes) {
            const lines = c.value.split('\n');
            for (const line of lines) {
                if (line === '' && lines.indexOf(line) === lines.length - 1) continue;
                if (c.added) { newLine++; result.push({ type: 'added', oldNum: null, newNum: newLine, text: line }); }
                else if (c.removed) { oldLine++; result.push({ type: 'removed', oldNum: oldLine, newNum: null, text: line }); }
                else { oldLine++; newLine++; result.push({ type: 'same', oldNum: oldLine, newNum: newLine, text: line }); }
            }
        }
        return result;
    }, [changes]);

    const sideBySideLines = useMemo(() => {
        const left: { type: 'same' | 'removed'; num: number; text: string }[] = [];
        const right: { type: 'same' | 'added'; num: number; text: string }[] = [];
        let oldLine = 0, newLine = 0;
        for (const c of changes) {
            const lines = c.value.split('\n');
            for (const line of lines) {
                if (line === '' && lines.indexOf(line) === lines.length - 1) continue;
                if (c.added) { newLine++; right.push({ type: 'added', num: newLine, text: line }); }
                else if (c.removed) { oldLine++; left.push({ type: 'removed', num: oldLine, text: line }); }
                else { oldLine++; newLine++; left.push({ type: 'same', num: oldLine, text: line }); right.push({ type: 'same', num: newLine, text: line }); }
            }
        }
        const maxLen = Math.max(left.length, right.length);
        while (left.length < maxLen) left.push({ type: 'same', num: 0, text: '' });
        while (right.length < maxLen) right.push({ type: 'same', num: 0, text: '' });
        return { left, right };
    }, [changes]);

    const hasContent = oldText || newText;
    const hasDiff = changes.length > 0 && (stats.added > 0 || stats.removed > 0);

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
                    <span className="text-[12px] font-mono text-[var(--foreground)] opacity-50">Diff Checker</span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setViewMode('side-by-side')}
                        className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-colors ${viewMode === 'side-by-side' ? 'bg-[var(--foreground)] text-white' : 'text-[var(--foreground)] opacity-25 hover:opacity-50 hover:bg-black/5'}`}>
                        <Columns size={11} />Side by Side
                    </button>
                    <button onClick={() => setViewMode('unified')}
                        className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-colors ${viewMode === 'unified' ? 'bg-[var(--foreground)] text-white' : 'text-[var(--foreground)] opacity-25 hover:opacity-50 hover:bg-black/5'}`}>
                        <Rows size={11} />Unified
                    </button>
                    <div className="w-px h-3 bg-[var(--border-color)] mx-1" />
                    <button onClick={() => setIgnoreCase(!ignoreCase)}
                        className={`p-1.5 rounded transition-colors ${ignoreCase ? 'bg-[#ea580c] text-white' : 'text-[var(--foreground)] opacity-20 hover:opacity-50'}`} title="Ignore case">
                        <CaseSensitive size={13} />
                    </button>
                    <button onClick={() => setIgnoreWhitespace(!ignoreWhitespace)}
                        className={`p-1.5 rounded transition-colors ${ignoreWhitespace ? 'bg-[#ea580c] text-white' : 'text-[var(--foreground)] opacity-20 hover:opacity-50'}`} title="Ignore whitespace">
                        <Space size={13} />
                    </button>
                    <div className="w-px h-3 bg-[var(--border-color)] mx-1" />
                    <button onClick={handleLoadSample} className="p-1.5 text-[var(--foreground)] opacity-20 hover:opacity-50 transition-opacity" title="Load sample">
                        <FileText size={13} />
                    </button>
                </div>
            </div>

            {/* Editor area */}
            <div className="flex-1 flex min-h-0">
                <div className={`flex ${viewMode === 'side-by-side' || !hasDiff ? 'flex-1' : 'h-[40%] shrink-0'}`}>
                    <div className="flex-1 flex flex-col min-w-0 border-r border-[var(--border-color)]">
                        <div className="px-3 py-1.5 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--background)] shrink-0">
                            <span className="text-[10px] font-mono font-bold text-[var(--foreground)] opacity-20 uppercase tracking-wider">Original</span>
                            <div className="flex items-center gap-1">
                                <button onClick={handleSwap} className="p-1 text-[var(--foreground)] opacity-15 hover:opacity-40 transition-opacity" title="Swap">
                                    <ArrowRightLeft size={11} />
                                </button>
                                <button onClick={() => setOldText('')} className="p-1 text-[var(--foreground)] opacity-15 hover:opacity-40 transition-opacity" title="Clear">
                                    <Trash2 size={11} />
                                </button>
                            </div>
                        </div>
                        <textarea value={oldText} onChange={(e) => setOldText(e.target.value)}
                            placeholder="Paste original text..."
                            className="w-full flex-1 p-4 font-mono text-[13px] leading-[1.6] resize-none outline-none text-[var(--foreground)] opacity-70 bg-white selection:bg-orange-500/20 min-h-0" />
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="px-3 py-1.5 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--background)] shrink-0">
                            <span className="text-[10px] font-mono font-bold text-[var(--foreground)] opacity-20 uppercase tracking-wider">Modified</span>
                            <button onClick={() => setNewText('')} className="p-1 text-[var(--foreground)] opacity-15 hover:opacity-40 transition-opacity" title="Clear">
                                <Trash2 size={11} />
                            </button>
                        </div>
                        <textarea value={newText} onChange={(e) => setNewText(e.target.value)}
                            placeholder="Paste modified text..."
                            className="w-full flex-1 p-4 font-mono text-[13px] leading-[1.6] resize-none outline-none text-[var(--foreground)] opacity-70 bg-white selection:bg-orange-500/20 min-h-0" />
                    </div>
                </div>
            </div>

            {/* Diff result */}
            {hasDiff && (
                <div className="border-t border-[var(--border-color)] flex flex-col shrink-0" style={{ height: viewMode === 'side-by-side' ? '0px' : '50%' }}>
                    <div className="px-3 py-1.5 flex items-center justify-between bg-[var(--background)] border-b border-[var(--border-color)] shrink-0">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono font-bold text-[var(--foreground)] opacity-20 uppercase tracking-wider">Result</span>
                            <div className="flex items-center gap-3 text-[10px] font-mono">
                                <span className="text-green-600">+{stats.added}</span>
                                <span className="text-red-500">-{stats.removed}</span>
                                <span className="text-[var(--foreground)] opacity-20">{stats.unchanged} same</span>
                            </div>
                        </div>
                        <button onClick={() => {
                            const text = unifiedLines.map(l => `${l.type === 'added' ? '+' : l.type === 'removed' ? '-' : ' '} ${l.text}`).join('\n');
                            handleCopy(text, 'diff');
                        }} className="p-1 text-[var(--foreground)] opacity-15 hover:opacity-40 transition-opacity" title="Copy diff">
                            {copied === 'diff' ? <Check size={11} /> : <Copy size={11} />}
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto min-h-0 font-mono text-[12px] leading-[1.5]">
                        {viewMode === 'unified' && unifiedLines.map((line, i) => (
                            <div key={i} className={`flex ${line.type === 'added' ? 'bg-green-50' : line.type === 'removed' ? 'bg-red-50' : ''}`}>
                                <span className="w-10 shrink-0 text-right pr-2 text-[var(--foreground)] opacity-15 select-none">{line.oldNum ?? ''}</span>
                                <span className="w-10 shrink-0 text-right pr-2 text-[var(--foreground)] opacity-15 select-none border-l border-[var(--border-color)]">{line.newNum ?? ''}</span>
                                <span className={`w-5 shrink-0 text-center select-none ${line.type === 'added' ? 'text-green-600' : line.type === 'removed' ? 'text-red-500' : 'text-[var(--foreground)] opacity-15'}`}>
                                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                                </span>
                                <span className={`${line.type === 'added' ? 'text-green-700' : line.type === 'removed' ? 'text-red-600' : 'text-[var(--foreground)] opacity-50'}`}>
                                    {line.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
