import { NextResponse } from 'next/server';

interface BodySettings {
  bust?: string;
  bustSize?: string;
  bustShape?: string;
  waist?: string;
  waistSize?: string;
  hips?: string;
  hipSize?: string;
  height?: string;
  bodyType?: string;
  ass?: string;
  assShape?: string;
  assSize?: string;
  legLength?: string;
  hairLength?: string;
  hairColor?: string;
  eyeColor?: string;
  eyeSize?: string;
  skinTone?: string;
  ethnicity?: string;
}

function buildBodyPrompt(settings: BodySettings): string {
  const parts: string[] = [];

  if (settings.height) {
    const h = parseInt(settings.height);
    if (h <= 155) parts.push('petite');
    else if (h <= 165) parts.push('average height');
    else if (h <= 175) parts.push('tall');
    else parts.push('very tall');
  }

  if (settings.bodyType) {
    switch (settings.bodyType) {
      case 'slim': parts.push('slim body, slender figure'); break;
      case 'athletic': parts.push('athletic body, toned figure'); break;
      case 'curvy': parts.push('curvy body, hourglass figure'); break;
      case 'thick': parts.push('thick body, voluptuous figure'); break;
      case 'muscular': parts.push('muscular body, fit figure'); break;
      case 'petite': parts.push('petite body, small frame'); break;
      case 'balanced': parts.push('balanced body, proportional figure'); break;
      case 'tall lean': parts.push('tall lean body, long limbs'); break;
      case 'soft': parts.push('soft body, gentle curves'); break;
      case 'voluptuous': parts.push('voluptuous body, full curves'); break;
      default: parts.push('beautiful body');
    }
  }

  // Breast size and shape
  if (settings.bust) {
    const b = parseInt(settings.bust);
    if (b >= 95) parts.push('very large breasts');
    else if (b >= 85) parts.push('large breasts');
    else if (b >= 75) parts.push('medium breasts');
    else parts.push('small breasts');
  }
  if (settings.bustShape) {
    switch (settings.bustShape) {
      case 'rounded': parts.push('rounded breast shape'); break;
      case 'teardrop': parts.push('teardrop breast shape'); break;
      case 'wide': parts.push('wide-set breasts'); break;
      case 'narrow': parts.push('narrow breast shape'); break;
      case 'asymmetric': parts.push('asymmetric breasts'); break;
    }
  }

  // Bust size from enum (used by create page)
  if (settings.bustSize) {
    const bustSizeMap: Record<string, string> = {
      'flat': 'flat chest',
      'small': 'small breasts',
      'medium': 'medium breasts',
      'large': 'large breasts',
      'very_large': 'very large breasts',
    };
    if (bustSizeMap[settings.bustSize]) parts.push(bustSizeMap[settings.bustSize]);
  }
  if (settings.bustShape) {
    const bustShapeMap: Record<string, string> = {
      'rounded': 'rounded breast shape',
      'teardrop': 'teardrop breast shape',
      'wide': 'wide-set breasts',
      'narrow': 'narrow breast shape',
      'asymmetric': 'asymmetric breasts',
    };
    if (bustShapeMap[settings.bustShape]) parts.push(bustShapeMap[settings.bustShape]);
  }

  // Waist
  if (settings.waist) {
    const w = parseInt(settings.waist);
    if (w <= 58) parts.push('very slim waist');
    else if (w <= 65) parts.push('slim waist');
    else if (w <= 72) parts.push('toned waist');
    else parts.push('average waist');
  }
  if (settings.waistSize) {
    const waistMap: Record<string, string> = {
      'slim': 'slim waist',
      'average': 'average waist',
      'wide': 'wide waist',
    };
    if (waistMap[settings.waistSize]) parts.push(waistMap[settings.waistSize]);
  }

  // Hips
  if (settings.hips) {
    const hp = parseInt(settings.hips);
    if (hp >= 100) parts.push('wide hips');
    else if (hp >= 90) parts.push('curvy hips');
    else parts.push('narrow hips');
  }
  if (settings.hipSize) {
    const hipMap: Record<string, string> = {
      'narrow': 'narrow hips',
      'average': 'average hips',
      'wide': 'wide hips',
      'very_wide': 'very wide hips',
    };
    if (hipMap[settings.hipSize]) parts.push(hipMap[settings.hipSize]);
  }

  // Ass/butt size and shape
  if (settings.ass) {
    switch (settings.ass) {
      case 'small': parts.push('small butt'); break;
      case 'round': parts.push('round perky butt'); break;
      case 'big': parts.push('big butt'); break;
      case 'huge': parts.push('huge butt'); break;
    }
  }
  if (settings.assSize) {
    const assSizeMap: Record<string, string> = {
      'flat': 'flat butt',
      'small': 'small butt',
      'medium': 'medium butt',
      'large': 'large butt',
      'very_large': 'very large butt',
    };
    if (assSizeMap[settings.assSize]) parts.push(assSizeMap[settings.assSize]);
  }
  if (settings.assShape) {
    const assShapeMap: Record<string, string> = {
      'round': 'round butt shape',
      'heart': 'heart-shaped butt',
      'square': 'square butt shape',
      'wide': 'wide butt shape',
    };
    if (assShapeMap[settings.assShape]) parts.push(assShapeMap[settings.assShape]);
  }

  // Leg length
  if (settings.legLength) {
    switch (settings.legLength) {
      case 'short': parts.push('short legs'); break;
      case 'average': parts.push('average legs'); break;
      case 'long': parts.push('long legs'); break;
      case 'very_long': parts.push('very long legs'); break;
    }
  }

  if (settings.skinTone) {
    const skinMap: Record<string, string> = {
      'fair': 'fair skin',
      'light': 'light skin',
      'medium': 'olive skin',
      'tan': 'tanned skin',
      'brown': 'brown skin',
      'dark': 'dark skin',
    };
    parts.push(skinMap[settings.skinTone] || 'beautiful skin');
  }

  if (settings.eyeSize) {
    switch (settings.eyeSize) {
      case 'small': parts.push('almond eyes'); break;
      case 'medium': parts.push('normal eyes'); break;
      case 'large': parts.push('big beautiful eyes'); break;
    }
  }

  if (settings.eyeColor) parts.push(`${settings.eyeColor} eyes`);

  if (settings.hairLength) {
    switch (settings.hairLength) {
      case 'short': parts.push('short hair'); break;
      case 'medium': parts.push('medium hair'); break;
      case 'long': parts.push('long flowing hair'); break;
      case 'very-long': parts.push('very long waist length hair'); break;
    }
  }

  if (settings.hairColor) {
    const hairColorMap: Record<string, string> = {
      'black': 'black hair',
      'brown': 'brown hair',
      'blonde': 'blonde hair',
      'red': 'red hair',
      'pink': 'pink hair',
      'blue': 'blue hair',
      'purple': 'purple hair',
      'white': 'white silver hair',
      'auburn': 'auburn hair',
      'strawberry-blonde': 'strawberry blonde hair',
    };
    parts.push(hairColorMap[settings.hairColor] || 'beautiful hair');
  }

  if (settings.ethnicity) {
    const ethMap: Record<string, string> = {
      'asian': 'Asian woman',
      'korean': 'Korean woman',
      'japanese': 'Japanese woman',
      'chinese': 'Chinese woman',
      'european': 'European woman',
      'american': 'American woman',
      'indian': 'Indian woman',
      'latina': 'Latina woman',
      'african': 'African woman',
      'middle-eastern': 'Middle Eastern woman',
    };
    parts.push(ethMap[settings.ethnicity] || 'beautiful woman');
  }

  return parts.join(', ');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, bodySettings, style, isNsfw } = body;

    if (!prompt && !bodySettings) {
      return NextResponse.json({ error: 'Prompt or body settings required' }, { status: 400 });
    }

    let fullPrompt = '';

    if (bodySettings) {
      fullPrompt = buildBodyPrompt(bodySettings);
    }

    if (prompt) {
      fullPrompt = fullPrompt ? `${fullPrompt}, ${prompt}` : prompt;
    }

    const styleTags: Record<string, string> = {
      'anime': 'anime style, high quality, detailed, masterpiece',
      'realistic': 'photorealistic, RAW photo, high resolution, detailed, 8k uhd',
      'fantasy': 'fantasy art, magical, ethereal, high quality',
      'portrait': 'portrait photo, face focus, detailed, professional',
      'fullbody': 'full body photo, standing pose, detailed, professional',
    };

    const styleTag = styleTags[style as keyof typeof styleTags] || styleTags['realistic'];
    fullPrompt += `, ${styleTag}`;

    if (isNsfw) {
      fullPrompt += ', sensual pose, attractive, stunning, beautiful';
    }

    const negativePrompt = 'ugly, deformed, disfigured, blurry, low quality, watermark, text, bad anatomy, bad hands, extra limbs, missing limbs, distorted face, cropped';

    const seed = Math.floor(Math.random() * 100000);
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const encodedNeg = encodeURIComponent(negativePrompt);

    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=768&seed=${seed}&nologo=true&model=flux&negative=${encodedNeg}`;

    // Fetch the actual image from Pollinations and return it as a blob
    // This avoids CORS/caching issues with direct browser loading
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const imageResponse = await fetch(pollinationsUrl, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!imageResponse.ok) {
        throw new Error(`Pollinations returned ${imageResponse.status}`);
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');

      return NextResponse.json({
        imageUrl: `data:image/jpeg;base64,${imageBase64}`,
        prompt: fullPrompt,
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      console.error('Pollinations fetch error:', fetchError);

      // Fallback: return the direct URL and let the browser try to load it
      return NextResponse.json({
        imageUrl: pollinationsUrl,
        prompt: fullPrompt,
      });
    }
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
