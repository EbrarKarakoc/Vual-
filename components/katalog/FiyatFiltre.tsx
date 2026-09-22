"use client";

import { Input } from "@/components/ui/input";
import { useFiltre } from "@/hooks/useFiltre";

export function FiyatFiltre() {
  const { filtre, setFiltre } = useFiltre();
  return (
    <div>
      <h3 className="font-medium mb-3">Fiyat (TL)</h3>
      <div className="flex items-center gap-3">
        <Input
          type="number"
          placeholder="Min"
          value={filtre.minFiyat ?? ""}
          onChange={(e) => setFiltre({ minFiyat: e.target.value ? Number(e.target.value) : undefined })}
        />
        <span className="text-black/40">—</span>
        <Input
          type="number"
          placeholder="Max"
          value={filtre.maxFiyat ?? ""}
          onChange={(e) => setFiltre({ maxFiyat: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>
    </div>
  );
}
