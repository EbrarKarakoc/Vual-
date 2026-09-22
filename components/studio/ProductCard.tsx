"use client";

import type { StudioProduct } from "@/lib/studio-data";
import { ProductImage } from "./ProductImage";
import { Icon } from "./Icon";

type Props = {
  product: StudioProduct;
  selected: boolean;
  fav: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onFav: () => void;
};

export function ProductCard({ product, selected, fav, onSelect, onOpen, onFav }: Props) {
  return (
    <div
      style={{
        breakInside: "avoid",
        marginBottom: 20,
        position: "relative",
        background: "var(--bg-soft)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        cursor: "pointer",
        outline: selected ? "2px solid var(--green)" : "1px solid var(--line)",
        outlineOffset: selected ? 2 : 0,
        transition: "all 180ms var(--ease-out)",
      }}
      onClick={onOpen}
    >
      <div style={{ position: "relative" }}>
        <ProductImage
          src={product.image}
          seed={product.seed}
          alt={product.name}
          aspect={product.aspect}
        />

        {product.isNew && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              padding: "4px 10px",
              background: "var(--ink)",
              color: "var(--cream)",
              borderRadius: "var(--radius-pill)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
            }}
          >
            YENİ
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onFav();
          }}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(245,239,228,0.9)",
            backdropFilter: "blur(4px)",
            display: "grid",
            placeItems: "center",
            color: fav ? "var(--wine)" : "var(--ink)",
            transition: "transform 180ms var(--ease-out)",
            border: "none",
            cursor: "pointer",
          }}
          aria-label={fav ? "Favoriden çıkar" : "Favorilere ekle"}
        >
          <Icon name={fav ? "heart-fill" : "heart"} size={15} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 14px",
            background: selected ? "var(--green)" : "rgba(245,239,228,0.94)",
            color: selected ? "var(--cream)" : "var(--ink)",
            borderRadius: "var(--radius-pill)",
            fontSize: 12,
            fontWeight: 500,
            backdropFilter: "blur(6px)",
            transition: "all 160ms var(--ease-out)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Icon name={selected ? "check" : "sparkles"} size={13} />
          {selected ? "Seçildi" : "Dene"}
        </button>
      </div>

      <div style={{ padding: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              letterSpacing: "-0.01em",
            }}
          >
            {product.name}
          </div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>₺{product.price}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 6,
            fontSize: 12,
            color: "var(--ink-muted)",
          }}
        >
          <span>{product.brand}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Icon name="star" size={11} /> {product.rating}
          </span>
        </div>
      </div>
    </div>
  );
}

type ChipProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 13px",
        marginRight: 6,
        marginBottom: 6,
        fontSize: 12,
        fontWeight: 500,
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--cream)" : "var(--ink)",
        border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`,
        borderRadius: "var(--radius-pill)",
        transition: "all 160ms var(--ease-out)",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
