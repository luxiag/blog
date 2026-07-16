'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
    FileText, Upload, Trash2, Play, Copy, Check, Download,
    AlertCircle, FileCode, Loader2, FileDigit, ArrowRight
} from 'lucide-react';

export default function PdfToMdPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [markdown, setMarkdown] = useState('');
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        if (selectedFile.type !== 'application/pdf') {
            setError('Please select a PDF file');
            return;
        }
        setFile(selectedFile);
        setError('');
        setMarkdown('');
        setCopied(false);
    }, []);

    const convertToMarkdown = (text: string, fileName: string) => {
        const cleanFileName = fileName.replace(/\.[^/.]+$/, '');
        let md = `# ${cleanFileName}\n\n`;
        md += `> Source: ${fileName}\n`;
        md += `> Date: ${new Date().toISOString().split('T')[0]}\n\n`;
        md += `---\n\n`;

        const rawLines = text.split('\n');
        let processedMd = '';
        let currentParagraph = '';

        for (let i = 0; i < rawLines.length; i++) {
            const line = rawLines[i].trim();
            if (!line) {
                if (currentParagraph) {
                    processedMd += currentParagraph + '\n\n';
                    currentParagraph = '';
                }
                continue;
            }

            const isLikelyHeader = line.length < 60 && !/[.!?]$/.test(line) && (
                /^[A-Z0-9\s]+$/.test(line) ||
                /^(第[一二三四五六七八九十]+[章节]|CHAPTER|Section|索引|目录|内容)/i.test(line) ||
                /^\d+(\.\d+)*\s+[A-Z\u4e00-\u9fa5]/i.test(line)
            );

            const isOrderedList = /^\d+\.\s/.test(line);
            const isUnorderedList = /^([*\-•])\s/.test(line);

            if (isLikelyHeader) {
                if (currentParagraph) { processedMd += currentParagraph + '\n\n'; currentParagraph = ''; }
                processedMd += `## ${line}\n\n`;
            } else if (isOrderedList || isUnorderedList) {
                if (currentParagraph) { processedMd += currentParagraph + '\n\n'; currentParagraph = ''; }
                processedMd += `${line}\n`;
            } else {
                if (currentParagraph) {
                    currentParagraph += ' ' + line;
                } else {
                    currentParagraph = line;
                }
                const nextLine = rawLines[i + 1]?.trim() || '';
                const endsWithPunctuation = /[.!?。！？]$/.test(line);
                if (endsWithPunctuation || !nextLine) {
                    processedMd += currentParagraph + '\n\n';
                    currentParagraph = '';
                }
            }
        }

        if (currentParagraph) processedMd += currentParagraph + '\n\n';
        return md + processedMd;
    };

    const processPdf = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError('');
        setProgress(10);

        try {
            const arrayBuffer = await file.arrayBuffer();
            setProgress(25);

            const { PDFParse } = await import('pdf-parse');
            PDFParse.setWorker(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/js/pdf.worker.min.mjs`);
            setProgress(40);

            const parser = new PDFParse({ data: arrayBuffer });
            const textResult = await parser.getText();
            setProgress(75);

            const md = convertToMarkdown(textResult.text, file.name);
            setMarkdown(md);
            setProgress(100);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to parse PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(markdown);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };

    const downloadMarkdown = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file?.name.replace(/\.[^/.]+$/, '') || 'document'}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const wordCount = markdown.length;
    const lineCount = markdown ? markdown.split('\n').length : 0;

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
                    <span className="text-[12px] font-mono text-[var(--foreground)] opacity-50">PDF → Markdown</span>
                </div>
                <div className="flex items-center gap-3">
                    {markdown && (
                        <>
                            <button onClick={copyToClipboard}
                                className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-[var(--foreground)] opacity-30 hover:opacity-60 hover:bg-black/5 rounded transition-all">
                                {copied ? <Check size={11} /> : <Copy size={11} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                            <button onClick={downloadMarkdown}
                                className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-[var(--foreground)] opacity-30 hover:opacity-60 hover:bg-black/5 rounded transition-all">
                                <Download size={11} />
                                Download .md
                            </button>
                        </>
                    )}
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                </div>
            </div>

            {/* Main content - split layout */}
            <div className="flex-1 flex min-h-0">
                {/* Left: Input */}
                <div className="w-[360px] shrink-0 border-r border-[var(--border-color)] flex flex-col bg-[var(--background)]">
                    <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-[var(--foreground)] opacity-30 uppercase tracking-wider border-b border-[var(--border-color)]">
                        Input
                    </div>
                    <div className="flex-1 p-4 flex flex-col">
                        {/* Drop zone */}
                        <div
                            className={`flex-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer min-h-[200px] ${
                                isDragOver
                                    ? 'border-[#ea580c] bg-[#ea580c]/5'
                                    : file
                                        ? 'border-[var(--border-color)] bg-white'
                                        : 'border-[var(--border-color)] bg-white hover:border-[var(--foreground)] hover:border-opacity-30'
                            }`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragOver(false);
                                const droppedFile = e.dataTransfer.files[0];
                                if (droppedFile?.type === 'application/pdf') {
                                    setFile(droppedFile);
                                    setError('');
                                    setMarkdown('');
                                } else if (droppedFile) {
                                    setError('Please select a PDF file');
                                }
                            }}
                            onClick={() => !file && fileInputRef.current?.click()}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".pdf" />

                            {!file ? (
                                <>
                                    <div className="w-16 h-16 rounded-full border border-dashed border-[var(--border-color)] flex items-center justify-center mb-4">
                                        <Upload className="w-6 h-6 text-[var(--foreground)] opacity-30" />
                                    </div>
                                    <p className="text-[11px] font-mono text-[var(--foreground)] opacity-30 mb-3">Drop PDF here or click to browse</p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                        className="px-4 py-1.5 bg-[var(--foreground)] text-white text-[11px] font-mono font-bold rounded-md hover:opacity-90 transition-opacity">
                                        Select PDF
                                    </button>
                                </>
                            ) : (
                                <>
                                    <FileText className="w-8 h-8 text-[#ea580c] mb-3" />
                                    <p className="text-[12px] font-mono text-[var(--foreground)] opacity-70 truncate max-w-[260px] mb-1">{file.name}</p>
                                    <p className="text-[10px] font-mono text-[var(--foreground)] opacity-25">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                </>
                            )}
                        </div>

                        {/* File info + actions */}
                        {file && (
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between px-3 py-2 bg-white rounded border border-[var(--border-color)]">
                                    <span className="text-[11px] font-mono text-[var(--foreground)] opacity-40 truncate flex-1">{file.name}</span>
                                    <button onClick={() => { setFile(null); setMarkdown(''); setError(''); }}
                                        className="p-1 text-[var(--foreground)] opacity-30 hover:opacity-50 hover:text-red-500 transition-all shrink-0 ml-2">
                                        <Trash2 size={12} />
                                    </button>
                                </div>

                                <button
                                    onClick={processPdf}
                                    disabled={isProcessing}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ea580c] hover:bg-[#d94f04] disabled:bg-black/10 disabled:text-white/30 text-white text-[11px] font-mono font-bold rounded-md transition-colors">
                                    {isProcessing ? (
                                        <><Loader2 className="w-3.5 h-3.5 animate-spin" />Processing {progress}%</>
                                    ) : (
                                        <><Play size={12} className="fill-current" />Convert to Markdown</>
                                    )}
                                </button>

                                {isProcessing && (
                                    <div className="w-full h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#ea580c] transition-all duration-300" style={{ width: `${progress}%` }} />
                                    </div>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200/50 rounded-md">
                                <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                <span className="text-[11px] font-mono text-red-600/80">{error}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Output */}
                <div className="flex-1 flex flex-col min-w-0 bg-white">
                    <div className="px-3 py-1.5 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--background)] shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-[var(--foreground)] opacity-30 uppercase tracking-wider">Output</span>
                            {markdown && (
                                <span className="text-[10px] font-mono text-[var(--foreground)] opacity-30">
                                    {wordCount.toLocaleString()} chars · {lineCount} lines
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${markdown ? 'bg-[#ea580c]' : isProcessing ? 'bg-amber-400 animate-pulse' : 'bg-[var(--foreground)] opacity-10'}`} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto min-h-0 relative">
                        {!markdown && !isProcessing && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--foreground)] opacity-30 select-none">
                                <FileCode className="w-16 h-16 mb-3" />
                                <p className="text-[11px] font-mono font-bold tracking-wider uppercase">Awaiting Input</p>
                            </div>
                        )}

                        {isProcessing && !markdown && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                                <div className="w-8 h-8 border-2 border-[var(--border-color)] border-t-[#ea580c] rounded-full animate-spin mb-4" />
                                <p className="text-[11px] font-mono text-[#ea580c] font-bold uppercase tracking-wider">
                                    Parsing PDF... {progress}%
                                </p>
                            </div>
                        )}

                        <textarea
                            value={markdown}
                            readOnly
                            placeholder=""
                            aria-label="Markdown output"
                            className="w-full h-full p-4 font-mono text-[13px] leading-[1.7] resize-none outline-none text-[var(--foreground)] opacity-70 selection:bg-orange-500/20"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
