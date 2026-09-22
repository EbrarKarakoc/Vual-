"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ExternalLink, Sparkles } from "lucide-react";

export default function UrunDetay() {
  const { slug } = useParams<{ slug: string }>();
  const i = Number(slug?.toString().replace("urun-", "")) || 1;
  const product = {
    slug,
    name: `Zarif Şal ${i}`,
    colorHex: "#2D6A4F",
    colorName: "Zümrüt Yeşili",
    fabricType: "sifon",
    brand: "Nur Moda",
    price: 149 + i * 10,
    currency: "TRY",
    imageUrls: [
      `https://picsum.photos/seed/sal${i}/800/1000`,
      `https://picsum.photos/seed/sal${i}b/800/1000`,
    ],
    affiliateUrl: "https://example.com",
    description:
      "Yumuşak şifon kumaşıyla günlük kullanıma uygun, zarif bir başörtüsü.",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex gap-3 overflow-x-auto md:flex-col">
          {product.imageUrls.map((src, idx) => (
            <div key={idx} className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-black/5 flex-shrink-0">
              <Image src={src} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          ))}
        </div>

        <div>
          {product.brand && (
            <p className="text-sm text-black/50 mb-1">{product.brand}</p>
          )}
          <h1 className="font-serif text-3xl mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: product.colorHex }} />
            <span className="text-sm">{product.colorName}</span>
            <span className="text-black/30">·</span>
            <span className="text-sm capitalize">{product.fabricType}</span>
          </div>
          <p className="text-2xl font-bold mb-5">{formatPrice(product.price, product.currency)}</p>
          <p className="text-black/70 mb-6">{product.description}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/dene?productId=${slug}`} className="flex-1">
              <Button size="lg" className="w-full">
                <Sparkles className="w-4 h-4" /> Bu Başörtüyü Dene
              </Button>
            </Link>
            <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="lg" variant="outline" className="w-full">
                Satın Al <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="font-serif text-2xl mb-4">Benzer Ürünler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <Link key={n} href={`/katalog/urun-${n + 5}`}>
              <div className="rounded-xl bg-white shadow-soft overflow-hidden">
                <div className="relative aspect-[3/4]">
                  <Image src={`https://picsum.photos/seed/sim${n}/400/500`} alt="Benzer ürün" fill className="object-cover" sizes="25vw" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">Zarif Şal {n + 5}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
