"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  /**
   * foto: ana sayfada tam ekran fotoğrafın üstünde, pudra renkte ve saydam;
   * kaydırınca kompaktlaşır. sade: açık zeminde saydam, kaydırınca kompakt.
   * kompakt: her zaman kompakt.
   */
  tur?: "foto" | "sade" | "kompakt";
};

export function UstCubuk({ tur = "kompakt" }: Props) {
  const [kaydirildi, setKaydirildi] = useState(false);

  useEffect(() => {
    if (tur === "kompakt") return;
    const guncelle = () => setKaydirildi(window.scrollY > 40);
    guncelle();
    window.addEventListener("scroll", guncelle, { passive: true });
    return () => window.removeEventListener("scroll", guncelle);
  }, [tur]);

  const kompakt = tur === "kompakt" || kaydirildi;
  const sinif = ["vu-bar", tur === "foto" && "on-photo", kompakt && "is-compact"]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={sinif}>
      <Link className="vu-logo" href="/">
        Vualà
      </Link>
      <Link className="vu-iconbtn" href="/ara" aria-label="Ara">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 21 21" />
        </svg>
      </Link>
    </header>
  );
}
