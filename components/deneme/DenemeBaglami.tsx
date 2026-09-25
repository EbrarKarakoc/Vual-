"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type KullaniciFotografi = { src: string; genislik: number; yukseklik: number };

type Deger = {
  fotograf: KullaniciFotografi | null;
  fotografAyarla: (f: KullaniciFotografi | null) => void;
};

const Baglam = createContext<Deger | null>(null);

/**
 * Kullanıcının fotoğrafını, birden çok ürünü tekrar yüklemeden deneyebilsin
 * diye sadece sekme belleğinde tutar. localStorage'a, sessionStorage'a ya da
 * başka bir yere yazılmaz (K1): sayfa yenilenince fotoğraf gider.
 */
export function DenemeBaglami({ children }: { children: ReactNode }) {
  const [fotograf, fotografAyarla] = useState<KullaniciFotografi | null>(null);
  return <Baglam.Provider value={{ fotograf, fotografAyarla }}>{children}</Baglam.Provider>;
}

export function useDeneme(): Deger {
  const deger = useContext(Baglam);
  if (!deger) throw new Error("useDeneme, DenemeBaglami içinde kullanılmalı");
  return deger;
}
