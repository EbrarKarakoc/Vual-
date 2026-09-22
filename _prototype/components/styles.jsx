// Tasarım sistemi: Başörtü deneme uygulaması
// Editorial, sade, galeri hissi. Bej tabanlı, koyu yeşil + bordo vurgu.

const TOKENS = {
  // Renk (default palette — Tweaks ile değiştirilebilir)
  bg:        '#F5EFE4',   // Sıcak bej
  bgSoft:    '#EEE6D4',   // Biraz daha koyu bej (kartlar)
  bgDeep:    '#E4D9BE',   // Koyu bej (ayraç, section bg)
  ink:       '#2A2A2A',   // Kömür (ana metin)
  inkSoft:   '#55544E',   // Orta metin
  inkMuted:  '#8A8678',   // Meta metin
  line:      '#D8CEB6',   // İnce çizgi
  green:     '#4A5D3E',   // Koyu zeytin yeşili (primary)
  greenDeep: '#394A2F',   // Hover
  wine:      '#7A2E2E',   // Bordo (accent / like / dene)
  wineDeep:  '#5C1F1F',
  cream:     '#FBF7EF',   // Kart içi parlaklık
  white:     '#FFFFFF',

  // Tipografi
  fontSerif: "'Fraunces', 'Cormorant Garamond', Georgia, serif",
  fontSans:  "'Inter', -apple-system, 'Helvetica Neue', sans-serif",
  fontMono:  "'JetBrains Mono', ui-monospace, monospace",

  // Radius (Tweaks ile değişir)
  radiusSm: '4px',
  radiusMd: '8px',
  radiusLg: '14px',
  radiusPill: '999px',

  // Motion
  easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
};

// Global CSS — inject'lenir
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { margin: 0; padding: 0; min-height: 100%; }
  body {
    background: var(--bg);
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: 15px;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  h1, h2, h3, h4 { font-family: var(--font-serif); font-weight: 400; margin: 0; letter-spacing: -0.01em; }
  p { margin: 0; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; padding: 0; }
  input, textarea { font-family: inherit; color: inherit; }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }

  ::selection { background: var(--green); color: var(--cream); }

  /* Scrollbar — subtle */
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 999px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--ink-muted); }

  /* Utility motion */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes kenBurnsA {
    0% { transform: scale(1.08) translate(-1%, -1%); }
    100% { transform: scale(1.18) translate(1%, 1%); }
  }
  @keyframes kenBurnsB {
    0% { transform: scale(1.15) translate(1%, 0%); }
    100% { transform: scale(1.05) translate(-1%, -1%); }
  }
  @keyframes kenBurnsC {
    0% { transform: scale(1.1) translate(0%, 1%); }
    100% { transform: scale(1.2) translate(-1%, -1%); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .app-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 26px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.02em;
    border-radius: var(--radius-pill);
    transition: all 220ms var(--ease-out);
    border: 1px solid transparent;
    white-space: nowrap;
  }
  .app-btn-primary {
    background: var(--green);
    color: var(--cream);
  }
  .app-btn-primary:hover { background: var(--green-deep); transform: translateY(-1px); }
  .app-btn-wine {
    background: var(--wine);
    color: var(--cream);
  }
  .app-btn-wine:hover { background: var(--wine-deep); transform: translateY(-1px); }
  .app-btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--line);
  }
  .app-btn-ghost:hover { background: var(--bg-soft); border-color: var(--ink); }
  .app-btn-text {
    padding: 8px 4px;
    font-weight: 500;
    border-radius: 0;
    border-bottom: 1px solid currentColor;
  }

  .app-input {
    width: 100%;
    padding: 14px 16px;
    background: transparent;
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    font-size: 15px;
    transition: border-color 200ms var(--ease-out), background 200ms var(--ease-out);
  }
  .app-input:focus {
    outline: none;
    border-color: var(--green);
    background: var(--cream);
  }

  .eyebrow {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }

  .divider-dotted {
    border-top: 1px dashed var(--line);
  }
`;

function injectTokens(tokens) {
  return `
    :root {
      --bg: ${tokens.bg};
      --bg-soft: ${tokens.bgSoft};
      --bg-deep: ${tokens.bgDeep};
      --ink: ${tokens.ink};
      --ink-soft: ${tokens.inkSoft};
      --ink-muted: ${tokens.inkMuted};
      --line: ${tokens.line};
      --green: ${tokens.green};
      --green-deep: ${tokens.greenDeep};
      --wine: ${tokens.wine};
      --wine-deep: ${tokens.wineDeep};
      --cream: ${tokens.cream};
      --font-serif: ${tokens.fontSerif};
      --font-sans: ${tokens.fontSans};
      --font-mono: ${tokens.fontMono};
      --radius-sm: ${tokens.radiusSm};
      --radius-md: ${tokens.radiusMd};
      --radius-lg: ${tokens.radiusLg};
      --radius-pill: ${tokens.radiusPill};
      --ease-out: ${tokens.easeOut};
      --ease-in-out: ${tokens.easeInOut};
    }
  `;
}

Object.assign(window, { TOKENS, GLOBAL_CSS, injectTokens });
