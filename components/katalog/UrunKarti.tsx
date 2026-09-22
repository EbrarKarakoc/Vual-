"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";
import type { Urun } from "@/types/urun";

export function UrunKarti({
  product,
  onDene,
  onFavori,
  isFavorited,
}: {
  product: Urun;
  onDene?: () => void;
  onFavori?: () => void;
  isFavorited?: boolean;
}) {
  return (
    <div className="group rounded-xl bg-white shadow-soft hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      <Link href={`/katalog/${product.slug}`} className="block relative aspect-[3/4] bg-black/5">
        {product.imageUrls?.[0] && (
          <Image
            src={product.imageUrls[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        )}
        <button
          type="button"
          aria-label={isFavorited ? "Favoriden çıkar" : "Favoriye ekle"}
          onClick={(e) => {
            e.preventDefault();
            onFavori?.();
          }}
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white"
        >
          <Heart
            className={cn(
              "w-4 h-4",
              isFavorited ? "fill-red-500 text-red-500" : "text-ink"
            )}
          />
        </button>
      </Link>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full border border-black/10"
            style={{ backgroundColor: product.colorHex }}
            aria-label={product.colorName}
          />
          <span className="text-xs text-black/50 truncate">{product.colorName}</span>
        </div>
        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="font-bold text-ink">{formatPrice(product.price, product.currency)}</span>
          <Button size="sm" onClick={onDene}>Dene</Button>
        </div>
      </div>
    </div>
  );
}
