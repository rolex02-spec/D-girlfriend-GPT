import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      status: 'error',
      message: 'OPENROUTER_API_KEY not configured',
    }, { status: 500 });
  }

  try {
    // Test with OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://girlfriend-gpt.app',
        'X-Title': 'GirlfriendGPT',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say hello in one word' }],
        max_tokens: 10,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({
        status: 'error',
        message: `API returned ${response.status}`,
        error: error,
      }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || 'No response';

    return NextResponse.json({
      status: 'success',
      message: 'OpenRouter API is working!',
      response: content,
      model: data.model,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to OpenRouter API',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
