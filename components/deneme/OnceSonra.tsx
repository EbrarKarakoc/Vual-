"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import stil from "./DenemePaneli.module.css";

type Props = { once: string; sonra: string };

/** Parmakla sağa sola çekilen önce/sonra karşılaştırması. */
export function OnceSonra({ once, sonra }: Props) {
  const kutu = useRef<HTMLDivElement>(null);
  const [yuzde, setYuzde] = useState(50);
  const [oran, setOran] = useState<number | null>(null);

  const konumla = (e: PointerEvent) => {
    const r = kutu.current!.getBoundingClientRect();
    setYuzde(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
  };

  const klavye = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") setYuzde((y) => Math.max(0, y - 5));
    if (e.key === "ArrowRight") setYuzde((y) => Math.min(100, y + 5));
  };

  return (
    <div
      ref={kutu}
      className={stil.karsilastir}
      style={{ aspectRatio: oran ?? undefined }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        konumla(e);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) konumla(e);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sonra}
        alt="Deneme sonucu"
        draggable={false}
        onLoad={(e) => setOran(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
      />
      <div className={stil.once} style={{ clipPath: `inset(0 ${100 - yuzde}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={once} alt="Yüklediğin fotoğraf" draggable={false} />
      </div>
      <div
        className={stil.tutamac}
        style={{ left: `${yuzde}%` }}
        role="slider"
        tabIndex={0}
        aria-label="Önce ve sonra karşılaştırması"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(yuzde)}
        onKeyDown={klavye}
      >
        <span aria-hidden="true">‹ ›</span>
      </div>
      <span className={stil.yzEtiketi}>Yapay zekâ ile oluşturuldu</span>
      <span className={`vu-label ${stil.taraf} ${stil.sol}`}>Önce</span>
      <span className={`vu-label ${stil.taraf} ${stil.sag}`}>Sonra</span>
    </div>
  );
}
