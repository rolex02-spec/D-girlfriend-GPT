'use client';

// ============================================================
// HERO SCENE — the candlelit 3D moment on the landing page.
//
// Concept: a single warm ember-orb (her light in an empty room)
// wrapped in two slow orbital rings, breathing like someone is
// sitting behind it, with candle-spark dust drifting upward.
// The camera leans toward the pointer so the scene feels alive
// without ever fighting the reader's scroll.
//
// Rules honored here:
//   - ONE WebGL context on this page (the rule: max four).
//   - pointer-events-none so the hero copy stays selectable.
//   - prefers-reduced-motion freezes the scene on its first frame.
//   - WebGL failure falls back to a CSS radial glow (never an empty ground).
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

// ---------- Ember orb: the breathing heart of the hero ----------
function EmberOrb({ reduced }: { reduced: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reduced) return; // reduced motion → stay on the composed first frame
    const t = state.clock.getElapsedTime();

    // Slow breath (≈8s cycle) — reads as "someone is home"
    if (coreRef.current) {
      const breathe = 1 + Math.sin(t * 0.8) * 0.03;
      coreRef.current.scale.setScalar(breathe);
      coreRef.current.rotation.y = t * 0.08;
    }
    // The wire shell counter-rotates so the silhouette never feels static
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.05;
      shellRef.current.rotation.x = Math.sin(t * 0.2) * 0.12;
    }
  });

  return (
    <group>
      {/* Solid warm core — dim enough that headline text always wins */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.05, 64, 64]} />
        <meshStandardMaterial color="#241a14" emissive="#c98f4e" emissiveIntensity={0.16} roughness={0.45} metalness={0.05} />
      </mesh>

      {/* Faint wireframe shell — catches the eye, costs nothing */}
      <mesh ref={shellRef} scale={1.22}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#d9a05b" wireframe transparent opacity={0.07} />
      </mesh>

      {/* Inner glow: a second, larger sphere with additive material */}
      <mesh scale={1.5}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#c4685a" transparent opacity={0.028} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ---------- Orbital rings: two thin ellipses at opposing tilts ----------
function OrbitRings({ reduced }: { reduced: boolean }) {
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.getElapsedTime();
    if (ringA.current) ringA.current.rotation.z = t * 0.12;
    if (ringB.current) ringB.current.rotation.z = -t * 0.09;
  });

  return (
    <group>
      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[1.9, 0.006, 8, 160]} />
        <meshBasicMaterial color="#d9a05b" transparent opacity={0.55} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.8, -0.4, 0.5]}>
        <torusGeometry args={[2.35, 0.004, 8, 160]} />
        <meshBasicMaterial color="#c4685a" transparent opacity={0.35} />
      </mesh>
      {/* A single "companion" bead orbiting the inner ring — she is not alone */}
      <OrbitBead reduced={reduced} />
    </group>
  );
}

function OrbitBead({ reduced }: { reduced: boolean }) {
  const bead = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!bead.current) return;
    const t = reduced ? 0.9 : state.clock.getElapsedTime() * 0.35;
    bead.current.position.set(Math.cos(t) * 1.9, Math.sin(t) * 0.72, Math.sin(t) * 1.55);
  });
  return (
    <mesh ref={bead}>
      <sphereGeometry args={[0.045, 16, 16]} />
      <meshBasicMaterial color="#ece5d8" />
    </mesh>
  );
}

// ---------- Candle-spark dust: points rising and wrapping ----------
function DustField({ reduced, count = 320 }: { reduced: boolean; count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate the field once: x/z spread wide, y in a tall band we wrap around
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;      // x: ±8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;  // y: ±5
      positions[i * 3 + 2] = -4 + Math.random() * 5;      // z: behind the orb
      speeds[i] = 0.12 + Math.random() * 0.35;            // slow, varied drift
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, delta) => {
    if (reduced || !pointsRef.current) return;
    const attr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const yIndex = i * 3 + 1;
      arr[yIndex] += speeds[i] * delta; // rise like sparks off a candle
      if (arr[yIndex] > 5) arr[yIndex] = -5; // wrap to the bottom
      // gentle sideways sway
      arr[i * 3] += Math.sin(performance.now() / 4000 + i) * 0.0015;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#e8b06a"
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ---------- Camera rig: the scene leans toward the pointer ----------
function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state) => {
    if (reduced) return;
    const { pointer, camera } = state;
    // Ease toward the pointer — 4% per frame keeps it weighted, never jittery
    camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ---------- WebGL capability probe (same pattern as the chat room) ----------
function useHasWebGL() {
  const [hasWebGL, setHasWebGL] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      setHasWebGL(!!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))));
    } catch {
      setHasWebGL(false);
    }
  }, []);
  return hasWebGL;
}

// ---------- Exported scene: canvas + graceful CSS fallback ----------
export default function HeroScene() {
  const hasWebGL = useHasWebGL();
  const reduced = !!useReducedMotion();

  // SSR renders the shell once; the probe flips it on after mount
  if (!hasWebGL) {
    return (
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {/* CSS fallback: layered warm glows + drifting dust dots — never an empty ground */}
        <div className="absolute left-1/2 top-1/2 h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-full animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, rgba(217,160,91,0.22) 0%, rgba(196,104,90,0.08) 45%, transparent 70%)', filter: 'blur(2px)' }} />
        <div className="absolute left-1/2 top-1/2 h-[30vmin] w-[30vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(217,160,91,0.35) 0%, transparent 65%)' }} />
        {[...Array(14)].map((_, i) => (
          <span key={i} className="absolute h-1 w-1 rounded-full bg-amber/50 animate-float-dust"
            style={{ left: `${8 + i * 6.4}%`, top: `${20 + (i % 5) * 14}%`, '--tx': `${(i % 2 ? 1 : -1) * 26}px`, '--ty': '-60px', animationDelay: `${i * 0.7}s`, animationDuration: '9s' } as React.CSSProperties} />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6.6], fov: 42 }}
        dpr={[1, 1.75]}                       // cap pixel ratio — keeps mobile smooth
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);      // transparent — the CSS ground shows through
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        }}
      >
        {/* Warm candlelight palette, matching the Midnight Romance tokens */}
        <ambientLight intensity={0.4} color="#ffe4cc" />
        <directionalLight position={[2, 3, 4]} intensity={0.9} color="#fff2dd" />
        <pointLight position={[0, 0, 2.4]} intensity={1.1} color="#d9a05b" distance={14} />

        <EmberOrb reduced={reduced} />
        <OrbitRings reduced={reduced} />
        <DustField reduced={reduced} />
        <CameraRig reduced={reduced} />
      </Canvas>
    </div>
  );
}
