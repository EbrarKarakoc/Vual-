"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudio } from "@/components/studio/StudioProvider";
import { PortraitPlaceholder } from "@/components/studio/Placeholders";
import { ProductImage } from "@/components/studio/ProductImage";
import { Icon } from "@/components/studio/Icon";
import { BuyModal } from "@/components/studio/Modals";
import type { StudioProduct } from "@/lib/studio-data";

type EmptyStateProps = {
  icon: "image" | "sparkles" | "heart";
  title: string;
  message: string;
  action: { label: string; onClick: () => void };
};

function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "120px 32px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "var(--bg-soft)",
          border: "1px solid var(--line)",
          display: "grid",
          placeItems: "center",
          margin: "0 auto 24px",
          color: "var(--green)",
        }}
      >
        <Icon name={icon} size={26} />
      </div>
      <h2 style={{ fontSize: 32, marginBottom: 12 }}>{title}</h2>
      <p style={{ color: "var(--ink-soft)", marginBottom: 28 }}>{message}</p>
      <button className="app-btn app-btn-primary" onClick={action.onClick}>
        {action.label} <Icon name="arrow-right" size={15} />
      </button>
    </div>
  );
}

export default function TryOnPage() {
  const router = useRouter();
  const { photo, selected, favorites, toggleFav } = useStudio();
  const [activeIdx, setActiveIdx] = useState(0);
  const [buyProduct, setBuyProduct] = useState<StudioProduct | null>(null);

  // AI durumu: ürün ID + fotoğraf hash'ine göre önbellek.
  const [aiCache, setAiCache] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (activeIdx >= selected.length && selected.length > 0) setActiveIdx(0);
  }, [selected.length, activeIdx]);

  // activeIdx güvenli mi?
  const cur = selected[activeIdx];
  const photoKey =
    photo?.kind === "upload"
      ? photo.src.slice(-60) // base64'un son 60 karakteri hash yerine geçer
      : photo?.kind === "sample"
        ? `sample-${photo.seed}`
        : null;
  const cacheKey = cur && photoKey ? `${photoKey}::${cur.id}` : null;
  const aiImage = cacheKey ? aiCache[cacheKey] : null;

  // AI üretimi: yalnızca yüklenmiş (upload) fotoğraflarda devreye girer.
  useEffect(() => {
    setAiError(null);
    if (!cur || !photo || photo.kind !== "upload" || !cacheKey) {
      setAiLoading(false);
      return;
    }
    // Önbellekte varsa tekrar isteme
    if (aiCache[cacheKey]) {
      setAiLoading(false);
      return;
    }
    let cancelled = false;
    setAiLoading(true);
    (async () => {
      try {
        const res = await fetch("/api/try-on", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userPhotoDataUrl: photo.src,
            productName: cur.name,
            productStyle: cur.style,
            productColor: cur.color,
          }),
        });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || !json.image) {
          throw new Error(json.error || `HTTP ${res.status}`);
        }
        setAiCache((prev) => ({ ...prev, [cacheKey]: json.image }));
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "AI denemesi başarısız";
        setAiError(msg);
        console.error("[try-on]", err);
      } finally {
        if (!cancelled) setAiLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  // Sample fotoğraflarda (gerçek upload değil) kısa bir "hazırlanıyor" animasyonu
  const [sampleProcessing, setSampleProcessing] = useState(false);
  useEffect(() => {
    if (photo?.kind !== "sample") return;
    setSampleProcessing(true);
    const t = setTimeout(() => setSampleProcessing(false), 1400);
    return () => clearTimeout(t);
  }, [activeIdx, photo?.kind]);

  // Birleşik loading state
  const processing =
    photo?.kind === "upload" ? aiLoading && !aiImage : sampleProcessing;

  if (!photo) {
    return (
      <EmptyState
        icon="image"
        title="Önce fotoğraf yükle"
        message="Denemeye başlamak için bir fotoğrafa ihtiyacımız var."
        action={{ label: "Fotoğrafa git", onClick: () => router.push("/dene") }}
      />
    );
  }

  if (selected.length === 0) {
    return (
      <EmptyState
        icon="sparkles"
        title="Hiç başörtü seçmedin"
        message="Katalogdan bir veya daha fazla ürün seç, hepsini birden deneyebilirsin."
        action={{ label: "Kataloga git", onClick: () => router.push("/katalog") }}
      />
    );
  }

  // cur yukarıda tanımlandı; tone aşağıda hesaplanır.
  const tone = {
    bg: ["#D9CBAC", "#E8DCC0", "#C9B99A", "#DFD0B2"][cur.seed % 4],
    ink: ["#4A5D3E", "#7A2E2E", "#394A2F", "#5C1F1F"][cur.seed % 4],
  };

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "clamp(28px, 4vh, 48px) clamp(20px, 4vw, 48px) 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 32,
        }}
      >
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            ADIM 3 / 3 · DENEME · {activeIdx + 1}/{selected.length}
          </div>
          <h1
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: 1.05,
              fontWeight: 300,
              letterSpacing: "-0.02em",
            }}
          >
            Kendi üzerinde <span style={{ fontStyle: "italic" }}>gör.</span>
          </h1>
        </div>
        <button
          onClick={() => router.push("/katalog")}
          className="app-btn app-btn-ghost"
        >
          <Icon name="arrow-left" size={15} /> Kataloğa dön
        </button>
      </div>

      <div
        className="tryon-grid"
        style={{
          display: "grid",
          gap: 28,
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
        }}
      >
        {/* Left — canvas */}
        <div>
          <div
            style={{
              position: "relative",
              aspectRatio: "4/5",
              background: tone.bg,
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            {aiImage ? (
              // AI tarafından üretilmiş gerçekçi deneme görseli
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={aiImage}
                alt={`${cur.name} AI denemesi`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  animation: "fadeIn 500ms var(--ease-out)",
                }}
              />
            ) : (
              <>
                {photo.kind === "sample" ? (
                  <PortraitPlaceholder
                    seed={photo.seed}
                    aspect="unset"
                    tone={tone}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.src}
                    alt="yüklenen"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: processing ? "saturate(0.6) brightness(0.95)" : "none",
                      transition: "filter 600ms var(--ease-out)",
                    }}
                  />
                )}

                {/* Sample fotoğraf veya AI başarısızsa CSS overlay (fallback) */}
                <div
                  style={{
                    position: "absolute",
                    top: "-2%",
                    left: "6%",
                    right: "6%",
                    height: "62%",
                    opacity: processing ? 0 : 0.92,
                    transition: "opacity 700ms var(--ease-out)",
                    pointerEvents: "none",
                    clipPath:
                      "polygon(50% 0%, 78% 3%, 94% 16%, 100% 42%, 100% 100%, 0% 100%, 0% 42%, 6% 16%, 22% 3%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 55% 60% at 50% 80%, transparent 48%, #000 62%)",
                    maskImage:
                      "radial-gradient(ellipse 55% 60% at 50% 80%, transparent 48%, #000 62%)",
                    filter: "drop-shadow(0 8px 18px rgba(42,42,42,0.25))",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cur.image}
                    alt={cur.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      mixBlendMode: "multiply",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) parent.style.background = tone.ink;
                    }}
                  />
                </div>
              </>
            )}

            {/* AI hatası (banner) */}
            {aiError && !processing && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  maxWidth: "60%",
                  padding: "10px 14px",
                  background: "rgba(122,46,46,0.92)",
                  color: "var(--cream)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 12,
                  lineHeight: 1.4,
                  backdropFilter: "blur(4px)",
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: 2 }}>
                  AI denemesi yapılamadı
                </div>
                <div style={{ opacity: 0.85, fontSize: 11 }}>
                  {aiError.length > 80 ? aiError.slice(0, 80) + "…" : aiError}
                </div>
              </div>
            )}

            {processing && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(42,42,42,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 18,
                  color: "var(--cream)",
                  backdropFilter: "blur(2px)",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "2px solid rgba(245,239,228,0.2)",
                    borderTopColor: "var(--cream)",
                    animation: "spin 900ms linear infinite",
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 20,
                  }}
                >
                  {photo.kind === "upload"
                    ? "Gemini başörtüsünü uyguluyor…"
                    : "AI ile uygulanıyor…"}
                </div>
                <div className="eyebrow" style={{ color: "inherit", opacity: 0.8 }}>
                  {cur.brand.toUpperCase()} · {cur.name.toUpperCase()}
                </div>
                {photo.kind === "upload" && (
                  <div
                    style={{
                      fontSize: 11,
                      opacity: 0.6,
                      letterSpacing: "0.08em",
                    }}
                  >
                    bu işlem 5–15 saniye sürebilir
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                padding: "6px 12px",
                background: "rgba(245,239,228,0.9)",
                backdropFilter: "blur(4px)",
                borderRadius: "var(--radius-pill)",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.16em",
                color: "var(--ink)",
                textTransform: "uppercase",
              }}
            >
              <Icon name="sparkles" size={11} /> AI · preview
            </div>
          </div>

          {/* Nav */}
          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <button
              onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
              disabled={activeIdx === 0}
              aria-label="Önceki"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid var(--line)",
                background: "transparent",
                display: "grid",
                placeItems: "center",
                opacity: activeIdx === 0 ? 0.3 : 1,
                cursor: activeIdx === 0 ? "not-allowed" : "pointer",
              }}
            >
              <Icon name="arrow-left" size={16} />
            </button>
            <div style={{ flex: 1, overflow: "auto", display: "flex", gap: 8 }}>
              {selected.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIdx(i)}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    flexShrink: 0,
                    overflow: "hidden",
                    outline: i === activeIdx ? "2px solid var(--green)" : "1px solid var(--line)",
                    outlineOffset: i === activeIdx ? 2 : 0,
                    transition: "all 140ms var(--ease-out)",
                    background: "none",
                    padding: 0,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <ProductImage src={p.image} seed={p.seed} alt={p.name} aspect="1/1" />
                </button>
              ))}
            </div>
            <button
              onClick={() => setActiveIdx(Math.min(selected.length - 1, activeIdx + 1))}
              disabled={activeIdx === selected.length - 1}
              aria-label="Sonraki"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid var(--line)",
                background: "transparent",
                display: "grid",
                placeItems: "center",
                opacity: activeIdx === selected.length - 1 ? 0.3 : 1,
                cursor: activeIdx === selected.length - 1 ? "not-allowed" : "pointer",
              }}
            >
              <Icon name="arrow-right" size={16} />
            </button>
          </div>
        </div>

        {/* Right — product detail */}
        <div>
          <div
            style={{
              padding: 28,
              background: "var(--bg-soft)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--line)",
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              {cur.brand}
            </div>
            <h2 style={{ fontSize: 32, lineHeight: 1.1, marginBottom: 14 }}>{cur.name}</h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 22,
                color: "var(--ink-soft)",
                fontSize: 13,
              }}
            >
              <span>
                <Icon name="star" size={12} /> {cur.rating}
              </span>
              <span>·</span>
              <span>{cur.style}</span>
              <span>·</span>
              <span>{cur.color}</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                paddingBottom: 22,
                borderBottom: "1px dashed var(--line)",
              }}
            >
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 40 }}>
                ₺{cur.price}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>kargo dahil</div>
            </div>

            <div
              style={{
                padding: "20px 0",
                fontSize: 14,
                color: "var(--ink-soft)",
                lineHeight: 1.65,
              }}
            >
              {cur.name} — {cur.brand} koleksiyonundan. İnce doku, rahat bağlama. Satın alma
              işlemi sponsor mağaza üzerinden tamamlanır.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className="app-btn app-btn-wine"
                style={{ padding: "16px 24px", width: "100%" }}
                onClick={() => setBuyProduct(cur)}
              >
                <Icon name="bag" size={15} /> {cur.brand}&apos;dan satın al{" "}
                <Icon name="external" size={14} />
              </button>
              <button
                className="app-btn app-btn-ghost"
                style={{ padding: "14px 24px", width: "100%" }}
                onClick={() => toggleFav(cur.id)}
              >
                <Icon
                  name={favorites.includes(cur.id) ? "heart-fill" : "heart"}
                  size={15}
                />
                {favorites.includes(cur.id) ? "Favorilerinde" : "Favoriye ekle"}
              </button>
            </div>

            <div className="divider-dotted" style={{ margin: "22px 0" }} />

            <div
              style={{
                fontSize: 12,
                color: "var(--ink-muted)",
                lineHeight: 1.6,
              }}
            >
              <Icon name="sparkles" size={11} /> Deneme önizlemedir. Gerçek ürün ışık, doku ve
              bağlama şekline göre farklılık gösterebilir.
            </div>
          </div>

          {/* Others */}
          <div style={{ marginTop: 18 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              DİĞERLERİ
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
              }}
            >
              {selected
                .filter((_, i) => i !== activeIdx)
                .slice(0, 3)
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() =>
                      setActiveIdx(selected.findIndex((s) => s.id === p.id))
                    }
                    style={{
                      borderRadius: "var(--radius-md)",
                      overflow: "hidden",
                      border: "1px solid var(--line)",
                      background: "none",
                      padding: 0,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <ProductImage src={p.image} seed={p.seed} alt={p.name} aspect="1/1" />
                    <div style={{ padding: "8px 10px" }}>
                      <div style={{ fontSize: 12, fontFamily: "var(--font-serif)" }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>
                        ₺{p.price}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <BuyModal product={buyProduct} onClose={() => setBuyProduct(null)} />

      <style>{`
        @media (max-width: 900px) {
          .tryon-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
