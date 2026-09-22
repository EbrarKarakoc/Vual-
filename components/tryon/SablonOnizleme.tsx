"use client";

import { SABLON_TIPLERI } from "@/lib/sabitler";

export function SablonOnizleme({
  templates,
}: {
  templates: { id: string; templateType: string; imageUrl: string }[];
}) {
  if (!templates.length)
    return (
      <div className="text-sm text-black/60 p-4 bg-cream rounded-xl">
        Henüz şablon seçmedin.
      </div>
    );
  return (
    <div className="flex gap-3 overflow-x-auto">
      {templates.map((t) => {
        const tip = SABLON_TIPLERI.find((x) => x.id === t.templateType);
        return (
          <div key={t.id} className="rounded-xl overflow-hidden bg-white shadow-soft w-32 flex-shrink-0">
            <div className="aspect-[3/4] bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.imageUrl} alt={tip?.ad} className="w-full h-full object-cover" />
            </div>
            <p className="text-xs font-medium p-2 text-center">{tip?.ad}</p>
          </div>
        );
      })}
    </div>
  );
}
