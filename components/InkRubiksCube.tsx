"use client";

import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';


interface CubeletState {
  id: string;
  pos: THREE.Vector3;
  color: string;
}

// 中国传统岩彩与水墨淡彩配色
const INK_PALETTE = {
  top: '#f9f8f6',    // 宣纸白
  bottom: '#222222', // 焦墨黑
  front: '#4e5969',  // 黛蓝色
  back: '#b25d53',   // 朱砂红
  left: '#9ca3af',   // 皴擦灰
  right: '#c08457',  // 赭石色
};

interface InkCubeletProps {
  cube: CubeletState;
  activeFaceInfo: { cubeId: string; normal: THREE.Vector3 } | null;
  onSelect: (info: { cubeId: string; normal: THREE.Vector3 } | null) => void;
  onRotate: (axis: 'x' | 'y' | 'z', layer: number, dir: number) => void;
}

/**
 * 1. 单个水墨方块组件（已移除 Edges 黑色线条）
 */
const InkCubelet: React.FC<InkCubeletProps> = ({ 
  cube, activeFaceInfo, onSelect, onRotate 
}) => {
  const toonMaterial = useMemo(() => {
    const format = THREE.RGBAFormat;
    // 渐变贴图提供水墨浓淡的阶梯晕染效果
    const colors = new Uint8Array([0, 0, 0, 255, 60, 60, 60, 255, 180, 180, 180, 255, 255, 255, 255, 255]);
    const gradientMap = new THREE.DataTexture(colors, 4, 1, format);
    gradientMap.needsUpdate = true;
    return new THREE.MeshToonMaterial({ color: new THREE.Color(cube.color), gradientMap, roughness: 0.9 });
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
  }, [isActive, activeFaceInfo, currentX, currentY, currentZ]);

  return (
    <mesh 
      position={cube.pos} 
      material={toonMaterial}
      onClick={(e) => {
        e.stopPropagation();
        if (e.face) {
          onSelect({ cubeId: cube.id, normal: e.face.normal.clone() });
        }
      }}
    >
      {/* 调整args留出微小的间隙(0.96)，即使没有线条，在视觉上也能看出方块之间的独立感 */}
      <boxGeometry args={[0.96, 0.96, 0.96]} />
      
      {/* ✂️ 此处已彻底移除原有的 <Edges /> 组件 */}

      {isActive && arrowActions && (
        <Html center distanceFactor={6}>
          <div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 32px)', gridTemplateRows: 'repeat(3, 32px)', gap: '4px', userSelect: 'none' }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <button style={{ ...btnStyle, gridColumn: '2', gridRow: '1' }} onClick={() => { arrowActions.up(); onSelect(null); }}>▲</button>
            <button style={{ ...btnStyle, gridColumn: '1', gridRow: '2' }} onClick={() => { arrowActions.left(); onSelect(null); }}>◀</button>
            <div style={{ ...btnStyle, gridColumn: '2', gridRow: '2', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '10px' }} onClick={() => onSelect(null)}>●</div>
            <button style={{ ...btnStyle, gridColumn: '3', gridRow: '2' }} onClick={() => { arrowActions.right(); onSelect(null); }}>▶</button>
            <button style={{ ...btnStyle, gridColumn: '2', gridRow: '3' }} onClick={() => { arrowActions.down(); onSelect(null); }}>▼</button>
          </div>
        </Html>
      )}
    </mesh>
  );
};

const btnStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  background: 'rgba(255, 255, 255, 0.95)',
  border: '2px solid #1a1a1a',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  color: '#1a1a1a',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  fontFamily: 'monospace',
};

/**
 * 2. 魔方网格逻辑
 */
const RubiksCubeGrid: React.FC = () => {
  const [activeFaceInfo, setActiveFaceInfo] = useState<{ cubeId: string; normal: THREE.Vector3 } | null>(null);

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
  const isAnimating = useRef(false);
  const animationTargetAngle = useRef(0);
  const animationCurrentAngle = useRef(0);
  const animationAxis = useRef<"x" | "y" | "z">("y");
  const animationLayerValue = useRef(0);

  const handleRotateCommand = (axis: 'x' | 'y' | 'z', layer: number, dir: number) => {
    if (isAnimating.current) return;
    animationAxis.current = axis;
    animationLayerValue.current = layer;
    animationTargetAngle.current = (Math.PI / 2) * dir;
    animationCurrentAngle.current = 0;
    isAnimating.current = true;
  };

  useFrame((_, delta) => {
    if (!isAnimating.current || !animatingGroupRef.current) return;

    const speed = 14; 
    const remain = animationTargetAngle.current - animationCurrentAngle.current;
    let step = remain * speed * delta;

    if (Math.abs(remain) < 0.01) {
      step = remain;
      isAnimating.current = false;
    }

    animationCurrentAngle.current += step;

    if (animationAxis.current === "y") animatingGroupRef.current.rotation.y = animationCurrentAngle.current;
    if (animationAxis.current === "x") animatingGroupRef.current.rotation.x = animationCurrentAngle.current;
    if (animationAxis.current === "z") animatingGroupRef.current.rotation.z = animationCurrentAngle.current;

    if (!isAnimating.current) {
      const finalMatrix = new THREE.Matrix4();
      if (animationAxis.current === "y") finalMatrix.makeRotationY(animationTargetAngle.current);
      if (animationAxis.current === "x") finalMatrix.makeRotationX(animationTargetAngle.current);
      if (animationAxis.current === "z") finalMatrix.makeRotationZ(animationTargetAngle.current);

      setCubelets((prev) =>
        prev.map((cube) => {
          const isMatch = Math.round(cube.pos[animationAxis.current]) === animationLayerValue.current;
          if (!isMatch) return cube;

          const newPos = cube.pos.clone().applyMatrix4(finalMatrix);
          return {
            ...cube,
            pos: new THREE.Vector3(Math.round(newPos.x), Math.round(newPos.y), Math.round(newPos.z)),
          };
        })
      );

      animatingGroupRef.current.rotation.set(0, 0, 0);
    }
  });

  return (
    <group onPointerDown={() => setActiveFaceInfo(null)}>
      <group ref={animatingGroupRef}>
        {cubelets
          .filter((c) => isAnimating.current && Math.round(c.pos[animationAxis.current]) === animationLayerValue.current)
          .map((cube) => (
            <InkCubelet key={cube.id} cube={cube} activeFaceInfo={activeFaceInfo} onSelect={setActiveFaceInfo} onRotate={handleRotateCommand} />
          ))}
      </group>

      {cubelets
        .filter((c) => !isAnimating.current || Math.round(c.pos[animationAxis.current]) !== animationLayerValue.current)
        .map((cube) => (
          <InkCubelet key={cube.id} cube={cube} activeFaceInfo={activeFaceInfo} onSelect={setActiveFaceInfo} onRotate={handleRotateCommand} />
        ))}
    </group>
  );
};

/**
 * 3. 主画布
 */
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
