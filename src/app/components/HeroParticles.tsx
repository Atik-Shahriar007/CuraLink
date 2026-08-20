"use client";

import dynamic from "next/dynamic";

const ParticleBackground = dynamic(() => import("./ParticleBackground"), { ssr: false });

export default function HeroParticles() {
  return <ParticleBackground />;
}