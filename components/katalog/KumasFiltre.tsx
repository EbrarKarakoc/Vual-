"use client";

import { KUMASLAR } from "@/lib/sabitler";
import { useFiltre } from "@/hooks/useFiltre";
import { cn } from "@/lib/utils";

export function KumasFiltre() {
  const { filtre, setFiltre } = useFiltre();
  return (
    <div>
      <h3 className="font-medium mb-3">Kumaş</h3>
      <div className="flex flex-wrap gap-2">
        {KUMASLAR.map((k) => {
          const secili = filtre.kumas === k.deger;
          return (
            <button
              key={k.deger}
              onClick={() => setFiltre({ kumas: secili ? undefined : k.deger })}
              className={cn(
                "px-3 py-2 rounded-xl border text-sm transition-colors",
                secili ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-black/10 hover:border-black/20"
              )}
              aria-pressed={secili}
            >
              {k.ad}
            </button>
          );
        })}
      </div>
    </div>
  );
}
