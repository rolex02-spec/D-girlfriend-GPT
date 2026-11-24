'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CharacterAvatar3DProps {
  character: {
    name: string;
    appearance: {
      skinColor?: string;
      eyeColor?: string;
      hairColor?: string;
    };
    nsfwAllowed?: boolean;
  };
  className?: string;
  size?: number;
  interactive?: boolean;
  fallback?: React.ReactNode;
}

function Avatar3DInner({ 
  character, 
  size = 64,
  interactive = true,
  isActive = false,
  isSpeaking = false
}: CharacterAvatar3DProps & { isActive?: boolean; isSpeaking?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const blinkRef = useRef(0);
  const breatheRef = useRef(0);
  const swayRef = useRef(0);
  const { camera } = useThree();

  const skinColor = character.appearance.skinColor || '#FFE4C4';
  const eyeColor = character.appearance.eyeColor || '#4A2810';
  const hairColor = character.appearance.hairColor || '#1A1A2E';

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Breathing animation
    breatheRef.current += delta * 0.8;
    const breathe = Math.sin(breatheRef.current) * 0.015;
    if (groupRef.current) {
      groupRef.current.position.y = breathe;
      groupRef.current.scale.setScalar(1 + breathe * 0.5);
    }

    // Gentle sway
    swayRef.current += delta * 0.3;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(swayRef.current) * 0.02;
      groupRef.current.rotation.x = Math.cos(swayRef.current * 0.7) * 0.01;
    }

    // Blinking
    blinkRef.current -= delta;
    if (blinkRef.current <= 0) {
      blinkRef.current = 3 + Math.random() * 5;
      if (leftEyeRef.current && rightEyeRef.current) {
        leftEyeRef.current.scale.y = 0.05;
        rightEyeRef.current.scale.y = 0.05;
        setTimeout(() => {
          if (leftEyeRef.current && rightEyeRef.current) {
            leftEyeRef.current.scale.y = 1;
            rightEyeRef.current.scale.y = 1;
          }
        }, 120 + Math.random() * 80);
      }
    }

    // Speaking animation - mouth movement
    if (isSpeaking && headRef.current) {
      const speakAmount = Math.sin(t * 15) * 0.02 + 0.02;
      headRef.current.scale.y = 1 + speakAmount;
    } else if (headRef.current) {
      headRef.current.scale.y = 1;
    }

    // Interactive: follow mouse
    if (interactive && camera) {
      // Camera follows subtle pointer movement
    }
  });

  // Lighting for the avatar
  const lights = (
    <>
      <ambientLight intensity={0.6} color="#ffe4cc" />
      <directionalLight position={[0.5, 1, 1]} intensity={1} color="#fff8e7" castShadow />
      <pointLight position={[0, 1, 2]} intensity={0.5} color="#ffccaa" />
    </>
  );

  return (
    <group ref={groupRef}>
      {lights}
      
      {/* Head */}
      <mesh ref={headRef} castShadow receiveShadow>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshStandardMaterial 
          color={skinColor} 
          roughness={0.45} 
          metalness={0.02} 
        />
      </mesh>

      {/* Left Eye Group */}
      <group position={[-0.18, 0.05, 0.48]}>
        <mesh ref={leftEyeRef} castShadow>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0} />
        </mesh>
        <mesh castShadow>
          <sphereGeometry args={[0.045, 32, 32]} />
          <meshStandardMaterial color={eyeColor} roughness={0.3} metalness={0} />
        </mesh>
        <mesh position={[0, 0, 0.055]} castShadow>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#000000" roughness={0} metalness={0} />
        </mesh>
      </group>

      {/* Right Eye Group */}
      <group position={[0.18, 0.05, 0.48]}>
        <mesh ref={rightEyeRef} castShadow>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0} />
        </mesh>
        <mesh castShadow>
          <sphereGeometry args={[0.045, 32, 32]} />
          <meshStandardMaterial color={eyeColor} roughness={0.3} metalness={0} />
        </mesh>
        <mesh position={[0, 0, 0.055]} castShadow>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#000000" roughness={0} metalness={0} />
        </mesh>
      </group>

      {/* Hair */}
      <mesh position={[0, 0.35, 0]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.58, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color={hairColor} roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Active indicator ring */}
      {isActive && (
        <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.85, 32]} />
          <meshBasicMaterial 
            color="#d9a05b" 
            side={THREE.DoubleSide} 
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}

export default function CharacterAvatar3D({ 
  character, 
  className = '',
  size = 64,
  interactive = true,
  fallback,
  isActive = false,
  isSpeaking = false
}: CharacterAvatar3DProps & { isActive?: boolean; isSpeaking?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(false);
  const [webGLError, setWebGLError] = useState<Error | null>(null);
  
  useEffect(() => {
    setMounted(true);
    
    // Check WebGL availability
    if (typeof window !== 'undefined') {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setHasWebGL(!!gl);
      } catch (e) {
        setHasWebGL(false);
      }
    }
  }, []);

  // Fallback for SSR and non-WebGL environments
  if (!mounted || !hasWebGL || webGLError) {
    return fallback || (
      <div 
        className={`${className} relative flex items-center justify-center rounded-full bg-ink-2 border-2 ${isActive ? 'border-amber' : 'border-hairline'} overflow-hidden`}
        style={{
          width: size,
          height: size,
          boxShadow: isActive 
            ? '0 0 20px rgba(217, 160, 90, 0.4)' 
            : '0 2px 8px rgba(0, 0, 0, 0.2)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <span className={`text-${Math.round(size * 0.4)}px font-bold text-paper-1`}>
          {character.name[0]}
        </span>
      </div>
    );
  }

  return (
    <div 
      className={`${className} relative overflow-hidden rounded-full`}
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 35 }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          preserveDrawingBuffer: false, 
          powerPreference: 'high-performance' 
        }}
        style={{ width: '100%', height: '100%', display: 'block', borderRadius: '50%' }}
        onCreated={({ gl }) => { 
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
          gl.setClearColor(0x000000, 0); 
        }}
      >
        <Suspense fallback={null}>
          <Avatar3DInner 
            character={character} 
            size={size}
            interactive={interactive}
            isActive={isActive}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}