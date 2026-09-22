"use client";

import { Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SABLON_TIPLERI } from "@/lib/sabitler";

export interface Sablon {
  id: string;
  templateType: string;
  imageUrl: string;
}

export function SablonSecici({
  templates,
  selected,
  onSelect,
}: {
  templates: Sablon[];
  selected: string[];
  onSelect: (id: string) => void;
}) {
  function tikla(id: string) {
    const secili = selected.includes(id);
    if (!secili && selected.length >= 2) {
      toast.warning("En fazla 2 şablon seçebilirsin.");
      return;
    }
    onSelect(id);
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {templates.map((t) => {
        const tip = SABLON_TIPLERI.find((x) => x.id === t.templateType);
        const secili = selected.includes(t.id);
        return (
          <button
            key={t.id}
            onClick={() => tikla(t.id)}
            className={cn(
              "relative rounded-xl overflow-hidden bg-white border-2 transition-all text-left",
              secili ? "border-emerald-600" : "border-transparent hover:border-black/10"
            )}
            aria-pressed={secili}
          >
            <div className="relative aspect-[3/4] bg-cream">
              {t.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.imageUrl} alt={tip?.ad ?? t.templateType} className="w-full h-full object-cover" />
              )}
              {secili && (
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="font-medium text-sm">{tip?.ad ?? t.templateType}</p>
              <p className="text-xs text-black/50">{tip?.aciklama}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
