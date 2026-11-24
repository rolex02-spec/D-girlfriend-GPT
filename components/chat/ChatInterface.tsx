'use client';

import { useEffect, useRef, useState } from 'react';
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
} from 'lucide-react';
import MessageBubble from './MessageBubble';
import CharacterSidebar from './CharacterSidebar';
import ModelSelector from '../ui/ModelSelector';
import CharacterCustomize from '../character/CharacterCustomize';

function WaxSeal({ initial, size = 28, className = '' }: { initial: string; size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex flex-shrink-0 items-center justify-center rounded-full bg-seal leading-none text-seal-text shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1.5px_2px_rgba(0,0,0,0.35)] ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
        fontFamily: 'var(--font-display), Georgia, serif',
        color: 'var(--seal-text)',
      }}
    >
      {initial}
    </span>
  );
}

function TypingIndicator({ initial }: { initial: string }) {
  return (
    <div className="flex items-center gap-3" aria-label={`${initial} is typing`}>
      <WaxSeal initial={initial} size={28} />
      <div className="rounded-2xl border border-hairline bg-ink-2 px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="typing-dot h-1.5 w-1.5 rounded-full bg-amber/80"
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className="flex items-start gap-3 animate-shimmer">
      <div className="flex-shrink-0 mt-0.5 h-7 w-7 rounded-full bg-ink-3" />
      <div className="max-w-[70%] rounded-2xl border border-hairline bg-ink-2">
        <div className="h-3 w-24 rounded mx-4 mt-3 mb-2 bg-ink-3" />
        <div className="h-4 w-full mx-4 mb-2 bg-ink-3" />
        <div className="h-4 w-5/6 mx-4 mb-4 bg-ink-3" />
        <div className="h-2 w-20 mx-4 mb-3 bg-ink-3 rounded" />
      </div>
    </div>
  );
}

function EmptyState({ character, characterImageUrl }: { character: any; characterImageUrl: string | null }) {
  return (
    <div className="flex flex-1 items-center justify-center animate-fade-rise">
      <div className="max-w-md text-center stagger-enter">
        {characterImageUrl ? (
          <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border border-hairline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={characterImageUrl}
              alt={`Portrait of ${character.name}`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <WaxSeal initial={character.name[0]} size={64} className="mx-auto" />
        )}
        <h3 className="font-display mt-6 text-[44px] leading-none text-paper-1">
          {character.name}
        </h3>
        <div aria-hidden="true" className="rule-ornament mx-auto mt-4 justify-center text-[11px] text-amber/75">
          <span>◆</span>
        </div>
        <p className="font-display mt-5 text-[19px] leading-snug text-paper-2">
          {character.greeting}
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-paper-3">
          {character.backstory}
        </p>
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'idle' | 'connecting' | 'success' | 'error'
  >('idle');
  const [isSending, setIsSending] = useState(false);
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
      id: `${Date.now()}`,
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
          characterId: selectedCharacter.id,
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
        id: `${Date.now()}-ai`,
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
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: `I lost the connection for a moment — give me one more try? (Error: ${errorMessage})`,
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
    `Affection ${emotionState.affection}%`,
    `Trust ${emotionState.trust}%`,
    ...(nsfwMode ? [`Arousal ${emotionState.arousal}%`] : []),
  ].join('  ·  ');

  return (
    <div className="flex h-screen bg-ink-1">
      {showCustomize && (
        <CharacterCustomize isOpen={showCustomize} onClose={() => setShowCustomize(false)} />
      )}

      <CharacterSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between gap-3 border-b border-hairline bg-ink-0 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setShowCharacterSelect(true)}
              aria-label="Choose a different companion"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] border border-hairline text-paper-2 transition-colors duration-150 hover:text-paper-1 lg:hidden btn-press"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
            </button>

            {characterImageUrl && !isGeneratingImage ? (
              <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-hairline">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={characterImageUrl}
                  alt={`Portrait of ${selectedCharacter.name}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <WaxSeal initial={selectedCharacter.name[0]} size={36} />
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
              <span className="hidden items-center gap-1.5 text-[11px] text-paper-3 sm:flex" role="status">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${
                    connectionStatus === 'connecting'
                      ? 'bg-warn animate-pulse-soft'
                      : connectionStatus === 'success'
                        ? 'bg-ok'
                        : 'bg-err'
                  }`}
                />
                {connectionStatus === 'connecting' && 'Connecting'}
                {connectionStatus === 'success' && 'Connected'}
                {connectionStatus === 'error' && 'Failed'}
              </span>
            )}

            <ModelSelector />

            {/* 18+ toggle */}
            <button
              onClick={() => useChatStore.getState().toggleNsfwMode()}
              aria-pressed={nsfwMode}
              className={`h-10 rounded-[10px] border px-3 text-[12px] font-medium transition-colors duration-150 btn-press sm:h-9 ${
                nsfwMode
                  ? 'border-transparent bg-amber-soft text-amber'
                  : 'border-hairline bg-ink-2 text-paper-2 hover:text-paper-1'
              }`}
            >
              18+ {nsfwMode ? 'on' : 'off'}
            </button>

            {nsfwMode && (
              <button
                onClick={() => setShowQuickActions((open) => !open)}
                aria-expanded={showQuickActions}
                className="flex h-10 items-center gap-1.5 rounded-[10px] border border-hairline bg-ink-2 px-3 text-[12px] font-medium text-paper-2 transition-colors duration-150 hover:text-paper-1 btn-press sm:h-9"
              >
                Quick actions
                <ChevronDown
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 text-paper-3 transition-transform duration-200 ${
                    showQuickActions ? 'rotate-180' : ''
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            )}

            <button
              onClick={() => useChatStore.getState().toggleVoice()}
              aria-pressed={voiceEnabled}
              aria-label={voiceEnabled ? 'Voice replies on' : 'Voice replies off'}
              className={`flex h-10 w-10 items-center justify-center rounded-[10px] border border-hairline transition-colors duration-150 btn-press sm:h-9 sm:w-9 ${
                voiceEnabled
                  ? 'border-transparent bg-amber-soft text-amber'
                  : 'bg-ink-2 text-paper-2 hover:text-paper-1'
              }`}
            >
              {voiceEnabled ? (
                <Volume2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <VolumeX aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>

            <button
              onClick={clearMessages}
              aria-label="Clear conversation"
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-hairline bg-ink-2 text-paper-2 transition-colors duration-150 hover:text-paper-1 btn-press sm:h-9 sm:w-9"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {/* Quick actions */}
        {showQuickActions && nsfwMode && (
          <div className="flex-shrink-0 border-b border-hairline bg-ink-0 px-4 py-4 sm:px-6 animate-fade-rise-sm">
            <div className="mx-auto flex max-w-3xl items-center justify-between">
              <h4 className="text-[13px] font-medium text-paper-1">Quick actions</h4>
              <button
                onClick={() => setShowQuickActions(false)}
                aria-label="Close quick actions"
                className="flex h-8 w-8 items-center justify-center rounded-[8px] text-paper-3 transition-colors duration-150 hover:text-paper-1 btn-press"
              >
                <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="mx-auto mt-3 max-w-3xl">
              <p className="text-[11px] text-paper-3">Conversation starters</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {nsfwStarters.slice(0, 6).map((starter) => (
                  <button
                    key={starter}
                    onClick={() => handleSend(starter)}
                    className="max-w-full rounded-md border border-hairline bg-ink-2 px-3 py-2 text-left text-[12px] leading-snug text-paper-2 transition-colors duration-150 hover:border-hairline-strong hover:text-paper-1 btn-press"
                  >
                    {starter}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-[11px] text-paper-3">Ask for</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.values(sexualActs).slice(0, 8).map((act) => (
                  <button
                    key={act.name}
                    onClick={() => handleSend(`I want you to ${act.name.toLowerCase()}...`)}
                    className="rounded-md border border-hairline bg-ink-2 px-3 py-2 text-[12px] leading-snug text-paper-2 transition-colors duration-150 hover:border-hairline-strong hover:text-paper-1 btn-press"
                  >
                    {act.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto flex h-full w-full max-w-3xl flex-col space-y-4">
            {messages.length === 0 && (
              <EmptyState character={selectedCharacter} characterImageUrl={characterImageUrl} />
            )}

            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                sealInitial={selectedCharacter.name[0]}
              />
            ))}

            {isTyping && <TypingIndicator initial={selectedCharacter.name[0]} />}

            {/* Sending indicator */}
            {isSending && !isTyping && (
              <div className="flex items-center gap-3 text-paper-3">
                <Loader2 className="h-4 w-4 animate-spin text-amber/70" strokeWidth={1.5} />
                <span className="text-[12px]">Sending…</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
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
              placeholder={`Message ${selectedCharacter.name}`}
              aria-label={`Message ${selectedCharacter.name}`}
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-paper-1 placeholder:text-paper-3 focus:outline-none"
              disabled={isTyping || isSending}
            />
            <button
              type="submit"
              disabled={isTyping || isSending || !input.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber text-ink-1 transition-[transform,opacity,background-color] duration-200 ease-out hover:bg-[#e3af72] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 btn-press"
            >
              <SendHorizontal aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}