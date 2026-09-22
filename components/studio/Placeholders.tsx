import * as React from "react";

type Tone = { bg: string; ink: string };

type PortraitProps = {
  seed?: number;
  label?: string;
  aspect?: string | "unset";
  tone?: Tone;
  style?: React.CSSProperties;
  className?: string;
};

// Editorial portrait placeholder — diagonal lines + abstract silhouette.
export function PortraitPlaceholder({
  seed = 0,
  label,
  aspect = "3/4",
  tone,
  style,
  className,
}: PortraitProps) {
  const tones: Tone[] = tone
    ? [tone]
    : [
        { bg: "#D9CBAC", ink: "#4A5D3E" },
        { bg: "#C9B99A", ink: "#7A2E2E" },
        { bg: "#E8DCC0", ink: "#394A2F" },
        { bg: "#B8A988", ink: "#2A2A2A" },
        { bg: "#DFD0B2", ink: "#5C1F1F" },
        { bg: "#CEBE9E", ink: "#4A5D3E" },
      ];
  const t = tones[seed % tones.length];
  const angle = 8 + ((seed * 13) % 30);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        aspectRatio: aspect === "unset" ? undefined : aspect,
        background: t.bg,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(${angle}deg, ${t.ink}08 0 2px, transparent 2px 14px)`,
        }}
      />
      <svg
        viewBox="0 0 100 130"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.5,
        }}
      >
        <path
          d={`M 50 ${28 + (seed % 4)} C 30 ${28 + (seed % 4)}, 22 55, 24 78 L 24 130 L 76 130 L 76 78 C 78 55, 70 ${28 + (seed % 4)}, 50 ${28 + (seed % 4)} Z`}
          fill={t.ink}
          opacity="0.35"
        />
        <ellipse cx="50" cy={62 + (seed % 3)} rx="13" ry="16" fill={t.bg} opacity="0.9" />
        <path
          d="M 30 110 C 40 100, 60 100, 70 110 L 70 130 L 30 130 Z"
          fill={t.ink}
          opacity="0.2"
        />
      </svg>
      {label && (
        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            color: t.ink,
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

type ScarfProps = {
  seed?: number;
  label?: string;
  aspect?: string | "unset";
  style?: React.CSSProperties;
  className?: string;
};

const SWATCHES = [
  { base: "#E8DCC0", accent: "#4A5D3E", name: "zeytin" },
  { base: "#D4C5A9", accent: "#7A2E2E", name: "bordo" },
  { base: "#EFE4CF", accent: "#394A2F", name: "orman" },
  { base: "#C9B99A", accent: "#2A2A2A", name: "kömür" },
  { base: "#F0E6D0", accent: "#8B4545", name: "gül kurusu" },
  { base: "#DCCFB0", accent: "#5C1F1F", name: "şarap" },
  { base: "#E2D4B4", accent: "#6B8063", name: "adaçayı" },
  { base: "#CEBE9E", accent: "#3D2A2A", name: "karanfil" },
];

// Fabric-feel scarf placeholder with subtle pattern + drape.
export function ScarfPlaceholder({
  seed = 0,
  label,
  aspect = "3/4",
  style,
  className,
}: ScarfProps) {
  const s = SWATCHES[seed % SWATCHES.length];
  const patternType = seed % 4;
  let pattern = "none";
  if (patternType === 0) {
    pattern = `repeating-linear-gradient(${30 + seed * 7}deg, ${s.accent}22 0 1px, transparent 1px 8px)`;
  } else if (patternType === 1) {
    pattern = `repeating-linear-gradient(0deg, ${s.accent}18 0 1px, transparent 1px 16px), repeating-linear-gradient(90deg, ${s.accent}18 0 1px, transparent 1px 16px)`;
  } else if (patternType === 3) {
    pattern = `repeating-linear-gradient(90deg, ${s.accent}20 0 1px, transparent 1px 6px)`;
  }

  const gradientId = `g-${seed}`;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        aspectRatio: aspect === "unset" ? undefined : aspect,
        background: s.base,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: pattern,
        }}
      />
      <svg
        viewBox="0 0 100 120"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={s.base} stopOpacity="0" />
            <stop offset="100%" stopColor={s.accent} stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <rect width="100" height="120" fill={`url(#${gradientId})`} />
        <path
          d={`M 0 ${40 + seed * 3} Q 50 ${30 + seed * 2}, 100 ${45 + seed * 2}`}
          stroke={s.accent}
          strokeWidth="0.4"
          fill="none"
          opacity="0.35"
        />
        <path
          d={`M 0 ${70 + seed * 2} Q 50 ${62 + seed}, 100 75`}
          stroke={s.accent}
          strokeWidth="0.3"
          fill="none"
          opacity="0.25"
        />
        <rect
          x="3"
          y="3"
          width="94"
          height="114"
          stroke={s.accent}
          strokeWidth="0.3"
          fill="none"
          opacity="0.35"
          strokeDasharray="0.8 2"
        />
      </svg>
      {label && (
        <div
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.14em",
            color: s.accent,
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          {s.name}
        </div>
      )}
    </div>
  );
}

export const SCARF_SWATCHES = SWATCHES;
