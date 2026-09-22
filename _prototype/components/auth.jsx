// Auth — Kayıt + Giriş ekranları. Ortak layout, değişen form.

function AuthScreen({ mode, onSwitch, onSuccess, onBack }) {
  const isSignup = mode === 'signup';
  const [form, setForm] = React.useState({ email: '', password: '', name: '' });

  const submit = (e) => {
    e.preventDefault();
    onSuccess({ email: form.email || 'misafir@ornek.com', name: form.name || 'Misafir' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      background: 'var(--bg)',
    }} className="auth-grid">
      {/* Sol panel — form */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        padding: 'clamp(28px, 4vw, 56px)',
        minHeight: '100vh',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-muted)', fontSize: 13 }}>
            <Icon name="arrow-left" size={16}/> geri
          </button>
          <Logo size={20} />
        </div>

        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          maxWidth: 440, margin: '0 auto', width: '100%',
          paddingTop: 60, paddingBottom: 40,
        }}>
          <div className="eyebrow" style={{ marginBottom: 22 }}>
            {isSignup ? 'YENİ HESAP' : 'TEKRAR HOŞGELDİN'}
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05,
            fontWeight: 300,
            letterSpacing: '-0.02em',
            marginBottom: 18,
          }}>
            {isSignup
              ? <>Stüdyoya <span style={{ fontStyle: 'italic' }}>adım at.</span></>
              : <>Kaldığın <span style={{ fontStyle: 'italic' }}>yerden</span> devam.</>
            }
          </h1>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 36, fontSize: 15 }}>
            {isSignup
              ? 'Birkaç saniyede hesap oluştur; beğendiklerin ve denemelerin kalıcı kalsın.'
              : 'Favori başörtülerini ve denemelerini hemen tekrar göreceksin.'}
          </p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {isSignup && (
              <label>
                <div className="eyebrow" style={{ marginBottom: 8 }}>İSİM</div>
                <input className="app-input" type="text" placeholder="Ayşe Yılmaz"
                       value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </label>
            )}
            <label>
              <div className="eyebrow" style={{ marginBottom: 8 }}>E-POSTA</div>
              <input className="app-input" type="email" placeholder="ad@ornek.com"
                     value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required/>
            </label>
            <label>
              <div className="eyebrow" style={{ marginBottom: 8 }}>ŞİFRE</div>
              <input className="app-input" type="password" placeholder="••••••••"
                     value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required/>
            </label>

            {!isSignup && (
              <div style={{ textAlign: 'right', fontSize: 13 }}>
                <a href="#" style={{ color: 'var(--ink-muted)', borderBottom: '1px solid var(--line)' }}>
                  Şifreni mi unuttun?
                </a>
              </div>
            )}

            <button type="submit" className="app-btn app-btn-primary"
                    style={{ marginTop: 14, padding: '16px 28px' }}>
              {isSignup ? 'Hesabımı oluştur' : 'Giriş yap'}
              <Icon name="arrow-right" size={16}/>
            </button>

            {/* OR separator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              color: 'var(--ink-muted)', margin: '18px 0 4px',
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
              <span className="eyebrow">VEYA</span>
              <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
            </div>

            <button type="button" className="app-btn app-btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2 3.1v2.6h3.3c1.9-1.8 3.1-4.4 3.1-7.5z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.3-2.6c-.9.6-2 1-3.3 1-2.6 0-4.7-1.7-5.5-4H3.2v2.5C4.9 19.6 8.2 22 12 22z"/><path fill="#FBBC05" d="M6.5 14c-.2-.6-.3-1.2-.3-2s.1-1.4.3-2V7.5H3.2C2.4 9 2 10.4 2 12s.4 3 1.2 4.5L6.5 14z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9C17 3 14.7 2 12 2 8.2 2 4.9 4.4 3.2 7.5L6.5 10c.8-2.3 2.9-4 5.5-4z"/></svg>
              Google ile devam et
            </button>
          </form>

          <div style={{ marginTop: 32, textAlign: 'center', fontSize: 14, color: 'var(--ink-soft)' }}>
            {isSignup ? 'Zaten hesabın var mı?' : 'Yeni misin?'}{' '}
            <button onClick={onSwitch} style={{ borderBottom: '1px solid var(--ink)', paddingBottom: 1 }}>
              {isSignup ? 'Giriş yap' : 'Hesap oluştur'}
            </button>
          </div>
        </div>

        <div className="eyebrow" style={{ color: 'var(--ink-muted)' }}>
          KVKK uyumlu · verilerin gizli
        </div>
      </div>

      {/* Sağ panel — atmosfer */}
      <div style={{
        position: 'relative',
        background: 'var(--bg-deep)',
        overflow: 'hidden',
        minHeight: '100vh',
      }} className="auth-visual">
        <PortraitPlaceholder seed={isSignup ? 5 : 2} tone={{ bg: isSignup ? '#D4C5A9' : '#E8DCC0', ink: isSignup ? '#7A2E2E' : '#4A5D3E' }}
                             aspect="auto" style={{ width: '100%', height: '100%' }} />
        {/* Katman */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(170deg, rgba(245,239,228,0.15), rgba(42,42,42,0.35))',
        }}/>
        {/* Alıntı kartı */}
        <div style={{
          position: 'absolute', left: 40, bottom: 40, right: 40, maxWidth: 440,
          padding: '28px 30px',
          background: 'rgba(245,239,228,0.92)',
          backdropFilter: 'blur(6px)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>— stüdyo notu</div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 22, fontStyle: 'italic', lineHeight: 1.45,
            color: 'var(--ink)',
          }}>
            “Bir başörtü seçmek kolay değil. Biz onu kolay yapıyoruz — denemeden beğen.”
          </div>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eyebrow" style={{ color: 'var(--ink-muted)' }}>manifesto · 2026</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-visual { display: none !important; }
        }
      `}</style>
    </div>
  );
}

window.AuthScreen = AuthScreen;
