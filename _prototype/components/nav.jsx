// Navbar (app içi — auth sonrası) + Uygulama kabuğu

function AppNav({ current, onNav, user, selectedCount, onTryOn }) {
  const items = [
    { id: 'upload', label: 'Fotoğraf', icon: 'image' },
    { id: 'catalog', label: 'Katalog', icon: 'grid' },
    { id: 'tryon', label: 'Deneme', icon: 'sparkles' },
    { id: 'favorites', label: 'Favoriler', icon: 'heart' },
    { id: 'profile', label: 'Profil', icon: 'user' },
  ];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: 'rgba(245,239,228,0.88)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px clamp(20px, 4vw, 48px)',
        gap: 20,
      }}>
        <Logo size={20}/>

        <nav style={{ display: 'flex', gap: 4 }} className="app-nav-items">
          {items.map(it => {
            const active = current === it.id;
            return (
              <button key={it.id} onClick={() => onNav(it.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 16px',
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                color: active ? 'var(--cream)' : 'var(--ink-soft)',
                background: active ? 'var(--ink)' : 'transparent',
                borderRadius: 'var(--radius-pill)',
                transition: 'all 180ms var(--ease-out)',
              }}>
                <Icon name={it.icon} size={14}/>
                {it.label}
              </button>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {selectedCount > 0 && current !== 'tryon' && (
            <button className="app-btn app-btn-wine"
                    style={{ padding: '10px 18px', fontSize: 13 }}
                    onClick={onTryOn}>
              <Icon name="sparkles" size={14}/> {selectedCount} ürünü dene
            </button>
          )}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 13, color: 'var(--ink-soft)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--green)', color: 'var(--cream)',
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--font-serif)', fontSize: 15,
            }}>
              {(user?.name || 'M')[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 780px) {
          .app-nav-items { display: none !important; }
        }
      `}</style>
    </header>
  );
}

window.AppNav = AppNav;
