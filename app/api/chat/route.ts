import { NextResponse } from 'next/server';
import { generateResponse } from '@/lib/llm/provider';
import { extractMemories, getMemories } from '@/lib/memory';
import { characters } from '@/lib/characters/database';
import { updateEmotionState } from '@/lib/emotions';

export async function POST(req: Request) {
  console.log('=== Chat API called ===');

  try {
    const body = await req.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Request body must be an object' }, { status: 400 });
    }

    const { messages, characterId, userId, nsfwMode, provider, modelId, emotionState } = body;

    console.log('Request body:', {
      characterId,
      provider,
      modelId,
      nsfwMode,
      messageCount: messages?.length,
    });

    // Validate inputs
    if (typeof characterId !== 'string' || !characterId.trim()) {
      return NextResponse.json({ error: 'Character ID required' }, { status: 400 });
    }

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > 100 ||
      messages.some(
        (message) =>
          !message ||
          !['user', 'assistant'].includes(message.role) ||
          typeof message.content !== 'string' ||
          !message.content.trim() ||
          message.content.length > 10000
      ) ||
      messages[messages.length - 1]?.role !== 'user'
    ) {
      return NextResponse.json(
        { error: 'Messages must contain 1–100 valid turns and end with a user message' },
        { status: 400 }
      );
    }

    const character = characters.find((c) => c.id === characterId);
    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    console.log('Found character:', character.name);

    // Get memories
    const memories = getMemories(userId || 'default', characterId, 15);
    const memoryStrings = memories.map((m) => `${m.key}: ${m.value}`);

    console.log('Memories count:', memoryStrings.length);
    console.log('Calling LLM with provider:', provider, 'model:', modelId);

    // Generate response using RAG system
    const { content, emotion } = await generateResponse(
      messages,
      character,
      memoryStrings,
      nsfwMode,
      provider || 'openrouter',
      modelId
    );

    console.log('Response generated, length:', content.length);
    console.log('Emotion:', emotion);

    // Extract new memories from conversation
    const lastUserMsg = messages[messages.length - 1]?.content || '';
    extractMemories(userId || 'default', characterId, lastUserMsg, content);

    // Update emotion state
    const newEmotionState = updateEmotionState(
      emotionState || {
        current: 'neutral',
        intensity: 5,
        history: [],
        affection: 50,
        trust: 50,
        arousal: 0,
        mood: 'neutral',
      },
      lastUserMsg,
      content,
      emotion
    );

    console.log('=== Chat API success ===');

    return NextResponse.json({
      content,
      emotion,
      emotionState: newEmotionState,
    });
  } catch (error) {
    console.error('=== Chat API Error ===', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 }
    );
  }
}
