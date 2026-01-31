'use client';

import { useState, useRef, ChangeEvent } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Upload, X, Download, ImageIcon, Settings, Palette, Type, ScanLine } from 'lucide-react';

export default function QrcodePage() {
  const [value, setValue] = useState('https://luxiag.blog');
  const [size, setSize] = useState(512);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [includeMargin, setIncludeMargin] = useState(true);

  // Logo states
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(40);
  const [excavate, setExcavate] = useState(true);

  const THEMES = [
    { name: '极简黑白', fg: '#000000', bg: '#ffffff', margin: true },
    { name: '商务深蓝', fg: '#1e3a8a', bg: '#f8fafc', margin: true },
    { name: '优雅紫色', fg: '#6d28d9', bg: '#f5f3ff', margin: true },
    { name: '活力橙红', fg: '#ea580c', bg: '#fff7ed', margin: true },
    { name: '森林绿', fg: '#15803d', bg: '#f0fdf4', margin: true },
    { name: '暗黑模式', fg: '#ffffff', bg: '#171717', margin: true },
    { name: '霓虹粉', fg: '#db2777', bg: '#000000', margin: true },
  ];

  const applyTheme = (theme: typeof THEMES[0]) => {
    setFgColor(theme.fg);
    setBgColor(theme.bg);
    setIncludeMargin(theme.margin);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qrcode-canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = url;
      link.click();
    }
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoSrc(null);
  };

  return (
    <>
      <PageTitle title="高级二维码生成器" />
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-12">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-8">
            <Link
              href="/tools"
              className="group inline-flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 font-mono text-sm transition-all"
            >
              <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回工具箱
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight mb-2">
                二维码生成器
              </h1>
              <p className="text-neutral-500 font-mono text-sm">
                个性化定制您的二维码，支持 Logo 嵌入与高清下载。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side: Settings */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Content Input */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 flex items-center gap-2">
                  <Type className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold uppercase tracking-wider opacity-70">内容配置</span>
                </div>
                <div className="p-6">
                  <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder='输入链接或文字内容...'
                    className="w-full h-32 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Theme Presets */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold uppercase tracking-wider opacity-70">风格预设</span>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {THEMES.map((theme, index) => (
                      <button
                        key={index}
                        onClick={() => applyTheme(theme)}
                        className="group flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all border border-transparent hover:border-neutral-100 dark:hover:border-neutral-700"
                      >
                        <div
                          className="w-12 h-12 rounded-full border-2 border-white dark:border-neutral-700 shadow-sm flex items-center justify-center overflow-hidden"
                          style={{ background: theme.bg }}
                        >
                          <div className="w-6 h-6 rounded-sm rotate-45" style={{ background: theme.fg }}></div>
                        </div>
                        <span className="text-[10px] font-bold opacity-60 group-hover:opacity-100 transition-opacity">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Style Settings */}
                <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold uppercase tracking-wider opacity-70">视觉样式</span>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-500 uppercase">前端颜色</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={fgColor}
                            onChange={(e) => setFgColor(e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer border-2 border-neutral-100 dark:border-neutral-700 bg-transparent overflow-hidden"
                          />
                          <input
                            type="text"
                            value={fgColor}
                            onChange={(e) => setFgColor(e.target.value)}
                            className="flex-1 px-2 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-mono"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-500 uppercase">背景颜色</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer border-2 border-neutral-100 dark:border-neutral-700 bg-transparent overflow-hidden"
                          />
                          <input
                            type="text"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="flex-1 px-2 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-neutral-500 uppercase">输出尺寸 ({size}px)</label>
                      </div>
                      <input
                        type="range"
                        min="256"
                        max="2048"
                        step="128"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-500 uppercase">纠错能力</label>
                        <select
                          value={level}
                          onChange={(e) => setLevel(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                          <option value="L">低 (7% 损毁可读)</option>
                          <option value="M">中 (15% 损毁可读)</option>
                          <option value="Q">优 (25% 损毁可读)</option>
                          <option value="H">极高 (30% 损毁可读)</option>
                        </select>
                      </div>
                      <div className="flex items-end pb-1">
                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={includeMargin}
                            onChange={(e) => setIncludeMargin(e.target.checked)}
                            className="w-4 h-4 accent-orange-500 rounded"
                          />
                          <span>包含安全边距</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logo Settings */}
                <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold uppercase tracking-wider opacity-70">Logo 嵌入</span>
                  </div>
                  <div className="p-6 space-y-6">
                    {!logoSrc ? (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl p-8 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group">
                        <Upload className="w-8 h-8 text-neutral-300 group-hover:text-orange-500 transition-colors mb-2" />
                        <span className="text-sm font-medium text-neutral-500">上传 Logo 图片</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      </label>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                          <div className="flex items-center gap-3">
                            <img src={logoSrc} alt="Logo Preview" className="w-10 h-10 object-contain rounded bg-white shadow-sm" />
                            <span className="text-xs font-mono opacity-60">Logo 已准备</span>
                          </div>
                          <button onClick={removeLogo} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-bold text-neutral-500 uppercase">Logo 比例 ({logoSize}px)</label>
                            </div>
                            <input
                              type="range"
                              min="20"
                              max="120"
                              step="5"
                              value={logoSize}
                              onChange={(e) => setLogoSize(parseInt(e.target.value))}
                              className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                          </div>

                          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={excavate}
                              onChange={(e) => setExcavate(e.target.checked)}
                              className="w-4 h-4 accent-orange-500 rounded"
                            />
                            <span>挖掘背景 (Excavate)</span>
                          </label>
                        </div>
                      </div>
                    )}
                    <p className="text-[10px] text-neutral-400">
                      建议使用纠错级别更高的设置以确保嵌入 Logo 后的识别率。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Preview */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xl overflow-hidden sticky top-24">
                <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ScanLine className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold uppercase tracking-wider opacity-70">实时预览</span>
                  </div>
                </div>

                <div className="p-8 flex flex-col items-center">
                  <div className="relative p-6 bg-white dark:bg-white rounded-2xl shadow-inner border-8 border-neutral-100 dark:border-neutral-100 flex items-center justify-center">
                    <QRCodeSVG
                      value={value || 'https://luxiag.blog'}
                      size={240}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level={level}
                      includeMargin={includeMargin}
                      imageSettings={logoSrc ? {
                        src: logoSrc,
                        height: logoSize / (size / 240),
                        width: logoSize / (size / 240),
                        excavate: excavate,
                      } : undefined}
                    />
                  </div>

                  <div className="w-full mt-10 space-y-3">
                    <button
                      onClick={downloadQRCode}
                      className="group w-full relative h-12 rounded-xl flex items-center justify-center font-bold text-white transition-all overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 group-hover:scale-105 transition-transform"></div>
                      <div className="relative flex items-center gap-2">
                        <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                        下载 PNG 图片
                      </div>
                    </button>

                    <div className="flex items-center justify-center gap-2 py-2 text-[11px] text-neutral-400 font-mono">
                      <Settings className="w-3 h-3" />
                      <span>分辨率: {size} x {size}px</span>
                    </div>
                  </div>
                </div>

                {/* Hidden Canvas for High Res Export */}
                <div className="hidden">
                  <QRCodeCanvas
                    id="qrcode-canvas"
                    value={value || 'https://luxiag.blog'}
                    size={size}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={level}
                    includeMargin={includeMargin}
                    imageSettings={logoSrc ? {
                      src: logoSrc,
                      height: logoSize,
                      width: logoSize,
                      excavate: excavate,
                    } : undefined}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
