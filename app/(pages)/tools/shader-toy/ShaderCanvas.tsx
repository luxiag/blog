'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Editor from 'react-simple-code-editor';
import { Highlight } from 'prism-react-renderer';
import {
    Play, Pause, RotateCcw, Download, Maximize, Minimize,
    Upload, ChevronDown, Clock, MousePointer, Monitor, Zap,
} from 'lucide-react';

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

const defaultVertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const defaultFragmentShader = `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec4 iMouse;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));
  gl_FragColor = vec4(col, 1.0);
}`;

const presetShaders: { name: string; code: string }[] = [
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
        name: 'Grid Pattern',
        code: `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 grid = fract(uv * 10.0);
  float line = step(0.95, grid.x) + step(0.95, grid.y);
  vec3 col = mix(vec3(0.1, 0.1, 0.15), vec3(0.0, 0.8, 0.5), line);
  gl_FragColor = vec4(col, 1.0);
}`,
    },
    {
        name: 'Smoke Flow',
        code: `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float t = iTime * 0.3;
  vec3 col = vec3(0.0);
  for(float i = 1.0; i < 4.0; i++) {
    uv.x += 0.3 / i * sin(i * uv.y * 3.0 + t);
    uv.y += 0.3 / i * cos(i * uv.x * 3.0 + t);
  }
  col = 0.5 + 0.5 * sin(vec3(0.5, 0.7, 0.9) + uv.x + uv.y);
  gl_FragColor = vec4(col * 0.6, 1.0);
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
        name: 'Star Field',
        code: `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec3 col = vec3(0.02, 0.02, 0.05);
  for(int i = 0; i < 30; i++) {
    float t = iTime * 0.5 + float(i) * 1.0;
    vec2 p = vec2(hash(vec2(float(i), 0.0)), hash(vec2(0.0, float(i))));
    p = 0.5 + 0.4 * sin(t + 6.28 * p);
    float d = length(uv - p);
    col += 0.002 / (d + 0.01);
  }
  gl_FragColor = vec4(col, 1.0);
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

function convertShadertoyCode(code: string): string {
    let converted = code;
    if (converted.includes('mainImage')) {
        converted = converted.replace(/void\s+mainImage\s*\([^)]*\)\s*\{/g, 'void main() {');
        converted = converted.replace(/fragColor/g, 'gl_FragColor');
        converted = converted.replace(/fragCoord/g, 'gl_FragCoord');
    }
    if (!converted.includes('precision')) {
        converted = 'precision mediump float;\n' + converted;
    }
    if (converted.includes('iGlobalTime') && !converted.includes('iTime')) {
        converted = converted.replace(/iGlobalTime/g, 'iTime');
    }
    if (!converted.includes('uniform float iTime')) {
        const precisionMatch = converted.match(/(precision\s+\w+\s+\w+;)/);
        if (precisionMatch) {
            converted = converted.replace(
                precisionMatch[1],
                precisionMatch[1] + '\nuniform float iTime;\nuniform vec2 iResolution;\nuniform vec4 iMouse;\nuniform int iFrame;'
            );
        }
    }
    if (!converted.includes('uniform vec4 iMouse')) {
        const timeMatch = converted.match(/uniform float iTime;/);
        if (timeMatch) {
            converted = converted.replace('uniform float iTime;', 'uniform float iTime;\nuniform vec4 iMouse;\nuniform int iFrame;');
        }
    }
    return converted;
}

function LineNumbers({ count }: { count: number }) {
    return (
        <div className="select-none text-right pr-3 pt-4 pb-4 text-[10px] font-mono leading-[1.6] text-[var(--foreground)] opacity-15 shrink-0" style={{ minWidth: '28px' }}>
            {Array.from({ length: count }, (_, i) => (
                <div key={i}>{i + 1}</div>
            ))}
        </div>
    );
}

export default function ShaderCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const editorScrollRef = useRef<HTMLDivElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const animationRef = useRef<number>(0);
    const startTimeRef = useRef<number>(Date.now());
    const frameCountRef = useRef<number>(0);
    const mouseRef = useRef<[number, number, number, number]>([0, 0, 0, 0]);
    const lastFpsTimeRef = useRef<number>(Date.now());
    const fpsFrameCountRef = useRef<number>(0);

    const [fragmentShader, setFragmentShader] = useState(defaultFragmentShader);
    const [error, setError] = useState('');
    const [isPlaying, setIsPlaying] = useState(true);
    const [glReady, setGlReady] = useState(false);
    const [showPresets, setShowPresets] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fps, setFps] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [showUniforms, setShowUniforms] = useState(false);
    const [splitRatio, setSplitRatio] = useState(0.42);
    const [draggingSplit, setDraggingSplit] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

    const compileShader = useCallback((gl: WebGLRenderingContext, source: string, type: number) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const errorMsg = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(errorMsg || 'Shader compilation failed');
        }
        return shader;
    }, []);

    const createProgram = useCallback((gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) => {
        const program = gl.createProgram();
        if (!program) return null;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const errorMsg = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(errorMsg || 'Program linking failed');
        }
        return program;
    }, []);

    const buildProgram = useCallback((gl: WebGLRenderingContext, fragSrc: string) => {
        const vs = compileShader(gl, defaultVertexShader, gl.VERTEX_SHADER);
        if (!vs) throw new Error('Vertex shader failed');
        const fs = compileShader(gl, fragSrc, gl.FRAGMENT_SHADER);
        if (!fs) throw new Error('Fragment shader failed');
        const prog = createProgram(gl, vs, fs);
        if (!prog) throw new Error('Program link failed');
        if (programRef.current) gl.deleteProgram(programRef.current);
        programRef.current = prog;
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        const posLoc = gl.getAttribLocation(prog, 'position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        return prog;
    }, [compileShader, createProgram]);

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
        glRef.current = gl;
        try {
            buildProgram(gl, fragmentShader);
            setError('');
            setGlReady(true);
        } catch (err) {
            setError((err as Error).message);
        }
    }, [fragmentShader, buildProgram]);

    const updateShader = useCallback(() => {
        const gl = glRef.current;
        if (!gl) return;
        try {
            buildProgram(gl, fragmentShader);
            setError('');
        } catch (err) {
            setError((err as Error).message);
        }
    }, [fragmentShader, buildProgram]);

    const render = useCallback(() => {
        const gl = glRef.current;
        const program = programRef.current;
        const canvas = canvasRef.current;
        if (!gl || !program || !canvas) return;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);

        const timeLocation = gl.getUniformLocation(program, 'iTime');
        const resolutionLocation = gl.getUniformLocation(program, 'iResolution');
        const mouseLocation = gl.getUniformLocation(program, 'iMouse');
        const frameLocation = gl.getUniformLocation(program, 'iFrame');

        const elapsedSec = (Date.now() - startTimeRef.current) / 1000;
        if (timeLocation) gl.uniform1f(timeLocation, elapsedSec);
        if (resolutionLocation) gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        if (mouseLocation) gl.uniform4f(mouseLocation, mouseRef.current[0], mouseRef.current[1], mouseRef.current[2], mouseRef.current[3]);
        if (frameLocation) gl.uniform1i(frameLocation, frameCountRef.current);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        frameCountRef.current++;

        fpsFrameCountRef.current++;
        const now = Date.now();
        if (now - lastFpsTimeRef.current >= 500) {
            setFps(Math.round(fpsFrameCountRef.current / ((now - lastFpsTimeRef.current) / 1000)));
            fpsFrameCountRef.current = 0;
            lastFpsTimeRef.current = now;
        }

        if (isPlaying) {
            setElapsed(Math.round(elapsedSec * 10) / 10);
            animationRef.current = requestAnimationFrame(render);
        }
    }, [isPlaying]);

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
        };
    }, []);

    useEffect(() => {
        if (isPlaying && glReady) render();
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
                    if (!isPlaying) render();
                }
            }
        };
        const ro = new ResizeObserver(handleResize);
        ro.observe(container);
        return () => ro.disconnect();
    }, [render, isPlaying]);

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
                updateShader();
                startTimeRef.current = Date.now();
                frameCountRef.current = 0;
                if (!isPlaying) { setIsPlaying(true); }
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [updateShader, isPlaying]);

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

    const handleCompile = () => {
        updateShader();
        startTimeRef.current = Date.now();
        frameCountRef.current = 0;
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
        setFragmentShader(defaultFragmentShader);
        setError('');
        startTimeRef.current = Date.now();
        frameCountRef.current = 0;
        setTimeout(() => initWebGL(), 50);
    };

    const handlePreset = (code: string) => {
        setFragmentShader(code);
        setShowPresets(false);
        startTimeRef.current = Date.now();
        frameCountRef.current = 0;
        setTimeout(() => { initWebGL(); }, 50);
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
            setFragmentShader(converted);
            startTimeRef.current = Date.now();
            frameCountRef.current = 0;
            setTimeout(() => initWebGL(), 50);
        };
        reader.readAsText(file);
    }, [initWebGL]);

    const lineCount = fragmentShader.split('\n').length;

    return (
        <div className="flex-1 flex overflow-hidden" id="shader-split">
            {/* Editor panel */}
            <div className="flex flex-col overflow-hidden" style={{ width: `${splitRatio * 100}%` }}>
                {/* Editor header */}
                <div className="h-[28px] flex items-center justify-between px-3 bg-[var(--background)] border-b border-[var(--border-color)] shrink-0 relative z-20">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[var(--foreground)] opacity-40">main.glsl</span>
                        <span className="text-[9px] font-mono text-[var(--foreground)] opacity-20">GLSL ES 1.0</span>
                    </div>
                    <div className="flex items-center gap-1 relative">
                        <button onClick={() => setShowPresets(p => !p)} className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-[var(--foreground)] opacity-30 hover:opacity-70 transition-opacity rounded hover:bg-black/5">
                            <Upload size={10} />
                            Presets
                            <ChevronDown size={9} />
                        </button>
                        {showPresets && (
                            <div className="absolute top-full right-0 mt-1 bg-white border border-[var(--border-color)] rounded shadow-lg z-50 py-0.5" style={{ minWidth: '160px' }}>
                                {presetShaders.map((p, i) => (
                                    <button key={i} onClick={() => handlePreset(p.code)} className="block w-full px-3 py-1.5 text-[10px] font-mono text-left text-[var(--foreground)] opacity-60 hover:opacity-100 hover:bg-black/5 transition-all">
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="w-px h-3 bg-[var(--border-color)]" />
                        <button onClick={() => setShowUniforms(u => !u)} className="px-2 py-0.5 text-[10px] font-mono text-[var(--foreground)] opacity-30 hover:opacity-70 transition-opacity rounded hover:bg-black/5">
                            Uniforms
                        </button>
                    </div>
                </div>

                {/* Code editor area (uniforms + error overlay on top) */}
                <div
                    className={`flex-1 flex overflow-hidden bg-[#fafafa] relative ${dragOver ? 'ring-2 ring-[#ea580c]/30' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    ref={editorScrollRef}
                >
                    <LineNumbers count={lineCount} />
                    <div className="flex-1 overflow-auto">
                        <Editor
                            value={fragmentShader}
                            onValueChange={setFragmentShader}
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
                                    <span className="text-[var(--foreground)] opacity-20 ml-1">{elapsed}s</span>
                                </div>
                                <div className="px-2 py-1 rounded bg-black/[0.02] border border-[var(--border-color)]/20">
                                    <span className="text-[#059669] font-bold">iResolution</span> <span className="text-[var(--foreground)] opacity-30">vec2</span>
                                    <span className="text-[var(--foreground)] opacity-20 ml-1">{canvasSize.w}×{canvasSize.h}</span>
                                </div>
                                <div className="px-2 py-1 rounded bg-black/[0.02] border border-[var(--border-color)]/20">
                                    <span className="text-[#7c3aed] font-bold">iMouse</span> <span className="text-[var(--foreground)] opacity-30">vec4</span>
                                    <span className="text-[var(--foreground)] opacity-20 ml-1">xy=move, zw=click</span>
                                </div>
                                <div className="px-2 py-1 rounded bg-black/[0.02] border border-[var(--border-color)]/20">
                                    <span className="text-[#2563eb] font-bold">iFrame</span> <span className="text-[var(--foreground)] opacity-30">int</span>
                                    <span className="text-[var(--foreground)] opacity-20 ml-1">#{frameCountRef.current}</span>
                                </div>
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
                    <span className="text-[9px] font-mono text-[var(--foreground)] opacity-15">⌘+ENTER</span>
                </div>
            </div>

            {/* Splitter */}
            <div
                className="w-1 bg-[var(--border-color)] cursor-col-resize hover:bg-[#ea580c] transition-colors shrink-0"
                onMouseDown={() => setDraggingSplit(true)}
            />

            {/* Preview panel */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Preview header */}
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
                        <span className="text-[9px] font-mono text-[var(--foreground)] opacity-20">{fps} FPS</span>
                        <span className="text-[9px] font-mono text-[var(--foreground)] opacity-15">{canvasSize.w}×{canvasSize.h}</span>
                        <div className="w-px h-3 bg-[var(--border-color)]" />
                        <button onClick={handleScreenshot} className="p-1 text-[var(--foreground)] opacity-25 hover:opacity-70 transition-opacity" title="Save PNG">
                            <Download size={12} />
                        </button>
                        <button onClick={handleFullscreen} className="p-1 text-[var(--foreground)] opacity-25 hover:opacity-70 transition-opacity" title="Fullscreen">
                            {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />}
                        </button>
                    </div>
                </div>

                {/* Canvas */}
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

                {/* Status bar */}
                <div className="h-[28px] flex items-center gap-3 px-3 bg-[var(--background)] border-t border-[var(--border-color)] shrink-0">
                    <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-20">
                        <Clock size={9} />
                        {elapsed.toFixed(1)}s
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-20">
                        <MousePointer size={9} />
                        iMouse
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-20">
                        <Monitor size={9} />
                        WebGL
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--foreground)] opacity-20">
                        <Zap size={9} />
                        {fps} FPS
                    </div>
                </div>
            </div>
        </div>
    );
}
