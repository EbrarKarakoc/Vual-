"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ALL_PRODUCTS, type StudioProduct } from "@/lib/studio-data";
import { ProductCard } from "@/components/studio/ProductCard";
import { ProductModal, BuyModal } from "@/components/studio/Modals";
import { Icon } from "@/components/studio/Icon";
import { useStudio } from "@/components/studio/StudioProvider";

export default function FavorilerimPage() {
  const router = useRouter();
  const { favorites, toggleFav, selected, toggleSelect } = useStudio();
  const [modalProduct, setModalProduct] = useState<StudioProduct | null>(null);
  const [buyProduct, setBuyProduct] = useState<StudioProduct | null>(null);

  const favProducts = ALL_PRODUCTS.filter((p) => favorites.includes(p.id));

  if (favProducts.length === 0) {
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
          <Icon name="heart" size={26} />
        </div>
        <h2 style={{ fontSize: 32, marginBottom: 12 }}>Henüz favorin yok</h2>
        <p style={{ color: "var(--ink-soft)", marginBottom: 28 }}>
          Katalogda beğendiklerini kalbe tıklayarak burada topla.
        </p>
        <button
          className="app-btn app-btn-primary"
          onClick={() => router.push("/katalog")}
        >
          Kataloğa git <Icon name="arrow-right" size={15} />
        </button>
      </div>
    );
  }

  const modalSelected = modalProduct
    ? selected.some((s) => s.id === modalProduct.id)
    : false;
  const modalFav = modalProduct ? favorites.includes(modalProduct.id) : false;

  return (
    <div
      style={{
        maxWidth: 1320,
        margin: "0 auto",
        padding: "clamp(36px, 5vh, 56px) clamp(20px, 4vw, 48px) 80px",
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 14 }}>
        FAVORİLER · {favProducts.length}
      </div>
      <h1
        style={{
          fontSize: "clamp(36px, 4.6vw, 60px)",
          lineHeight: 1.05,
          fontWeight: 300,
          letterSpacing: "-0.02em",
          marginBottom: 32,
        }}
      >
        Beğendiklerin <span style={{ fontStyle: "italic" }}>bir arada.</span>
      </h1>
      <div className="catalog-masonry">
        {favProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            selected={selected.some((s) => s.id === p.id)}
            fav
            onSelect={() => toggleSelect(p)}
            onOpen={() => setModalProduct(p)}
            onFav={() => toggleFav(p.id)}
          />
        ))}
      </div>

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
