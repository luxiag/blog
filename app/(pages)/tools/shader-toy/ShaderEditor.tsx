'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Editor from 'react-simple-code-editor';
import { Highlight } from 'prism-react-renderer';

const glslHighlightTheme = {
    plain: {
        color: 'var(--hljs-fg)',
        backgroundColor: 'transparent',
    },
    styles: [
        { types: ['comment'], style: { color: 'var(--hljs-comment)', fontStyle: 'italic' } },
        { types: ['keyword'], style: { color: 'var(--hljs-keyword)', fontWeight: 'bold' } },
        { types: ['operator'], style: { color: 'var(--hljs-operator)' } },
        { types: ['string', 'url', 'attr-value'], style: { color: 'var(--hljs-string)' } },
        { types: ['function'], style: { color: 'var(--hljs-function)' } },
        { types: ['number', 'boolean', 'literal'], style: { color: 'var(--hljs-number)' } },
        { types: ['variable', 'property'], style: { color: 'var(--hljs-variable)' } },
        { types: ['punctuation'], style: { color: 'var(--hljs-fg)' } },
        { types: ['class-name', 'type'], style: { color: 'var(--hljs-type)' } },
        { types: ['built-in'], style: { color: 'var(--hljs-built-in)' } },
        { types: ['preprocessor'], style: { color: 'var(--hljs-meta)' } },
    ],
};

const defaultVertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const defaultFragmentShader = `
precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));
  gl_FragColor = vec4(col, 1.0);
}
`;

const presetShaders: { name: string; code: string }[] = [
  {
    name: 'RAINBOW_WAVE',
    code: `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));
  gl_FragColor = vec4(col, 1.0);
}`
  },
  {
    name: 'AURORA',
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
}`
  },
  {
    name: 'GRID_PATTERN',
    code: `precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 grid = fract(uv * 10.0);
  float line = step(0.95, grid.x) + step(0.95, grid.y);
  vec3 col = mix(vec3(0.1, 0.1, 0.15), vec3(0.0, 0.8, 0.5), line);
  gl_FragColor = vec4(col, 1.0);
}`
  },
  {
    name: 'SMOKE_FLOW',
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
}`
  },
  {
    name: 'FRACTAL_Mandelbrot',
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
}`
  },
  {
    name: 'PARTICLE_STAR',
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
}`
  }
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

  if (!converted.includes('uniform float iTime') && !converted.includes('uniform double iTime')) {
    const precisionMatch = converted.match(/(precision\s+\w+\s+\w+;)/);
    if (precisionMatch) {
      converted = converted.replace(
        precisionMatch[1],
        precisionMatch[1] + '\nuniform float iTime;\nuniform vec2 iResolution;'
      );
    }
  }

  return converted;
}

export default function ShaderEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  const [fragmentShader, setFragmentShader] = useState(defaultFragmentShader);
  const [error, setError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [glReady, setGlReady] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importCode, setImportCode] = useState('');
  const [importStatus, setImportStatus] = useState('');

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

  const createProgram = useCallback((gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const errorMsg = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(errorMsg || 'Program linking failed');
    }
    
    return program;
  }, []);

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = containerRef.current;
    if (container) {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = w;
      canvas.height = h;
    }

    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) {
      setError('WebGL not supported');
      return;
    }

    glRef.current = gl;

    const vertexShader = compileShader(gl, defaultVertexShader, gl.VERTEX_SHADER);
    if (!vertexShader) {
      setError('Failed to compile vertex shader');
      return;
    }

    const fragmentShaderCompiled = compileShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
    if (!fragmentShaderCompiled) {
      setError('Failed to compile fragment shader');
      return;
    }

    const program = createProgram(gl, vertexShader, fragmentShaderCompiled);
    if (!program) {
      setError('Failed to create program');
      return;
    }

    programRef.current = program;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    setError('');
    setGlReady(true);
  }, [compileShader, createProgram, fragmentShader]);

  const updateShader = useCallback(() => {
    const gl = glRef.current;
    if (!gl || !programRef.current) return;

    try {
      const vertexShader = compileShader(gl, defaultVertexShader, gl.VERTEX_SHADER);
      if (!vertexShader) return;

      const fragmentShaderCompiled = compileShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
      if (!fragmentShaderCompiled) return;

      const newProgram = createProgram(gl, vertexShader, fragmentShaderCompiled);
      if (!newProgram) return;

      gl.deleteProgram(programRef.current);
      programRef.current = newProgram;

      setError('');
    } catch (err) {
      setError((err as Error).message);
    }
  }, [compileShader, createProgram, fragmentShader]);

  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || !canvas) return;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    const timeLocation = gl.getUniformLocation(program, 'iTime');
    const resolutionLocation = gl.getUniformLocation(program, 'iResolution');

    if (timeLocation) {
      gl.uniform1f(timeLocation, (Date.now() - startTimeRef.current) / 1000);
    }
    if (resolutionLocation) {
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (isPlaying) {
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && glReady) {
      render();
    }
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
          render();
        }
      }
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [render]);

  const handleCompile = () => {
    updateShader();
    if (!error) {
      startTimeRef.current = Date.now();
      render();
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      render();
    }
  };

  const handleReset = () => {
    setFragmentShader(defaultFragmentShader);
    setError('');
    startTimeRef.current = Date.now();
    initWebGL();
  };

  const handlePreset = (code: string) => {
    setFragmentShader(code);
    setShowPresets(false);
    setTimeout(() => {
      initWebGL();
      startTimeRef.current = Date.now();
    }, 100);
  };

  const handleImportFromUrl = () => {
    if (!importUrl.trim()) {
      setImportStatus('Please enter URL');
      return;
    }
    setImportStatus('Shadertoy uses URL-based sharing. Please copy shader code below.');
  };

  const handleImportFromCode = () => {
    if (!importCode.trim()) {
      setImportStatus('Please enter shader code');
      return;
    }

    try {
      let converted = convertShadertoyCode(importCode);
      setFragmentShader(converted);
      setShowImport(false);
      setImportCode('');
      setImportStatus('');
      setTimeout(() => {
        initWebGL();
        startTimeRef.current = Date.now();
      }, 100);
    } catch (err) {
      setImportStatus('Conversion failed: ' + (err as Error).message);
    }
  };

  return (
    <div className="flex gap-4 h-full" style={{ display: 'flex', gap: '16px' }}>
      <div className="flex-1/5 flex flex-col gap-3" style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-xl shadow-[4px_4px_0_oklch(0.145_0_0)]">
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.145 0 0)" strokeWidth="1.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span className="font-mono text-xs font-bold tracking-widest uppercase" style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Fragment_Shader
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowImport(!showImport)}
              className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest uppercase bg-[oklch(0.145_0_0)] text-white border border-[oklch(0.145_0_0)] rounded-lg hover:bg-neutral-700 transition-all"
              style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '6px 12px', borderRadius: '6px' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Import
            </button>
            <div className="relative">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest uppercase bg-[oklch(0.145_0_0)] text-white border border-[oklch(0.145_0_0)] rounded-lg hover:bg-neutral-700 transition-all"
                style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '6px 12px', borderRadius: '6px' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                PRESETS
              </button>
              {showPresets && (
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-lg shadow-[4px_4px_0_oklch(0.145_0_0)] overflow-hidden z-50" style={{ minWidth: '180px' }}>
                  {presetShaders.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePreset(preset.code)}
                      className="block w-full px-4 py-2.5 font-mono text-[10px] font-bold tracking-widest uppercase text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all border-b border-[oklch(0.145_0_0)]/10 last:border-b-0"
                      style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showImport && (
          <div className="p-4 bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-xl shadow-[4px_4px_0_oklch(0.145_0_0)]">
            <div className="flex items-center gap-2 mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(0.145 0 0)" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="font-mono text-xs font-bold tracking-widest uppercase" style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Import Shader</span>
              <span className="font-mono text-[10px] text-neutral-400 ml-auto uppercase" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-neutral-500)', marginLeft: 'auto' }}>Shadertoy Compatible</span>
            </div>

            <div className="mb-3">
              <label className="block font-mono text-[10px] font-bold tracking-widest uppercase mb-1.5 opacity-60" style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.6 }}>From URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="https://www.shadertoy.com/view/XXXX"
                  className="flex-1 px-3 py-2 font-mono text-xs border border-[oklch(0.145_0_0)] rounded-lg outline-none focus:shadow-[2px_2px_0_oklch(0.145_0_0)]"
                  style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}
                />
                <button
                  onClick={handleImportFromUrl}
                  className="px-4 py-2 font-mono text-[10px] font-bold tracking-widest uppercase bg-[oklch(0.145_0_0)] text-white rounded-lg hover:bg-neutral-700 transition-all"
                  style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '8px 16px', borderRadius: '6px', background: 'var(--foreground)', color: 'white' }}
                >
                  Detect
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-[oklch(0.145_0_0)]/20" />
              <span className="font-mono text-[9px] text-neutral-400 uppercase px-2" style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--color-neutral-500)' }}>OR</span>
              <div className="flex-1 h-px bg-[oklch(0.145_0_0)]/20" />
            </div>

            <div className="mb-3">
              <label className="block font-mono text-[10px] font-bold tracking-widest uppercase mb-1.5 opacity-60" style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.6 }}>Paste Code</label>
              <textarea
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                placeholder="void mainImage(out vec4 fragColor, in vec2 fragCoord) { ... }"
                className="w-full h-24 px-3 py-2 font-mono text-xs border border-[oklch(0.145_0_0)] rounded-lg outline-none focus:shadow-[2px_2px_0_oklch(0.145_0_0)] resize-none"
                style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', resize: 'none', outline: 'none' }}
              />
            </div>

            {importStatus && (
              <div className="mb-3 px-3 py-2 font-mono text-[10px] rounded-lg" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '8px 12px', borderRadius: '6px', background: importStatus.includes('failed') ? '#fef2f2' : '#f0fdf4', color: importStatus.includes('failed') ? '#dc2626' : '#16a34a' }}>
                {importStatus}
              </div>
            )}

            <button
              onClick={handleImportFromCode}
              className="w-full py-2.5 font-mono text-[10px] font-bold tracking-widest uppercase bg-[#ea580c] text-white border border-[#ea580c] rounded-lg hover:bg-orange-700 transition-all"
              style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '10px', borderRadius: '6px', background: '#ea580c', color: 'white', borderColor: '#ea580c' }}
            >
              Import & Convert
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 px-4 font-mono text-[10px] rounded-xl border border-red-500/50 bg-red-500/10 text-red-600" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '12px 16px', borderRadius: '10px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626' }}>
            <div className="flex items-center gap-2 mb-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="font-bold uppercase tracking-wider" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Compile Error</span>
            </div>
            {error}
          </div>
        )}

        <div className="flex-1 flex flex-col rounded-xl border border-[oklch(0.145_0_0)] shadow-[4px_4px_0_oklch(0.145_0_0)] overflow-hidden" style={{ flex: 1, borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '4px 4px 0 var(--border-color)' }}>
          <div className="flex items-center gap-4 px-4 py-2 bg-[oklch(0.145_0_0)] text-white">
            <span className="font-mono text-[10px] tracking-widest" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }}>main.glsl</span>
            <span className="font-mono text-[9px] opacity-50 uppercase" style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', opacity: 0.5, textTransform: 'uppercase' }}>GLSL</span>
          </div>
          <div className="flex-1 overflow-auto" style={{ flex: 1, overflow: 'auto', background: 'var(--color-neutral-100)' }}>
            <Editor
              value={fragmentShader}
              onValueChange={setFragmentShader}
              highlight={code => (
                <Highlight theme={glslHighlightTheme as any} code={code} language="c">
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
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCompile}
            className="flex-1 py-2.5 font-mono text-[10px] font-bold tracking-widest uppercase bg-[#ea580c] text-white border border-[oklch(0.145_0_0)] rounded-lg hover:bg-orange-700 transition-all shadow-[2px_2px_0_oklch(0.145_0_0)]"
            style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '10px', borderRadius: '6px', background: '#ea580c', color: 'white' }}
          >
            COMPILE
          </button>
          <button
            onClick={handlePlayPause}
            className="flex-1 py-2.5 font-mono text-[10px] font-bold tracking-widest uppercase bg-white dark:bg-neutral-900 text-[oklch(0.145_0_0)] border border-[oklch(0.145_0_0)] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '10px', borderRadius: '6px', flex: 1 }}
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 font-mono text-[10px] font-bold tracking-widest uppercase bg-white dark:bg-neutral-900 text-[oklch(0.145_0_0)] border border-[oklch(0.145_0_0)] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '10px', borderRadius: '6px', flex: 1 }}
          >
            RESET
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-xl shadow-[4px_4px_0_oklch(0.145_0_0)]">
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.145 0 0)" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span className="font-mono text-xs font-bold tracking-widest uppercase" style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Preview
            </span>
          </div>
          {isPlaying ? (
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest uppercase" style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <span className="w-2 h-2 rounded-full bg-[#38ef7d] animate-pulse" />
              Running
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest uppercase opacity-50" style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.5 }}>
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              Paused
            </div>
          )}
        </div>
        
        <div 
          ref={containerRef}
          className="flex-1 rounded-xl border border-[oklch(0.145_0_0)] shadow-[4px_4px_0_oklch(0.145_0_0)] overflow-hidden bg-black relative"
          style={{ flex: 1, borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '4px 4px 0 var(--border-color)', background: '#000', position: 'relative' }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: 'block', width: '100%', height: '100%' }}
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="flex items-center gap-2 px-4 py-2 bg-black/80 rounded-lg text-white font-mono text-[10px] uppercase tracking-widest" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 20px', background: 'rgba(0,0,0,0.8)', borderRadius: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Click play to continue
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-[oklch(0.145_0_0)] rounded-xl shadow-[4px_4px_0_oklch(0.145_0_0)]">
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span className="font-mono text-xs font-bold tracking-widest uppercase" style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Built-in Uniforms</span>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-[10px]" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
            <div className="p-2.5 px-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-[oklch(0.145_0_0)]/20">
              <span className="text-[#ea580c] font-bold tracking-widest" style={{ color: '#ea580c', fontWeight: 700, letterSpacing: '0.05em' }}>iTime</span>
              <br />
              <span className="opacity-50 text-[10px]" style={{ opacity: 0.5, fontSize: '10px' }}>Elapsed seconds</span>
            </div>
            <div className="p-2.5 px-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-[oklch(0.145_0_0)]/20">
              <span className="text-[#38ef7d] font-bold tracking-widest" style={{ color: '#38ef7d', fontWeight: 700, letterSpacing: '0.05em' }}>iResolution</span>
              <br />
              <span className="opacity-50 text-[10px]" style={{ opacity: 0.5, fontSize: '10px' }}>Canvas resolution</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
