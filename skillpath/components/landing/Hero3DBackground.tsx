'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WireframeSphere({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current && !isHovered) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 1]} />
      <meshBasicMaterial
        color={0xffffff}
        wireframe={true}
        opacity={0.2}
        transparent={true}
      />
    </mesh>
  );
}

export default function Hero3DBackground({ isHovered }: { isHovered: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <WireframeSphere isHovered={isHovered} />
    </Canvas>
  );
}
