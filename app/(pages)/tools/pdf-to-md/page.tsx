'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';

export default function PdfToMdPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState('');
  const pdfParseRef = useRef<((data: any) => Promise<any>) | null>(null);

  useEffect(() => {
    const loadPdfParse = async () => {
      const pdfModule = await import('pdf-parse');
      const pdfParseAny = pdfModule as any;
      pdfParseRef.current = pdfParseAny.default || pdfParseAny;
    };
    loadPdfParse();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('请选择 PDF 文件');
        return;
      }
      setFile(selectedFile);
      setError('');
      setMarkdown('');
    }
  }, []);

  const processPdf = async () => {
    if (!file || !pdfParseRef.current) return;

    setIsProcessing(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = await pdfParseRef.current({ data: arrayBuffer });

      const md = convertToMarkdown(data);
      setMarkdown(md);
    } catch (err) {
      console.error('PDF 解析错误:', err);
      setError('PDF 解析失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const convertToMarkdown = (pdfData: { text: string; numpages: number }) => {
    let md = '';

    md += `# ${file?.name.replace('.pdf', '') || '文档'}\n\n`;
    md += `---\n\n`;
    md += `**页数**: ${pdfData.numpages}\n\n`;
    md += `---\n\n`;

    const lines = pdfData.text.split('\n').filter(line => line.trim());

    for (const line of lines) {
      const trimmed = line.trim();

      if (/^#{1,6}\s/.test(trimmed)) {
        md += `${trimmed}\n\n`;
      } else if (/^\d+\.\s/.test(trimmed)) {
        md += `${trimmed}\n`;
      } else if (/^[A-Z][A-Z\s]+:$/.test(trimmed)) {
        md += `## ${trimmed}\n\n`;
      } else if (trimmed.length > 50 && !trimmed.includes('http')) {
        md += `${trimmed}\n\n`;
      } else if (trimmed.startsWith('http')) {
        md += `[链接](${trimmed})\n\n`;
      } else if (trimmed) {
        md += `${trimmed}\n\n`;
      }
    }

    return md;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace('.pdf', '') || '文档'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageTitle title="PDF 转 MD" />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4" style={{ padding: '48px 24px' }}>
          <div style={{ marginBottom: '32px' }}>
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
          </div>

          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '8px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--foreground)'
          }}>
            PDF 转 Markdown
          </h1>
          <p style={{
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-neutral-500)',
            marginBottom: '32px'
          }}>
            将 PDF 文档转换为 Markdown 格式
          </p>

          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--foreground)',
                  marginBottom: '8px'
                }}
              >
                选择 PDF 文件
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer'
                }}
              />
            </div>

            {file && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                padding: '12px',
                background: 'var(--color-neutral-100)',
                borderRadius: '8px',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--foreground)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span style={{ flex: 1 }}>{file.name}</span>
                <span style={{ color: 'var(--color-neutral-500)' }}>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                <button
                  onClick={() => setFile(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: 'var(--color-neutral-500)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {error && (
              <div style={{
                padding: '12px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}

            <button
              onClick={processPdf}
              disabled={!file || isProcessing || !pdfParseRef.current}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: file && !isProcessing && pdfParseRef.current ? 'var(--foreground)' : 'var(--color-neutral-300)',
                color: file && !isProcessing && pdfParseRef.current ? 'white' : 'var(--color-neutral-500)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                cursor: file && !isProcessing && pdfParseRef.current ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isProcessing ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid var(--color-neutral-500)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  处理中...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  开始转换
                </>
              )}
            </button>
          </div>

          {markdown && (
            <div style={{
              background: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-color)',
                background: 'var(--color-neutral-100)'
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--foreground)'
                }}>
                  Markdown 输出
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      background: 'white',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    复制
                  </button>
                  <button
                    onClick={downloadMarkdown}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      background: 'var(--foreground)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    下载
                  </button>
                </div>
              </div>
              <textarea
                value={markdown}
                readOnly
                style={{
                  width: '100%',
                  minHeight: '300px',
                  padding: '16px',
                  border: 'none',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  color: 'var(--foreground)',
                  background: 'white'
                }}
              />
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
