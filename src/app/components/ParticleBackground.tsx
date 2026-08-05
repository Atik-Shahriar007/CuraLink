"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 180;
const COLORS = ["#0F3D3E", "#1B6B63", "#2E8577", "#B5541B", "#D97B3F"];

function makeGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function ParticleField({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useMemo(() => makeGlowTexture(), []);

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 8,
      ] as [number, number, number],
      size: 0.15 + Math.random() * 0.55,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: 0.05 + Math.random() * 0.1,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (reducedMotion || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      child.position.y = p.position[1] + Math.sin(t * p.speed + p.offset) * 0.4;
      child.position.x = p.position[0] + Math.cos(t * p.speed * 0.7 + p.offset) * 0.3;
    });
    groupRef.current.rotation.y = t * 0.015;
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <sprite key={i} position={p.position} scale={[p.size, p.size, p.size]}>
          <spriteMaterial
            map={texture}
            color={p.color}
            transparent
            opacity={0.55}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

export default function ParticleBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ParticleField reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}