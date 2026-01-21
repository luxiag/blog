"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RefreshCw, Play, Pause } from 'lucide-react';

const DEFAULT_VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Wrap shader compilation errors
function ShaderPlane({ fragmentShader, vertexShader = DEFAULT_VERTEX_SHADER, onError }: { fragmentShader: string, vertexShader?: string, onError: (err: string) => void }) {
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

  // Simple error catching for shader compilation isn't straightforward in R3F/Three without parsing logs
  // But we can try-catch material creation if we were creating it manually.
  // For now, we rely on WebGL warnings in console, but we could try to validate code before rendering.
  
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        key={fragmentShader} // Re-create material on code change
      />
    </mesh>
  );
}

interface ShaderPreviewProps {
  code: string; // The initial fragment shader code
  vertexCode?: string;
  title?: string;
  editable?: boolean;
}

export default function ShaderPreview({ code: initialCode, vertexCode, title = "GLSL Preview", editable = true }: ShaderPreviewProps) {
  const [code, setCode] = useState(initialCode);
  const [activeCode, setActiveCode] = useState(initialCode); // Code actually running
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-run after delay when typing? Or manual run button?
  // Let's do manual run or debounce. Manual is safer for shaders to avoid crashing context on typo.
  
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

      <div className="grid md:grid-cols-2 grid-cols-1 border-b border-neutral-200 dark:border-neutral-700">
          {/* Code Editor Area */}
          <div className="relative group min-h-[300px] border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-700">
            {editable ? (
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full min-h-[300px] p-4 font-mono text-sm bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 resize-none focus:outline-none focus:ring-inset focus:ring-2 focus:ring-orange-500/50"
                    spellCheck={false}
                    placeholder="Enter GLSL code..."
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
                 <Canvas camera={{ position: [0, 0, 1] }} key={activeCode}>
                    <ShaderPlane 
                        fragmentShader={activeCode} 
                        vertexShader={vertexCode} 
                        onError={(err) => setError(err)}
                    />
                 </Canvas>
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
