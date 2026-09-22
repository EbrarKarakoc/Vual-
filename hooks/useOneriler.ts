"use client";

import { useCallback, useEffect, useState } from "react";
import type { Urun } from "@/types/urun";

export function useOneriler(initialLimit = 20) {
  const [havuz, setHavuz] = useState<Urun[]>([]);
  const [gosterim, setGosterim] = useState(5);
  const [loading, setLoading] = useState(false);

  const getir = useCallback(async (limit = initialLimit) => {
    setLoading(true);
    try {
      const r = await fetch("/api/oneriler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit }),
      });
      if (r.ok) {
        const d = await r.json();
        setHavuz(d.urunler ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [initialLimit]);

  useEffect(() => {
    getir();
  }, [getir]);

  const dahaFazla = useCallback(() => {
    setGosterim((x) => Math.min(x + 5, havuz.length));
  }, [havuz.length]);

  return {
    urunler: havuz.slice(0, gosterim),
    tumHavuz: havuz,
    dahaFazla,
    loading,
    bitis: gosterim >= havuz.length,
  };
}
