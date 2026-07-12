'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

export default function ImageEditorCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [activeTool, setActiveTool] = useState<string>('select');
    const [brushColor, setBrushColor] = useState<string>('#ea580c');
    const [brushWidth, setBrushWidth] = useState<number>(5);
    const [bgColor, setBgColor] = useState<string>('#ffffff');
    const [isTransparent, setIsTransparent] = useState<boolean>(false);
    const [hasSelection, setHasSelection] = useState<boolean>(false);

    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new fabric.Canvas(canvasRef.current, {
                width: 800,
                height: 500,
                backgroundColor: isTransparent ? 'transparent' : bgColor,
            });
            setCanvas(initCanvas);

            initCanvas.on('selection:created', () => setHasSelection(true));
            initCanvas.on('selection:updated', () => setHasSelection(true));
            initCanvas.on('selection:cleared', () => setHasSelection(false));

            return () => {
                initCanvas.dispose();
            };
        }
    }, []);

    useEffect(() => {
        if (canvas) {
            canvas.backgroundColor = isTransparent ? 'transparent' : bgColor;
            canvas.renderAll();
        }
    }, [canvas, bgColor, isTransparent]);

    useEffect(() => {
        if (canvas) {
            if (activeTool === 'draw') {
                canvas.isDrawingMode = true;
                if (!canvas.freeDrawingBrush) {
                    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
                }
                const pencilBrush = canvas.freeDrawingBrush as fabric.PencilBrush;
                pencilBrush.color = brushColor;
                pencilBrush.width = brushWidth;
            } else {
                canvas.isDrawingMode = false;
            }
        }
    }, [canvas, activeTool, brushColor, brushWidth]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && canvas) {
            const reader = new FileReader();
            reader.onload = async (f) => {
                const data = f.target?.result;
                if (typeof data === 'string') {
                    const img = await fabric.FabricImage.fromURL(data);
                    const scale = Math.min(
                        (canvas.width! * 0.8) / img.width!,
                        (canvas.height! * 0.8) / img.height!
                    );
                    img.scale(scale);
                    canvas.centerObject(img);
                    canvas.add(img);
                    canvas.setActiveObject(img);
                    canvas.renderAll();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const addRect = () => {
        if (canvas) {
            const rect = new fabric.Rect({
                left: 100,
                top: 100,
                fill: brushColor,
                width: 100,
                height: 100,
            });
            canvas.add(rect);
            canvas.setActiveObject(rect);
        }
    };

    const addCircle = () => {
        if (canvas) {
            const circle = new fabric.Circle({
                left: 150,
                top: 150,
                fill: brushColor,
                radius: 50,
            });
            canvas.add(circle);
            canvas.setActiveObject(circle);
        }
    };

    const addText = () => {
        if (canvas) {
            const text = new fabric.IText('Hello World', {
                left: 200,
                top: 200,
                fontFamily: 'var(--font-sans)',
                fill: brushColor,
            });
            canvas.add(text);
            canvas.setActiveObject(text);
        }
    };

    const deleteSelected = () => {
        if (canvas) {
            const activeObjects = canvas.getActiveObjects();
            canvas.remove(...activeObjects);
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    };

    const clearCanvas = () => {
        if (canvas) {
            canvas.clear();
            canvas.backgroundColor = isTransparent ? 'transparent' : bgColor;
            canvas.renderAll();
        }
    };

    const downloadImage = () => {
        if (canvas) {
            const dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1,
                multiplier: 1,
            });
            const link = document.createElement('a');
            link.download = 'edited-image.png';
            link.href = dataURL;
            link.click();
        }
    };

    const downloadSelection = () => {
        if (canvas) {
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                const dataURL = activeObject.toDataURL({
                    format: 'png',
                    quality: 1,
                    multiplier: 1,
                });
                const link = document.createElement('a');
                link.download = 'selection.png';
                link.href = dataURL;
                link.click();
            }
        }
    };

    const applyFilter = async (filterType: string, value?: any) => {
        if (canvas) {
            const activeObject = canvas.getActiveObject();
            if (activeObject instanceof fabric.FabricImage) {
                let filter;
                switch (filterType) {
                    case 'grayscale':
                        filter = new fabric.filters.Grayscale();
                        break;
                    case 'sepia':
                        filter = new fabric.filters.Sepia();
                        break;
                    case 'invert':
                        filter = new fabric.filters.Invert();
                        break;
                    case 'brightness':
                        filter = new fabric.filters.Brightness({ brightness: value || 0.1 });
                        break;
                    case 'contrast':
                        filter = new fabric.filters.Contrast({ contrast: value || 0.1 });
                        break;
                    case 'blur':
                        filter = new fabric.filters.Blur({ blur: value || 0.5 });
                        break;
                    case 'pixelate':
                        filter = new fabric.filters.Pixelate({ blocksize: value || 4 });
                        break;
                    case 'none':
                        activeObject.filters = [];
                        break;
                    default:
                        return;
                }

                if (filter) {
                    activeObject.filters.push(filter);
                }

                await activeObject.applyFilters();
                canvas.renderAll();
            }
        }
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr',
            gap: '24px',
        }}>
            <div style={{
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                height: 'fit-content',
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto'
            }}>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', opacity: 0.6, display: 'block', marginBottom: '8px' }}>画布背景</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                id="transparent-bg"
                                checked={isTransparent}
                                onChange={(e) => setIsTransparent(e.target.checked)}
                            />
                            <label htmlFor="transparent-bg" style={{ fontSize: '12px' }}>透明背景</label>
                        </div>
                        {!isTransparent && (
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                style={{ width: '100%', height: '30px', border: '1px solid var(--border-color)', padding: '2px', borderRadius: '4px', cursor: 'pointer' }}
                            />
                        )}
                    </div>
                </div>

                <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', opacity: 0.6, display: 'block', marginBottom: '8px' }}>图片操作</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                            onClick={() => document.getElementById('img-upload')?.click()}
                            style={{
                                background: 'var(--foreground)', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            上传图片
                        </button>
                        <input type="file" id="img-upload" hidden accept="image/*" onChange={handleImageUpload} />
                    </div>
                </div>

                <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', opacity: 0.6, display: 'block', marginBottom: '8px' }}>工具箱</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['select', 'draw'].map(tool => (
                            <button
                                key={tool}
                                onClick={() => setActiveTool(tool)}
                                style={{
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    background: activeTool === tool ? 'var(--foreground)' : 'white',
                                    color: activeTool === tool ? 'white' : 'var(--foreground)',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                    flex: '1 1 45%'
                                }}
                            >
                                {tool === 'select' ? '选择' : '画笔'}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', opacity: 0.6, display: 'block', marginBottom: '8px' }}>绘制 & 颜色</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                        <button onClick={addRect} style={{ flex: '1 1 45%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', background: 'white', cursor: 'pointer' }}>矩形</button>
                        <button onClick={addCircle} style={{ flex: '1 1 45%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', background: 'white', cursor: 'pointer' }}>圆形</button>
                        <button onClick={addText} style={{ flex: '1 1 100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', background: 'white', cursor: 'pointer' }}>添加文字</button>
                    </div>
                    <input
                        type="color"
                        value={brushColor}
                        onChange={(e) => setBrushColor(e.target.value)}
                        style={{ width: '100%', height: '30px', border: '1px solid var(--border-color)', padding: '2px', borderRadius: '4px', cursor: 'pointer' }}
                    />
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={brushWidth}
                        onChange={(e) => setBrushWidth(parseInt(e.target.value))}
                        style={{ width: '100%', marginTop: '8px', accentColor: 'var(--color-orange-800)' }}
                    />
                </div>

                <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', opacity: 0.6, display: 'block', marginBottom: '8px' }}>高级滤镜</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        {[
                            { id: 'none', label: '原图' },
                            { id: 'grayscale', label: '黑白' },
                            { id: 'sepia', label: '怀旧' },
                            { id: 'invert', label: '反色' },
                            { id: 'brightness', label: '亮度' },
                            { id: 'contrast', label: '对比' },
                            { id: 'blur', label: '模糊' },
                            { id: 'pixelate', label: '像素' }
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => applyFilter(f.id)}
                                style={{ padding: '6px 4px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '10px', background: 'white', cursor: 'pointer' }}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{
                position: 'relative',
                background: '#f1f5f9',
                backgroundImage: isTransparent ? 'radial-gradient(#cbd5e1 1px, transparent 0)' : 'none',
                backgroundSize: '20px 20px',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'auto',
                boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.05)'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 10,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    padding: '8px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-subtle)'
                }}>
                    {hasSelection && (
                        <>
                            <button
                                onClick={deleteSelected}
                                title="删除选中"
                                style={{
                                    padding: '8px',
                                    background: '#fee2e2',
                                    color: '#991b1b',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6m4-6v6" /></svg>
                            </button>
                            <button
                                onClick={downloadSelection}
                                title="导出选中项"
                                style={{
                                    padding: '8px',
                                    background: 'white',
                                    color: 'var(--color-orange-800)',
                                    border: '1px solid var(--color-orange-800)',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    gap: '4px'
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 14l-7 7-7-7m7 7V3" /></svg>
                                保存选中
                            </button>
                        </>
                    )}
                    <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
                    <button
                        onClick={downloadImage}
                        title="下载全图"
                        style={{
                            padding: '8px 16px',
                            background: 'var(--color-orange-800)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5 5 5-5m-5 5V3" /></svg>
                        保存全图
                    </button>
                    <button
                        onClick={clearCanvas}
                        title="清空画布"
                        style={{
                            padding: '8px',
                            background: 'white',
                            color: 'var(--foreground)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            opacity: 0.8
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8m0 0V3m0 5h5" /></svg>
                    </button>
                </div>

                <div style={{
                    background: isTransparent ? 'transparent' : bgColor,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    lineHeight: 0
                }}>
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </div>
    );
}
