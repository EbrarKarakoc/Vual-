import type { CSSProperties } from "react";
import { Foto, type Ton } from "../Foto";
import stil from "./ModelSeridi.module.css";

// Farklı boy ve hizalarda dikey fotoğraflar; şerit kendini tekrar ettiği
// için liste iki kez basılır ve animasyon -%50'de başa sarar.
const MODELLER: { yukseklik: number; hiza: "flex-start" | "flex-end" | "center"; ton: Ton }[] = [
  { yukseklik: 260, hiza: "flex-start", ton: "" },
  { yukseklik: 200, hiza: "flex-end", ton: "t-rose" },
  { yukseklik: 300, hiza: "center", ton: "t-cream" },
  { yukseklik: 220, hiza: "flex-start", ton: "t-rasp" },
  { yukseklik: 270, hiza: "flex-end", ton: "t-wine" },
  { yukseklik: 210, hiza: "center", ton: "t-deep" },
  { yukseklik: 290, hiza: "flex-start", ton: "" },
  { yukseklik: 240, hiza: "flex-end", ton: "t-cream" },
];

export function ModelSeridi() {
  const seri = [...MODELLER, ...MODELLER];
  return (
    <div className={stil.pist} aria-hidden="true">
      <div className={stil.serit}>
        {seri.map((m, i) => (
          <Foto
            key={i}
            ton={m.ton}
            figur
            className={stil.model}
            style={{ "--h": m.yukseklik, alignSelf: m.hiza } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
