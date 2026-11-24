/**
 * StartConversationButton — opens (or resumes) the conversation.
 *
 * Threads live in this browser (localStorage, keyed by character), so there
 * is no server round-trip: we seed the shared store and route straight to
 * /chat/[id], where the thread is hydrated on mount.
 */
"use client";

import { useRouter } from "next/navigation";
import { MessageCircleHeart } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { getCharacter } from "@/data/companions";

export default function StartConversationButton({ companionId, companionFirstName }: { companionId: string; companionFirstName: string }) {
  const router = useRouter();

  const start = () => {
    // Built-ins: hand the full config to the store (portrait, voice, etc.).
    // Custom studio companions have no server config — the chat hydrates
    // them from localStorage instead.
    const character = getCharacter(companionId);
    if (character) useChatStore.getState().setSelectedCharacter(character);
    router.push(`/chat/${companionId}`);
  };

  return (
    <div>
      <button
        onClick={start}
        className="btn-candle inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold sm:w-auto sm:min-w-72"
        aria-describedby="resume-note"
      >
        <MessageCircleHeart size={19} aria-hidden="true" />
        {`Talk with ${companionFirstName}`}
      </button>
      <p id="resume-note" className="mt-2 text-center text-[11px] text-cream-dim/80 sm:text-left">
        Free during preview · resumes exactly where you left off · adults only
      </p>
    </div>
  );
}
