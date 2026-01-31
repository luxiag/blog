"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls, Environment, Html, useProgress, Center, Stats } from '@react-three/drei';
import { Loader2, Upload, Box, AlertCircle, Package, Info, X, Zap } from 'lucide-react';
import * as THREE from 'three';

// Loaders
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-3 bg-white/90 dark:bg-black/90 p-6 rounded-2xl shadow-xl backdrop-blur-md border border-neutral-200 dark:border-neutral-800 transition-all transform scale-105">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-neutral-800 dark:text-white">{progress.toFixed(0)}%</span>
                    <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Loading Model</span>
                </div>
                <div className="w-32 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </Html>
    );
}

// --- Keyboard Controls ---

function useKeyboardControls() {
    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false
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
        const frontVector = new THREE.Vector3(
            0,
            0,
            Number(movement.backward) - Number(movement.forward)
        );
        const sideVector = new THREE.Vector3(
            Number(movement.left) - Number(movement.right),
            0,
            0
        );

        // Up/Down movement (Global Y axis)
        if (movement.up) camera.position.y += speed;
        if (movement.down) camera.position.y -= speed;

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(speed)
            .applyEuler(camera.rotation);

        camera.position.add(direction);
    });

    return null;
}

// --- Specific Format Loaders ---

import { useThree, useFrame } from '@react-three/fiber';

function GLTFModel({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

function OBJModel({ url }: { url: string }) {
    const obj = useLoader(OBJLoader, url);
    return <primitive object={obj} />;
}

function FBXModel({ url }: { url: string }) {
    const fbx = useLoader(FBXLoader, url);
    return <primitive object={fbx} />;
}

function TDSModel({ url }: { url: string }) {
    const obj = useLoader(TDSLoader, url);
    return <primitive object={obj} rotation={[-Math.PI / 2, 0, 0]} />;
}

function STLModel({ url }: { url: string }) {
    const geometry = useLoader(STLLoader, url);
    return (
        <mesh geometry={geometry}>
            <meshStandardMaterial color="#60a5fa" roughness={0.4} metalness={0.5} />
        </mesh>
    );
}

function RhinoModel({ url }: { url: string }) {
    const obj = useLoader(Rhino3dmLoader, url, (loader) => {
        loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.0/');
    });
    return <primitive object={obj} rotation={[-Math.PI / 2, 0, 0]} />;
}

// --- Main Model Switcher ---

function ModelSwitcher({ url, extension, onError }: { url: string, extension: string, onError: (err: any) => void }) {
    try {
        switch (extension) {
            case 'gltf':
            case 'glb':
                return <GLTFModel url={url} />;
            case 'obj':
                return <OBJModel url={url} />;
            case 'fbx':
                return <FBXModel url={url} />;
            case '3ds':
                return <TDSModel url={url} />;
            case 'stl':
                return <STLModel url={url} />;
            case '3dm':
                return <RhinoModel url={url} />;
            default:
                throw new Error(`Unsupported extension: ${extension}`);
        }
    } catch (err) {
        console.error(err);
        onError(err);
        return null;
    }
}

export default function ViewerComponent() {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [fileExt, setFileExt] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [envPreset, setEnvPreset] = useState<string>('city');
    const [autoRotate, setAutoRotate] = useState(false);

    // Example model for quick start
    const exampleModelUrl = 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf';

    const loadExample = () => {
        setFileUrl(exampleModelUrl);
        setFileName('Example: DamagedHelmet.gltf');
        setFileExt('gltf');
        setError(null);
    };

    useEffect(() => {
        return () => {
            // Only revoke object URLs we created, not global/external ones
            if (fileUrl && fileUrl.startsWith('blob:')) {
                URL.revokeObjectURL(fileUrl);
            }
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
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
    };

    const clearModel = () => {
        if (fileUrl && fileUrl.startsWith('blob:')) URL.revokeObjectURL(fileUrl);
        setFileUrl(null);
        setFileName('');
    };

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                        <Box className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold leading-tight">3D 模型查看器</h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">支持 GLB, OBJ, FBX, STL, 3DM 等格式</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!fileUrl && (
                        <button
                            onClick={loadExample}
                            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                        >
                            <Zap className="w-4 h-4" />
                            加载示例
                        </button>
                    )}
                    {fileUrl && (
                        <button
                            onClick={clearModel}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                            关闭模型
                        </button>
                    )}
                </div>
            </div>

            <div
                className={`flex-1 relative rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-inner ${dragActive
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-[0.99]'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-black/40'
                    }`}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
            >
                {fileUrl ? (
                    <>
                        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
                            <color attach="background" args={[envPreset === 'night' ? '#050505' : '#f5f5f5']} />
                            <Suspense fallback={<Loader />}>
                                <Stage environment={envPreset as any} intensity={0.5} contactShadow opacity={0.6} blur={2} shadows adjustCamera>
                                    <ModelSwitcher
                                        url={fileUrl}
                                        extension={fileExt}
                                        onError={(e) => setError("模型加载失败，可能是文件损坏或格式版本不支持")}
                                    />
                                </Stage>
                            </Suspense>
                            <OrbitControls autoRotate={autoRotate} makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
                            <KeyboardCamera />
                            {/* <Stats /> */}
                        </Canvas>

                        {/* Controls Overlay */}
                        <div className="absolute top-4 right-4 flex flex-col gap-3 p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-white/10 w-56 animate-in slide-in-from-right-4 fade-in duration-500">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Settings</span>
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-sm font-medium group-hover:text-blue-500 transition-colors">自动旋转</span>
                                    <input
                                        type="checkbox"
                                        checked={autoRotate}
                                        onChange={(e) => setAutoRotate(e.target.checked)}
                                        className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                                    />
                                </label>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-neutral-500">光照场景</label>
                                    <select
                                        value={envPreset}
                                        onChange={(e) => setEnvPreset(e.target.value)}
                                        className="w-full text-sm py-2 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-shadow"
                                    >
                                        <option value="city">🏙️ 城市 (标准)</option>
                                        <option value="sunset">🌇 日落 (暖色)</option>
                                        <option value="studio">📸 摄影棚 (柔和)</option>
                                        <option value="night">🌃 夜晚 (暗黑)</option>
                                        <option value="forest">🌲 森林 (自然)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

                            <div className="space-y-2">
                                <div className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Keyboard</div>
                                <div className="grid grid-cols-2 gap-1 text-[10px] text-neutral-600 dark:text-neutral-400 font-mono">
                                    <div className="flex items-center gap-1"><kbd className="bg-neutral-200 dark:bg-neutral-800 px-1 rounded">W/S</kbd> 前后</div>
                                    <div className="flex items-center gap-1"><kbd className="bg-neutral-200 dark:bg-neutral-800 px-1 rounded">A/D</kbd> 左右</div>
                                    <div className="flex items-center gap-1"><kbd className="bg-neutral-200 dark:bg-neutral-800 px-1 rounded">Q/E</kbd> 上下</div>
                                    <div className="flex items-center gap-1">🖱️ 旋转/缩放</div>
                                </div>
                            </div>
                        </div>

                        {/* File Info Overlay */}
                        <div className="absolute bottom-6 left-6 flex items-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="px-4 py-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-full text-sm font-medium shadow-lg border border-white/20 flex items-center gap-2">
                                <Package className="w-4 h-4 text-blue-500" />
                                {fileName}
                                <span className="w-px h-3 bg-neutral-300 dark:bg-neutral-700 mx-1" />
                                <span className="text-xs font-mono text-neutral-500 uppercase">{fileExt}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
                        <div className="w-24 h-24 bg-gradient-to-tr from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-orange-500/20 transform transition-transform hover:scale-110 duration-500 border border-orange-200/50 dark:border-orange-500/10">
                            <Box className="w-10 h-10 text-orange-600 dark:text-orange-400 drop-shadow-md" />
                        </div>

                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-white dark:to-neutral-400 mb-3">
                            上传 3D 模型
                        </h3>
                        <p className="text-neutral-500 max-w-sm mb-8 leading-relaxed">
                            支持拖拽上传 GLB, OBJ, FBX, STL 等主流格式 <br />
                            <span className="text-sm opacity-70">所有渲染均在本地完成，保护您的数据隐私</span>
                        </p>

                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <label className="group relative cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                                {/* Glowing Background Layer */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-rose-500 to-amber-500 rounded-2xl opacity-70 blur-md group-hover:opacity-100 group-hover:blur-lg transition duration-500 animate-pulse"></div>

                                {/* Button Content */}
                                <div className="relative flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-neutral-900 rounded-xl font-bold text-neutral-800 dark:text-white border border-neutral-100 dark:border-neutral-800 group-hover:bg-opacity-90 transition duration-200 shadow-xl">
                                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-white dark:to-neutral-300 font-extrabold group-hover:to-orange-500 transition-all">
                                        选择 3D 文件
                                    </span>
                                </div>
                                <input type="file" className="hidden" accept=".glb,.gltf,.obj,.fbx,.stl,.3ds,.3dm" onChange={onFileChange} />
                            </label>

                            <button
                                onClick={loadExample}
                                className="px-4 py-2 text-sm text-neutral-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <Zap className="w-3.5 h-3.5" />
                                没有模型？加载示例看看
                            </button>
                        </div>

                        {error && (
                            <div className="absolute bottom-8 left-0 right-0 mx-auto w-max max-w-[90%] px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-xl shadow-lg border border-red-100 dark:border-red-800/50 flex items-center gap-2 text-sm animate-in slide-in-from-bottom-2 fade-in">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                                <button onClick={() => setError(null)} className="ml-2 hover:bg-red-100 dark:hover:bg-red-800/50 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
