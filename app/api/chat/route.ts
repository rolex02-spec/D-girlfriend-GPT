import { NextResponse } from 'next/server';
import { generateResponse } from '@/lib/llm/provider';
import { extractMemories, getMemories } from '@/lib/memory';
import { characters } from '@/lib/characters/database';
import { updateEmotionState } from '@/lib/emotions';
import type { CharacterConfig } from '@/lib/types';

const cut = (v: unknown, max: number, fallback: string): string => {
  const s = typeof v === 'string' ? v.trim() : '';
  return (s ? s : fallback).slice(0, max);
};

/**
 * Build a synthetic CharacterConfig from a client-supplied persona object
 * (Customise Studio companions). All fields are bounded strings/numbers;
 * unknown or malformed values fall back to sensible defaults. This is the
 * only place request data is turned into character state.
 */
function hydratePersona(persona: Record<string, unknown>, characterId: string): CharacterConfig | null {
  const name = typeof persona.name === 'string' ? persona.name.trim().slice(0, 60) : '';
  if (!name) return null;

  const interests = Array.isArray(persona.interests)
    ? persona.interests.filter((i): i is string => typeof i === 'string').map((i) => i.slice(0, 60)).slice(0, 8)
    : [];

  const style = typeof persona.style === 'string' ? persona.style.trim().slice(0, 300) : '';
  const backstory = cut(persona.backstory, 800, `${name} is a fictional adult you composed in the Customise Studio — origin, temperament and humour all yours to define.`);

  return {
    id: characterId,
    name,
    age: Number(persona.age) > 0 ? Math.min(Math.round(Number(persona.age)), 99) : 22,
    country: cut(persona.country, 60, 'Custom'),
    region: cut(persona.region, 60, 'Your invention'),
    language: cut(persona.language, 20, 'en'),
    nationality: 'fictional',
    greeting: cut(persona.greeting, 300, `Hi — I'm ${name}. You wrote me, so you already know how this starts: say something.`),
    backstory: style ? `${backstory} How she talks: ${style}` : backstory,
    nsfwAllowed: true, // the studio only ever creates adults
    appearance: {
      faceShape: 'oval',
      skinTone: 'warm',
      skinColor: cut(persona.skinColor, 20, '#eac4a4'),
      eyeShape: 'almond',
      eyeSize: 'large',
      eyeColor: cut(persona.eyeColor, 20, 'Brown'),
      eyeLashes: 'long',
      eyebrows: 'medium',
      hairColor: cut(persona.hairColor, 20, '#241812'),
      hairStyle: 'wavy',
      hairLength: 'long',
      height: 'average',
      bodyType: 'average',
      bustSize: 'medium',
      bustShape: 'rounded',
      waistSize: 'average',
      hipSize: 'average',
      assSize: 'medium',
      assShape: 'round',
      legLength: 'long',
      bodyHair: 'none',
    },
    personality: {
      openness: 6,
      conscientiousness: 5,
      extraversion: 5,
      agreeableness: 6,
      neuroticism: 4,
      romanticLevel: 6,
      possessiveness: 4,
      jealousy: 3,
      clinginess: 4,
      playfulness: 6,
      dominance: 5,
      submissiveness: 5,
      dirtyTalk: 5,
      teaseLevel: 5,
      directness: 5,
      formality: 4,
      verbosity: 5,
      interests,
    },
    voice: {
      provider: 'edge-tts',
      voiceId: 'en-US-AvaNeural',
      rate: 0,
      pitch: 0,
      volume: 80,
      language: 'en-US',
    },
  };
}

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

    let character: CharacterConfig | undefined = characters.find((c) => c.id === characterId);

    // Additive path: custom companions designed in the Customise Studio are
    // not in the server database — their persona travels with the request
    // (inline, validated, bounded) and is hydrated into a synthetic config.
    // Built-in characters never take this branch, so existing chat behavior
    // is unchanged.
    if (!character && body.persona && typeof body.persona === 'object' && !Array.isArray(body.persona)) {
      character = hydratePersona(body.persona, characterId) ?? undefined;
    }

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
