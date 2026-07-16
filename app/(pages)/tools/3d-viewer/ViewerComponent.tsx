'use client';

import React, { useState, useEffect, Suspense, useRef, useCallback, useMemo } from 'react';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import {
    useGLTF, Stage, OrbitControls, Environment, Html, useProgress, Center,
    Grid, GizmoHelper, GizmoViewport, useAnimations, Line as DreiLine
} from '@react-three/drei';
import {
    Loader2, Upload, Box, AlertCircle, Package, X, Zap, Info,
    Camera, Maximize, Minimize, RotateCcw,
    Sun, Palette, Ruler, Eye, Layers,
    Play, Pause, SkipForward, Square,
    SlidersHorizontal, ChevronDown, ChevronRight,
    Crosshair, Paintbrush, Link, Keyboard
} from 'lucide-react';
import * as THREE from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

type EnvPreset = 'city' | 'sunset' | 'studio' | 'night' | 'forest' | 'dawn' | 'warehouse';
type DisplayMode = 'solid' | 'wireframe' | 'solid+wire';

interface ModelInfo {
    vertices: number;
    faces: number;
    boundingBox: { x: number; y: number; z: number };
    animations: string[];
    materials: string[];
    hasSkeleton: boolean;
}

interface ViewerSettings {
    autoRotate: boolean;
    envPreset: EnvPreset;
    lightIntensity: number;
    bgColor: string;
    showGrid: boolean;
    showAxes: boolean;
    showWireframe: DisplayMode;
    showClippingPlane: boolean;
    clippingDirection: 'x' | 'y' | 'z';
    clippingValue: number;
    overrideColor: string | null;
    cameraFOV: number;
}

const ENV_PRESETS: { value: EnvPreset; label: string; icon: string }[] = [
    { value: 'city', label: '城市', icon: '🏙️' },
    { value: 'sunset', label: '日落', icon: '🌇' },
    { value: 'studio', label: '摄影棚', icon: '📸' },
    { value: 'night', label: '夜晚', icon: '🌃' },
    { value: 'forest', label: '森林', icon: '🌲' },
    { value: 'dawn', label: '黎明', icon: '🌅' },
    { value: 'warehouse', label: '仓库', icon: '🏭' },
];

const BG_COLORS = [
    '#f5f5f5', '#ffffff', '#1a1a2e', '#0a0a0a', '#e8d5b7',
    '#2d3436', '#dfe6e9', '#b2bec3', '#636e72', '#74b9ff',
];

const DEFAULT_SETTINGS: ViewerSettings = {
    autoRotate: false,
    envPreset: 'city',
    lightIntensity: 0.5,
    bgColor: '#f5f5f5',
    showGrid: false,
    showAxes: false,
    showWireframe: 'solid',
    showClippingPlane: false,
    clippingDirection: 'y',
    clippingValue: 0,
    overrideColor: null,
    cameraFOV: 45,
};

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-3 bg-white/90 dark:bg-black/90 p-6 rounded-2xl shadow-xl backdrop-blur-md border border-neutral-200 dark:border-neutral-800">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-neutral-800 dark:text-white">{progress.toFixed(0)}%</span>
                    <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Loading Model</span>
                </div>
                <div className="w-32 h-1 bg-white/15 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </Html>
    );
}

function useKeyboardControls() {
    const [movement, setMovement] = useState({
        forward: false, backward: false, left: false, right: false, up: false, down: false
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW': setMovement(m => ({ ...m, forward: true })); break;
                case 'KeyS': setMovement(m => ({ ...m, backward: true })); break;
                case 'KeyA': setMovement(m => ({ ...m, left: true })); break;
                case 'KeyD': setMovement(m => ({ ...m, right: true })); break;
                case 'KeyQ': setMovement(m => ({ ...m, up: true })); break;
                case 'KeyE': setMovement(m => ({ ...m, down: true })); break;
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW': setMovement(m => ({ ...m, forward: false })); break;
                case 'KeyS': setMovement(m => ({ ...m, backward: false })); break;
                case 'KeyA': setMovement(m => ({ ...m, left: false })); break;
                case 'KeyD': setMovement(m => ({ ...m, right: false })); break;
                case 'KeyQ': setMovement(m => ({ ...m, up: false })); break;
                case 'KeyE': setMovement(m => ({ ...m, down: false })); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    return movement;
}

function KeyboardCamera() {
    const { camera } = useThree();
    const movement = useKeyboardControls();
    const speed = 0.1;

    useFrame(() => {
        const direction = new THREE.Vector3();
        const frontVector = new THREE.Vector3(0, 0, Number(movement.backward) - Number(movement.forward));
        const sideVector = new THREE.Vector3(Number(movement.left) - Number(movement.right), 0, 0);
        if (movement.up) camera.position.y += speed;
        if (movement.down) camera.position.y -= speed;
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed).applyEuler(camera.rotation);
        camera.position.add(direction);
    });
    return null;
}

class ErrorBoundary extends React.Component<{ onError: (error: Error) => void; children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error: Error) {
        this.props.onError(error);
    }
    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}

function ModelRenderer({ url, extension, settings, onModelInfo, onAnimationsRef, onError }: {
    url: string;
    extension: string;
    settings: ViewerSettings;
    onModelInfo: (info: ModelInfo | ((prev: ModelInfo) => ModelInfo)) => void;
    onAnimationsRef: React.MutableRefObject<((action: 'play' | 'pause' | 'stop' | 'next') => void) | null>;
    onError: (err: string) => void;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const animActionRef = useRef<THREE.AnimationAction | null>(null);
    const animIndexRef = useRef(0);

    const clipPlane = useMemo(() => {
        if (!settings.showClippingPlane) return null;
        const normal = new THREE.Vector3(0, 0, 0);
        const constant = -settings.clippingValue;
        switch (settings.clippingDirection) {
            case 'x': normal.x = -1; break;
            case 'y': normal.y = -1; break;
            case 'z': normal.z = -1; break;
        }
        return new THREE.Plane(normal, constant);
    }, [settings.showClippingPlane, settings.clippingDirection, settings.clippingValue]);

    const wireframeMat = useMemo(() => new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
    }), []);

    const overrideMat = useMemo(() => {
        if (!settings.overrideColor) return null;
        return new THREE.MeshStandardMaterial({
            color: new THREE.Color(settings.overrideColor),
            roughness: 0.5,
            metalness: 0.3,
        });
    }, [settings.overrideColor]);

    useEffect(() => {
        if (!groupRef.current) return;
        groupRef.current.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((mat: THREE.Material) => {
                        mat.clippingPlanes = clipPlane ? [clipPlane] : [];
                        mat.side = THREE.DoubleSide;
                        mat.needsUpdate = true;
                    });
                } else if (mesh.material) {
                    mesh.material.clippingPlanes = clipPlane ? [clipPlane] : [];
                    mesh.material.side = THREE.DoubleSide;
                    mesh.material.needsUpdate = true;
                }
            }
        });
    }, [clipPlane, url]);

    useEffect(() => {
        if (!groupRef.current) return;
        let vertexCount = 0;
        let faceCount = 0;
        const materialNames: string[] = [];
        let hasSkeleton = false;

        groupRef.current.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const geo = mesh.geometry;
                if (geo.index) {
                    faceCount += geo.index.count / 3;
                } else if (geo.attributes.position) {
                    faceCount += geo.attributes.position.count / 3;
                }
                if (geo.attributes.position) {
                    vertexCount += geo.attributes.position.count;
                }
                if ('skeleton' in mesh && mesh.skeleton) hasSkeleton = true;
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((m: THREE.Material) => {
                        const name = (m as THREE.MeshStandardMaterial).name || m.type;
                        if (!materialNames.includes(name)) materialNames.push(name);
                    });
                } else if (mesh.material) {
                    const name = (mesh.material as THREE.MeshStandardMaterial).name || mesh.material.type;
                    if (!materialNames.includes(name)) materialNames.push(name);
                }
            }
        });

        const box = new THREE.Box3().setFromObject(groupRef.current);
        const size = new THREE.Vector3();
        box.getSize(size);

        onModelInfo({
            vertices: vertexCount,
            faces: Math.floor(faceCount),
            boundingBox: { x: +size.x.toFixed(2), y: +size.y.toFixed(2), z: +size.z.toFixed(2) },
            animations: [],
            materials: materialNames,
            hasSkeleton,
        });
    }, [url]);

    const content = useMemo(() => {
        switch (extension) {
            case 'gltf':
            case 'glb':
                return <GLTFWithAnimations url={url} onModelInfo={onModelInfo} onAnimActionRef={animActionRef} animIndexRef={animIndexRef} groupRef={groupRef} overrideMat={overrideMat} />;
            case 'obj':
                return <OBJModelInner url={url} groupRef={groupRef} overrideMat={overrideMat} />;
            case 'fbx':
                return <FBXModelInner url={url} onModelInfo={onModelInfo} onAnimActionRef={animActionRef} animIndexRef={animIndexRef} groupRef={groupRef} overrideMat={overrideMat} />;
            case '3ds':
                return <TDSModelInner url={url} groupRef={groupRef} overrideMat={overrideMat} />;
            case 'stl':
                return <STLModelInner url={url} groupRef={groupRef} overrideMat={overrideMat} />;
            case '3dm':
                return <RhinoModelInner url={url} groupRef={groupRef} overrideMat={overrideMat} />;
            default:
                return null;
        }
    }, [url, extension, overrideMat]);

    useEffect(() => {
        onAnimationsRef.current = (action: 'play' | 'pause' | 'stop' | 'next') => {
            const act = animActionRef.current;
            if (!act) return;
            switch (action) {
                case 'play': act.reset().play(); break;
                case 'pause': act.paused = !act.paused; break;
                case 'stop': act.stop(); break;
                case 'next': {
                    act.stop();
                    const mixer = act.getMixer();
                    const clips = (mixer as any)._actions.map((a: THREE.AnimationAction) => a.getClip());
                    if (clips.length === 0) return;
                    animIndexRef.current = (animIndexRef.current + 1) % clips.length;
                    const clip = clips[animIndexRef.current];
                    const newAction = mixer.clipAction(clip);
                    animActionRef.current = newAction;
                    newAction.reset().play();
                    const animNames = clips.map((c: THREE.AnimationClip) => c.name);
                    onModelInfo((prev: ModelInfo) => ({ ...prev, animations: animNames }));
                    break;
                }
            }
        };
    }, [url]);

    return (
        <group ref={groupRef}>
            {content}
            {settings.showWireframe === 'wireframe' && <WireframeOverlay groupRef={groupRef} material={wireframeMat} overrideMat={overrideMat} />}
            {settings.showWireframe === 'solid+wire' && <WireframeOverlay groupRef={groupRef} material={wireframeMat} overrideMat={overrideMat} />}
        </group>
    );
}

function applyOverride(groupRef: React.RefObject<THREE.Group | null>, overrideMat: THREE.MeshStandardMaterial | null) {
    if (!groupRef.current) return;
    groupRef.current.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (overrideMat) {
                mesh.userData._originalMaterial = mesh.material;
                mesh.material = overrideMat;
            } else if (mesh.userData._originalMaterial) {
                mesh.material = mesh.userData._originalMaterial;
            }
        }
    });
}

function GLTFWithAnimations({ url, onModelInfo, onAnimActionRef, animIndexRef, groupRef, overrideMat }: any) {
    const gltf = useGLTF(url) as any;
    const { animations, scene } = gltf;
    const { ref, mixer } = useAnimations(animations);

    useEffect(() => {
        if (groupRef.current) {
            let vertexCount = 0;
            let faceCount = 0;
            const materialNames: string[] = [];
            let hasSkeleton = false;
            groupRef.current.traverse((child: THREE.Object3D) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    const geo = mesh.geometry;
                    if (geo.index) faceCount += geo.index.count / 3;
                    else if (geo.attributes.position) faceCount += geo.attributes.position.count / 3;
                    if (geo.attributes.position) vertexCount += geo.attributes.position.count;
                if ((mesh as any).skeleton) hasSkeleton = true;
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach((m: THREE.Material) => {
                            const name = (m as THREE.MeshStandardMaterial).name || m.type;
                            if (!materialNames.includes(name)) materialNames.push(name);
                        });
                    } else if (mesh.material) {
                        const name = (mesh.material as THREE.MeshStandardMaterial).name || mesh.material.type;
                        if (!materialNames.includes(name)) materialNames.push(name);
                    }
                }
            });
            const box = new THREE.Box3().setFromObject(groupRef.current);
            const size = new THREE.Vector3();
            box.getSize(size);
            const animNames = animations.map((c: THREE.AnimationClip) => c.name);
            onModelInfo({
                vertices: vertexCount,
                faces: Math.floor(faceCount),
                boundingBox: { x: +size.x.toFixed(2), y: +size.y.toFixed(2), z: +size.z.toFixed(2) },
                animations: animNames,
                materials: materialNames,
                hasSkeleton,
            });
        }
    }, [url, animations]);

    useEffect(() => {
        if (animations.length > 0 && mixer) {
            const clip = animations[0];
            const action = mixer.clipAction(clip);
            action.play();
            onAnimActionRef.current = action;
        }
    }, [animations, mixer]);

    useEffect(() => {
        applyOverride(groupRef, overrideMat);
    }, [overrideMat]);

    return (
        <group ref={ref}>
            <primitive object={scene} ref={groupRef} />
        </group>
    );
}

function OBJModelInner({ url, groupRef, overrideMat }: any) {
    const obj = useLoader(OBJLoader, url);
    useEffect(() => { applyOverride(groupRef, overrideMat); }, [overrideMat]);
    return <primitive object={obj} ref={groupRef} />;
}

function FBXModelInner({ url, onModelInfo, onAnimActionRef, animIndexRef, groupRef, overrideMat }: any) {
    const fbx = useLoader(FBXLoader, url) as any;
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);

    useEffect(() => {
        if (fbx.animations && fbx.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(fbx);
            mixerRef.current = mixer;
            const clip = fbx.animations[0];
            const action = mixer.clipAction(clip);
            action.play();
            onAnimActionRef.current = action;
            const animNames = fbx.animations.map((c: THREE.AnimationClip) => c.name);
            onModelInfo((prev: ModelInfo) => ({ ...prev, animations: animNames }));
        }
        if (groupRef.current) {
            let vertexCount = 0;
            let faceCount = 0;
            groupRef.current.traverse((child: THREE.Object3D) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    const geo = mesh.geometry;
                    if (geo.index) faceCount += geo.index.count / 3;
                    else if (geo.attributes.position) faceCount += geo.attributes.position.count / 3;
                    if (geo.attributes.position) vertexCount += geo.attributes.position.count;
                }
            });
            const box = new THREE.Box3().setFromObject(groupRef.current);
            const size = new THREE.Vector3();
            box.getSize(size);
            onModelInfo((prev: ModelInfo) => ({
                ...prev,
                vertices: vertexCount,
                faces: Math.floor(faceCount),
                boundingBox: { x: +size.x.toFixed(2), y: +size.y.toFixed(2), z: +size.z.toFixed(2) },
            }));
        }
    }, [url]);

    useEffect(() => { applyOverride(groupRef, overrideMat); }, [overrideMat]);

    return <primitive object={fbx} ref={groupRef} />;
}

function TDSModelInner({ url, groupRef, overrideMat }: any) {
    const obj = useLoader(TDSLoader, url);
    useEffect(() => { applyOverride(groupRef, overrideMat); }, [overrideMat]);
    return <primitive object={obj} rotation={[-Math.PI / 2, 0, 0]} ref={groupRef} />;
}

function STLModelInner({ url, groupRef, overrideMat }: any) {
    const geometry = useLoader(STLLoader, url) as THREE.BufferGeometry;
    useEffect(() => {
        if (groupRef.current) {
            const mesh = groupRef.current as unknown as THREE.Mesh;
            const geo = mesh.geometry;
            let vertexCount = 0;
            let faceCount = 0;
            if (geo.attributes.position) vertexCount = geo.attributes.position.count;
            if (geo.index) faceCount = geo.index.count / 3;
            else if (geo.attributes.position) faceCount = vertexCount / 3;
            const box = new THREE.Box3().setFromObject(groupRef.current);
            const size = new THREE.Vector3();
            box.getSize(size);
        }
    }, [url]);
    return (
        <mesh geometry={geometry} ref={groupRef as any}>
            <meshStandardMaterial color={overrideMat ? undefined : "#60a5fa"} roughness={0.4} metalness={0.5} />
        </mesh>
    );
}

function RhinoModelInner({ url, groupRef, overrideMat }: any) {
    const obj = useLoader(Rhino3dmLoader, url, (loader: any) => {
        loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.0/');
    });
    useEffect(() => { applyOverride(groupRef, overrideMat); }, [overrideMat]);
    return <primitive object={obj} rotation={[-Math.PI / 2, 0, 0]} ref={groupRef} />;
}

function WireframeOverlay({ groupRef, material, overrideMat }: { groupRef: React.RefObject<THREE.Group | null>; material: THREE.MeshBasicMaterial; overrideMat: THREE.MeshStandardMaterial | null }) {
    const wireGroupRef = useRef<THREE.Group>(null);

    useEffect(() => {
        if (!wireGroupRef.current) return;
        while (wireGroupRef.current.children.length) {
            wireGroupRef.current.remove(wireGroupRef.current.children[0]);
        }
        if (!groupRef.current) return;
        groupRef.current.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const wireMesh = new THREE.Mesh(mesh.geometry, material);
                wireMesh.position.copy(mesh.position);
                wireMesh.rotation.copy(mesh.rotation);
                wireMesh.scale.copy(mesh.scale).multiplyScalar(1.001);
                wireGroupRef.current!.add(wireMesh);
            }
        });
    }, [groupRef.current, material, overrideMat]);

    return <group ref={wireGroupRef} />;
}

function SceneGrid() {
    return (
        <Grid
            args={[30, 30]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#999"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#666"
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid
        />
    );
}

function CameraReset({ trigger }: { trigger: number }) {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        if (trigger === 0) return;
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
    }, [trigger]);

    return null;
}

function ZoomToFit({ trigger, groupRef }: { trigger: number; groupRef: React.RefObject<THREE.Group | null> }) {
    const { camera } = useThree();

    useEffect(() => {
        if (trigger === 0 || !groupRef.current) return;
        const box = new THREE.Box3().setFromObject(groupRef.current);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 2;
        camera.position.set(center.x, center.y + distance * 0.3, center.z + distance);
        camera.lookAt(center);
        camera.updateProjectionMatrix();
    }, [trigger]);

    return null;
}

function ScreenshotHelper({ trigger, canvasRef }: { trigger: number; canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
    useEffect(() => {
        if (trigger === 0 || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = '3d-screenshot.png';
        link.href = dataUrl;
        link.click();
    }, [trigger]);
    return null;
}

function ClippingHelper({ direction, value, visible }: { direction: 'x' | 'y' | 'z'; value: number; visible: boolean }) {
    if (!visible) return null;
    const size = 20;
    const rotation: [number, number, number] = direction === 'x' ? [0, Math.PI / 2, 0] : direction === 'z' ? [Math.PI / 2, 0, 0] : [0, 0, 0];
    const position: [number, number, number] = direction === 'x' ? [value, 0, 0] : direction === 'y' ? [0, value, 0] : [0, 0, value];
    return (
        <mesh position={position} rotation={rotation}>
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial color="#ea580c" transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
    );
}

function ToolbarButton({ onClick, active, danger, title, children }: {
    onClick: () => void; active?: boolean; danger?: boolean; title: string; children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded-md transition-colors ${
                danger ? 'text-white/60 hover:text-red-400 hover:bg-red-500/20'
                : active ? 'text-orange-400 bg-orange-500/20'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
        >
            {children}
        </button>
    );
}

function PanelSection({ title, icon, children, defaultOpen = true }: {
    title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-white/10 last:border-b-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-2.5 px-1 text-xs font-bold uppercase text-white/40 tracking-wider hover:text-white/60 transition-colors"
            >
                <span className="flex items-center gap-1.5">{icon}{title}</span>
                {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            {open && <div className="pb-3 px-1 space-y-2.5">{children}</div>}
        </div>
    );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm text-white/70 group-hover:text-orange-400 transition-colors">{label}</span>
            <div
                onClick={() => onChange(!checked)}
                className={`relative transition-colors cursor-pointer rounded-full`}
                style={{ width: 32, height: 18, background: checked ? '#ea580c' : 'rgba(255,255,255,0.15)' }}
            >
                <div
                    className={`absolute top-0.5 rounded-full bg-white shadow transition-transform`}
                    style={{ width: 14, height: 14, transform: checked ? 'translateX(15px)' : 'translateX(2px)' }}
                />
            </div>
        </label>
    );
}

function SliderRow({ label, value, min, max, step, onChange }: {
    label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">{label}</span>
                <span className="text-xs font-mono text-white/40">{value.toFixed(2)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-orange-500"
            />
        </div>
    );
}

export default function ViewerComponent() {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [fileExt, setFileExt] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [settings, setSettings] = useState<ViewerSettings>(DEFAULT_SETTINGS);
    const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [resetTrigger, setResetTrigger] = useState(0);
    const [fitTrigger, setFitTrigger] = useState(0);
    const [screenshotTrigger, setScreenshotTrigger] = useState(0);
    const [loadKey, setLoadKey] = useState(0);
    const [animState, setAnimState] = useState<'playing' | 'paused' | 'stopped'>('playing');
    const [showInfoPanel, setShowInfoPanel] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [measureMode, setMeasureMode] = useState(false);
    const [measurePoints, setMeasurePoints] = useState<[number, number, number][]>([]);
    const [measureDistance, setMeasureDistance] = useState<number | null>(null);
    const [colorOverride, setColorOverride] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animActionRef = useRef<((action: 'play' | 'pause' | 'stop' | 'next') => void) | null>(null);
    const modelGroupRef = useRef<THREE.Group>(null);

    const updateSettings = useCallback((partial: Partial<ViewerSettings>) => {
        setSettings(prev => ({ ...prev, ...partial }));
    }, []);

    const handleModelInfo = useCallback((infoOrUpdater: ModelInfo | ((prev: ModelInfo) => ModelInfo)) => {
        if (typeof infoOrUpdater === 'function') {
            setModelInfo(prev => prev ? infoOrUpdater(prev) : null);
        } else {
            setModelInfo(infoOrUpdater);
        }
    }, []);

    const exampleModelUrl = 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf';

    const loadExample = () => {
        setFileUrl(exampleModelUrl);
        setFileName('DamagedHelmet.gltf');
        setFileExt('gltf');
        setError(null);
        setModelInfo(null);
    };

    const loadFromUrl = () => {
        if (!urlInput.trim()) return;
        const url = urlInput.trim();
        const name = url.split('/').pop() || 'model';
        const ext = name.split('.').pop()?.toLowerCase() || '';
        const supportedExts = ['gltf', 'glb', 'obj', 'fbx', '3ds', 'stl', '3dm'];
        if (!supportedExts.includes(ext)) {
            setError(`不支持的格式: .${ext}`);
            return;
        }
        if (fileUrl && fileUrl.startsWith('blob:')) URL.revokeObjectURL(fileUrl);
        setFileUrl(url);
        setFileName(name);
        setFileExt(ext);
        setError(null);
        setModelInfo(null);
        setUrlInput('');
    };

    useEffect(() => {
        return () => {
            if (fileUrl && fileUrl.startsWith('blob:')) URL.revokeObjectURL(fileUrl);
        };
    }, [fileUrl]);

    const handleFile = (file: File) => {
        setError(null);
        const name = file.name;
        const ext = name.split('.').pop()?.toLowerCase() || '';
        const supportedExts = ['gltf', 'glb', 'obj', 'fbx', '3ds', 'stl', '3dm'];
        if (!supportedExts.includes(ext)) {
            setError(`不支持的文件格式: .${ext}`);
            return;
        }
        if (fileUrl && fileUrl.startsWith('blob:')) URL.revokeObjectURL(fileUrl);
        const url = URL.createObjectURL(file);
        setFileUrl(url);
        setFileName(name);
        setFileExt(ext);
        setModelInfo(null);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
    };

    const clearModel = useCallback(() => {
        setFileUrl(prev => {
            if (prev) {
                if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
                try { useGLTF.clear(prev); } catch {}
            }
            return null;
        });
        setFileName('');
        setFileExt('');
        setModelInfo(null);
        setMeasurePoints([]);
        setMeasureDistance(null);
        setSettings(DEFAULT_SETTINGS);
        setColorOverride(null);
        setError(null);
    }, []);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    const handleAnimControl = (action: 'play' | 'pause' | 'stop' | 'next') => {
        if (animActionRef.current) {
            animActionRef.current(action);
            if (action === 'play') setAnimState('playing');
            else if (action === 'pause') setAnimState(animState === 'paused' ? 'playing' : 'paused');
            else if (action === 'stop') setAnimState('stopped');
        }
    };

    const handleMeasureClick = (e: THREE.Event) => {
        if (!measureMode) return;
        const point = (e as any).point as THREE.Vector3;
        if (point) {
            const newPoints: [number, number, number][] = [...measurePoints, [point.x, point.y, point.z] as [number, number, number]];
            setMeasurePoints(newPoints);
            if (newPoints.length === 2) {
                const dist = Math.sqrt(
                    Math.pow(newPoints[1][0] - newPoints[0][0], 2) +
                    Math.pow(newPoints[1][1] - newPoints[0][1], 2) +
                    Math.pow(newPoints[1][2] - newPoints[0][2], 2)
                );
                setMeasureDistance(+dist.toFixed(4));
                setMeasureMode(false);
            }
        }
    };

    const canvasCreated = useCallback((state: any) => {
        canvasRef.current = state.gl.domElement;
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full relative">
            {fileUrl && (
                <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                    <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                        <span className="text-xs text-white/80 font-mono max-w-48 truncate">{fileName}</span>
                        <span className="text-[10px] text-white/40 font-mono uppercase">{fileExt}</span>
                        {modelInfo && <span className="text-[10px] text-white/30 font-mono">{(modelInfo.vertices / 1000).toFixed(1)}K v</span>}
                    </div>
                    <div className="pointer-events-auto flex items-center gap-0.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 p-0.5">
                        <ToolbarButton onClick={() => setShowInfoPanel(!showInfoPanel)} active={showInfoPanel} title="模型信息"><Info className="w-3.5 h-3.5" /></ToolbarButton>
                        <ToolbarButton onClick={() => setResetTrigger(t => t + 1)} title="重置相机"><RotateCcw className="w-3.5 h-3.5" /></ToolbarButton>
                        <ToolbarButton onClick={() => setFitTrigger(t => t + 1)} title="适配模型"><Crosshair className="w-3.5 h-3.5" /></ToolbarButton>
                        <ToolbarButton onClick={() => setScreenshotTrigger(t => t + 1)} title="截图"><Camera className="w-3.5 h-3.5" /></ToolbarButton>
                        <ToolbarButton onClick={toggleFullscreen} title="全屏">{isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}</ToolbarButton>
                        <ToolbarButton onClick={() => setShowControls(!showControls)} active={showControls} title="控制面板"><SlidersHorizontal className="w-3.5 h-3.5" /></ToolbarButton>
                        <div className="w-px h-4 bg-white/10 mx-0.5" />
                        <ToolbarButton onClick={() => setMeasureMode(!measureMode)} active={measureMode} title="测量"><Ruler className="w-3.5 h-3.5" /></ToolbarButton>
                        <ToolbarButton onClick={clearModel} danger title="关闭"><X className="w-3.5 h-3.5" /></ToolbarButton>
                    </div>
                </div>
            )}

            <div
                className="w-full h-full relative rounded-2xl overflow-hidden transition-all duration-300"
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
            >
                {fileUrl ? (
                    <>
                        <Canvas
                            key={loadKey}
                            shadows
                            dpr={[1, 2]}
                            camera={{ position: [0, 0, 5], fov: settings.cameraFOV }}
                            onCreated={canvasCreated}
                            gl={{ preserveDrawingBuffer: true, localClippingEnabled: true }}
                            onPointerMissed={handleMeasureClick as any}
                        >
                            <color attach="background" args={[settings.bgColor]} />
                            <ErrorBoundary onError={(e) => setError(e.message || '模型加载失败，请检查文件或网络连接')}>
                                <Suspense fallback={<Loader />}>
                                    <Stage
                                        environment={settings.envPreset}
                                        intensity={settings.lightIntensity}
                                        shadows
                                        adjustCamera={false}
                                    >
                                        <ModelRenderer
                                            url={fileUrl}
                                            extension={fileExt}
                                            settings={settings}
                                            onModelInfo={handleModelInfo}
                                            onAnimationsRef={animActionRef}
                                            onError={(e) => setError(e)}
                                        />
                                    </Stage>
                                </Suspense>
                            </ErrorBoundary>
                            {settings.showGrid && <SceneGrid />}
                            {settings.showAxes && <axesHelper args={[5]} />}
                            <ClippingHelper direction={settings.clippingDirection} value={settings.clippingValue} visible={settings.showClippingPlane} />
                            <OrbitControls autoRotate={settings.autoRotate} makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.001} />
                            <KeyboardCamera />
                            <CameraReset trigger={resetTrigger} />
                            <ZoomToFit trigger={fitTrigger} groupRef={modelGroupRef} />
                            <ScreenshotHelper trigger={screenshotTrigger} canvasRef={canvasRef} />
                            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                                <GizmoViewport axisColors={['#f73b3b', '#3bf73b', '#3b3bf7']} labelColor="white" />
                            </GizmoHelper>
                            {measurePoints.map((p, i) => (
                                <mesh key={i} position={p}>
                                    <sphereGeometry args={[0.03, 16, 16]} />
                                    <meshBasicMaterial color="#ea580c" />
                                </mesh>
                            ))}
                            {measurePoints.length === 2 && (
                                <MeasureLine points={measurePoints} color="#ea580c" lineWidth={2} />
                            )}
                        </Canvas>

                        {error && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                                <div className="flex flex-col items-center gap-4 p-8 max-w-sm text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                                        <AlertCircle className="w-8 h-8 text-red-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white/90">加载失败</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">{error}</p>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={clearModel}
                                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-colors"
                                        >
                                            返回上传
                                        </button>
                                        <button
                                            onClick={() => { setError(null); try { useGLTF.clear(fileUrl); } catch {} setLoadKey(k => k + 1); }}
                                            className="px-4 py-2 rounded-lg bg-orange-500/80 hover:bg-orange-500 text-white text-sm font-medium transition-colors"
                                        >
                                            重新尝试
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Controls sidebar */}
                        {showControls && (
                            <div className="absolute top-12 right-3 w-60 max-h-[calc(100%-60px)] overflow-y-auto bg-black/70 backdrop-blur-md rounded-xl shadow-lg border border-white/10">
                                <div className="p-3 space-y-0">
                                    <PanelSection title="显示" icon={<Eye className="w-3 h-3" />}>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-white/40">渲染模式</label>
                                            <div className="flex gap-1">
                                                {(['solid', 'wireframe', 'solid+wire'] as DisplayMode[]).map(mode => (
                                                    <button
                                                        key={mode}
                                                        onClick={() => updateSettings({ showWireframe: mode })}
                                                        className={`flex-1 text-[10px] font-medium py-1.5 px-2 rounded-lg transition-colors ${settings.showWireframe === mode ? 'bg-orange-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
                                                    >
                                                        {mode === 'solid' ? '实体' : mode === 'wireframe' ? '线框' : '混合'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <ToggleRow label="网格" checked={settings.showGrid} onChange={(v) => updateSettings({ showGrid: v })} />
                                        <ToggleRow label="坐标轴" checked={settings.showAxes} onChange={(v) => updateSettings({ showAxes: v })} />
                                        <ToggleRow label="自动旋转" checked={settings.autoRotate} onChange={(v) => updateSettings({ autoRotate: v })} />
                                    </PanelSection>

                                    <PanelSection title="光照" icon={<Sun className="w-3 h-3" />}>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-white/40">环境</label>
                                            <select
                                                value={settings.envPreset}
                                                onChange={(e) => updateSettings({ envPreset: e.target.value as EnvPreset })}
                                                className="w-full text-sm py-1.5 px-2.5 rounded-lg bg-white/10 text-white/80 border-none outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer"
                                            >
                                                {ENV_PRESETS.map(p => (
                                                    <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <SliderRow label="强度" value={settings.lightIntensity} min={0} max={2} step={0.05} onChange={(v) => updateSettings({ lightIntensity: v })} />
                                    </PanelSection>

                                    <PanelSection title="背景" icon={<Palette className="w-3 h-3" />}>
                                        <div className="flex flex-wrap gap-1.5">
                                            {BG_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => updateSettings({ bgColor: color })}
                                                    className={`w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110 ${settings.bgColor === color ? 'border-orange-400 scale-110' : 'border-white/20'}`}
                                                    style={{ background: color }}
                                                />
                                            ))}
                                            <label className="w-7 h-7 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform" title="自定义颜色">
                                                <input
                                                    type="color"
                                                    value={settings.bgColor}
                                                    onChange={(e) => updateSettings({ bgColor: e.target.value })}
                                                    className="opacity-0 absolute w-0 h-0"
                                                />
                                                <Paintbrush className="w-3 h-3 text-white/30" />
                                            </label>
                                        </div>
                                    </PanelSection>

                                    <PanelSection title="剖面" icon={<Layers className="w-3 h-3" />} defaultOpen={false}>
                                        <ToggleRow label="启用剖面" checked={settings.showClippingPlane} onChange={(v) => updateSettings({ showClippingPlane: v })} />
                                        {settings.showClippingPlane && (
                                            <>
                                                <div className="flex gap-1">
                                                    {(['x', 'y', 'z'] as const).map(axis => (
                                                        <button
                                                            key={axis}
                                                            onClick={() => updateSettings({ clippingDirection: axis })}
                                                            className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors ${settings.clippingDirection === axis ? 'bg-orange-500 text-white' : 'bg-white/10'}`}
                                                        >
                                                            {axis.toUpperCase()}
                                                        </button>
                                                    ))}
                                                </div>
                                                <SliderRow label="位置" value={settings.clippingValue} min={-5} max={5} step={0.1} onChange={(v) => updateSettings({ clippingValue: v })} />
                                            </>
                                        )}
                                    </PanelSection>

                                    <PanelSection title="材质覆盖" icon={<Paintbrush className="w-3 h-3" />} defaultOpen={false}>
                                        <ToggleRow
                                            label="覆盖颜色"
                                            checked={colorOverride !== null}
                                            onChange={(v) => {
                                                if (v) {
                                                    setColorOverride('#ea580c');
                                                    updateSettings({ overrideColor: '#ea580c' });
                                                } else {
                                                    setColorOverride(null);
                                                    updateSettings({ overrideColor: null });
                                                }
                                            }}
                                        />
                                        {colorOverride && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={colorOverride}
                                                    onChange={(e) => {
                                                        setColorOverride(e.target.value);
                                                        updateSettings({ overrideColor: e.target.value });
                                                    }}
                                                    className="w-8 h-8 rounded-lg cursor-pointer border border-white/20"
                                                />
                                                <span className="text-xs font-mono text-neutral-500">{colorOverride}</span>
                                            </div>
                                        )}
                                    </PanelSection>

                                    <PanelSection title="相机" icon={<Camera className="w-3 h-3" />} defaultOpen={false}>
                                        <SliderRow label="FOV" value={settings.cameraFOV} min={20} max={120} step={1} onChange={(v) => updateSettings({ cameraFOV: v })} />
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => setResetTrigger(t => t + 1)}
                                                className="flex-1 text-xs py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-1 text-white/60"
                                            >
                                                <RotateCcw className="w-3 h-3" /> 重置
                                            </button>
                                            <button
                                                onClick={() => setFitTrigger(t => t + 1)}
                                                className="flex-1 text-xs py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-1 text-white/60"
                                            >
                                                <Crosshair className="w-3 h-3" /> 适配
                                            </button>
                                        </div>
                                    </PanelSection>

                                    <PanelSection title="快捷键" icon={<Keyboard className="w-3 h-3" />} defaultOpen={false}>
                                        <div className="grid grid-cols-2 gap-1 text-[10px] text-white/50 font-mono">
                                            <div className="flex items-center gap-1"><kbd className="bg-white/15 px-1 rounded">W/S</kbd> 前后</div>
                                            <div className="flex items-center gap-1"><kbd className="bg-white/15 px-1 rounded">A/D</kbd> 左右</div>
                                            <div className="flex items-center gap-1"><kbd className="bg-white/15 px-1 rounded">Q/E</kbd> 上下</div>
                                            <div className="flex items-center gap-1">🖱️ 旋转/缩放</div>
                                        </div>
                                    </PanelSection>
                                </div>
                            </div>
                        )}

                        {/* Animation controls */}
                        {modelInfo && modelInfo.animations.length > 0 && (
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full shadow-lg border border-white/10">
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mr-1">Anim</span>
                                <button onClick={() => handleAnimControl('play')} className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="播放">
                                    <Play className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleAnimControl('pause')} className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="暂停">
                                    <Pause className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleAnimControl('stop')} className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="停止">
                                    <Square className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleAnimControl('next')} className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="下一个动画">
                                    <SkipForward className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs text-white/50">{animState === 'paused' ? '已暂停' : animState === 'stopped' ? '已停止' : '播放中'}</span>
                            </div>
                        )}

                        {/* Measure result */}
                        {measureDistance !== null && (
                            <div className="absolute bottom-16 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full shadow-lg border border-white/10 flex items-center gap-2">
                                <Ruler className="w-4 h-4 text-orange-400" />
                                <span className="text-sm font-mono font-bold text-white/80">{measureDistance}</span>
                                <span className="text-xs text-white/40">units</span>
                                <button onClick={() => { setMeasurePoints([]); setMeasureDistance(null); }} className="ml-1 p-0.5 rounded hover:bg-white/10 text-white/60" aria-label="Clear measurement">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        {measureMode && (
                            <div className="absolute bottom-16 left-6 px-4 py-2 bg-orange-500/90 text-white rounded-full shadow-lg flex items-center gap-2 text-sm backdrop-blur-md">
                                <Ruler className="w-4 h-4" />
                                {measurePoints.length === 0 ? '点击模型上的第一个点' : '点击第二个点完成测量'}
                            </div>
                        )}

                        {/* Model Info Panel */}
                        {showInfoPanel && modelInfo && (
                            <div className="absolute top-12 left-3 w-56 bg-black/70 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase text-white/40 tracking-wider">模型信息</span>
                                    <button onClick={() => setShowInfoPanel(false)} className="p-0.5 rounded hover:bg-white/10 text-white/60" aria-label="Close info panel">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="space-y-1.5 text-sm text-white/80">
                                    <div className="flex justify-between">
                                        <span className="text-white/40">顶点数</span>
                                        <span className="font-mono font-bold">{modelInfo.vertices.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/40">面数</span>
                                        <span className="font-mono font-bold">{modelInfo.faces.toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    <div className="text-xs text-white/40">包围盒</div>
                                    <div className="grid grid-cols-3 gap-1 text-xs font-mono">
                                        <div className="text-center py-1 bg-white/10 rounded">
                                            <div className="text-white/30">X</div>
                                            <div className="font-bold text-white/70">{modelInfo.boundingBox.x}</div>
                                        </div>
                                        <div className="text-center py-1 bg-white/10 rounded">
                                            <div className="text-white/30">Y</div>
                                            <div className="font-bold text-white/70">{modelInfo.boundingBox.y}</div>
                                        </div>
                                        <div className="text-center py-1 bg-white/10 rounded">
                                            <div className="text-white/30">Z</div>
                                            <div className="font-bold text-white/70">{modelInfo.boundingBox.z}</div>
                                        </div>
                                    </div>
                                    {modelInfo.animations.length > 0 && (
                                        <>
                                            <div className="h-px bg-white/10" />
                                            <div className="text-xs text-white/40">动画 ({modelInfo.animations.length})</div>
                                            <div className="space-y-0.5">
                                                {modelInfo.animations.map((name, i) => (
                                                    <div key={i} className="text-xs font-mono truncate text-white/60">{name}</div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                    {modelInfo.materials.length > 0 && (
                                        <>
                                            <div className="h-px bg-white/10" />
                                            <div className="text-xs text-white/40">材质 ({modelInfo.materials.length})</div>
                                            <div className="space-y-0.5">
                                                {modelInfo.materials.slice(0, 5).map((name, i) => (
                                                    <div key={i} className="text-xs font-mono truncate text-white/60">{name}</div>
                                                ))}
                                                {modelInfo.materials.length > 5 && (
                                                    <div className="text-xs text-white/30">+{modelInfo.materials.length - 5} more</div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {modelInfo.hasSkeleton && (
                                        <div className="flex items-center gap-1.5 text-xs text-orange-500">
                                            <Layers className="w-3 h-3" /> 骨骼动画
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* File badge */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full shadow-lg border border-white/10 text-sm font-medium text-white/70">
                            <Package className="w-3.5 h-3.5 text-orange-400" />
                            <span className="max-w-40 truncate">{fileName}</span>
                            <span className="w-px h-3 bg-white/15" />
                            <span className="text-xs font-mono text-white/40 uppercase">{fileExt}</span>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#f5f5f5] dark:bg-neutral-950">
                        <div className="w-24 h-24 bg-gradient-to-tr from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-orange-500/20 border border-orange-200/50 dark:border-orange-500/10">
                            <Box className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                        </div>

                        <h3 className="text-2xl font-bold mb-3">上传 3D 模型</h3>
                        <p className="text-neutral-500 max-w-sm mb-8 leading-relaxed text-sm">
                            支持拖拽上传 GLB, OBJ, FBX, STL 等主流格式<br />
                            <span className="text-xs opacity-70">所有渲染均在本地完成，保护您的数据隐私</span>
                        </p>

                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <label className="group relative cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-rose-500 to-amber-500 rounded-2xl opacity-70 blur-md group-hover:opacity-100 group-hover:blur-lg transition duration-500 animate-pulse" />
                                <div className="relative flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-neutral-900 rounded-xl font-bold text-neutral-800 dark:text-white border border-neutral-100 dark:border-neutral-800 shadow-xl">
                                    <Upload className="w-5 h-5 text-orange-500" />
                                    <span className="text-lg">选择 3D 文件</span>
                                </div>
                                <input type="file" className="hidden" accept=".glb,.gltf,.obj,.fbx,.stl,.3ds,.3dm" onChange={onFileChange} />
                            </label>

                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700" />
                                <span className="text-xs text-neutral-400">或者</span>
                                <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700" />
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && loadFromUrl()}
                                    placeholder="粘贴模型 URL..."
                                    aria-label="Model URL"
                                    className="flex-1 text-sm px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 outline-none focus:ring-2 focus:ring-orange-500/50 font-mono"
                                />
                                <button
                                    onClick={loadFromUrl}
                                    className="px-3 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                                    aria-label="Load model from URL"
                                >
                                    <Link className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={loadExample}
                                className="px-4 py-2 text-sm text-neutral-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <Zap className="w-3.5 h-3.5" />
                                没有模型？加载示例看看
                            </button>
                        </div>

                        {error && (
                            <div className="absolute bottom-8 left-0 right-0 mx-auto w-max max-w-[90%] px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-xl shadow-lg border border-red-100 dark:border-red-800/50 flex items-center gap-2 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                                <button onClick={() => setError(null)} className="ml-2 hover:bg-red-100 dark:hover:bg-red-800/50 rounded-full p-0.5" aria-label="Dismiss error">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function MeasureLine({ points, color, lineWidth }: { points: [number, number, number][]; color: string; lineWidth: number }) {
    return <DreiLine points={points} color={color} lineWidth={lineWidth} />;
}
