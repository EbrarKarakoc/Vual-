// Paylaşılan bileşenler: Logo, Placeholder'lar, Navbar, Footer, ikonlar

const { useEffect, useRef, useState, useMemo } = React;

// ----- Logo -----
function Logo({ size = 22, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: color || 'inherit' }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ flex: 'none' }}>
        {/* İnce, soyut başörtü silueti — sadece iki eğri */}
        <path d="M6 22 C 6 12, 12 6, 16 6 C 20 6, 26 12, 26 22"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M9 22 C 10 18, 13 14, 16 14 C 19 14, 22 18, 23 22"
              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.55" />
        <line x1="6" y1="25" x2="26" y2="25" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      </svg>
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: size * 0.82,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        fontWeight: 400,
      }}>
        başörtü<span style={{ fontStyle: 'italic', opacity: 0.6 }}> studio</span>
      </div>
    </div>
  );
}

// ----- Portret placeholder — diyagonal çizgili, tonlu -----
function PortraitPlaceholder({ seed = 0, label, aspect = '3/4', style = {}, tone }) {
  // Seed'e göre deterministik ton seçimi (palette içi harmoni)
  const tones = tone ? [tone] : [
    { bg: '#D9CBAC', ink: '#4A5D3E' },
    { bg: '#C9B99A', ink: '#7A2E2E' },
    { bg: '#E8DCC0', ink: '#394A2F' },
    { bg: '#B8A988', ink: '#2A2A2A' },
    { bg: '#DFD0B2', ink: '#5C1F1F' },
    { bg: '#CEBE9E', ink: '#4A5D3E' },
  ];
  const t = tones[seed % tones.length];
  const angle = 8 + (seed * 13) % 30;

  return (
    <div style={{
      position: 'relative',
      aspectRatio: aspect,
      background: t.bg,
      overflow: 'hidden',
      ...style,
    }}>
      {/* Şerit deseni */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(${angle}deg, ${t.ink}08 0 2px, transparent 2px 14px)`,
      }} />
      {/* Soyut baş+omuz silueti */}
      <svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice"
           style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}>
        {/* Başörtü/baş */}
        <path d={`M 50 ${28 + (seed%4)} C 30 ${28 + (seed%4)}, 22 55, 24 78 L 24 130 L 76 130 L 76 78 C 78 55, 70 ${28 + (seed%4)}, 50 ${28 + (seed%4)} Z`}
              fill={t.ink} opacity="0.35" />
        {/* Yüz ovali (açık) */}
        <ellipse cx="50" cy={62 + (seed%3)} rx="13" ry="16" fill={t.bg} opacity="0.9" />
        {/* Boyun/omuz hattı */}
        <path d="M 30 110 C 40 100, 60 100, 70 110 L 70 130 L 30 130 Z" fill={t.ink} opacity="0.2" />
      </svg>
      {label && (
        <div style={{
          position: 'absolute', left: 12, bottom: 12,
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
          color: t.ink, textTransform: 'uppercase', opacity: 0.7,
        }}>{label}</div>
      )}
    </div>
  );
}

// ----- Başörtü ürün placeholder — dokulu kumaş hissi -----
function ScarfPlaceholder({ seed = 0, label, style = {}, aspect = '3/4' }) {
  const swatches = [
    { base: '#E8DCC0', accent: '#4A5D3E', name: 'zeytin' },
    { base: '#D4C5A9', accent: '#7A2E2E', name: 'bordo' },
    { base: '#EFE4CF', accent: '#394A2F', name: 'orman' },
    { base: '#C9B99A', accent: '#2A2A2A', name: 'kömür' },
    { base: '#F0E6D0', accent: '#8B4545', name: 'gül kurusu' },
    { base: '#DCCFB0', accent: '#5C1F1F', name: 'şarap' },
    { base: '#E2D4B4', accent: '#6B8063', name: 'adaçayı' },
    { base: '#CEBE9E', accent: '#3D2A2A', name: 'karanfil' },
  ];
  const s = swatches[seed % swatches.length];

  // Desen tipi seed'e göre
  const patternType = seed % 4;
  let pattern;
  if (patternType === 0) {
    // İnce çizgiler
    pattern = `repeating-linear-gradient(${30 + seed*7}deg, ${s.accent}22 0 1px, transparent 1px 8px)`;
  } else if (patternType === 1) {
    // Küçük kareler
    pattern = `
      repeating-linear-gradient(0deg, ${s.accent}18 0 1px, transparent 1px 16px),
      repeating-linear-gradient(90deg, ${s.accent}18 0 1px, transparent 1px 16px)
    `;
  } else if (patternType === 2) {
    // Düz, kenarda border
    pattern = 'none';
  } else {
    // İnce dikey
    pattern = `repeating-linear-gradient(90deg, ${s.accent}20 0 1px, transparent 1px 6px)`;
  }

  return (
    <div style={{
      position: 'relative',
      aspectRatio: aspect,
      background: s.base,
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: pattern }} />
      {/* Kumaş drapesi */}
      <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid slice"
           style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id={`g-${seed}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={s.base} stopOpacity="0" />
            <stop offset="100%" stopColor={s.accent} stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <rect width="100" height="120" fill={`url(#g-${seed})`} />
        {/* Kat/fold */}
        <path d={`M 0 ${40 + seed*3} Q 50 ${30 + seed*2}, 100 ${45 + seed*2}`}
              stroke={s.accent} strokeWidth="0.4" fill="none" opacity="0.35" />
        <path d={`M 0 ${70 + seed*2} Q 50 ${62 + seed}, 100 ${75}`}
              stroke={s.accent} strokeWidth="0.3" fill="none" opacity="0.25" />
        {/* Kenar dikişi */}
        <rect x="3" y="3" width="94" height="114" stroke={s.accent} strokeWidth="0.3" fill="none" opacity="0.35" strokeDasharray="0.8 2" />
      </svg>
      {label && (
        <div style={{
          position: 'absolute', right: 10, top: 10,
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em',
          color: s.accent, textTransform: 'uppercase', opacity: 0.7,
        }}>{s.name}</div>
      )}
    </div>
  );
}

// ----- Ikonlar (inline SVG, hat stili) -----
const Icon = ({ name, size = 18, stroke = 1.5 }) => {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'arrow-right': return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-left':  return <svg {...common}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>;
    case 'check':       return <svg {...common}><path d="M4 12l5 5 11-11"/></svg>;
    case 'close':       return <svg {...common}><path d="M6 6l12 12M6 18L18 6"/></svg>;
    case 'heart':       return <svg {...common}><path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>;
    case 'heart-fill':  return <svg {...common} fill="currentColor" stroke="none"><path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>;
    case 'bag':         return <svg {...common}><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 1 1 6 0v2"/></svg>;
    case 'user':        return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>;
    case 'upload':      return <svg {...common}><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M12 3v14M6 9l6-6 6 6"/></svg>;
    case 'image':       return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="1"/><circle cx="9" cy="10" r="1.5"/><path d="M3 17l5-5 4 4 3-3 6 6"/></svg>;
    case 'sparkles':    return <svg {...common}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/></svg>;
    case 'camera':      return <svg {...common}><path d="M4 7h3l2-2h6l2 2h3v12H4z"/><circle cx="12" cy="13" r="3.5"/></svg>;
    case 'search':      return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>;
    case 'menu':        return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case 'star':        return <svg {...common}><path d="M12 3l2.6 5.4L20 9l-4 4 1 6-5-2.8L7 19l1-6-4-4 5.4-.6z"/></svg>;
    case 'external':    return <svg {...common}><path d="M14 3h7v7M10 14L21 3M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></svg>;
    case 'settings':    return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.8a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.4a7 7 0 0 0-2 1.2l-2.4-.8-2 3.4 2 1.6A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.6 2 3.4 2.4-.8a7 7 0 0 0 2 1.2L10 21h4l.5-2.4a7 7 0 0 0 2-1.2l2.4.8 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z"/></svg>;
    case 'sliders':     return <svg {...common}><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>;
    case 'play':        return <svg {...common}><path d="M6 4l14 8-14 8z"/></svg>;
    case 'grid':        return <svg {...common}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
    case 'trash':       return <svg {...common}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>;
    case 'dot':         return <svg {...common}><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>;
    default: return null;
  }
};

Object.assign(window, { Logo, PortraitPlaceholder, ScarfPlaceholder, Icon });
