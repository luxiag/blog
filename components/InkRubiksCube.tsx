"use client";

import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface CubeletState {
  id: string;
  pos: THREE.Vector3;
  color: string;
}

interface ActiveFaceInfo {
  cubeId: string;
  normal: THREE.Vector3;
}

// 统一封装正在执行的动画状态接口
interface RotationState {
  axis: 'x' | 'y' | 'z';
  layer: number;
  dir: number;
}

const INK_PALETTE = {
  top: '#f9f8f6', bottom: '#222222', front: '#4e5969',
  back: '#b25d53', left: '#9ca3af', right: '#c08457',
};

interface InkCubeletProps {
  cube: CubeletState;
  activeFaceInfo: ActiveFaceInfo | null;
  onSelect: (info: ActiveFaceInfo | null) => void;
  onRotate: (axis: 'x' | 'y' | 'z', layer: number, dir: number) => void;
}

const InkCubelet: React.FC<InkCubeletProps> = ({ cube, activeFaceInfo, onSelect, onRotate }) => {
const toonMaterial = useMemo(() => {
    const format = THREE.RGBAFormat;
    const colors = new Uint8Array([0, 0, 0, 255, 60, 60, 60, 255, 180, 180, 180, 255, 255, 255, 255, 255]);
    const gradientMap = new THREE.DataTexture(colors, 4, 1, format);
    gradientMap.needsUpdate = true;
    
    return new THREE.MeshToonMaterial({ 
      color: new THREE.Color(cube.color), 
      gradientMap,
    });
  }, [cube.color]);

  const currentX = Math.round(cube.pos.x);
  const currentY = Math.round(cube.pos.y);
  const currentZ = Math.round(cube.pos.z);
  const isActive = activeFaceInfo?.cubeId === cube.id;

  const arrowActions = useMemo(() => {
    if (!isActive || !activeFaceInfo) return null;
    const n = activeFaceInfo.normal;

    if (Math.abs(n.x) > 0.8) {
      return {
        up:    () => onRotate('z', currentZ, n.x > 0 ? 1 : -1),
        down:  () => onRotate('z', currentZ, n.x > 0 ? -1 : 1),
        left:  () => onRotate('y', currentY, 1),
        right: () => onRotate('y', currentY, -1),
      };
    }
    if (Math.abs(n.y) > 0.8) {
      return {
        up:    () => onRotate('z', currentZ, n.y > 0 ? 1 : -1),
        down:  () => onRotate('z', currentZ, n.y > 0 ? -1 : 1),
        left:  () => onRotate('x', currentX, n.y > 0 ? -1 : 1),
        right: () => onRotate('x', currentX, n.y > 0 ? 1 : -1),
      };
    }
    return {
      up:    () => onRotate('x', currentX, n.z > 0 ? 1 : -1),
      down:  () => onRotate('x', currentX, n.z > 0 ? -1 : 1),
      left:  () => onRotate('y', currentY, 1),
      right: () => onRotate('y', currentY, -1),
    };
  }, [isActive, activeFaceInfo, currentX, currentY, currentZ, onRotate]);

  const stopDomPropagation = (e: React.PointerEvent | React.MouseEvent) => e.stopPropagation();

  return (
    <mesh 
      position={cube.pos} 
      material={toonMaterial}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (e.face) onSelect({ cubeId: cube.id, normal: e.face.normal.clone() });
      }}
    >
      <boxGeometry args={[0.96, 0.96, 0.96]} />

      {isActive && arrowActions && (
        <Html center distanceFactor={6}>
          <div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 32px)', gridTemplateRows: 'repeat(3, 32px)', gap: '4px', userSelect: 'none' }}
            onPointerDown={stopDomPropagation}
            onPointerUp={stopDomPropagation}
            onClick={stopDomPropagation}
          >
            <button style={{ ...btnStyle, gridColumn: '2', gridRow: '1' }} onClick={() => { arrowActions.up(); onSelect(null); }}>▲</button>
            <button style={{ ...btnStyle, gridColumn: '1', gridRow: '2' }} onClick={() => { arrowActions.left(); onSelect(null); }}>◀</button>
            <div role="button" tabIndex={0} aria-label="Deselect" style={{ ...btnStyle, gridColumn: '2', gridRow: '2', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '10px' }} onClick={() => onSelect(null)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(null); } }}>●</div>
            <button style={{ ...btnStyle, gridColumn: '3', gridRow: '2' }} onClick={() => { arrowActions.right(); onSelect(null); }}>▶</button>
            <button style={{ ...btnStyle, gridColumn: '2', gridRow: '3' }} onClick={() => { arrowActions.down(); onSelect(null); }}>▼</button>
          </div>
        </Html>
      )}
    </mesh>
  );
};

const btnStyle: React.CSSProperties = {
  width: '32px', height: '32px', background: 'rgba(255, 255, 255, 0.95)', border: '2px solid #1a1a1a',
  borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 'bold', color: '#1a1a1a', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontFamily: 'monospace',
};

/**
 * 2. 魔方网格逻辑（彻底解耦 Render 阶段的任何 Ref 访问）
 */
const RubiksCubeGrid: React.FC = () => {
  const [activeFaceInfo, setActiveFaceInfo] = useState<ActiveFaceInfo | null>(null);
  
  // 🌟【核心重构】使用单一状态管理动画，默认 null 代表静止，非 null 代表正在朝某个轴和层级旋转
  const [currentRotation, setCurrentRotation] = useState<RotationState | null>(null);

  const [cubelets, setCubelets] = useState<CubeletState[]>(() => {
    const result: CubeletState[] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          let color = INK_PALETTE.top;
          if (x === 1) color = INK_PALETTE.right;
          if (x === -1) color = INK_PALETTE.left;
          if (y === 1) color = INK_PALETTE.top;
          if (y === -1) color = INK_PALETTE.bottom;
          if (z === 1) color = INK_PALETTE.front;
          if (z === -1) color = INK_PALETTE.back;
          result.push({ id: `${x}-${y}-${z}`, pos: new THREE.Vector3(x, y, z), color });
        }
      }
    }
    return result;
  });

  const animatingGroupRef = useRef<THREE.Group>(null);
  
  // 仅在 useFrame 内部进行数学高频计算的微观变量，脱离渲染树
  const animationTargetAngle = useRef(0);
  const animationCurrentAngle = useRef(0);

  const handleRotateCommand = (axis: 'x' | 'y' | 'z', layer: number, dir: number) => {
    if (currentRotation) return; // 正在转动时锁死新指令

    animationTargetAngle.current = (Math.PI / 2) * dir;
    animationCurrentAngle.current = 0;
    
    // 安全更新 React 动画上下文状态
    setCurrentRotation({ axis, layer, dir });
  };

  useFrame((_, delta) => {
    if (!currentRotation || !animatingGroupRef.current) return;

    const speed = 14; 
    const remain = animationTargetAngle.current - animationCurrentAngle.current;
    let step = remain * speed * delta;

    if (Math.abs(remain) < 0.01) {
      step = remain;
    }

    animationCurrentAngle.current += step;

    // 根据当前的 React 纯状态控制旋转
    const { axis, layer } = currentRotation;
    if (axis === "y") animatingGroupRef.current.rotation.y = animationCurrentAngle.current;
    if (axis === "x") animatingGroupRef.current.rotation.x = animationCurrentAngle.current;
    if (axis === "z") animatingGroupRef.current.rotation.z = animationCurrentAngle.current;

    // 动画完成收尾
    if (Math.abs(remain) < 0.01) {
      const finalMatrix = new THREE.Matrix4();
      if (axis === "y") finalMatrix.makeRotationY(animationTargetAngle.current);
      if (axis === "x") finalMatrix.makeRotationX(animationTargetAngle.current);
      if (axis === "z") finalMatrix.makeRotationZ(animationTargetAngle.current);

      setCubelets((prev) =>
        prev.map((cube) => {
          const isMatch = Math.round(cube.pos[axis]) === layer;
          if (!isMatch) return cube;

          const newPos = cube.pos.clone().applyMatrix4(finalMatrix);
          return {
            ...cube,
            pos: new THREE.Vector3(Math.round(newPos.x), Math.round(newPos.y), Math.round(newPos.z)),
          };
        })
      );

      animatingGroupRef.current.rotation.set(0, 0, 0);
      setCurrentRotation(null); // 解锁状态
    }
  });

  return (
    <group onPointerDown={() => setActiveFaceInfo(null)}>
      {/* 动态动画过滤组 - 100% 干净的纯状态推导，无任何 Ref.current 染指 */}
      <group ref={animatingGroupRef}>
        {cubelets
          .filter((c) => currentRotation && Math.round(c.pos[currentRotation.axis]) === currentRotation.layer)
          .map((cube) => (
            <InkCubelet key={cube.id} cube={cube} activeFaceInfo={activeFaceInfo} onSelect={setActiveFaceInfo} onRotate={handleRotateCommand} />
          ))}
      </group>

      {/* 静态静止组 */}
      {cubelets
        .filter((c) => !currentRotation || Math.round(c.pos[currentRotation.axis]) !== currentRotation.layer)
        .map((cube) => (
          <InkCubelet key={cube.id} cube={cube} activeFaceInfo={activeFaceInfo} onSelect={setActiveFaceInfo} onRotate={handleRotateCommand} />
        ))}
    </group>
  );
};

const InkRubiksCube: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [4, 4, 6], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <directionalLight position={[-5, -5, -5]} intensity={0.2} />

        <RubiksCubeGrid />

        <OrbitControls makeDefault enableDamping dampingFactor={0.05} minDistance={4} maxDistance={12} />
      </Canvas>
    </div>
  );
};

export default InkRubiksCube;
