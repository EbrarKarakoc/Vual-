"use client";

import { UrunGrid } from "@/components/katalog/UrunGrid";
import type { Urun } from "@/types/urun";

export function FavoriListesi({ productIds }: { productIds: string[] }) {
  // Mock: gerçek API ile değiştirilecek
  const urunler: Urun[] = productIds.map((id, i) => ({
    id,
    slug: `urun-${id}`,
    name: `Favori Şal ${i + 1}`,
    colorHex: "#2D6A4F",
    colorName: "Zümrüt",
    fabricType: "sifon",
    style: "klasik",
    price: 199,
    currency: "TRY",
    imageUrls: [`https://picsum.photos/seed/fav${id}/600/800`],
    affiliateUrl: "#",
    inStock: true,
  }));

  return <UrunGrid products={urunler} />;
}
