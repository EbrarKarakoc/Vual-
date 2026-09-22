"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ALL_PRODUCTS,
  SPONSORS,
  STYLE_TAGS,
  COLOR_TAGS,
  type StudioProduct,
} from "@/lib/studio-data";
import { Chip, ProductCard } from "@/components/studio/ProductCard";
import { ProductImage } from "@/components/studio/ProductImage";
import { Icon } from "@/components/studio/Icon";
import { ProductModal, BuyModal } from "@/components/studio/Modals";
import { useStudio } from "@/components/studio/StudioProvider";

export default function KatalogPage() {
  const router = useRouter();
  const { selected, toggleSelect, favorites, toggleFav } = useStudio();
  const [filter, setFilter] = useState<{ style: string | null; color: string | null }>({
    style: null,
    color: null,
  });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "price" | "rating">("new");
  const [modalProduct, setModalProduct] = useState<StudioProduct | null>(null);
  const [buyProduct, setBuyProduct] = useState<StudioProduct | null>(null);

  const filtered = useMemo(() => {
    let items = ALL_PRODUCTS.filter((p) => {
      if (filter.style && p.style !== filter.style) return false;
      if (filter.color && p.color !== filter.color) return false;
      if (
        query &&
        !p.name.toLowerCase().includes(query.toLowerCase()) &&
        !p.brand.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
    if (sort === "price") items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "rating") items = [...items].sort((a, b) => Number(b.rating) - Number(a.rating));
    return items;
  }, [filter, query, sort]);

  const modalSelected = modalProduct
    ? selected.some((s) => s.id === modalProduct.id)
    : false;
  const modalFav = modalProduct ? favorites.includes(modalProduct.id) : false;

  return (
    <div style={{ paddingBottom: selected.length > 0 ? 110 : 48 }}>
      {/* Hero header */}
      <div
        style={{
          padding: "clamp(36px, 5vh, 56px) clamp(20px, 4vw, 48px) 24px",
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              ADIM 2 / 3 · KATALOG · {ALL_PRODUCTS.length} ÜRÜN · {SPONSORS.length} MARKA
            </div>
            <h1
              style={{
                fontSize: "clamp(36px, 4.6vw, 60px)",
                lineHeight: 1.05,
                fontWeight: 300,
                letterSpacing: "-0.02em",
              }}
            >
              Beğendiklerini <span style={{ fontStyle: "italic" }}>seç.</span>
            </h1>
            <p
              style={{
                marginTop: 14,
                color: "var(--ink-soft)",
                maxWidth: 520,
                fontSize: 15,
              }}
            >
              İstediğin kadar ekle. Seçtiklerini tek seferde kendi üzerinde deneyebilirsin.
            </p>
          </div>

          {/* Search + sort */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 16px",
                background: "var(--bg-soft)",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--line)",
                minWidth: 240,
              }}
            >
              <Icon name="search" size={15} />
              <input
                placeholder="ara: marka, isim…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 14,
                  flex: 1,
                  color: "var(--ink)",
                }}
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "new" | "price" | "rating")}
              style={{
                padding: "11px 16px",
                background: "var(--bg-soft)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-pill)",
                fontSize: 13,
                color: "var(--ink)",
                fontFamily: "inherit",
              }}
            >
              <option value="new">Yeni</option>
              <option value="price">Fiyat</option>
              <option value="rating">Puan</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <span className="eyebrow" style={{ marginRight: 12 }}>
              STİL
            </span>
            {STYLE_TAGS.map((t) => (
              <Chip
                key={t}
                active={filter.style === t}
                onClick={() =>
                  setFilter({ ...filter, style: filter.style === t ? null : t })
                }
              >
                {t}
              </Chip>
            ))}
          </div>
          <div style={{ height: 20, width: 1, background: "var(--line)" }} />
          <div>
            <span className="eyebrow" style={{ marginRight: 12 }}>
              RENK
            </span>
            {COLOR_TAGS.map((t) => (
              <Chip
                key={t}
                active={filter.color === t}
                onClick={() =>
                  setFilter({ ...filter, color: filter.color === t ? null : t })
                }
              >
                {t}
              </Chip>
            ))}
          </div>
          {(filter.style || filter.color || query) && (
            <button
              onClick={() => {
                setFilter({ style: null, color: null });
                setQuery("");
              }}
              style={{
                fontSize: 13,
                color: "var(--wine)",
                borderBottom: "1px solid currentColor",
                background: "none",
                border: "none",
                borderBottomStyle: "solid",
                borderBottomWidth: 1,
                borderBottomColor: "currentColor",
                cursor: "pointer",
                padding: "2px 0",
              }}
            >
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          padding: "8px clamp(20px, 4vw, 48px) 40px",
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        <div className="catalog-masonry">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              selected={selected.some((s) => s.id === p.id)}
              fav={favorites.includes(p.id)}
              onSelect={() => toggleSelect(p)}
              onOpen={() => setModalProduct(p)}
              onFav={() => toggleFav(p.id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            style={{
              padding: 80,
              textAlign: "center",
              color: "var(--ink-muted)",
            }}
          >
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, marginBottom: 10 }}>
              Sonuç yok
            </div>
            <div>Filtreleri değiştirmeyi dene.</div>
          </div>
        )}
      </div>

      {/* Selection bar */}
      {selected.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(42,42,42,0.96)",
            backdropFilter: "blur(10px)",
            color: "var(--cream)",
            padding: "16px clamp(20px, 4vw, 48px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            zIndex: 15,
            animation: "fadeUp 300ms var(--ease-out)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, overflow: "hidden" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--wine)",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--font-serif)",
                fontSize: 16,
              }}
            >
              {selected.length}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                {selected.length} başörtü seçildi
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  color: "rgba(245,239,228,0.6)",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 380,
                }}
              >
                {selected.map((s) => s.name).join(" · ")}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 4, marginRight: 10 }}>
              {selected.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  style={{ width: 34, height: 34, overflow: "hidden", borderRadius: 6 }}
                >
                  <ProductImage src={s.image} seed={s.seed} alt={s.name} aspect="1/1" />
                </div>
              ))}
              {selected.length > 5 && (
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 6,
                    background: "rgba(245,239,228,0.12)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 11,
                  }}
                >
                  +{selected.length - 5}
                </div>
              )}
            </div>
            <button
              className="app-btn app-btn-wine"
              style={{ padding: "12px 22px" }}
              onClick={() => router.push("/try-on")}
            >
              <Icon name="sparkles" size={15} /> Hepsini dene
            </button>
          </div>
        </div>
      )}

      <ProductModal
        product={modalProduct}
        selected={modalSelected}
        fav={modalFav}
        onClose={() => setModalProduct(null)}
        onSelect={() => modalProduct && toggleSelect(modalProduct)}
        onFav={() => modalProduct && toggleFav(modalProduct.id)}
        onBuy={(p) => {
          setModalProduct(null);
          setBuyProduct(p);
        }}
      />
      <BuyModal product={buyProduct} onClose={() => setBuyProduct(null)} />
    </div>
  );
}
