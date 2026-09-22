"use client";

import { RENKLER } from "@/lib/sabitler";
import { useFiltre } from "@/hooks/useFiltre";
import { cn } from "@/lib/utils";

export function RenkFiltre() {
  const { filtre, setFiltre } = useFiltre();
  return (
    <div>
      <h3 className="font-medium mb-3">Renk</h3>
      <div className="flex flex-wrap gap-2">
        {RENKLER.map((r) => {
          const secili = filtre.renk === r.deger;
          return (
            <button
              key={r.deger}
              onClick={() => setFiltre({ renk: secili ? undefined : r.deger })}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors",
                secili ? "border-emerald-600 bg-emerald-50" : "border-black/10 hover:border-black/20"
              )}
              aria-pressed={secili}
            >
              <span
                className="w-4 h-4 rounded-full border border-black/10"
                style={{ backgroundColor: r.hex }}
              />
              {r.ad}
            </button>
          );
        })}
      </div>
    </div>
  );
}
