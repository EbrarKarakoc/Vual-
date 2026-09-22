"use client";

import { useRouter } from "next/navigation";
import { UrunKarti } from "./UrunKarti";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavoriler } from "@/hooks/useFavoriler";
import type { Urun } from "@/types/urun";

export function UrunGrid({ products, loading }: { products: Urun[]; loading?: boolean }) {
  const router = useRouter();
  const { favoriler, toggle } = useFavoriler();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4]" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-16 text-black/60">
        <p className="mb-1 font-medium">Sonuç bulunamadı</p>
        <p className="text-sm">Filtreleri değiştirerek tekrar dene.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <UrunKarti
          key={p.id}
          product={p}
          isFavorited={favoriler.includes(p.id)}
          onFavori={() => toggle(p.id)}
          onDene={() => router.push(`/dene?productId=${p.id}`)}
        />
      ))}
    </div>
  );
}
