/**
 * CompanionAvatar — procedural SVG portrait.
 *
 * Every companion gets a cohesive, editorial-illustration-style portrait
 * generated from their palette (skin tone, hair colour, hair style, card
 * hue). This is deliberately illustrated, never photographic: AI-generated
 * or rendered artwork of fictional characters must never read as a real
 * person, and nothing here scrapes or depicts an actual human.
 *
 * The renderer is deterministic — the same companion always looks the same.
 */

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Darken/lighten a hex colour by percent (-100..100). */
function shade(hex: string, percent: number): string {
  const n = hex.replace("#", "");
  const num = parseInt(
    n.length === 3 ? n.split("").map((c) => c + c).join("") : n,
    16
  );
  const amt = Math.round((percent / 100) * 255);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const IRIS_COLORS = ["#3b2f2f", "#233022", "#2c2c34", "#3a2a1e", "#1e2a3a", "#2f2333"];

export interface CompanionAvatarProps {
  name: string;
  skin: string;
  hair: string;
  /** 0 bun · 1 long waves · 2 bob · 3 ponytail · 4 curls · 5 braid */
  hairStyle: number;
  hue: number;
  className?: string;
  /** Renders only the bust inside a rounded frame if false-ish variant needed. */
  rounded?: boolean;
}

export default function CompanionAvatar({
  name,
  skin,
  hair,
  hairStyle,
  hue,
  className,
  rounded = true,
}: CompanionAvatarProps) {
  const seed = hashString(name);
  const uid = `av-${seed.toString(36)}`;
  const iris = IRIS_COLORS[seed % IRIS_COLORS.length];
  const outfit = `hsl(${(hue + 140) % 360} 42% 40%)`;
  const outfitDeep = `hsl(${(hue + 140) % 360} 46% 24%)`;
  const bgTop = `hsl(${hue} 38% 30%)`;
  const bgBottom = `hsl(${hue} 44% 12%)`;
  const hairDeep = shade(hair, -14);
  const skinDeep = shade(skin, -22);
  const hasFreckles = seed % 3 === 0;
  const smileLift = 2 + (seed % 3);

  const cap = `M69 104 C69 68 131 68 131 104 C119 91 81 91 69 104 Z`;

  return (
    <svg
      viewBox="0 0 200 240"
      role="img"
      aria-label={`Illustrated portrait of ${name}, a fictional character`}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bgTop} />
          <stop offset="100%" stopColor={bgBottom} />
        </linearGradient>
        <linearGradient id={`${uid}-outfit`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={outfit} />
          <stop offset="100%" stopColor={outfitDeep} />
        </linearGradient>
        <radialGradient id={`${uid}-vig`} cx="50%" cy="42%" r="75%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.42" />
        </radialGradient>
        {rounded && (
          <clipPath id={`${uid}-clip`}>
            <rect x="0" y="0" width="200" height="240" rx="18" />
          </clipPath>
        )}
      </defs>

      <g clipPath={rounded ? `url(#${uid}-clip)` : undefined}>
        {/* Backcloth: night-gradient + arched niche + halo disc */}
        <rect width="200" height="240" fill={`url(#${uid}-bg)`} />
        <path d="M28 240 L28 92 A72 78 0 0 1 172 92 L172 240 Z" fill="#ffffff" opacity="0.07" />
        <circle cx="100" cy="88" r="37" fill="#ffffff" opacity="0.10" />
        <circle cx="100" cy="88" r="37" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="0.8" strokeDasharray="2 5" />

        {/* Long hair falls behind the face */}
        {hairStyle === 1 && (
          <>
            <path d="M72 92 C58 128 60 162 64 198 C80 190 88 150 88 108 Z" fill={hair} />
            <path d="M128 92 C142 128 140 162 136 198 C120 190 112 150 112 108 Z" fill={hair} />
          </>
        )}
        {hairStyle === 4 && (
          <g fill={hair}>
            <circle cx="70" cy="96" r="12" /><circle cx="130" cy="96" r="12" />
            <circle cx="64" cy="116" r="10" /><circle cx="136" cy="116" r="10" />
          </g>
        )}

        {/* Shoulders / outfit */}
        <path d="M100 152 C62 152 44 194 40 240 L160 240 C156 194 138 152 100 152 Z" fill={`url(#${uid}-outfit)`} />
        <path d="M84 156 Q100 168 116 156" fill="none" stroke={shade(outfit, 30)} strokeWidth="2" strokeLinecap="round" opacity="0.8" />

        {/* Neck + ears */}
        <rect x="90.5" y="124" width="19" height="36" rx="9" fill={skinDeep} />
        <ellipse cx="69.5" cy="106" rx="5" ry="8" fill={skin} />
        <ellipse cx="130.5" cy="106" rx="5" ry="8" fill={skin} />

        {/* Face */}
        <ellipse cx="100" cy="102" rx="30.5" ry="36" fill={skin} />
        <path d="M100 66 A30.5 36 0 0 1 100 138 A44 36 0 0 0 100 66 Z" fill="#000" opacity="0.07" />

        {/* Hair cap (all styles share the hairline) */}
        <path d={cap} fill={hair} />

        {/* Style-specific silhouettes */}
        {hairStyle === 0 && <circle cx="100" cy="58" r="11.5" fill={hair} />}
        {hairStyle === 1 && <circle cx="100" cy="66" r="29" fill={hair} opacity="0.0" />}
        {hairStyle === 2 && (
          <>
            <path d="M68 100 C66 122 70 128 76 128 C82 128 84 116 84 104 Z" fill={hair} />
            <path d="M132 100 C134 122 130 128 124 128 C118 128 116 116 116 104 Z" fill={hair} />
          </>
        )}
        {hairStyle === 3 && (
          <>
            <path d="M128 84 C150 92 156 132 150 172 C138 158 130 118 122 100 Z" fill={hairDeep} />
            <circle cx="126" cy="78" r="7.5" fill={shade(hair, 12)} />
          </>
        )}
        {hairStyle === 4 && (
          <g fill={hair}>
            <circle cx="78" cy="72" r="10" /><circle cx="97" cy="62" r="11" />
            <circle cx="117" cy="68" r="10" /><circle cx="88" cy="82" r="9" /><circle cx="108" cy="80" r="9" />
          </g>
        )}
        {hairStyle === 5 && (
          <g fill={hair}>
            <circle cx="132" cy="112" r="6.5" /><circle cx="139" cy="124" r="6" />
            <circle cx="145" cy="136" r="5.5" /><circle cx="150" cy="148" r="5" /><circle cx="154" cy="160" r="4.5" />
          </g>
        )}

        {/* Eyes — calm, warm, looking near the viewer */}
        <g>
          <ellipse cx="88" cy="102" rx="5.1" ry="4.2" fill="#fff" opacity="0.92" />
          <ellipse cx="112" cy="102" rx="5.1" ry="4.2" fill="#fff" opacity="0.92" />
          <circle cx="88" cy="102.6" r="3.1" fill={iris} />
          <circle cx="112" cy="102.6" r="3.1" fill={iris} />
          <circle cx="88" cy="102.6" r="1.5" fill="#12100f" />
          <circle cx="112" cy="102.6" r="1.5" fill="#12100f" />
          <circle cx="89.1" cy="101.5" r="0.7" fill="#fff" />
          <circle cx="113.1" cy="101.5" r="0.7" fill="#fff" />
          {/* upper lids */}
          <path d="M82.6 100.4 Q88 97.4 93.4 100.4" fill="none" stroke={hairDeep} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M106.6 100.4 Q112 97.4 117.4 100.4" fill="none" stroke={hairDeep} strokeWidth="1.6" strokeLinecap="round" />
          {/* lashes */}
          <path d="M83.5 99.2 L81 97.4 M116.5 99.2 L119 97.4" stroke={hairDeep} strokeWidth="1.1" strokeLinecap="round" />
        </g>

        {/* Brows */}
        <path d="M83 93.6 Q88.5 91.3 93.5 93.8" fill="none" stroke={hairDeep} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M106.5 93.8 Q111.5 91.3 117 93.6" fill="none" stroke={hairDeep} strokeWidth="1.7" strokeLinecap="round" />

        {/* Nose + smile */}
        <path d="M100 104 L99 113 Q100 114.6 102.4 113.4" fill="none" stroke={skinDeep} strokeWidth="1.4" strokeLinecap="round" />
        <path d={`M87 122 Q100 ${122 + smileLift + 5} 113 122`} fill="none" stroke="#5f2f2a" strokeWidth="2" strokeLinecap="round" />
        <path d={`M90.5 122.6 Q100 ${122 + smileLift + 3.4} 109.5 122.6 Q100 ${122 + smileLift + 0.6} 90.5 122.6 Z`} fill="#8a4038" opacity="0.85" />

        {/* Blush + optional freckles + earring dots */}
        <circle cx="80" cy="114.5" r="3.4" fill="#d96a5f" opacity="0.38" />
        <circle cx="120" cy="114.5" r="3.4" fill="#d96a5f" opacity="0.38" />
        {hasFreckles && (
          <g fill="#5f3a24" opacity="0.6">
            <circle cx="86" cy="110" r="0.7" /><circle cx="91" cy="112" r="0.6" /><circle cx="95" cy="109.6" r="0.65" />
            <circle cx="105" cy="109.6" r="0.65" /><circle cx="109.5" cy="112" r="0.6" /><circle cx="114" cy="110" r="0.7" />
          </g>
        )}
        <circle cx="69.5" cy="114" r="1.4" fill="#d8a24a" />
        <circle cx="130.5" cy="114" r="1.4" fill="#d8a24a" />

        {/* Vignette for cinema depth */}
        <rect width="200" height="240" fill={`url(#${uid}-vig)`} />
      </g>
    </svg>
  );
}
