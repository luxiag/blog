"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Editor } from 'react-live';
import { Pause, Play, RefreshCw, SlidersHorizontal, Upload, X } from 'lucide-react';
import * as THREE from 'three';
import { generatedLowlight as codeHighlighter } from '@/lib/generated/lowlight-languages';

export type ShaderSceneKind = 'fullscreen' | 'plane' | 'sphere' | 'box' | 'particles';
export type ShaderUniformType = 'float' | 'int' | 'boolean' | 'vec2' | 'vec3' | 'color';
export type ShaderUniformValue = number | boolean | string | readonly number[];

export interface ShaderUniformOption {
  label: string;
  value: number;
}

export interface ShaderUniformConfig {
  name: string;
  type: ShaderUniformType;
  value: ShaderUniformValue;
  label?: string;
  control?: 'range' | 'select' | 'color' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  options?: readonly ShaderUniformOption[];
}

export interface ShaderTextureConfig {
  name: string;
  src: string;
  label?: string;
  uploadable?: boolean;
}

export interface ShaderSceneConfig {
  kind?: ShaderSceneKind;
  segments?: number;
  planeSize?: readonly [number, number];
  planeSegments?: readonly [number, number];
  particleCount?: number;
  rotation?: readonly [number, number, number];
  scale?: number;
  controls?: boolean;
  autoRotate?: boolean;
  precision?: 'lowp' | 'mediump' | 'highp';
}
export interface ShaderSceneDemoProps {
  title?: string;
  description?: string;
  fragmentShader: string;
  vertexShader?: string;
  scene?: ShaderSceneConfig;
  uniforms?: readonly ShaderUniformConfig[];
  textures?: readonly ShaderTextureConfig[];
  height?: number;
  editable?: boolean;
  showCode?: boolean;
}

const EMPTY_UNIFORMS: readonly ShaderUniformConfig[] = Object.freeze([]);
const EMPTY_TEXTURES: readonly ShaderTextureConfig[] = Object.freeze([]);

function useStableSerializable<T>(value: T): T {
  const signature = JSON.stringify(value);
  const stableRef = useRef<{ signature: string | undefined; value: T }>({ signature, value });
  if (stableRef.current.signature !== signature) {
    stableRef.current = { signature, value };
  }
  return stableRef.current.value;
}

const CLIP_SPACE_VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const MESH_VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const PARTICLE_VERTEX_SHADER = `
uniform float uTime;
void main() {
  vec3 p = position;
  p.y += sin(p.x * 2.0 + uTime) * 0.08;
  vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = 4.0 * (4.0 / -viewPosition.z);
}
`;

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

function resolveTextureSource(source: string) {
  if (/^(blob:|data:|https?:)/i.test(source)) return source;
  const siteUsesBlogBasePath = window.location.pathname === '/blog' || window.location.pathname.startsWith('/blog/');
  if (source.startsWith('/blog/')) return siteUsesBlogBasePath ? source : source.slice('/blog'.length);
  if (source.startsWith('/')) return siteUsesBlogBasePath ? `/blog${source}` : source;
  return source;
}

function createFallbackTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 400;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0ea5e9');
    gradient.addColorStop(0.5, '#6366f1');
    gradient.addColorStop(1, '#f97316');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#fde047';
    context.beginPath();
    context.arc(480, 105, 58, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#172554';
    context.beginPath();
    context.moveTo(0, 310);
    context.lineTo(130, 145);
    context.lineTo(245, 285);
    context.lineTo(360, 120);
    context.lineTo(520, 300);
    context.lineTo(640, 190);
    context.lineTo(640, 400);
    context.lineTo(0, 400);
    context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function initialUniformValues(configs: readonly ShaderUniformConfig[]) {
  return Object.fromEntries(configs.map((config) => [config.name, config.value]));
}

function uniformValueEquals(left: ShaderUniformValue, right: ShaderUniformValue) {
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((value, index) => value === right[index]);
  }
  return left === right;
}

function uniformRecordsEqual(
  left: Record<string, ShaderUniformValue>,
  right: Record<string, ShaderUniformValue>,
) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key) => key in right && uniformValueEquals(left[key], right[key]));
}

function stringRecordsEqual(left: Record<string, string>, right: Record<string, string>) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key) => left[key] === right[key]);
}

function toThreeValue(type: ShaderUniformType, value: ShaderUniformValue) {
  if (type === 'color') return new THREE.Color(String(value));
  if (type === 'vec2' && Array.isArray(value)) return new THREE.Vector2(value[0] ?? 0, value[1] ?? 0);
  if (type === 'vec3' && Array.isArray(value)) return new THREE.Vector3(value[0] ?? 0, value[1] ?? 0, value[2] ?? 0);
  if (type === 'boolean') return Boolean(value);
  return Number(value);
}

function createParticlePositions(count: number) {
  const positions = new Float32Array(count * 3);
  let seed = 2463534242;
  const random = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 4294967295;
  };
  for (let index = 0; index < count; index += 1) {
    const radius = Math.cbrt(random()) * 2.2;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.cos(phi);
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  return positions;
}

type CodeTab = 'fragment' | 'vertex' | 'scene';

function formatUniformCode(config: ShaderUniformConfig, value: ShaderUniformValue) {
  if (config.type === 'color') return `new THREE.Color(${JSON.stringify(String(value))})`;
  if (config.type === 'vec2' && Array.isArray(value)) return `new THREE.Vector2(${value.join(', ')})`;
  if (config.type === 'vec3' && Array.isArray(value)) return `new THREE.Vector3(${value.join(', ')})`;
  if (config.type === 'boolean') return String(Boolean(value));
  return String(Number(value));
}

function buildSceneCode(
  scene: Required<Pick<ShaderSceneConfig, 'kind'>> & ShaderSceneConfig,
  uniformConfigs: readonly ShaderUniformConfig[],
  uniformValues: Record<string, ShaderUniformValue>,
  textures: readonly ShaderTextureConfig[],
) {
  const segments = Math.min(Math.max(scene.segments ?? 96, 1), 256);
  const [planeWidth, planeHeight] = scene.planeSize ?? [3, 3];
  const [planeSegmentsXInput, planeSegmentsYInput] = scene.planeSegments ?? [segments, segments];
  const planeSegmentsX = Math.min(Math.max(planeSegmentsXInput, 1), 256);
  const planeSegmentsY = Math.min(Math.max(planeSegmentsYInput, 1), 256);
  const rotation = scene.rotation ?? (scene.kind === 'plane' ? [-Math.PI / 2, 0, 0] : [0, 0, 0]);
  const textureVariables = textures.map((texture) => ({
    ...texture,
    variable: `${texture.name.replace(/[^a-zA-Z0-9_$]/g, '') || 'shader'}Texture`,
  }));
  const dreiImports = [
    scene.kind !== 'fullscreen' && scene.controls !== false ? 'OrbitControls' : '',
    textures.length > 0 ? 'useTexture' : '',
  ].filter(Boolean).join(', ');
  const geometry = scene.kind === 'sphere'
    ? `<sphereGeometry args={[1, ${segments}, ${segments}]} />`
    : scene.kind === 'box'
      ? `<boxGeometry args={[1.5, 1.5, 1.5, ${segments}, ${segments}, ${segments}]} />`
      : scene.kind === 'plane'
        ? `<planeGeometry args={[${planeWidth}, ${planeHeight}, ${planeSegmentsX}, ${planeSegmentsY}]} />`
        : `<planeGeometry args={[2, 2]} />`;
  const textureHooks = textureVariables
    .map((texture) => `  const ${texture.variable} = useTexture(${JSON.stringify(texture.src)});`)
    .join('\n');
  const customUniforms = uniformConfigs
    .map((config) => `      ${config.name}: { value: ${formatUniformCode(config, uniformValues[config.name])} },`)
    .join('\n');
  const textureUniforms = textureVariables
    .map((texture) => `      ${texture.name}: { value: ${texture.variable} },`)
    .join('\n');
  const particleSetup = scene.kind === 'particles' ? `
  const positions = useMemo(() => {
    const count = ${Math.min(Math.max(scene.particleCount ?? 4000, 100), 100000)};
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = Math.cbrt(Math.random()) * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const z = Math.random() * 2 - 1;
      const planar = Math.sqrt(1 - z * z);
      data[i * 3] = radius * planar * Math.cos(theta);
      data[i * 3 + 1] = radius * z;
      data[i * 3 + 2] = radius * planar * Math.sin(theta);
    }
    return data;
  }, []);` : '';
  const object = scene.kind === 'particles' ? `<points scale={${scene.scale ?? 1}} rotation={[${rotation.join(', ')}]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial ref={materialRef} vertexShader={vertexShader}
        fragmentShader={fragmentShader} uniforms={uniforms}
        precision="${scene.precision ?? 'mediump'}" transparent />
    </points>` : `<mesh scale={${scene.scale ?? 1}} rotation={[${rotation.join(', ')}]}>
      ${geometry}
      <shaderMaterial ref={materialRef} vertexShader={vertexShader}
        fragmentShader={fragmentShader} uniforms={uniforms}
        precision="${scene.precision ?? 'mediump'}" side={THREE.DoubleSide} transparent />
    </mesh>`;
  const controls = scene.kind !== 'fullscreen' && scene.controls !== false
    ? `\n      <OrbitControls${scene.autoRotate ? ' autoRotate' : ''} />`
    : '';

  return `import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';${dreiImports ? `\nimport { ${dreiImports} } from '@react-three/drei';` : ''}

// vertexShader 和 fragmentShader 就是另外两个标签中的 GLSL 字符串。
function ShaderObject() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
${textureHooks}${particleSetup}
  const uniforms = useMemo(() => ({
      uTime: { value: 0 },
      uDelta: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
${customUniforms}${customUniforms && textureUniforms ? '\n' : ''}${textureUniforms}
  }), [${textureVariables.map((texture) => texture.variable).join(', ')}]);

  useFrame((state, delta) => {
    const values = materialRef.current!.uniforms;
    values.uTime.value = state.clock.getElapsedTime();
    values.uDelta.value = delta;
    values.uResolution.value.set(state.size.width, state.size.height);
    values.uPointer.value.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
  });

  return (
    ${object}
  );
}

export default function Demo() {
  return (
    <Canvas camera={{ position: [${scene.kind === 'fullscreen' ? '0, 0, 1' : '2.8, 2.2, 3.4'}], fov: 45 }}>
      <ShaderObject />${controls}
    </Canvas>
  );
}`;
}

function highlightedCode(code: string, language: 'glsl' | 'typescript') {
  try {
    const tree = codeHighlighter.highlight(language, code);
    const toHtml = (node: any): string => {
      if (node.type === 'text') return node.value;
      const children = (node.children ?? []).map(toHtml).join('');
      const className = node.properties?.className?.join(' ') ?? '';
      return className ? `<span class="${className}">${children}</span>` : children;
    };
    return tree.children.map(toHtml).join('');
  } catch {
    return code;
  }
}

interface SceneRuntimeProps {
  fragmentShader: string;
  vertexShader: string;
  scene: Required<Pick<ShaderSceneConfig, 'kind'>> & ShaderSceneConfig;
  uniformConfigs: readonly ShaderUniformConfig[];
  uniformValues: Record<string, ShaderUniformValue>;
  textures: readonly ShaderTextureConfig[];
  textureSources: Record<string, string>;
  paused: boolean;
  onError: (message: string) => void;
}

function SceneRuntime({
  fragmentShader,
  vertexShader,
  scene,
  uniformConfigs,
  uniformValues,
  textures,
  textureSources,
  paused,
  onError,
}: SceneRuntimeProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);
  const { gl, size, invalidate } = useThree();

  const fallbackTextures = useMemo(() => Object.fromEntries(
    textures.map((texture) => [texture.name, createFallbackTexture()]),
  ) as Record<string, THREE.Texture>, [textures]);

  useEffect(() => () => {
    Object.values(fallbackTextures).forEach((texture) => texture.dispose());
  }, [fallbackTextures]);

  const shaderUniforms = useMemo(() => {
    const result: Record<string, THREE.IUniform> = {
      uTime: { value: 0 },
      uDelta: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    };
    for (const config of uniformConfigs) {
      result[config.name] = { value: toThreeValue(config.type, config.value) };
    }
    for (const texture of textures) {
      result[texture.name] = { value: fallbackTextures[texture.name] };
    }
    return result;
  }, [fallbackTextures, uniformConfigs, textures]);

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    for (const config of uniformConfigs) {
      const nextValue = toThreeValue(config.type, uniformValues[config.name]);
      const currentValue = material.uniforms[config.name]?.value;
      if (currentValue instanceof THREE.Color && nextValue instanceof THREE.Color) currentValue.copy(nextValue);
      else if (currentValue instanceof THREE.Vector2 && nextValue instanceof THREE.Vector2) currentValue.copy(nextValue);
      else if (currentValue instanceof THREE.Vector3 && nextValue instanceof THREE.Vector3) currentValue.copy(nextValue);
      else if (material.uniforms[config.name]) material.uniforms[config.name].value = nextValue;
    }
    invalidate();
  }, [invalidate, uniformConfigs, uniformValues]);

  useEffect(() => {
    let active = true;
    const loadedTextures: THREE.Texture[] = [];
    const loader = new THREE.TextureLoader();

    for (const config of textures) {
      const source = textureSources[config.name];
      if (!source) continue;

      loader.load(
        resolveTextureSource(source),
        (texture) => {
          if (!active) {
            texture.dispose();
            return;
          }
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.needsUpdate = true;
          loadedTextures.push(texture);
          if (materialRef.current?.uniforms[config.name]) {
            materialRef.current.uniforms[config.name].value = texture;
            materialRef.current.needsUpdate = true;
            invalidate();
          }
        },
        undefined,
        () => {
          if (!active) return;
          invalidate();
          if (source !== config.src) {
            onError(`纹理“${config.label ?? config.name}”加载失败，请重新选择图片。`);
          }
        },
      );
    }

    invalidate();
    return () => {
      active = false;
      loadedTextures.forEach((texture) => texture.dispose());
    };
  }, [invalidate, onError, textureSources, textures]);

  useEffect(() => {
    const resolution = shaderUniforms.uResolution.value as THREE.Vector2;
    resolution.set(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio());
    invalidate();
  }, [gl, invalidate, shaderUniforms, size]);

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;
    if (!paused) elapsedRef.current += delta;
    material.uniforms.uTime.value = elapsedRef.current;
    material.uniforms.uDelta.value = paused ? 0 : delta;
    material.uniforms.uPointer.value.set(
      state.pointer.x * 0.5 + 0.5,
      state.pointer.y * 0.5 + 0.5,
    );
  });

  const particleCount = Math.min(Math.max(scene.particleCount ?? 4000, 100), 100000);
  const particlePositions = useMemo(() => createParticlePositions(particleCount), [particleCount]);
  const segments = Math.min(Math.max(scene.segments ?? 96, 1), 256);
  const [planeWidth, planeHeight] = scene.planeSize ?? [3, 3];
  const [planeSegmentsXInput, planeSegmentsYInput] = scene.planeSegments ?? [segments, segments];
  const planeSegmentsX = Math.min(Math.max(planeSegmentsXInput, 1), 256);
  const planeSegmentsY = Math.min(Math.max(planeSegmentsYInput, 1), 256);
  const rotation = scene.rotation ?? (scene.kind === 'plane' ? [-Math.PI / 2, 0, 0] : [0, 0, 0]);
  const commonMaterial = (
    <shaderMaterial
      ref={materialRef}
      uniforms={shaderUniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      precision={scene.precision ?? 'mediump'}
      side={THREE.DoubleSide}
      transparent
    />
  );

  if (scene.kind === 'particles') {
    return (
      <points scale={scene.scale ?? 1} rotation={rotation} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        {commonMaterial}
      </points>
    );
  }

  return (
    <mesh scale={scene.scale ?? 1} rotation={rotation} frustumCulled={false}>
      {scene.kind === 'sphere' && <sphereGeometry args={[1, segments, segments]} />}
      {scene.kind === 'box' && <boxGeometry args={[1.5, 1.5, 1.5, segments, segments, segments]} />}
      {scene.kind === 'plane' && <planeGeometry args={[planeWidth, planeHeight, planeSegmentsX, planeSegmentsY]} />}
      {scene.kind === 'fullscreen' && <planeGeometry args={[2, 2]} />}
      {commonMaterial}
    </mesh>
  );
}
class SceneErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (message: string) => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    this.props.onError(error.message || 'Shader 场景渲染失败。');
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function ShaderSceneDemo({
  title = 'Shader Scene Demo',
  description,
  fragmentShader: initialFragmentShader,
  vertexShader: initialVertexShader,
  scene: sceneInput,
  uniforms: uniformConfigsInput = EMPTY_UNIFORMS,
  textures: texturesInput = EMPTY_TEXTURES,
  height = 360,
  editable = true,
  showCode = true,
}: ShaderSceneDemoProps) {
  const stableSceneInput = useStableSerializable(sceneInput);
  const uniformConfigs = useStableSerializable(uniformConfigsInput);
  const textures = useStableSerializable(texturesInput);
  const scene = useMemo(() => ({ kind: 'fullscreen' as const, ...stableSceneInput }), [stableSceneInput]);
  const fallbackVertexShader = scene.kind === 'fullscreen'
    ? CLIP_SPACE_VERTEX_SHADER
    : scene.kind === 'particles'
      ? PARTICLE_VERTEX_SHADER
      : MESH_VERTEX_SHADER;
  const sourceVertexShader = initialVertexShader ?? fallbackVertexShader;

  const [fragmentShader, setFragmentShader] = useState(initialFragmentShader);
  const [vertexShader, setVertexShader] = useState(sourceVertexShader);
  const [activeFragmentShader, setActiveFragmentShader] = useState(initialFragmentShader);
  const [activeVertexShader, setActiveVertexShader] = useState(sourceVertexShader);
  const [uniformValues, setUniformValues] = useState(() => initialUniformValues(uniformConfigs));
  const [textureSources, setTextureSources] = useState(() =>
    Object.fromEntries(textures.map((texture) => [texture.name, texture.src])),
  );
  const [activeEditor, setActiveEditor] = useState<CodeTab>('fragment');
  const [paused, setPaused] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [error, setError] = useState('');
  const settingsId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const objectUrlsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    setFragmentShader(initialFragmentShader);
    setActiveFragmentShader(initialFragmentShader);
  }, [initialFragmentShader]);

  useEffect(() => {
    setVertexShader(sourceVertexShader);
    setActiveVertexShader(sourceVertexShader);
  }, [sourceVertexShader]);

  useEffect(() => {
    const nextValues = initialUniformValues(uniformConfigs);
    setUniformValues((current) => uniformRecordsEqual(current, nextValues) ? current : nextValues);
  }, [uniformConfigs]);

  useEffect(() => {
    const nextSources = Object.fromEntries(textures.map((texture) => [texture.name, texture.src]));
    setTextureSources((current) => stringRecordsEqual(current, nextSources) ? current : nextSources);
  }, [textures]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '200px',
      threshold: 0.01,
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    updateVisibility();
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    if (!settingsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSettingsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [settingsOpen]);

  useEffect(() => () => {
    Object.values(objectUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const runCode = () => {
    setError('');
    setActiveFragmentShader(fragmentShader);
    setActiveVertexShader(vertexShader);
  };

  const reset = () => {
    Object.values(objectUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = {};
    setFragmentShader(initialFragmentShader);
    setVertexShader(sourceVertexShader);
    setActiveFragmentShader(initialFragmentShader);
    setActiveVertexShader(sourceVertexShader);
    setUniformValues(initialUniformValues(uniformConfigs));
    setTextureSources(Object.fromEntries(textures.map((texture) => [texture.name, texture.src])));
    setPaused(false);
    setSettingsOpen(false);
    setError('');
  };

  const uploadTexture = (config: ShaderTextureConfig, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件。');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('图片不能超过 10 MB。');
      return;
    }
    const previousUrl = objectUrlsRef.current[config.name];
    if (previousUrl) URL.revokeObjectURL(previousUrl);
    const nextUrl = URL.createObjectURL(file);
    objectUrlsRef.current[config.name] = nextUrl;
    setTextureSources((current) => ({ ...current, [config.name]: nextUrl }));
    setError('');
  };

  const effectivePaused = paused || !visible || !documentVisible;
  const dirty = fragmentShader !== activeFragmentShader || vertexShader !== activeVertexShader;
  const sceneCode = useMemo(
    () => buildSceneCode(scene, uniformConfigs, uniformValues, textures),
    [scene, textures, uniformConfigs, uniformValues],
  );
  const editorCode = activeEditor === 'fragment'
    ? fragmentShader
    : activeEditor === 'vertex'
      ? vertexShader
      : sceneCode;
  const setEditorCode = activeEditor === 'fragment' ? setFragmentShader : setVertexShader;
  const readonlyCode = useMemo(
    () => highlightedCode(editorCode, activeEditor === 'scene' ? 'typescript' : 'glsl'),
    [activeEditor, editorCode],
  );
  const hasControls = uniformConfigs.some((config) => config.control) || textures.length > 0;
  const previewHeight = Math.min(Math.max(height, 240), 720);
  return (
    <div ref={wrapperRef} className="my-6 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <style>{`
        .shader-scene-code-editor,
        .shader-scene-code-editor > pre,
        .shader-scene-code-editor > textarea {
          overflow-x: hidden !important;
          white-space: pre-wrap !important;
          overflow-wrap: anywhere !important;
          word-break: normal !important;
          font-variant-ligatures: none !important;
          box-sizing: border-box !important;
          width: 100% !important;
        }
      `}</style>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-100 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-mono text-sm font-semibold text-neutral-700 dark:text-neutral-200">{title}</span>
            <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
              {scene.kind}
            </span>
          </div>
          {description && <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {hasControls && (
            <button
              type="button"
              onClick={() => setSettingsOpen((value) => !value)}
              className={`flex items-center gap-1 rounded px-2 py-1.5 text-xs transition-colors ${settingsOpen
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                : 'text-neutral-600 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-700'}`}
              aria-expanded={settingsOpen}
              aria-controls={settingsId}
            >
              <SlidersHorizontal size={13} /> 参数
              <span className="rounded-full bg-black/10 px-1.5 text-[10px] dark:bg-white/10">
                {uniformConfigs.filter((config) => config.control).length + textures.length}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            className="flex items-center gap-1 rounded px-2 py-1.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-700"
            aria-pressed={paused}
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}
            {paused ? '继续' : '暂停'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 rounded px-2 py-1.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            <RefreshCw size={13} /> 重置
          </button>
          {editable && showCode && activeEditor !== 'scene' && (
            <button
              type="button"
              onClick={runCode}
              className="flex items-center gap-1 rounded bg-orange-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-700"
            >
              <Play size={12} fill="currentColor" /> 运行代码
            </button>
          )}
        </div>
      </div>

      <div className={showCode ? 'relative grid grid-cols-1 lg:grid-cols-2' : 'relative grid grid-cols-1'}>
        {showCode && (
          <div
            className="flex min-w-0 flex-col border-b border-neutral-200 lg:border-b-0 lg:border-r dark:border-neutral-700"
            style={{ height: previewHeight }}
          >
            <div className="flex shrink-0 border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950">
              {([
                { id: 'fragment', label: 'Fragment Shader' },
                { id: 'vertex', label: 'Vertex Shader' },
                { id: 'scene', label: 'Three.js 场景' },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveEditor(tab.id)}
                  className={`px-3 py-2 text-xs font-medium sm:px-4 ${activeEditor === tab.id
                    ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'}`}
                >
                  {tab.label}
                </button>
              ))}
              {dirty && <span className="ml-auto self-center px-3 text-[10px] text-amber-600 dark:text-amber-400">代码尚未运行</span>}
            </div>
            {editable && activeEditor !== 'scene' ? (
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[var(--hljs-bg)]">
                <Editor
                  code={editorCode}
                  onChange={setEditorCode}
                  language="clike"
                  theme={cssVariableTheme}
                  className="shader-scene-code-editor min-h-full overflow-x-hidden font-mono text-sm"
                  style={{
                    minHeight: '100%',
                    padding: 16,
                    fontFamily: '"Fira Code", "Fira Mono", monospace',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    wordBreak: 'normal',
                    overflowX: 'hidden',
                    fontVariantLigatures: 'none',
                    backgroundColor: 'transparent',
                  }}
                />
              </div>
            ) : (
              <pre className="m-0 min-h-0 flex-1 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words bg-[var(--hljs-bg)] p-4 text-sm text-[var(--hljs-fg)]">
                <code className="hljs whitespace-pre-wrap break-words [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: readonlyCode }} />
              </pre>
            )}
          </div>
        )}

        <div className="min-w-0">
          <div className="relative bg-[#05070d]" style={{ height: previewHeight }}>
            <SceneErrorBoundary key={`${activeVertexShader}\n${activeFragmentShader}`} onError={setError}>
              <Canvas
                dpr={[1, 2]}
                frameloop={effectivePaused ? 'demand' : 'always'}
                camera={{ position: scene.kind === 'fullscreen' ? [0, 0, 1] : [2.8, 2.2, 3.4], fov: 45 }}
                gl={{ antialias: scene.kind !== 'particles', alpha: false, powerPreference: 'high-performance' }}
                onCreated={({ gl: renderer, camera }) => {
                  renderer.setClearColor('#05070d');
                  camera.lookAt(0, 0, 0);
                  camera.updateProjectionMatrix();
                  renderer.debug.onShaderError = (context, program, vertex, fragment) => {
                    const details = [
                      context.getProgramInfoLog(program),
                      context.getShaderInfoLog(vertex),
                      context.getShaderInfoLog(fragment),
                    ].filter(Boolean).join('\n');
                    setError(details || 'Shader 编译失败，请检查代码。');
                  };
                }}
              >
                <SceneRuntime
                  fragmentShader={activeFragmentShader}
                  vertexShader={activeVertexShader}
                  scene={scene}
                  uniformConfigs={uniformConfigs}
                  uniformValues={uniformValues}
                  textures={textures}
                  textureSources={textureSources}
                  paused={effectivePaused}
                  onError={setError}
                />
                {scene.kind !== 'fullscreen' && scene.controls !== false && (
                  <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.06}
                    autoRotate={Boolean(scene.autoRotate) && !effectivePaused}
                    autoRotateSpeed={1.2}
                    minDistance={1.8}
                    maxDistance={8}
                  />
                )}
              </Canvas>
            </SceneErrorBoundary>

            {error && (
              <div role="alert" className="absolute inset-x-3 bottom-3 max-h-28 overflow-auto rounded border border-red-500/40 bg-black/85 p-3 font-mono text-xs text-red-300">
                {error}
              </div>
            )}
            {!visible && <div className="absolute inset-0 grid place-items-center bg-neutral-950 text-xs text-neutral-400">滚动到此处后继续渲染</div>}
          </div>
        </div>
          {hasControls && settingsOpen && (
            <div
              id={settingsId}
              className={`${showCode
                ? 'col-start-1 row-start-2 lg:col-start-2 lg:row-start-1'
                : 'col-start-1 row-start-1'} z-30 m-3 grid self-end gap-4 overflow-y-auto rounded-xl border border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/95 lg:w-[min(300px,calc(100%-1.5rem))] lg:self-start lg:justify-self-end`}
              style={{ maxHeight: previewHeight - 24 }}
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2 dark:border-neutral-700">
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-100">参数设置</span>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded p-1 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
                  aria-label="关闭参数面板"
                >
                  <X size={14} />
                </button>
              </div>
              {uniformConfigs.filter((config) => config.control).map((config) => {
                const value = uniformValues[config.name];
                return (
                  <label key={config.name} className="min-w-0 text-xs text-neutral-600 dark:text-neutral-300">
                    <span className="mb-1.5 flex justify-between gap-2">
                      <span>{config.label ?? config.name}</span>
                      {config.control === 'range' && <span className="font-mono text-neutral-400">{String(value)}</span>}
                    </span>
                    {config.control === 'range' && (
                      <input
                        type="range"
                        min={config.min ?? 0}
                        max={config.max ?? 1}
                        step={config.step ?? 0.01}
                        value={Number(value)}
                        onChange={(event) => setUniformValues((current) => ({
                          ...current,
                          [config.name]: Number(event.target.value),
                        }))}
                        className="w-full accent-orange-600"
                      />
                    )}
                    {config.control === 'select' && (
                      <select
                        value={Number(value)}
                        onChange={(event) => setUniformValues((current) => ({
                          ...current,
                          [config.name]: Number(event.target.value),
                        }))}
                        className="w-full rounded border border-neutral-300 bg-white px-2 py-1.5 text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                      >
                        {(config.options ?? []).map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    )}
                    {config.control === 'color' && (
                      <input
                        type="color"
                        value={String(value)}
                        onChange={(event) => setUniformValues((current) => ({
                          ...current,
                          [config.name]: event.target.value,
                        }))}
                        className="h-9 w-full cursor-pointer rounded border border-neutral-300 bg-white p-1 dark:border-neutral-600 dark:bg-neutral-800"
                      />
                    )}
                    {config.control === 'toggle' && (
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(event) => setUniformValues((current) => ({
                          ...current,
                          [config.name]: event.target.checked,
                        }))}
                        className="h-4 w-4 accent-orange-600"
                      />
                    )}
                  </label>
                );
              })}

              {textures.map((config) => (
                <div key={config.name} className="min-w-0 text-xs text-neutral-600 dark:text-neutral-300">
                  <div className="mb-1.5">{config.label ?? config.name}</div>
                  <div className="flex flex-wrap gap-2">
                    {config.uploadable && (
                      <label className="inline-flex cursor-pointer items-center gap-1 rounded bg-orange-600 px-3 py-1.5 font-medium text-white hover:bg-orange-700">
                        <Upload size={12} /> 选择图片
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(event) => {
                            uploadTexture(config, event.target.files?.[0]);
                            event.target.value = '';
                          }}
                        />
                      </label>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const objectUrl = objectUrlsRef.current[config.name];
                        if (objectUrl) URL.revokeObjectURL(objectUrl);
                        delete objectUrlsRef.current[config.name];
                        setTextureSources((current) => ({ ...current, [config.name]: config.src }));
                        setError('');
                      }}
                      className="rounded border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-800"
                    >
                      恢复默认图片
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
