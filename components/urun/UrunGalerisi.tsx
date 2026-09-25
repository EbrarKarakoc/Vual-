"use client";

import { useRef, useState } from "react";
import { Foto, tonSec, type Ton } from "../Foto";
import stil from "./UrunGalerisi.module.css";

type Props = { urunId: string; ad: string; gorseller: string[] };

// Görseli olmayan (sahte) ürünlerde galeri yine üç kare gösterir.
const YER_TUTUCU_SAYISI = 3;

export function UrunGalerisi({ urunId, ad, gorseller }: Props) {
  const serit = useRef<HTMLDivElement>(null);
  const [aktif, setAktif] = useState(0);

  const ilkTon = tonSec(urunId);
  const kareler: { src?: string; ton: Ton }[] = gorseller.length
    ? gorseller.map((src) => ({ src, ton: ilkTon }))
    : Array.from({ length: YER_TUTUCU_SAYISI }, (_, i) => ({ ton: tonSec(`${urunId}-${i}`) }));

  const kaydirildi = () => {
    const el = serit.current;
    if (el) setAktif(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className={stil.galeri}>
      <div ref={serit} className={stil.serit} onScroll={kaydirildi}>
        {kareler.map((k, i) => (
          <Foto key={i} src={k.src} alt={`${ad}, fotoğraf ${i + 1}`} ton={k.ton} oran="45" className={stil.kare} />
        ))}
      </div>
      {kareler.length > 1 && (
        <div className={stil.noktalar} aria-hidden="true">
          {kareler.map((_, i) => (
            <i key={i} className={i === aktif ? stil.acik : undefined} />
          ))}
        </div>
      )}
    </div>
  );
}
