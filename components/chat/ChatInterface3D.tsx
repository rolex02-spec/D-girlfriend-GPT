'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { textToSpeech, browserTTS } from '@/lib/voice/tts';
import { nsfwStarters, sexualActs } from '@/lib/nsfw/database';
import {
  ChevronLeft,
  ChevronDown,
  Trash2,
  Volume2,
  VolumeX,
  SendHorizontal,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import MessageBubble from './MessageBubble';
import CharacterSidebar from './CharacterSidebar';
import ModelSelector from '../ui/ModelSelector';
import CharacterCustomize from '../character/CharacterCustomize';

function WaxSeal3D({ initial, size = 28, className = '' }: { initial: string; size?: number; className?: string }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`flex items-center justify-center rounded-full bg-seal leading-none text-seal-text shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.22),inset_0_-2px_4px_rgba(0,0,0,0.4)] ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
        fontFamily: 'var(--font-display), Georgia, serif',
        color: 'var(--seal-text)',
      }}
      animate={{ 
        rotate: [0, 360],
        scale: [1, 1.1, 1],
      }}
      transition={{ 
        duration: 20,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      {initial}
    </motion.div>
  );
}

function TypingIndicator3D({ initial }: { initial: string }) {
  return (
    <motion.div 
      className="flex items-center gap-3" 
      aria-label={initial + ' is typing'}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <WaxSeal3D initial={initial} size={28} />
      <motion.div 
        className="rounded-2xl border border-hairline bg-ink-2 px-4 py-3"
        animate={{ 
          boxShadow: [
            '0 4px 12px rgba(0,0,0,0.1)',
            '0 6px 16px rgba(0,0,0,0.15)',
            '0 4px 12px rgba(0,0,0,0.1)',
          ]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="typing-dot h-1.5 w-1.5 rounded-full bg-amber/80"
              style={{ animationDelay: i * 160 + 'ms' }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{ 
                duration: 1.4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function EmptyState3D({ 
  character, 
  characterImageUrl,
  isImageError 
}: { 
  character: any; 
  characterImageUrl: string | null;
  isImageError: boolean;
}) {
  return (
    <motion.div 
      className="flex flex-1 items-center justify-center animate-fade-rise"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div className="max-w-md text-center stagger-enter">
        {characterImageUrl && !isImageError ? (
          <motion.div 
            className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-hairline"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <img
              src={characterImageUrl}
              alt={'Portrait of ' + character.name}
              className="h-full w-full object-cover transition-transform duration-300"
              onError={() => {}}
            />
          </motion.div>
        ) : (
          <motion.div 
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-seal text-seal-text text-3xl font-bold"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            {character.name[0]}
          </motion.div>
        )}
        <motion.h3 
          className="font-display mt-6 text-[44px] leading-none text-paper-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {character.name}
        </motion.h3>
        <motion.div 
          aria-hidden="true" 
          className="rule-ornament mx-auto mt-4 justify-center text-[11px] text-amber/75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span>◆</span>
        </motion.div>
        <motion.p 
          className="font-display mt-5 text-[19px] leading-snug text-paper-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {character.greeting}
        </motion.p>
        <motion.p 
          className="mt-3 text-[13px] leading-relaxed text-paper-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {character.backstory}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default function ChatInterface3D() {
  const [input, setInput] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'idle' | 'connecting' | 'success' | 'error'
  >('idle');
  const [isSending, setIsSending] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    setShowCharacterSelect,
    showCustomize,
    setShowCustomize,
    characterImageUrl,
    isGeneratingImage,
  } = useChatStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (customMessage?: string) => {
    const messageToSend = (customMessage ?? input).trim();
    if (!messageToSend || !selectedCharacter) return;

    setIsSending(true);
    addMessage({
      id: Date.now() + '',
      role: 'user',
      content: messageToSend,
      timestamp: new Date(),
    });
    setInput('');
    setIsTyping(true);
    setConnectionStatus('connecting');

    try {
      const chatMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      chatMessages.push({ role: 'user', content: messageToSend });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages,
          characterId: selectedCharacter?.id,
          userId: 'default',
          nsfwMode,
          provider: selectedProvider,
          modelId: selectedModel,
          emotionState,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      if (!data.content) {
        throw new Error('Empty response from AI');
      }

      setConnectionStatus('success');
      window.setTimeout(() => setConnectionStatus('idle'), 2000);

      addMessage({
        id: Date.now() + '-ai',
        role: 'assistant',
        content: data.content,
        emotion: data.emotion,
        timestamp: new Date(),
      });
      setEmotionState(data.emotionState);

      if (voiceEnabled && data.content) {
        try {
          const audio = await textToSpeech(data.content, selectedCharacter.voice);
          if (audio) {
            const audioUrl = URL.createObjectURL(
              new Blob([audio], { type: 'audio/mp3' })
            );
            new Audio(audioUrl).play();
          } else {
            browserTTS(data.content, selectedCharacter.voice);
          }
        } catch {
          browserTTS(data.content, selectedCharacter.voice);
        }
      }
    } catch (error) {
      setConnectionStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addMessage({
        id: Date.now() + '-error',
        role: 'assistant',
        content: 'I lost the connection for a moment — give me one more try? (Error: ' + errorMessage + ')',
        emotion: 'confused',
        timestamp: new Date(),
      });
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  };

  if (!selectedCharacter) return null;

  const stats = [
    'Affection ' + emotionState.affection + '%',
    'Trust ' + emotionState.trust + '%',
    ...(nsfwMode ? ['Arousal ' + emotionState.arousal + '%'] : []),
  ].join('  ·  ');

  return (
    <motion.div 
      className="flex h-screen bg-gradient-to-br from-ink-1 via-ink-0 to-ink-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {showCustomize && (
        <CharacterCustomize isOpen={showCustomize} onClose={() => setShowCustomize(false)} />
      )}

      <CharacterSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header with 3D effects */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between gap-3 border-b border-hairline bg-ink-0 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <motion.button
              onClick={() => setShowCharacterSelect(true)}
              aria-label="Choose a different companion"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] border border-hairline text-paper-2 transition-colors duration-150 hover:text-paper-1 lg:hidden btn-press"
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
            </motion.button>

            {characterImageUrl && !isImageError && !isGeneratingImage ? (
              <motion.div 
                className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-hairline"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <img
                  src={characterImageUrl}
                  alt={'Portrait of ' + selectedCharacter.name}
                  className="h-full w-full object-cover transition-transform duration-300"
                />
              </motion.div>
            ) : (
              <WaxSeal3D initial={selectedCharacter.name[0]} size={36} />
            )}

            <div className="min-w-0">
              <h2 className="font-display truncate text-[17px] leading-tight text-paper-1">
                {selectedCharacter.name}
              </h2>
              <p className="hidden truncate text-[11px] tabular-nums leading-tight text-paper-3 sm:block">
                {stats}
              </p>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Connection status */}
            {connectionStatus !== 'idle' && (
              <motion.span 
                className="hidden items-center gap-1.5 text-[11px] text-paper-3 sm:flex" 
                role="status"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <motion.span
                  aria-hidden="true"
                  className={'h-1.5 w-1.5 rounded-full ' + (connectionStatus === 'connecting' ? 'bg-warn animate-pulse-soft' : connectionStatus === 'success' ? 'bg-ok animate-glow' : 'bg-err')}
                  animate={{ 
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: connectionStatus === 'connecting' ? 1 : 0.3 
                  }}
                />
                {connectionStatus === 'connecting' && 'Connecting'}
                {connectionStatus === 'success' && 'Connected'}
                {connectionStatus === 'error' && 'Failed'}
              </motion.span>
            )}

            <ModelSelector />

            {/* 18+ toggle with 3D hover effect */}
            <motion.button
              onClick={() => useChatStore.getState().toggleNsfwMode()}
              aria-pressed={nsfwMode}
              className={'h-10 rounded-[10px] border px-3 text-[12px] font-medium transition-colors duration-150 btn-press sm:h-9 ' + (nsfwMode ? 'border-transparent bg-amber-soft text-amber' : 'border-hairline bg-ink-2 text-paper-2 hover:text-paper-1')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              18+ {nsfwMode ? 'on' : 'off'}
            </motion.button>

            {nsfwMode && (
              <motion.button
                onClick={() => setShowQuickActions((open) => !open)}
                aria-expanded={showQuickActions}
                className="flex h-10 items-center gap-1.5 rounded-[10px] border border-hairline bg-ink-2 px-3 text-[12px] font-medium text-paper-2 transition-colors duration-150 hover:text-paper-1 btn-press sm:h-9"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                Quick actions
                <motion.div
                  animate={{ rotate: showQuickActions ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown
                    aria-hidden="true"
                    className={'h-3.5 w-3.5 text-paper-3 transition-transform duration-200'}
                    strokeWidth={1.5}
                  />
                </motion.div>
              </motion.button>
            )}

            <motion.button
              onClick={() => useChatStore.getState().toggleVoice()}
              aria-pressed={voiceEnabled}
              aria-label={voiceEnabled ? 'Voice replies on' : 'Voice replies off'}
              className={'flex h-10 w-10 items-center justify-center rounded-[10px] border border-hairline transition-colors duration-150 btn-press sm:h-9 sm:w-9 ' + (voiceEnabled ? 'border-transparent bg-amber-soft text-amber' : 'bg-ink-2 text-paper-2 hover:text-paper-1')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {voiceEnabled ? (
                <Volume2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <VolumeX aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              )}
            </motion.button>

            <motion.button
              onClick={clearMessages}
              aria-label="Clear conversation"
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-hairline bg-ink-2 text-paper-2 transition-colors duration-150 hover:text-paper-1 btn-press sm:h-9 sm:w-9"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
            </motion.button>
          </div>
        </header>

        {/* Quick actions with 3D reveal */}
        <AnimatePresence>
          {showQuickActions && nsfwMode && (
            <motion.div
              className="flex-shrink-0 border-b border-hairline bg-ink-0 px-4 py-4 sm:px-6"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="mx-auto flex max-w-3xl items-center justify-between">
                <h4 className="text-[13px] font-medium text-paper-1">Quick actions</h4>
                <motion.button
                  onClick={() => setShowQuickActions(false)}
                  aria-label="Close quick actions"
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] text-paper-3 transition-colors duration-150 hover:text-paper-1"
                  whileTap={{ scale: 0.9 }}
                >
                  <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                </motion.button>
              </div>

              <div className="mx-auto mt-3 max-w-3xl">
                <p className="text-[11px] text-paper-3">Conversation starters</p>
                <motion.div className="mt-2 flex flex-wrap gap-2">
                  {nsfwStarters.slice(0, 6).map((starter, idx) => (
                    <motion.button
                      key={starter}
                      onClick={() => handleSend(starter)}
                      className="max-w-full rounded-md border border-hairline bg-ink-2 px-3 py-2 text-left text-[12px] leading-snug text-paper-2 transition-colors duration-150 hover:border-hairline-strong hover:text-paper-1 btn-press"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {starter}
                    </motion.button>
                  ))}
                </motion.div>

                <p className="mt-4 text-[11px] text-paper-3">Ask for</p>
                <motion.div className="mt-2 flex flex-wrap gap-2">
                  {Object.values(sexualActs).slice(0, 8).map((act, idx) => (
                    <motion.button
                      key={act.name}
                      onClick={() => handleSend('I want you to ' + act.name.toLowerCase() + '...')}
                      className="rounded-md border border-hairline bg-ink-2 px-3 py-2 text-[12px] leading-snug text-paper-2 transition-colors duration-150 hover:border-hairline-strong hover:text-paper-1 btn-press"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {act.name}
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages with 3D entrance */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto flex h-full w-full max-w-3xl flex-col space-y-4">
            {messages.length === 0 && (
              <EmptyState3D 
                character={selectedCharacter as any} 
                characterImageUrl={characterImageUrl}
                isImageError={isImageError}
              />
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: String(message.id).includes('ai') ? 0.1 : 0 }}
                >
                  <MessageBubble
                    message={message}
                    sealInitial={selectedCharacter.name[0]}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <TypingIndicator3D initial={selectedCharacter.name[0]} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sending indicator */}
            <AnimatePresence>
              {isSending && !isTyping && (
                <motion.div 
                  className="flex items-center gap-3 text-paper-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-amber/70" strokeWidth={1.5} />
                  </motion.div>
                  <span className="text-[12px]">Sending…</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input with 3D effects */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex-shrink-0 border-t border-hairline bg-ink-0 p-3 sm:p-4"
        >
          <div className="mx-auto flex h-14 w-full max-w-3xl items-center gap-3 rounded-2xl border border-hairline bg-ink-2 pl-5 pr-2 transition-colors duration-200 focus-within:border-amber/50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={'Message ' + selectedCharacter.name}
              aria-label={'Message ' + selectedCharacter.name}
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-paper-1 placeholder:text-paper-3 focus:outline-none"
              disabled={isTyping || isSending}
            />
            <motion.button
              type="submit"
              disabled={isTyping || isSending || !input.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber text-ink-1 transition-[transform,opacity,background-color] duration-200 ease-out hover:bg-[#e3af72] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 btn-press"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SendHorizontal aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}