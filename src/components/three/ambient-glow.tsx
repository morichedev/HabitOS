"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Blob() {
  const ref = React.useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.05;
    ref.current.rotation.y = t * 0.08;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[2.5, 4]} />
      <meshStandardMaterial
        color="#7C5CFF"
        emissive="#22D3EE"
        emissiveIntensity={0.25}
        roughness={0.4}
        metalness={0.6}
        wireframe
        opacity={0.35}
        transparent
      />
    </mesh>
  );
}

export function AmbientGlow({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.3]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#A78BFA" />
        <Blob />
      </Canvas>
    </div>
  );
}
