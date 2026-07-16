'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';

const MAX_HISTORY = 50;
interface HistoryState { json: string; }

export default function ImageEditorCanvas() {
    const mountRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<fabric.Canvas | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const historyRef = useRef<HistoryState[]>([]);
    const historyIndexRef = useRef<number>(-1);
    const isRestoringRef = useRef<boolean>(false);
    const clipboardRef = useRef<fabric.FabricObject | null>(null);
    const lineStartRef = useRef<{ x: number; y: number } | null>(null);
    const tempLineRef = useRef<fabric.Line | null>(null);
    const tempArrowRef = useRef<fabric.Triangle | null>(null);
    const cropRectRef = useRef<fabric.Rect | null>(null);
    const cropOverlayRef = useRef<fabric.Rect | null>(null);

    const [activeTool, setActiveTool] = useState<string>('select');
    const [brushColor, setBrushColor] = useState<string>('#ea580c');
    const [brushWidth, setBrushWidth] = useState<number>(5);
    const [bgColor, setBgColor] = useState<string>('#ffffff');
    const [isTransparent, setIsTransparent] = useState<boolean>(false);
    const [hasSelection, setHasSelection] = useState<boolean>(false);
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    const [canUndo, setCanUndo] = useState<boolean>(false);
    const [canRedo, setCanRedo] = useState<boolean>(false);
    const [textFormat, setTextFormat] = useState<{
        bold: boolean; italic: boolean; fontSize: number; fontFamily: string;
    }>({ bold: false, italic: false, fontSize: 20, fontFamily: 'sans-serif' });
    const [isCropping, setIsCropping] = useState<boolean>(false);
    const [pickedColor, setPickedColor] = useState<string | null>(null);
    const saveHistory = useCallback(() => {
        const c = canvasRef.current;
        if (!c || isRestoringRef.current) return;
        const json = JSON.stringify(c.toJSON());
        const idx = historyIndexRef.current;
        if (idx < historyRef.current.length - 1) {
            historyRef.current = historyRef.current.slice(0, idx + 1);
        }
        historyRef.current.push({ json });
        if (historyRef.current.length > MAX_HISTORY) {
            historyRef.current.shift();
        }
        historyIndexRef.current = historyRef.current.length - 1;
        setCanUndo(historyIndexRef.current > 0);
        setCanRedo(false);
    }, []);

    const undo = useCallback(() => {
        const c = canvasRef.current;
        if (!c || historyIndexRef.current <= 0) return;
        isRestoringRef.current = true;
        historyIndexRef.current--;
        const state = historyRef.current[historyIndexRef.current];
        c.loadFromJSON(state.json).then(() => {
            c.renderAll();
            isRestoringRef.current = false;
            setCanUndo(historyIndexRef.current > 0);
            setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
        });
    }, []);

    const redo = useCallback(() => {
        const c = canvasRef.current;
        if (!c || historyIndexRef.current >= historyRef.current.length - 1) return;
        isRestoringRef.current = true;
        historyIndexRef.current++;
        const state = historyRef.current[historyIndexRef.current];
        c.loadFromJSON(state.json).then(() => {
            c.renderAll();
            isRestoringRef.current = false;
            setCanUndo(historyIndexRef.current > 0);
            setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
        });
    }, []);
    useEffect(() => {
        if (!mountRef.current || !containerRef.current) return;
        const container = containerRef.current;
        const mount = mountRef.current;
        const el = document.createElement('canvas');
        mount.appendChild(el);
        const w = container.clientWidth;
        const h = container.clientHeight || Math.max(w * 0.6, 400);
        const c = new fabric.Canvas(el, { width: w, height: h, backgroundColor: 'transparent' });
        canvasRef.current = c;

        c.on('selection:created', () => setHasSelection(true));
        c.on('selection:updated', () => setHasSelection(true));
        c.on('selection:cleared', () => setHasSelection(false));
        c.on('object:modified', () => saveHistory());
        c.on('object:added', () => saveHistory());
        c.on('object:removed', () => saveHistory());

        const initialJson = JSON.stringify(c.toJSON());
        historyRef.current = [{ json: initialJson }];
        historyIndexRef.current = 0;

        const handleResize = () => {
            const nw = container.clientWidth;
            const nh = container.clientHeight || Math.max(nw * 0.6, 400);
            c.setDimensions({ width: nw, height: nh });
            c.renderAll();
        };
        const ro = new ResizeObserver(handleResize);
        ro.observe(container);

        return () => {
            ro.disconnect();
            c.dispose();
            if (mount.contains(el)) mount.removeChild(el);
            canvasRef.current = null;
        };
    }, [saveHistory]);

    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;
        c.backgroundColor = isTransparent ? 'transparent' : bgColor;
        c.renderAll();
    }, [bgColor, isTransparent]);
    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;

        if (activeTool === 'draw') {
            c.isDrawingMode = true;
            if (!c.freeDrawingBrush) c.freeDrawingBrush = new fabric.PencilBrush(c);
            const pb = c.freeDrawingBrush as fabric.PencilBrush;
            pb.color = brushColor;
            pb.width = brushWidth;
            (pb as fabric.PencilBrush & { globalCompositeOperation?: string }).globalCompositeOperation = 'source-over';
        } else if (activeTool === 'eraser') {
            c.isDrawingMode = true;
            if (!c.freeDrawingBrush) c.freeDrawingBrush = new fabric.PencilBrush(c);
            const eb = c.freeDrawingBrush as fabric.PencilBrush;
            eb.color = 'rgba(0,0,0,1)';
            eb.width = brushWidth * 3;
            (eb as fabric.PencilBrush & { globalCompositeOperation?: string }).globalCompositeOperation = 'destination-out';
        } else {
            c.isDrawingMode = false;
        }

        if (activeTool === 'line' || activeTool === 'arrow') {
            const onDown = (opt: fabric.TEvent) => {
                const p = c.getScenePoint(opt.e);
                lineStartRef.current = { x: p.x, y: p.y };
                const line = new fabric.Line([p.x, p.y, p.x, p.y], {
                    stroke: brushColor, strokeWidth: brushWidth, selectable: true, evented: true,
                });
                tempLineRef.current = line;
                c.add(line);
            };
            const onMove = (opt: fabric.TEvent) => {
                if (!lineStartRef.current || !tempLineRef.current) return;
                const p = c.getScenePoint(opt.e);
                tempLineRef.current.set({ x2: p.x, y2: p.y });
                c.renderAll();
            };
            const onUp = (opt: fabric.TEvent) => {
                if (!lineStartRef.current || !tempLineRef.current) {
                    lineStartRef.current = null;
                    return;
                }
                const p = c.getScenePoint(opt.e);
                if (activeTool === 'arrow') {
                    const dx = p.x - lineStartRef.current.x;
                    const dy = p.y - lineStartRef.current.y;
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    const sz = Math.max(brushWidth * 3, 12);
                    const tri = new fabric.Triangle({
                        left: p.x, top: p.y, width: sz, height: sz,
                        fill: brushColor, angle: angle + 90,
                        originX: 'center', originY: 'center',
                        selectable: true, evented: true,
                    });
                    tempArrowRef.current = tri;
                    c.add(tri);
                }
                c.setActiveObject(tempLineRef.current);
                lineStartRef.current = null;
                tempLineRef.current = null;
                tempArrowRef.current = null;
                c.renderAll();
            };
            c.on('mouse:down', onDown);
            c.on('mouse:move', onMove);
            c.on('mouse:up', onUp);
            return () => {
                c.off('mouse:down', onDown);
                c.off('mouse:move', onMove);
                c.off('mouse:up', onUp);
            };
        }

        if (activeTool === 'eyedropper') {
            const onDown = (opt: fabric.TEvent) => {
                const p = c.getScenePoint(opt.e);
                const ctx = c.getContext();
                const pixel = ctx.getImageData(Math.round(p.x), Math.round(p.y), 1, 1).data;
                const hex = '#' + [pixel[0], pixel[1], pixel[2]]
                    .map(v => v.toString(16).padStart(2, '0')).join('');
                setPickedColor(hex);
                setBrushColor(hex);
            };
            c.on('mouse:down', onDown);
            return () => { c.off('mouse:down', onDown); };
        }
    }, [activeTool, brushColor, brushWidth]);
    useEffect(() => {
        const c = canvasRef.current;
        if (!c || !hasSelection) return;
        const obj = c.getActiveObject();
        if (obj && (obj instanceof fabric.IText || obj instanceof fabric.FabricText || obj instanceof fabric.Textbox)) {
            const ft = obj as fabric.FabricText;
            setTextFormat({
                bold: String(ft.fontWeight ?? 'normal').includes('bold'),
                italic: ft.fontStyle?.includes('italic') ?? false,
                fontSize: ft.fontSize ?? 20,
                fontFamily: ft.fontFamily ?? 'sans-serif',
            });
        }
    }, [hasSelection, activeTool]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const c = canvasRef.current;
        if (!file || !c) return;
        const reader = new FileReader();
        reader.onload = async (f) => {
            const data = f.target?.result;
            if (typeof data === 'string') {
                try {
                    const img = await fabric.FabricImage.fromURL(data, { crossOrigin: 'anonymous' });
                    const cw = c.getWidth();
                    const ch = c.getHeight();
                    const iw = img.width ?? 100;
                    const ih = img.height ?? 100;
                    const scale = Math.min((cw * 0.8) / iw, (ch * 0.8) / ih);
                    img.scale(scale);
                    img.set({
                        left: (cw - iw * scale) / 2,
                        top: (ch - ih * scale) / 2,
                        originX: 'left',
                        originY: 'top',
                    });
                    c.add(img);
                    c.setActiveObject(img);
                    c.renderAll();
                } catch (err) {
                    // handled
                }
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const addRect = () => {
        const c = canvasRef.current;
        if (!c) return;
        const rect = new fabric.Rect({
            left: 100, top: 100, fill: brushColor, width: 100, height: 100,
        });
        c.add(rect);
        c.setActiveObject(rect);
    };

    const addCircle = () => {
        const c = canvasRef.current;
        if (!c) return;
        const circle = new fabric.Circle({
            left: 150, top: 150, fill: brushColor, radius: 50,
        });
        c.add(circle);
        c.setActiveObject(circle);
    };

    const addText = () => {
        const c = canvasRef.current;
        if (!c) return;
        const text = new fabric.IText('Hello World', {
            left: 200, top: 200, fontFamily: textFormat.fontFamily, fill: brushColor,
            fontSize: textFormat.fontSize,
            fontStyle: textFormat.italic ? 'italic' : 'normal',
            fontWeight: textFormat.bold ? 'bold' : 'normal',
        });
        c.add(text);
        c.setActiveObject(text);
    };

    const deleteSelected = () => {
        const c = canvasRef.current;
        if (!c) return;
        c.remove(...c.getActiveObjects());
        c.discardActiveObject();
        c.renderAll();
    };

    const clearCanvas = () => {
        const c = canvasRef.current;
        if (!c) return;
        c.clear();
        c.backgroundColor = isTransparent ? 'transparent' : bgColor;
        c.renderAll();
    };

    const downloadImage = () => {
        const c = canvasRef.current;
        if (!c) return;
        const dataURL = c.toDataURL({ format: 'png', quality: 1, multiplier: 1 });
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = dataURL;
        link.click();
    };

    const downloadSelection = () => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject) {
            const dataURL = activeObject.toDataURL({ format: 'png', quality: 1, multiplier: 1 });
            const link = document.createElement('a');
            link.download = 'selection.png';
            link.href = dataURL;
            link.click();
        }
    };

    const applyFilter = async (filterType: string, value?: number) => {
        const c = canvasRef.current;
        if (!c) return;
        const activeObject = c.getActiveObject();
        if (activeObject instanceof fabric.FabricImage) {
            let filter;
            switch (filterType) {
                case 'grayscale': filter = new fabric.filters.Grayscale(); break;
                case 'sepia': filter = new fabric.filters.Sepia(); break;
                case 'invert': filter = new fabric.filters.Invert(); break;
                case 'brightness': filter = new fabric.filters.Brightness({ brightness: value || 0.1 }); break;
                case 'contrast': filter = new fabric.filters.Contrast({ contrast: value || 0.1 }); break;
                case 'blur': filter = new fabric.filters.Blur({ blur: value || 0.5 }); break;
                case 'pixelate': filter = new fabric.filters.Pixelate({ blocksize: value || 4 }); break;
                case 'none': activeObject.filters = []; break;
                default: return;
            }
            if (filter) activeObject.filters.push(filter);
            await activeObject.applyFilters();
            c.renderAll();
        }
    };
    const rotateSelected = (angle: number) => {
        const c = canvasRef.current;
        if (!c) return;
        const obj = c.getActiveObject();
        if (!obj) return;
        obj.rotate((obj.angle ?? 0) + angle);
        obj.setCoords();
        c.renderAll();
    };

    const flipSelected = (direction: 'h' | 'v') => {
        const c = canvasRef.current;
        if (!c) return;
        const obj = c.getActiveObject();
        if (!obj) return;
        if (direction === 'h') {
            obj.set('flipX', !obj.flipX);
        } else {
            obj.set('flipY', !obj.flipY);
        }
        obj.setCoords();
        c.renderAll();
    };

    const bringForward = () => {
        const c = canvasRef.current;
        if (!c) return;
        const obj = c.getActiveObject();
        if (!obj) return;
        c.bringObjectForward(obj);
        c.renderAll();
    };

    const sendBackward = () => {
        const c = canvasRef.current;
        if (!c) return;
        const obj = c.getActiveObject();
        if (!obj) return;
        c.sendObjectBackwards(obj);
        c.renderAll();
    };

    const zoomCanvas = (delta: number) => {
        const c = canvasRef.current;
        if (!c) return;
        let zoom = c.getZoom();
        zoom *= delta > 0 ? 1.1 : 0.9;
        zoom = Math.min(Math.max(zoom, 0.1), 10);
        const center = c.getCenterPoint();
        c.zoomToPoint(center, zoom);
        setZoomLevel(Math.round(zoom * 100));
    };

    const zoomFit = () => {
        const c = canvasRef.current;
        if (!c) return;
        c.setViewportTransform([1, 0, 0, 1, 0, 0]);
        setZoomLevel(100);
        c.renderAll();
    };

    const applyTextFormat = (key: 'bold' | 'italic' | 'fontSize' | 'fontFamily', value: boolean | number | string) => {
        const c = canvasRef.current;
        if (!c) return;
        const obj = c.getActiveObject();
        if (!obj || !(obj instanceof fabric.FabricText)) return;
        const nf = { ...textFormat, [key]: value };
        setTextFormat(nf);
        obj.set({
            fontStyle: nf.italic ? 'italic' : 'normal',
            fontWeight: nf.bold ? 'bold' : 'normal',
            fontSize: nf.fontSize,
            fontFamily: nf.fontFamily,
        });
        obj.setCoords();
        c.renderAll();
    };

    const startCrop = () => {
        const c = canvasRef.current;
        if (!c) return;
        const obj = c.getActiveObject();
        if (!obj) return;
        setIsCropping(true);
        setActiveTool('select');
        const bounds = obj.getBoundingRect();
        const overlay = new fabric.Rect({
            left: 0, top: 0, width: c.getWidth(), height: c.getHeight(),
            fill: 'rgba(0,0,0,0.5)', selectable: false, evented: false,
        });
        cropOverlayRef.current = overlay;
        c.add(overlay);
        const cropRect = new fabric.Rect({
            left: bounds.left, top: bounds.top,
            width: bounds.width, height: bounds.height,
            fill: 'transparent', stroke: '#ea580c', strokeWidth: 2,
            strokeDashArray: [6, 3], cornerColor: '#ea580c', cornerSize: 8,
            transparentCorners: false, selectable: true, evented: true,
        });
        cropRectRef.current = cropRect;
        c.add(cropRect);
        c.setActiveObject(cropRect);
        c.renderAll();
    };

    const applyCrop = () => {
        const c = canvasRef.current;
        if (!c || !cropRectRef.current) return;
        const cr = cropRectRef.current;
        const cl = cr.left ?? 0;
        const ct = cr.top ?? 0;
        const cw = (cr.width ?? 0) * (cr.scaleX ?? 1);
        const ch = (cr.height ?? 0) * (cr.scaleY ?? 1);
        if (cropOverlayRef.current) c.remove(cropOverlayRef.current);
        c.remove(cr);
        cropOverlayRef.current = null;
        cropRectRef.current = null;
        const clipPath = new fabric.Rect({
            left: cl, top: ct, width: cw, height: ch, absolutePositioned: true,
        });
        c.getObjects().forEach(obj => {
            if (obj !== clipPath) obj.clipPath = clipPath;
        });
        c.discardActiveObject();
        c.renderAll();
        setIsCropping(false);
        saveHistory();
    };

    const cancelCrop = () => {
        const c = canvasRef.current;
        if (!c) return;
        if (cropOverlayRef.current) c.remove(cropOverlayRef.current);
        if (cropRectRef.current) c.remove(cropRectRef.current);
        cropOverlayRef.current = null;
        cropRectRef.current = null;
        c.discardActiveObject();
        c.renderAll();
        setIsCropping(false);
    };

    const copySelected = () => {
        const c = canvasRef.current;
        if (!c) return;
        const obj = c.getActiveObject();
        if (!obj) return;
        obj.clone().then((cloned: fabric.FabricObject) => {
            clipboardRef.current = cloned;
        });
    };

    const pasteSelected = () => {
        const c = canvasRef.current;
        if (!c || !clipboardRef.current) return;
        clipboardRef.current.clone().then((cloned: fabric.FabricObject) => {
            cloned.set({ left: (cloned.left ?? 0) + 20, top: (cloned.top ?? 0) + 20, evented: true });
            c.add(cloned);
            c.setActiveObject(cloned);
            c.renderAll();
        });
    };
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const c = canvasRef.current;
        if (!c) return;
        const active = c.getActiveObject();
        const isEditing = active && (active instanceof fabric.IText) && active.isEditing;
        if (isEditing) return;
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            if (e.shiftKey) redo(); else undo();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') { e.preventDefault(); copySelected(); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'v') { e.preventDefault(); pasteSelected(); }
        if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteSelected(); }
        if ((e.ctrlKey || e.metaKey) && e.key === '=') { e.preventDefault(); zoomCanvas(1); }
        if ((e.ctrlKey || e.metaKey) && e.key === '-') { e.preventDefault(); zoomCanvas(-1); }
        if ((e.ctrlKey || e.metaKey) && e.key === '0') { e.preventDefault(); zoomFit(); }
    }, [undo, redo]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleWheelZoom = useCallback((e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            zoomCanvas(e.deltaY < 0 ? 1 : -1);
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.addEventListener('wheel', handleWheelZoom, { passive: false });
        return () => container.removeEventListener('wheel', handleWheelZoom);
    }, [handleWheelZoom]);
    const tb = (active: boolean): React.CSSProperties => ({
        padding: '5px 10px', borderRadius: '6px', border: 'none',
        background: active ? 'var(--foreground)' : 'transparent',
        color: active ? 'white' : 'var(--foreground)',
        fontSize: '11px', fontWeight: 500, cursor: 'pointer',
        transition: 'all 0.15s ease', whiteSpace: 'nowrap' as const,
    });

    const ib: React.CSSProperties = {
        padding: '5px 7px', border: 'none', borderRadius: '6px',
        background: 'transparent', color: 'var(--foreground)',
        cursor: 'pointer', transition: 'all 0.15s ease',
        display: 'flex', alignItems: 'center',
    };

    const sep: React.CSSProperties = {
        width: '1px', height: '16px', background: 'var(--border-color)',
        opacity: 0.3, flexShrink: 0,
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 49px)', minHeight: '400px',
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px', borderBottom: '1px solid var(--border-color)',
                flexWrap: 'wrap', flexShrink: 0, fontSize: '11px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {(['select', 'draw', 'eraser', 'line', 'arrow', 'eyedropper'] as const).map(tool => (
                        <button key={tool}
                            onClick={() => { setActiveTool(tool); if (tool !== 'eyedropper') setPickedColor(null); }}
                            style={tb(activeTool === tool)}>
                            {{ select: '选择', draw: '画笔', eraser: '橡皮', line: '直线', arrow: '箭头', eyedropper: '取色' }[tool]}
                        </button>
                    ))}
                </div>

                <div style={sep} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <button onClick={addRect} title="矩形" style={ib}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="1" /></svg>
                    </button>
                    <button onClick={addCircle} title="圆形" style={ib}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /></svg>
                    </button>
                    <button onClick={addText} title="文字" style={ib}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4h12M12 4v16m-4 0h8" /></svg>
                    </button>
                </div>

                <div style={sep} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <button onClick={undo} disabled={!canUndo} title="撤销 Ctrl+Z" style={{ ...ib, opacity: canUndo ? 1 : 0.3 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h13a4 4 0 0 1 0 8H9m-6-8l4-4m-4 4l4 4" /></svg>
                    </button>
                    <button onClick={redo} disabled={!canRedo} title="重做 Ctrl+Shift+Z" style={{ ...ib, opacity: canRedo ? 1 : 0.3 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10H8a4 4 0 0 0 0 8h7m6-8l-4-4m4 4l-4 4" /></svg>
                    </button>
                </div>

                <div style={sep} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <button onClick={() => rotateSelected(-90)} title="左旋90" style={ib}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4v6h6M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
                    </button>
                    <button onClick={() => rotateSelected(90)} title="右旋90" style={ib}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 4v6h-6M20.49 15a9 9 0 1 1-2.13-9.36L23 10" /></svg>
                    </button>
                    <button onClick={() => flipSelected('h')} title="水平翻转" style={ib}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M12 20V4" /></svg>
                    </button>
                    <button onClick={() => flipSelected('v')} title="垂直翻转" style={ib}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(90 12 12)"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M12 20V4" /></svg>
                    </button>
                </div>

                <div style={sep} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <button onClick={bringForward} title="上移一层" style={ib}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19V5m0 0l-5 5m5-5l5 5" /></svg>
                    </button>
                    <button onClick={sendBackward} title="下移一层" style={ib}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14m0 0l5-5m-5 5l-5-5" /></svg>
                    </button>
                </div>
                <div style={sep} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                        <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: '2px solid var(--foreground)', borderRadius: '50%', cursor: 'pointer', padding: 0 }} />
                    </div>
                    {pickedColor && (
                        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--foreground)' }}>{pickedColor}</span>
                    )}
                    <input type="range" min="1" max="50" value={brushWidth} onChange={(e) => setBrushWidth(parseInt(e.target.value))}
                        style={{ width: '60px', height: '3px', accentColor: 'var(--foreground)', cursor: 'pointer' }} />
                </div>

                <div style={sep} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {[
                        { id: 'none', label: '原图' }, { id: 'grayscale', label: '黑白' },
                        { id: 'sepia', label: '怀旧' }, { id: 'invert', label: '反色' },
                        { id: 'brightness', label: '亮度' }, { id: 'contrast', label: '对比' },
                        { id: 'blur', label: '模糊' }, { id: 'pixelate', label: '像素' }
                    ].map(f => (
                        <button key={f.id} onClick={() => applyFilter(f.id)}
                            style={{ padding: '4px 7px', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 500, background: 'transparent', color: 'var(--foreground)', cursor: 'pointer', transition: 'all 0.15s ease' }}>
                            {f.label}
                        </button>
                    ))}
                </div>

                <div style={sep} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 500, cursor: 'pointer', color: 'var(--foreground)' }}>
                        <input type="checkbox" checked={isTransparent} onChange={(e) => setIsTransparent(e.target.checked)} style={{ width: '12px', height: '12px', cursor: 'pointer' }} />
                        透明
                    </label>
                    {!isTransparent && (
                        <div style={{ position: 'relative', width: '16px', height: '16px' }}>
                            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: '1px solid var(--border-color)', borderRadius: '3px', cursor: 'pointer', padding: 0 }} />
                        </div>
                    )}
                </div>

                <div style={sep} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button onClick={() => zoomCanvas(-1)} title="缩小" style={ib}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M8 11h6" /></svg>
                    </button>
                    <span style={{ fontSize: '10px', minWidth: '36px', textAlign: 'center', color: 'var(--foreground)' }}>{zoomLevel}%</span>
                    <button onClick={() => zoomCanvas(1)} title="放大" style={ib}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M8 11h6M11 8v6" /></svg>
                    </button>
                    <button onClick={zoomFit} title="重置缩放" style={{ ...ib, fontSize: '10px', padding: '5px 6px' }}>1:1</button>
                </div>
                <div style={{ flex: 1 }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload} />
                    <button onClick={() => fileInputRef.current?.click()}
                        style={{ padding: '5px 10px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '11px', fontWeight: 500, background: 'transparent', color: 'var(--foreground)', cursor: 'pointer' }}>
                        上传
                    </button>
                    <button onClick={clearCanvas} title="清空"
                        style={{ padding: '5px 7px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'transparent', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8m0 0V3m0 5h5" /></svg>
                    </button>
                    <button onClick={downloadImage}
                        style={{ padding: '5px 10px', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: 'var(--foreground)', color: 'white', cursor: 'pointer' }}>
                        导出
                    </button>
                </div>
            </div>

            <div
                ref={containerRef}
                style={{
                    flex: 1, position: 'relative', overflow: 'hidden',
                    background: isTransparent
                        ? 'repeating-conic-gradient(#e5e5e5 0% 25%, transparent 0% 50%) 0 0 / 16px 16px'
                        : bgColor,
                }}
            >
                {hasSelection && !isCropping && (
                    <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        display: 'flex', gap: '6px', zIndex: 10, flexWrap: 'wrap',
                    }}>
                        <button onClick={deleteSelected} title="删除选中"
                            style={{ padding: '5px', background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6m4-6v6" /></svg>
                        </button>
                        <button onClick={downloadSelection} title="导出选中"
                            style={{ padding: '5px 8px', background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: 500, gap: '4px' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14l-7 7-7-7m7 7V3" /></svg>
                            保存选中
                        </button>
                        <button onClick={startCrop} title="裁剪"
                            style={{ padding: '5px 8px', background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: 500, gap: '4px' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15M1 6.13L16 6a2 2 0 0 1 2 2v15" /></svg>
                            裁剪
                        </button>
                        <button onClick={copySelected} title="复制 Ctrl+C"
                            style={{ padding: '5px 8px', background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: 500, gap: '4px' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                            复制
                        </button>
                    </div>
                )}

                {isCropping && (
                    <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        display: 'flex', gap: '6px', zIndex: 10,
                    }}>
                        <button onClick={applyCrop}
                            style={{ padding: '5px 10px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                            应用裁剪
                        </button>
                        <button onClick={cancelCrop}
                            style={{ padding: '5px 10px', background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 500 }}>
                            取消
                        </button>
                    </div>
                )}

                <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    );
}