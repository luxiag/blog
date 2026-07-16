'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Editor from 'react-simple-code-editor';
import { Highlight } from 'prism-react-renderer';
import {
    Play, Pause, RotateCcw, Download, Maximize, Minimize,
    Upload, ChevronDown, Clock, MousePointer, Monitor, Zap,
    Plus, X, Settings2, Image, Layers,
} from 'lucide-react';
import {
    MultiPassRenderer, makeDefaultPasses, convertShadertoyCode,
    PASS_ORDER, PASS_LABELS, BUILTIN_TEXTURES,
} from './MultiPassEngine';
import type { ShaderPass, PassId, ChannelInput } from './MultiPassEngine';

const lightTheme = {
    plain: { color: 'oklch(0.32 0 0)', backgroundColor: 'transparent' },
    styles: [
        { types: ['comment'], style: { color: '#9ca3af', fontStyle: 'italic' } },
        { types: ['keyword'], style: { color: '#ea580c' } },
        { types: ['operator'], style: { color: '#4b5563' } },
        { types: ['string', 'url', 'attr-value'], style: { color: '#ea580c' } },
        { types: ['function'], style: { color: '#7c3aed' } },
        { types: ['number', 'boolean', 'literal'], style: { color: '#2563eb' } },
        { types: ['variable', 'property'], style: { color: '#4b5563' } },
        { types: ['punctuation'], style: { color: '#9ca3af' } },
        { types: ['class-name', 'type'], style: { color: '#7c3aed' } },
        { types: ['built-in'], style: { color: '#2563eb' } },
        { types: ['preprocessor', 'meta'], style: { color: '#6b7280' } },
    ],
};

const singlePassPresets: { name: string; code: string }[] = [
    {
        name: 'Rainbow Wave',
        code: `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));
  gl_FragColor = vec4(col, 1.0);
}`,
    },
    {
        name: 'Aurora',
        code: `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
  float t = iTime * 0.5;
  vec3 col = vec3(0.0);
  for(int i = 0; i < 3; i++) {
    float fi = float(i);
    uv.x += 0.6 / (fi + 1.0) * sin(fi * 3.0 * uv.y + t + fi * 0.5);
    col += 0.5 / (fi + 1.0) * vec3(0.2, 0.4, 1.0) * (1.0 - length(uv));
  }
  gl_FragColor = vec4(col, 1.0);
}`,
    },
    {
        name: 'Mandelbrot',
        code: `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
  vec2 z = vec2(0.0);
  vec2 c = uv * 2.0 + vec2(-0.5, 0.0);
  float iter = 0.0;
  for(int i = 0; i < 64; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    if(length(z) > 2.0) break;
    iter += 1.0;
  }
  float col = iter / 64.0;
  gl_FragColor = vec4(vec3(col), 1.0);
}`,
    },
    {
        name: 'Mouse Light',
        code: `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec4 iMouse;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 mouse = iMouse.xy / iResolution.xy;
  float d = length(uv - mouse);
  vec3 col = vec3(0.05, 0.05, 0.1);
  col += vec3(0.9, 0.4, 0.1) * 0.15 / (d + 0.01);
  col += vec3(0.1, 0.2, 0.5) * 0.05 / (d * 2.0 + 0.05);
  gl_FragColor = vec4(col, 1.0);
}`,
    },
    {
        name: 'Plasma',
        code: `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float t = iTime * 0.8;
  float v = sin(uv.x * 10.0 + t);
  v += sin(10.0 * (uv.x * sin(t / 2.0) + uv.y * cos(t / 3.0)) + t);
  float cx = uv.x + 0.5 * sin(t / 5.0);
  float cy = uv.y + 0.5 * cos(t / 3.0);
  v += sin(sqrt(100.0 * (cx * cx + cy * cy)) + t);
  v *= 0.5;
  vec3 col = vec3(sin(v * 3.1416), sin(v * 3.1416 + 2.0), sin(v * 3.1416 + 4.0));
  gl_FragColor = vec4(col * 0.5 + 0.5, 1.0);
}`,
    },
];

const multiPassPresets: { name: string; passes: ShaderPass[] }[] = [
    {
        name: 'Feedback Glow',
        passes: (() => {
            const ps = makeDefaultPasses();
            ps[1].enabled = true;
            ps[1].code = `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec4 prev = texture2D(iChannel0, uv);
  vec3 col = prev.rgb * 0.97;
  col += 0.005 * vec3(0.8, 0.3, 0.1) * (1.0 + sin(iTime * 2.0 + uv.x * 10.0));
  float d = length(uv - 0.5);
  col += 0.002 * vec3(0.2, 0.5, 1.0) / (d + 0.1);
  gl_FragColor = vec4(col, 1.0);
}`;
            ps[1].channels = [{ type: 'pass', pass: 'bufA' }, { type: 'none' }, { type: 'none' }, { type: 'none' }];
            ps[0].code = `precision mediump float;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec3 col = texture2D(iChannel0, uv).rgb;
  col = pow(col, vec3(0.8));
  gl_FragColor = vec4(col, 1.0);
}`;
            ps[0].channels = [{ type: 'pass', pass: 'bufA' }, { type: 'none' }, { type: 'none' }, { type: 'none' }];
            return ps;
        })(),
    },
    {
        name: 'Fluid Sim',
        passes: (() => {
            const ps = makeDefaultPasses();
            ps[1].enabled = true;
            ps[1].code = `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec4 iMouse;
uniform sampler2D iChannel0;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 mouse = iMouse.xy / iResolution.xy;
  float d = length(uv - mouse);
  vec2 force = (uv - mouse) / max(d, 0.001) * 0.0005 * step(d, 0.15);
  vec4 prev = texture2D(iChannel0, uv - force);
  vec3 col = prev.rgb * 0.995;
  col += 0.003 * vec3(0.1, 0.4, 0.8) * step(d, 0.05);
  gl_FragColor = vec4(col, 1.0);
}`;
            ps[1].channels = [{ type: 'pass', pass: 'bufA' }, { type: 'none' }, { type: 'none' }, { type: 'none' }];
            ps[0].code = `precision mediump float;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec3 col = texture2D(iChannel0, uv).rgb;
  col = pow(col, vec3(0.9)) * 1.5;
  gl_FragColor = vec4(col, 1.0);
}`;
            ps[0].channels = [{ type: 'pass', pass: 'bufA' }, { type: 'none' }, { type: 'none' }, { type: 'none' }];
            return ps;
        })(),
    },
];

function LineNumbers({ count }: { count: number }) {
    return (
        <div className="select-none text-right pr-3 pt-4 pb-4 text-[10px] font-mono leading-[1.6] text-[var(--foreground)] opacity-30 shrink-0" style={{ minWidth: '28px' }}>
            {Array.from({ length: count }, (_, i) => (
                <div key={i}>{i + 1}</div>
            ))}
        </div>
    );
}

function ChannelSelector({ channel, passes, onChange }: {
    channel: ChannelInput;
    passes: ShaderPass[];
    onChange: (ch: ChannelInput) => void;
}) {
    const [open, setOpen] = useState(false);
    const label = channel.type === 'none' ? 'none' : channel.type === 'pass' ? (PASS_LABELS[channel.pass] || channel.pass) : channel.name;

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono text-[var(--foreground)] opacity-50 hover:opacity-80 bg-black/[0.02] border border-[var(--border-color)]/20 rounded transition-opacity"
            >
                {label}
                <ChevronDown size={7} />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-0.5 bg-white border border-[var(--border-color)] rounded shadow-lg z-50 py-0.5" style={{ minWidth: '100px' }}>
                    <button onClick={() => { onChange({ type: 'none' }); setOpen(false); }} className="block w-full px-2 py-1 text-[9px] font-mono text-left text-[var(--foreground)] opacity-50 hover:opacity-100 hover:bg-black/5">none</button>
                    {passes.filter(p => p.enabled && p.code.trim()).map(p => (
                        <button key={p.id} onClick={() => { onChange({ type: 'pass', pass: p.id }); setOpen(false); }} className="block w-full px-2 py-1 text-[9px] font-mono text-left text-[var(--foreground)] opacity-50 hover:opacity-100 hover:bg-black/5">
                            {PASS_LABELS[p.id]}
                        </button>
                    ))}
                    {BUILTIN_TEXTURES.map(name => (
                        <button key={name} onClick={() => { onChange({ type: 'texture', name }); setOpen(false); }} className="block w-full px-2 py-1 text-[9px] font-mono text-left text-[var(--foreground)] opacity-50 hover:opacity-100 hover:bg-black/5">
                            {name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ShaderCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<MultiPassRenderer | null>(null);
    const animationRef = useRef<number>(0);
    const startTimeRef = useRef<number>(Date.now());
    const frameCountRef = useRef<number>(0);
    const mouseRef = useRef<[number, number, number, number]>([0, 0, 0, 0]);
    const lastFpsTimeRef = useRef<number>(Date.now());
    const fpsFrameCountRef = useRef<number>(0);

    const [passes, setPasses] = useState<ShaderPass[]>(makeDefaultPasses());
    const [activePassId, setActivePassId] = useState<PassId>('image');
    const [error, setError] = useState('');
    const [isPlaying, setIsPlaying] = useState(true);
    const [glReady, setGlReady] = useState(false);
    const [showPresets, setShowPresets] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fps, setFps] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [showUniforms, setShowUniforms] = useState(false);
    const [showChannels, setShowChannels] = useState(false);
    const [splitRatio, setSplitRatio] = useState(0.42);
    const [draggingSplit, setDraggingSplit] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

    const activePass = passes.find(p => p.id === activePassId) || passes[0];

    const compileAndStart = useCallback((newPasses: ShaderPass[]) => {
        const gl = canvasRef.current?.getContext('webgl') as WebGLRenderingContext | null;
        if (!gl) return;
        if (!rendererRef.current) {
            rendererRef.current = new MultiPassRenderer(gl);
        }
        const r = rendererRef.current;
        const container = containerRef.current;
        if (container) {
            r.resize(container.clientWidth, container.clientHeight);
        }
        try {
            r.compile(newPasses);
            if (r.error) {
                setError(r.error);
            } else {
                setError('');
            }
        } catch (e) {
            setError((e as Error).message);
        }
    }, []);

    const render = useCallback(() => {
        const gl = canvasRef.current?.getContext('webgl') as WebGLRenderingContext | null;
        const canvas = canvasRef.current;
        const r = rendererRef.current;
        if (!gl || !r || !canvas || r.error) return;

        const timeSec = (Date.now() - startTimeRef.current) / 1000;
        r.render(passes, timeSec, mouseRef.current, frameCountRef.current, canvas);
        frameCountRef.current++;

        fpsFrameCountRef.current++;
        const now = Date.now();
        if (now - lastFpsTimeRef.current >= 500) {
            setFps(Math.round(fpsFrameCountRef.current / ((now - lastFpsTimeRef.current) / 1000)));
            fpsFrameCountRef.current = 0;
            lastFpsTimeRef.current = now;
        }

        if (isPlaying) {
            setElapsed(Math.round(timeSec * 10) / 10);
            animationRef.current = requestAnimationFrame(render);
        }
    }, [isPlaying, passes]);

    const initWebGL = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w === 0 || h === 0) return;
        canvas.width = w;
        canvas.height = h;
        setCanvasSize({ w, h });

        const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
        if (!gl) { setError('WebGL not supported'); return; }

        compileAndStart(passes);
        setGlReady(true);
    }, [passes, compileAndStart]);

    useEffect(() => {
        let attempts = 0;
        const tryInit = () => {
            const container = containerRef.current;
            if (container && container.clientWidth > 0 && container.clientHeight > 0) {
                initWebGL();
            } else if (attempts < 10) {
                attempts++;
                requestAnimationFrame(tryInit);
            }
        };
        const raf = requestAnimationFrame(tryInit);
        return () => {
            cancelAnimationFrame(raf);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (rendererRef.current) { rendererRef.current.destroy(); rendererRef.current = null; }
        };
    }, []);

    useEffect(() => {
        if (isPlaying && glReady) render();
        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [render, isPlaying, glReady]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas && container) {
                const w = container.clientWidth;
                const h = container.clientHeight;
                if (w > 0 && h > 0) {
                    canvas.width = w;
                    canvas.height = h;
                    setCanvasSize({ w, h });
                    if (rendererRef.current) rendererRef.current.resize(w, h);
                }
            }
        };
        const ro = new ResizeObserver(handleResize);
        ro.observe(container);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas!.getBoundingClientRect();
            mouseRef.current[0] = e.clientX - rect.left;
            mouseRef.current[1] = rect.height - (e.clientY - rect.top);
        };
        const handleMouseDown = (e: MouseEvent) => {
            const rect = canvas!.getBoundingClientRect();
            mouseRef.current[2] = e.clientX - rect.left;
            mouseRef.current[3] = rect.height - (e.clientY - rect.top);
        };
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mousedown', handleMouseDown);
        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                startTimeRef.current = Date.now();
                frameCountRef.current = 0;
                compileAndStart(passes);
                if (!isPlaying) setIsPlaying(true);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [passes, compileAndStart, isPlaying]);

    useEffect(() => {
        const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    useEffect(() => {
        if (!draggingSplit) return;
        const handleMove = (e: MouseEvent) => {
            const parent = document.getElementById('shader-split');
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            const ratio = Math.max(0.2, Math.min(0.7, (e.clientX - rect.left) / rect.width));
            setSplitRatio(ratio);
        };
        const handleUp = () => setDraggingSplit(false);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [draggingSplit]);

    useEffect(() => {
        if (!glReady) return;
        compileAndStart(passes);
    }, [passes, glReady, compileAndStart]);

    const handleCompile = () => {
        startTimeRef.current = Date.now();
        frameCountRef.current = 0;
        compileAndStart(passes);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            setIsPlaying(false);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        } else {
            setIsPlaying(true);
        }
    };

    const handleReset = () => {
        setPasses(makeDefaultPasses());
        setActivePassId('image');
        setError('');
        startTimeRef.current = Date.now();
        frameCountRef.current = 0;
    };

    const handlePresetSingle = (code: string) => {
        const newPasses = makeDefaultPasses();
        newPasses[0].code = code;
        setPasses(newPasses);
        setActivePassId('image');
        setShowPresets(false);
        startTimeRef.current = Date.now();
        frameCountRef.current = 0;
    };

    const handlePresetMulti = (presetPasses: ShaderPass[]) => {
        setPasses(presetPasses);
        setActivePassId('image');
        setShowPresets(false);
        startTimeRef.current = Date.now();
        frameCountRef.current = 0;
    };

    const handleScreenshot = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `shader-${Date.now()}.png`;
        a.click();
    };

    const handleFullscreen = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            canvas.requestFullscreen();
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result as string;
            const converted = convertShadertoyCode(text);
            const newPasses = makeDefaultPasses();
            newPasses[0].code = converted;
            setPasses(newPasses);
            setActivePassId('image');
            startTimeRef.current = Date.now();
            frameCountRef.current = 0;
        };
        reader.readAsText(file);
    }, []);

    const handlePassCodeChange = (code: string) => {
        setPasses(prev => prev.map(p => p.id === activePassId ? { ...p, code } : p));
    };

    const handleTogglePass = (id: PassId) => {
        if (id === 'image') return;
        setPasses(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
    };

    const handleChannelChange = (chIndex: number, value: ChannelInput) => {
        setPasses(prev => prev.map(p => {
            if (p.id !== activePassId) return p;
            const newChannels = [...p.channels] as [ChannelInput, ChannelInput, ChannelInput, ChannelInput];
            newChannels[chIndex] = value;
            return { ...p, channels: newChannels };
        }));
    };

    const lineCount = activePass.code.split('\n').length;

    const enabledPassCount = passes.filter(p => p.enabled && p.code.trim()).length;

    return (
        <div className="flex-1 flex overflow-hidden" id="shader-split">
            <div className="flex flex-col overflow-hidden" style={{ width: `${splitRatio * 100}%` }}>
                {/* Pass tabs + header */}
                <div className="h-[28px] flex items-center gap-0 px-1 bg-[var(--background)] border-b border-[var(--border-color)] shrink-0 relative z-20">
                    <div className="flex items-center overflow-x-auto gap-0 flex-1 scrollbar-none">
                        {PASS_ORDER.map(id => {
                            const p = passes.find(pp => pp.id === id);
                            if (!p) return null;
                            const isActive = id === activePassId;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActivePassId(id)}
                                    className={`flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono whitespace-nowrap transition-all shrink-0 ${
                                        isActive
                                            ? 'text-[var(--foreground)] opacity-70 border-b-2 border-[#ea580c]'
                                            : p.enabled && p.code.trim()
                                                ? 'text-[var(--foreground)] opacity-30 hover:opacity-50 border-b-2 border-transparent'
                                                : 'text-[var(--foreground)] opacity-30 hover:opacity-30 border-b-2 border-transparent'
                                    }`}
                                >
                                    {id !== 'image' && (
                                        <span
                                            onClick={(e) => { e.stopPropagation(); handleTogglePass(id); }}
                                            className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${p.enabled ? 'bg-[#059669]' : 'bg-gray-300'}`}
                                        />
                                    )}
                                    {PASS_LABELS[id]}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-1 relative shrink-0">
                        <button onClick={() => setShowPresets(p => !p)} className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-[var(--foreground)] opacity-30 hover:opacity-70 transition-opacity rounded hover:bg-black/5">
                            <Upload size={10} />
                            Presets
                            <ChevronDown size={9} />
                        </button>
                        {showPresets && (
                            <div className="absolute top-full right-0 mt-1 bg-white border border-[var(--border-color)] rounded shadow-lg z-50 py-0.5" style={{ minWidth: '180px' }}>
                                <div className="px-2 py-1 text-[8px] font-mono uppercase tracking-wider text-[var(--foreground)] opacity-30">Single Pass</div>
                                {singlePassPresets.map((p, i) => (
                                    <button key={i} onClick={() => handlePresetSingle(p.code)} className="block w-full px-3 py-1.5 text-[10px] font-mono text-left text-[var(--foreground)] opacity-60 hover:opacity-100 hover:bg-black/5 transition-all">
                                        {p.name}
                                    </button>
                                ))}
                                <div className="px-2 py-1 text-[8px] font-mono uppercase tracking-wider text-[var(--foreground)] opacity-30 border-t border-[var(--border-color)]/20 mt-0.5">Multi Pass</div>
                                {multiPassPresets.map((p, i) => (
                                    <button key={i} onClick={() => handlePresetMulti(p.passes)} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-[10px] font-mono text-left text-[var(--foreground)] opacity-60 hover:opacity-100 hover:bg-black/5 transition-all">
                                        <Layers size={9} className="opacity-40" />
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="w-px h-3 bg-[var(--border-color)]" />
                        <button onClick={() => setShowUniforms(u => !u)} className="px-1.5 py-0.5 text-[10px] font-mono text-[var(--foreground)] opacity-30 hover:opacity-70 transition-opacity rounded hover:bg-black/5">
                            Uniforms
                        </button>
                        <button onClick={() => setShowChannels(c => !c)} className="px-1.5 py-0.5 text-[10px] font-mono text-[var(--foreground)] opacity-30 hover:opacity-70 transition-opacity rounded hover:bg-black/5">
                            Channels
                        </button>
                    </div>
                </div>

                {/* Code editor area */}
                <div
                    className={`flex-1 flex overflow-hidden bg-[#fafafa] relative ${dragOver ? 'ring-2 ring-[#ea580c]/30' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                >
                    <LineNumbers count={lineCount} />
                    <div className="flex-1 overflow-auto">
                        <Editor
                            value={activePass.code}
                            onValueChange={handlePassCodeChange}
                            highlight={code => (
                                <Highlight theme={lightTheme as any} code={code} language="c">
                                    {({ tokens, getLineProps, getTokenProps }) => (
                                        <>
                                            {tokens.map((line, i) => (
                                                <div key={i} {...getLineProps({ line })}>
                                                    {line.map((token, key) => (
                                                        <span key={key} {...getTokenProps({ token })} />
                                                    ))}
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </Highlight>
                            )}
                            padding={16}
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 12,
                                lineHeight: 1.6,
                                backgroundColor: 'transparent',
                                minHeight: '100%',
                                outline: 'none',
                            }}
                        />
                    </div>

                    {/* Uniforms overlay */}
                    {showUniforms && (
                        <div className="absolute top-0 left-0 right-0 px-3 py-2 bg-white/95 backdrop-blur-sm border-b border-[var(--border-color)] z-10">
                            <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
                                <div className="px-2 py-1 rounded bg-black/[0.02] border border-[var(--border-color)]/20">
                                    <span className="text-[#ea580c] font-bold">iTime</span> <span className="text-[var(--foreground)] opacity-30">float</span>
                                    <span className="text-[var(--foreground)] opacity-30 ml-1">{elapsed}s</span>
                                </div>
                                <div className="px-2 py-1 rounded bg-black/[0.02] border border-[var(--border-color)]/20">
                                    <span className="text-[#059669] font-bold">iResolution</span> <span className="text-[var(--foreground)] opacity-30">vec2</span>
                                    <span className="text-[var(--foreground)] opacity-30 ml-1">{canvasSize.w}×{canvasSize.h}</span>
                                </div>
                                <div className="px-2 py-1 rounded bg-black/[0.02] border border-[var(--border-color)]/20">
                                    <span className="text-[#7c3aed] font-bold">iMouse</span> <span className="text-[var(--foreground)] opacity-30">vec4</span>
                                    <span className="text-[var(--foreground)] opacity-30 ml-1">xy=move, zw=click</span>
                                </div>
                                <div className="px-2 py-1 rounded bg-black/[0.02] border border-[var(--border-color)]/20">
                                    <span className="text-[#2563eb] font-bold">iFrame</span> <span className="text-[var(--foreground)] opacity-30">int</span>
                                    <span className="text-[var(--foreground)] opacity-30 ml-1">#{frameCountRef.current}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Channels overlay */}
                    {showChannels && (
                        <div className="absolute top-0 left-0 right-0 px-3 py-2 bg-white/95 backdrop-blur-sm border-b border-[var(--border-color)] z-10">
                            <div className="text-[8px] font-mono uppercase tracking-wider text-[var(--foreground)] opacity-30 mb-1.5">
                                {PASS_LABELS[activePassId]} — iChannel0~3
                            </div>
                            <div className="grid grid-cols-4 gap-1.5">
                                {activePass.channels.map((ch, i) => (
                                    <div key={i} className="px-2 py-1 rounded bg-black/[0.02] border border-[var(--border-color)]/20">
                                        <div className="text-[9px] font-mono text-[#ea580c] font-bold mb-0.5">iChannel{i}</div>
                                        <ChannelSelector channel={ch} passes={passes} onChange={(v) => handleChannelChange(i, v)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error overlay */}
                    {error && (
                        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-red-50/95 backdrop-blur-sm border-t border-red-200 z-10">
                            <div className="flex items-start gap-1.5">
                                <span className="text-[10px] font-mono font-bold text-red-600 shrink-0">ERROR</span>
                                <pre className="text-[10px] font-mono text-red-700 whitespace-pre-wrap leading-tight">{error}</pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom bar */}
                <div className="h-[28px] flex items-center gap-1 px-3 bg-[var(--background)] border-t border-[var(--border-color)] shrink-0">
                    <button onClick={handleCompile} className="flex items-center gap-1 px-3 py-0.5 text-[10px] font-mono font-bold bg-[#ea580c] text-white rounded hover:bg-orange-700 transition-colors">
                        <Play size={10} />
                        Compile
                    </button>
                    <button onClick={handlePlayPause} className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-[var(--foreground)] opacity-40 hover:opacity-80 transition-opacity rounded hover:bg-black/5">
                        {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button onClick={handleReset} className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-[var(--foreground)] opacity-40 hover:opacity-80 transition-opacity rounded hover:bg-black/5">
                        <RotateCcw size={10} />
                        Reset
                    </button>
                    <div className="flex-1" />
                    <span className="text-[9px] font-mono text-[var(--foreground)] opacity-30">
                        {enabledPassCount} pass{enabledPassCount !== 1 ? 'es' : ''}
                    </span>
                    <span className="text-[9px] font-mono text-[var(--foreground)] opacity-30">⌘+ENTER</span>
                </div>
            </div>

            {/* Splitter */}
            <div
                className="w-1 bg-[var(--border-color)] cursor-col-resize hover:bg-[#ea580c] transition-colors shrink-0"
                onMouseDown={() => setDraggingSplit(true)}
            />

            {/* Preview panel */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="h-[28px] flex items-center justify-between px-3 bg-[var(--background)] border-b border-[var(--border-color)] shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[var(--foreground)] opacity-40">Preview</span>
                        {isPlaying ? (
                            <span className="flex items-center gap-1 text-[9px] font-mono text-[#059669]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                                Live
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-25">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                Paused
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-[var(--foreground)] opacity-30">{fps} FPS</span>
                        <span className="text-[9px] font-mono text-[var(--foreground)] opacity-30">{canvasSize.w}×{canvasSize.h}</span>
                        <div className="w-px h-3 bg-[var(--border-color)]" />
                        <button onClick={handleScreenshot} className="p-1 text-[var(--foreground)] opacity-25 hover:opacity-70 transition-opacity" title="Save PNG">
                            <Download size={12} />
                        </button>
                        <button onClick={handleFullscreen} className="p-1 text-[var(--foreground)] opacity-25 hover:opacity-70 transition-opacity" title="Fullscreen">
                            {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />}
                        </button>
                    </div>
                </div>

                <div ref={containerRef} className="flex-1 relative bg-black overflow-hidden">
                    <canvas ref={canvasRef} className="w-full h-full block" style={{ display: 'block', width: '100%', height: '100%' }} />
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <div className="flex items-center gap-2 px-4 py-2 bg-black/60 rounded text-white text-[10px] font-mono uppercase tracking-wider">
                                <Play size={12} />
                                Paused
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-[28px] flex items-center gap-3 px-3 bg-[var(--background)] border-t border-[var(--border-color)] shrink-0">
                    <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-30">
                        <Clock size={9} />
                        {elapsed.toFixed(1)}s
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-30">
                        <MousePointer size={9} />
                        iMouse
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-30">
                        <Monitor size={9} />
                        WebGL
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-30">
                        <Zap size={9} />
                        {fps} FPS
                    </div>
                </div>
            </div>
        </div>
    );
}
