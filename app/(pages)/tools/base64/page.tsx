'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
    Copy, Check, Trash2, ArrowRightLeft, FileText,
    Lock, Unlock, Type, Hash, Download, ImagePlus, ImageIcon,
} from 'lucide-react';

type ConvertMode = 'text-to-base64' | 'base64-to-text' | 'image-to-base64' | 'base64-to-image';

function utf8ToBase64(str: string): string {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
    ));
}

function base64ToUtf8(str: string): string {
    return decodeURIComponent(
        Array.prototype.map.call(atob(str), (c: string) =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
    );
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function detectMimeType(base64: string): string | null {
    const trimmed = base64.replace(/^data:[^;]+;base64,/, '');
    const signatures: [string, string][] = [
        ['/9j/', 'image/jpeg'],
        ['iVBOR', 'image/png'],
        ['R0lGOD', 'image/gif'],
        ['UklGR', 'image/webp'],
        ['PHN2Zw', 'image/svg+xml'],
        ['Qk', 'image/bmp'],
    ];
    for (const [sig, mime] of signatures) {
        if (trimmed.startsWith(sig)) return mime;
    }
    return null;
}

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function Base64Page() {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState<string | null>(null);
    const [mode, setMode] = useState<ConvertMode>('text-to-base64');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageInfo, setImageInfo] = useState<{ name: string; type: string; size: number; width?: number; height?: number } | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isTextMode = mode === 'text-to-base64' || mode === 'base64-to-text';
    const isImageEncode = mode === 'image-to-base64';
    const isImageDecode = mode === 'base64-to-image';

    const textOutput = useMemo(() => {
        if (!input.trim()) return '';
        try {
            if (mode === 'text-to-base64') return utf8ToBase64(input);
            if (mode === 'base64-to-text') return base64ToUtf8(input);
        } catch {
            return '';
        }
        return '';
    }, [input, mode]);

    const base64DataUrl = useMemo(() => {
        if (isImageDecode && input.trim()) {
            const trimmed = input.trim();
            if (trimmed.startsWith('data:')) return trimmed;
            const mime = detectMimeType(trimmed);
            if (mime) return `data:${mime};base64,${trimmed}`;
        }
        if (isImageEncode && imagePreview) return imagePreview;
        return null;
    }, [input, mode, imagePreview]);

    const detectedMime = useMemo(() => {
        if (isImageDecode && input.trim()) {
            return detectMimeType(input.trim());
        }
        return null;
    }, [input, mode]);

    const handleImageFile = useCallback((file: File) => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            setError('Unsupported image format');
            return;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            setError('Image too large (max 5MB)');
            return;
        }
        setError('');
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setImagePreview(dataUrl);
            setInput(dataUrl);
            const img = document.createElement('img');
            img.onload = () => {
                setImageInfo({ name: file.name, type: file.type, size: file.size, width: img.naturalWidth, height: img.naturalHeight });
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleImageFile(file);
    }, [handleImageFile]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageFile(file);
    }, [handleImageFile]);

    const handleSwap = useCallback(() => {
        if (isImageEncode && imagePreview) {
            setInput(imagePreview.split(',')[1] || '');
            setImagePreview(null);
            setImageInfo(null);
            setMode('base64-to-image');
        } else if (isImageDecode && input.trim()) {
            const raw = input.trim().replace(/^data:[^;]+;base64,/, '');
            setInput(raw);
            setMode('text-to-base64');
        } else if (textOutput) {
            setInput(textOutput);
            setMode(m => m === 'text-to-base64' ? 'base64-to-text' : 'text-to-base64');
        }
        setError('');
    }, [textOutput, imagePreview, input, mode]);

    const handleClear = useCallback(() => {
        setInput('');
        setError('');
        setImagePreview(null);
        setImageInfo(null);
    }, []);

    const handleCopy = useCallback(async (text: string, id: string) => {
        if (!text) return;
        await navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    }, []);

    const handleLoadSample = useCallback(() => {
        setImagePreview(null);
        setImageInfo(null);
        if (mode === 'text-to-base64') {
            setInput('Hello, 世界! 🌍\nBase64 supports UTF-8 encoding.');
        } else if (mode === 'base64-to-text') {
            setInput('SGVsbG8sIOS4lueVjCEg8J+NjwpCYXNlNjQgc3VwcG9ydHMgVVRGLTggZW5jb2Rpbmcu');
        } else if (mode === 'base64-to-image') {
            setInput('iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVQYV2P8z8BQz0BFwMgwasChAQBf9AoL/k6MVQAAAABJRU5ErkJggg==');
        }
        setError('');
    }, [mode]);

    const handleDownload = useCallback(() => {
        if (isImageDecode && base64DataUrl) {
            const a = document.createElement('a');
            a.href = base64DataUrl;
            const ext = detectedMime ? detectedMime.split('/')[1] : 'png';
            a.download = `decoded-image.${ext}`;
            a.click();
        } else if (textOutput) {
            const blob = new Blob([textOutput], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = mode === 'text-to-base64' ? 'encoded.b64' : 'decoded.txt';
            a.click();
            URL.revokeObjectURL(url);
        }
    }, [textOutput, base64DataUrl, mode, detectedMime]);

    const handleModeChange = useCallback((newMode: ConvertMode) => {
        if (newMode !== mode) {
            setMode(newMode);
            setInput('');
            setError('');
            setImagePreview(null);
            setImageInfo(null);
        }
    }, [mode]);

    const inputBytes = useMemo(() => new TextEncoder().encode(input).length, [input]);
    const textOutputBytes = useMemo(() => textOutput ? new TextEncoder().encode(textOutput).length : 0, [textOutput]);

    return (
        <div className="h-[calc(100vh-45px)] flex flex-col bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--background)] border-b border-[var(--border-color)] shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/tools" className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--foreground)] opacity-40 hover:opacity-70 transition-opacity uppercase tracking-wider">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7-7 7 7 7" /></svg>
                        Tools
                    </Link>
                    <div className="w-px h-3 bg-[var(--border-color)]" />
                    <span className="text-[12px] font-mono text-[var(--foreground)] opacity-50">Base64</span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => handleModeChange('text-to-base64')}
                        className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-colors ${mode === 'text-to-base64' ? 'bg-[var(--foreground)] text-white' : 'text-[var(--foreground)] opacity-25 hover:opacity-50 hover:bg-black/5'}`}>
                        <Lock size={11} />Encode
                    </button>
                    <button onClick={() => handleModeChange('base64-to-text')}
                        className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-colors ${mode === 'base64-to-text' ? 'bg-[var(--foreground)] text-white' : 'text-[var(--foreground)] opacity-25 hover:opacity-50 hover:bg-black/5'}`}>
                        <Unlock size={11} />Decode
                    </button>
                    <div className="w-px h-3 bg-[var(--border-color)] mx-1" />
                    <button onClick={() => handleModeChange('image-to-base64')}
                        className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-colors ${mode === 'image-to-base64' ? 'bg-[#ea580c] text-white' : 'text-[var(--foreground)] opacity-25 hover:opacity-50 hover:bg-black/5'}`}>
                        <ImagePlus size={11} />Img→B64
                    </button>
                    <button onClick={() => handleModeChange('base64-to-image')}
                        className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-colors ${mode === 'base64-to-image' ? 'bg-[#ea580c] text-white' : 'text-[var(--foreground)] opacity-25 hover:opacity-50 hover:bg-black/5'}`}>
                        <ImageIcon size={11} />B64→Img
                    </button>
                    <div className="w-px h-3 bg-[var(--border-color)] mx-1" />
                    <button onClick={handleSwap} className="p-1.5 text-[var(--foreground)] opacity-30 hover:opacity-50 transition-opacity" title="Swap input/output">
                        <ArrowRightLeft size={13} />
                    </button>
                    <button onClick={handleLoadSample} className="p-1.5 text-[var(--foreground)] opacity-30 hover:opacity-50 transition-opacity" title="Load sample">
                        <FileText size={13} />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex min-h-0">
                <div className="flex-1 flex flex-col min-w-0 border-r border-[var(--border-color)]">
                    <div className="px-3 py-1.5 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--background)] shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-[var(--foreground)] opacity-30 uppercase tracking-wider">
                                {isImageEncode ? 'Image' : isImageDecode ? 'Base64' : mode === 'text-to-base64' ? 'Plain Text' : 'Base64'}
                            </span>
                            <span className="text-[9px] font-mono text-[var(--foreground)] opacity-30">{formatBytes(inputBytes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {isImageEncode && (
                                <button onClick={() => fileInputRef.current?.click()} className="p-1 text-[var(--foreground)] opacity-30 hover:opacity-40 transition-opacity" title="Choose file">
                                    <ImagePlus size={11} />
                                </button>
                            )}
                            <button onClick={() => handleCopy(isImageEncode ? (imagePreview || '') : input, 'input')} className="p-1 text-[var(--foreground)] opacity-30 hover:opacity-40 transition-opacity" title="Copy input">
                                {copied === 'input' ? <Check size={11} /> : <Copy size={11} />}
                            </button>
                            <button onClick={handleClear} className="p-1 text-[var(--foreground)] opacity-30 hover:opacity-40 transition-opacity" title="Clear">
                                <Trash2 size={11} />
                            </button>
                        </div>
                    </div>

                    {isImageEncode ? (
                        <div
                            className={`w-full flex-1 flex flex-col items-center justify-center min-h-0 bg-white transition-colors ${dragOver ? 'bg-orange-50' : ''}`}
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input ref={fileInputRef} type="file" accept={ACCEPTED_IMAGE_TYPES.join(',')} onChange={handleFileSelect} className="hidden" />
                            {imagePreview ? (
                                <div className="flex-1 w-full flex items-center justify-center p-4 overflow-auto">
                                    <img src={imagePreview} alt="Preview" className="max-w-full max-h-full object-contain" style={{ imageRendering: 'auto' }} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 text-[var(--foreground)] opacity-30 cursor-pointer">
                                    <ImagePlus size={32} />
                                    <div className="text-[11px] font-mono">Drop image or click to select</div>
                                    <div className="text-[9px] font-mono opacity-50">PNG, JPG, GIF, WebP, SVG, BMP — max 5MB</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <textarea
                            value={input}
                            onChange={(e) => { setInput(e.target.value); setError(''); setImagePreview(null); setImageInfo(null); }}
                            placeholder={mode === 'text-to-base64' ? 'Type or paste text to encode...' : 'Paste Base64 string to decode...'}
                            aria-label={mode === 'text-to-base64' ? 'Text to encode' : 'Base64 to decode'}
                            className="w-full flex-1 p-4 font-mono text-[13px] leading-[1.6] resize-none outline-none text-[var(--foreground)] opacity-70 bg-white selection:bg-orange-500/20 min-h-0"
                            spellCheck={false}
                        />
                    )}
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                    <div className="px-3 py-1.5 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--background)] shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-[var(--foreground)] opacity-30 uppercase tracking-wider">
                                {isImageEncode ? 'Base64' : isImageDecode ? 'Preview' : mode === 'text-to-base64' ? 'Base64' : 'Plain Text'}
                            </span>
                            {isImageEncode && imagePreview && (
                                <span className="text-[9px] font-mono text-[var(--foreground)] opacity-30">{formatBytes(imagePreview.length)}</span>
                            )}
                            {!isImageEncode && !isImageDecode && (
                                <span className="text-[9px] font-mono text-[var(--foreground)] opacity-30">{formatBytes(textOutputBytes)}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={handleDownload} className="p-1 text-[var(--foreground)] opacity-30 hover:opacity-40 transition-opacity" title="Download">
                                <Download size={11} />
                            </button>
                            <button onClick={() => {
                                const copyText = isImageEncode ? (imagePreview || '') : isImageDecode ? input : textOutput;
                                handleCopy(copyText, 'output');
                            }} className="p-1 text-[var(--foreground)] opacity-30 hover:opacity-40 transition-opacity" title="Copy result">
                                {copied === 'output' ? <Check size={11} /> : <Copy size={11} />}
                            </button>
                        </div>
                    </div>

                    {isImageDecode ? (
                        <div className="w-full flex-1 flex flex-col min-h-0 bg-[#fafafa]">
                            {error ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <span className="text-red-500 text-[12px] font-mono">{error}</span>
                                </div>
                            ) : base64DataUrl ? (
                                <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
                                    <img src={base64DataUrl} alt="Decoded" className="max-w-full max-h-full object-contain" style={{ imageRendering: 'auto' }} />
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-[var(--foreground)] opacity-30">
                                    <ImageIcon size={32} />
                                    <div className="text-[11px] font-mono mt-3">Paste Base64 to preview image</div>
                                    {detectedMime && <div className="text-[9px] font-mono opacity-50 mt-1">Detected: {detectedMime}</div>}
                                </div>
                            )}
                        </div>
                    ) : isImageEncode ? (
                        <div className="w-full flex-1 p-4 font-mono text-[12px] leading-[1.5] overflow-auto min-h-0 bg-[#fafafa]">
                            {imagePreview ? (
                                <span className="text-[var(--foreground)] opacity-70 break-all">{imagePreview}</span>
                            ) : (
                                <span className="text-[var(--foreground)] opacity-30">Select an image to encode...</span>
                            )}
                        </div>
                    ) : (
                        <div className="w-full flex-1 p-4 font-mono text-[13px] leading-[1.6] overflow-auto min-h-0 bg-[#fafafa]">
                            {error ? (
                                <span className="text-red-500 text-[12px]">{error}</span>
                            ) : textOutput ? (
                                <span className="text-[var(--foreground)] opacity-70 break-all">{textOutput}</span>
                            ) : (
                                <span className="text-[var(--foreground)] opacity-30">{mode === 'text-to-base64' ? 'Encoded result...' : 'Decoded result...'}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="h-[28px] flex items-center gap-3 px-3 bg-[var(--background)] border-t border-[var(--border-color)] shrink-0">
                <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-30">
                    <Type size={9} />
                    UTF-8
                </div>
                {isImageEncode && imageInfo && (
                    <>
                        <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-30">
                            {imageInfo.type}
                        </div>
                        <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-30">
                            {imageInfo.width}×{imageInfo.height}
                        </div>
                        <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-30">
                            {formatBytes(imageInfo.size)}
                        </div>
                    </>
                )}
                {isImageDecode && detectedMime && (
                    <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-30">
                        {detectedMime}
                    </div>
                )}
                <div className="flex-1" />
                <span className="text-[9px] font-mono text-[var(--foreground)] opacity-30">
                    {isTextMode ? 'Auto-convert on type' : isImageEncode ? 'Drag & drop or click' : 'Paste Base64 with or without data: prefix'}
                </span>
            </div>
        </div>
    );
}
