import type { CSSProperties } from "react";

const TONLAR = ["", "t-rose", "t-cream", "t-rasp", "t-wine", "t-deep"] as const;
export type Ton = (typeof TONLAR)[number];

/** Aynı ürün her yerde aynı tonda görünsün diye tonu kimlikten türetir. */
export function tonSec(anahtar: string): Ton {
  let h = 0;
  for (const c of anahtar) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TONLAR[h % TONLAR.length];
}

type Props = {
  /** Gerçek görsel. Yoksa marka renginde yer tutucu gösterilir. */
  src?: string;
  alt?: string;
  ton?: Ton;
  oran?: "45" | "23" | "34" | "11";
  /** Yer tutucuda silik bir başörtülü figür çizer (model fotoğrafları için). */
  figur?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Foto({ src, alt = "", ton = "", oran, figur, className = "", style }: Props) {
  const sinif = ["vu-ph", "vu-zoom", ton, oran && `r-${oran}`, className].filter(Boolean).join(" ");
  return (
    <span className={sinif} style={style} role={src ? undefined : "presentation"}>
      <i>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} loading="lazy" />
        ) : (
          figur && <span className="fig" />
        )}
      </i>
    </span>
  );
}
