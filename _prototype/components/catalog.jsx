// Katalog + ürün verisi + filtreler + çoklu seçim

const SPONSORS = [
  'Modanisa', 'Sefamerve', 'Tuğba', 'Armine', 'Aker', 'Karaca Home',
  'İpekevi', 'Kayra', 'Puane', 'Tesettür Dünyası',
];

const STYLE_TAGS = ['Şal', 'Bone', 'Eşarp', 'İpek', 'Pratik', 'Düğün'];
const COLOR_TAGS = ['Bej', 'Yeşil', 'Bordo', 'Siyah', 'Krem', 'Toprak'];

function generateProducts() {
  const names = [
    'Damla Şal', 'İnci Eşarp', 'Zeytin Bone', 'Vişne İpek', 'Krem Düz',
    'Toprak Tonu', 'Zarif Saten', 'Sade Modal', 'Antik Desen', 'Leylak Nefti',
    'Nar Kırmızı', 'Badem Bej', 'Çiğ İpek', 'Nil Yeşili', 'Karanfil Şal',
    'Gül Kurusu', 'Mühür Desen', 'Mirra Tonu', 'Beyaz Gölge', 'Adaçayı',
    'Terra Kumaş', 'Bulut Sade', 'Safran Çizgi', 'Tütsü Örtü',
  ];
  return names.map((n, i) => ({
    id: i + 1,
    name: n,
    brand: SPONSORS[i % SPONSORS.length],
    price: (120 + (i * 37) % 520),
    rating: (4.2 + ((i * 7) % 8) / 10).toFixed(1),
    color: COLOR_TAGS[i % COLOR_TAGS.length],
    style: STYLE_TAGS[i % STYLE_TAGS.length],
    seed: i,
    aspect: (i % 3 === 0) ? '3/4' : (i % 3 === 1 ? '4/5' : '1/1'),
    isNew: i % 7 === 0,
  }));
}

const ALL_PRODUCTS = generateProducts();

function CatalogScreen({ selected, onToggleSelect, onOpenProduct, favorites, onToggleFav, onTryOn }) {
  const [filter, setFilter] = React.useState({ style: null, color: null });
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState('new');

  const filtered = React.useMemo(() => {
    let items = ALL_PRODUCTS.filter(p => {
      if (filter.style && p.style !== filter.style) return false;
      if (filter.color && p.color !== filter.color) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())
                && !p.brand.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    if (sort === 'price') items = [...items].sort((a, b) => a.price - b.price);
    if (sort === 'rating') items = [...items].sort((a, b) => b.rating - a.rating);
    return items;
  }, [filter, query, sort]);

  return (
    <div style={{ paddingBottom: selected.length > 0 ? 110 : 48 }}>
      {/* Hero başlığı */}
      <div style={{
        padding: 'clamp(36px, 5vh, 56px) clamp(20px, 4vw, 48px) 24px',
        maxWidth: 1320, margin: '0 auto',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          gap: 24, flexWrap: 'wrap', marginBottom: 32,
        }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              ADIM 2 / 3 · KATALOG · {ALL_PRODUCTS.length} ÜRÜN · {SPONSORS.length} MARKA
            </div>
            <h1 style={{
              fontSize: 'clamp(36px, 4.6vw, 60px)',
              lineHeight: 1.05, fontWeight: 300, letterSpacing: '-0.02em',
            }}>
              Beğendiklerini <span style={{ fontStyle: 'italic' }}>seç.</span>
            </h1>
            <p style={{ marginTop: 14, color: 'var(--ink-soft)', maxWidth: 520, fontSize: 15 }}>
              İstediğin kadar ekle. Seçtiklerini tek seferde kendi üzerinde deneyebilirsin.
            </p>
          </div>

          {/* Arama + sort */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 16px', background: 'var(--bg-soft)',
              borderRadius: 'var(--radius-pill)', border: '1px solid var(--line)',
              minWidth: 240,
            }}>
              <Icon name="search" size={15}/>
              <input
                placeholder="ara: marka, isim…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, flex: 1 }}/>
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
                    style={{
                      padding: '11px 16px',
                      background: 'var(--bg-soft)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: 13, color: 'var(--ink)',
                      fontFamily: 'inherit',
                    }}>
              <option value="new">Yeni</option>
              <option value="price">Fiyat</option>
              <option value="rating">Puan</option>
            </select>
          </div>
        </div>

        {/* Filtre chips */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <span className="eyebrow" style={{ marginRight: 12 }}>STİL</span>
            {STYLE_TAGS.map(t => (
              <Chip key={t} active={filter.style === t}
                    onClick={() => setFilter({ ...filter, style: filter.style === t ? null : t })}>{t}</Chip>
            ))}
          </div>
          <div style={{ height: 20, width: 1, background: 'var(--line)' }}/>
          <div>
            <span className="eyebrow" style={{ marginRight: 12 }}>RENK</span>
            {COLOR_TAGS.map(t => (
              <Chip key={t} active={filter.color === t}
                    onClick={() => setFilter({ ...filter, color: filter.color === t ? null : t })}>{t}</Chip>
            ))}
          </div>
          {(filter.style || filter.color || query) && (
            <button onClick={() => { setFilter({ style: null, color: null }); setQuery(''); }}
                    style={{ fontSize: 13, color: 'var(--wine)', borderBottom: '1px solid currentColor' }}>
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* Masonry grid */}
      <div style={{
        padding: '8px clamp(20px, 4vw, 48px) 40px',
        maxWidth: 1320, margin: '0 auto',
      }}>
        <div style={{
          columnCount: 4, columnGap: 20,
        }} className="catalog-masonry">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p}
                         selected={selected.some(s => s.id === p.id)}
                         fav={favorites.includes(p.id)}
                         onSelect={() => onToggleSelect(p)}
                         onOpen={() => onOpenProduct(p)}
                         onFav={() => onToggleFav(p.id)}/>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            padding: 80, textAlign: 'center',
            color: 'var(--ink-muted)',
          }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, marginBottom: 10 }}>
              Sonuç yok
            </div>
            <div>Filtreleri değiştirmeyi dene.</div>
          </div>
        )}
      </div>

      {/* Alt bar — seçilenler */}
      {selected.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'rgba(42,42,42,0.96)',
          backdropFilter: 'blur(10px)',
          color: 'var(--cream)',
          padding: '16px clamp(20px, 4vw, 48px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
          zIndex: 15,
          animation: 'fadeUp 300ms var(--ease-out)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, overflow: 'hidden' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--wine)', display: 'grid', placeItems: 'center',
              fontFamily: 'var(--font-serif)', fontSize: 16,
            }}>{selected.length}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                {selected.length} başörtü seçildi
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
                color: 'rgba(245,239,228,0.6)', textTransform: 'uppercase',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 380,
              }}>
                {selected.map(s => s.name).join(' · ')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 4, marginRight: 10 }}>
              {selected.slice(0, 5).map(s => (
                <div key={s.id} style={{ width: 34, height: 34, overflow: 'hidden', borderRadius: 6 }}>
                  <ScarfPlaceholder seed={s.seed} aspect="1/1"/>
                </div>
              ))}
              {selected.length > 5 && (
                <div style={{
                  width: 34, height: 34, borderRadius: 6,
                  background: 'rgba(245,239,228,0.12)',
                  display: 'grid', placeItems: 'center', fontSize: 11,
                }}>+{selected.length - 5}</div>
              )}
            </div>
            <button className="app-btn app-btn-wine"
                    style={{ padding: '12px 22px' }}
                    onClick={onTryOn}>
              <Icon name="sparkles" size={15}/> Hepsini dene
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1080px) { .catalog-masonry { column-count: 3 !important; } }
        @media (max-width: 760px)  { .catalog-masonry { column-count: 2 !important; } }
        @media (max-width: 480px)  { .catalog-masonry { column-count: 1 !important; } }
      `}</style>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 13px', marginRight: 6, marginBottom: 6,
      fontSize: 12, fontWeight: 500,
      background: active ? 'var(--ink)' : 'transparent',
      color: active ? 'var(--cream)' : 'var(--ink)',
      border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
      borderRadius: 'var(--radius-pill)',
      transition: 'all 160ms var(--ease-out)',
    }}>{children}</button>
  );
}

function ProductCard({ product, selected, fav, onSelect, onOpen, onFav }) {
  return (
    <div style={{
      breakInside: 'avoid',
      marginBottom: 20,
      position: 'relative',
      background: 'var(--bg-soft)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      cursor: 'pointer',
      outline: selected ? '2px solid var(--green)' : '1px solid var(--line)',
      outlineOffset: selected ? 2 : 0,
      transition: 'all 180ms var(--ease-out)',
    }}
    onClick={onOpen}>
      <div style={{ position: 'relative' }}>
        <ScarfPlaceholder seed={product.seed} aspect={product.aspect}/>

        {product.isNew && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            padding: '4px 10px', background: 'var(--ink)', color: 'var(--cream)',
            borderRadius: 'var(--radius-pill)',
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
          }}>YENİ</div>
        )}

        {/* Favori */}
        <button
          onClick={(e) => { e.stopPropagation(); onFav(); }}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(245,239,228,0.9)', backdropFilter: 'blur(4px)',
            display: 'grid', placeItems: 'center',
            color: fav ? 'var(--wine)' : 'var(--ink)',
            transition: 'transform 180ms var(--ease-out)',
          }}>
          <Icon name={fav ? 'heart-fill' : 'heart'} size={15}/>
        </button>

        {/* Seç buton overlay */}
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          style={{
            position: 'absolute', bottom: 10, right: 10,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 14px',
            background: selected ? 'var(--green)' : 'rgba(245,239,228,0.94)',
            color: selected ? 'var(--cream)' : 'var(--ink)',
            borderRadius: 'var(--radius-pill)',
            fontSize: 12, fontWeight: 500,
            backdropFilter: 'blur(6px)',
            transition: 'all 160ms var(--ease-out)',
          }}>
          <Icon name={selected ? 'check' : 'sparkles'} size={13}/>
          {selected ? 'Seçildi' : 'Dene'}
        </button>
      </div>

      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, letterSpacing: '-0.01em' }}>
            {product.name}
          </div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>₺{product.price}</div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 6,
          fontSize: 12, color: 'var(--ink-muted)',
        }}>
          <span>{product.brand}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Icon name="star" size={11}/> {product.rating}
          </span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CatalogScreen, ALL_PRODUCTS, SPONSORS });
