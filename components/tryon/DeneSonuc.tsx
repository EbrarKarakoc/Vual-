"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Repeat } from "lucide-react";

export function DeneSonuc({
  sablonUrl,
  sonucUrl,
  affiliateUrl,
}: {
  sablonUrl: string;
  sonucUrl: string;
  affiliateUrl?: string;
}) {
  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-cream">
          <Image src={sablonUrl} alt="Orijinal şablon" fill className="object-cover" sizes="50vw" />
          <span className="absolute top-2 left-2 text-xs bg-white/90 rounded-full px-2 py-1">Önce</span>
        </div>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-cream">
          <Image src={sonucUrl} alt="Deneme sonucu" fill className="object-cover" sizes="50vw" />
          <span className="absolute top-2 left-2 text-xs bg-emerald-600 text-white rounded-full px-2 py-1">Sonra</span>
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        {affiliateUrl && (
          <a href={affiliateUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button size="lg" className="w-full">
              Beğendim → Satın Al <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        )}
        <Link href="/katalog" className="flex-1">
          <Button size="lg" variant="outline" className="w-full">
            <Repeat className="w-4 h-4" /> Başka Dene
          </Button>
        </Link>
      </div>
    </div>
  );
}
