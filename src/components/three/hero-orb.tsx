"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import * as THREE from "three";

function Orb() {
  const ref = React.useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.15;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1.2}>
      <Sphere ref={ref} args={[1.35, 96, 96]}>
        <MeshDistortMaterial
          color="#7C5CFF"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.05}
          metalness={0.85}
          emissive="#3b1f9c"
          emissiveIntensity={0.35}
        />
      </Sphere>
    </Float>
  );
}

function Particles({ count = 120 }: { count?: number }) {
  const ref = React.useRef<THREE.Points>(null!);
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.getElapsedTime() * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        sizeAttenuation
        color="#A78BFA"
        transparent
        opacity={0.85}
      />
    </points>
  );
}

export function HeroOrb({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} color="#ffffff" />
        <directionalLight position={[-4, -3, -2]} intensity={0.6} color="#22D3EE" />
        <Orb />
        <Particles />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
