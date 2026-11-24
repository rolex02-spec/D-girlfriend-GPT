import { NextResponse } from 'next/server';
import { characters } from '@/lib/characters/database';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get('country');
  const id = searchParams.get('id');

  if (id) {
    const character = characters.find((c) => c.id === id);
    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }
    return NextResponse.json(character);
  }

  if (country) {
    const filtered = characters.filter(
      (c) => c.country.toLowerCase() === country.toLowerCase()
    );
    return NextResponse.json(filtered);
  }

  // Return all characters (without sensitive data)
  const summaries = characters.map((c) => ({
    id: c.id,
    name: c.name,
    age: c.age,
    country: c.country,
    region: c.region,
    nationality: c.nationality,
    greeting: c.greeting,
    appearance: {
      hairColor: c.appearance.hairColor,
      eyeColor: c.appearance.eyeColor,
      height: c.appearance.height,
      bodyType: c.appearance.bodyType,
    },
    personality: {
      romanticLevel: c.personality.romanticLevel,
      playfulness: c.personality.playfulness,
      dirtyTalk: c.personality.dirtyTalk,
    },
    nsfwAllowed: c.nsfwAllowed,
  }));

  return NextResponse.json(summaries);
}
