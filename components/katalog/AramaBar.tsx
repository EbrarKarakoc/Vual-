"use client";

import { Search } from "lucide-react";
import { useFiltre } from "@/hooks/useFiltre";
import { useEffect, useState } from "react";

export function AramaBar() {
  const { filtre, setFiltre } = useFiltre();
  const [val, setVal] = useState(filtre.arama ?? "");

  useEffect(() => {
    const t = setTimeout(() => setFiltre({ arama: val || undefined }), 300);
    return () => clearTimeout(t);
  }, [val]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
      <input
        type="search"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Başörtü ara…"
        aria-label="Ürün ara"
        className="w-full h-11 pl-10 pr-4 rounded-xl border border-black/10 bg-white text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      />
    </div>
  );
}
