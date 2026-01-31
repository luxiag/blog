'use client';

import { useState, useRef } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';

export default function QrcodePage() {
  const [value, setValue] = useState('https://luxiag.blog');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('L');
  const [includeMargin, setIncludeMargin] = useState(true);

  const canvasRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    const canvas = document.getElementById('qrcode-canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = url;
      link.click();
    }
  };

  return (
    <>
      <PageTitle title="二维码生成" />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-4" style={{ padding: '48px 24px' }}>
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
            二维码生成
          </h1>
          <p style={{
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-neutral-500)',
            marginBottom: '32px'
          }}>
            生成自定义样式的二维码，支持下载。
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
            {/* 左侧配置 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>二维码内容 (URL 或 文本)</label>
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder='在此输入内容...'
                  style={{
                    width: '100%',
                    height: '120px',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>样式设置</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>前景颜色</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        style={{ width: '40px', height: '40px', border: 'none', padding: 0, cursor: 'pointer', background: 'none' }}
                      />
                      <input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>背景颜色</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        style={{ width: '40px', height: '40px', border: 'none', padding: 0, cursor: 'pointer', background: 'none' }}
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>尺寸: {size}px</label>
                    <input
                      type="range"
                      min="128"
                      max="1024"
                      step="32"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--color-orange-800)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>容错级别</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '13px' }}
                    >
                      <option value="L">L (7%)</option>
                      <option value="M">M (15%)</option>
                      <option value="Q">Q (25%)</option>
                      <option value="H">H (30%)</option>
                    </select>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={includeMargin}
                      onChange={(e) => setIncludeMargin(e.target.checked)}
                      style={{ accentColor: 'var(--color-orange-800)' }}
                    />
                    包含白边 (Margin)
                  </label>
                </div>
              </div>
            </div>

            {/* 右侧预览 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px',
                position: 'sticky',
                top: '24px'
              }}>
                <div style={{
                  padding: '16px',
                  background: 'var(--color-neutral-100)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'fit-content'
                }}>
                  {/* 用于预览的 SVG */}
                  <QRCodeSVG
                    value={value || ' '}
                    size={200}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={level}
                    includeMargin={includeMargin}
                  />
                  {/* 用于下载的 Canvas (隐藏) */}
                  <div style={{ display: 'none' }}>
                    <QRCodeCanvas
                      id="qrcode-canvas"
                      value={value || ' '}
                      size={size}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level={level}
                      includeMargin={includeMargin}
                    />
                  </div>
                </div>

                <button
                  onClick={downloadQRCode}
                  style={{
                    width: '100%',
                    background: 'var(--foreground)',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  下载 PNG
                </button>

                <p style={{ fontSize: '12px', color: 'var(--color-neutral-500)', textAlign: 'center' }}>
                  提示：下载的图片尺寸为 {size}x{size} 像素。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
