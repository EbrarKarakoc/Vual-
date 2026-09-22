"use client";

import { UrunGrid } from "@/components/katalog/UrunGrid";
import { DahaFazlaYukle } from "./DahaFazlaYukle";
import { useOneriler } from "@/hooks/useOneriler";
import { Skeleton } from "@/components/ui/skeleton";

export function KisiselVitrin() {
  const { urunler, dahaFazla, loading, bitis } = useOneriler();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4]" />
        ))}
      </div>
    );
  }

  if (urunler.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
        <p className="font-medium">Henüz yeterli etkileşiminiz yok.</p>
        <p className="text-sm text-black/60">
          Kataloğa göz atarak beğendiklerinizi kaydedin.
        </p>
      </div>
    );
  }

  return (
    <div>
      <UrunGrid products={urunler} />
      {!bitis && (
        <div className="mt-8 text-center">
          <DahaFazlaYukle onClick={dahaFazla} />
        </div>
      )}
    </div>
  );
}
