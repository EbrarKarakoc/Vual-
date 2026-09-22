// Welcome / Landing — Ken Burns sinematik açılış
const { useEffect: useEffectW, useState: useStateW, useRef: useRefW } = React;

function WelcomeScreen({ onEnter, animSpeed = 1 }) {
  const [idx, setIdx] = useStateW(0);
  const slides = [
    { kb: 'kenBurnsA', tone: { bg: '#D9CBAC', ink: '#4A5D3E' }, label: 'EDITORIAL · 01' },
    { kb: 'kenBurnsB', tone: { bg: '#E8DCC0', ink: '#7A2E2E' }, label: 'EDITORIAL · 02' },
    { kb: 'kenBurnsC', tone: { bg: '#C9B99A', ink: '#394A2F' }, label: 'EDITORIAL · 03' },
    { kb: 'kenBurnsA', tone: { bg: '#DFD0B2', ink: '#5C1F1F' }, label: 'EDITORIAL · 04' },
  ];
  const duration = 4200 / animSpeed;

  useEffectW(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), duration);
    return () => clearInterval(t);
  }, [duration]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      background: 'var(--bg)',
      overflow: 'hidden',
    }}>
      {/* Üst nav */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '26px clamp(20px, 4vw, 56px)',
        color: 'var(--ink)',
      }}>
        <Logo size={22} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 13 }}>
          <a className="eyebrow" href="#" onClick={e => { e.preventDefault(); onEnter('signin'); }}>GİRİŞ</a>
          <button className="app-btn app-btn-primary"
                  style={{ padding: '11px 22px', fontSize: 13 }}
                  onClick={() => onEnter('signup')}>
            HESAP OLUŞTUR
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
        minHeight: '100vh',
        gap: 0,
      }} className="welcome-grid">
        {/* Sol: metin */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(80px, 10vh, 140px) clamp(28px, 5vw, 80px) 80px',
          maxWidth: 680,
        }}>
          <div className="eyebrow" style={{ marginBottom: 28, animation: 'fadeIn 800ms var(--ease-out)' }}>
            <span style={{ display: 'inline-block', width: 28, height: 1, background: 'currentColor', verticalAlign: 'middle', marginRight: 12 }} />
            BAŞÖRTÜ · DENEME · STÜDYOSU
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(44px, 6.2vw, 92px)',
            lineHeight: 1.02,
            fontWeight: 300,
            letterSpacing: '-0.02em',
            marginBottom: 28,
            animation: 'fadeUp 900ms var(--ease-out) both',
          }}>
            Kendine<br/>
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>yakışanı</span> bul,<br/>
            denemeden<br/>
            beğen.
          </h1>
          <p style={{
            fontSize: 17, lineHeight: 1.65, color: 'var(--ink-soft)', maxWidth: 440,
            marginBottom: 40,
            animation: 'fadeUp 900ms 120ms var(--ease-out) both',
          }}>
            Fotoğrafını yükle, seçtiğin başörtüleri tek tıkla kendi üzerinde gör.
            Onlarca markadan yüzlerce model. Mağazaya gitmeden.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap',
                        animation: 'fadeUp 900ms 240ms var(--ease-out) both' }}>
            <button className="app-btn app-btn-primary" onClick={() => onEnter('signup')}>
              Hemen başla <Icon name="arrow-right" size={16}/>
            </button>
            <button className="app-btn app-btn-ghost" onClick={() => onEnter('signin')}>
              Hesabım var
            </button>
          </div>

          {/* Mini meta */}
          <div style={{
            marginTop: 'clamp(56px, 10vh, 100px)',
            display: 'flex', gap: 48, flexWrap: 'wrap',
            animation: 'fadeIn 1200ms 400ms var(--ease-out) both',
          }}>
            {[
              { n: '42+', l: 'Sponsor marka' },
              { n: '1.200', l: 'Başörtü modeli' },
              { n: 'AI', l: 'Fotoğraf üzeri deneme' },
            ].map(m => (
              <div key={m.l}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 30, lineHeight: 1 }}>{m.n}</div>
                <div className="eyebrow" style={{ marginTop: 6 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ: Ken Burns galeri */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--bg-deep)',
          minHeight: 'min(100vh, 720px)',
        }}>
          {slides.map((s, i) => (
            <div key={i} style={{
              position: 'absolute', inset: 0,
              opacity: i === idx ? 1 : 0,
              transition: `opacity ${900 / animSpeed}ms var(--ease-in-out)`,
              pointerEvents: 'none',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                animation: i === idx ? `${s.kb} ${duration * 1.2}ms linear` : 'none',
                transformOrigin: i % 2 ? 'center' : 'top right',
              }}>
                <PortraitPlaceholder seed={i + 1} tone={s.tone}
                                     aspect="auto"
                                     style={{ width: '100%', height: '100%', aspectRatio: 'unset' }}/>
              </div>
            </div>
          ))}

          {/* Overlay metin */}
          <div style={{
            position: 'absolute', left: 32, right: 32, bottom: 36,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            color: 'var(--cream)',
            mixBlendMode: 'difference',
            zIndex: 2,
          }}>
            <div>
              <div className="eyebrow" style={{ color: 'inherit', marginBottom: 10 }}>{slides[idx].label}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontStyle: 'italic', opacity: 0.9 }}>
                “sadelik, en güzel süstür.”
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {slides.map((_, i) => (
                <div key={i} style={{
                  width: i === idx ? 28 : 10, height: 2,
                  background: 'currentColor',
                  opacity: i === idx ? 1 : 0.35,
                  transition: 'all 400ms var(--ease-out)',
                }} />
              ))}
            </div>
          </div>

          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(42,42,42,0.35), transparent 40%)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* Alt şerit — scrolling marker */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px clamp(20px, 4vw, 56px)',
        borderTop: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'var(--ink-muted)',
        background: 'var(--bg)',
      }}>
        <span>© 2026 başörtü studio</span>
        <span>v0.1 · İstanbul</span>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .welcome-grid { grid-template-columns: 1fr !important; }
          .welcome-grid > div:last-child { min-height: 52vh !important; }
        }
      `}</style>
    </div>
  );
}

window.WelcomeScreen = WelcomeScreen;
