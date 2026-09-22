// Fotoğraf yükleme ekranı — drag & drop + örnek portreler

function UploadScreen({ photo, onPhoto, onContinue }) {
  const [dragging, setDragging] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleFile = (file) => {
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      onPhoto({ kind: 'upload', src: e.target.result, name: file.name });
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const samples = [
    { seed: 1, label: 'örnek A' },
    { seed: 3, label: 'örnek B' },
    { seed: 5, label: 'örnek C' },
    { seed: 7, label: 'örnek D' },
  ];

  return (
    <div style={{
      maxWidth: 1180, margin: '0 auto',
      padding: 'clamp(36px, 6vh, 72px) clamp(20px, 4vw, 48px) 80px',
    }}>
      <div style={{ maxWidth: 720, marginBottom: 48 }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>ADIM 1 / 3 · FOTOĞRAF</div>
        <h1 style={{
          fontSize: 'clamp(40px, 5vw, 64px)',
          lineHeight: 1.05, fontWeight: 300, letterSpacing: '-0.02em',
          marginBottom: 18,
        }}>
          Kendi fotoğrafını <span style={{ fontStyle: 'italic' }}>yükle.</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 560 }}>
          Yüzün net görünen, ön cepheden, saçın toplanmış bir fotoğraf en iyi sonucu verir.
          Kamera kullanılmaz — dosyan sadece denem e sırasında işlenir.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
        gap: 40,
        alignItems: 'start',
      }} className="upload-grid">
        {/* Sol — yükleme alanı */}
        <div>
          <label
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFile(e.dataTransfer.files[0]);
            }}
            style={{
              display: 'block',
              position: 'relative',
              aspectRatio: '4/3',
              background: dragging ? 'var(--bg-deep)' : 'var(--bg-soft)',
              border: `1.5px dashed ${dragging ? 'var(--green)' : 'var(--line)'}`,
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'all 200ms var(--ease-out)',
            }}>
            <input type="file" accept="image/*" style={{ display: 'none' }}
                   onChange={(e) => handleFile(e.target.files[0])}/>

            {photo ? (
              <>
                {photo.kind === 'sample' ? (
                  <PortraitPlaceholder seed={photo.seed} aspect="unset"
                                       style={{ width: '100%', height: '100%', aspectRatio: 'unset' }}/>
                ) : (
                  <img src={photo.src} alt="yüklenen"
                       style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                )}
                <div style={{
                  position: 'absolute', right: 14, top: 14,
                  display: 'flex', gap: 8,
                }}>
                  <button onClick={(e) => { e.preventDefault(); onPhoto(null); }}
                          className="app-btn app-btn-ghost"
                          style={{
                            padding: '8px 14px', fontSize: 12,
                            background: 'rgba(245,239,228,0.92)',
                          }}>
                    <Icon name="trash" size={13}/> Değiştir
                  </button>
                </div>
                <div style={{
                  position: 'absolute', left: 14, bottom: 14,
                  padding: '6px 12px',
                  background: 'rgba(42,42,42,0.72)', color: 'var(--cream)',
                  borderRadius: 'var(--radius-pill)',
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}>
                  <Icon name="check" size={11}/> fotoğraf hazır
                </div>
              </>
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: 40, textAlign: 'center', gap: 14,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--green)', color: 'var(--cream)',
                  display: 'grid', placeItems: 'center',
                }}>
                  <Icon name="upload" size={22}/>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, marginBottom: 4 }}>
                    {loading ? 'Yükleniyor…' : dragging ? 'Bırak' : 'Fotoğrafını sürükle'}
                  </div>
                  <div style={{ color: 'var(--ink-muted)', fontSize: 14 }}>
                    ya da <span style={{ borderBottom: '1px solid var(--ink)' }}>dosya seç</span>
                    {' · '}JPG · PNG · max 10MB
                  </div>
                </div>
              </div>
            )}
          </label>

          <div className="eyebrow" style={{ marginTop: 28, marginBottom: 12 }}>
            — ya da örneklerden biriyle dene
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {samples.map(s => (
              <button key={s.seed}
                      onClick={() => onPhoto({ kind: 'sample', seed: s.seed })}
                      style={{
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        outline: photo?.kind === 'sample' && photo.seed === s.seed
                          ? '2px solid var(--green)' : '1px solid var(--line)',
                        outlineOffset: photo?.kind === 'sample' && photo.seed === s.seed ? 2 : 0,
                        transition: 'all 160ms var(--ease-out)',
                      }}>
                <PortraitPlaceholder seed={s.seed} label={s.label} aspect="1/1"/>
              </button>
            ))}
          </div>
        </div>

        {/* Sağ — rehber */}
        <div style={{
          padding: 28,
          background: 'var(--bg-soft)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--line)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>İPUÇLARI</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { t: 'Net ışık', d: 'Gün ışığı en iyisi. Yandan/önden gelen yumuşak ışık tercih edilir.' },
              { t: 'Ön cephe', d: 'Kameraya dönük, baş düz dursun.' },
              { t: 'Toplu saç', d: 'Saçın toplanmış ya da geride olması daha iyi sonuç verir.' },
              { t: 'Düz arka plan', d: 'Mümkünse düz duvar ya da sade arka plan seç.' },
            ].map((tip, i) => (
              <div key={tip.t} style={{ display: 'flex', gap: 14 }}>
                <div style={{
                  width: 26, height: 26, flexShrink: 0,
                  borderRadius: '50%', background: 'var(--cream)',
                  border: '1px solid var(--line)',
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--font-serif)', fontSize: 14,
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: 2 }}>{tip.t}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{tip.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="divider-dotted" style={{ margin: '24px 0' }}/>

          <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6 }}>
            Fotoğrafın yalnızca deneme işlemi sırasında işlenir. İstediğin zaman silebilirsin.
          </div>
        </div>
      </div>

      {/* Continue */}
      <div style={{
        marginTop: 48,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 28, borderTop: '1px solid var(--line)',
      }}>
        <div className="eyebrow">{photo ? 'FOTOĞRAF HAZIR' : 'FOTOĞRAF BEKLENİYOR'}</div>
        <button className="app-btn app-btn-primary"
                disabled={!photo}
                style={{
                  padding: '16px 32px',
                  opacity: photo ? 1 : 0.4,
                  cursor: photo ? 'pointer' : 'not-allowed',
                }}
                onClick={onContinue}>
          Kataloga geç <Icon name="arrow-right" size={16}/>
        </button>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .upload-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

window.UploadScreen = UploadScreen;
