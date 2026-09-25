"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  /**
   * paralaks: içerik sayfadan ~0.85 hızla kayar.
   * buyume: öğe ekrana girdikçe --p değişkeni 0'dan 1'e çıkar (CSS çerçeveyi büyütür).
   */
  tur: "paralaks" | "buyume";
  className?: string;
  children: ReactNode;
};

/**
 * Kaydırmaya bağlı efektler sadece masaüstünde çalışır; mobilde ve "hareketi
 * azalt" açıkken hiçbir şey yapmaz (tasarım sistemi: mobilde sadece
 * belirme ve şerit).
 */
export function KaydirmaEtkisi({ tur, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const masaustu = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    let kare = 0;

    const guncelle = () => {
      kare = 0;
      if (!masaustu.matches) {
        el.style.removeProperty("transform");
        el.style.removeProperty("--p");
        return;
      }
      const kutu = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (tur === "paralaks") {
        if (kutu.bottom < 0) return;
        el.style.transform = `translate3d(0, ${window.scrollY * 0.15}px, 0)`;
      } else {
        const p = Math.min(1, Math.max(0, 1 - kutu.top / vh));
        el.style.setProperty("--p", p.toFixed(3));
      }
    };
    const planla = () => {
      if (!kare) kare = requestAnimationFrame(guncelle);
    };

    guncelle();
    window.addEventListener("scroll", planla, { passive: true });
    window.addEventListener("resize", planla);
    masaustu.addEventListener("change", planla);
    return () => {
      cancelAnimationFrame(kare);
      window.removeEventListener("scroll", planla);
      window.removeEventListener("resize", planla);
      masaustu.removeEventListener("change", planla);
    };
  }, [tur]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
