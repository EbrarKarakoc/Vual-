"use client";

import * as React from "react";
import type { StudioProduct } from "@/lib/studio-data";
import { ProductImage } from "./ProductImage";
import { Icon } from "./Icon";

type ProductModalProps = {
  product: StudioProduct | null;
  selected: boolean;
  fav: boolean;
  onClose: () => void;
  onSelect: () => void;
  onFav: () => void;
  onBuy: (p: StudioProduct) => void;
};

export function ProductModal({
  product,
  selected,
  fav,
  onClose,
  onSelect,
  onFav,
  onBuy,
}: ProductModalProps) {
  if (!product) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(42,42,42,0.55)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn 200ms var(--ease-out)",
      }}
      onClick={onClose}
    >
      <div
        className="modal-grid"
        style={{
          width: "100%",
          maxWidth: 920,
          maxHeight: "92vh",
          overflow: "auto",
          background: "var(--bg)",
          borderRadius: "var(--radius-lg)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ background: "var(--bg-deep)", minHeight: 380, position: "relative" }}>
          <ProductImage
            src={product.image}
            seed={product.seed}
            alt={product.name}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div
          style={{
            padding: 32,
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button
            onClick={onClose}
            aria-label="Kapat"
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid var(--line)",
              background: "transparent",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            <Icon name="close" size={15} />
          </button>

          <div className="eyebrow" style={{ marginBottom: 10 }}>
            {product.brand}
          </div>
          <h2 style={{ fontSize: 36, lineHeight: 1.1, marginBottom: 16 }}>{product.name}</h2>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 22,
              color: "var(--ink-soft)",
              fontSize: 13,
            }}
          >
            <span>
              <Icon name="star" size={12} /> {product.rating}
            </span>
            <span>·</span>
            <span>{product.style}</span>
            <span>·</span>
            <span>{product.color}</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 40,
              marginBottom: 6,
            }}
          >
            ₺{product.price}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink-muted)",
              marginBottom: 22,
            }}
          >
            kargo ücretsiz · 14 gün iade · sponsor mağaza
          </div>
          <p
            style={{
              color: "var(--ink-soft)",
              fontSize: 14,
              lineHeight: 1.65,
              marginBottom: 22,
            }}
          >
            {product.brand} koleksiyonundan {product.name}. {product.style} stili,{" "}
            {product.color.toLowerCase()} tonunda. Rahat kumaş, kolay bağlanır, günlük kullanıma
            uygun.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: "auto",
            }}
          >
            <button
              className="app-btn app-btn-primary"
              style={{ padding: "14px 24px" }}
              onClick={onSelect}
            >
              <Icon name={selected ? "check" : "sparkles"} size={15} />
              {selected ? "Seçildi · Denemeye ekli" : "Denemeye ekle"}
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="app-btn app-btn-wine"
                style={{ padding: "14px 20px", flex: 1 }}
                onClick={() => onBuy(product)}
              >
                <Icon name="bag" size={14} /> Satın al <Icon name="external" size={13} />
              </button>
              <button
                className="app-btn app-btn-ghost"
                style={{ padding: "14px 20px", flex: "0 0 auto" }}
                onClick={onFav}
                aria-label={fav ? "Favoriden çıkar" : "Favorilere ekle"}
              >
                <Icon name={fav ? "heart-fill" : "heart"} size={15} />
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

export function BuyModal({
  product,
  onClose,
}: {
  product: StudioProduct | null;
  onClose: () => void;
}) {
  const [countdown, setCountdown] = React.useState(3);
  React.useEffect(() => {
    if (!product) return;
    setCountdown(3);
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 900);
    return () => clearInterval(t);
  }, [product]);
  if (!product) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(42,42,42,0.65)",
        backdropFilter: "blur(8px)",
        display: "grid",
        placeItems: "center",
        padding: 20,
        animation: "fadeIn 200ms var(--ease-out)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          padding: 36,
          background: "var(--bg)",
          borderRadius: "var(--radius-lg)",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="eyebrow" style={{ marginBottom: 14 }}>
          YÖNLENDİRİLİYORSUN
        </div>
        <h2 style={{ fontSize: 32, marginBottom: 14, lineHeight: 1.15 }}>
          <span style={{ fontStyle: "italic" }}>{product.brand}</span> mağazasına gidiyorsun
        </h2>
        <p
          style={{
            color: "var(--ink-soft)",
            marginBottom: 28,
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          Satın alma işlemi <b>{product.brand}</b> sitesi üzerinde tamamlanır. Biz hiçbir şekilde
          ödeme almayız.
        </p>
        <div
          style={{
            padding: 16,
            background: "var(--bg-soft)",
            borderRadius: "var(--radius-md)",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 14,
            textAlign: "left",
          }}
        >
          <div style={{ width: 56, height: 56, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
            <ProductImage
              src={product.image}
              seed={product.seed}
              alt={product.name}
              aspect="1/1"
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}>{product.name}</div>
            <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{product.brand}</div>
          </div>
          <div style={{ fontWeight: 500 }}>₺{product.price}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} className="app-btn app-btn-ghost" style={{ flex: 1, padding: 14 }}>
            Vazgeç
          </button>
          <button
            className="app-btn app-btn-wine"
            style={{ flex: 2, padding: 14 }}
            onClick={onClose}
          >
            {countdown > 0 ? `${countdown}sn içinde aç` : `${product.brand}'a git`}
            <Icon name="external" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
