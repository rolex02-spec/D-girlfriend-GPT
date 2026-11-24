'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Volume2, VolumeX, ChevronLeft, X, Sparkles, Settings, MoreHorizontal, ChevronDown, Expand } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CharacterSelectModal from '@/components/character/CharacterSelectModal';
import CharacterCustomize from '@/components/character/CharacterCustomize';
import { useChatStore } from '@/store/chatStore';
import Link from 'next/link';
import { textToSpeech, browserTTS } from '@/lib/voice/tts';
import { nsfwStarters, sexualActs } from '@/lib/nsfw/database';
import ProfileImageViewer from '@/components/ui/ProfileImageViewer';

// ============================================================
// THREE.JS AVATAR COMPONENT
// ============================================================

interface AvatarSceneProps {
  character: {
    appearance: { skinColor?: string; eyeColor?: string; hairColor?: string };
    name: string;
  };
  isActive: boolean;
  isSpeaking: boolean;
  emotionState: { affection: number; trust: number; arousal: number };
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
}

function AvatarScene({ character, isActive, isSpeaking, emotionState, timeOfDay }: AvatarSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const blinkRef = useRef(0);
  const breatheRef = useRef(0);
  const swayRef = useRef(0);

  const skinColor = character.appearance.skinColor || '#FFE4C4';
  const eyeColor = character.appearance.eyeColor || '#4A2810';
  const hairColor = character.appearance.hairColor || '#1A1A2E';

  const tod = timeOfDay || 'night';
  const lightingConfig: Record<string, { ambient: number; dir: number[]; color: string; intensity: number }> = {
    morning: { ambient: 0.6, dir: [1, -1, 0.5], color: '#fff8e7', intensity: 1.2 },
    day: { ambient: 0.8, dir: [0.5, -1, 0.2], color: '#ffffff', intensity: 1.5 },
    evening: { ambient: 0.4, dir: [-0.5, -0.5, 0.5], color: '#ffd4a3', intensity: 1.0 },
    night: { ambient: 0.15, dir: [-0.3, -0.7, 0.3], color: '#ffe4cc', intensity: 0.7 },
  };
  const lightConfig = lightingConfig[tod];

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    breatheRef.current += delta * 0.8;
    const breathe = Math.sin(breatheRef.current) * 0.015;
    if (groupRef.current) {
      groupRef.current.position.y = breathe;
      groupRef.current.scale.setScalar(1 + breathe * 0.5);
    }

    swayRef.current += delta * 0.3;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(swayRef.current) * 0.02;
      groupRef.current.rotation.x = Math.cos(swayRef.current * 0.7) * 0.01;
    }

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
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={lightConfig.ambient} color={lightConfig.color} />
      <directionalLight position={[lightConfig.dir[0], lightConfig.dir[1], lightConfig.dir[2]]} intensity={lightConfig.intensity} color={lightConfig.color} castShadow />
      <pointLight position={[0, 1, 2]} intensity={0.3} color="#ffccaa" />

      <mesh ref={headRef} castShadow receiveShadow>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshStandardMaterial color={skinColor} roughness={0.45} metalness={0.02} />
      </mesh>

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

      <mesh position={[0, 0.35, 0]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.58, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color={hairColor} roughness={0.6} metalness={0.05} />
      </mesh>
    </group>
  );
}

// ============================================================
// PARTICLE FIELD
// ============================================================

function ParticleField({ count = 60, timeOfDay }: { count?: number; timeOfDay: string }) {
  const particles = useRef<Array<{ x: number; y: number; z: number; size: number; speed: number; opacity: number; hue: number }>>([]);

  if (particles.current.length === 0) {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        z: (Math.random() - 0.5) * 200,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() * 40 + 20,
      });
    }
  }

  const todColors: Record<string, string> = {
    morning: '45, 100%, 70%',
    day: '45, 80%, 75%',
    evening: '30, 90%, 65%',
    night: '35, 85%, 55%',
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 50%, hsl(${todColors[timeOfDay] || todColors.night} / 0.03) 0%, transparent 60%)` }}>
      {particles.current.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y}px)`,
            width: p.size,
            height: p.size,
            background: `hsl(${p.hue}, 85%, 55% / ${p.opacity})`,
            filter: 'blur(0.5px)',
          }}
          animate={{
            x: [`calc(50% + ${p.x}px)`, `calc(50% + ${p.x + Math.sin(Date.now() / 3000 + i) * 30}px)`],
            y: [`calc(50% + ${p.y}px)`, `calc(50% + ${p.y + Math.cos(Date.now() / 4000 + i) * 20}px)`],
            opacity: [p.opacity, p.opacity * 0.3, p.opacity],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 8 + Math.random() * 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ============================================================
// EMOTION RING
// ============================================================

interface StateRingProps {
  emotionState: { affection: number; trust: number; arousal: number };
  size?: number;
}

function StateRing({ emotionState, size = 160 }: StateRingProps) {
  const { affection = 50, trust = 50, arousal = 0 } = emotionState || {};

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.svg
        className="absolute inset-0"
        style={{ transform: 'rotate(-90deg)' }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 6}
          fill="none"
          stroke="var(--color-amber)"
          strokeWidth={3}
          strokeDasharray={`${(affection / 100) * (Math.PI * (size - 12))} ${Math.PI * (size - 12)}`}
          strokeLinecap="round"
          filter="drop-shadow(0 0 6px var(--color-amber))"
          opacity={affection > 0 ? 1 : 0.2}
        />
      </motion.svg>
      <motion.svg
        className="absolute inset-0"
        style={{ transform: 'rotate(-90deg)' }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 14}
          fill="none"
          stroke="#64b5f6"
          strokeWidth={2.5}
          strokeDasharray={`${(trust / 100) * (Math.PI * (size - 28))} ${Math.PI * (size - 28)}`}
          strokeLinecap="round"
          filter="drop-shadow(0 0 6px #64b5f6)"
          opacity={trust > 0 ? 1 : 0.2}
        />
      </motion.svg>
      <motion.svg
        className="absolute inset-0"
        style={{ transform: 'rotate(-90deg)' }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 22}
          fill="none"
          stroke="#f48fb1"
          strokeWidth={2}
          strokeDasharray={`${(arousal / 100) * (Math.PI * (size - 44))} ${Math.PI * (size - 44)}`}
          strokeLinecap="round"
          filter="drop-shadow(0 0 6px #f48fb1)"
          opacity={arousal > 0 ? 1 : 0.15}
        />
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="rounded-full"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            background: 'radial-gradient(circle, var(--color-amber/20) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

// ============================================================
// MESSAGE BUBBLE
// ============================================================

function MessageBubble({ message, character, isStreaming }: { message: { id: string; role: 'user' | 'assistant'; content: string; emotion?: string; timestamp: Date }; character: { name: string } | null; isStreaming: boolean }) {
  const isUser = message.role === 'user';
  const sealInitial = character?.name[0] || '?';

  return (
    <motion.div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`} initial={{ opacity: 0, y: 20, x: isUser ? 30 : -30 }} animate={{ opacity: 1, y: 0, x: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      {!isUser && (
        <motion.div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-display text-seal-text text-xl"
          style={{ background: 'var(--color-seal)', boxShadow: 'inset 0 1.5px 1px rgba(255,255,255,0.22), inset 0 -2px 4px rgba(0,0,0,0.4)' }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {sealInitial}
        </motion.div>
      )}
      <motion.div className={`max-w-[75%] ${isUser ? 'text-right' : ''}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.25 }}>
        <div
          className={`relative px-4 py-3 rounded-2xl ${isUser ? 'bg-amber/15 text-paper-1 rounded-tr-tight border border-amber/20' : 'bg-ink-2 text-paper-1 rounded-tl-tight border border-hairline'}`}
          style={{ boxShadow: isUser ? '0 2px 8px rgba(217,160,90,0.1), inset 0 1px 1px rgba(255,255,255,0.03)' : '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.02)' }}
        >
          {isStreaming ? <span className="font-mono text-amber animate-shimmer">▋</span> : <p className="text-body-3 leading-relaxed whitespace-pre-wrap">{message.content}</p>}
          <time className="absolute bottom-1 right-2 text-[10px] text-paper-3 font-mono">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
        </div>
        {message.emotion && !isUser && (
          <span className="mt-1.5 inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber/15 text-amber/80 border border-amber/20">
            {message.emotion}
          </span>
        )}
      </motion.div>
      {isUser && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ink-3 flex items-center justify-center"><span className="font-mono text-[10px] text-paper-3">You</span></div>}
    </motion.div>
  );
}

// ============================================================
// TYPING INDICATOR
// ============================================================

function TypingIndicator({ character }: { character: { name: string } | null }) {
  const initial = character?.name[0] || '?';
  return (
    <motion.div className="flex items-start gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-display text-seal-text text-lg" style={{ background: 'var(--color-seal)', boxShadow: 'inset 0 1.5px 1px rgba(255,255,255,0.22), inset 0 -2px 4px rgba(0,0,0,0.4)' }}>{initial}</div>
      <motion.div className="relative flex items-center gap-2 rounded-2xl border border-hairline bg-ink-2 px-4 py-3" animate={{ boxShadow: ['0 4px 12px rgba(0,0,0,0.1)', '0 6px 16px rgba(0,0,0,0.15)', '0 4px 12px rgba(0,0,0,0.1)'] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span key={i} className="typing-dot h-1.5 w-1.5 rounded-full bg-amber/80" style={{ animationDelay: `${i * 160}ms` }} animate={{ scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// QUICK ACTIONS
// ============================================================

function QuickActionsPanel({ isOpen, onClose, onAction, nsfwMode }: { isOpen: boolean; onClose: () => void; onAction: (action: string) => void; nsfwMode: boolean }) {
  if (!isOpen || !nsfwMode) return null;
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:px-6"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-title-4 text-paper-1">Quick actions</h4>
          <motion.button onClick={onClose} className="p-2 rounded-xl text-paper-3 hover:text-paper-1 hover:bg-ink-3 transition-colors btn-press" whileTap={{ scale: 0.9 }} aria-label="Close">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </motion.button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {nsfwStarters.slice(0, 6).map((starter) => (
            <motion.button
              key={starter}
              onClick={() => onAction(starter)}
              className="p-3 rounded-xl border border-hairline bg-ink-2 text-left text-body-6 text-paper-2 hover:border-amber/40 hover:text-paper-1 hover:bg-ink-3 transition-all btn-press"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {starter}
            </motion.button>
          ))}
          {Object.values(sexualActs).slice(0, 6).map((act) => (
            <motion.button
              key={act.name}
              onClick={() => onAction(`I want you to ${act.name.toLowerCase()}...`)}
              className="p-3 rounded-xl border border-hairline bg-ink-2 text-left text-body-6 text-paper-2 hover:border-rose/40 hover:text-paper-1 hover:bg-ink-3 transition-all btn-press"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {act.name}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// UNIFIED INPUT BAR
// ============================================================

function UnifiedInputBar({ character, onSend, onVoiceToggle, onVoiceRecord, isRecording, isTyping, isSending, voiceEnabled, disabled }: {
  character: { name: string } | null;
  onSend: (message: string) => void;
  onVoiceToggle: () => void;
  onVoiceRecord: (recording: boolean) => void;
  isRecording: boolean;
  isTyping: boolean;
  isSending: boolean;
  voiceEnabled: boolean;
  disabled: boolean;
}) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping && !isSending) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="relative flex items-end gap-3 rounded-2xl border border-hairline bg-ink-2 transition-all duration-200 focus-within:border-amber/50">
          <button
            type="button"
            onMouseDown={() => !isRecording && onVoiceRecord(true)}
            onMouseUp={() => isRecording && onVoiceRecord(false)}
            className={`flex-shrink-0 p-3 rounded-xl transition-all ${isRecording ? 'bg-rose/20 text-rose scale-105 ring-2 ring-rose/40' : 'text-paper-3 hover:text-paper-1 hover:bg-ink-3'}`}
            aria-label={isRecording ? 'Release to send voice' : 'Hold for voice'}
            disabled={isTyping || isSending}
          >
            <Mic className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${character?.name || 'Companion'}...`}
            className="flex-1 min-h-[48px] max-h-32 px-4 py-3 bg-transparent text-body-2 text-paper-1 placeholder:text-paper-3 resize-none focus:outline-none"
            disabled={isTyping || isSending || isRecording}
            rows={1}
            style={{ lineHeight: '1.5' }}
          />

          <button type="button" onClick={onVoiceToggle} className={`flex-shrink-0 p-3 rounded-xl transition-all ${voiceEnabled ? 'bg-amber/15 text-amber' : 'text-paper-3 hover:text-paper-1 hover:bg-ink-3'}`} aria-label={voiceEnabled ? 'Voice replies on' : 'Voice replies off'}>
            {voiceEnabled ? <Volume2 className="h-5 w-5" strokeWidth={1.5} /> : <VolumeX className="h-5 w-5" strokeWidth={1.5} />}
          </button>

          <motion.button
            type="submit"
            disabled={isTyping || isSending || !input.trim() || isRecording}
            className="flex-shrink-0 p-3 rounded-xl bg-amber text-ink-1 transition-all hover:bg-[#e3af72] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed btn-press"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" strokeWidth={2} />
          </motion.button>
        </div>

        <AnimatePresence>
          {isRecording && (
            <motion.div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 rounded-xl bg-rose/90 text-rose-text text-sm font-medium flex items-center gap-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <motion.span className="h-2 w-2 rounded-full bg-current animate-pulse-soft" />
              Recording... release to send
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({ character, characterImageUrl, isImageError, onImageClick }: { character: { name: string; greeting: string; backstory: string } | null; characterImageUrl: string | null; isImageError: boolean; onImageClick?: () => void }) {
  return (
    <motion.div className="flex flex-1 items-center justify-center p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <motion.div className="max-w-md text-center stagger-enter">
        {characterImageUrl && !isImageError ? (
          <motion.button
            onClick={onImageClick}
            className="mx-auto mb-6 h-32 w-32 rounded-full border-2 border-hairline overflow-hidden transition-all duration-200 hover:border-amber/50 hover:shadow-[0_0_24px_rgba(217,160,91,0.3)]"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            aria-label={`View ${character?.name}'s profile photo`}
          >
            <img src={characterImageUrl} alt={`Portrait of ${character?.name}`} className="h-full w-full object-cover" />
          </motion.button>
        ) : (
          <motion.button
            onClick={onImageClick}
            className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-seal text-seal-text text-4xl font-bold"
            whileTap={{ scale: 0.98 }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            aria-label={`View ${character?.name}'s profile`}
          >
            {character?.name[0] || '?'}
          </motion.button>
        )}
        <motion.h3 className="font-display text-h3 text-paper-1">{character?.name || 'Choose a Companion'}</motion.h3>
        <motion.div className="rule-ornament mx-auto mt-4 justify-center text-title-5 text-amber/75"><span>◆</span></motion.div>
        <motion.p className="font-display mt-5 text-title-2 leading-snug text-paper-2">{character?.greeting || 'Click to choose your companion...'}</motion.p>
        <motion.p className="mt-4 text-body-5 leading-relaxed text-paper-3">{character?.backstory || ''}</motion.p>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function Room() {
  const {
    selectedCharacter,
    messages,
    addMessage,
    isTyping,
    setIsTyping,
    nsfwMode,
    voiceEnabled,
    selectedProvider,
    selectedModel,
    emotionState,
    setEmotionState,
    clearMessages,
    showCustomize,
    setShowCustomize,
    showCharacterSelect,
    setShowCharacterSelect,
    characterImageUrl,
    isGeneratingImage,
  } = useChatStore();

  // Human-readable label for the companion's native tongue, shown in the header
  // badge so the user always knows which language she answers in by default.
  const LANGUAGE_LABELS: Record<string, string> = {
    en: 'English', ja: '日本語', ko: '한국어', th: 'ไทย', tl: 'Filipino', id: 'Bahasa',
    vi: 'Tiếng Việt', zh: '中文', 'zh-TW': '中文', 'zh-HK': '粵語', ru: 'Русский',
    pt: 'Português', es: 'Español', de: 'Deutsch', fr: 'Français', ar: 'العربية',
    tr: 'Türkçe', hi: 'हिन्दी', ur: 'اردو', si: 'සිංහල', bn: 'বাংলা', ne: 'नेपाली',
    my: 'မြန်မာ', km: 'ខ្មែរ', lo: 'ລາວ', ms: 'Bahasa Melayu', mn: 'Монгол',
    kk: 'Қазақша', fa: 'فارسی', el: 'Ελληνικά', it: 'Italiano', am: 'አማርኛ',
    sw: 'Kiswahili', ta: 'தமிழ்', te: 'తెలుగు', ml: 'മലയാളം', kn: 'ಕನ್ನಡ',
    mr: 'मराठी', tanglish: 'Tanglish', hinglish: 'Hinglish',
  };
  
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [isSending, setIsSending] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening' | 'night'>('night');
  const [hasWebGL, setHasWebGL] = useState(false);
  const [showProfileViewer, setShowProfileViewer] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      if (h >= 6 && h < 10) setTimeOfDay('morning');
      else if (h >= 10 && h < 17) setTimeOfDay('day');
      else if (h >= 17 && h < 22) setTimeOfDay('evening');
      else setTimeOfDay('night');
    };
    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      setHasWebGL(!!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Sync characterImageUrl from selectedCharacter on mount or when selectedCharacter changes
  useEffect(() => {
    if (selectedCharacter?.imageUrl && !characterImageUrl) {
      // If we have a selectedCharacter with an imageUrl but characterImageUrl is null, sync it
      useChatStore.setState({ characterImageUrl: selectedCharacter.imageUrl });
    }
  }, [selectedCharacter, characterImageUrl]);

  // Reset image error state when character changes so a previous failed image doesn't block the new one
  useEffect(() => {
    setIsImageError(false);
  }, [selectedCharacter?.id]);

  const handleSend = useCallback(async (customMessage?: string) => {
    const msg = (customMessage ?? '').trim();
    if (!msg || !selectedCharacter) return;

    setIsSending(true);
    addMessage({ id: Date.now() + '', role: 'user', content: msg, timestamp: new Date() });
    setIsTyping(true);
    setConnectionStatus('connecting');

    try {
      const chatMsgs = messages.map((m) => ({ role: m.role, content: m.content }));
      chatMsgs.push({ role: 'user', content: msg });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMsgs,
          characterId: selectedCharacter.id,
          userId: 'default',
          nsfwMode,
          provider: selectedProvider || 'openrouter',
          modelId: selectedModel,
          emotionState,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const { content, emotion } = data;
      if (!content) throw new Error('Empty response');
      setConnectionStatus('success');
      setTimeout(() => setConnectionStatus('idle'), 2000);
      addMessage({ id: Date.now() + '-ai', role: 'assistant', content, emotion, timestamp: new Date() });
      setEmotionState(data.emotionState);
      if (voiceEnabled && content) {
        try {
          const audio = await textToSpeech(content, selectedCharacter.voice);
          if (audio) {
            new Audio(URL.createObjectURL(new Blob([audio], { type: 'audio/mp3' }))).play();
          } else {
            browserTTS(content, selectedCharacter.voice);
          }
        } catch {
          browserTTS(content, selectedCharacter.voice);
        }
      }
    } catch (error) {
      setConnectionStatus('error');
      const em = error instanceof Error ? error.message : 'Unknown error';
      addMessage({ id: Date.now() + '-error', role: 'assistant', content: `I lost the connection for a moment — give me one more try? (Error: ${em})`, emotion: 'confused', timestamp: new Date() });
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  }, [selectedCharacter, messages, nsfwMode, selectedProvider, selectedModel, emotionState, voiceEnabled, addMessage, setIsTyping, setConnectionStatus, setEmotionState, setIsSending]);

  const handleVoiceRecord = useCallback((recording: boolean) => {
    setIsRecording(recording);
  }, []);

  const stats = [
    `Affection ${emotionState.affection}%`,
    `Trust ${emotionState.trust}%`,
    ...(nsfwMode ? [`Arousal ${emotionState.arousal}%`] : []),
  ].join('  ·  ');

  // Show character select modal if no character is selected
  if (!selectedCharacter) {
    return (
      <div className="flex h-screen w-screen bg-ink-1 text-paper-1 overflow-hidden relative">
        <motion.div className="absolute inset-0 -z-20" style={{ background: 'var(--color-ink-1)' }} />
        <ParticleField count={40} timeOfDay={timeOfDay} />
        <div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(18,16,15,0.6) 100%)' }} />
        
        {/* 3D Avatar placeholder for character select */}
        {hasWebGL && (
          <div className="fixed left-6 top-1/2 -translate-y-1/2 z-10 w-72 h-72 md:w-96 md:h-96 lg:w-[380px] lg:h-[380px] pointer-events-none">
            <Canvas camera={{ position: [0, 0, 2.2], fov: 35 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false, powerPreference: 'high-performance' }} style={{ width: '100%', height: '100%', display: 'block', borderRadius: '50%' }} onCreated={({ gl }) => { gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); gl.setClearColor(0x000000, 0); }}>
              <group>
                <ambientLight intensity={0.4} color="#ffe4cc" />
                <directionalLight position={[-0.3, -0.7, 0.3]} intensity={0.7} color="#ffe4cc" />
                <mesh>
                  <sphereGeometry args={[0.55, 64, 64]} />
                  <meshStandardMaterial color="#2e2825" roughness={0.45} />
                </mesh>
              </group>
            </Canvas>
          </div>
        )}
        
        {!hasWebGL && (
          <div className="fixed left-6 top-1/2 -translate-y-1/2 z-10 w-72 h-72 md:w-96 md:h-96 lg:w-[380px] lg:h-[380px] pointer-events-none">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-seal text-seal-text text-6xl font-bold">?</div>
          </div>
        )}
        
        {/* Character Selection Content */}
        <div className="flex h-full w-full flex-col items-center justify-center p-6">
          <motion.div className="text-center max-w-md stagger-enter">
            <motion.div className="mb-6 inline-block rounded-2xl bg-ink-2 px-6 py-3 border border-hairline" animate={{ boxShadow: ['0 4px 12px rgba(0,0,0,0.1)', '0 8px 24px rgba(0,0,0,0.15)', '0 4px 12px rgba(0,0,0,0.1)'] }} transition={{ duration: 2, repeat: Infinity }}>
              <span className="font-display text-h4 text-paper-1 mb-2 block">GirlfriendGPT</span>
              <p className="text-body-5 text-paper-3">Private companions for the hours after midnight</p>
            </motion.div>
            <motion.button
              onClick={() => setShowCharacterSelect(true)}
              className="mx-auto mt-8 h-14 px-8 rounded-2xl bg-amber text-ink-1 font-semibold text-lg transition-all hover:bg-[#e3af72] active:scale-95 btn-press"
              whileTap={{ scale: 0.95 }}
            >
              Choose Companion
            </motion.button>
          </motion.div>
        </div>
        
        <AnimatePresence>{showCharacterSelect && <CharacterSelectModal />}</AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div className="flex h-screen w-screen bg-ink-1 text-paper-1 overflow-hidden relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--color-ink-1)' }}>
      {/* Background layers */}
      <div className="absolute inset-0 -z-20" style={{ background: 'var(--color-ink-1)' }} />
      <ParticleField count={60} timeOfDay={timeOfDay} />
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(18,16,15,0.6) 100%)' }} />
      
      {/* Avatar in fixed sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[380px] max-w-full md:w-[420px] flex flex-col items-center justify-center p-6 md:p-10 min-h-[400px] z-10 pointer-events-none" style={{ background: 'linear-gradient(180deg, var(--color-ink-1) 0%, var(--color-ink-0) 100%)' }}>
        <StateRing emotionState={emotionState} size={280} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {hasWebGL ? (
            <div className="relative w-full h-[380px] max-h-[60vh] mx-auto">
              <Canvas camera={{ position: [0, 0, 2.2], fov: 35 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false, powerPreference: 'high-performance' }} style={{ width: '100%', height: '100%', display: 'block', borderRadius: '50%' }} onCreated={({ gl }) => { gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); gl.setClearColor(0x000000, 0); }}>
                <AvatarScene character={selectedCharacter as any} isActive={true} isSpeaking={isTyping} emotionState={emotionState} timeOfDay={timeOfDay} />
              </Canvas>
            </div>
          ) : (
            <div className="relative w-full h-[380px] max-h-[60vh] mx-auto">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-seal text-seal-text text-6xl font-bold">
                {selectedCharacter.name[0]}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex h-full w-full flex-col md:flex-row ml-[380px] md:ml-0">
        {/* Left sidebar - Info */}
        <aside className="relative flex-shrink-0 w-full md:w-[380px] lg:w-[420px] flex flex-col items-center justify-center p-6 md:p-10 min-h-[400px]">
          <div className="text-center w-full max-w-xs stagger-enter">
            <p className="font-display-sm text-[13px] tracking-[0.2em] text-amber mb-2">
              {selectedCharacter.country} · {selectedCharacter.age} · {selectedCharacter.nationality}
            </p>
            <h2 className="font-display text-h4 text-paper-1 mb-1">{selectedCharacter.name}</h2>
            <p className="text-body-5 text-paper-3 mb-6">{stats}</p>
            
            <motion.div
              className="flex items-center justify-center gap-2 text-caption-1"
              role="status"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.span className="h-2 w-2 rounded-full" style={{ background: connectionStatus === 'connecting' ? 'var(--color-warn)' : connectionStatus === 'success' ? 'var(--color-ok)' : 'var(--color-err)' }} animate={connectionStatus === 'connecting' ? { scale: [1, 1.3, 1] } : connectionStatus === 'success' ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: connectionStatus === 'connecting' ? 1 : 0.3 }} />
              {connectionStatus === 'connecting' && 'Connecting…'}
              {connectionStatus === 'success' && 'Connected'}
              {connectionStatus === 'error' && 'Failed'}
            </motion.div>

            {nsfwMode && (
              <motion.button onClick={() => setShowQuickActions(true)} className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl border border-hairline bg-ink-2 px-4 py-3 text-body-5 text-paper-2 hover:border-amber/40 hover:text-paper-1 hover:bg-ink-3 transition-all btn-press" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                Quick actions
                <ChevronDown className="h-4 w-4 text-paper-3" strokeWidth={1.5} />
              </motion.button>
            )}
            <motion.button onClick={() => setShowCustomize(true)} className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-hairline bg-ink-2 px-4 py-3 text-body-5 text-paper-3 hover:border-hairline-strong hover:text-paper-2 hover:bg-ink-3 transition-all btn-press" whileTap={{ scale: 0.99 }}>
              <Settings className="h-4 w-4" strokeWidth={1.5} />
              Customize
            </motion.button>
          </div>
        </aside>

        {/* Main conversation area */}
        <main className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-hairline bg-ink-0/80 backdrop-blur-sm px-4 md:px-6 z-20">
            <div className="flex items-center gap-3">
              {/* Back to the landing page — a way back from every page (ship requirement) */}
              <Link
                href="/"
                className="hidden lg:flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-ink-2 text-paper-3 transition-colors btn-press hover:text-paper-1 hover:bg-ink-3"
                aria-label="Back to home"
                title="Back to home"
              >
                <span className="font-display text-[15px]">G</span>
              </Link>
              <motion.button onClick={() => setShowCharacterSelect(true)} className="p-2 rounded-xl text-paper-3 hover:text-paper-1 hover:bg-ink-3 transition-colors btn-press lg:hidden" whileTap={{ scale: 0.9 }} aria-label="Choose companion">
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
              </motion.button>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => setShowProfileViewer(true)}
                  className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border-2 border-hairline transition-all duration-200 hover:border-amber/50 hover:shadow-[0_0_16px_rgba(217,160,91,0.4)]"
                  whileTap={{ scale: 0.95 }}
                  aria-label={`View ${selectedCharacter.name}'s profile photo`}
                  title="Click to view full profile photo"
                >
                  {characterImageUrl && !isImageError ? (
                    <img src={characterImageUrl} alt={selectedCharacter.name} className="h-full w-full object-cover" onError={() => setIsImageError(true)} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-seal text-seal-text text-xl font-bold">{selectedCharacter.name[0]}</div>
                  )}
                  <motion.div
                    className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-amber flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Expand className="h-3 w-3 text-ink-1" strokeWidth={2.5} />
                  </motion.div>
                </motion.button>
                <div className="min-w-0 hidden sm:block">
                  <h1 className="font-display text-h6 text-paper-1 truncate">{selectedCharacter.name}</h1>
                  <p className="text-caption-3 text-paper-3 truncate">{stats}</p>
                </div>
                {/* Language badge — she replies in this language (and mirrors yours) */}
                <span
                  className="hidden md:inline-flex h-7 items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-2.5 text-[11px] font-medium text-amber"
                  title={`Replies in ${LANGUAGE_LABELS[selectedCharacter.language] || selectedCharacter.language}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse-soft" aria-hidden="true" />
                  {LANGUAGE_LABELS[selectedCharacter.language] || selectedCharacter.language}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedModel}
                onChange={(e) => useChatStore.getState().setSelectedModel(e.target.value)}
                className="h-9 rounded-xl border border-hairline bg-ink-2 px-3 text-sm text-paper-1 focus:border-amber/50 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 8B (NSFW)</option>
                <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B (NSFW)</option>
                <option value="openai/gpt-4o-mini">GPT-4o Mini (SFW)</option>
                <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo (SFW)</option>
                <option value="anthropic/claude-3-haiku">Claude 3 Haiku (SFW)</option>
              </select>
              {/* 18+ switch — always visible in the top bar. ON lets her answer
                  explicit questions in a natural, in-character way (backend flag). */}
              <motion.button
                onClick={() => useChatStore.getState().toggleNsfwMode()}
                role="switch"
                aria-checked={nsfwMode}
                aria-label="18+ mode"
                className={`relative h-9 rounded-full border px-3 text-sm font-semibold transition-all btn-press ${
                  nsfwMode
                    ? 'border-ember/60 bg-ember/25 text-ember shadow-[0_0_16px_rgba(196,104,90,0.35)]'
                    : 'border-hairline bg-ink-2 text-paper-2 hover:text-paper-1'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${nsfwMode ? 'bg-ember animate-pulse-soft' : 'bg-paper-3'}`} aria-hidden="true" />
                  18+ {nsfwMode ? 'on' : 'off'}
                </span>
              </motion.button>
              {/* Appearance studio — body / eyes / hair / skin → generates her portrait */}
              <motion.button
                onClick={() => useChatStore.getState().setShowCustomize(true)}
                className="h-9 w-9 rounded-xl border border-hairline bg-ink-2 text-paper-2 hover:text-paper-1 hover:bg-ink-3 transition-all btn-press"
                whileTap={{ scale: 0.9 }}
                aria-label="Open appearance studio"
                title="Appearance studio"
              >
                <Sparkles className="h-5 w-5" strokeWidth={1.5} />
              </motion.button>
              <motion.button onClick={() => useChatStore.getState().toggleVoice()} className={`h-9 w-9 rounded-xl border border-hairline transition-all btn-press ${voiceEnabled ? 'bg-amber/15 text-amber border-amber/30' : 'bg-ink-2 text-paper-2 hover:text-paper-1'}`} whileTap={{ scale: 0.9 }} aria-label={voiceEnabled ? 'Voice on' : 'Voice off'}>
                {voiceEnabled ? <Volume2 className="h-5 w-5" strokeWidth={1.5} /> : <VolumeX className="h-5 w-5" strokeWidth={1.5} />}
              </motion.button>
              <motion.button onClick={clearMessages} className="h-9 w-9 rounded-xl border border-hairline bg-ink-2 text-paper-2 hover:text-paper-1 hover:bg-ink-3 transition-all btn-press" whileHover={{ scale: 1.05, rotate: -3 }} whileTap={{ scale: 0.9 }} aria-label="Clear conversation">
                <MoreHorizontal className="h-5 w-5" strokeWidth={1.5} />
              </motion.button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
            <div className="mx-auto flex h-full w-full max-w-3xl flex-col space-y-5">
              {messages.length === 0 && <EmptyState character={selectedCharacter as any} characterImageUrl={characterImageUrl} isImageError={isImageError} onImageClick={() => setShowProfileViewer(true)} />}
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: String(msg.id).includes('ai') ? 0.1 : 0, duration: 0.3 }}>
                    <MessageBubble message={msg} character={selectedCharacter} isStreaming={String(msg.id).includes('ai') && isTyping && idx === messages.length - 1} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && <TypingIndicator character={selectedCharacter} />}
              {isSending && !isTyping && (
                <motion.div className="flex items-center gap-3 text-paper-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <svg className="h-5 w-5 animate-spin text-amber/70" strokeWidth={1.5} viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                    </svg>
                  </motion.div>
                  <span className="text-caption-1">Sending…</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input bar */}
          <UnifiedInputBar character={selectedCharacter} onSend={handleSend} onVoiceToggle={() => useChatStore.getState().toggleVoice()} onVoiceRecord={handleVoiceRecord} isRecording={isRecording} isTyping={isTyping} isSending={isSending} voiceEnabled={voiceEnabled} disabled={isTyping || isSending} />
        </main>
      </div>

      <QuickActionsPanel isOpen={showQuickActions} onClose={() => setShowQuickActions(false)} onAction={handleSend as any} nsfwMode={nsfwMode} />
      {/* Appearance studio: body / eyes / hair → generates her portrait (was never mounted here) */}
      <AnimatePresence>{showCustomize && <CharacterCustomize isOpen={showCustomize} onClose={() => setShowCustomize(false)} />}</AnimatePresence>
      <AnimatePresence>{showCharacterSelect && <CharacterSelectModal />}</AnimatePresence>
      {/* Profile Image Viewer — WhatsApp-style full-screen viewer with zoom/pan */}
      <ProfileImageViewer
        isOpen={showProfileViewer}
        onClose={() => setShowProfileViewer(false)}
        imageUrl={characterImageUrl}
        characterName={selectedCharacter?.name || 'Companion'}
        fallbackInitial={selectedCharacter?.name[0] || '?'}
      />
    </motion.div>
  );
}