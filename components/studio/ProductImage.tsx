"use client";

import { useState } from "react";
import { ScarfPlaceholder } from "./Placeholders";

type Props = {
  src: string;
  seed: number;
  alt?: string;
  aspect?: string;
  style?: React.CSSProperties;
  className?: string;
};

/**
 * Ürün görselini `src` üzerinden yükler. Yükleme başarısız olursa otomatik
 * olarak `ScarfPlaceholder` SVG'sine düşer — böylece network sorununda veya
 * görsel kaynağı değişince kullanıcı boş bir kart görmez.
 */
export function ProductImage({
  src,
  seed,
  alt = "",
  aspect,
  style,
  className,
}: Props) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error) {
    return (
      <ScarfPlaceholder
        seed={seed}
        aspect={aspect ?? "unset"}
        style={style}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: aspect ? undefined : "100%",
        aspectRatio: aspect,
        overflow: "hidden",
        background: "var(--bg-deep)",
        ...style,
      }}
    >
      {/* Yüklenirken alt katmanda abstract desen göster — hoş bir skeleton gibi */}
      {!loaded && (
        <div style={{ position: "absolute", inset: 0 }}>
          <ScarfPlaceholder seed={seed} aspect="unset" style={{ width: "100%", height: "100%" }} />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 300ms var(--ease-out)",
        }}
      />
    </div>
  );
}
