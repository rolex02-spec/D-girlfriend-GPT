export interface Memory {
  id: string;
  key: string;
  value: string;
  importance: number;
  createdAt: Date;
}

// In-memory store (replace with database in production)
const memoryStore: Map<string, Memory[]> = new Map();

function getMemoryKey(userId: string, characterId: string): string {
  return `${userId}:${characterId}`;
}

export function addMemory(
  userId: string,
  characterId: string,
  key: string,
  value: string,
  importance: number = 5
): Memory {
  const memKey = getMemoryKey(userId, characterId);
  const memories = memoryStore.get(memKey) || [];

  const memory: Memory = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    key,
    value,
    importance,
    createdAt: new Date(),
  };

  memories.push(memory);
  memoryStore.set(memKey, memories);

  return memory;
}

export function getMemories(
  userId: string,
  characterId: string,
  limit: number = 20
): Memory[] {
  const memKey = getMemoryKey(userId, characterId);
  const memories = memoryStore.get(memKey) || [];

  // Sort by importance and recency
  return memories
    .sort((a, b) => b.importance - a.importance || b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

export function searchMemories(
  userId: string,
  characterId: string,
  query: string
): Memory[] {
  const memories = getMemories(userId, characterId, 100);
  const lower = query.toLowerCase();

  return memories.filter(
    (m) =>
      m.key.toLowerCase().includes(lower) ||
      m.value.toLowerCase().includes(lower)
  );
}

export function deleteMemory(userId: string, characterId: string, memoryId: string): boolean {
  const memKey = getMemoryKey(userId, characterId);
  const memories = memoryStore.get(memKey) || [];
  const filtered = memories.filter((m) => m.id !== memoryId);

  if (filtered.length === memories.length) return false;

  memoryStore.set(memKey, filtered);
  return true;
}

// Auto-extract memories from conversation
export function extractMemories(
  userId: string,
  characterId: string,
  userMessage: string,
  aiResponse: string
): Memory[] {
  const extracted: Memory[] = [];

  // Extract name mentions
  const namePatterns = [
    /my name is (\w+)/i,
    /i'm (\w+)/i,
    /call me (\w+)/i,
  ];

  for (const pattern of namePatterns) {
    const match = userMessage.match(pattern);
    if (match) {
      extracted.push(
        addMemory(userId, characterId, 'user_name', match[1], 8)
      );
    }
  }

  // Extract preferences
  const prefPatterns = [
    /i (?:really )?(?:love|like|enjoy) (\w[\w\s]*)/i,
    /my favorite (\w+) is (\w[\w\s]*)/i,
    /i (?:hate|dislike|don't like) (\w[\w\s]*)/i,
  ];

  for (const pattern of prefPatterns) {
    const match = userMessage.match(pattern);
    if (match) {
      extracted.push(
        addMemory(
          userId,
          characterId,
          `preference_${match[1]?.replace(/\s/g, '_')}`,
          match[0],
          6
        )
      );
    }
  }

  // Extract personal info
  const infoPatterns = [
    /i (?:work|study) (?:at|in|as) (.+)/i,
    /i'm (\d+) years? old/i,
    /i live in (.+)/i,
    /my birthday is (.+)/i,
  ];

  for (const pattern of infoPatterns) {
    const match = userMessage.match(pattern);
    if (match) {
      extracted.push(
        addMemory(userId, characterId, `info_${pattern.source?.slice(0, 20)}`, match[0], 7)
      );
    }
  }

  return extracted;
}
