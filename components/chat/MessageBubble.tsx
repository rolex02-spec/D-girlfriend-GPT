'use client';

import { User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
  timestamp: Date;
}

export default function MessageBubble({
  message,
  sealInitial,
}: {
  message: Message;
  sealInitial?: string;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-seal font-display text-[13px] leading-none text-[#f2e6da] shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),inset_0_-1.5px_2px_rgba(0,0,0,0.35)]"
        >
          {sealInitial ?? '·'}
        </span>
      )}

      <div
        className={`max-w-[78%] rounded-2xl border px-4 py-2.5 sm:max-w-[70%] ${
          isUser
            ? 'border-hairline bg-ink-3 text-paper-1'
            : 'border-hairline bg-ink-2 text-paper-1'
        }`}
      >
        {message.emotion && !isUser && (
          <span className="mb-1 block text-[11px] text-paper-3">
            {message.emotion}
          </span>
        )}
        <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{message.content}</p>
        <span
          className={`mt-1.5 block text-[10px] tabular-nums ${
            isUser ? 'text-paper-2' : 'text-paper-3'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {isUser && (
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-hairline bg-ink-2 text-paper-2"
        >
          <User className="h-4 w-4" strokeWidth={1.5} />
        </span>
      )}
    </div>
  );
}
