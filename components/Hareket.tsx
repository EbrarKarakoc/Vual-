"use client";

import { useEffect } from "react";

const SECICI = ".vu-reveal:not(.in), .vu-words:not(.in)";

/**
 * Sayfadaki .vu-reveal ve .vu-words öğelerini ekrana girince görünür yapar.
 * Sayfa değiştikçe ya da arama sonuçları yenilendikçe yeni öğeler DOM'a
 * eklendiği için MutationObserver ile onları da yakalar.
 */
export function Hareket() {
  useEffect(() => {
    const azalt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (azalt || !("IntersectionObserver" in window)) {
      const hepsiniAc = () => document.querySelectorAll(SECICI).forEach((el) => el.classList.add("in"));
      hepsiniAc();
      const mo = new MutationObserver(hepsiniAc);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (girdiler) => {
        for (const g of girdiler) {
          if (g.isIntersecting) {
            g.target.classList.add("in");
            io.unobserve(g.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    const tara = () => document.querySelectorAll(SECICI).forEach((el) => io.observe(el));
    tara();
    const mo = new MutationObserver(tara);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
