'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Upload, X, Download, Copy, Check, Palette, Type, ScanLine, FileCode } from 'lucide-react';

const THEMES = [
    { name: 'Minimal', fg: '#000000', bg: '#ffffff' },
    { name: 'Brand', fg: '#ea580c', bg: '#fff7ed' },
    { name: 'Navy', fg: '#1e3a8a', bg: '#f8fafc' },
    { name: 'Purple', fg: '#6d28d9', bg: '#f5f3ff' },
    { name: 'Green', fg: '#15803d', bg: '#f0fdf4' },
    { name: 'Dark', fg: '#ffffff', bg: '#171717' },
    { name: 'Neon', fg: '#db2777', bg: '#000000' },
];

export default function QrcodePage() {
    const [value, setValue] = useState('https://luxiag.blog');
    const [size, setSize] = useState(512);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
    const [includeMargin, setIncludeMargin] = useState(true);
    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [logoSize, setLogoSize] = useState(40);
    const [excavate, setExcavate] = useState(true);
    const [copied, setCopied] = useState(false);
    const [exportFormat, setExportFormat] = useState<'png' | 'svg'>('png');

    const applyTheme = (theme: typeof THEMES[0]) => { setFgColor(theme.fg); setBgColor(theme.bg); };

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { const reader = new FileReader(); reader.onloadend = () => setLogoSrc(reader.result as string); reader.readAsDataURL(file); }
    };

    const downloadQR = () => {
        if (exportFormat === 'svg') {
            const svgEl = document.getElementById('qrcode-svg');
            if (!svgEl) return;
            const svgData = new XMLSerializer().serializeToString(svgEl);
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `qrcode-${Date.now()}.svg`; a.click();
            URL.revokeObjectURL(url);
        } else {
            const canvas = document.getElementById('qrcode-canvas') as HTMLCanvasElement;
            if (canvas) { const url = canvas.toDataURL('image/png'); const a = document.createElement('a'); a.download = `qrcode-${Date.now()}.png`; a.href = url; a.click(); }
        }
    };

    const copySvgCode = async () => {
        const svgEl = document.getElementById('qrcode-svg');
        if (!svgEl) return;
        const svgData = new XMLSerializer().serializeToString(svgEl);
        await navigator.clipboard.writeText(svgData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const imageSettings = logoSrc ? { src: logoSrc, height: logoSize / (size / 240), width: logoSize / (size / 240), excavate } : undefined;

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
                    <span className="text-[12px] font-mono text-[var(--foreground)] opacity-50">QR Code Generator</span>
                </div>
                <div className="flex items-center gap-2">
                    {(['png', 'svg'] as const).map(fmt => (
                        <button key={fmt} onClick={() => setExportFormat(fmt)}
                            className={`px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-colors ${
                                exportFormat === fmt ? 'bg-[var(--foreground)] text-white' : 'text-[var(--foreground)] opacity-25 hover:opacity-50 hover:bg-black/5'
                            }`}>
                            {fmt.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex min-h-0">
                {/* Left: Settings */}
                <div className="w-[380px] shrink-0 border-r border-[var(--border-color)] flex flex-col bg-[var(--background)] overflow-y-auto">
                    {/* Content input */}
                    <div className="p-4 border-b border-[var(--border-color)]">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Type size={12} className="text-[var(--foreground)] opacity-30" />
                            <span className="text-[10px] font-mono font-bold text-[var(--foreground)] opacity-20 uppercase tracking-wider">Content</span>
                        </div>
                        <textarea value={value} onChange={(e) => setValue(e.target.value)}
                            placeholder="Enter URL or text..."
                            className="w-full h-20 p-3 font-mono text-[12px] leading-[1.5] resize-none outline-none border border-[var(--border-color)] rounded bg-white text-[var(--foreground)] opacity-70 selection:bg-orange-500/20" />
                    </div>

                    {/* Theme presets */}
                    <div className="p-4 border-b border-[var(--border-color)]">
                        <div className="flex items-center gap-1.5 mb-3">
                            <Palette size={12} className="text-[var(--foreground)] opacity-30" />
                            <span className="text-[10px] font-mono font-bold text-[var(--foreground)] opacity-20 uppercase tracking-wider">Themes</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {THEMES.map((theme, i) => (
                                <button key={i} onClick={() => applyTheme(theme)}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-black/5 transition-colors border border-transparent hover:border-[var(--border-color)]">
                                    <div className="w-5 h-5 rounded-full border border-[var(--border-color)] overflow-hidden shrink-0" style={{ background: theme.bg }}>
                                        <div className="w-full h-full rounded-full" style={{ background: theme.fg, opacity: 0.8 }} />
                                    </div>
                                    <span className="text-[10px] font-mono text-[var(--foreground)] opacity-40">{theme.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Style settings */}
                    <div className="p-4 border-b border-[var(--border-color)]">
                        <div className="flex items-center gap-1.5 mb-3">
                            <Palette size={12} className="text-[var(--foreground)] opacity-30" />
                            <span className="text-[10px] font-mono font-bold text-[var(--foreground)] opacity-20 uppercase tracking-wider">Style</span>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-mono text-[var(--foreground)] opacity-25 uppercase block mb-1">Foreground</label>
                                    <div className="flex items-center gap-1.5">
                                        <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                                            className="w-8 h-8 rounded cursor-pointer border border-[var(--border-color)] bg-transparent" />
                                        <input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                                            className="flex-1 px-2 py-1 rounded bg-white border border-[var(--border-color)] text-[11px] font-mono text-[var(--foreground)] opacity-50 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-[var(--foreground)] opacity-25 uppercase block mb-1">Background</label>
                                    <div className="flex items-center gap-1.5">
                                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                                            className="w-8 h-8 rounded cursor-pointer border border-[var(--border-color)] bg-transparent" />
                                        <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                                            className="flex-1 px-2 py-1 rounded bg-white border border-[var(--border-color)] text-[11px] font-mono text-[var(--foreground)] opacity-50 outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-mono text-[var(--foreground)] opacity-25 uppercase">Size</label>
                                    <span className="text-[10px] font-mono text-[var(--foreground)] opacity-20">{size}px</span>
                                </div>
                                <input type="range" min="256" max="2048" step="128" value={size}
                                    onChange={(e) => setSize(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-[#ea580c]" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-mono text-[var(--foreground)] opacity-25 uppercase block mb-1">Error correction</label>
                                    <select value={level} onChange={(e) => setLevel(e.target.value as any)}
                                        className="w-full px-2 py-1.5 rounded bg-white border border-[var(--border-color)] text-[11px] font-mono text-[var(--foreground)] opacity-50 outline-none">
                                        <option value="L">Low (7%)</option>
                                        <option value="M">Medium (15%)</option>
                                        <option value="Q">High (25%)</option>
                                        <option value="H">Max (30%)</option>
                                    </select>
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--foreground)] opacity-40 cursor-pointer">
                                        <input type="checkbox" checked={includeMargin} onChange={(e) => setIncludeMargin(e.target.checked)}
                                            className="accent-[#ea580c]" />
                                        Margin
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logo settings */}
                    <div className="p-4">
                        <div className="flex items-center gap-1.5 mb-3">
                            <ScanLine size={12} className="text-[var(--foreground)] opacity-30" />
                            <span className="text-[10px] font-mono font-bold text-[var(--foreground)] opacity-20 uppercase tracking-wider">Logo</span>
                        </div>
                        {!logoSrc ? (
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] rounded-lg p-6 cursor-pointer hover:bg-black/[0.02] transition-colors">
                                <Upload size={20} className="text-[var(--foreground)] opacity-15 mb-2" />
                                <span className="text-[10px] font-mono text-[var(--foreground)] opacity-25">Upload logo image</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            </label>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-2 bg-white rounded border border-[var(--border-color)]">
                                    <div className="flex items-center gap-2">
                                        <img src={logoSrc} alt="Logo" className="w-8 h-8 object-contain rounded bg-[var(--background)]" />
                                        <span className="text-[10px] font-mono text-[var(--foreground)] opacity-30">Logo loaded</span>
                                    </div>
                                    <button onClick={() => setLogoSrc(null)} className="p-1 text-[var(--foreground)] opacity-20 hover:opacity-50 hover:text-red-500 transition-all">
                                        <X size={12} />
                                    </button>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-[10px] font-mono text-[var(--foreground)] opacity-25 uppercase">Logo size</label>
                                        <span className="text-[10px] font-mono text-[var(--foreground)] opacity-20">{logoSize}px</span>
                                    </div>
                                    <input type="range" min="20" max="120" step="5" value={logoSize}
                                        onChange={(e) => setLogoSize(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-[#ea580c]" />
                                </div>
                                <label className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--foreground)] opacity-40 cursor-pointer">
                                    <input type="checkbox" checked={excavate} onChange={(e) => setExcavate(e.target.checked)}
                                        className="accent-[#ea580c]" />
                                    Excavate background
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="flex-1 flex flex-col min-w-0 bg-white">
                    <div className="px-4 py-2 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--background)] shrink-0">
                        <span className="text-[10px] font-mono font-bold text-[var(--foreground)] opacity-20 uppercase tracking-wider">Preview</span>
                        <div className="flex items-center gap-1.5">
                            {exportFormat === 'svg' && (
                                <button onClick={copySvgCode}
                                    className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-[var(--foreground)] opacity-30 hover:opacity-60 hover:bg-black/5 rounded transition-all">
                                    {copied ? <Check size={10} /> : <FileCode size={10} />}
                                    {copied ? 'Copied' : 'Copy SVG'}
                                </button>
                            )}
                            <button onClick={downloadQR}
                                className="flex items-center gap-1.5 px-3 py-1 bg-[#ea580c] hover:bg-[#d94f04] text-white text-[11px] font-mono font-bold rounded-md transition-colors">
                                <Download size={11} />
                                Download {exportFormat.toUpperCase()}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        {/* Visible SVG for display + SVG copy */}
                        <div id="qrcode-svg" className="p-6 bg-white rounded-lg border border-[var(--border-color)]">
                            <QRCodeSVG
                                value={value || 'https://luxiag.blog'}
                                size={240}
                                fgColor={fgColor}
                                bgColor={bgColor}
                                level={level}
                                includeMargin={includeMargin}
                                imageSettings={imageSettings}
                            />
                        </div>

                        {/* Hidden Canvas for PNG export */}
                        <div className="hidden">
                            <QRCodeCanvas
                                id="qrcode-canvas"
                                value={value || 'https://luxiag.blog'}
                                size={size}
                                fgColor={fgColor}
                                bgColor={bgColor}
                                level={level}
                                includeMargin={includeMargin}
                                imageSettings={logoSrc ? { src: logoSrc, height: logoSize, width: logoSize, excavate } : undefined}
                            />
                        </div>

                        <div className="mt-4 text-[10px] font-mono text-[var(--foreground)] opacity-15">
                            {size} × {size}px · Level {level}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
