"use client";
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function Box(props: any) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef<any>(null);
  
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.x += delta;
        meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

export default function ThreeBasicDemo() {
  return (
    <div className="h-[400px] w-full bg-black rounded-lg overflow-hidden my-6 border border-neutral-700 relative">
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
          <span className="text-xs text-white/50 bg-black/50 px-2 py-1 rounded">试试点击或悬停在立方体上 (Click or Hover)</span>
      </div>
    </div>
  );
}
