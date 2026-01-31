'use client';

import { useState, useCallback, useRef } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import {
  FileText,
  ChevronLeft,
  Upload,
  Trash2,
  Play,
  Copy,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Loader2,
  FileDigit,
  Maximize2
} from 'lucide-react';

export default function PdfToMdPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('INVALID_FORMAT_PDF_REQUIRED');
        return;
      }
      setFile(selectedFile);
      setError('');
      setMarkdown('');
      setCopySuccess(false);
    }
  }, []);

  const convertToMarkdown = (text: string, fileName: string) => {
    let md = '';
    const cleanFileName = fileName.replace(/\.[^/.]+$/, "");

    md += `# ${cleanFileName}\n\n`;
    md += `> SOURCE: ${fileName}\n`;
    md += `> DATE: ${new Date().toISOString().split('T')[0]}\n\n`;
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
        if (currentParagraph) {
          processedMd += currentParagraph + '\n\n';
          currentParagraph = '';
        }
        processedMd += `## ${line}\n\n`;
      } else if (isOrderedList || isUnorderedList) {
        if (currentParagraph) {
          processedMd += currentParagraph + '\n\n';
          currentParagraph = '';
        }
        processedMd += `${line}\n`;
      } else {
        if (currentParagraph) {
          currentParagraph += ' ' + line;
        } else {
          currentParagraph = line;
        }

        const nextLine = rawLines[i + 1]?.trim() || '';
        const endsWithPunctuation = /[.!?。！？]$/.test(line);

        if (endsWithPunctuation || !nextLine || isOrderedList || isUnorderedList) {
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
    setProgress(15);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const { PDFParse } = await import('pdf-parse');
      PDFParse.setWorker(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/js/pdf.worker.min.mjs`);
      setProgress(45);

      const parser = new PDFParse({ data: arrayBuffer });
      const textResult = await parser.getText();
      setProgress(85);

      const md = convertToMarkdown(textResult.text, file.name);
      setMarkdown(md);
      setProgress(100);
    } catch (err) {
      setError('EXECUTION_FAILURE: PDF_PARSING_FAILED');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) { }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace(/\.[^/.]+$/, "") || 'document'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-neutral-950 font-sans text-[oklch(0.145_0_0)] dark:text-neutral-100 selection:bg-orange-500/20">
      <PageTitle title="PDF 转 MD" />

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Technical Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative">
          <div className="relative z-10">
            <Link
              href="/tools"
              className="inline-flex items-center text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#ea580c] mb-6 group"
            >
              <ChevronLeft className="w-3 h-3 mr-2" />
              BACK_TO_LIBRARY
            </Link>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4">
              PDF<span className="text-[#ea580c]">/</span>MD
            </h1>
            <div className="flex items-center gap-3 text-sm font-mono opacity-60">
              <span className="w-2 h-2 rounded-full bg-orange-600" />
              CONVERT_PDF_STRUCTURE_TO_MARKDOWN_v1.0
            </div>
          </div>

          <div className="flex gap-4">
            <div className="px-5 py-3 bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-xl flex items-center gap-3 shadow-[4px_4px_0px_oklch(0.145_0_0)]">
              <FileDigit className="w-5 h-5" />
              <span className="text-xs font-mono font-bold">LOCAL_PARSING</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Main Upload Box */}
          <div className="bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[oklch(0.145_0_0)] flex items-center justify-between bg-[#f5f5f5] dark:bg-neutral-800/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-[oklch(0.145_0_0)] rounded-sm" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest">Input_Source</span>
              </div>
            </div>

            <div className="p-8">
              <div
                className={`relative border-2 border-dashed border-[oklch(0.145_0_0)] rounded-xl py-12 px-8 flex flex-col items-center justify-center transition-all bg-white dark:bg-neutral-950 group
                        ${file ? 'bg-orange-600/5 border-[#ea580c]' : 'hover:bg-neutral-50'}
                    `}
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile?.type === 'application/pdf') setFile(droppedFile);
                }}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".pdf" />

                {/* Double Circle Icon from Style Guide */}
                <div className="w-24 h-24 rounded-full border border-dashed border-[oklch(0.145_0_0)] flex items-center justify-center relative mb-6">
                  <div className="w-[75%] h-[75%] rounded-full border border-[oklch(0.145_0_0)] flex items-center justify-center bg-white dark:bg-neutral-900 z-10 transition-transform group-hover:scale-105 duration-300">
                    {file ? <FileText className="w-8 h-8 text-[#ea580c]" /> : <Upload className="w-8 h-8 opacity-40" />}
                  </div>
                </div>

                {!file ? (
                  <div className="text-center">
                    <h3 className="font-mono font-bold text-sm mb-4 uppercase tracking-tighter">DROPS_FILES_OR_BROWSE</h3>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-3 bg-[oklch(0.145_0_0)] text-white dark:bg-white dark:text-black font-mono font-bold text-xs uppercase tracking-widest rounded-lg active:translate-y-px transition-all"
                    >
                      SELECT_PDF
                    </button>
                  </div>
                ) : (
                  <div className="w-full max-w-sm">
                    <div className="px-4 py-3 bg-[#f5f5f5] dark:bg-neutral-800 border border-[oklch(0.145_0_0)] rounded-lg mb-6 flex items-center gap-3">
                      <FileDigit className="w-4 h-4" />
                      <span className="text-xs font-mono font-bold truncate flex-1">{file.name}</span>
                      <button onClick={() => setFile(null)} className="text-red-500 hover:scale-110 transition-transform">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={processPdf}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#ea580c] text-white font-mono font-bold text-sm uppercase tracking-widest rounded-xl shadow-[4px_4px_0_oklch(0.145_0_0)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_oklch(0.145_0_0)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_oklch(0.145_0_0)] transition-all disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                      {isProcessing ? `PROCESSING_${progress}%` : 'GENERATE_MARKDOWN'}
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-6 flex items-center gap-3 p-4 border border-red-500 rounded-lg bg-red-50 text-red-600 font-mono text-xs font-bold leading-none">
                  <AlertCircle className="w-4 h-4" />
                  <span>ERROR_LOG: {error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Result Area */}
          <div className="bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-2xl overflow-hidden flex flex-col h-[670px]">
            <div className="px-6 py-4 border-b border-[oklch(0.145_0_0)] flex items-center justify-between bg-[#f5f5f5] dark:bg-neutral-800/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-[oklch(0.145_0_0)] rounded-sm bg-[oklch(0.145_0_0)]" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest">Output_Preview</span>
              </div>

              {markdown && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-lg font-mono text-[10px] font-bold uppercase tracking-widest border border-[oklch(0.145_0_0)] transition-all
                        ${copySuccess
                        ? 'bg-green-500 text-white'
                        : 'bg-white hover:bg-neutral-100'
                      }
                      `}
                  >
                    {copySuccess ? 'SUCCESS_COPIED' : 'COPY_CLIPBOARD'}
                  </button>
                  <button
                    onClick={downloadMarkdown}
                    className="px-4 py-2 bg-[oklch(0.145_0_0)] text-white dark:bg-white dark:text-black rounded-lg font-mono text-[10px] font-bold uppercase tracking-widest border border-[oklch(0.145_0_0)] hover:opacity-80 transition-opacity"
                  >
                    DOWNLOAD_MD
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 relative bg-white dark:bg-neutral-950 overflow-hidden">
              {!markdown && !isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
                  <FileCode className="w-24 h-24 mb-6" />
                  <p className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase">SYSTEM_IDLE: Awaiting_Input</p>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-neutral-900/90 z-10">
                  <div className="w-12 h-12 border-2 border-[oklch(0.145_0_0)] border-t-[#ea580c] rounded-full animate-spin mb-6" />
                  <p className="font-mono text-xs font-bold uppercase tracking-widest shadow-white text-[#ea580c]">
                    STATUS: PARSING_PDF_STREAM...
                  </p>
                </div>
              )}

              <textarea
                value={markdown}
                readOnly
                placeholder="// Output will appear here after generation..."
                className="w-full h-full p-12 font-mono text-sm resize-none outline-none dark:bg-neutral-950 dark:text-neutral-300 selection:bg-orange-500/20 leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
