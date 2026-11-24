import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    const { text, voice, rate, pitch } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Validate voice
    const validVoices = [
      'en-US-JennyNeural', 'en-US-AriaNeural', 'en-US-DavisNeural',
      'en-US-SaraNeural', 'en-US-AnaNeural', 'en-US-EmmaNeural',
      'en-US-MichelleNeural', 'ta-IN-PallaviNeural', 'te-IN-MohanNeural',
      'kn-IN-GaganNeural', 'ml-IN-MidhunNeural', 'hi-IN-SwaraNeural',
      'zh-CN-XiaoxiaoNeural', 'ja-JP-NanamiNeural', 'ko-KR-SunHiNeural',
      // Add more as needed
    ];

    const selectedVoice = validVoices.includes(voice) ? voice : 'en-US-JennyNeural';

    // Create temp file for audio output
    const tempFile = join(tmpdir(), `tts-${Date.now()}.mp3`);
    
    // Build edge-tts command
    const args = [
      '--text', text,
      '--voice', selectedVoice,
      '--write-media', tempFile,
    ];

    if (rate) args.push('--rate', rate);
    if (pitch) args.push('--pitch', pitch);

    // Run edge-tts via npx
    const result = await runEdgeTTS(args);
    
    if (!result.success) {
      console.error('edge-tts failed:', result.error);
      // Fallback to browser TTS
      return NextResponse.json({
        audio: null,
        fallback: true,
        message: 'Using browser TTS as fallback',
      });
    }

    // Read the generated audio file
    const fs = await import('fs');
    const audioBuffer = await fs.promises.readFile(tempFile);
    const base64Audio = audioBuffer.toString('base64');

    // Clean up temp file
    await unlink(tempFile).catch(() => {});

    return NextResponse.json({
      audio: `data:audio/mp3;base64,${base64Audio}`,
      fallback: false,
    });
  } catch (error) {
    console.error('Voice API Error:', error);
    return NextResponse.json({
      audio: null,
      fallback: true,
      message: 'Using browser TTS as fallback',
    });
  }
}

function runEdgeTTS(args: string[]): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const child = spawn('npx', ['edge-tts', ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 60000,
    });

    let stderr = '';
    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: stderr || `Process exited with code ${code}` });
      }
    });

    child.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
  });
}