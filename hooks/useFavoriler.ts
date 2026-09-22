"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useFavoriler() {
  const [favoriler, setFavoriler] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await fetch("/api/favoriler");
        if (r.ok) {
          const d = await r.json();
          setFavoriler(d.favoriler ?? []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggle = useCallback(async (productId: string) => {
    const varMi = favoriler.includes(productId);
    // Optimistic
    setFavoriler((prev) =>
      varMi ? prev.filter((x) => x !== productId) : [...prev, productId]
    );
    try {
      const r = await fetch("/api/favoriler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action: varMi ? "remove" : "add" }),
      });
      if (!r.ok) throw new Error();
      toast.success(varMi ? "Favorilerden çıkarıldı" : "Favorilere eklendi");
    } catch {
      // Rollback
      setFavoriler((prev) =>
        varMi ? [...prev, productId] : prev.filter((x) => x !== productId)
      );
      toast.error("İşlem başarısız");
    }
  }, [favoriler]);

  return { favoriler, loading, toggle };
}
