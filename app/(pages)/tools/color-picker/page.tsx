'use client';

import { useState, useRef, useEffect } from 'react';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';

export default function ColorPickerPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [colors, setColors] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setSelectedImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const extractColors = () => {
        if (!selectedImage || !canvasRef.current) return;
        setIsProcessing(true);

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = selectedImage;
        img.onload = () => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            // 调整 canvas 大小用于处理
            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(img, 0, 0, 100, 100);

            const imageData = ctx.getImageData(0, 0, 100, 100).data;
            const colorCounts: Record<string, number> = {};

            for (let i = 0; i < imageData.length; i += 40) { // 采样
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                colorCounts[hex] = (colorCounts[hex] || 0) + 1;
            }

            const sortedColors = Object.entries(colorCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(entry => entry[0]);

            setColors(sortedColors);
            setIsProcessing(false);
        };
    };

    useEffect(() => {
        if (selectedImage) {
            extractColors();
        }
    }, [selectedImage]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // 可选：添加吐司提示
    };

    return (
        <>
            <PageTitle title="颜色提取器" />
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
                        颜色提取器
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-neutral-500)',
                        marginBottom: '32px'
                    }}>
                        从图片中提取主要的颜色主题
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        {/* 上传区域 */}
                        <div style={{
                            background: 'white',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '300px',
                            cursor: 'pointer',
                            position: 'relative'
                        }}>
                            {!selectedImage ? (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                                    />
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--color-neutral-300)', marginBottom: '16px' }}>
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <p style={{ fontSize: '14px', color: 'var(--color-neutral-500)' }}>点击或拖拽图片上传</p>
                                </>
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <img
                                        src={selectedImage}
                                        alt="Selected"
                                        style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px' }}
                                    />
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        style={{
                                            padding: '8px',
                                            background: 'var(--color-neutral-100)',
                                            border: 'none',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        更换图片
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 颜色结果 */}
                        <div>
                            <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>提取出的颜色主题</h3>

                                {isProcessing ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-neutral-500)', fontSize: '14px' }}>
                                        <div className="spinner"></div> 处理中...
                                    </div>
                                ) : colors.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                        {colors.map((color, index) => (
                                            <div
                                                key={index}
                                                onClick={() => copyToClipboard(color)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '8px',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border-color)',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-neutral-100)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: color, border: '1px solid rgba(0,0,0,0.1)' }}></div>
                                                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{color.toUpperCase()}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '14px', color: 'var(--color-neutral-500)', textAlign: 'center', padding: '40px 0' }}>
                                        上传图片后自动提取颜色
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
            </div>
        </>
    );
}
