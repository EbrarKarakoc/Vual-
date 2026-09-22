// Tweaks panel + ana App orchestration

function TweaksPanel({ tokens, onChange, open, onToggle }) {
  const palettes = [
    { name: 'Zeytin · Bej · Bordo', bg: '#F5EFE4', bgSoft: '#EEE6D4', bgDeep: '#E4D9BE', line: '#D8CEB6',
      green: '#4A5D3E', greenDeep: '#394A2F', wine: '#7A2E2E', wineDeep: '#5C1F1F', cream: '#FBF7EF' },
    { name: 'Adaçayı · Krem', bg: '#EFE8DA', bgSoft: '#E6DDCA', bgDeep: '#D9CCB1', line: '#CBBD9E',
      green: '#6B8063', greenDeep: '#4F6249', wine: '#8B3A3A', wineDeep: '#6A2626', cream: '#F8F2E5' },
    { name: 'Orman · Fildişi', bg: '#FAF6EE', bgSoft: '#F1EADA', bgDeep: '#E4D9BE', line: '#D0C3A4',
      green: '#3D4F36', greenDeep: '#2C3B27', wine: '#5C2424', wineDeep: '#421616', cream: '#FEFBF4' },
  ];
  const radii = [
    { name: 'Sert', sm: '2px', md: '4px', lg: '6px', pill: '6px' },
    { name: 'Orta', sm: '4px', md: '8px', lg: '14px', pill: '999px' },
    { name: 'Yumuşak', sm: '8px', md: '14px', lg: '22px', pill: '999px' },
  ];

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 80,
      width: 320, padding: 20,
      background: 'var(--bg)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--line)',
      boxShadow: '0 18px 50px rgba(42,42,42,0.18)',
      fontSize: 13,
      animation: 'fadeUp 220ms var(--ease-out)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="sliders" size={14}/>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17 }}>Tweaks</div>
        </div>
        <button onClick={onToggle} style={{ color: 'var(--ink-muted)' }}>
          <Icon name="close" size={14}/>
        </button>
      </div>

      <div className="eyebrow" style={{ marginBottom: 10 }}>PALET</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {palettes.map(p => {
          const active = tokens.bg === p.bg && tokens.green === p.green;
          return (
            <button key={p.name} onClick={() => onChange({ ...tokens, ...p })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px',
                      background: active ? 'var(--bg-soft)' : 'transparent',
                      border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left', width: '100%',
                    }}>
              <div style={{ display: 'flex', gap: 0 }}>
                {[p.bg, p.green, p.wine].map((c, i) => (
                  <div key={i} style={{ width: 18, height: 26, background: c,
                                        border: '1px solid rgba(0,0,0,0.05)' }}/>
                ))}
              </div>
              <div style={{ fontSize: 12 }}>{p.name}</div>
              {active && <Icon name="check" size={13}/>}
            </button>
          );
        })}
      </div>

      <div className="eyebrow" style={{ marginBottom: 10 }}>KÖŞE</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {radii.map(r => {
          const active = tokens.radiusMd === r.md;
          return (
            <button key={r.name} onClick={() => onChange({
              ...tokens, radiusSm: r.sm, radiusMd: r.md, radiusLg: r.lg, radiusPill: r.pill,
            })} style={{
              flex: 1, padding: '8px 10px',
              fontSize: 12,
              background: active ? 'var(--ink)' : 'transparent',
              color: active ? 'var(--cream)' : 'var(--ink)',
              border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
              borderRadius: r.pill === '999px' ? 999 : r.md,
            }}>{r.name}</button>
          );
        })}
      </div>

      <div style={{ fontSize: 11, color: 'var(--ink-muted)', lineHeight: 1.5 }}>
        Değişiklikler canlı uygulanır. Sağ üstten menüyü kapatabilirsin.
      </div>
    </div>
  );
}

// ------- Ana App -------
function App() {
  const [tokens, setTokens] = React.useState(TOKENS);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  const [tweaksAvailable, setTweaksAvailable] = React.useState(false);

  const [route, setRoute] = React.useState('welcome');   // welcome | signin | signup | upload | catalog | tryon | favorites | profile
  const [user, setUser] = React.useState(null);
  const [photo, setPhoto] = React.useState(null);
  const [selected, setSelected] = React.useState([]);    // denemeye eklenenler
  const [favorites, setFavorites] = React.useState([]);
  const [modalProduct, setModalProduct] = React.useState(null);
  const [buyProduct, setBuyProduct] = React.useState(null);

  // Persist route
  React.useEffect(() => {
    const saved = localStorage.getItem('bs-route');
    const u = localStorage.getItem('bs-user');
    if (u) {
      try { setUser(JSON.parse(u)); if (saved) setRoute(saved); } catch {}
    }
  }, []);
  React.useEffect(() => { localStorage.setItem('bs-route', route); }, [route]);

  // Edit mode hookup
  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksAvailable(true) || setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const onToggleSelect = (p) => {
    setSelected(prev => prev.some(s => s.id === p.id)
      ? prev.filter(s => s.id !== p.id)
      : [...prev, p]);
  };
  const onToggleFav = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const onAuthSuccess = (u) => {
    setUser(u);
    localStorage.setItem('bs-user', JSON.stringify(u));
    setRoute('upload');
  };

  const onLogout = () => {
    setUser(null); localStorage.removeItem('bs-user');
    setRoute('welcome');
  };

  const showNav = ['upload', 'catalog', 'tryon', 'favorites', 'profile'].includes(route) && user;

  return (
    <div>
      <style>{injectTokens(tokens)}</style>
      <style>{GLOBAL_CSS}</style>

      {showNav && (
        <AppNav current={route} onNav={setRoute} user={user}
                selectedCount={selected.length}
                onTryOn={() => setRoute('tryon')}/>
      )}

      {route === 'welcome' && (
        <WelcomeScreen onEnter={setRoute}/>
      )}
      {(route === 'signin' || route === 'signup') && (
        <AuthScreen mode={route}
                    onSwitch={() => setRoute(route === 'signup' ? 'signin' : 'signup')}
                    onBack={() => setRoute('welcome')}
                    onSuccess={onAuthSuccess}/>
      )}
      {route === 'upload' && user && (
        <UploadScreen photo={photo} onPhoto={setPhoto}
                      onContinue={() => setRoute('catalog')}/>
      )}
      {route === 'catalog' && user && (
        <CatalogScreen
          selected={selected}
          onToggleSelect={onToggleSelect}
          onOpenProduct={setModalProduct}
          favorites={favorites}
          onToggleFav={onToggleFav}
          onTryOn={() => setRoute('tryon')}/>
      )}
      {route === 'tryon' && user && (
        <TryOnScreen photo={photo} selected={selected}
                     favorites={favorites}
                     onToggleFav={onToggleFav}
                     onBuy={setBuyProduct}
                     onBackToCatalog={() => setRoute(photo ? 'catalog' : 'upload')}/>
      )}
      {route === 'favorites' && user && (
        <FavoritesScreen favorites={favorites}
                         onToggleFav={onToggleFav}
                         onOpenProduct={setModalProduct}
                         onToggleSelect={onToggleSelect}
                         selected={selected}
                         onGoCatalog={() => setRoute('catalog')}/>
      )}
      {route === 'profile' && user && (
        <ProfileScreen user={user}
                       favorites={favorites} selected={selected}
                       photo={photo}
                       onDeletePhoto={() => setPhoto(null)}/>
      )}

      <ProductModal product={modalProduct}
                    selected={modalProduct && selected.some(s => s.id === modalProduct.id)}
                    fav={modalProduct && favorites.includes(modalProduct.id)}
                    onClose={() => setModalProduct(null)}
                    onSelect={() => { onToggleSelect(modalProduct); }}
                    onFav={() => onToggleFav(modalProduct.id)}
                    onBuy={(p) => { setModalProduct(null); setBuyProduct(p); }}/>
      <BuyModal product={buyProduct} onClose={() => setBuyProduct(null)}/>

      {/* Floating tweaks toggle — always available when tweaks on */}
      {tweaksAvailable && !tweaksOpen && (
        <button onClick={() => setTweaksOpen(true)} style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 75,
          width: 44, height: 44, borderRadius: '50%',
          background: 'var(--ink)', color: 'var(--cream)',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 8px 24px rgba(42,42,42,0.2)',
        }}><Icon name="sliders" size={16}/></button>
      )}
      <TweaksPanel tokens={tokens} onChange={setTokens}
                   open={tweaksOpen}
                   onToggle={() => setTweaksOpen(!tweaksOpen)}/>
    </div>
  );
}

(function mount() {
  const el = document.getElementById('root');
  if (!el) { setTimeout(mount, 20); return; }
  ReactDOM.createRoot(el).render(<App/>);
})();
