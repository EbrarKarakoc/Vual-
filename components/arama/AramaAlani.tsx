"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { linkMi } from "@/lib/link";
import stil from "./AramaAlani.module.css";

const ONERILER = ["pudra şifon şal", "desenli eşarp", "bordo pamuk şal", "çiçek desenli"];

type Props = {
  baslangic?: string;
  /** buyuk: arama sayfasının ortasındaki alan, öneriler ile. kucuk: sonuçların üstünde. */
  boyut: "buyuk" | "kucuk";
};

export function AramaAlani({ baslangic = "", boyut }: Props) {
  const router = useRouter();
  const [metin, setMetin] = useState(baslangic);
  const link = linkMi(metin);

  const ara = (q: string) => {
    const temiz = q.trim();
    if (temiz) router.push(`/ara?q=${encodeURIComponent(temiz)}`);
  };

  const gonder = (e: FormEvent) => {
    e.preventDefault();
    ara(metin);
  };

  const sinif = ["vu-search", boyut === "buyuk" ? "is-big" : "is-small", link && "is-link"]
    .filter(Boolean)
    .join(" ");

  return (
    <form role="search" onSubmit={gonder} className={boyut === "buyuk" ? stil.buyuk : stil.kucuk}>
      <label className={sinif}>
        <span className="vu-gizli">Ara</span>
        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          value={metin}
          onChange={(e) => setMetin(e.target.value)}
          placeholder="Bir tarz yaz ya da beğendiğin şalın linkini yapıştır"
          autoFocus={boyut === "buyuk"}
        />
        <button className="go" type="submit">
          Bu ürünü bul
        </button>
      </label>
      {boyut === "buyuk" && (
        <>
          <p className={`vu-small vu-muted ${stil.ipucu}`} aria-live="polite">
            {link ? "Link algılandı. Ürünü bulup benzerlerini göstereceğiz." : " "}
          </p>
          <div className={`vu-chips ${stil.oneriler}`}>
            {ONERILER.map((o) => (
              <button key={o} type="button" className="vu-chip" onClick={() => ara(o)}>
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </form>
  );
}
