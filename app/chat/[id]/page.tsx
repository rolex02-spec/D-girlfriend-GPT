/**
 * /chat/[id] — full-screen companion conversation.
 * Design language: dimmed lounge, candlelit glass panels, the companion's
 * portrait glowing softly on the left rail. All controls — pause, reset,
 * leave, language, adult-mode consent, report — are always reachable.
 */
import type { Metadata } from "next";
import ChatClient from "@/components/chat/ChatClient";

export const metadata: Metadata = {
  title: "Conversation",
  description: "Talk with a fictional adult AI companion. Pause, reset or leave anytime.",
  robots: { index: false, follow: false },
};

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChatClient characterId={id} />;
}
