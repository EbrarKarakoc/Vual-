// Favoriler, Profil, Ürün detay modal, Satın alma (sponsor) modal

function FavoritesScreen({ favorites, onToggleFav, onOpenProduct, onToggleSelect, selected, onGoCatalog }) {
  const favProducts = ALL_PRODUCTS.filter(p => favorites.includes(p.id));
  if (favProducts.length === 0) {
    return <EmptyState icon="heart" title="Henüz favorin yok"
                       message="Katalogda beğendiklerini kalbe tıklayarak burada topla."
                       action={{ label: 'Kataloğa git', onClick: onGoCatalog }}/>;
  }
  return (
    <div style={{ maxWidth: 1320, margin: '0 auto',
                  padding: 'clamp(36px, 5vh, 56px) clamp(20px, 4vw, 48px) 80px' }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>FAVORİLER · {favProducts.length}</div>
      <h1 style={{ fontSize: 'clamp(36px, 4.6vw, 60px)', lineHeight: 1.05, fontWeight: 300,
                   letterSpacing: '-0.02em', marginBottom: 32 }}>
        Beğendiklerin <span style={{ fontStyle: 'italic' }}>bir arada.</span>
      </h1>
      <div style={{ columnCount: 4, columnGap: 20 }} className="catalog-masonry">
        {favProducts.map(p => (
          <ProductCard key={p.id} product={p}
                       selected={selected.some(s => s.id === p.id)}
                       fav={true}
                       onSelect={() => onToggleSelect(p)}
                       onOpen={() => onOpenProduct(p)}
                       onFav={() => onToggleFav(p.id)}/>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen({ user, favorites, selected, onDeletePhoto, photo }) {
  const stats = [
    { n: favorites.length, l: 'Favori' },
    { n: selected.length, l: 'Seçili deneme' },
    { n: photo ? 1 : 0, l: 'Yüklü fotoğraf' },
  ];
  return (
    <div style={{ maxWidth: 960, margin: '0 auto',
                  padding: 'clamp(36px, 5vh, 56px) clamp(20px, 4vw, 48px) 80px' }}>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center', marginBottom: 40 }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'var(--green)', color: 'var(--cream)',
          display: 'grid', placeItems: 'center',
          fontFamily: 'var(--font-serif)', fontSize: 42,
        }}>
          {(user.name || 'E')[0].toUpperCase()}
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>MERHABA</div>
          <h1 style={{ fontSize: 44, lineHeight: 1.1, fontWeight: 300 }}>
            {user.name || 'Ebrar'}
          </h1>
          <div style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{user.email}</div>
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
        marginBottom: 40,
      }}>
        {stats.map(s => (
          <div key={s.l} style={{
            padding: 24,
            background: 'var(--bg-soft)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--line)',
          }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 44, lineHeight: 1 }}>{s.n}</div>
            <div className="eyebrow" style={{ marginTop: 10 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{
        padding: 24, background: 'var(--bg-soft)',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)',
      }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>AYARLAR</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { t: 'Hesap bilgileri', d: 'İsim, e-posta, şifre' },
            { t: 'Bildirimler', d: 'Yeni ürün ve indirim bildirimleri' },
            { t: 'Gizlilik', d: 'Fotoğraf ve veri kullanımı' },
            { t: 'Yüklü fotoğrafı sil', d: 'Deneme fotoğrafını tamamen kaldır',
              action: photo ? onDeletePhoto : null, warn: true },
          ].map(row => (
            <button key={row.t} onClick={row.action || undefined}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 4px',
                      borderBottom: '1px dashed var(--line)',
                      textAlign: 'left',
                      color: row.warn ? 'var(--wine)' : 'var(--ink)',
                      cursor: row.action ? 'pointer' : 'default',
                      opacity: row.action === null ? 0.4 : 1,
                    }}>
              <div>
                <div style={{ fontWeight: 500 }}>{row.t}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{row.d}</div>
              </div>
              <Icon name="arrow-right" size={14}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductModal({ product, onClose, onSelect, selected, onBuy, onFav, fav }) {
  if (!product) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(42,42,42,0.55)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      animation: 'fadeIn 200ms var(--ease-out)',
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: 920, maxHeight: '92vh', overflow: 'auto',
        background: 'var(--bg)', borderRadius: 'var(--radius-lg)',
        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      }} className="modal-grid" onClick={e => e.stopPropagation()}>
        <div style={{ background: 'var(--bg-deep)', minHeight: 380 }}>
          <ScarfPlaceholder seed={product.seed} aspect="unset"
                            style={{ width: '100%', height: '100%', aspectRatio: 'unset' }}/>
        </div>
        <div style={{ padding: 32, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 18, right: 18,
            width: 36, height: 36, borderRadius: '50%',
            border: '1px solid var(--line)',
            display: 'grid', placeItems: 'center',
          }}><Icon name="close" size={15}/></button>

          <div className="eyebrow" style={{ marginBottom: 10 }}>{product.brand}</div>
          <h2 style={{ fontSize: 36, lineHeight: 1.1, marginBottom: 16 }}>{product.name}</h2>
          <div style={{ display: 'flex', gap: 12, marginBottom: 22, color: 'var(--ink-soft)', fontSize: 13 }}>
            <span><Icon name="star" size={12}/> {product.rating}</span>
            <span>·</span><span>{product.style}</span>
            <span>·</span><span>{product.color}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 40, marginBottom: 6 }}>
            ₺{product.price}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 22 }}>
            kargo ücretsiz · 14 gün iade · sponsor mağaza
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.65, marginBottom: 22 }}>
            {product.brand} koleksiyonundan {product.name}. {product.style} stili,
            {' '}{product.color.toLowerCase()} tonunda. Rahat kumaş, kolay bağlanır, günlük kullanıma uygun.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
            <button className="app-btn app-btn-primary"
                    style={{ padding: '14px 24px' }}
                    onClick={onSelect}>
              <Icon name={selected ? 'check' : 'sparkles'} size={15}/>
              {selected ? 'Seçildi · Denemeye ekli' : 'Denemeye ekle'}
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="app-btn app-btn-wine"
                      style={{ padding: '14px 20px', flex: 1 }}
                      onClick={() => onBuy(product)}>
                <Icon name="bag" size={14}/> Satın al <Icon name="external" size={13}/>
              </button>
              <button className="app-btn app-btn-ghost"
                      style={{ padding: '14px 20px', flex: '0 0 auto' }}
                      onClick={onFav}>
                <Icon name={fav ? 'heart-fill' : 'heart'} size={15}/>
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 720px) {
          .modal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function BuyModal({ product, onClose }) {
  const [countdown, setCountdown] = React.useState(3);
  React.useEffect(() => {
    if (!product) return;
    setCountdown(3);
    const t = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 0)), 900);
    return () => clearInterval(t);
  }, [product]);
  if (!product) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: 'rgba(42,42,42,0.65)', backdropFilter: 'blur(8px)',
      display: 'grid', placeItems: 'center', padding: 20,
      animation: 'fadeIn 200ms var(--ease-out)',
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: 480, padding: 36,
        background: 'var(--bg)', borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
      }} onClick={e => e.stopPropagation()}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>YÖNLENDİRİLİYORSUN</div>
        <h2 style={{ fontSize: 32, marginBottom: 14, lineHeight: 1.15 }}>
          <span style={{ fontStyle: 'italic' }}>{product.brand}</span> mağazasına gidiyorsun
        </h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 28, fontSize: 14, lineHeight: 1.6 }}>
          Satın alma işlemi <b>{product.brand}</b> sitesi üzerinde tamamlanır.
          Biz hiçbir şekilde ödeme almayız.
        </p>
        <div style={{
          padding: 16, background: 'var(--bg-soft)',
          borderRadius: 'var(--radius-md)', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
            <ScarfPlaceholder seed={product.seed} aspect="1/1"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18 }}>{product.name}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{product.brand}</div>
          </div>
          <div style={{ fontWeight: 500 }}>₺{product.price}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} className="app-btn app-btn-ghost" style={{ flex: 1, padding: '14px' }}>
            Vazgeç
          </button>
          <button className="app-btn app-btn-wine" style={{ flex: 2, padding: '14px' }}
                  onClick={onClose}>
            {countdown > 0 ? `${countdown}sn içinde aç` : `${product.brand}'a git`}
            <Icon name="external" size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FavoritesScreen, ProfileScreen, ProductModal, BuyModal });
