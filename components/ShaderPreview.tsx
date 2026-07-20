"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RefreshCw, Play, Pause } from 'lucide-react';
import { Editor } from 'react-live';
import dynamic from 'next/dynamic';

// Dynamically import the Canvas component to avoid SSR issues
const DynamicCanvas = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-neutral-900 animate-pulse" />
});

const DEFAULT_VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Wrap shader compilation errors
function ShaderPlane({ fragmentShader, vertexShader = DEFAULT_VERTEX_SHADER }: { fragmentShader: string, vertexShader?: string }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        key={fragmentShader + vertexShader}
      />
    </mesh>
  );
}

const cssVariableTheme = {
  plain: {
    color: 'var(--hljs-fg)',
    backgroundColor: 'var(--hljs-bg)',
  },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: 'var(--hljs-comment)' } },
    { types: ['punctuation'], style: { color: 'var(--hljs-fg)', opacity: 0.7 } },
    { types: ['namespace'], style: { opacity: 0.7 } },
    { types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol', 'deleted'], style: { color: 'var(--hljs-number)' } },
    { types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'], style: { color: 'var(--hljs-string)' } },
    { types: ['operator', 'entity', 'url', 'variable'], style: { color: 'var(--hljs-variable)' } },
    { types: ['atrule', 'attr-value', 'keyword'], style: { color: 'var(--hljs-keyword)' } },
    { types: ['function', 'class-name'], style: { color: 'var(--hljs-function)' } },
    { types: ['regex', 'important'], style: { color: 'var(--hljs-regexp)' } },
  ],
};
export function ShaderEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="w-full h-[300px] overflow-hidden  relative">
      <Editor
        code={value}
        onChange={onChange}
        language="clike"
        theme={cssVariableTheme}
        className="overflow-auto"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: '14px',
          height: '100%',
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
}



interface ShaderPreviewProps {
  code: string; // The initial fragment shader code
  vertexCode?: string;
  title?: string;
  editable?: boolean;
}



/**
 * ShaderPreview 组件用于预览和编辑 GLSL 着色器代码
 * 提供了代码编辑区和预览区，支持运行、重置等功能
 */
export default function ShaderPreview({ code: initialCode, vertexCode, title = "GLSL Preview", editable = true }: ShaderPreviewProps) {
  const [code, setCode] = useState(initialCode);
  const [activeCode, setActiveCode] = useState(initialCode);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setCode(initialCode);
    setActiveCode(initialCode);
    setError(null);
  }, [initialCode]);

  const handleRun = () => {
    setActiveCode(code);
    setError(null);
  };

  const handleReset = () => {
    setCode(initialCode);
    setActiveCode(initialCode);
    setError(null);
  };

  return (
    <div className="mb-6 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <span className="font-mono text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
          {title}
          {editable && <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">Editable</span>}
        </span>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 transition-colors"
            title="Reset Code"
          >
            <RefreshCw size={14} />
          </button>
          {editable && (
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-orange-600 text-white hover:bg-orange-700 transition-colors"
            >
              <Play size={12} fill="currentColor" /> Run Code
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 ">
        {/* Code Editor Area */}
        <div className="relative group min-h-[300px] border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-700">
          {editable ? (
            <ShaderEditor
              value={code}
              onChange={setCode}

            />
          ) : (
            <pre className="w-full h-full min-h-[300px] p-4 m-0 overflow-x-auto bg-neutral-50 dark:bg-neutral-900 font-mono text-sm text-neutral-800 dark:text-neutral-200">
              <code>{code}</code>
            </pre>
          )}

          {/* Dirty Indicator */}
          {code !== activeCode && (
            <div className="absolute top-2 right-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 rounded shadow-sm">
              Changes not run
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div className="relative h-[300px] bg-black w-full overflow-hidden">
          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 z-10 bg-black/80 text-red-400 p-4 font-mono text-xs overflow-auto">
              <p className="font-bold mb-2">Shader Compilation Error:</p>
              {error}
            </div>
          )}

          <ErrorBoundary onError={(e) => setError(e.message)}>
            <DynamicCanvas camera={{ position: [0, 0, 1] }} key={activeCode}>
              <ShaderPlane
                fragmentShader={activeCode}
                vertexShader={vertexCode}
              />
            </DynamicCanvas>
          </ErrorBoundary>

          {/* <div className="absolute bottom-2 right-2 text-[10px] text-white/50 font-mono pointer-events-none select-none">
                Interactive Preview
             </div> */}
        </div>
      </div>
    </div>
  );
}

// Simple Error Boundary to catch React render errors (which might happen if Three throws)
class ErrorBoundary extends React.Component<{ onError: (error: Error) => void, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
