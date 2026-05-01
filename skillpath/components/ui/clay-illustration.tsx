'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, ContactShadows, Environment, RoundedBox, Torus, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface ClayProps {
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// Authentic Clay Material Hook
function ClayMaterial({ color = "#FF9A8B" }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.8}
      metalness={0.05}
      emissive={color}
      emissiveIntensity={0.1}
    />
  );
}

function ClayBook({ color = "#FF9A8B", position = [0, 0, 0], rotation = [0, 0, 0] as [number, number, number] }: ClayProps) {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position} rotation={rotation}>
        {/* Book Cover */}
        <RoundedBox args={[1.2, 1.6, 0.3]} radius={0.1} smoothness={4}>
          <ClayMaterial color={color} />
        </RoundedBox>
        {/* Pages */}
        <RoundedBox args={[1.1, 1.5, 0.25]} radius={0.05} smoothness={4} position={[0.05, 0, 0]}>
          <meshStandardMaterial color="#fffaf0" roughness={0.9} />
        </RoundedBox>
      </group>
    </Float>
  );
}

function ClayLightbulb({ color = "#e8b94a", position = [0, 0, 0] }: ClayProps) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group position={position}>
        <Sphere args={[0.6, 32, 32]}>
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} emissive={color} emissiveIntensity={0.4} />
        </Sphere>
        <Cylinder args={[0.2, 0.2, 0.3, 32]} position={[0, -0.6, 0]}>
          <meshStandardMaterial color="#6a6a6a" roughness={0.7} />
        </Cylinder>
      </group>
    </Float>
  );
}

function ClayCompass({ color = "#b8a4ed", position = [0, 0, 0] }: ClayProps) {
  return (
    <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.5}>
      <group position={position}>
        <Torus args={[0.6, 0.1, 16, 32]}>
          <ClayMaterial color={color} />
        </Torus>
        <Sphere args={[0.1, 16, 16]}>
          <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
        </Sphere>
        <RoundedBox args={[0.05, 0.8, 0.05]} radius={0.02} rotation={[0, 0, Math.PI / 4]}>
          <meshStandardMaterial color="#ff4d8b" roughness={0.6} />
        </RoundedBox>
      </group>
    </Float>
  );
}

function HeroScene({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle mouse parallax (not overwhelming)
      const targetX = mouse.x * 0.3;
      const targetY = mouse.y * 0.3;
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.05;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;
      
      // Floating ambient rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Vibrant, dynamic composition - no glass */}
      <ClayBook color="#ff4d8b" position={[-1.2, 0.5, 0]} rotation={[0.2, 0.4, -0.2]} />
      <ClayLightbulb position={[1.2, 1.2, -0.5]} />
      <ClayCompass position={[0.2, -1.2, 0.5]} />
      
      {/* Abstract decorative blobs */}
      <Float speed={2.5} floatIntensity={3}>
        <Sphere args={[0.35, 32, 32]} position={[-1.8, -1.2, -1]}>
          <ClayMaterial color="#ffb084" />
        </Sphere>
      </Float>
      <Float speed={1.5} floatIntensity={2}>
        <Sphere args={[0.25, 32, 32]} position={[1.8, -0.8, -1.5]}>
          <ClayMaterial color="#a4d4c5" />
        </Sphere>
      </Float>
    </group>
  );
}

function Blob({ color = "#FF9A8B", speed = 2, distort = 0.4, radius = 1, position = [0, 0, 0] }: ClayProps & { speed?: number, distort?: number, radius?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[radius, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={distort}
          roughness={0.7}
          metalness={0.05}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </Sphere>
    </Float>
  );
}

export function ClayIllustration({ 
  color = "#FF9A8B", 
  className = "",
  type = "blob"
}: { 
  color?: string; 
  className?: string;
  type?: "blob" | "hero" | "book" | "score" | "execute";
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`w-full h-full min-h-[300px] ${className}`} />;
  }

  return (
    <div className={`w-full h-full min-h-[300px] relative overflow-hidden ${className}`}>
      <Suspense fallback={<div className="w-full h-full bg-transparent" />}>
        <Canvas 
          camera={{ position: [0, 0, 6], fov: 40 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
          dpr={[1, 2]}
        >
          {/* Studio lighting for the authentic clay look */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
          <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#fffaf0" />
          <pointLight position={[0, -5, 5]} intensity={0.5} color="#ffb084" />
          
          {type === "hero" ? (
            <HeroScene color={color} />
          ) : (
            <>
              {type === "book" && <ClayBook color={color} />}
              {type === "score" && (
                <group>
                    <RoundedBox args={[0.6, 1.2, 0.4]} radius={0.1} position={[-0.4, -0.2, 0]}>
                      <ClayMaterial color={color} />
                    </RoundedBox>
                    <RoundedBox args={[0.6, 1.6, 0.4]} radius={0.1} position={[0.4, 0, 0]}>
                      <ClayMaterial color={color} />
                    </RoundedBox>
                </group>
              )}
              {type === "execute" && <ClayCompass color={color} />}
              {type === "blob" && <Blob color={color} />}
            </>
          )}
          
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.5} 
            scale={15} 
            blur={2.5} 
            far={4.5} 
            color="#000000"
          />
          
          <Environment preset="studio" />
        </Canvas>
      </Suspense>
    </div>
  );
}
