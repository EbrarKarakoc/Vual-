"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { UrunFiltre } from "@/types/urun";

export function useFiltre() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filtre: UrunFiltre = useMemo(
    () => ({
      renk: params.get("renk") ?? undefined,
      kumas: params.get("kumas") ?? undefined,
      stil: params.get("stil") ?? undefined,
      minFiyat: params.get("minFiyat") ? Number(params.get("minFiyat")) : undefined,
      maxFiyat: params.get("maxFiyat") ? Number(params.get("maxFiyat")) : undefined,
      arama: params.get("arama") ?? undefined,
    }),
    [params]
  );

  const setFiltre = useCallback(
    (yeni: Partial<UrunFiltre>) => {
      const p = new URLSearchParams(params.toString());
      Object.entries(yeni).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") p.delete(k);
        else p.set(k, String(v));
      });
      router.replace(`${pathname}?${p.toString()}`, { scroll: false });
    },
    [params, pathname, router]
  );

  const temizle = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { filtre, setFiltre, temizle };
}
