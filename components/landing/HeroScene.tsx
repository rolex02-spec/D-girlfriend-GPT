/**
 * HeroScene — the 3D centerpiece of the landing page.
 *
 * A slowly rotating crystalline heart (built from a parametric heart curve),
 * drifting ember particles and a starfield, all lit by a rose point light.
 * The group eases toward the visitor's pointer for a tactile parallax feel.
 *
 * Accessibility & performance:
 *  - If the user prefers reduced motion, we render a static frame
 *    (frameloop="demand") instead of animating.
 *  - dpr is capped, geometry is low-poly, and the canvas is decorative only
 *    (aria-hidden) — everything meaningful is in DOM text.
 */
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sparkles, Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Parametric heart outline → THREE.Shape (scale tuned for the camera). */
function buildHeartShape(): THREE.Shape {
  const pts: THREE.Vector2[] = [];
  const N = 72;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    pts.push(new THREE.Vector2(x * 0.085, y * 0.085));
  }
  return new THREE.Shape(pts);
}

function Heart({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const geometry = useMemo(() => {
    const shape = buildHeartShape();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.32,
      steps: 2,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.13,
      bevelSegments: 5,
    });
    geo.center();
    return geo;
  }, []);

  useFrame((state) => {
    if (!group.current || reduced) return;
    const t = state.clock.elapsedTime;
    // Idle sway + pointer parallax with critically-damped-ish easing
    const targetY = pointer.current.x * 0.35 + Math.sin(t * 0.35) * 0.22;
    const targetX = -pointer.current.y * 0.25 + Math.cos(t * 0.3) * 0.12;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.045;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.045;
    group.current.position.y = Math.sin(t * 0.6) * 0.14;
  });

  return (
    <group ref={group} rotation={[0, 0, 0]}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          color="#e9a2b8"
          emissive="#c76b8a"
          emissiveIntensity={0.7}
          roughness={0.22}
          metalness={0.45}
        />
      </mesh>
      {/* Inner glow core */}
      <pointLight color="#ff9ab8" intensity={7} distance={6} decay={2} />
    </group>
  );
}

export default function HeroScene() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0.1, 5.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : "always"}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.55} color="#7a5a68" />
        <directionalLight position={[4, 6, 6]} intensity={1.1} color="#ffe4d0" />
        <directionalLight position={[-6, -2, -4]} intensity={0.6} color="#5a6bd8" />
        <Stars radius={70} depth={40} count={2600} factor={3.2} saturation={0.55} fade speed={reduced ? 0 : 0.6} />
        <Float speed={reduced ? 0 : 1.6} rotationIntensity={reduced ? 0 : 0.35} floatIntensity={reduced ? 0 : 0.7}>
          <Heart reduced={reduced} />
        </Float>
        <Sparkles count={70} scale={[7, 4.5, 3]} size={2.6} speed={reduced ? 0 : 0.35} color="#ffd9c2" opacity={0.75} />
        <Sparkles count={40} scale={[9, 6, 4]} size={3.6} speed={reduced ? 0 : 0.2} color="#e9a2b8" opacity={0.6} />
      </Canvas>
      {/* Cinematic vignette over the 3D so text stays legible */}
      <div className="absolute inset-0 bg-[radial-gradient(1100px_620px_at_68%_42%,transparent_30%,rgba(14,8,16,0.55)_78%,#0e0810_100%)]" />
    </div>
  );
}
