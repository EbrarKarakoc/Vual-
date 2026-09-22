"use client";

import { useCallback, useRef, useState } from "react";
import type { TryOnDurum } from "@/types/fashn";

export function useTryOn() {
  const [durum, setDurum] = useState<TryOnDurum>("idle");
  const [sonuc, setSonuc] = useState<string[] | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dene = useCallback(
    async (productImageUrl: string, templateId: string) => {
      setDurum("queued");
      setSonuc(null);
      setHata(null);

      try {
        const res = await fetch("/api/tryon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productImageUrl, templateId }),
        });
        if (!res.ok) throw new Error("Deneme başlatılamadı");
        const { id } = await res.json();

        setDurum("processing");
        const baslangic = Date.now();

        const poll = async (): Promise<void> => {
          if (Date.now() - baslangic > 90_000) {
            setDurum("error");
            setHata("Zaman aşımı");
            return;
          }
          const r = await fetch(`/api/tryon/${id}`);
          const d = await r.json();
          if (d.status === "completed") {
            setSonuc(d.output ?? []);
            setDurum("completed");
            return;
          }
          if (d.status === "failed") {
            setDurum("error");
            setHata(d.error ?? "Deneme başarısız");
            return;
          }
          timerRef.current = setTimeout(poll, 1500);
        };

        await poll();
      } catch (e: any) {
        setDurum("error");
        setHata(e.message);
      }
    },
    []
  );

  const sifirla = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDurum("idle");
    setSonuc(null);
    setHata(null);
  }, []);

  return { durum, sonuc, hata, dene, sifirla };
}
